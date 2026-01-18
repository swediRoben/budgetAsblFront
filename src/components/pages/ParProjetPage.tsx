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
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Rapport de budget annuelle par projet</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Exercice Budgétaire
                  </label>
                  <select 
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                    onChange={getPlanfondByExercice} 
                 >
                    <option value="">Sélectionner l'exercice</option>
                    {
                      exercices.map((element)=>(
                       <option value={element.id}>{element.libelle}</option>
                      ))
                    }
                  </select>
           
                </div>
              </div>
              <br />
          
          <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-md max-w-5xl mx-auto"> 
          
            <table className="w-full border-collapse mt-2">
              <thead>
                <tr className="bg-blue-900 text-white text-left text-sm">
                  <th className="p-2 border border-gray-300">PROJET</th>
                  <th className="p-2 border border-gray-300">SOURCE FINANCEMENT</th>
                  <th className="p-2 border border-gray-300">MONTANT</th>
                </tr>
              </thead>
          
              <tbody>
                {planfondprojets.map((p:any) => (
                
                    <tr className="bg-orange-100 font-bold">
                          <td className="p-2 border border-gray-300 text-sm">{p.projet?.libelle} </td>
                          <td className="p-2 border border-gray-300 text-sm">{p.sourceFinacement?.libelle}</td>
                          <td className="p-2 border border-gray-300 text-sm">
                            {p.montant.toLocaleString()}
                          </td>
                        </tr>
                        
                    ))}
          
                   
              </tbody>
            </table>
          </div>
          
          </div> 
            );    

   
}