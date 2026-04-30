import React, { useEffect, useState } from "react"
import api from "../../api/axios"
import type User from "../../interfaces/UserInterface"
import type { AxiosError } from "axios"
import type Salon from "../../interfaces/SalonInterface"

function SalonList() {
    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState<string | "">("")
    const [salon, setSalons] = useState<Salon[] | []>([])

    const [selectedSalon, setSelectedSalon] = useState<number | "">("")

    const [name, setName] = useState<string | "">("")
    const [country, setCountry] = useState<string | "">("")
    const [city, setCity] = useState<string | "">("")
    const [address, setAdress] = useState<string | "">("")

    const [editModal, setEditModal] = useState<boolean>(false)

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
        const fetchAllSalons = async () => {
            try {

                const res = await api.get("salon/all")
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
        fetchAllSalons()
    }, [])

    useEffect(() => {
        if (!selectedSalon) return
        const fetchAllSalonDetails = async () => {
            try {

                const res = await api.get(`salon/details/${selectedSalon}`)
                const details: Salon = res.data.salon

                setName(details.name || "")
                setCity(details.city || "")
                setCountry(details.country || "")
                setAdress(details.address || "")

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
        fetchAllSalonDetails()
    }, [selectedSalon])

    const handlUpdateSalon = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {

            const res = await api.put(`salon/update/${selectedSalon}`,
                {
                    name: name,
                    country: country,
                    city: city,
                    address: address
                }
            )

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
            <section className="p-6 max-w-7xl mx-auto">
                {/* 🟣 Header */}
                <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    🏪 Liste des salons
                    <span className="ml-2 px-2.5 py-0.5 bg-violet-100 text-violet-800 text-xs font-semibold rounded-full">
                        {salon?.length || 0}
                    </span>
                </h1>

                {/* 🟣 Grille de cartes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {salon.map((sln) => (
                        <div key={sln.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md hover:border-violet-200 transition-all flex flex-col">

                            {/* Badge statut */}
                            <div className="flex items-start justify-between mb-3">
                                {user?.salon && user.salon.id === sln.id ? (
                                    <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">✨ Mon salon</span>
                                ) : (
                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">🌍 Autre salon</span>
                                )}
                            </div>

                            {/* Infos salon */}
                            <h3 className="text-lg font-bold text-slate-800 mb-1">{sln.name}</h3>
                            <div className="space-y-1 text-sm text-slate-600 mb-4 flex-1">
                                <p className="flex items-center gap-1.5">📍 {sln.city || "Non défini"} • {sln.country || "Non défini"}</p>
                                <p className="flex items-center gap-1.5">🏠 {sln.address || "Non défini"}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-3 border-t border-slate-100 mt-auto">
                                {/* <button type="button" className="flex-1 py-2 px-3 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700">
                                    👁️ Détail
                                </button> */}
                                <button
                                    type="button"
                                    onClick={() => { setSelectedSalon(sln.id); setEditModal(true); }}
                                    className="flex-1 py-2 px-3 text-xs font-medium rounded-lg border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors"
                                >
                                    ✏️ Modifier
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 🟣 Message d'erreur */}
                {error && (
                    <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm font-medium flex items-center gap-2">
                        ⚠️ {error}
                    </div>
                )}
            </section>

            {/* 🟣 Modal Modification */}
            {editModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <section className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">

                        {/* Header modal */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-linear-to-r from-violet-50 to-white">
                            <h2 className="text-lg font-bold text-slate-800">✏️ Modifier le salon</h2>
                            <button onClick={() => setEditModal(false)} type="button" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 hover:text-red-500 transition-colors">✕</button>
                        </div>

                        {/* Formulaire */}
                        <form onSubmit={handlUpdateSalon} className="p-5 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-600">Nom du salon</label>
                                <input type="text" value={name} placeholder="Nom du salon" className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-600">Ville</label>
                                    <input type="text" value={city} placeholder="Ville" className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" onChange={(e) => setCity(e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-600">Pays</label>
                                    <input type="text" value={country} placeholder="Pays" className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" onChange={(e) => setCountry(e.target.value)} />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-600">Adresse</label>
                                <input type="text" value={address} placeholder="Adresse complète" className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" onChange={(e) => setAdress(e.target.value)} />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setEditModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-colors">
                                    Annuler
                                </button>
                                <button type="submit" className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-md hover:shadow-lg transition-all">
                                    Valider
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </>
    )
}

export default SalonList
