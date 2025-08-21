import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Users, Utensils, Wine, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const menuHighlights = [
  {
    img: `${import.meta.env.BASE_URL}image/menu/Hotel_Yuvaan_special_thali.jpeg`,
    name: "Hotel Yuvaan Special Thali",
    desc: "A lavish spread of Indian delicacies",
    price: "₹400/-",
  },
  // {
  //   img: `${import.meta.env.BASE_URL}image/menu/mint_mojito.png`,
  //   name: "Mint Mojito",
  //   desc: "Refreshing mocktail with mint and lime",
  //   price: "₹115",
  // },
  {
    img: `${import.meta.env.BASE_URL}image/menu/paneer_tikka.jpeg`,
    name: "Paneer Tikka",
    desc: "Grilled cottage cheese with spices",
    price: "₹250/-",
  },
  {
    img: `${import.meta.env.BASE_URL}image/menu/aloo_paratha.png`,
    name: "Aloo Paratha",
    desc: "Stuffed flatbread served with curd",
    price: "₹115/-",
  },
];

const RestaurantSection = () => {
  const navigate = useNavigate();
  return (
    <section id="restaurant" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Main Restaurant Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Restaurant Image */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="relative group"
          >
            <img
              src={`${import.meta.env.BASE_URL}image/Gallery/Interior.png`}
              alt="Restaurant Interior"
              className="w-full h-96 object-cover rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-500 border border-primary"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl" />
            <div className="absolute bottom-6 left-6 text-white space-y-3">
              <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                <Clock className="w-5 h-5 text-gold-400" />
                <span>Open Daily 7:00 AM - 11:00 PM</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                <Users className="w-5 h-5 text-gold-400" />
                <span>Seating for 80 Guests</span>
              </div>
            </div>
          </motion.div>

          {/* Restaurant Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gold-500 text-sm tracking-widest uppercase mb-4">
              CULINARY EXPERIENCE
            </p>
            <h2 className="text-4xl md:text-5xl font-bold font-playfair mb-6">
              Our <span className="text-gold-500">Restaurant</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              Experience culinary excellence where our chefs craft extraordinary
              dishes using the finest seasonal ingredients.
            </p>

            {/* Restaurant Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                {
                  icon: <Utensils className="w-5 h-5" />,
                  title: "Multi-Cuisine",
                  desc: "Indian & International",
                },
                {
                  icon: <Clock className="w-5 h-5" />,
                  title: "All Day Dining",
                  desc: "7AM - 11PM",
                },
                {
                  icon: <Users className="w-5 h-5" />,
                  title: "Private Dining",
                  desc: "For special occasions",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="p-4 bg-gradient-to-br from-background to-muted/50 rounded-xl border border-muted hover:border-gold-300 transition-all"
                >
                  <div className="w-10 h-10 mb-2 bg-gold-500/10 rounded-lg flex items-center justify-center text-gold-500">
                    {feature.icon}
                  </div>
                  <h4 className="font-semibold">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Booth Seating Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mt-24"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold font-playfair mb-6">
                Intimate <span className="text-gold-500">Booth Dining</span>
              </h3>
              <p className="text-muted-foreground mb-8">
                Our specially designed booths offer privacy and comfort, perfect
                for romantic dinners or small gatherings.
              </p>
              <div className="space-y-4">
                {[
                  "Comfortable cushioned seating",
                  "Perfect for intimate conversations",
                  "Elegant table settings",
                  "Dedicated service",
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-gold-500 rounded-full flex-shrink-0"></div>
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative rounded-2xl overflow-hidden shadow-lg"
            >
              <img
                src={`${
                  import.meta.env.BASE_URL
                }image/Gallery/Restaurant_Booth_Seating.png`}
                alt="Booth Seating"
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 z-20">
                <p className="text-white font-medium">
                  Elegant Dining Experience
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Menu Highlights with Images */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mt-24"
        >
          <div className="text-center mb-12">
            <p className="text-gold-500 text-sm tracking-widest mb-2">
              TASTE THE DIFFERENCE
            </p>
            <h3 className="text-3xl font-bold font-playfair mb-4">
              Menu <span className="text-gold-500">Highlights</span>
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {menuHighlights.map((dish, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="bg-card rounded-xl p-6 text-center border border-muted hover:border-gold-300 transition-all hover:shadow-md"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-gold-300 flex items-center justify-center bg-gold-500/10">
                  <img
                    src={dish.img}
                    alt={dish.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h4 className="text-lg font-semibold mb-2">{dish.name}</h4>
                <p className="text-muted-foreground text-sm mb-3">
                  {dish.desc}
                </p>
                <div className="text-gold-500 font-semibold">{dish.price}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <a
          href="https://drive.google.com/file/d/1o3e9A316SvHd_okVKtFU9J4hAEHLK-xH/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex justify-center mt-12">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-gold-500/10 border border-gold-300 text-gold-600 px-8 py-3 rounded-full font-medium hover:shadow-md transition-all
            hover:bg-gold-500/20 "
            >
              View Full Menu
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </a>
      </div>
    </section>
  );
};

export default RestaurantSection;
