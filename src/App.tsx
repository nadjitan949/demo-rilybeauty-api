import { Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import Login from "./pages/Login/Login"

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/projects" />
      </Routes>
    </>
  )
}

export default App
