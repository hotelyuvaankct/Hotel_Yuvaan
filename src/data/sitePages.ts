import type { SitePageSection } from "@/components/SiteContentPage";

export type SitePageDef = {
  path: string;
  title: string;
  subtitle: string;
  footerGroup: "legal" | "business";
  footerLabel: string;
  sections: SitePageSection[];
};

export const SITE_PAGES: SitePageDef[] = [
  {
    path: "/terms",
    title: "Terms & Conditions",
    subtitle:
      "Please read these terms carefully before booking or using Hotel Yuvaan services online.",
    footerGroup: "legal",
    footerLabel: "Terms & Conditions",
    sections: [
      {
        heading: "1. Agreement",
        paragraphs: [
          "By accessing hotelyuvaan.com, making a booking, or using our payment services, you agree to these Terms & Conditions and our Privacy Policy and Cookie Policy.",
          "Hotel Yuvaan is operated from Kuchaman City, Rajasthan, India. These terms are governed by the laws of India.",
        ],
      },
      {
        heading: "2. Bookings",
        paragraphs: [
          "Room rates, availability, taxes, and inclusions shown at checkout are calculated by our booking system at the time of payment.",
          "A booking is confirmed only after successful payment verification. You will receive a confirmation email with your booking reference and access link.",
        ],
        bullets: [
          "Guest details must be accurate (name, email, phone).",
          "You are responsible for the guests listed on the reservation.",
          "Before payment, you must confirm that you have read and understood the couple stay policy.",
          "Special requests are subject to availability and are not guaranteed unless confirmed in writing.",
        ],
      },
      {
        heading: "3. Payments",
        paragraphs: [
          "Online payments are processed securely through Razorpay. We do not store your full card details on our servers.",
          "Prices are shown in Indian Rupees (INR) and include applicable taxes unless stated otherwise.",
        ],
      },
      {
        heading: "4. Cancellations & refunds",
        paragraphs: [
          "Cancellations and refunds are governed by our Cancellation & Refund Policy. In summary: a refund is allowed only if you cancel within 12 hours of booking confirmation. After 12 hours, bookings are non-refundable.",
          "Full rules — including how to cancel online with OTP, no-shows, early departures, modifications, and refund timelines — are published on the Cancellation & Refunds page linked in the website footer.",
        ],
      },
      {
        heading: "5. Check-in & check-out",
        paragraphs: [
          "Standard check-in and check-out times are shown during booking. Early check-in or late check-out may be available on request and may attract additional charges.",
        ],
      },
      {
        heading: "6. Couple stay policy",
        paragraphs: [
          "Hotel Yuvaan allows couple stays for married couples only. Unmarried couples are not permitted to stay as a couple at the property.",
          "By completing a booking, you confirm that you have read and understood this couple stay policy. If your booking is for a couple, all guests must comply with the hotel's eligibility requirements.",
          "Valid government-issued photo ID may be required at check-in. The hotel reserves the right to refuse check-in or ask guests to leave without refund if the stay does not meet this policy.",
        ],
      },
      {
        heading: "7. Guest conduct",
        paragraphs: [
          "Guests must comply with hotel house rules, local laws, and instructions from staff — including the couple stay policy above. We reserve the right to refuse service or ask guests to leave without refund in case of damage, illegal activity, policy violations, or behaviour that endangers others.",
        ],
      },
      {
        heading: "8. Liability",
        paragraphs: [
          "To the fullest extent permitted by law, Hotel Yuvaan is not liable for indirect or consequential losses arising from your booking or stay, except where required under applicable consumer protection law.",
        ],
      },
      {
        heading: "9. Changes to these terms",
        paragraphs: [
          "We may update these terms from time to time. The version published on this website at the time of your booking applies to that booking.",
        ],
      },
    ],
  },
  {
    path: "/privacy",
    title: "Privacy Policy",
    subtitle:
      "How Hotel Yuvaan collects, uses, and protects your personal information.",
    footerGroup: "legal",
    footerLabel: "Privacy Policy",
    sections: [
      {
        heading: "1. Information we collect",
        paragraphs: [
          "When you book online or contact us, we may collect name, email, phone number, stay dates, room preferences, payment-related identifiers from our payment partner, and messages you send us.",
        ],
      },
      {
        heading: "2. How we use your information",
        paragraphs: [
          "We use your information to process bookings and payments, send confirmations and updates, provide customer support, improve our website, and meet legal or accounting requirements.",
        ],
        bullets: [
          "Booking and payment processing",
          "Service communications (confirmations, receipts, stay updates)",
          "Support and dispute resolution",
          "Security, fraud prevention, and legal compliance",
        ],
      },
      {
        heading: "3. Sharing",
        paragraphs: [
          "We share data only with service providers needed to operate the hotel website and payments (for example Razorpay for payments, and email or hosting providers), and when required by law.",
          "We do not sell your personal information.",
        ],
      },
      {
        heading: "4. Retention & security",
        paragraphs: [
          "We retain booking and guest records for as long as needed for operations, legal, and tax purposes. We use reasonable technical and organisational measures to protect your data.",
        ],
      },
      {
        heading: "5. Your choices",
        paragraphs: [
          "You may request access, correction, or deletion of personal data where applicable by contacting support@hotelyuvaan.com. Some records may need to be retained for legal reasons.",
        ],
      },
    ],
  },
  {
    path: "/cookies",
    title: "Cookie Policy",
    subtitle:
      "How we use cookies and similar technologies on the Hotel Yuvaan website.",
    footerGroup: "legal",
    footerLabel: "Cookie Policy",
    sections: [
      {
        heading: "1. What are cookies?",
        paragraphs: [
          "Cookies are small text files stored on your device. They help the site remember preferences, keep booking sessions working, and understand how the site is used.",
        ],
      },
      {
        heading: "2. Cookies we use",
        paragraphs: ["We may use the following categories:"],
        bullets: [
          "Essential — required for booking flow, security, and basic site functions (including session storage for your room selection).",
          "Analytics — help us understand traffic and improve pages (for example Vercel Analytics where enabled).",
          "Preferences — remember settings such as language or display choices when available.",
        ],
      },
      {
        heading: "3. Managing cookies",
        paragraphs: [
          "You can control cookies through your browser settings. Blocking essential cookies may prevent booking or checkout from working correctly.",
        ],
      },
      {
        heading: "4. Updates",
        paragraphs: [
          "We may update this Cookie Policy when our tools or practices change. Please review this page periodically.",
        ],
      },
    ],
  },
  {
    path: "/cancellation",
    title: "Cancellation & Refund Policy",
    subtitle:
      "Full rules for cancelling online bookings, when refunds are allowed, and how money is returned.",
    footerGroup: "legal",
    footerLabel: "Cancellation & Refunds",
    sections: [
      {
        heading: "1. Who this policy applies to",
        paragraphs: [
          "This Cancellation & Refund Policy applies to room bookings made on the Hotel Yuvaan website (hotelyuvaan.com) and paid online through Razorpay.",
          "By completing payment and receiving a confirmed booking, you agree to these rules. Walk-in bookings, offline reservations made directly with reception, and special written contracts (for example large groups) may follow different terms if agreed separately in writing.",
        ],
      },
      {
        heading: "2. When a booking is confirmed",
        paragraphs: [
          "A booking is confirmed only after Razorpay payment succeeds and our system verifies the payment signature. You then receive a confirmation email with your booking reference (booking code) and a secure booking access link.",
          "The clock for refund eligibility starts from the date and time the booking is confirmed (payment verified), not from check-in date.",
        ],
      },
      {
        heading: "3. How to cancel a booking",
        paragraphs: [
          "You can cancel a confirmed booking in either of these ways:",
        ],
        bullets: [
          "Online — open the booking access link from your confirmation email, go to Cancel booking, enter the same email used at checkout, request an OTP, enter the one-time code, and confirm cancellation.",
          "By contact — email support@hotelyuvaan.com or call the hotel phone number listed on the website. Share your booking code, guest name, and booking email so we can identify the reservation.",
        ],
      },
      {
        heading: "4. Core refund rule — 12-hour window",
        paragraphs: [
          "Hotel Yuvaan allows a refund only if you cancel within 12 (twelve) hours of booking confirmation.",
          "After 12 hours from confirmation, the booking is non-refundable. You will not receive a refund of the amount paid (including taxes and any coupon-adjusted total), even if you cancel the stay, change your plans, or do not travel.",
        ],
        bullets: [
          "Within 12 hours of confirmation — you may cancel and request a full refund of the amount charged for that booking (subject to the exceptions below).",
          "After 12 hours of confirmation — no refund is allowed under this policy.",
          "The 12-hour period is continuous (includes nights, weekends, and public holidays) and is calculated from the confirmation timestamp recorded in our booking system.",
          "Cancelling after the window may still release the room for other guests, but does not create a right to a refund.",
        ],
      },
      {
        heading: "5. Situations with no refund",
        paragraphs: [
          "Unless Indian law requires otherwise, the following are not eligible for a refund:",
        ],
        bullets: [
          "Cancellation requested more than 12 hours after booking confirmation.",
          "No-show — you do not arrive on the check-in date without a valid cancellation within the refund window.",
          "Early departure — you check out before the booked check-out date; unused nights are not refunded.",
          "Partial stay unused for any personal reason (travel plans changed, weather, transport delay, etc.) after the 12-hour window has passed.",
          "Bookings marked or sold as non-refundable (if shown at checkout), which remain non-refundable even inside 12 hours unless we state otherwise in writing.",
          "Charges for extras consumed at the hotel (meals, laundry, damages, and similar) that are billed separately from the online room payment.",
        ],
      },
      {
        heading: "6. How approved refunds are processed",
        paragraphs: [
          "When a cancellation qualifies under the 12-hour rule, we process the refund to the original payment method used via Razorpay (UPI, card, net banking, or other method you selected at checkout).",
          "Refunds are not paid in cash at the hotel for website bookings. Timing depends on Razorpay and your bank or UPI provider.",
        ],
        bullets: [
          "Typical bank credit time: several business days after we initiate the refund (often about 5–10 business days; some banks take longer).",
          "You will usually see the refund description referencing Razorpay or Hotel Yuvaan on your statement.",
          "If a coupon discount was applied, the refund is for the amount actually charged (after discount), not the pre-discount room rate.",
          "Keep your booking code and Razorpay payment ID until the refund appears. Contact us if it has not arrived after 10 business days.",
        ],
      },
      {
        heading: "7. Modifications (date or room changes)",
        paragraphs: [
          "Changing check-in/check-out dates or room type is not the same as a cancellation refund.",
          "Modifications are subject to availability and current rates. If the new price is higher, you may need to pay the difference. If it is lower, any credit or adjustment is at the hotel’s discretion and is not guaranteed once the 12-hour refund window has closed.",
          "To request a change, contact the hotel as early as possible with your booking code. We recommend requesting changes before the original check-in date.",
        ],
      },
      {
        heading: "8. Failed, cancelled, or incomplete payments",
        paragraphs: [
          "If you close the Razorpay window, payment fails, or our system cannot verify the payment, no booking is confirmed and you should not be charged a final capture for that attempt.",
          "If your bank shows a pending or temporary hold, it is usually reversed by the bank automatically. If a hold remains, contact support with the Razorpay payment or order reference from your bank SMS/app, and we will help investigate.",
        ],
      },
      {
        heading: "9. Coupons and discounted bookings",
        paragraphs: [
          "Coupon discounts are applied at checkout and reflected in the amount you pay. Refund eligibility still follows the 12-hour rule on the confirmed booking.",
          "If a refund is approved, we refund the net amount paid. Coupon reuse after a refund follows the coupon’s own terms (for example per-email usage limits).",
        ],
      },
      {
        heading: "10. Contact for cancellations and refunds",
        paragraphs: [
          "For cancellation help, refund status, or payment issues, contact Hotel Yuvaan using the details in the website footer, or email support@hotelyuvaan.com.",
          "Please include: booking code, guest full name, booking email, check-in date, and (if available) Razorpay payment ID. This helps us respond faster.",
        ],
      },
      {
        heading: "11. Legal notes",
        paragraphs: [
          "Nothing in this policy limits rights that cannot be waived under applicable Indian consumer protection or other mandatory law.",
          "Hotel Yuvaan may update this policy from time to time. The version published on this page at the time your booking is confirmed applies to that booking.",
          "This policy should be read together with our Terms & Conditions and Privacy Policy.",
        ],
      },
    ],
  },
  {
    path: "/our-story",
    title: "About Hotel Yuvaan",
    subtitle:
      "A welcoming stay in Kuchaman City — comfort, hospitality, and thoughtful service.",
    footerGroup: "business",
    footerLabel: "About Us",
    sections: [
      {
        heading: "Our story",
        paragraphs: [
          "Hotel Yuvaan is a hospitality destination in Kuchaman City, Rajasthan, offering comfortable rooms, dining, and spaces for gatherings.",
          "We focus on warm service, clean contemporary rooms, and a reliable booking experience for leisure and business travellers.",
        ],
      },
      {
        heading: "What we offer",
        paragraphs: ["Guests can enjoy:"],
        bullets: [
          "Well-appointed rooms and rate options",
          "On-site restaurant and dining",
          "Facilities suited to meetings and celebrations",
          "Straightforward online booking with secure payments",
        ],
      },
      {
        heading: "Visit us",
        paragraphs: [
          "Find us on Station Road, Kuchaman City, Rajasthan. For directions, offers, or group stays, reach out via our contact details in the footer.",
        ],
      },
    ],
  },
  {
    path: "/corporate",
    title: "Corporate & Group Bookings",
    subtitle:
      "Rooms and packages for business travel, teams, and organised groups.",
    footerGroup: "business",
    footerLabel: "Corporate & Groups",
    sections: [
      {
        heading: "Business stays",
        paragraphs: [
          "We support corporate travellers with flexible room arrangements, invoicing support where applicable, and a quiet base for work trips in and around Kuchaman City.",
        ],
      },
      {
        heading: "Groups & events",
        paragraphs: [
          "For multiple rooms, wedding guests, touring groups, or celebrations, contact us with your dates, headcount, and requirements. We will share availability and a tailored quote.",
        ],
        bullets: [
          "Multi-room blocks",
          "Meal arrangements (subject to restaurant capacity)",
          "Meeting or gathering space where available",
        ],
      },
      {
        heading: "How to enquire",
        paragraphs: [
          "Email support@hotelyuvaan.com or call the reception number listed on the website. Please include preferred dates, number of guests, and any special needs.",
        ],
      },
    ],
  },
  {
    path: "/careers",
    title: "Careers",
    subtitle: "Join the Hotel Yuvaan team — hospitality roles across operations and guest services.",
    footerGroup: "business",
    footerLabel: "Careers",
    sections: [
      {
        heading: "Working with us",
        paragraphs: [
          "We look for people who care about guest experience, teamwork, and reliability. Openings may include front office, housekeeping, F&B, and support roles.",
        ],
      },
      {
        heading: "How to apply",
        paragraphs: [
          "Send your CV and a short note about the role you are interested in to support@hotelyuvaan.com with the subject line “Careers – Hotel Yuvaan”.",
          "We will contact shortlisted candidates when a suitable opening is available.",
        ],
      },
    ],
  },
  {
    path: "/faq",
    title: "Frequently Asked Questions",
    subtitle: "Quick answers about booking, payments, and your stay.",
    footerGroup: "business",
    footerLabel: "FAQs",
    sections: [
      {
        heading: "How do I book a room?",
        paragraphs: [
          "Use Book on the website, select dates and rooms, enter guest details, apply a coupon if you have one, and pay securely with Razorpay. You will receive a confirmation email after payment is verified.",
        ],
      },
      {
        heading: "Is my payment secure?",
        paragraphs: [
          "Yes. Card and UPI payments are handled by Razorpay. Your booking is confirmed only after our system verifies the payment signature with Razorpay.",
        ],
      },
      {
        heading: "Can I use a coupon?",
        paragraphs: [
          "Yes. Enter or select a coupon on the room selection or checkout page. Some offers require your email to validate usage limits. Final discount and taxes come from our checkout summary API.",
        ],
      },
      {
        heading: "How do I cancel?",
        paragraphs: [
          "Open the booking link in your confirmation email, request an OTP to your booking email, and confirm cancellation — or contact the hotel with your booking code.",
          "Refunds are allowed only within 12 hours of booking confirmation. After 12 hours, cancellations are non-refundable. See the Cancellation & Refund Policy for full details.",
        ],
      },
      {
        heading: "When will I get my refund?",
        paragraphs: [
          "If you cancel within the 12-hour window, we refund to the original Razorpay payment method. Banks often take several business days (commonly about 5–10) to show the credit.",
        ],
      },
    ],
  },
];

export function getSitePage(path: string): SitePageDef | undefined {
  return SITE_PAGES.find((page) => page.path === path);
}

export function footerLinksByGroup(group: SitePageDef["footerGroup"]) {
  return SITE_PAGES.filter((page) => page.footerGroup === group).map((page) => ({
    to: page.path,
    label: page.footerLabel,
  }));
}
