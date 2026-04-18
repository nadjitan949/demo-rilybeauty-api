import { Route, Routes } from "react-router-dom"
import Header from "./components/Header"

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" />
        <Route path="/projects" />
      </Routes>
    </>
  )
}

export default App
