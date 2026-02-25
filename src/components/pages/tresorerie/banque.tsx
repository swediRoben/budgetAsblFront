import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign,Settings2,BadgeDollarSign } from 'lucide-react';

import {createBanque,deleteBanque,getAllBanque,updateBanque} from "../../../data/tresorerie/banques";

import {getAllPlancompte} from "../../../data/classification/planComptable";
 
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast"; 

export default function tresorerieBanquePage (){ 

 const [banques, setBanques] = useState([]) 
 const [plancomptables, setPlancomptables] = useState([]);
 const [idcompte, setIdcompte] = useState(null); 
  
 const [formData, setFormData] = useState({}); 
    const [showModal, setShowModal] = useState(false);


   // GET
    const dataBanque =async ()=>{
      const data=await getAllBanque(); 
      setBanques(data) 
    } 

 
   
       const dataPlancompte =async ()=>{
            const data=await getAllPlancompte(); 
            setPlancomptables(data) 
          }

     useEffect(()=>{
      dataPlancompte()
    },[])
        // CREATED 
          const {
            register: registerBanque,
            handleSubmit: handleSubmitBanque,
            reset: resetBanque,
            formState: { errors: errorsBanque },
          } = useForm();
      
         const onSubmitBanque = async (data:any) => { 
                try { 
                  if (!data.id) { 
                    await createBanque(data);
                  } else { 
                    await updateBanque(data.id,data); 
                  }
                  toast.success("Operation effectuée avec succès !");
                  resetBanque();
                  dataBanque();
                  closeModal();
                } catch (error:any) {
                  toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
                }
            };
      
          
        const hendleDelete=(id:number,type:string)=>{
          try { 
            deleteBanque(id);
            dataBanque();
          toast.success("Supression effectuée avec succès !");
       
          } catch (error) {
          toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
            dataBanque();
          }
        }
      
      
       const hendleUpdata=(data:any,type:string)=>{  
            resetBanque(data); 
            setIdcompte(data.idCompteComptable)
            openModal('') 
        }

      // MODAL
      const openModal = () => { 
        setFormData({});
        setShowModal(true);
      };

  const closeModal = () => {
    resetBanque({ id:null,code: null, libelle: null,type:null })
    setShowModal(false); 
  };
     useEffect(()=>{
         dataBanque();
       },[])

 
       // SHOW MODALL 
   const renderModalForm = () => {  
    return (
      <form onSubmit={handleSubmitBanque(onSubmitBanque)} className='p-6'>
        <div className="mb-4">
          <label>libelle</label>
           <input {...registerBanque("id", { required: false})} readOnly hidden/>
          <input {...registerBanque("libelle", { required: "nom de la banque est obligatoire" })}
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsBanque.libelle ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="nom de la banque" />
          {errorsBanque.libelle && <span>{"Code obligatoire"}</span>}
        </div>
        <div className="mb-4 display-flex">
          <label>Actif</label>
          <input type='radio' value={"true"} {...registerBanque("actif")} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsBanque.actif ? "border-red-500" : "border-gray-300"
          }`}  />
           <input type='radio' value={"false"} {...registerBanque("actif")} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsBanque.actif ? "border-red-500" : "border-gray-300"
          }`} />
          {errorsBanque.actif && <span>{"actif obligatoire"}</span>}
        </div>
        <div className="mb-4">
          <label>Compte</label>
          <select {...registerBanque("idCompteComptable", { required: "Compte est obligatoire" })}
          onChange={e=>setIdcompte(Number(e.target.value))}
                    className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsBanque.idCompteComptable ? "border-red-500" : "border-gray-300" 
          }`}>
            <option value="">Sélectionner un compte</option>
             {plancomptables.map((element) => (
                      <option key={element.id} value={element.id}>
                        {element.numero} - {element.libelle}
                      </option>
                    ))}
          </select>
          {errorsBanque.idCompteComptable && <span>{"compte obligatoire"}</span>}
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
                                             Ajouter une Banque 
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Banques </h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter une Banque
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Libellé</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Cmpte</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Actif</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
    {banques?.map((datas, i:any) => (
  <tr key={datas.id} className="hover:bg-gray-50">
    <td className="border border-gray-300 px-4 py-2">{i+1}</td>
    {/* <td className="border border-gray-300 px-4 py-2">{datas.code}</td> */}
    <td className="border border-gray-300 px-4 py-2">{datas.libelle}</td>
    {plancomptables.filter(element=>element.id===datas.idCompteComptable)
    .map((element) => ( 
    <td className="border border-gray-300 px-4 py-2"> {element.numero} - {element.libelle}</td> ))}
    <td className="border border-gray-300 px-4 py-2">{datas.actif?"activé":"bloqué"}</td>
    <td className="border border-gray-300 px-4 py-2 text-center">
      <button className="text-blue-600 hover:text-blue-800 mr-2" onClick={()=>hendleUpdata(datas,'')}>Modifier</button>
      <button className="text-red-600 hover:text-red-800" onClick={()=>hendleDelete(datas.id,'')}>Supprimer</button>
    </td>
  </tr>
))}


          </tbody>
        </table>
      </div>
    </div>
  );


}