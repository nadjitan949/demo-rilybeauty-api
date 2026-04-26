import { useEffect, useState } from "react"
import type User from "../../../../../interfaces/UserInterface"
import api from "../../../../../api/axios"
import type { AxiosError } from "axios"
import type Employee from "../../../../../interfaces/EmployeeInterface"
import type EmployeeSchedule from "../../../../../interfaces/EmployeeScheduleInterface"

const DAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
const MONTHS = ["Janvier", "Fevrier", "Mars", "Avril", "Mais", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Decembre"]

const formatDate = (MyDate: string) => {
    const date = new Date(MyDate)
    const year = date.getFullYear()
    const mounthIndex = date.getMonth()
    const dayIndex = date.getDay()
    const day = date.getDate()
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')

    const format = `${DAYS[dayIndex]} ${day} ${MONTHS[mounthIndex]} ${year} à ${hour}:${minute}`

    return format
}

function SalonEmployee() {
    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState<string | "">("")
    const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null)
    const [showDetails, setShowDetails] = useState<boolean>(false)
    const [updateEmployeeModal, setUpdateEmployeeModa] = useState<boolean>(false)
    const [serviceToEmployeeModal, setServiceToEmployeeModal] = useState<boolean>(false)
    const [addScheduleModal, setAddScheduleModal] = useState<boolean>(false)
    const [updateScheduleModal, setUpdateScheduleModal] = useState<boolean>(false)

    const [employee, setEmployee] = useState<Employee | null>(null)

    const [firstname, setFirstname] = useState<string | "">("")
    const [lastname, setLastname] = useState<string | "">("")
    const [email, setEmail] = useState<string | "">("")
    const [phone, setPhone] = useState<string | "">("")

    const [servicesList, setServicesList] = useState<number[]>([])
    const [selectedDay, setSelectedDay] = useState<number | null>(null)
    const [startTime, setStartTime] = useState<string | "">("")
    const [endTime, setEndTime] = useState<string | "">("")
    const [scheduleId, setScheduleId] = useState<number | null>(null)

    const [newSelectedDay, setNewSelectedDay] = useState<number | null>(null)
    const [NewStartTime, setNewStartTime] = useState<string | "">("")
    const [NewEndTime, setNewEndTime] = useState<string | "">("")

    const handleServiceCheck = (serviceId: number) => {
        setServicesList((prev) => {
            if (!prev) return [serviceId];

            if (prev.includes(serviceId)) {
                return prev.filter(id => id !== serviceId);
            } else {
                return [...prev, serviceId];
            }
        });
    };

    const days = [
        {
            index: 0,
            name: "Dimanche"
        },
        {
            index: 1,
            name: "Lundi"
        },
        {
            index: 2,
            name: "Mardi"
        },
        {
            index: 3,
            name: "Mercredi"
        },
        {
            index: 4,
            name: "Jeudi"
        },
        {
            index: 5,
            name: "Vendredi"
        },
        {
            index: 6,
            name: "Samedi"
        }
    ]


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
        if (!selectedEmployee) return
        const fetchEmployeeDetail = async () => {
            try {

                const res = await api.get(`employee/details/${selectedEmployee}`)

                const employee: Employee = res.data.employee
                setEmployee(employee)

                setFirstname(employee.firstname)
                setLastname(employee.lastname)
                setEmail(employee.email || "")
                setPhone(employee.phone || "")

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

        fetchEmployeeDetail()
    }, [selectedEmployee])

    const fetchtEmployeeShedule = async (id: number) => {
        try {

            const res = await api.get(`schedule/details/${id}`)

            const schedule: EmployeeSchedule = res.data.schedule

            setScheduleId(schedule.id)
            setSelectedDay(schedule.day)
            setStartTime(`${new Date(schedule.startTime).getHours().toString().padStart(2, '0')}:${new Date(schedule.startTime).getMinutes().toString().padStart(2, '0')}`)
            setEndTime(`${new Date(schedule.endTime).getHours().toString().padStart(2, '0')}:${new Date(schedule.endTime).getMinutes().toString().padStart(2, '0')}`)

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

    const serviceToEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {

            const res = await api.post('service/services-to-employee', {
                serviceId: servicesList,
                employeeId: selectedEmployee
            })

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

    const updateEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {

            const res = await api.put(`employee/update/${selectedEmployee}`,
                {
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    phone: phone
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

    const addEmployeeShedule = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {

            const res = await api.post('schedule/add-to-employee', {
                day: newSelectedDay,
                startTime: NewStartTime,
                endTime: NewEndTime,
                employeeId: selectedEmployee

            })

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

    const updateEmployeeSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {

            const res = await api.put(`schedule/update/${scheduleId}`,
                {
                    day: selectedDay,
                    startTime: startTime,
                    endTime: endTime
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

    const deleteSchedule = async (id: number) => {
        try {

            const isConfirm = confirm("Voulez vous vraiment supprimer cet créneau ?")
            if (!isConfirm) return

            const res = await api.delete(`schedule/delete/${id}`)

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
                {/* 🟣 En-tête */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Liste des employés</h1>
                        <p className="text-slate-500 mt-1">Gérez votre équipe et leurs disponibilités</p>
                    </div>
                    <button
                        onClick={() => {
                            setFirstname(""); setLastname(""); setEmail(""); setPhone("");
                            setUpdateEmployeeModa(true);
                        }}
                        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                    >
                        ➕ Ajouter un employé
                    </button>
                </div>

                {/* 🟣 Liste des employés */}
                {user?.salon?.employees && user?.salon?.employees?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {user?.salon?.employees?.map((e) => (
                            <div key={e.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all p-5 flex flex-col gap-4 group">
                                {/* Avatar + Nom */}
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-linear-to-br from-violet-500 to-violet-700 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                                        {e.firstname?.[0]?.toUpperCase()}{e.lastname?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-slate-800 truncate">{e.firstname} {e.lastname}</h3>
                                        <p className="text-sm text-slate-500 truncate">{e.email}</p>
                                    </div>
                                </div>

                                {/* Infos rapides */}
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        📞 <span className="truncate">{e.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        🛠️ <span>{e.services?.length || 0} services</span>
                                    </div>
                                </div>

                                {/* Services aperçu */}
                                {e.services && e.services?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {e.services.slice(0, 3).map((se) => (
                                            <span key={se.id} className="px-2.5 py-1 bg-violet-50 text-violet-700 text-xs font-medium rounded-full border border-violet-100">
                                                {se.name}
                                            </span>
                                        ))}
                                        {e.services.length > 3 && (
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                                                +{e.services.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100 mt-auto">
                                    <button
                                        onClick={() => { setSelectedEmployee(e.id); setShowDetails(true); }}
                                        className="flex-1 min-w-20 py-2 px-3 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700"
                                    >
                                        👁️ Détails
                                    </button>
                                    <button
                                        onClick={() => { setSelectedEmployee(e.id); setUpdateEmployeeModa(true); }}
                                        className="flex-1 min-w-20 py-2 px-3 text-xs font-medium rounded-lg border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors"
                                    >
                                        ✏️ Modifier
                                    </button>
                                    <button
                                        onClick={() => { /* Ta logique de suppression */ }}
                                        className="flex-1 min-w-20 py-2 px-3 text-xs font-medium rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                                    >
                                        🗑️ Supprimer
                                    </button>
                                </div>

                                {/* Bouton gestion services */}
                                <button
                                    onClick={() => {
                                        setSelectedEmployee(e.id);
                                        const existingServices = e.services?.map(s => s.id) || [];
                                        setServicesList(existingServices);
                                        setServiceToEmployeeModal(true);
                                    }}
                                    className="w-full py-2 text-sm font-medium text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    ⚙️ Gérer les services
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                        <p className="text-slate-500 text-lg">Aucun employé ajouté pour le moment.</p>
                        <button
                            onClick={() => {
                                setFirstname(""); setLastname(""); setEmail(""); setPhone("");
                                setUpdateEmployeeModa(true);
                            }}
                            className="mt-4 text-violet-600 font-medium hover:underline"
                        >
                            Ajouter votre premier employé →
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

            {/* 🟣 Modal Détails Employé */}
            {showDetails && employee && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <section className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative overflow-hidden max-h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-linear-to-r from-violet-50 to-white">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl bg-linear-to-br from-violet-500 to-violet-700 text-white flex items-center justify-center font-bold text-xl shadow-md">
                                    {employee.firstname?.[0]?.toUpperCase()}{employee.lastname?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">{employee.firstname} {employee.lastname}</h2>
                                    <p className="text-sm text-slate-500">{employee.email} • {employee.phone}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowDetails(false)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 hover:text-red-500 transition-colors">
                                ✕
                            </button>
                        </div>

                        {/* Content scrollable */}
                        <div className="p-5 overflow-y-auto flex-1 space-y-6">

                            {/* 🛠️ Services associés */}
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">🛠️ Services associés <span className="text-xs font-normal text-slate-500">({employee.services?.length || 0})</span></h3>
                                    {employee.services?.length === 0 && (
                                        <button
                                            onClick={() => { setSelectedEmployee(employee.id || null); setServiceToEmployeeModal(true); }}
                                            className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                                        >
                                            + Ajouter des services
                                        </button>
                                    )}
                                </div>
                                {employee.services && employee.services?.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {employee.services.map((se) => (
                                            <div key={se.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                <div>
                                                    <p className="font-medium text-slate-800">{se.name}</p>
                                                    <p className="text-xs text-slate-500">{se.duration} min • {se.price}$</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-500 text-sm italic">Aucun service assigné.</p>
                                )}
                            </div>

                            {/* 📅 Planning */}
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">📅 Créneaux de disponibilité <span className="text-xs font-normal text-slate-500">({employee.schedule?.length || 0})</span></h3>
                                    <button
                                        onClick={() => { setSelectedEmployee(Number(employee.id)); setAddScheduleModal(true); }}
                                        className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                                    >
                                        + Ajouter un créneau
                                    </button>
                                </div>
                                {employee.schedule && employee.schedule?.length > 0 ? (
                                    <div className="space-y-2">
                                        {employee.schedule.map((es) => (
                                            <div key={es.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                <div className="flex items-center gap-4">
                                                    <span className="font-medium text-slate-800 w-24">{DAYS[es.day]}</span>
                                                    <span className="text-slate-600">
                                                        {new Date(es.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} -
                                                        {new Date(es.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => { fetchtEmployeeShedule(es.id); setUpdateScheduleModal(true); }}
                                                        className="px-2 py-1 text-xs rounded border border-violet-200 text-violet-600 hover:bg-violet-50"
                                                    >
                                                        Modifier
                                                    </button>
                                                    <button type='button' onClick={() => deleteSchedule(es.id)} className="px-2 py-1 text-xs rounded border border-red-200 text-red-600 hover:bg-red-50">Supprimer</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-500 text-sm italic">Aucun créneau défini.</p>
                                )}
                            </div>

                            {/* 📋 Rendez-vous */}
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">📋 Rendez-vous <span className="text-xs font-normal text-slate-500">({employee.appointments?.length || 0})</span></h3>
                                {employee.appointments && employee.appointments?.length > 0 ? (
                                    <div className="space-y-3">
                                        {employee.appointments.map((ea) => (
                                            <div key={ea.id} className="p-4 bg-white rounded-xl border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                                <div><span className="text-xs text-slate-500 block">Référence</span><span className="font-medium text-slate-800">{ea.reference}</span></div>
                                                <div><span className="text-xs text-slate-500 block">Date</span><span className="text-slate-700">{formatDate(ea.date)}</span></div>
                                                <div><span className="text-xs text-slate-500 block">Service</span><span className="text-slate-700">{ea.service?.name} ({ea.service?.duration}min)</span></div>
                                                <div><span className="text-xs text-slate-500 block">Prix</span><span className="font-semibold text-violet-700">{ea.price}$</span></div>
                                                <div><span className="text-xs text-slate-500 block">Client</span><span className="text-slate-700">{ea.user?.firstname} {ea.user?.lastname}</span></div>
                                                <div><span className="text-xs text-slate-500 block">Statut</span><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${ea.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{ea.status}</span></div>
                                                <div><span className="text-xs text-slate-500 block">Paiement</span><span className={ea.payment ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{ea.payment ? '✓ Payé' : '✗ Non payé'}</span></div>
                                                {ea.note && <div className="md:col-span-2"><span className="text-xs text-slate-500 block">Note</span><span className="text-slate-700 italic">{ea.note}</span></div>}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-500 text-sm italic">Aucun rendez-vous pour cet employé.</p>
                                )}
                            </div>

                        </div>
                    </section>
                </div>
            )}

            {/* 🟣 Modal Mise à jour Employé */}
            {updateEmployeeModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <section className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="text-xl font-bold text-slate-800">Modifier l'employé</h2>
                            <button onClick={() => setUpdateEmployeeModa(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 hover:text-red-500 transition-colors">✕</button>
                        </div>
                        <form className="p-5 flex flex-col gap-4" onSubmit={updateEmployee}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-600">Prénom</label>
                                    <input type="text" value={firstname} placeholder="Prénom" className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" onChange={(e) => setFirstname(e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-600">Nom</label>
                                    <input type="text" value={lastname} placeholder="Nom" className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" onChange={(e) => setLastname(e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-1.5 col-span-2">
                                    <label className="text-sm font-medium text-slate-600">Email</label>
                                    <input type="email" value={email} placeholder="email@exemple.com" className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-1.5 col-span-2">
                                    <label className="text-sm font-medium text-slate-600">Téléphone</label>
                                    <input type="tel" value={phone} placeholder="+33 6 12 34 56 78" className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" onChange={(e) => setPhone(e.target.value)} />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setUpdateEmployeeModa(false)} className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-colors">Annuler</button>
                                <button type="submit" className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-md hover:shadow-lg transition-all">Mettre à jour</button>
                            </div>
                        </form>
                    </section>
                </div>
            )}

            {/* 🟣 Modal Gestion des Services */}
            {serviceToEmployeeModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <section className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="text-xl font-bold text-slate-800">Gérer les services</h2>
                            <button onClick={() => {
                                setServicesList([])
                                setServiceToEmployeeModal(false)
                            }} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 hover:text-red-500 transition-colors">✕</button>
                        </div>
                        <div className="p-5 overflow-y-auto flex-1">
                            <p className="text-sm text-slate-600 mb-4">Sélectionnez les services à assigner à cet employé :</p>
                            <form className="space-y-3" onSubmit={serviceToEmployee}>
                                {user?.salon?.services?.map((s) => (
                                    <label key={s.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={servicesList.includes(s.id)}
                                            onChange={() => handleServiceCheck(s.id)}
                                            className="w-4 h-4 text-violet-600 border-slate-300 rounded focus:ring-violet-500"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <span className="font-medium text-slate-800">{s.name}</span>
                                            <span className="text-xs text-slate-500 ml-2">{s.duration} min • {s.price}$</span>
                                        </div>
                                    </label>
                                ))}
                                <button type="submit" className="w-full mt-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-md transition-all">
                                    Enregistrer les services
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            )}

            {/* 🟣 Modal Ajouter un Créneau */}
            {addScheduleModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <section className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="text-xl font-bold text-slate-800">Ajouter un créneau</h2>
                            <button onClick={() => setAddScheduleModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 hover:text-red-500 transition-colors">✕</button>
                        </div>
                        <form className="p-5 flex flex-col gap-4" onSubmit={addEmployeeShedule}>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-600">Jour</label>
                                <select value={newSelectedDay ?? ""} onChange={(e) => setNewSelectedDay(Number(e.target.value))} className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white">
                                    <option value="" disabled>Sélectionnez le jour</option>
                                    {days.map((d) => (
                                        <option key={d.index} value={d.index}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-600">Heure de début</label>
                                    <input type="time" value={NewStartTime} onChange={(e) => setNewStartTime(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-600">Heure de fin</label>
                                    <input type="time" value={NewEndTime} onChange={(e) => setNewEndTime(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setAddScheduleModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-colors">Annuler</button>
                                <button type="submit" className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-md hover:shadow-lg transition-all">Valider</button>
                            </div>
                        </form>
                    </section>
                </div>
            )}

            {/* 🟣 Modal Modifier un Créneau */}
            {updateScheduleModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <section className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="text-xl font-bold text-slate-800">Modifier le créneau</h2>
                            <button onClick={() => setUpdateScheduleModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 hover:text-red-500 transition-colors">✕</button>
                        </div>
                        <form className="p-5 flex flex-col gap-4" onSubmit={updateEmployeeSchedule}>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-600">Jour</label>
                                <select value={selectedDay ?? ""} onChange={(e) => setSelectedDay(Number(e.target.value))} className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white">
                                    <option value="" disabled>Sélectionnez le jour</option>
                                    {days.map((d) => (
                                        <option key={d.index} value={d.index}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-600">Heure de début</label>
                                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-600">Heure de fin</label>
                                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setUpdateScheduleModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-colors">Annuler</button>
                                <button type="submit" className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-md hover:shadow-lg transition-all">Valider</button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </>
    )
}

export default SalonEmployee
