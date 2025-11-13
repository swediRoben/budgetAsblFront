// src/services/projetService.js
import axios from "axios";

// Base URL de ton API
const API_URL = "/api/classes";

export const getAllClasse = async () => {
  try {
    
    const response = await axios.get(API_URL);  
    return response.data;
  } catch (error) {
    throw error;
  }
}

  export const getClasseById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur getProjetById:", error);
      throw error;
    }
  };
  
  
  export const createClasse = async (data) => {
    try {
      
       const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Utilisateur non authentifié");
  
      const response = await axios.post(API_URL, data,{
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      return response.data;
    } catch (error) {
      console.error("Erreur createProjet:", error);
      throw error;
    }
  };
  
  
  export const updateClasse = async (id, data) => {
    try {
      
       const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Utilisateur non authentifié");
  
      const response = await axios.put(`${API_URL}/${id}`, data,{
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":"multipart/form-data"
          }
      });
      return response.data;
    } catch (error) {
      console.error("Erreur updateProjet:", error);
      throw error;
    }
  };
  
  
  export const deleteClasse = async (id) => {
    try {
      
       const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Utilisateur non authentifié");
  
      const response = await axios.delete(`${API_URL}/${id}`,{
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      return response.data;
    } catch (error) {
      console.error("Erreur deleteProjet:", error);
      throw error;
     } 
  };
  