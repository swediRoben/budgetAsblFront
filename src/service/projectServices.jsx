// src/services/projetService.js
import axios from "axios";

// Base URL de ton API
const API_URL = "https://beesbackend-production.up.railway.app/api/projets";

// ✅ Récupérer tous les projets avec pagination
export const getAllProjets = async (secteur=null,page = 1, size = 10) => {
  try {
    
    const response = await axios.get(API_URL, {
      params: { secteur ,page, size },
    });  
    return response.data;
  } catch (error) {
    console.error("Erreur getAllProjets:", error);
    throw error;
  }
};

// ✅ Récupérer un projet par ID
export const getProjetById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur getProjetById:", error);
    throw error;
  }
};

// ✅ Créer un nouveau projet
export const createProjet = async (data) => {
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

// ✅ Mettre à jour un projet existant
export const updateProjet = async (id, data) => {
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

// ✅ Supprimer un projet
export const deleteProjet = async (id) => {
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
