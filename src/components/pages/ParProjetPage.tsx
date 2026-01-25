import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign,Settings2,BadgeDollarSign } from 'lucide-react';
import {createExercice,deleteExercice,getAllExercice,updateExercice} from "../../data/classification/exercice";
import {createPlanfontprojet,deletePlanfontprojet,getAllPlanfontprojet,updatePlanfontprojet} from "../../data/classification/planfontprojet";
 
export default function renderParProjetPage (){ 
 
    const [exerciceId, setExerciceId] = useState();  
    const [exercices, setExercices] = useState([]);
    const [planfondprojets, setPlanfontprojets] = useState([]); 
 
  
      const dataExercice =async ()=>{
        const data=await getAllExercice(); 
        setExercices(data)
      } 
     
      useEffect(()=>{
          dataExercice();
      },[]) 
      
 

        const getPlanfondByExercice=async (e:any)=>{ 
          const value=e.target.value;
           if (value!=="") { 
               setExerciceId(value)
               const data=await getAllPlanfontprojet(e.target.value);
               setPlanfontprojets(data)  
               
          }else{ 
            setPlanfontprojets([]) 
          } 
        }
         
        
       
        return (
         <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white shadow-lg p-6">
  {/* HEADER */}
  <div className="flex flex-col gap-1 border-b border-gray-200 pb-4 mb-6">
    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
      Rapport de budget annuel par projet
    </h2>
    <p className="text-sm text-gray-500">
      Vue consolidée par projet et source de financement
    </p>
  </div>

  {/* FILTRE EXERCICE */}
  <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <label className="mb-2 block text-sm font-semibold text-gray-700">
      Exercice Budgétaire
    </label>
    <select
      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition
                 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
      onChange={getPlanfondByExercice}
    >
      <option value="">Sélectionner l'exercice</option>
      {exercices.map((element) => (
        <option key={element.id} value={element.id}>
          {element.libelle}
        </option>
      ))}
    </select>
  </div>

  {/* TABLEAU */}
  <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
    <table className="min-w-full text-sm">
      <thead>
        <tr className="bg-blue-900 text-white">
          <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
            Projet
          </th>
          <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
            Source de financement
          </th>
          <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
            Montant
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {planfondprojets.map((p, index) => (
          <tr
            key={index}
            className="transition hover:bg-gray-50"
          >
            <td className="px-4 py-3 text-gray-800">{p.projet?.libelle}</td>
            <td className="px-4 py-3 text-gray-700">{p.sourceFinacement?.libelle}</td>
            <td className="px-4 py-3 text-right font-semibold text-gray-900">
              {p.montant.toLocaleString()}
            </td>
          </tr>
        ))}

        {/* TOTAL GENERAL */}
        <tr className="bg-emerald-50 font-bold text-gray-900">
          <td className="px-4 py-3 text-base" colSpan={2}>
            TOTAL GENERAL
          </td>
          <td className="px-4 py-3 text-right text-base font-extrabold">
          {planfondprojets
            .reduce((sum, p) => sum + Number(p.montant || 0), 0)
            .toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
        </td>


        </tr>
      </tbody>
    </table>
  </div>
</div>

            );    

   
}