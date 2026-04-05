import React, { useEffect, useState } from 'react';

import { getAllFonctionnaire } from "../../data/utilisateur/fonctionnaire";
import { createLiquidation, deleteLiquidation, getCountEngage, updateLiquidation, getAllValiderLiqidation, getAllReceptionner, getAllRejeter, getAllRetourne, getAllEnAttente, getSommeMontantLiquide, getLiquidationvaliderByIdExercice, getLiquidationretournerByIdExercice, getLiquidationrejeterByIdExercice, getLiquidationreceptionerByIdExercice } from "../../data/execution/liquidation";
import { getAllEngagementValiderLiquider } from "../../data/execution/engagement";
import { getAllCategorie, getAllCategorieByProgramme } from "../../data/classification/categorie";
import { getAllPlanfontprojet } from "../../data/classification/planfontprojet";
import { getAllExercice } from "../../data/classification/exercice";
import { getAllPrevision } from "../../data/classification/prevision";
import { getAllDevise } from "../../data/classification/devise";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function renderLiquidationPage() {
  const [Liquidations, setLiquidations] = useState([]);
  const [engagements, setEngagements] = useState([]);
  const [beneficiaire, setBeneficiaire] = useState([]);
  const [categorie, setCategorie] = useState([]);
  const [planfondprojets, setPlanfontprojets] = useState([]);
  const [exerciceId, setExerciceId] = useState();
  const [projetId, setProjetId] = useState();
  const [categorieId, setCategorieId] = useState();
  const [bailleurs, setBailleurs] = useState([]);
  const [exercices, setExercices] = useState([]);
  const [fonctionnaires, setFonctionnaires] = useState([]);
  const [devises, setDevises] = useState([]);
  const [previsions, setPrevisions] = useState([]);
  const [montantEngage, setMontantEngage] = useState(0.0);
  const [montantLiquide, setMontantLiquide] = useState(0);
  const [montantRestants, setMontantRestants] = useState(0);
  const [bonEngagment, setBonEngagment] = useState("");
  const [tauxdeviseengagement, setTauxdeviseengagement] = useState(0);
  const [devise, setDevise] = useState(null);
  const [engagementid, setEngagementid] = useState(null);
  const [debut, setDebut] = useState("");
    const [count, setCount] = useState({
      enAttente:0,
      reception:0,
      valider:0,
      rejet:0,
      retourner:0
    });
    

  const [fin, setFin] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const [showaction, setShowaction] = useState(true);
  const [selectedPrevisionId, setSelectedPrevisionId] = useState(null);

  const [showLiquidationList, setShowLiquidationList] = useState(false);
  
   const loadCounts = async (exercice: any, projet: any) => {
      const enAttente = await getCountEngage(exercice, projet, true, false, false, false, false);
      const reception = await getCountEngage(exercice, projet, false, true, false, false, false);
      const valider = await getCountEngage(exercice, projet, false, false, true, false, false);
      const rejet = await getCountEngage(exercice, projet, false, false, false, true, false);
      const retourner = await getCountEngage(exercice, projet, false, false, false, false, true);
  
      setCount({
        enAttente,
        reception,
        valider,
        rejet,
        retourner
      });
    };

  const dataExercice = async () => {
    const data = await getAllExercice();
    setExercices(data.filter(ex => ex.execution));
  };

  const dataDevise = async () => {
    const data = await getAllDevise();
    setDevises(data)
  }

  const dataEngagement = async (exercice: any, projet: any, ligne: any) => {
    if (exercice && projet && ligne) {
      const data = await getAllEngagementValiderLiquider(exercice, projet, ligne);
      setEngagements(data);
      // Réinitialiser la sélection d'engagement
      setValue("idEngagement", "");
      setBonEngagment("");
      setMontantEngage(0);
      setTauxdeviseengagement(0);
      setMontantLiquide(0);
      setDevise(null);
    } else {
      setEngagements([]);
    }
  }

  const dataMontant = async (data: any) => {
    const montantLiquides = await getSommeMontantLiquide(exerciceId, data.id);
    setMontantEngage(data.montant)
    setTauxdeviseengagement(data.tauxDevise)
    setMontantLiquide(montantLiquides);
    setDevise(data.devise.id);
  }

  useEffect(() => {
    if (devise) {
      setValue("idDevise", devise);
    }
  }, [devise]);

  const dataFonctionnaires = async () => {
    const data = await getAllFonctionnaire();
    setFonctionnaires(data)
  }

  useEffect(() => {
    dataExercice();
    dataDevise();
    dataFonctionnaires();
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
    setEngagements([]) // Réinitialiser les engagements
  }

  const getCategoriesByProjet = async (e: any) => {
    setCategorie([])
    const data = await getAllCategorie(e);
    setProjetId(e);
    loadCounts(exerciceId,e);
    setCategorie(data);
  }

  const getCategorieByProjet = async (e) => {
    getCategoriesByProjet(e);
    setProjetId(e)
    setLiquidations([]);
    setCategorieId(null);
    setDebut("");
    setFin("");
    if (status === 'RECEPTIONNE') {
      const data = await getAllReceptionner(exerciceId, e);
      setLiquidations(data);
    } else if (status === 'REJETE') {
      const data = await getAllRejeter(exerciceId, e);
      setLiquidations(data);
    } else if (status === 'RETOURNE') {
      const data = await getAllRetourne(exerciceId, e);
      setLiquidations(data);
    } else if (status === 'VALIDE') {
      const data = await getAllValiderLiqidation(exerciceId, e);
      setLiquidations(data);
    } else if (status === 'EN_ATTENTE') {
      const data = await getAllEnAttente(exerciceId, e);
      setLiquidations(data);
    }
  }

  const getLiquidationByCategorie = async (e) => {
    setLiquidations([]);
    setCategorieId(e)
    setDebut("");
    setFin("");
    if (status === 'RECEPTIONNE') {
      const data = await getAllReceptionner(exerciceId, projetId, e);
      setLiquidations(data);
    } else if (status === 'REJETE') {
      const data = await getAllRejeter(exerciceId, projetId, e);
      setLiquidations(data);
    } else if (status === 'RETOURNE') {
      const data = await getAllRetourne(exerciceId, projetId, e);
      setLiquidations(data);
    } else if (status === 'VALIDE') {
      const data = await getAllValiderLiqidation(exerciceId, projetId, e);
      setLiquidations(data);
    } else if (status === 'EN_ATTENTE') {
      const data = await getAllEnAttente(exerciceId, projetId, e);
      setLiquidations(data);
    }
  }

  const getByDate = async (e) => {
    setLiquidations([]);
    if (debut === "") {
      setFin("");
    } else {
      setFin(e)
      if (status === 'RECEPTIONNE') {
        const data = await getAllReceptionner(exerciceId, projetId, categorieId, toOffsetDateTimeStart(debut), toOffsetDateTimeStart(e));
        setLiquidations(data);
      } else if (status === 'REJETE') {
        const data = await getAllRejeter(exerciceId, projetId, categorieId, toOffsetDateTimeStart(debut), toOffsetDateTimeStart(e));
        setLiquidations(data);
      } else if (status === 'RETOURNE') {
        const data = await getAllRetourne(exerciceId, projetId, categorieId, toOffsetDateTimeStart(debut), toOffsetDateTimeStart(e));
        setLiquidations(data);
      } else if (status === 'VALIDE') {
        const data = await getAllValiderLiqidation(exerciceId, projetId, categorieId, toOffsetDateTimeStart(debut), toOffsetDateTimeStart(e));
        setLiquidations(data);
      } else if (status === 'EN_ATTENTE') {
        const data = await getAllEnAttente(exerciceId, projetId, categorieId, toOffsetDateTimeStart(debut), toOffsetDateTimeStart(e));
        setLiquidations(data);
      }
    }
  }

  const paginationPreview = async () => {
    if (page > 0) {
      setPage(page - 1);
      setTotalPages(totalPages - 1);
      if (status === 'RECEPTIONNE') {
        const data = await getAllReceptionner(exerciceId, projetId, categorieId, toOffsetDateTimeStart(debut), toOffsetDateTimeStart(fin), page, size);
        setLiquidations(data);
      } else if (status === 'REJETE') {
        const data = await getAllRejeter(exerciceId, projetId, categorieId, toOffsetDateTimeStart(debut), toOffsetDateTimeStart(fin), page, size);
        setLiquidations(data);
      } else if (status === 'RETOURNE') {
        const data = await getAllRetourne(exerciceId, projetId, categorieId, toOffsetDateTimeStart(debut), toOffsetDateTimeStart(fin), page, size);
        setLiquidations(data);
      } else if (status === 'VALIDE') {
        const data = await getAllValiderLiqidation(exerciceId, projetId, categorieId, toOffsetDateTimeStart(debut), toOffsetDateTimeStart(fin), page, size);
        setLiquidations(data);
      } else if (status === 'EN_ATTENTE') {
        const data = await getAllEnAttente(exerciceId, projetId, categorieId, toOffsetDateTimeStart(debut), toOffsetDateTimeStart(fin), page, size);
        setLiquidations(data);
      }
    }
  }

  const paginationNext = async () => {
    setPage(page + 1);
    setTotalPages(totalPages + 1);
    if (status === 'RECEPTIONNE') {
      const data = await getAllReceptionner(exerciceId, projetId, categorieId, toOffsetDateTimeStart(debut), toOffsetDateTimeStart(fin), page, size);
      setLiquidations(data);
    } else if (status === 'REJETE') {
      const data = await getAllRejeter(exerciceId, projetId, categorieId, toOffsetDateTimeStart(debut), toOffsetDateTimeStart(fin), page, size);
      setLiquidations(data);
    } else if (status === 'RETOURNE') {
      const data = await getAllRetourne(exerciceId, projetId, categorieId, toOffsetDateTimeStart(debut), toOffsetDateTimeStart(fin), page, size);
      setLiquidations(data);
    } else if (status === 'VALIDE') {
      const data = await getAllValiderLiqidation(exerciceId, projetId, categorieId, toOffsetDateTimeStart(debut), toOffsetDateTimeStart(fin), page, size);
      setLiquidations(data);
    } else if (status === 'EN_ATTENTE') {
      const data = await getAllEnAttente(exerciceId, projetId, categorieId, toOffsetDateTimeStart(debut), toOffsetDateTimeStart(fin), page, size);
      setLiquidations(data);
    }
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

  const getPrevisionParProjet = async (e: any) => {
    const value = e;
    if (value !== "") {
      setProjetId(e)
      const data = await getAllPrevision(exerciceId, e, null);
      setPrevisions(data)
      loadCounts(exerciceId, e);
      setEngagements([]) // Réinitialiser les engagements quand le projet change
      setValue("idEngagement", ""); // Réinitialiser la sélection d'engagement
      setSelectedPrevisionId(null);
    }
  }
  
  const getLignes = async (idProjet: number) => {
    const data = await getAllPrevision(exerciceId, idProjet, null);
    setPrevisions(data)
  }
  
  const handleAffichePrevisionData = async (data: any) => {
    setCategorie(data.categorie);
    setBeneficiaire(data.beneficiaire)
    setBailleurs(data.source)
    setSelectedPrevisionId(data.id);
    // Charger les engagements pour cette ligne budgétaire
    await dataEngagement(exerciceId, data.idProjet, data.id);
  }

  const handleAfficheEngagementData = (data: any) => {
    setBonEngagment(data.bonEngagement);
    dataMontant(data);
    return data;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      id: null,
      idExercice: null,
      idProjet: null,
      idEngagement: null,
      bonEngagment: null,
      idPlanFondActivite: null,
      idResponsable: null,
      idDevise: null,
      tauxDevise: 0,
      montant: 0,
      piece: "",
      objet: "",
      enAttente: true,
      dataEnAttente: null,
      observation: "",
    },
  });

  useEffect(() => {
    setValue("tauxDevise", 1);
  }, []);

  const montantRestantFonction = (montantEngages: any) => {
    return montantEngages;
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

  const onSubmit = async (data: any) => {
    try {
      console.log(data.idDevise) 
      if (!data.id) {
        const montantRestants = montantEngage - (((data.montant || 0) * (data.tauxDevise || 1)) + montantLiquide);
        setMontantRestants(montantRestants)
      } else {
        const montantRestants = montantEngage - montantLiquide;
         setMontantRestants(montantRestants)
      }

      if (montantRestants < 0) {
        toast.error("Impossible le montant restant est négatif")
      } else {
        data.bonEngagment = bonEngagment
        if (!data.id) {
          data.dataEnAttente = toOffsetDateTimeStart(data.dataEnAttente)
          await createLiquidation(data)
          toast.success("Liquidation enregistrée avec succès!");
          reset({
            id: null,
            idExercice: null,
            idProjet: null,
            idEngagement: null,
            bonEngagment: null,
            idPlanFondActivite: null,
            idResponsable: null,
            idDevise: null,
            tauxDevise: 0,
            montant: 0,
            piece: "",
            objet: "",
            enAttente: true,
            dataEnAttente: null,
            observation: "",
          })
          setMontantEngage(0);
          setTauxdeviseengagement(0);
          setDevise(null);
          setEngagements([]);
          setSelectedPrevisionId(null);
        } else {
          data.dataEnAttente = toOffsetDateTimeStart(data.dataEnAttente)
          await updateLiquidation(data, data.id)
          toast.success("Liquidation modifiée avec succès!");
          reset({
            id: null,
            idExercice: null,
            idProjet: null,
            idEngagement: null,
            bonEngagment: null,
            idPlanFondActivite: null,
            idResponsable: null,
            idDevise: null,
            tauxDevise: 0,
            montant: 0,
            piece: "",
            objet: "",
            enAttente: true,
            dataEnAttente: null,
            observation: "",
          })
          setMontantEngage(0);
          setTauxdeviseengagement(0);
          setDevise(null);
          setEngagements([]);
          setSelectedPrevisionId(null);
        }
      }
    } catch (error) {
      console.error("SAVE ERROR:", error);
      toast.error("Erreur lors de l'enregistrement !");
    }
  };

  // Effet pour charger les engagements quand la ligne budgétaire change
  useEffect(() => {
    const idPlanFondActivite = watch("idPlanFondActivite");
    if (idPlanFondActivite && idPlanFondActivite !== selectedPrevisionId) {
      const selected = previsions.find((p: any) => p.id.toString() === idPlanFondActivite);
      if (selected) {
        handleAffichePrevisionData(selected);
      }
    }
  }, [watch("idPlanFondActivite"), previsions]);

  useEffect(() => {
    const id = watch("idEngagement");
    if (id && engagements.length > 0) {
      const selected = engagements.find(
        (p: any) => p.id.toString() === id);
      if (selected) handleAfficheEngagementData(selected);
    }
    setEngagementid(id);
  });

  useEffect(() => {
    if (engagementid && engagements.length > 0) {
      setValue("idEngagement", engagementid);
    }
  }, [engagements, engagementid]);

  const hendleUpdata = async (data: any) => {
    await getLignes(data.idProjet);
    
    const id = data.idPlanFondActivite?.toString();
    const idEnga = data.idEngagement?.toString();

    reset({
      ...data,
      dataEnAttente: formatDate(data.dataEnAttente),
      idPlanFondActivite: id,
      idEngagement: idEnga
    });

    // Charger les engagements pour cette ligne
    if (id) {
      const selected = previsions.find((p: any) => p.id.toString() === id);
      if (selected) {
        await handleAffichePrevisionData(selected);
        setSelectedPrevisionId(selected.id);
      }
    }

    setShowLiquidationList(false);
  };

  const hendleDelete = async (data: any) => {
    try { 
      await deleteLiquidation(data.id)
      await getCategorieByProjet(data.idProjet)
      toast.success("Suppression avec succès");
    } catch (error) {
      toast.error("Échec de suppression");
    }
  }

  useEffect(() => {
    const hasAction = Liquidations.some(
      (liq: any) => liq.retourner || liq.enAttente
    );
    setShowaction(hasAction);
  }, [Liquidations]);

  const openList = (status: string) => {
    setLiquidations([]);
    setPlanfontprojets([]);
    setCategorie([]);
    setCategorieId(null);
    setProjetId(null);
    setDebut("");
    setFin("");
    setStatus(status);
    setShowLiquidationList(true);
  }

  const formatDate = (dateString: string) => {
    return dateString ? dateString.split("T")[0] : null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      {/* Header */}
      <div className="mb-8 border-b pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Liquidation de Dépense
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Saisie et consultation des Liquidations budgétaires
        </p>
        <p className="mt-3 text-sm font-medium flex flex-wrap gap-3">
          <span
            onClick={() => openList('VALIDE')}
            className="cursor-pointer select-none rounded-full
                     bg-green-50 px-4 py-1.5 text-green-700
                     border border-green-200
                     hover:bg-green-100 hover:shadow-sm transition"
          >
            Validé <strong>{count.valider}</strong>
          </span>

          <span
            onClick={() => openList('EN_ATTENTE')}
            className="cursor-pointer select-none rounded-full
                     bg-green-50 px-4 py-1.5 text-green-700
                     border border-green-200
                     hover:bg-green-100 hover:shadow-sm transition"
          >
            en attente <strong>{count.enAttente}</strong>
          </span>
          <span
            onClick={() => openList('RETOURNE')}
            className="cursor-pointer select-none rounded-full
                     bg-yellow-50 px-4 py-1.5 text-yellow-700
                     border border-yellow-200
                     hover:bg-yellow-100 hover:shadow-sm transition"
          >
            Retourné <strong>{count.retourner}</strong>
          </span>

          <span
            onClick={() => openList('REJETE')}
            className="cursor-pointer select-none rounded-full
                     bg-red-50 px-4 py-1.5 text-red-700
                     border border-red-200
                     hover:bg-red-100 hover:shadow-sm transition"
          >
            Rejeté <strong>{count.rejet}</strong>
          </span>
          <span
            onClick={() => openList('RECEPTIONNE')}
            className="cursor-pointer select-none rounded-full
                     bg-blue-50 px-4 py-1.5 text-blue-700
                     border border-blue-200
                     hover:bg-blue-100 hover:shadow-sm transition"
          >
            Réceptionné <strong>{count.reception}</strong>
          </span>
        </p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <input
            type="text"
            hidden
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                   focus:ring-2 focus:ring-blue-500"
            {...register("id")}
          />

          {/* Exercice */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exercice budgétaire
            </label>
            <select
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("idExercice", { required: "Exercice obligatoire" })}
              onChange={(e) => {
                getPlanfondByExercice(e);
                handleChangeExercice(e);
              }}
            >
              <option value="">Sélectionner</option>
              {
                exercices.map((element: any) => (
                  <option key={element.id} value={element.id}>{element.libelle}</option>
                ))
              }
            </select>

            {errors.idExercice && (
              <p className="text-red-600 text-xs mt-1">{errors.idExercice.message}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de Liquidation
            </label>
            <input
              type="date"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                   focus:ring-2 focus:ring-blue-500"
              {...register("dataEnAttente", { required: "Date obligatoire" })}
            />

            {errors.dataEnAttente && (
              <p className="text-red-600 text-xs mt-1">{errors.dataEnAttente.message}</p>
            )}
          </div>

          {/* Projet */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Projet
            </label>
            <select
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                   focus:ring-2 focus:ring-blue-500"
              {...register("idProjet", { required: "Projet obligatoire" })}
              onChange={(e) => { getPrevisionParProjet(e.target.value) }}
            >
              <option value="">Sélectionner un projet</option>
              {
                planfondprojets.map((element: any) => (
                  <option key={element.projet.id} value={element.projet.id}>{element.projet.libelle}</option>
                ))
              }
            </select>

            {errors.idProjet && (
              <p className="text-red-600 text-xs mt-1">{errors.idProjet.message}</p>
            )}
          </div>

          {/* Ligne budgétaire */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ligne budgétaire
            </label>
            <select
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                    focus:ring-2 focus:ring-blue-500"
              {...register("idPlanFondActivite", { required: "Ligne budgétaire obligatoire" })}
            >
              <option value="">Sélectionner une ligne</option>
              {previsions?.map((element: any) => (
                <option key={element.id} value={element.id}>
                  {element.activite?.libelle || "Sans libellé"}
                </option>
              ))}
            </select>

            {errors.idPlanFondActivite && (
              <p className="text-red-600 text-xs mt-1">{errors.idPlanFondActivite.message}</p>
            )}
          </div>

          {/* Categorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <input
              type="text"
              readOnly
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
              value={categorie?.libelle || ""}
            />
          </div>

          {/* bailleur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bailleur
            </label>
            <input
              type="text"
              readOnly
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
              value={bailleurs?.libelle || ""}
            />
          </div>
          
          {/* Bénéficiaire */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bénéficiaire
            </label>
            <input
              type="text"
              readOnly
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
              value={beneficiaire?.libelle || ""}
            />
          </div>

          {/* Responsable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsable
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                   focus:ring-2 focus:ring-blue-500"
              {...register("idResponsable")}
            >
              <option value="">Sélectionner</option>
              {
                fonctionnaires.map((element: any) => (
                  <option key={element.id} value={element.id}>{element.nom} {element.prenom}</option>
                ))
              }
            </select>
          </div>

          {/* engagement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Engagement
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                   focus:ring-2 focus:ring-blue-500"
              {...register("idEngagement")}
            >
              <option value="">Sélectionner un engagement</option>
              {
                engagements.map((element: any) => (
                  <option key={element.id} value={element.id}>{element.bonEngagement}</option>
                ))
              }
            </select>
            {engagements.length === 0 && selectedPrevisionId && (
              <p className="text-yellow-600 text-xs mt-1">Aucun engagement disponible pour cette ligne</p>
            )}
          </div>
          
          {/* Devise */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Devise
            </label>
            <select
              disabled
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                   focus:ring-2 focus:ring-blue-500"
              {...register("idDevise")}
            >
              <option value="">Sélectionner</option>
              {devises?.map((element: any) => (
                <option key={element.id} value={element.id}>
                  {element.libelle}
                </option>
              ))}
            </select>
          </div>

          {/* Montant */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Montant
            </label>
            <input
              type="number"
              step="any"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                   focus:ring-2 focus:ring-blue-500"
              {...register("montant", {
                required: "Montant obligatoire",
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Le montant ne peut pas être inférieur à 0",
                },
              })}
            />

            {errors.montant && (
              <p className="text-red-600 text-xs mt-1">{errors.montant.message}</p>
            )}
          </div>

          {/* Taux */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Taux devise
            </label>
            <input
              type="number" 
              step="0.0001"
              required
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                    focus:ring-2 focus:ring-blue-500"
              defaultValue={1}
              {...register("tauxDevise", {
                required: "Taux devise obligatoire",
                valueAsNumber: true
              })}
            />

            {errors.tauxDevise && (
              <p className="text-red-600 text-xs mt-1">{errors.tauxDevise.message}</p>
            )}
          </div>

          {/* piece */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pièces justificative
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                    focus:ring-2 focus:ring-blue-500"
              {...register("piece", {
                required: "Pièces justificative obligatoire"
              })}
            />

            {errors.piece && (
              <p className="text-red-600 text-xs mt-1">{errors.piece.message}</p>
            )}
          </div>
        </div>
        
        {/* Bloc récapitulatif visuel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border rounded-lg bg-gray-50 p-6 shadow-sm">
          {/* Montant engagé */}
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500 uppercase">Montant engagé</p>
            <p className="text-lg font-semibold text-gray-800">
              {montantEngage.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500 uppercase mt-2">Taux engagé</p>
            <p className="text-lg font-semibold text-gray-800">
              {tauxdeviseengagement.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Montant liquidé */}
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500 uppercase">Montant liquidé</p>
            <p className="text-lg font-semibold text-blue-700">
              {montantLiquide.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Montant restant */}
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500 uppercase">Montant restant</p>
            <p className="text-lg font-semibold text-green-700">
              {(montantEngage - montantLiquide).toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Objet */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Objet de la Liquidation
          </label>
          <input
            type="text"
            required
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                   focus:ring-2 focus:ring-blue-500"
            {...register("objet", { required: "Objet obligatoire" })}
          />

          {errors.objet && (
            <p className="text-red-600 text-xs mt-1">{errors.objet.message}</p>
          )}
        </div>

        {/* Observations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observations
          </label>
          <textarea
            readOnly
            disabled
            rows={3}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                 focus:ring-2 focus:ring-blue-500"
            {...register("observation")}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-green-600 px-6 py-2 text-sm
                 font-medium text-white hover:bg-green-700 transition"
          >
            Enregistrer
          </button>
        </div>
      </form>

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
                    <option key={element.id} value={element.id}>{element.libelle}</option>
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
                    <option key={element.projet.id} value={element.projet.id}>{element.projet.libelle}</option>
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
                    <option key={element.id} value={element.id}>{element.libelle}</option>
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
                      <th className="px-4 py-3 text-left">Ligne budgétaire</th>
                      <th className="px-4 py-3 text-right">Montant</th>
                      <th className="px-4 py-3 text-left">Devise</th>
                      <th className="px-4 py-3 text-center">Statut</th>
                      <th className="px-4 py-3 text-center">Date statut</th>
                      {
                        showaction ? (
                          <th className="px-4 py-3 text-center">Actions</th>
                        ) : null
                      }
                    </tr>
                  </thead>

                  <tbody>
                    {Liquidations.map((eng) => (
                      <tr key={eng.id} className="border-t hover:bg-gray-50 transition">
                        <td className="px-4 py-2">{eng.bonEngagment}</td>
                        <td className="px-4 py-2">{toDateNormal(eng.dataEnAttente)}</td>
                        <td className="px-4 py-2">
                          {eng.planActivite?.activite?.code}-
                          {eng.planActivite?.activite?.libelle}
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
                        {(eng.retourner || eng.enAttente) && (
                          <td className="px-4 py-2 text-center space-x-2">
                            <button
                              onClick={() => hendleUpdata(eng)}
                              className="px-3 py-1 text-xs rounded-md bg-green-50 text-green-600 hover:bg-green-100"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => hendleDelete(eng)}
                              className="px-3 py-1 text-xs rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
                            >
                              Supprimer
                            </button>
                          </td>
                        )}
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
                Précédent
              </button>
              <span>
                Page {page + 1} / {totalPages}
              </span>
              <button
                className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
                onClick={paginationNext}
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}