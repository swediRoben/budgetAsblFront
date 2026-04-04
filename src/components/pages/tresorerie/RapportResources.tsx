import React, { useEffect, useState } from 'react';
import { getAllExercice } from "../../../data/classification/exercice";
import { getAllEtatressource } from "../../../data/tresorerie/journal";

export default function renderRessourcePage() {
  const [etatsresources, setEtatsresources] = useState([]);
  const [exercices, setExercices] = useState([]);
  const [exerciceId, setExerciceId] = useState();
  const [totaux, setTotaux] = useState({
    totalRecus: 0,
    totalDepense: 0,
    totalSolde: 0
  });

  useEffect(() => {
    dataExercice();
  }, []);

  const dataExercice = async () => {
    const data = await getAllExercice();
    setExercices(data);
  };

  const dataJournal = async (exercice, debut, fin) => {
    const dataressources = await getAllEtatressource(exercice, debut, fin);
    setEtatsresources(dataressources);
    
    // Calcul des totaux généraux
    let totalRecus = 0;
    let totalDepense = 0;
    
    dataressources.forEach((data) => {
      totalRecus += data.montantRecus || 0;
      totalDepense += data.montantDepense || 0;
    });
    
    setTotaux({
      totalRecus: totalRecus,
      totalDepense: totalDepense,
      totalSolde: totalRecus - totalDepense
    });
  };

  const getByExercice = async (e) => {
    const value = e.target.value;
    if (value !== null && value !== "") {
      setExerciceId(value);
      await dataJournal(Number(value), null, null);
    } else {
      setEtatsresources([]);
      setTotaux({
        totalRecus: 0,
        totalDepense: 0,
        totalSolde: 0
      });
    }
  };

  // Formatage des nombres
  const formatMontant = (montant) => {
    if (montant === undefined || montant === null) return "0,00";
    return montant.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Calcul du taux d'exécution
  const calculTauxExecution = (montantRecus, montantDepense) => {
    if (montantRecus === 0 || montantRecus === null || montantRecus === undefined) {
      return 0;
    }
    const taux = (montantDepense / montantRecus) * 100;
    return Math.min(taux, 100); // Le taux ne peut pas dépasser 100%
  };

  // Formatage du pourcentage
  const formatPourcentage = (taux) => {
    return taux.toFixed(2) + "%";
  };

  // Déterminer la couleur du taux d'exécution
  const getTauxColor = (taux) => {
    if (taux < 30) return "text-red-600";
    if (taux < 70) return "text-orange-600";
    if (taux < 100) return "text-blue-600";
    return "text-green-600";
  };

  // Déterminer la couleur du solde
  const getSoldeColor = (solde) => {
    if (solde < 0) return "text-red-600";
    if (solde > 0) return "text-green-600";
    return "text-gray-600";
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">État des Ressources par Projet/Bailleur</h2>

        <div className="mb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              className="border border-gray-300 rounded px-3 py-2"
              onChange={getByExercice}
              value={exerciceId || ""}
            >
              <option value="">Sélectionner un exercice</option>
              {exercices.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.libelle}
                </option>
              ))}
            </select>
          </div>
        </div>
        <hr className="my-4" />

        {exerciceId ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">PROJET / BAILLEUR</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">FINANCEMENTS REÇUS (A)</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">DÉPENSES RÉALISÉES (B)</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">SOLDE (A - B)</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">TAUX D'EXÉCUTION (%)</th>
                    </tr>
              </thead>
              <tbody>
                {etatsresources?.map((data, index) => {
                  const montantRecus = data.montantRecus || 0;
                  const montantDepense = data.montantDepense || 0;
                  const solde = montantRecus - montantDepense;
                  const tauxExecution = calculTauxExecution(montantRecus, montantDepense);
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">
                        {data.projet?.projetId?.libelle || "Sans libellé"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {formatMontant(montantRecus)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {formatMontant(montantDepense)}
                      </td>
                      <td className={`border border-gray-300 px-4 py-2 text-right font-bold ${getSoldeColor(solde)}`}>
                        {formatMontant(solde)}
                      </td>
                      <td className={`border border-gray-300 px-4 py-2 text-center font-bold ${getTauxColor(tauxExecution)}`}>
                        {formatPourcentage(tauxExecution)}
                      </td>
                    </tr>
                  );
                })}

                {/* Ligne des totaux généraux */}
                <tr className="bg-gray-200 font-bold">
                  <td className="border border-gray-300 px-4 py-2 font-bold text-right">
                    TOTAL GÉNÉRAL
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right font-bold text-blue-700">
                    {formatMontant(totaux.totalRecus)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right font-bold text-red-700">
                    {formatMontant(totaux.totalDepense)}
                  </td>
                  <td className={`border border-gray-300 px-4 py-2 text-right font-bold ${getSoldeColor(totaux.totalSolde)}`}>
                    {formatMontant(totaux.totalSolde)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center font-bold">
                    {formatPourcentage(calculTauxExecution(totaux.totalRecus, totaux.totalDepense))}
                  </td>
                </tr>

                {/* Ligne d'information sur le taux d'exécution */}
                {totaux.totalRecus > 0 && (
                  <tr className="bg-blue-50">
                    <td colSpan={5} className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                      <div className="flex justify-between items-center">
                        <span>📊 Taux d'exécution global : {formatPourcentage(calculTauxExecution(totaux.totalRecus, totaux.totalDepense))}</span>
                        <span>
                          {calculTauxExecution(totaux.totalRecus, totaux.totalDepense) < 50 ? (
                            <span className="text-red-600">⚠️ Taux d'exécution faible</span>
                          ) : calculTauxExecution(totaux.totalRecus, totaux.totalDepense) < 80 ? (
                            <span className="text-orange-600">🟡 Taux d'exécution modéré</span>
                          ) : (
                            <span className="text-green-600">✅ Bon taux d'exécution</span>
                          )}
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Veuillez sélectionner un exercice pour afficher les ressources
          </div>
        )}
      </div>
    </>
  );
}