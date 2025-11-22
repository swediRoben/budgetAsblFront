import axios from "axios";

// const API_URL = "http://localhost:8080/api/activites";
const API_URL = "http://192.168.100.53:8080/budget/v1/api/activites";

export const getAllActivite = async (projet:any,categorie:any) => {
  try {
    const response = await axios.get(API_URL,{
      params:{
        projet,
        categorie
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getActiviteById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createActivite = async (data: any) => {
  try {
    const response = await axios.post(API_URL, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateActivite = async (id: number, data: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteActivite = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
