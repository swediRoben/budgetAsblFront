import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign,Settings2,BadgeDollarSign } from 'lucide-react';
import {createClasse,deleteClasse,getAllClasse,updateClasse} from "../../data/classification/classes";
import {createPlancompte,deletePlancompte,getAllPlancompte,updatePlancompte} from "../../data/classification/planComptable";
import {createProjet,deleteProjet,getAllProjet,updateProjet} from "../../data/classification/projet";
import {createCategorie,deleteCategorie,getAllCategorie,updateCategorie,getAllCategorieByProgramme} from "../../data/classification/categorie";
import {createTypebailleur,deleteTypebailleur,getAllTypebailleur,updateTypebailleur} from "../../data/classification/typebailleur";
import {createBailleur,deleteBailleur,getAllBailleur,updateBailleur} from "../../data/classification/bailleur";
import {createBeneficiere,deleteBeneficiere,getAllBeneficiere,updateBeneficiere} from "../../data/classification/beneficiere";
import {createExercice,deleteExercice,getAllExercice,updateExercice} from "../../data/classification/exercice";
import {createDevise,deleteDevise,getAllDevise,updateDevise} from "../../data/classification/devise";
import {createPlanfontprojet,deletePlanfontprojet,getAllPlanfontprojet,updatePlanfontprojet} from "../../data/classification/planfontprojet";
import {createPlanfontnature,deletePlanfontnature,getAllPlanfontnature,updatePlanfontnature} from "../../data/classification/planfontnature";
import {createPrevision,deletePrevision,getAllPrevision,updatePrevision} from "../../data/classification/prevision";
import {createActivite,deleteActivite,getAllActivite,updateActivite} from "../../data/classification/activite";

 import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast"; 

export default function renderParActivitePage (){ 

  const [classes, setClasses] = useState([]) 
    const [plancomptables, setPlancomptables] = useState([]);
    const [activites, setActivites] = useState([]);
    const [projets, setProjets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [projetId, setProjetId] = useState();
    const [exerciceId, setExerciceId] = useState();
    const [categorieId, setCategorieId] = useState();
    const [typebailleurs, setTypebailleurs] = useState([]);
    const [bailleurs, setBailleurs] = useState([]); 
    const [beneficieres, setBeneficieres] = useState([]);
    
      const [planfondprojets, setPlanfontprojets] = useState([]);
    const [exercices, setExercices] = useState([]);
    const [devises, setDevises] = useState([]); 
    const [planfontNatures, setPlanfontNature] = useState([]);
    const [previsions, setPrevisions] = useState([]);
    const [classeplafond, setClasseplafond] = useState();
    const [montantplafond, setMontantplafond] = useState(0.0);

 
    
        // ETAT DE SORTIE ACTIVITE
     const grouped = useMemo(() => {
      const res = {};
    
      previsions.forEach((item:any) => {
        const pid = item.projet?.id ?? item.idProjet;
        const cid = item.categorie?.id ?? item.idCategorie;
    
        if (!res[pid])
          res[pid] = {
            projet: item.projet,
            categories: {},
          };
    
        if (!res[pid].categories[cid])
          res[pid].categories[cid] = {
            categorie: item.categorie,
            acts: [],
          };
    
        // Convertir pu, quantite, montant
        const pu = Number(String(item.prixUnitaire).replace(/,/g, "")) || 0;
        const quantite = Number(String(item.quantite).replace(/,/g, "")) || 0;
        const montant = Number(String(item.montant).replace(/,/g, "")) || 0;
    
        res[pid].categories[cid].acts.push({
          ...item,
          pu,
          quantite,
          montant,
          bailleur: item.source,
        });
      });
    
      return res;
    }, [previsions]);
    
     const totalCategorie = (acts:any) =>
        acts.reduce((sum, a:any) => sum + a.montant, 0);
    
      const totalProjet = (categories:any) =>
        Object.values(categories).reduce(
          (sum, cat:any) => sum + totalCategorie(cat.acts),
          0
        );
    
      // GET
   
      
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
    
      const getPrevisionByCategorie=async (e:any)=>{ 
        
        const value=e; 
         if (value!=="") { 
          const data=await getAllPrevision(exerciceId,projetId,e); 
          setPrevisions(data)
           }else{
              setPrevisions([])
           }
      } 
    
      
     const getPrevisionParProjet=async (e:any)=>{
        const value=e; 
         if (value!=="") { 
          const data=await getAllPrevision(exerciceId,e,null); 
          setPrevisions(data) 
         }
      } 
    
    const getClasseInPlafondNatureByCaterie = (e: any) => { 
    
      const id = Number(e); 
    
      const data = planfontNatures.find(v => Number(v.idCategorie) === id); 
    
      if (data !== undefined) { 
        setClasseplafond(data?.classe); 
        setMontantplafond(data.montant); 
        getActiviteByCategorie(data?.idCategorie) 
        getBailleurs();
        getBeneficiaires();
      } else {
        setClasseplafond(null);
        setMontantplafond(0.0);
      }
    };
    
    
    
      const  getActiviteByCategorie=async (e:any)=>{ 
        const data=await getAllActivite(null,e); 
        setActivites(data) 
      } 
    
 
       const dataBailleur =async ()=>{
        const data=await getAllBailleur(); 
        setBailleurs(data) 
      } 
       const dataBenefiere =async ()=>{
        const data=await getAllBeneficiere(); 
        setBeneficieres(data) 
      } 
       const dataExercice =async ()=>{
        const data=await getAllExercice(); 
        setExercices(data)
      } 
    
  
    
      const getAllDataInTable=(type:any)=>{  
          dataExercice();
          dataBailleur();
          dataProjet(); 
      }
   
   
         const getProjets=()=>{
          dataProjet()
        }
      
        const getBailleurs=()=>{
          dataBailleur()
        } 

        const getBeneficiaires=()=>{
          dataBenefiere();
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
                  setPrevisions([])
                }
     

            // ETAT DE SORTIE
           
        return (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Rapport plan previsionnel</h2>
                 <div className="bg-gray-50 p-6 rounded-lg mb-6"> 
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
                      {/* Exercice */}
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Exercice Budgétaire
                        </label> 
          
                        <select 
                          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                          onClick={dataExercice} 
                          onChange={getPlanfondByExercice} 
                          >
                          <option value="">Sélectionner l'exercice</option>
                          {
                            exercices.map((element:any)=>(
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
                           onChange={(e)=>{getPrevisionParProjet(e.target.value)}}
                       >
                            <option value="">Sélectionner un projet</option>
                            {
                              planfondprojets.map((element:any)=>(
                              <option value={element.projet.id}>{element.projet.libelle}</option>
                              ))
                            }
                          </select>
                      </div>
                    </div>
                  </div> 
          
              <table className="w-full border-collapse mt-4">
                  <thead>
                      <tr>
                          <th className="bg-[#1f4e78] text-white p-3 font-bold text-left border border-gray-300 text-sm">CODE</th>
                          <th className="bg-[#1f4e78] text-white p-3 font-bold text-left border border-gray-300 text-sm">DESCRIPTION</th>
                          <th className="bg-[#1f4e78] text-white p-3 font-bold text-left border border-gray-300 text-sm">DEBUT</th>
                          <th className="bg-[#1f4e78] text-white p-3 font-bold text-left border border-gray-300 text-sm">FIN</th>
                          <th className="bg-[#1f4e78] text-white p-3 font-bold text-left border border-gray-300 text-sm">QUANTITE</th>
                          <th className="bg-[#1f4e78] text-white p-3 font-bold text-left border border-gray-300 text-sm">C. UNITAIRE</th>
                          <th className="bg-[#1f4e78] text-white p-3 font-bold text-left border border-gray-300 text-sm">TOTAL</th>
                          <th className="bg-[#1f4e78] text-white p-3 font-bold text-left border border-gray-300 text-sm">SOURCE FINANCEMENT</th>
                      </tr>
                  </thead>
          
                    <tbody>
            {Object.entries(grouped).map(([pid, projetData], pIndex:any) => {
              const categories = projetData.categories;
              const totProj = totalProjet(categories);
          
              return (
                <React.Fragment key={pid}>
                  {/* PROJET */}
                  <tr className="bg-[#d9e1f2] font-semibold">
                    <td className="p-3 border border-gray-300">{String(pIndex + 1).padStart(2, "0")}</td>
                    <td className="p-3 border border-gray-300" colSpan={5}>
                      {projetData.projet?.libelle}
                    </td>
                    <td className="p-3 border border-gray-300">{totProj.toLocaleString()}</td>
                    <td className="p-3 border border-gray-300">—</td>
                  </tr>
          
                  {/* CATEGORIES */}
                  {Object.entries(categories).map(([cid, catData], cIndex:any) => {
                    const totCat = totalCategorie(catData.acts);
          
                    return (
                      <React.Fragment key={cid}>
                        {/* CATEGORIE */}
                        <tr className="bg-[#fce4d6] font-semibold">
                          <td className="p-3 border border-gray-300">{String(cIndex + 1).padStart(3, "0")}</td>
                          <td className="p-3 border border-gray-300" colSpan={5}>
                            {catData.categorie?.libelle}
                          </td>
                          <td className="p-3 border border-gray-300">{totCat.toLocaleString()}</td>
                          <td className="p-3 border border-gray-300">—</td>
                        </tr>
          
                        {/* ACTIVITÉS */}
                        {catData.acts.map((act, aIndex:any) => (
                          <tr key={aIndex}>
                            <td className="p-3 border border-gray-300">{act.ligne}</td>
                            <td className="p-3 border border-gray-300">{act.activite?.libelle}</td>
                            <td className="p-3 border border-gray-300">{act.datebebut}</td>
                            <td className="p-3 border border-gray-300">{act.datefin}</td>
          
                            <td className="p-3 border border-gray-300">{act.quantite}</td>
                            <td className="p-3 border border-gray-300">{act.pu.toLocaleString()}</td>
                            <td className="p-3 border border-gray-300">{act.montant.toLocaleString()}</td>
                            <td className="p-3 border border-gray-300">{act.bailleur?.libelle}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
          
                  {/* TOTAL FINAL PROJET */}
                  <tr className="bg-[#c6efce] font-bold text-base">
                    <td className="p-3 border border-gray-300" colSpan={6}>
                      TOTAL {projetData.projet?.libelle}
                    </td>
                    <td className="p-3 border border-gray-300" colSpan={2}>
                      {totProj.toLocaleString()}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
              </table> 
              
          
          </div> 
            );

       



   
}