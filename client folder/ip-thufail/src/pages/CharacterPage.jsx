import { useEffect, useState } from 'react'
import { api } from "../components/UrlApi"
import { Link, NavLink, useNavigate } from 'react-router'
import CharCard from '../components/CharCard'
import Menu from '../components/Menu'

export default function CharacterPage() {
    const access_token = localStorage.getItem("access_token")
    const [characters, setCharacters] = useState([])

    useEffect(() => {
        async function fetchCharacters() {
            try {
                const response = await api.get("/characters", {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                })
                console.log(response.data.items)
                setCharacters(response.data.items)
            } catch (error) {
                console.error("Error fetching characters:", error)
            }
        }
        
        fetchCharacters()
    }, [])

    return (
        <div className="min-h-screen flex flex-col items-center py-10 bg-[url('background.jpg')] bg-no-repeat bg-cover bg-center bg-fixed">
     <div className="w-full max-w-7xl px-4 mb-6">
                <Menu />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {characters.map((character) => (
                    <CharCard key={character.id} character={character} />
                ))}
            </div>
        </div>
    )
}
