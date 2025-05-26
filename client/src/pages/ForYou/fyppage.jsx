import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';
import { getAllCitate, saveCitat } from '../../../utils/api/citate';
import { getCarteById } from '../../../utils/api/cartiApi';
import { useAuth } from '../../../context/authContext';

export default function ForYouPage() {
  const { user, loading: authLoading } = useAuth();
  const [citate, setCitate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading || !user) return;

    const authUser = user.user ?? user;
    const preferinteGen = typeof authUser.preferinteGen === 'string'
      ? [authUser.preferinteGen.toLowerCase()]
      : authUser.preferinteGen.map(g => g.toLowerCase());

    const fetchCitateForUser = async () => {
      try {
        const { data: allC } = await getAllCitate();
        const rawC = Array.isArray(allC) ? allC : [];

        const filtered = await Promise.all(
          rawC.map(async c => {
            const genres = c.genul.toLowerCase().split(',').map(g => g.trim());
            if (!genres.some(g => preferinteGen.includes(g))) return null;

            try {
              const { data: book } = await getCarteById(c.bookId);
              return { ...c, book };
            } catch {
              return null;
            }
          })
        );

        setCitate(filtered.filter(Boolean));
      } catch {
        setError('Nu s-au putut încărca citatele.');
      } finally {
        setLoading(false);
      }
    };

    fetchCitateForUser();
  }, [user, authLoading]);

  const handleSave = async (quoteId) => {
    const res = await saveCitat(quoteId);
    if (res.error) {
      alert(`Eroare la salvare: ${res.error}`);
    } else {
      alert('Citat salvat cu succes!');
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

        {citate.length === 0 ? (
          <p className="text-center text-gray-600">
            Niciun citat găsit pe baza preferințelor tale.
          </p>
        ) : (
          <div className="grid gap-8">
            {citate.map(c => (
              <article key={c._id} className="group bg-white rounded-2xl shadow-sm hover:shadow-md ">
                <div className="flex flex-col sm:flex-row gap-6 p-8">
                  <div className="sm:w-48 w-full sm:h-64 h-48 rounded-xl overflow-hidden bg-gray-100">
                    {c.book?.coperta ? (
                      <img
                        src={c.book.coperta}
                        alt={c.book.Titlu}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <blockquote className="text-2xl italic font-serif text-gray-800 mb-6">
                      „{c.text}”
                    </blockquote>
                    <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        {c.book ? (
                          <>
                            <Link
                              to={`/carte/${c.book._id}`}
                              className="inline-flex items-center gap-2 hover:text-blue-600"
                            >
                             
                              
                              <span className="font-medium text-gray-900 flex items-center gap-2">
  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
  {c.book?.Titlu || "Carte fără titlu"}
</span>

                            </Link>
                            <p className="mt-2 text-gray-600">
                              de{' '}
                              <span className="font-semibold">
                                {c.book.Autor.prenume} {c.book.Autor.nume}
                              </span>
                            </p>
                            <p className="text-sm text-gray-500 mt-1">Gen: {c.genul}</p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-400">Carte indisponibilă</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleSave(c._id)}
                        className="self-start sm:self-auto mt-4 sm:mt-0 w-10 h-10 flex items-center justify-center bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
                        aria-label="Salvează citatul"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
