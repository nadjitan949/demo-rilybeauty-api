import type Appointment from "./AppointmentInterfaces";
import type EmployeeSchedule from "./EmployeeScheduleInterface";
import type Salon from "./SalonInterface";
import type Service from "./ServiceInterfaces";

export default interface Employee {
    id: number;
    firstname: string;
    lastname: string;
    phone?: string | null;
    email?: string | null;
    salonId: number;
    salon?: Salon;
    services?: Service[];
    appointments?: Appointment[];
    schedule?: EmployeeSchedule[] | null;
}