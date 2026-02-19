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
  <form onSubmit={handleSubmitDevise(onSubmitDevise)} className="w-full">
  <input {...registerDevise("id", { required: false })} readOnly hidden />

  <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 overflow-hidden">
 

    {/* BODY */}
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Code */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Code <span className="text-red-500">*</span>
          </label>

          <input
            {...registerDevise("code", { required: "Code obligatoire" })}
            placeholder="Ex: BIF, USD, EUR"
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition
              focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500
              ${
                errorsDevise.code
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-200"
              }
            `}
          />

          {errorsDevise.code && (
            <p className="mt-2 text-xs text-red-600 font-medium">
              {errorsDevise.code.message}
            </p>
          )}
        </div>

        {/* Intitulé */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Intitulé <span className="text-red-500">*</span>
          </label>

          <input
            {...registerDevise("libelle", { required: "Intitulé obligatoire" })}
            placeholder="Ex: Franc Burundais"
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition
              focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500
              ${
                errorsDevise.libelle
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-200"
              }
            `}
          />

          {errorsDevise.libelle && (
            <p className="mt-2 text-xs text-red-600 font-medium">
              {errorsDevise.libelle.message}
            </p>
          )}
        </div>

        {/* Symbole */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Symbole <span className="text-red-500">*</span>
          </label>

          <input
            {...registerDevise("symbole", { required: "Symbole obligatoire" })}
            placeholder="Ex: FBu, $, €"
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition
              focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500
              ${
                errorsDevise.symbole
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-200"
              }
            `}
          />

          {errorsDevise.symbole && (
            <p className="mt-2 text-xs text-red-600 font-medium">
              {errorsDevise.symbole.message}
            </p>
          )}
        </div>
      </div>

      {/* ACTIF SWITCH */}
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-4">
          Paramètres de la devise
        </h3>

        <label className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 cursor-pointer hover:shadow-sm transition">
          <div>
            <p className="text-sm font-semibold text-gray-800">Actif</p>
            <p className="text-xs text-gray-500">
              Active ou désactive cette devise dans le système
            </p>
          </div>

          <div className="relative">
            <input
              type="checkbox"
              {...registerDevise("actif")}
              className="peer sr-only"
            />
            <div className="h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-indigo-600 transition"></div>
            <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5"></div>
          </div>
        </label>

        {errorsDevise.actif && (
          <p className="mt-2 text-xs text-red-600 font-medium">
            {errorsDevise.actif.message}
          </p>
        )}
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
        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700 transition"
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
                                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                                              <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                                                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                                    {/* HEADER */}
                                                  <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white">
                                                    <h2 className="text-lg font-bold text-gray-900">Créer / Modifier Devise</h2>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                      Définissez les informations de la devise utilisée dans le système.
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