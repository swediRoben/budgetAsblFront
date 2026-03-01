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
  const transactions = [
    {
      date: "15/02/2024",
      type: "Encaisse",
      label: "Paiement Client - TechCorp",
      category: "Ventes",
      reference: "INV-2024-001",
      amount: 12500,
    },
    {
      date: "14/02/2024",
      type: "Décaisse",
      label: "Loyer Bureau Février",
      category: "Loyer",
      reference: "RENT-FEB",
      amount: -2500,
    },
    {
      date: "14/02/2024",
      type: "Décaisse",
      label: "Achat Matériel Informatique",
      category: "Équipement",
      reference: "PO-4592",
      amount: -1240.5,
    },
    {
      date: "13/02/2024",
      type: "Encaisse",
      label: "Remboursement TVA",
      category: "Impôts",
      reference: "TVA-Q4",
      amount: 4500,
    },
  ];


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
  const [modalType, setModalType] = useState("");
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

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      if (!data.id) {
        // await createClasse(data);
      } else {
        // await updateClasse(data.id,data); 
      }
      toast.success("Operation effectuée avec succès !");
      reset();
      // dataClasse();
      closeModal();
    } catch (error: any) {
      toast.error("Erreur lors de l'operation'.", { style: { backgroundColor: "red", color: "white" } });
    }
  };

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


  const hendleUpdata = (data: any) => {
    // resetClasse(data); 
    openModal()
  }

  const openModal = () => {
    setModalType();
    setFormData({});
    setShowModal(true);
  };

  const closeModal = () => {
    reset()
    setShowModal(false);
  };

  const typeBudget = watch("typeBudget");

  const renderModalForm = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ID caché */}
          <input
            type="text"
            hidden
            {...register("id", { disabled: true })}
          />

          {/* Exercice */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Exercice
            </label>
            <input
              type="text"
              {...register("exercice", { required: "Exercice obligatoire" })}
              placeholder="2026"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.exercice && (
              <p className="text-red-600 text-xs mt-1">{errors.exercice.message}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              {...register("date", { required: "Date obligatoire" })}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.date && (
              <p className="text-red-600 text-xs mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Type de budget */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Type de budget</p>
            <div className="flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  value="budget"
                  {...register("typeBudget")}
                  className="accent-blue-500 w-5 h-5"
                />
                <span className="text-gray-700 font-medium">Budget</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  value="nonBudget"
                  {...register("typeBudget")}
                  className="accent-blue-500 w-5 h-5"
                />
                <span className="text-gray-700 font-medium">Non Budget</span>
              </label>
            </div>
          </div>

          {/* Conditional Budget Fields */}
          {typeBudget === "budget" && (
            <>
              {/* Bon d'engagement */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Bon d'engagement
                </label>
                <input
                  type="text"
                  {...register("bonEngagement")}
                  placeholder="Numéro du bon"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              {/* Ligne budgétaire */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Ligne budgétaire
                </label>
                <select
                  {...register("ligneBudgetaire")}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                  <option value="">Sélectionner une ligne</option>
                  <option value="LB01">LB01 - Personnel</option>
                  <option value="LB02">LB02 - Fonctionnement</option>
                  <option value="LB03">LB03 - Investissement</option>
                </select>
              </div>
            </>
          )}

          {/* Conditional Non-Budget Field */}
          {typeBudget === "nonBudget" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Bailleur
              </label>
              <select
                {...register("bailleur")}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">Sélectionner un bailleur</option>
                <option value="B001">Bailleur A</option>
                <option value="B002">Bailleur B</option>
                <option value="B003">Bailleur C</option>
              </select>
            </div>
          )}

          {/* Compte */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Compte
            </label>
            <select
              {...register("compte", { required: "Compte obligatoire" })}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Sélectionner un compte</option>
              <option value="101">101 - Banque</option>
              <option value="102">102 - Caisse</option>
              <option value="103">103 - Fournisseur</option>
            </select>
            {errors.compte && (
              <p className="text-red-600 text-xs mt-1">{errors.compte.message}</p>
            )}
          </div>

          {/* Type de mouvement */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Type de mouvement
            </label>
            <select
              {...register("type", { required: "Type obligatoire" })}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Sélectionner</option>
              <option value="debit">Débit</option>
              <option value="credit">Crédit</option>
            </select>
            {errors.type && (
              <p className="text-red-600 text-xs mt-1">{errors.type.message}</p>
            )}
          </div>

          {/* Montant */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Montant
            </label>
            <input
              type="number"
              step="0.01"
              {...register("montant", {
                required: "Montant obligatoire",
                min: { value: 0.01, message: "Le montant doit être > 0" },
                valueAsNumber: true,
              })}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.montant && (
              <p className="text-red-600 text-xs mt-1">{errors.montant.message}</p>
            )}
          </div>

          {/* Devise */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Devise
            </label>
            <select
              {...register("devise", { required: "Devise obligatoire" })}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Sélectionner une devise</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="BIF">BIF</option>
            </select>
            {errors.devise && (
              <p className="text-red-600 text-xs mt-1">{errors.devise.message}</p>
            )}
          </div>

          {/* Objet / Libellé */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Objet / Libellé
            </label>
            <input
              type="text"
              {...register("objet", { required: "Objet obligatoire" })}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.objet && (
              <p className="text-red-600 text-xs mt-1">{errors.objet.message}</p>
            )}
          </div>

          {/* Observations */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Observations
            </label>
            <textarea
              {...register("observation")}
              rows={3}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-green-600 px-8 py-3 text-sm font-semibold text-white hover:bg-green-700 transition"
          >
            Enregistrer
          </button>
        </div>
      </form>
    );
  };
  return (
    <div className="min-h-screen bg-gray-50">

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-auto max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                {modalType === 'classe'
                  ? 'Ajouter une Classe'
                  : modalType === 'planComptable'
                    ? 'Ajouter un Compte'
                    : 'Ajouter un Élément'}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">{renderModalForm()}</div>
          </div>
        </div>
      )}

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
                <th className="text-left p-4">Catégorie</th>
                <th className="text-left p-4">Référence</th>
                <th className="text-right p-4">Montant</th>
                <th className="text-center p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((tx, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4">{tx.date}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${tx.amount > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {tx.type}
                    </span>
                  </td>

                  <td className="p-4 font-medium">
                    {tx.label}
                  </td>

                  <td className="p-4 text-gray-600">
                    {tx.category}
                  </td>

                  <td className="p-4 text-gray-500">
                    {tx.reference}
                  </td>

                  <td
                    className={`p-4 text-right font-semibold ${tx.amount > 0
                        ? "text-green-600"
                        : "text-red-600"
                      }`}
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {tx.amount.toLocaleString("fr-FR")} €
                  </td>

                  <td className="p-4 text-center">
                    <button className="text-gray-400 hover:text-gray-700">
                      ⋯
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
