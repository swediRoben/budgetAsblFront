 
import axios from "axios";
 
// const API_URL = "http://localhost:8080/api/Banques";
const API_URL = "http://localhost:8080/budget/v1/api/banques";

export const getAllBanque = async () => {
  try {
    
    const response = await axios.get(API_URL);  
    return response.data;
  } catch (error) {
    return [];
  }
}

  export const getBanqueById = async (id:number) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response;
    } catch (error) { 
      return null;
    }
  };
  
  
  export const createBanque = async (data:any) => {
    try { 
      const response = await axios.post(API_URL, data);
      return response;
    } catch (error) { 
      throw error;
    }
  };
  
  
  export const updateBanque = async (id:number, data:any) => {
    try { 
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  
  export const deleteBanque = async (id:number) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
     } 
  };
  