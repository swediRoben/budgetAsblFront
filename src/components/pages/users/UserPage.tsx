import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import {getAllRole} from "../../../data/utilisateur/role";
import {getAllUser,create,update} from "../../../data/utilisateur/user";
import {getAllFonctionnaire} from "../../../data/utilisateur/fonctionnaire";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast"; 

export default function renderUsePage (){ 

const [roles, setRoles] = useState([]);
const [fonctionnaires, setFonctionnaires] = useState([]); 
const [Users, setUsers] = useState([]); 

    const [formData, setFormData] = useState({});
    const [modalType, setModalType] = useState("typeBailleur");
    const [showModal, setShowModal] = useState(false);

     const dataUser =async ()=>{
        const data=await getAllUser(); 
        const fon=await getAllFonctionnaire(); 
        setFonctionnaires(fon)  
        setUsers(data)   
      } 

           useEffect(()=>{
              dataUser()
            },[])

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
                  dataUser();
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
     <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">

  {/* ID caché */}
  <input {...register("id")} hidden />

  {/* Username */}
  <div>
    <label className="block mb-1 text-sm font-medium">Username</label>
    <input
      {...register("username", { required: "Username obligatoire" })}
      className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 ${
        errors.username ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"
      }`}
      placeholder="Ex: john_doe"
    />
    {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
  </div>

  {/* Password */}
  <div>
    <label className="block mb-1 text-sm font-medium">Mot de passe</label>
    <input
      type="password"
      {...register("password", { required: "Mot de passe obligatoire" })}
      className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 ${
        errors.password ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"
      }`}
      placeholder="******"
    />
    {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
  </div>

  {/* Actif */}
  <div className="flex items-center gap-2">
    <input type="checkbox" {...register("actif")} />
    <label>Actif</label>
  </div>

  {/* Role */}
  <div>
    <label className="block mb-1 text-sm font-medium">Rôle</label>
    <select
      {...register("idRole", { required: "Rôle obligatoire" })}
      className={`w-full border px-4 py-2 rounded focus:outline-none ${
        errors.idRole ? "border-red-500" : "border-gray-300"
      }`}
    >
      <option value="">-- Sélectionner un rôle --</option>
      {roles.map((r) => (
        <option key={r.id} value={r.id}>
          {r.role}
        </option>
      ))}
    </select>
    {errors.idRole && <span className="text-red-500 text-sm">{errors.idRole.message}</span>}
  </div>

  {/* Fonctionnaire */}
  <div>
    <label className="block mb-1 text-sm font-medium">Fonctionnaire</label>
    <select
      {...register("idFonctionnaire", { required: "Fonctionnaire obligatoire" })}
      className={`w-full border px-4 py-2 rounded focus:outline-none ${
        errors.idFonctionnaire ? "border-red-500" : "border-gray-300"
      }`}
    >
      <option value="">-- Sélectionner un fonctionnaire --</option>
      {fonctionnaires.map((f) => (
        <option key={f.id} value={f.id}>
          {f.nom}
        </option>
      ))}
    </select>
    {errors.idFonctionnaire && (
      <span className="text-red-500 text-sm">{errors.idFonctionnaire.message}</span>
    )}
  </div>

  {/* Buttons */}
  <div className="flex gap-4 pt-4">
    <button
      type="button"
      onClick={closeModal}
      className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
    >
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
  <table className="w-full border-collapse shadow-sm rounded-lg overflow-hidden">
    
    {/* HEADER */}
    <thead>
      <tr className="bg-gray-100 text-sm uppercase text-gray-600">
        <th className="border px-4 py-2 text-left">N°</th>
        <th className="border px-4 py-2 text-left">Username</th>
        <th className="border px-4 py-2 text-left">Rôle</th>
        <th className="border px-4 py-2 text-left">Fonctionnaire</th>
        <th className="border px-4 py-2 text-center">Statut</th>
        <th className="border px-4 py-2 text-center">Actions</th>
      </tr>
    </thead>

    {/* BODY */}
    <tbody>
      {Users?.map((user, index) => (
        <tr key={user.id} className="hover:bg-gray-50 transition">
          
          {/* Numéro */}
          <td className="border px-4 py-2">{index + 1}</td>

          {/* Username */}
          <td className="border px-4 py-2 font-medium">
            {user.username}
          </td>

          {/* Role */}
          <td className="border px-4 py-2">
            {user.role?.role || "—"}
          </td>

          {/* Fonctionnaire */}
          <td className="border px-4 py-2">
            {
              fonctionnaires.find(f => f.id === user.idFonctionnaire)
                ? `${fonctionnaires.find(f => f.id === user.idFonctionnaire).nom} ${fonctionnaires.find(f => f.id === user.idFonctionnaire).prenom}`
                : "—"
            }
          </td>

          {/* Actif */}
          <td className="border px-4 py-2 text-center">
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                user.actif
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {user.actif ? "Actif" : "Inactif"}
            </span>
          </td>

          {/* Actions */}
          <td className="border px-4 py-2 text-center">
            <button
              className="text-blue-600 hover:text-blue-800 mr-3"
              onClick={() => hendleUpdata(user)}
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