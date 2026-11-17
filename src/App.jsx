import { useMemo, useState } from "react";

const CLIENT_CONFIG = {
  businessName: "Genau Rent Car Rabat",
  tagline: "Location de voitures premium et économique 24h/7j à Rabat",
  city: "Rabat",
  address: "Avenue Al Mouqaouama, Rabat",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Genau+Rent+Car+Rabat+Avenue+Al+Mouqaouama",
  whatsappNumber: "212663278633",
  displayPhone: "06 63 27 86 33",
  rating: "4.9",
  reviewCount: "Avis clients vérifiés Google",
  agencyPhotoUrl: "",
  pickupLocations: [
    "Agence Avenue Al Mouqaouama - Rabat",
    "Aéroport Rabat-Salé",
    "Gare Rabat-Agdal",
    "Livraison Hôtel / Domicile",
  ],
};

const FLEET = [
  { id: "logan", name: "Dacia Logan", price: 250, category: "Économique", details: "Manuelle • Diesel • 5 Places • Clim", image: "/cars/dacia-logan.png", fallback: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=900&q=85" },
  { id: "clio5", name: "Renault Clio 5", price: 300, category: "Citadine", details: "Manuelle • Diesel • 5 Places • Écran Tactile", image: "/cars/renault-clio-5.png", fallback: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=85" },
  { id: "peugeot208", name: "Peugeot 208", price: 320, category: "Citadine Premium", details: "Automatique • Diesel • 5 Places • Full Options", image: "/cars/peugeot-208.png", fallback: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85" },
  { id: "duster", name: "Dacia Duster", price: 400, category: "SUV", details: "Manuelle • Diesel • 5 Places • SUV", image: "/cars/dacia-duster.png", fallback: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=85" },
  { id: "tucson", name: "Hyundai Tucson", price: 550, category: "SUV Premium", details: "Automatique • Diesel • 5 Places • SUV Premium", image: "/cars/hyundai-tucson.png", fallback: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=900&q=85" },
  { id: "troc", name: "Volkswagen T-Roc", price: 650, category: "SUV Premium", details: "Automatique • Diesel • 5 Places • Toit Ouvrant", image: "/cars/volkswagen-t-roc.png", fallback: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=85" },
];

const tomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
};

const plusDays = (date, days) => {
  const result = new Date(`${date}T12:00:00`);
  result.setDate(result.getDate() + days);
  return result.toISOString().split("T")[0];
};

const formatDate = (date) =>
  new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${date}T12:00:00`));

function Icon({ children }) {
  return <span aria-hidden="true" className="text-emerald-400">{children}</span>;
}

function CarImage({ car, className = "" }) {
  const [src, setSrc] = useState(car.image);
  return (
    <img
      src={src}
      alt={car.name}
      className={className}
      onError={() => setSrc(car.fallback)}
    />
  );
}

export default function Home() {
  const [selectedId, setSelectedId] = useState(FLEET[0].id);
  const [pickupDate, setPickupDate] = useState(tomorrow());
  const [returnDate, setReturnDate] = useState(plusDays(tomorrow(), 3));
  const [location, setLocation] = useState(CLIENT_CONFIG.pickupLocations[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const selectedCar = FLEET.find((car) => car.id === selectedId) ?? FLEET[0];
  const days = useMemo(() => Math.max(1, Math.ceil((new Date(`${returnDate}T12:00:00`).getTime() - new Date(`${pickupDate}T12:00:00`).getTime()) / 86400000)), [pickupDate, returnDate]);
  const total = days * selectedCar.price;

  const chooseCar = (id) => {
    setSelectedId(id);
    document.getElementById("reservation")?.scrollIntoView({ behavior: "smooth" });
  };

  const submitBooking = (event) => {
    event.preventDefault();
    if (!name.trim() || !pickupDate || !returnDate || new Date(returnDate) < new Date(pickupDate)) {
      setError("Merci de renseigner votre nom et des dates valides.");
      return;
    }
    setError("");
    const message = `Bonjour *${CLIENT_CONFIG.businessName}*,\n\nJe souhaite réserver un véhicule :\n- *Véhicule :* ${selectedCar.name}\n- *Dates :* du ${formatDate(pickupDate)} au ${formatDate(returnDate)} (${days} jour${days > 1 ? "s" : ""})\n- *Lieu de prise en charge :* ${location}\n- *Total estimé :* ${total.toLocaleString("fr-FR")} DH\n- *Nom :* ${name.trim()}\n- *Téléphone :* ${phone || "à confirmer"}\n\nMerci de me confirmer la disponibilité !`;
    window.open(`https://wa.me/${CLIENT_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950 text-zinc-100 pb-20 lg:pb-0">
      <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500 font-black text-zinc-950">G</span>
            <span className="text-sm font-bold tracking-tight sm:text-base">{CLIENT_CONFIG.businessName}</span>
          </a>
          <div className="hidden items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-sm sm:flex"><span className="text-amber-400">★</span><strong>{CLIENT_CONFIG.rating}</strong><span className="text-zinc-400">• {CLIENT_CONFIG.reviewCount}</span></div>
          <a href="#reservation" className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-emerald-400">Réserver <span className="hidden sm:inline">maintenant</span></a>
        </div>
      </header>

      <section className="relative mx-auto max-w-7xl px-5 pb-16 pt-16 lg:px-8 lg:pb-24 lg:pt-28">
        <div className="pointer-events-none absolute -right-32 -top-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300"><span>★</span> {CLIENT_CONFIG.rating} <span className="text-emerald-500/50">•</span> {CLIENT_CONFIG.reviewCount} à {CLIENT_CONFIG.city}</div>
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">Location de Voitures à <span className="text-emerald-400">Rabat</span> — Réservez en 30 Secondes</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">{CLIENT_CONFIG.tagline}. Des véhicules propres, des prix transparents et zéro frais caché. Livraison à l&apos;aéroport ou à la gare, avec confirmation instantanée sur WhatsApp.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#reservation" className="rounded-xl bg-emerald-500 px-6 py-3.5 text-center font-bold text-zinc-950 shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400">Calculer mon tarif &amp; Réserver <span>→</span></a>
            <a href="#flotte" className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-3.5 text-center font-bold text-white transition hover:border-zinc-500">Voir la flotte</a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-400"><span><Icon>✓</Icon> Sans frais cachés</span><span><Icon>✓</Icon> Annulation flexible</span><span><Icon>✓</Icon> Réponse en moins de 5 min</span></div>
        </div>
      </section>

      <section id="flotte" className="border-y border-zinc-900 bg-zinc-950/70 px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between gap-5"><div><p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">Nos véhicules</p><h2 className="text-3xl font-black tracking-tight sm:text-4xl">Notre Flotte Disponible</h2></div><p className="hidden max-w-xs text-right text-sm text-zinc-500 sm:block">Des modèles récents, entretenus et prêts à prendre la route.</p></div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {FLEET.map((car) => (
              <article key={car.id} className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 transition hover:-translate-y-1 hover:border-zinc-700">
                <div className="relative h-52 overflow-hidden bg-white"><CarImage car={car} className="h-full w-full object-cover transition duration-500 hover:scale-105" /><span className="absolute left-4 top-4 rounded-full bg-zinc-950/85 px-3 py-1 text-xs font-semibold text-emerald-300">{car.category}</span></div>
                <div className="p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="text-xl font-bold">{car.name}</h3><p className="mt-1 text-sm text-zinc-500">{car.details}</p></div><p className="shrink-0 text-right"><strong className="block text-lg text-emerald-400">{car.price} DH</strong><span className="text-xs text-zinc-500">/ jour</span></p></div><div className="mt-5 grid grid-cols-2 gap-2 text-xs text-zinc-400"><span><Icon>⚙</Icon> {car.details.split(" • ")[0]}</span><span><Icon>♢</Icon> {car.details.split(" • ")[1]}</span><span><Icon>♙</Icon> 5 Places</span><span><Icon>✦</Icon> {car.details.split(" • ")[3]}</span></div><button onClick={() => chooseCar(car.id)} className="mt-5 w-full rounded-lg border border-zinc-700 py-2.5 text-sm font-bold transition hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-300">Choisir ce véhicule <span>→</span></button></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="reservation" className="scroll-mt-20 px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.25fr] lg:items-start">
          <div className="lg:pt-8"><p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">Réservation express</p><h2 className="text-3xl font-black tracking-tight sm:text-4xl">Votre voiture, en quelques clics.</h2><p className="mt-4 leading-7 text-zinc-400">Choisissez vos dates et votre lieu de prise en charge. Nous vous répondons immédiatement sur WhatsApp pour finaliser votre réservation.</p><div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5"><p className="font-semibold text-emerald-300">⚡ Réponse rapide garantie</p><p className="mt-1 text-sm text-zinc-400">Un conseiller de {CLIENT_CONFIG.businessName} vous confirme la disponibilité en quelques minutes.</p></div></div>
          <form onSubmit={submitBooking} className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-2xl shadow-black/20 sm:p-7">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="mb-2 block text-sm font-semibold">Véhicule souhaité</span><select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="field">{FLEET.map((car) => <option key={car.id} value={car.id}>{car.name} — {car.price} DH/jour</option>)}</select></label>
              <label><span className="mb-2 block text-sm font-semibold">Date de départ</span><input type="date" min={tomorrow()} value={pickupDate} onChange={(e) => { setPickupDate(e.target.value); if (e.target.value >= returnDate) setReturnDate(plusDays(e.target.value, 1)); }} className="field" /></label>
              <label><span className="mb-2 block text-sm font-semibold">Date de retour</span><input type="date" min={plusDays(pickupDate, 1)} value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="field" /></label>
              <label className="sm:col-span-2"><span className="mb-2 block text-sm font-semibold">Lieu de prise en charge</span><select value={location} onChange={(e) => setLocation(e.target.value)} className="field">{CLIENT_CONFIG.pickupLocations.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label><span className="mb-2 block text-sm font-semibold">Votre nom complet</span><input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex. Yassine Alaoui" className="field" /></label>
              <label><span className="mb-2 block text-sm font-semibold">Téléphone <span className="font-normal text-zinc-500">(optionnel)</span></span><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06 00 00 00 00" className="field" /></label>
            </div>
            <div className="mt-6 flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-950/70 p-4"><div><p className="text-sm text-zinc-400">Estimation pour <strong className="text-zinc-200">{selectedCar.name}</strong></p><p className="mt-1 text-xs text-zinc-500">{days} jour{days > 1 ? "s" : ""} · {selectedCar.price} DH / jour</p></div><p className="text-right text-2xl font-black text-emerald-400">{total.toLocaleString("fr-FR")} <span className="text-sm">DH</span></p></div>
            {error && <p role="alert" className="mt-4 text-sm text-red-400">{error}</p>}
            <button type="submit" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3.5 font-bold text-zinc-950 transition hover:bg-emerald-400">Confirmer la réservation sur WhatsApp <span>↗</span></button>
            <p className="mt-3 text-center text-xs text-zinc-500">Aucune carte bancaire demandée · Confirmation instantanée</p>
          </form>
        </div>
      </section>

      <section className="bg-zinc-900/50 px-5 py-16 lg:px-8 lg:py-20"><div className="mx-auto max-w-7xl"><div className="mb-10 text-center"><p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">L&apos;expérience Genau</p><h2 className="text-3xl font-black tracking-tight sm:text-4xl">Pourquoi Nous Choisir</h2></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["♾", "Kilométrage Illimité", "Roulez sans compter chaque kilomètre."], ["◈", "Assurance Tous Risques Incluse", "Partez serein, votre sécurité est notre priorité."], ["✈", "Livraison Aéroport & Gare 24h/7j", "Nous venons à vous, quand vous le souhaitez."], ["⚑", "Assistance Routière 24/7", "Une équipe disponible à chaque étape."]].map(([icon, title, text]) => <div key={title} className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5"><div className="mb-4 text-2xl text-emerald-400">{icon}</div><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-zinc-500">{text}</p></div>)}</div></div></section>

      <section className="border-t border-zinc-900 px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">Nous trouver</p>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Notre Emplacement</h2>
            <p className="mt-3 max-w-xl text-zinc-400">Retrouvez l&apos;équipe Genau Rent Car Rabat au cœur de la ville.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-stretch">
            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/20">
              <iframe
                title="Emplacement de Genau Rent Car Rabat"
                src="https://maps.google.com/maps?q=Avenue%20Al%20Mouqaouama%2C%20Rabat&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="h-72 w-full grayscale-[0.35] brightness-[0.8] contrast-[1.1] sm:h-96 lg:h-full lg:min-h-[360px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="flex flex-col justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-8">
              <div className="mb-6 grid h-12 w-12 place-items-center rounded-xl bg-emerald-500/10 text-2xl text-emerald-400">⌖</div>
              <h3 className="text-xl font-bold">Genau Rent Car Rabat</h3>
              <p className="mt-4 leading-7 text-zinc-300">{CLIENT_CONFIG.address}</p>
              <p className="mt-3 text-sm font-semibold text-emerald-400">Ouvert 24h/24 • 7j/7</p>
              <a href={CLIENT_CONFIG.googleMapsUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3.5 text-center font-bold text-zinc-950 transition hover:bg-emerald-400">Itinéraire sur Google Maps <span className="ml-2">↗</span></a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800 px-5 py-10 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold text-zinc-200">{CLIENT_CONFIG.businessName}</p><p className="mt-1">{CLIENT_CONFIG.address} · {CLIENT_CONFIG.city}</p></div><div className="sm:text-right"><a href={`tel:${CLIENT_CONFIG.displayPhone.replace(/\s/g, "")}`} className="font-semibold text-emerald-400">{CLIENT_CONFIG.displayPhone}</a><p className="mt-1">© {new Date().getFullYear()} {CLIENT_CONFIG.businessName}. Tous droits réservés.</p></div></div></footer>
      <a href={`https://wa.me/${CLIENT_CONFIG.whatsappNumber}`} target="_blank" rel="noreferrer" className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-2 bg-emerald-500 px-5 py-3.5 text-sm font-bold text-zinc-950 lg:hidden">Réserver sur WhatsApp <span>↗</span></a>
    </main>
  );
}
