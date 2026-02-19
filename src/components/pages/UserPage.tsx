import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign,Settings2,BadgeDollarSign } from 'lucide-react';

import {getAllFonctionnaire} from "../../data/utilisateur/fonctionnaire";
import {createUser,deleteUser,getAllUser,updateUser} from "../../data/utilisateur/user";

import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast"; 

export default function renderUserPage (){ 

const [Users, setUsers] = useState([]); 
const [fonctionnaires, setFonctionnaires] = useState([]); 

    const [formData, setFormData] = useState({});
    const [modalType, setModalType] = useState("user");
    const [showModal, setShowModal] = useState(false);
 
   // GET 
       const dataUser =async ()=>{
        const data=await getAllUser(); 
        const fon=await getAllFonctionnaire(); 
        setFonctionnaires(fon)  
        setUsers(data)   
      }  

      useEffect(()=>{
        dataUser()
      },[])

        // CREATED  
          const {
            register: registerUser,
            handleSubmit: handleSubmitUser,
            reset: resetUser,
            formState: { errors: errorsUser },
          } = useForm();
       
    const onSubmitUser = async (data:any) => { 
        console.log(data)
                try { 
                  if (!data.id) { 
                    await createUser(data);
                  } else { 
                    await updateUser(data.id,data); 
                  }
                  toast.success("Operation effectuée avec succès !");
                  resetUser();
                  dataUser();
                  closeModal();
                } catch (error:any) {
                  toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
                }
            };
      
  
        const hendleDelete=(id:number,type:string)=>{
          try {
            deleteUser(id);  
            dataUser();
          toast.success("Supression effectuée avec succès !");
       
          } catch (error) {
          toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
            dataUser();
          }
        } 
      
       const hendleUpdata=(data:any,type:string)=>{ 
           resetUser(data); 
            openModal('typeBailleur') 
        }

      // MODAL
      const openModal = (type:any) => {
        setModalType(type);
        setFormData({});
        setShowModal(true);
      };

  const closeModal = () => {
      resetUser({ id:null, libelle: null })
    setShowModal(false); 
  };
     useEffect(()=>{
         dataUser();
       },[])

  
       // SHOW MODALL 
   const renderModalForm = () => {  
 
  return (
      <form onSubmit={handleSubmitUser(onSubmitUser)} className='p-6'>
        <div className="mb-4">
           <input {...registerUser("id", { required: false})} readOnly hidden/>
           
              <input {...registerUser("email", { required: "email obligatoire"})} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsUser.email ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ex: email@" />
          {errorsUser.email && <span>{"email obligatoire"}</span>}
        </div>
        <div className="mb-4">
              <input type='password' {...registerUser("password", { required: "password obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsUser.password ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ex: password" />
          {errorsUser.password && <span>{"password obligatoire"}</span>}
            </div>
        
            <div className="mb-4"> 
          <select  {...registerUser("fonctionnaire.id", { required: true })}  className=" w-full border border-gray-300 rounded px-4 py-2">
            <option value="">Fonctionnaire</option>  
            {
              fonctionnaires?.map((element)=>(
                <option value={element.id}>{element.nom} {element.prenom}</option>
              ))
            } 
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des UtilisateurS</h2>
      
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
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Fonctionnaire</th>  
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
 
          <tbody>           
            {Users?.map((type, index:any) => (
              <tr key={type.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td> 
                <td className="border border-gray-300 px-4 py-2">{type.email}</td>
                <td className="border border-gray-300 px-4 py-2">{type.fonctionnaire?.nom} {type.fonctionnaire?.prenom}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button 
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => hendleUpdata(type, 'user')}
                  >
                    Modifier
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => hendleDelete(type.id, 'user')}
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