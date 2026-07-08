import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pt-16 pb-12 sm:pt-24">
      {/* Watercolor mountain ridgeline — purely decorative, sits behind content */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-48 w-full sm:h-64"
        viewBox="0 0 1200 320"
        preserveAspectRatio="none"
      >
        <defs>
          {/* feTurbulence + displacement gives the ridges soft, bleeding,
              hand-painted edges instead of hard vector lines. */}
          <filter
            id="hero-watercolor"
            x="-5%"
            y="-5%"
            width="110%"
            height="115%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.02"
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        </defs>

        <g filter="url(#hero-watercolor)">
          {/* Far ridge — faintest, furthest away; only crests above the back ridge around the mid-left, staying hidden at both edges and right */}
          <path
            d="M0,248 L70,205 L150,140 L235,92 L300,120 L360,78 L430,128 L520,196 L660,246 L900,262 L1200,258 L1200,320 L0,320 Z"
            fill="var(--color-sky)"
            opacity="0.1"
          />
          {/* Back ridge — palest; irregular peaks rising taller toward the right */}
          <path
            d="M0,224 L90,176 L175,198 L295,150 L395,178 L545,158 L600,182 L720,116 L845,146 L940,74 L1065,150 L1120,40 L1200,92 L1200,320 L0,320 Z"
            fill="var(--color-sky)"
            opacity="0.2"
          />
          {/* Mid ridge */}
          <path
            d="M0,252 L140,206 L255,250 L375,194 L515,240 L650,184 L775,234 L915,192 L1045,226 L1150,198 L1200,220 L1200,320 L0,320 Z"
            fill="var(--color-sage)"
            opacity="0.26"
          />
          {/* Front ridge — most defined but still soft */}
          <path
            d="M0,300 L165,258 L335,296 L490,254 L675,298 L835,260 L1005,294 L1130,268 L1200,286 L1200,320 L0,320 Z"
            fill="var(--color-forest)"
            opacity="0.24"
          />
        </g>
      </svg>

      <div className="relative z-10 mx-auto flex flex-col-reverse md:flex-row max-w-6xl items-center gap-10 sm:grid-cols-[1.3fr_1fr]">
        <div>
          <h1 className="font-display text-4xl leading-[1.05] text-forest sm:text-6xl">
            Sarik&apos;s Adventures
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink/80">
            After 10 years at our place on Market Street in downtown San Diego
            it was time for a new spot. But first, why not go on an adventure?
          </p>
          <p className="mt-2 max-w-xl text-lg text-ink/80">
            At the beginning of May we left our apartment with everything we
            (still) own packed in a minivan and set out to spend a year(ish)
            traveling around the western US staying for a month here and there.
          </p>
          <p className="mt-2 max-w-xl text-lg text-ink/80">
            We hope you&apos;ll follow along with us! We&apos;ll add new pics
            and updates on our progress. And please drop us a line. We&apos;d
            love to hear from you.
          </p>
          <p className="mt-4 max-w-xl text-xl text-ink/80">
            Sarah & Erik
          </p>
        </div>

        <div className="relative mx-auto md:mt-30 aspect-4/3 w-full max-w-32 md:max-w-80">
          <Image
            src="/wildflowers.png"
            alt=""
            fill
            sizes="(max-width: 640px) 16rem, 24rem"
            className="object-contain object-bottom"
            priority
          />
        </div>
      </div>
    </section>
  );
}
