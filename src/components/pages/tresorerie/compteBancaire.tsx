 

import React from "react";
import { Bell, Plus, Building2, ExternalLink, Copy } from "lucide-react";

/* ===========================
   INTERFACE COMPLETE
=========================== */

interface AccountCardProps {
  id: string;
  bank: string;
  subtitle: string;
  balance: number;
  currency: string;
  type: string;
  iban: string;
  accountNumber: string;
  lastUpdate: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  availableBalance: number;
  blockedBalance: number;
}

/* ===========================
   FORMATTER €
=========================== */

const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(amount);

/* ===========================
   ACCOUNT CARD
=========================== */

const AccountCard: React.FC<AccountCardProps> = ({
  bank,
  subtitle,
  balance,
  currency,
  type,
  iban,
  lastUpdate,
  status,
  availableBalance,
  blockedBalance,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 w-full hover:shadow-md transition">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-3 rounded-xl">
            <Building2 className="text-blue-600" size={22} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{bank}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
        <ExternalLink size={18} className="text-gray-400 cursor-pointer" />
      </div>

      {/* Balance */}
      <div className="mt-6">
        <p className="text-sm text-gray-500">Solde Total</p>
        <p className="text-3xl font-bold text-blue-600 mt-1">
          {formatCurrency(balance, currency)}
        </p>
      </div>

      {/* Details */}
      <div className="mt-5 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Type</span>
          <span className="font-medium text-gray-900">{type}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">IBAN</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-900">{iban}</span>
            <Copy size={14} className="text-gray-400 cursor-pointer" />
          </div>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Disponible</span>
          <span className="text-green-600 font-medium">
            {formatCurrency(availableBalance, currency)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Bloqué</span>
          <span className="text-red-500 font-medium">
            {formatCurrency(blockedBalance, currency)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Statut</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              status === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : status === "SUSPENDED"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {status}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Dernière MàJ</span>
          <span className="text-gray-900">{lastUpdate}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-3">
        <button className="flex-1 border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition">
          Historique
        </button>
        <button className="flex-1 bg-gray-100 rounded-lg py-2 text-sm font-medium hover:bg-gray-200 transition">
          Virement
        </button>
      </div>
    </div>
  );
};

/* ===========================
   DATA DYNAMIQUE
=========================== */

const accounts: AccountCardProps[] = [
  {
    id: "1",
    bank: "BNP Paribas Principal",
    subtitle: "BNP Paribas",
    balance: 45230.5,
    currency: "EUR",
    type: "Compte Courant",
    iban: "FR76 **** **** 8901",
    accountNumber: "000123456",
    lastUpdate: "Il y a 2 heures",
    status: "ACTIVE",
    availableBalance: 43000,
    blockedBalance: 2230.5,
  },
  {
    id: "2",
    bank: "Société Générale Livret",
    subtitle: "Société Générale",
    balance: 75000,
    currency: "EUR",
    type: "Compte Épargne",
    iban: "FR76 **** **** 5678",
    accountNumber: "000987654",
    lastUpdate: "Il y a 1 heure",
    status: "ACTIVE",
    availableBalance: 75000,
    blockedBalance: 0,
  },
];

/* ===========================
   PAGE PRINCIPALE
=========================== */

const renderTresorieCompteBancairePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <input
          type="text"
          placeholder="Rechercher une transaction, un compte..."
          className="w-96 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-center gap-6">
          <Bell className="text-gray-600 cursor-pointer" />
          <div className="text-right">
            <p className="text-sm text-gray-500">Solde Global</p>
            <p className="font-bold text-blue-600">124 592,00 €</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Comptes Bancaires
            </h1>
            <p className="text-gray-500 mt-1">
              Vue d'ensemble de vos disponibilités par établissement.
            </p>
          </div>

          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <Plus size={18} />
            Ajouter un compte
          </button>
        </div>

        {/* Cards dynamiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {accounts.map((account) => (
            <AccountCard key={account.id} {...account} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default renderTresorieCompteBancairePage;

