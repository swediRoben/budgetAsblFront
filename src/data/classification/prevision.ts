import axios from "axios";

// const API_URL = "http://localhost:8080/api/planActivites";
const API_URL = "http://localhost:8080/budget/v1/api/planActivites";

export const getAllPrevision = async (exercice:number,projet:number,categorie:number) => {
  try {
    const response = await axios.get(API_URL,{
      params:{
        exercice,projet,categorie
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPrevisionById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createPrevision = async (data: any) => {
  try {
    const response = await axios.post(API_URL, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updatePrevision = async (id: number, data: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePrevision = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
