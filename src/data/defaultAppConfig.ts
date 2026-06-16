import type { AppConfig } from "@/services/configService";

/** Hardcoded contact details used when the backend config API is unavailable. */
export const DEFAULT_APP_CONFIG: AppConfig = {
  supportEmail: "support@hotelyuvaan.com",
  contactPhone: "+91 87695675067",
  contactPhoneLabel: "Reception",
  addressLine1: "4VQ4+R9V, Station Rd,",
  addressLine2: "Kuchaman City, Rajasthan 341508",
  fullAddress: "4VQ4+R9V, Station Rd, Kuchaman City, Rajasthan 341508",
  mapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d221.90814049455088!2d74.85594625750201!3d27.139602085838558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396b7900248144b5%3A0x510e857c14fc625c!2sHotel%20yuvaan%20and%20restaurant!5e0!3m2!1sen!2sin!4v1752412252235!5m2!1sen!2sin",
  mapsLinkUrl: "https://maps.app.goo.gl/ahJTic7MDcnBXHjy8",
  socialLinks: {
    instagram: "https://www.instagram.com/hotelyuvaan/",
  },
};
