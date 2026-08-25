export const VERT = `#version 300 es
const vec2 V[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
out vec2 vUv;
void main() {
  vec2 p = V[gl_VertexID];
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`;

export const LBM_INIT = `#version 300 es
precision highp float;
in vec2 vUv;
layout(location = 0) out vec4 outA;
layout(location = 1) out vec4 outB;
layout(location = 2) out vec4 outC;
void main() {
  const float w0 = 4.0 / 9.0;
  const float w1 = 1.0 / 9.0;
  const float w2 = 1.0 / 36.0;
  outA = vec4(w0, w1, w1, w1);
  outB = vec4(w1, w2, w2, w2);
  outC = vec4(w2, 1.0, 0.0, 0.0);
}`;

export const LBM_STEP = `#version 300 es
precision highp float;
in vec2 vUv;
layout(location = 0) out vec4 outA;
layout(location = 1) out vec4 outB;
layout(location = 2) out vec4 outC;
uniform sampler2D uA;
uniform sampler2D uB;
uniform sampler2D uC;
uniform vec2 uTexel;
uniform float uOmega;
uniform vec2 uAspect;
uniform vec2 uP0;
uniform vec2 uF0;
uniform vec2 uP1;
uniform vec2 uF1;
uniform vec2 uP2;
uniform vec2 uF2;
uniform float uRadius;

float gauss(vec2 point, float radius) {
  vec2 p = (vUv - point) * uAspect;
  return exp(-dot(p, p) / radius);
}

void main() {
  vec2 t = uTexel;
  float f0 = texture(uA, vUv).x;
  float f1 = texture(uA, vUv - vec2(t.x, 0.0)).y;
  float f2 = texture(uA, vUv + vec2(t.x, 0.0)).z;
  float f3 = texture(uA, vUv - vec2(0.0, t.y)).w;
  float f4 = texture(uB, vUv + vec2(0.0, t.y)).x;
  float f5 = texture(uB, vUv - t).y;
  float f6 = texture(uB, vUv + vec2(t.x, -t.y)).z;
  float f7 = texture(uB, vUv + vec2(-t.x, t.y)).w;
  float f8 = texture(uC, vUv + t).x;

  float rho = f0 + f1 + f2 + f3 + f4 + f5 + f6 + f7 + f8;
  rho = max(rho, 0.05);
  vec2 u = vec2(
    f1 - f2 + f5 - f6 + f7 - f8,
    f3 - f4 + f5 + f6 - f7 - f8
  ) / rho;

  u += uF0 * gauss(uP0, uRadius);
  u += uF1 * gauss(uP1, uRadius * 1.6);
  u += uF2 * gauss(uP2, uRadius * 1.6);

  float ulen = length(u);
  if (ulen > 0.22) u *= 0.22 / ulen;
  rho = clamp(rho, 0.4, 2.2);

  float usqr = 1.5 * dot(u, u);
  float eu;
  float feq;
  float omega = clamp(uOmega, 0.5, 1.9);

  feq = (4.0 / 9.0) * rho * (1.0 - usqr);
  f0 += omega * (feq - f0);

  eu = 3.0 * u.x;
  feq = (1.0 / 9.0) * rho * (1.0 + eu + 0.5 * eu * eu - usqr);
  f1 += omega * (feq - f1);
  eu = -3.0 * u.x;
  feq = (1.0 / 9.0) * rho * (1.0 + eu + 0.5 * eu * eu - usqr);
  f2 += omega * (feq - f2);
  eu = 3.0 * u.y;
  feq = (1.0 / 9.0) * rho * (1.0 + eu + 0.5 * eu * eu - usqr);
  f3 += omega * (feq - f3);
  eu = -3.0 * u.y;
  feq = (1.0 / 9.0) * rho * (1.0 + eu + 0.5 * eu * eu - usqr);
  f4 += omega * (feq - f4);

  eu = 3.0 * (u.x + u.y);
  feq = (1.0 / 36.0) * rho * (1.0 + eu + 0.5 * eu * eu - usqr);
  f5 += omega * (feq - f5);
  eu = 3.0 * (-u.x + u.y);
  feq = (1.0 / 36.0) * rho * (1.0 + eu + 0.5 * eu * eu - usqr);
  f6 += omega * (feq - f6);
  eu = 3.0 * (u.x - u.y);
  feq = (1.0 / 36.0) * rho * (1.0 + eu + 0.5 * eu * eu - usqr);
  f7 += omega * (feq - f7);
  eu = 3.0 * (-u.x - u.y);
  feq = (1.0 / 36.0) * rho * (1.0 + eu + 0.5 * eu * eu - usqr);
  f8 += omega * (feq - f8);

  outA = vec4(f0, f1, f2, f3);
  outB = vec4(f4, f5, f6, f7);
  outC = vec4(f8, rho, u.x, u.y);
}`;

export const SPLAT = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uTarget;
uniform vec2 uPoint;
uniform vec3 uColor;
uniform float uRadius;
uniform vec2 uAspect;
void main() {
  vec2 p = (vUv - uPoint) * uAspect;
  vec3 splat = exp(-dot(p, p) / uRadius) * uColor;
  fragColor = texture(uTarget, vUv) + vec4(splat, 0.0);
}`;

export const DYE_ADVECT = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uMacro;
uniform sampler2D uSource;
uniform vec2 uTexel;
uniform float uScale;
uniform float uDissipation;
void main() {
  vec2 vel = texture(uMacro, vUv).zw;
  vec2 coord = vUv - vel * uTexel * uScale;
  fragColor = uDissipation * texture(uSource, coord);
}`;

export const DISPLAY = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uDye;
uniform sampler2D uMacro;
uniform vec2 u_res;
uniform float u_time;
uniform vec3 u_sky;
uniform vec3 u_hot;
uniform float u_stars;
uniform float u_light;
uniform float u_planet;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  vec3 dye = texture(uDye, vUv).rgb;
  dye = dye / (dye + vec3(0.85));
  float rho = texture(uMacro, vUv).y;
  vec3 col = u_sky + dye * mix(1.05, 0.72, u_light);
  col += u_hot * max(rho - 1.0, 0.0) * 0.08;
  float luma = dot(col, vec3(0.299, 0.587, 0.114));
  col *= mix(1.0, 0.78, smoothstep(0.72, 1.05, luma));

  float s = hash(floor(gl_FragCoord.xy * 0.85));
  float tw = 0.55 + 0.45 * sin(u_time * (1.6 + s * 5.0) + s * 18.0);
  float star = step(0.9972, s) * tw;
  float dust = pow(hash(gl_FragCoord.xy * 0.41), 90.0);
  col += vec3(1.0) * (star * 1.15 + dust * 0.55) * u_stars * mix(1.0, 0.28, u_light);

  if (u_planet > 0.5) {
    vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
    vec2 pc = p - vec2(0.92, -0.58);
    float d = length(pc);
    float r = mix(0.4, 0.36, u_light);
    float disk = smoothstep(r, r - 0.012, d);
    float limb = pow(clamp(1.0 - d / r, 0.0, 1.0), 0.52);
    vec3 planet = mix(u_sky * 1.8, mix(col, u_hot, 0.35), limb);
    float atm = smoothstep(r + 0.09, r - 0.02, d) - disk;
    col = mix(col, planet, disk * 0.92);
    col += u_hot * atm * mix(0.45, 0.25, u_light);
    vec2 rp = (pc + vec2(0.0, 0.03)) * vec2(1.0, 3.4);
    float rd = abs(length(rp) - 0.64);
    float ring = exp(-rd * rd * 90.0) * smoothstep(0.12, 0.32, abs(pc.y));
    ring *= 1.0 - disk * step(pc.y, 0.02);
    col += mix(col, vec3(0.95, 0.9, 0.8), 0.4) * ring * mix(0.7, 0.2, u_light);
  }

  float vig = 1.0 - mix(0.38, 0.16, u_light) * dot(vUv - 0.5, vUv - 0.5) * 2.1;
  col *= vig;
  col = pow(max(col, 0.0), vec3(mix(0.92, 0.8, u_light)));
  fragColor = vec4(col, 1.0);
}`;
