import axios from "axios"; 

const API_URL = "http://localhost:8080/budget/v1/api/engagements";

export const getAllEngagement = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getEngagementById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createEngagement = async (data: any) => {
  try {
    const response = await axios.post(API_URL, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateEngagement = async (id: number, data: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteEngagement = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getEngagementvaliderByIdExercice = async (idExercice: number) => {
  try {
    const response = await axios.get(`${API_URL}/valider`,{
        params:{
            exercice:idExercice
        }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getEngagementretournerByIdExercice = async (idExercice: number) => {
  try {
    const response = await axios.get(`${API_URL}/retourner`,{
        params:{
            exercice:idExercice
        }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getEngagementrejeterByIdExercice = async (idExercice: number) => {
  try {
    const response = await axios.get(`${API_URL}/rejeter`,{
        params:{
            exercice:idExercice
        }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getEngagementreceptionerByIdExercice = async (idExercice: number) => {
  try {
    const response = await axios.get(`${API_URL}/receptioner`,{
        params:{
            exercice:idExercice
        }
    });
    return response;
  } catch (error) {
    throw error;
  }
};