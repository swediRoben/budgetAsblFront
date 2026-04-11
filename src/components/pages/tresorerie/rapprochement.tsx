import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

// Types
interface DataItem {
  id: number;
  libelle: string;
  date: string;
}

interface FormDataItem {
  originalId: number;
  idClasse: string;
  idCompte: string;
  idProjet: string;
  isChecked: boolean;
}

interface FormValues {
  selectedItems: FormDataItem[];
}

// Composant principal
const RaprochementPage: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([
    { id: 1, libelle: "DJ", date: "05/05/2022" },
    { id: 2, libelle: "DJ", date: "06/05/2022" },
    { id: 3, libelle: "DJ", date: "05/05/2022" }
  ]);

  const [classes] = useState([
    { id: "1", name: "Classe 1" },
    { id: "2", name: "Classe 2" },
    { id: "3", name: "Classe 3" }
  ]);

  const [comptes] = useState([
    { id: "1", name: "Compte 1" },
    { id: "2", name: "Compte 2" },
    { id: "3", name: "Compte 3" }
  ]);

  const [projets] = useState([
    { id: "1", name: "Projet 1" },
    { id: "2", name: "Projet 2" },
    { id: "3", name: "Projet 3" }
  ]);

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      selectedItems: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "selectedItems"
  });

  // Trier les données par date
  const sortedData = [...data].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Gérer le changement de checkbox
  const handleCheckboxChange = (item: DataItem, isChecked: boolean) => {
    if (isChecked) {
      append({
        originalId: item.id,
        idClasse: "",
        idCompte: "",
        idProjet: "",
        isChecked: true
      });
    } else {
      const index = fields.findIndex(field => field.originalId === item.id);
      if (index !== -1) {
        remove(index);
      }
    }
  };

  // Vérifier si un item est coché
  const isItemChecked = (itemId: number) => {
    return fields.some(field => field.originalId === itemId);
  };

  // Récupérer les valeurs d'un item spécifique
  const getItemValues = (itemId: number) => {
    return fields.find(field => field.originalId === itemId);
  };

  // Soumettre le formulaire
  const onSubmit = (data: FormValues) => {
    const result = data.selectedItems
      .filter(item => item.isChecked)
      .map(item => ({
        id: item.originalId,
        idClasse: parseInt(item.idClasse),
        idCompte: parseInt(item.idCompte),
        idProjet: parseInt(item.idProjet)
      }));
    
    console.log("Données à envoyer:", result);
    // Ici vous pouvez faire l'appel API
    // await api.post('/save', result);
    
    alert(`Données enregistrées: ${JSON.stringify(result, null, 2)}`);
  };

  return (
    <div className="container mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sélection
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Libellé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Classe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compte
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projet
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedData.map((item) => {
                const isChecked = isItemChecked(item.id);
                const itemValues = getItemValues(item.id);
                const fieldIndex = fields.findIndex(f => f.originalId === item.id);
                
                return (
                  <tr 
                    key={item.id} 
                    className={`
                      transition-colors duration-200
                      ${isChecked 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'hover:bg-gray-50'
                      }
                    `}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleCheckboxChange(item, e.target.checked)}
                        className={`
                          w-4 h-4 rounded focus:ring-blue-500
                          ${isChecked 
                            ? 'text-blue-600 border-blue-300 bg-white' 
                            : 'text-blue-600 border-gray-300'
                          }
                        `}
                      />
                    </td>
                    <td className={`
                      px-6 py-4 whitespace-nowrap text-sm
                      ${isChecked ? 'text-white' : 'text-gray-900'}
                    `}>
                      {item.id}
                    </td>
                    <td className={`
                      px-6 py-4 whitespace-nowrap text-sm
                      ${isChecked ? 'text-white' : 'text-gray-900'}
                    `}>
                      {item.libelle}
                    </td>
                    <td className={`
                      px-6 py-4 whitespace-nowrap text-sm
                      ${isChecked ? 'text-white' : 'text-gray-900'}
                    `}>
                      {item.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isChecked && fieldIndex !== -1 && (
                        <select
                          {...register(`selectedItems.${fieldIndex}.idClasse`)}
                          className={`
                            mt-1 block w-full pl-3 pr-10 py-2 text-base 
                            focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                            sm:text-sm rounded-md
                            ${isChecked 
                              ? 'bg-blue-500 text-white border-blue-400' 
                              : 'bg-white text-gray-900 border-gray-300'
                            }
                          `}
                        >
                          <option value="" className="text-gray-900">Sélectionner une classe</option>
                          {classes.map(classe => (
                            <option key={classe.id} value={classe.id} className="text-gray-900">
                              {classe.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isChecked && fieldIndex !== -1 && (
                        <select
                          {...register(`selectedItems.${fieldIndex}.idCompte`)}
                          className={`
                            mt-1 block w-full pl-3 pr-10 py-2 text-base 
                            focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                            sm:text-sm rounded-md
                            ${isChecked 
                              ? 'bg-blue-500 text-white border-blue-400' 
                              : 'bg-white text-gray-900 border-gray-300'
                            }
                          `}
                        >
                          <option value="" className="text-gray-900">Sélectionner un compte</option>
                          {comptes.map(compte => (
                            <option key={compte.id} value={compte.id} className="text-gray-900">
                              {compte.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isChecked && fieldIndex !== -1 && (
                        <select
                          {...register(`selectedItems.${fieldIndex}.idProjet`)}
                          className={`
                            mt-1 block w-full pl-3 pr-10 py-2 text-base 
                            focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                            sm:text-sm rounded-md
                            ${isChecked 
                              ? 'bg-blue-500 text-white border-blue-400' 
                              : 'bg-white text-gray-900 border-gray-300'
                            }
                          `}
                        >
                          <option value="" className="text-gray-900">Sélectionner un projet</option>
                          {projets.map(projet => (
                            <option key={projet.id} value={projet.id} className="text-gray-900">
                              {projet.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default RaprochementPage;