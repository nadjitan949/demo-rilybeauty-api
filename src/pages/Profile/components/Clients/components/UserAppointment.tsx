import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import api from "../../../../../api/axios";
import type User from "../../../../../interfaces/UserInterface";

function UserAppointment() {
    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState<string | "">("")
    const [note, setNote] = useState<string | "">("")
    const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null)

    const [noteModal, setNoteModal] = useState<boolean>(false)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/auth/profile");

                // On adapte selon la structure de ta réponse API
                if (res.data) {
                    setUser(res.data.infos);
                }
            } catch (err) {
                const error = err as AxiosError<{ message: string }>;

                if (error.response) {
                    // ✅ Extrait ton message personnalisé de la réponse du serveur
                    const customMessage = error.response.data?.message || error.response.statusText || 'Identifiants invalides';

                    setError(customMessage);
                    console.log("📩 Message backend :", customMessage);
                    console.log("📦 Réponse complète :", error.response.data);
                    alert(customMessage); // ✅ Affiche bien ton message personnalisé
                } else {
                    const networkMsg = 'Impossible de joindre le serveur';
                    setError(networkMsg);
                    console.log("🌐 Erreur réseau :", error.message);
                    alert(networkMsg);
                }
            }
        };
        fetchProfile();
    }, []);

    const handleCancelAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {

            const isConfirm = confirm("Voulez vous vraiment annuler cette resevation ?")
            if (!isConfirm) return

            const res = await api.patch(`appointment/cancel/${selectedAppointment}`, {
                note: note
            })

            alert(res.data.message)
            setNoteModal(false)

            const refreshUser = await api.get("/auth/profile");
            setUser(refreshUser.data.infos)

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;

            if (error.response) {
                // ✅ Extrait ton message personnalisé de la réponse du serveur
                const customMessage = error.response.data?.message || error.response.statusText || 'Identifiants invalides';

                setError(customMessage);
                console.log("📩 Message backend :", customMessage);
                console.log("📦 Réponse complète :", error.response.data);
                alert(customMessage); // ✅ Affiche bien ton message personnalisé
            } else {
                const networkMsg = 'Impossible de joindre le serveur';
                setError(networkMsg);
                console.log("🌐 Erreur réseau :", error.message);
                alert(networkMsg);
            }
        }
    }

    return (
        <>
            <section className="p-6 max-w-5xl mx-auto">

                {/* 🟣 Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            📋 Mes rendez-vous
                            <span className="ml-2 px-2.5 py-0.5 bg-violet-100 text-violet-800 text-xs font-semibold rounded-full">
                                {user?.appointments?.length || 0}
                            </span>
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Retrouvez l'historique et la gestion de vos réservations</p>
                    </div>
                </div>

                {/* 🟣 Liste des rendez-vous */}
                <div className="space-y-4">
                    {user?.appointments?.map((apt) => (
                        <div
                            key={apt.id}
                            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md hover:border-violet-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                        >
                            {/* 🟣 Colonne gauche : Infos principales */}
                            <div className="flex-1 min-w-0 space-y-3">
                                {/* Reference + Date + Statut */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="font-bold text-slate-800 text-lg tracking-tight">#{apt.reference}</span>
                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full flex items-center gap-1.5">
                                        📅 {apt.date}
                                    </span>
                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${apt.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                                            apt.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                                apt.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                    apt.status === 'CANCELLED' || apt.status === 'NO_SHOW' ? 'bg-red-100 text-red-800' :
                                                        'bg-slate-100 text-slate-700'
                                        }`}>
                                        {apt.status}
                                    </span>
                                </div>

                                {/* Salon + Service */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        🏪 <span className="truncate font-medium">{apt.salon?.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        ✂️ <span className="truncate">{apt.service?.name}</span>
                                        <span className="text-slate-300">•</span>
                                        <span>{apt.service?.duration} min</span>
                                    </div>
                                </div>

                                {/* Employé + Prix */}
                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        👤 <span>{apt.employee?.firstname} {apt.employee?.lastname}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-violet-700">{apt.price}€</span>
                                    </div>
                                </div>
                            </div>

                            {/* 🟣 Colonne droite : Actions */}
                            <div className="flex flex-row md:flex-col items-stretch md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 md:w-auto">
                                {(apt.status === 'PENDING' || apt.status === 'CONFIRMED') && (
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedAppointment(apt.id); setNoteModal(true); }}
                                        className="flex-1 md:w-full px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-1.5"
                                    >
                                        ❌ Annuler
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="flex-1 md:w-full px-4 py-2.5 bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-1.5"
                                >
                                    📝 Détails
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* 🟣 État vide */}
                    {user?.appointments?.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">📅</span>
                            </div>
                            <p className="text-slate-500 font-medium">Aucun rendez-vous pour le moment</p>
                            <p className="text-sm text-slate-400 mt-1">Réservez votre première prestation pour voir vos RDV ici</p>
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

            {/* 🟣 Modal Annulation */}
            {noteModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <section className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
                        {/* Header Modal */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-linear-to-r from-red-50/50 to-white">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">❌ Annulation du RDV</h2>
                            <button onClick={() => setNoteModal(false)} type="button" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 hover:text-red-500 transition-colors">✕</button>
                        </div>

                        {/* Formulaire */}
                        <form onSubmit={handleCancelAppointment} className="p-5 flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-600 mb-1.5 block">Raison de l'annulation</label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Veuillez indiquer la raison de votre annulation..."
                                    required
                                    className="w-full min-h-30 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white resize-none text-sm"
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                                <button type="button" onClick={() => setNoteModal(false)} className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-sm transition-colors">
                                    Retour
                                </button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm shadow-sm hover:shadow transition-colors">
                                    Confirmer l'annulation
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </>
    )
}

export default UserAppointment
