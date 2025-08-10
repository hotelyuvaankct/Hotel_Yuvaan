
import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary/95 text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Hotel */}
          <div>
            <h3 className="text-xl font-bold font-playfair mb-6">
              About Hotel Yuvaan
            </h3>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              Welcome to Hotel Yuvaan, a luxury hotel & resort offering an
              unrivaled experience of comfort, elegance and personal service.
            </p>
            <div className="flex space-x-4">
              {/* <a
                href="#"
                className="bg-primary-foreground/10 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a> */}
              <a
                href="https://www.instagram.com/hotelyuvaan/"
                className="bg-primary-foreground/10 p-2 rounded-full hover:bg-primary-foregroun
d/20 transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5" />
              </a>
              {/* <a
                href="#"
                className="bg-primary-foreground/10 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a> */}
              {/* <a
                href="#"
                className="bg-primary-foreground/10 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors duration-300"
              >
                <Youtube className="w-5 h-5" />
              </a> */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold font-playfair mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
                >
                  Terms and Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
                >
                  Refund Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
                >
                  Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
                >
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-xl font-bold font-playfair mb-6">
              Useful Links
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="text-primary-foreground/80 text-sm">
                  {" "}
                  4VQ4+R9V, Station Rd,
                  <br /> Kuchaman City, Rajasthan 341508
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span className="text-primary-foreground/80 text-sm">
                  hotelyuvaankct@gmail.com
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span className="text-primary-foreground/80 text-sm">
                  +91 87695675067
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-primary-foreground/80 text-sm">
                Hotel & Restaurant Premium Theme. Powered by{" "}
                <span className="text-gold-400 font-semibold">
                  Hotel Yuvaan
                </span>
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-primary-foreground/80 text-sm">
                Copyright © 2025. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
