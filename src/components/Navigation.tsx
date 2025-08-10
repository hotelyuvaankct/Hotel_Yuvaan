import React, { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, Instagram } from "lucide-react";

const Navigation = () => {
  // Set initial theme to light mode. false = light, true = dark.
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Effect to handle theme changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Effect to handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Rooms", href: "#rooms" },
    { name: "Restaurant", href: "#restaurant" },
    { name: "Facilities", href: "#facilities" },
    { name: "Events", href: "#events" },
    { name: "Gallery", href: "#gallery" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-lg shadow-2xl border-b border-border/50"
          : "bg-transparent"
      }`}
      style={{ minHeight: "64px" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4 md:py-4 sm:py-6 min-h-[64px] md:min-h-[72px] lg:min-h-[80px]">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#home" className="cursor-pointer">
              <h1
                className={`text-xl xs:text-2xl md:text-3xl font-bold font-playfair transition-all duration-500 ${
                  isScrolled ? "text-foreground" : "text-white"
                }`}
              >
                Hotel <span className="text-gradient">Yuvaan</span>
              </h1>
              <p
                className={`text-[10px] xs:text-xs tracking-widest transition-all duration-500 ${
                  isScrolled ? "text-muted-foreground" : "text-white/80"
                }`}
              >
                LUXURY EXPERIENCE
              </p>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`font-medium transition-all duration-300 hover:text-primary hover:scale-105 ${
                  isScrolled ? "text-foreground" : "text-white"
                }`}
              >
                {item.name}
              </a>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                isScrolled
                  ? "hover:bg-accent text-foreground"
                  : "hover:bg-white/10 text-white"
              }`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <a
              href="https://www.instagram.com/hotelyuvaan/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center items-center h-10 w-10 p-2 rounded-full border text-white bg-primary hover:bg-primary/10 border-primary hover:text-primary transition-colors duration-300"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="lg:hidden flex items-center space-x-2 xs:space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-300 ${
                isScrolled ? "text-foreground" : "text-white"
              }`}
            >
              {isDark ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button
              className={`p-2 transition-colors duration-300 ${
                isScrolled ? "text-foreground" : "text-white"
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-lg border-t border-border/50">
          <div className="container mx-auto px-4 py-8 flex flex-col gap-3 min-h-[calc(100vh-64px)] justify-center">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex justify-center items-center py-4 text-lg text-primary hover:text-white transition-colors duration-300 w-full rounded-full border border-primary bg-primary/10 hover:bg-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <a
              href="https://www.instagram.com/hotelyuvaan/"
              className="flex justify-center items-center py-4 text-lg text-white hover:text-primary transition-colors duration-300 w-full rounded-full border border-primary bg-primary hover:bg-primary/10"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;