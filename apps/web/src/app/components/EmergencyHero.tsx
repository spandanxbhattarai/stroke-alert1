"use client";

const FAST_ITEMS = [
  { letter: "F", label: "Face", desc: "Drooping on one side?" },
  { letter: "A", label: "Arms", desc: "One arm weak or numb?" },
  { letter: "S", label: "Speech", desc: "Slurred or confused?" },
  { letter: "T", label: "Time", desc: "Call immediately!" },
];

export default function EmergencyHero() {
  return (
    <section className="bg-red-600 text-white">
      {/* Main hero */}
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="inline-flex items-center gap-2 bg-red-500 border border-red-400 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          Available 24 / 7 — Nepal Emergency: 102
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">
          Stroke Emergency?
        </h1>
        <p className="text-red-100 text-lg mb-10 max-w-md mx-auto">
          Find the nearest stroke-ready hospital and call in seconds.
        </p>

        {/* FAST cards — always visible */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-8">
          {FAST_ITEMS.map((item) => (
            <div
              key={item.letter}
              className="bg-red-700/60 border border-red-500/50 rounded-2xl p-3 sm:p-4 text-center"
            >
              <div className="text-3xl sm:text-4xl font-black text-yellow-300 leading-none mb-1">
                {item.letter}
              </div>
              <div className="text-white font-bold text-sm">{item.label}</div>
              <div className="text-red-200 text-xs mt-1 hidden sm:block">{item.desc}</div>
            </div>
          ))}
        </div>

        <p className="text-red-200 text-sm">
          Scroll down to find the nearest hospital
        </p>
      </div>
    </section>
  );
}
