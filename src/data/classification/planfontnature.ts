import axios from "axios";

// const API_URL = "http://localhost:8080/api/planFonds";
const API_URL = "http://localhost:8080/budget/v1/api/planFonds";

export const getAllPlanfontnature = async (exercice:any,projet:any) => {
  try {
    const response = await axios.get(API_URL,{params:{exercice,projet}});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPlanfontnatureById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createPlanfontnature = async (data: any) => {
  try {
    const response = await axios.post(API_URL, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updatePlanfontnature = async (id: number, data: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePlanfontnature = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
