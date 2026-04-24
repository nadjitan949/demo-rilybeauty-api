import type Appointment from "./AppointmentInterfaces";
import type ClientSalon from "./ClientTagInterface";
import type Commission from "./CommissionInterface";
import type Employee from "./EmployeeInterface";
import type Opened from "./OpenedInterface";
import type Service from "./ServiceInterfaces";
import type User from "./UserInterface";

export default interface Salon {
    id: number;
    name?: string | null;
    country?: string | null;
    city?: string | null;
    address?: string | null;
    status: 'PENDING' | 'ACTIVE' | 'BANNED';
    userId: number;
    createdAt: string;
    updatedAt: string;
    user?: User;
    openeds?: Opened[];
    employees?: Employee[];
    services?: Service[];
    appointments?: Appointment[];
    commission?: Commission | null;
    clentTag?: ClientSalon[];
}