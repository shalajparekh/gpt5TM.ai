"use client";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "91XXXXXXXXXX"; // e.g., 91XXXXXXXXXX
const MESSAGE = encodeURIComponent("Hi TechMaadi.ai, I'd like to discuss my project.");
const waUrl = `https://wa.me/${WA_NUMBER}?text=${MESSAGE}`;

export default function WhatsAppButton() {
  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transition-transform duration-200 hover:shadow-[0_10px_30px_rgba(99,102,241,0.45)] hover:scale-105 active:scale-95"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="22"
        height="22"
        aria-hidden="true"
        className="drop-shadow-sm transition-transform group-hover:scale-110"
        fill="currentColor"
      >
        <path d="M19.11 17.13c-.26-.13-1.53-.75-1.77-.84-.24-.09-.42-.13-.6.13-.18.26-.69.84-.84 1.02-.15.18-.31.2-.57.07-.26-.13-1.08-.4-2.06-1.28-.76-.68-1.28-1.52-1.43-1.78-.15-.26-.02-.4.11-.53.11-.11.26-.29.4-.44.13-.15.18-.26.27-.44.09-.18.04-.33-.02-.46-.06-.13-.6-1.44-.82-1.98-.22-.54-.44-.46-.6-.47-.15-.01-.33-.01-.51-.01s-.47.07-.72.33c-.25.26-.95.93-.95 2.27 0 1.34.97 2.62 1.11 2.8.13.18 1.91 2.91 4.62 4.08.65.28 1.16.45 1.56.58.65.21 1.24.18 1.71.11.52-.08 1.53-.63 1.75-1.24.22-.61.22-1.13.15-1.24-.06-.11-.24-.18-.5-.31z" />
        <path d="M26.8 5.2A12.86 12.86 0 0 0 16 1.33 12.86 12.86 0 0 0 5.2 5.2 12.86 12.86 0 0 0 1.33 16c0 2.27.6 4.49 1.74 6.45L1 31l8.74-2.02A12.86 12.86 0 0 0 16 30.67 12.86 12.86 0 0 0 26.8 26.8 12.86 12.86 0 0 0 30.67 16 12.86 12.86 0 0 0 26.8 5.2zm-1.64 19.83A10.78 10.78 0 0 1 16 26.78c-1.88 0-3.72-.49-5.34-1.42l-.38-.22-5.18 1.2 1.11-5.07-.25-.41A10.78 10.78 0 0 1 5.22 7.8 10.78 10.78 0 0 1 16 5.22c5.74 0 10.44 4.67 10.44 10.4 0 2.79-1.09 5.41-3.28 7.41z" />
      </svg>
      <span className="font-semibold">WhatsApp Us</span>
    </a>
  );
}


