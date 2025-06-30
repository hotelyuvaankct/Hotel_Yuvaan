
import React from 'react';
import { Star, ChevronDown, Sparkles, Leaf } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Using actual hotel exterior photo */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{
          backgroundImage: "url('/lovable-uploads/a78aa5f3-1e73-4908-b921-18923de829cf.png')"
        }}
      />
      
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Floating Premium Elements */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-gold-400 rounded-full animate-pulse opacity-70 hidden md:block" />
      <div className="absolute top-32 right-16 w-2 h-2 bg-gold-300 rounded-full animate-pulse opacity-60 hidden md:block" style={{animationDelay: '1s'}} />
      <div className="absolute bottom-40 left-16 w-1 h-1 bg-gold-500 rounded-full animate-pulse opacity-80 hidden md:block" style={{animationDelay: '2s'}} />
      <div className="absolute top-1/2 right-10 w-4 h-4 border border-gold-400 rounded-full animate-pulse opacity-50 hidden lg:block" style={{animationDelay: '0.5s'}} />

      {/* Premium Sparkle Effects */}
      <Sparkles className="absolute top-24 right-24 w-6 h-6 text-gold-400 animate-pulse opacity-60 hidden lg:block" style={{animationDelay: '1.5s'}} />
      <Sparkles className="absolute bottom-32 left-24 w-4 h-4 text-gold-300 animate-pulse opacity-70 hidden lg:block" style={{animationDelay: '2.5s'}} />

      {/* Pure Veg Badge */}
      <div className="absolute top-20 right-4 md:top-24 md:right-8 bg-emerald-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 animate-pulse">
        <Leaf className="w-4 h-4" />
        <span>100% Pure Veg</span>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto pt-32 pb-10">

        {/* Animated Subtitle */}
        <div className="mb-6 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <p className="text-gold-300 text-sm md:text-base tracking-[0.4em] uppercase font-medium">
            Welcome to
          </p>
          <p className="text-gold-200 text-lg md:text-xl tracking-[0.3em] uppercase font-light mt-1">
            Luxury & Pure Vegetarian Experience
          </p>
        </div>

        {/* Main Animated Heading */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold font-playfair leading-none animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <span className="block mb-2">HOTEL</span>
            <span className="text-gradient text-5xl md:text-7xl lg:text-9xl block animate-pulse" style={{animationDelay: '1s'}}>
              YUVAAN
            </span>
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-gold-400 to-gold-600 mx-auto mt-6 animate-fade-in-up" style={{animationDelay: '1.2s'}} />
        </div>

        {/* Pure Veg Highlight */}
        <div className="mb-6 animate-fade-in-up" style={{animationDelay: '1.3s'}}>
          <div className="inline-flex items-center space-x-3 bg-emerald-600/20 backdrop-blur-sm border border-emerald-400/30 px-6 py-3 rounded-full">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-300 font-semibold text-lg">Pure Vegetarian Cuisine</span>
            <Leaf className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        {/* Premium Description */}
        <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in-up" style={{animationDelay: '1.4s'}}>
          Where <span className="text-gold-300 font-medium">modern elegance</span> meets <span className="text-gold-300 font-medium">warm hospitality</span>.
          <br className="hidden md:block" />
          Experience premium accommodation and authentic <span className="text-emerald-300 font-medium">pure vegetarian dining</span> in the heart of the city.
        </p>

        {/* Premium CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-16 animate-fade-in-up" style={{animationDelay: '1.6s'}}>
          <button 
            onClick={() => document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' })}
            className="group bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-8 md:px-10 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold transition-all duration-500 transform hover:scale-110 hover:shadow-2xl w-full sm:w-auto text-center relative overflow-hidden"
          >
            <span className="relative z-10">EXPLORE ROOMS</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
          <button 
            onClick={() => document.getElementById('restaurant')?.scrollIntoView({ behavior: 'smooth' })}
            className="group border-2 border-emerald-400 text-emerald-300 hover:bg-emerald-400 hover:text-black px-8 md:px-10 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold transition-all duration-500 transform hover:scale-110 w-full sm:w-auto text-center relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <Leaf className="w-4 h-4" />
              <span>PURE VEG DINING</span>
            </span>
          </button>
        </div>

        {/* Premium Hotel Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 animate-fade-in-up" style={{animationDelay: '1.8s'}}>
          <div className="text-center group">
            <div className="text-3xl md:text-4xl font-bold text-gold-400 mb-2 group-hover:scale-110 transition-transform duration-300">25+</div>
            <div className="text-xs md:text-sm text-white/80 uppercase tracking-wide">Premium Rooms</div>
          </div>
          <div className="text-center group">
            <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center space-x-1">
              <Leaf className="w-6 h-6" />
              <span>100%</span>
            </div>
            <div className="text-xs md:text-sm text-white/80 uppercase tracking-wide">Pure Vegetarian</div>
          </div>
          <div className="text-center group">
            <div className="text-3xl md:text-4xl font-bold text-gold-400 mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
            <div className="text-xs md:text-sm text-white/80 uppercase tracking-wide">Service</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
