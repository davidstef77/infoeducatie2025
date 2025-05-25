import { useEffect, useState } from 'react';
import { getAllCitate } from '../../../utils/api/citate';
import { getCarteById } from '../../../utils/api/cartiApi';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';

const preferinteGen = ['istoric', 'dezvoltare personală', 'filozofie'];

export default function ForYouPage() {
  const [citate, setCitate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCitateForUser = async () => {
      try {
        const response = await getAllCitate();
        const rawCitate = Array.isArray(response.data) ? response.data : [];

        const filtered = await Promise.all(
          rawCitate.map(async (citat) => {
            try {
              const bookData = await getCarteById(citat.bookId);
              const book = bookData.data;
              const gen = book?.Gen?.toLowerCase();

              if (gen && preferinteGen.includes(gen)) {
                return { ...citat, book };
              }
              console.log('Gen carte:', book?.Gen, '| Normalizat:', gen);
             


              return null;
            } catch (error) {
              console.error(`Eroare la cartea cu ID ${citat.bookId}`, error);
              return null;
            }
          })
        );

        setCitate(filtered.filter(Boolean));
      } catch (err) {
        console.error("Eroare la încărcarea citatelor:", err);
        setError("Nu s-au putut încărca citatele.");
      } finally {
        setLoading(false);
      }
    };

    fetchCitateForUser();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Pentru tine 💡
        </h1>

        <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-1">
          {citate.length === 0 ? (
            <div className="text-center text-gray-600">
              Niciun citat găsit pe baza preferințelor tale.
            </div>
          ) : (
            citate.map((citat) => (
              <article
                key={citat._id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row gap-6 p-8">
                  <div className="sm:w-48 w-full sm:h-64 h-48 relative rounded-xl overflow-hidden shadow bg-gray-100">
                    {citat.book?.coperta ? (
                      <img
                        src={citat.book.coperta}
                        alt={`Coperta ${citat.book?.Titlu}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <blockquote className="text-2xl italic font-serif text-gray-800 mb-6">
                      „{citat.text}”
                    </blockquote>
                    <div className="border-t border-gray-100 pt-6">
                      <Link
                        to={`/carte/${citat.book?._id}`}
                        className="inline-flex items-center gap-2 hover:text-blue-600"
                      >
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="font-medium text-gray-900">
                          {citat.book?.Titlu || 'Carte necunoscută'}
                        </span>
                      </Link>
                      <p className="mt-2 text-gray-600">
                        de <span className="font-semibold">{citat.book?.Autor?.nume || 'Autor necunoscut'}</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Gen: {citat.book?.Gen || 'necunoscut'}
                      </p>
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
