import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign,Settings2,BadgeDollarSign } from 'lucide-react';

import {createExercice,deleteExercice,getAllExercice,updateExercice} from "../../data/classification/exercice";
 import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast"; 

export default function renderExercicePage (){ 

 const [exerciceId, setExerciceId] = useState();
   const [exercices, setExercices] = useState([]);
  const [devises, setDevises] = useState([]);

    const [formData, setFormData] = useState({});
    const [modalType, setModalType] = useState("exercice");
    const [showModal, setShowModal] = useState(false);


   // GET
        const dataExercice =async ()=>{
        const data=await getAllExercice(); 
        setExercices(data)
      } 
    

        // CREATED 
           const {
            register: registerExercice,
            handleSubmit: handleSubmitExercice,
            reset: resetExercice,
            formState: { errors: errorsExercice },
          } = useForm();
      
              
       const onSubmitExercice = async (data:any) => { 
                try { 
                  if (!data.id) { 
                    await createExercice(data);
                  } else { 
                    await updateExercice(data.id,data); 
                  }
                  toast.success("Operation effectuée avec succès !");
                  resetExercice();
                  dataExercice();
                  closeModal();
                } catch (error:any) {
                  toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
                }
            };
        
              
        const hendleDelete=(id:number,type:string)=>{
          try { 
            deleteExercice(id);  
            dataExercice();
           toast.success("Supression effectuée avec succès !");
       
          } catch (error) {
          toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
            dataExercice();
          }
        }
      
       const hendleUpdata=(data:any,type:string)=>{ 
            resetExercice(data); 
            openModal('exercice')
        }

      // MODAL
      const openModal = (type:any) => {
        setModalType(type);
        setFormData({});
        setShowModal(true);
      };

  const closeModal = () => { 
    resetExercice({ id:null,code: null, libelle: null,dateDebut:null,dateFin:null,cloture:false})
     setShowModal(false); 
  };
     useEffect(()=>{
         dataExercice();
       },[])

  
       // SHOW MODALL 
 const renderModalForm = () => {  
    return (
      <form onSubmit={handleSubmitExercice(onSubmitExercice)} className='p-6'>
        <div className="mb-4">
          <input {...registerExercice("id", { required: false})} readOnly hidden/>
          <label className="block text-gray-700 font-semibold mb-2">Code</label>
          <input {...registerExercice("code", { required: "Code obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsExercice.code ? "border-red-500" : "border-gray-300"
          }`}/>
          {errorsExercice.code && <span>{errorsExercice.code.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Intitulé</label>
          <input {...registerExercice("libelle", { required: "Intitulé obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsClasse.libelle ? "border-red-500" : "border-gray-300"
          }`}/>
          {errorsExercice.libelle && <span>{errorsExercice.libelle.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Date de début</label>
          <input type="date" {...registerExercice("dateDebut",{ required: "date obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsExercice.dateDebut ? "border-red-500" : "border-gray-300"
          }`}/>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Date de fin</label>
          <input type="date" {...registerExercice("dateFin",{ required: "date obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsExercice.dateFin ? "border-red-500" : "border-gray-300"
          }`}/>
        </div>
 
        <div className="mb-4" style={{display:'flex'}}>
          <label className="block text-gray-700 font-semibold mb-2">preparation</label>
          <input type="checkbox" {...registerExercice("preparation",{value:false})} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsExercice.cloture ? "border-red-500" : "border-gray-300"
          }`}/>
        </div>

        <div className="mb-4" style={{display:'flex'}}>
          <label className="block text-gray-700 font-semibold mb-2">Execution</label>
          <input type="checkbox" {...registerExercice("execution",{value:false})} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsExercice.cloture ? "border-red-500" : "border-gray-300"
          }`}/>
        </div>

         <div className="mb-4" style={{display:'flex'}}>
          <label className="block text-gray-700 font-semibold mb-2">Cloture</label>
          <input type="checkbox" {...registerExercice("cloture",{value:false})} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsExercice.cloture ? "border-red-500" : "border-gray-300"
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Exercices Budgétaires</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('exercice')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter un Exercice
        </button>
      </div>

      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Rechercher un exercice..."
          className="w-full md:w-1/3 border border-gray-300 rounded px-4 py-2"
        />
      </div>
      <hr className="my-4" />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">N°</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Libellé</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Date de début</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Date de fin</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Statut</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exercices?.map((exercice, index:any) => (
              <tr key={exercice.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{exercice.code || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{exercice.libelle}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {exercice.dateDebut ? new Date(exercice.dateDebut).toLocaleDateString() : 'N/A'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {exercice.dateFin ? new Date(exercice.dateFin).toLocaleDateString() : 'N/A'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    exercice.cloture === false 
                      ? 'bg-green-100 text-green-800' 
                      : exercice.cloture === true
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {exercice.cloture && 'closed' || exercice.execution && 'executed' || exercice.preparation && 'preparation'}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button 
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => hendleUpdata(exercice, 'exercice')}
                  >
                    Modifier
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => hendleDelete(exercice.id, 'exercice')}
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