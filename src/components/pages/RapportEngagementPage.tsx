import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign,Settings2,BadgeDollarSign } from 'lucide-react';
 
export default function renderRapportEngagementPage (){ 
      return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold uppercase">Rapport d’Engagement Budgétaire</h2>
            <button
              onClick={() => window.print()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Imprimer
            </button>
          </div>
      
          <div className="flex justify-between mb-6">
            <div className="space-y-1">
              <p className="text-gray-700"><span className="font-medium">ONG / ASBL :</span> ____________________</p>
              <p className="text-gray-700"><span className="font-medium">Exercice :</span> 2025</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-700"><span className="font-medium">N° Engagement :</span> ENG-001</p>
              <p className="text-gray-700"><span className="font-medium">Date :</span> ____ / ____ / 2025</p>
            </div>
          </div>
      
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Programme</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Activité</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Ligne budgétaire</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Montant engagé</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">Santé</td>
                <td className="border border-gray-300 px-4 py-2">Achat médicaments</td>
                <td className="border border-gray-300 px-4 py-2">60101</td>
                <td className="border border-gray-300 px-4 py-2">________</td>
              </tr>
            </tbody>
          </table>
      
          <div className="flex justify-between mt-12">
            <div className="text-center">
              <p className="text-gray-700 font-medium">Ordonnateur</p>
              <div className="border-t border-gray-700 mt-8 w-40 mx-auto"></div>
            </div>
            <div className="text-center">
              <p className="text-gray-700 font-medium">Responsable financier</p>
              <div className="border-t border-gray-700 mt-8 w-40 mx-auto"></div>
            </div>
          </div>
        </div>
      );
      
       
}