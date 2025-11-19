import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign,Settings2,BadgeDollarSign } from 'lucide-react';
import {createClasse,deleteClasse,getAllClasse,updateClasse} from "./data/classification/classes";
import {createPlancompte,deletePlancompte,getAllPlancompte,updatePlancompte} from "./data/classification/planComptable";
import {createProjet,deleteProjet,getAllProjet,updateProjet} from "./data/classification/projet";
import {createCategorie,deleteCategorie,getAllCategorie,updateCategorie,getAllCategorieByProgramme} from "./data/classification/categorie";
import {createActivite,deleteActivite,getAllActivite,updateActivite} from "./data/classification/activite";
import {createTypebailleur,deleteTypebailleur,getAllTypebailleur,updateTypebailleur} from "./data/classification/typebailleur";
import {createBailleur,deleteBailleur,getAllBailleur,updateBailleur} from "./data/classification/bailleur";
import {createBeneficiere,deleteBeneficiere,getAllBeneficiere,updateBeneficiere} from "./data/classification/beneficiere";
import {createExercice,deleteExercice,getAllExercice,updateExercice} from "./data/classification/exercice";
import {createDevise,deleteDevise,getAllDevise,updateDevise} from "./data/classification/devise";
import {createPlanfontprojet,deletePlanfontprojet,getAllPlanfontprojet,updatePlanfontprojet} from "./data/classification/planfontprojet";
import {createPlanfontnature,deletePlanfontnature,getAllPlanfontnature,updatePlanfontnature} from "./data/classification/planfontnature";
import {createPrevision,deletePrevision,getAllPrevision,updatePrevision} from "./data/classification/prevision";

import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast"; 

const BudgetApp = () => {

 const [classes, setClasses] = useState([]) 
  const [plancomptables, setPlancomptables] = useState([]);
  const [projets, setProjets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activites, setActivites] = useState([]);
  const [typebailleurs, setTypebailleurs] = useState([]);
  const [bailleurs, setBailleurs] = useState([]); 
  const [beneficieres, setBeneficieres] = useState([]);
  const [exercices, setExercices] = useState([]);
  const [devises, setDevises] = useState([]);
  const [planfondprojets, setPlanfontprojets] = useState([]);
  const [planfontNatures, setPlanfontNature] = useState([]);
  const [previsions, setPrevisions] = useState([]);

    const [data, setData] = useState([
      { projet: 1, categorie: 1, activite: 1, montant: 7000 },
      { projet: 1, categorie: 2, activite: 1, montant: 1000 },
      { projet: 1, categorie: 2, activite: 2, montant: 3300 },
      { projet: 2, categorie: 1, activite: 1, montant: 5500 },
      { projet: 2, categorie: 1, activite: 2, montant: 2000 },
    ]);
  
    // Grouper Projet → Catégorie → Activités
    const grouped = {};
    data.forEach((item) => {
      if (!grouped[item.projet]) grouped[item.projet] = {};
      if (!grouped[item.projet][item.categorie]) grouped[item.projet][item.categorie] = [];
      grouped[item.projet][item.categorie].push(item);
    });

  // GET
  const dataClasse =async ()=>{
    const data=await getAllClasse(); 
    setClasses(data) 
  } 

  const dataPlancompte =async ()=>{
    const data=await getAllPlancompte(); 
    setPlancomptables(data) 
  }
  
  const dataProjet =async ()=>{
    const data=await getAllProjet(); 
    setProjets(data) 
  }
  
  const dataCategorie =async ()=>{
    const data=await getAllCategorie(); 
    setCategories(data) 
  } 

 const getCategorieByPrograme=async (e)=>{
    const data=await getAllCategorieByProgramme(e); 
    setCategories(data) 
  } 

 const dataActivite =async ()=>{
    const data=await getAllActivite(); 
    setActivites(data) 
  } 

   const dataTypebailleur =async ()=>{
    const data=await getAllTypebailleur(); 
    setTypebailleurs(data)   
  } 
   const dataBailleur =async ()=>{
    const data=await getAllBailleur(); 
    setBailleurs(data) 
  } 
   const dataBenefiere =async ()=>{
    const data=await getAllBeneficiere(); 
    setBeneficieres(data) 
  } 
   const dataExercice =async ()=>{
    const data=await getAllExercice(); 
    setExercices(data)
  } 

  const dataDevise =async ()=>{
    const data=await getAllDevise(); 
    setDevises(data) 
  }

  const dataPlanfontprojet =async ()=>{
    const data=await getAllPlanfontprojet(); 
    setPlanfontprojets(data) 
  }

  const dataPlanfontNature =async ()=>{
    const data=await getAllPlanfontnature(); 
    setPlanfontNature(data) 
  }

  const dataPrevision =async ()=>{
    const data=await getAllPrevision(); 
    setPrevisions(data) 
  }

    useEffect(()=>{
     const f=dataPlanfontprojet() 
        console.log(f);
  },[])

  const getAllDataInTable=(type:string)=>{ 
    if(type==='classe'){
      dataClasse();
    }else if(type==='planComptable'){
      dataPlancompte();
    }else if(type==='projet'){
      dataProjet();
    }else if(type==='categorie'){
      dataCategorie();
    }else if(type==='activite'){
      dataActivite();
    }else if(type==='typeBailleur'){
      dataTypebailleur();
    }else if(type==='bailleur'){
      dataBailleur();
    }else if(type==='beneficiaire'){
      dataBenefiere();
    }else if(type==='exercice'){
      dataExercice();
    }else if(type==='devise'){
      dataDevise();
    }
  }

  // CREATED 
    const {
      register: registerClasse,
      handleSubmit: handleSubmitClasse,
      reset: resetClasse,
      formState: { errors: errorsClasse },
    } = useForm();

        const {
      register: registerPlancompte,
      handleSubmit: handleSubmitPlancompte,
      reset: resetPlancompte,
      formState: { errors: errorsPlancompte },
    } = useForm();

    const {
      register: registerProjet,
      handleSubmit: handleSubmitProjet,
      reset: resetProjet,
      formState: { errors: errorsProjet },
    } = useForm();

    const {
      register: registerCategorie,
      handleSubmit: handleSubmitCategorie,
      reset: resetCategorie,
      formState: { errors: errorsCategorie },
    } = useForm();

    const {
      register: registerActivite,
      handleSubmit: handleSubmitActivite,
      reset: resetActivite,
      formState: { errors: errorsActivite },
    } = useForm();

    const {
      register: registerTypebailleur,
      handleSubmit: handleSubmitTypebailleur,
      reset: resetTypebailleur,
      formState: { errors: errorsTypebailleur },
    } = useForm();

    const {
      register: registerBailleur,
      handleSubmit: handleSubmitBailleur,
      reset: resetBailleur,
      formState: { errors: errorsBailleur },
    } = useForm();

    
    const {
      register: registerBeneficiere,
      handleSubmit: handleSubmitBeneficiere,
      reset: resetBeneficiere,
      formState: { errors: errorsBeneficiere },
    } = useForm();
    
    const {
      register: registerExercice,
      handleSubmit: handleSubmitExercice,
      reset: resetExercice,
      formState: { errors: errorsExercice },
    } = useForm();

        
    const {
      register: registerDevise,
      handleSubmit: handleSubmitDevise,
      reset: resetDevise,
      formState: { errors: errorsDevise },
    } = useForm();

    const {
      register: registerPlanfontprojet,
      handleSubmit: handleSubmitPlanfontprojet,
      control,
      reset: resetPlanfontprojet,
      formState: { errors: errorsPlanfontprojet },
    } = useForm({
        defaultValues: {
          exercice: null,
          details: [
            {id: null, idProjet: null, idSource: null, montant: "",exercice:null }
          ]
        }
});

    const {
      register: registerPlanfontNature,
      handleSubmit: handleSubmitPlanfontNature,
      controlNature,
      reset: resetPlanfontNature,
      formState: { errors: errorsPlanfontNature },
    }  = useForm({
        defaultValues: {
          exercice: null,
          idProjet:null,
          details: [
            {id: null, categorie: null, idSource: null, montant: "",exercice:null }
          ]
        }
});

    const {
      register: registerPrevision,
      handleSubmit: handleSubmitPrevision,
      controlPrevision,
      reset: resetPrevision,
      formState: { errors: errorsPrevision },
    } = useForm({
        defaultValues: {
          exercice: null,
          idProjet: null,
          idCategorie: null,
          details: [
            {id: null,idActivite:null,idSource:null, idPlanComptable: null, idBeneficiaire: null,ligneBudgetaire:null,uniteMesure:null,quantite:null,prixUnitaire:null, montant: "",exercice:null }
          ]
        }
});

  const onSubmitClasse = async (data:any) => { 
          try { 
            if (!data.id) { 
              await createClasse(data);
            } else { 
              await updateClasse(data.id,data); 
            }
            toast.success("Operation effectuée avec succès !");
            resetClasse();
            dataClasse();
            closeModal();
          } catch (error:any) {
            toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
          }
      };

  const onSubmitPlancompte = async (data:any) => { 
          try { 
            if (!data.id) { 
              await createPlancompte(data);
            } else { 
              await updatePlancompte(data.id,data); 
            }
            toast.success("Operation effectuée avec succès !");
            resetPlancompte();
            dataPlancompte();
            closeModal();
          } catch (error:any) {
            toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
          }
      };

  const onSubmitProjet = async (data:any) => { 
          try { 
            if (!data.id) { 
              await createProjet(data);
            } else { 
              await updateProjet(data.id,data); 
            }
            toast.success("Operation effectuée avec succès !");
            resetProjet();
            dataProjet();
            closeModal();
          } catch (error:any) {
            toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
          }
      };

  const onSubmitCategorie = async (data:any) => { 
          try { 
            if (!data.id) { 
              await createCategorie(data);
            } else { 
              await updateCategorie(data.id,data); 
            }
            toast.success("Operation effectuée avec succès !");
            resetCategorie();
            dataCategorie();
            closeModal();
          } catch (error:any) {
            toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
          }
      };

  const onSubmitActivite = async (data:any) => { 
          try { 
            if (!data.id) { 
              await createActivite(data);
            } else { 
              await updateActivite(data.id,data); 
            }
            toast.success("Operation effectuée avec succès !");
            resetActivite();
            dataActivite();
            closeModal();
          } catch (error:any) {
            toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
          }
      };

  const onSubmitTypebailleur = async (data:any) => { 
          try { 
            if (!data.id) { 
              await createTypebailleur(data);
            } else { 
              await updateTypebailleur(data.id,data); 
            }
            toast.success("Operation effectuée avec succès !");
            resetTypebailleur();
            dataTypebailleur();
            closeModal();
          } catch (error:any) {
            toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
          }
      };

  const onSubmitBailleur = async (data:any) => { 
          try { 
            if (!data.id) { 
              await createBailleur(data);
            } else { 
              await updateBailleur(data.id,data); 
            }
            toast.success("Operation effectuée avec succès !");
            resetBailleur();
            dataBailleur();
            closeModal();
          } catch (error:any) {
            toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
          }
      };

  const onSubmitBeneficiere = async (data:any) => { 
          try { 
            if (!data.id) { 
              await createBeneficiere(data);
            } else { 
              await updateBeneficiere(data.id,data); 
            }
            toast.success("Operation effectuée avec succès !");
            resetBeneficiere();
            dataBenefiere();
            closeModal();
          } catch (error:any) {
            toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
          }
      };

  const onSubmitDevise = async (data:any) => { 
          try { 
            if (!data.id) { 
              await createDevise(data);
            } else { 
              await updateDevise(data.id,data); 
            }
            toast.success("Operation effectuée avec succès !");
            resetDevise();
            dataDevise();
            closeModal();
          } catch (error:any) {
            toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
          }
      };

  const onSubmitExercice = async (data:any) => { 
          try { 
            if (!data.id) { 
              await createExercice(data);
            } else { 
              await updateExercice(data.id,data); 
            }
            toast.success("Operation effectuée avec succès !");
            resetExercice();
            dataExercice();
            closeModal();
          } catch (error:any) {
            toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
          }
      };
  
  const onSubmitPlanfontprojet = async (data:any) => { 
          try { 
            const exercices=data.exercice;
            data.details.map(async element=>{
              element.id=parseInt(element.id);
              element.montant=element.montant; 
              element.idProjet=parseInt(element.idProjet);
              element.idSource=parseInt(element.idSource);
              element.idExercice=parseInt(exercices);  
             if (!element.id) { 
              await createPlanfontprojet(element);
            } else { 
              await updatePlanfontprojet(element.id,element); 
            }
            })
           
            toast.success("Operation effectuée avec succès !");
            resetPlanfontprojet();  
          } catch (error:any) {
            toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
          }
      };
  
//  function getResetPlanFonProjet(){ 
//     resetPlanfontprojet({
//       exercice: 10065,
//       details: [
//             {id: null, idProjet: 10038, idSource: null, montant: "",exercice:null }
//           ]
//         });
//   }     
 
  const onSubmitPlanfontnature = async (data:any) => { 
       try { 
      const exercices=data.exercice;
      const idProjet=data.idProjet;
            data.details.map(async element=>{
              element.id=parseInt(element.id);
              element.montant=element.montant; 
              element.categorie=parseInt(element.categorie); 
              element.idProjet=parseInt(idProjet);
              element.idSource=parseInt(element.idSource);
              element.idExercice=parseInt(exercices);  
             if (!element.id) { 
              await createPlanfontnature(element);
            } else { 
              await updatePlanfontnature(element.id,element); 
            }
            })
           
            toast.success("Operation effectuée avec succès !");
            resetPlanfontNature();  
          } catch (error:any) {
            toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
          }
      };
 
  const onSubmitPrevision = async (data:any) => { 
     try { 
      const exercices=data.exercice;
      const idProjet=data.idProjet;
      const idCategorie=data.idCategorie;
            data.details.map(async element=>{
              element.id=parseInt(element.id);
              element.montant=element.montant; 
              element.categorie=parseInt(element.categorie); 
              element.idCategorie=parseInt(idCategorie); 
              element.idProjet=parseInt(idProjet);
              element.idSource=parseInt(element.idSource);
              element.idSource=parseInt(element.idActivite);
              element.idSource=parseInt(element.idPlanComptable);
              element.idSource=parseInt(element.idBeneficiaire);
              element.idSource=parseInt(element.ligneBudgetaire);
              element.idSource=parseInt(element.uniteMesure);
              element.idSource=parseInt(element.quantite);
              element.idSource=parseInt(element.prixUnitaire);
              element.idExercice=parseInt(exercices);  
             if (!element.id) { 
              await createPrevision(element);
            } else { 
              await updatePrevision(element.id,element); 
            }
            })
            
            toast.success("Operation effectuée avec succès !");
            resetPrevision();  
          } catch (error:any) {
            toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
          }
      };

   
  const hendleDelete=(id:number,type:string)=>{
    try {
       if(type==='classe'){
      deleteClasse(id);
    }else if(type==='planComptable'){
      deletePlancompte(id); 
      dataPlancompte();
    }else if(type==='projet'){
      deleteProjet(id);  
      dataProjet();
    }else if(type==='categorie'){
      deleteCategorie(id);  
      dataCategorie();
    }else if(type==='activite'){
      deleteActivite(id);  
      dataActivite();
    }else if(type==='typeBailleur'){
      deleteTypebailleur(id);  
      dataTypebailleur();
    }else if(type==='bailleur'){
      deleteBailleur(id);  
      dataBailleur();
    }else if(type==='beneficiaire'){
      deleteBeneficiere(id);  
      dataBenefiere();
    }else if(type==='exercice'){
      deleteExercice(id);  
      dataExercice();
    }else if(type==='devise'){
      deleteDevise(id);  
      dataDevise();
    }
    toast.success("Supression effectuée avec succès !");
 
    } catch (error) {
    toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
      dataClasse();
    }
  }

 const hendleUpdata=(data:any,type:string)=>{ 
    if(type==='classe'){
      resetClasse(data); 
      openModal('classe')
    }else if(type==='planComptable'){
      resetPlancompte(data); 
      openModal('planComptable')
    }else if(type==='projet'){
      resetProjet(data); 
      openModal('projet')
    }else if(type==='categorie'){
      resetCategorie(data); 
      openModal('categorie')
    }else if(type==='activite'){
      resetActivite(data); 
      openModal('activite')
    }else if(type==='typeBailleur'){
      resetTypebailleur(data); 
      openModal('typeBailleur')
    }else if(type==='bailleur'){
      resetBailleur(data); 
      openModal('bailleur')
    }else if(type==='beneficiere'){
      resetBeneficiere(data); 
      openModal('beneficiaire')
    }else if(type==='exercice'){
      resetExercice(data); 
      openModal('exercice')
    }else if(type==='devise'){
      resetDevise(data); 
      openModal('devise')
    }
  }  

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('');
  const [activeSubMenu, setActiveSubMenu] = useState('');
  const [activePage, setActivePage] = useState('');
  const [expandedMenus, setExpandedMenus] = useState({
    classification: true,  
    prevision: false, 
    execution: false,
    tresorerie:false,
    parametre:false
  });

 const [expandedSubMenus, setExpandedSubMenus] = useState({ 
    economique: false,
    programmatique: false,
    srcFinancement: false, 
    etatSortie: false, 
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});
  const [detailLines, setDetailLines] = useState([{ id: 1, compte: '', montant: '' }]);
  const [showPreview, setShowPreview] = useState(false);
  const [showEngagementList, setShowEngagementList] = useState(false);
  const [showLiquidationList, setShowLiquidationList] = useState(false);
  const [engagements, setEngagements] = useState([
    { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    { id: 2, numero: 'ENG-2025-002', date: '2025-01-20', beneficiaire: 'Fournisseur B', montant: 3500000, statut: 'Validé' }
  ]);
  const [liquidations, setLiquidations] = useState([
    { id: 1, numero: 'LIQ-2025-001', engagement: 'ENG-2025-001', date: '2025-02-10', montant: 5000000, statut: 'Payé' },
    { id: 2, numero: 'LIQ-2025-002', engagement: 'ENG-2025-002', date: '2025-02-15', montant: 3500000, statut: 'En attente' }
  ]);

  const toggleMenu = (menu) => {
  setExpandedMenus(prev => {
    const newState = {};

    Object.keys(prev).forEach(key => {
      newState[key] = key === menu ? !prev[key] : false;
    });

    return newState;
  });
};

  const toggleSubMenu = (menu) => {
    setExpandedSubMenus(prev => ({
      ...prev,
      [menu]: !prev[menu] 
    }));
  };
 
  const handleSubMenuClick = (subMenu) => { 
    setActiveSubMenu(subMenu);
  };

  const openModal = (type) => {
    setModalType(type);
    setFormData({});
    setShowModal(true);
  };

  // tous mes get by :
  const getExerciceencours=()=>{
    dataExercice();
  }
   const getProjets=()=>{
    dataProjet()
  }

  const getBailleurs=()=>{
    dataBailleur()
  }

  const getClasses=()=>{
    dataClasse()
  }

  const getCategorie=()=>{
    dataCategorie();
  }

    const getActivites=()=>{
    dataActivite();
  }
  
    const getPlancomptables=()=>{
    dataPlancompte();
  }

      const getBeneficiaires=()=>{
    dataBenefiere();
  }
  //FERMER ET VIDER TOUS LES FORMULAIRE
  const closeModal = () => {
    resetClasse({ id:null,code: null, libelle: null,type:null })
    resetPlancompte({ id:null,code: null, libelle: null,projet:null,categorie:null })
    resetProjet({  id:null,code: null, libelle: null,dateDebut:null,dateFin:null })
    resetCategorie({ id:null,code: null, libelle: null,projetId:null })
    resetActivite({ id:null,code: null, libelle: null,type:null })
    resetBailleur({ id:null,code: null, libelle: null,idTypeSourcefinancement:null })
    resetTypebailleur({ id:null, libelle: null })
    resetBeneficiere({ id:null, libelle: null})
    resetExercice({ id:null,code: null, libelle: null,dateDebut:null,dateFin:null,cloture:false})
    resetDevise({ id:null,code: null, libelle: null,symbole:null,actif:true })
    setShowModal(false); 
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    closeModal();
  };

  
const addDetailLinePlanfontprojet = () => {
  append({ id: null, idProjet: null, idSource: null, montant: "" });
};

const addDetailLinePlanfontnature = () => {
  append({id: null, categorie: null, idSource: null, montant: "",exercice:null });
};

const addDetailLinePlanfontPrevision= () => {
  append({id: null,idActivite:null,idSource:null, idPlanComptable: null, idBeneficiaire: null,ligneBudgetaire:null,uniteMesure:null,quantite:null,prixUnitaire:null, montant: "",exercice:null });
};


const { fields, append, remove } = useFieldArray({
  control,
  controlNature, 
  controlPrevision,
  name: "details",
});

const removeDetailLinePlanfontprojet = (index: number) => {
  remove(index);
};

  const handleDetailChange = (id, field, value) => {
    setDetailLines(detailLines.map(line => 
      line.id === id ? { ...line, [field]: value } : line
    ));
  };

  const handleAfficher = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const calculateTotal = () => {
    return detailLines.reduce((sum, line) => sum + (parseFloat(line.montant) || 0), 0);
  };

  const handleAfficherEngagementList = (e) => {
    e.preventDefault();
    const newEngagement = {
      id: engagements.length + 1,
      numero: `ENG-2025-${String(engagements.length + 1).padStart(3, '0')}`,
      date: formData.dateEngagement,
      beneficiaire: formData.beneficiaire,
      montant: parseFloat(formData.montantEngagement || 0),
      statut: 'En cours'
    };
    setEngagements([...engagements, newEngagement]);
    setShowEngagementList(true);
  };

  const handleAfficherLiquidationList = (e) => {
    e.preventDefault();
    const newLiquidation = {
      id: liquidations.length + 1,
      numero: `LIQ-2025-${String(liquidations.length + 1).padStart(3, '0')}`,
      engagement: formData.engagementRef,
      date: formData.dateLiquidation,
      montant: parseFloat(formData.montantLiquidation || 0),
      statut: 'En attente'
    };
    setLiquidations([...liquidations, newLiquidation]);
    setShowLiquidationList(true);
  };
  //menu
  const menuStructure = [
    {
      id: 'classification',
      name: 'Classification',
      icon: <Layers className="w-5 h-5" />,
      subMenus: [
        { 
          id: 'economique', 
          name: 'Économique',
          icon: <DollarSign className="w-4 h-4" />,
          pages: [
            { id: 'classe', name: 'Classe' },
            { id: 'planComptable', name: 'Plan Comptable' }
          ]
        },
        { 
          id: 'programmatique', 
          name: 'Programmatique',
          icon: <FileText className="w-4 h-4" />,
          pages: [
            { id: 'projet', name: 'Projet' },
            { id: 'categorie', name: 'Catégorie' },
            { id: 'activite', name: 'Activité' }
          ]
        },
        { 
          id: 'srcFinancement', 
          name: 'Source de Financement',
          icon: <PieChart className="w-4 h-4" />,
           pages: [
            { id: 'typeBailleur', name: 'typeBailleur' },
            { id: 'bailleur', name: 'bailleur' },
            { id: 'beneficiaire', name: 'beneficiaire' }
          ]
        }
      ]
    },
    {
      id: 'prevision',
      name: 'Prévision',
      icon: <TrendingUp className="w-5 h-5" />,
      subMenus: [
        { 
          id: 'plafond', 
          name: 'Plafond de Dépense',
          icon: <BookOpen className="w-4 h-4" />
        },
        { 
          id: 'plafondNature', 
          name: 'Plafond par nature',
          icon: <BookOpen className="w-4 h-4" />
        },
        { 
          id: 'elaboration', 
          name: 'Élaboration',
          icon: <BookOpen className="w-4 h-4" />
        },
        { 
          id: 'etatSortie', 
          name: 'État de Sortie',
          icon: <FileText className="w-4 h-4" />,
          pages: [
            { id: 'parClasse', name: 'Par Classe' },
            { id: 'parProjet', name: 'Par Projet' }
          ]
        }
      ]
    },
    {
      id: 'execution',
      name: 'Exécution',
      icon: <CheckSquare className="w-5 h-5" />,
      subMenus: [
        { 
          id: 'engagement', 
          name: 'Engagement',
          icon: <FileText className="w-4 h-4" />
        },
        { 
          id: 'liquidation', 
          name: 'Liquidation',
          icon: <DollarSign className="w-4 h-4" />
        },
        { 
          id: 'rapportEngagement', 
          name: 'Rapport Engagement',
          icon: <PieChart className="w-4 h-4" />
        },
        { 
          id: 'rapportLiquidation', 
          name: 'Rapport Liquidation',
          icon: <TrendingUp className="w-4 h-4" />
        }
      ]
    },
     {
      id: 'tresorerie',
      name: 'Tresorerie',
      icon: <CheckSquare className="w-5 h-5" />,
      subMenus: [
         { 
          id: 'banque', 
          name: 'Banque',
          icon: <FileText className="w-4 h-4" />
        },
        { 
          id: 'compteBancaire', 
          name: 'Compte bancaire',
          icon: <FileText className="w-4 h-4" />
        },
        { 
          id: 'encaissement', 
          name: 'Encaissement',
          icon: <FileText className="w-4 h-4" />
        },
        { 
          id: 'decaissement', 
          name: 'Decaissement',
          icon: <DollarSign className="w-4 h-4" />
        },
        { 
          id: 'rapportEncaissement', 
          name: 'Rapport Encaissement',
          icon: <PieChart className="w-4 h-4" />
        },
        { 
          id: 'rapportDecaissement', 
          name: 'Rapport Decaissement',
          icon: <TrendingUp className="w-4 h-4" />
        }
      ]
    },
     {
      id: 'parametre',
      name: 'Parametre',
      icon: <Settings2 className="w-5 h-5" />,
      subMenus: [
        { 
          id: 'exercice', 
          name: 'Exercice',
          icon: <FileText className="w-4 h-4" />
        },
        { 
          id: 'devise', 
          name: 'Devise',
          icon: <BadgeDollarSign className="w-4 h-4" />
        }
      ]
    }
  ];

  const renderClassePage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Classes Économiques</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('classe')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter une Classe
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Libellé</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
    {classes?.map((datas, i) => (
  <tr key={datas.id} className="hover:bg-gray-50">
    <td className="border border-gray-300 px-4 py-2">{i+1}</td>
    {/* <td className="border border-gray-300 px-4 py-2">{datas.code}</td> */}
    <td className="border border-gray-300 px-4 py-2">{datas.libelle}</td>
    <td className="border border-gray-300 px-4 py-2">Dépense</td>
    <td className="border border-gray-300 px-4 py-2 text-center">
      <button className="text-blue-600 hover:text-blue-800 mr-2" onClick={()=>hendleUpdata(datas,'classe')}>Modifier</button>
      <button className="text-red-600 hover:text-red-800" onClick={()=>hendleDelete(datas.id,'classe')}>Supprimer</button>
    </td>
  </tr>
))}


          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPlanComptablePage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion du Plan Comptable</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('planComptable')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter un Compte
        </button>
      </div>

      <div className="mb-4 flex gap-4">
        <input 
          type="text" 
          placeholder="Rechercher un compte..."
          className="flex-1 border border-gray-300 rounded px-4 py-2"
        />
        <select className="border border-gray-300 rounded px-4 py-2">
          <option value="">Toutes les classes</option>
          {classes?.map((classe) => (
            <option key={classe.id} value={classe.id}>
              {classe.libelle}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">N°</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Libellé</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Classe</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plancomptables?.map((plancompte, index) => {
              // const classe = classes.find(c => c.id === plancompte.classeId);
              return (
                <tr key={plancompte.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{plancompte.numero}</td>
                  <td className="border border-gray-300 px-4 py-2">{plancompte.libelle}</td>
                  <td className="border border-gray-300 px-4 py-2">
                   {plancompte?.classe?.libelle ?? 'N/A'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button 
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      onClick={() => hendleUpdata(plancompte, 'planComptable')}
                    >
                      Modifier
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => hendleDelete(plancompte.id, 'planComptable')}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

    const renderProjetPage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Projets</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('projet')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter un Projet
        </button>
      </div>

      <div className="mb-4 flex gap-4 items-center">
        <input 
          type="text" 
          placeholder="Rechercher un projet..."
          className="flex-1 border border-gray-300 rounded px-4 py-2"
        />
        <p className="whitespace-nowrap">du</p>
        <input 
          type="date" 
          className="border border-gray-300 rounded px-4 py-2"
        />
        <p className="whitespace-nowrap">au</p>
        <input 
          type="date" 
          className="border border-gray-300 rounded px-4 py-2"
        />
      </div>
      <hr className="my-4" />
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">N°</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Intitulé</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Date de début</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Date de fin</th> 
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projets?.map((projet, index) => (
              <tr key={projet.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{projet.code || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{projet.libelle}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {projet.dateDebut ? new Date(projet.dateDebut).toLocaleDateString() : 'N/A'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {projet.dateFin ? new Date(projet.dateFin).toLocaleDateString() : 'N/A'}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button 
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => hendleUpdata(projet, 'projet')}
                  >
                    Modifier
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => hendleDelete(projet.id, 'projet')}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCategoriePage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Catégories</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('categorie')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter une Catégorie
        </button>
      </div>

      <div className="mb-4 flex gap-4 items-center">
        <input 
          type="text" 
          placeholder="Rechercher une catégorie..."
          className="flex-1 border border-gray-300 rounded px-4 py-2"
        />
        <select className="border border-gray-300 rounded px-4 py-2">
          <option value="">Tous les projets</option>
          {projets?.map((projet) => (
            <option key={projet.id} value={projet.id}>
              {projet.libelle}
            </option>
          ))}
        </select>
      </div>
      <hr className="my-4" />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">N°</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Libellé</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Projet</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((categorie, index) => (
              <tr key={categorie.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{categorie.code || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{categorie.libelle}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {categorie.projet?.libelle || 'N/A'}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button 
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => hendleUpdata(categorie, 'categorie')}
                  >
                    Modifier
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => hendleDelete(categorie.id, 'categorie')}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTypeBailleurPage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Types de Bailleurs</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('typeBailleur')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter un Type de Bailleur
        </button>
      </div>

      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Rechercher un type de bailleur..."
          className="w-full md:w-1/3 border border-gray-300 rounded px-4 py-2"
        />
      </div>
      <hr className="my-4" />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">N°</th> 
              <th className="border border-gray-300 px-4 py-2 text-left">Libellé</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {typebailleurs?.map((type, index) => (
              <tr key={type.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td> 
                <td className="border border-gray-300 px-4 py-2">{type.libelle}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button 
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => hendleUpdata(type, 'typeBailleur')}
                  >
                    Modifier
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => hendleDelete(type.id, 'typeBailleur')}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBailleurPage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Bailleurs</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('bailleur')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter un Bailleur
        </button>
      </div>

      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Rechercher un bailleur..."
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>
        
        <div className="flex gap-4">
          <select className="border border-gray-300 rounded px-4 py-2">
            <option value="">Tous les types de bailleur</option>
            {typebailleurs?.map((type) => (
              <option key={type.id} value={type.id}>
                {type.libelle}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <hr className="my-4" />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">N°</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Libellé</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Type de bailleur</th> 
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bailleurs?.map((bailleur, index) => (
              <tr key={bailleur.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{bailleur.code || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{bailleur.libelle}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {bailleur.typeBailleur?.libelle || 'N/A'}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button 
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => hendleUpdata(bailleur, 'bailleur')}
                  >
                    Modifier
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => hendleDelete(bailleur.id, 'bailleur')}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderActivitePage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Activités</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('activite')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter une Activité
        </button>
      </div>

      <div className="mb-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Rechercher une activité..."
            className="flex-1 border border-gray-300 rounded px-4 py-2"
          />
          <select className="border border-gray-300 rounded px-1 py-2">
            <option value="">Tous les projets</option>
            {projets?.map((projet) => (
              <option key={projet.id} value={projet.id}>
                {projet.libelle}
              </option>
            ))}
          </select>
          <select className="border border-gray-300 rounded px-1 py-2">
            <option value="">Tous les Categories</option>
            {categories?.map((data) => (
              <option key={data.id} value={data.id}>
                {data.libelle}
              </option>
            ))}
          </select>
        </div>
      </div>
      <hr className="my-4" />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">N°</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Libellé</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Categorie</th> 
              <th className="border border-gray-300 px-4 py-2 text-left">Projet</th> 
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activites?.map((activite, index) => (
              <tr key={activite.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2 font-medium">{activite.code || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{activite.libelle}</td>
               <td className="border border-gray-300 px-4 py-2">
                  {activite.categorie?.libelle || 'N/A'}
                </td> 
                <td className="border border-gray-300 px-4 py-2">
                  {activite.categorie?.projet?.libelle || 'N/A'}
                </td> 
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button 
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => hendleUpdata(activite, 'activite')}
                  >
                    Modifier
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => hendleDelete(activite.id, 'activite')}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBeneficiairePage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Bénéficiaires</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('beneficiaire')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter un Bénéficiaire
        </button>
      </div>

      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Rechercher un bénéficiaire..."
          className="w-full md:w-1/3 border border-gray-300 rounded px-4 py-2"
        />
      </div>
      <hr className="my-4" />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">N°</th> 
              <th className="border border-gray-300 px-4 py-2 text-left">Libellé</th> 
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {beneficieres?.map((beneficiere, index) => (
              <tr key={beneficiere.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{beneficiere.libelle}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button 
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => hendleUpdata(beneficiere, 'beneficiere')}
                  >
                    Modifier
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => hendleDelete(beneficiere.id, 'beneficiere')}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table> 
      </div>
    </div>
  );

  const renderExercicePage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Exercices Budgétaires</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('exercice')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter un Exercice
        </button>
      </div>

      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Rechercher un exercice..."
          className="w-full md:w-1/3 border border-gray-300 rounded px-4 py-2"
        />
      </div>
      <hr className="my-4" />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">N°</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Libellé</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Date de début</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Date de fin</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Statut</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exercices?.map((exercice, index) => (
              <tr key={exercice.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{exercice.code || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{exercice.libelle}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {exercice.dateDebut ? new Date(exercice.dateDebut).toLocaleDateString() : 'N/A'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {exercice.dateFin ? new Date(exercice.dateFin).toLocaleDateString() : 'N/A'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    exercice.cloture === false 
                      ? 'bg-green-100 text-green-800' 
                      : exercice.cloture === true
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {exercice.cloture || 'N/A'}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button 
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => hendleUpdata(exercice, 'exercice')}
                  >
                    Modifier
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => hendleDelete(exercice.id, 'exercice')}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

const renderDevisePage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Devises</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('devise')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter une Devise
        </button>
      </div>
 
      <hr className="my-4" />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">N°</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Libellé</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Symbole</th> 
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {devises?.map((devise, index) => (
              <tr key={devise.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2 font-medium">{devise.code || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{devise.libelle}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <span className="text-lg">{devise.symbole || 'N/A'}</span>
                </td> 
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button 
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => hendleUpdata(devise, 'devise')}
                  >
                    Modifier
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => hendleDelete(devise.id, 'devise')}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDefaultPage = (title) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
      <div className="mb-6">
        <button 
          onClick={() => openModal(title.toLowerCase())}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter
        </button>
      </div>
      <p className="text-gray-600">Contenu de la section {title} à venir...</p>

<div className="bg-white p-6 rounded-lg border border-gray-300 shadow-md max-w-5xl mx-auto">
    <h2 className="text-center text-gray-800 text-2xl mb-5">État de Sortie</h2>

    <table className="w-full border-collapse mt-2">
        <thead>
            <tr className="bg-blue-900 text-white text-left text-sm">
                <th className="p-2 border border-gray-300">PROJET</th>
                <th className="p-2 border border-gray-300">NATURE</th>
                <th className="p-2 border border-gray-300">CATEGORIE</th>
                <th className="p-2 border border-gray-300">MONTANT</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td className="p-2 border border-gray-300 text-sm">Projet 1</td>
                <td className="p-2 border border-gray-300 text-sm">Charges personnelles</td>
                <td className="p-2 border border-gray-300 text-sm">Cat 1</td>
                <td className="p-2 border border-gray-300 text-sm">5 000</td>
            </tr>
            <tr>
                <td className="p-2 border border-gray-300 text-sm">Projet 1</td>
                <td className="p-2 border border-gray-300 text-sm">Charges personnelles</td>
                <td className="p-2 border border-gray-300 text-sm">Cat 2</td>
                <td className="p-2 border border-gray-300 text-sm">10 000</td>
            </tr>
            <tr className="bg-orange-100 font-bold">
                <td className="p-2 border border-gray-300 text-sm">Projet 1</td>
                <td className="p-2 border border-gray-300 text-sm">Charges personnelles (Total)</td>
                <td className="p-2 border border-gray-300 text-sm"></td>
                <td className="p-2 border border-gray-300 text-sm">15 000</td>
            </tr>
            <tr>
                <td className="p-2 border border-gray-300 text-sm">Projet 1</td>
                <td className="p-2 border border-gray-300 text-sm">Charges divers</td>
                <td className="p-2 border border-gray-300 text-sm">Cat 5</td>
                <td className="p-2 border border-gray-300 text-sm">4 000</td>
            </tr>
            <tr className="bg-orange-100 font-bold">
                <td className="p-2 border border-gray-300 text-sm">Projet 1</td>
                <td className="p-2 border border-gray-300 text-sm">Charges divers (Total)</td>
                <td className="p-2 border border-gray-300 text-sm"></td>
                <td className="p-2 border border-gray-300 text-sm">9 000</td>
            </tr>
            <tr className="bg-green-200 font-bold text-base">
                <td className="p-2 border border-gray-300 text-sm" colspan="3">TOTAL PROJET 1</td>
                <td className="p-2 border border-gray-300 text-sm">24 000</td>
            </tr>
        </tbody>
    </table>
</div>

   
    <h2 className="text-center mb-6 text-gray-800 text-2xl font-semibold">État de Sortie</h2>

    <table className="w-full border-collapse mt-4">
        <thead>
            <tr>
                <th className="bg-[#1f4e78] text-white p-3 font-bold text-left border border-gray-300 text-sm">CODE</th>
                <th className="bg-[#1f4e78] text-white p-3 font-bold text-left border border-gray-300 text-sm">DESCRIPTION</th>
                <th className="bg-[#1f4e78] text-white p-3 font-bold text-left border border-gray-300 text-sm">DEBUT</th>
                <th className="bg-[#1f4e78] text-white p-3 font-bold text-left border border-gray-300 text-sm">FIN</th>
                <th className="bg-[#1f4e78] text-white p-3 font-bold text-left border border-gray-300 text-sm">QUANTITE</th>
                <th className="bg-[#1f4e78] text-white p-3 font-bold text-left border border-gray-300 text-sm">C. UNITAIRE</th>
                <th className="bg-[#1f4e78] text-white p-3 font-bold text-left border border-gray-300 text-sm">TOTAL</th>
                <th className="bg-[#1f4e78] text-white p-3 font-bold text-left border border-gray-300 text-sm">SOURCE FINANCEMENT</th>
            </tr>
        </thead>

        <tbody>

            {/* <!-- PROJET 1 --> */}
            <tr className="bg-[#d9e1f2] font-semibold">
                <td className="p-3 border border-gray-300">01</td>
                <td className="p-3 border border-gray-300" colSpan={5}>Projet 1</td>
                <td className="p-3 border border-gray-300">24 000</td> 
                <td className="p-3 border border-gray-300">FAP</td>
            </tr>

            {/* <!-- CATEGORIE 1 --> */}
            <tr className="bg-[#fce4d6] font-semibold">
                <td className="p-3 border border-gray-300">003</td>
                <td className="p-3 border border-gray-300" colSpan={5}>CATEGORIE</td> 
                <td className="p-3 border border-gray-300">5000</td>
                <td className="p-3 border border-gray-300">FAP</td>
            </tr>

            <tr>
                <td className="p-3 border border-gray-300">00011</td>
                <td className="p-3 border border-gray-300">ACTIVIE 1</td>
                <td className="p-3 border border-gray-300">12/05/2026</td>
                <td className="p-3 border border-gray-300">12/09/2026</td>
                <td className="p-3 border border-gray-300">5 </td>
                <td className="p-3 border border-gray-300">5 000</td>
                <td className="p-3 border border-gray-300">25 000</td>
                <td className="p-3 border border-gray-300">FAP</td>
            </tr>

             <tr>
                <td className="p-3 border border-gray-300">00012</td>
                <td className="p-3 border border-gray-300">ACTIVIE SSS JDSD D  DSKDS2</td>
                <td className="p-3 border border-gray-300">12/05/2026</td>
                <td className="p-3 border border-gray-300">12/09/2026</td>
                <td className="p-3 border border-gray-300">5 </td>
                <td className="p-3 border border-gray-300">5 000</td>
                <td className="p-3 border border-gray-300">25 000</td>
                <td className="p-3 border border-gray-300">EIRENE</td>
            </tr>
 
      {/* <!-- CATEGORIE 2 --> */}
            <tr className="bg-[#fce4d6] font-semibold">
                <td className="p-3 border border-gray-300">002</td>
                <td className="p-3 border border-gray-300" colSpan={5}>CATEGORIE 2</td> 
                <td className="p-3 border border-gray-300">5000</td>
                <td className="p-3 border border-gray-300">EIRENE</td>
            </tr>

            <tr>
                <td className="p-3 border border-gray-300">00011</td>
                <td className="p-3 border border-gray-300">ACTIVIE 1</td>
                <td className="p-3 border border-gray-300">12/05/2026</td>
                <td className="p-3 border border-gray-300">12/09/2026</td>
                <td className="p-3 border border-gray-300">5 </td>
                <td className="p-3 border border-gray-300">5 000</td>
                <td className="p-3 border border-gray-300">25 000</td>
                <td className="p-3 border border-gray-300">ZEP</td>
            </tr>

             <tr>
                <td className="p-3 border border-gray-300">00012</td>
                <td className="p-3 border border-gray-300">ACTIVIE SSS JDSD D  DSKDS2</td>
                <td className="p-3 border border-gray-300">12/05/2026</td>
                <td className="p-3 border border-gray-300">12/09/2026</td>
                <td className="p-3 border border-gray-300">5 </td>
                <td className="p-3 border border-gray-300">5 000</td>
                <td className="p-3 border border-gray-300">25 000</td>
                <td className="p-3 border border-gray-300">EIRENE</td>
            </tr>

            {/* <!-- TOTAL --> */}
            <tr className="bg-[#c6efce] font-bold text-base">
                <td className="p-3 border border-gray-300" colSpan={6}>TOTAL PROJET 1</td>
                <td className="p-3 border border-gray-300" colSpan={2}>24 000</td>
            </tr>

        </tbody>
    </table>

       <div className="bg-gray-100 p-6 min-h-screen">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              Projet → Catégorie → Activité avec Montants
            </h2>
    
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 w-40">Type</th>
                  <th className="border border-gray-300 px-4 py-2">Nom</th>
                  <th className="border border-gray-300 px-4 py-2">Montant</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(grouped).map(([projet, categories]) => {
                  const projetTotal = Object.values(categories)
                    .flat()
                    .reduce((sum, a) => sum + a.montant, 0);
    
                  return (
                    <React.Fragment key={`projet-${projet}`}>
                      {/* Ligne Projet */}
                      <tr className="bg-blue-50 font-semibold">
                        <td className="border border-gray-300 px-4 py-2">Projet</td>
                        <td className="border border-gray-300 px-4 py-2">{`Projet ${projet}`}</td>
                        <td className="border border-gray-300 px-4 py-2">{`${projetTotal.toLocaleString()} FC`}</td>
                      </tr>
    
                      {/* Lignes Catégorie + Activités */}
                      {Object.entries(categories).map(([categorie, acts]) => {
                        const categorieTotal = acts.reduce((sum, a) => sum + a.montant, 0);
                        return (
                          <React.Fragment key={`categorie-${projet}-${categorie}`}>
                            {/* Ligne Catégorie */}
                            <tr className="bg-gray-50 font-medium">
                              <td className="border border-gray-300 px-4 py-2">Catégorie</td>
                              <td className="border border-gray-300 px-4 py-2">{`Catégorie ${categorie}`}</td>
                              <td className="border border-gray-300 px-4 py-2">{`${categorieTotal.toLocaleString()} FC`}</td>
                            </tr>
    
                            {/* Lignes Activités */}
                            {acts.map((a) => (
                              <tr key={`activite-${projet}-${categorie}-${a.activite}`}>
                                <td className="border border-gray-300 px-4 py-2">Activité</td>
                                <td className="border border-gray-300 px-4 py-2">{`Activité ${a.activite}`}</td>
                                <td className="border border-gray-300 px-4 py-2">{`${a.montant.toLocaleString()} FC`}</td>
                              </tr>
                            ))}
                          </React.Fragment>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

</div> 
  );

  const renderElaborationPage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
       <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Élaboration du Budget
        </h2>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition duration-200 font-medium shadow-sm"
        >
          Afficher l’Aperçu
        </button>
      </div>


      {/* <form onSubmit={handleAfficher}>
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">En-tête</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Exercice Budgétaire</label>
              <select
                name="exercice"
                value={formData.exercice || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Sélectionner l'exercice</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Projet</label>
              <select
                name="typeBudget"
                value={formData.projet || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Sélectionner un projet</option>
                <option value="Initial">611 - Projet 1</option>
                <option value="projet">612 - Projet 2</option>
                <option value="projet1">613 - Projet 3</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Categorie</label>
              <select
                name="typeBudget"
                value={formData.categorie || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Sélectionner une categorie</option>
                <option value="Initial">611 - Categorie 1</option>
                <option value="projet">612 - Categorie 2</option>
                <option value="projet1">613 - Categorie 3</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Classe</label>
              <input
                type="text"
                name="classeId"
                value={formData.classeId || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                required
                readOnly
              />
            </div>
            <div>
                <span className="px-4 py-2 bg-green-600 text-white rounded-full font-semibold text-sm shadow">
                  Montant restant par catégorie: <strong>5 000 000 000</strong>
                </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Détails des Lignes Budgétaires</h3>
            <button
              type="button"
              onClick={addDetailLine}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
            >
              + Ajouter une ligne
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">Compte</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Bailleur</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Beneficiaire</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Montant</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Ligne Budgetaire</th>
                  <th className="border border-gray-300 px-4 py-2 text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody>
                {detailLines.map((line) => (
                  <tr key={line.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-2 py-2">
                      <select
                        value={line.compte}
                        onChange={(e) => handleDetailChange(line.id, 'compte', e.target.value)}
                        className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                        required
                      >
                        <option value="">Sélectionner un compte</option>
                        <option value="611">611 - Salaires et Traitements</option>
                        <option value="612">612 - Charges Sociales</option>
                        <option value="621">621 - Fournitures de Bureau</option>
                        <option value="622">622 - Services Extérieurs</option>
                        <option value="623">623 - Déplacements</option>
                      </select>
                    </td>
                  <td className="border border-gray-300 px-2 py-2">
                      <select
                        value={line.bailleur}
                        onChange={(e) => handleDetailChange(line.id, 'bailleur', e.target.value)}
                        className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                        required
                      >
                        <option value="">source de financement</option>
                        <option value="611">611 - CSS</option>
                        <option value="612">612 - Banque Sociales</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <select
                        value={line.beneficiere}
                        onChange={(e) => handleDetailChange(line.id, 'beneficiere', e.target.value)}
                        className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                        required
                      >
                        <option value="">beneficiere</option>
                        <option value="611">611 - Fap</option>
                        <option value="612">612 - Empoyer</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="number"
                        value={line.montant}
                        onChange={(e) => handleDetailChange(line.id, 'montant', e.target.value)}
                        className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                        placeholder="0.00"
                        step="0.01"
                        required
                      />
                    </td>
                     <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        value={line.ligneBudgetaire}
                        onChange={(e) => handleDetailChange(line.id, 'ligneBudgetaire', e.target.value)}
                        className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                        placeholder="ligne budgetaire" 
                        readOnly
                        required
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeDetailLine(line.id)}
                        className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                        disabled={detailLines.length === 1}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-semibold">
                  <td className="border border-gray-300 px-4 py-2 text-right">Total</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {calculateTotal().toLocaleString('fr-FR', { minimumFractionDigits: 2 })} FBU
                  </td>
                  <td className="border border-gray-300"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      
      </form> */}

    <form onSubmit={handleSubmitPrevision(onSubmitPrevision)}>
      {/* En-tête */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">En-tête</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Exercice */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Exercice Budgétaire</label>
            <select
              {...registerPrevision("exercice", { required: true })}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">Sélectionner l'exercice</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>

          {/* Projet */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Projet</label>
            <select
              {...registerPrevision("projet", { required: true })}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">Sélectionner un projet</option>
              <option value="Initial">611 - Projet 1</option>
              <option value="projet">612 - Projet 2</option>
              <option value="projet1">613 - Projet 3</option>
            </select>
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Categorie</label>
            <select
              {...registerPrevision("categorie", { required: true })}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">Sélectionner une categorie</option>
              <option value="Initial">611 - Categorie 1</option>
              <option value="projet">612 - Categorie 2</option>
              <option value="projet1">613 - Categorie 3</option>
            </select>
          </div>

          {/* Classe */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Classe</label>
            <input
              type="text"
              {...registerPrevision("classeId")}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              readOnly
            />
          </div>

          <div>
            <span className="px-4 py-2 bg-green-600 text-white rounded-full font-semibold text-sm shadow">
              Montant restant par catégorie: <strong>5 000 000 000</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Détails des lignes budgétaires */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Détails des Lignes Budgétaires</h3>
          <button
            type="button"
            onClick={()=>addDetailLinePlanfontPrevision({id: null,idActivite:null,idSource:null, idPlanComptable: null, idBeneficiaire: null,ligneBudgetaire:null,uniteMesure:null,quantite:null,prixUnitaire:null, montant: "",exercice:null })}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
          >
            + Ajouter une ligne
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">Compte</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Bailleur</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Beneficiaire</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Montant</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Ligne Budgetaire</th>
                <th className="border border-gray-300 px-4 py-2 text-center w-24">Action</th>
              </tr>
            </thead>

            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="hover:bg-gray-100">

                  {/* Compte */}
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      {...registerPrevision(`details.${index}.compte`, { required: true })}
                      className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Sélectionner un compte</option>
                      <option value="611">611 - Salaires et Traitements</option>
                      <option value="612">612 - Charges Sociales</option>
                      <option value="621">621 - Fournitures de Bureau</option>
                      <option value="622">622 - Services Extérieurs</option>
                      <option value="623">623 - Déplacements</option>
                    </select>
                  </td>

                  {/* Bailleur */}
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      {...registerPrevision(`details.${index}.bailleur`, { required: true })}
                      className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Source de financement</option>
                      <option value="611">611 - CSS</option>
                      <option value="612">612 - Banque Sociales</option>
                    </select>
                  </td>

                  {/* Beneficiaire */}
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      {...registerPrevision(`details.${index}.beneficiere`, { required: true })}
                      className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Beneficiaire</option>
                      <option value="611">611 - Fap</option>
                      <option value="612">612 - Employé</option>
                    </select>
                  </td>

                  {/* Montant */}
                  <td className="border border-gray-300 px-2 py-2">
                    <input
                      type="number"
                      step="0.01"
                      {...registerPrevision(`details.${index}.montant`, { required: true })}
                      className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </td>

                  {/* Ligne Budgetaire */}
                  <td className="border border-gray-300 px-2 py-2">
                    <input
                      type="text"
                      {...registerPrevision(`details.${index}.ligneBudgetaire`)}
                      className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                      placeholder="ligne budgetaire"
                      readOnly
                    />
                  </td>

                  {/* Action */}
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </td>

                </tr>
              ))}

              {/* Total */}
              <tr className="bg-blue-50 font-semibold">
                <td className="border border-gray-300 px-4 py-2 text-right" colSpan={3}>Total</td>
                <td className="border border-gray-300 px-4 py-2" colSpan={3}>
                  {calculateTotal().toLocaleString('fr-FR', { minimumFractionDigits: 2 })} FBU
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div> 
      <div className="flex justify-end gap-4 mt-4">
        <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
          Enregistrer
        </button>
      </div>
    </form>
    
    </div>
  );

  const renderPlafondPage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Planfond de dépense</h2>
      
      <form onSubmit={handleSubmitPlanfontprojet(onSubmitPlanfontprojet)}>
  <div className="bg-gray-50 p-6 rounded-lg mb-6">
    <h3 className="text-lg font-semibold mb-4 text-gray-700">En-tête</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Exercice Budgétaire
        </label>

        <select
          {...registerPlanfontprojet("exercice", { required: true })}
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
         onClick={getExerciceencours}
       >
          <option value="">Sélectionner l'exercice</option>
          {
            exercices.map((element)=>(
             <option value={element.id}>{element.libelle}</option>
            ))
          }
        </select>

        {errorsPlanfontprojet.exercice && (
          <p className="text-red-500 text-sm">Champ obligatoire</p>
        )}
      </div>
    </div>
  </div>

  <div className="bg-gray-50 p-6 rounded-lg mb-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-700">Détails des projets</h3>

      <button
        type="button"
        onClick={() => addDetailLinePlanfontprojet({ id: null,idProjet: null, idSource: null, montant: '' })}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
      >
        + Ajouter une ligne
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200"> 
            <th className="border border-gray-300 px-4 py-2 text-left">Projet</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Bailleur</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Montant</th>
            <th className="border border-gray-300 px-4 py-2 text-center w-24">Action</th>
          </tr>
        </thead>

        <tbody>
          {fields.map((field, index) => (
            <tr key={field.id} className="hover:bg-gray-100">
       
           <td className="border border-gray-300 px-2 py-2" hidden>
                <input
                  type="number"
                  {...registerPlanfontprojet(`details.${index}.id`, { required: false })}
                  className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                  placeholder="0.00" 
                />
              </td>
              {/* Projet */}
              <td className="border border-gray-300 px-2 py-2">
                <select
                  {...registerPlanfontprojet(`details.${index}.idProjet`, { required: true })}
                  className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                 onClick={getProjets}
               >
                  <option value="">Sélectionner un projet</option>
                  {
                    projets.map((element)=>(
                    <option value={element.id}>{element.libelle}</option>
                    ))
                  }
                </select>
              </td> 

              {/* Bailleur */}
              <td className="border border-gray-300 px-2 py-2">
                <select
                  {...registerPlanfontprojet(`details.${index}.idSource`)}
                  className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                  onClick={getBailleurs}
                >
                  <option value="">Sélectionner un bailleur</option>
                  {
                    bailleurs.map((element)=>(
                    <option value={element.id}>{element.libelle}</option>
                    ))
                  }
                </select>
              </td>

              {/* Montant */}
              <td className="border border-gray-300 px-2 py-2">
                <input
                  type="number"
                  step="0.01"
                  {...registerPlanfontprojet(`details.${index}.montant`, { required: true })}
                  className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                  placeholder="0.00"
                />
              </td>

              {/* Delete button */}
              <td className="border border-gray-300 px-2 py-2 text-center">
                <button
                  type="button"
                  onClick={() => removeDetailLinePlanfontprojet(index)}
                  className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                  disabled={fields.length === 1}
                >
                  <X className="w-5 h-5" />
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  <div className="flex justify-end gap-4 mt-4">
    <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
      Enregistrer
    </button>
    <button className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition">
      Imprimer
    </button>
  </div>
</form>

    </div>
  );

 const renderPlafondNaturePage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Planfond par nature</h2>

      <form onSubmit={handleSubmitPlanfontNature(onSubmitPlanfontnature)}>
        {/* En-tête */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">En-tête</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Exercice */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Exercice Budgétaire
              </label> 

              <select
                {...registerPlanfontNature("exercice", { required: true })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                  onClick={getExerciceencours}
                >
                <option value="">Sélectionner l'exercice</option>
                {
                  exercices.map((element)=>(
                  <option value={element.id}>{element.libelle}</option>
                  ))
                }
              </select>
            </div>

            {/* Projet */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Projet</label>
             <select
                  {...registerPlanfontNature(`idProjet`, { required: true })}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              onClick={getProjets}
               >
                  <option value="">Sélectionner un projet</option>
                  {
                    projets.map((element)=>(
                    <option value={element.id}>{element.libelle}</option>
                    ))
                  }
                </select>
            </div>
          </div>
        </div>

        {/* Détails */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Détails des projets</h3>
            <button
              type="button"
              onClick={() =>
                addDetailLinePlanfontnature({id: null, categorie: null, idSource: null, montant: "",exercice:null })
              }
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
            >
              + Ajouter une ligne
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">Categorie</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Nature</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Montant</th>
                  <th className="border border-gray-300 px-4 py-2 text-center w-24">Action</th>
                </tr>
              </thead>

              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id} className="hover:bg-gray-100">
                

                    {/* Catégorie */}
                    <td className="border border-gray-300 px-2 py-2">
                      <select
                        {...registerPlanfontNature(`details.${index}.categorie`, { required: true })}
                        className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                             onClick={getCategorie}
                     >
                        <option value="">Sélectionner une catégorie</option>
                        {
                          categories.map((element)=>(
                          <option value={element.id}>{element.libelle}</option>
                          ))
                        }
                      </select>
                    </td>
                        
                    {/* Classe */}
                    <td className="border border-gray-300 px-2 py-2">
                      <select
                        {...registerPlanfontNature(`details.${index}.idSource`, { required: false })}
                        className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                      onClick={getClasses}
                        >
                        <option value="">Sélectionner la nature de depense</option>
                        {
                          classes.map((element)=>(
                          <option value={element.id}>{element.libelle}</option>
                          ))
                        }
                      </select>
                    </td>

                    {/* Montant */}
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="number"
                        step="0.01"
                        {...registerPlanfontNature(`details.${index}.montant`, { required: true })}
                        className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                        placeholder="0.00"
                      />
                    </td>

                    {/* Supprimer */}
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Total */}
                <tr className="bg-blue-50 font-semibold">
                  <td className="border border-gray-300 px-4 py-2 text-center" colSpan={2}>
                    Total
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center" colSpan={2}>
                    {calculateTotal().toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <div className="flex gap-4 justify-end">
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
              Enregistrer
            </button>

            <button type="button" className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition">
              Imprimer
            </button>
          </div>
        </div>
      </form>
    </div>
  );
  

  const renderEngagementPage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Engagement de Dépense</h2>
      
      <form onSubmit={handleAfficherEngagementList}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
             <div>
              <label className="block text-gray-700 font-medium mb-2">Exercice Budgétaire</label>
              <select
                name="exercice"
                value={formData.exercice || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                required
                disabled
              >
                <option value="">Sélectionner l'exercice</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Date d'Engagement</label>
            <input
              type="date"
              name="dateEngagement"
              value={formData.dateEngagement || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
         <div>
            <label className="block text-gray-700 font-medium mb-2">Projet</label>
              <select
                name="projet"
                value={formData.projet || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                required
                      >
                        <option value="">Sélectionner un projet</option>
                        <option value="611">611 - Projet 1</option>
                        <option value="612">612 - Projet 2</option>
                        <option value="613">613 - Projet 3</option>
               </select>
            </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Ligne Budgétaire</label>
            <select
              name="ligneBudgetaire"
              value={formData.ligneBudgetaire || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Sélectionner une ligne</option>
              <option value="611">611 - Salaires et Traitements</option>
              <option value="621">621 - Fournitures de Bureau</option>
              <option value="622">622 - Services Extérieurs</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">ligne budgetaire</label>
            <input
              type="text"
              name="beneficiaire"
              value={formData.ligneBudgetaire || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Nom du bénéficiaire"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Bénéficiaire</label>
            <input
              type="text"
              name="beneficiaire"
              value={formData.beneficiaire || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Nom du bénéficiaire"
              readOnly
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Objet</label>
            <input
              type="text"
              name="objetEngagement"
              value={formData.objetEngagement || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Objet de l'engagement"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Montant</label>
            <input
              type="number"
              name="montantEngagement"
              value={formData.montantEngagement || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Résponsable</label>
            <select
              name="responsable"
              value={formData.responsable || ''}
                onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              
            >
              <option value="">Sélectionner une responsable</option>
              <option value="611">611 - FARAJA</option>
              <option value="621">621 - MALU</option>
              <option value="622">622 - ESPOIRE</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Observations</label>
          <textarea
            name="observationsEngagement"
            value={formData.motif || ''}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            rows="3"
            placeholder="Observations..."
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Afficher la Liste
          </button>
        </div>
      </form>

      {showEngagementList && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Liste des Engagements</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">N° Engagement</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Bénéficiaire</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Montant</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Statut</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {engagements.map((eng) => (
                  <tr key={eng.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{eng.numero}</td>
                    <td className="border border-gray-300 px-4 py-2">{eng.date}</td>
                    <td className="border border-gray-300 px-4 py-2">{eng.beneficiaire}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {eng.montant.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <span className={`px-2 py-1 rounded text-sm ${
                        eng.statut === 'Validé' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {eng.statut}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">Voir</button>
                      <button className="text-green-600 hover:text-green-800">Modifier</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderLiquidationPage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Liquidation de Dépense</h2>
      
      <form onSubmit={handleAfficherLiquidationList}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
           <div>
              <label className="block text-gray-700 font-medium mb-2">Exercice Budgétaire</label>
              <select
                name="exercice"
                value={formData.exercice || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                required
                disabled
              >
                <option value="">Sélectionner l'exercice</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Projet</label>
              <select
                name="projet"
                value={formData.projet || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                required
                      >
                        <option value="">Sélectionner un projet</option>
                        <option value="611">611 - Projet 1</option>
                        <option value="612">612 - Projet 2</option>
                        <option value="613">613 - Projet 3</option>
               </select>
            </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Référence Engagement</label>
            <select
              name="engagementRef"
              value={formData.engagementRef || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Sélectionner un engagement</option>
              {engagements.map((eng) => (
                <option key={eng.id} value={eng.numero}>
                  {eng.numero} - {eng.beneficiaire}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Date de Liquidation</label>
            <input
              type="date"
              name="dateLiquidation"
              value={formData.dateLiquidation || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Montant Liquidé (FBU)</label>
            <input
              type="number"
              name="montantLiquidation"
              value={formData.montantLiquidation || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Mode de Paiement</label>
            <select
              name="modePaiement"
              value={formData.modePaiement || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Sélectionner un mode</option>
              <option value="Virement">Virement Bancaire</option>
              <option value="Cheque">Chèque</option>
              <option value="Especes">Espèces</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">N° de pièce</label>
            <input
              type="text"
              name="numeroFacture"
              value={formData.piece || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="N° de facture"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Validé par</label>
            <input
              type="text"
              name="validePar"
              value={formData.validePar || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Nom du validateur"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Observations</label>
          <textarea
            name="observationsLiquidation"
            value={formData.observationsLiquidation || ''}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            rows="3"
            placeholder="Observations..."
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Afficher la Liste
          </button>
        </div>
      </form>

      {showLiquidationList && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Liste des Liquidations</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">N° Liquidation</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Engagement</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Montant</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Statut</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {liquidations.map((liq) => (
                  <tr key={liq.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{liq.numero}</td>
                    <td className="border border-gray-300 px-4 py-2">{liq.engagement}</td>
                    <td className="border border-gray-300 px-4 py-2">{liq.date}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {liq.montant.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <span className={`px-2 py-1 rounded text-sm ${
                        liq.statut === 'Payé' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {liq.statut}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">Voir</button>
                      <button className="text-green-600 hover:text-green-800">Imprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderModalForm = () => {  
    if (modalType === "classe") {
    return (
      <form onSubmit={handleSubmitClasse(onSubmitClasse)} className='p-6'>
        <div className="mb-4">
          <label>Code</label>
           <input {...registerClasse("id", { required: false})} readOnly hidden/>
          <input {...registerClasse("code", { required: "Code obligatoire" })}
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsClasse.code ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ex: 1" />
          {errorsClasse.code && <span>{"Code obligatoire"}</span>}
        </div>
        <div className="mb-4">
          <label>Libellé</label>
          <input {...registerClasse("libelle", { required: "Libellé obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsClasse.code ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ex: Charges de Personnel" />
          {errorsClasse.libelle && <span>{"Libellé obligatoire"}</span>}
        </div>
        <div className="mb-4">
          <label>Type</label>
          <select {...registerClasse("type", { required: "Type obligatoire" })}
                    className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsClasse.type ? "border-red-500" : "border-gray-300"
          }`}>
            <option value="">Sélectionner un type</option>
            <option value="Dépense">Dépense</option>
            <option value="Recette">Recette</option>
          </select>
          {errorsClasse.type && <span>{"Type obligatoire"}</span>}
        </div>
       
         <div className="flex gap-4 mt-6">
           <button type="button" onClick={closeModal} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition">
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Enregistrer 
       </button>
    </div>
      </form>
    );
  }

  if (modalType === "planComptable") {
    return (
      <form onSubmit={handleSubmitPlancompte(onSubmitPlancompte)} className='p-6'>
        <div className="mb-4">
           <input {...registerPlancompte("id", { required: false})} readOnly hidden/>
          <label className="block text-gray-700 font-semibold mb-2" >Numéro de Compte</label>
          <input {...registerPlancompte("numero", { required: "Numéro obligatoire" })}  
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsPlancompte.numero ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ex: 611" />
          {errorsPlancompte.numero && <span>{errorsPlancompte.numero.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Intitulé</label>
          <input {...registerPlancompte("libelle", { required: "Intitulé obligatoire" })}
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsPlancompte.libelle ? "border-red-500" : "border-gray-300"
          }`} placeholder="Ex: Salaires et Traitements" />
          {errorsPlancompte.libelle && <span>{errorsPlancompte.libelle.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Classe</label>
          <select {...registerPlancompte("classe", { required: false })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500`}>
            <option value="">Sélectionner une classe</option>
            {
              classes?.map((element)=>(
                <option value={element.id}>{element.libelle}</option>
              ))
            }
          </select>
         </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Statut</label>
          <select {...registerPlancompte("sens", { required: "Statut obligatoire" })}
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsPlancompte.sens ? "border-red-500" : "border-gray-300"
          }`}>
            <option value="">Sélectionner un type de compte</option>
            <option value="ACTIF">Actif</option>
            <option value="PASSIF">Passif</option>
            <option value="NEUTRE">Neutre</option>
          </select>
          {errorsPlancompte.sens && <span>{errorsPlancompte.sens.message}</span>}
        </div>
       
         <div className="flex gap-4 mt-6">
           <button type="button" onClick={closeModal} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition">
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Enregistrer 
         </button>
       </div>
      </form>
    );
  }

  if (modalType === "projet") {
    return (
      <form onSubmit={handleSubmitProjet(onSubmitProjet)} className='p-6'>
        <div className="mb-4">
          <input {...registerProjet("id", { required: false})} readOnly hidden/>
          <label className="block text-gray-700 font-semibold mb-2">Code</label>
          <input {...registerProjet("code", { required: "Code obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsProjet.code ? "border-red-500" : "border-gray-300"
          }`}/>
          {errorsProjet.code && <span>{errorsProjet.code.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Intitulé</label>
          <input {...registerProjet("libelle", { required: "Intitulé obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsClasse.libelle ? "border-red-500" : "border-gray-300"
          }`}/>
          {errorsProjet.libelle && <span>{errorsProjet.libelle.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Date de début</label>
          <input type="date" {...registerProjet("dateDebut")} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsProjet.dateDebut ? "border-red-500" : "border-gray-300"
          }`}/>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Date de fin</label>
          <input type="date" {...registerProjet("dateFin")} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsProjet.dateFin ? "border-red-500" : "border-gray-300"
          }`}/>
        </div>
       
         <div className="flex gap-4 mt-6">
           <button type="button" onClick={closeModal} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition">
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Enregistrer 
         </button>
       </div>
      </form>
    );
  }

  if (modalType === "categorie") {
    return (
      <form onSubmit={handleSubmitCategorie(onSubmitCategorie)} className='p-6'>
        <div className="mb-4">
          <input {...registerCategorie("id", { required: false})} readOnly hidden/>
          <label className="block text-gray-700 font-semibold mb-2">Code</label>
          <input {...registerCategorie("code", { required: "Code obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsProjet.code ? "border-red-500" : "border-gray-300"
          }`} />
          {errorsCategorie.code && <span>{errorsCategorie.code.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Intitulé</label>
          <input {...registerCategorie("libelle", { required: "Intitulé obligatoire" })}  
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsCategorie.libelle ? "border-red-500" : "border-gray-300"
          }`}/>
          {errorsCategorie.libelle && <span>{errorsCategorie.libelle.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Projet</label>
          <select {...registerCategorie("projet", { required: "Projet obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsCategorie.projet ? "border-red-500" : "border-gray-300"
          }`} >
            <option value="">Sélectionner un projet</option>
            {
              projets?.map((element)=>(
                <option value={element.id}>{element.libelle}</option>
              ))
            }
          </select>
          {errorsCategorie.projet && <span>{errorsCategorie.projet.message}</span>}
        </div>
         <div className="flex gap-4 mt-6">
           <button type="button" onClick={closeModal} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition">
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Enregistrer 
         </button>
       </div>
      </form>
    );
  }

  if (modalType === "activite") {
    return (
      <form onSubmit={handleSubmitActivite(onSubmitActivite)} className='p-6'>
        <div className="mb-4">
          <input {...registerActivite("id", { required: false})} readOnly hidden/>
          <label className="block text-gray-700 font-semibold mb-2">Code</label>
          <input {...registerActivite("code", { required: "Code obligatoire" })} className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsActivite.code ? "border-red-500" : "border-gray-300"
          }`}/>
          {errorsActivite.code && <span>{errorsActivite.code.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Intitulé</label>
          <input {...registerActivite("libelle", { required: "Intitulé obligatoire" })} className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsActivite.libelle ? "border-red-500" : "border-gray-300"
          }`} />
          {errorsActivite.libelle && <span>{errorsActivite.libelle.message}</span>}
        </div> 
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Projet</label>
          <select {...registerActivite("projet", { required: "Projet obligatoire" })} className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsActivite.projet ? "border-red-500" : "border-gray-300"
          }`} onChange={(e)=>getCategorieByPrograme(e)}>
            <option value="">Sélectionner un projet</option>
           {
              projets?.map((element)=>(
                <option value={element.id}>{element.libelle}</option>
              ))
            }
          </select>
          {errorsActivite.projet && <span>{errorsActivite.projet.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Catégorie</label>
          <select {...registerActivite("categorie", { required: "Catégorie obligatoire" })} className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsActivite.categorie ? "border-red-500" : "border-gray-300"
          }`}>
            <option value="">Sélectionner une catégorie</option>
            {
              categories?.map((element)=>(
                <option value={element.id}>{element.libelle}</option>
              ))
            }
          </select>
          {errorsActivite.categorie && <span>{errorsActivite.categorie.message}</span>}
        </div>
         <div className="flex gap-4 mt-6">
           <button type="button" onClick={closeModal} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition">
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Enregistrer 
         </button>
       </div>
      </form>
    );
  }
  if (modalType === "typeBailleur") {
    return (
      <form onSubmit={handleSubmitTypebailleur(onSubmitTypebailleur)} className='p-6'>
        <div className="mb-4">
          <label>Libellé</label>
           <input {...registerTypebailleur("id", { required: false})} readOnly hidden/>
          <input {...registerTypebailleur("libelle", { required: "Libellé obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsTypebailleur.libelle ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ex: Charges de Personnel" />
          {errorsTypebailleur.libelle && <span>{"Libellé obligatoire"}</span>}
        </div> 
       
         <div className="flex gap-4 mt-6">
           <button type="button" onClick={closeModal} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition">
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Enregistrer 
       </button>
    </div>
      </form>
    );
  }
  if (modalType === "beneficiaire") {
    return (
      <form onSubmit={handleSubmitBeneficiere(onSubmitBeneficiere)} className='p-6'>
        <div className="mb-4">
          <label>Libellé</label>
           <input {...registerBeneficiere("id", { required: false})} readOnly hidden/>
          <input {...registerBeneficiere("libelle", { required: "Libellé obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsBeneficiere.libelle ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ex: Charges de Personnel" />
          {errorsBeneficiere.libelle && <span>{"Libellé obligatoire"}</span>}
        </div> 
       
         <div className="flex gap-4 mt-6">
           <button type="button" onClick={closeModal} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition">
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Enregistrer 
       </button>
    </div>
      </form>
    );
  }
  if (modalType === "bailleur") {
    return (
      <form onSubmit={handleSubmitBailleur(onSubmitBailleur)} className='p-6'>
        <div className="mb-4">
          <input {...registerBailleur("id", { required: false})} readOnly hidden/>
          <label className="block text-gray-700 font-semibold mb-2">Code</label>
          <input {...registerBailleur("code", { required: "Code obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsProjet.code ? "border-red-500" : "border-gray-300"
          }`} />
          {errorsBailleur.code && <span>{errorsBailleur.code.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Intitulé</label>
          <input {...registerBailleur("libelle", { required: "Intitulé obligatoire" })}  
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsBailleur.libelle ? "border-red-500" : "border-gray-300"
          }`}/>
          {errorsBailleur.libelle && <span>{errorsBailleur.libelle.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Bailleur</label>
          <select {...registerBailleur("idTypeSourcefinancement", { required: "Type obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsBailleur.idTypeSourcefinancement ? "border-red-500" : "border-gray-300"
          }`} >
            <option value="">Sélectionner type de bailleur</option>
            {
              typebailleurs?.map((element)=>(
                <option value={element.id}>{element.libelle}</option>
              ))
            }
          </select>
          {errorsBailleur.idTypeSourcefinancement && <span>{errorsBailleur.idTypeSourcefinancement.message}</span>}
        </div>
         <div className="flex gap-4 mt-6">
           <button type="button" onClick={closeModal} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition">
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Enregistrer 
         </button>
       </div>
      </form>
    );
  }
    if (modalType === "exercice") {
    return (
      <form onSubmit={handleSubmitExercice(onSubmitExercice)} className='p-6'>
        <div className="mb-4">
          <input {...registerExercice("id", { required: false})} readOnly hidden/>
          <label className="block text-gray-700 font-semibold mb-2">Code</label>
          <input {...registerExercice("code", { required: "Code obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsExercice.code ? "border-red-500" : "border-gray-300"
          }`}/>
          {errorsExercice.code && <span>{errorsExercice.code.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Intitulé</label>
          <input {...registerExercice("libelle", { required: "Intitulé obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsClasse.libelle ? "border-red-500" : "border-gray-300"
          }`}/>
          {errorsExercice.libelle && <span>{errorsExercice.libelle.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Date de début</label>
          <input type="date" {...registerExercice("dateDebut",{ required: "date obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsExercice.dateDebut ? "border-red-500" : "border-gray-300"
          }`}/>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Date de fin</label>
          <input type="date" {...registerExercice("dateFin",{ required: "date obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsExercice.dateFin ? "border-red-500" : "border-gray-300"
          }`}/>
        </div>

         <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Cloture</label>
          <input type="checkbox" {...registerExercice("cloture",{value:true})} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsExercice.cloture ? "border-red-500" : "border-gray-300"
          }`}/>
        </div>
       
         <div className="flex gap-4 mt-6">
           <button type="button" onClick={closeModal} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition">
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Enregistrer 
         </button>
       </div>
      </form>
    );
  }
    if (modalType === "devise") {
    return (
      <form onSubmit={handleSubmitDevise(onSubmitDevise)} className='p-6'>
        <div className="mb-4">
          <input {...registerDevise("id", { required: false})} readOnly hidden/>
          <label className="block text-gray-700 font-semibold mb-2">Code</label>
          <input {...registerDevise("code", { required: "Code obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsDevise.code ? "border-red-500" : "border-gray-300"
          }`}/>
          {errorsDevise.code && <span>{errorsDevise.code.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Intitulé</label>
          <input {...registerDevise("libelle", { required: "Intitulé obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsClasse.libelle ? "border-red-500" : "border-gray-300"
          }`}/>
          {errorsDevise.libelle && <span>{errorsDevise.libelle.message}</span>}
        </div>
         <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Symbole</label>
          <input {...registerDevise("symbole", { required: "Intitulé obligatoire" })} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsClasse.symbole ? "border-red-500" : "border-gray-300"
          }`}/>
          {errorsDevise.symbole && <span>{errorsDevise.symbole.message}</span>}
        </div>

         <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Actif</label>
          <input type="checkbox" {...registerDevise("cloture",{value:true})} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsDevise.actif ? "border-red-500" : "border-gray-300"
          }`}/>
        </div>
       
         <div className="flex gap-4 mt-6">
           <button type="button" onClick={closeModal} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition">
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Enregistrer 
         </button>
       </div>
      </form>
    );
  }
  return null;
};
 

  const renderContent = () => {
    // if (activeMenu === 'classification' && activeSubMenu === 'economique') {
    if (activeSubMenu === 'economique') {
      if (activePage === 'classe') return renderClassePage();
      if (activePage === 'planComptable') return renderPlanComptablePage();
    }
    
    if (activeSubMenu === 'programmatique') {
      if (activePage === 'projet') return renderProjetPage();
      if (activePage === 'categorie') return renderCategoriePage();
      if (activePage === 'activite') return renderActivitePage();
    }
    
    if (activeSubMenu === 'srcFinancement') {
      if (activePage === 'typeBailleur') return renderTypeBailleurPage();
      if (activePage === 'bailleur') return renderBailleurPage();
      if (activePage === 'beneficiaire') return renderBeneficiairePage();
    }

    if (activeMenu === 'parametre') { 
      if (activeSubMenu === 'exercice') return renderExercicePage();
      if (activeSubMenu === 'devise') return renderDevisePage(); 
    } 
    
    if (activeMenu === 'prevision' && activeSubMenu === 'elaboration') {
      return renderElaborationPage();
    }
    
    if (activeMenu === 'prevision' && activeSubMenu === 'plafond') {
      return renderPlafondPage();
    }
    
    if (activeMenu === 'prevision' && activeSubMenu === 'plafondNature') {
      return renderPlafondNaturePage();
    }
    
    if (activeMenu === 'prevision' && activeSubMenu === 'etatSortie') {
      if (activePage === 'parClasse') return renderDefaultPage('État de Sortie par Classe');
      if (activePage === 'parProjet') return renderDefaultPage('État de Sortie par Projet');
    }
    
    if (activeMenu === 'execution') {
      if (activeSubMenu === 'engagement') return renderEngagementPage();
      if (activeSubMenu === 'liquidation') return renderLiquidationPage();
      if (activeSubMenu === 'rapportEngagement') return renderDefaultPage('Rapport Engagement');
      if (activeSubMenu === 'rapportLiquidation') return renderDefaultPage('Rapport Liquidation');
    }
    
    return renderClassePage();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-gray-800 text-white transition-all duration-300 overflow-hidden`}>
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h1 className="text-xl font-bold">Budget Manager</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4">
          {menuStructure.map(menu => (
            <div key={menu.id} className="mb-2">
              <button
                onClick={() => {
                  setActiveMenu(menu.id);
                  toggleMenu(menu.id);
                  if (!menu.subMenus) {
                    setActiveSubMenu(null);
                  }
                }}
                className={`w-full flex items-center justify-between p-3 rounded transition ${
                  activeMenu === menu.id ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  {menu.icon}
                  <span>{menu.name}</span>
                </div>
                {menu.subMenus && (
                  expandedMenus[menu.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {menu.subMenus && expandedMenus[menu.id] && (
                <div className="ml-4 mt-2 space-y-1">
                  {menu.subMenus.map(subMenu => (
                    <div key={subMenu.id}>
                      <button
                        onClick={() => {
                          getAllDataInTable(subMenu.id);
                          handleSubMenuClick(subMenu.id);
                          if (subMenu.pages) {
                            toggleSubMenu(subMenu.id);
                          }
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded text-sm transition ${
                          activeSubMenu === subMenu.id ? 'text-green-500' : 'hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {subMenu.icon}
                          <span>{subMenu.name}</span>
                        </div>
                        {subMenu.pages && (
                          expandedSubMenus[subMenu.id] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
                        )}
                      </button>

                      {subMenu.pages && expandedSubMenus[subMenu.id] && (
                        <div className="ml-6 mt-1 space-y-1">
                          {subMenu.pages.map(page => (
                            <button
                              key={page.id}
                              onClick={() => {
                                setActivePage(page.id);
                                getAllDataInTable(page.id);
                              }}
                              className={`w-full text-left p-2 rounded text-sm transition ${
                                activePage === page.id ? 'bg-green-400' : 'hover:bg-gray-700'
                              }`}
                            >
                              {page.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded">
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            Gestion du Budget
          </h2>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                {modalType === 'classe' ? 'Ajouter une Classe' : 
                 modalType === 'planComptable' ? 'Ajouter un Compte' : 
                 'Ajouter un Élément'}
              </h3>
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
};

export default BudgetApp;