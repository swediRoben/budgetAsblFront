import axios from "axios";

const API_URL = "http://localhost:8080/api/planfondProjets";

export const getAllPlanfontprojet = async (exercice:any) => {
  try {
    const response = await axios.get(API_URL,{
      params:{
        exercice
      }
    }); 
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPlanfontprojetById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createPlanfontprojet = async (data: any) => {
  try { 
    const response = await axios.post(API_URL, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updatePlanfontprojet = async (id: number, data: any) => {
  try { 
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePlanfontprojet = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
