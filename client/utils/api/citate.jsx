import axiosInstance from "../axiosInstance";
import axios from "axios";

// Funcție pentru a obține token-ul
const getToken = () => {
  const token = localStorage.getItem("log-in-token");
  if (!token) {
    throw new Error("Token-ul de autentificare lipsește. Te rugăm să te autentifici din nou.");
  }
  return token;
};

// Funcție pentru a obține citatele
export const getAllCitate = async () => {
  try {
    const token = getToken();
    const response = await axiosInstance.get('api/quotes/', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching quotes:", error.response ? error.response.data : error.message);
    return {
      error: error.response ? error.response.data.message : "A apărut o eroare la obținerea citatelor.",
      status: error.response ? error.response.status : 500,
    };
  }
};

export const getCitate = async (id) => {
  try{
    const token = getToken();
    const response = await axiosInstance.get(`api/quotes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) { 
    console.error("Error fetching quotes:", error.response ? error.response.data : error.message);
    return {
      error: error.response ? error.response.data.message : "A apărut o eroare la obținerea citatelor.",
      status: error.response ? error.response.status : 500,
    };
  }};

// Funcție pentru a posta un citat
export const postCitat = async ({
  text,
  bookId,
  autorul,
  genul,
  anulAparitiei,
  userId,
  userName,
  likes = 0,
  comments = [],
  createdAt = new Date()
}) => {
  try {
    const token = getToken();
    const response = await axiosInstance.post('api/quotes/create', {
      text,
      bookId,
      autorul,
      genul,
      anulAparitiei,
      userId,
      userName,
      likes,
      comments,
      createdAt
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error posting quote:", error.response ? error.response.data : error.message);
    return {
      error: error.response ? error.response.data.message : "A apărut o eroare la postarea citatului.",
      status: error.response ? error.response.status : 500,
    };
  }
};

export const saveCitat = async (id) => {
  try {
    const token = getToken(); 
    if (!token) {
      throw new Error("Utilizator neautentificat");
    }
    const response = await axiosInstance.put(
      `api/quotes/${id}/save`, 
      {},   // Nu trimiți body pentru acest request, e ok
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error saving quote:", error.response ? error.response.data : error.message);
    return {
      error: error.response ? error.response.data.message : error.message || "A apărut o eroare la salvarea citatului.",
      status: error.response ? error.response.status : 500,
    };
  }
};



