import React, { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, Instagram } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Set dark theme by default
    document.documentElement.classList.add("light");
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
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
              className="flex py-3 text-white hover:text-primary transition-colors duration-300 h-10 w-10 text-center
            p-2 rounded-full border justify-center items-center bg-primary hover:bg-primary/10 border-primary"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2 xs:space-x-4">
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
          <div className="container mx-auto px-4 py-8 gap-3 flex flex-col min-h-[60vh] justify-center">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex py-4 text-lg hover:text-white text-primary transition-colors duration-300 w-full text-center p-2 rounded-full border justify-center items-center hover:bg-primary bg-primary/10 border-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <a
              href="https://www.instagram.com/hotelyuvaan/"
              className="flex py-4 text-lg text-white hover:text-primary transition-colors duration-300 w-full text-center p-2 rounded-full border justify-center items-center bg-primary hover:bg-primary/10 border-primary"
              target="_blank"
              rel="noopener noreferrer"
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
