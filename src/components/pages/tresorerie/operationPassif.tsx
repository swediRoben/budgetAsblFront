import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import { getAllClasse } from "../../../data/classification/classes";
import { getAllPlancompte } from "../../../data/classification/planComptable";
import { create, update, getAll } from "../../../data/classification/operationComptable";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const OperationPassifForm = () => {
  const { register, control, handleSubmit, reset, watch, setValue,
    formState: { errors } } = useForm({
      defaultValues: {
        id: null,
        type: "",
        classeid: null,
        detailsPassif: [{ id: null, typeOperation:null, debitid: null, creditid: null }],
      },
    });

  const [plancomptables, setPlancomptables] = useState([]);
  const [plancomptablescharge, setPlancomptablesCharge] = useState([]);
  const [classes, setClasses] = useState([]);
  const [operations, setOperations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const watchDetailsPassif = watch("detailsPassif");
  const watchType = watch("type");

  useEffect(() => {
    if (watchType) {
      setType(watchType);
    }
  }, [watchType]);

  const dataClasse = async () => {
    try {
      const data = await getAllClasse();
      setClasses(data);
    } catch (error) {
      console.error("Erreur chargement classes:", error);
    }
  };

  const dataAllOperation = async () => {
    try {
      const data = await getAll();
      setOperations(data);
    } catch (error) {
      console.error("Erreur chargement opérations:", error);
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

  
  const dataPlancompteClasse = (idclasse:any) => {
     const data = plancomptables.filter(p=>p.classeId===idclasse);
      setPlancomptablesCharge(data);
  };

  useEffect(() => {
    dataClasse();
    dataPlancompte();
    if (showModal) {
      dataAllOperation();
    }
  }, [showModal]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "detailsPassif",
  });

  // Obtenir tous les comptes disponibles pour le débit
  const getAvailableDebitComptes = (index) => {
    const currentDebitId = watchDetailsPassif[index]?.debitid;
    const currentCreditId = watchDetailsPassif[index]?.creditid;

    const usedCompteIds = [];

    // Récupérer les comptes utilisés dans les AUTRES lignes
    for (let i = 0; i < watchDetailsPassif.length; i++) {
      if (i !== index) {
        if (watchDetailsPassif[i]?.debitid) usedCompteIds.push(watchDetailsPassif[i].debitid);
        if (watchDetailsPassif[i]?.creditid) usedCompteIds.push(watchDetailsPassif[i].creditid);
      }
    }

    // Exclure le compte crédit de la même ligne pour éviter doublon
    if (currentCreditId) usedCompteIds.push(currentCreditId);

    // MAIS toujours inclure le compte débit actuel s'il existe
    return plancomptables.filter(p => {
      // Si c'est le compte débit actuel, on le garde
      if (currentDebitId && p.id === currentDebitId) return true;
      // Sinon, on filtre les comptes utilisés ailleurs
      return !usedCompteIds.includes(p.id);
    });
  };

  // Obtenir tous les comptes disponibles pour le crédit
  const getAvailableCreditComptes = (index) => {
    const currentDebitId = watchDetailsPassif[index]?.debitid;
    const currentCreditId = watchDetailsPassif[index]?.creditid;

    const usedCompteIds = [];

    // Récupérer les comptes utilisés dans les AUTRES lignes
    for (let i = 0; i < watchDetailsPassif.length; i++) {
      if (i !== index) {
        if (watchDetailsPassif[i]?.debitid) usedCompteIds.push(watchDetailsPassif[i].debitid);
        if (watchDetailsPassif[i]?.creditid) usedCompteIds.push(watchDetailsPassif[i].creditid);
      }
    }

    // Exclure le compte débit de la même ligne pour éviter doublon
    if (currentDebitId) usedCompteIds.push(currentDebitId);

    // MAIS toujours inclure le compte crédit actuel s'il existe
    return plancomptables.filter(p => {
      // Si c'est le compte crédit actuel, on le garde
      if (currentCreditId && p.id === currentCreditId) return true;
      // Sinon, on filtre les comptes utilisés ailleurs
      return !usedCompteIds.includes(p.id);
    });
  };

  const handleDebitChange = (index, value) => {
    const currentCreditId = watchDetailsPassif[index]?.creditid;
    const debitId = value ? parseInt(value) : null;

    // Vérifier si débit et crédit sont identiques
    if (debitId && currentCreditId && debitId === currentCreditId) {
      toast.error("Le compte débit ne peut pas être identique au compte crédit !");
      setValue(`detailsPassif.${index}.debitid`, null);
      return;
    }

    setValue(`detailsPassif.${index}.debitid`, debitId);
  };

  const handleCreditChange = (index, value) => {
    const currentDebitId = watchDetailsPassif[index]?.debitid;
    const creditId = value ? parseInt(value) : null;

    // Vérifier si débit et crédit sont identiques
    if (creditId && currentDebitId && creditId === currentDebitId) {
      toast.error("Le compte crédit ne peut pas être identique au compte débit !");
      setValue(`detailsPassif.${index}.creditid`, null);
      return;
    }

    setValue(`detailsPassif.${index}.creditid`, creditId);
  };

  const submitForm = async (data) => {
    for (let i = 0; i < data.detailsPassif.length; i++) {
      const detail = data.detailsPassif[i];

      for (let i = 0; i < data.detailsPassif.length; i++) {
        const detail = data.detailsPassif[i];

        // ✅ ERREUR UNIQUEMENT SI LES DEUX SONT VIDES
        if (!detail.debitid && !detail.creditid) {
          toast.error(`Ligne ${i + 1}: débit ou crédit obligatoire`);
          return;
        }
      }

        for (let j = i + 1; j < data.detailsPassif.length; j++) {
          const otherDetail = data.detailsPassif[j];
          if (detail.debitid === otherDetail.debitid || detail.debitid === otherDetail.creditid ||
              detail.creditid === otherDetail.debitid || detail.creditid === otherDetail.creditid) {
            toast.error(`Ligne ${i + 1} et ${j + 1}: Un compte ne peut pas être utilisé plusieurs fois`);
            return;
          }
        }
      }

      setLoading(true);
      try {
        if (data.id) {
          await update(data.id, data);
          toast.success("Opération modifiée avec succès !");
          setIsEditing(false);
        } else {
          await create(data);
          toast.success("Opération créée avec succès !");
        }

        reset({
          id: null,
          type: "",
          classeid: null,
          detailsPassif: [{ id: null, typeOperation: null, debitid: null, creditid: null }]
        });
        setType("");

        if (showModal) {
          await dataAllOperation();
        }
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Erreur lors de l'opération.");
      } finally {
        setLoading(false);
      }
    };
    

    const handleDelete = async (id) => {
      try {
        toast.success("Suppression effectuée avec succès !");
        await dataAllOperation();
      } catch (error) {
        toast.error("Erreur lors de la suppression.");
      }
    };

    const handleUpdate = async (operationData) => {
      setShowModal(false);

      if (classes.length === 0) {
        await dataClasse();
      }
      if (plancomptables.length === 0) {
        await dataPlancompte();
      }

      setType(operationData.type);
      setIsEditing(true);

      const resetData = {
        id: operationData.id,
        type: operationData.type,
        classeid: operationData.classeid,
        detailsPassif: operationData.detailsPassif && operationData.detailsPassif.length > 0
          ? operationData.detailsPassif.map(detail => ({
            id: detail.id,
            typeOperation: detail.typeOperation,
            debitid: detail.debitid,
            creditid: detail.creditid
          }))
          : [{ id: null,typeOperation:null,debitid: null, creditid: null }]
      };

      reset(resetData);
      toast.success("Formulaire chargé pour modification");
    };

    const handleCancelEdit = () => {
      reset({
        id: null,
        type: "",
        classeid: null,
        detailsPassif: [{ id: null, typeOperation: null, debitid: null, creditid: null }]
      });
      setType("");
      setIsEditing(false);
      toast.success("Modification annulée");
    };

    const getgetData = () => {
      dataAllOperation();
      setShowModal(true);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {isEditing ? "Modifier l'opération comptable" : "Nouvelle opération comptable"}
                  </h1>
                </div>
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Annuler
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
              <div>
                <input {...register("id")} type="hidden" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type  <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("type", { required: "Le type est requis" })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="">Sélectionner un type</option>
                    <option value="DEPENSE" selected={true}>💰 Dépense</option> 
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Classe comptable <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("classeid", { required: "La classe est requise" })}
                    onClick={(e)=>dataPlancompteClasse(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="">Sélectionner une classe</option>
                    {classes.map((element) =>
                      element.type === type ? (
                        <option key={element.id} value={element.id}>
                          {element.libelle}
                        </option>
                      ) : null
                    )}
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-800">Les compte Passif</h2>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                    {fields.length} ligne(s)
                  </span>
                </div>

                <div className="space-y-3">
                  {fields.map((field, index) => {
                    const currentDebitId = watchDetailsPassif[index]?.debitid;
                    const currentCreditId = watchDetailsPassif[index]?.creditid;

                    // Récupérer les comptes disponibles
                    const availableDebits = getAvailableDebitComptes(index);
                    const availableCredits = getAvailableCreditComptes(index);

                    return (
                      <div
                        key={field.id}
                        className="bg-white rounded-lg p-4 border border-gray-200"
                      >
                        
                <div  className="grid grid-cols-12 gap-3 items-center">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type d'opération <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register(`detailsPassif.${index}.typeOperation`, { required: "Le type est requis" })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="">Sélectionner un type</option>
                    <option value="DETTE">💰 DETTE</option>
                    <option value="PRODUIT_CONSTATE">PRODUIT CONSTANTE D'AVANCE</option>
                  </select>
                </div>
                        <div className="grid grid-cols-12 gap-3 items-center">
                          <div className="col-span-5">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              Compte Charge
                            </label>
                            {/* <select
                            value={currentDebitId || ""}
                            onChange={(e) => handleDebitChange(index, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                          >
                            <option value="">Sélectionner un compte</option>
                            {availableDebits.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p?.numero} - {p.libelle}
                              </option>
                            ))}
                          </select> */}

                            <select
                              {...register(`detailsPassif.${index}.debitid`)}
                                  value={currentDebitId || ""}
                                   onChange={(e) => handleDebitChange(index, e.target.value)}
                                  disabled={watch(`detailsPassif.${index}.typeOperation`) === "PRODUIT_CONSTATE"}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                            >
                              <option value="">Sélectionner un compte charge</option>
                              {plancomptablescharge.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p?.numero} - {p.libelle}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="col-span-5">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              Compte Passif
                            </label>
                            {/* <select
                            value={currentCreditId || ""}
                            onChange={(e) => handleCreditChange(index, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                          >
                            <option value="">Sélectionner un compte</option>
                            {availableCredits.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p?.numero} - {p.libelle}
                              </option>
                            ))}
                          </select> */}

                            <select
                                 value={currentCreditId || ""}
                              {...register(`detailsPassif.${index}.creditid`)}
                                 onChange={(e) => handleCreditChange(index, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                            >
                              <option value="">Sélectionner un compte passif</option>
                              {plancomptables.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p?.numero} - {p.libelle}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="col-span-2">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              Action
                            </label>
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="w-full p-2 rounded-lg text-red-500 hover:bg-red-50 border border-red-200"
                              disabled={fields.length === 1}
                            >
                              <Trash2 className="w-4 h-4 mx-auto" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => append({ id: null, debitid: null, creditid: null })}
                  className="mt-4 w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 font-medium flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Ajouter une ligne</span>
                </button>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
                >
                  <span>{loading ? "Chargement..." : (isEditing ? "Mettre à jour" : "Enregistrer")}</span>
                </button>
              </div>
            </form>

            <button
              onClick={getgetData}
              className="mt-6 w-full bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-900 font-medium"
            >
              List comptes passif
            </button>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">

                {/* Header avec gradient et icône */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 rounded-lg p-2">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Liste des compte passif</h2>
                      <p className="text-indigo-100 text-sm mt-0.5">Gérez toutes vos compte passif selon les differents charges</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Corps avec recherche et filtres */}
                <div className="flex-1 overflow-auto bg-gray-50">
                  {/* Barre d'outils */}
                  <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 max-w-md">
                        <div className="relative">
                          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <input
                            type="text"
                            placeholder="Rechercher une opération..."
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          Total: <span className="font-semibold text-indigo-600">{operations.length}</span> opération(s)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tableau */}
                  <div className="p-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <input type="checkbox" className="rounded border-gray-300" />
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                ID
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Type
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Classe
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Détails passif
                              </th>
                              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {operations.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="px-6 py-16 text-center">
                                  <div className="flex flex-col items-center justify-center">
                                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-gray-500 text-lg font-medium">Aucune compte passif trouvé</p>
                                    <p className="text-gray-400 text-sm mt-1">Créez votre première compte passif</p>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              operations.map((op) => (
                                <tr key={op.id} className="hover:bg-indigo-50/30 transition-colors duration-150 group">
                                  <td className="px-6 py-4">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <span className="text-xs font-bold text-indigo-600">#{op.id}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${op.type === 'DEPENSE'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-green-100 text-green-700'
                                      }`}>
                                      {op.type === 'DEPENSE' ? (
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                        </svg>
                                      ) : (
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                        </svg>
                                      )}
                                      {op.type === 'DEPENSE' ? 'Dépense' : 'Recette'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                      <span className="text-sm font-medium text-gray-900">{op.classe?.libelle || 'Non spécifié'}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="space-y-2 max-w-md">
                                      {op.detailsPassif?.map((d, i) => (
                                        <div key={i} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg p-2 border border-gray-100">
                                          <div className="flex items-center space-x-3">
                                            <div className="flex items-center space-x-1">
                                              <span className="font-semibold text-indigo-600">CREDIT:</span>
                                              <span className="text-gray-700 truncate max-w-[150px]">
                                                {d?.debit?.numero} - {d?.debit?.libelle?.substring(0, 30)}
                                              </span>
                                            </div>
                                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                            <div className="flex items-center space-x-1">
                                              <span className="font-semibold text-red-600">PASSIF:</span>
                                              <span className="text-gray-700 truncate max-w-[150px]">
                                                {d?.credit?.numero} - {d?.credit?.libelle?.substring(0, 30)}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                      {(!op.detailsPassif || op.detailsPassif.length === 0) && (
                                        <div className="text-xs text-gray-400 italic">Aucun détail</div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center justify-center space-x-2">
                                      <button
                                        onClick={() => handleUpdate(op)}
                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 group-hover:scale-105"
                                        title="Modifier"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                      </button>
                                      <button
                                        onClick={() => handleDelete(op.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group-hover:scale-105"
                                        title="Supprimer"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer avec actions */}
                <div className="border-t border-gray-200 px-6 py-4 bg-white flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="text-sm text-gray-600 hover:text-gray-800 transition-colors flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span>Exporter</span>
                    </button>
                    <button className="text-sm text-gray-600 hover:text-gray-800 transition-colors flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      <span>Imprimer</span>
                    </button>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 font-medium text-sm flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Fermer</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default OperationPassifForm;