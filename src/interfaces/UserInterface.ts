import type Appointment from "./AppointmentInterfaces";
import type ClientSalon from "./ClientTagInterface";
import type Salon from "./SalonInterface";

export default interface User {
    id: number;
    firstname?: string | null;
    lastname?: string | null;
    phone?: string | null;
    email?: string | null;
    role: 'CLIENT' | 'SALON' | 'ADMIN';
    createdAt: string;
    updatedAt: string;
    salon?: Salon | null;
    appointments?: Appointment[];
    tags?: ClientSalon[];
}

