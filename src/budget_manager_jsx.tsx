import React, { useEffect, useMemo, useState } from 'react';
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
  const [projetId, setProjetId] = useState();
  const [exerciceId, setExerciceId] = useState();
  const [categorieId, setCategorieId] = useState();
  const [activites, setActivites] = useState([]);
  const [typebailleurs, setTypebailleurs] = useState([]);
  const [bailleurs, setBailleurs] = useState([]); 
  const [beneficieres, setBeneficieres] = useState([]);
  const [exercices, setExercices] = useState([]);
  const [devises, setDevises] = useState([]);
  const [planfondprojets, setPlanfontprojets] = useState([]);
  const [planfontNatures, setPlanfontNature] = useState([]);
  const [previsions, setPrevisions] = useState([]);
  const [classeplafond, setClasseplafond] = useState();
  const [montantplafond, setMontantplafond] = useState(0.0);
 


//ETAT DE SORTIE CATEGORIE
  const groupeCategorieid = useMemo(() => {
  const res = {};
   
  planfontNatures.forEach(item => {
    const pid = item.projet?.id ?? item.idProjet;
    const cid = item.categorie?.id ?? item.idCategorie;
    const classId = item.classe?.id ?? item.idClasse;

    if (!res[pid]) {
      res[pid] = {
        projet: item.projet,
        classes: {}
      };
    }

    if (!res[pid].classes[classId]) {
      res[pid].classes[classId] = {
        classe: item.classe,
        categories: []
      };
    }

    res[pid].classes[classId].categories.push({
      ...item,
      montant: Number(String(item.montant).replace(/,/g, "")) || 0
    });
  });

  return res;
}, [planfontNatures]);
const totalClasse = (cats:any) =>
  cats.reduce((sum, c:any) => sum + c.montant, 0);

const totalProjetcategorie = (classes:any) =>
  Object.values(classes).reduce(
    (sum, cl:any) => sum + totalClasse(cl.categories),
    0
  );

    // ETAT DE SORTIE ACTIVITE
 const grouped = useMemo(() => {
  const res = {};

  previsions.forEach((item:any) => {
    const pid = item.projet?.id ?? item.idProjet;
    const cid = item.categorie?.id ?? item.idCategorie;

    if (!res[pid])
      res[pid] = {
        projet: item.projet,
        categories: {},
      };

    if (!res[pid].categories[cid])
      res[pid].categories[cid] = {
        categorie: item.categorie,
        acts: [],
      };

    // Convertir pu, quantite, montant
    const pu = Number(String(item.prixUnitaire).replace(/,/g, "")) || 0;
    const quantite = Number(String(item.quantite).replace(/,/g, "")) || 0;
    const montant = Number(String(item.montant).replace(/,/g, "")) || 0;

    res[pid].categories[cid].acts.push({
      ...item,
      pu,
      quantite,
      montant,
      bailleur: item.source,
    });
  });

  return res;
}, [previsions]);

 const totalCategorie = (acts:any) =>
    acts.reduce((sum, a:any) => sum + a.montant, 0);

  const totalProjet = (categories:any) =>
    Object.values(categories).reduce(
      (sum, cat:any) => sum + totalCategorie(cat.acts),
      0
    );

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

 const getCategorieByProjet=async (e:any)=>{ 
    const data=await getAllCategorie(e); 
    setProjetId(e)
    setCategories(data) 
  } 
  const  getActiviteByProjet=async (e:any)=>{ 
    const data=await getAllActivite(e,null); 
    dataActivite(data) 
  } 

  
  const  getPlanfondNatureByprogramme=async (e:any)=>{ 
    
    const value=e;
    getCategorieByProjet(e)
     if (value!=="") { 
      const data=await getAllPlanfontnature(exerciceId,e); 
      setPlanfontNature(data)

      if (data.length > 0) { 
      resetPlanfontNature({
        exercice:exerciceId,
        idProjet:value,
        details: data.map((p:any) => ({
          id: p.id,
          idCategorie:p.idCategorie,
          idClasse:p.idClasse,
          montant: p.montant, 
          exercice:null 
        })),
      });
     }else{
      resetPlanfontNature({
        exercice:exerciceId,
        idProjet:value,
          details: [
            {id: null,idCategorie:null, idClasse:null,montant: "",exercice:null }
          ]
        });
      }
    }else{
      resetPlanfontNature({
        exercice:exerciceId,
        idProjet:value,
          details: [
            {id: null,idCategorie:null, idClasse:null,montant: "",exercice:null }
          ]
      });
    } 
  } 

  const getPrevisionByCategorie=async (e:any)=>{ 
    
    const value=e; 
     if (value!=="") { 
      const data=await getAllPrevision(exerciceId,projetId,e); 
      setPrevisions(data)

      if (data.length > 0) { 
      resetPrevision({
        idExercice: data[0].idExercice,
        idProjet: data[0].idProjet,
        idCategorie: data[0].idCategorie,
        idClasse: data[0].idClasse,  
        details: data.map((p:any) => ( 
          {
            id: p.id,
            idActivite:p.idActivite,
            idSource:p.idSource,
            idPlanComptable: p.idPlanComptable,
            idBeneficiaire: p.idBeneficiaire, 
            quantite:p.quantite,
            prixUnitaire:p.prixUnitaire,
            montant: p.montant
          }
        )),
      });
     }else{
         resetPrevision({
        idExercice: exerciceId,
        idProjet: projetId,
        idCategorie: value,
        idClasse: null,  
        details: data.map((p:any) => (
          {
            id: null,
            idActivite:null,
            idSource:null,
            idPlanComptable:null,
            idBeneficiaire: null, 
            quantite:null,
            prixUnitaire:null,
            montant:null
          }
        )),
      });
      }
    }else{
         resetPrevision({
        idExercice: exerciceId,
        idProjet: projetId,
        idCategorie: null,
        idClasse: null,  
        details: data.map((p:any) => (
          {
            id: null,
            idActivite:null,
            idSource:null,
            idPlanComptable:null,
            idBeneficiaire: null, 
            quantite:null,
            prixUnitaire:null,
            montant:null
          }
        )),
      });
    } 
  } 

  
 const getPrevisionParProjet=async (e:any)=>{
    const value=e; 
     if (value!=="") { 
      const data=await getAllPrevision(exerciceId,e,null); 
      setPrevisions(data) 
     }
  } 

const getClasseInPlafondNatureByCaterie = (e: any) => { 

  const id = Number(e); 

  const data = planfontNatures.find(v => Number(v.idCategorie) === id); 

  if (data !== undefined) { 
    setClasseplafond(data?.classe); 
    setMontantplafond(data.montant); 
    getActiviteByCategorie(data?.idCategorie)
    getPlancomptables();
    getBailleurs();
    getBeneficiaires();
  } else {
    setClasseplafond(null);
    setMontantplafond(0.0);
  }
};



  const  getActiviteByCategorie=async (e:any)=>{ 
    const data=await getAllActivite(null,e); 
    setActivites(data) 
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

  const dataPlanfontprojet =async (e:any)=>{
    const data=await getAllPlanfontprojet(e); 
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

  const getAllDataInTable=(type:string)=>{
    console.log("far !!!! "+type) 
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
    }else if(type==='plafond'){
      dataExercice();
      dataBailleur();
      dataProjet();
    }else if(type==='plafondNature'){
      dataExercice(); 
      dataClasse(); 
      dataProjet();
    }else if(type==='elaboration'){
      dataExercice();
      dataBailleur();
      dataProjet();
    }else if(type==='parProjet'){
      dataExercice();
      dataBailleur();
    }else if(type==='parClasse'){
      dataExercice(); 
      dataProjet();
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
      control:controlProjet,   
      getValues, 
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
      control:controlNature,
      reset: resetPlanfontNature,
      formState: { errors: errorsPlanfontNature },
    }  = useForm({
        defaultValues: {
          exercice: null,
          idProjet:null,
          details: [
            {id: null, idCategorie: null, idClasse: null, montant: "",exercice:null }
          ]
        }
});

    const {
      register: registerPrevision,
      handleSubmit: handleSubmitPrevision,
      control:controlPrevision,
      reset: resetPrevision,
      formState: { errors: errorsPrevision },
    } = useForm({
        defaultValues: {
          idExercice: null,
          idProjet: null,
          idCategorie: null,
          idClasse: null,
          details: [
            {id: null,idPlanComptable: null,idSource:null,idBeneficiaire: null,idActivite:null,prixUnitaire:null, quantite:null,montant: "",exercice:null }
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
            data.projetId=parseInt(data.projetId);
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
          } catch (error:any) {
            toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
          }
      };  
 
  const onSubmitPlanfontnature = async (data:any) => { 
       try { 
      const exercices=data.exercice;
      const idProjet=data.idProjet;
            data.details.map(async element=>{
              element.id=parseInt(element.id);
              element.montant=element.montant; 
              element.categorie=parseInt(element.categorie); 
              element.idProjet=parseInt(idProjet);
              element.idClasse=parseInt(element.idClasse);
              element.idExercice=parseInt(exercices);  
             if (!element.id) { 
              await createPlanfontnature(element);
            } else { 
              await updatePlanfontnature(element.id,element); 
            }
            })
           
            toast.success("Operation effectuée avec succès !"); 
          } catch (error:any) {
            toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
          }
      };
 
  const onSubmitPrevision = async (data:any) => { 
     try { 
      const exercices=data.idExercice;
      const idProjet=data.idProjet;
      const idCategorie=data.idCategorie;
      const idClasse=data.idClasse;
            data.details.map(async element=>{
              element.id=parseInt(element.id); 
              element.idExercice=parseInt(exercices); 
              element.idCategorie=parseInt(idCategorie); 
              element.idProjet=parseInt(idProjet);
              element.idClasse=parseInt(idClasse);
              element.idSource=parseInt(element.idSource);
              element.idActivite=parseInt(element.idActivite);
              element.idPlanComptable=parseInt(element.idPlanComptable);
              element.idBeneficiaire=parseInt(element.idBeneficiaire);  
              element.quantite=parseFloat(element.quantite);
              element.prixUnitaire=parseFloat(element.prixUnitaire);
              const montants=element.prixUnitaire*element.quantite;
              element.montant=montants===0?element.montant:montants; 
             if (!element.id) { 
              await createPrevision(element);
            } else { 
              await updatePrevision(element.id,element); 
            }
            })
            
            toast.success("Operation effectuée avec succès !"); 
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
 
    }
  }

  const hendleDeletePlanfondProjet=(id:number,exercice:any)=>{ 
    try {
      deletePlanfontprojet(id);  
      getPlanfondByExercice(exercice)
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
    classification: false,  
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
    { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
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
 ///////////
  const handleSubMenuClick = (subMenu:any) => {  
 
    if (subMenu!=='etatSortie') { 
    setActivePage('') 
    setActiveSubMenu(subMenu);
    }
     
  };

  const openModal = (type:any) => {
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

  const getPlanfondByExercice=async (e:any)=>{ 
    const value=e.target.value;
     if (value!=="") { 
         setExerciceId(value)
         const data=await getAllPlanfontprojet(e.target.value);
         setPlanfontprojets(data)  
      if (data.length > 0) { 
      resetPlanfontprojet({
        exercice:e.target.value, // exemple : même exercice pour tous
        details: data.map((p:any) => ({
          id: p.id,
          idProjet: p.idProjet,
          idSource: p.idSource,
          montant: p.montant, 
        })),
      });
     }else{
      resetPlanfontprojet({
        exercice:e.target.value,
          details: [
            {id: null, idProjet: null, idSource: null, montant: "",exercice:null }
          ]
      });
    } 
    }else{
      resetPlanfontprojet({
        exercice: null,
        details: [
          {id: null, idProjet: null, idSource: null, montant: "",exercice:null }
        ]
      });
      setPlanfontprojets([]) 
    }
    setPlanfontNature([])
    setPrevisions([])
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

  const handleInputChange = (e:any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e:any) => {
    e.preventDefault(); 
    closeModal();
  };

  
const addDetailLinePlanfontprojet = () => {
  appendProjet({ id: null, idProjet: null, idSource: null, montant: "" });
};

const addDetailLinePlanfontnature = () => {
  appendNature({id: null, idClasse: null, idSource: null, montant: "",exercice:null });
};

const addDetailLinePlanfontPrevision= () => {
  appendPrevision({id: null,idPlanComptable: null,idSource:null,idBeneficiaire: null,idActivite:null,prixUnitaire:null, quantite:null,montant: "",exercice:null });
};

const { fields: fieldsProjet,append: appendProjet,remove: removeProjet} = useFieldArray({
  control:controlProjet, 
  name: "details",
});

const { fields: fieldsNature,append: appendNature,remove: removeNature} = useFieldArray({
  control:controlNature, 
  name: "details",
});

const {  fields: fieldsPrevision,append: appendPrevision,remove: removePrevision } = useFieldArray({
  control:controlPrevision,  
  name: "details",
});

const removeDetailLinePlanfontprojet = (index: number) => {
  removeProjet(index);
};

const removeDetailLinePlanfontnature = (index: number) => {
  removeNature(index);
};

const removeDetailLinePlanfontPrevision = (index: number) => {
  removePrevision(index);
};

  const handleDetailChange = (id, field, value:any) => {
    setDetailLines(detailLines.map(line => 
      line.id === id ? { ...line, [field]: value } : line
    ));
  };

  const handleAfficher = (e:any) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const calculateTotal = () => {
    return detailLines.reduce((sum, line:any) => sum + (parseFloat(line.montant) || 0), 0);
  };

  const handleAfficherEngagementList = (e:any) => {
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

  const handleAfficherLiquidationList = (e:any) => {
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
            { id: 'parProjet', name: 'Plafond par projet' },
            { id: 'parClasse', name: 'Prevision par nature' },
            { id: 'parActivite', name: 'prevision annuelle' }
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
        }
        ,
        { 
          id: 'movementCredit', 
          name: 'Mouvement credit',
          icon: <DollarSign className="w-4 h-4" />
        },
        { 
          id: 'traitementEngagement', 
          name: 'Traitement engagement',
          icon: <DollarSign className="w-4 h-4" />
        },
        { 
          id: 'traitementLiquidation', 
          name: 'Traitement liquidation',
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
        },
        { 
          id: 'rapportMouvmentcerdit', 
          name: 'Rapport Mouvement credit',
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
    {classes?.map((datas, i:any) => (
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
          {classes?.map((classe:any) => (
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
            {plancomptables?.map((plancompte, index:any) => {
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
            {projets?.map((projet, index:any) => (
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
        <select className="border border-gray-300 rounded px-4 py-2"
          onChange={(e)=>{getCategorieByProjet(e.target.value)}}
              onClick={dataProjet}>
          <option value="">Tous les projets</option>
          {projets?.map((projet:any) => (
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
            {categories?.map((categorie, index:any) => (
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
            {typebailleurs?.map((type, index:any) => (
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
            {typebailleurs?.map((type:any) => (
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
            {bailleurs?.map((bailleur, index:any) => (
              <tr key={bailleur.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{bailleur.code || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{bailleur.libelle}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {bailleur?.typSourceFinancement?.libelle || 'N/A'}
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
          <select className="border border-gray-300 rounded px-1 py-2"
            onChange={(e)=>{getCategorieByProjet(e.target.value);getActiviteByProjet(e.target.value)}}
              onClick={dataProjet}
              >
            <option value="">Tous les projets</option>
            {projets?.map((projet:any) => (
              <option key={projet.id} value={projet.id}>
                {projet.libelle}
              </option>
            ))}
          </select>
          <select className="border border-gray-300 rounded px-1 py-2"
           onChange={(e)=>{getActiviteByCategorie(e.target.value)}}>
            <option value="">Tous les Categories</option>
            {categories?.map((data:any) => (
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
            {activites?.map((activite, index:any) => (
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
            {beneficieres?.map((beneficiere, index:any) => (
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
                    onClick={() => hendleDelete(beneficiere.id,'beneficiaire')}
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
            {exercices?.map((exercice, index:any) => (
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
                    {exercice.cloture && 'closed' || exercice.execution && 'executed' || exercice.preparation && 'preparation'}
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
            {devises?.map((devise, index:any) => (
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

  const renderDefaultPage = (title:any) => (
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
      {Object.entries(groupeCategorieid).map(([pid, p]:any) => (
        <>
          {Object.entries(p.classes).map(([classId, c]:any) => (
            <>
              {c.categories.map(cat => (
                <tr key={cat.id}>
                  <td className="p-2 border border-gray-300 text-sm">
                    {p.projet.libelle}
                  </td>
                  <td className="p-2 border border-gray-300 text-sm">
                    {c.classe.libelle}
                  </td>
                  <td className="p-2 border border-gray-300 text-sm">
                    {cat.categorie.libelle}
                  </td>
                  <td className="p-2 border border-gray-300 text-sm">
                    {cat.montant.toLocaleString()}
                  </td>
                </tr>
              ))}

              {/* TOTAL CLASS */}
              <tr className="bg-orange-100 font-bold">
                <td className="p-2 border border-gray-300 text-sm">{p.projet.libelle}</td>
                <td className="p-2 border border-gray-300 text-sm">
                  {c.classe.libelle} (Total)
                </td>
                <td className="p-2 border border-gray-300 text-sm"></td>
                <td className="p-2 border border-gray-300 text-sm">
                  {totalClasse(c.categories).toLocaleString()}
                </td>
              </tr>
            </>
          ))}

          {/* TOTAL PROJET */}
          <tr className="bg-green-200 font-bold text-base">
            <td className="p-2 border border-gray-300 text-sm" colSpan={3}>
              TOTAL {p.projet.libelle}
            </td>
            <td className="p-2 border border-gray-300 text-sm">
              {totalProjetcategorie(p.classes).toLocaleString()}
            </td>
          </tr>
        </>
      ))}
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
  {Object.entries(grouped).map(([pid, projetData], pIndex:any) => {
    const categories = projetData.categories;
    const totProj = totalProjet(categories);

    return (
      <React.Fragment key={pid}>
        {/* PROJET */}
        <tr className="bg-[#d9e1f2] font-semibold">
          <td className="p-3 border border-gray-300">{String(pIndex + 1).padStart(2, "0")}</td>
          <td className="p-3 border border-gray-300" colSpan={5}>
            {projetData.projet?.libelle}
          </td>
          <td className="p-3 border border-gray-300">{totProj.toLocaleString()}</td>
          <td className="p-3 border border-gray-300">—</td>
        </tr>

        {/* CATEGORIES */}
        {Object.entries(categories).map(([cid, catData], cIndex:any) => {
          const totCat = totalCategorie(catData.acts);

          return (
            <React.Fragment key={cid}>
              {/* CATEGORIE */}
              <tr className="bg-[#fce4d6] font-semibold">
                <td className="p-3 border border-gray-300">{String(cIndex + 1).padStart(3, "0")}</td>
                <td className="p-3 border border-gray-300" colSpan={5}>
                  {catData.categorie?.libelle}
                </td>
                <td className="p-3 border border-gray-300">{totCat.toLocaleString()}</td>
                <td className="p-3 border border-gray-300">—</td>
              </tr>

              {/* ACTIVITÉS */}
              {catData.acts.map((act, aIndex:any) => (
                <tr key={aIndex}>
                  <td className="p-3 border border-gray-300">{act.activite?.code}</td> 
                  <td className="p-3 border border-gray-300">{act.activite?.libelle}</td>
                  <td className="p-3 border border-gray-300">{act.debut}</td>
                  <td className="p-3 border border-gray-300">{act.fin}</td>

                  <td className="p-3 border border-gray-300">{act.quantite}</td>
                  <td className="p-3 border border-gray-300">{act.pu.toLocaleString()}</td>
                  <td className="p-3 border border-gray-300">{act.montant.toLocaleString()}</td>
                  <td className="p-3 border border-gray-300">{act.bailleur?.libelle}</td>
                </tr>
              ))}
            </React.Fragment>
          );
        })}

        {/* TOTAL FINAL PROJET */}
        <tr className="bg-[#c6efce] font-bold text-base">
          <td className="p-3 border border-gray-300" colSpan={6}>
            TOTAL {projetData.projet?.libelle}
          </td>
          <td className="p-3 border border-gray-300" colSpan={2}>
            {totProj.toLocaleString()}
          </td>
        </tr>
      </React.Fragment>
    );
  })}
</tbody>
    </table>
</div> 
  );
  // ETAT DE SORTIE

  const renderparProjetPage = (title:any) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Exercice Budgétaire
        </label>
        <select
          {...registerPlanfontprojet("exercice", { required: true })}
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          onChange={getPlanfondByExercice} 
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
    <br />

<div className="bg-white p-6 rounded-lg border border-gray-300 shadow-md max-w-5xl mx-auto"> 

  <table className="w-full border-collapse mt-2">
    <thead>
      <tr className="bg-blue-900 text-white text-left text-sm">
        <th className="p-2 border border-gray-300">PROJET</th>
        <th className="p-2 border border-gray-300">SOURCE FINANCEMENT</th>
        <th className="p-2 border border-gray-300">MONTANT</th>
      </tr>
    </thead>

    <tbody>
      {planfondprojets.map((p:any) => (
      
          <tr className="bg-orange-100 font-bold">
                <td className="p-2 border border-gray-300 text-sm">{p.projet?.libelle} </td>
                <td className="p-2 border border-gray-300 text-sm">{p.sourceFinacement?.libelle}</td>
                <td className="p-2 border border-gray-300 text-sm">
                  {p.montant.toLocaleString()}
                </td>
              </tr>
              
          ))}

         
    </tbody>
  </table>
</div>

</div> 
  );
const renderparClassePage = (title:any) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
       <div className="bg-gray-50 p-6 rounded-lg mb-6"> 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Exercice */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Exercice Budgétaire
              </label> 

              <select
                {...registerPlanfontNature("exercice", { required: true })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                  // onClick={getExerciceencours}
                   onChange={getPlanfondByExercice} 
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
                 onChange={(e)=>getPlanfondNatureByprogramme(e.target.value)}
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

<div className="bg-white p-6 rounded-lg border border-gray-300 shadow-md max-w-5xl mx-auto"> 

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
      {Object.entries(groupeCategorieid).map(([pid, p]:any) => (
        <>
          {Object.entries(p.classes).map(([classId, c]:any) => (
            <>
              {c.categories.map(cat => (
                <tr key={cat.id}>
                  <td className="p-2 border border-gray-300 text-sm">
                    {p.projet.libelle}
                  </td>
                  <td className="p-2 border border-gray-300 text-sm">
                    {c.classe.libelle}
                  </td>
                  <td className="p-2 border border-gray-300 text-sm">
                    {cat.categorie.libelle}
                  </td>
                  <td className="p-2 border border-gray-300 text-sm">
                    {cat.montant.toLocaleString()}
                  </td>
                </tr>
              ))}

              {/* TOTAL CLASS */}
              <tr className="bg-orange-100 font-bold">
                <td className="p-2 border border-gray-300 text-sm">{p.projet.libelle}</td>
                <td className="p-2 border border-gray-300 text-sm">
                  {c.classe.libelle} (Total)
                </td>
                <td className="p-2 border border-gray-300 text-sm"></td>
                <td className="p-2 border border-gray-300 text-sm">
                  {totalClasse(c.categories).toLocaleString()}
                </td>
              </tr>
            </>
          ))}

          {/* TOTAL PROJET */}
          <tr className="bg-green-200 font-bold text-base">
            <td className="p-2 border border-gray-300 text-sm" colSpan={3}>
              TOTAL {p.projet.libelle}
            </td>
            <td className="p-2 border border-gray-300 text-sm">
              {totalProjetcategorie(p.classes).toLocaleString()}
            </td>
          </tr>
        </>
      ))}
    </tbody>
  </table>
</div>

</div> 
  );

const renderparActivitePage = (title:any) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
       <div className="bg-gray-50 p-6 rounded-lg mb-6"> 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Exercice */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Exercice Budgétaire
              </label> 

              <select
                {...registerPlanfontNature("exercice", { required: true })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                onClick={dataExercice} 
                onChange={getPlanfondByExercice} 
                >
                <option value="">Sélectionner l'exercice</option>
                {
                  exercices.map((element:any)=>(
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
                 onChange={(e)=>{getPrevisionParProjet(e.target.value)}}
             >
                  <option value="">Sélectionner un projet</option>
                  {
                    planfondprojets.map((element:any)=>(
                    <option value={element.projet.id}>{element.projet.libelle}</option>
                    ))
                  }
                </select>
            </div>
          </div>
        </div> 

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
  {Object.entries(grouped).map(([pid, projetData], pIndex:any) => {
    const categories = projetData.categories;
    const totProj = totalProjet(categories);

    return (
      <React.Fragment key={pid}>
        {/* PROJET */}
        <tr className="bg-[#d9e1f2] font-semibold">
          <td className="p-3 border border-gray-300">{String(pIndex + 1).padStart(2, "0")}</td>
          <td className="p-3 border border-gray-300" colSpan={5}>
            {projetData.projet?.libelle}
          </td>
          <td className="p-3 border border-gray-300">{totProj.toLocaleString()}</td>
          <td className="p-3 border border-gray-300">—</td>
        </tr>

        {/* CATEGORIES */}
        {Object.entries(categories).map(([cid, catData], cIndex:any) => {
          const totCat = totalCategorie(catData.acts);

          return (
            <React.Fragment key={cid}>
              {/* CATEGORIE */}
              <tr className="bg-[#fce4d6] font-semibold">
                <td className="p-3 border border-gray-300">{String(cIndex + 1).padStart(3, "0")}</td>
                <td className="p-3 border border-gray-300" colSpan={5}>
                  {catData.categorie?.libelle}
                </td>
                <td className="p-3 border border-gray-300">{totCat.toLocaleString()}</td>
                <td className="p-3 border border-gray-300">—</td>
              </tr>

              {/* ACTIVITÉS */}
              {catData.acts.map((act, aIndex:any) => (
                <tr key={aIndex}>
                  <td className="p-3 border border-gray-300">{act.ligne}</td>
                  <td className="p-3 border border-gray-300">{act.activite?.libelle}</td>
                  <td className="p-3 border border-gray-300">{act.datebebut}</td>
                  <td className="p-3 border border-gray-300">{act.datefin}</td>

                  <td className="p-3 border border-gray-300">{act.quantite}</td>
                  <td className="p-3 border border-gray-300">{act.pu.toLocaleString()}</td>
                  <td className="p-3 border border-gray-300">{act.montant.toLocaleString()}</td>
                  <td className="p-3 border border-gray-300">{act.bailleur?.libelle}</td>
                </tr>
              ))}
            </React.Fragment>
          );
        })}

        {/* TOTAL FINAL PROJET */}
        <tr className="bg-[#c6efce] font-bold text-base">
          <td className="p-3 border border-gray-300" colSpan={6}>
            TOTAL {projetData.projet?.libelle}
          </td>
          <td className="p-3 border border-gray-300" colSpan={2}>
            {totProj.toLocaleString()}
          </td>
        </tr>
      </React.Fragment>
    );
  })}
</tbody>
    </table> 
    

</div> 
  );

// FIN ETAT DE SORTIE
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

    <form onSubmit={handleSubmitPrevision(onSubmitPrevision)}>
      {/* En-tête */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">En-tête</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
          {/* Exercice */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Exercice Budgétaire</label>
              <select
                {...registerPrevision("idExercice", { required: true })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                  // onClick={getExerciceencours}
                   onChange={getPlanfondByExercice}
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
                  {...registerPrevision("idProjet", { required: true })}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              onChange={(e)=>getPlanfondNatureByprogramme(e.target.value)}
               >
                  <option value="">Sélectionner le projet</option>
                  {
                    projets.map((element)=>(
                    <option value={element.id}>{element.code} - {element.libelle}</option>
                    ))
                  }
                </select>
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Categorie</label>
            <select
              {...registerPrevision("idCategorie", { required: true })}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              onChange={(e)=>{getClasseInPlafondNatureByCaterie(e.target.value);getPrevisionByCategorie(e.target.value)}}
           >
            <option value="">Sélectionner le categorie</option>
              {
                planfontNatures?.map((element)=>(
               <option value={element?.categorie.id}>{element?.categorie.code} - {element?.categorie.libelle}</option>
                    ))
                  }
            </select>
          </div>

          {/* Classe */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Nature de dépense</label>
            <select
              {...registerPrevision("idClasse", { required: true })}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              >
               <option value={classeplafond?.id}>{classeplafond?.libelle}</option>
            </select> 
          </div>

          <div>
            <span className="px-4 py-2 bg-green-600 text-white rounded-full font-semibold text-sm shadow">
              Montant total par catégorie est de <strong>{montantplafond}</strong>
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
            onClick={()=>addDetailLinePlanfontPrevision({id: null,idPlanComptable: null,idSource:null,idBeneficiaire: null,idActivite:null,prixUnitaire:null, quantite:null,montant: "" })}
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
                <th className="border border-gray-300 px-4 py-2 text-left">Ligne Budgetaire</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Prix unitaire</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Quantité</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Montant</th>
                <th className="border border-gray-300 px-4 py-2 text-center w-24">Action</th>
              </tr>
            </thead>

            <tbody>
              {fieldsPrevision.map((field, index:any) => (
                <tr key={field.id} className="hover:bg-gray-100">

                     <td className="border border-gray-300 px-2 py-2" hidden>
                <input
                  type="number"
                  {...registerPlanfontprojet(`details.${index}.id`, { required: false })}
                  className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                  placeholder="0.00" 
                />
              </td>

                  {/* Compte */}
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      {...registerPrevision(`details.${index}.idPlanComptable`, { required: true })}
                      className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                    >
                     <option value="">compte comptables</option>
                      {
                        plancomptables.map((element)=>(
                        <option value={element.id}>{element.numero} - {element.libelle}</option>
                        ))
                      }
                    </select>
                  </td>

                  {/* Bailleur */}
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      {...registerPrevision(`details.${index}.idSource`, { required: true })}
                      className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Source de financement</option>
                           {
                        bailleurs.map((element)=>(
                        <option value={element.id}>{element.code} - {element.libelle}</option>
                        ))
                      }
                    </select>
                  </td>

                {/* Beneficiaire */}
                  <td className="border border-gray-300 px-2 py-2">
                    <select
                      {...registerPrevision(`details.${index}.idBeneficiaire`, { required: true })}
                      className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                      >
                      <option value="">Beneficiaire</option> 
                           {
                        beneficieres.map((element)=>(
                        <option value={element.id}>{element.libelle}</option>
                        ))
                      }
                    </select>
                  </td>

                   <td className="border border-gray-300 px-2 py-2">
                    <select
                      {...registerPrevision(`details.${index}.idActivite`, { required: true })}
                      className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Activiés</option> 
                           {
                        activites.map((element)=>(
                        <option value={element.id}>{element.code} - {element.libelle}</option>
                        ))
                      }
                    </select>
                  </td>

                   <td className="border border-gray-300 px-2 py-2">
                    <input
                      type="number"
                      step="0.01"
                      {...registerPrevision(`details.${index}.prixUnitaire`, { required: true })}
                      className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </td>
                   
                   <td className="border border-gray-300 px-2 py-2">
                    <input
                      type="number"
                      step="0.01"
                      {...registerPrevision(`details.${index}.quantite`, { required: true })}
                      className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                      placeholder="0.00"
                    />
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

                  {/* Action */}
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => removePrevision(index)} 
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
                <td className="border border-gray-300 px-4 py-2" colSpan={5}>
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
          onChange={getPlanfondByExercice} 
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
          {fieldsProjet.map((field, index:any) => (
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
                  onClick={ () =>{
                    const id = getValues(`details.${index}.id`);
                    const exercice = getValues("exercice");
                    hendleDeletePlanfondProjet(id, exercice);
                    removeDetailLinePlanfontprojet(index); 
                  }}
                  className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                  // disabled={fields.length === 1}
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
                  // onClick={getExerciceencours}
                   onChange={getPlanfondByExercice}
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
              onChange={(e)=>getPlanfondNatureByprogramme(e.target.value)}
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
                addDetailLinePlanfontnature({id: null, idCategorie: null, idClasse: null, montant: "",exercice:null })
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
                {fieldsNature.map((field, index:any) => (
                  <tr key={field.id} className="hover:bg-gray-100">
                

                    {/* Catégorie */}
                    <td className="border border-gray-300 px-2 py-2">
                      <select
                        {...registerPlanfontNature(`details.${index}.idCategorie`, { required: true })}
                        className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
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
                        {...registerPlanfontNature(`details.${index}.idClasse`, { required: false })}
                        className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                        >
                        <option value="">Sélectionner la nature de depense</option>
                       {
                          classes.map((element) => {
                            return element.type === "Dépense" ? (
                              <option key={element.id} value={element.id}>
                                {element.libelle}
                              </option>
                            ) : null;
                          })
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
                        onClick={() => removeNature(index)} 
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
   <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
  {/* Header */}
  <div className="mb-8 border-b pb-4">
    <h2 className="text-2xl font-semibold text-gray-800">
      Engagement de Dépense
    </h2>
    <p className="text-sm text-gray-500 mt-1">
      Saisie et consultation des engagements budgétaires
    </p>
   <p className="mt-3 text-sm font-medium flex flex-wrap gap-3">
  <span
    onClick={() => handleFilterStatus('VALIDE')}
    className="cursor-pointer select-none rounded-full
               bg-green-50 px-4 py-1.5 text-green-700
               border border-green-200
               hover:bg-green-100 hover:shadow-sm transition"
  >
    Validé <strong>3</strong>
  </span>

  <span
    onClick={() => handleFilterStatus('RETOURNE')}
    className="cursor-pointer select-none rounded-full
               bg-yellow-50 px-4 py-1.5 text-yellow-700
               border border-yellow-200
               hover:bg-yellow-100 hover:shadow-sm transition"
  >
    Retourné <strong>4</strong>
  </span>

  <span
    onClick={() => handleFilterStatus('REJETE')}
    className="cursor-pointer select-none rounded-full
               bg-red-50 px-4 py-1.5 text-red-700
               border border-red-200
               hover:bg-red-100 hover:shadow-sm transition"
  >
    Rejeté <strong>5</strong>
  </span>

  <span
    onClick={() => handleFilterStatus('RECEPTIONNE')}
    className="cursor-pointer select-none rounded-full
               bg-blue-50 px-4 py-1.5 text-blue-700
               border border-blue-200
               hover:bg-blue-100 hover:shadow-sm transition"
  >
    Réceptionné <strong>6</strong>
  </span>
</p>

  </div>

  {/* Formulaire */}
  <form onSubmit={handleAfficherEngagementList} className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {/* Exercice */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Exercice budgétaire
        </label>
        <select
          name="exercice"
          value={formData.exercice || ''}
          onChange={handleInputChange}
          disabled
          required
          className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sélectionner</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date d’engagement
        </label>
        <input
          type="date"
          name="dateEngagement"
          value={formData.dateEngagement || ''}
          onChange={handleInputChange}
          required
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                     focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Projet */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Projet
        </label>
        <select
          name="projet"
          value={formData.projet || ''}
          onChange={handleInputChange}
          required
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                     focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sélectionner un projet</option>
          <option value="611">611 - Projet 1</option>
          <option value="612">612 - Projet 2</option>
          <option value="613">613 - Projet 3</option>
        </select>
      </div>

      {/* Ligne budgétaire */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ligne budgétaire
        </label>
        <select
          name="ligneBudgetaire"
          value={formData.ligneBudgetaire || ''}
          onChange={handleInputChange}
          required
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                     focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sélectionner une ligne</option>
          <option value="611">611 - Salaires et traitements</option>
          <option value="621">621 - Fournitures de bureau</option>
          <option value="622">622 - Services extérieurs</option>
        </select>
      </div>

      {/* Bénéficiaire */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bénéficiaire
        </label>
        <input
          type="text"
          name="beneficiaire"
          value={formData.beneficiaire || ''}
          readOnly
          className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
        />
      </div>

      {/* Responsable */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Responsable
        </label>
        <select
          name="responsable"
          value={formData.responsable || ''}
          onChange={handleInputChange}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                     focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sélectionner</option>
          <option value="FARAJA">FARAJA</option>
          <option value="MALU">MALU</option>
          <option value="ESPOIRE">ESPOIRE</option>
        </select>
      </div>

      {/* Objet */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Objet de l’engagement
        </label>
        <input
          type="text"
          name="objetEngagement"
          value={formData.objetEngagement || ''}
          onChange={handleInputChange}
          required
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                     focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Montant */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Montant
        </label>
        <input
          type="number"
          step="0.01"
          name="montantEngagement"
          value={formData.montantEngagement || ''}
          onChange={handleInputChange}
          required
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                     focus:ring-2 focus:ring-blue-500"
        />
      </div>
        {/* Bloc récapitulatif visuel */}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border rounded-lg bg-gray-50 p-4">
      <div>
        <p className="text-xs text-gray-500">Montant engagé</p>
        <p className="text-lg font-semibold text-gray-800">—</p>
      </div>
      <div>
        <p className="text-xs text-gray-500">montant alloué</p>
        <p className="text-lg font-semibold text-blue-700">—</p>
      </div>
      <div>
        <p className="text-xs text-gray-500">Montant restant</p>
        <p className="text-lg font-semibold text-green-700">—</p>
      </div>
    </div>
    {/* Observations */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Observations
      </label>
      <textarea
       readOnly
       disabled
        name="observationsEngagement"
        rows={3}
        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm
                   focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Actions */}
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={()=>setShowEngagementList(true)}
        className="inline-flex items-center rounded-md bg-blue-600 px-6 py-2 text-sm
                   font-medium text-white hover:bg-blue-700 transition"
      >
        Afficher la liste
      </button>
    </div>
  </form>

  {/* Liste */}
{showEngagementList && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white w-[90%] max-w-6xl rounded-xl shadow-xl">

      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">
          📄 Liste des engagements
        </h3>
        <button
          onClick={() => setShowEngagementList(false)}
          className="text-gray-500 hover:text-red-600 text-xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left">N°</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Bénéficiaire</th>
                <th className="px-4 py-3 text-right">Montant</th>
                <th className="px-4 py-3 text-center">Statut</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {engagements.map((eng) => (
                <tr
                  key={eng.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{eng.numero}</td>
                  <td className="px-4 py-2">{eng.date}</td>
                  <td className="px-4 py-2">{eng.beneficiaire}</td>

                  <td className="px-4 py-2 text-right font-medium">
                    {eng.montant.toLocaleString('fr-FR', {
                      minimumFractionDigits: 2,
                    })}
                  </td>

                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          eng.statut === 'Validé'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                    >
                      {eng.statut}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-center space-x-2">
                    <button className="px-3 py-1 text-xs rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100">
                      Voir
                    </button>
                    <button className="px-3 py-1 text-xs rounded-md bg-green-50 text-green-600 hover:bg-green-100">
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end px-6 py-4 border-t bg-gray-50 rounded-b-xl">
        <button
          onClick={() => setShowEngagementList(false)}
          className="px-4 py-2 text-sm rounded-md bg-gray-600 text-white hover:bg-gray-700"
        >
          Fermer
        </button>
      </div>

    </div>
  </div>
)}

</div>

  );

  const renderLiquidationPage = () => (
   <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
  {/* Header */}
  <div className="mb-8 border-b pb-4">
    <h2 className="text-2xl font-semibold text-gray-800">
      Liquidation de Dépense
    </h2>
    <p className="text-sm text-gray-500 mt-1">
      Saisie des informations de liquidation
    </p>
  </div>

  <form onSubmit={handleAfficherLiquidationList} className="space-y-8">

    {/* Bloc informations générales */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Exercice budgétaire
        </label>
        <select
          disabled
          className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
        >
          <option>2025</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Projet
        </label>
        <select className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm">
          <option>Sélectionner un projet</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Référence engagement
        </label>
        <select className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm">
          <option>Sélectionner un engagement</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date de liquidation
        </label>
        <input
          type="date"
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
        />
      </div>

      {/* Devise */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Devise
        </label>
        <select className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm">
          <option>FBU</option>
          <option>USD</option>
          <option>EUR</option>
        </select>
      </div>

      {/* Taux */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Taux de change
        </label>
        <input
          type="number"
          placeholder="0.00"
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
        />
      </div>

      {/* Montant liquidé */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Montant liquidé
        </label>
        <input
          type="number"
          placeholder="0.00"
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
        />
      </div>

      {/* Montant total */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Montant total (FBU)
        </label>
        <input
          type="text"
          readOnly
          className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
          placeholder="—"
        />
      </div>
    </div>

    {/* Bloc récapitulatif visuel */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border rounded-lg bg-gray-50 p-4">
      <div>
        <p className="text-xs text-gray-500">Montant engagé</p>
        <p className="text-lg font-semibold text-gray-800">—</p>
      </div>
      <div>
        <p className="text-xs text-gray-500">Montant liquidé</p>
        <p className="text-lg font-semibold text-blue-700">—</p>
      </div>
      <div>
        <p className="text-xs text-gray-500">Montant restant</p>
        <p className="text-lg font-semibold text-green-700">—</p>
      </div>
    </div>

    {/* Paiement */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mode de paiement
        </label>
        <select className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm">
          <option>Sélectionner</option>
          <option>Virement bancaire</option>
          <option>Chèque</option>
          <option>Espèces</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          N° de pièce
        </label>
        <input
          type="text"
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Validé par
        </label>
        <input
          type="text"
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
        />
      </div>
    </div>

    {/* Observations */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Observations
      </label>
      <textarea
        rows={3}
        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
        placeholder="Observations..."
      />
    </div>

    {/* Actions */}
    <div className="flex justify-end">
      <button
        type="submit"
        className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white
                   hover:bg-blue-700 transition"
      >
        Afficher la liste
      </button>
    </div>
  </form>
</div>


  );

const renderRapportEngagementPage = () => (
  <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold uppercase">Rapport d’Engagement Budgétaire</h2>
      <button
        onClick={() => window.print()}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Imprimer
      </button>
    </div>

    <div className="flex justify-between mb-6">
      <div className="space-y-1">
        <p className="text-gray-700"><span className="font-medium">ONG / ASBL :</span> ____________________</p>
        <p className="text-gray-700"><span className="font-medium">Exercice :</span> 2025</p>
      </div>
      <div className="space-y-1">
        <p className="text-gray-700"><span className="font-medium">N° Engagement :</span> ENG-001</p>
        <p className="text-gray-700"><span className="font-medium">Date :</span> ____ / ____ / 2025</p>
      </div>
    </div>

    <table className="w-full border-collapse border border-gray-300 mb-6">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 px-4 py-2 text-left">Programme</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Activité</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Ligne budgétaire</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Montant engagé</th>
        </tr>
      </thead>
      <tbody>
        <tr className="hover:bg-gray-50">
          <td className="border border-gray-300 px-4 py-2">Santé</td>
          <td className="border border-gray-300 px-4 py-2">Achat médicaments</td>
          <td className="border border-gray-300 px-4 py-2">60101</td>
          <td className="border border-gray-300 px-4 py-2">________</td>
        </tr>
      </tbody>
    </table>

    <div className="flex justify-between mt-12">
      <div className="text-center">
        <p className="text-gray-700 font-medium">Ordonnateur</p>
        <div className="border-t border-gray-700 mt-8 w-40 mx-auto"></div>
      </div>
      <div className="text-center">
        <p className="text-gray-700 font-medium">Responsable financier</p>
        <div className="border-t border-gray-700 mt-8 w-40 mx-auto"></div>
      </div>
    </div>
  </div>
);


const renderRapportLiquidationPage = () => (
  <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold uppercase">Rapport de Liquidation</h2>
      <button
        onClick={() => window.print()}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Imprimer
      </button>
    </div>

    <div className="flex justify-between mb-6">
      <div className="space-y-1">
        <p className="text-gray-700"><span className="font-medium">ONG / ASBL :</span> ____________________</p>
        <p className="text-gray-700"><span className="font-medium">N° Engagement :</span> ENG-001</p>
      </div>
      <div className="space-y-1">
        <p className="text-gray-700"><span className="font-medium">N° Liquidation :</span> LIQ-001</p>
        <p className="text-gray-700"><span className="font-medium">Date :</span> ____ / ____ / 2025</p>
      </div>
    </div>

    <table className="w-full border-collapse border border-gray-300 mb-6">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 px-4 py-2 text-left">Fournisseur</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Objet</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Référence pièce</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Montant liquidé</th>
        </tr>
      </thead>
      <tbody>
        <tr className="hover:bg-gray-50">
          <td className="border border-gray-300 px-4 py-2">Pharmacie ABC</td>
          <td className="border border-gray-300 px-4 py-2">Achat médicaments</td>
          <td className="border border-gray-300 px-4 py-2">FACT-001</td>
          <td className="border border-gray-300 px-4 py-2">________</td>
        </tr>
      </tbody>
    </table>

    <div className="flex justify-between mt-12">
      <div className="text-center">
        <p className="text-gray-700 font-medium">Comptable</p>
        <div className="border-t border-gray-700 mt-8 w-40 mx-auto"></div>
      </div>
      <div className="text-center">
        <p className="text-gray-700 font-medium">Ordonnateur</p>
        <div className="border-t border-gray-700 mt-8 w-40 mx-auto"></div>
      </div>
    </div>
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
          <select {...registerPlancompte("classeId", { required: false })} 
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
          <select {...registerCategorie("projetId", { required: "Projet obligatoire" })} 
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
          <select {...registerActivite("projetId", { required: "Projet obligatoire" })} className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsActivite.projet ? "border-red-500" : "border-gray-300"
          }`} onChange={(e)=>getCategorieByProjet(e.target.value)}
              onClick={dataProjet}>

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
          <select {...registerActivite("categorieId", { required: "Catégorie obligatoire" })} className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
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
 
        <div className="mb-4" style={{display:'flex'}}>
          <label className="block text-gray-700 font-semibold mb-2">preparation</label>
          <input type="checkbox" {...registerExercice("preparation",{value:false})} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsExercice.cloture ? "border-red-500" : "border-gray-300"
          }`}/>
        </div>

        <div className="mb-4" style={{display:'flex'}}>
          <label className="block text-gray-700 font-semibold mb-2">Execution</label>
          <input type="checkbox" {...registerExercice("execution",{value:false})} 
          className={`w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500 ${
              errorsExercice.cloture ? "border-red-500" : "border-gray-300"
          }`}/>
        </div>

         <div className="mb-4" style={{display:'flex'}}>
          <label className="block text-gray-700 font-semibold mb-2">Cloture</label>
          <input type="checkbox" {...registerExercice("cloture",{value:false})} 
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
      if (activePage === 'classe') return renderClassePage();
      if (activePage === 'planComptable') return renderPlanComptablePage();
 
    
      if (activePage === 'projet') return renderProjetPage();
      if (activePage === 'categorie') return renderCategoriePage();
      if (activePage === 'activite') return renderActivitePage();
  
    
      if (activePage === 'typeBailleur') return renderTypeBailleurPage();
      if (activePage === 'bailleur') return renderBailleurPage();
      if (activePage === 'beneficiaire') return renderBeneficiairePage();
   

      if (activeSubMenu === 'exercice') return renderExercicePage();
      if (activeSubMenu === 'devise') return renderDevisePage(); 
 
    
    if (activeSubMenu === 'elaboration') return renderElaborationPage();
    
    if (activeSubMenu === 'plafond') return renderPlafondPage();
    if (activeSubMenu === 'plafondNature') return renderPlafondNaturePage();
      

      if (activePage === 'parProjet') return renderparProjetPage('État de Sortie par Projet');
      if (activePage === 'parClasse') return renderparClassePage('État de Sortie par Nature');
      if (activePage === 'parActivite') return renderparActivitePage('État de Sortie par Activite');
   
      if (activeSubMenu === 'engagement') return renderEngagementPage();
      if (activeSubMenu === 'liquidation') return renderLiquidationPage();
      // if (activeSubMenu === 'traitementLiquidation') return renderLiquidationPage();
      // if (activeSubMenu === 'traitementEngagement') return renderLiquidationPage();
      // if (activeSubMenu === 'movementCredit') return renderLiquidationPage();
      // if (activeSubMenu === 'traitementEngagement') return renderLiquidationPage();
      if (activeSubMenu === 'rapportEngagement') return renderRapportEngagementPage();
      if (activeSubMenu === 'rapportLiquidation') return renderRapportLiquidationPage();
      // if (activeSubMenu === 'rapportMouvementCredit') return renderDefaultPage('Rapport Mouvement credit');
   
    return null;
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