import axiosInstance from '../axiosInstance';

export const getCitatesiCartiSalvate = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/user/${userId}/saved`);
    return response.data;
  } catch (error) {
    console.error("Eroare la încărcarea datelor salvate:", error);
    throw error;
  }
}