import type Employee from "./EmployeeInterface";

export default interface EmployeeSchedule {
    id: number;
    day: number;
    startTime: string;
    endTime: string;
    employeeId: number;
    employee?: Employee;
}