import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// Am păstrat iconițele, dar le vom folosi într-un mod complet diferit
import { BookmarkIcon, BookOpenIcon, UserIcon, ArrowRightOnRectangleIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import AuthContext from '../../context/authContext';
import Navbar from '../components/NavBar';
import Loading from '../components/Loading';
import { getCitatesiCartiSalvate } from "../../utils/api/userApi";
import { getCitateByUserId } from '../../utils/api/citate';
import { getAutorById } from '../../utils/api/autorApi';

const ITEMS_PER_PAGE = 10;

// --- O nouă componentă pentru un aspect mai curat ---
const PageButton = ({ onClick, disabled, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="px-4 py-2 bg-stone-200/50 border border-stone-300/70 rounded-md text-stone-600 hover:bg-stone-200/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
        {children}
    </button>
);


export default function UserPage() {
    // --- Toată logica de state și fetch rămâne neschimbată, pentru că funcționează ---
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('citate');
    const [savedCitate, setSavedCitate] = useState([]);
    const [savedCarti, setSavedCarti] = useState([]);
    const [userCitate, setUserCitate] = useState([]);
    const [autoriMap, setAutoriMap] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        localStorage.removeItem('user-data');
        logout();
        navigate('/login', { replace: true });
    };

    const fetchCitatebyUserId = async (userId) => {
        try {
            const response = await getCitateByUserId(userId);
            const quotesArray = Array.isArray(response.data) ? response.data : [];
            setUserCitate(quotesArray);
            return quotesArray;
        } catch (error) {
            console.error("Eroare la încărcarea citatelor utilizatorului:", error);
            setUserCitate([]);
            return [];
        }
    };

    const fetchSavedData = async (userId) => {
        try {
            const data = await getCitatesiCartiSalvate(userId);
            setSavedCitate(data.quotes || []);
            setSavedCarti(data.carti || []);
            if (data.carti?.length > 0) {
                const autorIds = data.carti.map(carte => carte.Autor).filter(id => id);
                const uniqueAutorIds = [...new Set(autorIds)];
                const autoriDataArr = await Promise.all(uniqueAutorIds.map(id => getAutorById(id)));
                const autoriMapObj = {};
                uniqueAutorIds.forEach((id, i) => {
                    autoriMapObj[id] = autoriDataArr[i];
                });
                setAutoriMap(autoriMapObj);
            }
        } catch (error) {
            console.error("Eroare la încărcarea datelor salvate:", error);
        }
    };

    useEffect(() => {
        const loadUserData = async () => {
            const storedUser = localStorage.getItem('user-data');
            if (!storedUser) {
                navigate('/login');
                return;
            }
            try {
                const parsed = JSON.parse(storedUser);
                if (!parsed?.user) throw new Error("Date utilizator invalide");
                setUser(parsed.user);
                await Promise.all([
                    fetchSavedData(parsed.user._id),
                    fetchCitatebyUserId(parsed.user._id)
                ]);
            } catch (err) {
                console.error("Eroare la parse user:", err);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        loadUserData();
    }, [navigate]);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    const paginate = (items) => {
        const safeItems = Array.isArray(items) ? items : [];
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return safeItems.slice(start, start + ITEMS_PER_PAGE);
    };

    const totalPages = () => {
        const items = {
            'citate': savedCitate,
            'carti': savedCarti,
            'citate-mele': userCitate
        }[activeTab] || [];
        return Math.ceil((Array.isArray(items) ? items.length : 0) / ITEMS_PER_PAGE);
    };

    const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages()));
    
    // --- Ecranul de încărcare și eroare, adaptate la noul stil ---
    if (loading) return <div className="bg-[#FBF8F2] min-h-screen"><Loading /></div>;
    if (!user) return <div className="min-h-screen bg-[#FBF8F2] flex items-center justify-center p-4">Utilizator neconectat.</div>;

    return (
        // --- NOU: Fundal de hârtie veche și font serif pentru tot corpul paginii ---
        <div className="min-h-screen bg-[#FBF8F2] font-serif text-stone-800">
            {/* Navbar-ul este păstrat pentru funcționalitate */}
            <Navbar />
            
            <div className="max-w-6xl mx-auto px-4 py-8">
                
                {/* --- NOU: Secțiunea de profil "Pagină de Manuscris" --- */}
                <div className="bg-white/50 border-2 border-dashed border-stone-300 rounded-lg p-8 mb-12 relative">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar ca fotografie veche */}
                        <div className="w-32 h-32 rounded-md bg-stone-200 p-2 border border-stone-300 shadow-[8px_8px_0px_#d6d3d1]">
                            {user.imagine ? (
                                <img src={user.imagine} alt="User Avatar" className="w-full h-full object-cover rounded-sm" />
                            ) : (
                                <div className="w-full h-full bg-stone-300 flex items-center justify-center">
                                    <span className="text-5xl font-bold text-white">{user.prenume?.[0] || 'U'}</span>
                                </div>
                            )}
                        </div>
                        {/* Informații stil caligrafic */}
                        <div className="flex-1 text-center md:text-left">
                            <p className="text-stone-500 text-lg" style={{ fontFamily: '"Dancing Script", cursive' }}>Profil de autor</p>
                            <h1 className="text-5xl font-bold text-stone-900 mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>
                                {user.prenume || 'Utilizator'} {user.nume}
                            </h1>
                            <div className="flex items-center justify-center md:justify-start gap-6 text-stone-600 mt-4">
                                <span><strong className="text-stone-800">{Array.isArray(savedCitate) ? savedCitate.length : 0}</strong> Citate Notate</span>
                                <span><strong className="text-stone-800">{Array.isArray(savedCarti) ? savedCarti.length : 0}</strong> Cărți în Bibliotecă</span>
                                <span><strong className="text-stone-800">{Array.isArray(userCitate) ? userCitate.length : 0}</strong> Gânduri Proprii</span>
                            </div>
                        </div>
                        {/* Buton de logout stil "ștampilă" */}
                        <button onClick={handleLogout} className="absolute top-4 right-4 px-4 py-2 bg-red-100/50 border border-red-300/50 text-red-700 rounded-md hover:bg-red-100 transition-all text-sm font-semibold">
                            Deconectare
                        </button>
                    </div>
                </div>

                {/* --- NOU: Tab-uri stil "Registru de Bibliotecă" --- */}
                <div className="flex border-b-2 border-stone-300 mb-8">
                    {[
                        { key: 'citate', label: 'Citate Salvate', icon: BookmarkIcon },
                        { key: 'carti', label: 'Biblioteca Mea', icon: BookOpenIcon },
                        { key: 'citate-mele', label: 'Jurnal Personal', icon: PencilSquareIcon }
                    ].map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`px-6 py-3 text-lg font-semibold transition-all duration-300 border-b-4 ${
                                activeTab === key
                                ? 'border-stone-800 text-stone-900'
                                : 'border-transparent text-stone-500 hover:text-stone-800'
                            }`}
                        >
                            <Icon className={`w-5 h-5 inline-block mr-2 ${activeTab === key ? 'text-stone-800' : 'text-stone-500'}`} />
                            {label}
                        </button>
                    ))}
                </div>

                {/* --- NOU: Conținut stilizat pentru fiecare tab --- */}
                <div className="min-h-[400px]">
                    {/* Citatele ca notițe în jurnal */}
                    {activeTab === 'citate' && (
                        <div className="space-y-6">
                            {paginate(savedCitate).length > 0 ? paginate(savedCitate).map((citat, index) => (
                                <div key={index} className="bg-[#FFFDF9] border border-stone-200 p-6 rounded-md shadow-sm">
                                    <blockquote className="text-xl text-stone-800 leading-relaxed border-l-4 border-stone-300 pl-4">
                                        "{citat.text}"
                                    </blockquote>
                                    {citat.autor && <cite className="block text-right mt-4 text-md text-stone-600 not-italic" style={{ fontFamily: '"Dancing Script", cursive' }}>— {citat.autor}</cite>}
                                </div>
                            )) : <p className="text-center text-stone-500 py-16">Niciun citat salvat.</p>}
                        </div>
                    )}
                    {/* Cărțile ca fișe de bibliotecă */}
                    {activeTab === 'carti' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {paginate(savedCarti).length > 0 ? paginate(savedCarti).map((carte, index) => {
                                const autorData = autoriMap[carte.Autor];
                                return (
                                    <div key={index} className="bg-[#FFFDF9] border border-stone-200 rounded-lg overflow-hidden shadow-sm flex flex-col">
                                        <div className="h-48 overflow-hidden"><img src={carte.coperta} alt={carte.Titlu} className="w-full h-full object-cover" /></div>
                                        <div className="p-6 flex-grow flex flex-col justify-between">
                                            <div>
                                                <h2 className="text-2xl font-bold text-stone-900 mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>{carte.Titlu}</h2>
                                                {autorData && <p className="text-md text-stone-600 mb-4">de {autorData.prenume} {autorData.nume}</p>}
                                            </div>
                                            <p className="text-stone-700 text-sm line-clamp-3 leading-relaxed">{carte.Descriere}</p>
                                        </div>
                                    </div>
                                );
                            }) : <p className="col-span-full text-center text-stone-500 py-16">Nicio carte în bibliotecă.</p>}
                        </div>
                    )}
                    {/* Citatele tale ca pagini de jurnal */}
                    {activeTab === 'citate-mele' && (
                        <div className="space-y-6">
                            {paginate(userCitate).length > 0 ? paginate(userCitate).map((citat, index) => (
                                <div key={index} className="bg-blue-50/50 border border-blue-200 p-6 rounded-md shadow-sm">
                                    <blockquote className="text-xl text-stone-800 leading-relaxed border-l-4 border-blue-300 pl-4">"{citat.text}"</blockquote>
                                    {citat.autor && <cite className="block text-right mt-4 text-md text-stone-600 not-italic" style={{ fontFamily: '"Dancing Script", cursive' }}>— {citat.autor}</cite>}
                                </div>
                            )) : <p className="text-center text-stone-500 py-16">Niciun gând adăugat în jurnal.</p>}
                        </div>
                    )}
                </div>

                {/* --- NOU: Paginare simplă și elegantă --- */}
                {totalPages() > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-12 text-stone-700">
                        <PageButton onClick={handlePrevPage} disabled={currentPage === 1}>Anterior</PageButton>
                        <span>Pagina {currentPage} din {totalPages()}</span>
                        <PageButton onClick={handleNextPage} disabled={currentPage === totalPages()}>Următor</PageButton>
                    </div>
                )}
            </div>
        </div>
    );
}