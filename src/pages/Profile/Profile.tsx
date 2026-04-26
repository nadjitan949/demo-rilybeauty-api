import type { AxiosError } from "axios"
import { useEffect, useState } from "react"
import api from "../../api/axios"
import Clients from "./components/Clients/Clients"
import Admins from "./components/Admins/Admins"
import Salons from "./components/Salons/Salons"

interface User {
    role: string
}

function Profile() {

    const [error, setError] = useState<string | "">("")
    const [user, setUser] = useState<User | null>(null)


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

    switch (user?.role) {
        case 'CLIENT':
            return (<Clients />)
        case 'SALON':
            return (<Salons />)
        case 'ADMIN':
            return (<Admins />)
        default:
            return (<div className="p-10 text-red-500">Accès non autorisé ou erreur : {error}</div>)
    }

}

export default Profile
