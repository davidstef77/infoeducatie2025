import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkIcon, BookOpenIcon, UserIcon, ArrowRightOnRectangleIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid, BookOpenIcon as BookOpenSolid, PencilSquareIcon as PencilSquareIconSolid } from '@heroicons/react/24/solid';
import AuthContext from '../../context/authContext';
import Navbar from '../components/NavBar';
import  Loading from '../components/Loading';
import { getCitatesiCartiSalvate } from "../../utils/api/userApi";
import { getCitateByUserId } from '../../utils/api/citate';
import { getAutorById } from '../../utils/api/autorApi';

const ITEMS_PER_PAGE = 10;

export default function UserPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('citate');
  const [savedCitate, setSavedCitate] = useState([]);
  const [savedCarti, setSavedCarti] = useState([]);
  const [userCitate, setUserCitate] = useState([]); // New state for user's created quotes
  const [autoriMap, setAutoriMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('user-data');
    logout();
    navigate('/login', { replace: true });
  };

  // Complete the fetchCitatebyUserId function
  const fetchCitatebyUserId = async (userId) => {
  try {
    const response = await getCitateByUserId(userId);
    // EXTRAGEM ARRAY-UL DIN response.data
    const quotesArray = Array.isArray(response.data) ? response.data : [];
    setUserCitate(quotesArray);
    
    return quotesArray;
  } catch (error) {
    console.error("Eroare la încărcarea citatelor utilizatorului:", error);
    setUserCitate([]);
    return [];
  }
};

  const fetchSavedData = async (userId) => {
    try {
      const data = await getCitatesiCartiSalvate(userId);
      setSavedCitate(data.quotes || []);
      setSavedCarti(data.carti || []);

      if (data.carti?.length > 0) {
        const autorIds = data.carti.map(carte => carte.Autor).filter(id => id);
        const uniqueAutorIds = [...new Set(autorIds)];
        const autoriDataArr = await Promise.all(uniqueAutorIds.map(id => getAutorById(id)));
        const autoriMapObj = {};
        uniqueAutorIds.forEach((id, i) => {
          autoriMapObj[id] = autoriDataArr[i];
        });
        setAutoriMap(autoriMapObj);
      }

    } catch (error) {
      console.error("Eroare la încărcarea datelor salvate:", error);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = localStorage.getItem('user-data');
      
      if (!storedUser) {
        navigate('/login');
        return;
      }

      try {
        const parsed = JSON.parse(storedUser);
        if (!parsed?.user) throw new Error("Date utilizator invalide");
        setUser(parsed.user);
        
        // Fetch both saved data and user's created quotes
        await Promise.all([
          fetchSavedData(parsed.user._id),
          fetchCitatebyUserId(parsed.user._id)
        ]);
        
      } catch (err) {
        console.error("Eroare la parse user:", err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
      console.log(JSON.parse(localStorage.getItem("user")));
    };
   
    loadUserData();
  }, [navigate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const paginate = (items) => {
    // Ensure items is always an array
    const safeItems = Array.isArray(items) ? items : [];
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return safeItems.slice(start, start + ITEMS_PER_PAGE);
  };

  const totalPages = () => {
    switch(activeTab) {
      case 'citate':
        return Math.ceil((Array.isArray(savedCitate) ? savedCitate.length : 0) / ITEMS_PER_PAGE);
      case 'carti':
        return Math.ceil((Array.isArray(savedCarti) ? savedCarti.length : 0) / ITEMS_PER_PAGE);
      case 'citate-mele':
        return Math.ceil((Array.isArray(userCitate) ? userCitate.length : 0) / ITEMS_PER_PAGE);
      default:
        return 1;
    }
  };

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages()));

  if (loading) {
    return (
      <Loading />
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center text-center px-4">
        <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-2xl p-8 max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-red-400 mb-2">Eroare la încărcare</h3>
          <p className="text-red-300/80">Nu s-a putut încărca profilul utilizatorului.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M29.98 29.982L44.8993 44.8993M29.98 29.982L15.0607 44.8993M29.98 29.982L29.98 15.0607M29.98 29.982L44.8993 15.0607M29.98 29.982L15.0607 15.0607M29.98 29.982L29.98 44.8993M15.0607 29.982L44.8993 29.982M15.0607 29.982L44.8993 44.8993M15.0607 29.982L44.8993 15.0607\' stroke=\'white\' stroke-width=\'2\'/%3E%3C/svg%3E')] opacity-20"></div>

      
      <div className="relative">
        <Navbar />
        
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Enhanced Profile Section */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-500 p-1 shadow-2xl">
                  <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                    {user.imagine ? (
                      <img 
                        src={user.imagine} 
                        alt="User Avatar" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-purple-400 to-blue-400 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                          {user.prenume?.[0] || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-slate-800 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-2">
                  {user.prenume || 'Utilizator'} {user.nume}
                </h1>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                  <div className="flex items-center gap-6 text-white/60">
                    <div className="flex items-center gap-2">
                      <BookmarkSolid className="w-5 h-5 text-purple-400" />
                      <span className="font-medium">{Array.isArray(savedCitate) ? savedCitate.length : 0} salvate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpenSolid className="w-5 h-5 text-blue-400" />
                      <span className="font-medium">{Array.isArray(savedCarti) ? savedCarti.length : 0} cărți</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PencilSquareIconSolid className="w-5 h-5 text-green-400" />
                      <span className="font-medium">{Array.isArray(userCitate) ? userCitate.length : 0} create</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="group bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 border border-red-500/30 hover:border-red-400/50 px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 text-red-300 hover:text-red-200"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    <span className="font-medium">Deconectare</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Tabs */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-2 mb-8 shadow-xl">
            <div className="flex">
              {[
                { key: 'citate', label: 'Citate Salvate', icon: BookmarkIcon, solidIcon: BookmarkSolid, count: Array.isArray(savedCitate) ? savedCitate.length : 0 },
                { key: 'carti', label: 'Cărți Salvate', icon: BookOpenIcon, solidIcon: BookOpenSolid, count: Array.isArray(savedCarti) ? savedCarti.length : 0 },
                { key: 'citate-mele', label: 'Citatele Mele', icon: PencilSquareIcon, solidIcon: PencilSquareIconSolid, count: Array.isArray(userCitate) ? userCitate.length : 0 }
              ].map(({ key, label, icon: Icon, solidIcon: SolidIcon, count }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 px-6 py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 font-medium ${
                    activeTab === key
                      ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-500/30 shadow-lg'
                      : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  {activeTab === key ? (
                    <SolidIcon className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{key === 'citate' ? 'Salvate' : key === 'carti' ? 'Cărți' : 'Mele'}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === key 
                      ? 'bg-white/20 text-white' 
                      : 'bg-white/10 text-white/60'
                  }`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Content */}
          <div className="text-white">
            {/* Saved Quotes Tab */}
            {activeTab === 'citate' && (
              <div className="space-y-6">
                {paginate(savedCitate).length > 0 ? (
                  paginate(savedCitate).map((citat, index) => (
                    <div key={index} className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-purple-500/30">
                          <BookmarkSolid className="w-6 h-6 text-purple-300" />
                        </div>
                        <div className="flex-1">
                          <blockquote className="text-lg italic text-white/90 leading-relaxed mb-3">
                            "{citat.text}"
                          </blockquote>
                          {citat.autor && (
                            <cite className="text-sm text-purple-300 font-medium not-italic">
                              — {citat.autor}
                            </cite>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 max-w-md mx-auto">
                      <BookmarkIcon className="w-16 h-16 text-white/30 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white/80 mb-2">Niciun citat salvat</h3>
                      <p className="text-white/50">Începe să salvezi citatele tale preferate pentru a le vedea aici.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User's Created Quotes Tab */}
            {activeTab === 'citate-mele' && (
  <div className="space-y-6">
    {paginate(userCitate).length > 0 ? (
      paginate(userCitate).map((citat, index) => (
        <div
          key={index}
          className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:bg-white/10 transition-all duration-300"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-green-500/30">
              <PencilSquareIconSolid className="w-6 h-6 text-green-300" />
            </div>
            <div className="flex-1">
              <blockquote className="text-lg italic text-white/90 leading-relaxed mb-3">
                "{citat.text}"
              </blockquote>
              {citat.autor && (
                <cite className="text-sm text-green-300 font-medium not-italic">
                  — {citat.autor}
                </cite>
              )}
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className="text-center py-16">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 max-w-md mx-auto">
          <PencilSquareIcon className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white/80 mb-2">Niciun citat creat</h3>
          <p className="text-white/50">
            Începe să creezi propriile citate pentru a le vedea aici.
          </p>
        </div>
      </div>
    )}
  </div>
)}
            {/* Saved Books Tab */}
            {activeTab === 'carti' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginate(savedCarti).length > 0 ? (
                  paginate(savedCarti).map((carte, index) => {
                    const autorData = autoriMap[carte.Autor];
                    return (
                      <div key={index} className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:bg-white/10 transition-all duration-300">
                        <div className="aspect-[3/4] overflow-hidden">
                          <img 
                            src={carte.coperta} 
                            alt={carte.Titlu} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-6">
                          <h2 className="text-xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors duration-200">
                            {carte.Titlu}
                          </h2>
                          {autorData ? (
                            <p className="text-sm text-purple-300 mb-3 font-medium">
                              de {autorData.prenume} {autorData.nume}
                            </p>
                          ) : carte.Autor && (
                            <p className="text-sm text-purple-300 mb-3 font-medium">
                              de {carte.Autor}
                            </p>
                          )}
                          {carte.Descriere && (
                            <p className="text-white/70 text-sm line-clamp-3 leading-relaxed">
                              {carte.Descriere}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-16">
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 max-w-md mx-auto">
                      <BookOpenIcon className="w-16 h-16 text-white/30 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white/80 mb-2">Nicio carte salvată</h3>
                      <p className="text-white/50">Explorează biblioteca și salvează cărțile care te inspiră.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Pagination */}
            {totalPages() > 1 && (
              <div className="flex justify-center mt-12">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="p-3 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-white/20"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                      </svg>
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {[...Array(Math.min(totalPages(), 5))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
                              currentPage === pageNum
                                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                                : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages()}
                      className="p-3 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-white/20"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="text-center mt-3 text-white/60 text-sm">
                    Pagina {currentPage} din {totalPages()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}