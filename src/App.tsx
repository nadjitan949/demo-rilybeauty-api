import { Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import Profile from "./pages/Profile/Profile"
import SalonList from "./pages/Salon/Salon"
import Users from "./pages/users/Users"

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/salons" element={<SalonList/>} />
        <Route path="/users" element={<Users/>} />
      </Routes>
    </>
  )
}

export default App
