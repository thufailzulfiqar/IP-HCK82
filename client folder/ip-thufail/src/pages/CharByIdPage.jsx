    import { useEffect, useState } from "react";
    import { useNavigate, useParams, Link } from "react-router-dom";
    import { api } from "../components/UrlApi";
    import CharCard from "../components/CharCard";
    import Menu from "../components/Menu";
    import CharacterCardById from "../components/CharCardById";

    export default function CharByIdPage() {
    const access_token = localStorage.getItem("access_token");
    const [character, setCharacter] = useState(null);
    const params = useParams();
    const navigate = useNavigate();

    async function fetchCharacter(id) {
        try {
        const response = await api.get(`/characters/` + id, {
            headers: {
            Authorization: `Bearer ${access_token}`,
            },
        });
        setCharacter(response.data);
        } catch (error) {
        console.error("Error fetching character:", error);
        }
    }
    useEffect(() => {
        if (params.id) {
            fetchCharacter(params.id);
        }
    }, [params.id]);

    return (
        <div className="min-h-screen flex flex-col items-center py-10 bg-[url('/background.jpg')] bg-no-repeat bg-cover bg-center bg-fixed">
        <div className="w-full max-w-7xl px-4 mb-6">
            <Menu />
            {character && <CharacterCardById character={character} />}
        </div>
        </div>
    );
    }
