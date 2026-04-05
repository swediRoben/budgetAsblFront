import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { getAllBanque } from "../../../data/tresorerie/banques";
import { getAllPlancompte, getPlancompteById } from "../../../data/classification/planComptable";
import { createJournal, deleteJournal, getAllJournal, updateJournal, filterJournal } from "../../../data/tresorerie/journal";
import { getAllBailleur } from "../../../data/classification/bailleur";
import { getAllDevise } from "../../../data/classification/devise";
import { getAllCategorie } from "../../../data/classification/categorie";
import { getAllPlanfontprojet } from "../../../data/classification/planfontprojet";

import { getAllFonctionnaire } from "../../../data/utilisateur/fonctionnaire";
import { getAllValiderLiqidation } from "../../../data/execution/liquidation";
import { getAllExercice } from "../../../data/classification/exercice";
import { getAllPrevision } from "../../../data/classification/prevision";
import { getAllComptebancaire } from "../../../data/tresorerie/comptebancaire";
import { getAllClasse } from "../../../data/classification/classes";

const renderTresorieJournalPage: React.FC = () => {

  const [journals, setJournanls] = useState([])

  const [comptebancaires, setComptebancaires] = useState([])
  const [plancomptables, setPlancomptables] = useState([]);

  const [projets, setProjets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [comptesBancaires, setComptesBancaires] = useState([]);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [Liquidations, setLiquidations] = useState([]);
  const [engagements, setEngagements] = useState([]); 
  const [categorie, setCategorie] = useState([]);
  const [planfondprojets, setPlanfontprojets] = useState([]);
  const [exerciceId, setExerciceId] = useState();
  const [projetId, setProjetId] = useState();
  const [categorieId, setCategorieId] = useState();
  const [bailleurs, setBailleurs] = useState([]);
  const [exercices, setExercices] = useState([]);
  const [fonctionnaires, setFonctionnaires] = useState([]);
  const [devises, setDevises] = useState([]);
  const [engagementid, setEngagementid] = useState(null);
  const [previsions, setPrevisions] = useState([]); 
  const [montantLiquide, setMontantLiquide] = useState(0);
  const [bonEngagment, setBonEngagment] = useState("");  
  const [budget, setBudget] = useState(false)
  const [debut, setDebut] = useState("");
  const [fin, setFin] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const [idDevise, setIdDevise] = useState(null);
  const [showBanque, setShowBanque] = useState(false);

  const [banques, setBanques] = useState([]); 
  const [classes, setClasses] = useState([]);
  const [allProjets, setAllProjets] = useState([]); // Pour stocker tous les projets

  const [soldeBancaire, setSoldeBancaire] = useState(0); // État pour le solde bancaire

  const dataComptebancaire = async (banque: number) => {
    setComptesBancaires([]);
    const data = await getAllComptebancaire(banque, idDevise, null);
    setComptesBancaires(data);
  }

  // Fonction pour récupérer le solde d'un compte bancaire
  const getSoldeCompteBancaire = async (compteId: number) => {
    try {
      const compte = comptesBancaires.find(c => c.id === compteId);
      if (compte) {
        setSoldeBancaire(compte.montant || 0);
        return compte.montant || 0;
      }
      return 0;
    } catch (error) {
      console.error("Erreur lors de la récupération du solde", error);
      return 0;
    }
  }

  const showBanqueByDevise = (id: number) => {
    if (id != 0) {
      setIdDevise(id);
      setShowBanque(true);
    } else {
      setIdDevise(id);
      setShowBanque(false);
    }
  }

  const dataBanque = async () => {
    const data = await getAllBanque();
    setBanques(data)
  }
  

  const dataBailleur = async () => {
    const data = await getAllBailleur();
    setBailleurs(data)
  }

   const dataClasses = async () => {
    const data = await getAllClasse();
    setClasses(data)
  }

  const getCompteBancaireByBanque = (idBanque: number) => {
    dataComptebancaire(idBanque)
  }
 

  // Fonction pour récupérer tous les projets
  const getAllProjets = async () => {
    try {
      const data = await getAllPlanfontprojet(exerciceId);
      const projetsUniques = data.map(item => item.projet);
      setAllProjets(projetsUniques);
    } catch (error) {
      console.error("Erreur lors de la récupération des projets", error);
    }
  }

  const [showLiquidationList, setShowLiquidationList] = useState(false);
  const dataExercice = async () => {
    const data = await getAllExercice();
    setExercices(data)
  }

  const dataDevise = async () => {
    const data = await getAllDevise();
    setDevises(data)
  }

  const dataFonctionnaires = async () => {
    const data = await getAllFonctionnaire();
    setFonctionnaires(data)
  }

  useEffect(() => {
    dataBanque();
    dataExercice();
    dataBailleur();
    dataDevise();
    dataFonctionnaires();
    getAllProjets();
    dataClasses();
  }, []);

  const handleChangeExercice = async (e: any) => {
    const value = e.target.value;
    setExerciceId(value)
  }

  const getPlanfondByExercice = async (e: any) => {
    const value = e.target.value;
    if (value !== "") {
      setExerciceId(value)
      const data = await getAllPlanfontprojet(e.target.value);
      setPlanfontprojets(data)
    } else {
      setPlanfontprojets([])
    }
    setPrevisions([])
  }

  const getCategoriesByProjet = async (e: any) => {
    setCategorie([])
    const data = await getAllCategorie(e);
    setProjetId(e)
    setCategories(data)
  }

  const getCategorieByProjet = async (e) => {
    getCategoriesByProjet(e);
    setProjetId(e)
    setLiquidations([]);
    setCategorieId(null);
    setDebut("");
    setFin("");
    const data = await getAllValiderLiqidation(exerciceId, e);
    setLiquidations(data);
  }

  const getLiquidationByCategorie = async (e) => {
    setLiquidations([]);
    setCategorieId(e)
    setDebut("");
    setFin("");
    const data = await getAllValiderLiqidation(exerciceId, projetId, e);
    setLiquidations(data);
  }

  const getByDate = async (e) => {
    setLiquidations([]);
    if (debut === "") {
      setFin("");
    } else {
      setFin(e)
      const data = await getAllValiderLiqidation(exerciceId, projetId, categorieId, toOffsetDateTimeStart(debut), toOffsetDateTimeStart(e));
      setLiquidations(data);
    }
  }

  const paginationPreview = async () => {
    if (page > 0) {
      setPage(page - 1);
      setTotalPages(totalPages - 1);
      const data = await getAllValiderLiqidation(exerciceId, projetId, categorieId, toOffsetDateTimeStart(debut), toOffsetDateTimeStart(fin), page, size);
      setLiquidations(data);
    }
  }

  const paginationNext = async () => {
    setPage(page + 1);
    setTotalPages(totalPages + 1);
    const data = await getAllValiderLiqidation(exerciceId, projetId, categorieId, toOffsetDateTimeStart(debut), toOffsetDateTimeStart(fin), page, size);
    setLiquidations(data);
  }

  const getPrevisionByCategorie = async (e: any) => {
    const value = e;
    if (value !== "") {
      const data = await getAllPrevision(exerciceId, projetId, e);
      setPrevisions(data)
    } else {
      setPrevisions([])
    }
  }

  const handleAfficheEngagementData = (data: any) => {
    setBonEngagment(data.bonEngagement);
    return data;
  }

  const toOffsetDateTimeStart = (dateStr: string) => {
    return dateStr ? `${dateStr}T00:00:00Z` : null;
  };

  const formatDate = (dateString: string) => {
    return dateString ? dateString.split("T")[0] : null;
  };

  useEffect(() => {
    const id = watch("idEngagement");
    if (id && engagements.length > 0) {
      const selected = engagements.find(
        (p: any) => p.id.toString() === id);
      if (selected) handleAfficheEngagementData(selected);
    }
    setEngagementid(id);
  });

  const closeAll = () => {
    setLiquidations([]);
    setBailleurs([]);
    setDevises([]);
    setPrevisions([]); 
    setClasses([]);
  }

  const hendleUpdata = async (data: any) => {
    closeAll();
    setLiquidations(prev => [...prev, data]);
    setBailleurs(prev => [...prev, data.planActivite.source]);
    setDevises(prev => [...prev, data?.devise]);
    setPrevisions(prev => [...prev, data.planActivite]); 
    setClasses(prev => [...prev, data.planActivite.classe]);
    setShowLiquidationList(false);
    setBudget(true)
  };

  useEffect(() => {
    if (budget && Liquidations.length > 0) {
      setValue("idExercice", Liquidations[0].idExercice);
      setValue("taux", Liquidations[0].tauxDevise);
      setValue("montant", Liquidations[0].montant);
      setValue("classeId", Liquidations[0]?.planActivite?.planComptable?.classe?.id);
      setValue("deviseId", Liquidations[0]?.idDevise);
      setValue("liquidationId", Liquidations[0].id);
      setValue("idPlanFondActivite", Liquidations[0].planActivite?.id);
      setValue("projetId", Liquidations[0].idProjet);
      setValue("categorieId", Liquidations[0].planActivite?.categorie?.id);
      setValue("sourceFinacementId", Liquidations[0].planActivite?.source?.id);
      setValue("reference", Liquidations[0].bonEngagment); 
      setValue("objet", Liquidations[0].objet);
    }
  }, [Liquidations]);

  useEffect(() => {
    const value = watch("deviseId")
    if (value) {
      showBanqueByDevise(Number(value));
    }
  })

  const openList = () => {
    setLiquidations([]);
    setPlanfontprojets([]);
    setCategorie([]);
    setCategorieId(null);
    setProjetId(null);
    setDebut("");
    setFin("");
    setShowLiquidationList(true);
    setBudget(false)
  }

  const formatOffsetDate = (value) => {
    if (!value) return null;
    return new Date(value).toISOString();
  };

  // Vérification du solde avant soumission
  const checkSoldeBeforeSubmit = async (data: any) => {
    if (data.typemouvement === "CREDIT" && data.compteBancaireId) {
      const solde = await getSoldeCompteBancaire(Number(data.compteBancaireId));
      const montant = Number(data.montant);
      
      if (solde < montant) {
        toast.error(`Solde insuffisant ! Solde disponible : ${solde.toLocaleString("fr-FR")} ${data.deviseId ? "FCFA" : ""}`, { 
          style: { backgroundColor: "red", color: "white" },
          duration: 5000
        });
        return false;
      }
    }
    return true;
  };

  const onSubmit = async (data: any) => {
    try {
      // Vérifier le solde pour les décaissements
      const soldeOk = await checkSoldeBeforeSubmit(data);
      if (!soldeOk) return;

      data.date = formatOffsetDate(data.date)
      if (!data.id) {
        await createJournal(data);
      } else {
        await updateJournal(data.id, data);
      }
      reset({
        id: null,
        reference: "",
        idExercice: null,
        typemouvement: "",
        taux: null,
        montant: null,
        objet: "",
        date: "",
        projetId: null,
        categorieId: null,
        banqueId: null,
        classeId: null,
        deviseId: null,
        compteBancaireId: null,
        liquidationId: null,
        idPlanFondActivite: null,
        sourceFinacementId: null,
        modepaiement: "",
        numroCheque: "",
      })
      toast.success("Operation effectuée avec succès !");
      // Rafraîchir la liste
      dataJournal(exerciceId, null, null, null, null);
    } catch (error) {
      toast.error("Erreur lors de l'operation'.", { style: { backgroundColor: "red", color: "white" } });
    }
  }

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: null,
      reference: "",
      idExercice: null,
      typemouvement: "",
      taux: null,
      montant: null,
      objet: "",
      date: "",
      projetId: null,
      categorieId: null,
      banqueId: null,
      classeId: null,
      deviseId: null,
      compteBancaireId: null,
      liquidationId: null,
      idPlanFondActivite: null,
      sourceFinacementId: null,
      modepaiement: "",
      numroCheque: "",
    },
  });

  const modePaiement = watch("modepaiement");
  const typeMouvement = watch("typemouvement");

  const renderSelect = (label, fieldName, options, required = false) => {
    const renderOptions = () => {
      if (label === "Liquidation") {
        return options?.map((o) => (
          <option key={o?.id} value={o?.id}>
            {o?.objet}
          </option>
        ));
      } else if (label === "Plan Activité") {
        return options?.map((o) => (
          <option key={o?.id} value={o?.id}>
            {o?.activite?.code} {o?.activite?.libelle}
          </option>
        ));
      } else if (label === "Compte Bancaire") {
        return options?.map((o) => (
          <option key={o?.id} value={o?.id}>
            {o?.numero} - Solde: {o?.montant?.toLocaleString("fr-FR") || 0} FCFA
          </option>
        ));
      } else {
        return options?.map((o) => (
          <option key={o?.id} value={o?.id}>
            {o?.libelle}
          </option>
        ));
      }
    };

    return (
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
          {label}
        </label>

        <select
          {...register(fieldName, required ? { required: `${label} requis` } : {})}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          onChange={async (e) => {
            if (fieldName === "compteBancaireId" && typeMouvement === "CREDIT") {
              const solde = await getSoldeCompteBancaire(Number(e.target.value));
              const montantActuel = watch("montant");
              if (montantActuel && solde < montantActuel) {
                toast.warning(`Attention: Solde disponible (${solde.toLocaleString("fr-FR")}) inférieur au montant à décaisser (${montantActuel.toLocaleString("fr-FR")})`);
              }
            }
          }}
        >
          <option value="">-- Choisir --</option>
          {renderOptions()}
        </select>

        {errors[fieldName] && (
          <p className="text-red-500 text-xs mt-1">
            {errors[fieldName]?.message}
          </p>
        )}
      </div>
    );
  };

  const {
    register: registerRecherche,
    handleSubmit: handleSubmitRecherche,
    reset: resetRecherche,
    formState: { errors: errorsRecherche },
  } = useForm();

  const onSubmitRecherche = async (data) => {
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

    const datas = await filterJournal(page, size, filter);
    setJournanls(datas)
  };

  // GET
  const dataJournal = async (exercice: number, banque: number, numero: string, debut: any, fin: any) => {
    const data = await getAllJournal(exercice, banque, numero, debut, fin);
    setJournanls(data)
  }

  useEffect(() => {
    dataBanque();
    dataDevise();
    dataBailleur(); 
    dataClasses();
  }, [])

  const toDateNormal = (dates: string) => {
    const dateString = dates;
    const date = new Date(dateString);
    const formatted = date.toLocaleString()
    return formatted;
  }

  const hendleDelete = (id: number) => {
    try {
      deleteJournal(id);
      setExerciceId(null)
      setJournanls([])
      toast.success("Supression effectuée avec succès !");
    } catch (error) {
      toast.error("Erreur lors de l'operation'.", { style: { backgroundColor: "red", color: "white" } });
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
            className={`px-4 py-2 ${activeTab === "lines"
                ? "border-b-2 border-pink-500 text-pink-600"
                : "text-gray-500"
              }`}
          >
            JOURNALS
          </button>

          <button
            onClick={() => setActiveTab("info")}
            className={`px-4 py-2 ${activeTab === "info"
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

                      <select {...registerRecherche("exerciceId", { required: true })}
                        className="border rounded-lg px-3 py-2 text-sm"
                        onClick={
                          (e) => {
                            getPlanfondByExercice(e);
                            setExerciceId(e.target.value);
                          }
                        }>
                        <option value="">Exercice</option>
                        {exercices.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.libelle}
                          </option>
                        ))}
                      </select>

                      <select {...registerRecherche("projetId")}
                        className="border rounded-lg px-3 py-2 text-sm"
                        onChange={(e) => { getCategoriesByProjet(e.target.value) }}>
                        <option value="">Projet</option>
                        {planfondprojets.map((p) => (
                          <option key={p?.projet.id} value={p?.projet.id}>
                            {p?.projet.libelle}
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

                      <select {...registerRecherche("banqueId")}
                        className="border rounded-lg px-3 py-2 text-sm"
                        onChange={(e) => { getCompteBancaireByBanque(e.target.value) }}
                      >
                        <option value="">Banque</option>
                        {banques.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.libelle}
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
                              className={`px-3 py-1 rounded-full text-xs font-medium ${data.typemouvement === "DEBIT"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                                }`}
                            >
                              {data.typemouvement === "DEBIT" ? "ENCAISSEMENT" : "DECAISSEMENT"}
                            </span>
                          </td>

                          <td className="p-4 font-medium">
                            {data.objet}
                          </td>

                          <td className="p-4 text-gray-600">
                            {data.reference}
                          </td>

                          <td
                            className={`p-4 text-right font-semibold ${data.typemouvement === "DEBIT"
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
                            {data?.compteBancaire?.numero || 'N/A'}
                          </td>

                          <td className="p-4 text-center">

                            <button className="text-gray-400 hover:text-gray-700">
                              plus
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <button onClick={() => hendleDelete(data.id)} className="text-red-400 hover:text-gray-700">
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
            <div className="min-h-screen bg-gray-100 p-6">
              <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">
                  Journal de Trésorerie
                </h2>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {/* Référence */}
                  <div>
                    <input {...register("id", { required: false })} readOnly hidden />
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                      Référence
                    </label>
                    <input
                      {...register("reference", { required: "Référence requise" })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    {errors.reference && (
                      <p className="text-red-500 text-xs mt-1">{errors.reference.message}</p>
                    )}
                  </div>

                  {/* Exercice ID */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                      Exercice ID
                    </label>
                    <select
                      {...register("idExercice", { required: "Exercice requis" })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="">-- Choisir --</option>
                      {
                        exercices?.map((exercice) => (
                          <option key={exercice.id} value={exercice.id}>
                            {exercice.libelle}
                          </option>
                        ))
                      }
                    </select>
                  </div>

                  {/* Type Mouvement */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                      Type Mouvement
                    </label>
                    <select
                      {...register("typemouvement", { required: "Type requis" })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="">-- Choisir --</option>
                      <option value="CREDIT">DECAISSEMENT</option>
                      <option value="DEBIT">ENCAISSEMENT</option>
                    </select>
                  </div>

                  {/* Pour ENCAISSEMENT (DEBIT) - Afficher Classes et Projets */}
                  {typeMouvement === "DEBIT" && (
                    <>
                      <div className="md:col-span-3">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-2">
                          <p className="text-sm text-blue-800 font-semibold mb-2">
                            ℹ️ Informations pour l'encaissement
                          </p>
                        </div>
                      </div>
                      
                      {/* Projet pour encaissement */}
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                          Projet
                        </label>
                        <select
                          {...register("projetId")}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        >
                          <option value="">-- Choisir un projet --</option>
                          {allProjets?.map((projet) => (
                            <option key={projet.id} value={projet.id}>
                              {projet.libelle}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Catégorie */}
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                          Catégorie
                        </label>
                        <select
                          {...register("categorieId")}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        >
                          <option value="">-- Choisir une catégorie --</option>
                          {categories?.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.libelle}
                            </option>
                          ))}
                        </select>
                      </div>

                       
                      {/* Classe */}
                      {renderSelect("Classe", "classeId", classes)}
                      
                      {/* Bailleur */}
                      {renderSelect("Bailleur", "sourceFinacementId", bailleurs)}
                    </>
                  )}

                  {/* Type liquidation - uniquement pour CREDIT */}
                  {typeMouvement === "CREDIT" && (
                    <>
                      <div className="flex justify-start mb-4">
                        <button
                          type="button"
                          onClick={() => openList()}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-colors duration-200"
                        >Liste des liquidations</button>
                      </div>
                    </>
                  )}
                  
                  {/* Montant */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                      Montant
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("montant", { 
                        required: "Montant requis",
                        onChange: async (e) => {
                          const montant = Number(e.target.value);
                          const compteId = watch("compteBancaireId");
                          if (typeMouvement === "CREDIT" && compteId) {
                            const solde = await getSoldeCompteBancaire(Number(compteId));
                            if (solde < montant) {
                              toast.warning(`Solde insuffisant ! Solde disponible: ${solde.toLocaleString("fr-FR")}`);
                            }
                          }
                        }
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    {errors.montant && (
                      <p className="text-red-500 text-xs mt-1">{errors.montant.message}</p>
                    )}
                  </div>

                  {/* Taux */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                      Taux
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      {...register("taux")}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* Devise */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                      Devise
                    </label>
                    <select
                      {...register("deviseId", { required: "Devise requise" })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") return null;
                        showBanqueByDevise(Number(value));
                      }}
                    >
                      <option value="0">-- Choisir --</option>
                      {
                        devises?.map((data) => (
                          <option key={data?.id} value={data?.id}>
                            {data?.libelle} ({data?.symbole})
                          </option>
                        ))
                      }
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                      Date
                    </label>
                    <input
                      type="datetime-local"
                      {...register("date", { required: "Date requise" })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* Banque et Compte Bancaire - conditionnel */}
                  {showBanque && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                          Banque
                        </label>
                        <select
                          {...register("banqueId", { required: "Banque requise" })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") return;
                            getCompteBancaireByBanque(Number(value));
                          }}
                        >
                          <option value="">-- Choisir --</option>
                          {
                            banques?.map((data) => (
                              <option key={data.id} value={data.id}>
                                {data.libelle}
                              </option>
                            ))
                          }
                        </select>
                      </div>
                      {renderSelect("Compte Bancaire", "compteBancaireId", comptesBancaires, true)}
                      
                      {/* Affichage du solde pour information */}
                      {typeMouvement === "CREDIT" && watch("compteBancaireId") && (
                        <div className={`p-3 rounded-lg ${soldeBancaire < (watch("montant") || 0) ? 'bg-red-100 border-red-300' : 'bg-green-100 border-green-300'} border`}>
                          <p className="text-sm font-semibold">
                            Solde disponible: {soldeBancaire.toLocaleString("fr-FR")} FCFA
                          </p>
                          {soldeBancaire < (watch("montant") || 0) && (
                            <p className="text-xs text-red-600 mt-1">
                              ⚠️ Solde insuffisant pour ce décaissement !
                            </p>
                          )}
                          {soldeBancaire >= (watch("montant") || 0) && watch("montant") > 0 && (
                            <p className="text-xs text-green-600 mt-1">
                              ✓ Solde suffisant pour ce décaissement
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* Mode Paiement */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                      Mode Paiement
                    </label>
                    <select
                      {...register("modepaiement")}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="">-- Choisir --</option>
                      <option value="CHEQUE">Chèque</option>
                      <option value="VIREMENT">Virement</option>
                      <option value="ESPECE">Espèce</option>
                    </select>
                  </div>

                  {/* Numéro Chèque (conditionnel) */}
                  {(modePaiement === "CHEQUE" || modePaiement === "VIREMENT") && (
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                        Numéro Chèque / Virement
                      </label>
                      <input
                        {...register("numroCheque")}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  )}

                  {/* Pour CREDIT - afficher les champs spécifiques */}
                  {typeMouvement === "CREDIT" && (
                    <>
                      {renderSelect("Liquidation", "liquidationId", Liquidations)}
                      {renderSelect("Plan Activité", "idPlanFondActivite", previsions)} 
                      {renderSelect("Classe", "classeId", classes)}
                      {renderSelect("Bailleur", "sourceFinacementId", bailleurs)}
                    </>
                  )}

                  {/* Objet */}
                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                      Objet
                    </label>
                    <textarea
                      rows={3}
                      {...register("objet")}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* Submit */}
                  <div className="md:col-span-3 flex justify-end mt-4">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold shadow"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              </div>

              {/* Liste des liquidations */}
              {showLiquidationList && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                  <div className="bg-white w-[95%] max-w-7xl rounded-xl shadow-xl">
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-4 border-b">
                      <h3 className="text-lg font-semibold text-gray-800">
                        📄 Liste des Liquidations
                      </h3>
                      <button
                        onClick={() => setShowLiquidationList(false)}
                        className="text-gray-500 hover:text-red-600 text-xl font-bold"
                      >
                        ×
                      </button>
                    </div>

                    {/* Filtres */}
                    <div className="p-6 border-b grid grid-cols-1 md:grid-cols-5 gap-4">
                      <select
                        className="border border-gray-300 rounded px-3 py-2"
                        onChange={(e) => {
                          getPlanfondByExercice(e);
                          handleChangeExercice(e);
                        }}
                      >
                        <option value="">Exercice</option>
                        {
                          exercices.map((element: any) => (
                            <option value={element.id}>{element.libelle}</option>
                          ))
                        }
                      </select>

                      <select
                        className="border border-gray-300 rounded px-3 py-2"
                        onChange={(e) => { getCategorieByProjet(e.target.value) }}
                      >
                        <option value="">Projet</option>
                        {
                          planfondprojets.map((element: any) => (
                            <option value={element.projet.id}>{element.projet.libelle}</option>
                          ))
                        }
                      </select>

                      <select
                        className="border border-gray-300 rounded px-3 py-2"
                        onChange={(e) => { getLiquidationByCategorie(e.target.value) }}
                      >
                        <option value="">Catégorie</option>
                        {
                          categorie.map((element: any) => (
                            <option value={element.id}>{element.libelle}</option>
                          ))
                        }
                      </select>

                      <input
                        type="date"
                        className="border border-gray-300 rounded px-3 py-2"
                        value={debut}
                        onChange={(e) => { setDebut(e.target.value); setFin("") }}
                      />

                      <input
                        type="date"
                        value={fin}
                        className="border border-gray-300 rounded px-3 py-2"
                        onChange={(e) => { getByDate(e.target.value); }}
                      />
                    </div>

                    {/* Body */}
                    <div className="p-6 max-h-[60vh] overflow-y-auto">
                      <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100 text-gray-600 sticky top-0">
                            <tr>
                              <th className="px-4 py-3 text-left">N° Bon</th>
                              <th className="px-4 py-3 text-left">Date Engagé</th>
                              <th className="px-4 py-3 text-left">Ligne budgetaire</th>
                              <th className="px-4 py-3 text-right">Montant</th>
                              <th className="px-4 py-3 text-left">Devise</th>
                              <th className="px-4 py-3 text-center">Statut</th>
                              <th className="px-4 py-3 text-center">Date statut</th>
                              <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                          </thead>

                          <tbody>
                            {Liquidations.map((eng) => (
                              <tr key={eng.id} className="border-t hover:bg-gray-50 transition">
                                <td className="px-4 py-2">{eng.bonEngagment}</td>
                                <td className="px-4 py-2">{toDateNormal(eng.dataEnAttente)}</td>
                                <td className="px-4 py-2">
                                  {eng.planActivite?.activite.code}-
                                  {eng.planActivite?.activite.libelle}
                                </td>
                                <td className="px-4 py-2 text-right font-medium">
                                  {eng.montant.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-4 py-2">{eng.devise?.symbole}</td>
                                <td className="px-4 py-2 text-center">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${eng.rejet
                                        ? "bg-red-100 text-red-700"
                                        : eng.retourner
                                          ? "bg-violet-100 text-violet-700"
                                          : eng.reception
                                            ? "bg-blue-100 text-blue-700"
                                            : eng.validation
                                              ? "bg-green-100 text-green-700"
                                              : "bg-yellow-100 text-yellow-700"
                                      }`}
                                  >
                                    {eng.rejet
                                      ? "Rejeté"
                                      : eng.retourner
                                        ? "Retourné"
                                        : eng.reception
                                          ? "Réceptionné"
                                          : eng.validation
                                            ? "Validé"
                                            : "En attente"}
                                  </span>
                                </td>
                                <td className="px-4 py-2">
                                  {toDateNormal(
                                    eng.rejet
                                      ? eng.dataRejet
                                      : eng.retourner
                                        ? eng.dataRetourner
                                        : eng.reception
                                          ? eng.dataReception
                                          : eng.validation
                                            ? eng.dataValidation
                                            : eng.dataEnAttente
                                  )}
                                </td>
                                <td className="px-4 py-2 text-center space-x-2">
                                  <button
                                    onClick={() => hendleUpdata(eng)}
                                    className="flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                                  >
                                    Payer
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50 rounded-b-xl">
                      <button
                        className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
                        disabled={page === 0}
                        onClick={paginationPreview}
                      >
                        Prev
                      </button>
                      <span>
                        Page {page + 1} / {totalPages}
                      </span>
                      <button
                        className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
                        onClick={paginationNext}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </>
  );
};

export default renderTresorieJournalPage;