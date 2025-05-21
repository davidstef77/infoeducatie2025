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
  const cartiPerPagina = 10;

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

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <h1 className="text-3xl text-center font-bold text-gray-800">Biblioteca</h1>
      <p className="text-center text-gray-600">Biblioteca ta de cărți și citate.</p>

      <div className="mt-10 flex justify-center">
        <input
          type="text"
          placeholder="Caută o carte după titlu, autor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <select
          className="p-2 border border-gray-300 rounded"
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
          className="bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200 transition"
        >
          Resetează filtrele
        </button>
      </div>

      {error && (
        <div className="text-center text-red-600 mt-6">
          {error}
        </div>
      )}

      {loading ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <li key={i} className="bg-white p-4 rounded shadow animate-pulse flex flex-col space-y-2">
              <div className="w-20 h-28 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </li>
          ))}
        </ul>
      ) : (
        <>
          {paginatedCarti.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
  {(paginatedCarti ?? []).map((carte) => (
    <li
      key={carte._id}
      onClick={() => navigate(`/biblioteca/${carte._id}`)}
      className="bg-white flex flex-col md:flex-row items-start p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer duration-300"
    >
      <img
        src={carte.coperta}
        alt={carte.Titlu}
        className="w-20 h-28 object-cover rounded-md mb-2 md:mb-0 md:mr-3"
      />
      <div className="flex flex-col justify-between">
        <h3 className="text-base font-semibold text-gray-800">{carte.Titlu}</h3>
        <p className="text-xs text-gray-500">Autor: {getAutorNumeComplet(carte.Autor)}</p>
        <p className="text-xs text-gray-500">Anul apariției: {carte.AnulAparitiei}</p>
        <span className="mt-1 inline-block px-1 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-medium rounded-full">
          {carte.Gen}
        </span>
      </div>
    </li>
  ))}
</ul>

          ) : (
            <div className="text-center mt-6 text-gray-500">
              <div className="text-4xl mb-2">📚</div>
              <p className="text-sm">„Ups! Nu am găsit nicio carte cu aceste filtre.”</p>
            </div>
          )}

          {/* Paginare */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPaginaCurenta(index + 1)}
                  className={`px-3 py-1 border rounded ${
                    paginaCurenta === index + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
