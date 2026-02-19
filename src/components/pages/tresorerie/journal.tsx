import React from "react";

const renderTresorieJournalPage: React.FC = () => {
  const transactions = [
    {
      date: "15/02/2024",
      type: "Encaisse",
      label: "Paiement Client - TechCorp",
      category: "Ventes",
      reference: "INV-2024-001",
      amount: 12500,
    },
    {
      date: "14/02/2024",
      type: "Décaisse",
      label: "Loyer Bureau Février",
      category: "Loyer",
      reference: "RENT-FEB",
      amount: -2500,
    },
    {
      date: "14/02/2024",
      type: "Décaisse",
      label: "Achat Matériel Informatique",
      category: "Équipement",
      reference: "PO-4592",
      amount: -1240.5,
    },
    {
      date: "13/02/2024",
      type: "Encaisse",
      label: "Remboursement TVA",
      category: "Impôts",
      reference: "TVA-Q4",
      amount: 4500,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex items-center justify-between bg-white px-8 py-4 border-b">
        <input
          type="text"
          placeholder="Rechercher une transaction, un commentaire..."
          className="w-1/3 rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

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
      <div className="p-8">
        {/* TITLE */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            Journal de Trésorerie
          </h1>
          <p className="text-gray-500">
            Suivi détaillé des encaissements et décaissements.
          </p>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-wrap items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Rechercher par libellé ou référence..."
            className="flex-1 min-w-[250px] rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select className="rounded-lg border px-4 py-2 text-sm bg-white">
            <option>Toutes opérations</option>
            <option>Encaissements</option>
            <option>Décaissements</option>
          </select>

          <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
            Exporter
          </button>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Nouvelle Opération
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b">
              <tr>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">Libellé</th>
                <th className="text-left p-4">Catégorie</th>
                <th className="text-left p-4">Référence</th>
                <th className="text-right p-4">Montant</th>
                <th className="text-center p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((tx, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4">{tx.date}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        tx.amount > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>

                  <td className="p-4 font-medium">
                    {tx.label}
                  </td>

                  <td className="p-4 text-gray-600">
                    {tx.category}
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

                  <td className="p-4 text-center">
                    <button className="text-gray-400 hover:text-gray-700">
                      ⋯
                    </button>
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

export default renderTresorieJournalPage;
