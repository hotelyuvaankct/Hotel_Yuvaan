import { Clock, Users, Utensils, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "./SectionHeader";

const menuHighlights = [
  {
    img: `/image/menu/Hotel_Yuvaan_special_thali.jpeg`,
    name: "Hotel Yuvaan Special Thali",
    desc: "A lavish spread of Indian delicacies",
    price: "₹400/-",
  },
  {
    img: `/image/menu/paneer_tikka.jpeg`,
    name: "Paneer Tikka",
    desc: "Grilled cottage cheese with spices",
    price: "₹250/-",
  },
  {
    img: `/image/menu/aloo_paratha.png`,
    name: "Aloo Paratha",
    desc: "Stuffed flatbread served with curd",
    price: "₹115/-",
  },
];

export default function RestaurantSection() {
  return (
    <section id="restaurant" className="pt-10 md:pt-12 pb-16 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative group">
            <img
              src={`/image/Gallery/Interior.png`}
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
          </div>

          <div>
            <SectionHeader
              align="left"
              animate={false}
              className="mb-6"
              eyebrow="CULINARY EXPERIENCE"
              title="Our"
              highlight="Restaurant"
              description="Experience culinary excellence where our chefs craft extraordinary dishes using the finest seasonal ingredients."
            />

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
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="p-4 rounded-xl border border-border hover:border-gold-300 transition-colors"
                >
                  <div className="w-10 h-10 mb-2 bg-gold-500/10 rounded-lg flex items-center justify-center text-gold-500">
                    {feature.icon}
                  </div>
                  <h4 className="font-semibold">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-24">
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
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gold-500 rounded-full flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <img
                src={`/image/Gallery/Restaurant_Booth_Seating.png`}
                alt="Booth Seating"
                className="w-full h-80 object-cover"
              />
              <div className="absolute bottom-4 left-4 z-20">
                <p className="text-white font-medium">Elegant Dining Experience</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <SectionHeader
            as="h3"
            animate={false}
            className="mb-12"
            eyebrow="TASTE THE DIFFERENCE"
            title="Menu"
            highlight="Highlights"
          />

          <div className="grid md:grid-cols-3 gap-6">
            {menuHighlights.map((dish) => (
              <div
                key={dish.name}
                className="rounded-xl p-6 text-center border border-border hover:border-gold-300 transition-colors hover:shadow-md"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-gold-300 flex items-center justify-center bg-gold-500/10">
                  <img
                    src={dish.img}
                    alt={dish.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h4 className="text-lg font-semibold mb-2">{dish.name}</h4>
                <p className="text-muted-foreground text-sm mb-3">{dish.desc}</p>
                <div className="text-gold-500 font-semibold">{dish.price}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <Button asChild variant="outline">
            <a
              href="https://drive.google.com/file/d/1o3e9A316SvHd_okVKtFU9J4hAEHLK-xH/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Full Menu
              <ChevronRight className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
