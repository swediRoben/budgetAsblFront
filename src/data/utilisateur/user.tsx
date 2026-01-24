import axios from "axios";
  
const API_URL = "http://localhost:8080/budget/v1/api/user";

export const getAllUser = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (data: any) => {
  try {
    const response = await axios.post(API_URL, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id: number, data: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
