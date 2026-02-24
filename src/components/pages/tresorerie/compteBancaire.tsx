 

import React, { useEffect, useState } from "react";
import { Bell, Plus, Building2, ExternalLink, Copy, X } from "lucide-react";
import { useForm } from "react-hook-form";

import {getAllBanque} from "../../../data/tresorerie/banques";
import {getAllPlancompte} from "../../../data/classification/planComptable";
import {createComptebancaire,deleteComptebancaire,getAllComptebancaire,updateComptebancaire} from "../../../data/tresorerie/comptebancaire";
import {getAllBailleur} from "../../../data/classification/bailleur";
import {getAllDevise} from "../../../data/classification/devise";

import toast from "react-hot-toast";

 
/* ===========================
   INTERFACE COMPLETE
=========================== */

 

/* ===========================
   FORMATTER €
=========================== */

const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(amount);

 

const renderTresorieCompteBancairePage: React.FC = () => {
   const [comptebancaires, setComptebancaires] = useState([]) 
   const [banques, setBanques] = useState([]) 
   const [plancomptables, setPlancomptables] = useState([]);
   
   const [idcompte, setIdcompte] = useState(null); 
   const [numerobc, setNumerobc] = useState(null); 
   const [idbanque, setIdbanque] = useState(null); 
   const [iddevise, setIddevise] = useState(null); 
   const [idsrcfinancement, setIdsrcfinancement] = useState(null); 
   const [bailleurs, setBailleurs] = useState(null);  
     const [devises, setDevises] = useState([]);

   const [formData, setFormData] = useState({});
      const [modalType, setModalType] = useState("");
      const [showModal, setShowModal] = useState(false);
  
  
     // GET
      const dataComptebancaire =async (banque:number,devise:number,numero:string)=>{
        const data=await getAllComptebancaire(banque,devise,numero); 
        setComptebancaires(data) 
      } 

           const dataBanque =async ()=>{
             const data=await getAllBanque(); 
             setBanques(data) 
           } 
              const dataPlancompte =async ()=>{
                      const data=await getAllPlancompte(); 
                      setPlancomptables(data) 
                    }
   const dataDevise =async ()=>{
        const data=await getAllDevise(); 
        setDevises(data) 
      }

            const dataBailleur =async ()=>{
              const data=await getAllBailleur(); 
              setBailleurs(data) 
            } 

          useEffect(()=>{ 
            dataBanque();
            dataDevise();
            dataBailleur();
            dataPlancompte();
           dataComptebancaire(null,null,null);
          },[])

     const search=()=>{
      dataComptebancaire(idbanque,iddevise,numerobc);
     }
          // CREATED 
            const {
              register: registerComptebancaire,
              handleSubmit: handleSubmitComptebancaire,
              reset: resetComptebancaire,
              formState: { errors: errorsComptebancaire },
            } = useForm();
        
           const onSubmitComptebancaire = async (data:any) => { 

                  try { 
                    if (!data.id) { 
                      await createComptebancaire(data);
                    } else { 
                      await updateComptebancaire(data.id,data); 
                    }
                   setNumerobc(null)
                   setIdbanque(null)
                   setIddevise(null)
                    toast.success("Operation effectuée avec succès !");
                    resetComptebancaire();
                     dataComptebancaire(null,null,null);
                    closeModal();
                  } catch (error:any) {
                   setNumerobc(null)
                   setIdbanque(null)
                   setIddevise(null)
                    toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
                     dataComptebancaire(idbanque,iddevise,numerobc);
                  }
              };
        
            
          const hendleDelete=(id:number)=>{
            try { 
              deleteComptebancaire(id);
             dataComptebancaire(null,null,null);
            toast.success("Supression effectuée avec succès !");
         
            } catch (error) {
            toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
              dataComptebancaire(idbanque,iddevise,numerobc);
            }
          }
        
        
         const hendleUpdata=(data:any)=>{  
              resetComptebancaire(data); 
              setIdcompte(data.idComteComptable);
              setIdbanque(data.idBanque)
              setIddevise(data.idDevise)
              setIdsrcfinancement(data.sourceFinacementId)
              openModal('Comptebancaire') 
          }
  
        // MODAL
        const openModal = (type:any) => {
          setModalType(type);
          setFormData({});
          setShowModal(true);
        };
  
    const closeModal = () => {
      resetComptebancaire({ id:null,code: null, libelle: null,type:null })
      setShowModal(false); 
    };
       
  
  
                // SHOW MODALL 
   const renderModalForm = () => {  
    return (
      <form onSubmit={handleSubmitComptebancaire(onSubmitComptebancaire)} className='p-6'>
        <div className="mb-4">
          <label>Numero compte</label>
           <input {...registerComptebancaire("id", { required: false})} readOnly hidden/>
          <input {...registerComptebancaire("numero", { required: "numero obligatoire" })}
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsComptebancaire.numero ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="numero compte Ex: 1" />
          {errorsComptebancaire.numero && <span>{"Code obligatoire"}</span>}
        </div>
      
          <div className="mb-4">
          <label>banque</label>
          <select {...registerComptebancaire("idBanque", { required: "banque est obligatoire" })}
          onChange={e=>setIdbanque(Number(e.target.value))}
                    className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsComptebancaire.idBanque ? "border-red-500" : "border-gray-300" 
          }`}>
            <option value="">Sélectionner un banque</option>
             {banques.map((element) => (
                      <option key={element.id} value={element.id}>
                         {element.libelle}
                      </option>
                    ))}
          </select>
          {errorsComptebancaire.idBanque && <span>{"banque obligatoire"}</span>}
        </div>

          <div className="mb-4">
          <label>Devise</label>
          <select {...registerComptebancaire("idDevise", { required: "Compte est obligatoire" })}
          onChange={e=>setIddevise(Number(e.target.value))}
                    className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsComptebancaire.idDevise ? "border-red-500" : "border-gray-300" 
          }`}>
            <option value="">Sélectionner un compte</option>
             {devises.map((element) => (
                      <option key={element.id} value={element.id}>
                         {element.libelle}
                      </option>
                    ))}
          </select>
          {errorsComptebancaire.idDevise && <span>{"devise obligatoire"}</span>}
        </div>

            <div className="mb-4">
          <label>Source de financement</label>
          <select {...registerComptebancaire("sourceFinacementId", { required: "source est obligatoire" })}
          onChange={e=>setIdsrcfinancement(Number(e.target.value))}
                    className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsComptebancaire.sourceFinacementId ? "border-red-500" : "border-gray-300" 
          }`}>
            <option value="">Sélectionner Source</option>
             {bailleurs.map((element) => (
                      <option key={element.id} value={element.id}>
                          {element.libelle}
                      </option>
                    ))}
          </select>
          {errorsComptebancaire.sourceFinacementId && <span>{"source Finacement obligatoire"}</span>}
        </div>

        <div className="mb-4">
          <label>Compte comptable</label>
          <select {...registerComptebancaire("idComteComptable", { required: "Compte est obligatoire" })}
          onChange={e=>setIdcompte(Number(e.target.value))}
                    className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsComptebancaire.idComteComptable ? "border-red-500" : "border-gray-300" 
          }`}>
            <option value="">Sélectionner un compte</option>
             {plancomptables.map((element) => (
                      <option key={element.id} value={element.id}>
                        {element.numero} - {element.libelle}
                      </option>
                    ))}
          </select>
          {errorsComptebancaire.idComteComptable && <span>{"Compte obligatoire"}</span>}
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
    <div className="min-h-screen bg-gray-50">
            {showModal && (
                                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                                              <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                                                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                                  <h3 className="text-xl font-bold text-gray-800">
                                                    {modalType === 'Comptebancaire' ? 'Ajouter une Comptebancaire' : 
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
      {/* Top Bar */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

    {/* 🔎 Zone filtres */}
    <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">

      {/* Recherche */}
      <input
        type="text"
        onChange={e => setNumerobc(e.target.value || null)}
        placeholder="Rechercher une transaction, un compte..."
        className="w-full md:w-72 px-4 py-2.5 border border-gray-300 rounded-xl
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   text-sm"
      />

      {/* Banque */}
      <select
        onChange={e => setIdbanque(Number(e.target.value))}
        className="w-full md:w-56 px-4 py-2.5 border border-gray-300 rounded-xl
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   text-sm bg-white"
      >
        <option value="">Banque</option>
        {banques.map((element) => (
          <option key={element.id} value={element.id}>
            {element.libelle}
          </option>
        ))}
      </select>

      {/* Devise */}
      <select
        onChange={e => setIddevise(Number(e.target.value))}
        className="w-full md:w-48 px-4 py-2.5 border border-gray-300 rounded-xl
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   text-sm bg-white"
      >
        <option value="">Devise</option>
        {devises.map((element) => (
          <option key={element.id} value={element.id}>
            {element.libelle}
          </option>
        ))}
      </select>

      {/* Bouton recherche */}
      <button
        type="button"
        onClick={search}
        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl
                   hover:bg-blue-700 transition-all duration-200
                   text-sm font-medium shadow-sm"
      >
        Rechercher
      </button>
    </div>

    {/* 🔔 Zone droite */}
    <div className="flex items-center justify-between lg:justify-end gap-6">
      <Bell className="text-gray-600 cursor-pointer hover:text-blue-600 transition" />

      <div className="text-right">
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          Solde global
        </p>
        <p className="text-lg font-bold text-blue-600">
          124 592,00 €
        </p>
      </div>
    </div>

  </div>
</div>

      {/* Content */}
      <div className="px-8 py-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Comptes Bancaires
            </h1>
            <p className="text-gray-500 mt-1">
              Vue d'ensemble de vos disponibilités par établissement.
            </p>
          </div>

          <button
          
          onClick={() => openModal('Comptebancaire')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <Plus size={18} />
            Ajouter un compte
          </button>
        </div>

        {/* Cards dynamiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {comptebancaires.map((element) => (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 w-full hover:shadow-md transition">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-3 rounded-xl">
            <Building2 className="text-blue-600" size={22} />
          </div>
          <div>
             {banques.filter(b=>b.id===element.idBanque)
             .map((b) => ( 
             <h3 className="font-semibold text-gray-900">{b.libelle}</h3> ))}
          
          </div>
        </div>
        <ExternalLink size={18} className="text-gray-400 cursor-pointer" />
      </div>

      {/* Balance */}
      <div className="mt-6">
        <p className="text-sm text-gray-500">Solde Total</p>
        <p className="text-3xl font-bold text-blue-600 mt-1">
          {/* {formatCurrency(balance, currency)} */}
        </p>
      </div>

      {/* Details */}
      <div className="mt-5 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Type</span>
          {/* <span className="font-medium text-gray-900">{type}</span> */}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">IBAN</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-900">{element.numero}</span>
            <Copy size={14} className="text-gray-400 cursor-pointer" />
          </div>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Disponible</span>
          <span className="text-green-600 font-medium">
            {/* {formatCurrency(availableBalance, currency)} */}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Bloqué</span>
          <span className="text-red-500 font-medium">
            {/* {formatCurrency(blockedBalance, currency)} */}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Statut</span>
          {/* <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              status === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : status === "SUSPENDED"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {status}
          </span> */}
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Dernière MàJ</span>
          {/* <span className="text-gray-900">{lastUpdate}</span> */}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-3">
        <button onClick={()=>hendleUpdata(element)} className="flex-1 border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition">
          modifier
        </button>
        <button onClick={()=>hendleDelete(element.id)} className="flex-1 bg-gray-100 rounded-lg py-2 text-sm font-medium hover:bg-gray-200 transition">
          supprimer
        </button>
      </div>
    </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default renderTresorieCompteBancairePage;

