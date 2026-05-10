import { useEffect, useState } from "react"
import type User from "../../interfaces/UserInterface"
import api from "../../api/axios"
import type { AxiosError } from "axios"
import { Pencil } from "lucide-react"

function Users() {
    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState<string | "">("")
    const [users, setUsers] = useState<User[] | null>(null)
    const [updateModal, setUpdateModale] = useState<boolean>(false)
    const [selectdeUser, setSelectedUser] = useState<number | null>(null)

    const [firstname, setFirstname] = useState<string | "">("")
    const [lastname, setLastname] = useState<string | "">("")
    const [email, setEmail] = useState<string | "">("")

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
        const fetchUsers = async () => {
            try {

                const res = await api.get('user/all')
                const responses: User[] = res.data.users
                setUsers(responses)

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
        fetchUsers()
    }, [])

    const fetchUserDetail = async (id: number) => {
        try {

            const res = await api.get(`user/details/${id}`)

            const response: User = res.data.user

            setFirstname(response.firstname || "")
            setLastname(response.lastname || "")
            setEmail(response.email || "")

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

    const updateUser = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectdeUser) return
        try {

            const res = await api.put(`user/update/${selectdeUser}`)

            alert(res.data.message)

            const refresh = await api.get('user/all')
            const responses: User[] = refresh.data.users
            setUsers(responses)

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
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {users?.map((usr) => (
                    <div key={usr.id} className="relative grou border border-zinc-800 rounded-2xl p-5 hover:border-indigo-500/50 transition-all duration-300 shadow-xl">
                        {/* Badge Status */}
                        <div className="absolute top-4 right-4">
                            <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full font-bold ${user?.id === usr.id ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "bg-zinc-800 text-zinc-400"}`}>
                                {user?.id === usr.id ? "Moi" : "Membre"}
                            </span>
                        </div>

                        {/* Infos Utilisateur */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                {usr.firstname && usr.firstname[0]}{usr.lastname && usr.lastname[0]}
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg leading-tight">
                                    {usr.firstname} {usr.lastname}
                                </h3>
                                <p className="text-zinc-500 text-sm">{usr.role}</p>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-zinc-400">
                            <div className="flex items-center gap-2">
                                <span className="opacity-50">📧</span> {usr.email}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="opacity-50">📞</span> {usr.phone}
                            </div>
                        </div>

                        {/* Action */}
                        <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-end">
                            <button
                                onClick={() => {
                                    setSelectedUser(usr.id)
                                    fetchUserDetail(usr.id)
                                    setUpdateModale(true)
                                }}
                                className="p-2.5 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-indigo-600 hover:text-white transition-colors group-hover:scale-105"
                            >
                                <Pencil size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </section>

            {error && (
                <span> {error} </span>
            )}

            {updateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <section className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header Modale */}
                        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-bold text-white">Modifier le profil</h2>
                            <button
                                onClick={() => setUpdateModale(false)}
                                className="text-zinc-500 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6">
                            <form className="flex flex-col gap-4" onSubmit={updateUser}>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-zinc-500 uppercase ml-1">Prénom</label>
                                    <input
                                        type="text"
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                        value={firstname}
                                        onChange={(e) => setFirstname(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-zinc-500 uppercase ml-1">Nom</label>
                                    <input
                                        type="text"
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                        value={lastname}
                                        onChange={(e) => setLastname(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-zinc-500 uppercase ml-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <button
                                    type='submit'
                                    className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                                >
                                    Enregistrer les modifications
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            )}
        </>
    )
}

export default Users
