"use client";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "91XXXXXXXXXX"; // e.g., 91XXXXXXXXXX
const MESSAGE = encodeURIComponent("Hi TechMaadi, I'd like to discuss my project.");
const waUrl = `https://wa.me/${WA_NUMBER}?text=${MESSAGE}`;

export default function WhatsAppButton() {
  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-green-500 shadow-2xl flex items-center justify-center text-white text-xl hover:scale-105 transition"
      aria-label="Chat on WhatsApp"
    >
      WA
    </a>
  );
}


