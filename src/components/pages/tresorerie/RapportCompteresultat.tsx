import React, { useEffect, useState } from 'react';
import { getAllExercice } from "../../../data/classification/exercice";
import { getAllEtatcompteresultat } from "../../../data/tresorerie/journal";

export default function renderEtatResultatcomptePage() {
  const [etatscompteresultat, setEtatscompteresultat] = useState({ recette: [], depense: [] });
  const [exercices, setExercices] = useState([]);
  const [exerciceId, setExerciceId] = useState();
  const [totalRecette, setTotalRecette] = useState(0);
  const [totalDepense, setTotalDepense] = useState(0);
  const [resultat, setResultat] = useState(0);

  useEffect(() => {
    dataExercice();
  }, []);

  const dataExercice = async () => {
    const data = await getAllExercice();
    setExercices(data);
  };

  const dataJournal = async (exercice, debut, fin) => {
    const datacompteresultat = await getAllEtatcompteresultat(exercice, debut, fin);
    setEtatscompteresultat(datacompteresultat);
    
    // Calculer les totaux
    let sommeRecette = 0;
    let sommeDepense = 0;
    
    // Somme des recettes (produits)
    if (datacompteresultat.recette && datacompteresultat.recette.length > 0) {
      datacompteresultat.recette.forEach((data) => {
        sommeRecette += data.montant || 0;
      });
    }
    
    // Somme des dépenses
    if (datacompteresultat.depense && datacompteresultat.depense.length > 0) {
      datacompteresultat.depense.forEach((data) => {
        sommeDepense += data.montant || 0;
      });
    }
    
    setTotalRecette(sommeRecette);
    setTotalDepense(sommeDepense);
    setResultat(sommeRecette - sommeDepense);
  };

  const getByExercice = async (e) => {
    const value = e.target.value;
    if (value !== null && value !== "") {
      setExerciceId(value);
      await dataJournal(Number(value), null, null);
    } else {
      setEtatscompteresultat({ recette: [], depense: [] });
      setTotalRecette(0);
      setTotalDepense(0);
      setResultat(0);
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

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Compte de Résultat</h2>

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
                  <th className="border border-gray-300 px-4 py-2 text-left">LIBELLÉ</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">MONTANT (FBU)</th>
                </tr>
              </thead>
              <tbody>
                {/* Section PRODUITS (RECETTES) */}
                <tr className="bg-green-50">
                  <td className="border border-gray-300 px-4 py-2 font-bold" colSpan={2}>
                    PRODUITS (RECETTES)
                  </td>
                </tr>
                
                {etatscompteresultat?.recette?.length > 0 ? (
                  etatscompteresultat.recette.map((data, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 pl-8">
                        {data.classe?.libelle || "Sans libellé"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {formatMontant(data.montant)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 text-center text-gray-500" colSpan={2}>
                      Aucune recette disponible
                    </td>
                  </tr>
                )}
                
                {/* Total des recettes */}
                <tr className="bg-green-100 font-bold">
                  <td className="border border-gray-300 px-4 py-2 font-bold">
                    TOTAL DES PRODUITS (RECETTES)
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right font-bold text-green-700">
                    {formatMontant(totalRecette)}
                  </td>
                </tr>

                {/* Espace */}
                <tr>
                  <td className="border-none py-2" colSpan={2}></td>
                </tr>

                {/* Section DEPENSES (CHARGES) */}
                <tr className="bg-red-50">
                  <td className="border border-gray-300 px-4 py-2 font-bold" colSpan={2}>
                    DÉPENSES (CHARGES)
                  </td>
                </tr>
                
                {etatscompteresultat?.depense?.length > 0 ? (
                  etatscompteresultat.depense.map((data, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 pl-8">
                        {data.classe?.libelle || "Sans libellé"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-right">
                        {formatMontant(data.montant)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 text-center text-gray-500" colSpan={2}>
                      Aucune dépense disponible
                    </td>
                  </tr>
                )}
                
                {/* Total des dépenses */}
                <tr className="bg-red-100 font-bold">
                  <td className="border border-gray-300 px-4 py-2 font-bold">
                    TOTAL DES DÉPENSES (CHARGES)
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right font-bold text-red-700">
                    {formatMontant(totalDepense)}
                  </td>
                </tr>

                {/* Espace */}
                <tr>
                  <td className="border-none py-2" colSpan={2}></td>
                </tr>

                {/* RÉSULTAT FINAL */}
                <tr className={`${resultat >= 0 ? 'bg-yellow-50' : 'bg-orange-50'} font-bold text-lg`}>
                  <td className="border border-gray-300 px-4 py-3 font-bold text-lg">
                    RÉSULTAT NET
                  </td>
                  <td className={`border border-gray-300 px-4 py-3 text-right font-bold text-lg ${resultat >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {formatMontant(Math.abs(resultat))}
                  </td>
                </tr>

                {/* Indication bénéfice ou perte */}
                <tr className={`${resultat >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  <td className="border border-gray-300 px-4 py-2 font-medium" colSpan={2}>
                    {resultat >= 0 ? (
                      <span className="text-green-700">✅ BÉNÉFICE : Les recettes sont supérieures aux dépenses</span>
                    ) : (
                      <span className="text-red-700">⚠️ PERTE : Les dépenses sont supérieures aux recettes</span>
                    )}
                  </td>
                </tr>

                {/* Détail du calcul */}
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600" colSpan={2}>
                    Calcul : {formatMontant(totalRecette)} - {formatMontant(totalDepense)} = {resultat >= 0 ? '+' : ''}{formatMontant(resultat)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Veuillez sélectionner un exercice pour afficher le compte de résultat
          </div>
        )}
      </div>
    </>
  );
}