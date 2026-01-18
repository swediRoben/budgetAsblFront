import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign,Settings2,BadgeDollarSign } from 'lucide-react';

import {createBeneficiere,deleteBeneficiere,getAllBeneficiere,updateBeneficiere} from "../../data/classification/beneficiere";
 
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast"; 

export default function renderBeneficiairePage (){ 
   const [beneficieres, setBeneficieres] = useState([]);
  
    const [formData, setFormData] = useState({});
    const [modalType, setModalType] = useState("activite");
    const [showModal, setShowModal] = useState(false);


   // GET
       const dataBenefiere =async ()=>{
        const data=await getAllBeneficiere(); 
        setBeneficieres(data) 
      } 
  
         // CREATED 
           const {
            register: registerBeneficiere,
            handleSubmit: handleSubmitBeneficiere,
            reset: resetBeneficiere,
            formState: { errors: errorsBeneficiere },
          } = useForm();
          
   
          const onSubmitBeneficiere = async (data:any) => { 
                try { 
                  if (!data.id) { 
                    await createBeneficiere(data);
                  } else { 
                    await updateBeneficiere(data.id,data); 
                  }
                  toast.success("Operation effectuée avec succès !");
                  resetBeneficiere();
                  dataBenefiere();
                  closeModal();
                } catch (error:any) {
                  toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
                }
            };
      
          
        const hendleDelete=(id:number,type:string)=>{
          try { 
            deleteBeneficiere(id);  
            dataBenefiere(); 
          toast.success("Supression effectuée avec succès !");
       
          } catch (error) {
          toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
          }
        }
      
      
       const hendleUpdata=(data:any,type:string)=>{  
            resetBeneficiere(data); 
            openModal('beneficiaire') 
        }

      // MODAL
      const openModal = (type:any) => {
        setModalType(type);
        setFormData({});
        setShowModal(true);
      };

  const closeModal = () => {
      resetBeneficiere({ id:null, libelle: null})
     setShowModal(false); 
  };
     useEffect(()=>{
         dataBenefiere();
       },[])

  
       // SHOW MODALL 
  const renderModalForm = () => {  
  if (modalType === "beneficiaire") {
    return (
      <form onSubmit={handleSubmitBeneficiere(onSubmitBeneficiere)} className='p-6'>
        <div className="mb-4">
          <label>Libellé</label>
           <input {...registerBeneficiere("id", { required: false})} readOnly hidden/>
          <input {...registerBeneficiere("libelle", { required: "Libellé obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsBeneficiere.libelle ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ex: Charges de Personnel" />
          {errorsBeneficiere.libelle && <span>{"Libellé obligatoire"}</span>}
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Bénéficiaires</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('beneficiaire')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter un Bénéficiaire
        </button>
      </div>

      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Rechercher un bénéficiaire..."
          className="w-full md:w-1/3 border border-gray-300 rounded px-4 py-2"
        />
      </div>
      <hr className="my-4" />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">N°</th> 
              <th className="border border-gray-300 px-4 py-2 text-left">Libellé</th> 
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {beneficieres?.map((beneficiere, index:any) => (
              <tr key={beneficiere.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{beneficiere.libelle}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button 
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => hendleUpdata(beneficiere, 'beneficiere')}
                  >
                    Modifier
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => hendleDelete(beneficiere.id,'beneficiaire')}
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