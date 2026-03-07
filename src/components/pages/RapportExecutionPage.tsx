import React, { useEffect, useMemo, useState } from 'react';
  import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign, Settings2, BadgeDollarSign } from 'lucide-react';
  
  import {  getRapportGobal } from "../../data/execution/engagement";
 import { getAllCategorie } from "../../data/classification/categorie";
  import { getAllPlanfontprojet } from "../../data/classification/planfontprojet";
  import { getAllExercice } from "../../data/classification/exercice";

  export default function renderRapportRapportsGlobalPage() {
    const [categorie, setCategorie] = useState([]); 
    const [exerciceId, setExerciceId] = useState();
    const [projetId, setProjetId] = useState();
    const [categorieId, setCategorieId] = useState();
  
    const [exercices, setExercices] = useState([]);
    const [projets, setProjets] = useState([]); 
  //  RapportGlobalExecution 
      const [rapports, setRappors] = useState([]);
  
    
  
    const dataExercice = async () => {
      const data = await getAllExercice();
      setExercices(data)
    }
  
     
    useEffect(() => {
      dataExercice(); 
    }, []);
  
  
    const getProjetByExercice = async (e: any) => {
      const value = e;
      if (value !== "") {
        setExerciceId(value)
        const data = await getAllPlanfontprojet(e);
        setProjets(data)
      } else {
        setExerciceId(null)
        setProjets([])
      }
  
      setRappors([]);
      setCategorie([]); 
    }
  
    const getCategoriesByProjet = async (e: any) => {
      setCategorie([])
      const data = await getAllCategorie(e);
      setProjetId(e)
      setCategorie(data)
    }
  
  
    const getLiquidationByProjet = async (e) => {
      getCategoriesByProjet(e);
      setProjetId(e)
      setRappors([]);
      setCategorieId(null); 
       const data = await getRapportGobal(exerciceId, e,null);
        setRappors(data); 
    }
  
    const getLiquidationByCategorie = async (e) => {
      setRappors([]);
      setCategorieId(e) 
        const data = await getRapportGobal(exerciceId, projetId, e);
        setRappors(data);
    }
   
   
    const toDateNormal = (dates: string) => {
      const dateString = dates;
      const date = new Date(dateString);
      const formatted = date.toLocaleString()
      return formatted;
    }
   
    const handlePrint = () => {
      // tu peux éventuellement filtrer le rapport avant impression
      window.print();
    };
   
  const totalMontantVote = rapports.reduce((sum, item) => {
    const montant = Number(item?.planActivite?.montant) || 0; 
    return montant;
  }, 0);

    const totalMontantEngage = rapports.reduce((sum, item) => {
    const montant = Number(item.montantEngage) || 0; 
    return montant;
  }, 0);

    const totalMontantLiquide = rapports.reduce((sum, item) => {
    const montant = Number(item.montantLiquide) || 0;
    const taux = Number(item.tauxDevise) || 0;
    return montant;
  }, 0);
  
    return (
      <div className="max-w-6xl mx-auto bg-white p-10 rounded-sm shadow-sm border border-gray-100 print:border-0 print:shadow-none print:p-0">
  
        {/* EN-TÊTE INSTITUTIONNEL */}
        <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-8">
          <div className="space-y-1">
            <h1 className="text-xl font-bold uppercase tracking-tight text-gray-900">
              Nom de l'Organisation / ONG
            </h1>
            <p className="text-xs italic text-gray-500">Département des Finances & Administration</p>
   
          </div>
  
          <div className="text-right space-y-2">
            <h2 className="text-lg font-black uppercase text-blue-900">
              Rapport génerale de l'execution
            </h2>
  
            {/* Filtre Période */}
            <div className="flex flex-wrap justify-end gap-2 items-center text-sm font-medium">
              {/* Exercice */}
              <div>
                <label className="block mb-1">Exercice</label>
                <select
                  required
                  onChange={(e) => getProjetByExercice(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="">-- Sélectionner --</option>
                  {exercices.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.libelle}
                    </option>
                  ))}
                </select>
              </div>
    
            </div>
  
            {/* Bouton Imprimer */}
            <button
              onClick={handlePrint}
              className="mt-2 bg-slate-800 text-white px-4 py-1.5 text-xs font-bold rounded shadow hover:bg-slate-700 transition print:hidden"
            >
              IMPRIMER LE RAPPORT
            </button>
          </div>
  
        </div>
  
        {/* INFOS PROJET */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 bg-gray-50 p-4 border border-gray-200 rounded-lg">
  
          {/* Projet */}
          <div>
            <span className="block text-[10px] uppercase font-bold text-gray-500 italic">Projet / Programme</span>
            <select
              required
              onChange={(e) => getLiquidationByProjet(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="">-- Sélectionner projet--</option>
              {projets.map((p) => (
                <option key={p.projet.id} value={p.projet.id}>{p.projet.libelle}</option>
              ))}
            </select>
          </div>
  
          {/* Catégorie */}
          <div>
            <span className="block text-[10px] uppercase font-bold text-gray-500 italic">Catégorie</span>
            <select
              onChange={(e) => getLiquidationByCategorie(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="">-- Sélectionner categorie--</option>
              {categorie.map((c) => (
                <option key={c.id} value={c.id}>{c.libelle}</option>
              ))}
            </select>
          </div>
    
        </div>
  
        {/* TABLEAU DES rapports */}
        <table className="w-full border-collapse border border-gray-400 mb-8">
          <thead>
            <tr className="bg-gray-800 text-white text-[11px] uppercase tracking-wider"> 
              <th className="border border-gray-400 px-3 py-3 text-left w-20">Ligne</th>
              <th className="border border-gray-400 px-3 py-3 text-left w-28">Source</th>
              <th className="border border-gray-400 px-3 py-3 text-left w-28">Béneficiaire</th>
              <th className="border border-gray-400 px-3 py-3 text-left w-28">Credit vote</th>
              <th className="border border-gray-400 px-3 py-3 text-left">Credit engagé</th>
              <th className="border border-gray-400 px-3 py-3 text-left">Credit liquidé</th>  
            </tr>
          </thead>
          <tbody className="text-xs text-gray-800">
            {rapports.map((item) => (
              <tr key={item} className="odd:bg-white even:bg-gray-50">
                <td className="border border-gray-300 px-3 py-2 text-center ">{item?.planActivite?.activite?.libelle}</td>
                <td className="border border-gray-300 px-3 py-2">{item.planActivite?.source?.libelle}</td>
                <td className="border border-gray-300 px-3 py-2">{item.planActivite?.beneficiaire?.libelle}</td>
                <td className="border border-gray-300 px-3 py-2 font-mono font-bold">{item?.planActivite?.montant}</td>
                <td className="border border-gray-300 px-3 py-2 font-mono font-bold">{item.montantEngage}</td>
                <td className="border border-gray-300 px-3 py-2 font-mono font-bold">{item.montantLiquide}</td>         </tr>
            ))}
            {/* LIGNE DE TOTAL */}
            <tr className="bg-gray-100 font-bold border-t-2 border-gray-800 text-sm">
              <td colSpan="3" className="border border-gray-300 px-3 py-3 text-right uppercase tracking-widest">Total Général Liquidé</td>
              <td className="border border-gray-800 px-3 py-3 text-right bg-yellow-50 text-blue-900 italic underline">{totalMontantVote.toLocaleString()}</td>
              <td className="border border-gray-800 px-3 py-3 text-right bg-yellow-50 text-blue-900 italic underline">{totalMontantEngage.toLocaleString()}</td>
              <td className="border border-gray-800 px-3 py-3 text-right bg-yellow-50 text-blue-900 italic underline">{totalMontantLiquide.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
  
        {/* ZONE DE SIGNATURES TRIPLE (Standard ONG) */}
        <div className="grid grid-cols-3 gap-8 mt-16 px-4">
          <div className="text-center">
            <p className="text-[11px] uppercase font-black text-gray-400 mb-12">Préparé par (Comptabilité)</p>
            <div className="border-t border-dotted border-gray-800 pt-2 text-xs font-bold uppercase">Signature & Date</div>
          </div>
          <div className="text-center">
            <p className="text-[11px] uppercase font-black text-gray-400 mb-12">Vérifié par (Finances)</p>
            <div className="border-t border-dotted border-gray-800 pt-2 text-xs font-bold uppercase">Signature & Date</div>
          </div>
          <div className="text-center border-2 border-dashed border-gray-200 p-2">
            <p className="text-[11px] uppercase font-black text-gray-400 mb-12 italic text-red-600">Approuvé par (Direction)</p>
            <div className="border-t border-gray-800 pt-2 text-xs font-bold uppercase">Signature & Cachet</div>
          </div>
        </div>
  
        {/* FOOTER BAS DE PAGE */}
        <div className="mt-20 text-center border-t border-gray-100 pt-4">
          <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em]">Document généré électroniquement - Valide sans ratures</p>
        </div>
      </div>
  
    );
  
  }