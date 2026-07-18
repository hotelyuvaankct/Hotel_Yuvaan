import { Wifi, Coffee, Waves, Utensils, MapPin } from 'lucide-react';
import SectionHeader from './SectionHeader';

const FacilitiesSection = () => {
  const facilities = [
    // {
    //   icon: Car,
    //   title: 'Pick Up & Drop',
    //   description: 'Complimentary airport transfers and local transportation services for your convenience.',
    // },
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
      title: 'Internet',
      description: 'High-speed complimentary WiFi throughout the hotel for seamless connectivity.',
    },
    {
      icon: Coffee,
      title: 'Breakfast',
      description: 'Complimentary continental breakfast with fresh, locally sourced ingredients.',
    },
  ];

  return (
    <section id="facilities" className="py-12 sm:py-16 md:py-24">
      <div className="container mx-auto px-3 min-[380px]:px-4">
        <SectionHeader
          eyebrow="OUR SERVICES"
          title="Hotel"
          highlight="Facilities"
          description="Experience world-class amenities and services designed to make your stay comfortable, convenient, and memorable."
        />

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-3.5 min-[380px]:gap-5 md:gap-8">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className={`bg-card rounded-xl min-[380px]:rounded-2xl p-4 min-[380px]:p-6 sm:p-8 text-center hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2 animate-on-scroll-${index % 2 === 0 ? 'left' : 'right'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mx-auto mb-3 flex h-12 w-12 min-[380px]:mb-5 min-[380px]:h-14 min-[380px]:w-14 sm:mb-6 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary/10">
                <facility.icon className="h-6 w-6 min-[380px]:h-7 min-[380px]:w-7 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-bold font-playfair min-[380px]:mb-3 min-[380px]:text-xl sm:mb-4">
                {facility.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground min-[380px]:text-sm sm:text-base">
                {facility.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
