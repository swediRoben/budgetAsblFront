import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign,Settings2,BadgeDollarSign } from 'lucide-react';
 
export default function renderRapportEngagementPage (){ 
      return (
       <div className="max-w-6xl mx-auto bg-white p-10 rounded-sm shadow-sm border border-gray-100 print:border-0 print:shadow-none print:p-0">
  
  {/* EN-TÊTE INSTITUTIONNEL */}
  <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-8">
    <div className="space-y-1">
      <h1 className="text-xl font-bold uppercase tracking-tight text-gray-900">Nom de l'Organisation / ONG</h1>
      <p className="text-xs italic text-gray-500">Département des Finances & Administration</p>
      <p className="text-[10px] text-gray-400">Adresse : _________________________________</p>
    </div>
    
    <div className="text-right">
      <h2 className="text-lg font-black uppercase text-blue-900">État Récapitulatif des Liquidations</h2>
      <p className="text-sm font-medium">Période : ____________________</p>
      <button
        onClick={() => window.print()}
        className="mt-2 bg-slate-800 text-white px-4 py-1.5 text-xs font-bold rounded shadow hover:bg-slate-700 transition print:hidden"
      >
        IMPRIMER LE RAPPORT
      </button>
    </div>
  </div>

  {/* INFOS PROJET */}
  <div className="grid grid-cols-3 gap-6 mb-8 bg-gray-50 p-4 border border-gray-200 rounded-lg">
    <div>
      <span className="block text-[10px] uppercase font-bold text-gray-500 italic">Projet / Programme</span>
      <span className="text-sm font-semibold">___________________________</span>
    </div>
    <div>
      <span className="block text-[10px] uppercase font-bold text-gray-500 italic">Code Budgétaire</span>
      <span className="text-sm font-semibold">B-2025-00X</span>
    </div>
    <div>
      <span className="block text-[10px] uppercase font-bold text-gray-500 italic">Devise</span>
      <span className="text-sm font-semibold">USD / Francs</span>
    </div>
  </div>

  {/* TABLEAU DES LIQUIDATIONS */}
  <table className="w-full border-collapse border border-gray-400 mb-8">
    <thead>
      <tr className="bg-gray-800 text-white text-[11px] uppercase tracking-wider">
        <th className="border border-gray-400 px-3 py-3 text-left w-20">Date</th>
        <th className="border border-gray-400 px-3 py-3 text-left w-28">N° Liq.</th>
        <th className="border border-gray-400 px-3 py-3 text-left">Bénéficiaire / Fournisseur</th>
        <th className="border border-gray-400 px-3 py-3 text-left">Détails de l'Engagement</th>
        <th className="border border-gray-400 px-3 py-3 text-right w-32">Montant</th>
      </tr>
    </thead>
    <tbody className="text-xs text-gray-800">
      {[1, 2, 3].map((item) => (
        <tr key={item} className="odd:bg-white even:bg-gray-50">
          <td className="border border-gray-300 px-3 py-2 text-center italic text-gray-400 underline">__/__/__</td>
          <td className="border border-gray-300 px-3 py-2 font-mono font-bold">LIQ-2025-00{item}</td>
          <td className="border border-gray-300 px-3 py-2">Pharmacie Centrale / Mission Santé</td>
          <td className="border border-gray-300 px-3 py-2 text-gray-600">Achat médicaments essentiels - Lot {item}</td>
          <td className="border border-gray-300 px-3 py-2 text-right font-bold tracking-wider">0,00</td>
        </tr>
      ))}
      {/* LIGNE DE TOTAL */}
      <tr className="bg-gray-100 font-bold border-t-2 border-gray-800 text-sm">
        <td colSpan="4" className="border border-gray-300 px-3 py-3 text-right uppercase tracking-widest">Total Général Liquidé</td>
        <td className="border border-gray-800 px-3 py-3 text-right bg-yellow-50 text-blue-900 italic underline">___________</td>
      </tr>
    </tbody>
  </table>

  {/* ZONE DE SIGNATURES TRIPLE (Standard ONG) */}
  <div className="grid grid-cols-3 gap-8 mt-16 px-4">
    <div className="text-center">
      <p className="text-[11px] uppercase font-black text-gray-400 mb-12">Préparé par (Comptabilité)</p>
      <div className="border-t border-dotted border-gray-800 pt-2 text-xs font-bold uppercase">Signature & Date</div>
    </div>
    <div className="text-center">
      <p className="text-[11px] uppercase font-black text-gray-400 mb-12">Vérifié par (Finances)</p>
      <div className="border-t border-dotted border-gray-800 pt-2 text-xs font-bold uppercase">Signature & Date</div>
    </div>
    <div className="text-center border-2 border-dashed border-gray-200 p-2">
      <p className="text-[11px] uppercase font-black text-gray-400 mb-12 italic text-red-600">Approuvé par (Direction)</p>
      <div className="border-t border-gray-800 pt-2 text-xs font-bold uppercase">Signature & Cachet</div>
    </div>
  </div>

  {/* FOOTER BAS DE PAGE */}
  <div className="mt-20 text-center border-t border-gray-100 pt-4">
    <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em]">Document généré électroniquement - Valide sans ratures</p>
  </div>
</div>
      );
      
       
}