interface GalleryCardProps {
  imageUrl: string;
  category: string;
  index: number;
}

export default function GalleryCard({
  imageUrl,
  category,
  index,
}: GalleryCardProps) {
  return (
    <div
      className={`relative group overflow-hidden rounded-2xl animate-on-scroll-${
        index % 2 === 0 ? "left" : "right"
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <img
        src={imageUrl}
        alt={category}
        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-4 left-4 text-white">
        <div className="text-sm font-semibold">{category}</div>
      </div>
      <div className="absolute inset-0 ring-2 ring-primary ring-opacity-0 group-hover:ring-opacity-100 transition-all duration-300 rounded-2xl" />
    </div>
  );
}
