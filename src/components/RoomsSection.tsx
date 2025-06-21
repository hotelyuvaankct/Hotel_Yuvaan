
import React from 'react';
import { Users, Bed, Wifi, Coffee, Car, Utensils } from 'lucide-react';

const RoomsSection = () => {
  const rooms = [
    {
      id: 1,
      name: 'Deluxe Room',
      price: '₹3,500',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Spacious and elegantly designed rooms with modern amenities and city views.',
      amenities: ['1-2 Persons', 'King Bed', 'Free WiFi', 'Breakfast', 'AC'],
      features: [
        { icon: Users, text: '1-2 Persons' },
        { icon: Bed, text: 'King Bed' },
        { icon: Wifi, text: 'Free WiFi' },
        { icon: Coffee, text: 'Breakfast' },
      ]
    },
    {
      id: 2,
      name: 'Junior Suite',
      price: '₹5,200',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Luxurious suites with separate living area, premium furnishings and panoramic views.',
      amenities: ['1-2 Persons', 'King Bed', 'Living Area', 'Premium Amenities', 'City View'],
      features: [
        { icon: Users, text: '1-2 Persons' },
        { icon: Bed, text: 'King Bed' },
        { icon: Wifi, text: 'Free WiFi' },
        { icon: Coffee, text: 'Breakfast' },
      ]
    },
    {
      id: 3,
      name: 'Presidential Suite',
      price: '₹8,500',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Ultimate luxury experience with private balcony, premium services and exclusive amenities.',
      amenities: ['2-4 Persons', 'Master Bedroom', 'Private Balcony', 'Butler Service', 'Exclusive Access'],
      features: [
        { icon: Users, text: '2-4 Persons' },
        { icon: Bed, text: 'Master Suite' },
        { icon: Wifi, text: 'Free WiFi' },
        { icon: Utensils, text: 'Room Service' },
      ]
    }
  ];

  return (
    <section id="rooms" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">
            HOTEL YUVAAN LUXURY HOTEL
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair mb-6">
            Rooms & <span className="text-gradient">Suites</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience luxury and comfort in our elegantly designed rooms and suites, 
            each offering premium amenities and exceptional service.
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <div 
              key={room.id} 
              className={`bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 animate-on-scroll-${index % 2 === 0 ? 'left' : 'right'}`}
              style={{animationDelay: `${index * 0.2}s`}}
            >
              {/* Room Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={room.image}
                  alt={room.name}
                  className="w-full h-64 object-cover hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  {room.price} / Night
                </div>
              </div>

              {/* Room Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold font-playfair mb-3">{room.name}</h3>
                <p className="text-muted-foreground mb-4">{room.description}</p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {room.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2 text-sm">
                      <feature.icon className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex space-x-3">
                  <button className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-full hover:bg-primary/90 transition-colors duration-300 text-sm font-semibold">
                    BOOK NOW
                  </button>
                  <button className="border border-primary text-primary py-2 px-4 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-300 text-sm font-semibold">
                    DETAILS →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoomsSection;
