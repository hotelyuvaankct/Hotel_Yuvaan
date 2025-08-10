import React from 'react';
import { Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${import.meta.env.BASE_URL}image/Gallery/Night_View.png')`,
        }}
        animate={{
          scale: [1, 1.05, 1],
          transition: { duration: 15, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      
      {/* Floating Elements & Sparkles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute hidden md:block"
          style={{
            top: `${10 + Math.random() * 80}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, Math.random() * 20 - 10, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 3,
          }}
        >
          <Sparkles className="text-primary" style={{ width: `${8 + Math.random() * 16}px`, height: 'auto' }} />
        </motion.div>
      ))}


      {/* Content */}
      <motion.div
        className="relative z-10 text-center text-white px-4 w-full max-w-5xl mx-auto pt-20 md:pt-32 pb-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Subtitle */}
        <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
          <p className="text-primary text-xs sm:text-sm md:text-base tracking-widest uppercase font-medium">
            Welcome to
          </p>
          <p className="text-primary/80 text-sm sm:text-lg md:text-xl tracking-wider uppercase font-light mt-1">
            Luxury & Comfort
          </p>
        </motion.div>

        {/* Main Heading */}
        <motion.div className="mb-6 md:mb-8" variants={itemVariants}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-playfair leading-tight">
            <span className="block mb-1 sm:mb-2">HOTEL</span>
            <motion.span
              className="text-gradient text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl block"
              animate={{
                scale: [1, 1.03, 1],
                transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              YUVAAN
            </motion.span>
          </h1>
          <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-primary/40 to-primary/60 mx-auto mt-4 sm:mt-6" />
        </motion.div>

        {/* Description */}
        <motion.p
          className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-12 max-w-2xl sm:max-w-3xl mx-auto font-light leading-relaxed"
          variants={itemVariants}
        >
          Where <span className="text-primary font-medium">modern elegance</span> meets <span className="text-primary font-medium">warm hospitality</span>.
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
            className="group bg-primary text-background px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full text-sm sm:text-base md:text-lg font-semibold transition-colors duration-300 w-full sm:w-auto text-center relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">EXPLORE ROOMS</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </motion.a>
          <motion.a
            href="#restaurant"
            className="group border border-primary text-primary hover:bg-primary hover:text-background px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full text-sm sm:text-base md:text-lg font-semibold transition-colors duration-300 w-full sm:w-auto text-center"
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
          <motion.div className="text-center group" whileHover={{ scale: 1.05 }}>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 sm:mb-2">16+</div>
            <div className="text-xs sm:text-sm text-white/80 uppercase tracking-wide">Premium Rooms</div>
          </motion.div>
          
          <motion.div className="text-center group" whileHover={{ scale: 1.05 }}>
            <div className="flex justify-center items-center gap-1 text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 sm:mb-2">
              4.8
              <Star className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 fill-current" />
            </div>
            <div className="text-xs sm:text-sm text-white/80 uppercase tracking-wide">Guest Rating</div>
          </motion.div>

          <motion.div className="text-center group" whileHover={{ scale: 1.05 }}>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 sm:mb-2">24/7</div>
            <div className="text-xs sm:text-sm text-white/80 uppercase tracking-wide">Service</div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;