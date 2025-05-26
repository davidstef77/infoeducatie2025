
import React, { useEffect, useState } from 'react';
import { getAllCitate, saveCitat } from '../../../utils/api/citate';
import { getCarteById } from '../../../utils/api/cartiApi';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';

export default function Explorepage() {
  const [citate, setCitate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedData = async () => {
      try {
        const response = await getAllCitate();
        const rawCitate = Array.isArray(response.data) ? response.data : [];

        const citateWithBooks = await Promise.all(
          rawCitate.map(async (citat) => {
            try {
              const bookData = await getCarteById(citat.bookId);
              return { ...citat, book: bookData.data };
            } catch (error) {
              console.error(`Error fetching book ${citat.bookId}:`, error);
              return { ...citat, book: null };
            }
          })
        );

        setCitate(citateWithBooks);
      } catch (err) {
        console.error("Error loading quotes:", err);
        setError("Nu s-au putut încărca citatele. Încearcă din nou mai târziu.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedData();
  }, []);

  const handleSave = async (quoteId) => {
    try {
      const res = await saveCitat(quoteId);
      if (res.error) {
        alert(`Eroare la salvare: ${res.error}`);
      } else {
        alert('Citat salvat cu succes!');
      }
    } catch (err) {
      alert('Eroare la comunicarea cu serverul');
    }
  };

  if (loading) return <Loading />;

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <svg className="h-6 w-6 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-red-800 font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-red-700 hover:text-red-900 underline transition-colors"
            >
              Încearcă din nou
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Explorează citate memorabile
          </h1>
        </header>

        <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-1">
          {citate.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p className="text-gray-500 text-lg">Căutăm cu lumină... dar nu am găsit citate</p>
            </div>
          ) : (
            citate.map((citat) => (
              <article 
                key={citat._id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 ease-out overflow-hidden border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row gap-6 p-8">
                  {/* Book Cover */}
                  <div className="sm:w-48 w-full sm:h-64 h-48 relative rounded-xl overflow-hidden shadow-lg bg-gray-100">
                    {citat.book?.coperta ? (
                      <img
                        src={citat.book.coperta}
                        alt={`Coperta cărții ${citat.book.Titlu}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Quote Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <blockquote className="text-2xl leading-relaxed text-gray-800 font-serif italic mb-6">
                      „{citat.text}”
                    </blockquote>

                    <div className="flex items-center justify-between  border-gray-100 pt-6">
                      <div>
                        <Link
                          to={`/carte/${citat.book?._id || ''}`}
                          className="inline-flex items-center gap-2 hover:text-blue-600 transition-colors"
                        >
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span className="font-medium text-gray-900">
                            {citat.book?.Titlu || "Carte fără titlu"}
                          </span>
                        </Link>
                        <p className="mt-2 text-gray-600">
                          de <span className="font-semibold">{citat.book?.Autor?.prenume || "Autor Anonim"}</span>{' '}
                          <span className="font-semibold">{citat.book?.Autor?.nume || ""}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => handleSave(citat._id)}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
