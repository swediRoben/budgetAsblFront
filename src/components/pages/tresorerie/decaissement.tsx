
import { getAllFonctionnaire } from "../../../data/utilisateur/fonctionnaire";
import { getAllValiderLiqidation } from "../../../data/execution/liquidation";
import { getAllEngagementValiderLiquider } from "../../../data/execution/engagement";
import { getAllCategorie } from "../../../data/classification/categorie";
import { getAllPlanfontprojet } from "../../../data/classification/planfontprojet";
import { getAllExercice } from "../../../data/classification/exercice";
import { getAllPrevision } from "../../../data/classification/prevision";
import { getAllDevise } from "../../../data/classification/devise";

import { getAllBanque } from "../../../data/tresorerie/banques";
import { getAllPlancompte, getPlancompteById } from "../../../data/classification/planComptable";
import { getAllComptebancaire } from "../../../data/tresorerie/comptebancaire";
import { createJournal, deleteJournal, getAllJournal, updateJournal } from "../../../data/tresorerie/journal";
import { getAllBailleur } from "../../../data/classification/bailleur";

import { useForm } from "react-hook-form";

import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export default function JournalTresorerieForm() {
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
    const [budget, setBudget] = useState(false)
    const [debut, setDebut] = useState("");
    const [fin, setFin] = useState("");
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [status, setStatus] = useState("");
    const [showaction, setShowaction] = useState(true);
    const [idData, setIdData] = useState(null);


    const [banques, setBanques] = useState([]);
    const [plansComptables, setPlansComptables] = useState([]);
    const [classes, setClasses] = useState([]);
    const [comptesBancaires, setComptesBancaires] = useState([]);

    const dataComptebancaire = async (banque: number) => {
        const data = await getAllComptebancaire(banque, null, null);
        setComptesBancaires(data)
    }

    const dataBanque = async () => {
        const data = await getAllBanque();
        setBanques(data)
    }
    const dataPlancompte = async () => {
        const data = await getAllPlancompte();
        setPlansComptables(data)
    }

    const dataBailleur = async () => {
        const data = await getAllBailleur();
        setBailleurs(data)
    }

    const getCompteBancaireByBanque = (idBanque: number) => {
        dataComptebancaire(idBanque)
    }

    const getClasseByCompteComptable = async (idCompte: number) => {
        const data = await getPlancompteById(idCompte);
        setClasses(data?.classe);
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

    const dataEngagement = async (exercice: any, projet: any, ligne: any) => {
        const data = await getAllEngagementValiderLiquider(exercice, projet, ligne);
        setEngagements(data)
    }


    const dataFonctionnaires = async () => {
        const data = await getAllFonctionnaire();
        setFonctionnaires(data)
    }

    useEffect(() => {
        dataPlancompte();
        dataBanque();
        dataExercice();
        dataBailleur();
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
        setProjetId(e)
        setCategorie(data)
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


    const getPrevisionParProjet = async (e: any) => {
        const value = e;
        if (value !== "") {
            setProjetId(e)
            const data = await getAllPrevision(exerciceId, e, null);
            setPrevisions(data)
        }
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


    const toOffsetDateTimeStart = (dateStr: string) => {
        return dateStr ? `${dateStr}T00:00:00Z` : null;
    };

    const toDateNormal = (dates: string) => {
        const dateString = dates;
        const date = new Date(dateString);
        const formatted = date.toLocaleString()
        return formatted;
    }


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
        setPlansComptables([]);
        setClasses([]);
    }
    const hendleUpdata = async (data: any) => {
        closeAll();
        setLiquidations(prev => [...prev, data]);
        setBailleurs(prev => [...prev, data.planActivite.source]);
        setDevises(prev => [...prev, data?.devise]);
        setPrevisions(prev => [...prev, data.planActivite]);
        setPlansComptables(prev => [...prev, data.planActivite.planComptable]);
        setClasses(prev => [...prev, data.planActivite.planComptable.classe]);
        setShowLiquidationList(false);
        setBudget(true)
    };

    useEffect(() => {
        if (budget && Liquidations.length > 0) {
            console.log(Liquidations)
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
            setValue("planComptableId", Liquidations[0].planActivite?.planComptable?.id);
            setValue("objet", Liquidations[0].objet);
        }

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
        setBudget(false)
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
                //  reset({
                //    id: null,
                //    idExercice: null,
                //    idProjet: null,
                //    idPlanFondActivite: null,
                //    idResponsable: null,
                //    idDevise: null,
                //    tauxDevise: 0,
                //    montant: 0,
                //    objet: "",
                //    enAttente: true,
                //    dataEnAttente: null,
                //    observation: "",
                //  })
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
        setShowModal(false);
    };

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            reference: "",
            idExercice: "",
            typemouvement: "",
            taux: "",
            montant: "",
            objet: "",
            date: "",
            projetId: "",
            categorieId: "",
            banqueId: "",
            planComptableId: "",
            classeId: "",
            deviseId: "",
            compteBancaireId: "",
            liquidationId: "",
            idPlanFondActivite: "",
            sourceFinacementId: "",
            modepaiement: "",
            numroCheque: "",
        },
    });



    const modePaiement = watch("modepaiement");
    const typeMouvement = watch("typemouvement"); // 👈 on surveille le type

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
                        {o?.libelle}
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

    return (


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
                            <option value="CREDIT">Crédit</option>
                            <option value="DEBIT">Débit</option>
                        </select>
                    </div>

                    {/* Type liquidation */}
                    {typeMouvement === "CREDIT" && (
                        <>
                            <div className="flex justify-start mb-4">
                                <button
                                    onClick={() => openList('VALIDE')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-colors duration-200"
                                >Liste des liquidations </button>
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
                            {...register("montant", { required: "Montant requis" })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
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


                    {/* Sélects fixes */}
                    {renderSelect("Devise", "deviseId", devises)}

                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                            Banque
                        </label>
                        <select
                            {...register("banqueId", { required: "Banque requis" })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") return; // on ignore le choix vide
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

                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                            Plan Comptable
                        </label>
                        <select
                            {...register("planComptableId", { required: "compte comptable requis" })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") return;
                                getClasseByCompteComptable(Number(value))
                            }
                            }

                        >
                            <option value="">-- Choisir --</option>
                            {
                                plansComptables?.map((data) => (
                                    <option key={data.id} value={data.id}>
                                        {data.numero}-{data.libelle}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

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
                    {renderSelect("Classe", "classeId", classes)}
                    {renderSelect("Compte Bancaire", "compteBancaireId", comptesBancaires)}
                    {renderSelect("Bailleur", "sourceFinacementId", bailleurs)}

                    {/* Champs à cacher si DEBIT */}
                    {typeMouvement === "CREDIT" && (
                        <>
                            {renderSelect("Liquidation", "liquidationId", Liquidations)}
                            {renderSelect("Plan Activité", "idPlanFondActivite", previsions)}
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
    );
}