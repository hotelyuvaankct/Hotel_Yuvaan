import { useQuery } from "@tanstack/react-query";
import {
  buildContactDisplay,
  fetchAppConfig,
  type ContactDisplay,
} from "@/services/configService";

export function useAppConfig() {
  return useQuery({
    queryKey: ["app-config"],
    queryFn: async (): Promise<ContactDisplay> => {
      const config = await fetchAppConfig();
      return buildContactDisplay(config);
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
