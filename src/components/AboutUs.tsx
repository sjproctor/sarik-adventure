import Link from "next/link";

export function AboutUs() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-8 px-5 py-20">
      <div className="mb-10">
        <p className="text-sm font-semibold tracking-wide text-terracotta uppercase">
          A bit about us
        </p>
        <h2 className="mt-2 font-display text-4xl text-forest sm:text-5xl">
          Sarah & Erik
        </h2>
      </div>

      <div className="max-w-3xl space-y-4 text-lg text-ink/80">
        <p>
          I hope this page makes our lives sound adventurous and exciting. Because actually we are pretty boring. We both work as software developers and our current dinner obsession is &quot;big salads&quot; which I bought special bowls for because a good big salad bowl has very specific requirements.
        </p>
        <p>
          Outside of work, Erik is an avid golfer. Left to his own devices, he would play multiple rounds a day and have the craziest tan lines. I have never been a ball-sport person, preferring running and yoga or any kind of acrobatic-type activity. This adventure has afforded us a lot of hiking opportunities and I guess we are of a certain age where a birding app suddenly appears on your phone. I swear I don&apos;t know how that happened.
        </p>
        <p>
          We are eternally thankful to our families in Boise, Idaho, who have, and continue to, open their homes to us. Having a support system (with a spare room) is so comforting and gives us the luxury to take risks while having a &quot;what happens if this all goes to hell&quot; backup plan.
        </p>
        <p>
          If you have questions or comments, we&apos;d love to hear from you. Please {" "}
          <Link
            href="/contact"
            className="text-terracotta underline underline-offset-4"
          >
            drop us a line
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
