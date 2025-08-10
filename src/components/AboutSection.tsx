import React from "react";
import {
  Award,
  Users,
  Clock,
  MapPin,
  PhoneCall,
  ChevronRight,
} from "lucide-react";

const AboutSection = () => {
  return (
    <section
      id="about"
      className="py-16 md:py-24 bg-background relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gold-500/10 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-on-scroll-left">
            <div className="relative inline-block mb-6">
              <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4 relative z-10">
                HOTEL YUVAAN LUXURY HOTEL
              </p>
              <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-gold-500 to-gold-300 rounded-full"></div>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair mb-8 text-foreground relative">
              <span className="relative z-10">
                Enjoy a Luxury
                <br />
                <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-gold-600 via-gold-500 to-gold-300">
                  Experience
                </span>
              </span>
              <span className="absolute -bottom-2 left-0 text-8xl opacity-5 font-bold text-gold-500 select-none">
                Luxury
              </span>
            </h2>

            <div className="space-y-4 text-muted-foreground mb-8 relative">
              <div className="absolute -left-8 top-0 h-full w-1 bg-gradient-to-b from-gold-500 to-transparent rounded-full"></div>
              <p className="relative pl-4">
                Welcome to the finest five-star deluxe hotel in the heart of the
                city.{" "}
                <span className="font-medium text-foreground">
                  Hotel Yuvaan
                </span>{" "}
                offers unparalleled luxury and comfort with world-class
                amenities and exceptional hospitality that creates unforgettable
                memories for our distinguished guests.
              </p>

              <p className="relative pl-4">
                Our exquisite hotel features elegantly appointed rooms and
                suites, each meticulously designed with contemporary furnishings
                and premium amenities. Experience fine dining at our signature
                restaurant, rejuvenate at our award-winning spa, or host your
                special events in our sophisticated venues.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[
                {
                  value: "16+",
                  label: "Luxury Rooms",
                  icon: <Award className="w-5 h-5 text-gold-500" />,
                },
                {
                  value: "2+",
                  label: "Years Experience",
                  icon: <Clock className="w-5 h-5 text-gold-500" />,
                },
                {
                  value: "1000+",
                  label: "Happy Guests",
                  icon: <Users className="w-5 h-5 text-gold-500" />,
                },
                {
                  value: "24/7",
                  label: "Service",
                  icon: <PhoneCall className="w-5 h-5 text-gold-500" />,
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-background to-muted/50 p-4 rounded-xl border border-muted hover:border-gold-300 transition-all hover:shadow-lg"
                >
                  <div className="flex items-center justify-center mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gold-600 to-gold-400 rounded-lg w-fit animate-fade-in-up group hover:shadow-gold hover:shadow-lg transition-all">
                <span className="bg-white/20 text-white p-2 rounded-full flex items-center justify-center">
                  <PhoneCall size={18} strokeWidth={2} />
                </span>
                <span className="text-sm text-white font-semibold">
                  +91 87695675067
                </span>
                <ChevronRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-1" />
              </div>

              <div
                className="flex items-center gap-3 px-4 py-3 bg-muted rounded-lg border border-gold-300/30 w-fit animate-fade-in-up group hover:bg-gold-500/10 hover:border-gold-400/50 transition-all"
                onClick={() =>
                  window.open(
                    "https://maps.app.goo.gl/ahJTic7MDcnBXHjy8",
                    "_blank"
                  )
                }
              >
                <MapPin className="w-5 h-5 text-gold-500" />
                <span className="text-sm text-foreground font-medium">
                  View Location
                </span>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="animate-on-scroll-right relative">
            <div className="absolute -top-8 -right-8 w-32 h-32 border-2 border-gold-400 rounded-lg opacity-30"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 border-2 border-gold-400 rounded-full opacity-30"></div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-xl group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
                  <img
                    src={`${import.meta.env.BASE_URL}image/About/reception.png`}
                    alt="Hotel reception"
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <p className="text-white font-medium">Grand Lobby</p>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-xl group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
                  <img
                    src={`${
                      import.meta.env.BASE_URL
                    }image/About/restaurant.png`}
                    alt="Hotel restaurant"
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <p className="text-white font-medium">Gourmet Dining</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 mt-12">
                <div className="relative overflow-hidden rounded-xl group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
                  <img
                    src={`${
                      import.meta.env.BASE_URL
                    }image/About/family_table.png`}
                    alt="Hotel family table"
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <p className="text-white font-medium">Family Experience</p>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-xl group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
                  <img
                    src={`${import.meta.env.BASE_URL}image/About/room.png`}
                    alt="Hotel room"
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <p className="text-white font-medium">Luxury Suite</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Manager Info */}
        {/* <div className="mt-24 bg-gradient-to-br from-background to-muted/30 rounded-2xl p-8 animate-on-scroll relative overflow-hidden border border-gold-200/20">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-gold-500/10 rounded-full filter blur-xl"></div>

          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center px-6 py-2 bg-gold-500/10 rounded-full mb-4">
              <span className="text-gold-500 text-sm font-medium uppercase tracking-wider">
                Leadership
              </span>
            </div>
            <h3 className="text-3xl font-bold font-playfair mb-4">
              Meet Our <span className="text-gold-500">General Manager</span>
            </h3>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-12 relative z-10">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-gold-300 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="General Manager"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gold-500/10"></div>
            </div>

            <div className="text-center md:text-left max-w-md">
              <div className="mb-3">
                <h4 className="text-2xl font-semibold mb-1">Rajesh Kumar</h4>
                <p className="text-gold-500 font-medium">General Manager</p>
              </div>

              <div className="relative">
                <div className="absolute -left-4 top-0 h-full w-1 bg-gold-500 rounded-full"></div>
                <p className="text-muted-foreground pl-4 italic">
                  "With over 20 years of excellence in hospitality management, I
                  ensure every guest experiences the pinnacle of luxury and
                  comfort. At Hotel Yuvaan, we don't just meet expectations—we
                  transcend them."
                </p>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-gold-500 text-sm">
                    ★
                  </span>
                ))}
                <span className="text-sm text-muted-foreground ml-1">
                  TripAdvisor
                </span>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default AboutSection;
