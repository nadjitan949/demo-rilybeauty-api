import type Appointment from "./AppointmentInterfaces";
import type Employee from "./EmployeeInterface";
import type Salon from "./SalonInterface";

export default interface Service {
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