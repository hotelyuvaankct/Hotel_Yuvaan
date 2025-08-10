import React from 'react';
import { Star, ChevronDown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const pulseVariants = {
    initial: { scale: 1 },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop"
      }
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${import.meta.env.BASE_URL}image/Gallery/Night_View.png')`
        }}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Floating Elements */}
      <motion.div 
        className="absolute top-20 left-10 w-3 h-3 bg-yellow-400 rounded-full opacity-70 hidden md:block"
        animate={{
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="absolute top-32 right-16 w-2 h-2 bg-yellow-300 rounded-full opacity-60 hidden md:block"
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />
      <motion.div 
        className="absolute bottom-40 left-16 w-1 h-1 bg-yellow-500 rounded-full opacity-80 hidden md:block"
        animate={{
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2
        }}
      />
      <motion.div 
        className="absolute top-1/2 right-10 w-4 h-4 border border-yellow-400 rounded-full opacity-50 hidden lg:block"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "loop",
          delay: 0.5
        }}
      />

      {/* Sparkle Effects */}
      <motion.div
        className="absolute top-24 right-24 w-6 h-6 text-yellow-400 opacity-60 hidden lg:block"
        animate={{
          rotate: 360,
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "loop",
          delay: 1.5
        }}
      >
        <Sparkles className="w-full h-full" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-24 w-4 h-4 text-yellow-300 opacity-70 hidden lg:block"
        animate={{
          rotate: 360,
          opacity: [0.5, 0.9, 0.5]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "loop",
          delay: 2.5
        }}
      >
        <Sparkles className="w-full h-full" />
      </motion.div>

      {/* Content */}
      <motion.div 
        className="relative z-10 text-center text-white px-4 w-full max-w-5xl mx-auto pt-20 md:pt-32 pb-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Subtitle */}
        <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
          <p className="text-yellow-300 text-xs sm:text-sm md:text-base tracking-widest uppercase font-medium">
            Welcome to
          </p>
          <p className="text-yellow-200 text-sm sm:text-lg md:text-xl tracking-wider uppercase font-light mt-1">
            Luxury & Comfort
          </p>
        </motion.div>

        {/* Main Heading */}
        <motion.div className="mb-6 md:mb-8" variants={itemVariants}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-playfair leading-tight">
            <span className="block mb-1 sm:mb-2">HOTEL</span>
            <motion.span 
              className="text-gradient text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl block"
              variants={pulseVariants}
              initial="initial"
              animate="pulse"
            >
              YUVAAN
            </motion.span>
          </h1>
          <motion.div 
            className="w-24 sm:w-32 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mt-4 sm:mt-6"
            variants={itemVariants}
          />
        </motion.div>

        {/* Description */}
        <motion.p 
          className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-12 max-w-2xl sm:max-w-3xl mx-auto font-light leading-relaxed"
          variants={itemVariants}
        >
          Where <span className="text-yellow-300 font-medium">modern elegance</span> meets <span className="text-yellow-300 font-medium">warm hospitality</span>.
          <br className="hidden sm:block" />
          Experience premium accommodation and fine dining in the heart of the city.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-12 sm:mb-16"
          variants={itemVariants}
        >
          <motion.a
            href="#rooms"
            className="group bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full text-sm sm:text-base md:text-lg font-semibold transition-all duration-500 transform hover:scale-105 hover:shadow-lg w-full sm:w-auto text-center relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">EXPLORE ROOMS</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </motion.a>
          <motion.a
            href="#restaurant"
            className="group border border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full text-sm sm:text-base md:text-lg font-semibold transition-all duration-500 transform hover:scale-105 w-full sm:w-auto text-center relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">DINE WITH US</span>
          </motion.a>
        </motion.div>

        {/* Hotel Stats */}
        <motion.div 
          className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-md mx-auto"
          variants={itemVariants}
        >
          <motion.div 
            className="text-center group"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-1 sm:mb-2">16+</div>
            <div className="text-xs sm:text-sm text-white/80 uppercase tracking-wide">Premium Rooms</div>
          </motion.div>
          <motion.div 
            className="text-center group"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-1 sm:mb-2">4.8<Star className="inline w-3 h-3 sm:w-4 sm:h-4 mb-1" /></div>
            <div className="text-xs sm:text-sm text-white/80 uppercase tracking-wide">Guest Rating</div>
          </motion.div>
          <motion.div 
            className="text-center group"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-1 sm:mb-2">24/7</div>
            <div className="text-xs sm:text-sm text-white/80 uppercase tracking-wide">Service</div>
          </motion.div>
        </motion.div>

        
      </motion.div>
    </section>
  );
};

export default HeroSection;