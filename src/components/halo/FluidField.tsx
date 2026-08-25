import { useEffect, useRef } from "react";
import { DISPLAY, DYE_ADVECT, LBM_INIT, LBM_STEP, SPLAT, VERT } from "@/lib/fluid-shaders";
import type { NebulaLook } from "@/lib/nebula";
import { cn } from "@/lib/utils";

type Fbo = { tex: WebGLTexture; fbo: WebGLFramebuffer; w: number; h: number };
type Double = { read: Fbo; write: Fbo; swap: () => void };
type Lattice = {
  fbo: WebGLFramebuffer;
  a: WebGLTexture;
  b: WebGLTexture;
  c: WebGLTexture;
  w: number;
  h: number;
};
type LatticePair = { read: Lattice; write: Lattice; swap: () => void };

type Params = {
  look: NebulaLook;
  density: number;
  swirl: number;
  stars: number;
};

export function FluidField({
  look,
  density,
  swirl,
  stars,
  className,
}: {
  look: NebulaLook;
  density: number;
  swirl: number;
  stars: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paramsRef = useRef<Params>({ look, density, swirl, stars });
  paramsRef.current = { look, density, swirl, stars };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    gl.getExtension("EXT_color_buffer_float");
    gl.getExtension("OES_texture_float_linear");
    gl.getExtension("EXT_float_blend");

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    if (!vs) return;
    const programs = {
      init: program(gl, vs, LBM_INIT),
      step: program(gl, vs, LBM_STEP),
      splat: program(gl, vs, SPLAT),
      dye: program(gl, vs, DYE_ADVECT),
      display: program(gl, vs, DISPLAY),
    };
    if (Object.values(programs).some((p) => !p)) return;

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const simW = 256;
    const simH = 256;
    const texel: [number, number] = [1 / simW, 1 / simH];
    const lattice = latticePair(gl, simW, simH);
    const dye = doubleFbo(gl, simW, simH);
    if (!lattice || !dye) return;

    const bindTex = (unit: number, tex: WebGLTexture) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
    };

    const blitMrt = (target: Lattice) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1, gl.COLOR_ATTACHMENT2]);
      gl.viewport(0, 0, target.w, target.h);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const blit = (target: Fbo | null) => {
      if (target) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        gl.viewport(0, 0, target.w, target.h);
      } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    gl.useProgram(programs.init!);
    blitMrt(lattice.write);
    lattice.swap();

    const splatDye = (x: number, y: number, color: [number, number, number], radius: number) => {
      const p = programs.splat!;
      gl.useProgram(p);
      gl.uniform1i(gl.getUniformLocation(p, "uTarget"), 0);
      gl.uniform2f(gl.getUniformLocation(p, "uPoint"), x, y);
      gl.uniform3f(gl.getUniformLocation(p, "uColor"), color[0], color[1], color[2]);
      gl.uniform1f(gl.getUniformLocation(p, "uRadius"), radius);
      gl.uniform2f(gl.getUniformLocation(p, "uAspect"), canvas.width / Math.max(canvas.height, 1), 1);
      bindTex(0, dye.read.tex);
      blit(dye.write);
      dye.swap();
    };

    const pointer = { x: 0.5, y: 0.5, px: 0.5, py: 0.5, moved: false };
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.px = pointer.x;
      pointer.py = pointer.y;
      pointer.x = (event.clientX - rect.left) / rect.width;
      pointer.y = 1 - (event.clientY - rect.top) / rect.height;
      pointer.moved = true;
    };
    const parent = canvas.parentElement;
    parent?.addEventListener("pointermove", onMove);
    parent?.addEventListener("pointerdown", onMove);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      const w = Math.max(1, canvas.clientWidth);
      const h = Math.max(1, canvas.clientHeight);
      const bw = Math.round(w * dpr);
      const bh = Math.round(h * dpr);
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const p0 = paramsRef.current;
    for (let i = 0; i < 8; i++) {
      const x = 0.22 + Math.random() * 0.56;
      const y = 0.22 + Math.random() * 0.56;
      const c = mix3(p0.look.mid, p0.look.hot, Math.random()).map((v) => v * (1.5 + p0.density)) as [
        number,
        number,
        number,
      ];
      splatDye(x, y, c, 0.004 + Math.random() * 0.01);
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let running = true;
    const start = performance.now();
    const loc = (p: WebGLProgram, name: string) => gl.getUniformLocation(p, name);

    const step = (now: number) => {
      if (!running) return;
      const t = (now - start) / 1000;
      const p = paramsRef.current;
      const omega = 0.95 + p.swirl * 0.5;
      const steps = reduced ? 1 : 2;

      let f0: [number, number] = [0, 0];
      if (pointer.moved) {
        f0 = [
          clamp((pointer.x - pointer.px) * 3.2 * p.density, -0.18, 0.18),
          clamp((pointer.y - pointer.py) * 3.2 * p.density, -0.18, 0.18),
        ];
        splatDye(pointer.x, pointer.y, scale3(p.look.hot, 1.4 * p.density), 0.0026);
        pointer.moved = false;
      }

      const phase = t * 0.32;
      const p1: [number, number] = [0.5 + Math.cos(phase) * 0.24, 0.5 + Math.sin(phase * 0.9) * 0.2];
      const p2: [number, number] = [0.5 + Math.cos(phase + 2.3) * 0.2, 0.48 + Math.sin(phase * 0.8 + 1.1) * 0.18];
      const f1: [number, number] = [-Math.sin(phase) * 0.035 * p.swirl, Math.cos(phase * 0.9) * 0.035 * p.swirl];
      const f2: [number, number] = [-Math.sin(phase + 2.3) * 0.028 * p.swirl, Math.cos(phase * 0.8 + 1.1) * 0.028 * p.swirl];

      if (!reduced && Math.sin(t * 1.4) > 0.6) {
        splatDye(p1[0], p1[1], scale3(p.look.mid, 0.1 * p.density), 0.004);
      }

      const stepP = programs.step!;
      gl.useProgram(stepP);
      gl.uniform1i(loc(stepP, "uA"), 0);
      gl.uniform1i(loc(stepP, "uB"), 1);
      gl.uniform1i(loc(stepP, "uC"), 2);
      gl.uniform2f(loc(stepP, "uTexel"), texel[0], texel[1]);
      gl.uniform1f(loc(stepP, "uOmega"), omega);
      gl.uniform2f(loc(stepP, "uAspect"), canvas.width / Math.max(canvas.height, 1), 1);
      gl.uniform2f(loc(stepP, "uP0"), pointer.x, pointer.y);
      gl.uniform2f(loc(stepP, "uF0"), f0[0], f0[1]);
      gl.uniform2f(loc(stepP, "uP1"), p1[0], p1[1]);
      gl.uniform2f(loc(stepP, "uF1"), f1[0], f1[1]);
      gl.uniform2f(loc(stepP, "uP2"), p2[0], p2[1]);
      gl.uniform2f(loc(stepP, "uF2"), f2[0], f2[1]);
      gl.uniform1f(loc(stepP, "uRadius"), 0.004);

      for (let i = 0; i < steps; i++) {
        bindTex(0, lattice.read.a);
        bindTex(1, lattice.read.b);
        bindTex(2, lattice.read.c);
        blitMrt(lattice.write);
        lattice.swap();
        if (i === 0) {
          gl.uniform2f(loc(stepP, "uF0"), 0, 0);
        }
      }

      const dyeP = programs.dye!;
      gl.useProgram(dyeP);
      gl.uniform1i(loc(dyeP, "uMacro"), 0);
      gl.uniform1i(loc(dyeP, "uSource"), 1);
      gl.uniform2f(loc(dyeP, "uTexel"), texel[0], texel[1]);
      gl.uniform1f(loc(dyeP, "uScale"), 14);
      gl.uniform1f(loc(dyeP, "uDissipation"), 0.985);
      bindTex(0, lattice.read.c);
      bindTex(1, dye.read.tex);
      blit(dye.write);
      dye.swap();

      const disp = programs.display!;
      gl.useProgram(disp);
      gl.uniform1i(loc(disp, "uDye"), 0);
      gl.uniform1i(loc(disp, "uMacro"), 1);
      gl.uniform2f(loc(disp, "u_res"), canvas.width, canvas.height);
      gl.uniform1f(loc(disp, "u_time"), t);
      gl.uniform3f(loc(disp, "u_sky"), p.look.sky[0], p.look.sky[1], p.look.sky[2]);
      gl.uniform3f(loc(disp, "u_hot"), p.look.hot[0], p.look.hot[1], p.look.hot[2]);
      gl.uniform1f(loc(disp, "u_stars"), p.stars);
      gl.uniform1f(loc(disp, "u_light"), p.look.tone === "light" ? 1 : 0);
      gl.uniform1f(loc(disp, "u_planet"), p.look.planet);
      bindTex(0, dye.read.tex);
      bindTex(1, lattice.read.c);
      blit(null);

      raf = requestAnimationFrame(step);
    };

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(step);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(step);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      parent?.removeEventListener("pointermove", onMove);
      parent?.removeEventListener("pointerdown", onMove);
      ro.disconnect();
      gl.deleteVertexArray(vao);
      gl.deleteShader(vs);
      for (const prog of Object.values(programs)) if (prog) gl.deleteProgram(prog);
      destroyLattice(gl, lattice.read);
      destroyLattice(gl, lattice.write);
      gl.deleteFramebuffer(dye.read.fbo);
      gl.deleteFramebuffer(dye.write.fbo);
      gl.deleteTexture(dye.read.tex);
      gl.deleteTexture(dye.write.tex);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
      aria-hidden="true"
    />
  );
}

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function mix3(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function scale3(a: [number, number, number], s: number): [number, number, number] {
  return [a[0] * s, a[1] * s, a[2] * s];
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function program(gl: WebGL2RenderingContext, vs: WebGLShader, fragSrc: string) {
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragSrc);
  if (!fs) return null;
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prog));
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

function makeTex(gl: WebGL2RenderingContext, w: number, h: number, wrap: number, filter: number) {
  const tex = gl.createTexture();
  if (!tex) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
  return tex;
}

function singleFbo(gl: WebGL2RenderingContext, w: number, h: number): Fbo | null {
  const tex = makeTex(gl, w, h, gl.CLAMP_TO_EDGE, gl.LINEAR);
  const fbo = gl.createFramebuffer();
  if (!tex || !fbo) return null;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  }
  return { tex, fbo, w, h };
}

function doubleFbo(gl: WebGL2RenderingContext, w: number, h: number): Double | null {
  const a = singleFbo(gl, w, h);
  const b = singleFbo(gl, w, h);
  if (!a || !b) return null;
  const pair: Double = { read: a, write: b, swap() {} };
  pair.swap = () => {
    const tmp = pair.read;
    pair.read = pair.write;
    pair.write = tmp;
  };
  return pair;
}

function makeLattice(gl: WebGL2RenderingContext, w: number, h: number): Lattice | null {
  const a = makeTex(gl, w, h, gl.REPEAT, gl.NEAREST);
  const b = makeTex(gl, w, h, gl.REPEAT, gl.NEAREST);
  const c = makeTex(gl, w, h, gl.REPEAT, gl.NEAREST);
  const fbo = gl.createFramebuffer();
  if (!a || !b || !c || !fbo) return null;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, a, 0);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, b, 0);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT2, gl.TEXTURE_2D, c, 0);
  gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1, gl.COLOR_ATTACHMENT2]);
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    console.error("LBM FBO incomplete");
    return null;
  }
  return { fbo, a, b, c, w, h };
}

function latticePair(gl: WebGL2RenderingContext, w: number, h: number): LatticePair | null {
  const a = makeLattice(gl, w, h);
  const b = makeLattice(gl, w, h);
  if (!a || !b) return null;
  const pair: LatticePair = { read: a, write: b, swap() {} };
  pair.swap = () => {
    const tmp = pair.read;
    pair.read = pair.write;
    pair.write = tmp;
  };
  return pair;
}

function destroyLattice(gl: WebGL2RenderingContext, lat: Lattice) {
  gl.deleteFramebuffer(lat.fbo);
  gl.deleteTexture(lat.a);
  gl.deleteTexture(lat.b);
  gl.deleteTexture(lat.c);
}
