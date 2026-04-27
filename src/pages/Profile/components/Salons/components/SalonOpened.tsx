import type { AxiosError } from "axios"
import api from "../../../../../api/axios"
import type User from "../../../../../interfaces/UserInterface"
import { useEffect, useState } from "react"

const DAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]

// 🟣 Interface pour le formulaire d'ouverture
interface OpenedFormData {
  day: number;
  opened: string; // format "HH:mm"
  closed: string; // format "HH:mm"
}

function SalonOpened() {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | "">("")
  
  // 🟣 États pour le modal Add/Update
  const [openedModal, setOpenedModal] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [selectedOpenedId, setSelectedOpenedId] = useState<number | null>(null)
  
  // 🟣 États du formulaire
  const [formData, setFormData] = useState<OpenedFormData>({
    day: 1, // Lundi par défaut
    opened: "09:00",
    closed: "18:00"
  })

  // 🟣 Chargement du profil
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
          console.log("📩 Message backend :", customMessage);
          alert(customMessage);
        } else {
          setError('Impossible de joindre le serveur');
          alert('Impossible de joindre le serveur');
        }
      }
    }
    profile()
  }, [])

  // 🟣 Ouvrir le modal en mode "Ajout"
  const openAddModal = () => {
    setIsEditing(false)
    setSelectedOpenedId(null)
    setFormData({ day: 1, opened: "09:00", closed: "18:00" })
    setOpenedModal(true)
  }

  // 🟣 Ouvrir le modal en mode "Modification"
  const openEditModal = (id: number) => {
    const opened = user?.salon?.openeds?.find(o => o.id === id)
    if (!opened) return
    
    setIsEditing(true)
    setSelectedOpenedId(id)
    setFormData({
      day: opened.day,
      opened: formatTimeForInput(opened.opened),
      closed: formatTimeForInput(opened.closed)
    })
    setOpenedModal(true)
  }

  // 🟣 Helper: formater une date ISO en "HH:mm" pour les inputs time
  const formatTimeForInput = (isoString: string): string => {
    const date = new Date(isoString)
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  // 🟣 Helper: convertir "HH:mm" en date ISO pour l'API (en utilisant une date fictive)
  const formatTimeForApi = (time: string, baseDate?: Date): string => {
    const [hours, minutes] = time.split(':').map(Number)
    const date = baseDate || new Date()
    date.setHours(hours, minutes, 0, 0)
    return date.toISOString()
  }

  // 🟣 Gestion de la soumission (Add ou Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation basique
    if (formData.opened >= formData.closed) {
      setError("L'heure d'ouverture doit être avant l'heure de fermeture")
      return
    }

    try {
      const payload = {
        day: formData.day,
        opened: formatTimeForApi(formData.opened),
        closed: formatTimeForApi(formData.closed),
        salonId: user?.salon?.id
      }

      if (isEditing && selectedOpenedId) {
        // 🔹 UPDATE
        const res = await api.put(`opended/update/${selectedOpenedId}`, payload)
        alert(res.data.message)
      } else {
        // 🔹 ADD
        const res = await api.post("opended/add", payload)
        alert(res.data.message)
      }
      
      // Recharger le profil pour mettre à jour la liste
      const res = await api.get("/auth/profile")
      setUser(res.data.infos)
      
      // Fermer le modal
      setOpenedModal(false)
      
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      if (error.response) {
        const customMessage = error.response.data?.message || 'Erreur lors de l\'enregistrement';
        setError(customMessage);
        alert(customMessage);
      } else {
        setError('Impossible de joindre le serveur');
        alert('Impossible de joindre le serveur');
      }
    }
  }

  // 🟣 Supprimer un créneau
  const handleDeleteOpened = async (id: number) => {
    const isConfirm = confirm("Voulez-vous vraiment supprimer ce créneau d'ouverture ?")
    if (!isConfirm) return

    try {
      const res = await api.delete(`opended/delete/${id}`)
      alert(res.data.message)
      
      // Recharger le profil pour mettre à jour la liste
      const resProfile = await api.get("/auth/profile")
      setUser(resProfile.data.infos)
      
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      if (error.response) {
        const customMessage = error.response.data?.message || 'Erreur lors de la suppression';
        setError(customMessage);
        alert(customMessage);
      } else {
        setError('Impossible de joindre le serveur');
        alert('Impossible de joindre le serveur');
      }
    }
  }

  // 🟣 Gestionnaire de changement pour les inputs du formulaire
  const handleInputChange = (field: keyof OpenedFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <>
      <section className="p-6 max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border-b border-slate-100 bg-linear-to-r from-violet-50/50 to-white">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            📅 Jours ouvrables
            <span className="ml-2 px-2.5 py-0.5 bg-violet-100 text-violet-800 text-xs font-semibold rounded-full">
              {user?.salon?.openeds?.length || 0} horaire{user?.salon?.openeds?.length === 1 ? '' : 's'}
            </span>
          </h1>
          <button type="button" onClick={openAddModal} className="mt-3 sm:mt-0 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all text-sm flex items-center gap-2">
            ➕ Ajouter un créneau
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {user?.salon?.openeds && user?.salon?.openeds?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {user?.salon?.openeds?.map((o) => (
                <div key={o.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-violet-200 transition-all flex flex-col">
                  {/* Header Carte */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-800 text-lg">{DAYS[o.day]}</h3>
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Ouvert</span>
                  </div>

                  {/* Horaires */}
                  <div className="space-y-2 text-sm text-slate-600 flex-1">
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100">
                      <span className="flex items-center gap-2">🌅 Ouverture</span>
                      <span className="font-semibold text-slate-800">{new Date(o.opened).getHours().toString().padStart(2, '0')}:{new Date(o.opened).getMinutes().toString().padStart(2, '0')}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100">
                      <span className="flex items-center gap-2">🌇 Fermeture</span>
                      <span className="font-semibold text-slate-800">{new Date(o.closed).getHours().toString().padStart(2, '0')}:{new Date(o.closed).getMinutes().toString().padStart(2, '0')}</span>
                    </div>
                  </div>

                  {/* 🟣 Boutons d'action */}
                  <div className="flex gap-2 pt-3 mt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => openEditModal(o.id)}
                      className="flex-1 py-2 px-3 text-xs font-medium rounded-lg border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors flex items-center justify-center gap-1"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteOpened(o.id)}
                      className="flex-1 py-2 px-3 text-xs font-medium rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50/50 rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500 font-medium">Aucun horaire configuré pour le moment.</p>
              <p className="text-sm text-slate-400 mt-1">Définissez vos jours et heures d'ouverture ci-dessus.</p>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-5 mb-5 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm font-medium flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}
      </section>

      {/* 🟣 Modal Add/Update */}
      {openedModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <section className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-linear-to-r from-violet-50 to-white">
              <h2 className="text-lg font-bold text-slate-800">
                {isEditing ? "✏️ Modifier le créneau" : "➕ Ajouter un créneau"}
              </h2>
              <button onClick={() => setOpenedModal(false)} type="button" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 hover:text-red-500 transition-colors">✕</button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              
              {/* Jour */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 block">Jour de la semaine</label>
                <select 
                  value={formData.day} 
                  onChange={(e) => handleInputChange('day', Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50 focus:bg-white transition-all"
                  required
                >
                  {DAYS.map((day, index) => (
                    <option key={index} value={index}>{day}</option>
                  ))}
                </select>
              </div>

              {/* Horaires */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 block">Heure d'ouverture</label>
                  <input 
                    type="time" 
                    value={formData.opened} 
                    onChange={(e) => handleInputChange('opened', e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50 focus:bg-white transition-all"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 block">Heure de fermeture</label>
                  <input 
                    type="time" 
                    value={formData.closed} 
                    onChange={(e) => handleInputChange('closed', e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50 focus:bg-white transition-all"
                    required 
                  />
                </div>
              </div>

              {/* Info validation */}
              <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
                💡 L'heure d'ouverture doit être avant l'heure de fermeture.
              </p>

              {/* Boutons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setOpenedModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-colors">
                  Annuler
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-md hover:shadow-lg transition-all">
                  {isEditing ? "✅ Mettre à jour" : "✅ Enregistrer"}
                </button>
              </div>

            </form>
          </section>
        </div>
      )}
    </>
  )
}

export default SalonOpened