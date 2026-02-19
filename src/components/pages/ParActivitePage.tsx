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
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white shadow-lg">
  {/* HEADER */}
  <div className="flex flex-col gap-1 border-b border-gray-200 px-6 py-5">
    <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
      Rapport plan prévisionnel
    </h2>
    <p className="text-sm text-gray-500">
      Sélectionnez un exercice et un projet pour afficher les prévisions.
    </p>
  </div>

  {/* FILTRES */}
  <div className="px-6 py-6">
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-800">Filtres</h3>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          Paramètres du rapport
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Exercice */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Exercice Budgétaire
          </label>

          <select
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition
                       focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            onClick={dataExercice}
            onChange={getPlanfondByExercice}
          >
            <option value="">Sélectionner l'exercice</option>
            {exercices.map((element: any) => (
              <option key={element.id} value={element.id}>
                {element.libelle}
              </option>
            ))}
          </select>
        </div>

        {/* Projet */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Projet
          </label>

          <select
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition
                       focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            onChange={(e) => getPrevisionParProjet(e.target.value)}
          >
            <option value="">Sélectionner un projet</option>
            {planfondprojets.map((element: any, index: number) => (
              <option key={index} value={element.projet.id}>
                {element.projet.libelle}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  </div>

  {/* TABLE */}
 <div className="px-6 pb-6 print:p-0">
  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md print:shadow-none print:border-0">
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto text-sm">
        {/* EN-TÊTE MODERNE */}
        <thead>
          <tr className="bg-slate-900 text-white print:bg-gray-100 print:text-black">
            <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-wider border-r border-slate-700">Code</th>
            <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-wider">Description des Activités</th>
            <th className="px-3 py-4 text-center text-[11px] font-bold uppercase tracking-wider">Période</th>
            <th className="px-3 py-4 text-center text-[11px] font-bold uppercase tracking-wider">Qté</th>
            <th className="px-3 py-4 text-right text-[11px] font-bold uppercase tracking-wider">P.U.</th>
            <th className="px-4 py-4 text-right text-[11px] font-bold uppercase tracking-wider">Total</th>
            <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-wider">Financement</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {Object.entries(grouped).map(([pid, projetData], pIndex) => {
            const categories = projetData.categories;
            const totProj = totalProjet(categories);

            return (
              <React.Fragment key={pid}>
                {/* LIGNE PROJET - Style "Header" */}
                <tr className="bg-slate-100/80 group">
                  <td className="border-l-4 border-blue-600 px-4 py-4 font-black text-blue-900 bg-blue-50">
                    {String(pIndex + 1).padStart(2, "0")}
                  </td>
                  <td className="px-4 py-4 font-black text-blue-900 uppercase tracking-tight" colSpan={4}>
                    PROJET : {projetData.projet?.libelle}
                  </td>
                  <td className="px-4 py-4 text-right font-black text-blue-900 text-base">
                    {totProj.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-gray-400 italic text-xs">Récapitulatif Projet</td>
                </tr>

                {Object.entries(categories).map(([cid, catData], cIndex) => {
                  const totCat = totalCategorie(catData.acts);

                  return (
                    <React.Fragment key={cid}>
                      {/* LIGNE CATEGORIE - Style "Sub-Header" */}
                      <tr className="bg-white">
                        <td className="border-l-4 border-orange-400 px-4 py-3 font-bold text-orange-700 bg-orange-50/30 text-center">
                          {String(cIndex + 1).padStart(3, "0")}
                        </td>
                        <td className="px-4 py-3 font-bold text-gray-700 italic" colSpan={4}>
                          COMPOSANTE : {catData.categorie?.libelle}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-gray-800 border-b border-orange-100">
                          {totCat.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-gray-400">—</td>
                      </tr>

                      {/* ACTIVITÉS - Style "Epuré" */}
                      {catData.acts.map((act, aIndex) => (
                        <tr key={aIndex} className="hover:bg-blue-50/30 transition-colors border-l-4 border-transparent hover:border-blue-200">
                          <td className="px-4 py-2 text-center font-mono text-xs text-gray-400 border-r border-gray-50">
                            {act.ligne}
                          </td>
                          <td className="px-4 py-2 text-gray-700 font-medium">
                            {act.activite?.libelle}
                          </td>
                          <td className="px-3 py-2 text-center text-[11px] text-gray-500 leading-tight">
                            <span className="block font-bold text-gray-700">{act.datebebut}</span>
                            <span className="block text-[10px]">au {act.datefin}</span>
                          </td>
                          <td className="px-3 py-2 text-center font-semibold text-gray-600">
                            {act.quantite}
                          </td>
                          <td className="px-3 py-2 text-right text-gray-600 font-mono">
                            {act.pu.toLocaleString()}
                          </td>
                          <td className="px-4 py-2 text-right font-bold text-slate-900 bg-slate-50/50">
                            {act.montant.toLocaleString()}
                          </td>
                          <td className="px-4 py-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 uppercase">
                              {act.bailleur?.libelle || 'Fonds Propres'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}

                {/* TOTAL FINAL DU PROJET - Design Type "Facture" */}
                <tr className="border-t-2 border-blue-900">
                  <td className="px-4 py-4 text-right font-black uppercase text-blue-900 bg-blue-50" colSpan={5}>
                    TOTAL GÉNÉRAL DU PROJET
                  </td>
                  <td className="px-4 py-4 text-right font-black text-lg text-white bg-blue-600 shadow-inner">
                    {totProj.toLocaleString()}
                  </td>
                  <td className="bg-blue-600 px-4 py-4 text-blue-200 text-[10px] font-bold uppercase">
                    Consolidé
                  </td>
                </tr>
                {/* Espaceur entre projets */}
                <tr className="h-8 bg-gray-50"><td colSpan={7}></td></tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
</div>

</div>

            );

       



   
}