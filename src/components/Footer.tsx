import React from "react";
import { Instagram, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary/95 text-primary-foreground py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* About Hotel */}
          <div className="space-y-4 md:ml-8 lg:ml-16 xl:ml-24">
            <h3 className="text-lg font-bold">About Hotel Yuvaan</h3>
            <p className="text-primary-foreground/80 text-sm sm:text-base">
              Luxury hotel offering comfort, elegance and personal service.
            </p>
            <a
              href="https://www.instagram.com/hotelyuvaan/"
              className="inline-block bg-primary-foreground/10 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 md:ml-8 lg:ml-16 xl:ml-24">
            <h3 className="text-lg font-bold">Contact</h3>
            <div className="space-y-2 text-sm sm:text-base">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  4VQ4+R9V, Station Rd, Kuchaman City, Rajasthan 341508
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span className="text-primary-foreground/80">
                  hotelyuvaankct@gmail.com
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span className="text-primary-foreground/80">
                  +91 87695675067
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 pt-6 text-center text-xs sm:text-sm text-primary-foreground/80">
          <p>© {new Date().getFullYear()} Hotel Yuvaan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
