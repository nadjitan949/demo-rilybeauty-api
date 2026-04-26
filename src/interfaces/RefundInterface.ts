import type Payment from "./PaymentInterface";

export default interface Refund {
    id: number;
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    provider: 'STRIPE' | 'PAYPAL' | 'CMI' | 'CASH';
    amount: number;
    currency: 'EUR' | 'USD' | 'MAD' | 'XOF' | 'XAF';
    paymentId: number;
    payment?: Payment;
}