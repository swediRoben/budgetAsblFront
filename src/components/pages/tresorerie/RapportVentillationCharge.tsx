import React, { useEffect, useState } from 'react';
import { getAllExercice } from "../../../data/classification/exercice";
import { getAllEtatventilationcharge } from "../../../data/tresorerie/journal";

export default function renderEtatVentillationPage() {
  const [etatsvantilationcharge, setEtatsvantilationcharge] = useState([]);
  const [exercices, setExercices] = useState([]);
  const [exerciceId, setExerciceId] = useState();
  const [allProjects, setAllProjects] = useState([]);

  useEffect(() => {
    dataExercice();
  }, []);

  const dataExercice = async () => {
    const data = await getAllExercice();
    setExercices(data);
  };

  const dataJournal = async (exercice, debut, fin) => {
    const dataventilation = await getAllEtatventilationcharge(exercice, debut, fin);
    setEtatsvantilationcharge(dataventilation);
    
    // Compter la fréquence d'apparition de chaque projet
    const projectFrequency = new Map();
    
    dataventilation.forEach(item => {
      item.details?.forEach(detail => {
        if (detail.projet?.id) {
          const projectId = detail.projet.id;
          if (!projectFrequency.has(projectId)) {
            projectFrequency.set(projectId, {
              id: detail.projet.id,
              libelle: detail.projet.libelle,
              count: 0
            });
          }
          projectFrequency.get(projectId).count++;
        }
      });
    });
    
    // Trouver le projet avec le plus grand nombre d'occurrences
    let maxCount = 0;
    let mostFrequentProject = null;
    
    for (const project of projectFrequency.values()) {
      if (project.count > maxCount) {
        maxCount = project.count;
        mostFrequentProject = project;
      }
    }
    
    // Si un projet fréquent est trouvé, on l'utilise
    // Sinon, on prend tous les projets
    if (mostFrequentProject && maxCount > 1) {
      setAllProjects([{
        id: mostFrequentProject.id,
        libelle: mostFrequentProject.libelle
      }]);
      
      console.log("Projet le plus fréquent:", mostFrequentProject.libelle, "apparaît", maxCount, "fois");
    } else {
      const allUniqueProjects = Array.from(projectFrequency.values()).map(p => ({
        id: p.id,
        libelle: p.libelle
      }));
      setAllProjects(allUniqueProjects);
    }
  };

  const getByExercice = async (e) => {
    const value = e.target.value;
    if (value !== null && value !== "") {
      setExerciceId(value);
      await dataJournal(Number(value), null, null);
    } else {
      setEtatsvantilationcharge([]);
      setAllProjects([]);
    }
  };

  // Fonction pour récupérer le montant numérique pour une charge et un projet donnés
  const getMontantNumeriqueForChargeAndProject = (charge, projectId) => {
    const detail = charge.details?.find(d => d.projet?.id === projectId);
    if (detail?.montant !== undefined && detail?.montant !== null) {
      return Number(detail.montant);
    }
    return 0;
  };

  // Fonction pour récupérer le montant formaté pour l'affichage
  const getMontantFormattedForChargeAndProject = (charge, projectId) => {
    const montant = getMontantNumeriqueForChargeAndProject(charge, projectId);
    return montant.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Calculer le total par projet
  const getTotalByProject = (projectId) => {
    let total = 0;
    etatsvantilationcharge.forEach(charge => {
      total += getMontantNumeriqueForChargeAndProject(charge, projectId);
    });
    return total;
  };

  // Calculer le total général de tous les projets
  const getGrandTotal = () => {
    let grandTotal = 0;
    etatsvantilationcharge.forEach(charge => {
      allProjects.forEach(project => {
        grandTotal += getMontantNumeriqueForChargeAndProject(charge, project.id);
      });
    });
    return grandTotal;
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Ventilation par charge</h2>

        <div className="mb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              className="border border-gray-300 rounded px-3 py-2"
              onChange={getByExercice}
              value={exerciceId || ""}
            >
              <option value="">Sélectionner un exercice</option>
              {exercices.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.libelle}
                </option>
              ))}
            </select>
          </div>
        </div>
        <hr className="my-4" />

        {allProjects.length > 0 && etatsvantilationcharge.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                    NATURE DE CHARGE
                  </th>
                  {allProjects.map((project) => (
                    <th key={project.id} className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      {project.libelle}
                    </th>
                  ))}
                  <th className="border border-gray-300 px-4 py-2 text-left font-semibold bg-gray-200">
                    TOTAL GENERAL
                  </th>
                </tr>
              </thead>
              <tbody>
                {etatsvantilationcharge?.map((charge, index) => {
                  // Calculer le total par ligne
                  let ligneTotal = 0;
                  allProjects.forEach(project => {
                    ligneTotal += getMontantNumeriqueForChargeAndProject(charge, project.id);
                  });
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">
                        {charge.classe?.libelle || "Sans libellé"}
                       </td>
                      {allProjects.map((project) => (
                        <td key={project.id} className="border border-gray-300 px-4 py-2 text-right">
                          {getMontantFormattedForChargeAndProject(charge, project.id)}
                        </td>
                      ))}
                      <td className="border border-gray-300 px-4 py-2 text-right font-bold bg-gray-50">
                        {ligneTotal.toLocaleString('fr-FR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </td>
                    </tr>
                  );
                })}
                
                {/* Ligne de total par projet */}
                <tr className="bg-gray-200 font-bold">
                  <td className="border border-gray-300 px-4 py-2 font-bold">
                    TOTAL PAR PROJET
                  </td>
                  {allProjects.map((project) => (
                    <td key={project.id} className="border border-gray-300 px-4 py-2 text-right">
                      {getTotalByProject(project.id).toLocaleString('fr-FR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                  ))}
                  <td className="border border-gray-300 px-4 py-2 text-right bg-gray-300 font-bold">
                    {getGrandTotal().toLocaleString('fr-FR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {exerciceId ? "Aucune donnée disponible pour cet exercice" : "Veuillez sélectionner un exercice"}
          </div>
        )}
      </div>
    </>
  );
}