import { usePathname } from "next/navigation";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

/** Reveals `.animate-on-scroll*` elements as they enter the viewport. */
export default function ScrollReveal() {
  const pathname = usePathname();
  useScrollAnimation([pathname]);
  return null;
}
