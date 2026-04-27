import { useEffect, useState } from "react"
import api from "../../../../../api/axios"
import type User from "../../../../../interfaces/UserInterface"
import type { AxiosError } from "axios"
import { Download, DollarSign, AlertCircle, TrendingUp, Calendar } from "lucide-react"

// 🟣 Interface pour les données de reporting (matching ton backend)
interface SalonReporting {
  totalAppointments: number;
  totalRevenue: number;
  noShowCount: number;
  topServices: { serviceId: number; count: number }[];
  csvContent: string;
}

function ReportingSalon() {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | "">("")
  const [reporting, setReporting] = useState<SalonReporting | null>(null)
  const [serviceNames, setServiceNames] = useState<Record<number, string>>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // 🟣 Chargement du profil utilisateur
  useEffect(() => {
    const profile = async () => {
      try {
        const res = await api.get("/auth/profile")
        const user: User = res.data.infos
        setUser(user)
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
      }
    }
    profile()
  }, [])

  // 🟣 Chargement des données de reporting
  const fetchReporting = async () => {
    if (!user?.salon?.id) return
    
    setIsLoading(true)
    setError("")
    
    try {
      const res = await api.get<SalonReporting>(`/reporting/salon`)
      setReporting(res.data)
      
      // 🟣 Récupérer les noms des services pour l'affichage
      if (res.data.topServices?.length > 0 && user?.salon?.services) {
        const names: Record<number, string> = {}
        user.salon.services.forEach(s => { names[s.id] = s.name })
        setServiceNames(names)
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      if (error.response) {
        const customMessage = error.response.data?.message || 'Erreur lors du chargement du reporting';
        setError(customMessage);
        alert(customMessage);
      } else {
        setError('Impossible de joindre le serveur');
        alert('Impossible de joindre le serveur');
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 🟣 Télécharger le CSV
  const downloadCSV = () => {
    if (!reporting?.csvContent) return
    
    const blob = new Blob([reporting.csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `reporting-salon-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // 🟣 Formatage du montant en devise
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
  }

  return (
    <>
      <section className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* 🟣 Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              📊 Reporting du salon
              <span className="text-sm font-normal text-slate-500">• {user?.salon?.name}</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">Analysez vos performances et téléchargez vos données</p>
          </div>
          <button 
            onClick={fetchReporting} 
            disabled={isLoading}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all text-sm flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Chargement...
              </>
            ) : (
              <>🔄 Actualiser les données</>
            )}
          </button>
        </div>

        {/* 🟣 Cartes de statistiques */}
        {reporting && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total RDV */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                  <Calendar className="text-violet-600" size={20} />
                </div>
                <span className="text-xs font-medium text-slate-500 uppercase">Total</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{reporting.totalAppointments}</p>
              <p className="text-sm text-slate-500 mt-1">Rendez-vous effectués</p>
            </div>

            {/* Revenus */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <DollarSign className="text-green-600" size={20} />
                </div>
                <span className="text-xs font-medium text-slate-500 uppercase">Revenus</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{formatCurrency(reporting.totalRevenue)}</p>
              <p className="text-sm text-slate-500 mt-1">Paiements confirmés</p>
            </div>

            {/* No-Show */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="text-amber-600" size={20} />
                </div>
                <span className="text-xs font-medium text-slate-500 uppercase">Absences</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{reporting.noShowCount}</p>
              <p className="text-sm text-slate-500 mt-1">Clients non présents</p>
            </div>
          </div>
        )}

        {/* 🟣 Top Services */}
        {reporting?.topServices && reporting.topServices.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-linear-to-r from-violet-50/50 to-white">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="text-violet-600" size={20} />
                Top 5 des services les plus demandés
              </h2>
            </div>
            <div className="p-5">
              <div className="space-y-3">
                {reporting.topServices.map((item, index) => (
                  <div key={item.serviceId} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-violet-200 transition-all">
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-amber-100 text-amber-700' :
                        index === 1 ? 'bg-slate-200 text-slate-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-violet-100 text-violet-700'
                      }`}>
                        #{index + 1}
                      </span>
                      <span className="font-medium text-slate-800">
                        {serviceNames[item.serviceId] || `Service #${item.serviceId}`}
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-violet-100 text-violet-800 text-sm font-semibold rounded-full">
                      {item.count} réservation{item.count > 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 🟣 Bouton Download CSV */}
        {reporting?.csvContent && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <Download className="text-slate-600" size={24} />
              </div>
              <div>
                <p className="font-medium text-slate-800">Exporter les données</p>
                <p className="text-sm text-slate-500">Téléchargez un fichier CSV avec l'historique complet</p>
              </div>
            </div>
            <button 
              onClick={downloadCSV}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              <Download size={18} />
              Télécharger le CSV
            </button>
          </div>
        )}

        {/* 🟣 État vide */}
        {!reporting && !isLoading && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="text-slate-400" size={32} />
            </div>
            <p className="text-slate-500 font-medium">Aucune donnée de reporting disponible</p>
            <p className="text-sm text-slate-400 mt-1 mb-4">Cliquez sur "Actualiser" pour charger vos statistiques</p>
            <button 
              onClick={fetchReporting}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-all text-sm"
            >
              Charger les données
            </button>
          </div>
        )}

        {/* 🟣 Message d'erreur */}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm font-medium flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

      </section>
    </>
  )
}

export default ReportingSalon