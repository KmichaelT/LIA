import { ArrowRight } from "lucide-react";

const Contribulte = () => {
  return (
    <section className="py-32">
      <div className="container grid gap-y-12 md:grid-cols-12 md:gap-x-6 md:gap-y-0">
        <div className="md:col-span-6 lg:col-span-5">
          <h2 className="mb-3 text-xl font-bold md:mb-4 md:text-4xl lg:mb-6">
            Ways to Contribute
          </h2>
          <p className="mb-8 text-muted-foreground lg:text-lg">
            Join us in making a difference. Whether through monthly child sponsorship
            or one-time donations, your support helps transform lives and build
            stronger communities.
          </p>
        </div>
        <div className="grid gap-y-5 md:col-span-6 md:gap-y-[1.875rem] lg:col-start-7">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScrqmqkKP8I7l3j2IOkXTn8boTsBbgoTbyQPxDvsSSKyvLI9w/viewform"
            className="group flex flex-col justify-center overflow-clip rounded-2xl border border-gray-600 px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12"
          >
            <p className="mb-3 text-xl font-bold tracking-wider uppercase">
              Sponsor a child just for $20/mo
            </p>
            <p className="mb-12 font-semibold text-muted-foreground lg:text-base">
              Make a lasting impact by sponsoring a child. Your monthly contribution
              provides education, healthcare, and essential support for a child in need.
              Together, we can create a brighter future.
            </p>
            <div className="flex w-fit items-center gap-4 rounded-full border   px-6 py-4 bg-primary group-hover:bg-secondary  text-primary-foreground">
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />{" "}
              Register Now
            </div>
          </a>
          <a
            href="https://www.zeffy.com/en-US/donation-form-v2/d7a24fa2-5425-4e72-b337-120c4f0b8c64"
            className="group flex flex-col justify-center overflow-clip rounded-2xl border border-gray-600 px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12"
          >
            <p className="mb-3 text-xl font-bold tracking-wider uppercase">
              Make one time donation
            </p>
            <p className="mb-12 font-semibold text-muted-foreground lg:text-base">
              Every donation counts. Your one-time gift helps fund immediate needs
              like food assistance, educational supplies, and community development
              projects that improve lives.
            </p>
            <div className="flex w-fit items-center gap-4 rounded-full border   px-6 py-4 bg-primary group-hover:bg-secondary  text-primary-foreground">
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />{" "}
              Donate Now
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export { Contribulte };
