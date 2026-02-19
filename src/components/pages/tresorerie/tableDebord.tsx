import React from "react";

const renderTresorieTableBorPage: React.FC = () => {
  const transactions = [
    {
      date: "15/02/2024",
      description: "Paiement Client - TechCorp",
      category: "Ventes",
      reference: "INV-2024-001",
      amount: 12500,
    },
    {
      date: "14/02/2024",
      description: "Loyer Bureau Février",
      category: "Loyer",
      reference: "RENT-FEB",
      amount: -2500,
    },
    {
      date: "14/02/2024",
      description: "Achat Matériel Informatique",
      category: "Équipement",
      reference: "PO-4592",
      amount: -1240.5,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex items-center justify-between bg-white px-8 py-4 border-b">
        <div className="w-1/3">
          <input
            type="text"
            placeholder="Rechercher une transaction..."
            className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-9 h-9 rounded-full border flex items-center justify-center cursor-pointer">
              🔔
            </div>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500">Solde Global</p>
            <p className="text-blue-600 font-semibold text-lg">
              124 592,00 €
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-8 space-y-8">
        {/* TITLE */}
        <div>
          <h1 className="text-2xl font-bold">Tableau de Bord</h1>
          <p className="text-gray-500">
            Situation de trésorerie au 15 février 2024
          </p>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h4 className="text-sm text-gray-500">
              Disponibilité Totale
            </h4>
            <p className="text-2xl font-bold mt-2">
              135 920,85 €
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h4 className="text-sm text-gray-500">
              Encaissements (Mois)
            </h4>
            <p className="text-2xl font-bold text-green-600 mt-2">
              20 200,00 €
            </p>
            <p className="text-xs text-gray-400 mt-1">
              8 transactions ce mois-ci
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h4 className="text-sm text-gray-500">
              Décaissements (Mois)
            </h4>
            <p className="text-2xl font-bold text-red-600 mt-2">
              17 975,00 €
            </p>
            <p className="text-xs text-gray-400 mt-1">
              4 factures en attente
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h4 className="text-sm text-gray-500">Solde Net</h4>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              2 225,00 €
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Flux de trésorerie net
            </p>
          </div>
        </div>

        {/* TRANSACTION TABLE */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b flex justify-between">
            <div>
              <h3 className="font-semibold text-lg">
                Dernières Transactions
              </h3>
              <p className="text-sm text-gray-500">
                Historique récent des mouvements
              </p>
            </div>

            <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
              Voir tout
            </button>
          </div>

          <table className="w-full text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Description</th>
                <th className="text-left p-4">Catégorie</th>
                <th className="text-left p-4">Référence</th>
                <th className="text-right p-4">Montant</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((tx, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4">{tx.date}</td>
                  <td className="p-4">{tx.description}</td>
                  <td className="p-4">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                      {tx.category}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">
                    {tx.reference}
                  </td>
                  <td
                    className={`p-4 text-right font-semibold ${
                      tx.amount > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {tx.amount.toLocaleString("fr-FR")} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default renderTresorieTableBorPage;
