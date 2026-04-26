import { useEffect, useState } from "react"
import type User from "../../../../../interfaces/UserInterface"
import type { AxiosError } from "axios"
import api from "../../../../../api/axios"
import type Appointment from "../../../../../interfaces/AppointmentInterfaces"
import { Calendar, Clock, Scissors, Search, UserIcon } from "lucide-react"
import type Service from "../../../../../interfaces/ServiceInterfaces"
import type Employee from "../../../../../interfaces/EmployeeInterface"

function SalonAppointment() {
    const [detailsModal, setDetailsModal] = useState<boolean>(false)
    const [noteModal, setNoteModal] = useState<boolean>(false)
    const [placePaymentModal, setPlacePaymentModal] = useState<boolean>(false)
    const [addVisiteModal, setAddVisiteModale] = useState<boolean>(false)

    const [error, setError] = useState<string | "">("")
    const [user, setUser] = useState<User | null>(null)
    const [detailsAppointment, setDetailsAppointment] = useState<Appointment | null>(null)
    const [note, setNote] = useState<string | "">("")
    const [source, setSource] = useState<'NO_SHOW' | 'COMPLETED' | 'CANCELED' | "">("")
    const [selectedeAppointment, setSelectedAppointment] = useState<number | null>(null)
    const [provider, setProvider] = useState<'STRIPE' | 'CMI' | 'PAYPAL' | 'CASH' | "">("")
    const [currency, setCurrency] = useState<'EUR' | 'USD' | 'MAD' | 'XOF' | 'XAF' | "">("")
    const [clients, setClients] = useState<User[] | []>([])

    const [cFirstname, setCFirstname] = useState<string | "">("")
    const [cLastName, setCLastname] = useState<string | "">("")
    const [cEmail, setCEmail] = useState<string | "">("")
    const [cPhone, setCPhone] = useState<string | "">("")

    const [serviceName, setServiceName] = useState<string | "">("")
    const [servicePrice, setServicePrice] = useState<number | 0>(0)
    const [serviceDuration, setServiceDuration] = useState<number | 0>(0)

    const [eFirstname, setEFirstname] = useState<string | "">("")
    const [eLastName, setELastname] = useState<string | "">("")
    const [eEmail, setEEmail] = useState<string | "">("")
    const [ePhone, setEPhone] = useState<string | "">("")

    const [avDate, setAvDate] = useState<string | "">("")
    const [avTime, setAvTime] = useState<string | "">("")

    const [clientsResults, sertClientsResults] = useState<User[] | []>([])
    const [servicesResults, setServicesResults] = useState<Service[] | []>([])
    const [employeesResults, setEmployeesResults] = useState<Employee[] | []>([])

    const [selecteClient, setSelectedClient] = useState<number | null>(null)
    const [selectedService, setSelectedService] = useState<number | null>(null)
    const [selectdeEmployee, setSelectedEmployee] = useState<number | null>(null)

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

    const fetcheDetailsAppointment = async (id: number) => {
        try {

            const res = await api.get(`appointment/details/${id}`)
            const appointment: Appointment = res.data.appointment
            setDetailsAppointment(appointment)

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

    const handleConfirmAppointment = async (id: number) => {
        try {

            const isConfirm = confirm("Voulez-vous confirmer ce rendez-vous ?")
            if (!isConfirm) return

            const res = await api.patch(`appointment/confirm/${id}`, {})
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

    const cancelAppointment = async () => {
        try {

            const res = await api.patch(`appointment/cancel/${selectedeAppointment}`,
                {
                    note: note
                }
            )

            setNote("")
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

    const completeAppointment = async () => {
        try {

            const res = await api.patch(`appointment/complete/${selectedeAppointment}`, {
                note: note
            })

            setNote("")
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

    const noShowAppointment = async () => {
        try {

            const res = await api.patch(`appointment/no-show/${selectedeAppointment}`, {
                note: note
            })

            setNote("")
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

    const processPayment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {

            const res = await api.post(`payment/process`, {
                provider: provider,
                currency: currency,
                appointmentId: selectedeAppointment
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

    const confirmCashPayment = async (id: number) => {
        try {

            const isConfirm = confirm("Voulez vous vraiment confirmer ce paiement ?")
            if (!isConfirm) return

            const res = await api.post(`payment/confirm-cash/${id}`, {})

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

    const refundPayment = async (id: number) => {
        try {

            const isConfirm = confirm("Voulez-vous rembourser ce paiement ?")
            if (!isConfirm) return

            const res = await api.post('refund/process',
                {
                    paymentId: id
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

    useEffect(() => {
        const fetchClients = async () => {
            try {

                const res = await api.get('user/all')

                const users: User[] = res.data.users
                const clients: User[] = users.filter(user => user.role === 'CLIENT')

                setClients(clients)

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
        fetchClients()
    }, [])

    const fetchClientsDetails = async (id: number) => {
        try {

            const res = await api.get(`user/details/${id}`)
            const user: User = res.data.user

            setCFirstname(user.firstname || "")
            setCLastname(user.lastname || "")
            setCEmail(user.email || "")
            setCPhone(user.phone || "")

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

    const fetchEmployeeDetails = async (id: number) => {
        try {

            const res = await api.get(`employee/details/${id}`)
            const user: Employee = res.data.employee

            setEFirstname(user.firstname || "")
            setELastname(user.lastname || "")
            setEEmail(user.email || "")
            setEPhone(user.phone || "")

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;

            if (error.response) {
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

    const fetchServiceDetails = async (id: number) => {
        try {

            const res = await api.get(`service/details/${id}`)

            const service: Service = res.data.service

            setServiceName(service.name)
            setServicePrice(service.price)
            setServiceDuration(service.duration)

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

    const handleSearchClient = (e: React.ChangeEvent<HTMLInputElement>) => {
        const clientResult: User[] =
            clients?.filter((c) =>
                (c.firstname ?? "").toLowerCase().includes(e.target.value.toLowerCase())
            ) || [];

        if (e.target.value.trim() === "") {
            sertClientsResults([])
        }

        sertClientsResults(clientResult);
    };

    const handleSearchService = (e: React.ChangeEvent<HTMLInputElement>) => {
        const serviceResult: Service[] =
            user?.salon?.services?.filter((s) =>
                s.name.toLowerCase().includes(e.target.value.toLowerCase())
            ) || [];

        if (e.target.value.trim() === "") {
            setServicesResults([])
        }

        setServicesResults(serviceResult);
    };

    const handleSearchEmployee = (e: React.ChangeEvent<HTMLInputElement>) => {
        const employeeResult: Employee[] =
            user?.salon?.employees?.filter((em) =>
                em.firstname.toLowerCase().includes(e.target.value.toLowerCase())
            ) || [];

        if (e.target.value.trim() === "") {
            setEmployeesResults([])
        }

        setEmployeesResults(employeeResult);
    };

    const handleAddAppointment = async (e: React.FormEvent) => {
        e.preventDefault()

        try {

            const res = await api.post('appointment/book', {
                date: new Date(`${avDate}T${avTime}:00`),
                userId: selecteClient,
                salonId: user?.salon?.id,
                serviceId: selectedService,
                employeeId: selectdeEmployee
            })

            alert(res.data.message)

            sertClientsResults([])
            setServicesResults([])
            setEmployeesResults([])
            setAvDate("")
            setAvTime("")

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
            <section className="p-6 max-w-7xl mx-auto space-y-8 bg-slate-50/50 rounded-3xl">

                {/* 🟣 En attente */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-linear-to-r from-amber-50/50 to-white">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                🕐 Liste des rendez-vous en attente
                                <span className="ml-2 px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                                    {user?.salon?.appointments?.filter((a) => a.status === 'PENDING').length || 0}
                                </span>
                            </h1>
                            <button onClick={() => {
                                setAddVisiteModale(true)
                            }} type="button" className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all text-sm">
                                ➕ Ajouter un rendez-vous
                            </button>
                        </div>
                    </div>
                    <div className="p-5 space-y-4">
                        {user?.salon?.appointments?.filter((a) => a.status === 'PENDING').map((a) => (
                            <div key={a.id} className="border border-amber-200 bg-amber-50/30 rounded-xl p-4 hover:shadow-md transition-all">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-slate-800 tracking-wide">#{a.reference}</span>
                                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">En attente</span>
                                    </div>
                                    <span className="text-lg font-bold text-violet-700">{a.price}$</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 text-sm text-slate-600 mb-4">
                                    <span>📅 {a.date}</span>
                                    <span>🛠️ {a.service?.name}</span>
                                    <span>⏱️ {a.service?.duration} min</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Client</span>
                                        <span className="text-slate-800 font-medium">{a.user?.firstname} {a.user?.lastname}</span><br />
                                        <span className="text-slate-500 text-sm">{a.user?.email}</span><br />
                                        <span className="text-slate-500 text-sm">{a.user?.phone}</span>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Employé</span>
                                        <span className="text-slate-800 font-medium">{a.employee?.firstname} {a.employee?.lastname}</span><br />
                                        <span className="text-slate-500 text-sm">{a.employee?.email}</span><br />
                                        <span className="text-slate-500 text-sm">{a.employee?.phone}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-3 border-t border-slate-100">
                                    <button onClick={() => { fetcheDetailsAppointment(a.id); setDetailsModal(true); }} type="button" className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">👁️ Détails</button>
                                    <button onClick={() => handleConfirmAppointment(a.id)} type="button" className="ml-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm hover:shadow">✅ Confirmer</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 🟣 Confirmés */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-linear-to-r from-blue-50/50 to-white">
                        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            ✅ Liste des rendez-vous confirmés
                            <span className="ml-2 px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                {user?.salon?.appointments?.filter((a) => a.status === 'CONFIRMED').length || 0}
                            </span>
                        </h1>
                    </div>
                    <div className="p-5 space-y-4">
                        {user?.salon?.appointments?.filter((a) => a.status === 'CONFIRMED').map((a) => (
                            <div key={a.id} className="border border-blue-200 bg-blue-50/30 rounded-xl p-4 hover:shadow-md transition-all">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-slate-800 tracking-wide">#{a.reference}</span>
                                        <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">Confirmé</span>
                                    </div>
                                    <span className="text-lg font-bold text-violet-700">{a.price}$</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 text-sm text-slate-600 mb-4">
                                    <span>📅 {a.date}</span>
                                    <span>🛠️ {a.service?.name}</span>
                                    <span>⏱️ {a.service?.duration} min</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Client</span>
                                        <span className="text-slate-800 font-medium">{a.user?.firstname} {a.user?.lastname}</span><br />
                                        <span className="text-slate-500 text-sm">{a.user?.email}</span><br />
                                        <span className="text-slate-500 text-sm">{a.user?.phone}</span>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Employé</span>
                                        <span className="text-slate-800 font-medium">{a.employee?.firstname} {a.employee?.lastname}</span><br />
                                        <span className="text-slate-500 text-sm">{a.employee?.email}</span><br />
                                        <span className="text-slate-500 text-sm">{a.employee?.phone}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-3 border-t border-slate-100">
                                    <button onClick={() => { fetcheDetailsAppointment(a.id); setDetailsModal(true); }} type="button" className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">👁️ Détails</button>
                                    <button onClick={() => { setSelectedAppointment(a.id); setSource('COMPLETED'); setNoteModal(true); }} type="button" className="ml-auto px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm hover:shadow">🎉 Terminer</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 🟣 Complétés */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-linear-to-r from-green-50/50 to-white">
                        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            🎉 Liste des rendez-vous complétés
                            <span className="ml-2 px-2.5 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                {user?.salon?.appointments?.filter((a) => a.status === 'COMPLETED').length || 0}
                            </span>
                        </h1>
                    </div>
                    <div className="p-5 space-y-4">
                        {user?.salon?.appointments?.filter((a) => a.status === 'COMPLETED').map((a) => (
                            <div key={a.id} className="border border-green-200 bg-green-50/30 rounded-xl p-4 hover:shadow-md transition-all">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-slate-800 tracking-wide">#{a.reference}</span>
                                        <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Complété</span>
                                    </div>
                                    <span className="text-lg font-bold text-violet-700">{a.price}$</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 text-sm text-slate-600 mb-4">
                                    <span>📅 {a.date}</span>
                                    <span>🛠️ {a.service?.name}</span>
                                    <span>⏱️ {a.service?.duration} min</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Client</span>
                                        <span className="text-slate-800 font-medium">{a.user?.firstname} {a.user?.lastname}</span><br />
                                        <span className="text-slate-500 text-sm">{a.user?.email}</span><br />
                                        <span className="text-slate-500 text-sm">{a.user?.phone}</span>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Employé</span>
                                        <span className="text-slate-800 font-medium">{a.employee?.firstname} {a.employee?.lastname}</span><br />
                                        <span className="text-slate-500 text-sm">{a.employee?.email}</span><br />
                                        <span className="text-slate-500 text-sm">{a.employee?.phone}</span>
                                    </div>
                                </div>
                                {a.note && (
                                    <div className="mt-3 p-3 bg-violet-50 rounded-lg border border-violet-100 flex gap-2">
                                        <span className="text-violet-500 mt-0.5">📝</span>
                                        <p className="text-sm text-slate-700 leading-relaxed">Note : {a.note}</p>
                                    </div>
                                )}
                                <div className="flex gap-2 pt-3 border-t border-slate-100">
                                    <button onClick={() => { fetcheDetailsAppointment(a.id); setDetailsModal(true); }} type="button" className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">👁️ Détails</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 🟣 Annulés */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-linear-to-r from-red-50/50 to-white">
                        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            ❌ Liste des rendez-vous annulés
                            <span className="ml-2 px-2.5 py-0.5 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                                {user?.salon?.appointments?.filter((a) => a.status === 'CANCELLED').length || 0}
                            </span>
                        </h1>
                    </div>
                    <div className="p-5 space-y-4">
                        {user?.salon?.appointments?.filter((a) => a.status === 'CANCELLED').map((a) => (
                            <div key={a.id} className="border border-red-200 bg-red-50/30 rounded-xl p-4 hover:shadow-md transition-all">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-slate-800 tracking-wide">#{a.reference}</span>
                                        <span className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">Annulé</span>
                                    </div>
                                    <span className="text-lg font-bold text-violet-700">{a.price}$</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 text-sm text-slate-600 mb-4">
                                    <span>📅 {a.date}</span>
                                    <span>🛠️ {a.service?.name}</span>
                                    <span>⏱️ {a.service?.duration} min</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Client</span>
                                        <span className="text-slate-800 font-medium">{a.user?.firstname} {a.user?.lastname}</span><br />
                                        <span className="text-slate-500 text-sm">{a.user?.email}</span><br />
                                        <span className="text-slate-500 text-sm">{a.user?.phone}</span>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Employé</span>
                                        <span className="text-slate-800 font-medium">{a.employee?.firstname} {a.employee?.lastname}</span><br />
                                        <span className="text-slate-500 text-sm">{a.employee?.email}</span><br />
                                        <span className="text-slate-500 text-sm">{a.employee?.phone}</span>
                                    </div>
                                </div>
                                {a.note && (
                                    <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100 flex gap-2">
                                        <span className="text-red-500 mt-0.5">⚠️</span>
                                        <p className="text-sm text-slate-700 leading-relaxed">Raison : {a.note}</p>
                                    </div>
                                )}
                                <div className="flex gap-2 pt-3 border-t border-slate-100">
                                    <button onClick={() => { fetcheDetailsAppointment(a.id); setDetailsModal(true); }} type="button" className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">👁️ Détails</button>
                                    {a.payment && (
                                        <button type="button" className="ml-auto px-4 py-2 bg-amber-100 text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium">💸 Rembourser le client</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 🟣 No-show */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-linear-to-r from-slate-50/50 to-white">
                        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            🚫 Liste des rendez-vous no-show
                            <span className="ml-2 px-2.5 py-0.5 bg-slate-100 text-slate-800 text-xs font-semibold rounded-full">
                                {user?.salon?.appointments?.filter((a) => a.status === 'NO_SHOW').length || 0}
                            </span>
                        </h1>
                    </div>
                    <div className="p-5 space-y-4">
                        {user?.salon?.appointments?.filter((a) => a.status === 'NO_SHOW').map((a) => (
                            <div key={a.id} className="border border-slate-300 bg-slate-50/40 rounded-xl p-4 hover:shadow-md transition-all">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-slate-800 tracking-wide">#{a.reference}</span>
                                        <span className="px-2.5 py-1 bg-slate-200 text-slate-800 text-xs font-semibold rounded-full">No-show</span>
                                    </div>
                                    <span className="text-lg font-bold text-violet-700">{a.price}$</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 text-sm text-slate-600 mb-4">
                                    <span>📅 {a.date}</span>
                                    <span>🛠️ {a.service?.name}</span>
                                    <span>⏱️ {a.service?.duration} min</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Client</span>
                                        <span className="text-slate-800 font-medium">{a.user?.firstname} {a.user?.lastname}</span><br />
                                        <span className="text-slate-500 text-sm">{a.user?.email}</span><br />
                                        <span className="text-slate-500 text-sm">{a.user?.phone}</span>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Employé</span>
                                        <span className="text-slate-800 font-medium">{a.employee?.firstname} {a.employee?.lastname}</span><br />
                                        <span className="text-slate-500 text-sm">{a.employee?.email}</span><br />
                                        <span className="text-slate-500 text-sm">{a.employee?.phone}</span>
                                    </div>
                                </div>
                                {a.note && (
                                    <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 flex gap-2">
                                        <span className="text-slate-500 mt-0.5">🚫</span>
                                        <p className="text-sm text-slate-700 leading-relaxed">Raison : {a.note}</p>
                                    </div>
                                )}
                                <div className="flex gap-2 pt-3 border-t border-slate-100">
                                    <button onClick={() => { fetcheDetailsAppointment(a.id); setDetailsModal(true); }} type="button" className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">👁️ Détails</button>
                                    {a.payment && (
                                        <button type="button" className="ml-auto px-4 py-2 bg-amber-100 text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium">💸 Rembourser le client</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 🟣 Message d'erreur */}
                {error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm font-medium flex items-center gap-2">
                        ⚠️ {error}
                    </div>
                )}

            </section>

            {/* 🟣 Modal Détails */}
            {detailsModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <section className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Rendez-vous #{detailsAppointment?.reference}</h2>
                                <p className="text-sm text-slate-500">{detailsAppointment?.date}</p>
                            </div>
                            <button onClick={() => setDetailsModal(false)} type="button" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 hover:text-red-500 transition-colors">✕</button>
                        </div>
                        <div className="p-5 overflow-y-auto flex-1 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-violet-50 rounded-xl border border-violet-100">
                                    <span className="text-xs font-semibold text-violet-600 uppercase tracking-wide block mb-1">Prix</span>
                                    <span className="text-2xl font-bold text-slate-800">{detailsAppointment?.price}$</span>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Statut</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${detailsAppointment?.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                                        detailsAppointment?.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                            detailsAppointment?.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                detailsAppointment?.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                    'bg-slate-200 text-slate-800'
                                        }`}>{detailsAppointment?.status}</span>
                                </div>
                            </div>
                            <div className="p-4 bg-white rounded-xl border border-slate-200">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Service</span>
                                <p className="font-medium text-slate-800">{detailsAppointment?.service?.name}</p>
                                <p className="text-sm text-slate-500">Durée: {detailsAppointment?.service?.duration} min</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-white rounded-xl border border-slate-200">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Client</span>
                                    <p className="font-medium text-slate-800">{detailsAppointment?.user?.firstname} {detailsAppointment?.user?.lastname}</p>
                                    <p className="text-sm text-slate-500">{detailsAppointment?.user?.email}</p>
                                    <p className="text-sm text-slate-500">{detailsAppointment?.user?.phone}</p>
                                </div>
                                <div className="p-4 bg-white rounded-xl border border-slate-200">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Employé</span>
                                    <p className="font-medium text-slate-800">{detailsAppointment?.employee?.firstname} {detailsAppointment?.employee?.lastname}</p>
                                    <p className="text-sm text-slate-500">{detailsAppointment?.employee?.email}</p>
                                    <p className="text-sm text-slate-500">{detailsAppointment?.employee?.phone}</p>
                                </div>
                            </div>

                            {/* 📝 Note / Raison dans la modal */}
                            {detailsAppointment?.note && (
                                <div className={`p-4 rounded-xl border flex gap-3 ${detailsAppointment?.status === 'COMPLETED' ? 'bg-violet-50 border-violet-100' :
                                    detailsAppointment?.status === 'CANCELLED' || detailsAppointment?.status === 'NO_SHOW' ? 'bg-red-50 border-red-100' :
                                        'bg-slate-50 border-slate-200'
                                    }`}>
                                    <span className="text-xl mt-0.5">{
                                        detailsAppointment?.status === 'COMPLETED' ? '📝' :
                                            detailsAppointment?.status === 'CANCELLED' || detailsAppointment?.status === 'NO_SHOW' ? '⚠️' : '💬'
                                    }</span>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                                            {detailsAppointment?.status === 'COMPLETED' ? 'Note du RDV' : 'Raison'}
                                        </p>
                                        <p className="text-slate-700 leading-relaxed">{detailsAppointment?.note}</p>
                                    </div>
                                </div>
                            )}

                            {detailsAppointment?.payment ? (
                                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                    <span className="text-xs font-semibold text-green-600 uppercase tracking-wide block mb-2">Paiement</span>
                                    <div className="grid grid-cols-3 gap-3 text-sm">
                                        <div><span className="text-slate-500 block text-xs">Montant</span><span className="font-medium">{detailsAppointment?.payment?.amount} {detailsAppointment?.payment?.currency}</span></div>
                                        <div><span className="text-slate-500 block text-xs">Méthode</span><span className="font-medium">{detailsAppointment?.payment?.provider}</span></div>
                                        <div><span className="text-slate-500 block text-xs">Statut</span><span className={`font-medium ${detailsAppointment?.payment?.status === 'SUCCESS' ? 'text-green-600' : 'text-amber-600'}`}>{detailsAppointment?.payment?.status}</span></div>
                                    </div>
                                </div>
                            ) : (
                                detailsAppointment?.status !== 'NO_SHOW' && detailsAppointment?.status !== 'CANCELLED' && (
                                    <button onClick={() => {
                                        setSelectedAppointment(Number(detailsAppointment?.id))
                                        setPlacePaymentModal(true)
                                    }} type="button" className="w-full py-3 rounded-xl border-2 border-dashed border-violet-300 text-violet-600 hover:bg-violet-50 font-medium transition-colors">
                                        💰 Effectuer un paiement sur place
                                    </button>
                                )
                            )}

                            {detailsAppointment?.payment?.refund && (
                                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                    <span className="text-xs font-semibold text-green-600 uppercase tracking-wide block mb-2">Remboursement</span>
                                    <div className="grid grid-cols-3 gap-3 text-sm">
                                        <div><span className="text-slate-500 block text-xs">Montant</span><span className="font-medium">{detailsAppointment?.payment?.refund.amount} {detailsAppointment?.payment?.currency}</span></div>
                                        <div><span className="text-slate-500 block text-xs">Méthode</span><span className="font-medium">{detailsAppointment?.payment?.refund.provider}</span></div>
                                        <div><span className="text-slate-500 block text-xs">Statut</span><span className={`font-medium ${detailsAppointment?.payment?.refund.status === 'SUCCESS' ? 'text-green-600' : 'text-amber-600'}`}>{detailsAppointment?.payment.refund.status}</span></div>
                                    </div>
                                    {detailsAppointment.payment.refund.provider === 'CASH' ? (
                                        <button type='button' className="border px-3 py-2 bg-green-500 text-white rounded-md mt-5 cursor-pointer hover:bg-green-400">Confirmer le remboursement</button>
                                    ) : (
                                        <div className="mt-5 flex gap-2 items-center">
                                            <Clock size={15} className="text-orange-400" />
                                            <span className="text-orange-400">En attente de confirmation de {detailsAppointment.payment.refund.provider} </span>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                                {detailsAppointment?.status === 'PENDING' && (
                                    <>
                                        <button onClick={() => { setSelectedAppointment(detailsAppointment.id); setSource('CANCELED'); setNoteModal(true); }} type="button" className="px-5 py-2.5 rounded-xl bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-medium transition-colors">❌ Annuler</button>
                                        <button onClick={() => handleConfirmAppointment(detailsAppointment.id)} type="button" className="px-5 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 font-medium">✅ Confirmer</button>
                                    </>
                                )}
                                {detailsAppointment?.status === 'CONFIRMED' && (
                                    <>
                                        <button onClick={() => { setSelectedAppointment(detailsAppointment.id); setSource('CANCELED'); setNoteModal(true); }} type="button" className="px-5 py-2.5 rounded-xl bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-medium transition-colors">❌ Annuler</button>
                                        <button onClick={() => { setSelectedAppointment(detailsAppointment.id); setSource('COMPLETED'); setNoteModal(true); }} type="button" className="px-5 py-2.5 rounded-xl bg-violet-600 text-white hover:bg-violet-700 font-medium">🎉 Terminer</button>
                                        <button onClick={() => { setSelectedAppointment(detailsAppointment.id); setSource('NO_SHOW'); setNoteModal(true); }} type="button" className="px-5 py-2.5 rounded-xl bg-amber-500 text-white hover:bg-amber-600 font-medium">🚫 No Show</button>
                                    </>
                                )}
                                {(detailsAppointment?.status === 'CANCELLED' || detailsAppointment?.status === 'NO_SHOW') && detailsAppointment?.payment?.status === 'SUCCESS' && (
                                    <button type="button"
                                        onClick={() => refundPayment(Number(detailsAppointment.payment?.id))}
                                        className="px-5 py-2.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200 font-medium transition-colors">💸 Remboursement</button>
                                )}
                                {detailsAppointment?.payment?.provider === 'CASH' && detailsAppointment.payment.status === 'PENDING' && (
                                    <button type="button"
                                        onClick={() => confirmCashPayment(Number(detailsAppointment.payment?.id))}
                                        className="px-5 py-2.5 rounded-xl bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 font-medium transition-colors">✓ Confirmer le paiement</button>
                                )}
                                <button onClick={() => setDetailsModal(false)} type="button" className="ml-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-colors">Fermer</button>
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {/* 🟣 Modal Note / Raison */}
            {source !== "" && noteModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <section className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
                            <h2 className="text-lg font-bold text-slate-800">
                                {source === 'COMPLETED' ? "Noter le rendez-vous" : source === 'CANCELED' ? "Raison de l'annulation" : "Raison de l'absence"}
                            </h2>
                            <button onClick={() => { setSource(""); setNoteModal(false); }} type="button" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 hover:text-red-500 transition-colors">✕</button>
                        </div>
                        <div className="p-5">
                            <p className="text-sm text-slate-500 mb-4">Rendez-vous sélectionné : <span className="font-medium text-slate-800">#{selectedeAppointment}</span></p>
                            <form action="" className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                                <textarea
                                    value={note}
                                    placeholder="Saisissez une note ou la raison..."
                                    onChange={(e) => setNote(e.target.value)}
                                    className="w-full min-h-30 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white resize-none"
                                ></textarea>
                                <button
                                    onClick={() => {
                                        if (source === 'CANCELED') { cancelAppointment(); }
                                        else if (source === 'COMPLETED') { completeAppointment(); }
                                        else if (source === 'NO_SHOW') { noShowAppointment(); }
                                        else { setNoteModal(false); }
                                    }}
                                    type="submit"
                                    className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all"
                                >
                                    Valider
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            )}

            {placePaymentModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <section className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-linear-to-r from-violet-50 to-white">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                💳 Effectuer un paiement
                            </h2>
                            <button onClick={() => setPlacePaymentModal(false)} type="button" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 hover:text-red-500 transition-colors">✕</button>
                        </div>

                        {/* Form */}
                        <form onSubmit={processPayment} className="p-5 space-y-6">

                            {/* 🔹 Sélection du mode de paiement */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-600 block">Mode de paiement souhaité</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'CMI', label: 'Carte VISA', icon: '💳' },
                                        { id: 'PAYPAL', label: 'PayPal', icon: '🅿️' },
                                        { id: 'CASH', label: 'Espèces', icon: '💵' }
                                    ].map((p) => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => setProvider(p.id as typeof provider)}
                                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-sm font-medium ${provider === p.id
                                                    ? 'border-violet-500 bg-violet-50 text-violet-700 ring-2 ring-violet-200'
                                                    : 'border-slate-200 hover:border-violet-300 hover:bg-slate-50 text-slate-600'
                                                }`}
                                        >
                                            <span className="text-xl mb-1">{p.icon}</span>
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                                <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-sm" value={provider} placeholder="Mode sélectionné" required />
                            </div>

                            {/* 🔹 Sélection de la devise */}
                            <div className="space-y-3 pt-2 border-t border-slate-100">
                                <label className="text-sm font-medium text-slate-600 block">Devise</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'EUR', label: 'Euro', icon: '🇪🇺' },
                                        { id: 'USD', label: 'USD', icon: '🇺🇸' },
                                        { id: 'MAD', label: 'Dirham', icon: '🇲🇦' },
                                        { id: 'XOF', label: 'FCFA AO', icon: '🇸🇳' },
                                        { id: 'XAF', label: 'FCFA AC', icon: '🇨🇲' }
                                    ].map((c) => (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => setCurrency(c.id as typeof currency)}
                                            className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all text-sm font-medium ${currency === c.id
                                                    ? 'border-violet-500 bg-violet-50 text-violet-700 ring-2 ring-violet-200'
                                                    : 'border-slate-200 hover:border-violet-300 hover:bg-slate-50 text-slate-600'
                                                }`}
                                        >
                                            <span>{c.icon}</span> {c.label}
                                        </button>
                                    ))}
                                </div>
                                <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-sm" value={currency} placeholder="Devise sélectionnée" required />
                            </div>

                            {/* 🔹 Bouton de validation */}
                            <button type="submit" className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2">
                                💰 Valider le paiement
                            </button>

                        </form>
                    </section>
                </div>
            )}

            {addVisiteModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <section className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative overflow-hidden max-h-[90vh] flex flex-col">

                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-linear-to-r from-violet-50 to-white">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Calendar className="text-violet-600" size={20} />
                                Nouveau rendez-vous
                            </h2>
                            <button onClick={() => setAddVisiteModale(false)} type="button" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 hover:text-red-500 transition-colors">✕</button>
                        </div>

                        {/* Form scrollable */}
                        <form onSubmit={handleAddAppointment} className="p-5 overflow-y-auto flex-1 space-y-6">

                            {/* 🔍 Section Client */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-2">
                                    <UserIcon size={16} className="text-violet-600" /> Client
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Recherche + Autocomplete */}
                                    <div className="md:col-span-2 relative">
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">Rechercher un client</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-slate-50 focus:bg-white transition-all"
                                                placeholder="Taper le nom, email ou téléphone..."
                                                onChange={handleSearchClient}
                                            />
                                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        </div>
                                        {clientsResults.length > 0 && (
                                            <ul className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                                {clientsResults.map((cr) => (
                                                    <li
                                                        key={cr.id}
                                                        onClick={() => { fetchClientsDetails(cr.id); sertClientsResults([]); setSelectedClient(cr.id); }}
                                                        className="px-4 py-3 hover:bg-violet-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors"
                                                    >
                                                        <p className="font-medium text-slate-800">{cr.firstname} {cr.lastname}</p>
                                                        <p className="text-xs text-slate-500">{cr.email} • {cr.phone}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    {/* Champs auto-remplis */}
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">Nom</label>
                                        <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Nom du client" value={cFirstname} readOnly />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">Prénom</label>
                                        <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Prénom du client" value={cLastName} readOnly />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">Email</label>
                                        <input type="email" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Email du client" value={cEmail} readOnly />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">Téléphone</label>
                                        <input type="tel" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Téléphone du client" value={cPhone} readOnly />
                                    </div>
                                </div>
                            </div>

                            {/* 🔍 Section Service */}
                            <div className="space-y-3 pt-4 border-t border-slate-100">
                                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-2">
                                    <Scissors size={16} className="text-violet-600" /> Service
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Recherche + Autocomplete */}
                                    <div className="md:col-span-3 relative">
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">Rechercher un service</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-slate-50 focus:bg-white transition-all"
                                                placeholder="Taper le nom du service..."
                                                onChange={handleSearchService}
                                            />
                                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        </div>
                                        {servicesResults.length > 0 && (
                                            <ul className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                                {servicesResults.map((sr) => (
                                                    <li
                                                        key={sr.id}
                                                        onClick={() => { fetchServiceDetails(sr.id); setServicesResults([]); setSelectedService(sr.id); }}
                                                        className="px-4 py-3 hover:bg-violet-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors"
                                                    >
                                                        <p className="font-medium text-slate-800">{sr.name}</p>
                                                        <p className="text-xs text-slate-500">{sr.duration} min • {sr.price}$</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    {/* Champs auto-remplis */}
                                    <div className="md:col-span-3">
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">Nom du service</label>
                                        <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Nom du service" value={serviceName} readOnly />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">Prix ($)</label>
                                        <input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Prix" value={servicePrice} readOnly />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">Durée (min)</label>
                                        <input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Durée" value={serviceDuration} readOnly />
                                    </div>
                                </div>
                            </div>

                            {/* 🔍 Section Employé */}
                            <div className="space-y-3 pt-4 border-t border-slate-100">
                                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-2">
                                    <UserIcon size={16} className="text-violet-600" /> Employé
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Recherche + Autocomplete */}
                                    <div className="md:col-span-2 relative">
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">Rechercher un employé</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-slate-50 focus:bg-white transition-all"
                                                placeholder="Taper le nom ou email de l'employé..."
                                                onChange={handleSearchEmployee}
                                            />
                                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        </div>
                                        {employeesResults.length > 0 && (
                                            <ul className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                                {employeesResults.map((er) => (
                                                    <li
                                                        key={er.id}
                                                        onClick={() => { fetchEmployeeDetails(er.id); setEmployeesResults([]); setSelectedEmployee(er.id); }}
                                                        className="px-4 py-3 hover:bg-violet-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors"
                                                    >
                                                        <p className="font-medium text-slate-800">{er.firstname} {er.lastname}</p>
                                                        <p className="text-xs text-slate-500">{er.email} • {er.phone}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    {/* Champs auto-remplis */}
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">Nom</label>
                                        <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Nom de l'employé" value={eFirstname} readOnly />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">Prénom</label>
                                        <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Prénom de l'employé" value={eLastName} readOnly />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">Email</label>
                                        <input type="email" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Email de l'employé" value={eEmail} readOnly />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">Téléphone</label>
                                        <input type="tel" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Téléphone de l'employé" value={ePhone} readOnly />
                                    </div>
                                </div>
                            </div>

                            {/* 📅 Date & Heure */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                <div>
                                    <label className="text-xs font-medium text-slate-500 mb-1 block">Date du rendez-vous *</label>
                                    <input
                                        type="date"
                                        id="date"
                                        value={avDate}
                                        onChange={(e) => setAvDate(e.target.value)}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50 focus:bg-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500 mb-1 block">Heure *</label>
                                    <input
                                        type="time"
                                        id="time"
                                        value={avTime}
                                        onChange={(e) => setAvTime(e.target.value)}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50 focus:bg-white"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Bouton de soumission */}
                            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                                <button type="button" onClick={() => setAddVisiteModale(false)} className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-colors">
                                    Annuler
                                </button>
                                <button type="submit" className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-md hover:shadow-lg transition-all">
                                    ✅ Enregistrer le rendez-vous
                                </button>
                            </div>

                        </form>
                    </section>
                </div>
            )}
        </>
    )
}

export default SalonAppointment
