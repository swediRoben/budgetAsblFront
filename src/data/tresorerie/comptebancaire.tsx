 
import axios from "axios";
 
// const API_URL = "http://localhost:8080/api/Comptebancaires";
const API_URL = "http://localhost:8080/budget/v1/api/compte-bancaires";

export const getAllComptebancaire = async (banqueId:number,idDevise:number,numero:string) => {
  try {
    
    const response = await axios.get(API_URL,{
        params:{
            banqueId,
            idDevise,
            numero
        }
    });  
    return response.data;
  } catch (error) {
    return [];
  }
}

  export const getComptebancaireById = async (id:number) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response;
    } catch (error) { 
      return null;
    }
  };
  
  
  export const createComptebancaire = async (data:any) => {
    try { 
      const response = await axios.post(API_URL, data);
      return response;
    } catch (error) { 
      throw error;
    }
  };
  
  
  export const updateComptebancaire = async (id:number, data:any) => {
    try { 
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  
  export const deleteComptebancaire = async (id:number) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
     } 
  };
  