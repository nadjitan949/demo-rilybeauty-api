import type { AxiosError } from "axios";
import { useEffect, useState, } from "react"
import api from "../../../../../api/axios";
import type Salon from "../../../../../interfaces/SalonInterface";

const DAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]

// 🟣 Interface pour le payload de réservation
interface BookingPayload {
    reference?: string;
    date: string; // ISO string
    endTime?: string;
    status?: string;
    note?: string;
    userId: number;
    salonId: number;
    serviceId: number;
    employeeId: number;
}

// 🟣 Interface pour le payload de paiement
interface PaymentPayload {
    provider: 'CMI' | 'PAYPAL' | 'CASH';
    currency: 'EUR' | 'USD' | 'MAD' | 'XOF' | 'XAF';
    appointmentId: number;
}

function SalonList() {
    const [error, setError] = useState<string | "">("")
    const [salons, setSalons] = useState<Salon[] | null>(null)
    const [detailsSalon, setDetailsSalon] = useState<Salon | null>(null)
    const [showDetails, setShowDetails] = useState<boolean>(false)

    // 🟣 États pour la réservation
    const [showBookingModal, setShowBookingModal] = useState<boolean>(false)
    const [selectedService, setSelectedService] = useState<number | null>(null)
    const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null)
    const [bookingDate, setBookingDate] = useState<string>("")
    const [bookingTime, setBookingTime] = useState<string>("")
    const [bookingNote, setBookingNote] = useState<string>("")
    const [bookingLoading, setBookingLoading] = useState<boolean>(false)
    const [userProfile, setUserProfile] = useState<{ id: number } | null>(null)

    // 🟣 États pour le paiement optionnel
    const [withPayment, setWithPayment] = useState<boolean>(false)
    const [paymentProvider, setPaymentProvider] = useState<'CASH' | 'CMI' | 'PAYPAL'>('CASH')
    const [paymentCurrency, setPaymentCurrency] = useState<'EUR' | 'USD' | 'MAD' | 'XOF' | 'XAF'>('EUR')
    const [paymentLoading, setPaymentLoading] = useState<boolean>(false)

    const currency = [
        { value: 'EUR', name: 'Euro' },
        { value: 'USD', name: 'Dollars US' },
        { value: 'MAD', name: 'Dirham' },
        { value: 'XOF', name: 'FCFA AO' },
        { value: 'XAF', name: 'FCFE AC' },
    ]

    const provider = [
        { id: 'CASH', label: 'Espèces', icon: '💵' },
        { id: 'CMI', label: 'Carte', icon: '💳' },
        { id: 'PAYPAL', label: 'PayPal', icon: '🅿️' }
    ]

    useEffect(() => {
        const init = async () => {
            try {
                // Profil utilisateur (pour userId)
                const profileRes = await api.get("/auth/profile");
                setUserProfile(profileRes.data.infos);

                // Liste des salons
                const res = await api.get('salon/all')
                const salons: Salon[] = res.data.salons
                setSalons(salons)
            } catch (err) {
                const error = err as AxiosError<{ message: string }>;
                if (error.response) {
                    const customMessage = error.response.data?.message || error.response.statusText || 'Identifiants invalides';
                    setError(customMessage);
                    alert(customMessage);
                } else {
                    setError('Impossible de joindre le serveur');
                    alert('Impossible de joindre le serveur');
                }
            }
        }
        init()
    }, [])

    const fetchtSalonDetails = async (id: number) => {
        try {
            const res = await api.get(`salon/details/${id}`)
            const details: Salon = res.data.salon
            setDetailsSalon(details)
            setShowDetails(true)
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response) {
                const customMessage = error.response.data?.message || error.response.statusText || 'Identifiants invalides';
                setError(customMessage);
                alert(customMessage);
            } else {
                setError('Impossible de joindre le serveur');
                alert('Impossible de joindre le serveur');
            }
        }
    }

    // 🟣 Soumission de la réservation + paiement optionnel
    const handleBookAppointment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userProfile || !detailsSalon || !selectedService || !selectedEmployee || !bookingDate || !bookingTime) {
            setError("Veuillez remplir tous les champs obligatoires");
            return;
        }

        setBookingLoading(true);
        setError("");
        let newAppointmentId: number | null = null;

        try {
            // 1️⃣ Créer le rendez-vous
            const bookingPayload: BookingPayload = {
                userId: userProfile.id,
                salonId: detailsSalon.id,
                serviceId: selectedService,
                employeeId: selectedEmployee,
                date: new Date(`${bookingDate}T${bookingTime}:00`).toISOString(),
                status: "PENDING",
                note: bookingNote || undefined
            };

            const bookingRes = await api.post<{ success: boolean; message: string; newAppointment?: { id: number } }>("/appointment/book", bookingPayload);

            if (!bookingRes.data.success || !bookingRes.data.newAppointment?.id) {
                throw new Error(bookingRes.data.message || "Erreur lors de la réservation");
            }

            newAppointmentId = bookingRes.data.newAppointment.id;

            // 2️⃣ Si paiement activé, initier le paiement
            if (withPayment && newAppointmentId) {
                setPaymentLoading(true);

                const paymentPayload: PaymentPayload = {
                    provider: paymentProvider,
                    currency: paymentCurrency,
                    appointmentId: newAppointmentId
                };

                const paymentRes = await api.post("/payment/process", paymentPayload);

                if (!paymentRes.data.success) {
                    throw new Error(paymentRes.data.message || "Erreur lors du paiement");
                }
            }

            alert(bookingRes.data.message);

            // 3️⃣ Réinitialisation et fermeture
            resetBookingForm();
            setShowBookingModal(false);
            setShowDetails(false);

            // 4️⃣ Rafraîchir la liste des salons
            const refreshRes = await api.get('salon/all');
            setSalons(refreshRes.data.salons);

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (error.response) {
                const customMessage = error.response.data?.message || "Erreur lors de l'opération";
                setError(customMessage);
                alert(customMessage);
            } else {
                setError('Impossible de joindre le serveur');
                alert('Impossible de joindre le serveur');
            }
        } finally {
            setBookingLoading(false);
            setPaymentLoading(false);
        }
    }

    // 🟣 Réinitialiser le formulaire
    const resetBookingForm = () => {
        setSelectedService(null);
        setSelectedEmployee(null);
        setBookingDate("");
        setBookingTime("");
        setBookingNote("");
        setWithPayment(false);
        setPaymentProvider('CASH');
        setPaymentCurrency('EUR');
    }

    // 🟣 Formatage du prix
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: paymentCurrency }).format(price);
    }

    return (
        <>
            <section className="p-6 max-w-7xl mx-auto">

                {/* 🟣 Liste des salons actifs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {salons?.filter((sln) => sln.status === 'ACTIVE').map((sln) => (
                        <div
                            key={sln.id}
                            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md hover:border-violet-200 transition-all group flex flex-col"
                        >
                            {/* Header carte */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center group-hover:bg-violet-200 transition-colors">
                                    <span className="text-violet-600 font-bold text-lg">🏪</span>
                                </div>
                                <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                    Actif
                                </span>
                            </div>

                            {/* Infos salon */}
                            <h3 className="text-lg font-bold text-slate-800 mb-1">{sln.name}</h3>
                            <p className="text-sm text-slate-500 mb-1 flex items-center gap-1">
                                📍 {sln.city || "Non indiqué"} - {sln.country || "Non indiqué"}
                            </p>
                            <p className="text-sm text-slate-600 mb-4 line-clamp-2">{sln.address}</p>

                            {/* Bouton détails */}
                            <button
                                onClick={() => fetchtSalonDetails(sln.id)}
                                type="button"
                                className="mt-auto px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all text-sm flex items-center justify-center gap-2 group-hover:translate-y-0.5"
                            >
                                👁️ Voir les détails
                            </button>
                        </div>
                    ))}

                    {/* État vide */}
                    {salons?.filter((sln) => sln.status === 'ACTIVE').length === 0 && (
                        <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                            <p className="text-slate-500 font-medium">Aucun salon actif disponible pour le moment</p>
                        </div>
                    )}
                </div>

                {/* 🟣 Message d'erreur */}
                {error && (
                    <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm font-medium flex items-center gap-2">
                        ⚠️ {error}
                    </div>
                )}
            </section>

            {/* 🟣 Modal Détails Salon */}
            {showDetails && detailsSalon && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <section className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative overflow-hidden max-h-[90vh] flex flex-col">

                        {/* Header modal */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-linear-to-r from-violet-50 to-white">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">{detailsSalon.name}</h2>
                                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                    📍 {detailsSalon.address}
                                </p>
                            </div>
                            <button
                                onClick={() => { setShowDetails(false); resetBookingForm(); }}
                                type="button"
                                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 hover:text-red-500 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Contenu scrollable */}
                        <div className="p-5 overflow-y-auto flex-1 space-y-6">

                            {/* 🟣 Statut ouverture */}
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                <span className="text-sm font-medium text-slate-700">Ouvert maintenant</span>
                            </div>

                            {/* 🟣 Services du salon */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold">★</span>
                                    Services proposés
                                </h3>
                                {detailsSalon.services && detailsSalon?.services?.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {detailsSalon.services.map((srv) => (
                                            <div key={srv.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-violet-200 transition-all">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="font-semibold text-slate-800">{srv.name}</h4>
                                                    <span className="text-lg font-bold text-violet-700">{srv.price}€</span>
                                                </div>
                                                <p className="text-sm text-slate-600 mb-2 line-clamp-2">{srv.description}</p>
                                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                                    ⏱️ <span>{srv.duration} min</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 italic bg-slate-50 p-4 rounded-lg border border-slate-200">Aucun service renseigné</p>
                                )}
                            </div>

                            {/* 🟣 Employés */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold">👤</span>
                                    Notre équipe
                                </h3>
                                {detailsSalon.employees && detailsSalon?.employees?.length > 0 ? (
                                    <div className="space-y-4">
                                        {detailsSalon.employees.map((emp) => (
                                            <div key={emp.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm">
                                                        {emp.firstname?.[0]}{emp.lastname?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-800">{emp.firstname} {emp.lastname}</p>
                                                        <p className="text-xs text-slate-500">{emp.email} • {emp.phone}</p>
                                                    </div>
                                                </div>

                                                {emp.services && emp.services?.length > 0 && (
                                                    <div className="mb-3">
                                                        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Services maîtrisés</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {emp.services.map((srv) => (
                                                                <span key={srv.id} className="px-2.5 py-1 bg-violet-50 text-violet-700 text-xs font-medium rounded-full border border-violet-100">
                                                                    {srv.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Planning employé */}
                                                {emp.schedule && emp.schedule?.length > 0 && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Disponibilités</p>
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                            {emp.schedule.map((sch) => (
                                                                <div key={sch.id} className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                                                                    <p className="font-medium text-slate-700">{DAYS[sch.day]}</p>
                                                                    <p className="text-slate-500">
                                                                        {new Date(sch.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} -
                                                                        {new Date(sch.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 italic bg-slate-50 p-4 rounded-lg border border-slate-200">Aucun employé renseigné</p>
                                )}
                            </div>

                            {/* 🟣 Horaires d'ouverture du salon */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold">🕐</span>
                                    Horaires d'ouverture
                                </h3>
                                {detailsSalon.openeds && detailsSalon?.openeds?.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {detailsSalon?.openeds?.map((opnd) => (
                                            <div key={opnd.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                                                <p className="font-medium text-slate-700 text-sm mb-1">{DAYS[opnd.day]}</p>
                                                <p className="text-xs text-slate-500">
                                                    {new Date(opnd.opened).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} -
                                                    {new Date(opnd.closed).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 italic bg-slate-50 p-4 rounded-lg border border-slate-200">Horaires non renseignés</p>
                                )}
                            </div>

                        </div>

                        {/* Footer modal - Action */}
                        <div className="p-5 border-t border-slate-100 bg-slate-50">
                            <button
                                type="button"
                                onClick={() => setShowBookingModal(true)}
                                className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                📅 Prendre rendez-vous
                            </button>
                        </div>

                    </section>
                </div>
            )}

            {/* 🟣 MODAL RÉSERVATION + PAIEMENT (MIS À JOUR) */}
            {showBookingModal && detailsSalon && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <section className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden max-h-[90vh] flex flex-col">

                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-linear-to-r from-violet-50 to-white">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                📅 Réserver chez {detailsSalon.name}
                            </h2>
                            <button onClick={() => { setShowBookingModal(false); resetBookingForm(); }} type="button" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 hover:text-red-500 transition-colors">✕</button>
                        </div>

                        {/* Formulaire scrollable */}
                        <form onSubmit={handleBookAppointment} className="p-5 overflow-y-auto flex-1 space-y-5">

                            {/* 🔹 Étape 1: Sélection du service */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold">1</span>
                                    Choisir un service *
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {detailsSalon.services?.map((srv) => (
                                        <button
                                            key={srv.id}
                                            type="button"
                                            onClick={() => { setSelectedService(srv.id); setWithPayment(false); }}
                                            className={`p-4 rounded-xl border text-left transition-all ${selectedService === srv.id
                                                ? 'border-violet-500 bg-violet-50 ring-2 ring-violet-200'
                                                : 'border-slate-200 hover:border-violet-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-1">
                                                <p className="font-medium text-slate-800">{srv.name}</p>
                                                <span className="text-lg font-bold text-violet-700">{srv.price}€</span>
                                            </div>
                                            <p className="text-sm text-slate-500">{srv.duration} min</p>
                                        </button>
                                    ))}
                                </div>
                                {detailsSalon.services?.length === 0 && (
                                    <p className="text-sm text-slate-500 italic">Aucun service disponible</p>
                                )}
                            </div>

                            {/* 🔹 Étape 2: Sélection de l'employé */}
                            {selectedService && (
                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold">2</span>
                                        Choisir un professionnel *
                                    </label>
                                    <div className="space-y-3">
                                        {detailsSalon.employees?.map((emp) => (
                                            <button
                                                key={emp.id}
                                                type="button"
                                                onClick={() => setSelectedEmployee(emp.id)}
                                                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${selectedEmployee === emp.id
                                                    ? 'border-violet-500 bg-violet-50 ring-2 ring-violet-200'
                                                    : 'border-slate-200 hover:border-violet-300 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm">
                                                    {emp.firstname?.[0]}{emp.lastname?.[0]}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-slate-800 truncate">{emp.firstname} {emp.lastname}</p>
                                                    <p className="text-xs text-slate-500 truncate">{emp.email}</p>
                                                </div>
                                                {selectedEmployee === emp.id && (
                                                    <span className="text-violet-600 font-bold">✓</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    {detailsSalon.employees?.length === 0 && (
                                        <p className="text-sm text-slate-500 italic">Aucun employé disponible</p>
                                    )}
                                </div>
                            )}

                            {/* 🔹 Étape 3: Date et Heure */}
                            {selectedService && selectedEmployee && (
                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold">3</span>
                                        Date et heure *
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-medium text-slate-500 mb-1 block">Date</label>
                                            <input
                                                type="date"
                                                value={bookingDate}
                                                onChange={(e) => setBookingDate(e.target.value)}
                                                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50 focus:bg-white"
                                                min={new Date().toISOString().split('T')[0]}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-500 mb-1 block">Heure</label>
                                            <input
                                                type="time"
                                                value={bookingTime}
                                                onChange={(e) => setBookingTime(e.target.value)}
                                                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50 focus:bg-white"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 🔹 Étape 4: Note optionnelle */}
                            {selectedService && selectedEmployee && bookingDate && bookingTime && (
                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold">4</span>
                                        Note (optionnel)
                                    </label>
                                    <textarea
                                        value={bookingNote}
                                        onChange={(e) => setBookingNote(e.target.value)}
                                        placeholder="Précisions, demandes particulières..."
                                        className="w-full min-h-20 border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50 focus:bg-white resize-none"
                                    ></textarea>
                                </div>
                            )}

                            {/* 🔹 Étape 5: Paiement optionnel (DERNIÈRE ÉTAPE) */}
                            {selectedService && selectedEmployee && bookingDate && bookingTime && (
                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold">5</span>
                                        Paiement (optionnel)
                                    </label>

                                    {/* Toggle paiement */}
                                    <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={withPayment}
                                            onChange={(e) => setWithPayment(e.target.checked)}
                                            className="w-4 h-4 text-violet-600 border-slate-300 rounded focus:ring-violet-500"
                                        />
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-slate-700">Payer maintenant</span>
                                            <p className="text-xs text-slate-500">Montant: <span className="font-bold text-violet-700">{formatPrice(detailsSalon.services?.find(s => s.id === selectedService)?.price || 0)}</span></p>
                                        </div>
                                    </label>

                                    {/* Options de paiement */}
                                    {withPayment && (
                                        <div className="space-y-4 p-4 bg-violet-50/50 rounded-xl border border-violet-100">
                                            {/* Provider */}
                                            <div>
                                                <p className="text-xs font-medium text-slate-500 mb-2">Mode de paiement</p>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {provider.map((p) => (
                                                        <button
                                                            key={p.id}
                                                            type="button"
                                                            onClick={() => setPaymentProvider(p.id as typeof paymentProvider)}
                                                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-xs font-medium ${paymentProvider === p.id
                                                                ? 'border-violet-500 bg-violet-100 text-violet-800 ring-2 ring-violet-300'
                                                                : 'border-slate-200 hover:border-violet-300 hover:bg-slate-50 text-slate-600'
                                                                }`}
                                                        >
                                                            <span className="text-lg mb-1">{p.icon}</span>
                                                            {p.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Devise */}
                                            <div>
                                                <p className="text-xs font-medium text-slate-500 mb-2">Devise</p>
                                                <select
                                                    value={paymentCurrency}
                                                    onChange={(e) => setPaymentCurrency(e.target.value as typeof paymentCurrency)}
                                                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                                                >

                                                    {currency.map((cr) => (
                                                        <option value={cr.value}> {cr.name} </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <p className="text-xs text-slate-500 italic">
                                                💡 Le paiement sera traité après confirmation de la réservation
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 🔹 Bouton de soumission final */}
                            {selectedService && selectedEmployee && bookingDate && bookingTime && (
                                <div className="pt-6 border-t border-slate-100">
                                    <button
                                        type="submit"
                                        disabled={bookingLoading || paymentLoading}
                                        className="w-full py-4 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        {(bookingLoading || paymentLoading) ? (
                                            <>
                                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                {paymentLoading ? 'Paiement en cours...' : 'Réservation en cours...'}
                                            </>
                                        ) : (
                                            <>
                                                ✅ {withPayment ? 'Payer et réserver' : 'Confirmer la réservation'} • {withPayment ? formatPrice(detailsSalon.services?.find(s => s.id === selectedService)?.price || 0) : 'Gratuit'}
                                            </>
                                        )}
                                    </button>
                                    <p className="text-xs text-slate-500 text-center mt-3">
                                        En confirmant, vous acceptez les conditions générales du salon
                                    </p>
                                </div>
                            )}

                        </form>
                    </section>
                </div>
            )}
        </>
    )
}

export default SalonList