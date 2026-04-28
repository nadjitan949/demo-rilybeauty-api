import SalonList from "./components/SalonList";
import UsersProfile from "./components/UserProfile";

function Clients() {
    
    return (
        <>
        <main className="flex flex-col gap-10">
            <UsersProfile/>
            <SalonList/>
        </main>
        </>
    );
}

export default Clients;