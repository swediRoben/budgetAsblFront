import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign,Settings2,BadgeDollarSign } from 'lucide-react';
 import {getAllProjet} from "../../data/classification/projet";
import {createCategorie,deleteCategorie,getAllCategorie,updateCategorie,getAllCategorieByProgramme} from "../../data/classification/categorie";

import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast"; 

export default function renderCategoriePage (){ 

   const [projets, setProjets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [projetId, setProjetId] = useState();
  const [exerciceId, setExerciceId] = useState();
  const [categorieId, setCategorieId] = useState();
  
    const [formData, setFormData] = useState({});
    const [modalType, setModalType] = useState("categorie");
    const [showModal, setShowModal] = useState(false);


   // GET
     
    const dataProjet =async ()=>{
      const data=await getAllProjet(); 
      setProjets(data) 
    }
    
    const dataCategorie =async (p:any)=>{
      const data=await getAllCategorie(p); 
      setCategories(data) 
    } 
  
   const getCategorieByProjet=async (e:any)=>{ 
      const data=await getAllCategorie(e); 
      setProjetId(e)
      setCategories(data) 
    } 
     // CREATED 
       
          const {
            register: registerCategorie,
            handleSubmit: handleSubmitCategorie,
            reset: resetCategorie,
            formState: { errors: errorsCategorie },
          } = useForm();
      
    
          const onSubmitCategorie = async (data:any) => { 
                try { 
                  data.projetId=parseInt(data.projetId);
                  if (!data.id) { 
                    await createCategorie(data);
                  } else { 
                    await updateCategorie(data.id,data); 
                  }
                  toast.success("Operation effectuée avec succès !");
                  resetCategorie();
                  dataCategorie(projetId);
                  closeModal();
                } catch (error:any) {
                  toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
                }
            };
      
      
          
        const hendleDelete=(id:number,type:string)=>{
          try {
            deleteCategorie(id);  
            dataCategorie(projetId);
           toast.success("Supression effectuée avec succès !");
       
          } catch (error) {
          toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
            dataCategorie(projetId);
          }
        }

   const hendleUpdata=(data:any,type:string)=>{  
      resetCategorie(data); 
      openModal('categorie')  
  }  
       
      // MODAL
      const openModal = (type:any) => {
        setModalType(type);
        setFormData({});
        setShowModal(true);
      };

  const closeModal = () => {
    resetCategorie({ id:null,code: null, libelle: null,projetId:null }) 
    setShowModal(false); 
  };
     useEffect(()=>{
          dataProjet()
         dataCategorie(projetId);
       },[])

  
       // SHOW MODALL 
  const renderModalForm = () => {   
    return (
      <form onSubmit={handleSubmitCategorie(onSubmitCategorie)} className='p-6'>
        <div className="mb-4">
          <input {...registerCategorie("id", { required: false})} readOnly hidden/>
          <label className="block text-gray-700 font-semibold mb-2">Code</label>
          <input {...registerCategorie("code", { required: "Code obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsCategorie.code ? "border-red-500" : "border-gray-300"
          }`} />
          {errorsCategorie.code && <span>{errorsCategorie.code.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Intitulé</label>
          <input {...registerCategorie("libelle", { required: "Intitulé obligatoire" })}  
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsCategorie.libelle ? "border-red-500" : "border-gray-300"
          }`}/>
          {errorsCategorie.libelle && <span>{errorsCategorie.libelle.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Projet</label>
          <select {...registerCategorie("projetId", { required: "Projet obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsCategorie.projet ? "border-red-500" : "border-gray-300"
          }`} >
            <option value="">Sélectionner un projet</option>
            {
              projets?.map((element)=>(
                <option value={element.id}>{element.libelle}</option>
              ))
            }
          </select>
          {errorsCategorie.projet && <span>{errorsCategorie.projet.message}</span>}
        </div>
         <div className="flex gap-4 mt-6">
           <button type="button" onClick={closeModal} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition">
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Enregistrer 
         </button>
       </div>
      </form>
    ); 
};
   
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
           {showModal && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                  <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                      <h3 className="text-xl font-bold text-gray-800">
                                        {modalType === 'classe' ? 'Ajouter une Classe' : 
                                         modalType === 'planComptable' ? 'Ajouter un Compte' : 
                                         'Ajouter un Élément'}
                                      </h3>
                                      <button
                                        onClick={closeModal}
                                        className="text-gray-500 hover:text-gray-700"
                                      >
                                        <X className="w-6 h-6" />
                                      </button>
                                    </div>
                        
                                      {renderModalForm()}
                         
                                  </div>
                                </div>
                              )}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Catégories</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('categorie')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter une Catégorie
        </button>
      </div>

      <div className="mb-4 flex gap-4 items-center">
        <input 
          type="text" 
          placeholder="Rechercher une catégorie..."
          className="flex-1 border border-gray-300 rounded px-4 py-2"
        />
        <select className="border border-gray-300 rounded px-4 py-2"
          onChange={(e)=>{getCategorieByProjet(e.target.value)}}
              onClick={dataProjet}>
          <option value="">Tous les projets</option>
          {projets?.map((projet:any) => (
            <option key={projet.id} value={projet.id}>
              {projet.libelle}
            </option>
          ))}
        </select>
      </div>
      <hr className="my-4" />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">N°</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Libellé</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Projet</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((categorie, index:any) => (
              <tr key={categorie.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{categorie.code || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{categorie.libelle}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {categorie.projet?.libelle || 'N/A'}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button 
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => hendleUpdata(categorie, 'categorie')}
                  >
                    Modifier
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => hendleDelete(categorie.id, 'categorie')}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  

}