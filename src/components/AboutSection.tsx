
import React from 'react';
import { Award, Users, Clock, MapPin } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-on-scroll-left">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-gold-400 text-lg">★</span>
                ))}
              </div>
            </div>
            
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">
              HOTEL YUVAAN LUXURY HOTEL
            </p>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair mb-6 text-foreground">
              Enjoy a Luxury<br />
              <span className="text-gradient">Experience</span>
            </h2>
            
            <div className="space-y-4 text-muted-foreground mb-8">
              <p>
                Welcome to the best five-star deluxe hotel in the heart of the city. Hotel Yuvaan 
                offers unparalleled luxury and comfort with world-class amenities and exceptional 
                hospitality that creates unforgettable memories for our distinguished guests.
              </p>
              
              <p>
                Our hotel features elegantly appointed rooms and suites, each designed with 
                contemporary furnishings and premium amenities. Experience fine dining at our 
                signature restaurant, relax at our spa, or host your special events in our 
                sophisticated venues.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">50+</div>
                <div className="text-sm text-muted-foreground">Luxury Rooms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">15+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">1000+</div>
                <div className="text-sm text-muted-foreground">Happy Guests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">Service</div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
              <div className="bg-primary text-primary-foreground p-3 rounded-full">
                <span className="text-xl">📞</span>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Reservation</div>
                <div className="text-lg font-semibold text-primary">+91 98765 43210</div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="animate-on-scroll-right">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Hotel Restaurant"
                    className="w-full h-48 object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Hotel Room"
                    className="w-full h-64 object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Hotel Bedroom"
                    className="w-full h-64 object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Hotel Lobby"
                    className="w-full h-48 object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Manager Info */}
        <div className="mt-16 bg-muted/50 rounded-2xl p-8 animate-on-scroll">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold font-playfair mb-4">Meet Our General Manager</h3>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-32 h-32 rounded-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="General Manager"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-xl font-semibold mb-2">Rajesh Kumar</h4>
              <p className="text-primary mb-3">General Manager</p>
              <p className="text-muted-foreground max-w-md">
                "With over 20 years of experience in hospitality management, I ensure that every guest 
                experiences the finest in luxury and comfort. Welcome to Hotel Yuvaan - your home away from home."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
