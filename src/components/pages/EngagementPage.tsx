import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign,Settings2,BadgeDollarSign } from 'lucide-react';

 
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast"; 

export default function renderEngagementPage (){  
    const [formData, setFormData] = useState({}); 
    const [showEngagementList, setShowEngagementList] = useState(false);
    const [showLiquidationList, setShowLiquidationList] = useState(false);
    const [engagements, setEngagements] = useState([
      { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
      { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
      { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
      { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
      { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
      { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
      { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
      { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
      { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
      { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
      { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
      { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
      { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
      { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
      { id: 2, numero: 'ENG-2025-002', date: '2025-01-20', beneficiaire: 'Fournisseur B', montant: 3500000, statut: 'Validé' }
    ]);
      const handleInputChange = (e:any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

      const handleAfficherEngagementList = (e:any) => {
        e.preventDefault();
        const newEngagement = {
          id: engagements.length + 1,
          numero: `ENG-2025-${String(engagements.length + 1).padStart(3, '0')}`,
          date: formData.dateEngagement,
          beneficiaire: formData.beneficiaire,
          montant: parseFloat(formData.montantEngagement || 0),
          statut: 'En cours'
        };
        setEngagements([...engagements, newEngagement]);
        setShowEngagementList(true);
      };
    
       
        
      
       return (
         <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        {/* Header */}
        <div className="mb-8 border-b pb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Engagement de Dépense
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Saisie et consultation des engagements budgétaires
          </p>
         <p className="mt-3 text-sm font-medium flex flex-wrap gap-3">
        <span
          onClick={() => handleFilterStatus('VALIDE')}
          className="cursor-pointer select-none rounded-full
                     bg-green-50 px-4 py-1.5 text-green-700
                     border border-green-200
                     hover:bg-green-100 hover:shadow-sm transition"
        >
          Validé <strong>3</strong>
        </span>
      
        <span
          onClick={() => handleFilterStatus('RETOURNE')}
          className="cursor-pointer select-none rounded-full
                     bg-yellow-50 px-4 py-1.5 text-yellow-700
                     border border-yellow-200
                     hover:bg-yellow-100 hover:shadow-sm transition"
        >
          Retourné <strong>4</strong>
        </span>
      
        <span
          onClick={() => handleFilterStatus('REJETE')}
          className="cursor-pointer select-none rounded-full
                     bg-red-50 px-4 py-1.5 text-red-700
                     border border-red-200
                     hover:bg-red-100 hover:shadow-sm transition"
        >
          Rejeté <strong>5</strong>
        </span>
      
        <span
          onClick={() => handleFilterStatus('RECEPTIONNE')}
          className="cursor-pointer select-none rounded-full
                     bg-blue-50 px-4 py-1.5 text-blue-700
                     border border-blue-200
                     hover:bg-blue-100 hover:shadow-sm transition"
        >
          Réceptionné <strong>6</strong>
        </span>
      </p>
      
        </div>
      
        {/* Formulaire */}
        <form onSubmit={handleAfficherEngagementList} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Exercice */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exercice budgétaire
              </label>
              <select
                name="exercice"
                value={formData.exercice || ''}
                onChange={handleInputChange}
                disabled
                required
                className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
      
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date d’engagement
              </label>
              <input
                type="date"
                name="dateEngagement"
                value={formData.dateEngagement || ''}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                           focus:ring-2 focus:ring-blue-500"
              />
            </div>
      
            {/* Projet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Projet
              </label>
              <select
                name="projet"
                value={formData.projet || ''}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                           focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner un projet</option>
                <option value="611">611 - Projet 1</option>
                <option value="612">612 - Projet 2</option>
                <option value="613">613 - Projet 3</option>
              </select>
            </div>
      
            {/* Ligne budgétaire */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ligne budgétaire
              </label>
              <select
                name="ligneBudgetaire"
                value={formData.ligneBudgetaire || ''}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                           focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner une ligne</option>
                <option value="611">611 - Salaires et traitements</option>
                <option value="621">621 - Fournitures de bureau</option>
                <option value="622">622 - Services extérieurs</option>
              </select>
            </div>
      
            {/* Bénéficiaire */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bénéficiaire
              </label>
              <input
                type="text"
                name="beneficiaire"
                value={formData.beneficiaire || ''}
                readOnly
                className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
              />
            </div>
      
            {/* Responsable */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsable
              </label>
              <select
                name="responsable"
                value={formData.responsable || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                           focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="FARAJA">FARAJA</option>
                <option value="MALU">MALU</option>
                <option value="ESPOIRE">ESPOIRE</option>
              </select>
            </div>
      
            {/* Objet */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Objet de l’engagement
              </label>
              <input
                type="text"
                name="objetEngagement"
                value={formData.objetEngagement || ''}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                           focus:ring-2 focus:ring-blue-500"
              />
            </div>
      
            {/* Montant */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Montant
              </label>
              <input
                type="number"
                step="0.01"
                name="montantEngagement"
                value={formData.montantEngagement || ''}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                           focus:ring-2 focus:ring-blue-500"
              />
            </div>
              {/* Bloc récapitulatif visuel */}
          </div>
      
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border rounded-lg bg-gray-50 p-4">
            <div>
              <p className="text-xs text-gray-500">Montant engagé</p>
              <p className="text-lg font-semibold text-gray-800">—</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">montant alloué</p>
              <p className="text-lg font-semibold text-blue-700">—</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Montant restant</p>
              <p className="text-lg font-semibold text-green-700">—</p>
            </div>
          </div>
          {/* Observations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observations
            </label>
            <textarea
             readOnly
             disabled
              name="observationsEngagement"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                         focus:ring-2 focus:ring-blue-500"
            />
          </div>
      
          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={()=>setShowEngagementList(true)}
              className="inline-flex items-center rounded-md bg-blue-600 px-6 py-2 text-sm
                         font-medium text-white hover:bg-blue-700 transition"
            >
              Afficher la liste
            </button>
          </div>
        </form>
      
        {/* Liste */}
      {showEngagementList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-[90%] max-w-6xl rounded-xl shadow-xl">
      
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                📄 Liste des engagements
              </h3>
              <button
                onClick={() => setShowEngagementList(false)}
                className="text-gray-500 hover:text-red-600 text-xl font-bold"
              >
                ×
              </button>
            </div>
      
            {/* Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 text-gray-600 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left">N°</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Bénéficiaire</th>
                      <th className="px-4 py-3 text-right">Montant</th>
                      <th className="px-4 py-3 text-center">Statut</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
      
                  <tbody>
                    {engagements.map((eng) => (
                      <tr
                        key={eng.id}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-2">{eng.numero}</td>
                        <td className="px-4 py-2">{eng.date}</td>
                        <td className="px-4 py-2">{eng.beneficiaire}</td>
      
                        <td className="px-4 py-2 text-right font-medium">
                          {eng.montant.toLocaleString('fr-FR', {
                            minimumFractionDigits: 2,
                          })}
                        </td>
      
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold
                              ${
                                eng.statut === 'Validé'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                          >
                            {eng.statut}
                          </span>
                        </td>
      
                        <td className="px-4 py-2 text-center space-x-2">
                          <button className="px-3 py-1 text-xs rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100">
                            Voir
                          </button>
                          <button className="px-3 py-1 text-xs rounded-md bg-green-50 text-green-600 hover:bg-green-100">
                            Modifier
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
      
            {/* Footer */}
            <div className="flex justify-end px-6 py-4 border-t bg-gray-50 rounded-b-xl">
              <button
                onClick={() => setShowEngagementList(false)}
                className="px-4 py-2 text-sm rounded-md bg-gray-600 text-white hover:bg-gray-700"
              >
                Fermer
              </button>
            </div>
      
          </div>
        </div>
      )}
      
      </div>
      
        ); 
}