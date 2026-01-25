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
      <form
  onSubmit={handleSubmitExercice(onSubmitExercice)}
  className="w-full"
>
  <input {...registerExercice("id", { required: false })} readOnly hidden />

  <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 overflow-hidden">
   {/* BODY */}
    <div className="p-6 space-y-6">
      {/* INPUTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Code */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Code <span className="text-red-500">*</span>
          </label>

          <input
            {...registerExercice("code", { required: "Code obligatoire" })}
            placeholder="Ex: EX-2026"
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition
              focus:ring-4 focus:ring-blue-100 focus:border-blue-500
              ${errorsExercice.code ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-gray-200"}
            `}
          />

          {errorsExercice.code && (
            <p className="mt-2 text-xs text-red-600 font-medium">
              {errorsExercice.code.message}
            </p>
          )}
        </div>

        {/* Intitulé */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Intitulé <span className="text-red-500">*</span>
          </label>

          <input
            {...registerExercice("libelle", { required: "Intitulé obligatoire" })}
            placeholder="Ex: Exercice budgétaire 2026"
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition
              focus:ring-4 focus:ring-blue-100 focus:border-blue-500
              ${errorsExercice.libelle ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-gray-200"}
            `}
          />

          {errorsExercice.libelle && (
            <p className="mt-2 text-xs text-red-600 font-medium">
              {errorsExercice.libelle.message}
            </p>
          )}
        </div>

        {/* Date début */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Date de début <span className="text-red-500">*</span>
          </label>

          <input
            type="date"
            {...registerExercice("dateDebut", { required: "Date obligatoire" })}
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition
              focus:ring-4 focus:ring-blue-100 focus:border-blue-500
              ${errorsExercice.dateDebut ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-gray-200"}
            `}
          />

          {errorsExercice.dateDebut && (
            <p className="mt-2 text-xs text-red-600 font-medium">
              {errorsExercice.dateDebut.message}
            </p>
          )}
        </div>

        {/* Date fin */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Date de fin <span className="text-red-500">*</span>
          </label>

          <input
            type="date"
            {...registerExercice("dateFin", { required: "Date obligatoire" })}
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition
              focus:ring-4 focus:ring-blue-100 focus:border-blue-500
              ${errorsExercice.dateFin ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-gray-200"}
            `}
          />

          {errorsExercice.dateFin && (
            <p className="mt-2 text-xs text-red-600 font-medium">
              {errorsExercice.dateFin.message}
            </p>
          )}
        </div>
      </div>

      {/* STATUS SWITCHES */}
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-4">
          Statut de l’exercice
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Preparation */}
          <label className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 cursor-pointer hover:shadow-sm transition">
            <div>
              <p className="text-sm font-semibold text-gray-800">Préparation</p>
              <p className="text-xs text-gray-500">Phase de préparation</p>
            </div>

            <div className="relative">
              <input
                type="checkbox"
                {...registerExercice("preparation")}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 transition"></div>
              <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5"></div>
            </div>
          </label>

          {/* Execution */}
          <label className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 cursor-pointer hover:shadow-sm transition">
            <div>
              <p className="text-sm font-semibold text-gray-800">Exécution</p>
              <p className="text-xs text-gray-500">Phase d’exécution</p>
            </div>

            <div className="relative">
              <input
                type="checkbox"
                {...registerExercice("execution")}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-green-600 transition"></div>
              <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5"></div>
            </div>
          </label>

          {/* Cloture */}
          <label className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 cursor-pointer hover:shadow-sm transition">
            <div>
              <p className="text-sm font-semibold text-gray-800">Clôture</p>
              <p className="text-xs text-gray-500">Exercice clôturé</p>
            </div>

            <div className="relative">
              <input
                type="checkbox"
                {...registerExercice("cloture")}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-red-600 transition"></div>
              <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5"></div>
            </div>
          </label>
        </div>
      </div>
    </div>

    {/* FOOTER BUTTONS */}
    <div className="px-6 py-4 border-t border-gray-100 bg-white flex flex-col sm:flex-row gap-3">
      <button
        type="button"
        onClick={closeModal}
        className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition"
      >
        Annuler
      </button>

      <button
        type="submit"
        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 transition"
      >
        Enregistrer
      </button>
    </div>
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
                                                         {/* HEADER */}
    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
      <h2 className="text-lg font-bold text-gray-900">Créer / Modifier Exercice</h2>
      <p className="text-sm text-gray-500 mt-1">
        Remplissez les informations de l’exercice budgétaire.
      </p>
    </div>
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