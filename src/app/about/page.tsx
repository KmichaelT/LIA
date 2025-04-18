"use client";
import { Eye, Target, Heart } from "lucide-react";

export default function About() {
  return (
    <>
      <section className="py-32">
        <div className="container">
          <h2 className=" text-5xl">About Us</h2>
          <p className="mt-3 text-xl text-muted-foreground">
            Love in Action is a nonprofit founded in 2019 by eight dedicated
            individuals committed to supporting underprivileged children in
            Boreda, Ethiopia.
          </p>

          <div className="mt-20 flex flex-col items-center justify-center gap-16 md:flex-row">
            <img
              src="../images/about.jpg"
              alt="Community outreach"
              className="max-h-[740px] w-full rounded-xl object-cover"
            />

            <div className="w-full max-w-lg">
              <h6 className="text-3xl">Who We Are and What We Do</h6>

              <div className="mt-16 mb-4 h-px w-full bg-muted-foreground" />

              <p className="mb-10 text-lg text-muted-foreground">
                Serving a community where families face extreme poverty and
                limited access to education, we provide financial aid, tutoring,
                and mentorship so children can attend school, grow academically,
                and deepen their spiritual lives through the love of Christ. <br/><br/>Our
                mission is to express the love of Christ by providing holistic
                support financial assistance, tutoring, and spiritual
                guidance that empowers children in Boreda to stay in school,
                excel academically, and build brighter futures.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container">
          <p className="mb-4 text-sm text-muted-foreground lg:text-base">
            OUR VALUES
          </p>
          <h2 className="text-3xl font-medium lg:text-4xl">
            Our Vision, Mission &amp; Core Values
          </h2>
          <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-3">
            <div className="rounded-lg  p-5">
              <span className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-background">
                <Eye className="size-9" />
              </span>
              <h3 className="mb-2 text-xl font-medium">Our Vision</h3>
              <p className="leading-7 text-muted-foreground">
                To see an empowered community where children have reached their
                full potential.
              </p>
            </div>
            <div className="rounded-lg  p-5">
              <span className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-background">
                <Target className="size-9" />
              </span>
              <h3 className="mb-2 text-xl font-medium">Our Mission</h3>
              <p className="leading-7 text-muted-foreground">
                Providing holistic services to children in underprivileged
                communities.
              </p>
            </div>
            <div className="rounded-lg  p-5">
              <span className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-background">
                <Heart className="size-9" />
              </span>
              <h3 className="mb-2 text-xl font-medium">Our Core Values</h3>
              <p className="leading-7 text-muted-foreground">
                Commitment, Excellence, Holistic Approach, Integrity, Love.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
