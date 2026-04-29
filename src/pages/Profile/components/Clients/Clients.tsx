import SalonList from "./components/SalonList";
import UserAppointment from "./components/UserAppointment";
import UsersProfile from "./components/UserProfile";

function Clients() {
    
    return (
        <>
        <main className="flex flex-col gap-10">
            <UsersProfile/>
            <SalonList/>
            <UserAppointment/>
        </main>
        </>
    );
}

export default Clients;