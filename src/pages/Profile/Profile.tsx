import type { AxiosError } from "axios"
import { useEffect, useState } from "react"
import api from "../../api/axios"
import Clients from "./components/Clients/Clients"

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

                if (!res.data.success) return alert(res.data.message)

                const user: User = res.data.infos
                setUser(user)

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

    switch (user?.role){
        case 'CLIENT':
            return (<Clients/>)
        default:
            return (<>{error}</>)
    }

    
    
}

export default Profile
