"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FaArrowRightToBracket, FaArrowRotateRight } from "react-icons/fa6";
import { submitContact } from "@/services/contactService";
import { Button } from "@/components/ui/button";
import SectionHeader from "./SectionHeader";

type ContactSectionProps = {
  contact?: {
    fullAddress?: string;
    addressLine1?: string;
    addressLine2?: string;
    phoneDisplay?: string;
    phoneHref?: string;
    supportEmail?: string;
    emailHref?: string;
    mapsEmbedUrl?: string;
  };
};

export default function ContactSection({ contact }: ContactSectionProps) {
  const isLoading = !contact;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await submitContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      });
      toast({
        title: "Thank you for contacting us!",
        description:
          result.message ??
          "We have received your message and will connect with you shortly.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "There was a problem sending your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="pt-10 md:pt-12 pb-12 sm:pb-16 md:pb-24">
      <div className="container mx-auto px-3 min-[380px]:px-4">
        <SectionHeader
          eyebrow="GET IN TOUCH"
          title="Contact"
          highlight="Us"
          description="We're here to assist you with reservations, inquiries, and to make your stay memorable. Reach out to us anytime."
        />

        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-12 items-stretch">
          <div className="flex-1 animate-on-scroll-left flex flex-col justify-between">
            <div>
              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-primary/10 p-2.5 sm:p-3 rounded-lg shrink-0">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">Address</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed break-words">
                      {isLoading ? (
                        "Loading..."
                      ) : contact?.fullAddress ? (
                        contact.fullAddress
                      ) : (
                        <>
                          {contact?.addressLine1}
                          {contact?.addressLine2 ? (
                            <>
                              <br />
                              {contact.addressLine2}
                            </>
                          ) : null}
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-primary/10 p-2.5 sm:p-3 rounded-lg shrink-0">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">Phone</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground break-words">
                      {!isLoading && contact?.phoneHref ? (
                        <a
                          href={contact.phoneHref}
                          className="hover:text-primary transition-colors"
                        >
                          {contact.phoneDisplay}
                        </a>
                      ) : (
                        contact?.phoneDisplay ?? "Loading..."
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-primary/10 p-2.5 sm:p-3 rounded-lg shrink-0">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">Email</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground break-all">
                      {!isLoading && contact?.emailHref ? (
                        <a
                          href={contact.emailHref}
                          className="hover:text-primary transition-colors"
                        >
                          {contact.supportEmail}
                        </a>
                      ) : (
                        contact?.supportEmail ?? "Loading..."
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {contact?.mapsEmbedUrl && (
              <div className="bg-muted rounded-xl sm:rounded-2xl overflow-hidden h-52 min-[380px]:h-64 sm:h-72 md:h-80 flex items-center justify-center mt-auto">
                <iframe
                  src={contact.mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hotel Yuvaan Location"
                ></iframe>
              </div>
            )}
          </div>

          <div className="flex-1 animate-on-scroll-right flex items-center">
            <div className="bg-card rounded-xl sm:rounded-2xl p-4 min-[380px]:p-6 sm:p-8 shadow-lg w-full">
              <h3 className="text-xl min-[380px]:text-2xl font-bold font-playfair mb-4 sm:mb-6">
                Send us a message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-300"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-300"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    minLength={10}
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-300 resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <div className="flex flex-col min-[420px]:flex-row justify-between gap-2.5 sm:gap-4">
                  <Button
                    type="reset"
                    variant="soft"
                    disabled={loading}
                    className="h-9 w-full min-[420px]:w-1/2 px-3 text-xs sm:h-10 sm:text-sm"
                    onClick={() =>
                      setFormData({ name: "", email: "", message: "" })
                    }
                  >
                    <FaArrowRotateRight className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                    Reset Form
                  </Button>
                  <Button
                    type="submit"
                    variant="solid"
                    className="h-9 w-full min-[420px]:w-1/2 px-3 text-xs sm:h-10 sm:text-sm"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Submit Message"}
                    {!loading && (
                      <FaArrowRightToBracket className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
