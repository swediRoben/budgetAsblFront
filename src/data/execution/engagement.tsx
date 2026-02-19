import axios from "axios"; 

const API_URL = "http://localhost:8080/budget/v1/api/engagements";

export const getAllEngagement = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllEngagementTraitement = async (exercice:any,projet:any) => {
  try {
    const response = await axios.get(`${API_URL}/traitement`,{
      params:{
        exercice,
        projet
      }
    });
    return response.data;
  } catch (error) {
    throw [];
  }
};

export const getAllValider = async (exercice:any,projet:any,categorie:any,debut:any,fin:any,page:any,size) => {
  try {
    const response = await axios.get(`${API_URL}/valider`,{
      params:{
        exercice,
        projet,
        categorie,
        debut,
        fin,
        page,
        size
      }
    });
    return response.data;
  } catch (error) {
    throw [];
  }
};

export const getAllEngagementValiderLiquider = async (exercice:any,projet:any,ligne:any) => {
  try {
    const response = await axios.get(`${API_URL}/engagementvaliderliquidation`,{
      params:{
        exercice,
        projet,
        ligne
      }
    });
    return response.data;
  } catch (error) {
    throw [];
  }
};

export const getAllRejeter = async (exercice:any,projet:any,categorie:any,debut:any,fin:any,page:any,size:any) => {
  try {
    const response = await axios.get(`${API_URL}/rejeter`,{
      params:{
        exercice,
        projet,
        categorie,
        debut,
        fin,
        page,
        size
      }
    });
    return response.data;
  } catch (error) {
    throw [];
  }
};

export const getAllReceptionner = async (exercice:any,projet:any,categorie:any,debut:any,fin:any,page:any,size) => {
  try {
    const response = await axios.get(`${API_URL}/receptionner`,{
      params:{
        exercice,
        projet,
        categorie,
        debut,
        fin,
        page,
        size
      }
    });
    return response.data;
  } catch (error) {
    throw [];
  }
};

export const getAllRetourne = async (exercice:any,projet:any,categorie:any,debut:any,fin:any,page:any,size) => {
  try {
    const response = await axios.get(`${API_URL}/retourner`,{
      params:{
        exercice,
        projet,
        categorie,
        debut,
        fin,
        page,
        size
      }
    });
    return response.data;
  } catch (error) {
    throw [];
  }
};

export const getAllEnAttente = async (exercice:any,projet:any,categorie:any,debut:any,fin:any,page:any,size) => {
  try {
    const response = await axios.get(`${API_URL}/en_attante`,{
      params:{
        exercice,
        projet,
        categorie,
        debut,
        fin,
        page,
        size
      }
    });
    return response.data;
  } catch (error) {
    throw [];
  }
};

export const getEngagementById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response;
  } catch (error) {
    return null;
  }
};

export const createEngagement = async (data: any) => {
  try {
    const response = await axios.post(API_URL, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateEngagement = async (id: number, data: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw [];
  }
};

export const rejeterEngagement = async (id: number, data: any) => {
  try {
    const response = await axios.put(`${API_URL}/rejeter/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const retournerEngagement = async (id: number, data: any) => {
  try {
    const response = await axios.put(`${API_URL}/retourner/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const validerEngagement = async (id: number) => {
  try {
    const response = await axios.put(`${API_URL}/valider/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const receptionEngagement = async (id: number) => {
  try {
    const response = await axios.put(`${API_URL}/receptioner/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 

export const deleteEngagement = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getEngagementvaliderByIdExercice = async (idExercice: number) => {
  try {
    const response = await axios.get(`${API_URL}/valider`,{
        params:{
            exercice:idExercice
        }
    });
    return response;
  } catch (error) {
    throw [];
  }
};

export const getEngagementretournerByIdExercice = async (idExercice: number) => {
  try {
    const response = await axios.get(`${API_URL}/retourner`,{
        params:{
            exercice:idExercice
        }
    });
    return response;
  } catch (error) {
    throw [];
  }
};

export const getEngagementrejeterByIdExercice = async (idExercice: number) => {
  try {
    const response = await axios.get(`${API_URL}/rejeter`,{
        params:{
            exercice:idExercice
        }
    });
    return response;
  } catch (error) {
    throw [];
  }
};

export const getEngagementreceptionerByIdExercice = async (idExercice: number) => {
  try {
    const response = await axios.get(`${API_URL}/receptioner`,{
        params:{
            exercice:idExercice
        }
    });
    return response;
  } catch (error) {
     return [];
  }
};

export const getSommeMontantEngage = async (idExercice: any, ligne: any): Promise<number> => {
  try {
    const response = await axios.get(`${API_URL}/montant`, {
      params: { exercice: idExercice, ligne: ligne }
    });  
    return response.data;
  } catch (error) {
    return 0;
  }
};

