
import React, { useState } from 'react';
import { X } from 'lucide-react';

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryImages = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Hotel Exterior',
      category: 'Hotel'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Luxury Room',
      category: 'Rooms'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Restaurant Interior',
      category: 'Restaurant'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Hotel Suite',
      category: 'Rooms'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Hotel Lobby',
      category: 'Hotel'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Spa Center',
      category: 'Spa'
    },
    {
      id: 7,
      src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Swimming Pool',
      category: 'Facilities'
    },
    {
      id: 8,
      src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Presidential Suite',
      category: 'Rooms'
    },
    {
      id: 9,
      src: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Fine Dining',
      category: 'Restaurant'
    }
  ];

  return (
    <section id="gallery" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">
            VISUAL EXPERIENCE
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-playfair mb-6">
            Hotel <span className="text-gradient">Gallery</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Take a visual tour of our luxurious facilities, elegant rooms, fine dining spaces, 
            and world-class amenities.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div 
              key={image.id}
              className={`relative group overflow-hidden rounded-2xl cursor-pointer animate-on-scroll-${index % 2 === 0 ? 'left' : 'right'}`}
              style={{animationDelay: `${index * 0.1}s`}}
              onClick={() => setSelectedImage(image.src)}
            >
              <img 
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-sm font-semibold">{image.alt}</div>
                <div className="text-xs text-white/80">{image.category}</div>
              </div>
              <div className="absolute inset-0 ring-2 ring-primary ring-opacity-0 group-hover:ring-opacity-100 transition-all duration-300 rounded-2xl" />
            </div>
          ))}
        </div>

        {/* Gallery Categories */}
        <div className="mt-16 animate-on-scroll">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold font-playfair mb-4">Explore by Category</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {['All', 'Hotel', 'Rooms', 'Restaurant', 'Spa', 'Facilities'].map((category) => (
              <button 
                key={category}
                className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Virtual Tour CTA */}
        <div className="mt-16 text-center p-8 bg-muted/50 rounded-2xl animate-on-scroll">
          <h3 className="text-2xl font-bold font-playfair mb-4">Take a Virtual Tour</h3>
          <p className="text-muted-foreground mb-6">
            Experience Hotel Yuvaan from the comfort of your home with our immersive 360° virtual tour.
          </p>
          <button className="bg-primary text-primary-foreground px-8 py-3 rounded-full hover:bg-primary/90 transition-colors duration-300">
            Start Virtual Tour
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={selectedImage}
              alt="Gallery Image"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
