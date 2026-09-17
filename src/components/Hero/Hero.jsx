const Hero = () => {
  return (
    <section className="bg-background">
      <div className="mx-auto grid min-h-[calc(100vh-85px)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">

        {/* Hero Content */}
        <div>
          <span className="font-bengali inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-primary">
            আপনার প্রয়োজন, আমাদের আস্থা
          </span>

          <h1 className="mt-6 max-w-2xl font-heading text-4xl font-bold leading-tight text-text sm:text-5xl lg:text-6xl">
            আপনার সমস্যার
            <span className="block text-primary">
              সমাধান এখন হাতের কাছেই
            </span>
          </h1>

          <p className="font-bengali mt-6 max-w-xl text-base leading-8 text-text-muted sm:text-lg">
            দৈনন্দিন প্রয়োজনের জন্য খুঁজে নিন বিশ্বস্ত সেবাদাতা।
            অনুরোধ পাঠান, সেবা গ্রহণ করুন এবং কাজের অগ্রগতি সহজেই দেখুন।
          </p>

          {/* Search */}
          <div className="mt-8 flex max-w-2xl flex-col gap-3 rounded-xl border border-border bg-white p-2 shadow-sm sm:flex-row">
            <input
              type="text"
              placeholder="আপনার কী সাহায্য প্রয়োজন?"
              className="font-bengali min-h-12 flex-1 rounded-lg px-4 text-sm text-text outline-none placeholder:text-text-muted focus:ring-2 focus:ring-primary/20"
            />

            <button
              type="button"
              className="font-bengali min-h-12 rounded-lg bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              সেবা খুঁজুন
            </button>
          </div>

          {/* Popular Services */}
          <div className="mt-6">
            <p className="font-bengali mb-3 text-sm font-medium text-text">
              জনপ্রিয় সেবা
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                "ইলেকট্রিশিয়ান",
                "প্লাম্বার",
                "AC সার্ভিস",
                "ক্লিনিং",
                "কার্পেন্টার",
              ].map((service) => (
                <span
                  key={service}
                  className="font-bengali rounded-full border border-border bg-white px-3 py-1.5 text-xs text-text-muted"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="hidden lg:block">
          <div className="relative mx-auto max-w-md">

            {/* Service Card */}
            <div className="rounded-3xl border border-border bg-white p-6 shadow-xl">

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bengali text-sm text-text-muted">
                    আপনার অনুরোধ
                  </p>

                  <h3 className="font-heading mt-1 text-xl font-bold text-text">
                    AC মেরামত
                  </h3>
                </div>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-success">
                  পাওয়া গেছে
                </span>
              </div>

              <div className="my-6 h-px bg-border" />

              {/* Provider */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl">
                  👨‍🔧
                </div>

                <div>
                  <h4 className="font-bengali font-semibold text-text">
                    রাকিব হাসান
                  </h4>

                  <p className="font-bengali text-sm text-text-muted">
                    AC টেকনিশিয়ান
                  </p>
                </div>

                <div className="ml-auto text-right">
                  <p className="text-sm font-semibold text-text">
                    ★ 4.9
                  </p>

                  <p className="font-bengali text-xs text-text-muted">
                    ১২০+ কাজ
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="font-bengali mt-6 w-full rounded-lg border border-border py-3 text-sm font-medium text-text transition-colors hover:border-primary hover:text-primary"
              >
                বিস্তারিত দেখুন
              </button>
            </div>

            {/* Status Card */}
            <div className="absolute -bottom-6 -left-8 hidden w-52 rounded-2xl border border-border bg-white p-4 shadow-lg xl:block">
              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-success">
                  ✓
                </div>

                <div>
                  <p className="font-bengali text-sm font-semibold text-text">
                    কাজের অগ্রগতি
                  </p>

                  <p className="font-bengali text-xs text-text-muted">
                    সেবাদাতা পথে আছেন
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;