import React, { useEffect, useMemo, useState } from 'react';
import {getAllClasse,} from "../../data/classification/classes";
import {getAllProjet} from "../../data/classification/projet";
import {getAllCategorie} from "../../data/classification/categorie";
import {getAllExercice} from "../../data/classification/exercice";
import {getAllPlanfontnature} from "../../data/classification/planfontnature";

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
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white shadow-lg">
  {/* HEADER */}
  <div className="flex flex-col gap-1 border-b border-gray-200 px-6 py-5">
    <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
      Rapport par catégorie
    </h2>
    <p className="text-sm text-gray-500">
      Analyse des montants par projet, nature et catégorie.
    </p>
  </div>

  {/* FILTRES */}
  <div className="px-6 py-6">
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-800">Filtres</h3>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          Sélection des paramètres
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

        {/* Projet */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Projet
          </label>

          <select
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition
                       focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            onChange={(e) => getPlanfondNatureByprogramme(e.target.value)}
          >
            <option value="">Sélectionner un projet</option>
            {projets.map((element) => (
              <option key={element.id} value={element.id}>
                {element.libelle}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  </div>

  {/* TABLE */}
<div className="px-6 pb-6 print:px-0">
  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md print:shadow-none print:border-slate-300">
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto text-sm">
        {/* EN-TÊTE PROFESSIONNEL */}
        <thead>
          <tr className="bg-slate-800 text-white print:bg-gray-100 print:text-black">
            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-widest border-r border-slate-700">Structure du Projet</th>
            <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-widest">Nature & Catégorie</th>
            <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-widest">Montant Consolidé</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {Object.entries(groupeCategorieid).map(([pid, p]) => (
            <React.Fragment key={pid}>
              {/* HEADER PROJET - Barre latérale bleue */}
              <tr className="bg-slate-50/50">
                <td colSpan={2} className="px-6 py-4 border-l-4 border-blue-600 bg-blue-50/30">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">Désignation du Projet</span>
                    <span className="text-sm font-black text-slate-800 uppercase">{p.projet.libelle}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right bg-blue-50/30">
                   <span className="text-[10px] font-bold text-blue-600 uppercase block mb-1">Total Projet</span>
                   <span className="text-base font-black text-blue-900 leading-none">
                     {totalProjetcategorie(p.classes).toLocaleString()}
                   </span>
                </td>
              </tr>

              {Object.entries(p.classes).map(([classId, c]) => (
                <React.Fragment key={classId}>
                  {/* LIGNE NATURE / CLASSE */}
                  <tr className="bg-white group">
                    <td className="px-8 py-3 text-gray-400 italic text-xs border-r border-slate-50">
                      Nature de dépense
                    </td>
                    <td className="px-6 py-3 font-bold text-slate-700 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                      {c.classe.libelle}
                    </td>
                    <td className="px-6 py-3 text-right font-bold text-slate-500 text-xs italic">
                      Sous-total : {totalClasse(c.categories).toLocaleString()}
                    </td>
                  </tr>

                  {/* LIGNES CATÉGORIES (DÉTAILS) */}
                  {c.categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-2"></td>
                      <td className="px-10 py-2 text-gray-600 border-l border-slate-100 relative">
                        {/* Petit trait de liaison visuelle */}
                        <div className="absolute left-0 top-1/2 w-3 h-[1px] bg-slate-200"></div>
                        {cat.categorie.libelle}
                      </td>
                      <td className="px-6 py-2 text-right font-mono text-gray-700 tracking-tighter">
                        {cat.montant.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  
                  {/* ESPACEUR SUBTIL */}
                  <tr className="h-2"><td colSpan={3}></td></tr>
                </React.Fragment>
              ))}

              {/* PIED DE SECTION PROJET (Total récapitulatif stylisé) */}
              <tr className="border-b-2 border-slate-200">
                <td colSpan={2} className="px-6 py-3 text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Récapitulatif Financier {p.projet.libelle}
                </td>
                <td className="px-6 py-3 text-right bg-slate-900 text-white font-black rounded-b-lg shadow-sm">
                  {totalProjetcategorie(p.classes).toLocaleString()}
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

</div>

            );
            

   
}