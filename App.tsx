import { useState, useEffect, useRef } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen = "home" | "drivers" | "locations" | "profile" | "gifts"
type NavTab = "home" | "places" | "gifts" | "profile"

// ─── Gradient / Color tokens ─────────────────────────────────────────────────
const G  = "linear-gradient(135deg, #05AFF2 0%, #7B3DF8 55%, #AF18D9 100%)"
const GP = "linear-gradient(135deg, #7B3DF8 0%, #AF18D9 100%)"
const C  = {
  primary: "#7B3DF8", accent: "#AF18D9", cyan: "#05AFF2",
  lavender: "#F0ECFF", bg: "#F9F8FF",
  ink: "#0D0A1A", secondary: "#5A5870", muted: "#9997B0",
  border: "#EAE5F8", surface: "#FFFFFF",
  success: "#16A34A", error: "#DC2626", warning: "#D97706",
}

// ─── Drivers ──────────────────────────────────────────────────────────────────
const DRIVERS = [
  { id: "d1", name: "Emeka Okafor",   rating: "99% Smooth Ride", price: "₦4,500/h", initials: "EO", avatarBg: "#F4A261", carModel: "Toyota Camry 2023",  carEta: "4 mins away", carImage: "https://images.unsplash.com/photo-1758739601469-783e1e600e83?w=800&h=400&fit=crop&auto=format" },
  { id: "d2", name: "Tunde Adeyemi",  rating: "93% Smooth Ride", price: "₦6,000/h", initials: "TA", avatarBg: "#4ECDC4", carModel: "Honda Accord 2022",   carEta: "8 mins away", carImage: "https://images.unsplash.com/photo-1773835154362-b1133b7cb0e5?w=800&h=400&fit=crop&auto=format" },
  { id: "d3", name: "Ngozi Adesanya", rating: "97% Smooth Ride", price: "₦5,200/h", initials: "NA", avatarBg: "#A78BFA", carModel: "Kia Sportage 2024",   carEta: "11 mins away", carImage: "https://images.unsplash.com/photo-1708063786794-75030822657e?w=800&h=400&fit=crop&auto=format" },
]

// ─── Places ───────────────────────────────────────────────────────────────────
const PLACES = [
  { id: "p1",  name: "Nok by Alara",         category: "Restaurant",    area: "Victoria Island", distance: "2.1 km", rating: 4.8, image: "https://images.unsplash.com/photo-1742134516273-03ec7c4eb0c7?w=600&h=400&fit=crop&auto=format", featured: true  },
  { id: "p2",  name: "The Palms Mall",        category: "Shopping",      area: "Lekki Phase 1",   distance: "4.3 km", rating: 4.6, image: "https://images.unsplash.com/photo-1533481405265-e9ce0c044abb?w=600&h=400&fit=crop&auto=format", featured: false },
  { id: "p3",  name: "Eko Hotel & Suites",   category: "Hotel",         area: "Victoria Island", distance: "1.2 km", rating: 4.9, image: "https://images.unsplash.com/photo-1592494804071-faea15d93a8a?w=600&h=400&fit=crop&auto=format", featured: false },
  { id: "p4",  name: "Elegushi Beach",        category: "Beach",         area: "Lekki",           distance: "5.8 km", rating: 4.5, image: "https://images.unsplash.com/photo-1767487226795-1034bc86e9fc?w=600&h=400&fit=crop&auto=format", featured: false },
  { id: "p5",  name: "Jollof Kitchen",        category: "Restaurant",    area: "Ikoyi",           distance: "3.4 km", rating: 4.7, image: "https://images.unsplash.com/photo-1649970967701-7ad717f520a4?w=600&h=400&fit=crop&auto=format", featured: false },
  { id: "p6",  name: "Ikeja City Mall",       category: "Shopping",      area: "Ikeja",           distance: "14.5 km", rating: 4.4, image: "https://images.unsplash.com/photo-1614521084980-811d04f6c6cb?w=600&h=400&fit=crop&auto=format", featured: false },
  { id: "p7",  name: "Freedom Park",          category: "Entertainment", area: "Lagos Island",    distance: "6.2 km", rating: 4.3, image: "https://images.unsplash.com/photo-1559833064-6f4573ec1ac9?w=600&h=400&fit=crop&auto=format", featured: false },
  { id: "p8",  name: "Cactus Restaurant",     category: "Restaurant",    area: "Victoria Island", distance: "1.9 km", rating: 4.6, image: "https://images.unsplash.com/photo-1706359541036-f4fdb18ce9fc?w=600&h=400&fit=crop&auto=format", featured: false },
]

const CATEGORIES = ["All", "Restaurant", "Shopping", "Hotel", "Beach", "Entertainment"]

// ─── Icons ────────────────────────────────────────────────────────────────────
const I = {
  Search:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  Bell:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  Weather:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]"><path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M19.07 4.93l-1.41 1.41M15.5 8.5A5 5 0 007 12a4 4 0 000 8h10a3.5 3.5 0 00.5-6.96 5 5 0 00-2-4.54z"/></svg>,
  NormalCar: () => <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><path d="M5 16L3 12V9C3 8.44772 3.44772 8 4 8H20C20.5523 8 21 8.44772 21 9V12L19 16" stroke="#4B5563" strokeWidth={2} strokeLinecap="round"/><path d="M6.5 8L8.5 4H15.5L17.5 8" stroke="#4B5563" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/><circle cx="7" cy="16" r="2" fill="#4B5563"/><circle cx="17" cy="16" r="2" fill="#4B5563"/><line x1="9" y1="16" x2="15" y2="16" stroke="#4B5563" strokeWidth={2}/></svg>,
  WhiteCar:  () => <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><path d="M5 16L3 12V9C3 8.44772 3.44772 8 4 8H20C20.5523 8 21 8.44772 21 9V12L19 16" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round"/><path d="M6.5 8L8.5 4H15.5L17.5 8" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/><circle cx="7" cy="16" r="2" fill="#FFFFFF"/><circle cx="17" cy="16" r="2" fill="#FFFFFF"/><line x1="9" y1="16" x2="15" y2="16" stroke="#FFFFFF" strokeWidth={2}/></svg>,
  PurpleCar: () => <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6"><path d="M5 16L3 12V9C3 8.44772 3.44772 8 4 8H20C20.5523 8 21 8.44772 21 9V12L19 16" stroke="#7B3DF8" strokeWidth={2} strokeLinecap="round"/><path d="M6.5 8L8.5 4H15.5L17.5 8" stroke="#7B3DF8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/><circle cx="7" cy="16" r="2" fill="#7B3DF8"/><circle cx="17" cy="16" r="2" fill="#7B3DF8"/><line x1="9" y1="16" x2="15" y2="16" stroke="#7B3DF8" strokeWidth={2}/></svg>,
  MapPin:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Calendar:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Users:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  Edit:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  ArrowLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>,
  Clock:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Crosshair: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>,
  Star:      () => <svg viewBox="0 0 24 24" fill="#F59E0B" stroke="none" className="w-3 h-3"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  GroupRide: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  HomeIcon:  ({ filled }: { filled?: boolean }) => filled
    ? <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H15v-6h-6v6H4a1 1 0 01-1-1V9.5z"/></svg>,
  Compass:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  CarIcon:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M7 17m-2 0a2 2 0 104 0 2 2 0 10-4 0"/><path d="M17 17m-2 0a2 2 0 104 0 2 2 0 10-4 0"/><path d="M5 17H3V9l2-4h14l2 4v8h-2"/><path d="M9 17h6"/><path d="M5 9h14"/></svg>,
  Gift:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>,
  Navigation:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>,
  Person:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  ChevronRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M9 18l6-6-6-6"/></svg>,
  CreditCard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Shield:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Bell2:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  HelpCircle:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  LogOut:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Phone:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a2 2 0 011.96-2.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.91 14a16 16 0 006.09 6.09l.27-.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
}

// ─── City Map SVG ─────────────────────────────────────────────────────────────
function CityMap({ isSearching }: { isSearching?: boolean }) {
  const pins = [
    { x: 148, y: 72,  primary: true },
    { x: 268, y: 52 },
    { x: 332, y: 148 },
    { x: 68,  y: 208 },
    { x: 242, y: 228 },
    { x: 118, y: 292 },
    { x: 308, y: 288 },
  ]
  return (
    <svg viewBox="0 0 400 360" className="w-full h-full" style={{ background: "#EDEBF8" }}>
      <defs>
        <linearGradient id="pinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#05AFF2"/><stop offset="55%" stopColor="#7B3DF8"/><stop offset="100%" stopColor="#AF18D9"/>
        </linearGradient>
        <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#05AFF2"/><stop offset="100%" stopColor="#AF18D9"/>
        </linearGradient>
      </defs>
      <g stroke="#D8D4EE" strokeWidth={16} fill="none">
        <line x1="0" y1="170" x2="400" y2="170"/><line x1="200" y1="0" x2="200" y2="360"/>
        <line x1="0" y1="80" x2="400" y2="80"/><line x1="0" y1="260" x2="400" y2="260"/>
        <line x1="100" y1="0" x2="100" y2="360"/><line x1="300" y1="0" x2="300" y2="360"/>
        <path d="M0 130 Q100 90 200 130 Q300 170 400 130"/>
        <path d="M155 0 Q170 90 145 180 Q120 270 150 360"/>
      </g>
      <g stroke="#E4E0F4" strokeWidth={1.5} strokeDasharray="12 9" fill="none" opacity={0.7}>
        <line x1="0" y1="170" x2="400" y2="170"/><line x1="200" y1="0" x2="200" y2="360"/>
        <line x1="0" y1="80" x2="400" y2="80"/><line x1="100" y1="0" x2="100" y2="360"/>
        <line x1="300" y1="0" x2="300" y2="360"/>
      </g>
      <g fill="#E0DCF2" opacity={0.55}>
        <rect x="108" y="90" width="82" height="70" rx="5"/><rect x="208" y="90" width="82" height="70" rx="5"/>
        <rect x="108" y="178" width="82" height="72" rx="5"/><rect x="208" y="178" width="82" height="72" rx="5"/>
        <rect x="12" y="12" width="78" height="58" rx="4"/><rect x="312" y="12" width="78" height="58" rx="4"/>
        <rect x="12" y="90" width="78" height="70" rx="4"/><rect x="312" y="178" width="78" height="72" rx="4"/>
        <rect x="12" y="268" width="78" height="80" rx="4"/><rect x="312" y="268" width="78" height="80" rx="4"/>
        <rect x="108" y="268" width="82" height="80" rx="5"/><rect x="208" y="268" width="82" height="80" rx="5"/>
      </g>
      {pins.map((pin, i) =>
        pin.primary ? (
          <g key={i} transform={`translate(${pin.x},${pin.y})`}>
            <circle r={22} fill="#AF18D9" opacity={0.15}/>
            <circle r={17} fill="url(#pinGrad)"/>
            <rect x={-7} y={-4} width={14} height={7} rx={2} fill="white"/>
            <rect x={-5} y={-7} width={10} height={5} rx={1.5} fill="white" opacity={0.8}/>
            <circle cx={-4.5} cy={4} r={2} fill="#7B3DF8" stroke="white" strokeWidth={0.8}/>
            <circle cx={4.5} cy={4} r={2} fill="#7B3DF8" stroke="white" strokeWidth={0.8}/>
          </g>
        ) : (
          <g key={i} transform={`translate(${pin.x},${pin.y})`}>
            <circle r={16} fill="white" stroke="#C9C3F0" strokeWidth={1.5}/>
            <rect x={-6} y={-3.5} width={12} height={6} rx={1.5} fill="#7B3DF8"/>
            <rect x={-4} y={-6.5} width={8} height={4.5} rx={1} fill="#7B3DF8" opacity={0.7}/>
            <circle cx={-3.5} cy={3.5} r={1.5} fill="white"/>
            <circle cx={3.5} cy={3.5} r={1.5} fill="white"/>
          </g>
        )
      )}
      <g transform="translate(200,170)">
        {isSearching && (
          <>
            <circle r={20} fill="none" stroke="#7B3DF8" strokeWidth={3} className="sonar-ring" />
            <circle r={20} fill="none" stroke="#05AFF2" strokeWidth={3} className="sonar-ring-delayed" />
          </>
        )}
        <circle r={26} fill="url(#pulseGrad)" opacity={0.12}/>
        <circle r={14} fill="url(#pulseGrad)" opacity={0.22}/>
        <circle r={6} fill="url(#pinGrad)"/>
        <circle r={3} fill="white"/>
      </g>
    </svg>
  )
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
function BottomNav({ active, onChange }: { active: NavTab; onChange: (t: NavTab) => void }) {
  const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: "home",    label: "Home",     icon: <I.HomeIcon filled={active === "home"} /> },
    { id: "places",  label: "Discover", icon: <I.Compass /> },
    { id: "gifts",   label: "Gifts",   icon: <I.Gift /> },
    { id: "profile", label: "Profile", icon: <I.Person /> },
  ]
  return (
    <div className="flex-shrink-0 flex justify-center pb-5 pt-3">
      <div className="flex items-center gap-1 px-2 py-2" style={{ background: "#131321", borderRadius: 999, boxShadow: "0 8px 32px rgba(13,13,26,0.28), 0 2px 8px rgba(13,13,26,0.16)" }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex items-center gap-2 transition-all duration-300"
            style={{
              padding: active === tab.id ? "8px 16px" : "8px 12px",
              borderRadius: 999,
              background: active === tab.id ? G : "transparent",
              color: active === tab.id ? "white" : "#5E5C80",
              overflow: "hidden", whiteSpace: "nowrap",
            }}
          >
            {tab.icon}
            {active === tab.id && <span className="text-sm font-semibold">{tab.label}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Home Screen — map-first ──────────────────────────────────────────────────
const NEARBY_AREAS = ["Victoria Island", "Lekki", "Ikoyi", "Ikeja", "Surulere", "Yaba", "Ajah", "Oshodi"]
const QUICK_PLACES = [
  { name: "Eko Hotel", area: "V.I.",  eta: "3 min", emoji: "🏨" },
  { name: "The Palms", area: "Lekki", eta: "8 min", emoji: "🛍" },
  { name: "Nok by Alara", area: "V.I.", eta: "5 min", emoji: "🍽" },
  { name: "Elegushi Beach", area: "Lekki", eta: "12 min", emoji: "🏖" },
]

// \u2500\u2500\u2500 Swipeable Nearby Bottom Sheet \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function NearbySheet({
  sheetOpen,
  setSheetOpen,
  setSelectedDestination,
  setSearchQuery,
  setRideStatus,
}: {
  sheetOpen: boolean
  setSheetOpen: (v: boolean | ((p: boolean) => boolean)) => void
  setSelectedDestination: (v: string) => void
  setSearchQuery: (v: string) => void
  setRideStatus: (v: "idle" | "searching" | "confirmed") => void
}) {
  const COLLAPSED_H = 96
  const EXPANDED_H  = 340
  const touchStartY   = useRef(0)
  const touchCurrentY = useRef(0)
  const isDragging    = useRef(false)
  const [dragDelta, setDragDelta]   = useState(0)
  const [isSnapping, setIsSnapping] = useState(false)

  const targetH = sheetOpen ? EXPANDED_H : COLLAPSED_H
  const liveH   = Math.max(COLLAPSED_H, Math.min(EXPANDED_H, targetH - dragDelta))

  function onTouchStart(e: React.TouchEvent) {
    touchStartY.current   = e.touches[0].clientY
    touchCurrentY.current = e.touches[0].clientY
    isDragging.current    = true
    setIsSnapping(false)
  }
  function onTouchMove(e: React.TouchEvent) {
    if (!isDragging.current) return
    touchCurrentY.current = e.touches[0].clientY
    setDragDelta(touchCurrentY.current - touchStartY.current)
  }
  function onTouchEnd() {
    if (!isDragging.current) return
    isDragging.current = false
    const delta = touchCurrentY.current - touchStartY.current
    setIsSnapping(true)
    setDragDelta(0)
    if (delta < -55)     setSheetOpen(true)
    else if (delta > 55) setSheetOpen(false)
  }

  return (
    <div
      className="absolute bottom-0 left-0 right-0 rounded-t-3xl z-20"
      style={{
        background: "white",
        boxShadow: "0 -4px 32px rgba(13,10,26,0.12)",
        height: liveH,
        transition: isSnapping || !isDragging.current ? "height 0.32s cubic-bezier(0.32,0.72,0,1)" : "none",
        overflow: "hidden",
        touchAction: "none",
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <button
        className="w-full flex flex-col items-center pt-3 pb-2"
        onClick={() => setSheetOpen(p => !p)}
      >
        <div
          className="w-10 h-1 rounded-full transition-all duration-200"
          style={{ background: sheetOpen ? C.primary : "#D8D4EE", opacity: sheetOpen ? 0.7 : 1 }}
        />
      </button>

      <div className="px-5 flex items-center justify-between">
        <p className="font-bold text-sm" style={{ color: C.ink }}>Nearby in Lagos</p>
        {!sheetOpen && (
          <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {NEARBY_AREAS.slice(0, 3).map(a => (
              <span key={a} className="px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0" style={{ background: "#F0ECFF", color: C.primary }}>
                {a}
              </span>
            ))}
          </div>
        )}
      </div>

      {sheetOpen && (
        <div className="px-5 pt-3">
          <div className="flex gap-2 overflow-x-auto pb-3" style={{ scrollbarWidth: "none" }}>
            {NEARBY_AREAS.map(a => (
              <span key={a} className="px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 cursor-pointer" style={{ background: "#F0ECFF", color: C.primary }}>
                {a}
              </span>
            ))}
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {QUICK_PLACES.map(p => (
              <button
                key={p.name}
                onClick={() => {
                  setSelectedDestination(p.name)
                  setSearchQuery(p.name)
                  setRideStatus("idle")
                }}
                className="flex flex-col items-start p-3 rounded-2xl flex-shrink-0 cursor-pointer"
                style={{ background: "#F9F8FF", border: `1px solid ${C.border}`, minWidth: 130 }}
              >
                <span className="text-2xl mb-2">{p.emoji}</span>
                <p className="text-sm font-bold text-left leading-tight" style={{ color: C.ink }}>{p.name}</p>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>{p.area} · {p.eta}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function HomeScreen({
  selectedDestination,
  setSelectedDestination,
}: {
  selectedDestination: string
  setSelectedDestination: (dest: string) => void
}) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState(selectedDestination || "")
  const [selectedTier, setSelectedTier] = useState<"standard" | "comfort">("standard")
  const [rideStatus, setRideStatus] = useState<"idle" | "searching" | "confirmed">("idle")
  const [bookingForSomeone, setBookingForSomeone] = useState(false)

  const categoryEmoji: Record<string, string> = {
    Restaurant: "🍽", Shopping: "🛍", Hotel: "🏨",
    Beach: "🏖", Entertainment: "🎭", All: "✦",
  }

  const matchingPlaces = PLACES.filter(p =>
    searchQuery.trim() === "" ||
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.area.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const matchedPlace = PLACES.find(p => p.name.toLowerCase() === selectedDestination.toLowerCase())

  const handleClearDestination = () => {
    setSelectedDestination("")
    setSearchQuery("")
    setRideStatus("idle")
    setIsSearchFocused(false)
  }

  const handleBookRide = () => {
    setRideStatus("searching")
    setTimeout(() => {
      setRideStatus("confirmed")
    }, 4500)
  }

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Full-screen map with active sonar animation during searching state */}
      <div className="absolute inset-0">
        <CityMap isSearching={rideStatus === "searching"} />
      </div>

      {/* Top row: avatar + interactive search bar + weather */}
      <div className="absolute top-3 left-4 right-4 z-30">
        {!isSearchFocused ? (
          <div className="flex items-center gap-2.5">
            <button className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.18)" }}>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format" alt="Chisom" className="w-full h-full object-cover" />
            </button>

            {/* Inactive Search Bar */}
            <div
              className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-white cursor-text"
              style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.14)" }}
              onClick={() => setIsSearchFocused(true)}
            >
              <span style={{ color: C.primary }}><I.Search /></span>
              <span className="flex-1 text-sm font-semibold" style={{ color: searchQuery ? C.ink : C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {searchQuery || "Where do you want to go to?"}
              </span>
            </div>

            <button
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-white"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.14)", color: C.ink }}
              title="Weather"
            >
              <I.Weather />
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-4 transition-all" style={{ boxShadow: "0 8px 32px rgba(13,10,26,0.18)" }}>
            <div className="flex items-start gap-3">
               <button onClick={() => setIsSearchFocused(false)} className="mt-2 text-gray-500 hover:text-gray-800 transition-colors">
                 <I.ArrowLeft />
               </button>
               <div className="flex-1 relative flex flex-col gap-2.5">
                 {/* Timeline connection */}
                 <div className="absolute left-[15px] top-[24px] bottom-[24px] w-[1.5px] bg-gray-200" />
                 
                 {/* Your Location */}
                 <div className="relative flex items-center gap-3 bg-gray-100 rounded-xl px-3 py-2.5">
                   <div className="w-2 h-2 rounded-full z-10" style={{ background: C.cyan, boxShadow: "0 0 0 4px #F3F4F6" }} />
                   <input 
                     className="bg-transparent outline-none flex-1 text-sm font-bold text-gray-800"
                     defaultValue="Your Location"
                   />
                 </div>
                 
                 {/* Destination */}
                 <div className="relative flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ background: "#F4F0FF", border: `1px solid ${C.border}` }}>
                   <div className="w-2 h-2 rounded-full z-10" style={{ background: C.primary, boxShadow: "0 0 0 4px #F4F0FF" }} />
                   <input 
                     autoFocus
                     className="bg-transparent outline-none flex-1 text-sm font-bold text-gray-800"
                     placeholder="Where do you want to go to?"
                     value={searchQuery}
                     onChange={e => {
                       const val = e.target.value
                       setSearchQuery(val)
                       setSelectedDestination(val)
                       setRideStatus("idle")
                     }}
                   />
                   {searchQuery && (
                     <button onClick={handleClearDestination} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
                   )}
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* Floating Search Results Dropdown */}
        {isSearchFocused && (
          <div
            className="mt-2 rounded-2xl bg-white overflow-hidden shadow-2xl border max-h-64 overflow-y-auto"
            style={{ borderColor: C.border }}
          >
            <div className="px-4 py-2 border-b text-[11px] font-bold uppercase tracking-wider text-purple-600 flex justify-between items-center" style={{ borderColor: C.border }}>
              <span>Discover Places ({matchingPlaces.length})</span>
              <button onClick={() => setIsSearchFocused(false)} className="text-gray-400 hover:text-gray-600 text-xs">Close ✕</button>
            </div>

            {matchingPlaces.length > 0 ? (
              matchingPlaces.map(place => (
                <button
                  key={place.id}
                  onClick={() => {
                    setSearchQuery(place.name)
                    setSelectedDestination(place.name)
                    setIsSearchFocused(false)
                    setRideStatus("idle")
                  }}
                  className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-purple-50 transition-colors border-b last:border-b-0"
                  style={{ borderColor: "#F3F0FA" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm" style={{ background: "#F0ECFF" }}>
                      {categoryEmoji[place.category] || "📍"}
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-tight" style={{ color: C.ink }}>{place.name}</p>
                      <p className="text-xs" style={{ color: C.muted }}>{place.area} · {place.distance}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                    <I.Star />
                    <span>{place.rating}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-gray-400">
                No matching place found in Discover.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Buttons */}
      <div
        className="absolute right-4 flex flex-col gap-3 transition-all duration-350 z-20"
        style={{ bottom: selectedDestination ? (rideStatus === "idle" ? 340 : 250) : sheetOpen ? 328 : 108 }}
      >
        <button
          className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{ background: "white", boxShadow: "0 4px 16px rgba(0,0,0,0.14)", color: C.primary }}
        >
          <I.Crosshair />
        </button>
        <button
          className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{ background: G, boxShadow: "0 4px 20px rgba(123,61,248,0.38)", color: "white" }}
          onClick={() => setIsSearchFocused(true)}
        >
          <I.Navigation />
        </button>
      </div>

      {/* MAIN BOTTOM CARD STATES */}
      {selectedDestination ? (
        rideStatus === "searching" ? (
          /* STATE 1: SEARCHING / FINDING DRIVER MAP ANIMATION */
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl p-5 bg-white z-20 transition-all duration-300"
            style={{ boxShadow: "0 -4px 32px rgba(13,10,26,0.18)" }}
          >
            <div className="w-9 h-1 rounded-full mx-auto mb-4 bg-gray-200" />
            
            <div className="flex items-center gap-4 mb-4 p-3.5 rounded-2xl bg-purple-50 border border-purple-100">
              {/* Animated Radar Pulse Icon */}
              <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-purple-400 opacity-30 animate-ping" />
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ background: G }}>
                  🚗
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-gray-900">Finding your driver...</span>
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Connecting with drivers near {matchedPlace?.area || "Victoria Island"}...</p>
                <p className="text-[11px] font-semibold text-purple-600 mt-1">
                  {selectedTier === "comfort" ? "Pantra Comfort · ₦5,200" : "Standard · ₦3,500"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setRideStatus("idle")}
              className="w-full py-3 rounded-2xl font-bold text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel Request
            </button>
          </div>
        ) : rideStatus === "confirmed" ? (
          /* STATE 2: DRIVER CONFIRMED / ARRIVING */
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl p-5 bg-white z-20 transition-all duration-300"
            style={{ boxShadow: "0 -4px 32px rgba(13,10,26,0.18)" }}
          >
            <div className="w-9 h-1 rounded-full mx-auto mb-3 bg-gray-200" />
            
            {/* Status / Trip Info */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-sm font-black text-gray-900">Arriving in 4 mins</span>
              </div>
              <p className="text-[11px] text-gray-500 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Picking you up
                <span className="text-gray-300">→</span>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> {selectedDestination}
              </p>
            </div>

            {/* Driver & Car Details */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl mb-4 bg-gray-50 border border-gray-100 shadow-sm">
              <div className="relative">
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-md">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format" alt="Emeka" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-white px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
                  <span className="text-[9px] font-bold">4.9</span>
                  <I.Star />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black text-gray-900">Emeka Okafor</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded text-gray-700 bg-gray-200 uppercase tracking-widest">KJA 482 AA</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Toyota Camry 2023 · White</p>
                <div className="text-[10px] font-semibold text-purple-600 mt-1">
                  {selectedTier === "comfort" ? "Pantra Comfort · ₦5,200" : "Standard · ₦3,500"}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-3 rounded-xl font-bold text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex justify-center items-center gap-2">
                💬 Message
              </button>
              <button className="flex-1 py-3 rounded-xl font-bold text-xs text-white transition-colors flex justify-center items-center gap-2 shadow-lg" style={{ background: G }}>
                📞 Call Driver
              </button>
            </div>

            <button
              onClick={handleClearDestination}
              className="w-full mt-3 py-3 rounded-xl font-bold text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
            >
              Cancel Ride
            </button>
          </div>
        ) : (
          /* STATE 0: PICK RIDE TIER (STANDARD VS COMFORT) & BOOK RIDE */
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl p-5 bg-white z-20 transition-all duration-300"
            style={{ boxShadow: "0 -4px 32px rgba(13,10,26,0.15)" }}
          >
            <div className="w-9 h-1 rounded-full mx-auto mb-3 bg-gray-200" />
            
            {/* Header with selected destination */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600">Destination Selected</span>
                <h2 className="text-lg font-black text-gray-900 leading-tight">{selectedDestination}</h2>
                {matchedPlace && (
                  <p className="text-xs text-gray-500 mt-0.5">{matchedPlace.area} · {matchedPlace.distance} away</p>
                )}
              </div>
              <button
                onClick={handleClearDestination}
                className="text-xs font-bold text-gray-400 hover:text-gray-600 px-2.5 py-1 rounded-lg bg-gray-100"
              >
                Clear ✕
              </button>
            </div>

            {/* Ride Tier Selection: Standard vs Pantra Comfort */}
            <div className="flex flex-col gap-2.5 mb-4">
              {/* Standard Option */}
              <button
                onClick={() => setSelectedTier("standard")}
                className="flex items-center justify-between p-3.5 rounded-2xl transition-all text-left cursor-pointer"
                style={{
                  background: selectedTier === "standard" ? "#F4F0FF" : "white",
                  border: `2px solid ${selectedTier === "standard" ? C.primary : C.border}`,
                  boxShadow: selectedTier === "standard" ? "0 4px 16px rgba(123,61,248,0.12)" : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-10 flex items-center justify-center flex-shrink-0">
                    <img src="/Pantra White.png" alt="Standard" className="w-full h-full object-contain" style={{ mixBlendMode: "multiply" }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-tight">Standard</p>
                    <p className="text-xs text-gray-500 mt-1">3-5 mins ETA · 4 Seats</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-black text-gray-900">₦3,500</p>
                  {selectedTier === "standard" && (
                    <span className="text-[11px] font-bold" style={{ color: C.primary }}>✓ Selected</span>
                  )}
                </div>
              </button>

              {/* Pantra Comfort Option */}
              <button
                onClick={() => setSelectedTier("comfort")}
                className="flex items-center justify-between p-3.5 rounded-2xl transition-all text-left cursor-pointer"
                style={{
                  background: selectedTier === "comfort" ? "#F4F0FF" : "white",
                  border: `2px solid ${selectedTier === "comfort" ? C.primary : C.border}`,
                  boxShadow: selectedTier === "comfort" ? "0 4px 16px rgba(123,61,248,0.12)" : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-10 flex items-center justify-center flex-shrink-0">
                    <img src="/Pantra Purple.png" alt="Pantra Comfort" className="w-full h-full object-contain" style={{ mixBlendMode: "multiply" }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-tight">Pantra Comfort</p>
                    <p className="text-xs text-gray-500 mt-1">3-5 mins ETA · 4 Seats</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-black text-gray-900">₦5,200</p>
                  {selectedTier === "comfort" && (
                    <span className="text-[11px] font-bold" style={{ color: C.primary }}>✓ Selected</span>
                  )}
                </div>
              </button>
            </div>

            {/* Booking for someone else? */}
            <div className="mb-4">
              <button 
                onClick={() => setBookingForSomeone(!bookingForSomeone)}
                className="text-[11px] font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-colors"
              >
                {bookingForSomeone ? "✕ Cancel booking for someone else" : "+ Booking for someone else?"}
              </button>
              
              {bookingForSomeone && (
                <div className="mt-2 flex gap-2 animate-fade-in">
                  <input 
                    placeholder="Passenger Name" 
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-purple-500 font-semibold"
                  />
                  <input 
                    placeholder="Phone Number" 
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs outline-none focus:border-purple-500 font-semibold"
                  />
                </div>
              )}
            </div>

            {/* Book a Ride Button */}
            <button
              onClick={handleBookRide}
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              style={{ background: G, boxShadow: "0 4px 20px rgba(123,61,248,0.35)" }}
            >
              Book a Ride →
            </button>
          </div>
        )
      ) : (
        <NearbySheet
          sheetOpen={sheetOpen}
          setSheetOpen={setSheetOpen}
          setSelectedDestination={setSelectedDestination}
          setSearchQuery={setSearchQuery}
          setRideStatus={setRideStatus}
        />
      )}
    </div>
  )
}

// ─── Driver Card ──────────────────────────────────────────────────────────────
function DriverCard({ driver, booked, onBook }: { driver: typeof DRIVERS[0]; booked: boolean; onBook: () => void }) {
  return (
    <div className="rounded-3xl overflow-hidden" style={{ background: "white", boxShadow: "0 2px 16px rgba(123,61,248,0.07)" }}>
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: driver.avatarBg }}>{driver.initials}</div>
          <div>
            <p className="font-bold text-sm leading-tight" style={{ color: C.ink }}>{driver.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <I.Star />
              <p className="text-xs" style={{ color: C.muted }}>{driver.rating}</p>
            </div>
          </div>
        </div>
        <span className="font-bold text-sm" style={{ color: C.ink }}>{driver.price}</span>
      </div>
      <div className="mx-4 mb-3 rounded-2xl overflow-hidden" style={{ height: 152, background: "#F0ECFF" }}>
        <img src={driver.carImage} alt={driver.carModel} className="w-full h-full object-cover" />
      </div>
      <div className="flex items-center justify-between px-4 pb-4">
        <div>
          <p className="font-bold text-sm leading-tight" style={{ color: C.ink }}>{driver.carModel}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span style={{ color: C.muted }}><I.Clock /></span>
            <span className="text-xs" style={{ color: C.muted }}>{driver.carEta}</span>
          </div>
        </div>
        <button
          onClick={onBook}
          className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 active:scale-[0.97]"
          style={{ background: booked ? C.success : G }}
        >
          {booked ? "Booked ✓" : "Book Now"}
        </button>
      </div>
    </div>
  )
}

// ─── Drivers Screen ───────────────────────────────────────────────────────────
function DriversScreen({ onBack }: { onBack: () => void }) {
  const [booked, setBooked] = useState<string | null>(null)
  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#FAF8FF" }}>
      <div className="flex items-center gap-4 px-5 pt-5 pb-4 flex-shrink-0" style={{ background: "#FAF8FF" }}>
        <button onClick={onBack} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#EAE5FF", color: C.ink }}>
          <I.ArrowLeft />
        </button>
        <h1 className="text-xl font-bold" style={{ color: C.ink }}>Choose a driver</h1>
      </div>
      <div className="px-5 mb-4 flex-shrink-0">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: "white" }}>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-2 h-2 rounded-full" style={{ background: G }} />
            <span className="text-sm font-semibold" style={{ color: C.ink }}>Victoria Island</span>
          </div>
          <div className="w-px h-4 mx-1" style={{ background: "#E4E0F4" }} />
          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className="text-sm font-semibold" style={{ color: C.ink }}>Lekki Phase 1</span>
            <div className="w-2 h-2 rounded-full" style={{ background: C.success }} />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <div className="flex flex-col gap-4">
          {DRIVERS.map(d => (
            <DriverCard key={d.id} driver={d} booked={booked === d.id} onBook={() => setBooked(d.id)} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Locations Screen ─────────────────────────────────────────────────────────
function LocationsScreen({ onRideHere }: { onRideHere: (placeName: string) => void }) {
  const [category, setCategory] = useState("All")
  const [search, setSearch] = useState("")

  const filtered = PLACES.filter(p =>
    (category === "All" || p.category === category) &&
    (search === "" || p.name.toLowerCase().includes(search.toLowerCase()))
  )
  const featured = filtered.find(p => p.featured) ?? filtered[0]
  const rest = filtered.filter(p => p !== featured)

  const categoryEmoji: Record<string, string> = {
    Restaurant: "🍽", Shopping: "🛍", Hotel: "🏨",
    Beach: "🏖", Entertainment: "🎭", All: "✦",
  }

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "#FAF8FF" }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: C.primary }}>Lagos, Nigeria</p>
        <h1 className="text-2xl font-black mb-4" style={{ color: C.ink }}>Discover Places</h1>

        {/* Search */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-4" style={{ background: "white", border: `1px solid ${C.border}` }}>
          <span style={{ color: C.muted }}><I.Search /></span>
          <input
            className="flex-1 bg-transparent outline-none text-sm"
            placeholder="Search restaurants, malls..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ color: C.ink }}
          />
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold flex-shrink-0 transition-all duration-150"
              style={category === cat
                ? { background: G, color: "white" }
                : { background: "white", color: C.secondary, border: `1px solid ${C.border}` }}
            >
              <span>{categoryEmoji[cat]}</span>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {featured && (
        <div className="px-5 mb-4">
          {/* Featured card — large */}
          <div className="relative rounded-3xl overflow-hidden" style={{ height: 220 }}>
            <img src={featured.image} alt={featured.name} className="w-full h-full object-cover" />
            {/* gradient overlay */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,10,26,0.85) 0%, rgba(13,10,26,0.1) 60%)" }} />
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white" style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}>
                {categoryEmoji[featured.category]} {featured.category}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-black text-xl text-white leading-tight">{featured.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-white/70"><I.MapPin /> {featured.area}</span>
                    <span className="text-xs text-white/50">·</span>
                    <span className="text-xs text-white/70">{featured.distance}</span>
                    <span className="text-xs text-white/50">·</span>
                    <span className="flex items-center gap-0.5 text-xs text-white/70"><I.Star /> {featured.rating}</span>
                  </div>
                </div>
                <button
                  onClick={() => onRideHere(featured.name)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-white flex-shrink-0"
                  style={{ background: G }}
                >
                  Ride Here
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Place grid */}
      <div className="px-5 pb-6">
        <p className="text-sm font-bold mb-3" style={{ color: C.secondary }}>
          {rest.length} more {category === "All" ? "places" : category.toLowerCase() + "s"} nearby
        </p>
        <div className="grid grid-cols-2 gap-3">
          {rest.map(place => (
            <div key={place.id} className="rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "0 2px 12px rgba(123,61,248,0.06)" }}>
              {/* Photo */}
              <div className="relative" style={{ height: 110 }}>
                <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,10,26,0.5) 0%, transparent 60%)" }} />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(255,255,255,0.9)", color: C.ink }}>
                  {categoryEmoji[place.category]}
                </span>
                <span className="absolute bottom-2 right-2 flex items-center gap-0.5 text-[11px] font-semibold text-white">
                  <I.Star /> {place.rating}
                </span>
              </div>
              {/* Info */}
              <div className="px-3 pt-2.5 pb-3">
                <p className="font-bold text-sm leading-tight" style={{ color: C.ink }}>{place.name}</p>
                <p className="text-[11px] mt-0.5 mb-2.5" style={{ color: C.muted }}>{place.area} · {place.distance}</p>
                <button
                  onClick={() => onRideHere(place.name)}
                  className="w-full py-2 rounded-xl text-xs font-bold text-white transition-all duration-150 active:scale-[0.97]"
                  style={{ background: GP }}
                >
                  Ride Here
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Profile Sub-Screens ──────────────────────────────────────────────────────
function ProfileSubScreen({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#FAF8FF" }}>
      <div className="flex items-center gap-4 px-5 pt-5 pb-4 flex-shrink-0 bg-white border-b" style={{ borderColor: C.border }}>
        <button onClick={onBack} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#EAE5FF", color: C.ink }}>
          <I.ArrowLeft />
        </button>
        <h1 className="text-lg font-bold" style={{ color: C.ink }}>{title}</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
    </div>
  )
}

function SettingsRow({ icon, label, sub, chevron = true, onClick, destructive }: {
  icon?: React.ReactNode; label: string; sub?: string; chevron?: boolean; onClick?: () => void; destructive?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className="profile-row w-full flex items-center gap-3 px-4 py-4 text-left"
    >
      {icon && (
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: destructive ? "#FEE2E2" : "#F0ECFF", color: destructive ? C.error : C.primary }}>
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: destructive ? C.error : C.ink }}>{label}</p>
        {sub && <p className="text-xs mt-0.5 truncate" style={{ color: C.muted }}>{sub}</p>}
      </div>
      {chevron && <span style={{ color: C.muted }}><I.ChevronRight /></span>}
    </button>
  )
}

function SettingsCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden mb-4" style={{ background: "white", border: `1px solid ${C.border}` }}>
      {children}
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: C.border, margin: "0 16px" }} />
}

// ─── Profile Screen ───────────────────────────────────────────────────────────
function ProfileScreen() {
  const [subScreen, setSubScreen] = useState<string | null>(null)
  const [savedPlaceSub, setSavedPlaceSub] = useState<string | null>(null)
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (name: string) => setOpenSection(prev => prev === name ? null : name)

  const stats = [
    { label: "Total Rides",  value: "47"    },
    { label: "KM Travelled", value: "312"   },
    { label: "Hours Saved",  value: "18"    },
    { label: "Avg Rating",   value: "4.8 ★" },
  ]

  const RIDE_HISTORY = [
    { from: "Victoria Island", to: "Lekki Phase 1", date: "Sep 10, 2026", price: "₦3,200", duration: "22 min · 6.4 km", status: "Completed" },
    { from: "Ikoyi",           to: "Ikeja",         date: "Sep 8, 2026",  price: "₦4,800", duration: "38 min · 14.1 km", status: "Completed" },
    { from: "Surulere",        to: "Victoria Island",date: "Sep 5, 2026", price: "₦2,900", duration: "18 min · 5.2 km",  status: "Completed" },
    { from: "Yaba",            to: "Lekki",         date: "Sep 2, 2026",  price: "₦5,100", duration: "44 min · 18.6 km", status: "Completed" },
  ]

  if (subScreen === "personal") {
    return (
      <ProfileSubScreen title="Personal Information" onBack={() => setSubScreen(null)}>
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-3" style={{ border: `3px solid ${C.border}` }}>
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&auto=format" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <button className="text-sm font-bold" style={{ color: C.primary }}>Change photo</button>
        </div>
        {[
          { label: "Full Name",    value: "Chisom Obi" },
          { label: "Email",        value: "chisom.obi@gmail.com" },
          { label: "Phone",        value: "+234 812 000 0000" },
          { label: "Date of Birth",value: "Jan 15, 1996" },
          { label: "Gender",       value: "Male" },
        ].map(f => (
          <div key={f.label} className="mb-4">
            <label className="block text-xs font-bold mb-1.5" style={{ color: C.secondary }}>{f.label}</label>
            <div className="flex items-center justify-between px-4 py-3.5 rounded-xl" style={{ background: "white", border: `1.5px solid ${C.border}` }}>
              <span className="text-sm font-semibold" style={{ color: C.ink }}>{f.value}</span>
              <span style={{ color: C.primary }}><I.Edit /></span>
            </div>
          </div>
        ))}
        <button className="w-full py-4 rounded-xl font-bold text-white mt-2" style={{ background: G }}>Save Changes</button>
      </ProfileSubScreen>
    )
  }

  if (subScreen === "payment") {
    return (
      <ProfileSubScreen title="Payment Methods" onBack={() => setSubScreen(null)}>
        <SettingsCard>
          <div className="px-4 py-3 border-b" style={{ borderColor: C.border }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: C.muted }}>Pantra Wallet</p>
          </div>
          <div className="px-4 py-4 flex items-center justify-between">
            <div>
              <p className="text-2xl font-black" style={{ color: C.ink }}>₦12,500</p>
              <p className="text-xs font-semibold mt-1" style={{ color: C.muted }}>Available balance</p>
            </div>
            <button className="px-4 py-2 rounded-xl font-bold text-white text-sm" style={{ background: G }}>Top Up</button>
          </div>
        </SettingsCard>
        <p className="text-xs font-bold uppercase tracking-widest mb-3 px-1" style={{ color: C.muted }}>Linked Cards</p>
        <SettingsCard>
          {[
            { name: "GTBank Debit", last4: "4521", type: "Mastercard" },
            { name: "Access Bank",  last4: "7893", type: "Visa" },
          ].map((card, i) => (
            <div key={i}>
              {i > 0 && <Divider />}
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#F0ECFF", color: C.primary }}><I.CreditCard /></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: C.ink }}>{card.name}</p>
                  <p className="text-xs" style={{ color: C.muted }}>{card.type} •••• {card.last4}</p>
                </div>
                <span className="text-xs font-bold" style={{ color: C.primary }}>Default</span>
              </div>
            </div>
          ))}
        </SettingsCard>
        <button className="w-full py-4 rounded-xl font-bold text-sm mt-2" style={{ background: "#F0ECFF", color: C.primary }}>+ Add Payment Method</button>
      </ProfileSubScreen>
    )
  }

  if (subScreen === "emergency") {
    return (
      <ProfileSubScreen title="Emergency Contacts" onBack={() => setSubScreen(null)}>
        <p className="text-sm mb-5" style={{ color: C.muted }}>These contacts will be notified in case of an emergency during your ride.</p>
        <SettingsCard>
          {[
            { name: "Adaeze Obi", relation: "Sister", phone: "+234 809 111 2222" },
            { name: "Kelechi Obi", relation: "Brother", phone: "+234 703 333 4444" },
          ].map((c, i) => (
            <div key={i}>
              {i > 0 && <Divider />}
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-white text-sm" style={{ background: G }}>{c.name[0]}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: C.ink }}>{c.name}</p>
                  <p className="text-xs" style={{ color: C.muted }}>{c.relation} · {c.phone}</p>
                </div>
                <span style={{ color: C.muted }}><I.Edit /></span>
              </div>
            </div>
          ))}
        </SettingsCard>
        <button className="w-full py-4 rounded-xl font-bold text-sm mt-2" style={{ background: "#F0ECFF", color: C.primary }}>+ Add Contact</button>
      </ProfileSubScreen>
    )
  }

  if (subScreen === "wallet") {
    return (
      <ProfileSubScreen title="My Wallet" onBack={() => setSubScreen(null)}>
        <div className="rounded-3xl p-6 mb-6" style={{ background: G }}>
          <p className="text-white/70 text-sm font-semibold mb-1">Available Balance</p>
          <p className="text-4xl font-black text-white mb-4">₦12,500</p>
          <div className="flex gap-3">
            <button className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>Top Up</button>
            <button className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>Withdraw</button>
          </div>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest mb-3 px-1" style={{ color: C.muted }}>Recent Transactions</p>
        <SettingsCard>
          {[
            { label: "Ride to Lekki",    amount: "-₦3,200", date: "Sep 10", color: C.error },
            { label: "Wallet Top Up",    amount: "+₦5,000", date: "Sep 8",  color: C.success },
            { label: "Ride to Ikeja",    amount: "-₦4,800", date: "Sep 8",  color: C.error },
            { label: "Promo Credit",     amount: "+₦500",   date: "Sep 5",  color: C.success },
          ].map((t, i) => (
            <div key={i}>
              {i > 0 && <Divider />}
              <div className="flex items-center px-4 py-3.5">
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: C.ink }}>{t.label}</p>
                  <p className="text-xs" style={{ color: C.muted }}>{t.date}</p>
                </div>
                <p className="font-bold text-sm" style={{ color: t.color }}>{t.amount}</p>
              </div>
            </div>
          ))}
        </SettingsCard>
      </ProfileSubScreen>
    )
  }

  if (subScreen === "promotions") {
    return (
      <ProfileSubScreen title="Promotions" onBack={() => setSubScreen(null)}>
        <div className="flex gap-3 mb-5">
          <input placeholder="Enter promo code" className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold outline-none" style={{ background: "white", border: `1.5px solid ${C.border}`, color: C.ink }} />
          <button className="px-5 py-3 rounded-xl font-bold text-white text-sm" style={{ background: G }}>Apply</button>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest mb-3 px-1" style={{ color: C.muted }}>Active Promotions</p>
        <div className="flex flex-col gap-3">
          {[
            { title: "₦500 Off", desc: "On your next ride",    expires: "Dec 31, 2026", highlight: false },
            { title: "Free Ride", desc: "Up to ₦3,000 value",   expires: "Jan 15, 2027", highlight: true  },
          ].map((p, i) => (
            <div key={i} className="p-4 rounded-2xl" style={{ background: p.highlight ? "#F4F0FF" : "white", border: `1.5px solid ${p.highlight ? C.primary : C.border}` }}>
              <div className="flex items-center justify-between">
                <p className="font-black text-base" style={{ color: C.ink }}>{p.title}</p>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: G }}>Active</span>
              </div>
              <p className="text-xs mt-1" style={{ color: C.muted }}>{p.desc}</p>
              <p className="text-xs mt-2 font-semibold" style={{ color: C.muted }}>Expires {p.expires}</p>
            </div>
          ))}
        </div>
      </ProfileSubScreen>
    )
  }

  if (subScreen === "my_rides") {
    return (
      <ProfileSubScreen title="My Rides" onBack={() => setSubScreen(null)}>
        <div className="flex flex-col gap-3">
          {RIDE_HISTORY.map((ride, i) => (
            <div key={i} className="rounded-2xl p-4" style={{ background: "white", border: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold" style={{ color: C.muted }}>{ride.date}</p>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "#DCFCE7", color: C.success }}>{ride.status}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: C.primary }} />
                  <div className="w-px h-5" style={{ background: "#E4E0F4" }} />
                  <div className="w-2 h-2 rounded-full" style={{ background: C.success }} />
                </div>
                <div className="flex flex-col gap-3 flex-1">
                  <p className="text-sm font-medium" style={{ color: C.ink }}>{ride.from}</p>
                  <p className="text-sm font-medium" style={{ color: C.ink }}>{ride.to}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-base" style={{ color: C.ink }}>{ride.price}</p>
                  <p className="text-xs" style={{ color: C.muted }}>{ride.duration}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ProfileSubScreen>
    )
  }

  if (subScreen === "safety") {
    return (
      <ProfileSubScreen title="Safety" onBack={() => setSubScreen(null)}>
        <SettingsCard>
          {[
            { label: "Share Trip Status",  sub: "Let contacts track your ride", enabled: true  },
            { label: "PIN Trips",          sub: "Require PIN before every ride",  enabled: false },
            { label: "Trusted Contacts",   sub: "2 contacts set up",             enabled: true  },
            { label: "Emergency SOS",      sub: "Tap to alert authorities",      enabled: true  },
          ].map((item, i) => (
            <div key={i}>
              {i > 0 && <Divider />}
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: C.ink }}>{item.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: C.muted }}>{item.sub}</p>
                </div>
                <div className="w-11 h-6 rounded-full transition-all cursor-pointer relative" style={{ background: item.enabled ? C.primary : "#D1D5DB" }}>
                  <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all" style={{ left: item.enabled ? "calc(100% - 20px)" : "4px" }} />
                </div>
              </div>
            </div>
          ))}
        </SettingsCard>
      </ProfileSubScreen>
    )
  }

  if (subScreen === "family") {
    return (
      <ProfileSubScreen title="Family Profile" onBack={() => setSubScreen(null)}>
        <p className="text-sm mb-5" style={{ color: C.muted }}>Manage rides for your family members from one account.</p>
        <SettingsCard>
          <div className="px-4 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-sm" style={{ background: G }}>A</div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: C.ink }}>Adaeze Obi</p>
              <p className="text-xs" style={{ color: C.muted }}>Sister · Family member</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "#F0ECFF", color: C.primary }}>Active</span>
          </div>
        </SettingsCard>
        <button className="w-full py-4 rounded-xl font-bold text-sm mt-2" style={{ background: "#F0ECFF", color: C.primary }}>+ Add Family Member</button>
      </ProfileSubScreen>
    )
  }

  if (subScreen === "security") {
    return (
      <ProfileSubScreen title="Login & Security" onBack={() => setSubScreen(null)}>
        <SettingsCard>
          <SettingsRow label="Change Password" sub="Last changed 3 months ago" icon={<I.Shield />} />
          <Divider />
          <SettingsRow label="Two-Factor Authentication" sub="Enabled via email" icon={<I.Shield />} />
          <Divider />
          <SettingsRow label="Active Sessions" sub="2 devices logged in" icon={<I.Phone />} />
        </SettingsCard>
        <p className="text-xs font-bold uppercase tracking-widest mb-3 px-1" style={{ color: C.muted }}>Privacy</p>
        <SettingsCard>
          <SettingsRow label="Data & Privacy" sub="Manage your personal data" icon={<I.Shield />} />
          <Divider />
          <SettingsRow label="Manage Permissions" sub="Location, notifications" icon={<I.Bell2 />} />
          <Divider />
          <SettingsRow label="Delete Account" sub="Permanently remove your account" icon={<I.LogOut />} destructive />
        </SettingsCard>
      </ProfileSubScreen>
    )
  }

  if (subScreen === "saved_places") {
    if (savedPlaceSub === "home") {
      return (
        <ProfileSubScreen title="Add Home Address" onBack={() => setSavedPlaceSub(null)}>
          <p className="text-sm mb-5" style={{ color: C.muted }}>Set your home address for quick access when booking rides.</p>
          <input placeholder="Search for your home address..." className="w-full px-4 py-3.5 rounded-xl text-sm font-semibold outline-none mb-4" style={{ background: "white", border: `1.5px solid ${C.border}`, color: C.ink }} />
          <button className="w-full py-4 rounded-xl font-bold text-white" style={{ background: G }}>Save Home Address</button>
        </ProfileSubScreen>
      )
    }
    if (savedPlaceSub === "work") {
      return (
        <ProfileSubScreen title="Add Work Address" onBack={() => setSavedPlaceSub(null)}>
          <p className="text-sm mb-5" style={{ color: C.muted }}>Set your work address for quick access during commutes.</p>
          <input placeholder="Search for your work address..." className="w-full px-4 py-3.5 rounded-xl text-sm font-semibold outline-none mb-4" style={{ background: "white", border: `1.5px solid ${C.border}`, color: C.ink }} />
          <button className="w-full py-4 rounded-xl font-bold text-white" style={{ background: G }}>Save Work Address</button>
        </ProfileSubScreen>
      )
    }
    if (savedPlaceSub === "manage") {
      return (
        <ProfileSubScreen title="Manage Saved Places" onBack={() => setSavedPlaceSub(null)}>
          <SettingsCard>
            <div className="px-4 py-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#F0ECFF", color: C.primary }}><I.HomeIcon /></div>
              <div className="flex-1"><p className="text-sm font-semibold" style={{ color: C.ink }}>Home</p><p className="text-xs" style={{ color: C.muted }}>15 Admiralty Way, Lekki Phase 1</p></div>
              <I.Edit />
            </div>
            <Divider />
            <div className="px-4 py-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#F0ECFF", color: C.primary }}><I.MapPin /></div>
              <div className="flex-1"><p className="text-sm font-semibold" style={{ color: C.ink }}>Work</p><p className="text-xs" style={{ color: C.muted }}>Plot 1 Ozumba Mbadiwe, Victoria Island</p></div>
              <I.Edit />
            </div>
          </SettingsCard>
          <button className="w-full py-4 rounded-xl font-bold text-sm mt-2" style={{ background: "#F0ECFF", color: C.primary }}>+ Add New Place</button>
        </ProfileSubScreen>
      )
    }
    return (
      <ProfileSubScreen title="Saved Places" onBack={() => setSubScreen(null)}>
        <SettingsCard>
          <SettingsRow label="Add Home Address" sub="Set your home for quick booking" icon={<I.HomeIcon />} onClick={() => setSavedPlaceSub("home")} />
          <Divider />
          <SettingsRow label="Add Work Address" sub="Set your workplace address" icon={<I.MapPin />} onClick={() => setSavedPlaceSub("work")} />
          <Divider />
          <SettingsRow label="Manage Saved Places" sub="View and edit all saved locations" icon={<I.Navigation />} onClick={() => setSavedPlaceSub("manage")} />
        </SettingsCard>
      </ProfileSubScreen>
    )
  }

  if (subScreen === "theme") {
    return (
      <ProfileSubScreen title="Theme" onBack={() => setSubScreen(null)}>
        <div className="flex flex-col gap-3">
          {[
            { label: "Light",   active: true  },
            { label: "Dark",    active: false },
            { label: "System",  active: false },
          ].map(t => (
            <div key={t.label} className="flex items-center justify-between px-4 py-4 rounded-2xl" style={{ background: "white", border: `2px solid ${t.active ? C.primary : C.border}` }}>
              <span className="text-sm font-semibold" style={{ color: C.ink }}>{t.label}</span>
              {t.active && <span className="text-xs font-bold" style={{ color: C.primary }}>✓ Active</span>}
            </div>
          ))}
        </div>
      </ProfileSubScreen>
    )
  }

  if (subScreen === "language") {
    return (
      <ProfileSubScreen title="Language" onBack={() => setSubScreen(null)}>
        <div className="flex flex-col gap-3">
          {[
            { label: "English",  active: true  },
            { label: "Yoruba",   active: false },
            { label: "Igbo",     active: false },
            { label: "Hausa",    active: false },
            { label: "French",   active: false },
          ].map(l => (
            <div key={l.label} className="flex items-center justify-between px-4 py-4 rounded-2xl" style={{ background: "white", border: `2px solid ${l.active ? C.primary : C.border}` }}>
              <span className="text-sm font-semibold" style={{ color: C.ink }}>{l.label}</span>
              {l.active && <span className="text-xs font-bold" style={{ color: C.primary }}>✓ Selected</span>}
            </div>
          ))}
        </div>
      </ProfileSubScreen>
    )
  }

  if (subScreen === "privacy") {
    return (
      <ProfileSubScreen title="Privacy" onBack={() => setSubScreen(null)}>
        <SettingsCard>
          <SettingsRow label="Data & Privacy" sub="Manage your personal data" icon={<I.Shield />} />
          <Divider />
          <SettingsRow label="Manage Permissions" sub="Location, camera, notifications" icon={<I.Bell2 />} />
          <Divider />
          <SettingsRow label="Ad Preferences" sub="Control how we personalise ads" icon={<I.Shield />} />
          <Divider />
          <SettingsRow label="Delete Account" sub="Permanently remove your account" icon={<I.LogOut />} destructive />
        </SettingsCard>
      </ProfileSubScreen>
    )
  }

  if (subScreen === "expense") {
    return (
      <ProfileSubScreen title="Expense Your Rides" onBack={() => setSubScreen(null)}>
        <p className="text-sm mb-5" style={{ color: C.muted }}>Connect your ride receipts to your business expense account.</p>
        <SettingsCard>
          <SettingsRow label="Connect Expense Account" sub="Link to Expensify, SAP, etc." icon={<I.CreditCard />} />
          <Divider />
          <SettingsRow label="Download Receipts" sub="Export ride history as PDF or CSV" icon={<I.CarIcon />} />
        </SettingsCard>
      </ProfileSubScreen>
    )
  }

  if (subScreen === "about") {
    return (
      <ProfileSubScreen title="About" onBack={() => setSubScreen(null)}>
        <div className="flex flex-col items-center py-8 mb-4">
          <PantraLogo className="w-16 h-16 mb-4" />
          <p className="text-xl font-black" style={{ color: C.ink }}>PANTRA</p>
          <p className="text-xs mt-1" style={{ color: C.muted }}>Version 1.0.0</p>
        </div>
        <SettingsCard>
          <SettingsRow label="What's New" sub="See the latest updates" icon={<I.Star />} />
          <Divider />
          <SettingsRow label="Blog & News" sub="pantra.com/blog" icon={<I.Navigation />} />
          <Divider />
          <SettingsRow label="Open Source Licenses" icon={<I.HelpCircle />} />
        </SettingsCard>
        <p className="text-center text-xs mt-2" style={{ color: C.muted }}>© 2026 Pantra Technologies Ltd.</p>
      </ProfileSubScreen>
    )
  }

  if (subScreen === "terms") {
    return (
      <ProfileSubScreen title="Terms & Conditions" onBack={() => setSubScreen(null)}>
        <p className="text-xs font-semibold mb-4" style={{ color: C.muted }}>Last updated: September 2026</p>
        {["1. Acceptance of Terms", "2. Use of Services", "3. User Accounts", "4. Payments & Refunds", "5. Driver Conduct", "6. Limitation of Liability"].map((t, i) => (
          <div key={i} className="mb-4 p-4 rounded-xl" style={{ background: "white", border: `1px solid ${C.border}` }}>
            <p className="text-sm font-bold mb-1" style={{ color: C.ink }}>{t}</p>
            <p className="text-xs leading-relaxed" style={{ color: C.muted }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
        ))}
      </ProfileSubScreen>
    )
  }

  if (subScreen === "comm_prefs") {
    return (
      <ProfileSubScreen title="Communication Preferences" onBack={() => setSubScreen(null)}>
        <SettingsCard>
          {[
            { label: "Push Notifications", sub: "Ride updates & alerts",      enabled: true  },
            { label: "Email Updates",       sub: "Receipts & promotions",     enabled: true  },
            { label: "SMS Alerts",          sub: "Critical ride updates",     enabled: false },
            { label: "Marketing Emails",    sub: "Offers and news from Pantra", enabled: false },
          ].map((item, i) => (
            <div key={i}>
              {i > 0 && <Divider />}
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: C.ink }}>{item.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: C.muted }}>{item.sub}</p>
                </div>
                <div className="w-11 h-6 rounded-full cursor-pointer relative" style={{ background: item.enabled ? C.primary : "#D1D5DB" }}>
                  <div className="absolute top-1 w-4 h-4 rounded-full bg-white" style={{ left: item.enabled ? "calc(100% - 20px)" : "4px" }} />
                </div>
              </div>
            </div>
          ))}
        </SettingsCard>
      </ProfileSubScreen>
    )
  }

  if (subScreen === "calendars") {
    return (
      <ProfileSubScreen title="Calendars" onBack={() => setSubScreen(null)}>
        <p className="text-sm mb-5" style={{ color: C.muted }}>Connect your calendar to get reminders and schedule rides in advance.</p>
        <SettingsCard>
          {[
            { label: "Google Calendar", connected: true  },
            { label: "Apple Calendar",  connected: false },
            { label: "Outlook",         connected: false },
          ].map((cal, i) => (
            <div key={i}>
              {i > 0 && <Divider />}
              <div className="flex items-center px-4 py-3.5">
                <p className="text-sm font-semibold flex-1" style={{ color: C.ink }}>{cal.label}</p>
                <button className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ background: cal.connected ? "#F0ECFF" : G, color: cal.connected ? C.primary : "white" }}>
                  {cal.connected ? "Connected" : "Connect"}
                </button>
              </div>
            </div>
          ))}
        </SettingsCard>
      </ProfileSubScreen>
    )
  }

  // ─── Main Profile View ────────────────────────────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "#FAF8FF" }}>

      {/* Minimal top bar */}
      <div className="flex items-center justify-between px-5 pt-8 pb-5">
        <div>
          <p className="text-xl font-black" style={{ color: C.ink }}>Chisom Obi</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <svg viewBox="0 0 24 24" fill="#F59E0B" className="w-3.5 h-3.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span className="text-sm font-bold" style={{ color: C.ink }}>4.8</span>
            <span className="text-xs font-semibold" style={{ color: C.muted }}>· 47 rides</span>
          </div>
        </div>
        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0" style={{ border: `2.5px solid ${C.border}` }}>
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&auto=format" alt="Chisom Obi" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="px-5 pb-6 flex flex-col gap-3">
        {([
          {
            key: "profile",
            label: "Profile",
            headerIcon: <I.Person />,
            items: [
              { icon: <I.Person />,     label: "Personal Information", sub: "Chisom Obi · +234 812 000 0000", action: () => setSubScreen("personal") },
            ],
          },
          {
            key: "payments",
            label: "Account & Payments",
            headerIcon: <I.CreditCard />,
            items: [
              { icon: <I.Gift />,       label: "My Wallet",          sub: "Balance: ₦12,500",               action: () => setSubScreen("wallet") },
              { icon: <I.CreditCard />, label: "Payment Methods",    sub: "GTBank ••••4521 · Pantra Wallet", action: () => setSubScreen("payment") },
              { icon: <I.Star />,       label: "Promotions",         sub: "2 active promotions",             action: () => setSubScreen("promotions") },
              { icon: <I.CarIcon />,    label: "Ride History",       sub: "47 completed rides",              action: () => setSubScreen("my_rides") },
              { icon: <I.CreditCard />, label: "Expense Your Rides", sub: "Link to expense accounts",        action: () => setSubScreen("expense") },
            ],
          },
          {
            key: "security",
            label: "Personal Info & Security",
            headerIcon: <I.Shield />,
            items: [
              { icon: <I.Users />,  label: "Family Profile",   sub: "1 family member added",      action: () => setSubScreen("family") },
              { icon: <I.Shield />, label: "Login & Security", sub: "Password, 2FA, sessions",    action: () => setSubScreen("security") },
              { icon: <I.Shield />, label: "Privacy",          sub: "Data, permissions & account", action: () => setSubScreen("privacy") },
              { icon: <I.Shield />, label: "Safety",           sub: "Trip sharing, emergency SOS", action: () => setSubScreen("safety") },
            ],
          },
          {
            key: "places",
            label: "Places",
            headerIcon: <I.MapPin />,
            items: [
              { icon: <I.HomeIcon />,   label: "Home Address",        sub: "15 Admiralty Way, Lekki",     action: () => { setSubScreen("saved_places"); setSavedPlaceSub("home") } },
              { icon: <I.MapPin />,     label: "Work Address",        sub: "Plot 1 Ozumba Mbadiwe, V.I.", action: () => { setSubScreen("saved_places"); setSavedPlaceSub("work") } },
              { icon: <I.Navigation />, label: "Manage Saved Places", sub: "View and edit all locations",  action: () => { setSubScreen("saved_places"); setSavedPlaceSub("manage") } },
            ],
          },
          {
            key: "prefs",
            label: "App Preferences",
            headerIcon: <I.Edit />,
            items: [
              { icon: <I.Edit />,     label: "Theme",                     sub: "Light mode",                action: () => setSubScreen("theme") },
              { icon: <I.Bell2 />,    label: "Language",                  sub: "English",                   action: () => setSubScreen("language") },
              { icon: <I.Bell2 />,    label: "Communication Preferences", sub: "Notifications, email & SMS", action: () => setSubScreen("comm_prefs") },
              { icon: <I.Calendar />, label: "Calendars",                 sub: "Google Calendar connected",  action: () => setSubScreen("calendars") },
            ],
          },
          {
            key: "support",
            label: "Support & Legal",
            headerIcon: <I.HelpCircle />,
            items: [
              { icon: <I.HelpCircle />, label: "Support",              sub: "FAQs, chat with us",      action: undefined },
              { icon: <I.Star />,       label: "About",                sub: "Version, what's new",     action: () => setSubScreen("about") },
              { icon: <I.HelpCircle />, label: "Terms and Conditions", sub: "Last updated Sep 2026",   action: () => setSubScreen("terms") },
              { icon: <I.Shield />,     label: "Privacy Policy",       sub: "How we handle your data", action: () => setSubScreen("privacy") },
            ],
          },
        ] as { key: string; label: string; headerIcon: React.ReactNode; items: { icon: React.ReactNode; label: string; sub: string; action?: () => void }[] }[]).map(section => {
          const isOpen = openSection === section.key
          return (
            <div key={section.key} className="rounded-2xl overflow-hidden" style={{ background: "white", border: `1px solid ${C.border}` }}>
              {/* Section header */}
              <button
                onClick={() => toggleSection(section.key)}
                className="accordion-header w-full flex items-center gap-3 px-4 py-4 text-left"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#F0ECFF", color: C.primary }}>
                  {section.headerIcon}
                </div>
                <p className="text-sm font-bold flex-1" style={{ color: C.ink }}>{section.label}</p>
                <svg
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
                  strokeLinecap="round" strokeLinejoin="round"
                  className="w-4 h-4 transition-transform duration-300"
                  style={{ color: C.muted, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* Expandable items */}
              {isOpen && (
                <div style={{ borderTop: `1px solid ${C.border}` }}>
                  {section.items.map((item, i) => (
                    <div key={i}>
                      {i > 0 && <Divider />}
                      <button
                        onClick={item.action}
                        className="profile-row w-full flex items-center gap-3 px-4 py-3.5 text-left"
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#F0ECFF", color: C.primary }}>
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold" style={{ color: C.ink }}>{item.label}</p>
                          <p className="text-xs mt-0.5" style={{ color: C.muted }}>{item.sub}</p>
                        </div>
                        <span style={{ color: C.muted }}><I.ChevronRight /></span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* Sign out */}
        <button className="w-full py-4 rounded-2xl text-sm font-bold transition-all mt-2" style={{ background: "#FEE2E2", color: C.error }}>
          <span className="flex items-center justify-center gap-2"><I.LogOut /> Sign Out</span>
        </button>
      </div>
    </div>
  )
}


// ─── Gifts Screen ─────────────────────────────────────────────────────────────
const MILESTONES = [
  { trips: 5,   reward: "₦500 discount",     done: true,  current: false },
  { trips: 10,  reward: "Free ride (₦3,000)", done: true,  current: false },
  { trips: 20,  reward: "Premium upgrade",    done: false, current: true  },
  { trips: 35,  reward: "VIP Lounge access",  done: false, current: false },
  { trips: 50,  reward: "Gold membership",    done: false, current: false },
]

const AVAILABLE_GIFTS = [
  { icon: "🏷",  name: "₦500 Off",       desc: "On your next ride",    expires: "Dec 31",  highlight: false },
  { icon: "🎟",  name: "Free Ride",       desc: "Up to ₦3,000 value",   expires: "Jan 15",  highlight: true  },
  { icon: "⚡",  name: "Priority Pickup", desc: "Skip the queue always", expires: "Dec 25",  highlight: false },
]

function GiftsScreen() {
  const currentTrips = 14
  const nextGoal = 20
  const progress = (currentTrips / nextGoal) * 100

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "#FAF8FF" }}>

      {/* Hero header */}
      <div className="relative px-5 pt-6 pb-8 overflow-hidden" style={{ background: G }}>
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10" style={{ background: "white" }} />
        <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full opacity-10" style={{ background: "white" }} />

        <div className="flex items-start justify-between mb-5 relative">
          <div>
            <p className="text-white/70 text-sm font-medium">Complete rides, earn rewards</p>
            <h1 className="text-2xl font-black text-white mt-1">Your Gifts 🎁</h1>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.2)" }}>
            <I.Bell />
          </div>
        </div>

        {/* Progress card */}
        <div className="rounded-2xl p-4 relative" style={{ background: "rgba(255,255,255,0.18)" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white font-black text-2xl leading-none">{currentTrips} <span className="text-base font-semibold text-white/70">rides</span></p>
              <p className="text-white/70 text-xs mt-0.5">This month</p>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold text-sm">{nextGoal - currentTrips} more to go</p>
              <p className="text-white/60 text-xs">for Premium upgrade</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.25)" }}>
            <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: "white" }} />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-white/60">0</span>
            <span className="text-[10px] text-white/60">{nextGoal} rides</span>
          </div>
        </div>
      </div>

      {/* Available gifts */}
      <div className="px-5 mt-5 mb-6">
        <p className="font-bold text-base mb-3" style={{ color: C.ink }}>Available Gifts</p>
        <div className="flex flex-col gap-3">
          {AVAILABLE_GIFTS.map(gift => (
            <div
              key={gift.name}
              className="flex items-center gap-4 p-4 rounded-2xl"
              style={{
                background: gift.highlight ? "#F0ECFF" : "white",
                border: `1.5px solid ${gift.highlight ? C.primary + "40" : C.border}`,
                boxShadow: gift.highlight ? `0 4px 20px rgba(123,61,248,0.1)` : "none",
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: gift.highlight ? "white" : "#F9F8FF" }}
              >
                {gift.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm" style={{ color: C.ink }}>{gift.name}</p>
                  {gift.highlight && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: G, color: "white" }}>NEW</span>
                  )}
                </div>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>{gift.desc}</p>
                <p className="text-[10px] mt-1 font-semibold" style={{ color: C.muted }}>Expires {gift.expires}</p>
              </div>
              <button
                className="px-4 py-2 rounded-xl text-sm font-bold flex-shrink-0"
                style={{ background: gift.highlight ? G : "#F0ECFF", color: gift.highlight ? "white" : C.primary }}
              >
                Redeem
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Milestone track */}
      <div className="px-5 mb-8">
        <p className="font-bold text-base mb-4" style={{ color: C.ink }}>Ride Milestones</p>
        <div className="relative pl-5">
          {/* vertical connector */}
          <div className="absolute left-5 top-3 bottom-3 w-px" style={{ background: C.border }} />

          <div className="flex flex-col gap-1">
            {MILESTONES.map((m, i) => (
              <div key={i} className="relative flex items-center gap-4 py-3 pl-7">
                {/* dot */}
                <div
                  className="absolute left-0 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: m.done ? G : m.current ? "white" : "#F0ECFF",
                    border: m.current ? `2px solid ${C.primary}` : m.done ? "none" : `2px solid ${C.border}`,
                    zIndex: 1,
                  }}
                >
                  {m.done && <span className="text-[10px] text-white font-black">✓</span>}
                  {m.current && <div className="w-2 h-2 rounded-full" style={{ background: C.primary }} />}
                </div>

                <div className="flex-1 flex items-center justify-between py-2.5 px-4 rounded-2xl" style={{
                  background: m.current ? "#F0ECFF" : "white",
                  border: `1px solid ${m.current ? C.primary + "30" : C.border}`,
                }}>
                  <div>
                    <p className="text-sm font-bold" style={{ color: m.done ? C.muted : C.ink }}>{m.reward}</p>
                    <p className="text-xs" style={{ color: C.muted }}>{m.trips} rides</p>
                  </div>
                  {m.current && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: G, color: "white" }}>
                      In progress
                    </span>
                  )}
                  {m.done && (
                    <span className="text-xs font-bold" style={{ color: C.success }}>Earned ✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="mx-5 mb-8 p-5 rounded-3xl" style={{ background: G }}>
        <p className="font-bold text-white mb-3">How it works</p>
        {[
          { step: "1", text: "Complete rides with Pantra" },
          { step: "2", text: "Hit milestones to unlock rewards" },
          { step: "3", text: "Redeem gifts on future rides" },
        ].map(s => (
          <div key={s.step} className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black" style={{ background: "rgba(255,255,255,0.25)", color: "white" }}>{s.step}</div>
            <p className="text-sm text-white/80">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Pantra Logo SVG ────────────────────────────────────────────────────────────
const PantraLogo = ({ className = "w-24 h-24" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    <defs>
      <linearGradient id="pGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#05AFF2" />
        <stop offset="50%" stopColor="#7B3DF8" />
        <stop offset="100%" stopColor="#AF18D9" />
      </linearGradient>
      <filter id="pGlow">
        <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <path 
      d="M35 75 Q35 60 35 45 C35 20 75 20 75 45 C75 70 35 70 35 50" 
      stroke="url(#pGrad)" 
      strokeWidth="16" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      filter="url(#pGlow)"
    />
  </svg>
)

// ─── Skeleton Shimmer Block ──────────────────────────────────────────────────
function Sk({ w, h, r = 12, style }: { w?: number | string; h: number; r?: number; style?: React.CSSProperties }) {
  return (
    <div
      className="skeleton-shimmer"
      style={{ width: w, height: h, borderRadius: r, flexShrink: 0, ...style }}
    />
  )
}

// ─── Role Selection Skeleton ──────────────────────────────────────────────────
function RoleSelectionSkeleton() {
  return (
    <div className="w-full h-full flex flex-col page-enter" style={{ background: "#F9F8FF" }}>
      <div className="px-6 pt-16 pb-8 flex-1 flex flex-col">
        <Sk w={96} h={96} r={20} style={{ marginBottom: 32 }} />
        <Sk w="72%" h={34} style={{ marginBottom: 10 }} />
        <Sk w="48%" h={16} style={{ marginBottom: 40 }} />
        <div className="flex flex-col gap-5 flex-1">
          <Sk w="100%" h={144} r={24} />
          <Sk w="100%" h={144} r={24} />
        </div>
      </div>
    </div>
  )
}

// ─── Login Skeleton ───────────────────────────────────────────────────────────
function LoginSkeleton() {
  return (
    <div className="w-full h-full flex flex-col page-enter" style={{ background: "#F9F8FF" }}>
      <div className="px-6 pt-16 pb-8 flex-1 flex flex-col">
        <Sk w={96} h={96} r={20} style={{ marginBottom: 32 }} />
        <Sk w="60%" h={34} style={{ marginBottom: 10 }} />
        <Sk w="52%" h={16} style={{ marginBottom: 24 }} />
        <Sk w={100} h={18} style={{ marginBottom: 32 }} />
        <div className="flex flex-col gap-4" style={{ flex: 1 }}>
          <Sk w="100%" h={54} r={14} />
          <Sk w="100%" h={54} r={14} />
          <Sk w="100%" h={54} r={14} />
        </div>
        <Sk w="100%" h={54} r={14} style={{ marginTop: 24 }} />
        <Sk w="55%" h={14} r={8} style={{ marginTop: 20, alignSelf: "center" }} />
      </div>
    </div>
  )
}

// ─── Main App Skeleton ────────────────────────────────────────────────────────
function MainAppSkeleton() {
  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden page-enter">
      {/* Map background */}
      <div className="flex-1" style={{ background: "#EDEBF8" }}>
        <svg viewBox="0 0 400 360" className="w-full h-full" style={{ opacity: 0.6 }}>
          <g stroke="#D8D4EE" strokeWidth={16} fill="none">
            <line x1="0" y1="170" x2="400" y2="170"/>
            <line x1="200" y1="0" x2="200" y2="360"/>
            <line x1="0" y1="80" x2="400" y2="80"/>
            <line x1="0" y1="260" x2="400" y2="260"/>
            <line x1="100" y1="0" x2="100" y2="360"/>
            <line x1="300" y1="0" x2="300" y2="360"/>
          </g>
          <g fill="#E0DCF2" opacity={0.55}>
            <rect x="108" y="90" width="82" height="70" rx="5"/>
            <rect x="208" y="90" width="82" height="70" rx="5"/>
            <rect x="108" y="178" width="82" height="72" rx="5"/>
            <rect x="208" y="178" width="82" height="72" rx="5"/>
            <rect x="12" y="12" width="78" height="58" rx="4"/>
            <rect x="312" y="268" width="78" height="80" rx="4"/>
          </g>
        </svg>
      </div>
      {/* Search bar skeleton */}
      <div className="absolute top-3 left-4 right-4" style={{ zIndex: 30 }}>
        <div className="flex items-center gap-2.5">
          <Sk w={40} h={40} r={999} />
          <div className="flex-1"><Sk w="100%" h={40} r={999} /></div>
          <Sk w={40} h={40} r={999} />
        </div>
      </div>
      {/* Bottom sheet skeleton */}
      <div
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl"
        style={{ background: "white", height: 96, boxShadow: "0 -4px 32px rgba(13,10,26,0.12)", zIndex: 20 }}
      >
        <div className="flex flex-col items-center pt-3 pb-3">
          <div style={{ width: 40, height: 4, borderRadius: 999, background: "#D8D4EE" }} />
        </div>
        <div className="px-5 flex items-center justify-between">
          <Sk w={110} h={16} />
          <div className="flex gap-2">
            <Sk w={72} h={28} r={999} />
            <Sk w={72} h={28} r={999} />
            <Sk w={72} h={28} r={999} />
          </div>
        </div>
      </div>
      {/* Bottom nav skeleton */}
      <div className="flex justify-center pb-5 pt-3" style={{ background: "transparent", zIndex: 50 }}>
        <Sk w={260} h={52} r={999} />
      </div>
    </div>
  )
}

// ─── Landing Screen ───────────────────────────────────────────────────────────
function LandingScreen({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden" style={{ background: "#FFFFFF" }}>

      <div className="relative z-10 flex flex-col items-center flex-1 justify-center">
        <img
          src="/pantra-logo.PNG"
          alt="Pantra"
          className="w-56 animate-fade-in"
          style={{ objectFit: "contain" }}
        />
        <p className="text-sm font-semibold text-center px-8 mt-2 animate-fade-in" style={{ color: C.muted }}>
          The premium ride experience tailored for your comfort.
        </p>
      </div>

      <div className="relative z-10 w-full px-6 pb-12 animate-fade-in">
        <button
          onClick={onGetStarted}
          className="w-full py-4 rounded-2xl font-black text-white text-base shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          style={{ background: G, boxShadow: "0 8px 32px rgba(123,61,248,0.4)" }}
        >
          Get Started
        </button>
      </div>
    </div>
  )
}

// ─── Role Selection Screen ────────────────────────────────────────────────────
function RoleSelectionScreen({ onSelectRole }: { onSelectRole: (role: "rider" | "driver") => void }) {
  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden" style={{ background: "#FFFFFF" }}>
      <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-10 blur-[60px]" style={{ background: "#05AFF2" }} />
      
      <div className="px-6 pt-16 pb-8 relative z-10 flex-1 flex flex-col">
        <div style={{ isolation: "isolate", background: "#FFFFFF", display: "inline-block", borderRadius: 12, marginBottom: 32 }}>
          <img src="/pantra-logo.PNG" alt="Pantra" className="w-24" style={{ objectFit: "contain", mixBlendMode: "multiply", display: "block" }} />
        </div>
        
        <h1 className="text-3xl font-black mb-2" style={{ color: C.ink }}>How would you like to use Pantra?</h1>
        <p className="text-sm font-semibold mb-10" style={{ color: C.muted }}>
          Select an option to continue
        </p>

        <div className="flex flex-col gap-5 flex-1">
          {/* Rider Box */}
          <button
            onClick={() => onSelectRole("rider")}
            className="w-full text-left p-5 rounded-3xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ 
              background: "#F9F8FF", 
              border: `2px solid ${C.primary}`, 
              boxShadow: "0 8px 24px rgba(123,61,248,0.15)" 
            }}
          >
            <div className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center text-white" style={{ background: G }}>
              <I.Person />
            </div>
            <h2 className="text-xl font-black mb-2" style={{ color: C.ink }}>I need a ride</h2>
            <p className="text-sm font-semibold leading-relaxed" style={{ color: C.muted }}>
              Book rides, schedule trips and get to your destination safely
            </p>
          </button>

          {/* Driver Box */}
          <button
            onClick={() => onSelectRole("driver")}
            className="w-full text-left p-5 rounded-3xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ 
              background: "white", 
              border: `2px solid ${C.border}`, 
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)" 
            }}
          >
            <div className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center" style={{ background: "#F0ECFF", color: C.primary }}>
              <I.CarIcon />
            </div>
            <h2 className="text-xl font-black mb-2" style={{ color: C.ink }}>I want to drive</h2>
            <p className="text-sm font-semibold leading-relaxed" style={{ color: C.muted }}>
              Earn money by driving passengers to their destinations
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Login / Signup Screen ────────────────────────────────────────────────────
function LoginScreen({ role, onLogin, onBack }: { role: "rider" | "driver", onLogin: () => void, onBack: () => void }) {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || (!isLogin && !name)) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onLogin()
    }, 1200)
  }

  return (
    <div className="w-full h-full flex flex-col bg-white relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-[60px]" style={{ background: "#7B3DF8" }} />
      
      <div className="px-6 pt-16 pb-8 relative z-10 flex-1 flex flex-col">
        <div style={{ isolation: "isolate", background: "#FFFFFF", display: "inline-block", borderRadius: 12, marginBottom: 32 }}>
          <img src="/pantra-logo.PNG" alt="Pantra" className="w-24" style={{ objectFit: "contain", mixBlendMode: "multiply", display: "block" }} />
        </div>
        
        <h1 className="text-3xl font-black mb-2" style={{ color: C.ink }}>
          {isLogin 
            ? (role === "rider" ? "Welcome Rider" : "Welcome Driver")
            : "Create an account"}
        </h1>
        <p className="text-sm font-semibold mb-6" style={{ color: C.muted }}>
          {isLogin ? "Sign in to your account to continue" : "Join Pantra to start your journey"}
        </p>

        <div className="mb-8">
           <button type="button" onClick={onBack} className="text-xs font-bold text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors">
             <I.ArrowLeft /> Back to selection
           </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: C.ink }}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3.5 rounded-xl text-sm font-semibold outline-none transition-all"
                style={{ background: "#F9F8FF", border: `1.5px solid ${name ? C.primary : C.border}`, color: C.ink }}
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: C.ink }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={role === "rider" ? "rider@example.com" : "driver@example.com"}
              className="w-full px-4 py-3.5 rounded-xl text-sm font-semibold outline-none transition-all"
              style={{ background: "#F9F8FF", border: `1.5px solid ${email ? C.primary : C.border}`, color: C.ink }}
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: C.ink }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3.5 rounded-xl text-sm font-semibold outline-none transition-all"
              style={{ background: "#F9F8FF", border: `1.5px solid ${password ? C.primary : C.border}`, color: C.ink }}
            />
            {isLogin && (
              <div className="flex justify-end mt-2">
                <button type="button" className="text-xs font-bold" style={{ color: C.primary }}>Forgot password?</button>
              </div>
            )}
          </div>

          <div className="mt-auto pt-6">
            <button
              type="submit"
              disabled={!email || !password || (!isLogin && !name) || isLoading}
              className="w-full py-4 rounded-xl font-black text-white text-base shadow-lg transition-all flex items-center justify-center gap-2"
              style={{ 
                background: (!email || !password || (!isLogin && !name)) ? "#D8D4EE" : G, 
                opacity: isLoading ? 0.8 : 1,
                boxShadow: (!email || !password || (!isLogin && !name)) ? "none" : "0 8px 24px rgba(123,61,248,0.3)" 
              }}
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                isLogin ? "Continue →" : "Create Account →"
              )}
            </button>
            
            <p className="text-center text-xs font-semibold mt-6" style={{ color: C.muted }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                onClick={() => setIsLogin(!isLogin)} 
                className="font-bold ml-1" 
                style={{ color: C.primary }}
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
type AppPhase = "landing" | "loading_role" | "role_selection" | "loading_login" | "login" | "loading_main" | "main"

// Tab order for direction detection
const TAB_ORDER: NavTab[] = ["home", "places", "gifts", "profile"]

export default function App() {
  const [appPhase, setAppPhase] = useState<AppPhase>("landing")
  const [authRole, setAuthRole] = useState<"rider" | "driver">("rider")
  const [screen, setScreen] = useState<Screen>("home")
  const [navTab, setNavTab] = useState<NavTab>("home")
  const [selectedDestination, setSelectedDestination] = useState<string>("")
  const [tabDirection, setTabDirection] = useState<"left" | "right" | null>(null)
  const [tabKey, setTabKey] = useState(0) // forces re-mount → re-trigger animation

  // Auto-advance loading states after realistic delays
  useEffect(() => {
    if (appPhase === "loading_role") {
      const t = setTimeout(() => setAppPhase("role_selection"), 750)
      return () => clearTimeout(t)
    }
    if (appPhase === "loading_login") {
      const t = setTimeout(() => setAppPhase("login"), 650)
      return () => clearTimeout(t)
    }
    if (appPhase === "loading_main") {
      const t = setTimeout(() => setAppPhase("main"), 900)
      return () => clearTimeout(t)
    }
  }, [appPhase])

  const navBg: Record<Screen, string> = {
    home: "transparent", drivers: "#FAF8FF",
    locations: "#FAF8FF", profile: "#FAF8FF", gifts: "#FAF8FF",
  }

  function handleNav(tab: NavTab) {
    const prevIdx = TAB_ORDER.indexOf(navTab)
    const nextIdx = TAB_ORDER.indexOf(tab)
    setTabDirection(nextIdx > prevIdx ? "right" : "left")
    setTabKey(k => k + 1)
    setNavTab(tab)
    if (tab === "home")    setScreen("home")
    if (tab === "places")  setScreen("locations")
    if (tab === "gifts")   setScreen("gifts")
    if (tab === "profile") setScreen("profile")
  }

  const slideClass = tabDirection === "right" ? "tab-enter-right" : tabDirection === "left" ? "tab-enter-left" : ""

  return (
    <div
      className="w-full flex flex-col overflow-hidden"
      style={{
        background: "#F0ECFF",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        maxWidth: 430,
        margin: "0 auto",
        height: "100dvh",
        maxHeight: "100dvh",
      }}
    >
      {appPhase === "landing" && <LandingScreen onGetStarted={() => setAppPhase("loading_role")} />}

      {appPhase === "loading_role"    && <RoleSelectionSkeleton />}
      {appPhase === "loading_login"   && <LoginSkeleton />}
      {appPhase === "loading_main"    && <MainAppSkeleton />}

      {appPhase === "role_selection" && (
        <div className="page-enter flex-1 flex flex-col min-h-0">
          <RoleSelectionScreen 
            onSelectRole={(r) => { setAuthRole(r); setAppPhase("loading_login"); }} 
          />
        </div>
      )}
      {appPhase === "login" && (
        <div className="page-enter flex-1 flex flex-col min-h-0">
          <LoginScreen 
            role={authRole} 
            onLogin={() => setAppPhase("loading_main")} 
            onBack={() => setAppPhase("role_selection")}
          />
        </div>
      )}
      
      {appPhase === "main" && (
        <>
          <div key={tabKey} className={`flex-1 flex flex-col min-h-0 overflow-hidden ${slideClass}`}>
            {screen === "home" && (
              <HomeScreen
                selectedDestination={selectedDestination}
                setSelectedDestination={setSelectedDestination}
              />
            )}
            {screen === "drivers" && (
              <DriversScreen onBack={() => { setScreen("home"); setNavTab("home"); }} />
            )}
            {screen === "locations" && (
              <LocationsScreen
                onRideHere={(placeName: string) => {
                  setSelectedDestination(placeName)
                  setScreen("home")
                  setNavTab("home")
                }}
              />
            )}
            {screen === "gifts"     && <GiftsScreen />}
            {screen === "profile"   && <ProfileScreen />}
          </div>

          <div className="flex-shrink-0 pb-safe" style={{ background: navBg[screen], zIndex: 50 }}>
            <BottomNav active={navTab} onChange={handleNav} />
          </div>
        </>
      )}
    </div>
  )
}
