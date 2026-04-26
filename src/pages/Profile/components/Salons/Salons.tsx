import SalonAppointment from "./components/SalonAppointment"
import SalonEmployee from "./components/SalonEmployee"
import SalonProfil from "./components/SalonProfil"
import SalonServices from "./components/SalonServices"

function Salons() {
  return (
    <>
      <main className="flex flex-col gap-10">
        <SalonProfil />
        <SalonServices/>
        <SalonEmployee/>
        <SalonAppointment/>
      </main>
    </>
  )
}

export default Salons
