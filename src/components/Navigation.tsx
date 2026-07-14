"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Bed, Utensils, Wifi, Tag, Image } from "lucide-react";
import bannerData from "../data/banner.json";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const solidNav = isScrolled || !isHomePage;
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const menuVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeOut" as const,
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeIn" as const,
      },
    },
  };

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const navItems = [
    { name: "About", to: "/#about", icon: <User className="w-5 h-5" /> },
    { name: "Rooms", to: "/#rooms", icon: <Bed className="w-5 h-5" /> },
    {
      name: "Restaurant",
      to: "/#restaurant",
      icon: <Utensils className="w-5 h-5" />,
    },
    {
      name: "Facilities",
      to: "/#facilities",
      icon: <Wifi className="w-5 h-5" />,
    },
    { name: "Gallery", to: "/gallery", icon: <Image className="w-5 h-5" /> },
    { name: "Offers", to: "/coupons", icon: <Tag className="w-5 h-5" /> },
  ];

  return (
    <nav
      className={`fixed left-0 right-0 top-0 w-full max-w-[100%] z-50 transition-all duration-500 flex flex-col overflow-x-clip ${
        solidNav
          ? "bg-background/95 backdrop-blur-lg shadow-sm border-b border-border/50"
          : "bg-transparent"
      }`}
      style={{ minHeight: "64px" }}
    >
      <div className="bg-primary text-primary-foreground text-[9px] sm:text-[10px] md:text-xs font-semibold py-1.5 w-full max-w-full overflow-hidden flex whitespace-nowrap tracking-wider">
        <div className="animate-marquee flex shrink-0 will-change-transform">
          {[...bannerData, ...bannerData].map((text, index) => (
            <React.Fragment key={`marquee-1-${index}`}>
              <span className="mx-4">{text}</span> •
            </React.Fragment>
          ))}
        </div>
        <div
          className="animate-marquee flex shrink-0 will-change-transform"
          aria-hidden="true"
        >
          {[...bannerData, ...bannerData].map((text, index) => (
            <React.Fragment key={`marquee-2-${index}`}>
              <span className="mx-4">{text}</span> •
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="container mx-auto px-4 w-full">
        <div className="flex justify-between items-center py-4 md:py-4 sm:py-6 min-h-[64px] md:min-h-[72px] lg:min-h-[80px]">
          <div className="flex-shrink-0">
            <Link href="/" className="cursor-pointer">
              <h1
                className={`text-xl xs:text-2xl md:text-3xl font-bold font-playfair transition-all duration-500 ${
                  solidNav ? "text-foreground" : "text-white"
                }`}
              >
                Hotel <span className="text-gradient">Yuvaan</span>
              </h1>
              <p
                className={`text-[10px] xs:text-xs tracking-widest transition-all duration-500 ${
                  solidNav ? "text-muted-foreground" : "text-white/80"
                }`}
              >
                LUXURY EXPERIENCE
              </p>
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.to}
                className={`font-medium transition-all duration-300 hover:text-primary hover:scale-105 ${
                  solidNav ? "text-foreground" : "text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Button asChild variant="solid" size="sm">
              <Link href="/book">Book</Link>
            </Button>
          </div>

          <div className="lg:hidden flex items-center gap-1 xs:gap-2">
            <Button asChild variant="solid" size="sm" className="px-4">
              <Link href="/book">Book</Link>
            </Button>
            <button
              ref={buttonRef}
              type="button"
              className={`relative h-8 w-8 transition-colors duration-300 ${
                solidNav ? "text-foreground" : "text-white"
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <span
                  className={`block absolute h-0.5 w-6 transform bg-current transition-all duration-300 ease-in-out ${
                    isMenuOpen ? "rotate-45" : "-translate-y-2"
                  }`}
                />
                <span
                  className={`block absolute h-0.5 w-6 transform bg-current transition-all duration-300 ease-in-out ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block absolute h-0.5 w-6 transform bg-current transition-all duration-300 ease-in-out ${
                    isMenuOpen ? "-rotate-45" : "translate-y-2"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              className="lg:hidden absolute right-4 mt-2 w-64 bg-background/95 backdrop-blur-lg rounded-xl border border-border/50 shadow-lg z-50 overflow-hidden origin-top-right"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="grid grid-cols-3 gap-1 p-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.to}
                    className="flex flex-col items-center justify-center p-3 text-primary hover:text-white transition-colors duration-300 rounded-lg hover:bg-primary/20"
                    onClick={() => setIsMenuOpen(false)}
                    title={item.name}
                  >
                    {item.icon}
                    <span className="text-xs mt-1">{item.name}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;
