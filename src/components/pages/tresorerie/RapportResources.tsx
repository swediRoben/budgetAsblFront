import React, { useEffect, useState } from 'react';
 
import { getAllExercice } from "../../../data/classification/exercice";
import {  getAllEtatventilationcharge,getAllEtatressource,getAllEtatcompteresultat,getAllJournal, getAllvantilation} from "../../../data/tresorerie/journal";

 

export default function renderEtatRessourcePage() {
 
   const [etatsresources, setEtatsresources] = useState([]);  

  const [exercices, setExercices] = useState([]); 
   
   const [exerciceId, setExerciceId] = useState(); 
       
  useEffect(() => { 
    dataExercice();
  }, []);

  const dataExercice =async ()=>{
       const data=await getAllExercice(); 
       setExercices(data) 
     } 

     const dataJournal = async (exercice: number, debut: any, fin: any) => {
        const dataressources = await getAllEtatressource(exercice, debut, fin);
        setEtatsresources(dataressources); 
     }
  
          const getByExercice = async (e: any) => {
              const value = e.target.value;
              if (value !== null) {
                  setExerciceId(value) 
                dataJournal(Number(value),null,null)
              }  
          }
 
 
  

 
  return (
    <>  
      <div className="bg-white rounded-lg shadow-md p-6"> 

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Ressource</h2>

      <div className="mb-6">
               
      </div>

      <div className="mb-4">
        <div className="flex flex-col md:flex-row gap-4">
              <select  className="border border-gray-300 rounded px-1 py-2"
                          onChange={
                                (e) => {
                                    getByExercice(e);
                                }
                            }>
                        <option value="">Exercice</option>
                        {exercices.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.libelle}
                          </option>
                        ))}
                      </select> 
        </div>
      </div>
      <hr className="my-4" />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">PROJET/BAILLEUR</th>
              <th className="border border-gray-300 px-4 py-2 text-left">FINANCEMENTS RECUS (A)</th>
              <th className="border border-gray-300 px-4 py-2 text-left">DEPENSES REALISERS (B)</th>
              <th className="border border-gray-300 px-4 py-2 text-left">SOLDE (A)-(B)</th>
              <th className="border border-gray-300 px-4 py-2 text-left">TAUX D'EXECUTION (%)</th>
                </tr>
          </thead>
          <tbody>
            {etatsresources?.map((data) => (
              <tr key={data.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{data.projet.projetId.libelle}</td>
                <td className="border border-gray-300 px-4 py-2 font-medium">{data.montantRecus}</td>
                <td className="border border-gray-300 px-4 py-2">{data.montantDepense}</td>
                <td className="border border-gray-300 px-4 py-2">{data.montantRecus-data.montantDepense}</td>   
                <td className="border border-gray-300 px-4 py-2">{data.montantRecus-data.montantDepense}</td>   
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}
