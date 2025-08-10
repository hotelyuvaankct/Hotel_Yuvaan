
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Emily Brown',
      role: 'Guest Review',
      rating: 5,
      image: `${import.meta.env.BASE_URL}images/testimonials/emily-brown.jpg`,
      review: "Hotel Yuvaan exceeded all expectations. The service was impeccable, rooms were luxurious, and the restaurant served the most delicious food. The staff went above and beyond to make our anniversary celebration memorable. Highly recommended for anyone seeking a premium hotel experience."
    },
    {
      id: 2,
      name: 'Rajesh Sharma',
      role: 'Business Traveler',
      rating: 5,
      image: `${import.meta.env.BASE_URL}images/testimonials/rajesh-sharma.jpg`,
      review: "Perfect for business stays. The hotel offers excellent conference facilities, high-speed internet, and professional service. The location is convenient and the rooms are well-appointed. I've stayed here multiple times and it never disappoints."
    },
    {
      id: 3,
      name: 'Priya Patel',
      role: 'Family Vacation',
      rating: 5,
      image: `${import.meta.env.BASE_URL}images/testimonials/priya-patel.jpg`,
      review: "Amazing experience with family! The kids loved the swimming pool, and we enjoyed the spacious family rooms. The staff was incredibly helpful and accommodating. The breakfast buffet was excellent with great variety. Will definitely return!"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">
            TESTIMONIALS
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair mb-6">
            What Client's <span className="text-gradient">Say?</span>
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto animate-on-scroll">
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="text-center mb-8">
              {/* Stars */}
              <div className="flex justify-center space-x-1 mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold-400 text-gold-400" />
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="text-lg md:text-xl text-muted-foreground mb-8 italic leading-relaxed">
                "{testimonials[currentTestimonial].review}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-center space-x-4">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="text-left">
                  <h4 className="text-lg font-bold">{testimonials[currentTestimonial].name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center space-x-6">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${index === currentTestimonial ? 'bg-primary' : 'bg-muted'
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Google Reviews and Ratings */}
        <div className="mt-16 animate-on-scroll">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold font-playfair mb-4">Our Online Presence</h3>
            <p className="text-muted-foreground">See what guests are saying on popular platforms</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-card p-6 rounded-xl text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-lg font-bold text-blue-600 mb-2">Google</div>
              <div className="flex justify-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <div className="text-2xl font-bold mb-1">4.8</div>
              <div className="text-sm text-muted-foreground">500+ Reviews</div>
            </div>

            <div className="bg-card p-6 rounded-xl text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-lg font-bold text-blue-800 mb-2">Booking.com</div>
              <div className="flex justify-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <div className="text-2xl font-bold mb-1">9.2</div>
              <div className="text-sm text-muted-foreground">Superb Rating</div>
            </div>

            <div className="bg-card p-6 rounded-xl text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-lg font-bold text-red-600 mb-2">MakeMyTrip</div>
              <div className="flex justify-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <div className="text-2xl font-bold mb-1">4.7</div>
              <div className="text-sm text-muted-foreground">Excellent</div>
            </div>

            <div className="bg-card p-6 rounded-xl text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-lg font-bold text-orange-600 mb-2">TripAdvisor</div>
              <div className="flex justify-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <div className="text-2xl font-bold mb-1">4.6</div>
              <div className="text-sm text-muted-foreground">Certificate of Excellence</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
