import React, { useEffect, useState } from "react"
import type User from "../../../../../interfaces/UserInterface"
import type { AxiosError } from "axios"
import api from "../../../../../api/axios"
import type Service from "../../../../../interfaces/ServiceInterfaces"

function SalonServices() {
    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState<string | "">("")
    const [updateModal, setUpdateModal] = useState<boolean>(false)
    const [detailsModal, setDetailsModal] = useState<boolean>(false)
    const [addServiceModal, setAddServiceModal] = useState<boolean>(false)

    const [name, setName] = useState<string | "">("")
    const [price, setPrice] = useState<number | 0>(0)
    const [duration, setDuration] = useState<number | 0>(0)
    const [description, setDescription] = useState<string | "">("")
    const [selectedService, setSelectedeService] = useState<number | null>(null)
    const [service, setService] = useState<Service | null>(null)

    useEffect(() => {
        const profile = async () => {
            try {

                const res = await api.get("/auth/profile")
                const user: User = res.data.infos
                setUser(user)

            } catch (err) {
                const error = err as AxiosError<{ message: string }>;

                if (error.response) {
                    setError(error.response.data.message || 'Identifiants invalides');
                    console.log("Erreur ", error)
                    alert(error)
                } else {
                    setError('Impossible de joindre le serveur');
                    console.log("Erreur ", error)
                }
            }
        }
        profile()
    }, [])

    useEffect(() => {
        if (!selectedService) return
        const fetchServiceField = async () => {
            try {

                const res = await api.get(`service/details/${selectedService}`)

                const services: Service = res.data.service
                setService(services)

                setName(services.name)
                setPrice(services.price)
                setDuration(services.duration)
                setDescription(services.description)

            } catch (err) {
                const error = err as AxiosError<{ message: string }>;

                if (error.response) {
                    setError(error.response.data.message || 'Identifiants invalides');
                    console.log("Erreur ", error)
                    alert(error)
                } else {
                    setError('Impossible de joindre le serveur');
                    console.log("Erreur ", error)
                }
            }
        }

        fetchServiceField()
    }, [selectedService])

    const addService = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {

            const res = await api.post("service/add", {
                name: name,
                price: price,
                duration: duration,
                description: description,
                salonId: user?.salon?.id
            })

            alert(res.data.message)

        } catch (err) {

            const error = err as AxiosError<{ message: string }>;

            if (error.response) {
                setError(error.response.data.message || 'Identifiants invalides');
                console.log("Erreur ", error)
                alert(error)
            } else {
                setError('Impossible de joindre le serveur');
                console.log("Erreur ", error)
            }
        }
    }

    const updateService = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {

            const res = await api.put(`service/update/${selectedService}`, {
                name: name,
                price: price,
                duration: duration,
                description: description
            })

            alert(res.data.message)

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;

            if (error.response) {
                setError(error.response.data.message || 'Identifiants invalides');
                console.log("Erreur ", error)
                alert(error)
            } else {
                setError('Impossible de joindre le serveur');
                console.log("Erreur ", error)
            }
        }
    }


    return (
        <>
            <section className="p-6 max-w-7xl mx-auto">
                {/* 🟣 En-tête */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Liste des services</h1>
                    <button onClick={() => setAddServiceModal(true)} type="button" className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                        ➕ Ajouter un service
                    </button>
                </div>

                {/* 🟣 Liste des services */}
                {user?.salon?.services && user?.salon?.services?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {user?.salon?.services?.map((s) => (
                            <div key={s.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col gap-4 group">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-semibold text-slate-800 line-clamp-1">{s.name}</h3>
                                    <span className="bg-violet-100 text-violet-800 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">
                                        {s.price}$
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 line-clamp-2 min-h-10">{s.description}</p>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    ⏱️ <span className="font-medium">{s.duration} min</span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-3 border-t border-slate-100 mt-auto">
                                    <button
                                        onClick={() => { setSelectedeService(s.id); setDetailsModal(true); }}
                                        className="flex-1 py-2 px-3 text-sm font-medium rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors text-slate-700"
                                    >
                                        👁️ Détails
                                    </button>
                                    <button
                                        onClick={() => { setSelectedeService(s.id); setUpdateModal(true); }}
                                        className="flex-1 py-2 px-3 text-sm font-medium rounded-lg border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors"
                                    >
                                        ✏️ Modifier
                                    </button>
                                    <button
                                        onClick={() => { /* Ta logique de suppression */ }}
                                        className="flex-1 py-2 px-3 text-sm font-medium rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                                    >
                                        🗑️ Supprimer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500 text-lg">Aucun service ajouté pour le moment.</p>
                        <button type="button" className="mt-4 text-violet-600 font-medium hover:underline">
                            Ajouter votre premier service →
                        </button>
                    </div>
                )}

                {/* 🟣 Message d'erreur */}
                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm font-medium flex items-center gap-2">
                        ⚠️ {error}
                    </div>
                )}
            </section>

            {addServiceModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <section className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="text-xl font-bold text-slate-800">Modifier le service</h2>
                            <button onClick={() => setAddServiceModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 hover:text-red-500 transition-colors">
                                ✕
                            </button>
                        </div>
                        <form onSubmit={addService} className="p-5 flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5 col-span-2">
                                    <label className="text-sm font-medium text-slate-600">Nom du service</label>
                                    <input type="text" value={name} placeholder="Ex: Coupe femme" className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-600">Prix ($)</label>
                                    <input type="number" value={price} name="price" placeholder="0.00" className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" onChange={(e) => setPrice(Number(e.target.value))} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-600">Durée (min)</label>
                                    <input type="number" value={duration} name="duration" placeholder="30" className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" onChange={(e) => setDuration(Number(e.target.value))} />
                                </div>
                                <div className="flex flex-col gap-1.5 col-span-2">
                                    <label className="text-sm font-medium text-slate-600">Description</label>
                                    <textarea name="description" value={description} placeholder="Décrivez le service..." rows={3} className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white resize-none" onChange={(e) => setDescription(e.target.value)}></textarea>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setAddServiceModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-colors">
                                    Annuler
                                </button>
                                <button type="submit" className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-md hover:shadow-lg transition-all">
                                    Mettre à jour
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}

            {/* 🟣 Modal Mise à jour */}
            {updateModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <section className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="text-xl font-bold text-slate-800">Modifier le service</h2>
                            <button onClick={() => setUpdateModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 hover:text-red-500 transition-colors">
                                ✕
                            </button>
                        </div>
                        <form onSubmit={updateService} className="p-5 flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5 col-span-2">
                                    <label className="text-sm font-medium text-slate-600">Nom du service</label>
                                    <input type="text" value={name} placeholder="Ex: Coupe femme" className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-600">Prix ($)</label>
                                    <input type="number" value={price} name="price" placeholder="0.00" className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" onChange={(e) => setPrice(Number(e.target.value))} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-600">Durée (min)</label>
                                    <input type="number" value={duration} name="duration" placeholder="30" className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" onChange={(e) => setDuration(Number(e.target.value))} />
                                </div>
                                <div className="flex flex-col gap-1.5 col-span-2">
                                    <label className="text-sm font-medium text-slate-600">Description</label>
                                    <textarea name="description" value={description} placeholder="Décrivez le service..." rows={3} className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white resize-none" onChange={(e) => setDescription(e.target.value)}></textarea>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setUpdateModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-colors">
                                    Annuler
                                </button>
                                <button type="submit" className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-md hover:shadow-lg transition-all">
                                    Mettre à jour
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}

            {/* 🟣 Modal Détails */}
            {detailsModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <section className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="text-xl font-bold text-slate-800">Détails du service</h2>
                            <button onClick={() => setDetailsModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 hover:text-red-500 transition-colors">
                                ✕
                            </button>
                        </div>
                        <div className="p-5 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="bg-violet-50 p-4 rounded-xl border border-violet-100">
                                    <h3 className="text-xs font-semibold text-violet-600 uppercase tracking-wide mb-1">Nom</h3>
                                    <p className="text-lg font-bold text-slate-800">{service?.name}</p>
                                </div>
                                <div className="bg-violet-50 p-4 rounded-xl border border-violet-100">
                                    <h3 className="text-xs font-semibold text-violet-600 uppercase tracking-wide mb-1">Prix</h3>
                                    <p className="text-lg font-bold text-slate-800">{service?.price}$</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Durée</h3>
                                    <p className="text-lg font-semibold text-slate-800">{service?.duration} min</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Réservations</h3>
                                    <p className="text-lg font-semibold text-slate-800">{service?.appointments?.length || 0} fois</p>
                                </div>
                            </div>
                            <div className="mb-6">
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Description</h4>
                                <p className="text-slate-700 bg-white p-4 rounded-xl border border-slate-200 leading-relaxed">
                                    {service?.description || "Aucune description renseignée."}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Employés associés</h4>
                                {service?.employees && service?.employees?.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {service?.employees?.map((se, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
                                                <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm shrink-0">
                                                    {se.firstname?.[0]?.toUpperCase()}{se.lastname?.[0]?.toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-slate-800 truncate">{se.firstname} {se.lastname}</p>
                                                    <p className="text-xs text-slate-500 truncate">{se.email} • {se.phone}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-500 italic bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">Aucun employé assigné à ce service.</p>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </>
    )
}

export default SalonServices
