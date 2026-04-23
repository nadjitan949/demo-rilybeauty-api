import React, { useEffect, useState } from "react"
import type User from "../interfaces"
import type { AxiosError } from "axios"
import api from "../../../../../api/axios"
import { Pencil, Trash } from "lucide-react"

function SalonProfil() {
    const [updateModal, setUpdateModal] = useState<boolean>(false)

    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState<string | "">("")
    const [firstname, setFirstname] = useState<string | "">("")
    const [lastname, setLastname] = useState<string | "">("")
    const [email, setEmail] = useState<string | "">("")
    const [phone, setPhone] = useState<string | "">("")
    const [name, setName] = useState<string | "">("")
    const [address, setAdress] = useState<string | "">("")
    const [country, setCountry] = useState<string | "">("")
    const [city, setCity] = useState<string | "">("")

    useEffect(() => {
        const profile = async () => {
            try {

                const res = await api.get("/auth/profile")
                const user: User = res.data.infos
                setUser(user)

                setFirstname(user.firstname || "")
                setLastname(user.lastname || "")
                setEmail(user.email || "")
                setPhone(user.phone || "")
                setName(user.salon?.name || "")
                setAdress(user.salon?.address || "")
                setCountry(user.salon?.country || "")
                setCity(user.salon?.city || "")

            } catch (err) {
                const error = err as AxiosError<{ message: string }>;

                if (error.response) {
                    setError(error.response.data.message || 'Identifiants invalides');
                    console.log("Erreur ", error)
                } else {
                    setError('Impossible de joindre le serveur');
                    console.log("Erreur ", error)
                }
            }
        }
        profile()
    }, [])

    const handlesubmite = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {

            const userUpdate = await api.put(`user/update/${user?.id}`, {
                firstname: firstname,
                lastname: lastname,
                email: email,
                phone: phone
            })
            if(!userUpdate.data.success) return alert(userUpdate.data.message)
            alert(userUpdate.data.message)

            if(name || address || country || city) {
                const updateSalon = await api.put(`salon/update/${user?.salon?.id}`, {
                    name: name,
                    address: address,
                    country: country,
                    city: city
                })

                if(!updateSalon.data.success) return alert(updateSalon.data.message)

                alert(updateSalon.data.message)
            }


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
            <section className=" p-6 md:p-8 flex flex-col lg:flex-row justify-between items-start gap-6">
                {/* 🟣 Section Gauche : Informations */}
                <div className="flex flex-col gap-5 w-full">
                    <h1 className="font-bold text-3xl text-slate-800 tracking-tight">Info salon</h1>

                    <div className="w-16 h-16 rounded-xl bg-linear-to-br from-violet-500 to-violet-700 text-white flex items-center justify-center shadow-md">
                        <span className="font-bold text-2xl">
                            {user?.firstname?.[0]?.toUpperCase()}{user?.lastname?.[0]?.toUpperCase()}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 bg-violet-50/60 p-5 rounded-xl border border-violet-100">
                        <div><span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">Utilisateur</span><span className="font-semibold text-slate-800">{user?.firstname} {user?.lastname}</span></div>
                        <div><span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">Email</span><span className="font-semibold text-slate-800">{user?.email}</span></div>
                        <div><span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">Téléphone</span><span className="font-semibold text-slate-800">{user?.phone}</span></div>
                        <div><span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">Salon</span><span className="font-semibold text-slate-800">{user?.salon?.name}</span></div>
                        <div><span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">Adresse</span><span className="font-semibold text-slate-800">{user?.salon?.address}</span></div>
                        <div><span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">Pays</span><span className="font-semibold text-slate-800">{user?.salon?.country}</span></div>
                        <div><span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">Ville</span><span className="font-semibold text-slate-800">{user?.salon?.city}</span></div>
                        <div><span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">Status</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 mt-1">
                                {user?.salon?.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 🟣 Section Droite : Actions */}
                <div className="flex gap-3 lg:w-auto min-w-55">
                    <button
                        onClick={() => setUpdateModal(true)}
                        className="border text-violet-500 hover:bg-violet-700 hover:text-white font-medium rounded-xl transition-all duration-200 w-10 h-10 flex items-center justify-center"
                        type="button"
                    >
                        <Pencil size={20} />
                    </button>
                    <button
                        className="w-10 h-10 hover:bg-red-500 hover:text-white text-red-600 border border-red-500 font-medium rounded-xl transition-all duration-200 flex items-center justify-center"
                        type="button"
                    >
                        <Trash size={20} />
                    </button>
                </div>

                {error && (
                    <div className="w-full mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm font-medium flex items-center gap-2">
                        ⚠️ {error}
                    </div>
                )}
            </section>

            {/* 🟣 Modal de Modification */}
            {updateModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
                    <section className="bg-white rounded-2xl shadow-2xl border border-violet-100 p-6 w-full max-w-2xl relative">
                        <button
                            onClick={() => setUpdateModal(false)}
                            type="button"
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-500 transition-colors"
                        >
                            ✕
                        </button>

                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Modifier les informations</h2>

                        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handlesubmite}>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-600">Prénom</label>
                                <input type="text" value={firstname} placeholder="Prénom de l'utilisateur" className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" onChange={(e) => setFirstname(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-600">Nom</label>
                                <input type="text" value={lastname} placeholder="Nom de l'utilisateur" className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" onChange={(e) => setLastname(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-600">Email</label>
                                <input type="email" value={email} placeholder="email@exemple.com" className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-600">Téléphone</label>
                                <input type="tel" value={phone} placeholder="+33 6 12 34 56 78" className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" onChange={(e) => setPhone(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-600">Nom du salon</label>
                                <input type="text" value={name} placeholder="Nom du salon" className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-600">Adresse</label>
                                <input type="text" value={address} placeholder="Adresse complète" className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" onChange={(e) => setAdress(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-600">Pays</label>
                                <input type="text" value={country} placeholder="Pays" className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" onChange={(e) => setCountry(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-600">Ville</label>
                                <input type="text" value={city} placeholder="Ville" className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" onChange={(e) => setCity(e.target.value)} />
                            </div>

                            <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
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
        </>
    )
}

export default SalonProfil
