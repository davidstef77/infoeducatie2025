import { useParams } from 'react-router-dom';
// Importă icoanele (exemplu cu Heroicons)
import {
    HeartIcon as HeartIconSolid,
    BookmarkIcon as BookmarkIconSolid,
    UserCircleIcon,
    UserIcon,
    PaperAirplaneIcon,
    
} from '@heroicons/react/24/solid'
import {
    HeartIcon,
    BookmarkIcon,
    
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react';
import {
  getCarteById,
  
  
  addComentariu
} from '../../utils/api/cartiApi';
import {getAutorById} from '../../utils/api/autorApi';
import Loading from '../components/Loading';
import { useAuth } from '../../context/authContext';
import { getCitate, saveCitat } from '../../utils/api/citate';
import { saveCarte } from '../../utils/api/cartiApi';


export default function PaginaCarte() {
  const { id } = useParams();
  const { user } = useAuth();
 
  const [carte, setCarte] = useState(null);
  const [autor, setAutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comentariuNou, setComentariuNou] = useState('');
  const [comentarii, setComentarii] = useState([]);
  const [citate, setCitate] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [saveCount, setSaveCount] = useState(0);

  const fetchCitate = async () => {
    try { 
      const data = await getCitate(id);
      if (data.error) {
        console.error(data.error);
        return;
      }
      setCitate(data.data);
    } catch (error) {
      console.error("Eroare la obținerea citatelor:", error);
    }
  };
  



useEffect(() => {
  const fetchCarte = async () => {
    if (!user) return;
    try {
      const data = await getCarteById(id);
      if (!data) {
        console.log("Cartea nu a fost găsită");
        return;
      }

      const carteData = data.data;
      setCarte(carteData);
      setLikeCount(0);
      
      setSaveCount(0);
      setLiked(false);
      setSaved(false);
      setComentarii(carteData.comentarii || []);
      
      

      const autorId = carteData.Autor?._id || carteData.Autor;
      const autorData = await getAutorById(autorId);
      await fetchCitate();
      setLoading(false);
      setAutor(autorData);
      

      setLoading(false);
    } catch (error) {
      console.error("Eroare la fetch:", error);
      setLoading(false);
    }
  };

  fetchCarte();
}, [id, user?.id]);

 
  

  const handleSave = async () => {
    if (!user) return;
    try {
      await saveCarte(id, user.id);
      setSaved(true);
        if(saveCarte){
    alert("Carte salvată cu succes!");}
      
    } catch (error) {
      console.error("Eroare la salvarea cărții:", error);
    }
  };
 
  

  

  const handleSaveCitat = async (citat) => {
  if (!user) return;
  try {
    await saveCitat(citat._id); // doar id-ul citatului
    if(saveCitat){
    alert("Citat salvat cu succes!");}
  } catch (err) {
    console.error("Eroare la salvarea citatului:", err);
  }
};


  const handleAdaugaComentariu = async () => {
  if (!user || !comentariuNou.trim()) return;
  try {
    await addComentariu(id, user.user._id, comentariuNou.trim());

    const newComment = {
      user: user.user._id,
      text: comentariuNou.trim()
    };
    
    setComentarii(prev => [...prev, newComment]);
    setComentariuNou('');
  } catch (err) {
    console.error("Eroare la adăugarea comentariului:", err);
  }
};

  if (loading) return <Loading />;

  if (!carte) {
    return (
      <div className="text-center p-10 text-gray-500">
        <h2 className="text-2xl">Cartea nu a fost găsită.</h2>
      </div>
    );
  }

  return (
    <div className=" bg-white p-6 max-w-5xl mx-auto space-y-8 mt-6">
        {/* Card principal */}
        <div className="flex flex-col md:flex-row gap-8 ">
            {/* Imagine copertă */}
            <div className="group relative w-48 h-64 shrink-0 hover:rotate-[-1deg] transition-transform duration-300">
                <img
                    src={carte.coperta}
                    alt={carte.Titlu}
                    className="w-full h-full object-cover rounded-xl shadow-lg border-4 border-white transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl" />
            </div>

            {/* Detalii carte */}
            <div className="space-y-4 flex-1">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-gray-900 font-serif">{carte.Titlu}</h1>
                    <div className="flex items-center gap-2 text-lg">
                        <UserCircleIcon className="w-6 h-6 text-gray-500" />
                        {autor ? (
                            <span className="text-gray-600">
                                {autor.prenume} {autor.nume}
                            </span>
                        ) : (
                            <span className="text-gray-400 italic">Autor necunoscut</span>
                        )}
                    </div>
                </div>

                {/* Metadata */}
                <div className="flex gap-4 text-sm">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {carte.Gen}
                    </span>
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
                        {carte.AnulAparitiei}
                    </span>
                </div>

                {/* Descriere */}
                <p className="text-gray-700 leading-relaxed border-l-4 border-emerald-500 pl-4">
                    {carte.Descriere || "Descrierea acestei cărți nu este disponibilă momentan."}
                </p>

                {/* Acțiuni */}
                <div className="flex gap-4 items-center pt-4">
                    

                    <button
                       onClick={handleSave}
                        
                        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:scale-[1.02]"
                    >
                       
                          
                        
                            <BookmarkIcon className="w-6 h-6 text-gray-400 hover:text-blue-600" />
                      
                        <span className={`font-medium ${saved ? 'text-blue-600' : 'text-gray-500'}`}>
                            
                        </span>
                    </button>
                </div>
            </div>
        </div>

        {/* Citate */}
        
                <div className="grid gap-4 md:grid-cols-2">
                    {carte.Citate?.length > 0 && (
    <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2">
            Citate marcante
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
            {carte.Citate.map((citat, index) => (
                <blockquote
                    key={index}
                    className="relative p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                    <p className="text-gray-700 italic before:content-['„'] after:content-['”']">
                        {citat}
                    </p>

                    <BookmarkIconSolid
                        className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer absolute top-4 right-4"
                        title="Salvează citatul"
                    />
                </blockquote>
            ))}
        </div>
    </section>
)}

                </div>
           
         {citate.length > 0 && (
  <section className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2">
      Citate marcante
    </h2>
    <div className="grid gap-4 md:grid-cols-2">
      {citate.map((citat, index) => (
        <blockquote
          key={index}
          className="relative p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <p className="text-gray-700 italic before:content-['„'] after:content-['”']">
            {citat.text}
          </p>
          <BookmarkIconSolid
            className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer absolute bottom-4 right-4"
            title="Salvează citatul"
            onClick={() => handleSaveCitat(citat)}
          />
        </blockquote>
      ))}
    </div>
  </section>
)}

        {/* Comentarii */}
        <section className="space-y-6">
  <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2">
    Comentarii ({comentarii.length})
  </h2>

  {comentarii.length === 0 ? (
    <div className="text-center py-8 text-gray-400">
      <p>Fii primul care comentează</p>
    </div>
  ) : (
    <div className="space-y-4">
      {comentarii.map((c, idx) => (
        <div
          key={idx}
          className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 transition-shadow hover:shadow-md"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-medium text-gray-900">
              {c.user || 'Utilizator necunoscut'}
            </span>
          </div>
          <p className="text-gray-700 pl-11">{c.text||"nu gasesc textul"}</p>
        </div>
      ))}
    </div>
  )}

            {/* Formular comentariu */}
            {user ? (
                <div className="pt-4 mb-20">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                            <UserIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 space-y-4">
                            <textarea
                                value={comentariuNou}
                                onChange={(e) => setComentariuNou(e.target.value)}
                                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                rows="3"
                                placeholder="Scrie-ți comentariul aici..."
                            />
                            <button
                                onClick={handleAdaugaComentariu}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <PaperAirplaneIcon className="w-5 h-5" />
                                Trimite comentariu
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-4 text-gray-500">
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Conectează-te
                    </Link>
                    {' '}pentru a putea comenta
                </div>
            )}
        </section>
       

      
        
     
    </div>

  );
}
