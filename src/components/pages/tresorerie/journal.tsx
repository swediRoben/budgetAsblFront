import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {getAllBanque} from "../../../data/tresorerie/banques";
import {getAllPlancompte} from "../../../data/classification/planComptable";
 import {createJournal,deleteJournal,getAllJournal,updateJournal} from "../../../data/tresorerie/journal";
import {getAllBailleur} from "../../../data/classification/bailleur";
import {getAllDevise} from "../../../data/classification/devise"; 
import { getAllCategorie } from "../../../data/classification/categorie";
import { getAllPlanfontprojet } from "../../../data/classification/planfontprojet";


 import { getAllExercice } from "../../../data/classification/exercice";
 
const renderTresorieJournalPage: React.FC = () => {

  const [journals, setJournanls] = useState([])

     const [comptebancaires, setComptebancaires] = useState([]) 
     const [banques, setBanques] = useState([]) 
     const [plancomptables, setPlancomptables] = useState([]);
     
    const [exercices, setExercices] = useState([]);
    const [projets, setProjets] = useState([]);
      const [categories, setCategories] = useState([]); 
    const [classes, setClasses] = useState([]);
    const [comptesBancaires, setComptesBancaires] = useState([]);

     const [bailleurs, setBailleurs] = useState([]);  
       const [devises, setDevises] = useState([]);

        const { registerRecherche, handleSubmitRecherche, resetRecherche } = useForm();
 
                const dataBanque = async () => {
                    const data = await getAllBanque();
                    setBanques(data)
                }

                    const dataExercice = async () => {
                        const data = await getAllExercice();
                        setExercices(data)
                    }
         
                     const getPlanfondByExercice = async (e: any) => {
                        const value = e.target.value;
                        if (value !== "") {
                         const data = await getAllPlanfontprojet(e.target.value);
                          setProjets(data)
                        } else {
                          setProjets([])
                        }
                        setProjets([])
                      }
                    
                      const getCategoriesByProjet = async (e: any) => {
                        setCategories([])
                        const data = await getAllCategorie(e);
                        setCategories(e)
                      }
                    


 const onSubmitRecherche = (data) => {
    const filter = {
      exerciceId: data.exerciceId || null,
      debut: data.debut || null,
      fin: data.fin || null,
      reference: data.reference || null,
      projetId: data.projetId || null,
      categorieId: data.categorieId || null,
      typeMouvement: data.typeMouvement || null,
      sourceFinancementId: data.sourceFinancementId || null,
      banqueId: data.banqueId || null,
      compteBanqueId: data.compteBanqueId || null
    };

    onSearch(filter);
  };
        

  // GET
    const dataJournal = async (exercice: number,banque: number,numero: string,debut:any,fin:any) => {
      const data = await getAllJournal(exercice, banque, numero,debut,fin);
      setJournanls(data)
    } 
  
    const dataComptebancaire = async (banque: number) => {
      const data = await getAllComptebancaire(banque,null, null);
      setComptebancaires(data)
    }
  
    const dataPlancompte = async () => {
      const data = await getAllPlancompte();
      setPlancomptables(data)
    }
    const dataDevise = async () => {
      const data = await getAllDevise();
      setDevises(data)
    }
  
    const dataBailleur = async () => {
      const data = await getAllBailleur();
      setBailleurs(data)
    }

     useEffect(()=>{ 
                dataJournal(null,null,null,null,null);
                dataBanque();
                dataDevise();
                dataBailleur();
                dataPlancompte();
               dataComptebancaire(null,null,null);
              },[])

      const toDateNormal = (dates: string) => {
    const dateString = dates;
    const date = new Date(dateString);
    const formatted = date.toLocaleString()
    return formatted;
  }

 
  const hendleDelete = (id: number, type: string) => {
    try {
      // deleteClasse(id);
      // dataClasse();
      toast.success("Supression effectuée avec succès !");

    } catch (error) {
      toast.error("Erreur lors de l'operation'.", { style: { backgroundColor: "red", color: "white" } });
      // dataClasse();
    }
  }

 
 

 const [activeTab, setActiveTab] = useState("lines");
  return (

    <>
        <div className="bg-white rounded-lg border">

      {/* Tabs */}
      <div className="flex border-b text-sm font-medium">
        <button
          onClick={() => setActiveTab("lines")}
          className={`px-4 py-2 ${
            activeTab === "lines"
              ? "border-b-2 border-pink-500 text-pink-600"
              : "text-gray-500"
          }`}
        >
          JOURNALS
        </button>

        <button
          onClick={() => setActiveTab("info")}
          className={`px-4 py-2 ${
            activeTab === "info"
              ? "border-b-2 border-pink-500 text-pink-600"
              : "text-gray-500"
          }`}
        >
          NOUVEL OPERATION
        </button>
      </div>

      {/* Content */}
      <div className="p-4">

        {/* Invoice Lines */}
        {activeTab === "lines" && (
           <div className="min-h-screen bg-gray-50">


      {/* CONTENT */}
      <div className="p-8">
        {/* TITLE */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            Journal de Trésorerie
          </h1>
          <p className="text-gray-500">
            Suivi détaillé des encaissements et décaissements.
          </p>
        </div>

        {/* FILTER BAR */}
      {/* FILTER BAR */}
<div className="bg-white rounded-xl shadow-sm border p-4 mb-6">

  <form onSubmit={handleSubmitRecherche(onSubmitRecherche)} className="space-y-4">

    {/* Ligne 1 : Recherche principale */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

      <input
        type="text"
        placeholder="Référence..."
        {...registerRecherche("reference")}
        className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <select
        {...registerRecherche("typeMouvement")}
        className="border rounded-lg px-3 py-2 text-sm"
      >
        <option value="">Type mouvement</option>
        <option value="DEBIT">Encaissement</option>
        <option value="CREDIT">Décaissement</option>
      </select>

      <select {...registerRecherche("exerciceId")} className="border rounded-lg px-3 py-2 text-sm">
        <option value="">Exercice</option>
        {exercices.map((e) => (
          <option key={e.id} value={e.id}>
            {e.libelle}
          </option>
        ))}
      </select>

      <select {...registerRecherche("projetId")} className="border rounded-lg px-3 py-2 text-sm">
        <option value="">Projet</option>
        {projets.map((p) => (
          <option key={p.id} value={p.id}>
            {p.libelle}
          </option>
        ))}
      </select>

    </div>

    {/* Ligne 2 */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

      <select {...registerRecherche("categorieId")} className="border rounded-lg px-3 py-2 text-sm">
        <option value="">Catégorie</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.libelle}
          </option>
        ))}
      </select>

      <select {...registerRecherche("banqueId")} className="border rounded-lg px-3 py-2 text-sm">
        <option value="">Banque</option>
        {banques.map((b) => (
          <option key={b.id} value={b.id}>
            {b.nom}
          </option>
        ))}
      </select>

      <select {...registerRecherche("compteBanqueId")} className="border rounded-lg px-3 py-2 text-sm">
        <option value="">Compte bancaire</option>
        {comptesBancaires.map((c) => (
          <option key={c.id} value={c.id}>
            {c.numero}
          </option>
        ))}
      </select>

      <select {...registerRecherche("sourceFinancementId")} className="border rounded-lg px-3 py-2 text-sm">
        <option value="">Source financement</option>
        {bailleurs.map((s) => (
          <option key={s.id} value={s.id}>
            {s.libelle}
          </option>
        ))}
      </select>

    </div>

    {/* Ligne 3 : Dates + Actions */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">

      <input
        type="date"
        {...registerRecherche("debut")}
        className="border rounded-lg px-3 py-2 text-sm"
      />

      <input
        type="date"
        {...registerRecherche("fin")}
        className="border rounded-lg px-3 py-2 text-sm"
      />

      {/* Boutons */}
      <div className="flex gap-2 col-span-2 justify-end">

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
        >
          Rechercher
        </button>

        <button
          type="button"
          onClick={openModal}
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
        >
          Nouvelle opération
        </button>

      </div>

    </div>

  </form>

</div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b">
              <tr>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">Libellé</th> 
                <th className="text-left p-4">Référence</th>
                <th className="text-right p-4">Montant</th>
                <th className="text-right p-4">Taux</th> 
                <th className="text-right p-4">Compte Bancaire</th>
                <th className="text-center p-4" colSpan={2}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {journals.map((data) => (
                <tr
                  key={data.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4">{toDateNormal(data.date)}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${data.typemouvement ==="DEBIT"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {data.typemouvement==="DEBIT"?"ENCAISSEMENT":"DECAISSEMENT"}
                    </span>
                  </td>

                  <td className="p-4 font-medium">
                    {data.objet}
                  </td>

                  <td className="p-4 text-gray-600">
                    {data.reference}
                  </td>

                 

                  <td
                    className={`p-4 text-right font-semibold ${data.typemouvement  ==="DEBIT"
                        ? "text-green-600"
                        : "text-red-600"
                      }`}
                  > 
                    {data.montant.toLocaleString("fr-FR")} {data?.devise.symbole}
                  </td>

                   <td className="p-4 text-gray-500">
                    {data.taux}
                  </td> 
                   <td className="p-4 text-gray-500">
                    {data?.compteBancaire.numero}
                  </td>

                  <td className="p-4 text-center">
                    
                    <button className="text-gray-400 hover:text-gray-700">
                      plus
                    </button> 
                  </td>
                   <td className="p-4 text-center"> 
                    <button className="text-red-400 hover:text-gray-700">
                      delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
        )}

        {/* Other Info */}
        {activeTab === "info" && (
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block text-sm text-gray-600">Salesperson</label>
              <input className="border rounded px-3 py-2 w-full"/>
            </div>

            <div>
              <label className="block text-sm text-gray-600">Payment Terms</label>
              <input className="border rounded px-3 py-2 w-full"/>
            </div>

            <div>
              <label className="block text-sm text-gray-600">Customer Reference</label>
              <input className="border rounded px-3 py-2 w-full"/>
            </div>

          </div>
        )}

      </div>

    </div>
    
    
    
  
   
      </>
  );
};

export default renderTresorieJournalPage;
