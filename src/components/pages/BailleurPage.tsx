import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign,Settings2,BadgeDollarSign } from 'lucide-react';

import {createTypebailleur,deleteTypebailleur,getAllTypebailleur,updateTypebailleur} from "../../data/classification/typebailleur";
import {createBailleur,deleteBailleur,getAllBailleur,updateBailleur} from "../../data/classification/bailleur";
 
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast"; 

export default function renderBailleurPage (){ 
  const [typebailleurs, setTypebailleurs] = useState([]);
  const [bailleurs, setBailleurs] = useState([]);

    const [formData, setFormData] = useState({});
    const [modalType, setModalType] = useState("activite");
    const [showModal, setShowModal] = useState(false);


   // GET
     
       const dataTypebailleur =async ()=>{
        const data=await getAllTypebailleur(); 
        setTypebailleurs(data)   
      } 
       const dataBailleur =async ()=>{
        const data=await getAllBailleur(); 
        setBailleurs(data) 
      } 
    
      // SAVE  CREATED 
     
          const {
            register: registerBailleur,
            handleSubmit: handleSubmitBailleur,
            reset: resetBailleur,
            formState: { errors: errorsBailleur },
          } = useForm();
      
       
        const onSubmitBailleur = async (data:any) => { 
                try { 
                  if (!data.id) { 
                    await createBailleur(data);
                  } else { 
                    await updateBailleur(data.id,data); 
                  }
                  toast.success("Operation effectuée avec succès !");
                  resetBailleur();
                  dataBailleur();
                  closeModal();
                } catch (error:any) {
                  toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
                }
            };
      
       
         
        const hendleDelete=(id:number,type:string)=>{
          try { 
            deleteBailleur(id);  
            dataBailleur(); 
          toast.success("Supression effectuée avec succès !");
       
          } catch (error) {
          toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});  
        }
        }
       
      
       const hendleUpdata=(data:any,type:string)=>{  
            resetBailleur(data); 
            openModal('bailleur')
        
        }

      // MODAL
      const openModal = (type:any) => {
        setModalType(type);
        setFormData({});
        setShowModal(true);
      };

  const closeModal = () => {
    resetBailleur({ id:null,code: null, libelle: null,idTypeSourcefinancement:null })
    setShowModal(false); 
  };
     useEffect(()=>{
       dataTypebailleur();
         dataBailleur();
    },[])

  
const renderModalForm = () => {   
 
   if (modalType === "bailleur") {
    return (
      <form onSubmit={handleSubmitBailleur(onSubmitBailleur)} className='p-6'>
        <div className="mb-4">
          <input {...registerBailleur("id", { required: false})} readOnly hidden/>
          <label className="block text-gray-700 font-semibold mb-2">Code</label>
          <input {...registerBailleur("code", { required: "Code obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsBailleur.code ? "border-red-500" : "border-gray-300"
          }`} />
          {errorsBailleur.code && <span>{errorsBailleur.code.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Intitulé</label>
          <input {...registerBailleur("libelle", { required: "Intitulé obligatoire" })}  
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsBailleur.libelle ? "border-red-500" : "border-gray-300"
          }`}/>
          {errorsBailleur.libelle && <span>{errorsBailleur.libelle.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Bailleur</label>
          <select {...registerBailleur("idTypeSourcefinancement", { required: "Type obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsBailleur.idTypeSourcefinancement ? "border-red-500" : "border-gray-300"
          }`} >
            <option value="">Sélectionner type de bailleur</option>
            {
              typebailleurs?.map((element)=>(
                <option value={element.id}>{element.libelle}</option>
              ))
            }
          </select>
          {errorsBailleur.idTypeSourcefinancement && <span>{errorsBailleur.idTypeSourcefinancement.message}</span>}
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
  }
 
  return null;
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Bailleurs</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('bailleur')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter un Bailleur
        </button>
      </div>

      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Rechercher un bailleur..."
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>
        
        <div className="flex gap-4">
          <select className="border border-gray-300 rounded px-4 py-2">
            <option value="">Tous les types de bailleur</option>
            {typebailleurs?.map((type:any) => (
              <option key={type.id} value={type.id}>
                {type.libelle}
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
              <th className="border border-gray-300 px-4 py-2 text-left">Type de bailleur</th> 
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bailleurs?.map((bailleur, index:any) => (
              <tr key={bailleur.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{bailleur.code || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{bailleur.libelle}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {bailleur?.typSourceFinancement?.libelle || 'N/A'}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button 
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => hendleUpdata(bailleur, 'bailleur')}
                  >
                    Modifier
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => hendleDelete(bailleur.id, 'bailleur')}
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