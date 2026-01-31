import axios from "axios"; 

const API_URL = "http://localhost:8080/budget/v1/api/liquidations";

export const getAllLiquidation = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllLiquidationTraitement = async (exercice:any,projet:any) => {
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

export const getAllValiderLiqidation = async (exercice:any,projet:any,categorie:any,debut:any,fin:any,page:any,size) => {
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

export const getAllRejeter = async (exercice:any,projet:any,categorie:any,debut:any,fin:any,page:any,size) => {
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

export const getLiquidationById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response;
  } catch (error) {
    return null;
  }
};

export const createLiquidation = async (data: any) => {
  try {
    const response = await axios.post(API_URL, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateLiquidation = async (id: number, data: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw [];
  }
};

export const deleteLiquidation = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw [];
  }
};


export const getLiquidationvaliderByIdExercice = async (idExercice: number) => {
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

export const getLiquidationretournerByIdExercice = async (idExercice: number) => {
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

export const getLiquidationrejeterByIdExercice = async (idExercice: number) => {
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

export const getLiquidationreceptionerByIdExercice = async (idExercice: number) => {
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

export const getSommeMontantLiquide = async (idExercice: any, idEngement: any): Promise<number> => {
  try {
    const response = await axios.get(`${API_URL}/montant`, {
      params: { exercice: idExercice,  engagement: idEngement }
    });  
    return response.data;
  } catch (error) {
    return 0;
  }
};

