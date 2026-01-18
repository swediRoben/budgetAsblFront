import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign,Settings2,BadgeDollarSign } from 'lucide-react';
import {createClasse,deleteClasse,getAllClasse,updateClasse} from "../../data/classification/classes";
import {createPlancompte,deletePlancompte,getAllPlancompte,updatePlancompte} from "../../data/classification/planComptable";
import {createProjet,deleteProjet,getAllProjet,updateProjet} from "../../data/classification/projet";
import {createCategorie,deleteCategorie,getAllCategorie,updateCategorie,getAllCategorieByProgramme} from "../../data/classification/categorie";
import {createBailleur,deleteBailleur,getAllBailleur,updateBailleur} from "../../data/classification/bailleur";
import {createBeneficiere,deleteBeneficiere,getAllBeneficiere,updateBeneficiere} from "../../data/classification/beneficiere";
import {createExercice,deleteExercice,getAllExercice,updateExercice} from "../../data/classification/exercice";
import {createPlanfontprojet,deletePlanfontprojet,getAllPlanfontprojet,updatePlanfontprojet} from "../../data/classification/planfontprojet";
import {createPlanfontnature,deletePlanfontnature,getAllPlanfontnature,updatePlanfontnature} from "../../data/classification/planfontnature";
import {createPrevision,deletePrevision,getAllPrevision,updatePrevision} from "../../data/classification/prevision";
import {createActivite,deleteActivite,getAllActivite,updateActivite} from "../../data/classification/activite";

 import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast"; 

export default function renderElaborationPage (){ 

  const [classes, setClasses] = useState([]) 
    const [plancomptables, setPlancomptables] = useState([]);
    const [activites, setActivites] = useState([]);
    const [projets, setProjets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [projetId, setProjetId] = useState();
    const [exerciceId, setExerciceId] = useState();
    const [categorieId, setCategorieId] = useState();
    const [typebailleurs, setTypebailleurs] = useState([]);
  const [planfondprojets, setPlanfontprojets] = useState([]);
    const [bailleurs, setBailleurs] = useState([]); 
    const [beneficieres, setBeneficieres] = useState([]);
    const [exercices, setExercices] = useState([]);
    const [devises, setDevises] = useState([]); 
    const [planfontNatures, setPlanfontNature] = useState([]);
    const [previsions, setPrevisions] = useState([]);
    const [classeplafond, setClasseplafond] = useState();
    const [montantplafond, setMontantplafond] = useState(0.0);

 
    
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
      
       
        
      
        const dataPlanfontprojet =async (e:any)=>{
          const data=await getAllPlanfontprojet(e); 
          setPlanfontprojets(data) 
        } 
    
     const getCategorieByProjet=async (e:any)=>{ 
        const data=await getAllCategorie(e); 
        setProjetId(e)
        setCategories(data) 
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
    
    
      const  getActiviteByCategorie=async (e:any)=>{ 
        const data=await getAllActivite(null,e); 
        setActivites(data) 
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
    
  
    
      const getAllDataInTable=()=>{  
          dataExercice();
          dataBailleur();
          dataProjet(); 
          dataBenefiere(); 
      }
     
     useEffect(()=>{
      getAllDataInTable();
     },[])
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
     
      const [detailLines, setDetailLines] = useState([{ id: 1, compte: '', montant: '' }]);
    

        // tous mes get by :
    
         const getProjets=()=>{
          dataProjet()
        }
      
        const getBailleurs=()=>{
          dataBailleur()
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
                               
                          }else{ 
                            setPlanfontprojets([])  
                          } 
                          setPlanfontNature([])
                          setPrevisions([])
                        }
    
        const addDetailLinePlanfontPrevision= () => {
          appendPrevision({id: null,idPlanComptable: null,idSource:null,idBeneficiaire: null,idActivite:null,prixUnitaire:null, quantite:null,montant: "",exercice:null });
        };
 
        const {  fields: fieldsPrevision,append: appendPrevision,remove: removePrevision } = useFieldArray({
          control:controlPrevision,  
          name: "details",
        });
        
    
        
        const removeDetailLinePlanfontPrevision = (index: number) => {
          removePrevision(index);
        };
        
          const handleDetailChange = (id, field, value:any) => {
            setDetailLines(detailLines.map(line => 
              line.id === id ? { ...line, [field]: value } : line
            ));
          };
        
    
         
          const calculateTotal = () => {
            return detailLines.reduce((sum, line:any) => sum + (parseFloat(line.montant) || 0), 0);
          };

 
  return (
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
                  {...registerPrevision(`details.${index}.id`, { required: false })}
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



   
}