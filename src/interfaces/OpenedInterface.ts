import type Salon from "./SalonInterface";

export default interface Opened {
    id: number;
    day: number;
    opened: string;
    closed: string;
    salonId: number;
    salon?: Salon;
}