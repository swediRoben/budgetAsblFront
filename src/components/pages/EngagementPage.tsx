import React, { useEffect, useState } from 'react';
 
 import {getAllFonctionnaire} from "../../data/utilisateur/fonctionnaire";
import {createEngagement,deleteEngagement,getAllEngagement,updateEngagement,getAllValider,getAllReceptionner,getAllRejeter,getAllRetourne,getAllEnAttente,getSommeMontantEngage,getEngagementvaliderByIdExercice,getEngagementretournerByIdExercice,getEngagementrejeterByIdExercice,getEngagementreceptionerByIdExercice} from "../../data/execution/engagement"; 
import {getAllCategorie,getAllCategorieByProgramme} from "../../data/classification/categorie"; 
import {getAllPlanfontprojet} from "../../data/classification/planfontprojet";
import {getAllExercice} from "../../data/classification/exercice"; 
import {getAllPrevision} from "../../data/classification/prevision"; 
import {getAllDevise} from "../../data/classification/devise"; 

import { useForm } from "react-hook-form";
import toast from "react-hot-toast"; 

export default function renderEngagementPage (){  
  const [engagements, setEngagements] = useState([]);   
    const [beneficiaire, setBeneficiaire] = useState([]);
    const [categorie, setCategorie] = useState([]);
    const [planfondprojets, setPlanfontprojets] = useState([]);
    const [exerciceId, setExerciceId] = useState(); 
    const [projetId, setProjetId] = useState(); 
    const [categorieId, setCategorieId] = useState(); 
    const [bailleurs, setBailleurs] = useState([]); 
    const [exercices, setExercices] = useState([]); 
    const [fonctionnaires, setFonctionnaires] = useState([]);
    const [devises, setDevises] = useState([]);  
    const [previsions, setPrevisions] = useState([]); 
    const [montantVote, setMontantVote] = useState(0.0);  
    const [montantEngage, setMontantEngage] = useState(0);     
    const [debut, setDebut] = useState("");
    const [fin, setFin] = useState("");
    const [page, setPage] = useState(0);
    const [size] = useState(10);  
    const [totalPages, setTotalPages] = useState(1);
    const [status, setStatus] = useState(""); 
    
 
    const [showEngagementList, setShowEngagementList] = useState(false); 
    const dataExercice =async ()=>{
            const data=await getAllExercice(); 
            setExercices(data)
     }  

      const dataDevise =async ()=>{
         const data=await getAllDevise(); 
         setDevises(data) 
       }

  const dataFonctionnaires =async ()=>{
            const data=await getAllFonctionnaire(); 
            setFonctionnaires(data)
     }  

   const getSommeMontantEngages = async (exercice: any, ligne: any) => {
      const montant = await getSommeMontantEngage(exercice, ligne);
      console.log(montant)
      setMontantEngage(montant); 
    };

useEffect(() => {
  dataExercice(); 
  dataDevise();
  dataFonctionnaires();
}, []);

    const handleChangeExercice=async (e:any)=>{ 
        const value=e.target.value;
       setExerciceId(value)
    } 
 

    
       const getPlanfondByExercice=async (e:any)=>{ 
           const value=e.target.value;
          if (value!=="") { 
                setExerciceId(value)
               const data=await getAllPlanfontprojet(e.target.value);
               setPlanfontprojets(data)  
               }else{ 
                 setPlanfontprojets([])  
               }  
             setPrevisions([])
    }

   const getCategoriesByProjet=async (e:any)=>{ 
          setCategorie([]) 
          const data=await getAllCategorie(e); 
          setProjetId(e)
          setCategorie(data) 
        }

    const getCategorieByProjet=async (e)=>{ 
         getCategoriesByProjet(e);
         setProjetId(e)
          setEngagements([]);  
            setCategorieId(null); 
            setDebut("");
          setFin(""); 
         if (status==='RECEPTIONNE') {
        const data=await getAllReceptionner(exerciceId,e); 
         setEngagements(data);
         } else if (status==='REJETE') {
        const data=await getAllRejeter(exerciceId,e); 
         setEngagements(data); 
         } else if (status==='RETOURNE') {
        const data=await getAllRetourne(exerciceId,e); 
         setEngagements(data); 
         } else if (status==='VALIDE') {
        const data=await getAllValider(exerciceId,e); 
         setEngagements(data); 
         } else if (status==='EN_ATTENTE') {
        const data=await getAllEnAttente(exerciceId,e); 
         setEngagements(data); 
         }
    }

      const getEngagementByCategorie=async (e)=>{ 
          setEngagements([]); 
          setCategorieId(e)    
          setDebut("");
          setFin(""); 
         if (status==='RECEPTIONNE') {
        const data=await getAllReceptionner(exerciceId,projetId,e); 
         setEngagements(data);
         } else if (status==='REJETE') {
        const data=await getAllRejeter(exerciceId,projetId,e); 
         setEngagements(data); 
         } else if (status==='RETOURNE') {
        const data=await getAllRetourne(exerciceId,projetId,e); 
         setEngagements(data); 
         } else if (status==='VALIDE') {
        const data=await getAllValider(exerciceId,projetId,e); 
         setEngagements(data); 
         } else if (status==='EN_ATTENTE') {
        const data=await getAllEnAttente(exerciceId,projetId,e); 
         setEngagements(data); 
         }
    }

    const getByDate=async (e)=>{
      setEngagements([]);  
      if (debut==="") {
        setFin("");
      }else{
        setFin(e)  
         if (status==='RECEPTIONNE') {
        const data=await getAllReceptionner(exerciceId,projetId,categorieId,toOffsetDateTimeStart(debut),toOffsetDateTimeStart(e)); 
         setEngagements(data);
         } else if (status==='REJETE') {
        const data=await getAllRejeter(exerciceId,projetId,categorieId,toOffsetDateTimeStart(debut),toOffsetDateTimeStart(e)); 
         setEngagements(data); 
         } else if (status==='RETOURNE') {
        const data=await getAllRetourne(exerciceId,projetId,categorieId,toOffsetDateTimeStart(debut),toOffsetDateTimeStart(e)); 
         setEngagements(data); 
         } else if (status==='VALIDE') {
        const data=await getAllValider(exerciceId,projetId,categorieId,toOffsetDateTimeStart(debut),toOffsetDateTimeStart(e)); 
         setEngagements(data); 
         } else if (status==='EN_ATTENTE') {
        const data=await getAllEnAttente(exerciceId,projetId,categorieId,toOffsetDateTimeStart(debut),toOffsetDateTimeStart(e)); 
         setEngagements(data); 
         }
      }
    }

    const paginationPreview=async ()=>{
      if (page>0) {
        setPage(page-1);
        setTotalPages(totalPages-1);
            if (status==='RECEPTIONNE') {
        const data=await getAllReceptionner(exerciceId,projetId,categorieId,toOffsetDateTimeStart(debut),toOffsetDateTimeStart(fin),page,size); 
         setEngagements(data);
         } else if (status==='REJETE') {
        const data=await getAllRejeter(exerciceId,projetId,categorieId,toOffsetDateTimeStart(debut),toOffsetDateTimeStart(fin),page,size); 
         setEngagements(data); 
         } else if (status==='RETOURNE') {
        const data=await getAllRetourne(exerciceId,projetId,categorieId,toOffsetDateTimeStart(debut),toOffsetDateTimeStart(fin),page,size); 
         setEngagements(data); 
         } else if (status==='VALIDE') {
        const data=await getAllValider(exerciceId,projetId,categorieId,toOffsetDateTimeStart(debut),toOffsetDateTimeStart(fin),page,size); 
         setEngagements(data); 
         } else if (status==='EN_ATTENTE') {
        const data=await getAllEnAttente(exerciceId,projetId,categorieId,toOffsetDateTimeStart(debut),toOffsetDateTimeStart(fin),page,size); 
         setEngagements(data); 
         }
      } 
    }

      const paginationNext=async ()=>{ 
        setPage(page+1);
        setTotalPages(totalPages+1);
          if (status==='RECEPTIONNE') {
        const data=await getAllReceptionner(exerciceId,projetId,categorieId,toOffsetDateTimeStart(debut),toOffsetDateTimeStart(fin),page,size); 
         setEngagements(data);
         } else if (status==='REJETE') {
        const data=await getAllRejeter(exerciceId,projetId,categorieId,toOffsetDateTimeStart(debut),toOffsetDateTimeStart(fin),page,size); 
         setEngagements(data); 
         } else if (status==='RETOURNE') {
        const data=await getAllRetourne(exerciceId,projetId,categorieId,toOffsetDateTimeStart(debut),toOffsetDateTimeStart(fin),page,size); 
         setEngagements(data); 
         } else if (status==='VALIDE') {
        const data=await getAllValider(exerciceId,projetId,categorieId,toOffsetDateTimeStart(debut),toOffsetDateTimeStart(fin),page,size); 
         setEngagements(data); 
         } else if (status==='EN_ATTENTE') {
        const data=await getAllEnAttente(exerciceId,projetId,categorieId,toOffsetDateTimeStart(debut),toOffsetDateTimeStart(fin),page,size); 
         setEngagements(data); 
         } 
    }
    const getPrevisionByCategorie=async (e:any)=>{ 
        
        const value=e; 
         if (value!=="") { 
          const data=await getAllPrevision(exerciceId,projetId,e); 
          setPrevisions(data)
           }else{
              setPrevisions([])
           }
      } 
    
      
   const getPrevisionParProjet=async (e:any)=>{
        const value=e; 
        if (value!=="") { 
           setProjetId(e)
          const data=await getAllPrevision(exerciceId,e,null); 
          setPrevisions(data) 
         }
   } 

  const handleAffichePrevisionData=(data:any)=>{ 
        setMontantVote(data.montant)
        setCategorie(data.categorie);
        setBeneficiaire(data.beneficiaire)
        setBailleurs(data.source)
        getSommeMontantEngages(data.idExercice,data.id)
   }
    

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      id: null, 
      idExercice: null,
      idProjet: null,
      idPlanFondActivite: null,
      idResponsable: null,
      idDevise: null,
      tauxDevise: 0,
      montant: 0,
      objet: "",
      enAttente: true,
      dataEnAttente:null,
      observation: "",
    },
  });

   
const montantRestantFonction=(montantEngages:any)=>{ 
   return montantEngages;
}
 
const toOffsetDateTimeStart = (dateStr: string) => {
  return dateStr ? `${dateStr}T00:00:00Z` : null;
};

const toDateNormal=(dates:string)=>{
  const dateString = dates;
const date = new Date(dateString);
const formatted = date.toLocaleString()
return formatted;
}

const onSubmit = async (data) => {
  try {
    const montantRestants= montantVote-((Number(data.montant || 0)*Number(data.tauxDevise || 1))+montantEngage);  
    if (montantRestants<0) {
      toast.error("Impossibe de montant restant est negatif ")
    }else{
      if (!data.id) { 
        data.dataEnAttente=toOffsetDateTimeStart(data.dataEnAttente)
       createEngagement(data)
       toast.success("Engagement enregistré avec succes!");
       reset()
     }else{
        data.dataEnAttente=toOffsetDateTimeStart(data.dataEnAttente)
       updateEngagement(data,data.id)
       toast.success("Engagement modifié avec succes!");
       reset()
     }
    }

  } catch (error) {
    console.error("SAVE ERROR:", error);
    alert("Erreur lors de l'enregistrement !");
  }
};

 
    
 const openList=(status:string)=>{
   setEngagements([]);
   setPlanfontprojets([]);
   setCategorie([]);
   setCategorieId(null);
   setProjetId(null);
   setDebut("");
   setFin("");
  setStatus(status); 
  setShowEngagementList(true);
 }
        
      
       return (
         <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        {/* Header */}
        <div className="mb-8 border-b pb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Engagement de Dépense
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Saisie et consultation des engagements budgétaires
          </p>
         <p className="mt-3 text-sm font-medium flex flex-wrap gap-3">
        <span
          onClick={() => openList('VALIDE')}
          className="cursor-pointer select-none rounded-full
                     bg-green-50 px-4 py-1.5 text-green-700
                     border border-green-200
                     hover:bg-green-100 hover:shadow-sm transition"
        >
          Validé <strong>3</strong>
        </span>
      
  <span
          onClick={() => openList('EN_ATTENTE')}
          className="cursor-pointer select-none rounded-full
                     bg-green-50 px-4 py-1.5 text-green-700
                     border border-green-200
                     hover:bg-green-100 hover:shadow-sm transition"
        >
          en attente <strong>3</strong>
        </span>
        <span
          onClick={() => openList('RETOURNE')}
          className="cursor-pointer select-none rounded-full
                     bg-yellow-50 px-4 py-1.5 text-yellow-700
                     border border-yellow-200
                     hover:bg-yellow-100 hover:shadow-sm transition"
        >
          Retourné <strong>4</strong>
        </span>
      
        <span
          onClick={() => openList('REJETE')}
          className="cursor-pointer select-none rounded-full
                     bg-red-50 px-4 py-1.5 text-red-700
                     border border-red-200
                     hover:bg-red-100 hover:shadow-sm transition"
        >
          Rejeté <strong>5</strong>
        </span>
        <span
          onClick={() => openList('RECEPTIONNE')}
          className="cursor-pointer select-none rounded-full
                     bg-blue-50 px-4 py-1.5 text-blue-700
                     border border-blue-200
                     hover:bg-blue-100 hover:shadow-sm transition"
        >
          Réceptionné <strong>6</strong>
        </span>
      </p>
      
        </div>
      
       {/* Formulaire */}
<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 <input
        type="text" 
        hidden
        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                   focus:ring-2 focus:ring-blue-500"
        {...register("id", {disabled:true})}
      />
 
    {/* Exercice */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Exercice budgétaire
      </label>
      <select 
        className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...register("idExercice", { required: "Exercice obligatoire" })}
         onChange={(e) => {
            getPlanfondByExercice(e);
            handleChangeExercice(e);
          }}
      >
        <option value="">Sélectionner</option>
       {
        exercices.map((element:any)=>(
        <option value={element.id}>{element.libelle}</option>
       ))
      }
      </select>

      {errors.idExercice && (
        <p className="text-red-600 text-xs mt-1">{errors.idExercice.message}</p>
      )}
    </div>

    {/* Date */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Date d’engagement
      </label>
      <input
        type="date"
        required
        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                   focus:ring-2 focus:ring-blue-500"
        {...register("dataEnAttente", { required: "Date obligatoire" })}
      />

      {errors.dataEnAttente && (
        <p className="text-red-600 text-xs mt-1">{errors.dataEnAttente.message}</p>
      )}
    </div>

    {/* Projet */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Projet
      </label>
      <select
        required
        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                   focus:ring-2 focus:ring-blue-500"
        {...register("idProjet", { required: "Projet obligatoire" })}
         onChange={(e)=>{getPrevisionParProjet(e.target.value)}}
      >
        <option value="">Sélectionner un projet</option>
        {
          planfondprojets.map((element:any)=>(
            <option value={element.projet.id}>{element.projet.libelle}</option>
          ))
      }
      </select>

      {errors.idProjet && (
        <p className="text-red-600 text-xs mt-1">{errors.idProjet.message}</p>
      )}
    </div>

    {/* Ligne budgétaire */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Ligne budgétaire
      </label>
       <select
          required
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                    focus:ring-2 focus:ring-blue-500"
          {...register("idPlanFondActivite", { required: "Ligne budgétaire obligatoire" })}
          onChange={(e) => {
            const selected = previsions.find((p: any) => p.id.toString() === e.target.value);
            if (selected) handleAffichePrevisionData(selected);
          }}
        >
          <option value="">Sélectionner une ligne</option>
          {previsions?.map((element: any) => (
            <option key={element.id} value={element.id}>
              {element.activite.libelle}
            </option>
          ))}
        </select>


      {errors.idPlanFondActivite && (
        <p className="text-red-600 text-xs mt-1">{errors.idPlanFondActivite.message}</p>
      )}
    </div>

    
 {/* Categorie */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Categorie
      </label>
      <input
        type="text"
        readOnly
        className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
        value={categorie.libelle}
      />
    </div>

    
 {/* bailleur */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Bailleur
      </label>
      <input
        type="text"
        readOnly
        className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
        value={bailleurs.libelle}
      />
    </div>

    {/* Bénéficiaire */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Bénéficiaire
      </label>
      <input
        type="text"
        readOnly
        className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
        value={beneficiaire.libelle}
      />
    </div> 

    {/* Responsable */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Responsable
      </label>
      <select
        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                   focus:ring-2 focus:ring-blue-500"
        {...register("idResponsable")}
      >
        <option value="">Sélectionner</option>
         {
        fonctionnaires.map((element:any)=>(
        <option value={element.id}>{element.nom} {element.prenom}</option>
       ))
      }
      </select>
    </div>

    {/* Objet */}
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Objet de l’engagement
      </label>
      <input
        type="text"
        required
        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                   focus:ring-2 focus:ring-blue-500"
        {...register("objet", { required: "Objet obligatoire" })}
      />

      {errors.objet && (
        <p className="text-red-600 text-xs mt-1">{errors.objet.message}</p>
      )}
    </div>

     {/* Devise */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Devise
      </label>
      <select
        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                   focus:ring-2 focus:ring-blue-500"
        {...register("idDevise")}
      >
        <option value="">Sélectionner</option>
        {devises?.map((element: any) => (
            <option key={element.id} value={element.id}>
              {element.libelle}
            </option>
          ))}
      </select>
    </div>

    {/* Montant */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Montant
      </label>
      <input
        type="number"
        step="0.01"
        required
        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                   focus:ring-2 focus:ring-blue-500"
        {...register("montant", {
          required: "Montant obligatoire",
          valueAsNumber: true,
            min: {
              value: 0,
              message: "Le taux ne peut pas être inférieur à 0",
            },
        })}
      />

      {errors.montant && (
        <p className="text-red-600 text-xs mt-1">{errors.montant.message}</p>
      )}
    </div>

        {/* Taux */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Taux devise
      </label>
     <input
          type="number"
          step="0.01"
          required
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                    focus:ring-2 focus:ring-blue-500"
          defaultValue={1} // valeur par défaut
          {...register("tauxDevise", {
            required: "Taux devise obligatoire",
            valueAsNumber: true
          })}
        />


      {errors.montant && (
        <p className="text-red-600 text-xs mt-1">{errors.montant.message}</p>
      )}
    </div>

    {/* Bloc récapitulatif visuel */}
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border rounded-lg bg-gray-50 p-4">
    <div>
      <p className="text-xs text-gray-500">Montant engagé</p>
      <p className="text-lg font-semibold text-gray-800">
        {montantEngage}
      </p>
    </div>
    <div>
      <p className="text-xs text-gray-500">montant alloué</p>
      <p className="text-lg font-semibold text-blue-700">{montantVote}</p>
    </div>
    <div>
      <p className="text-xs text-gray-500">Montant restant</p>
      <p className="text-lg font-semibold text-green-700">{montantRestantFonction(montantVote-((Number(watch("montant") || 0) * Number(watch("tauxDevise") || 1))+montantEngage))}</p>
    </div>
  </div>

  {/* Observations */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Observations
    </label>
    <textarea
      readOnly
      disabled
      rows={3}
      className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                 focus:ring-2 focus:ring-blue-500"
      {...register("observation")}
    />
  </div>

  {/* Actions */}
  <div className="flex justify-end gap-3">
    <button
      type="submit"
      className="inline-flex items-center rounded-md bg-green-600 px-6 py-2 text-sm
                 font-medium text-white hover:bg-green-700 transition"
    >
      Enregistrer
    </button> 
  </div>
</form>

      
        {/* Liste */}
      {showEngagementList && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-[95%] max-w-7xl rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            📄 Liste des engagements
          </h3>
          <button
            onClick={() => setShowEngagementList(false)}
            className="text-gray-500 hover:text-red-600 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Filtres */}
        <div className="p-6 border-b grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            className="border border-gray-300 rounded px-3 py-2" 
             onChange={(e) => {
            getPlanfondByExercice(e);
            handleChangeExercice(e);
          }} 
          >
            <option value="">Exercice</option>
            {
                exercices.map((element:any)=>(
                <option value={element.id}>{element.libelle}</option>
              ))
              } 
          </select>
 

          <select
            className="border border-gray-300 rounded px-3 py-2" 
            onChange={(e)=>{getCategorieByProjet(e.target.value)}}
          >
            <option value="">Projet</option>
             {
          planfondprojets.map((element:any)=>(
            <option value={element.projet.id}>{element.projet.libelle}</option>
              ))
          }
          </select>
          

          <select
            className="border border-gray-300 rounded px-3 py-2"
            onChange={(e)=>{getEngagementByCategorie(e.target.value)}} 
          >
            <option value="">Catégorie</option>
              {
          categorie.map((element:any)=>(
            <option value={element.id}>{element.libelle}</option>
              ))
          }
          </select>

          <input
            type="date"
            className="border border-gray-300 rounded px-3 py-2" 
            value={debut} 
            onChange={(e)=>{setDebut(e.target.value);setFin("")}}
          />

          <input
            type="date"
            value={fin}
            className="border border-gray-300 rounded px-3 py-2" 
             onChange={(e)=>{getByDate(e.target.value);}}
          />
        </div>

        {/* Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left">N° Bon</th>
                  <th className="px-4 py-3 text-left">Date Engagé</th>
                  <th className="px-4 py-3 text-left">Ligne budgetaire</th>
                  <th className="px-4 py-3 text-right">Montant</th>
                  <th className="px-4 py-3 text-left">Devise</th>
                  <th className="px-4 py-3 text-center">Statut</th>
                  <th className="px-4 py-3 text-center">Date statut</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {engagements.map((eng) => (
                  <tr key={eng.id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-2">{eng.bonEngagement}</td>
                    <td className="px-4 py-2">{toDateNormal(eng.dataEnAttente)}</td>
                    <td className="px-4 py-2">
                      {eng.planActivite.activite.code}-
                      {eng.planActivite.activite.libelle}
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      {eng.montant.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-2">{eng.devise.symbole}</td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          eng.rejet
                            ? "bg-red-100 text-red-700"
                            : eng.retourner
                            ? "bg-violet-100 text-violet-700"
                            : eng.reception
                            ? "bg-blue-100 text-blue-700"
                            : eng.validation
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {eng.rejet
                          ? "Rejeté"
                          : eng.retourner
                          ? "Retourné"
                          : eng.reception
                          ? "Réceptionné"
                          : eng.validation
                          ? "Validé"
                          : "En attente"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {toDateNormal(
                        eng.rejet
                          ? eng.dataRejet
                          : eng.retourner
                          ? eng.dataRetourner
                          : eng.reception
                          ? eng.dataReception
                          : eng.validation
                          ? eng.dataValidation
                          : eng.dataEnAttente
                      )}
                    </td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button className="px-3 py-1 text-xs rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100">
                        Voir
                      </button>
                      <button className="px-3 py-1 text-xs rounded-md bg-green-50 text-green-600 hover:bg-green-100">
                        Modifier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <button
            className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
            disabled={page === 0}
            onClick={paginationPreview}
          >
            Prev
          </button>
          <span>
            Page {page + 1} / {totalPages}
          </span>
          <button
            className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300" 
            onClick={paginationNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
      )}
      
      </div>
      
        ); 
}