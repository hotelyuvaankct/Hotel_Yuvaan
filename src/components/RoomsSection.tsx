
import React from 'react';
import { Users, Bed, Wifi, Coffee, Car, Utensils } from 'lucide-react';

const RoomsSection = () => {
  const rooms = [
    {
      id: 1,
      name: 'Deluxe Room',
      price: '₹3,500',
      image: `${import.meta.env.BASE_URL}lovable-uploads/ae4f399e-f0ff-45fb-a484-1d158f263e96.png`,
      description: 'Spacious and elegantly designed rooms with modern amenities, premium ceiling lighting, and comfortable seating area.',
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
      name: 'Premium Room',
      price: '₹4,200',
      image: `${import.meta.env.BASE_URL}lovable-uploads/76432058-40b3-4a31-8dc7-b01418fbbdf2.png`,
      description: 'Luxurious room with premium furnishings, elegant false ceiling design, and modern amenities for the discerning guest.',
      amenities: ['1-2 Persons', 'King Bed', 'Premium Amenities', 'City View', 'AC'],
      features: [
        { icon: Users, text: '1-2 Persons' },
        { icon: Bed, text: 'King Bed' },
        { icon: Wifi, text: 'Free WiFi' },
        { icon: Coffee, text: 'Breakfast' },
      ]
    },
    {
      id: 3,
      name: 'Twin Bed Room',
      price: '₹3,800',
      image: `${import.meta.env.BASE_URL}lovable-uploads/e1bd4780-5fe7-43f8-beaf-b87d78c0600f.png`,
      description: 'Perfect for friends or colleagues, featuring two comfortable beds with elegant interiors and modern conveniences.',
      amenities: ['2-3 Persons', 'Twin Beds', 'Premium Lighting', 'Modern Decor', 'AC'],
      features: [
        { icon: Users, text: '2-3 Persons' },
        { icon: Bed, text: 'Twin Beds' },
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
            HOTEL YUVAAN LUXURY ACCOMMODATION
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair mb-6">
            Rooms & <span className="text-gradient">Suites</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience luxury and comfort in our elegantly designed rooms,
            each offering premium amenities and exceptional service with modern interiors.
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <div
              key={room.id}
              className={`bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 animate-on-scroll-${index % 2 === 0 ? 'left' : 'right'}`}
              style={{ animationDelay: `${index * 0.2}s` }}
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
