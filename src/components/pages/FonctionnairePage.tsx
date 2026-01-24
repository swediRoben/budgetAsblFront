import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign,Settings2,BadgeDollarSign } from 'lucide-react';

import {createFonctionnaire,deleteFonctionnaire,getAllFonctionnaire,updateFonctionnaire} from "../../data/utilisateur/fonctionnaire";

import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast"; 

export default function renderFonctionnairePage (){ 

const [fonctionnaires, setFonctionnaires] = useState([]);

    const [formData, setFormData] = useState({});
    const [modalType, setModalType] = useState("fonctionnaire");
    const [showModal, setShowModal] = useState(false);


   // GET 
       const dataFonctionnaire =async ()=>{
        const data=await getAllFonctionnaire(); 
        setFonctionnaires(data)   
      }  

        // CREATED  
          const {
            register: registerFonctionnaire,
            handleSubmit: handleSubmitFonctionnaire,
            reset: resetFonctionnaire,
            formState: { errors: errorsFonctionnaire },
          } = useForm();
       
    const onSubmitFonctionnaire = async (data:any) => { 
                try { 
                  if (!data.id) { 
                    await createFonctionnaire(data);
                  } else { 
                    await updateFonctionnaire(data.id,data); 
                  }
                  toast.success("Operation effectuée avec succès !");
                  resetFonctionnaire();
                  dataFonctionnaire();
                  closeModal();
                } catch (error:any) {
                  toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
                }
            };
      
  
        const hendleDelete=(id:number,type:string)=>{
          try {
            deleteFonctionnaire(id);  
            dataFonctionnaire();
          toast.success("Supression effectuée avec succès !");
       
          } catch (error) {
          toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
            dataFonctionnaire();
          }
        } 
      
       const hendleUpdata=(data:any,type:string)=>{ 
           resetFonctionnaire(data); 
            openModal('typeBailleur') 
        }

      // MODAL
      const openModal = (type:any) => {
        setModalType(type);
        setFormData({});
        setShowModal(true);
      };

  const closeModal = () => {
      resetFonctionnaire({ id:null, libelle: null })
    setShowModal(false); 
  };
     useEffect(()=>{
         dataFonctionnaire();
       },[])

  
       // SHOW MODALL 
   const renderModalForm = () => {  
 
  return (
      <form onSubmit={handleSubmitFonctionnaire(onSubmitFonctionnaire)} className='p-6'>
        <div className="mb-4">
           <input {...registerFonctionnaire("id", { required: false})} readOnly hidden/>
           
              <input {...registerFonctionnaire("nom", { required: "nom obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsFonctionnaire.nom ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ex: nom" />
          {errorsFonctionnaire.nom && <span>{"nom obligatoire"}</span>}
        </div>
        <div className="mb-4">
              <input {...registerFonctionnaire("prenom", { required: "prenom obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsFonctionnaire.prenom ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ex: prenom" />
          {errorsFonctionnaire.prenom && <span>{"prenom obligatoire"}</span>}
            </div>
            <div className="mb-4">
              <input {...registerFonctionnaire("fonction", { required: "fonction obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsFonctionnaire.fonction ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ex: fonction" />
          {errorsFonctionnaire.fonction && <span>{"fonction obligatoire"}</span>}
            </div>
            <div className="mb-4"> 
          <select  {...registerFonctionnaire("roleSysteme", { required: true })}  className=" w-full border border-gray-300 rounded px-4 py-2">
            <option value="">Roles</option> 
              <option value="AUCUN">AUCUN</option> 
              <option value="GESTIONNAIRE">GESTIONNAIRE</option> 
              <option value="RESPONSABLE">RESPONSABLE</option> 
              <option value="ORDONATEUR">ORDONATEUR</option> 
              <option value="COMPTABLE">COMPTABLE</option> 
          </select> 
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion de Fonctionnaires</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('typeBailleur')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Nouvel
        </button>
      </div>
      <hr className="my-4" />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">N°</th> 
              <th className="border border-gray-300 px-4 py-2 text-left">Nom</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Prenom</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Fonction</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>           
            {fonctionnaires?.map((type, index:any) => (
              <tr key={type.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td> 
                <td className="border border-gray-300 px-4 py-2">{type.nom}</td>
                <td className="border border-gray-300 px-4 py-2">{type.prenom}</td>
                <td className="border border-gray-300 px-4 py-2">{type.fonction}</td>
                <td className="border border-gray-300 px-4 py-2">{type.roleSysteme}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button 
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => hendleUpdata(type, 'fonctionnaire')}
                  >
                    Modifier
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => hendleDelete(type.id, 'fonctionnaire')}
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