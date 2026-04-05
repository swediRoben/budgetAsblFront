import React, { useEffect, useState } from 'react';

import { getAllFonctionnaire } from "../../data/utilisateur/fonctionnaire";
import { receptionLiquidation, rejeterLiquidation, getCountEngage, retournerLiquidation, validerLiquidation, getAllValiderLiqidation, getAllReceptionner, getAllRejeter, getAllRetourne, getAllEnAttente, getSommeMontantLiquide, getLiquidationvaliderByIdExercice, getLiquidationretournerByIdExercice, getLiquidationrejeterByIdExercice, getLiquidationreceptionerByIdExercice } from "../../data/execution/liquidation";
import { getAllEngagementValiderLiquider } from "../../data/execution/engagement";
import { getAllCategorie } from "../../data/classification/categorie";
import { getAllPlanfontprojet } from "../../data/classification/planfontprojet";
import { getAllExercice } from "../../data/classification/exercice";
import { getAllPrevision } from "../../data/classification/prevision";
import { getAllDevise } from "../../data/classification/devise";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { X } from 'lucide-react';

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
  const [engagementid, setEngagementid] = useState(null);
  const [previsions, setPrevisions] = useState([]);
  const [montantEngage, setMontantEngage] = useState(0.0);
  const [montantLiquide, setMontantLiquide] = useState(0);
  const [bonEngagment, setBonEngagment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [buttonName, setButtonName] = useState("");
  const [tauxdeviseengagement, setTauxdeviseengagement] = useState(0);
  const [devise, setDevise] = useState(null);
  const [debut, setDebut] = useState("");
  const [fin, setFin] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const [showaction, setShowaction] = useState(true);
  const [idData, setIdData] = useState(null);
  const [count, setCount] = useState({
    enAttente: 0,
    reception: 0,
    valider: 0,
    rejet: 0,
    retourner: 0
  });


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
    const data = await getAllEngagementValiderLiquider(exercice, projet, ligne);
    setEngagements(data)
  }

  const dataMontant = async (data: any) => {
    const montantLiquide = await getSommeMontantLiquide(exerciceId, data.id);
    setMontantEngage(data.montant)
    setTauxdeviseengagement(data.tauxDevise)
    setMontantLiquide(montantLiquide);
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
  }

  const getCategoriesByProjet = async (e: any) => {
    setCategorie([])
    const data = await getAllCategorie(e);
    setProjetId(e);
    setCategorie(data);
    loadCounts(exerciceId, e);
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
      loadCounts(exerciceId, e)
      const data = await getAllPrevision(exerciceId, e, null);
      setPrevisions(data)
    }
  }
  const getLignes = async (idProjet: number) => {
    const data = await getAllPrevision(exerciceId, idProjet, null);
    setPrevisions(data)
  }
  const handleAffichePrevisionData = (data: any) => {
    setCategorie(data.categorie);
    setBeneficiaire(data.beneficiaire)
    setBailleurs(data.source)
    dataEngagement(exerciceId, data.idProjet, data.id);
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



  useEffect(() => {
    const id = watch("idPlanFondActivite");
    if (id && previsions.length > 0) {
      const selected = previsions.find((p: any) => p.id.toString() === id);
      if (selected) handleAffichePrevisionData(selected);
    }
  }, [previsions, watch("idPlanFondActivite")]);

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


  useEffect(() => {
    if (engagementid && engagements.length > 0) {
      setValue("idEngagement", engagementid);
    }
  }, [engagements, engagementid]);

  const hendleUpdata = async (data: any) => {
    setIdData(data.id);
    await getLignes(data.idProjet);

    const id = data.idPlanFondActivite?.toString();
    const idEnga = data.idEngagement?.toString();

    reset({
      ...data,
      dataEnAttente: formatDate(data.dataEnAttente),
      idPlanFondActivite: id,
      idEngagement: idEnga
    });

    // 🔥 chercher la ligne sélectionnée et déclencher l'affichage
    const selected = previsions.find((p: any) => p.id.toString() === id);
    if (selected) handleAffichePrevisionData(selected);

    setShowLiquidationList(false);
  };



  useEffect(() => {
    const hasAction = Liquidations.some(
      (liq: any) => liq.reception || liq.enAttente
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



  const hendleReception = async (data: any) => {
    try {
      setEngagements([])
      receptionLiquidation(data.id)
      getCategorieByProjet(data.idProjet)
      toast.success("Engagement réceptionnéé");
    } catch (error) {
      toast.error("Echec de l'operation");
    }
  }

  const hendleAction = async (statut: string) => {
    try {

      if (idData && statut === "VALIDEE") {
        validerLiquidation(idData)
        toast.success("Engagement validée avec succes!");
        reset({
          id: null,
          idExercice: null,
          idProjet: null,
          idPlanFondActivite: null,
          idResponsable: null,
          idDevise: null,
          tauxDevise: 0,
          montant: 0,
          objet: "",
          enAttente: true,
          dataEnAttente: null,
          observation: "",
        })
      } else {
        toast.success("Operation échoué !");
      }

    } catch (error) {
      toast.success("Operation échoué !");
    }
  };

  const {
    register: registerReject,
    handleSubmit: handleSubmitRejetReturn,
    reset: resetRejet,
    formState: { errors: errorsReject },
  } = useForm({
    defaultValues: { id: null, observation: null }
  });

  const onSubmitRejet = async (data: any) => {
    try {
      if (idData && buttonName === "Retourner") {
        retournerLiquidation(idData, data)
        toast.success("Engagement rejetée avec succes!");
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
        });
        closeModal();
      } else if (idData && buttonName === "Rejeter") {
        rejeterLiquidation(idData, data)
        toast.success("Engagement rejetée avec succes!");
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
        closeModal();
      } else {
        toast.success("Operation échoué !");
      }

    } catch (error) {
      toast.success("Operation échoué !");
    }
  };

  const onSubmit = async (data: any) => {
    return data;
  }

  const openModal = (bouton: string) => {
    setButtonName(bouton);
    setShowModal(true);
  };

  const closeModal = () => {
    resetRejet({ id: null, observation: null })
    setShowModal(false);
  };
  const renderModalForm = () => {
    return (
      <form
        onSubmit={handleSubmitRejetReturn(onSubmitRejet)}
        className="w-full"
      >

        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 overflow-hidden">
          {/* BODY */}
          <div className="p-6 space-y-6">
            {/* INPUTS GRID */}
            <div >

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  observation/ motif <span className="text-red-500">*</span>
                </label>

                <textarea
                  {...registerReject("observation", { required: "Observation obligatoire" })}
                  placeholder="Ex: observation"
                  className={`w-full bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition
              focus:ring-4 focus:ring-blue-100 focus:border-blue-500
              ${errorsReject.observation ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-gray-200"}
            `}
                ></textarea>

                {errorsReject.observation && (
                  <p className="mt-2 text-xs text-red-600 font-medium">
                    {errorsReject.observation.message}
                  </p>
                )}
              </div>


            </div>

            {/* FOOTER BUTTONS */}
            <div className="px-6 py-4 border-t border-gray-100 bg-white flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Annuler
              </button>

              <button
                type="submit"
                className="inline-flex items-center rounded-md border border-red-500
               px-6 py-2 text-sm font-medium text-red-600
               hover:bg-red-50 transition" >
                {buttonName}
              </button>
            </div>
          </div>
        </div>
      </form>

    );

  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      {/* Header */}
      <div className="mb-8 border-b pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Traitement des liquidations des engagements
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
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
            {...register("id")}
            disabled={true}
          />

          {/* Exercice */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exercice budgétaire
            </label>
            <select
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
              {...register("idExercice")}
              disabled={true}
            >
              <option value="">Sélectionner</option>
              {exercices.map((element: any) => (
                <option key={element.id} value={element.id}>{element.libelle}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date d’Liquidation
            </label>
            <input
              type="date"
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
              {...register("dataEnAttente")}
              disabled={true}
            />
          </div>

          {/* Projet */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Projet
            </label>
            <select
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
              {...register("idProjet")}
              disabled={true}
            >
              <option value="">Sélectionner un projet</option>
              {planfondprojets.map((element: any) => (
                <option key={element.projet.id} value={element.projet.id}>
                  {element.projet.libelle}
                </option>
              ))}
            </select>
          </div>

          {/* Ligne budgétaire */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ligne budgétaire
            </label>
            <select
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
              {...register("idPlanFondActivite")}
              disabled={true}
            >
              <option value="">Sélectionner une ligne</option>
              {previsions?.map((element: any) => (
                <option key={element.id} value={element.id}>
                  {element.activite.libelle}
                </option>
              ))}
            </select>
          </div>

          {/* Categorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categorie
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
              value={categorie.libelle}
              readOnly
            />
          </div>

          {/* Bailleur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bailleur
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
              value={bailleurs.libelle}
              readOnly
            />
          </div>

          {/* Bénéficiaire */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bénéficiaire
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
              value={beneficiaire.libelle}
              readOnly
            />
          </div>

          {/* Responsable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsable
            </label>
            <select
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
              {...register("idResponsable")}
              disabled={true}
            >
              <option value="">Sélectionner</option>
              {fonctionnaires.map((element: any) => (
                <option key={element.id} value={element.id}>
                  {element.nom} {element.prenom}
                </option>
              ))}
            </select>
          </div>

          {/* Engagement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Engagement
            </label>
            <select
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
              {...register("idEngagement")}
              disabled={true}
            >
              <option value="">Sélectionner</option>
              {engagements.map((element: any) => (
                <option key={element.id} value={element.id}>{element.bonEngagement}</option>
              ))}
            </select>
          </div>

          {/* Devise */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Devise
            </label>
            <select
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
              {...register("idDevise")}
              disabled={true}
            >
              <option value="">Sélectionner</option>
              {devises?.map((element: any) => (
                <option key={element.id} value={element.id}>{element.libelle}</option>
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
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
              {...register("montant")}
              disabled={true}
            />
          </div>

          {/* Taux */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Taux devise
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
              {...register("tauxDevise")}
              disabled={true}
            />
          </div>

          {/* Pièces justificatives */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pièces justificative
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
              {...register("piece")}
              disabled={true}
            />
          </div>
        </div>

        {/* Bloc récapitulatif visuel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border rounded-lg bg-gray-50 p-6 shadow-sm">
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

          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500 uppercase">Montant liquidé</p>
            <p className="text-lg font-semibold text-blue-700">
              {montantLiquide.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500 uppercase">Montant restant</p>
            <p className="text-lg font-semibold text-green-700">
              {montantRestantFonction(
                montantEngage > montantLiquide
                  ? montantEngage - ((Number(watch("montant") || 0) || 1)) + montantLiquide
                  : montantLiquide - montantEngage
              ).toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Objet */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Objet de l’Liquidation
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
            {...register("objet")}
            disabled={true}
          />
        </div>

        {/* Observations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observations
          </label>
          <textarea
            rows={3}
            className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
            {...register("observation")}
            disabled={true}
          />
        </div>

      </form>

      <div className="flex justify-end gap-4 mt-6 border-t pt-4">
        {/* Retourner */}
        <button
          onClick={() => openModal("Retourner")}
          type="button"
          className="inline-flex items-center rounded-md border border-orange-500
               px-6 py-2 text-sm font-medium text-orange-600
               hover:bg-orange-50 transition"
        >
          Retourner
        </button>

        {/* Rejeter */}
        <button

          onClick={() => openModal("Rejeter")}
          type="button"
          className="inline-flex items-center rounded-md border border-red-500
               px-6 py-2 text-sm font-medium text-red-600
               hover:bg-red-50 transition"
        >
          Rejeter
        </button>
        {/* Valider */}
        <button
          onClick={() => hendleAction("VALIDEE")}
          type="button"
          className="inline-flex items-center rounded-md bg-green-600
               px-6 py-2 text-sm font-medium text-white
               shadow hover:bg-green-700 transition"
        >
          Valider
        </button>
      </div>


      {/* Liste */}
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
                        {(eng.reception || eng.enAttente) && (
                          <td className="px-4 py-2 text-center space-x-2">
                            <button
                              onClick={() => {
                                if (!eng.reception) {
                                  hendleReception(eng);
                                }
                              }}
                              className="px-3 py-1 text-xs rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
                              disabled={eng.reception}
                            >
                              {eng.reception ? "Déjà réceptionné" : "Réceptionner"}
                            </button>

                            <button
                              onClick={() => hendleUpdata(eng)}
                              className="px-3 py-1 text-xs rounded-md bg-green-50 text-green-600 hover:bg-green-100"
                            >
                              Voir
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              {/* HEADER */}
              <div className="px-6 py-4  bg-gradient-to-r from-blue-50 to-white">
                <p className="text-sm text-red-500 mt-1">
                  Voulez-vous vraiment faire cette action ?
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {renderModalForm()}

          </div>
        </div>
      )}
    </div>

  );
}