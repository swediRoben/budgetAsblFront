 
import axios from "axios";
 
// const API_URL = "http://localhost:8080/api/Journals";
const API_URL = "http://localhost:8080/budget/v1/api//api/journal-tresorerie";

export const getAllJournal = async (exerciceId:number,banqueId:number,numero:string,debut:any,fin:any) => {
  try {
    
    const response = await axios.get(API_URL,{
        params:{
            exerciceId,
            banqueId,
            numero,
            debut,
            fin
        }
    });  
    return response.data;
  } catch (error) {
    return [];
  }
}

  export const getJournalById = async (id:number) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response;
    } catch (error) { 
      return null;
    }
  };
  
  
  export const createJournal = async (data:any) => {
    try { 
      const response = await axios.post(API_URL, data);
      return response;
    } catch (error) { 
      throw error;
    }
  };
  
  
  export const updateJournal = async (id:number, data:any) => {
    try { 
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  
  export const deleteJournal = async (id:number) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
     } 
  };
  