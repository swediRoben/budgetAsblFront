import React, { useEffect, useState } from "react";
import axios from "axios";

const ComptabilitePage = () => {
  const [journal, setJournal] = useState([]);
  const [grandLivre, setGrandLivre] = useState({});
  const [balance, setBalance] = useState({});
  const [compteResultat, setCompteResultat] = useState(null);

  // =======================
  // 1️⃣ Récupérer les données depuis l'API
  // =======================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const journalRes = await axios.get("http://localhost:8080/budget/v1/api/comptabilite/journal");
        setJournal(journalRes.data);

        const grandLivreRes = await axios.get("http://localhost:8080/budget/v1/api/comptabilite/grand-livre");
        setGrandLivre(grandLivreRes.data);

        const balanceRes = await axios.get("http://localhost:8080/budget/v1/api/comptabilite/balance");
        setBalance(balanceRes.data);

        const compteRes = await axios.get("http://localhost:8080/budget/v1/api/comptabilite/compte-resultat");
        setCompteResultat(compteRes.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, []);

  // =======================
  // 2️⃣ Rendu des tableaux
  // =======================
  return (
    <div className="p-6 space-y-10">
      {/* ================= Journal ================= */}
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
                  {ecriture.lignes.map((l) => (
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