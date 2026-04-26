import type Appointment from "./AppointmentInterfaces";
import type Refund from "./RefundInterface";

export default interface Payment {
    id: number;
    status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUND';
    provider: 'STRIPE' | 'PAYPAL' | 'CMI' | 'CASH';
    amount: number;
    currency: 'EUR' | 'USD' | 'MAD' | 'XOF' | 'XAF';
    appointmentId: number;
    appointment?: Appointment;
    refund?: Refund | null;
}