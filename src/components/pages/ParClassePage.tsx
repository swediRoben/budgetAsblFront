import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign,Settings2,BadgeDollarSign } from 'lucide-react';
import {createClasse,deleteClasse,getAllClasse,updateClasse} from "../../data/classification/classes";
import {createProjet,deleteProjet,getAllProjet,updateProjet} from "../../data/classification/projet";
import {createCategorie,deleteCategorie,getAllCategorie,updateCategorie,getAllCategorieByProgramme} from "../../data/classification/categorie";
import {createExercice,deleteExercice,getAllExercice,updateExercice} from "../../data/classification/exercice";
import {createPlanfontnature,deletePlanfontnature,getAllPlanfontnature,updatePlanfontnature} from "../../data/classification/planfontnature";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast"; 

export default function renderParCategoriePage (){ 

  const [classes, setClasses] = useState([]) 
    const [projets, setProjets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [projetId, setProjetId] = useState();
      const [planfondprojets, setPlanfontprojets] = useState([]);
    const [exerciceId, setExerciceId] = useState(); 
    const [exercices, setExercices] = useState([]);
    const [planfontNatures, setPlanfontNature] = useState([]); 

    
    //ETAT DE SORTIE CATEGORIE
      const groupeCategorieid = useMemo(() => {
      const res = {};
       
      planfontNatures.forEach(item => {
        const pid = item.projet?.id ?? item.idProjet;
        const cid = item.categorie?.id ?? item.idCategorie;
        const classId = item.classe?.id ?? item.idClasse;
    
        if (!res[pid]) {
          res[pid] = {
            projet: item.projet,
            classes: {}
          };
        }
    
        if (!res[pid].classes[classId]) {
          res[pid].classes[classId] = {
            classe: item.classe,
            categories: []
          };
        }
    
        res[pid].classes[classId].categories.push({
          ...item,
          montant: Number(String(item.montant).replace(/,/g, "")) || 0
        });
      });
    
      return res;
    }, [planfontNatures]);
    const totalClasse = (cats:any) =>
      cats.reduce((sum, c:any) => sum + c.montant, 0);
    
    const totalProjetcategorie = (classes:any) =>
      Object.values(classes).reduce(
        (sum, cl:any) => sum + totalClasse(cl.categories),
        0
      );
    
     // GET
      const dataClasse =async ()=>{
        const data=await getAllClasse(); 
        setClasses(data) 
      } 
      
      const dataProjet =async ()=>{
        const data=await getAllProjet(); 
        setProjets(data) 
      }
       
    
     const getCategorieByProjet=async (e:any)=>{ 
        const data=await getAllCategorie(e); 
        setProjetId(e)
        setCategories(data) 
      } 
      
      const  getPlanfondNatureByprogramme=async (e:any)=>{ 
        
        const value=e;
        getCategorieByProjet(e)
         if (value!=="") { 
          const data=await getAllPlanfontnature(exerciceId,e); 
          setPlanfontNature(data)
        }else{
          setPlanfontNature([])
        } 
      } 
  
        const getPlanfondByExercice=async (e:any)=>{ 
               const value=e.target.value;
                if (value!=="") { 
                    setExerciceId(value)
                    const data=await getAllPlanfontprojet(e.target.value);
                    setPlanfontprojets(data)  
                    
               }else{ 
                 setPlanfontprojets([]) 
               } 
               setPlanfontNature([]) 
             }
    
        const dataExercice =async ()=>{
        const data=await getAllExercice(); 
        setExercices(data)
      } 
     
      const dataPlanfontNature =async ()=>{
        const data=await getAllPlanfontnature(); 
        setPlanfontNature(data) 
      }
    
       
      const getAllDataInTable=()=>{  
          dataExercice(); 
          dataClasse(); 
          dataProjet();
      }

      useEffect(()=>{
        return getAllDataInTable();
      },[])
     
    
        
     
          return (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Rapport par categorie</h2>
                 <div className="bg-gray-50 p-6 rounded-lg mb-6"> 
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
                      {/* Exercice */}
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Exercice Budgétaire
                        </label> 
          
                        <select 
                          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                            // onClick={getExerciceencours}
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
          
                      {/* Projet */}
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Projet</label>
                       <select 
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                           onChange={(e)=>getPlanfondNatureByprogramme(e.target.value)}
                         >
                            <option value="">Sélectionner un projet</option>
                            {
                              projets.map((element)=>(
                              <option value={element.id}>{element.libelle}</option>
                              ))
                            }
                          </select>
                      </div>
                    </div>
                  </div> 
          
          <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-md max-w-5xl mx-auto"> 
          
            <table className="w-full border-collapse mt-2">
              <thead>
                <tr className="bg-blue-900 text-white text-left text-sm">
                  <th className="p-2 border border-gray-300">PROJET</th>
                  <th className="p-2 border border-gray-300">NATURE</th>
                  <th className="p-2 border border-gray-300">CATEGORIE</th>
                  <th className="p-2 border border-gray-300">MONTANT</th>
                </tr>
              </thead>
          
              <tbody>
                {Object.entries(groupeCategorieid).map(([pid, p]:any) => (
                  <>
                    {Object.entries(p.classes).map(([classId, c]:any) => (
                      <>
                        {c.categories.map(cat => (
                          <tr key={cat.id}>
                            <td className="p-2 border border-gray-300 text-sm">
                              {p.projet.libelle}
                            </td>
                            <td className="p-2 border border-gray-300 text-sm">
                              {c.classe.libelle}
                            </td>
                            <td className="p-2 border border-gray-300 text-sm">
                              {cat.categorie.libelle}
                            </td>
                            <td className="p-2 border border-gray-300 text-sm">
                              {cat.montant.toLocaleString()}
                            </td>
                          </tr>
                        ))}
          
                        {/* TOTAL CLASS */}
                        <tr className="bg-orange-100 font-bold">
                          <td className="p-2 border border-gray-300 text-sm">{p.projet.libelle}</td>
                          <td className="p-2 border border-gray-300 text-sm">
                            {c.classe.libelle} (Total)
                          </td>
                          <td className="p-2 border border-gray-300 text-sm"></td>
                          <td className="p-2 border border-gray-300 text-sm">
                            {totalClasse(c.categories).toLocaleString()}
                          </td>
                        </tr>
                      </>
                    ))}
          
                    {/* TOTAL PROJET */}
                    <tr className="bg-green-200 font-bold text-base">
                      <td className="p-2 border border-gray-300 text-sm" colSpan={3}>
                        TOTAL {p.projet.libelle}
                      </td>
                      <td className="p-2 border border-gray-300 text-sm">
                        {totalProjetcategorie(p.classes).toLocaleString()}
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
          
          </div> 
            );
            

   
}