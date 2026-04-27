import { useEffect, useState } from "react"
import api from "../../../../../api/axios"
import type { AxiosError } from "axios"
import type User from "../../../../../interfaces/UserInterface"
import type Salon from "../../../../../interfaces/SalonInterface"

interface IDProps {
    userId?: number,
    onClose: () => void
}

interface Tags {
    id: number,
    tag: 'VIP' | 'NEW' | ''
    salon: Salon,
    user: User
}

interface ClientHistory {
    fullName: string;
    email: string;
    totalSpent: number;
    appointmentsCount: number;
    history: {
        id: number;
        date: string;
        service: string;
        employee: string;
        amount: number;
        status: string;
        internalNote: string | null;
    }[];
    tag: Tags | null
}

function ClientHistory({ userId, onClose }: IDProps) {
    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState<string | "">("")
    const [history, setHistory] = useState<ClientHistory | null>(null)

    useEffect(() => {
        const profile = async () => {
            try {

                const res = await api.get("/auth/profile")
                const user: User = res.data.infos
                setUser(user)

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
        profile()
    }, [])

    useEffect(() => {
        if (!userId) return
        const fetchClientHistory = async () => {
            try {

                const res = await api.get(`client-history/${userId}`)

                const history: ClientHistory = res.data.client
                setHistory(history)
                console.log('Hystory', res.data.client)

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
        fetchClientHistory()
    }, [userId])

    const addTagToClient = async (tagValue: 'VIP' | 'NEW') => {
        try {

            const res = await api.post(`tags/add-tag`, {
                tag: tagValue,
                userId: userId
            })

            alert(res.data.message)

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
            {/* Overlay Modal */}
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <section className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden max-h-[90vh] flex flex-col">

                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-linear-to-r from-violet-50 to-white">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Salon</p>
                            <h1 className="text-xl font-bold text-slate-800">{user?.salon?.name}</h1>
                        </div>
                        <button type="button" onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 hover:text-red-500 transition-colors">✕</button>
                    </div>

                    {/* Contenu scrollable */}
                    <div className="p-5 overflow-y-auto flex-1 space-y-6">

                        {/* 🟣 Infos Client */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 p-4 bg-violet-50 rounded-xl border border-violet-100">
                                <p className="text-sm text-slate-500 mb-1">Client</p>
                                <p className="text-lg font-bold text-slate-800">{history?.fullName}</p>
                                <p className="text-sm text-slate-600">{history?.email}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <p className="text-sm text-slate-500 mb-1">Montant rapporté</p>
                                <p className="text-2xl font-bold text-violet-700">{history?.totalSpent}$</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-center">
                                <p className="text-sm text-slate-500 mb-2">Tag / Statut</p>
                                <span className={`inline-flex w-fit px-3 py-1 rounded-full text-sm font-semibold ${history?.tag?.tag === 'VIP' ? 'bg-amber-100 text-amber-800' :
                                        history?.tag?.tag === 'NEW' ? 'bg-blue-100 text-blue-800' :
                                            'bg-slate-200 text-slate-700'
                                    }`}>
                                    {history?.tag?.tag || 'Aucun'}
                                </span>
                            </div>
                        </div>

                        {/* 🟣 Historique */}
                        <div>
                            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3 flex items-center gap-2">📜 Historique des passages</h3>
                            {history?.history && history?.history?.length > 0 ? (
                                <div className="space-y-3">
                                    {history?.history.map((a) => (
                                        <div key={a.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                                <span className="font-medium text-slate-800">{a.date}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                        a.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                                                            a.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                                'bg-slate-100 text-slate-700'
                                                    }`}>
                                                    {a.status}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-slate-600">
                                                <div><span className="text-slate-400 text-xs block">Montant</span><span className="font-semibold">{a.amount}</span></div>
                                                <div><span className="text-slate-400 text-xs block">Employé</span><span>{a.employee}</span></div>
                                                <div><span className="text-slate-400 text-xs block">Service</span><span>{a.service}</span></div>
                                            </div>
                                            {a.internalNote && (
                                                <p className="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 italic">📝 {a.internalNote}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 italic bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">Aucun historique disponible pour ce client.</p>
                            )}
                        </div>

                        {/* 🟣 Gestion des Tags */}
                        <div className="pt-4 border-t border-slate-100">
                            <p className="text-sm font-medium text-slate-600 mb-3">Modifier le statut du client</p>
                            {history?.tag?.tag === 'NEW' ? (
                                <button type="button" onClick={() => addTagToClient('VIP')} className="w-full py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium shadow-sm hover:shadow transition-all">
                                    ⭐ Promouvoir en VIP
                                </button>
                            ) : history?.tag?.tag === 'VIP' ? (
                                <button type="button" onClick={() => addTagToClient('NEW')} className="w-full py-2.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium border border-blue-200 transition-all">
                                    🔄 Retirer le statut VIP
                                </button>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <button type="button" onClick={() => addTagToClient('VIP')} className="py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium shadow-sm hover:shadow transition-all">
                                        ⭐ Client VIP
                                    </button>
                                    <button type="button" onClick={() => addTagToClient('NEW')} className="py-2.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium border border-blue-200 transition-all">
                                        🆕 Nouveau client
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </section>
            </div>

            {/* 🟣 Message d'erreur */}
            {error && (
                <div className="fixed bottom-4 right-4 z-60 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm font-medium flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-bottom-2">
                    ⚠️ {error}
                </div>
            )}
        </>
    )
}

export default ClientHistory
