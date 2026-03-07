import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {getAllBanque} from "../../../data/tresorerie/banques";
import {getAllPlancompte} from "../../../data/classification/planComptable";
import {getAllComptebancaire} from "../../../data/tresorerie/comptebancaire";
import {createJournal,deleteJournal,getAllJournal,updateJournal} from "../../../data/tresorerie/journal";
import {getAllBailleur} from "../../../data/classification/bailleur";
import {getAllDevise} from "../../../data/classification/devise";

const renderTresorieJournalPage: React.FC = () => {

  const [journals, setJournanls] = useState([])

     const [comptebancaires, setComptebancaires] = useState([]) 
     const [banques, setBanques] = useState([]) 
     const [plancomptables, setPlancomptables] = useState([]);
     
     const [idcompte, setIdcompte] = useState(null); 
     const [numerobc, setNumerobc] = useState(null); 
     const [idbanque, setIdbanque] = useState(null); 
     const [iddevise, setIddevise] = useState(null); 
     const [idsrcfinancement, setIdsrcfinancement] = useState(null); 
     const [bailleurs, setBailleurs] = useState(null);  
       const [devises, setDevises] = useState([]);

  const [formData, setFormData] = useState({}); 
  const [showModal, setShowModal] = useState(false);

  // GET
    const dataJournal = async (exercice: number,banque: number,numero: string,debut:any,fin:any) => {
      const data = await getAllJournal(exercice, banque, numero,debut,fin);
      setJournanls(data)
    } 
  
    const dataComptebancaire = async (banque: number) => {
      const data = await getAllComptebancaire(banque,null, null);
      setComptebancaires(data)
    }
  
    const dataBanque = async () => {
      const data = await getAllBanque();
      setBanques(data)
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

 
  const openModal = () => { 
    setFormData({});
    setShowModal(true);
  };
 

 
  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="flex items-center justify-between bg-white px-8 py-4 border-b">
        <input
          type="text"
          placeholder="Rechercher une transaction, un commentaire..."
          className="w-1/3 rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-9 h-9 rounded-full border flex items-center justify-center cursor-pointer">
              🔔
            </div>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500">Solde Global</p>
            <p className="text-blue-600 font-semibold text-lg">
              124 592,00 €
            </p>
          </div>
        </div>
      </div>

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
        <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-wrap items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Rechercher par libellé ou référence..."
            className="flex-1 min-w-[250px] rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select className="rounded-lg border px-4 py-2 text-sm bg-white">
            <option>Toutes opérations</option>
            <option>Encaissements</option>
            <option>Décaissements</option>
          </select>

          <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
            Exporter
          </button>

          <button onClick={() => openModal()} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Nouvelle Opération
          </button>
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
                  <td className="p-4">{formData(data.date)}</td>

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
  );
};

export default renderTresorieJournalPage;
