
import React from 'react';
import { Clock, Users, Utensils, Wine } from 'lucide-react';

const RestaurantSection = () => {
  return (
    <section id="restaurant" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Restaurant Image */}
          <div className="animate-on-scroll-left">
            <div className="relative">
              <img 
                src="/lovable-uploads/c7c6b323-a530-4b70-afc9-7b417923c3eb.png"
                alt="Restaurant Interior"
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />
              <div className="absolute bottom-6 left-6 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Open Daily 7:00 AM - 11:00 PM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Seating for 80 Guests</span>
                </div>
              </div>
            </div>
          </div>

          {/* Restaurant Content */}
          <div className="animate-on-scroll-right">
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">
              DISCOVER
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair mb-6">
              The <span className="text-gradient">Restaurant</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              Experience culinary excellence at our signature restaurant, where our master chefs 
              create extraordinary dishes using the finest ingredients. Our modern dining space 
              features elegant grey seating and warm wooden tables, perfect for any occasion.
            </p>
            <p className="text-muted-foreground mb-8">
              From traditional Indian cuisine to international delicacies, every meal is a journey 
              of flavors. Our contemporary design with comfortable booth seating creates the perfect 
              ambiance for intimate dinners, business meetings, or special celebrations.
            </p>

            {/* Restaurant Features */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Utensils className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Multi-Cuisine</h4>
                  <p className="text-sm text-muted-foreground">Indian, Chinese, Continental</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Wine className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Premium Beverages</h4>
                  <p className="text-sm text-muted-foreground">Fresh juices & beverages</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Extended Hours</h4>
                  <p className="text-sm text-muted-foreground">7:00 AM - 11:00 PM Daily</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Comfortable Seating</h4>
                  <p className="text-sm text-muted-foreground">Modern booth & table dining</p>
                </div>
              </div>
            </div>

            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-full hover:bg-primary/90 transition-colors duration-300 font-semibold">
              VIEW MENU
            </button>
          </div>
        </div>

        {/* Booth Seating Section */}
        <div className="mt-16 animate-on-scroll">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold font-playfair mb-4">
                Intimate <span className="text-gradient">Booth Dining</span>
              </h3>
              <p className="text-muted-foreground mb-6">
                Enjoy privacy and comfort in our specially designed booth seating areas. 
                Perfect for couples, families, or small groups looking for a more intimate dining experience.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Comfortable cushioned seating</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Perfect for intimate conversations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Modern table settings</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/lovable-uploads/a71224d5-7cb8-434b-b7ab-4fa48cb13072.png"
                alt="Booth Seating"
                className="w-full h-80 object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Menu Highlights */}
        <div className="mt-16 animate-on-scroll">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold font-playfair mb-4">
              Signature <span className="text-gradient">Dishes</span>
            </h3>
            <p className="text-muted-foreground">Taste the finest culinary creations by our expert chefs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🍛</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Royal Biryani</h4>
              <p className="text-muted-foreground text-sm mb-3">Aromatic basmati rice with tender meat and exotic spices</p>
              <div className="text-primary font-semibold">₹450</div>
            </div>
            
            <div className="bg-card rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🥘</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Butter Chicken</h4>
              <p className="text-muted-foreground text-sm mb-3">Creamy tomato-based curry with tender chicken pieces</p>
              <div className="text-primary font-semibold">₹380</div>
            </div>
            
            <div className="bg-card rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🍰</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Gulab Jamun</h4>
              <p className="text-muted-foreground text-sm mb-3">Traditional Indian dessert in aromatic sugar syrup</p>
              <div className="text-primary font-semibold">₹180</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantSection;
