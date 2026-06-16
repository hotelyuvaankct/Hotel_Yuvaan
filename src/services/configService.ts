import { getConfigApiUrl } from "@/lib/constants";
import { DEFAULT_APP_CONFIG } from "@/data/defaultAppConfig";

export interface AppConfig {
  supportEmail: string;
  contactPhone: string;
  contactPhoneLabel: string;
  addressLine1: string;
  addressLine2: string;
  fullAddress: string;
  mapsEmbedUrl: string;
  mapsLinkUrl: string;
  socialLinks: Record<string, string>;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const MAX_FETCH_ATTEMPTS = 2;

async function fetchAppConfigOnce(): Promise<AppConfig> {
  const response = await fetch(getConfigApiUrl());

  const body: ApiResponse<AppConfig> = await response.json().catch(() => ({
    success: false,
    data: {} as AppConfig,
  }));

  if (!response.ok || !body.success) {
    throw new Error(body.message ?? "Failed to load website configuration");
  }

  return body.data;
}

export async function fetchAppConfig(): Promise<AppConfig> {
  for (let attempt = 1; attempt <= MAX_FETCH_ATTEMPTS; attempt++) {
    try {
      return await fetchAppConfigOnce();
    } catch {
      if (attempt === MAX_FETCH_ATTEMPTS) {
        return DEFAULT_APP_CONFIG;
      }
    }
  }

  return DEFAULT_APP_CONFIG;
}

export function buildContactDisplay(config: AppConfig) {
  const phoneDisplay = config.contactPhoneLabel
    ? `${config.contactPhoneLabel} : ${config.contactPhone}`
    : config.contactPhone;

  return {
    ...config,
    phoneDisplay,
    phoneHref: config.contactPhone
      ? `tel:${config.contactPhone.replace(/\s/g, "")}`
      : undefined,
    emailHref: config.supportEmail
      ? `mailto:${config.supportEmail}`
      : undefined,
    instagramUrl: config.socialLinks?.instagram,
  };
}

export type ContactDisplay = ReturnType<typeof buildContactDisplay>;
