import { useState, useEffect } from 'react';
import { postCitat } from '../../utils/api/citate';
import { getCarti } from '../../utils/api/cartiApi';
import { getAutori } from '../../utils/api/autorApi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const GENURI = [
  "Stoicism", "Dezvoltare Personala", "Motivational", "Business",
  "Spiritualitate", "Istorie", "Religie", "Filosofie", "Politica",
  "Psihologie", "Educatie", "Romantism", "Literatura", "Poezie",
  "Drama", "Comedie"
];

export default function AddQuoteModal({ onClose }) {
  const [formData, setFormData] = useState({
    text: '',
    selectedCarte: '',
    selectedAutor: '',
    selectedGen: '',
  });
  const [carti, setCarti] = useState([]);
  const [autori, setAutori] = useState([]);
  const [filteredCarti, setFilteredCarti] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCarti = await getCarti();
        const fetchedAutori = await getAutori();
        setCarti(fetchedCarti);
        setAutori(fetchedAutori);
      } catch (error) {
        alert('Eroare la obținerea datelor.');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.selectedAutor) {
      const filtrate = carti.filter(carte =>
        carte.Autor === formData.selectedAutor || carte.Autor?._id === formData.selectedAutor
      );
      setFilteredCarti(filtrate);
      setFormData(prev => ({ ...prev, selectedCarte: '' }));
    } else {
      setFilteredCarti([]);
      setFormData(prev => ({ ...prev, selectedCarte: '' }));
    }
  }, [formData.selectedAutor, carti]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const { text, selectedAutor, selectedCarte, selectedGen } = formData;

    if (!text.trim() || !selectedAutor || !selectedCarte || !selectedGen) {
      alert('Completează toate câmpurile.');
      return;
    }

    if (!user) {
      alert('Trebuie să fii logat.');
      return;
    }

    try {
      const payload = {
        text,
        autorul: selectedAutor,
        bookId: selectedCarte,
        genul: selectedGen,
        userId: user.user._id,
        userName: user.user.userName,
      };

      console.log("Trimitem:", payload); // Pentru debug

      const data = await postCitat(payload);
      if (data.error) {
        alert(data.error);
        return;
      }

      alert("Citatul a fost adăugat!");
      setFormData({ text: '', selectedCarte: '', selectedAutor: '', selectedGen: '' });
      onClose();
    } catch (error) {
      alert("Eroare la adăugare.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 text-white">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Adaugă un citat</h2>
        <form onSubmit={handleAddSubmit}>
          <textarea
            name="text"
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            className="w-full bg-gray-700 rounded-lg p-2 h-24 mb-4"
            placeholder="Citatul"
            required
          />
          <select
            name="selectedAutor"
            value={formData.selectedAutor}
            onChange={(e) => setFormData({ ...formData, selectedAutor: e.target.value })}
            className="w-full bg-gray-700 rounded-lg p-2 mb-4"
            required
          >
            <option value="">Alege un autor...</option>
            {autori.map((autor) => (
              <option key={autor._id} value={autor._id}>
                {autor.prenume} {autor.nume}
              </option>
            ))}
          </select>

          <select
            name="selectedCarte"
            value={formData.selectedCarte}
            onChange={(e) => setFormData({ ...formData, selectedCarte: e.target.value })}
            className="w-full bg-gray-700 rounded-lg p-2 mb-4"
            required
            disabled={!formData.selectedAutor}
          >
            <option value="">Alege o carte...</option>
            {filteredCarti.map((carte) => (
              <option key={carte._id} value={carte._id}>
                {carte.Titlu}
              </option>
            ))}
          </select>

          <select
            name="selectedGen"
            value={formData.selectedGen}
            onChange={(e) => setFormData({ ...formData, selectedGen: e.target.value })}
            className="w-full bg-gray-700 rounded-lg p-2 mb-4"
            required
          >
            <option value="">Alege un gen...</option>
            {GENURI.map((gen) => (
              <option key={gen} value={gen}>
                {gen}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded-lg"
            >
              Anulează
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600"
            >
              Salvează
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
