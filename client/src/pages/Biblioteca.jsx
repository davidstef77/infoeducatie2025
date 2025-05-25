import { useState, useEffect } from 'react';
import { getCarti } from '../../utils/api/cartiApi';
import { getAutori } from '../../utils/api/autorApi';
import { useNavigate } from 'react-router-dom';

export default function Biblioteca() {
  const [carti, setCarti] = useState([]);
  const [autori, setAutori] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGen, setSelectedGen] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [paginaCurenta, setPaginaCurenta] = useState(1);
  const cartiPerPagina = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [fetchedCarti, fetchedAutori] = await Promise.all([getCarti(), getAutori()]);
        setCarti(fetchedCarti);
        setAutori(fetchedAutori);
      } catch (err) {
        console.error('Eroare la obținerea datelor:', err);
        setError('A apărut o eroare la încărcarea datelor.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Map pentru acces rapid la autor după ID
  const autoriMap = autori.reduce((map, autor) => {
    map[autor._id.toString()] = `${autor.prenume} ${autor.nume}`;
    return map;
  }, {});

  const getAutorNumeComplet = (autorId) => autoriMap[autorId?.toString()] || 'Necunoscut';

  const getCartiFiltrate = () => {
    return carti.filter(carte => {
      const titluMatch = carte.Titlu.toLowerCase().includes(searchTerm.toLowerCase());
      const genMatch = selectedGen ? carte.Gen === selectedGen : true;
      return titluMatch && genMatch;
    });
  };

  const cartiFiltrate = getCartiFiltrate();

  // Resetează pagina la 1 dacă filtrele se schimbă
  useEffect(() => {
    setPaginaCurenta(1);
  }, [searchTerm, selectedGen]);

  const indexStart = (paginaCurenta - 1) * cartiPerPagina;
  const paginatedCarti = cartiFiltrate.slice(indexStart, indexStart + cartiPerPagina);
  const totalPages = Math.ceil(cartiFiltrate.length / cartiPerPagina);

  const genuri = [
    "Stoicism", "Dezvoltare Personală", "Motivational", "Business",
    "Spiritualitate", "Istorie", "Religie", "Filosofie", "Politica",
    "Psihologie", "Educatie", "Romantism", "Literatura", "Poezie",
    "Drama", "Comedie"
  ];

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedGen('');
    setPaginaCurenta(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>

          {/* Search Skeleton */}
          <div className="flex justify-center mb-8">
            <div className="h-12 bg-gray-200 rounded-xl w-full max-w-md animate-pulse"></div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-5 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops! Ceva nu a mers bine</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Biblioteca Mea
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descoperă, explorează și inspiră-te din colecția noastră de cărți și citate extraordinare
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Caută după titlu sau autor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all duration-200"
              />
            </div>

            {/* Genre Filter */}
            <div className="flex gap-3">
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all duration-200 min-w-[180px]"
                value={selectedGen}
                onChange={(e) => setSelectedGen(e.target.value)}
              >
                <option value="">Toate genurile</option>
                {genuri.map((gen) => (
                  <option key={gen} value={gen}>{gen}</option>
                ))}
              </select>

              <button
                onClick={resetFilters}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium whitespace-nowrap"
              >
                Resetează
              </button>
            </div>
          </div>

          {/* Results Counter */}
          <div className="mt-4 text-sm text-gray-600 text-center">
            {cartiFiltrate.length > 0 ? (
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                {cartiFiltrate.length} {cartiFiltrate.length === 1 ? 'carte găsită' : 'cărți găsite'}
              </span>
            ) : null}
          </div>
        </div>

        {/* Books Grid */}
        {paginatedCarti.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {paginatedCarti.map((carte) => (
              <div
                key={carte._id}
                onClick={() => navigate(`/biblioteca/${carte._id}`)}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/20 overflow-hidden transform hover:-translate-y-2"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-t-2xl">
                  <img
                    src={carte.coperta}
                    alt={carte.Titlu}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-2">
                    {carte.Titlu}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">de</span> {getAutorNumeComplet(carte.Autor)}
                  </p>
                  
                  <p className="text-xs text-gray-500 mb-3">
                    Anul apariției: <span className="font-medium">{carte.AnulAparitiei}</span>
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
                      {carte.Gen}
                    </span>
                    
                    <div className="text-blue-500 group-hover:text-blue-600 transition-colors duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 max-w-md mx-auto border border-white/20">
              <div className="text-6xl mb-6">📚</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Nicio carte găsită</h3>
              <p className="text-gray-500 mb-6">Nu am găsit nicio carte cu filtrele selectate.</p>
              <button
                onClick={resetFilters}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
              >
                Vezi toate cărțile
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-white/20">
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => setPaginaCurenta(Math.max(1, paginaCurenta - 1))}
                  disabled={paginaCurenta === 1}
                  className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>

                {/* Page Numbers */}
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setPaginaCurenta(index + 1)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      paginaCurenta === index + 1
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                        : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => setPaginaCurenta(Math.min(totalPages, paginaCurenta + 1))}
                  disabled={paginaCurenta === totalPages}
                  className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}