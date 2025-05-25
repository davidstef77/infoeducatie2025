import { getAutorById } from "../../utils/api/autorApi";
import { getCitate } from "../../utils/api/citate";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate, useParams } from "react-router-dom";

export default function AutorPage() {
  const [autor, setAutor] = useState(null);
  const [citate, setCitate] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // presupun că id-ul vine din url

  useEffect(() => {
    if (!user) {
      // dacă nu e user logat, redirect la login
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const autorData = await getAutorById(id);
        setAutor(autorData);

        const citateData = await getCitate(id);
        setCitate(citateData);
      } catch (error) {
        console.error("Eroare la încărcarea datelor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user, navigate]);

  if (loading) return <p>Se încarcă...</p>;

  if (!autor) return <p>Autorul nu a fost găsit.</p>;

  return (
    <div>
      <h1>{autor.nume}</h1>
      <p>{autor.descriere}</p>

      <h2>Citate</h2>
      {citate.length === 0 ? (
        <p>Nu există citate pentru acest autor.</p>
      ) : (
        <ul>
          {citate.map((citat) => (
            <li key={citat.id}>{citat.text}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
