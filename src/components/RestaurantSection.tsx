import { Clock, Users, Utensils, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "./SectionHeader";

const menuHighlights = [
  {
    img: `/image/menu/Hotel_Yuvaan_special_thali.jpeg`,
    name: "Hotel Yuvaan Special Thali",
    desc: "A lavish spread of Indian delicacies",
  },
  {
    img: `/image/menu/paneer_tikka.jpeg`,
    name: "Paneer Tikka",
    desc: "Grilled cottage cheese with spices",
  },
  {
    img: `/image/menu/aloo_paratha.png`,
    name: "Aloo Paratha",
    desc: "Stuffed flatbread served with curd",
  },
];

const diningFeatures = [
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
];

const boothPerks = [
  "Comfortable cushioned seating",
  "Perfect for intimate conversations",
  "Elegant table settings",
  "Dedicated service",
];

const scrollDelays = [
  "scroll-delay-1",
  "scroll-delay-2",
  "scroll-delay-3",
  "scroll-delay-4",
] as const;

export default function RestaurantSection() {
  return (
    <section id="restaurant" className="pt-10 md:pt-12 pb-16 md:pb-24">
      <div className="container mx-auto px-4">
        {/* Our Restaurant */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative group overflow-hidden rounded-2xl animate-on-scroll-left">
            <img
              src={`/image/Gallery/Interior.png`}
              alt="Restaurant Interior"
              className="block w-full h-64 min-[380px]:h-80 sm:h-96 object-cover shadow-lg group-hover:shadow-xl transition-shadow duration-500 border border-primary rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-auto text-white space-y-2">
              <div className="flex w-fit max-w-full items-center gap-1.5 sm:gap-2 bg-black/45 backdrop-blur-sm px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] leading-snug sm:text-sm">
                <Clock className="h-3.5 w-3.5 shrink-0 text-gold-400 sm:h-5 sm:w-5" />
                <span className="min-w-0">
                  <span className="sm:hidden">7:00 AM – 11:00 PM</span>
                  <span className="hidden sm:inline">Open Daily 7:00 AM - 11:00 PM</span>
                </span>
              </div>
              <div className="flex w-fit max-w-full items-center gap-1.5 sm:gap-2 bg-black/45 backdrop-blur-sm px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] leading-snug sm:text-sm">
                <Users className="h-3.5 w-3.5 shrink-0 text-gold-400 sm:h-5 sm:w-5" />
                <span className="min-w-0">
                  <span className="sm:hidden">80 Guests</span>
                  <span className="hidden sm:inline">Seating for 80 Guests</span>
                </span>
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

            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3 sm:gap-4 mb-8">
              {diningFeatures.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`p-3 sm:p-4 rounded-xl border border-border hover:border-gold-300 transition-colors animate-on-scroll ${scrollDelays[index]}`}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 mb-2 bg-gold-500/10 rounded-lg flex items-center justify-center text-gold-500">
                    {feature.icon}
                  </div>
                  <h4 className="font-semibold text-sm sm:text-base">{feature.title}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Intimate Booth Dining */}
        <div className="mt-14 sm:mt-20 md:mt-24">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            <div className="min-w-0">
              <h3 className="text-xl min-[360px]:text-2xl sm:text-3xl font-bold font-playfair mb-3 sm:mb-6 leading-snug animate-on-scroll-left">
                Intimate{" "}
                <span className="text-gold-500">Booth Dining</span>
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-5 sm:mb-8 leading-relaxed animate-on-scroll scroll-delay-1">
                Our specially designed booths offer privacy and comfort, perfect
                for romantic dinners or small gatherings.
              </p>
              <div className="space-y-2.5 sm:space-y-4">
                {boothPerks.map((item, index) => (
                  <div
                    key={item}
                    className={`flex items-start gap-2.5 sm:gap-3 animate-on-scroll ${scrollDelays[Math.min(index + 1, 3)]}`}
                  >
                    <div className="mt-1.5 w-1.5 h-1.5 sm:mt-2 sm:w-2 sm:h-2 bg-gold-500 rounded-full flex-shrink-0" />
                    <span className="text-sm sm:text-base leading-snug min-w-0">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg animate-on-scroll-right scroll-delay-1">
              <img
                src={`/image/Gallery/Restaurant_Booth_Seating.png`}
                alt="Booth Seating"
                className="block w-full h-48 min-[360px]:h-56 min-[380px]:h-72 sm:h-80 object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent pt-10 pb-3 px-3 sm:pt-12 sm:pb-4 sm:px-4 z-20">
                <p className="text-white font-medium text-xs min-[360px]:text-sm sm:text-base drop-shadow">
                  Elegant Dining Experience
                </p>
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
            {menuHighlights.map((dish, index) => (
              <div
                key={dish.name}
                className={`rounded-xl p-6 text-center border border-border hover:border-gold-300 transition-colors hover:shadow-md animate-on-scroll ${scrollDelays[index % 4]}`}
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-gold-300 flex items-center justify-center bg-gold-500/10">
                  <img
                    src={dish.img}
                    alt={dish.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h4 className="text-lg font-semibold mb-2">{dish.name}</h4>
                <p className="text-muted-foreground text-sm">{dish.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-12 animate-on-scroll">
          <Button
            asChild
            variant="outline"
            className="h-9 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm"
          >
            <a
              href="https://drive.google.com/file/d/1o3e9A316SvHd_okVKtFU9J4hAEHLK-xH/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Full Menu
              <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
