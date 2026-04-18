import { Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
      </Routes>
    </>
  )
}

export default App
