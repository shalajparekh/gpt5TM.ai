export default function CalendarSection() {
  return (
    <section id="calendar" className="w-full py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl">
          <div className="relative w-full h-[560px]">
            <div className="absolute inset-0 bg-gradient-to-b from-white to-zinc-100" />
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <svg viewBox="0 0 800 500" className="w-full h-full max-w-[1100px]" role="img" aria-label="Dummy calendar">
                <defs>
                  <linearGradient id="calBg" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#f3f4f6" />
                  </linearGradient>
                </defs>
                <rect x="40" y="40" width="720" height="420" rx="24" fill="url(#calBg)" stroke="#e5e7eb" />
                <rect x="40" y="40" width="720" height="90" rx="24" fill="#0ea5e9" />
                <circle cx="120" cy="85" r="10" fill="#ffffff" />
                <circle cx="200" cy="85" r="10" fill="#ffffff" />
                <text x="260" y="95" fontFamily="Arial, sans-serif" fontSize="26" fill="#ffffff">Your booking calendar</text>
                {
                  Array.from({ length: 5 }).map((_, r) => (
                    Array.from({ length: 7 }).map((__, c) => (
                      <g key={`${r}-${c}`}>
                        <rect x={60 + c * 100} y={150 + r * 60} width="90" height="50" rx="10" fill="#ffffff" stroke="#e5e7eb" />
                        <text x={75 + c * 100} y={180 + r * 60} fontFamily="Arial, sans-serif" fontSize="12" fill="#6b7280">{r * 7 + c + 1}</text>
                      </g>
                    ))
                  ))
                }
                <rect x="300" y="380" width="200" height="44" rx="22" fill="#111827" />
                <text x="330" y="408" fontFamily="Arial, sans-serif" fontSize="16" fill="#ffffff">Reserve a time slot</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


