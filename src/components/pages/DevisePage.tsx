import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign,Settings2,BadgeDollarSign } from 'lucide-react';

import {createDevise,deleteDevise,getAllDevise,updateDevise} from "../../data/classification/devise";

import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast"; 

export default function renderDevisePage (){ 

 
  const [devises, setDevises] = useState([]);

    const [formData, setFormData] = useState({});
    const [modalType, setModalType] = useState("activite");
    const [showModal, setShowModal] = useState(false);


   // GET
    
      const dataDevise =async ()=>{
        const data=await getAllDevise(); 
        setDevises(data) 
      }
    
    
        // CREATED 
        
          const {
            register: registerDevise,
            handleSubmit: handleSubmitDevise,
            reset: resetDevise,
            formState: { errors: errorsDevise },
          } = useForm();
      
     
        const onSubmitDevise = async (data:any) => { 
                try { 
                  if (!data.id) { 
                    await createDevise(data);
                  } else { 
                    await updateDevise(data.id,data); 
                  }
                  toast.success("Operation effectuée avec succès !");
                  resetDevise();
                  dataDevise();
                  closeModal();
                } catch (error:any) {
                  toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
                }
            };
      
    
        const hendleDelete=(id:number,type:string)=>{
          try {
            deleteDevise(id);  
            dataDevise();
          toast.success("Supression effectuée avec succès !");
       
          } catch (error) {
          toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
            dataDevise();
          }
        }
      
      
       const hendleUpdata=(data:any,type:string)=>{ 
      
            resetDevise(data); 
            openModal('devise') 
        }

      // MODAL
      const openModal = (type:any) => {
        setModalType(type);
        setFormData({});
        setShowModal(true);
      };

  const closeModal = () => {
   resetDevise({ id:null,code: null, libelle: null,symbole:null,actif:true })
    setShowModal(false); 
  };
     useEffect(()=>{
         dataDevise();
       },[])

  
       // SHOW MODALL 
const renderModalForm = () => {  
   return (
      <form onSubmit={handleSubmitDevise(onSubmitDevise)} className='p-6'>
        <div className="mb-4">
          <input {...registerDevise("id", { required: false})} readOnly hidden/>
          <label className="block text-gray-700 font-semibold mb-2">Code</label>
          <input {...registerDevise("code", { required: "Code obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsDevise.code ? "border-red-500" : "border-gray-300"
          }`}/>
          {errorsDevise.code && <span>{errorsDevise.code.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Intitulé</label>
          <input {...registerDevise("libelle", { required: "Intitulé obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsClasse.libelle ? "border-red-500" : "border-gray-300"
          }`}/>
          {errorsDevise.libelle && <span>{errorsDevise.libelle.message}</span>}
        </div>
         <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Symbole</label>
          <input {...registerDevise("symbole", { required: "Intitulé obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsClasse.symbole ? "border-red-500" : "border-gray-300"
          }`}/>
          {errorsDevise.symbole && <span>{errorsDevise.symbole.message}</span>}
        </div>

         <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Actif</label>
          <input type="checkbox" {...registerDevise("cloture",{value:true})} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsDevise.actif ? "border-red-500" : "border-gray-300"
          }`}/>
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Devises</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('devise')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter une Devise
        </button>
      </div>
 
      <hr className="my-4" />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">N°</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Libellé</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Symbole</th> 
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {devises?.map((devise, index:any) => (
              <tr key={devise.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2 font-medium">{devise.code || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{devise.libelle}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <span className="text-lg">{devise.symbole || 'N/A'}</span>
                </td> 
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button 
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => hendleUpdata(devise, 'devise')}
                  >
                    Modifier
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => hendleDelete(devise.id, 'devise')}
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