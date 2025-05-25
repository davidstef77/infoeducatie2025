import { useState } from 'react';
import { useAuth } from '../../context/authContext';
import { postAutor } from '../../utils/api/autorApi';
import { useNavigate } from 'react-router-dom';

export default function AddAutorModal({ onClose }) {
  const [formData, setFormData] = useState({
    nume: '',
    prenume: '',
    imagine: '',
    descriere: '',
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const { nume, prenume, imagine, descriere } = formData;

    if (!nume.trim() || !prenume.trim() || !imagine.trim() || !descriere.trim()) {
      alert('Completează toate câmpurile.');
      return;
    }

    if (!user) {
      alert('Nu ești autentificat.');
      return;
    }

    try {
      const response = await postAutor(formData);
      console.log(response);
      alert('Cererea de adăugarea a unui autor este trimisă cu succes!');
      onClose(); // Închide modalul
      navigate('/user');
    } catch (error) {
      console.error(error);
      alert('Eroare la adăugarea autorului.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 text-white">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Adaugă Autor</h2>
        <form onSubmit={handleAddSubmit}>
          <input
            type="text"
            placeholder="Nume"
            value={formData.nume}
            onChange={(e) => setFormData({ ...formData, nume: e.target.value })}
            className="w-full bg-gray-700 rounded-lg p-2 mb-4"
            required
          />
          <input
            type="text"
            placeholder="Prenume"
            value={formData.prenume}
            onChange={(e) => setFormData({ ...formData, prenume: e.target.value })}
            className="w-full bg-gray-700 rounded-lg p-2 mb-4"
            required
          />
          <input
            type="text"
            placeholder="Imagine URL"
            value={formData.imagine}
            onChange={(e) => setFormData({ ...formData, imagine: e.target.value })}
            className="w-full bg-gray-700 rounded-lg p-2 mb-4"
            required
          />
          <textarea
            placeholder="Descriere"
            value={formData.descriere}
            onChange={(e) => setFormData({ ...formData, descriere: e.target.value })}
            className="w-full bg-gray-700 rounded-lg p-2 h-24 mb-4"
            required
          ></textarea>

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
              Adaugă
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
