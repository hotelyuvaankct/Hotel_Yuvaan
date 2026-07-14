import Link from "next/link";
import { Instagram, MapPin, Phone, Mail } from "lucide-react";
import {
  buildContactDisplay,
  type ContactDisplay,
} from "@/services/configService";
import { DEFAULT_APP_CONFIG } from "@/data/defaultAppConfig";
import { footerLinksByGroup } from "@/data/sitePages";

type FooterProps = {
  contact?: ContactDisplay;
};

export default function Footer({ contact: contactProp }: FooterProps) {
  const contact =
    contactProp ?? buildContactDisplay(DEFAULT_APP_CONFIG);

  const legalLinks = footerLinksByGroup("legal");
  const businessLinks = footerLinksByGroup("business");

  return (
    <footer className="bg-primary/95 text-primary-foreground py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">About Hotel Yuvaan</h3>
            <p className="text-primary-foreground/80 text-sm sm:text-base">
              Luxury hotel offering comfort, elegance and personal service.
            </p>
            {contact.instagramUrl && (
              <a
                href={contact.instagramUrl}
                className="inline-block bg-primary-foreground/10 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Business</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              {businessLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    href={link.to}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Legal</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    href={link.to}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Contact</h3>
            <div className="space-y-2 text-sm sm:text-base">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  {contact.fullAddress}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                {contact.emailHref ? (
                  <a
                    href={contact.emailHref}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {contact.supportEmail}
                  </a>
                ) : (
                  <span className="text-primary-foreground/80">
                    {contact.supportEmail}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                {contact.phoneHref ? (
                  <a
                    href={contact.phoneHref}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {contact.contactPhone}
                  </a>
                ) : (
                  <span className="text-primary-foreground/80">
                    {contact.contactPhone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-6 text-center text-xs sm:text-sm text-primary-foreground/80 space-y-2">
          <p>© {new Date().getFullYear()} Hotel Yuvaan. All rights reserved.</p>
          <p className="text-primary-foreground/60">
            Payments secured by Razorpay · By booking you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-2 hover:text-primary-foreground"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-2 hover:text-primary-foreground"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
