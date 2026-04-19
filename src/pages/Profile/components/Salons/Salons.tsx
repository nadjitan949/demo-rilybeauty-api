import type { AxiosError } from "axios";
import { useEffect, useState } from "react"
import api from "../../../../api/axios";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

// --- INTERFACES PRINCIPALES ---

interface User {
  id: number;
  firstname?: string | null;
  lastname?: string | null;
  phone?: string | null;
  email?: string | null;
  role: 'CLIENT' | 'SALON' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
  // Relations
  salon?: Salon | null;
  appointments?: Appointment[];
  tags?: ClientSalon[];
}

interface Salon {
  id: number;
  name?: string | null;
  country?: string | null;
  city?: string | null;
  address?: string | null;
  status: 'PENDING' | 'ACTIVE' | 'BANNED';
  userId: number;
  createdAt: string;
  updatedAt: string;
  // Relations
  user?: User;
  openeds?: Opened[];
  employees?: Employee[];
  services?: Service[];
  appointments?: Appointment[];
  commission?: Commission | null;
  clentTag?: ClientSalon[];
}

// --- TABLES LIÉES AU SALON ---

interface Opened {
  id: number;
  day: number;
  opened: string;
  closed: string;
  salonId: number;
  salon?: Salon;
}

interface Employee {
  id: number;
  firstname: string;
  lastname: string;
  phone?: string | null;
  email?: string | null;
  salonId: number;
  salon?: Salon;
  services?: Service[];
  appointments?: Appointment[];
  schedule?: EmployeeSchedule[];
}

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  description: string;
  salonId: number;
  salons?: Salon;
  employees?: Employee[];
  appointments?: Appointment[];
}

// --- GESTION DES RENDEZ-VOUS ET PAIEMENTS ---

interface Appointment {
  id: number;
  reference?: string | null;
  date: string;
  endTime?: string;
  price: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  note?: string | null;
  salonId: number;
  userId: number;
  employeeId: number;
  serviceId: number;
  // Relations
  salon?: Salon;
  user?: User;
  employee?: Employee;
  service?: Service;
  payment?: Payment | null;
}

interface Payment {
  id: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUND';
  provider: 'STRIPE' | 'PAYPAL' | 'CMI';
  amount: number;
  currency: 'EUR' | 'USD' | 'MAD' | 'XOF' | 'XAF';
  appointmentId: number;
  appointment?: Appointment;
  refund?: Refund | null;
}

interface Refund {
  id: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  provider: 'STRIPE' | 'PAYPAL' | 'CMI';
  amount: number;
  currency: 'EUR' | 'USD' | 'MAD' | 'XOF' | 'XAF';
  paymentId: number;
  payment?: Payment;
}

// --- CONFIGURATION ET FIDÉLITÉ ---

interface Commission {
  id: number;
  rate: number;
  salonId: number;
  salon?: Salon;
}

interface EmployeeSchedule {
  id: number;
  day: number;
  startTime: Date;
  endTime: Date;
  employeeId: number;
  employee?: Employee;
}

interface ClientSalon {
  id: number;
  tag: 'VIP' | 'NEW';
  salonId: number;
  userId: number;
  salon?: Salon;
  user?: User;
}

function Salons() {

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetcheSalonData = async () => {
      try {

        const res = await api.get("auth/profile")

        const user: User = res.data.infos

        setUser(user)

      } catch (err) {
        const error = err as AxiosError<{ message: string }>;

        if (error.response) {
          console.log("Erreur ", error)
        } else {
          console.log("Erreur ", error)
        }
      }
    }

    fetcheSalonData()
  }, [])

  return (
    <>
      <section className="space-y-2 p-20">
        <div className="border p-5">
          <span>{user?.firstname}</span>
          <span>{user?.lastname}</span>
        </div>

        <div className="border p-5">
          <span className=" font-bold ">Info Salons</span><br />

          <div className="flex flex-col">
            <span> {user?.salon?.id} </span>
            <span> {user?.salon?.name} </span>
            <span> {user?.salon?.address} </span>
            <span> {user?.salon?.city} </span>
            <span> {user?.salon?.country} </span>
            <span> {user?.salon?.status} </span>
            <span> {user?.salon?.createdAt} </span>
          </div>
        </div>

        <div className="border p-5">
          <span className=" font-bold ">Services</span><br />

          {user?.salon?.services?.map((s) => (
            <div key={s.id} className="flex flex-col border my-4 p-2">
                <div> {s.name} </div>
                <div> {s.price} </div>
                <div> {s.description} </div>
                <div> {s.duration}min </div>
            </div>
          ))}
        </div>

        <div className="border p-5">
          <span className=" font-bold ">Employée</span><br />

          {user?.salon?.employees?.map((e) => (
            <div key={e.id} className="flex flex-col">
              {e.firstname} {e.lastname} - service: {e.services?.length} {
                e.services?.map((s) => (
                  <div key={s.id}> {s.name} </div>
                ))
              }
            </div>
          ))}
        </div>

        <div className="border p-5">
          <span className=" font-bold ">Services</span><br />

          {user?.salon?.appointments?.map((a) => (
            <div key={a.id} className="flex flex-col border my-4 p-2">
                <div> {a.date} </div>
                <div> {a.reference} </div>
                <div> {a.employee?.firstname} {a.employee?.lastname} </div>
                <div> {a.endTime} </div>
                <div> {a.price} </div>
                <div> {a.note} </div>
                <div> {a.status} </div>
                <div> {a.payment?.status ?? "Pas de paiement pour l'instant"} </div>
                <div> {a.payment?.status === 'REFUND' ? "Paiement rembousé" : "Encaissé"} </div>
                <div> {a.user?.firstname} {a.user?.lastname} {a.user?.email} </div>
            </div>
          ))}
        </div>

        <div className="border p-5">
          <span className=" font-bold ">Horaires</span><br />

          {user?.salon?.openeds?.map((o) => (
            <div key={o.id} className="flex flex-col border my-4 p-2">
                <div> {DAYS[o.day]} </div>
                <div>Ouverture: {new Date(o.opened).getHours().toString().padStart(2, '0') }:{new Date(o.opened).getMinutes().toString().padStart(2, '0') } </div>
                <div>Fermeture: {new Date(o.closed).getHours().toString().padStart(2, '0') }:{new Date(o.closed).getMinutes().toString().padStart(2, '0') } </div>
            </div>
          ))}
        </div>

      </section>
    </>
  )
}

export default Salons
