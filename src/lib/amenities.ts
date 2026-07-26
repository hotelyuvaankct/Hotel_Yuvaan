import {
  Bath,
  Coffee,
  ConciergeBell,
  Croissant,
  DoorOpen,
  Droplets,
  Fan,
  Flame,
  Lock,
  Mountain,
  ParkingCircle,
  Phone,
  Refrigerator,
  Shirt,
  ShowerHead,
  Snowflake,
  Sparkles,
  Tv,
  Utensils,
  Volume2,
  Wifi,
  Wind,
  Wine,
  type LucideIcon,
} from "lucide-react";

/**
 * Canonical amenity codes shared with the database, backend and backoffice.
 * The backend stores these codes in the room_types.amenities JSONB array;
 * the website maps each code to a display label and icon.
 */
export type AmenityMeta = {
  label: string;
  icon: LucideIcon;
};

const AMENITY_META: Record<string, AmenityMeta> = {
  PRIVATE_BATHROOM: { label: "Private bathroom", icon: DoorOpen },
  SHOWER: { label: "Shower", icon: ShowerHead },
  BATHTUB: { label: "Bathtub", icon: Bath },
  TOWELS: { label: "Towels", icon: Droplets },
  HAIR_DRYER: { label: "Hair dryer", icon: Wind },
  TOILETRIES: { label: "Toiletries", icon: Sparkles },
  AIR_CONDITIONING: { label: "Air conditioning", icon: Snowflake },
  HEATING: { label: "Heating", icon: Flame },
  FAN: { label: "Fan", icon: Fan },
  SOUNDPROOFING: { label: "Soundproofing", icon: Volume2 },
  WARDROBE: { label: "Wardrobe", icon: Shirt },
  BALCONY: { label: "Balcony", icon: Mountain },
  WIFI_FREE: { label: "Wi-Fi [free]", icon: Wifi },
  SATELLITE_CABLE_CHANNELS: { label: "Satellite/cable channels", icon: Tv },
  TELEPHONE: { label: "Telephone", icon: Phone },
  COFFEE_TEA_MAKER: { label: "Coffee/tea maker", icon: Coffee },
  REFRIGERATOR: { label: "Refrigerator", icon: Refrigerator },
  MINIBAR: { label: "Minibar", icon: Wine },
  BREAKFAST: { label: "Breakfast", icon: Croissant },
  KITCHENETTE: { label: "Kitchenette", icon: Utensils },
  ROOM_SERVICE: { label: "Room service", icon: ConciergeBell },
  SAFE: { label: "Safe", icon: Lock },
  FREE_PARKING: { label: "Free parking", icon: ParkingCircle },
};

// Legacy / alternate spellings that should resolve to a canonical code.
const ALIAS_TO_CODE: Record<string, string> = {
  ...Object.fromEntries(
    Object.entries(AMENITY_META).map(([code, meta]) => [meta.label.toLowerCase(), code])
  ),
  wifi: "WIFI_FREE",
  "wi-fi": "WIFI_FREE",
  "free wifi": "WIFI_FREE",
  ac: "AIR_CONDITIONING",
  tv: "SATELLITE_CABLE_CHANNELS",
  television: "SATELLITE_CABLE_CHANNELS",
  satellite: "SATELLITE_CABLE_CHANNELS",
  hairdryer: "HAIR_DRYER",
  bathroom: "PRIVATE_BATHROOM",
  closet: "WARDROBE",
  kettle: "COFFEE_TEA_MAKER",
  "coffee maker": "COFFEE_TEA_MAKER",
  "mini bar": "MINIBAR",
  parking: "FREE_PARKING",
};

function resolveCode(value: string): string | null {
  const trimmed = value.trim();
  if (AMENITY_META[trimmed]) return trimmed;
  const upper = trimmed.toUpperCase().replace(/[^A-Z0-9]+/g, "_");
  if (AMENITY_META[upper]) return upper;
  return ALIAS_TO_CODE[trimmed.toLowerCase()] ?? null;
}

/** Display label for a stored value (known code/alias -> label; custom -> as-is). */
export function getAmenityLabel(value: string): string {
  const code = resolveCode(value);
  return code ? AMENITY_META[code].label : value.trim();
}

/** Icon for a stored value, falling back to a generic icon for custom values. */
export function getAmenityIcon(value: string): LucideIcon {
  const code = resolveCode(value);
  return code ? AMENITY_META[code].icon : Sparkles;
}
