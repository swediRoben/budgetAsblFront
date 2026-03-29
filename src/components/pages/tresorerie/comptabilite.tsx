import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";


import { getAllBanque } from "../../../data/tresorerie/banques";
import { getAllPlancompte } from "../../../data/classification/planComptable";
import { getAllDevise } from "../../../data/classification/devise"; 
import { getAllPlanfontprojet } from "../../../data/classification/planfontprojet"; 
import { getAllExercice } from "../../../data/classification/exercice"; 
import { getAllComptebancaire } from "../../../data/tresorerie/comptebancaire";

const ComptabilitePage = () => {
  const [journal, setJournal] = useState([]);
  const [grandLivre, setGrandLivre] = useState({});
  const [balance, setBalance] = useState({});
  const [compteResultat, setCompteResultat] = useState(null);

  const [exercices, setExercices] = useState([]);
  const [banques, setBanques] = useState([]);
  const [plansComptables, setPlansComptables] = useState([]);
  const [classes, setClasses] = useState([]);

  const [projets, setProjets] = useState([]);
  const [comptesBancaires, setComptesBancaires] = useState([]);
  const [planfondprojets, setPlanfontprojets] = useState([]);

  const dataExercice = async () => {
    const data = await getAllExercice();
    setExercices(data)
  }

  const dataBanque = async () => {
    const data = await getAllBanque();
    setBanques(data)
  }
  const dataPlancompte = async () => {
    const data = await getAllPlancompte();
    setPlansComptables(data)
  }
  const dataComptebancaire = async (banque: number) => {
    setComptesBancaires([]);
    const data = await getAllComptebancaire(banque, null, null);
    setComptesBancaires(data);
  }


  const getCompteBancaireByBanque = (idBanque: number) => {
    dataComptebancaire(idBanque)
  }

  useEffect(() => {
    dataExercice();
    dataBanque(); 
    dataPlancompte();
  }, [])
  // =======================
  // 1️⃣ Récupérer les données depuis l'API
  // =======================

  
      const fetchData = async (exercice,banque,type,compteDebut,compteFin,debut,fin) => {
      try {
        const journalRes = await axios.get("http://localhost:8080/budget/v1/api/comptabilite/journal",{
          params:{
            exercice,banque,type,compteDebut,compteFin,debut,fin
          }
        });
        setJournal(journalRes.data);

        const grandLivreRes = await axios.get("http://localhost:8080/budget/v1/api/comptabilite/grand-livre",{
          params:{
            exercice,banque,type,compteDebut,compteFin,debut,fin
          }
        });
        setGrandLivre(grandLivreRes.data);

        const balanceRes = await axios.get("http://localhost:8080/budget/v1/api/comptabilite/balance",{
          params:{
            exercice,banque,type,compteDebut,compteFin,debut,fin
          }
        });
        setBalance(balanceRes.data);

        const compteRes = await axios.get("http://localhost:8080/budget/v1/api/comptabilite/compte-resultat",{
          params:{
            exercice,banque,type,compteDebut,compteFin,debut,fin
          }
        });
        setCompteResultat(compteRes.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };


  // useEffect(() => { 
  //   fetchData();
  // }, []);

  // =======================
  // 2️⃣ Rendu des tableaux
  // =======================

  const {
    register: registerRecherche,
    handleSubmit: handleSubmitRecherche,
    reset: resetRecherche,
    formState: { errors: errorsRecherche },
  } = useForm();

  const onSubmitRecherche = async (data) => {
    fetchData(data.exerciceId,data.banqueId,data.type,null,null,data.debut,data.fin)
  };

  return (
    <div className="p-6 space-y-10">
      {/* ================= Journal ================= */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">

        <form onSubmit={handleSubmitRecherche(onSubmitRecherche)} className="space-y-4">

          {/* Ligne 1 : Recherche principale */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
 
            <select {...registerRecherche("exerciceId", { required: true })}
              className="border rounded-lg px-3 py-2 text-sm"
              onClick={
                (e) => {
                  getPlanfondByExercice(e);
                  setExerciceId(e.target.value);
                }
              }>
              <option value="">Exercice</option>
              {exercices.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.libelle}
                </option>
              ))}
            </select>

            <select {...registerRecherche("projetId")}
              className="border rounded-lg px-3 py-2 text-sm"
              onChange={(e) => { getCategoriesByProjet(e.target.value) }}>
              <option value="">Projet</option>
              {planfondprojets.map((p) => (
                <option key={p?.projet.id} value={p?.projet.id}>
                  {p?.projet.libelle}
                </option>
              ))}
            </select> 

            <select {...registerRecherche("banqueId")}
              className="border rounded-lg px-3 py-2 text-sm"
              onChange={(e) => { getCompteBancaireByBanque(e.target.value) }}
            >
              <option value="">Banque</option>
              {banques.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.libelle}
                </option>
              ))}
            </select>

            <select {...registerRecherche("compteBanqueId")} className="border rounded-lg px-3 py-2 text-sm">
              <option value="">Compte bancaire</option>
              {comptesBancaires.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.numero}
                </option>
              ))}
            </select>

             <select required {...registerRecherche("type")} className="border rounded-lg px-3 py-2 text-sm">
              <option value="">Type</option>
              <option value="BROUILLARD">BROUILLARD</option>
              <option value="JOURNAL">JOURNAL</option>
              <option value="ANNULER">ANNULER</option>
              
            </select>

          </div>

          {/* Ligne 3 : Dates + Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">

            <input
              type="date"
              {...registerRecherche("debut")}
              className="border rounded-lg px-3 py-2 text-sm"
            />

            <input
              type="date"
              {...registerRecherche("fin")}
              className="border rounded-lg px-3 py-2 text-sm"
            />

            {/* Boutons */}
            <div className="flex gap-2 col-span-2 justify-end">

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                Rechercher
              </button>


            </div>

          </div>

        </form>

      </div>
    <div className="p-4 bg-white shadow-md rounded-xl">
  <h2 className="text-2xl font-semibold mb-4 text-gray-700">Journal</h2>

  <div className="overflow-x-auto">
    <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
      
      <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
        <tr>
          <th className="px-4 py-2 border">Date</th>
          <th className="px-4 py-2 border">Objet</th>
          <th className="px-4 py-2 border">Type</th>
          <th className="px-4 py-2 border">Compte</th>
          <th className="px-4 py-2 border text-right">Débit</th>
          <th className="px-4 py-2 border text-right">Crédit</th>
        </tr>
      </thead>

      <tbody className="text-gray-600">
        {journal.map((ecriture) =>
          ecriture?.lignes?.map((l) => (
            <tr
              key={l.id}
              className="hover:bg-gray-50 transition duration-150"
            >
              <td className="px-4 py-2 border">
                {new Date(ecriture.date).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border">{ecriture.objet}</td>
              <td className="px-4 py-2 border">{ecriture.type}</td>
              <td className="px-4 py-2 border">
                {l.compte?.libelle || "Compte"}
              </td>
              <td className="px-4 py-2 border text-right text-green-600 font-medium">
                {l.debit ? l.debit.toLocaleString() : "-"}
              </td>
              <td className="px-4 py-2 border text-right text-red-600 font-medium">
                {l.credit ? l.credit.toLocaleString() : "-"}
              </td>
            </tr>
          ))
        )}
      </tbody>

    </table>
  </div>
</div>

    {/* ================= Grand Livre ================= */}
<div className="p-4 bg-white shadow-md rounded-xl mt-6">
  <h2 className="text-2xl font-semibold mb-4 text-gray-700">
    Grand Livre
  </h2>

  {Object.entries(grandLivre).map(([compte, lignes]) => {
    const totalDebit = lignes.reduce((sum, l) => sum + (l.debit || 0), 0);
    const totalCredit = lignes.reduce((sum, l) => sum + (l.credit || 0), 0);

    return (
      <div key={compte} className="mb-6 border rounded-lg overflow-hidden shadow-sm">
        
        {/* Header du compte */}
        <div className="bg-gray-50 px-4 py-2 border-b">
          <h3 className="font-semibold text-gray-700">{compte}</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th className="px-4 py-2 border">Libellé</th>
                <th className="px-4 py-2 border text-right">Débit</th>
                <th className="px-4 py-2 border text-right">Crédit</th>
              </tr>
            </thead>

            <tbody className="text-gray-600">
              {lignes.map((l) => (
                <tr
                  key={l.id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-4 py-2 border">
                    {l.libelle || "–"}
                  </td>
                  <td className="px-4 py-2 border text-right text-green-600 font-medium">
                    {l.debit ? l.debit.toLocaleString() : "-"}
                  </td>
                  <td className="px-4 py-2 border text-right text-red-600 font-medium">
                    {l.credit ? l.credit.toLocaleString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Totaux */}
            <tfoot className="bg-gray-100 font-semibold">
              <tr>
                <td className="px-4 py-2 border text-right">Total</td>
                <td className="px-4 py-2 border text-right text-green-700">
                  {totalDebit.toLocaleString()}
                </td>
                <td className="px-4 py-2 border text-right text-red-700">
                  {totalCredit.toLocaleString()}
                </td>
              </tr>
            </tfoot>

          </table>
        </div>
      </div>
    );
  })}
</div>

    {/* ================= Balance ================= */}
<div className="p-4 bg-white shadow-md rounded-xl mt-6">
  <h2 className="text-2xl font-semibold mb-4 text-gray-700">
    Balance
  </h2>

  <div className="overflow-x-auto">
    <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
      
      <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
        <tr>
          <th className="px-4 py-2 border">Compte</th>
          <th className="px-4 py-2 border text-right">Débit Total</th>
          <th className="px-4 py-2 border text-right">Crédit Total</th>
          <th className="px-4 py-2 border text-right">Solde</th>
        </tr>
      </thead>

      <tbody className="text-gray-600">
        {Object.entries(balance).map(([compte, bal]) => {
          const solde = (bal.debit || 0) - (bal.credit || 0);

          return (
            <tr
              key={compte}
              className="hover:bg-gray-50 transition duration-150"
            >
              <td className="px-4 py-2 border font-medium">
                {compte}
              </td>

              <td className="px-4 py-2 border text-right text-green-600 font-medium">
                {bal.debit ? bal.debit.toLocaleString() : "-"}
              </td>

              <td className="px-4 py-2 border text-right text-red-600 font-medium">
                {bal.credit ? bal.credit.toLocaleString() : "-"}
              </td>

              <td
                className={`px-4 py-2 border text-right font-semibold ${
                  solde >= 0 ? "text-green-700" : "text-red-700"
                }`}
              >
                {solde.toLocaleString()}
              </td>
            </tr>
          );
        })}
      </tbody>

      {/* Totaux globaux */}
      <tfoot className="bg-gray-100 font-semibold">
        <tr>
          <td className="px-4 py-2 border text-right">Total</td>

          <td className="px-4 py-2 border text-right text-green-700">
            {Object.values(balance)
              .reduce((sum, b) => sum + (b.debit || 0), 0)
              .toLocaleString()}
          </td>

          <td className="px-4 py-2 border text-right text-red-700">
            {Object.values(balance)
              .reduce((sum, b) => sum + (b.credit || 0), 0)
              .toLocaleString()}
          </td>

          <td className="px-4 py-2 border"></td>
        </tr>
      </tfoot>

    </table>
  </div>
</div>

 {/* ================= Compte de Résultat ================= */}
<div className="p-4 bg-white shadow-md rounded-xl mt-6">
  <h2 className="text-2xl font-semibold mb-4 text-gray-700">
    Compte de Résultat
  </h2>

  {compteResultat && (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
        
        <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
          <tr>
            <th className="px-4 py-2 border text-left">Libellé</th>
            <th className="px-4 py-2 border text-right">Montant</th>
          </tr>
        </thead>

        <tbody className="text-gray-600">
          
          {/* PRODUITS */}
          <tr className="bg-green-50">
            <td className="px-4 py-2 border font-semibold text-green-700">
              Total Produits (Recettes)
            </td>
            <td className="px-4 py-2 border text-right text-green-700 font-semibold">
              {compteResultat.totalProduits?.toLocaleString() || "0"}
            </td>
          </tr>

          {/* CHARGES */}
          <tr className="bg-red-50">
            <td className="px-4 py-2 border font-semibold text-red-700">
              Total Charges
            </td>
            <td className="px-4 py-2 border text-right text-red-700 font-semibold">
              {compteResultat.totalCharges?.toLocaleString() || "0"}
            </td>
          </tr>

          {/* RESULTAT */}
          <tr className="bg-gray-100">
            <td className="px-4 py-2 border font-bold text-gray-800">
              Résultat Net (Solde)
            </td>
            <td
              className={`px-4 py-2 border text-right font-bold ${
                compteResultat.resultat >= 0
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {compteResultat.resultat?.toLocaleString() || "0"}
            </td>
          </tr>

        </tbody>

      </table>
    </div>
  )}
</div>


{/* ================= Bilan ================= */}
{/* <div className="p-4 bg-white shadow-md rounded-xl mt-6">
  <h2 className="text-2xl font-semibold mb-4 text-gray-700">
    Bilan
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    {/* ================= ACTIF ================= */}
    {/* <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="bg-green-50 px-4 py-2 border-b">
        <h3 className="font-semibold text-green-700">Actif</h3>
      </div>

      <table className="min-w-full">
        <thead className="bg-gray-100 text-sm uppercase text-gray-700">
          <tr>
            <th className="px-4 py-2 border text-left">Libellé</th>
            <th className="px-4 py-2 border text-right">Montant</th>
          </tr>
        </thead>

        <tbody className="text-gray-600">
          {bilan.actif.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{item.libelle}</td>
              <td className="px-4 py-2 border text-right text-green-600 font-medium">
                {item.montant?.toLocaleString() || "0"}
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot className="bg-gray-100 font-semibold">
          <tr>
            <td className="px-4 py-2 border text-right">Total Actif</td>
            <td className="px-4 py-2 border text-right text-green-700">
              {bilan.actif
                .reduce((sum, a) => sum + (a.montant || 0), 0)
                .toLocaleString()}
            </td>
          </tr>
        </tfoot>
      </table>
    </div> */}

    {/* ================= PASSIF ================= */}
    {/* <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="bg-red-50 px-4 py-2 border-b">
        <h3 className="font-semibold text-red-700">Passif</h3>
      </div>

      <table className="min-w-full">
        <thead className="bg-gray-100 text-sm uppercase text-gray-700">
          <tr>
            <th className="px-4 py-2 border text-left">Libellé</th>
            <th className="px-4 py-2 border text-right">Montant</th>
          </tr>
        </thead>

        <tbody className="text-gray-600">
          {bilan.passif.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{item.libelle}</td>
              <td className="px-4 py-2 border text-right text-red-600 font-medium">
                {item.montant?.toLocaleString() || "0"}
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot className="bg-gray-100 font-semibold">
          <tr>
            <td className="px-4 py-2 border text-right">Total Passif</td>
            <td className="px-4 py-2 border text-right text-red-700">
              {bilan.passif
                .reduce((sum, p) => sum + (p.montant || 0), 0)
                .toLocaleString()}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

  </div> */}

  {/* ================= EQUILIBRE ================= */}
  {/* <div className="mt-6 text-center">
    {(() => {
      const totalActif = bilan.actif.reduce((sum, a) => sum + (a.montant || 0), 0);
      const totalPassif = bilan.passif.reduce((sum, p) => sum + (p.montant || 0), 0);
      const isEquilibre = totalActif === totalPassif;

      return (
        <div
          className={`inline-block px-6 py-3 rounded-lg font-semibold ${
            isEquilibre
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isEquilibre
            ? "✔️ Bilan équilibré"
            : "⚠️ Bilan non équilibré"}
        </div>
      );
    })()}
  </div> */}
{/* </div>  */}

{/* ================= Bilan ================= */}
<div className="p-4 bg-white shadow-md rounded-xl mt-6">
  <h2 className="text-2xl font-semibold mb-4 text-gray-700">
    Bilan
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    {/* ACTIF */}
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="bg-green-50 px-4 py-2 border-b">
        <h3 className="font-semibold text-green-700">Actif</h3>
      </div>

      <table className="min-w-full">
        <thead className="bg-gray-100 text-sm uppercase text-gray-700">
          <tr>
            <th className="px-4 py-2 border text-left">Libellé</th>
            <th className="px-4 py-2 border text-right">Montant</th>
          </tr>
        </thead>

        <tbody className="text-gray-600">
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-2 border">Banque</td>
            <td className="px-4 py-2 border text-right text-green-600">1,200,000</td>
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-2 border">Caisse</td>
            <td className="px-4 py-2 border text-right text-green-600">300,000</td>
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-2 border">Stocks</td>
            <td className="px-4 py-2 border text-right text-green-600">450,000</td>
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-2 border">Immobilisations</td>
            <td className="px-4 py-2 border text-right text-green-600">2,000,000</td>
          </tr>
        </tbody>

        <tfoot className="bg-gray-100 font-semibold">
          <tr>
            <td className="px-4 py-2 border text-right">Total Actif</td>
            <td className="px-4 py-2 border text-right text-green-700">
              3,950,000
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    {/* PASSIF */}
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="bg-red-50 px-4 py-2 border-b">
        <h3 className="font-semibold text-red-700">Passif</h3>
      </div>

      <table className="min-w-full">
        <thead className="bg-gray-100 text-sm uppercase text-gray-700">
          <tr>
            <th className="px-4 py-2 border text-left">Libellé</th>
            <th className="px-4 py-2 border text-right">Montant</th>
          </tr>
        </thead>

        <tbody className="text-gray-600">
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-2 border">Capital</td>
            <td className="px-4 py-2 border text-right text-red-600">2,500,000</td>
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-2 border">Réserves</td>
            <td className="px-4 py-2 border text-right text-red-600">500,000</td>
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-2 border">Dettes fournisseurs</td>
            <td className="px-4 py-2 border text-right text-red-600">600,000</td>
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-2 border">Emprunts</td>
            <td className="px-4 py-2 border text-right text-red-600">350,000</td>
          </tr>
        </tbody>

        <tfoot className="bg-gray-100 font-semibold">
          <tr>
            <td className="px-4 py-2 border text-right">Total Passif</td>
            <td className="px-4 py-2 border text-right text-red-700">
              3,950,000
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

  </div> 

  {/* EQUILIBRE */}
  <div className="mt-6 text-center">
    <div className="inline-block px-6 py-3 rounded-lg font-semibold bg-green-100 text-green-700">
      ✔️ Bilan équilibré
    </div>
  </div>
</div>
    </div>
  );
};

export default ComptabilitePage;