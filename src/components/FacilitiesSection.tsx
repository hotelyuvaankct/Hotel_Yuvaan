
import React from 'react';
import { Car, Wifi, Coffee, Waves, Utensils, MapPin } from 'lucide-react';

const FacilitiesSection = () => {
  const facilities = [
    {
      icon: Car,
      title: 'Pick Up & Drop',
      description: 'Complimentary airport transfers and local transportation services for your convenience.',
    },
    {
      icon: MapPin,
      title: 'Parking Space',
      description: 'Secure valet parking with 24/7 surveillance for your peace of mind.',
    },
    {
      icon: Utensils,
      title: 'Room Service',
      description: '24/7 in-room dining service with extensive menu options delivered to your door.',
    },
    {
      icon: Waves,
      title: 'Swimming Pool',
      description: 'Refreshing outdoor pool with poolside service and comfortable lounging areas.',
    },
    {
      icon: Wifi,
      title: 'Fibre Internet',
      description: 'High-speed complimentary WiFi throughout the hotel for seamless connectivity.',
    },
    {
      icon: Coffee,
      title: 'Breakfast',
      description: 'Complimentary continental breakfast with fresh, locally sourced ingredients.',
    },
  ];

  return (
    <section id="facilities" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">
            OUR SERVICES
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair mb-6">
            Hotel <span className="text-gradient">Facilities</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience world-class amenities and services designed to make your stay 
            comfortable, convenient, and memorable.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <div 
              key={index}
              className={`bg-card rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 animate-on-scroll-${index % 2 === 0 ? 'left' : 'right'}`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <facility.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-playfair mb-4">{facility.title}</h3>
              <p className="text-muted-foreground">{facility.description}</p>
            </div>
          ))}
        </div>

        {/* Extra Services */}
        <div className="mt-20 animate-on-scroll">
          <div className="text-center mb-12">
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">
              BEST PRICES
            </p>
            <h3 className="text-3xl md:text-4xl font-bold font-playfair mb-6">
              Extra <span className="text-gradient">Services</span>
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Enhance your stay with our premium services designed for the ultimate luxury experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Room Cleaning Service */}
            <div className="bg-card rounded-2xl overflow-hidden shadow-lg">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2">
                  <img 
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Room Cleaning"
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-6">
                  <h4 className="text-xl font-bold font-playfair mb-3">Room Cleaning</h4>
                  <div className="text-2xl font-bold text-primary mb-3">₹500 <span className="text-sm text-muted-foreground">/ month</span></div>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Daily housekeeping service
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Fresh linen and towels
                    </li>
                    <li className="flex items-center">
                      <span className="text-red-500 mr-2">✗</span>
                      Premium amenities not included
                    </li>
                  </ul>
                  <button className="w-full bg-primary text-primary-foreground py-2 rounded-full hover:bg-primary/90 transition-colors duration-300">
                    Add Service
                  </button>
                </div>
              </div>
            </div>

            {/* Drinks Package */}
            <div className="bg-card rounded-2xl overflow-hidden shadow-lg">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2">
                  <img 
                    src="https://images.unsplash.com/photo-1551538827-9c037cb4f32a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Drinks Package"
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-6">
                  <h4 className="text-xl font-bold font-playfair mb-3">Drinks Included</h4>
                  <div className="text-2xl font-bold text-primary mb-3">₹800 <span className="text-sm text-muted-foreground">/ daily</span></div>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Premium beverages included
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Mini bar access
                    </li>
                    <li className="flex items-center">
                      <span className="text-red-500 mr-2">✗</span>
                      Limited premium spirits
                    </li>
                  </ul>
                  <button className="w-full bg-primary text-primary-foreground py-2 rounded-full hover:bg-primary/90 transition-colors duration-300">
                    Add Package
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact for Information */}
          <div className="text-center mt-12 p-8 bg-primary/5 rounded-2xl">
            <h4 className="text-xl font-bold font-playfair mb-4">Need More Information?</h4>
            <p className="text-muted-foreground mb-6">
              Contact our concierge team for customized service packages and special arrangements.
            </p>
            <div className="flex items-center justify-center space-x-4 text-primary">
              <span className="text-lg">📞</span>
              <span className="text-lg font-semibold">+91 98765 43210</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
