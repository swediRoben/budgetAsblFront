import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign, Settings2, BadgeDollarSign, Plus, Trash2, Save, Printer, FolderTree, Tag } from 'lucide-react';
import { createClasse, deleteClasse, getAllClasse, updateClasse } from "../../data/classification/classes";
import { createProjet, deleteProjet, getAllProjet, updateProjet } from "../../data/classification/projet";
import { createCategorie, deleteCategorie, getAllCategorie, updateCategorie, getAllCategorieByProgramme } from "../../data/classification/categorie";
import { createExercice, deleteExercice, getAllExercice, updateExercice } from "../../data/classification/exercice";
import { createPlanfontnature, deletePlanfontnature, getAllPlanfontnature, updatePlanfontnature } from "../../data/classification/planfontnature";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function renderPlafonNaturePage() {

  const [classes, setClasses] = useState([])
  const [projets, setProjets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [projetId, setProjetId] = useState();
  const [exerciceId, setExerciceId] = useState();
  const [planfondprojets, setPlanfontprojets] = useState([]);
  const [exercices, setExercices] = useState([]);
  const [planfontNatures, setPlanfontNature] = useState([]);

  // GET
  const dataClasse = async () => {
    const data = await getAllClasse();
    setClasses(data)
  }

  const dataProjet = async () => {
    const data = await getAllProjet();
    setProjets(data)
  }

  const getCategorieByProjet = async (e: any) => {
    const data = await getAllCategorie(e);
    setProjetId(e)
    setCategories(data)
  }

  const getPlanfondNatureByprogramme = async (e: any) => {
    const value = e;
    getCategorieByProjet(e)
    if (value !== "") {
      const data = await getAllPlanfontnature(exerciceId, e);
      setPlanfontNature(data)

      if (data.length > 0) {
        resetPlanfontNature({
          exercice: exerciceId,
          idProjet: value,
          details: data.map((p: any) => ({
            id: p.id,
            idCategorie: p.idCategorie,
            idClasse: p.idClasse,
            montant: p.montant,
            exercice: null
          })),
        });
      } else {
        resetPlanfontNature({
          exercice: exerciceId,
          idProjet: value,
          details: [
            { id: null, idCategorie: null, idClasse: null, montant: "", exercice: null }
          ]
        });
      }
    } else {
      resetPlanfontNature({
        exercice: exerciceId,
        idProjet: value,
        details: [
          { id: null, idCategorie: null, idClasse: null, montant: "", exercice: null }
        ]
      });
    }
  }

  const dataExercice = async () => {
    const data = await getAllExercice();
    setExercices(data.filter(ex => ex.preparation));
  };

  const getAllDataInTable = () => {
    dataExercice();
    dataClasse();
    dataProjet();
  }

  useEffect(() => {
    getAllDataInTable();
  }, [])

  const {
    register: registerPlanfontNature,
    handleSubmit: handleSubmitPlanfontNature,
    control: controlNature,
    reset: resetPlanfontNature,
    watch,
    formState: { errors: errorsPlanfontNature },
  } = useForm({
    defaultValues: {
      exercice: null,
      idProjet: null,
      details: [
        { id: null, idCategorie: null, idClasse: null, montant: "", exercice: null }
      ]
    }
  });

  // Calcul du montant total en temps réel
  const watchDetails = watch("details");
  const totalMontant = useMemo(() => {
    if (!watchDetails || watchDetails.length === 0) return 0;
    return watchDetails.reduce((sum, detail) => {
      const montant = parseFloat(detail.montant) || 0;
      return sum + montant;
    }, 0);
  }, [watchDetails]);

  const onSubmitPlanfontnature = async (data: any) => {
    try {
      const exercices = data.exercice;
      const idProjet = data.idProjet;
      data.details.map(async element => {
        element.id = parseInt(element.id);
        element.montant = element.montant;
        element.categorie = parseInt(element.categorie);
        element.idProjet = parseInt(idProjet);
        element.idClasse = parseInt(element.idClasse);
        element.idExercice = parseInt(exercices);
        if (!element.id) {
          await createPlanfontnature(element);
        } else {
          await updatePlanfontnature(element.id, element);
        }
      })

      toast.success("Operation effectuée avec succès !");
    } catch (error: any) {
      toast.error("Erreur lors de l'operation'.", { style: { backgroundColor: "red", color: "white" } });
    }
  };

  const getPlanfondByExercice = async (e: any) => {
    const value = e.target.value;
    if (value !== "") {
      setExerciceId(value)
      const data = await getAllPlanfontprojet(e.target.value);
      setPlanfontprojets(data)
    } else {
      setPlanfontprojets([])
    }
    setPlanfontNature([])
  }

  const addDetailLinePlanfontnature = () => {
    appendNature({ id: null, idClasse: null, idSource: null, montant: "", exercice: null });
  };

  const { fields: fieldsNature, append: appendNature, remove: removeNature } = useFieldArray({
    control: controlNature,
    name: "details",
  });

  const removeDetailLinePlanfontnature = (index: number) => {
    removeNature(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header avec effet glassmorphism */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl shadow-lg">
              <FolderTree className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Élaboration du Budget par nature
            </h1>
          </div>
          <p className="text-gray-500 ml-14">
            Configurez les plafonds budgétaires par catégorie et nature de dépense
          </p>
        </div>

        <form onSubmit={handleSubmitPlanfontNature(onSubmitPlanfontnature)} className="space-y-6">
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
                    {...registerPlanfontNature("exercice", { required: true })}
                    onChange={getPlanfondByExercice}
                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium
                      focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all
                      appearance-none cursor-pointer hover:border-gray-300"
                  >
                    <option value="">Sélectionner l'exercice</option>
                    {exercices.map((element) => (
                      <option key={element.id} value={element.id}>
                        {element.libelle}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {errorsPlanfontNature.exercice && (
                  <p className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    Champ obligatoire
                  </p>
                )}
              </div>

              {/* Projet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Projet <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    {...registerPlanfontNature("idProjet", { required: true })}
                    onChange={(e) => getPlanfondNatureByprogramme(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium
                      focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all
                      appearance-none cursor-pointer hover:border-gray-300"
                  >
                    <option value="">Sélectionner un projet</option>
                    {projets.map((element) => (
                      <option key={element.id} value={element.id}>
                        {element.libelle}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {errorsPlanfontNature.idProjet && (
                  <p className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    Champ obligatoire
                  </p>
                )}
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
                    <div className="p-1.5 bg-emerald-100 rounded-lg">
                      <Tag className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Détails des natures de dépenses
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Ajoutez les catégories, natures et montants plafonds
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addDetailLinePlanfontnature}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2.5
                    font-semibold shadow-md hover:shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
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
                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Catégorie</th>
                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nature de dépense</th>
                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Montant (€)</th>
                    <th className="px-5 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-24">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {fieldsNature.map((field, index) => (
                    <tr key={field.id} className="hover:bg-gray-50/80 transition-colors duration-150">
                      {/* Catégorie */}
                      <td className="px-5 py-3">
                        <select
                          {...registerPlanfontNature(`details.${index}.idCategorie`, { required: true })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm
                            focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all
                            bg-gray-50/30 hover:bg-white"
                        >
                          <option value="">Sélectionner une catégorie</option>
                          {categories.map((element) => (
                            <option key={element.id} value={element.id}>
                              {element.libelle}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Nature */}
                      <td className="px-5 py-3">
                        <select
                          {...registerPlanfontNature(`details.${index}.idClasse`, { required: true })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm
                            focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all
                            bg-gray-50/30 hover:bg-white"
                        >
                          <option value="">Sélectionner la nature de dépense</option>
                          {classes.map((element) =>
                            element.type === "DEPENSE" ? (
                              <option key={element.id} value={element.id}>
                                {element.libelle}
                              </option>
                            ) : null
                          )}
                        </select>
                      </td>

                      {/* Montant */}
                      <td className="px-5 py-3">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">€</span>
                          <input
                            type="number"
                            step="0.01"
                            {...registerPlanfontNature(`details.${index}.montant`, { required: true })}
                            className="w-full rounded-lg border border-gray-200 pl-8 pr-3 py-2.5 text-sm
                              focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all
                              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="0,00"
                          />
                        </div>
                      </td>

                      {/* Supprimer */}
                      <td className="px-5 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeNature(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200
                            hover:text-red-700 group"
                          title="Supprimer"
                        >
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
                  {fieldsNature.length} ligne{fieldsNature.length > 1 ? 's' : ''} · Cliquez sur <span className="font-medium text-emerald-600">+ Ajouter</span> pour insérer
                </div>

                {/* Carte de total */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl px-6 py-3 shadow-lg">
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

            {/* Actions */}
            <div className="px-6 py-5 bg-white border-t border-gray-100">
              <div className="flex flex-col md:flex-row justify-end gap-3">
            
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-2.5
                    font-semibold shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200
                    transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Save className="w-4 h-4" />
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}