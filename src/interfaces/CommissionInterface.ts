import type Salon from "./SalonInterface";

export default interface Commission {
    id: number;
    rate: number;
    salonId: number;
    salon?: Salon;
}