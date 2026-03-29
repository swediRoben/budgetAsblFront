 export { OperationForm };
 
import React, { useState } from 'react';
import { PlusCircle, Trash2, Save, X, Search, ChevronDown, CreditCard, DollarSign, FileText, Layers, ArrowRightLeft } from 'lucide-react';

// Types based on your Java entities
enum TypeClasse {
  BILAN = 'BILAN',
  COMPTE_DE_RESULTAT = 'COMPTE_DE_RESULTAT',
  HORS_BILAN = 'HORS_BILAN',
}

interface Classe {
  id: number;
  code: string;
  libelle: string;
  type: TypeClasse;
}

interface PlanComptable {
  id: number;
  numero: string;
  libelle: string;
  classeId: number;
}

interface OperationComptableDetail {
  id?: number;
  debit: PlanComptable | null;
  credit: PlanComptable | null;
  debitId?: number;
  creditId?: number;
}

interface OperationComptable {
  id?: number;
  libelle: string;
  type: TypeClasse;
  classeId: number;
  classe?: Classe;
  details: OperationComptableDetail[];
}

// Mock data for dropdowns
const mockClasses: Classe[] = [
  { id: 1, code: '1', libelle: 'Comptes de capitaux', type: TypeClasse.BILAN },
  { id: 2, code: '2', libelle: 'Comptes d\'immobilisations', type: TypeClasse.BILAN },
  { id: 3, code: '3', libelle: 'Comptes de stocks', type: TypeClasse.BILAN },
  { id: 4, code: '4', libelle: 'Comptes de tiers', type: TypeClasse.BILAN },
  { id: 5, code: '5', libelle: 'Comptes financiers', type: TypeClasse.BILAN },
  { id: 6, code: '6', libelle: 'Comptes de charges', type: TypeClasse.COMPTE_DE_RESULTAT },
  { id: 7, code: '7', libelle: 'Comptes de produits', type: TypeClasse.COMPTE_DE_RESULTAT },
];

const mockPlanComptable: PlanComptable[] = [
  { id: 1, numero: '101', libelle: 'Capital social', classeId: 1 },
  { id: 2, numero: '102', libelle: 'Compte d\'apport', classeId: 1 },
  { id: 3, numero: '201', libelle: 'Frais d\'établissement', classeId: 2 },
  { id: 4, numero: '211', libelle: 'Terrains', classeId: 2 },
  { id: 5, numero: '311', libelle: 'Matières premières', classeId: 3 },
  { id: 6, numero: '401', libelle: 'Fournisseurs', classeId: 4 },
  { id: 7, numero: '411', libelle: 'Clients', classeId: 4 },
  { id: 8, numero: '512', libelle: 'Banques', classeId: 5 },
  { id: 9, numero: '601', libelle: 'Achats de matières premières', classeId: 6 },
  { id: 10, numero: '701', libelle: 'Ventes de marchandises', classeId: 7 },
];

interface OperationFormProps {
  initialData?: OperationComptable;
  onSubmit?: (data: OperationComptable) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const OperationForm: React.FC<OperationFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<OperationComptable>({
    libelle: initialData?.libelle || '',
    type: initialData?.type || TypeClasse.BILAN,
    classeId: initialData?.classeId || mockClasses[0]?.id || 0,
    details: initialData?.details || [
      { debit: null, credit: null, debitId: undefined, creditId: undefined },
    ],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDebitSearch, setShowDebitSearch] = useState<{ [key: number]: boolean }>({});
  const [showCreditSearch, setShowCreditSearch] = useState<{ [key: number]: boolean }>({});
  const [debitSearchTerm, setDebitSearchTerm] = useState<{ [key: number]: string }>({});
  const [creditSearchTerm, setCreditSearchTerm] = useState<{ [key: number]: string }>({});

  // Filter plan comptable based on selected class
  const filteredPlanComptable = mockPlanComptable.filter(
    (compte) => compte.classeId === formData.classeId
  );

  // Get libellé for a compte
  const getCompteLibelle = (compte: PlanComptable | null) => {
    if (!compte) return '';
    return `${compte.numero} - ${compte.libelle}`;
  };

  // Add new detail line
  const addDetailLine = () => {
    setFormData((prev) => ({
      ...prev,
      details: [...prev.details, { debit: null, credit: null }],
    }));
  };

  // Remove detail line
  const removeDetailLine = (index: number) => {
    if (formData.details.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }));
  };

  // Update detail
  const updateDetail = (
    index: number,
    field: 'debit' | 'credit',
    value: PlanComptable | null
  ) => {
    const newDetails = [...formData.details];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setFormData((prev) => ({ ...prev, details: newDetails }));
  };

  // Handle main form changes
  const handleChange = (field: keyof OperationComptable, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Reset details if class changes because plan comptable options change
    if (field === 'classeId') {
      setFormData((prev) => ({
        ...prev,
        details: [{ debit: null, credit: null }],
      }));
    }
    
    // Clear field error
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.libelle.trim()) {
      newErrors.libelle = 'Le libellé est requis';
    }
    
    if (!formData.classeId) {
      newErrors.classeId = 'La classe est requise';
    }
    
    let hasDetailError = false;
    formData.details.forEach((detail, index) => {
      if (!detail.debit && !detail.credit) {
        newErrors[`detail_${index}`] = 'Au moins un compte (débit ou crédit) est requis';
        hasDetailError = true;
      }
    });
    
    if (formData.details.length === 0) {
      newErrors.details = 'Au moins une ligne d\'écriture est requise';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && onSubmit) {
      onSubmit(formData);
    }
  };

  // Search filter for debit/credit
  const getFilteredComptes = (searchTerm: string) => {
    if (!searchTerm) return filteredPlanComptable;
    return filteredPlanComptable.filter(
      (compte) =>
        compte.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        compte.libelle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-7xl mx-auto">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <ArrowRightLeft className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {initialData?.id ? 'Modifier l\'écriture comptable' : 'Nouvelle écriture comptable'}
                </h2>
                <p className="text-indigo-100 text-sm mt-0.5">
                  Saisissez les détails de l'opération comptable
                </p>
              </div>
            </div>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Basic Information Section */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-medium text-gray-900">Informations générales</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Libelle */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Libellé de l'opération <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.libelle}
                  onChange={(e) => handleChange('libelle', e.target.value)}
                  placeholder="Ex: Achat de marchandises, Vente de produits, etc."
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.libelle ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                />
                {errors.libelle && (
                  <p className="mt-1 text-sm text-red-600">{errors.libelle}</p>
                )}
              </div>

              {/* Type and Class */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Type de classe
                </label>
                <div className="relative">
                  <select
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value as TypeClasse)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value={TypeClasse.BILAN}>Bilan</option>
                    <option value={TypeClasse.COMPTE_DE_RESULTAT}>Compte de résultat</option>
                    <option value={TypeClasse.HORS_BILAN}>Hors bilan</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Classe comptable <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.classeId}
                    onChange={(e) => handleChange('classeId', parseInt(e.target.value))}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.classeId ? 'border-red-300' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white`}
                  >
                    {mockClasses.map((classe) => (
                      <option key={classe.id} value={classe.id}>
                        {classe.code} - {classe.libelle}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.classeId && (
                  <p className="mt-1 text-sm text-red-600">{errors.classeId}</p>
                )}
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-medium text-gray-900">Lignes d'écriture</h3>
              </div>
              <button
                type="button"
                onClick={addDetailLine}
                className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors text-sm font-medium"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Ajouter une ligne</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-8">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-3.5 h-3.5 text-green-600" />
                        <span>Compte débit</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <CreditCard className="w-3.5 h-3.5 text-red-600" />
                        <span>Compte crédit</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {formData.details.map((detail, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                        {index + 1}
                      </td>
                      
                      {/* Debit Column */}
                      <td className="px-4 py-3">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowDebitSearch({ ...showDebitSearch, [index]: !showDebitSearch[index] })}
                            className="w-full text-left px-3 py-2 bg-white border border-gray-300 rounded-lg hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-between transition-all"
                          >
                            <span className={detail.debit ? 'text-gray-900' : 'text-gray-400'}>
                              {detail.debit ? getCompteLibelle(detail.debit) : 'Sélectionner un compte'}
                            </span>
                            <Search className="w-4 h-4 text-gray-400" />
                          </button>
                          
                          {showDebitSearch[index] && (
                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              <div className="p-2 border-b">
                                <input
                                  type="text"
                                  placeholder="Rechercher un compte..."
                                  value={debitSearchTerm[index] || ''}
                                  onChange={(e) => setDebitSearchTerm({ ...debitSearchTerm, [index]: e.target.value })}
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                                  autoFocus
                                />
                              </div>
                              {getFilteredComptes(debitSearchTerm[index] || '').map((compte) => (
                                <button
                                  key={compte.id}
                                  type="button"
                                  onClick={() => {
                                    updateDetail(index, 'debit', compte);
                                    setShowDebitSearch({ ...showDebitSearch, [index]: false });
                                    setDebitSearchTerm({ ...debitSearchTerm, [index]: '' });
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-indigo-50 text-sm transition-colors"
                                >
                                  <span className="font-mono text-indigo-600">{compte.numero}</span>
                                  <span className="text-gray-600 ml-2">{compte.libelle}</span>
                                </button>
                              ))}
                              {getFilteredComptes(debitSearchTerm[index] || '').length === 0 && (
                                <div className="px-3 py-2 text-sm text-gray-500 text-center">
                                  Aucun compte trouvé
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      {/* Credit Column */}
                      <td className="px-4 py-3">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowCreditSearch({ ...showCreditSearch, [index]: !showCreditSearch[index] })}
                            className="w-full text-left px-3 py-2 bg-white border border-gray-300 rounded-lg hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-between transition-all"
                          >
                            <span className={detail.credit ? 'text-gray-900' : 'text-gray-400'}>
                              {detail.credit ? getCompteLibelle(detail.credit) : 'Sélectionner un compte'}
                            </span>
                            <Search className="w-4 h-4 text-gray-400" />
                          </button>
                          
                          {showCreditSearch[index] && (
                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              <div className="p-2 border-b">
                                <input
                                  type="text"
                                  placeholder="Rechercher un compte..."
                                  value={creditSearchTerm[index] || ''}
                                  onChange={(e) => setCreditSearchTerm({ ...creditSearchTerm, [index]: e.target.value })}
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                                  autoFocus
                                />
                              </div>
                              {getFilteredComptes(creditSearchTerm[index] || '').map((compte) => (
                                <button
                                  key={compte.id}
                                  type="button"
                                  onClick={() => {
                                    updateDetail(index, 'credit', compte);
                                    setShowCreditSearch({ ...showCreditSearch, [index]: false });
                                    setCreditSearchTerm({ ...creditSearchTerm, [index]: '' });
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-indigo-50 text-sm transition-colors"
                                >
                                  <span className="font-mono text-indigo-600">{compte.numero}</span>
                                  <span className="text-gray-600 ml-2">{compte.libelle}</span>
                                </button>
                              ))}
                              {getFilteredComptes(creditSearchTerm[index] || '').length === 0 && (
                                <div className="px-3 py-2 text-sm text-gray-500 text-center">
                                  Aucun compte trouvé
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeDetailLine(index)}
                          disabled={formData.details.length === 1}
                          className={`p-1.5 rounded-lg transition-colors ${
                            formData.details.length === 1
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {errors.details && (
              <div className="px-5 py-3 bg-red-50 border-t border-red-100">
                <p className="text-sm text-red-600">{errors.details}</p>
              </div>
            )}
            {Object.keys(errors).some(key => key.startsWith('detail_')) && (
              <div className="px-5 py-3 bg-red-50 border-t border-red-100">
                <p className="text-sm text-red-600">Veuillez remplir toutes les lignes d'écriture correctement</p>
              </div>
            )}
          </div>

          {/* Summary Info */}
          <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Nombre de lignes d'écriture :</span>
              <span className="font-semibold text-indigo-700">{formData.details.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">Classe sélectionnée :</span>
              <span className="font-medium text-gray-800">
                {mockClasses.find(c => c.id === formData.classeId)?.code} - {mockClasses.find(c => c.id === formData.classeId)?.libelle}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Enregistrement...' : initialData?.id ? 'Mettre à jour' : 'Enregistrer'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default OperationForm;