import { useState } from "react";
import Explorepage from "./ForYou/explore";
import ForYouPage from "./ForYou/fyppage";

export default function ForYou() {
  const [showFyp, setShowFyp] = useState(true);

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowFyp(true)}
          className={`px-6 py-2 rounded-l-full border border-blue-500 font-semibold transition-colors ${
            showFyp ? "bg-blue-500 text-white" : "bg-white text-blue-500 hover:bg-blue-100"
          }`}
        >
          Pentru Tine
        </button>
        <button
          onClick={() => setShowFyp(false)}
          className={`px-6 py-2 rounded-r-full border border-blue-500 font-semibold transition-colors ${
            !showFyp ? "bg-blue-500 text-white" : "bg-white text-blue-500 hover:bg-blue-100"
          }`}
        >
          Explorează
        </button>
      </div>

      {showFyp ? <ForYouPage /> : <Explorepage />}
    </div>
  );
}
