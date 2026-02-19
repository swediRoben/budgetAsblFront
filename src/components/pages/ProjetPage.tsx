import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign,Settings2,BadgeDollarSign } from 'lucide-react';

import {createProjet,deleteProjet,getAllProjet,updateProjet} from "../../data/classification/projet";

import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast"; 

export default function renderProjetPage (){ 

  const [projets, setProjets] = useState([]);
  
    const [formData, setFormData] = useState({});
    const [modalType, setModalType] = useState("projet");
    const [showModal, setShowModal] = useState(false);


   // GET
    const dataProjet =async ()=>{
      const data=await getAllProjet(); 
      setProjets(data) 
    }
 
 
    const {
            register: registerProjet,
            handleSubmit: handleSubmitProjet,
            reset: resetProjet,
            formState: { errors: errorsProjet },
          } = useForm();
      
      const onSubmitProjet = async (data:any) => { 
              try { 
                if (!data.id) { 
                  await createProjet(data);
                } else { 
                  await updateProjet(data.id,data); 
                }
                toast.success("Operation effectuée avec succès !");
                resetProjet();
                dataProjet();
                closeModal();
              } catch (error:any) {
                toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
              }
          };

    const hendleDelete=(id:number,type:string)=>{ 
          try{
            deleteProjet(id);  
            dataProjet();
           toast.success("Supression effectuée avec succès !");
       
          } catch (error) {
          toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
            dataProjet();
          }
        } 
      
       const hendleUpdata=(data:any,type:string)=>{ 
            resetProjet(data); 
            openModal('projet')
        }

      // MODAL
      const openModal = (type:any) => {
        setModalType(type);
        setFormData({});
        setShowModal(true);
      };

  const closeModal = () => {
    resetProjet({  id:null,code: null, libelle: null,dateDebut:null,dateFin:null })
    setShowModal(false); 
  };
     useEffect(()=>{
         dataProjet();
       },[])

  
       // SHOW MODALL 
 const renderModalForm = () => {  
    return (
      <form onSubmit={handleSubmitProjet(onSubmitProjet)} className='p-6'>
        <div className="mb-4">
          <input {...registerProjet("id", { required: false})} readOnly hidden/>
          <label className="block text-gray-700 font-semibold mb-2">Code</label>
          <input {...registerProjet("code", { required: "Code obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsProjet.code ? "border-red-500" : "border-gray-300"
          }`}/>
          {errorsProjet.code && <span>{errorsProjet.code.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Intitulé</label>
          <input {...registerProjet("libelle", { required: "Intitulé obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsProjet.libelle ? "border-red-500" : "border-gray-300"
          }`}/>
          {errorsProjet.libelle && <span>{errorsProjet.libelle.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Date de début</label>
          <input type="date" {...registerProjet("dateDebut")} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsProjet.dateDebut ? "border-red-500" : "border-gray-300"
          }`}/>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Date de fin</label>
          <input type="date" {...registerProjet("dateFin")} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsProjet.dateFin ? "border-red-500" : "border-gray-300"
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Projets</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('projet')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter un Projet
        </button>
      </div>

      <div className="mb-4 flex gap-4 items-center">
        <input 
          type="text" 
          placeholder="Rechercher un projet..."
          className="flex-1 border border-gray-300 rounded px-4 py-2"
        />
        <p className="whitespace-nowrap">du</p>
        <input 
          type="date" 
          className="border border-gray-300 rounded px-4 py-2"
        />
        <p className="whitespace-nowrap">au</p>
        <input 
          type="date" 
          className="border border-gray-300 rounded px-4 py-2"
        />
      </div>
      <hr className="my-4" />
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">N°</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Intitulé</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Date de début</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Date de fin</th> 
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projets?.map((projet, index:any) => (
              <tr key={projet.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{projet.code || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{projet.libelle}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {projet.dateDebut ? new Date(projet.dateDebut).toLocaleDateString() : 'N/A'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {projet.dateFin ? new Date(projet.dateFin).toLocaleDateString() : 'N/A'}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button 
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => hendleUpdata(projet, 'projet')}
                  >
                    Modifier
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => hendleDelete(projet.id, 'projet')}
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