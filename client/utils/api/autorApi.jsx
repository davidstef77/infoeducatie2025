import axiosInstance from "../axiosInstance";
const getToken = () => {
  const token = localStorage.getItem("log-in-token");
  if (!token) {
    throw new Error("Token-ul de autentificare lipsește. Te rugăm să te autentifici din nou.");
  }
  return token;
};
export const getAutori = async () => {
  try {
    const token = getToken();
    const response = await axiosInstance.get(`api/autor`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching author:", error.response ? error.response.data : error.message);
    return {
      error: error.response ? error.response.data.message : "A apărut o eroare la obținerea autorului.",
      status: error.response ? error.response.status : 500,
    };
  }
};

// Funcție pentru a posta un autor
export const postAutor = async (data) => {
  try {
    const token = getToken();
    const response = await axiosInstance.post('api/autor/create', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error posting author:", error.response ? error.response.data : error.message);
    return {
      error: error.response ? error.response.data.message : "A apărut o eroare la postarea autorului.",
      status: error.response ? error.response.status : 500,
    };
  }
};

export const getAutorById = async (id) => {
  try {
    const token = getToken();
    if (!token) throw new Error("Token lipsă");

    const response = await axiosInstance.get(`api/autor/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // presupunem că aici primești obiectul `autor`
  } catch (error) {
    console.error("Eroare la obținerea autorului după ID:", error.response?.data || error.message);

    return {
      error: error.response?.data?.message || "Eroare la obținerea autorului.",
      status: error.response?.status || 500,
    };
  }
};