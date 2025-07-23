import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';
import { getAllCitate, saveCitat } from '../../../utils/api/citate';
import { getCarteById } from '../../../utils/api/cartiApi';
import { useAuth } from '../../../context/authContext';

// --- Iconițe SVG pentru lizibilitate în JSX ---
const BookmarkIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);
const SpinnerIcon = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;
const CheckIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);
const BookIcon = () => (
    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);


export default function ForYouPage() {
    const { user, loading: authLoading } = useAuth();
    const [citate, setCitate] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Stare pentru a gestiona statusul de salvare pentru fiecare citat individual
    const [saveStatuses, setSaveStatuses] = useState({});

    useEffect(() => {
        if (authLoading || !user) return;

        const fetchCitateForUser = async () => {
            try {
                const authUser = user.user ?? user;
                const preferinteGen = new Set(
                    (Array.isArray(authUser.preferinteGen) ? authUser.preferinteGen : [authUser.preferinteGen])
                    .map(g => g.toLowerCase())
                );
                
                const { data: allCitate } = await getAllCitate();
                const rawCitate = Array.isArray(allCitate) ? allCitate : [];

                /* ⚠️ AVERTISMENT DE PERFORMANȚĂ: 
                Codul de mai jos (Promise.all cu .map) face un apel API separat pentru FIECARE citat.
                Acest lucru este foarte ineficient (problemă N+1) și va încetini aplicația pe măsură ce datele cresc.
                Soluția corectă este modificarea backend-ului pentru a returna cărțile împreună cu citatele
                sau pentru a permite preluarea mai multor cărți într-un singur apel (ex: /api/carti?ids=1,2,3).
                Păstrez logica actuală conform cerinței.
                */
                const filteredAndPopulated = await Promise.all(
                    rawCitate.map(async c => {
                        const quoteGenres = c.genul.toLowerCase().split(',').map(g => g.trim());
                        const hasMatchingGenre = quoteGenres.some(g => preferinteGen.has(g));

                        if (!hasMatchingGenre) return null;

                        try {
                            const { data: book } = await getCarteById(c.bookId);
                            return { ...c, book }; // Adaugă informațiile cărții la citat
                        } catch {
                            return null; // Ignoră citatele a căror carte nu a putut fi găsită
                        }
                    })
                );

                setCitate(filteredAndPopulated.filter(Boolean)); // Elimină rezultatele nule
            } catch {
                setError('Nu s-au putut încărca citatele. Vă rugăm să reîncărcați pagina.');
            } finally {
                setLoading(false);
            }
        };

        fetchCitateForUser();
    }, [user, authLoading]);

    // --- Funcție îmbunătățită de salvare, fără 'alert' ---
    const handleSave = async (quoteId) => {
        // Previne click-urile multiple în timp ce se salvează
        if (saveStatuses[quoteId] === 'saving') return;

        // Setează statusul pe 'saving' pentru feedback vizual
        setSaveStatuses(prev => ({ ...prev, [quoteId]: 'saving' }));

        try {
            const res = await saveCitat(quoteId);
            if (res.error) {
                throw new Error(res.error);
            }
            // Setează statusul pe 'saved' pentru a arăta succesul
            setSaveStatuses(prev => ({ ...prev, [quoteId]: 'saved' }));
        } catch (err) {
            alert(`Eroare la salvare: ${err.message}`);
            // Resetează statusul în caz de eroare pentru a permite o nouă încercare
            setSaveStatuses(prev => ({ ...prev, [quoteId]: 'idle' }));
        }
    };

    if (authLoading || loading) return <Loading />;
    if (!user) return <div className="text-center text-gray-600">Te rugăm să te autentifici.</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                    Pentru tine
                </h1>

                {citate.length === 0 && !loading ? (
                    <p className="text-center text-gray-600">
                        Niciun citat găsit pe baza preferințelor tale.
                    </p>
                ) : (
                    <div className="grid gap-8">
                        {citate.map(c => {
                            const saveStatus = saveStatuses[c._id] || 'idle'; // 'idle', 'saving', 'saved'
                            
                            return (
                                <article key={c._id} className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex flex-col sm:flex-row gap-6 p-8">
                                        <div className="sm:w-48 w-full sm:h-64 h-48 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                            {c.book?.coperta ? (
                                                <img src={c.book.coperta} alt={c.book.Titlu} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400"><BookIcon /></div>
                                            )}
                                        </div>

                                        <div className="flex-1 flex flex-col">
                                            <blockquote className="flex-grow text-2xl italic font-serif text-gray-800 mb-6">
                                                „{c.text}”
                                            </blockquote>
                                            <div className="border-t border-gray-100 pt-6 flex flex-row items-end justify-between gap-4">
                                                <div>
                                                    {c.book ? (
                                                        <>
                                                            {/* ⭐ FIX: Rută corectată de la '/carte/' la '/biblioteca/' */}
                                                            <Link to={`/biblioteca/${c.book._id}`} className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                                                                <span className="flex items-center gap-2"><BookIcon /> {c.book?.Titlu || "Carte fără titlu"}</span>
                                                            </Link>
                                                            <p className="mt-2 text-sm text-gray-600">
                                                                de <span className="font-semibold">{c.book.Autor.prenume} {c.book.Autor.nume}</span>
                                                            </p>
                                                            <p className="text-sm text-gray-500 mt-1">Gen: {c.genul}</p>
                                                        </>
                                                    ) : (
                                                        <p className="text-sm text-gray-400">Carte indisponibilă</p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleSave(c._id)}
                                                    disabled={saveStatus !== 'idle'}
                                                    className={`self-start sm:self-auto w-12 h-12 flex items-center justify-center rounded-full text-white transition-all duration-300 ${
                                                        saveStatus === 'saved' ? 'bg-green-500' : 'bg-purple-600 hover:bg-purple-700'
                                                    }`}
                                                    aria-label="Salvează citatul"
                                                >
                                                    {saveStatus === 'idle' && <BookmarkIcon />}
                                                    {saveStatus === 'saving' && <SpinnerIcon />}
                                                    {saveStatus === 'saved' && <CheckIcon />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}