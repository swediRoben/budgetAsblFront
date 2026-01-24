import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign,Settings2,BadgeDollarSign } from 'lucide-react';

 import {getAllFonctionnaire} from "../../data/utilisateur/fonctionnaire";
import {createEngagement,deleteEngagement,getAllEngagement,updateEngagement,getEngagementvaliderByIdExercice,getEngagementretournerByIdExercice,getEngagementrejeterByIdExercice,getEngagementreceptionerByIdExercice} from "../../data/execution/engagement"; 
import {getAllProjet} from "../../data/classification/projet";
import {getAllCategorie,getAllCategorieByProgramme} from "../../data/classification/categorie"; 
import {getAllExercice} from "../../data/classification/exercice"; 
import {getAllPrevision} from "../../data/classification/prevision"; 

import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast"; 

export default function renderEngagementPage (){  
  const [engagements, setEngagements] = useState([]);   
    const [projets, setProjets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [projetId, setProjetId] = useState();
    const [exerciceId, setExerciceId] = useState();
    const [categorieId, setCategorieId] = useState();
    const [typebailleurs, setTypebailleurs] = useState([]);
    const [planfondprojets, setPlanfontprojets] = useState([]); 
    const [exercices, setExercices] = useState([]);
    const [devises, setDevises] = useState([]);  
    const [previsions, setPrevisions] = useState([]); 
    const [montantVote, setMontantVote] = useState(12000.0);  
    

    const [formData, setFormData] = useState({}); 
    const [showEngagementList, setShowEngagementList] = useState(false);
    const [showLiquidationList, setShowLiquidationList] = useState(false);
    // const [engagements, setEngagements] = useState([
    //   { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    //   { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    //   { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    //   { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    //   { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    //   { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    //   { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    //   { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    //   { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    //   { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    //   { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    //   { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    //   { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    //   { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    //   { id: 2, numero: 'ENG-2025-002', date: '2025-01-20', beneficiaire: 'Fournisseur B', montant: 3500000, statut: 'Validé' }
    // ]);
      const handleInputChange = (e:any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const {
    register,
    handleSubmit,
    formState: { errors },
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

const montantRestantFonction=(montantEngage:any)=>{ 
   return montantEngage;
}
 

const onSubmit = async (data) => {
  try {
    const montantRestant= montantVote-(Number(data.montant || 0)*Number(data.tauxDevise || 1));  
    if (montantRestant<0) {
      toast.error("Impossibe de montant restant est negatif ")
    }else{
      console.log("DATA SEND:", data);

    const payload = {
      ...data,
      enAttente: true,
    };
 
    console.log("SAVE OK:",  data);
    alert("Bon d'engagement enregistré !");
    }

  } catch (error) {
    console.error("SAVE ERROR:", error);
    alert("Erreur lors de l'enregistrement !");
  }
};


      const handleAfficherEngagementList = (e:any) => {
        e.preventDefault();
        const newEngagement = {
          id: engagements.length + 1,
          numero: `ENG-2025-${String(engagements.length + 1).padStart(3, '0')}`,
          date: formData.dateEngagement,
          beneficiaire: formData.beneficiaire,
          montant: parseFloat(formData.montantEngagement || 0),
          statut: 'En cours'
        };
        setEngagements([...engagements, newEngagement]);
        setShowEngagementList(true);
      };
    
       
        
      
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
          onClick={() => handleFilterStatus('VALIDE')}
          className="cursor-pointer select-none rounded-full
                     bg-green-50 px-4 py-1.5 text-green-700
                     border border-green-200
                     hover:bg-green-100 hover:shadow-sm transition"
        >
          Validé <strong>3</strong>
        </span>
      
        <span
          onClick={() => handleFilterStatus('RETOURNE')}
          className="cursor-pointer select-none rounded-full
                     bg-yellow-50 px-4 py-1.5 text-yellow-700
                     border border-yellow-200
                     hover:bg-yellow-100 hover:shadow-sm transition"
        >
          Retourné <strong>4</strong>
        </span>
      
        <span
          onClick={() => handleFilterStatus('REJETE')}
          className="cursor-pointer select-none rounded-full
                     bg-red-50 px-4 py-1.5 text-red-700
                     border border-red-200
                     hover:bg-red-100 hover:shadow-sm transition"
        >
          Rejeté <strong>5</strong>
        </span>
      
        <span
          onClick={() => handleFilterStatus('RECEPTIONNE')}
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

    {/* Exercice */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Exercice budgétaire
      </label>
      <select 
        className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...register("idExercice", { required: "Exercice obligatoire" })}
      >
        <option value="">Sélectionner</option>
        <option value="2024">2024</option>
        <option value="2025">2025</option>
        <option value="2026">2026</option>
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
      >
        <option value="">Sélectionner un projet</option>
        <option value="611">611 - Projet 1</option>
        <option value="612">612 - Projet 2</option>
        <option value="613">613 - Projet 3</option>
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
      >
        <option value="">Sélectionner une ligne</option>
        <option value="611">611 - Salaires et traitements</option>
        <option value="621">621 - Fournitures de bureau</option>
        <option value="622">622 - Services extérieurs</option>
      </select>

      {errors.idPlanFondActivite && (
        <p className="text-red-600 text-xs mt-1">{errors.idPlanFondActivite.message}</p>
      )}
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
        // Pas dans ton defaultValues donc on ne le met pas dans RHF
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
        <option value="1">FARAJA</option>
        <option value="2">MALU</option>
        <option value="3">ESPOIRE</option>
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
        <option value="1">FARAJA</option>
        <option value="2">MALU</option>
        <option value="3">ESPOIRE</option>
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
        {...register("tauxDevise", {
          required: "Taux devise obligatoire",
          valueAsNumber: true,
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
        {Number(watch("montant") || 0) * Number(watch("tauxDevise") || 1)}
      </p>
    </div>
    <div>
      <p className="text-xs text-gray-500">montant alloué</p>
      <p className="text-lg font-semibold text-blue-700">{montantVote}</p>
    </div>
    <div>
      <p className="text-xs text-gray-500">Montant restant</p>
      <p className="text-lg font-semibold text-green-700">{montantRestantFonction(montantVote-(Number(watch("montant") || 0) * Number(watch("tauxDevise") || 1)))}</p>
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

    <button
      type="button"
      onClick={() => setShowEngagementList(true)}
      className="inline-flex items-center rounded-md bg-blue-600 px-6 py-2 text-sm
                 font-medium text-white hover:bg-blue-700 transition"
    >
      Afficher la liste
    </button>
  </div>
</form>

      
        {/* Liste */}
      {showEngagementList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-[90%] max-w-6xl rounded-xl shadow-xl">
      
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
      
            {/* Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 text-gray-600 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left">N°</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Bénéficiaire</th>
                      <th className="px-4 py-3 text-right">Montant</th>
                      <th className="px-4 py-3 text-center">Statut</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
      
                  <tbody>
                    {engagements?.map((eng) => (
                      <tr
                        key={eng.id}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-2">{eng.numero}</td>
                        <td className="px-4 py-2">{eng.date}</td>
                        <td className="px-4 py-2">{eng.beneficiaire}</td>
      
                        <td className="px-4 py-2 text-right font-medium">
                          {eng.montant.toLocaleString('fr-FR', {
                            minimumFractionDigits: 2,
                          })}
                        </td>
      
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold
                              ${
                                eng.statut === 'Validé'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                          >
                            {eng.statut}
                          </span>
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
      
            {/* Footer */}
            <div className="flex justify-end px-6 py-4 border-t bg-gray-50 rounded-b-xl">
              <button
                onClick={() => setShowEngagementList(false)}
                className="px-4 py-2 text-sm rounded-md bg-gray-600 text-white hover:bg-gray-700"
              >
                Fermer
              </button>
            </div>
      
          </div>
        </div>
      )}
      
      </div>
      
        ); 
}