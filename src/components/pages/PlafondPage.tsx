import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign, Settings2, BadgeDollarSign, Plus, Trash2, Save, Calendar } from 'lucide-react';
import { createProjet, deleteProjet, getAllProjet, updateProjet } from "../../data/classification/projet";
import { createBailleur, deleteBailleur, getAllBailleur, updateBailleur } from "../../data/classification/bailleur";
import { createExercice, deleteExercice, getAllExercice, updateExercice } from "../../data/classification/exercice";
import { createPlanfontprojet, deletePlanfontprojet, getAllPlanfontprojet, updatePlanfontprojet } from "../../data/classification/planfontprojet";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function renderPlafondPage() {

  const [projets, setProjets] = useState([]);
  const [projetId, setProjetId] = useState();
  const [exerciceId, setExerciceId] = useState();
  const [bailleurs, setBailleurs] = useState([]);
  const [exercices, setExercices] = useState([]);
  const [planfondprojets, setPlanfontprojets] = useState([]);

  const dataProjet = async () => {
    const data = await getAllProjet();
    setProjets(data)
  }

  const dataBailleur = async () => {
    const data = await getAllBailleur();
    setBailleurs(data)
  }

  const dataExercice = async () => {
    const data = await getAllExercice();
    setExercices(data.filter(ex => ex.preparation));
  };

  const getAllDataInTable = () => {
    dataExercice();
    dataBailleur();
    dataProjet();
  }

  useEffect(() => {
    return getAllDataInTable();
  }, [])

  const {
    register: registerPlanfontprojet,
    handleSubmit: handleSubmitPlanfontprojet,
    control: controlProjet,
    getValues,
    reset: resetPlanfontprojet,
    watch,
    formState: { errors: errorsPlanfontprojet },
  } = useForm({
    defaultValues: {
      exercice: null,
      details: [
        { id: null, idProjet: null, idSource: null, montant: "", exercice: null }
      ]
    }
  });

  // Calcul du montant total
  const watchDetails = watch("details");
  const totalMontant = useMemo(() => {
    if (!watchDetails || watchDetails.length === 0) return 0;
    return watchDetails.reduce((sum, detail) => {
      const montant = parseFloat(detail.montant) || 0;
      return sum + montant;
    }, 0);
  }, [watchDetails]);

  const onSubmitPlanfontprojet = async (data: any) => {
    try {
      const exercices = data.exercice;
      data.details.map(async element => {
        element.id = parseInt(element.id);
        element.montant = element.montant;
        element.idProjet = parseInt(element.idProjet);
        element.idSource = parseInt(element.idSource);
        element.idExercice = parseInt(exercices);
        if (!element.id) {
          await createPlanfontprojet(element);
        } else {
          await updatePlanfontprojet(element.id, element);
        }
      })

      toast.success("Operation effectuée avec succès !");
    } catch (error: any) {
      toast.error("Erreur lors de l'operation'.", { style: { backgroundColor: "red", color: "white" } });
    }
  };

  const hendleDeletePlanfondProjet = (id: number, exercice: any) => {
    try {
      deletePlanfontprojet(id);
      getPlanfondByExercice(exercice)
      toast.success("Supression effectuée avec succès !");

    } catch (error) {
      toast.error("Erreur lors de l'operation'.", { style: { backgroundColor: "red", color: "white" } });
      getPlanfondByExercice(exercice)
    }
  }

  const getPlanfondByExercice = async (e: any) => {
    const value = e.target.value;
    if (value !== "") {
      setExerciceId(value)
      const data = await getAllPlanfontprojet(e.target.value);
      setPlanfontprojets(data)
      if (data.length > 0) {
        resetPlanfontprojet({
          exercice: e.target.value,
          details: data.map((p: any) => ({
            id: p.id,
            idProjet: p.idProjet,
            idSource: p.idSource,
            montant: p.montant,
          })),
        });
      } else {
        resetPlanfontprojet({
          exercice: e.target.value,
          details: [
            { id: null, idProjet: null, idSource: null, montant: "", exercice: null }
          ]
        });
      }
    } else {
      resetPlanfontprojet({
        exercice: null,
        details: [
          { id: null, idProjet: null, idSource: null, montant: "", exercice: null }
        ]
      });
      setPlanfontprojets([])
    }
  }

  const addDetailLinePlanfontprojet = () => {
    appendProjet({ id: null, idProjet: null, idSource: null, montant: "" });
  };

  const { fields: fieldsProjet, append: appendProjet, remove: removeProjet } = useFieldArray({
    control: controlProjet,
    name: "details",
  });

  const removeDetailLinePlanfontprojet = (index: number) => {
    removeProjet(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header avec effet glassmorphism */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Élaboration du Budget par projet
            </h1>
          </div>
          <p className="text-gray-500 ml-14">
            Définissez les plafonds budgétaires par projet et source de financement
          </p>
        </div>

        <form onSubmit={handleSubmitPlanfontprojet(onSubmitPlanfontprojet)} className="space-y-6">
          {/* Carte Exercice */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-indigo-100 rounded-lg">
                <Calendar className="w-4 h-4 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Période budgétaire</h3>
            </div>

            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exercice Budgétaire <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...registerPlanfontprojet("exercice", { required: true })}
                  onChange={getPlanfondByExercice}
                  className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium
                    focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all
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
              {errorsPlanfontprojet.exercice && (
                <p className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  Champ obligatoire
                </p>
              )}
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
                      <Layers className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Détails des projets
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Ajoutez les projets, bailleurs et montants plafonds
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addDetailLinePlanfontprojet}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white px-5 py-2.5
                    font-semibold shadow-md hover:shadow-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-200"
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
                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Projet</th>
                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Bailleur</th>
                    <th className="px-5 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Montant (€)</th>
                    <th className="px-5 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-24">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {fieldsProjet.map((field, index) => (
                    <tr key={field.id} className="hover:bg-gray-50/80 transition-colors duration-150">
                      {/* Hidden ID */}
                      <td hidden>
                        <input
                          type="number"
                          {...registerPlanfontprojet(`details.${index}.id`, { required: false })}
                        />
                      </td>

                      {/* Projet */}
                      <td className="px-5 py-3">
                        <select
                          {...registerPlanfontprojet(`details.${index}.idProjet`, { required: true })}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm
                            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all
                            bg-gray-50/30 hover:bg-white"
                        >
                          <option value="">Sélectionner un projet</option>
                          {projets.map((element) => (
                            <option key={element.id} value={element.id}>
                              {element.libelle}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Bailleur */}
                      <td className="px-5 py-3">
                        <select
                          {...registerPlanfontprojet(`details.${index}.idSource`)}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm
                            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all
                            bg-gray-50/30 hover:bg-white"
                        >
                          <option value="">Sélectionner un bailleur</option>
                          {bailleurs.map((element) => (
                            <option key={element.id} value={element.id}>
                              {element.libelle}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Montant */}
                      <td className="px-5 py-3">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">€</span>
                          <input
                            type="number"
                            step="0.01"
                            {...registerPlanfontprojet(`details.${index}.montant`, { required: true })}
                            className="w-full rounded-lg border border-gray-200 pl-8 pr-3 py-2.5 text-sm
                              focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all
                              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="0,00"
                          />
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            const id = getValues(`details.${index}.id`);
                            const exercice = getValues("exercice");
                            hendleDeletePlanfondProjet(id, exercice);
                            removeDetailLinePlanfontprojet(index);
                          }}
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
                  {fieldsProjet.length} ligne{fieldsProjet.length > 1 ? 's' : ''} · Cliquez sur <span className="font-medium text-emerald-600">+ Ajouter</span> pour insérer
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
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3
                    font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200
                    transform hover:scale-[1.02] active:scale-[0.98]"
                >
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