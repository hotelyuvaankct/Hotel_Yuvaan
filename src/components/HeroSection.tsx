
import React from 'react';
import { Star, ChevronDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 gradient-overlay" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-gold-400 rounded-full animate-pulse hidden md:block" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-gold-300 rounded-full animate-pulse hidden md:block" />
      <div className="absolute bottom-32 left-20 w-1 h-1 bg-gold-500 rounded-full animate-pulse hidden md:block" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        {/* Star Rating */}
        <div className="flex justify-center items-center space-x-1 mb-6 animate-fade-in-up">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-gold-400 text-gold-400" />
          ))}
        </div>

        {/* Subtitle */}
        <p className="text-gold-300 text-sm md:text-base tracking-[0.3em] uppercase mb-4 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          The Ultimate Luxury Experience
        </p>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-playfair mb-6 leading-tight animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          ENJOY THE BEST<br />
          <span className="text-gradient">MOMENTS OF LIFE</span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.6s'}}>
          Welcome to Hotel Yuvaan, where luxury meets comfort. Experience world-class hospitality, 
          exquisite dining, and premium accommodations in an atmosphere of elegance and sophistication.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
          <a 
            href="#rooms"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 w-full sm:w-auto text-center"
          >
            ROOMS & SUITES
          </a>
          <a 
            href="#restaurant"
            className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 w-full sm:w-auto text-center"
          >
            DISCOVER RESTAURANT
          </a>
        </div>

        {/* Hotel Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up" style={{animationDelay: '1s'}}>
          <div className="text-center">
            <div className="text-2xl font-bold text-gold-400 mb-2">50+</div>
            <div className="text-sm text-white/80">Luxury Rooms</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gold-400 mb-2">4.8★</div>
            <div className="text-sm text-white/80">Guest Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gold-400 mb-2">24/7</div>
            <div className="text-sm text-white/80">Room Service</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white/60" />
      </div>

      {/* Reservation Card */}
      <div className="absolute bottom-10 right-10 bg-white/10 backdrop-blur-md rounded-lg p-4 text-white hidden lg:block animate-fade-in-right">
        <div className="text-sm text-white/80 mb-1">Reservation</div>
        <div className="text-xl font-semibold flex items-center">
          <span className="mr-2">📞</span>
          +91 98765 43210
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
