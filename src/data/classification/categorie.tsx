import axios from "axios";

// const API_URL = "http://localhost:8080/api/categories";
const API_URL = "http://192.168.100.53:8080/budget/v1/api/categories";

export const getAllCategorie = async (porjetId: any) => {
  try {
    const response = await axios.get(API_URL,{params:{projet:porjetId}});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllCategorieByProgramme = async (porjetId: number) => {
  try {
    const response = await axios.get(`${API_URL}/${porjetId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCategorieById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createCategorie = async (data: any) => {
  try {
    const response = await axios.post(API_URL, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateCategorie = async (id: number, data: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCategorie = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
