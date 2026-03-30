import axios from "axios";
  
const API_URL = "http://localhost:8080/budget/v1/api/menus";

export const getAllMenu = async (idRole:any) => {
  try {
    const response = await axios.get(`${API_URL}/role/${idRole}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
 
export const create = async (data: any) => {
  try {
    const response = await axios.post(API_URL, data);
    return response;
  } catch (error) {
    throw error;
  }
};