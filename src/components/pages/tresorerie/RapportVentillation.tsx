import React, { useEffect, useState } from 'react';
import { getAllProjet } from "../../../data/classification/projet";
import { getAllClasse } from "../../../data/classification/classes";
import { getAllExercice } from "../../../data/classification/exercice";
import { getAllEtatventilationcharge, getAllEtatressource, getAllEtatcompteresultat, getAllJournal, getAllvantilation } from "../../../data/tresorerie/journal";

export default function renderEtatVentillationPage() {
  const [etatsvantilation, setEtatsvantilation] = useState([]);
  const [exercices, setExercices] = useState([]);
  const [exerciceId, setExerciceId] = useState();
  const [totaux, setTotaux] = useState({
    totalBanque: 0,
    totalCaisse: 0,
    totalGeneral: 0
  });

  useEffect(() => {
    dataExercice();
  }, []);

  const dataExercice = async () => {
    const data = await getAllExercice();
    setExercices(data);
  };

  const dataJournal = async (exercice, debut, fin) => {
    const dataventilation = await getAllvantilation(exercice, debut, fin);
    setEtatsvantilation(dataventilation);
    
    // Calcul des totaux
    let totalBanque = 0;
    let totalCaisse = 0;
    
    dataventilation.forEach((data) => {
      totalBanque += data.banque || 0;
      totalCaisse += data.caisse || 0;
    });
    
    setTotaux({
      totalBanque: totalBanque,
      totalCaisse: totalCaisse,
      totalGeneral: totalBanque + totalCaisse
    });
  };

  const getByExercice = async (e) => {
    const value = e.target.value;
    if (value !== null && value !== "") {
      setExerciceId(value);
      await dataJournal(Number(value), null, null);
    } else {
      setEtatsvantilation([]);
      setTotaux({
        totalBanque: 0,
        totalCaisse: 0,
        totalGeneral: 0
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

  // Déterminer la couleur du solde
  const getSoldeColor = (solde) => {
    if (solde < 0) return "text-red-600";
    if (solde > 0) return "text-green-600";
    return "text-gray-600";
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Ventilation par Projet</h2>

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
                  <th className="border border-gray-300 px-4 py-2 text-left">PROJET</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">BANQUE</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">CAISSE</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">TOTAL (BANQUE - CAISSE)</th>
                </tr>
              </thead>
              <tbody>
                {etatsvantilation?.map((data, index) => {
                  const banque = data.banque || 0;
                  const caisse = data.caisse || 0;
                  const total = banque + caisse;
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">
                        {data.projet?.libelle || "Sans libellé"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {formatMontant(banque)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {formatMontant(caisse)}
                      </td>
                      <td className={`border border-gray-300 px-4 py-2 text-right font-bold ${getSoldeColor(total)}`}>
                        {formatMontant(total)}
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
                    {formatMontant(totaux.totalBanque)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right font-bold text-orange-700">
                    {formatMontant(totaux.totalCaisse)}
                  </td>
                  <td className={`border border-gray-300 px-4 py-2 text-right font-bold ${getSoldeColor(totaux.totalGeneral)}`}>
                    {formatMontant(totaux.totalGeneral)}
                  </td>
                </tr>

                {/* Ligne d'information supplémentaire */}
                {etatsvantilation.length > 0 && (
                  <tr className="bg-blue-50">
                    <td colSpan={4} className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                      <div className="flex justify-between items-center">
                        <span>📊 Nombre de projets : {etatsvantilation.length}</span>
                        <span>
                          {totaux.totalGeneral < 0 ? (
                            <span className="text-red-600">⚠️ Solde négatif : Le montant est negatif</span>
                          ) : totaux.totalGeneral > 0 ? (
                            <span className="text-green-600">✅ Solde positif : Fonds disponibles en banque et en caisse</span>
                          ) : (
                            <span className="text-gray-600">⚖️ Solde équilibré</span>
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
            Veuillez sélectionner un exercice pour afficher la ventilation
          </div>
        )}
      </div>
    </>
  );
}