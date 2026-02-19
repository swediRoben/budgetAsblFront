import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign,Settings2,BadgeDollarSign } from 'lucide-react';

import {createClasse,deleteClasse,getAllClasse,updateClasse} from "../../data/classification/classes";
 
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast"; 

export default function renderClassePage (){ 

 const [classes, setClasses] = useState([]) 
  
 const [formData, setFormData] = useState({});
    const [modalType, setModalType] = useState("activite");
    const [showModal, setShowModal] = useState(false);


   // GET
    const dataClasse =async ()=>{
      const data=await getAllClasse(); 
      setClasses(data) 
    } 
   
        // CREATED 
          const {
            register: registerClasse,
            handleSubmit: handleSubmitClasse,
            reset: resetClasse,
            formState: { errors: errorsClasse },
          } = useForm();
      
         const onSubmitClasse = async (data:any) => { 
                try { 
                  if (!data.id) { 
                    await createClasse(data);
                  } else { 
                    await updateClasse(data.id,data); 
                  }
                  toast.success("Operation effectuée avec succès !");
                  resetClasse();
                  dataClasse();
                  closeModal();
                } catch (error:any) {
                  toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
                }
            };
      
          
        const hendleDelete=(id:number,type:string)=>{
          try { 
            deleteClasse(id);
            dataClasse();
          toast.success("Supression effectuée avec succès !");
       
          } catch (error) {
          toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
            dataClasse();
          }
        }
      
      
       const hendleUpdata=(data:any,type:string)=>{  
            resetClasse(data); 
            openModal('classe') 
        }

      // MODAL
      const openModal = (type:any) => {
        setModalType(type);
        setFormData({});
        setShowModal(true);
      };

  const closeModal = () => {
    resetClasse({ id:null,code: null, libelle: null,type:null })
    setShowModal(false); 
  };
     useEffect(()=>{
         dataClasse();
       },[])

  
       // SHOW MODALL 
   const renderModalForm = () => {  
    return (
      <form onSubmit={handleSubmitClasse(onSubmitClasse)} className='p-6'>
        <div className="mb-4">
          <label>Code</label>
           <input {...registerClasse("id", { required: false})} readOnly hidden/>
          <input {...registerClasse("code", { required: "Code obligatoire" })}
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsClasse.code ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ex: 1" />
          {errorsClasse.code && <span>{"Code obligatoire"}</span>}
        </div>
        <div className="mb-4">
          <label>Libellé</label>
          <input {...registerClasse("libelle", { required: "Libellé obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsClasse.code ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ex: Charges de Personnel" />
          {errorsClasse.libelle && <span>{"Libellé obligatoire"}</span>}
        </div>
        <div className="mb-4">
          <label>Type</label>
          <select {...registerClasse("type", { required: "Type obligatoire" })}
                    className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsClasse.type ? "border-red-500" : "border-gray-300"
          }`}>
            <option value="">Sélectionner un type</option>
            <option value="Dépense">Dépense</option>
            <option value="Recette">Recette</option>
          </select>
          {errorsClasse.type && <span>{"Type obligatoire"}</span>}
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Classes Économiques</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('classe')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter une Classe
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Libellé</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
    {classes?.map((datas, i:any) => (
  <tr key={datas.id} className="hover:bg-gray-50">
    <td className="border border-gray-300 px-4 py-2">{i+1}</td>
    {/* <td className="border border-gray-300 px-4 py-2">{datas.code}</td> */}
    <td className="border border-gray-300 px-4 py-2">{datas.libelle}</td>
    <td className="border border-gray-300 px-4 py-2">Dépense</td>
    <td className="border border-gray-300 px-4 py-2 text-center">
      <button className="text-blue-600 hover:text-blue-800 mr-2" onClick={()=>hendleUpdata(datas,'classe')}>Modifier</button>
      <button className="text-red-600 hover:text-red-800" onClick={()=>hendleDelete(datas.id,'classe')}>Supprimer</button>
    </td>
  </tr>
))}


          </tbody>
        </table>
      </div>
    </div>
  );


}