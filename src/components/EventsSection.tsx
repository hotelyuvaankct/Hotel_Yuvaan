
import React from 'react';
import { Calendar, Users, Camera, Music } from 'lucide-react';

const EventsSection = () => {
  const events = [
    {
      id: 1,
      category: 'RESTAURANT',
      title: 'Historic Restaurant Renovated',
      date: 'DEC 02',
      image: `${import.meta.env.BASE_URL}assets/images/events/event-1.jpg`,
      description: 'Grand reopening of our historic restaurant featuring new contemporary design while preserving the classic elegance.',
    },
    {
      id: 2,
      category: 'SPA',
      title: 'Benefits of Spa Treatments',
      date: 'DEC 04',
      image: `${import.meta.env.BASE_URL}assets/images/events/event-2.jpg`,
      description: 'Wellness workshop focusing on the therapeutic benefits of our signature spa treatments and relaxation techniques.',
    },
    {
      id: 3,
      category: 'ROOMS',
      title: 'Hotel Room Collections',
      date: 'DEC 06',
      image: `${import.meta.env.BASE_URL}assets/images/events/event-3.jpg`,
      description: 'Showcase of our newly designed luxury suite collections featuring premium amenities and modern furnishings.',
    },
  ];

  const upcomingEvents = [
    {
      title: 'New Year Gala Dinner',
      date: 'December 31, 2024',
      time: '7:00 PM',
      venue: 'Grand Ballroom',
      icon: Music,
    },
    {
      title: 'Corporate Networking Event',
      date: 'January 15, 2025',
      time: '6:00 PM',
      venue: 'Conference Hall',
      icon: Users,
    },
    {
      title: 'Food Festival',
      date: 'February 14, 2025',
      time: '12:00 PM',
      venue: 'Restaurant',
      icon: Camera,
    },
  ];

  return (
    <section id="events" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">
            EVENTS & NEWS
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair mb-6">
            Recent <span className="text-gradient">Events</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated with our latest events, celebrations, and special announcements
            from Hotel Yuvaan.
          </p>
        </div>

        {/* Recent Events */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {events.map((event, index) => (
            <div
              key={event.id}
              className={`bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 animate-on-scroll-${index % 2 === 0 ? 'left' : 'right'}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Event Image */}
              <div className="relative overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-64 object-cover hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  {event.date}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-white text-xs font-semibold">{event.category}</span>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold font-playfair mb-3">{event.title}</h3>
                <p className="text-muted-foreground mb-4">{event.description}</p>
                <button className="text-primary font-semibold hover:text-primary/80 transition-colors duration-300">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Events */}
        {/* <div className="animate-on-scroll">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold font-playfair mb-4">
              Upcoming <span className="text-gradient">Events</span>
            </h3>
            <p className="text-muted-foreground">Join us for these exciting upcoming events and celebrations</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="bg-card rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <event.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-2">{event.title}</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {event.date}
                      </div>
                      <div>Time: {event.time}</div>
                      <div>Venue: {event.venue}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 p-8 bg-primary/5 rounded-2xl">
            <h4 className="text-xl font-bold font-playfair mb-4">Host Your Event With Us</h4>
            <p className="text-muted-foreground mb-6">
              From intimate gatherings to grand celebrations, our event spaces and professional 
              team ensure your special occasion is memorable.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-full hover:bg-primary/90 transition-colors duration-300">
                Book Event Space
              </button>
              <button className="border border-primary text-primary px-8 py-3 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-300">
                View Packages
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default EventsSection;
