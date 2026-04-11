import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign, Settings2, BadgeDollarSign, Plus, Trash2, Save, Printer, FolderTree, Tag, Users, Building2, Activity, Calculator } from 'lucide-react';
import { getAllClasse } from "../../data/classification/classes";
import { getAllProjet } from "../../data/classification/projet";
import { getAllCategorie } from "../../data/classification/categorie";
import { getAllBailleur } from "../../data/classification/bailleur";
import { getAllBeneficiere } from "../../data/classification/beneficiere";
import { getAllExercice } from "../../data/classification/exercice";
import { deletePlanfontprojet, getAllPlanfontprojet } from "../../data/classification/planfontprojet";
import { getAllPlanfontnature } from "../../data/classification/planfontnature";
import { createPrevision, getAllPrevision, updatePrevision } from "../../data/classification/prevision";
import { getAllActivite } from "../../data/classification/activite";
import { useFieldArray, useForm } from "react-hook-form";
import { getAllPlancompte } from "../../data/classification/planComptable";
import toast from "react-hot-toast";

export default function renderElaborationPage() {

  const [classes, setClasses] = useState([])
  const [activites, setActivites] = useState([]);
  const [projets, setProjets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [projetId, setProjetId] = useState();
  const [exerciceId, setExerciceId] = useState();
  const [planfondprojets, setPlanfontprojets] = useState([]);
  const [bailleurs, setBailleurs] = useState([]);
  const [beneficieres, setBeneficieres] = useState([]);
  const [exercices, setExercices] = useState([]);
  const [devises, setDevises] = useState([]);
  const [planfontNatures, setPlanfontNature] = useState([]);
  const [previsions, setPrevisions] = useState([]);
  const [classeplafond, setClasseplafond] = useState();
  const [montantplafond, setMontantplafond] = useState(0.0);
    const [plancomptables, setPlancomptables] = useState([]);
    const [plancomptablescharge, setPlancomptablesCharge] = useState([]);

  // ETAT DE SORTIE ACTIVITE
  const grouped = useMemo(() => {
    const res = {};
    previsions.forEach((item: any) => {
      const pid = item.projet?.id ?? item.idProjet;
      const cid = item.categorie?.id ?? item.idCategorie;
      if (!res[pid]) res[pid] = { projet: item.projet, categories: {} };
      if (!res[pid].categories[cid]) res[pid].categories[cid] = { categorie: item.categorie, acts: [] };
      const pu = Number(String(item.prixUnitaire).replace(/,/g, "")) || 0;
      const quantite = Number(String(item.quantite).replace(/,/g, "")) || 0;
      const montant = Number(String(item.montant).replace(/,/g, "")) || 0;
      res[pid].categories[cid].acts.push({ ...item, pu, quantite, montant, bailleur: item.source });
    });
    return res;
  }, [previsions]);

  const totalCategorie = (acts: any) => acts.reduce((sum, a: any) => sum + a.montant, 0);
  const totalProjet = (categories: any) => Object.values(categories).reduce((sum, cat: any) => sum + totalCategorie(cat.acts), 0);

  // GET
  const dataClasse = async () => { const data = await getAllClasse(); setClasses(data) }
  const dataProjet = async () => { const data = await getAllProjet(); setProjets(data) }
  const dataCategorie = async () => { const data = await getAllCategorie(); setCategories(data) }

  const getPrevisionParProjet = async (e: any) => {
    const value = e;
    if (value !== "") { const data = await getAllPrevision(exerciceId, e, null); setPrevisions(data) }
  }

  const getClasseInPlafondNatureByCaterie = (e: any) => {
    const id = Number(e);
    const data = planfontNatures.find(v => Number(v.idCategorie) === id);
    if (data !== undefined) {
      setClasseplafond(data?.classe);
      setMontantplafond(data.montant);
      getActiviteByCategorie(data?.idCategorie)
      getBailleurs();
      getBeneficiaires();
    } else {
      setClasseplafond(null);
      setMontantplafond(0.0);
    }
  };


      const dataPlancompte = async () => {
      try {
        const data = await getAllPlancompte();
        setPlancomptables(data);
      } catch (error) {
        console.error("Erreur chargement plan comptable:", error);
      }
    };

    useEffect(()=>{
       dataPlancompte();
    },[])
  
    
    const dataPlancompteClasse = (idclasse:any) => {
        const classeId = typeof idclasse === 'string' ? parseInt(idclasse) : idclasse; 
        const data = plancomptables.filter(p => p.classeId === classeId); 
        setPlancomptablesCharge(data); 
    };

  const dataPlanfontprojet = async (e: any) => { const data = await getAllPlanfontprojet(e); setPlanfontprojets(data) }
  const getCategorieByProjet = async (e: any) => { const data = await getAllCategorie(e); setProjetId(e); setCategories(data) }

  const getPlanfondNatureByprogramme = async (e: any) => {
    const value = e;
    getCategorieByProjet(e)
    if (value !== "") { const data = await getAllPlanfontnature(exerciceId, e); setPlanfontNature(data) }
  }

  const getPrevisionByCategorie = async (e: any) => {
    const value = e;
    if (value !== "") {
      const data = await getAllPrevision(exerciceId, projetId, e);
      setPrevisions(data)
      if (data.length > 0) {
        resetPrevision({
          idExercice: data[0].idExercice, idProjet: data[0].idProjet, idCategorie: data[0].idCategorie, idClasse: data[0].idClasse,
          details: data.map((p: any) => ({ id: p.id, idActivite: p.idActivite, idSource: p.idSource, idPlancomptable: p.idPlancomptable, idBeneficiaire: p.idBeneficiaire, quantite: p.quantite, prixUnitaire: p.prixUnitaire, montant: p.montant }))
        });
      } else {
        resetPrevision({
          idExercice: exerciceId, idProjet: projetId, idCategorie: value, idClasse: null,
          details: [{ id: null,  idSource: null, idBeneficiaire: null,idActivite: null, idPlancomptable: null, quantite: null, prixUnitaire: null, montant: null }]
        });
      }
    } else {
      resetPrevision({
        idExercice: exerciceId, idProjet: projetId, idCategorie: null, idClasse: null,
        details: [{  id: null,  idSource: null, idBeneficiaire: null,idActivite: null, idPlancomptable: null, quantite: null, prixUnitaire: null, montant: null }]
      });
    }
  }

  const getActiviteByCategorie = async (e: any) => { const data = await getAllActivite(null, e); setActivites(data) }
  const dataBailleur = async () => { const data = await getAllBailleur(); setBailleurs(data) }
  const dataBenefiere = async () => { const data = await getAllBeneficiere(); setBeneficieres(data) }
  const dataExercice = async () => { const data = await getAllExercice(); setExercices(data.filter(ex => ex.preparation)); };

  const getAllDataInTable = () => { dataExercice(); dataBailleur(); dataProjet(); dataBenefiere(); }
  useEffect(() => { getAllDataInTable(); }, [])

  useEffect(() => {
    if (classeplafond) { setPreviseValue("idClasse", classeplafond.id); }
  })

  const {
    register: registerPrevision,
    handleSubmit: handleSubmitPrevision,
    control: controlPrevision,
    setValue: setPreviseValue,
    reset: resetPrevision,
    watch,
    formState: { errors: errorsPrevision },
  } = useForm({
    defaultValues: {
      idExercice: null, idProjet: null, idCategorie: null, idClasse: null,
      details: [{ id: null, idSource: null, idBeneficiaire: null, idActivite: null,idPlancomptable:null, prixUnitaire: null, quantite: null, montant: "" }]
    }
  });

  // Fonction pour mettre à jour le montant d'une ligne spécifique
  const updateLineMontant = (index: number, prixUnitaire: number, quantite: number) => {
    const montant = (prixUnitaire || 0) * (quantite || 0);
    setPreviseValue(`details.${index}.montant`, montant);
  };

  // Calcul du montant total en temps réel
  const watchDetails = watch("details");
  const totalMontant = useMemo(() => {
    if (!watchDetails || watchDetails.length === 0) return 0;
    return watchDetails.reduce((sum, detail) => {
      const montant = parseFloat(detail.montant) || 0;
      return sum + montant;
    }, 0);
  }, [watchDetails]);

  const onSubmitPrevision = async (data: any) => {
    try {
      const exercices = data.idExercice;
      const idProjet = data.idProjet;
      const idCategorie = data.idCategorie;
      const idClasse = data.idClasse;
      await Promise.all(data.details.map(async element => {
        element.id = parseInt(element.id);
        element.idExercice = parseInt(exercices);
        element.idCategorie = parseInt(idCategorie);
        element.idProjet = parseInt(idProjet);
        element.idClasse = parseInt(idClasse);
        element.idSource = parseInt(element.idSource);
        element.idActivite = parseInt(element.idActivite);
        element.idPlancomptable = parseInt(element.idPlancomptable);
        element.idBeneficiaire = parseInt(element.idBeneficiaire);
        element.quantite = parseFloat(element.quantite);
        element.prixUnitaire = parseFloat(element.prixUnitaire);
        const montants = element.prixUnitaire * element.quantite;
        element.montant = montants === 0 ? element.montant : montants;
        if (!element.id) { await createPrevision(element); }
        else { await updatePrevision(element.id, element); }
      }))
      toast.success("Operation effectuée avec succès !");
    } catch (error: any) {
      toast.error("Erreur lors de l'operation.", { style: { backgroundColor: "red", color: "white" } });
    }
  };

  const hendleDeletePlanfondProjet = (id: number, exercice: any) => {
    try {
      deletePlanfontprojet(id);
      getPlanfondByExercice(exercice)
      toast.success("Supression effectuée avec succès !");
    } catch (error) {
      toast.error("Erreur lors de l'operation.", { style: { backgroundColor: "red", color: "white" } });
      dataClasse();
    }
  }

  const getProjets = () => { dataProjet() }
  const getBailleurs = () => { dataBailleur() }
  const getBeneficiaires = () => { dataBenefiere(); }

  const getPlanfondByExercice = async (e: any) => {
    const value = e.target.value;
    if (value !== "") {
      setExerciceId(value)
      const data = await getAllPlanfontprojet(e.target.value);
      setPlanfontprojets(data)
    } else { setPlanfontprojets([]) }
    setPlanfontNature([])
    setPrevisions([])
  }

  const addDetailLinePlanfontPrevision = () => {
    appendPrevision({ id: null, idSource: null, idBeneficiaire: null, idActivite: null,idPlancomptable:null, prixUnitaire: null, quantite: null, montant: "" });
  };

  const { fields: fieldsPrevision, append: appendPrevision, remove: removePrevision } = useFieldArray({
    control: controlPrevision,
    name: "details",
  });

  const removeDetailLinePlanfontPrevision = (index: number) => { removePrevision(index); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header avec effet glassmorphism */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Élaboration du Budget annuel
            </h1>
          </div>
          <p className="text-gray-500 ml-14">
            Remplissez l'en-tête et ajoutez les lignes budgétaires en détail
          </p>
        </div>

        <form onSubmit={handleSubmitPrevision(onSubmitPrevision)} className="space-y-6">
          {/* Carte En-tête */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-indigo-100 rounded-lg">
                <Settings2 className="w-4 h-4 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Configuration budgétaire</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Exercice */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exercice Budgétaire <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    {...registerPrevision("idExercice", { required: true })}
                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none cursor-pointer hover:border-gray-300"
                    onChange={getPlanfondByExercice}
                  >
                    <option value="">Sélectionner l'exercice</option>
                    {exercices.map((element) => (<option key={element.id} value={element.id}>{element.libelle}</option>))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {errorsPrevision.idExercice && (<p className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1"><span className="w-1 h-1 bg-red-500 rounded-full"></span>Champ obligatoire</p>)}
              </div>

              {/* Projet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Projet <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    {...registerPrevision("idProjet", { required: true })}
                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none cursor-pointer hover:border-gray-300"
                    onChange={(e) => getPlanfondNatureByprogramme(e.target.value)}
                  >
                    <option value="">Sélectionner le projet</option>
                    {projets.map((element) => (<option key={element.id} value={element.id}>{element.code} - {element.libelle}</option>))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {errorsPrevision.idProjet && (<p className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1"><span className="w-1 h-1 bg-red-500 rounded-full"></span>Champ obligatoire</p>)}
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    {...registerPrevision("idCategorie", { required: true })}
                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none cursor-pointer hover:border-gray-300"
                    onChange={(e) => { getClasseInPlafondNatureByCaterie(e.target.value); getPrevisionByCategorie(e.target.value); }}
                  >
                    <option value="">Sélectionner la catégorie</option>
                    {planfontNatures?.map((element) => (<option key={element?.categorie?.id} value={element?.categorie?.id}>{element?.categorie?.code} - {element?.categorie?.libelle}</option>))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {errorsPrevision.idCategorie && (<p className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1"><span className="w-1 h-1 bg-red-500 rounded-full"></span>Champ obligatoire</p>)}
              </div>

              {/* Classe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nature de dépense <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select onClick={(e)=>dataPlancompteClasse(e.target.value)} {...registerPrevision("idClasse", { required: true })} className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium cursor-not-allowed">
                    <option value={classeplafond?.id}>{classeplafond?.libelle || "Sélectionnez une catégorie d'abord"}</option>
                  </select>
                </div>
              </div>

              {/* Montant plafond */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <BadgeDollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Plafond budgétaire</p>
                    <p className="text-xl font-bold text-emerald-900">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(montantplafond)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carte Détails */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* En-tête de carte avec gradient */}
            <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <Layers className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Détails des Lignes Budgétaires</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Ajoutez les bailleurs, bénéficiaires, activités et montants</p>
                </div>

                <button
                  type="button"
                  onClick={addDetailLinePlanfontPrevision}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 font-semibold shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter une ligne
                </button>
              </div>
            </div>

            {/* Tableau */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Bailleur</th>
                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Bénéficiaire</th>
                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Activité</th>
                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Compte</th>
                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Prix Unitaire</th>
                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Quantité</th>
                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Montant (€)</th>
                    <th className="px-5 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-24">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {fieldsPrevision.map((field, index) => (
                    <tr key={field.id} className="hover:bg-gray-50/80 transition-colors duration-150">
                      <td hidden><input type="number" {...registerPrevision(`details.${index}.id`, { required: false })} /></td>

                      {/* Bailleur */}
                      <td className="px-5 py-3">
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select {...registerPrevision(`details.${index}.idSource`, { required: true })}
                            className="w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50/30 hover:bg-white">
                            <option value="">Source de financement</option>
                            {bailleurs.map((element) => (<option key={element.id} value={element.id}>{element.code} - {element.libelle}</option>))}
                          </select>
                        </div>
                      </td>

                      {/* Bénéficiaire */}
                      <td className="px-5 py-3">
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select {...registerPrevision(`details.${index}.idBeneficiaire`, { required: true })}
                            className="w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50/30 hover:bg-white">
                            <option value="">Bénéficiaire</option>
                            {beneficieres.map((element) => (<option key={element.id} value={element.id}>{element.libelle}</option>))}
                          </select>
                        </div>
                      </td>

                      {/* Activité */}
                      <td className="px-5 py-3">
                        <div className="relative">
                          <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select {...registerPrevision(`details.${index}.idActivite`, { required: true })}
                            className="w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50/30 hover:bg-white">
                            <option value="">Activités</option>
                            {activites.map((element) => (<option key={element.id} value={element.id}>{element.code} - {element.libelle}</option>))}
                          </select>
                        </div>
                      </td>

                            {/* plan comptable */}
                      <td className="px-5 py-3">
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select {...registerPrevision(`details.${index}.idPlancomptable`, { required: true })}
                            className="w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50/30 hover:bg-white">
                            <option value="">Compte Comptable</option>
                             {plancomptablescharge.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p?.numero} - {p.libelle}
                                </option>
                              ))}
                            </select>
                        </div>
                      </td>

                      {/* Prix unitaire */}
                      <td className="px-5 py-3">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">€</span>
                          <input 
                            type="number" 
                            step="0.01" 
                            {...registerPrevision(`details.${index}.prixUnitaire`, { 
                              required: true,
                              onChange: (e) => {
                                const prix = parseFloat(e.target.value) || 0;
                                const qte = parseFloat(watchDetails?.[index]?.quantite) || 0;
                                updateLineMontant(index, prix, qte);
                              }
                            })}
                            className="w-full rounded-lg border border-gray-200 pl-8 pr-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all [appearance:textfield]" 
                            placeholder="0,00" 
                          />
                        </div>
                      </td>

                      {/* Quantité */}
                      <td className="px-5 py-3">
                        <input 
                          type="number" 
                          step="0.01" 
                          {...registerPrevision(`details.${index}.quantite`, { 
                            required: true,
                            onChange: (e) => {
                              const qte = parseFloat(e.target.value) || 0;
                              const prix = parseFloat(watchDetails?.[index]?.prixUnitaire) || 0;
                              updateLineMontant(index, prix, qte);
                            }
                          })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all [appearance:textfield]" 
                          placeholder="0" 
                        />
                      </td>

                      {/* Montant (calculé automatiquement) */}
                      <td className="px-5 py-3">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">€</span>
                          <input 
                            type="number" 
                            step="0.01" 
                            {...registerPrevision(`details.${index}.montant`, { required: true })}
                            className="w-full rounded-lg border border-green-200 bg-green-50 pl-8 pr-3 py-2.5 text-sm text-green-700 font-semibold"
                            placeholder="Auto" 
                            readOnly
                          />
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-3 text-center">
                        <button type="button" onClick={() => removePrevision(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:text-red-700 group" title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Affichage du total et pied de carte */}
            <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-t border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-500">
                  {fieldsPrevision.length} ligne{fieldsPrevision.length > 1 ? 's' : ''} · Cliquez sur <span className="font-medium text-blue-600">+ Ajouter</span> pour insérer
                </div>

                {/* Carte de total */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl px-6 py-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-white/20 rounded-lg">
                      <BadgeDollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-white/70 font-medium">MONTANT TOTAL</p>
                      <p className="text-2xl font-bold text-white tracking-tight">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalMontant)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bouton d'enregistrement */}
            <div className="px-6 py-5 bg-white border-t border-gray-100">
              <div className="flex justify-end">
                <button type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
                  <Save className="w-4 h-4" />
                  Enregistrer le budget
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}