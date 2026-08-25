import { SixtySixLockup } from "./marks";

const STEPS = [
  {
    kicker: "01 Face",
    title: "One alphabet",
    body: "66 and X share Plus Jakarta 800. Same stem, same terminals. A mark is a word.",
  },
  {
    kicker: "02 Track",
    title: "Close it",
    body: "Negative tracking fuses three glyphs into one silhouette. If a × fits in the gap, it failed.",
  },
  {
    kicker: "03 Letter",
    title: "X is X",
    body: "Not a diameter, not a clasp. The third character of the name, same height as the sixes.",
  },
  {
    kicker: "04 Color",
    title: "One accent",
    body: "Ink for the number. Violet for the X. The signature sits at the end, not between.",
  },
];

export function XConstruct() {
  return (
    <section id="mark" className="px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-sand/45 uppercase">Mark lab</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">66X</h2>
          <p className="mt-3 text-sand/65">
            One alphabet. Same cap-height. Tight track. X is a letter, in violet, as the signature — not a slash, not a
            multiply, not two bowls pretending to be Chanel.
          </p>
        </div>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#0a0e18] p-8 ring-1 ring-white/10 sm:p-10">
            <svg viewBox="0 0 72 36" className="w-full bg-transparent" aria-label="66X wordmark">
              <SixtySixLockup ink="#E7D7C2" x="#9B87FF" />
            </svg>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {STEPS.map((step) => (
              <article key={step.title} className="rounded-[1.5rem] bg-white/6 p-4">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-sand/45 uppercase">{step.kicker}</p>
                <h3 className="mt-2 text-lg font-bold tracking-[-0.03em]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sand/65">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
