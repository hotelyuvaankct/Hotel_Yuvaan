
import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Set dark theme by default
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    document.documentElement.classList.toggle('light');
  };

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Rooms', href: '#rooms' },
    { name: 'Restaurant', href: '#restaurant' },
    { name: 'Facilities', href: '#facilities' },
    { name: 'Events', href: '#events' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-lg shadow-2xl border-b border-border/50' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className={`text-xl md:text-2xl lg:text-3xl font-bold font-playfair transition-all duration-500 ${
              isScrolled ? 'text-foreground' : 'text-white'
            }`}>
              Hotel <span className="text-gradient">Yuvaan</span>
            </h1>
            <div className="flex flex-col">
              <p className={`text-xs tracking-widest transition-all duration-500 ${
                isScrolled ? 'text-muted-foreground' : 'text-white/80'
              }`}>
                LUXURY EXPERIENCE
              </p>
              <p className={`text-xs font-semibold text-emerald-500 transition-all duration-500 ${
                isScrolled ? 'text-emerald-600' : 'text-emerald-400'
              }`}>
                🌿 Pure Vegetarian
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`font-medium transition-all duration-300 hover:text-primary hover:scale-105 ${
                  isScrolled ? 'text-foreground' : 'text-white'
                }`}
              >
                {item.name}
              </button>
            ))}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                isScrolled 
                  ? 'hover:bg-accent text-foreground' 
                  : 'hover:bg-white/10 text-white'
              }`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button className="bg-primary text-primary-foreground px-6 py-2 rounded-full hover:bg-primary/90 transition-all duration-300 hover:scale-105 text-sm lg:text-base">
              Book Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-300 ${
                isScrolled ? 'text-foreground' : 'text-white'
              }`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className={`p-2 transition-colors duration-300 ${
                isScrolled ? 'text-foreground' : 'text-white'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${
        isMenuOpen 
          ? 'max-h-96 opacity-100' 
          : 'max-h-0 opacity-0 overflow-hidden'
      } bg-background/95 backdrop-blur-lg border-t border-border/50`}>
        <div className="container mx-auto px-4 py-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left py-3 px-2 text-foreground hover:text-primary hover:bg-accent/50 transition-colors duration-300 rounded-md"
              >
                {item.name}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="w-full mt-4 bg-primary text-primary-foreground py-3 rounded-full hover:bg-primary/90 transition-colors duration-300"
          >
            Book Now
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
