import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import {create,getAllRole} from "../../../data/utilisateur/role";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast"; 

export default function renderRolePage (){ 

const [roles, setRoles] = useState([]);

    const [formData, setFormData] = useState({});
    const [modalType, setModalType] = useState("typeBailleur");
    const [showModal, setShowModal] = useState(false);


   // GET 
       const dataRole =async ()=>{
        const data=await getAllRole(); 
        setRoles(data)   
      }  

        // CREATED  
          const {
            register,
            handleSubmit,
            reset,
            formState: { errors },
          } = useForm();
       
    const onSubmit = async (data:any) => { 
                try {  
                    await create(data);
                  
                  toast.success("Operation effectuée avec succès !");
                  reset();
                  dataRole();
                  closeModal();
                } catch (error:any) {
                  toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
                }
            };
      
  
        const hendleDelete=(id:number)=>{
          try {
            // delete(id);  
            dataRole();
          toast.success("Supression effectuée avec succès !");
       
          } catch (error) {
          toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
            dataRole();
          }
        } 
      
       const hendleUpdata=(data:any)=>{ 
           reset(data); 
            openModal('role') 
        }

      // MODAL
      const openModal = (type:any) => {
        setModalType(type);
        setFormData({});
        setShowModal(true);
      };

  const closeModal = () => {
      reset({ id:null, libelle: null })
    setShowModal(false); 
  };
     useEffect(()=>{
         dataRole();
       },[])

  
       // SHOW MODALL 
   const renderModalForm = () => {  
 
  return (
      <form onSubmit={handleSubmit(onSubmit)} className='p-6'>
        <div className="mb-4">
          <label>Libellé</label>
           <input {...register("id", { required: false})} readOnly hidden/>
          <input {...register("role", { required: "Role obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errors.libelle ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ex: admin" />
          {errors.libelle && <span>{"Role obligatoire"}</span>}
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
                                                                            {modalType === 'role' && 'Ajouter role systeme'}
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion Roles</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('role')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter un role systeme
        </button>
      </div>
      <hr className="my-4" />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">N°</th> 
              <th className="border border-gray-300 px-4 py-2 text-left">role</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles?.map((data, index:any) => (
              <tr key={data.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td> 
                <td className="border border-gray-300 px-4 py-2">{data.role}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button 
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => hendleUpdata(data)}
                  >
                    Modifier
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