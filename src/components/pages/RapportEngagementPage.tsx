import React, { useEffect, useMemo, useState } from 'react';
  import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign, Settings2, BadgeDollarSign } from 'lucide-react';
  
  import {  getAllValider, getAllReceptionner, getAllRejeter, getAllRetourne, getAllEnAttente } from "../../data/execution/engagement";
// import { getAllValider, getAllReceptionner, getAllRejeter, getAllRetourne, getAllEnAttente } from "../../data/execution/engagement";
  import { getAllCategorie } from "../../data/classification/categorie";
  import { getAllPlanfontprojet } from "../../data/classification/planfontprojet";
  import { getAllExercice } from "../../data/classification/exercice";
  import { getAllDevise } from "../../data/classification/devise";
 
  
  export default function renderRapportEngagementPage() {
    const [categorie, setCategorie] = useState([]);
    const [devise, setDevise] = useState("");
    const [libelleBon, setLibelleBon] = useState("");
    const [exerciceId, setExerciceId] = useState();
    const [projetId, setProjetId] = useState();
    const [categorieId, setCategorieId] = useState();
  
    const [exercices, setExercices] = useState([]);
    const [projets, setProjets] = useState([]);
    const [devises, setdevises] = useState([]);
   
      const [engagements, setEngagements] = useState([]);
  
    const [debut, setDebut] = useState("");
    const [fin, setFin] = useState("");
    const [page, setPage] = useState(0);
    const [size] = useState(0);
    const [status, setStatus] = useState("");
  
    const dataExercice = async () => {
      const data = await getAllExercice();
      setExercices(data)
    }
  
    const getAllDevises=async()=>{
        const data = await getAllDevise();
        setdevises(data)
    }
    
    useEffect(() => {
      dataExercice();
      getAllDevises();
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
  
      setEngagements([]);
      setCategorie([]);
      setDebut(null)
      setFin(null)
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
      setEngagements([]);
      setCategorieId(null);
      setDebut("");
      setFin("");
      if (status === 'RECEPTIONNE') {
        const data = await getAllReceptionner(exerciceId, e);
        setEngagements(data);
      } else if (status === 'REJETE') {
        const data = await getAllRejeter(exerciceId, e);
        setEngagements(data);
      } else if (status === 'RETOURNE') {
        const data = await getAllRetourne(exerciceId, e);
        setEngagements(data);
      } else if (status === 'VALIDE') {
        const data = await getAllValider(exerciceId, e);
        setEngagements(data);
      } else if (status === 'EN_ATTENTE') {
        const data = await getAllEnAttente(exerciceId, e);
        setEngagements(data);
      }
    }
  
    const getLiquidationByCategorie = async (e) => {
      setEngagements([]);
      setCategorieId(e)
      setDebut("");
      setFin("");
      if (status === 'RECEPTIONNE') {
        const data = await getAllReceptionner(exerciceId, projetId, e);
        setEngagements(data);
      } else if (status === 'REJETE') {
        const data = await getAllRejeter(exerciceId, projetId, e);
        setEngagements(data);
      } else if (status === 'RETOURNE') {
        const data = await getAllRetourne(exerciceId, projetId, e);
        setEngagements(data);
      } else if (status === 'VALIDE') {
        const data = await getAllValider(exerciceId, projetId, e);
        setEngagements(data);
      } else if (status === 'EN_ATTENTE') {
        const data = await getAllEnAttente(exerciceId, projetId, e);
        setEngagements(data);
      }
    }
  
  
    const getLiquidationByDate = async (e) => {
      setEngagements([]);
      if (debut === "") {
        setFin("");
      } else {
        setFin(e)
        if (status === 'RECEPTIONNE') {
          const data = await getAllReceptionner(exerciceId, projetId, categorieId, toOffsetDateTimeStart(debut), toOffsetDateTimeStart(e));
          setEngagements(data);
        } else if (status === 'REJETE') {
          const data = await getAllRejeter(exerciceId, projetId, categorieId, toOffsetDateTimeStart(debut), toOffsetDateTimeStart(e));
          setEngagements(data);
        } else if (status === 'RETOURNE') {
          const data = await getAllRetourne(exerciceId, projetId, categorieId, toOffsetDateTimeStart(debut), toOffsetDateTimeStart(e));
          setEngagements(data);
        } else if (status === 'VALIDE') {
          const data = await getAllValider(exerciceId, projetId, categorieId, toOffsetDateTimeStart(debut), toOffsetDateTimeStart(e));
          setEngagements(data);
        } else if (status === 'EN_ATTENTE') {
          const data = await getAllEnAttente(exerciceId, projetId, categorieId, toOffsetDateTimeStart(debut), toOffsetDateTimeStart(e));
          setEngagements(data);
        }
      }
    }
  
  
    const toOffsetDateTimeStart = (dateStr: string) => {
      return dateStr ? `${dateStr}T00:00:00Z` : null;
    };
  
    const toDateNormal = (dates: string) => {
      const dateString = dates;
      const date = new Date(dateString);
      const formatted = date.toLocaleString()
      return formatted;
    }
  
    const getStatus = (e) => {
      setStatus(e);
      setEngagements([]);
      setProjets([]);
      setCategorie([]);
      setDebut(null);
      setFin(null);
      if (exerciceId) {
        getProjetByExercice(exerciceId);
      }
    }
    const handlePrint = () => {
      // tu peux éventuellement filtrer le rapport avant impression
      window.print();
    };
   
  const totalMontantLocal = engagements.reduce((sum, item) => {
    const montant = Number(item.montant) || 0;
    const taux = Number(item.tauxDevise) || 0;
    return sum + montant * taux;
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
  
            {/* Nouveau Select Statut */}
            <div className="mt-2">
              <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Statut</label>
              <select
                required
                onChange={(e) => getStatus(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="">-- Status --</option>
                <option value="EN_ATTENTE">En Attente</option>
                <option value="VALIDE">Validée</option>
                <option value="REJETE">Rejetée</option>
                <option value="RETOURNE">Retournée</option>
              </select>
            </div>
          </div>
  
          <div className="text-right space-y-2">
            <h2 className="text-lg font-black uppercase text-blue-900">
              État Récapitulatif des Engagements
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
  
              {/* Date Début */}
              <div>
                <label className="block mb-1">Date Début</label>
                <input
                  type="date"
                  value={fin}
                  onChange={(e) => setDebut(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                />
              </div>
  
              {/* Date Fin */}
              <div>
                <label className="block mb-1">Date Fin</label>
                <input
                  type="date"
                  value={fin}
                  onChange={(e) => getLiquidationByDate(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                />
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
  
          {/* Devise */}
          <div>
            <span className="block text-[10px] uppercase font-bold text-gray-500 italic">Devise</span>
            <select
              value={devise}
              onChange={(e) => setDevise(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="">-- Sélectionner --</option>
              {devises.map((d) => (
                <option key={d.id} value={d.id}>{d.symbole}</option>
              ))}
            </select>
          </div>
  
          {/* Libellé / Numéro Bon */}
          <div>
            <span className="block text-[10px] uppercase font-bold text-gray-500 italic">Libellé / Numéro Bon</span>
            <input
              type="text" 
              onChange={(e) => setLibelleBon(e.target.value)}
              placeholder="Entrez le libellé ou numéro"
              className="mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
        </div>
  
        {/* TABLEAU DES engagements */}
        <table className="w-full border-collapse border border-gray-400 mb-8">
          <thead>
            <tr className="bg-gray-800 text-white text-[11px] uppercase tracking-wider">
              <th className="border border-gray-400 px-3 py-3 text-left w-20">Date</th>
              <th className="border border-gray-400 px-3 py-3 text-left w-28">N° Bon.</th>
              <th className="border border-gray-400 px-3 py-3 text-left">Bénéficiaire</th>
              <th className="border border-gray-400 px-3 py-3 text-left">Objet</th>
              <th className="border border-gray-400 px-3 py-3 text-right w-32">Montant</th>
              <th className="border border-gray-400 px-3 py-3 text-right w-32">Taux</th>
              <th className="border border-gray-400 px-3 py-3 text-right w-32">Montant Total</th>
            </tr>
          </thead>
          <tbody className="text-xs text-gray-800">
            {engagements.map((item) => (
              <tr key={item} className="odd:bg-white even:bg-gray-50">
                <td className="border border-gray-300 px-3 py-2 text-center italic text-gray-400 underline">{toDateNormal(item.dataEnAttente)}</td>
                <td className="border border-gray-300 px-3 py-2 font-mono font-bold">{item.bonEngagement}</td>
                <td className="border border-gray-300 px-3 py-2">{item.planActivite?.beneficiaire?.libelle}</td>
                <td className="border border-gray-300 px-3 py-2 text-gray-600">{item.objet}</td>
                <td className="border border-gray-300 px-3 py-2 text-right font-bold tracking-wider">{item.montant} {item.devise?.symbole}</td>
                <td className="border border-gray-300 px-3 py-2 text-right font-bold tracking-wider">{item.tauxDevise} </td>
                <td className="border border-gray-300 px-3 py-2 text-right font-bold tracking-wider">{item.montant * item.tauxDevise}</td>
              </tr>
            ))}
            {/* LIGNE DE TOTAL */}
            <tr className="bg-gray-100 font-bold border-t-2 border-gray-800 text-sm">
              <td colSpan="6" className="border border-gray-300 px-3 py-3 text-right uppercase tracking-widest">Total Général Liquidé</td>
              <td className="border border-gray-800 px-3 py-3 text-right bg-yellow-50 text-blue-900 italic underline">{totalMontantLocal.toLocaleString()}</td>
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