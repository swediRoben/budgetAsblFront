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
      <div>
        <h2 className="text-xl font-bold mb-2">Journal</h2>
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Objet</th>
              <th className="border px-2 py-1">Type</th>
              <th className="border px-2 py-1">Lignes (Débit / Crédit)</th>
            </tr>
          </thead>
          <tbody>
            {journal.map((ecriture) => (
              <tr key={ecriture.id}>
                <td className="border px-2 py-1">
                  {new Date(ecriture.date).toLocaleDateString()}
                </td>
                <td className="border px-2 py-1">{ecriture.objet}</td>
                <td className="border px-2 py-1">{ecriture.type}</td>
                <td className="border px-2 py-1">
                  {ecriture?.lignes?.map((l) => (
                    <div key={l.id}>
                      {l.compte?.libelle || "Compte"} : Débit {l.debit || 0} / Crédit {l.credit || 0}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= Grand Livre ================= */}
      <div>
        <h2 className="text-xl font-bold mb-2">Grand Livre</h2>
        {Object.entries(grandLivre).map(([compte, lignes]) => (
          <div key={compte} className="mb-4">
            <h3 className="font-semibold">{compte}</h3>
            <table className="w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">Libellé</th>
                  <th className="border px-2 py-1">Débit</th>
                  <th className="border px-2 py-1">Crédit</th>
                </tr>
              </thead>
              <tbody>
                {lignes.map((l) => (
                  <tr key={l.id}>
                    <td className="border px-2 py-1">{l.libelle || "–"}</td>
                    <td className="border px-2 py-1">{l.debit || 0}</td>
                    <td className="border px-2 py-1">{l.credit || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* ================= Balance ================= */}
      <div>
        <h2 className="text-xl font-bold mb-2">Balance</h2>
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Compte</th>
              <th className="border px-2 py-1">Débit Total</th>
              <th className="border px-2 py-1">Crédit Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(balance).map(([compte, bal]) => (
              <tr key={compte}>
                <td className="border px-2 py-1">{compte}</td>
                <td className="border px-2 py-1">{bal.debit}</td>
                <td className="border px-2 py-1">{bal.credit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= Compte de Résultat ================= */}
      <div>
        <h2 className="text-xl font-bold mb-2">Compte de Résultat</h2>
        {compteResultat && (
          <table className="w-full border border-gray-300">
            <tbody>
              <tr>
                <td className="border px-2 py-1 font-semibold">Total Charges</td>
                <td className="border px-2 py-1">{compteResultat.totalCharges}</td>
              </tr>
              <tr>
                <td className="border px-2 py-1 font-semibold">Total Produits</td>
                <td className="border px-2 py-1">{compteResultat.totalProduits}</td>
              </tr>
              <tr>
                <td className="border px-2 py-1 font-semibold">Résultat Net</td>
                <td className="border px-2 py-1">{compteResultat.resultat}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ComptabilitePage;