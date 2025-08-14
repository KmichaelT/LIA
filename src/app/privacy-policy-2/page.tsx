"use client";

import {
  ArrowUp,
  Clock,
  Facebook,
  Home,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
 
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const PrivacyPolicy = () => {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const sectionRefs = useRef<Record<string, HTMLElement>>({});
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        { rootMargin: "0px 0px -80% 0px", threshold: 1 }
      );
  
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref) observer.observe(ref);
      });
  
      return () => observer.disconnect();
    }, []);
  
    const addSectionRef = (id: string, ref: HTMLElement | null) => {
      if (ref) sectionRefs.current[id] = ref;
    };
  
    return (
      <section className="py-32">
        <div  >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <Home className="h-4 w-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Privacy Policy</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
  
          <h1 className="mt-7 mb-6 max-w-3xl text-3xl font-semibold md:text-5xl">
            Privacy Policy
          </h1>
  
          <div className="flex items-center gap-3 text-sm">
            <Avatar className="h-8 w-8 border">
              <AvatarImage src="/images/logo-new.svg" />
            </Avatar>
            <span>
              <span className="font-medium">Love In Action</span>
              <span className="ml-1 text-muted-foreground">
                • Updated April 2025
              </span>
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              7 min. read
            </span>
          </div>
  
          <Separator className="mt-8 mb-16" />
  
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8">
              {[
                {
                  id: "section1",
                  title: "1. Introduction",
                  content: (
                    <>
                      <p>
                        Love In Action (“we,” “our,” or “us”) is a nonprofit organization
                        dedicated to making positive change in communities around the world.
                        This Privacy Policy outlines how we collect, use, and protect your
                        information when you use our website at{" "}
                        <a href="https://www.loveinaction.co" target="_blank">
                          www.loveinaction.co
                        </a>
                        .
                      </p>
                      <p>
                        By using our website, you consent to the data practices described in
                        this policy. If you do not agree, please refrain from using the site.
                      </p>
                    </>
                  ),
                },
                {
                  id: "section2",
                  title: "2. Information We Collect",
                  content: (
                    <ul>
                      <li>
                        <strong>Personal Information:</strong> Name, email, phone, mailing
                        address, and other identifiers collected when you register, donate,
                        or contact us.
                      </li>
                      <li>
                        <strong>Payment Information:</strong> Processed securely by third
                        parties (e.g., Zeffy). We do not store full payment details.
                      </li>
                      <li>
                        <strong>Device & Usage Info:</strong> IP address, browser type,
                        operating system, and activity tracked through cookies and analytics
                        tools.
                      </li>
                    </ul>
                  ),
                },
                {
                  id: "section3",
                  title: "3. How We Use Your Information",
                  content: (
                    <ul>
                      <li>
                        <strong>To Process Donations:</strong> We use your data to complete
                        transactions and provide receipts.
                      </li>
                      <li>
                        <strong>To Communicate:</strong> You may receive emails related to
                        our events, newsletters, or donation follow-ups.
                      </li>
                      <li>
                        <strong>To Improve the Site:</strong> Visitor behavior helps us
                        enhance usability and tailor content.
                      </li>
                      <li>
                        <strong>To Ensure Security:</strong> We monitor activity to detect
                        suspicious or malicious behavior.
                      </li>
                    </ul>
                  ),
                },
                {
                  id: "section4",
                  title: "4. Sharing Your Information",
                  content: (
                    <p>
                      We do <strong>not</strong> sell, rent, or trade your personal data.
                      However, we may share information with service providers (e.g.,
                      analytics tools, email delivery platforms, and payment processors) who
                      support our operations. These providers are contractually bound to
                      protect your data and use it only as instructed.
                    </p>
                  ),
                },
                {
                  id: "section5",
                  title: "5. Third-Party Services",
                  content: (
                    <>
                      <p>
                        We may link to third-party tools or services (like Zeffy for
                        donations). These sites operate independently and have their own
                        privacy policies. We recommend reviewing their policies before
                        engaging or sharing any personal information.
                      </p>
                    </>
                  ),
                },
                {
                  id: "section6",
                  title: "6. Data Security",
                  content: (
                    <>
                      <p>
                        We implement reasonable administrative, technical, and physical
                        safeguards to protect your information. Although no online platform
                        can guarantee absolute security, we strive to use industry-standard
                        measures to guard against unauthorized access and data breaches.
                      </p>
                    </>
                  ),
                },
                {
                  id: "section7",
                  title: "7. Your Rights & Choices",
                  content: (
                    <ul>
                      <li>
                        <strong>Access:</strong> Request to view the personal data we hold.
                      </li>
                      <li>
                        <strong>Rectification:</strong> Request corrections to your data.
                      </li>
                      <li>
                        <strong>Erasure:</strong> Request deletion of your personal data.
                      </li>
                      <li>
                        <strong>Withdraw Consent:</strong> Unsubscribe from emails or revoke
                        permissions.
                      </li>
                    </ul>
                  ),
                },
                {
                  id: "section8",
                  title: "8. Children’s Privacy",
                  content: (
                    <p>
                      Our services are not intended for children under the age of 13. We do
                      not knowingly collect data from minors. If you believe a child has
                      submitted personal information, please contact us immediately for
                      removal.
                    </p>
                  ),
                },
                {
                  id: "section9",
                  title: "9. Changes to This Privacy Policy",
                  content: (
                    <p>
                      We may update this policy from time to time. Revisions will be posted
                      on this page with an updated effective date. Your continued use of the
                      site constitutes acceptance of any changes.
                    </p>
                  ),
                },
                {
                  id: "section10",
                  title: "10. Contact Us",
                  content: (
                    <p>
                      If you have any questions about this Privacy Policy or our data
                      practices, please contact us at: <br />
                      <strong>Email:</strong> info@loveinaction.co <br />
                    </p>
                  ),
                },
              ].map(({ id, title, content }) => (
                <section
                  key={id}
                  id={id}
                  ref={(ref) => addSectionRef(id, ref)}
                  className="prose mb-8 text-sm"
                >
                  <h3 className="text-sm mb-3">{title}</h3>
                  {content}
                </section>
              ))}
            </div>
  
          </div>
        </div>
      </section>
    );
  };
  
  export default PrivacyPolicy;