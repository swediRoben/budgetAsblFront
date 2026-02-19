import React from "react";
import { RefreshCcw, CheckCircle, AlertCircle } from "lucide-react";

interface TransactionProps {
  title: string;
  date: string;
  amount: string;
  status?: "matched" | "pending";
  reference?: string;
}

const renderTresorieRapprochementPage: React.FC<TransactionProps> = ({
  title,
  date,
  amount,
  status,
  reference,
}) => {
  const isMatched = status === "matched";

  return (
    <div
      className={`p-5 rounded-xl border transition ${
        isMatched
          ? "bg-green-50 border-green-200"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {date} &nbsp; {amount}
          </p>
        </div>

        {isMatched ? (
          <div className="flex items-center gap-2 bg-white border border-green-300 text-green-600 px-4 py-2 rounded-lg text-sm font-medium">
            <CheckCircle size={16} />
            Rapproché: {reference}
          </div>
        ) : (
          <div className="flex gap-3">
            <button className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg text-sm font-medium">
              À traiter
            </button>
            <button className="border border-dashed border-gray-400 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
              Trouver une correspondance
            </button>
            <button className="bg-gray-100 px-4 py-2 rounded-lg text-sm hover:bg-gray-200">
              Créer écriture
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const BankReconciliation: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">
            Rapprochement Bancaire
          </h1>
          <p className="text-gray-600 mt-2">
            Faites correspondre vos lignes bancaires avec vos écritures comptables.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <RefreshCcw size={18} />
          Actualiser les flux
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Lignes à Rapprocher
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Transactions bancaires importées nécessitant une validation.
            </p>

            <div className="space-y-4">
              <TransactionItem
                title="VIR SEPA RECU 12500.00 EUR"
                date="2024-02-15"
                amount="12 500,00 €"
                status="matched"
                reference="TRX-001"
              />

              <TransactionItem
                title="PRLV SEPA LOYER"
                date="2024-02-14"
                amount="-2 500,00 €"
                status="matched"
                reference="TRX-002"
              />

              <TransactionItem
                title="CB AMAZON MARKETPLACE"
                date="2024-02-14"
                amount="-124,50 €"
                status="pending"
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Etat */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              État du Rapprochement
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Solde Bancaire Réel</span>
                <span className="font-medium">124 592,00 €</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Solde Comptable</span>
                <span className="font-medium">124 731,50 €</span>
              </div>

              <div className="flex justify-between">
                <span className="text-red-600 font-medium">Écart</span>
                <span className="text-red-600 font-semibold">
                  -139,50 €
                </span>
              </div>
            </div>

            <div className="mt-5 bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex gap-3 text-sm text-yellow-800">
              <AlertCircle size={18} />
              2 transactions non rapprochées détectées ce mois-ci.
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Suggestions IA
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Correspondances probables détectées.
            </p>

            <div className="mt-4 text-sm text-gray-600">
              Aucune suggestion automatique disponible pour le moment.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default renderTresorieRapprochementPage;
