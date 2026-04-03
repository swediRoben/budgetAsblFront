import React, { useEffect, useState } from 'react';
 
import { getAllExercice } from "../../../data/classification/exercice";
import {  getAllEtatventilationcharge,getAllEtatressource,getAllEtatcompteresultat,getAllJournal, getAllvantilation} from "../../../data/tresorerie/journal";

 

export default function renderEtatVentillationPage() {
 
  const [etatsvantilationcharge, setEtatsvantilationcharge] = useState([]); 
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
       const dataventilation = await getAllEtatventilationcharge(exercice, debut, fin);
       setEtatsvantilationcharge(dataventilation);
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

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Ventilation par charge</h2>

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
              <th className="border border-gray-300 px-4 py-2 text-left">NATURE DE CHARGE</th>
              

                 </tr>
          </thead>
          <tbody>
            {etatsvantilationcharge?.map((data) => (
              <tr key={data.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{data.classe.libelle}</td>
                {data?.details?.map((detail) => (
                <td className="border border-gray-300 px-4 py-2 font-medium">{detail.montant}</td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
 
    </>
  );
}
