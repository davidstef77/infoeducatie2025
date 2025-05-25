import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/authContext';
import { postCarte } from '../../utils/api/cartiApi';
import { getAutori } from '../../utils/api/autorApi';
import { useNavigate } from 'react-router-dom';

export default function AddCarteModal({ onClose }) {
 const navigate = useNavigate();
  const { user } = useAuth();
  const dropdownRef = useRef(null);

  const GenURI = [
    "Stoicism", "Dezvoltare Personală", "Motivațional", "Business",
    "Spiritualitate", "Istorie", "Religie", "Filosofie", "Politica",
    "Psihologie", "Educatie", "Romantism", "Literatură", "Poezie",
    "Dramă", "Comedie"
  ];

  const [formData, setFormData] = useState({
    Titlu: '',
    Gen: '',
    Autor: '',
    Descriere: '',
    coperta: '',
    AnulAparitiei: ''
  });

  const [Autori, setAutori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchAutori = async () => {
      try {
        const fetchedAutori = await getAutori();
        setAutori(fetchedAutori);
      } catch (error) {
        alert('Eroare la obținerea Autorilor.');
      } finally {
        setLoading(false);
      }
    };
    fetchAutori();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const { Titlu, Gen, Autor, Descriere, coperta, AnulAparitiei } = formData;

    if (!Titlu.trim() || !Gen || !Autor || !Descriere.trim() || !coperta.trim() || !AnulAparitiei) {
      alert('Completează toate câmpurile.');
      return;
    }

    if (!user) {
      alert('Nu ești autentificat.');
      return;
    }

    try {
      await postCarte(formData);
      alert('Cererea de adăugare a fost trimisă cu succes!');
      navigate('/user');
    } catch (error) {
      console.error(error);
      alert('Eroare la trimiterea cererii.');
    }
  };

  const filteredAutori = Autori.filter(autor => {
    const fullName = `${autor.prenume} ${autor.nume}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 text-white">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-lg mx-4">
        <h2 className="text-2xl font-bold mb-5 text-center">Adaugă o carte</h2>
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <input
            type="text"
            name="Titlu"
            placeholder="Titlu carte"
            value={formData.Titlu}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded-lg p-3"
            required
          />

          <select
            name="Gen"
            value={formData.Gen}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded-lg p-3"
            required
          >
            <option value="">Alege Genul</option>
            {GenURI.map((Gen) => (
              <option key={Gen} value={Gen}>{Gen}</option>
            ))}
          </select>
          <input
  type="number"
  name="AnulAparitiei"
  placeholder="Anul apariției"
  value={formData.AnulAparitiei}
  onChange={handleChange}
  className="w-full bg-gray-700 rounded-lg p-3"
  required
/>


          <div className="relative" ref={dropdownRef}>
            <input
              type="text"
              placeholder="Caută autor..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
                if (formData.Autor) setFormData(prev => ({ ...prev, Autor: '' }));
              }}
              onFocus={() => setIsDropdownOpen(true)}
              className="w-full bg-gray-700 rounded-lg p-3"
            />
            {isDropdownOpen && (
              <ul className="absolute z-10 w-full bg-gray-700 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-xl">
                {filteredAutori.length === 0 ? (
                  <li className="p-3 text-gray-400">Niciun autor găsit</li>
                ) : (
                  filteredAutori.map(autor => (
                    <li
                      key={autor._id}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, Autor: autor._id }));
                        setSearchQuery(`${autor.prenume} ${autor.nume}`);
                        setIsDropdownOpen(false);
                      }}
                      className="p-3 hover:bg-gray-600 cursor-pointer transition-colors border-b border-gray-600 last:border-0"
                    >
                      {autor.prenume} {autor.nume}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          <textarea
            name="Descriere"
            placeholder="Descriere carte"
            value={formData.Descriere}
            onChange={handleChange}
            rows={4}
            className="w-full bg-gray-700 rounded-lg p-3 resize-none"
            required
          />

          <input
            type="text"
            name="coperta"
            placeholder="URL imagine copertă"
            value={formData.coperta}
            onChange={handleChange}
            className="w-full bg-gray-700 rounded-lg p-3"
            required
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500"
            >
              Anulează
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600"
              disabled={loading}
            >
              {loading ? 'Se încarcă...' : 'Trimite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
