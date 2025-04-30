import { useEffect, useState } from 'react'
import { api } from "../components/UrlApi"
import CharCard from '../components/CharCard'
import Menu from '../components/Menu'

export default function CharacterPage() {
    const access_token = localStorage.getItem("access_token")
    const [characters, setCharacters] = useState([])
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoadDone, setInitialLoadDone] = useState(false);
    const [loadedPage, setLoadedPage] = useState(1); // Track the loaded page

    useEffect(() => {
        // Hanya fetch saat pertama kali mount (page 1)
        if (page === 1) {
            fetchCharacters(page, true);
        } else {
            fetchCharacters(page);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);
    
    useEffect(() => {
        function handleScroll() {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
                !isLoading && hasMore && initialLoadDone
            ) {
                setPage(prev => prev + 1);
            }
        }
    
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading, hasMore, initialLoadDone]);
    
    async function fetchCharacters(page, isInitial = false) {
        setIsLoading(true);
        try {
            const response = await api.get(`/characters?page=${page}&limit=5`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
    
            const newCharacters = response.data.items;
            setCharacters(prev => {
                const existingIds = new Set(prev.map(c => c.id));
                const filteredNew = newCharacters.filter(c => !existingIds.has(c.id));
                return [...prev, ...filteredNew];
            });
    
            const meta = response.data.meta;
            setHasMore(meta.currentPage < meta.totalPages);
            if (isInitial) setInitialLoadDone(true); // trigger scroll listener only after page 1 is fully loaded
        } catch (error) {
            console.error("Error fetching characters:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center py-10 bg-[url('background.jpg')] bg-no-repeat bg-cover bg-center bg-fixed">
            <div className="w-full max-w-7xl px-4 mb-6">
                <Menu />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {characters.map((character, index) => (
                    <CharCard key={character.id} character={character} style={{
                        opacity: 0,
                        animation: `fadeIn 1s ease-in-out ${index + (loadedPage - 1) * 5 * 0.2}s forwards`,
                    }}/>
                ))}
            </div>
            {isLoading && <p className="text-white mt-4">Loading more characters...</p>}
            {!hasMore && <p className="text-gray-400 mt-4">No more characters to load.</p>}
        </div>
    );
}
