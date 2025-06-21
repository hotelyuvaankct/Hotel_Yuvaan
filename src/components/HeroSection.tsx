
import React from 'react';
import { Star, ChevronDown, Sparkles } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
        }}
      />
      
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Floating Premium Elements */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-gold-400 rounded-full animate-pulse opacity-70 hidden md:block" />
      <div className="absolute top-32 right-16 w-2 h-2 bg-gold-300 rounded-full animate-pulse opacity-60 hidden md:block" style={{animationDelay: '1s'}} />
      <div className="absolute bottom-40 left-16 w-1 h-1 bg-gold-500 rounded-full animate-pulse opacity-80 hidden md:block" style={{animationDelay: '2s'}} />
      <div className="absolute top-1/2 right-10 w-4 h-4 border border-gold-400 rounded-full animate-pulse opacity-50 hidden lg:block" style={{animationDelay: '0.5s'}} />

      {/* Premium Sparkle Effects */}
      <Sparkles className="absolute top-24 right-24 w-6 h-6 text-gold-400 animate-pulse opacity-60 hidden lg:block" style={{animationDelay: '1.5s'}} />
      <Sparkles className="absolute bottom-32 left-24 w-4 h-4 text-gold-300 animate-pulse opacity-70 hidden lg:block" style={{animationDelay: '2.5s'}} />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto pt-32 pb-10">

        {/* Animated Subtitle */}
        <div className="mb-6 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <p className="text-gold-300 text-sm md:text-base tracking-[0.4em] uppercase font-medium">
            The Ultimate
          </p>
          <p className="text-gold-200 text-lg md:text-xl tracking-[0.3em] uppercase font-light mt-1">
            Luxury Experience
          </p>
        </div>

        {/* Main Animated Heading */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-playfair leading-none animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <span className="block mb-2">HOTEL</span>
            <span className="text-gradient text-6xl md:text-8xl lg:text-9xl block animate-pulse" style={{animationDelay: '1s'}}>
              YUVAAN
            </span>
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-gold-400 to-gold-600 mx-auto mt-6 animate-fade-in-up" style={{animationDelay: '1.2s'}} />
        </div>

        {/* Premium Description */}
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in-up" style={{animationDelay: '1.4s'}}>
          Where <span className="text-gold-300 font-medium">elegance</span> meets <span className="text-gold-300 font-medium">comfort</span>.
          <br className="hidden md:block" />
          Experience world-class hospitality in pure luxury.
        </p>

        {/* Premium CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-16 animate-fade-in-up" style={{animationDelay: '1.6s'}}>
          <a 
            href="#rooms"
            className="group bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-500 transform hover:scale-110 hover:shadow-2xl w-full sm:w-auto text-center relative overflow-hidden"
          >
            <span className="relative z-10">EXPLORE SUITES</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </a>
          <a 
            href="#restaurant"
            className="group border-2 border-gold-400 text-gold-300 hover:bg-gold-400 hover:text-black px-10 py-4 rounded-full text-lg font-semibold transition-all duration-500 transform hover:scale-110 w-full sm:w-auto text-center relative overflow-hidden"
          >
            <span className="relative z-10">FINE DINING</span>
          </a>
        </div>

        {/* Premium Hotel Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up" style={{animationDelay: '1.8s'}}>
          <div className="text-center group">
            <div className="text-4xl font-bold text-gold-400 mb-2 group-hover:scale-110 transition-transform duration-300">50+</div>
            <div className="text-sm text-white/80 uppercase tracking-wide">Luxury Suites</div>
          </div>
          <div className="text-center group">
            <div className="text-4xl font-bold text-gold-400 mb-2 group-hover:scale-110 transition-transform duration-300">4.9★</div>
            <div className="text-sm text-white/80 uppercase tracking-wide">Guest Rating</div>
          </div>
          <div className="text-center group">
            <div className="text-4xl font-bold text-gold-400 mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
            <div className="text-sm text-white/80 uppercase tracking-wide">Concierge</div>
          </div>
        </div>
      </div>


    </section>
  );
};

export default HeroSection;
