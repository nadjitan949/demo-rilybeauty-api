import ReportingSalon from "./components/ReportingSalon"
import SalonAppointment from "./components/SalonAppointment"
import SalonEmployee from "./components/SalonEmployee"
import SalonOpened from "./components/SalonOpened"
import SalonProfil from "./components/SalonProfil"
import SalonServices from "./components/SalonServices"

function Salons() {
  return (
    <>
      <main className="flex flex-col gap-10">
        <SalonProfil />
        <ReportingSalon/>
        <SalonServices/>
        <SalonEmployee/>
        <SalonAppointment/>
        <SalonOpened/>
      </main>
    </>
  )
}

export default Salons
