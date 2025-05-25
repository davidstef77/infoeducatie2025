import { useState } from "react";
import Explorepage from "./ForYou/explore";
import ForYouPage from "./ForYou/fyppage";

export default function ForYou() {
  const [showFyp, setShowFyp] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex space-x-1 bg-white/50 backdrop-blur-sm rounded-full p-1.5 shadow-sm border border-gray-200">
            <button
              onClick={() => setShowFyp(true)}
              className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                showFyp 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100/50"
              }`}
            >
              Pentru Tine
            </button>
            <button
              onClick={() => setShowFyp(false)}
              className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                !showFyp 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100/50"
              }`}
            >
              Explorează
            </button>
          </div>
        </div>

        {showFyp ? <ForYouPage /> : <Explorepage />}
      </div>
    </div>
  );
}