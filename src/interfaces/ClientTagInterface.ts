import type Salon from "./SalonInterface";
import type User from "./UserInterface";

export default interface ClientSalon {
    id: number;
    tag: 'VIP' | 'NEW';
    salonId: number;
    userId: number;
    salon?: Salon;
    user?: User;
}