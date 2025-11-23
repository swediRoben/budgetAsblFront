 
import axios from "axios";
 
// const API_URL = "http://localhost:8080/api/classes";
const API_URL = "http://localhost:8080/budget/v1/api/classes";

export const getAllClasse = async () => {
  try {
    
    const response = await axios.get(API_URL);  
    return response.data;
  } catch (error) {
    throw error;
  }
}

  export const getClasseById = async (id:number) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response;
    } catch (error) { 
      throw error;
    }
  };
  
  
  export const createClasse = async (data:any) => {
    try { 
      const response = await axios.post(API_URL, data);
      return response;
    } catch (error) { 
      throw error;
    }
  };
  
  
  export const updateClasse = async (id:number, data:any) => {
    try { 
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  
  export const deleteClasse = async (id:number) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
     } 
  };
  