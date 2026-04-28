import type { AxiosError } from "axios";
import api from "../../../../api/axios";
import { useEffect, useState } from "react";
import {
    Users,
    Store,
    ShieldCheck,
    MoreVertical,
    Check,
    Ban
} from "lucide-react";

// Types basés sur ton schéma Prisma
interface UserProfile {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
}

interface Salon {
    id: number;
    name: string;
    city: string;
    status: string;
}

interface AdminData {
    infos: UserProfile;
    users: UserProfile[];
    salons: Salon[];
}

function Admins() {
    const [data, setData] = useState<AdminData | null>(null);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null); // Pour loader sur un salon spécifique

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const res = await api.get("/auth/profile");
                setData(res.data);
            } catch (err) {
                const error = err as AxiosError<{ message: string }>;
                if (error.response) {
                    const customMessage = error.response.data?.message || error.response.statusText || 'Identifiants invalides';
                    setError(customMessage);
                    alert(customMessage);
                } else {
                    setError('Impossible de joindre le serveur');
                    alert('Impossible de joindre le serveur');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, []);

    // 🟣 Approuver un salon (PENDING → ACTIVE)
    const handleApproveSalon = async (salonId: number) => {
        const isConfirm = confirm("Voulez-vous approuver ce salon ? Il deviendra visible et actif.");
        if (!isConfirm) return;

        setActionLoading(salonId);
        try {
            const res = await api.patch(`salon/approve/${salonId}`);
            alert(res.data.message || "Salon approuvé avec succès");
            
            // Mise à jour locale immédiate pour UX fluide
            setData(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    salons: prev.salons.map(s => 
                        s.id === salonId ? { ...s, status: 'ACTIVE' } : s
                    )
                };
            });
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const msg = error.response?.data?.message || "Erreur lors de l'approbation";
            setError(msg);
            alert(msg);
        } finally {
            setActionLoading(null);
        }
    };

    // 🟣 Bannir un salon (ACTIVE → BANNED)
    const handleBanSalon = async (salonId: number) => {
        const isConfirm = confirm("⚠️ Attention : Bannir ce salon le rendra inaccessible. Êtes-vous sûr ?");
        if (!isConfirm) return;

        setActionLoading(salonId);
        try {
            const res = await api.patch(`salon/bann/${salonId}`);
            alert(res.data.message);
            
            // Mise à jour locale immédiate
            setData(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    salons: prev.salons.map(s => 
                        s.id === salonId ? { ...s, status: 'BANNED' } : s
                    )
                };
            });
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const msg = error.response?.data?.message || "Erreur lors du bannissement";
            setError(msg);
            alert(msg);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            <p className="mt-4 text-violet-600 font-medium">Initialisation du Dashboard Admin...</p>
        </div>
    );

    const stats = [
        { label: "Utilisateurs", value: data?.users.length || 0, icon: Users, color: "bg-blue-500" },
        { label: "Salons Partenaires", value: data?.salons.length || 0, icon: Store, color: "bg-emerald-500" },
        { label: "Rôle", value: data?.infos.role, icon: ShieldCheck, color: "bg-violet-600" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Console Administration</h1>
                        <p className="text-gray-500">Bienvenue, {data?.infos.firstname} 👋</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
                            <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Liste des Utilisateurs */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Derniers Utilisateurs</h2>
                            <button className="text-sm text-violet-600 font-semibold hover:underline">Voir tout</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-gray-500 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Utilisateur</th>
                                        <th className="px-6 py-4">Rôle</th>
                                        <th className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {data?.users.slice(0, 5).map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50/50 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xs font-bold">
                                                        {u.firstname?.[0]}{u.lastname?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{u.firstname} {u.lastname}</p>
                                                        <p className="text-xs text-gray-500">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                                                    <MoreVertical size={16} className="text-gray-400" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Liste des Salons */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Salons Récents</h2>
                            <button className="text-sm text-violet-600 font-semibold hover:underline">Gérer</button>
                        </div>
                        <div className="p-6 space-y-4">
                            {data?.salons.slice(0, 4).map((salon) => (
                                <div key={salon.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                            <Store className="text-emerald-500" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{salon.name || "Salon sans nom"}</p>
                                            <p className="text-xs text-gray-500">{salon.city}</p>
                                        </div>
                                    </div>
                                    
                                    {/* 🟣 Zone d'action conditionnelle */}
                                    <div className="flex items-center gap-3">
                                        {/* Badge de statut */}
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                            salon.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                                            salon.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                            salon.status === 'BANNED' ? 'bg-red-100 text-red-700' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                            {salon.status}
                                        </span>
                                        
                                        {/* Boutons d'action */}
                                        {salon.status === 'PENDING' && (
                                            <button
                                                onClick={() => handleApproveSalon(salon.id)}
                                                disabled={actionLoading === salon.id}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-semibold rounded-lg transition-all shadow-sm hover:shadow"
                                            >
                                                {actionLoading === salon.id ? (
                                                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <Check size={14} />
                                                )}
                                                Approuver
                                            </button>
                                        )}
                                        
                                        {salon.status === 'ACTIVE' && (
                                            <button
                                                onClick={() => handleBanSalon(salon.id)}
                                                disabled={actionLoading === salon.id}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 disabled:bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-200 transition-all"
                                            >
                                                {actionLoading === salon.id ? (
                                                    <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                                                ) : (
                                                    <Ban size={14} />
                                                )}
                                                Bannir
                                            </button>
                                        )}
                                        
                                        {salon.status === 'BANNED' && (
                                            <button type="button" onClick={() => handleApproveSalon(salon.id)} className="px-3 py-1.5 bg-green-700 cursor-pointer hover:bg-green-500 rounded-md text-white text-sm">Reactiver</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {error && (
                    <div className="mt-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-center font-medium">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Admins;