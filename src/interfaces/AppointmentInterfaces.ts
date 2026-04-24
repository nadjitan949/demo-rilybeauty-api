import type Employee from "./EmployeeInterface";
import type Payment from "./PaymentInterface";
import type Salon from "./SalonInterface";
import type Service from "./ServiceInterfaces";
import type User from "./UserInterface";

export default interface Appointment {
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
    salon?: Salon;
    user?: User;
    employee?: Employee;
    service?: Service;
    payment?: Payment | null;
}