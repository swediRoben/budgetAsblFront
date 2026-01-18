import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign,Settings2,BadgeDollarSign } from 'lucide-react';

import {createClasse,deleteClasse,getAllClasse,updateClasse} from "../../data/classification/classes";
import {createPlancompte,deletePlancompte,getAllPlancompte,updatePlancompte} from "../../data/classification/planComptable";
 import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast"; 

export default function renderPlanComptablePage (){ 

 const [classes, setClasses] = useState([]) 
  const [plancomptables, setPlancomptables] = useState([]);

    const [formData, setFormData] = useState({});
    const [modalType, setModalType] = useState("planComptable");
    const [showModal, setShowModal] = useState(false);


   // GET
    const dataClasse =async ()=>{
      const data=await getAllClasse(); 
      setClasses(data) 
    } 
   
    const dataPlancompte =async ()=>{
      const data=await getAllPlancompte(); 
      setPlancomptables(data) 
    }
    
         // CREATED 
           const {
            register: registerPlancompte,
            handleSubmit: handleSubmitPlancompte,
            reset: resetPlancompte,
            formState: { errors: errorsPlancompte },
          } = useForm();
      
          const onSubmitPlancompte = async (data:any) => { 
                try { 
                  if (!data.id) { 
                    await createPlancompte(data);
                  } else { 
                    await updatePlancompte(data.id,data); 
                  }
                  toast.success("Operation effectuée avec succès !");
                  resetPlancompte();
                  dataPlancompte();
                  closeModal();
                } catch (error:any) {
                  toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
                }
            };
      
        const hendleDelete=(id:number,type:string)=>{
          try { 
            deletePlancompte(id); 
            dataPlancompte();
          toast.success("Supression effectuée avec succès !");
       
          } catch (error) {
          toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
            dataPlancompte();
          }
        }
      
 
       const hendleUpdata=(data:any,type:string)=>{ 
            resetPlancompte(data); 
            openModal('planComptable')
        }

      // MODAL
      const openModal = (type:any) => {
        setModalType(type);
        setFormData({});
        setShowModal(true);
      };

  const closeModal = () => {
    resetPlancompte({ id:null,code: null, libelle: null,projet:null,categorie:null })
    setShowModal(false); 
  };
     useEffect(()=>{
         dataPlancompte();
    },[])

  
       // SHOW MODALL 
    const renderModalForm = () => {   
      return (
      <form onSubmit={handleSubmitPlancompte(onSubmitPlancompte)} className='p-6'>
        <div className="mb-4">
           <input {...registerPlancompte("id", { required: false})} readOnly hidden/>
          <label className="block text-gray-700 font-semibold mb-2" >Numéro de Compte</label>
          <input {...registerPlancompte("numero", { required: "Numéro obligatoire" })}  
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsPlancompte.numero ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ex: 611" />
          {errorsPlancompte.numero && <span>{errorsPlancompte.numero.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Intitulé</label>
          <input {...registerPlancompte("libelle", { required: "Intitulé obligatoire" })}
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsPlancompte.libelle ? "border-red-500" : "border-gray-300"
          }`} placeholder="Ex: Salaires et Traitements" />
          {errorsPlancompte.libelle && <span>{errorsPlancompte.libelle.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Classe</label>
          <select {...registerPlancompte("classeId", { required: false })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500`}>
            <option value="">Sélectionner une classe</option>
            {
              classes?.map((element)=>(
                <option value={element.id}>{element.libelle}</option>
              ))
            }
          </select>
         </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Statut</label>
          <select {...registerPlancompte("sens", { required: "Statut obligatoire" })}
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsPlancompte.sens ? "border-red-500" : "border-gray-300"
          }`}>
            <option value="">Sélectionner un type de compte</option>
            <option value="ACTIF">Actif</option>
            <option value="PASSIF">Passif</option>
            <option value="NEUTRE">Neutre</option>
          </select>
          {errorsPlancompte.sens && <span>{errorsPlancompte.sens.message}</span>}
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion du Plan Comptable</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('planComptable')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter un Compte
        </button>
      </div>

      <div className="mb-4 flex gap-4">
        <input 
          type="text" 
          placeholder="Rechercher un compte..."
          className="flex-1 border border-gray-300 rounded px-4 py-2"
        />
        <select className="border border-gray-300 rounded px-4 py-2">
          <option value="">Toutes les classes</option>
          {classes?.map((classe:any) => (
            <option key={classe.id} value={classe.id}>
              {classe.libelle}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">N°</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Libellé</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Classe</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plancomptables?.map((plancompte, index:any) => {
              // const classe = classes.find(c => c.id === plancompte.classeId);
              return (
                <tr key={plancompte.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{plancompte.numero}</td>
                  <td className="border border-gray-300 px-4 py-2">{plancompte.libelle}</td>
                  <td className="border border-gray-300 px-4 py-2">
                   {plancompte?.classe?.libelle ?? 'N/A'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button 
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      onClick={() => hendleUpdata(plancompte, 'planComptable')}
                    >
                      Modifier
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => hendleDelete(plancompte.id, 'planComptable')}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
   

}