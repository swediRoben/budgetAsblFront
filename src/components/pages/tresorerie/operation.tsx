import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import { getAllClasse } from "../../../data/classification/classes";
import { getAllPlancompte } from "../../../data/classification/planComptable";
import { create, update, getAll } from "../../../data/classification/operationComptable";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const OperationForm = () => {
  const { register, control, handleSubmit, reset, watch, setValue,
    formState: { errors }, } = useForm({
      defaultValues: {
        id: null,
        libelle: "",
        type: "",
        classeid: null,
        details: [{ id: null, debitid: null, creditid: null }],
      },
    });

  const [plancomptables, setPlancomptables] = useState([]);
  const [classes, setClasses] = useState([]);
  const [operations, setOperations] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Surveiller les changements des champs debitid et creditid
  const watchDetails = watch("details");

  const dataClasse = async () => {
    const data = await getAllClasse();
    setClasses(data);
  };

  const dataAllOperation = async () => {
    const data = await getAll();
    setOperations(data);
  };

  const dataPlancompte = async () => {
    const data = await getAllPlancompte();
    setPlancomptables(data);
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
    name: "details",
  });

  // Vérifier si un compte est déjà utilisé dans une autre ligne
  const isCompteDejaUtilise = (index, fieldName, compteId) => {
    if (!compteId) return false;
    
    for (let i = 0; i < watchDetails.length; i++) {
      if (i !== index) {
        if (watchDetails[i]?.debitid === compteId || watchDetails[i]?.creditid === compteId) {
          return true;
        }
      }
    }
    return false;
  };

  // Vérifier si débit et crédit sont identiques sur la même ligne
  const isDebitCreditIdentique = (index, debitId, creditId) => {
    if (!debitId || !creditId) return false;
    return debitId === creditId;
  };

  // Obtenir les comptes disponibles pour le débit (exclure ceux déjà utilisés)
  const getAvailableDebitComptes = (index, currentCreditId) => {
    const usedCompteIds = [];
    for (let i = 0; i < watchDetails.length; i++) {
      if (i !== index) {
        if (watchDetails[i]?.debitid) usedCompteIds.push(watchDetails[i].debitid);
        if (watchDetails[i]?.creditid) usedCompteIds.push(watchDetails[i].creditid);
      }
    }
    // Exclure également le compte crédit actuel de la même ligne
    if (currentCreditId) usedCompteIds.push(currentCreditId);
    
    return plancomptables.filter(p => !usedCompteIds.includes(p.id));
  };

  // Obtenir les comptes disponibles pour le crédit (exclure ceux déjà utilisés)
  const getAvailableCreditComptes = (index, currentDebitId) => {
    const usedCompteIds = [];
    for (let i = 0; i < watchDetails.length; i++) {
      if (i !== index) {
        if (watchDetails[i]?.debitid) usedCompteIds.push(watchDetails[i].debitid);
        if (watchDetails[i]?.creditid) usedCompteIds.push(watchDetails[i].creditid);
      }
    }
    // Exclure également le compte débit actuel de la même ligne
    if (currentDebitId) usedCompteIds.push(currentDebitId);
    
    return plancomptables.filter(p => !usedCompteIds.includes(p.id));
  };

  // Gérer le changement du débit
  const handleDebitChange = (index, value) => {
    const currentCreditId = watchDetails[index]?.creditid;
    
    // Vérifier si le compte débit est déjà utilisé
    if (isCompteDejaUtilise(index, 'debitid', parseInt(value))) {
      toast.error("Ce compte est déjà utilisé dans une autre ligne !");
      setValue(`details.${index}.debitid`, null);
      return;
    }
    
    // Vérifier si débit et crédit sont identiques
    if (isDebitCreditIdentique(index, parseInt(value), currentCreditId)) {
      toast.error("Le compte débit ne peut pas être identique au compte crédit !");
      setValue(`details.${index}.debitid`, null);
      return;
    }
    
    setValue(`details.${index}.debitid`, value ? parseInt(value) : null);
  };

  // Gérer le changement du crédit
  const handleCreditChange = (index, value) => {
    const currentDebitId = watchDetails[index]?.debitid;
    
    // Vérifier si le compte crédit est déjà utilisé
    if (isCompteDejaUtilise(index, 'creditid', parseInt(value))) {
      toast.error("Ce compte est déjà utilisé dans une autre ligne !");
      setValue(`details.${index}.creditid`, null);
      return;
    }
    
    // Vérifier si débit et crédit sont identiques
    if (isDebitCreditIdentique(index, currentDebitId, parseInt(value))) {
      toast.error("Le compte crédit ne peut pas être identique au compte débit !");
      setValue(`details.${index}.creditid`, null);
      return;
    }
    
    setValue(`details.${index}.creditid`, value ? parseInt(value) : null);
  };

  const submitForm = async (data) => {
    // Validation supplémentaire avant soumission
    for (let i = 0; i < data.details.length; i++) {
      const detail = data.details[i];
      
      if (!detail.debitid || !detail.creditid) {
        toast.error(`Ligne ${i + 1}: Veuillez sélectionner un débit et un crédit`);
        return;
      }
      
      if (detail.debitid === detail.creditid) {
        toast.error(`Ligne ${i + 1}: Le compte débit et crédit ne peuvent pas être identiques`);
        return;
      }
      
      // Vérifier les doublons entre lignes
      for (let j = i + 1; j < data.details.length; j++) {
        const otherDetail = data.details[j];
        if (detail.debitid === otherDetail.debitid || detail.debitid === otherDetail.creditid ||
            detail.creditid === otherDetail.debitid || detail.creditid === otherDetail.creditid) {
          toast.error(`Ligne ${i + 1} et ${j + 1}: Un compte ne peut pas être utilisé plusieurs fois`);
          return;
        }
      }
    }
    
    try {
      await create(data);
      toast.success("Opération effectuée avec succès !");
      reset({
        id: null,
        libelle: "",
        type: "",
        classeid: null,
        details: [{ id: null, debitid: null, creditid: null }]
      });
    } catch (error) {
      toast.error("Erreur lors de l'opération.", { style: { backgroundColor: "red", color: "white" } });
    }
  };

  const hendleDelete = (id) => {
    try {
      toast.success("Suppression effectuée avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la suppression.", { style: { backgroundColor: "red", color: "white" } });
    }
  };

  const hendleUpdata = (data) => {
    reset(data);
    setShowModal(false);
  };

  const getgetData = () => {
    dataAllOperation();
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Formulaire principal */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center space-x-3 mb-6 pb-3 border-b border-gray-200">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Nouvelle opération comptable
            </h1>
          </div>

          <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
            <div>
              <input {...register("id", { required: false })} readOnly hidden />
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Libellé de l'opération
              </label>
              <input
                {...register("libelle", { required: "Le libellé est requis" })}
                placeholder="Ex: Achat matériel de bureau"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
              />
              {errors.libelle && (
                <p className="text-red-500 text-xs mt-1">{errors.libelle.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type d'opération
                </label>
                <select
                  {...register("type")}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="DEPENSE">💰 Dépense</option>
                  <option value="RECETTE">📈 Recette</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Classe comptable
                </label>
                <select
                  {...register("classeid")}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">Sélectionner une classe</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.type} - {c.libelle}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Lignes comptables</span>
                </h2>
                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                  {fields.length} ligne(s)
                </span>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => {
                  const currentDebitId = watchDetails[index]?.debitid;
                  const currentCreditId = watchDetails[index]?.creditid;
                  const availableDebits = getAvailableDebitComptes(index, currentCreditId);
                  const availableCredits = getAvailableCreditComptes(index, currentDebitId);
                  
                  return (
                    <div
                      key={field.id}
                      className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="grid grid-cols-12 gap-3 items-center">
                        <div className="col-span-5">
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Compte Débit
                          </label>
                          <select
                            value={watchDetails[index]?.debitid || ""}
                            onChange={(e) => handleDebitChange(index, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                          >
                            <option value="">Sélectionner</option>
                            {availableDebits.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p?.numero} - {p.libelle}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-span-5">
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Compte Crédit
                          </label>
                          <select
                            value={watchDetails[index]?.creditid || ""}
                            onChange={(e) => handleCreditChange(index, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                          >
                            <option value="">Sélectionner</option>
                            {availableCredits.map((p) => (
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
                            className="w-full p-2 rounded-lg transition-all duration-200 text-red-500 hover:bg-red-50 hover:text-red-700 border border-red-200 hover:border-red-300"
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
                className="mt-4 w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
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
                className="flex items-center space-x-2 px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Enregistrer l'opération</span>
              </button>
            </div>
          </form>

          <button
            onClick={getgetData}
            className="mt-6 w-full bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-900 transition-all duration-200 font-medium flex items-center justify-center space-x-2 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>Voir toutes les opérations</span>
          </button>
        </div>

        {/* Modal des opérations */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header du modal */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-white">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Liste des opérations comptables
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Gérez toutes vos opérations comptables
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 hover:bg-red-50 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Tableau des opérations */}
              <div className="flex-1 overflow-auto p-6">
                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-indigo-600 to-indigo-700">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Libellé
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Classe
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Détails comptables
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                          Actions
                        </th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {operations.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <p className="text-gray-500 text-lg">Aucune opération trouvée</p>
                              <p className="text-gray-400 text-sm mt-1">Cliquez sur "Nouvelle opération" pour en créer une</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        operations.map((op, i) => (
                          <tr key={i} className="hover:bg-gray-50 transition-colors duration-150">
                            {/* Libellé */}
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                  </svg>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-semibold text-gray-900">
                                    {op.libelle || 'N/A'}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    ID: {op.id || '-'}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Type */}
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                op.type === 'DEPENSE' 
                                  ? 'bg-red-100 text-red-700' 
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {op.type === 'DEPENSE' ? '💰 Dépense' : '📈 Recette'}
                              </span>
                            </td>

                            {/* Classe */}
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 font-medium">
                                {op.classe?.libelle || 'Non spécifié'}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {op.classe?.type || '-'}
                              </div>
                            </td>

                            {/* Détails comptables */}
                            <td className="px-6 py-4">
                              <div className="space-y-2">
                                {op.details?.map((d, j) => (
                                  <div key={j} className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                                    <div className="flex items-center justify-between text-xs">
                                      <div className="flex items-center space-x-2">
                                        <span className="font-semibold text-indigo-600">Débit:</span>
                                        <span className="text-gray-700">
                                          {d?.debit?.numero} - {d?.debit?.libelle}
                                        </span>
                                      </div>
                                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                      </svg>
                                      <div className="flex items-center space-x-2">
                                        <span className="font-semibold text-red-600">Crédit:</span>
                                        <span className="text-gray-700">
                                          {d?.credit?.numero} - {d?.credit?.libelle}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {(!op.details || op.details.length === 0) && (
                                  <div className="text-sm text-gray-400 italic">
                                    Aucun détail
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <button
                                  onClick={() => hendleUpdata(op)}
                                  className="group relative inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all duration-200"
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  <span className="text-sm font-medium">Modifier</span>
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

              {/* Footer du modal */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Total: <span className="font-semibold text-gray-900">{operations.length}</span> opération(s)
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm shadow-md"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperationForm;