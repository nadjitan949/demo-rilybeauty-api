import type { AxiosError } from "axios";
import { useEffect, useState } from "react"
import api from "../../../../../api/axios";
import type Salon from "../../../../../interfaces/SalonInterface";

const DAYS = ["Dimance", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]

function SalonList() {
    const [error, setError] = useState<string | "">("")
    const [salons, setSalons] = useState<Salon[] | null>(null)
    const [detailsSalon, setDetailsSalon] = useState<Salon | null>(null)

    const [showDetails, setShowDetails] = useState<boolean>(false)

    useEffect(() => {
        const fetchtSalonList = async () => {
            try {

                const res = await api.get('salon/all')
                const salons: Salon[] = res.data.salons
                setSalons(salons)

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
        fetchtSalonList()
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
                                onClick={() => setShowDetails(false)}
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
                                <span className={`w-3 h-3 rounded-full ${/* logique open/closed à adapter */ 'bg-green-500'}`}></span>
                                <span className="text-sm font-medium text-slate-700">
                                    {/* Remplacer par ta logique réelle */}
                                    Ouvert maintenant
                                </span>
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
                                className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                📅 Prendre rendez-vous
                            </button>
                        </div>

                    </section>
                </div>
            )}
        </>
    )
}

export default SalonList
