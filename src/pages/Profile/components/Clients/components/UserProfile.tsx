import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import api from "../../../../../api/axios";
import type User from "../../../../../interfaces/UserInterface";

// Définition de l'interface pour tes données
function UsersProfile() {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

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
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-screen text-violet-600">Chargement...</div>;

    return (
        <section className=" p-6 md:p-12">
            <div className="max-w-4xl mx-auto">

                {/* Header du profil */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-violet-100 mb-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-violet-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-violet-200">
                        {user?.firstname && user?.firstname[0]}{user?.lastname && user?.lastname[0]}
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-extrabold text-gray-900">{user?.firstname} {user?.lastname}</h1>
                        <span className="inline-block mt-2 px-4 py-1 bg-violet-100 text-violet-700 text-sm font-bold rounded-full">
                            {user?.role}
                        </span>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6">
                        {error}
                    </div>
                )}

                {/* Grille d'informations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Carte Infos Contact */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-violet-50">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="text-violet-500">📧</span> Informations de contact
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Email professionnel</p>
                                <p className="text-gray-900 font-medium">{user?.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Numéro de téléphone</p>
                                <p className="text-gray-900 font-medium">{user?.phone || 'Non renseigné'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Carte Compte */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-violet-50">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="text-violet-500">⚙️</span> Détails du compte
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">ID Utilisateur</p>
                                <p className="text-gray-900 font-medium">#{user?.id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Membre depuis le</p>
                                <p className="text-gray-900 font-medium">
                                    {user ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    }) : ''}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Actions rapides */}
                <div className="mt-8 flex gap-4">
                    <button className="px-6 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition shadow-lg shadow-violet-200">
                        Modifier le profil
                    </button>
                    <button className="px-6 py-3 bg-white text-red-600 border border-red-100 font-bold rounded-xl hover:bg-red-50 transition">
                        Se déconnecter
                    </button>
                </div>
            </div>
        </section>
    );
}

export default UsersProfile;