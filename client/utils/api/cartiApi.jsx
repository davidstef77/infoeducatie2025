import axiosInstance from "../axiosInstance";
import axios from "axios";
const getToken = () => {
  const token = localStorage.getItem("log-in-token");
  if (!token) {
    throw new Error("Token-ul de autentificare lipsește. Te rugăm să te autentifici din nou.");
  }
  return token;
};
export const getCarti = async () => {
  try {
    const token = getToken();
    const response = await axiosInstance.get(`api/carti`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching book:", error.response ? error.response.data : error.message);
    return {
      error: error.response ? error.response.data.message : "A apărut o eroare la obținerea cărții.",
      status: error.response ? error.response.status : 500,
    };
  }
};

export const getCarteById = async (id) => {
  try {
    const token = getToken();
    const response = await axiosInstance.get(`api/carti/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching carte by ID:", error.response ? error.response.data : error.message);
    return {
      error: error.response ? error.response.data.message : "Eroare la obținerea cărții după ID.",
      status: error.response ? error.response.status : 500,
    };
  }
};

// Funcție pentru a posta o carte
export const postCarte = async ({
   Titlu, Autor, AnulAparitiei, Gen, coperta, Descriere
}) => {
  try {
    const token = getToken();
    const response = await axiosInstance.post('api/carti/create', {
       Titlu, Autor, AnulAparitiei, Gen, coperta, Descriere
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error posting book:", error.response ? error.response.data : error.message);
    return {
      error: error.response ? error.response.data.message : "A apărut o eroare la postarea cărții.",
      status: error.response ? error.response.status : 500,
    };
  }
};

export const saveCarte = async(id) => {
  const token = getToken();
  try {
    const response = await axiosInstance.put(`api/carti/${id}/save`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error saving book:", error.response ? error.response.data : error.message);
    return {
      error: error.response ? error.response.data.message : "A apărut o eroare la salvarea cărții.",
      status: error.response ? error.response.status : 500,
    };
  }
}

export const getComentarii = async (id) => {
  try {
    
    const response = await axiosInstance.get(`api/carti/${id}/comentarii`, {
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error.response ? error.response.data : error.message);
    return {
      error: error.response ? error.response.data.message : "A apărut o eroare la obținerea comentariilor.",
      status: error.response ? error.response.status : 500,
    };
  }
} 

// Funcție pentru a adăuga un comentariu
export const addComentariu = async (id, user, text) => {
  const token = getToken();
  const response = await axiosInstance.post(`/api/carti/${id}/comentariu`, {
    user,
    text
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

