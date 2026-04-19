import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import type { AxiosError } from 'axios';

function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | ''>('');

    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await api.post("/auth/sign-in", {
                email: email,
                password: password
            })

            console.log("Réponse reçue :", res.data);

            if (!res.data.success) {
                alert(res.data.message);
                return;
            }

            alert(res.data.message);
            localStorage.setItem('token', res.data.accessToken);

            navigate('/profile')

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

    return (


        <>
            <section className="fixed inset-0 w-full h-full flex items-center justify-center bg-linear-to-br from-violet-50 via-white to-violet-100 p-4">
                {/* Carte de Connexion */}
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-violet-100 p-10 transform transition-all hover:scale-[1.01]">

                    {/* En-tête de la carte */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-600 rounded-full mb-4 shadow-lg shadow-violet-200">
                            {/* Icône (remplacer par un SVG ou Lucide si besoin) */}
                            <span className="text-3xl text-white">🔒</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                            Bienvenue
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Connectez-vous pour accéder à votre espace.
                        </p>
                    </div>

                    {/* Message d'erreur */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm mb-6 text-center animate-pulse">
                            {error}
                        </div>
                    )}

                    {/* Formulaire */}
                    <form onSubmit={handleLogin} className="space-y-6">

                        {/* Champ Email */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-sm font-semibold text-gray-700 ml-1">
                                Adresse Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    {/* <Mail className="h-5 w-5 text-violet-400" /> */}
                                    <span className="text-violet-400">@</span>
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 border border-violet-200 rounded-xl focus:ring-2 focus:ring-violet-300 focus:border-violet-500 transition duration-150 text-gray-800 placeholder:text-gray-400"
                                    placeholder="johndoe@gmail.com"
                                />
                            </div>
                        </div>

                        {/* Champ Mot de Passe */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between ml-1">
                                <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                                    Mot de passe
                                </label>
                                <Link to="/forgot-password" className="text-sm font-medium text-violet-600 hover:text-violet-700 hover:underline">
                                    Oublié ?
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    {/* <KeyRound className="h-5 w-5 text-violet-400" /> */}
                                    <span className="text-violet-400">🔑</span>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 border border-violet-200 rounded-xl focus:ring-2 focus:ring-violet-300 focus:border-violet-500 transition duration-150 text-gray-800 placeholder:text-gray-400"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Bouton de Connexion */}
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-md text-lg font-bold text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-300 transition duration-200 active:scale-[0.98]"
                            >
                                Se connecter
                            </button>
                        </div>
                    </form>

                    {/* Pied de la carte */}
                    <div className="mt-10 text-center border-t border-gray-100 pt-6">
                        <p className="text-sm text-gray-600">
                            Vous n'avez pas de compte ?{' '}
                            <Link to="/register" className="font-semibold text-violet-600 hover:text-violet-700 hover:underline">
                                Créez-en un gratuitement
                            </Link>
                        </p>
                    </div>

                </div>
            </section>
        </>
    );
}

export default Login;