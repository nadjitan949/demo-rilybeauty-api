import type { AxiosError } from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

function Register() {

    const [error, setError] = useState<string | "">("")
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        role: 'CLIENT',
        name: '',
        country: '',
        city: '',
        address: '',
        password: ''
    });

    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("")

        try {

            const res = await api.post("/auth/sign-up", formData)

            if(!res.data.success) return alert(res.data.message)

            alert(res.data.message)

            navigate('/')

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

    };

    return (
        <section className="min-h-screen bg-linear-to-br from-violet-50 via-white to-violet-100 py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-violet-100 overflow-hidden">

                <span> {error} </span>

                {/* Header */}
                <div className="bg-violet-600 p-8 text-center">
                    <h1 className="text-3xl font-bold text-white">Créer un compte</h1>
                    <p className="text-violet-100 mt-2">Rejoignez-nous et commencez votre expérience.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">

                    {/* Section 1: Informations Personnelles */}
                    <div>
                        <h2 className="text-lg font-semibold text-violet-800 border-b border-violet-100 pb-2 mb-6">
                            Informations Personnelles
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Nom</label>
                                <input name="lastname" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-violet-200 focus:ring-2 focus:ring-violet-300 outline-none transition" placeholder="Nom" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Prénom</label>
                                <input name="firstname" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-violet-200 focus:ring-2 focus:ring-violet-300 outline-none transition" placeholder="Prénom" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Email (Optionnel)</label>
                                <input name="email" type="email" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-violet-200 focus:ring-2 focus:ring-violet-300 outline-none transition" placeholder="email@exemple.com" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Téléphone (Optionnel)</label>
                                <input name="phone" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-violet-200 focus:ring-2 focus:ring-violet-300 outline-none transition" placeholder="+228..." />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Rôle et Identifiants */}
                    <div>
                        <h2 className="text-lg font-semibold text-violet-800 border-b border-violet-100 pb-2 mb-6">
                            Sécurité & Rôle
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Je suis un...</label>
                                <select name="role" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-violet-200 bg-white focus:ring-2 focus:ring-violet-300 outline-none transition cursor-pointer">
                                    <option value="CLIENT">Client</option>
                                    <option value="SALON">Professionnel (Salon)</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Mot de passe</label>
                                <input name="password" type="password" required onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-violet-200 focus:ring-2 focus:ring-violet-300 outline-none transition" placeholder="Min. 8 caractères" />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Infos Salon (Conditionnel) */}
                    {formData.role === 'SALON' && (
                        <div className="animate-fadeIn">
                            <h2 className="text-lg font-semibold text-violet-800 border-b border-violet-100 pb-2 mb-6">
                                Informations du Salon
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Nom du Salon</label>
                                    <input name="name" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-violet-200 focus:ring-2 focus:ring-violet-300 outline-none transition" placeholder="Ex: Rily Beauty" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Pays</label>
                                    <input name="country" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-violet-200 focus:ring-2 focus:ring-violet-300 outline-none transition" placeholder="France" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Ville</label>
                                    <input name="city" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-violet-200 focus:ring-2 focus:ring-violet-300 outline-none transition" placeholder="Paris" />
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Adresse</label>
                                    <input name="address" onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-violet-200 focus:ring-2 focus:ring-violet-300 outline-none transition" placeholder="12 rue de la Paix" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-6 text-center">
                        <button type="submit" className="w-full md:w-2/3 py-4 bg-violet-600 hover:bg-violet-700 text-white text-lg font-bold rounded-xl shadow-lg shadow-violet-200 transition transform active:scale-95">
                            Créer mon compte
                        </button>
                        <p className="mt-6 text-gray-600 text-sm">
                            Déjà inscrit ? <Link to="/" className="text-violet-600 font-semibold hover:underline">Connectez-vous</Link>
                        </p>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default Register;