import { useNavigate } from "react-router-dom"

interface Link {
    name: string
    url: string
}

function Header() {

    const navigate = useNavigate()

    const logout = () => {
        navigate("/")
    }

    const urls: Link[] = [
        {
            name: "Profile",
            url: "/profile"
        },
        {
            name: "Salons",
            url: "/salons"
        }
    ]

    return (
        <>
            <header className=" w-full h-20 flex items-center px-10 justify-between shadow-xl">
                <nav>
                    <ul className="flex gap-10">
                        {urls.map((u, index) => (
                            <li key={index}><button onClick={() => navigate(u.url)} className=" cursor-pointer">{u.name}</button></li>
                        ))}
                    </ul>
                </nav>

                <button onClick={logout} className=" px-5 py-2 rounded-[5px] text-white bg-red-500 cursor-pointer hover:bg-red-300">
                    Deconnexion
                </button>
            </header>
        </>
    )
}

export default Header
