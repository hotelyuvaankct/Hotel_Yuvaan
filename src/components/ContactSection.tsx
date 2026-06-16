import React, { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FaArrowRightToBracket, FaArrowRotateRight } from "react-icons/fa6";
import { submitContact } from "@/services/contactService";
import { useAppConfig } from "@/hooks/useAppConfig";

const ContactSection = () => {
  const { data: contact, isLoading } = useAppConfig();
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
    <section id="contact" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-on-scroll">
          <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">
            GET IN TOUCH
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair mb-6">
            Contact <span className="text-gradient">Us</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're here to assist you with reservations, inquiries, and to make
            your stay memorable. Reach out to us anytime.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-stretch">
          <div className="flex-1 animate-on-scroll-left flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold font-playfair mb-8">
                Get in Touch
              </h3>

              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Address</h4>
                    <p className="text-muted-foreground">
                      {isLoading ? "Loading..." : (
                        <>
                          {contact?.addressLine1}
                          <br /> {contact?.addressLine2}
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <p className="text-muted-foreground">
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

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-muted-foreground">
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
              <div className="bg-muted rounded-2xl overflow-hidden h-72 md:h-80 flex items-center justify-center mt-auto">
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
            <div className="bg-card rounded-2xl p-8 shadow-lg w-full">
              <h3 className="text-2xl font-bold font-playfair mb-6">
                Send Us a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-300"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-300"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold mb-2">
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
                    className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-300 resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <button
                    type="reset"
                    disabled={loading}
                    className="w-full md:w-1/2 bg-secondary text-secondary-foreground py-3 rounded-lg font-semibold transition-colors duration-300 border border-secondary hover:bg-secondary/80 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed shadow-sm mb-2 md:mb-0"
                    onClick={() =>
                      setFormData({ name: "", email: "", message: "" })
                    }
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <FaArrowRotateRight size={20} />
                      <p>Reset Form</p>
                    </div>
                  </button>
                  <button
                    type="submit"
                    className="w-full md:w-1/2 bg-primary text-primary-foreground py-3 rounded-lg font-semibold transition-colors duration-300 border border-primary hover:bg-primary/90 hover:border-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed shadow-sm flex items-center justify-center"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Submit Message"}
                    {!loading && (
                      <div className="p-2 ml-1">
                        <FaArrowRightToBracket size={20} />
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
