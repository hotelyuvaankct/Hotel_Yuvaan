
import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary/95 text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Hotel */}
          <div>
            <h3 className="text-xl font-bold font-playfair mb-6">About Hotel Yuvaan</h3>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              Welcome to Hotel Yuvaan, a luxury hotel & resort offering an unrivaled experience 
              of comfort, elegance and personal service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-primary-foreground/10 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-primary-foreground/10 p-2 rounded-full hover:bg-primary-foregroun
d/20 transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-primary-foreground/10 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-primary-foreground/10 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors duration-300">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold font-playfair mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300">Privacy Policy</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300">Terms and Conditions</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300">Refund Policy</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300">Support</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300">Careers</a></li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-xl font-bold font-playfair mb-6">Useful Links</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="text-primary-foreground/80 text-sm">123 Luxury Avenue, City Center</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span className="text-primary-foreground/80 text-sm">info@hotelyuvaan.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span className="text-primary-foreground/80 text-sm">+91 98765 43210</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold font-playfair mb-6">Subscribe Our Newsletter</h3>
            <p className="text-primary-foreground/80 mb-4 text-sm">
              Stay updated with our latest offers and events.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-l-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder-primary-foreground/60 focus:outline-none focus:bg-primary-foreground/20"
              />
              <button className="bg-gold-500 hover:bg-gold-600 px-4 py-2 rounded-r-lg transition-colors duration-300">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-primary-foreground/80 text-sm">
                Hotel & Restaurant Premium Theme. Powered by <span className="text-gold-400 font-semibold">Hotel Yuvaan</span>
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
