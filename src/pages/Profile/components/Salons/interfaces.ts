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
    user?: User;
    openeds?: Opened[];
    employees?: Employee[];
    services?: Service[];
    appointments?: Appointment[];
    commission?: Commission | null;
    clentTag?: ClientSalon[];
}

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
    schedule?: EmployeeSchedule[] | null;
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

interface Commission {
    id: number;
    rate: number;
    salonId: number;
    salon?: Salon;
}

interface EmployeeSchedule {
    id: number;
    day: number;
    startTime: string;
    endTime: string;
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

