import React, { useEffect, useMemo, useState } from 'react';
import {  X} from 'lucide-react';

import {createActivite,deleteActivite,getAllActivite,updateActivite} from "../../data/classification/activite";
import {getAllProjet} from "../../data/classification/projet";
import {getAllCategorie} from "../../data/classification/categorie";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast"; 

export default function renderActivitePage (){

  const [projets, setProjets] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [projetId, setProjetId] = useState();
  const [exerciceId, setExerciceId] = useState();
  const [categorieId, setCategorieId] = useState();
  // const [modalType, setModalType] = useState('');
  const [activites, setActivites] = useState([]);
  const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [modalType, setModalType] = useState("activite");

     const dataActivite =async (p:any,c:any)=>{
    const data=await getAllActivite(p,c); 
    setActivites(data) 
  }
 

    useEffect(() => {
    dataProjet()
    }, []);
    

      const {
      register: registerActivite,
      handleSubmit: handleSubmitActivite,
      reset: resetActivite,
      formState: { errors: errorsActivite },
    } = useForm();

      const onSubmitActivite = async (data:any) => { 
              try { 
                if (!data.id) { 
                  await createActivite(data);
                } else { 
                  await updateActivite(data.id,data); 
                }
                toast.success("Operation effectuée avec succès !");
                resetActivite();
                 setCategories([])
                 dataActivite(projetId,null); 
                closeModal();
              } catch (error:any) {
                toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
              }
          };
    
       const hendleDelete=(id:number)=>{
          try {
            deleteActivite(id);  
            dataActivite(projetId,null);
          toast.success("Supression effectuée avec succès !");
       
          } catch (error) {
          toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}}); 
            setCategories([])
            dataActivite(projetId,null); 
        }
        }

  const hendleUpdata=(data:any,type:string)=>{ 
      resetActivite(data); 
      openModal('activite')
    
  }  

  
    const getActivites=(p:any,c:any)=>{
    dataActivite(p,c);
  }

    const dataProjet =async ()=>{
      const data=await getAllProjet(); 
      setProjets(data) 
    }
     const  getActiviteByCategorie=async (e:any)=>{ 
    const data=await getAllActivite(null,e); 
    setActivites(data) 
  } 

   const getCategorieByProjet=async (e:any)=>{ 
      setCategories([]) 
      const data=await getAllCategorie(e); 
      setProjetId(e)
      setCategories(data) 
      getActivites(e,null)
    }

    //FERMER ET VIDER TOUS LES FORMULAIRE
  const closeModal = () => {
    resetActivite({ id:null,code: null, libelle: null,type:null })
    setShowModal(false); 
  };

 
  const openModal = (type:any) => {
    setModalType(type);
    setFormData({});
    setShowModal(true);
  };

  
  const renderModalForm = () => {   
    return (
      <form onSubmit={handleSubmitActivite(onSubmitActivite)} className='p-6'>
        <div className="mb-4">
          <input {...registerActivite("id", { required: false})} readOnly hidden/>
          <label className="block text-gray-700 font-semibold mb-2">Code</label>
          <input {...registerActivite("code", { required: "Code obligatoire" })} className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsActivite.code ? "border-red-500" : "border-gray-300"
          }`}/>
          {errorsActivite.code && <span>{errorsActivite.code.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Intitulé</label>
          <input {...registerActivite("libelle", { required: "Intitulé obligatoire" })} className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsActivite.libelle ? "border-red-500" : "border-gray-300"
          }`} />
          {errorsActivite.libelle && <span>{errorsActivite.libelle.message}</span>}
        </div> 
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Projet</label>
          <select {...registerActivite("projetId", { required: "Projet obligatoire" })} className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsActivite.projet ? "border-red-500" : "border-gray-300"
          }`} onChange={(e)=>getCategorieByProjet(e.target.value)}
              onClick={dataProjet}>

            <option value="">Sélectionner un projet</option>
           {
              projets?.map((element)=>(
                <option value={element.id}>{element.libelle}</option>
              ))
            }
          </select>
          {errorsActivite.projet && <span>{errorsActivite.projet.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Catégorie</label>
          <select {...registerActivite("categorieId", { required: "Catégorie obligatoire" })} className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsActivite.categorie ? "border-red-500" : "border-gray-300"
          }`}>
            <option value="">Sélectionner une catégorie</option>
            {
              categories?.map((element)=>(
                <option value={element.id}>{element.libelle}</option>
              ))
            }
          </select>
          {errorsActivite.categorie && <span>{errorsActivite.categorie.message}</span>}
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
 
 
  return null;
};
 
return (
    <div className="bg-white rounded-lg shadow-md p-6">
         {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
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

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Activités</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('activite')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter une Activité
        </button>
      </div>

      <div className="mb-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Rechercher une activité..."
            className="flex-1 border border-gray-300 rounded px-4 py-2"
          />
          <select className="border border-gray-300 rounded px-1 py-2"
            onChange={(e)=>{getCategorieByProjet(e.target.value);}}
              onClick={dataProjet}
              >
            <option value="">Tous les projets</option>
            {projets?.map((projet:any) => (
              <option key={projet.id} value={projet.id}>
                {projet.libelle}
              </option>
            ))}
          </select>
          <select className="border border-gray-300 rounded px-1 py-2"
           onChange={(e)=>{getActiviteByCategorie(e.target.value)}}>
            <option value="">Tous les Categories</option>
            {categories?.map((data:any) => (
              <option key={data.id} value={data.id}>
                {data.libelle}
              </option>
            ))}
          </select>
        </div>
      </div>
      <hr className="my-4" />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">N°</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Libellé</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Categorie</th> 
              <th className="border border-gray-300 px-4 py-2 text-left">Projet</th> 
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activites?.map((activite, index:any) => (
              <tr key={activite.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2 font-medium">{activite.code || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{activite.libelle}</td>
               <td className="border border-gray-300 px-4 py-2">
                  {activite.categorie?.libelle || 'N/A'}
                </td> 
                <td className="border border-gray-300 px-4 py-2">
                  {activite.categorie?.projet?.libelle || 'N/A'}
                </td> 
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button 
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => hendleUpdata(activite, 'activite')}
                  >
                    Modifier
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => hendleDelete(activite.id, 'activite')}
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
 