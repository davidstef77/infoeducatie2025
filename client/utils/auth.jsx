import axiosInstance from "./axiosInstance";

// Login function
export const Login = async (email, parola) => {
  try {
    const response = await axiosInstance.post("api/auth/login", {
      email,
      parola,
    });

    const userData = response.data;

    // Salvează token-ul și userul în localStorage
    if (userData.token) {
      localStorage.setItem("log-in-token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData.user));
    }

    return userData;
  } catch (error) {
    console.error("Error logging in:", error.response ? error.response.data : error.message);

    return {
      error: error.response ? error.response.data.message : "A apărut o eroare la autentificare.",
    };
  }
};

// Register function
export const Register = async (userName, prenume, nume, email, parola, preferinteGen, imagine) => {
  try {
    const response = await axiosInstance.post("api/auth/register", {
      userName,
      prenume,
      nume,
      email,
      parola,
      imagine,
      preferinteGen,
    });

    const userData = response.data;

    // Salvează token-ul și userul în localStorage
    if (userData.token) {
      localStorage.setItem("log-in-token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData.user));
    }

    return userData;
  } catch (error) {
    console.error("Error registering:", error.response ? error.response.data : error.message);

    return {
      error: error.response ? error.response.data.message : "A apărut o eroare la înregistrare.",
    };
  }
};
