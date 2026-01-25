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
  <div className="px-6 pb-6">
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-[#0f2d4a] text-white">
              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                Projet
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                Nature
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                Catégorie
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
                Montant
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {Object.entries(groupeCategorieid).map(([pid, p]: any) => (
              <React.Fragment key={pid}>
                {Object.entries(p.classes).map(([classId, c]: any) => (
                  <React.Fragment key={classId}>
                    {c.categories.map((cat) => (
                      <tr
                        key={cat.id}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-gray-800">
                          {p.projet.libelle}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {c.classe.libelle}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {cat.categorie.libelle}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">
                          {cat.montant.toLocaleString()}
                        </td>
                      </tr>
                    ))}

                    {/* TOTAL CLASS */}
                    <tr className="bg-amber-50 font-bold text-gray-900">
                      <td className="px-4 py-3 text-gray-800">
                        {p.projet.libelle}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                          {c.classe.libelle} (Total)
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">—</td>
                      <td className="px-4 py-3 text-right text-base font-extrabold">
                        {totalClasse(c.categories).toLocaleString()}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}

                {/* TOTAL PROJET */}
                <tr className="bg-emerald-50 text-gray-900">
                  <td className="px-4 py-3 text-base font-extrabold" colSpan={3}>
                    TOTAL {p.projet.libelle}
                  </td>
                  <td className="px-4 py-3 text-right text-base font-extrabold">
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