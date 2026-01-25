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
    <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-xl border border-gray-100 p-6">
  {/* Header */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
    <div>
      <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
        Élaboration du Budget
      </h2>
      <p className="text-sm text-gray-500 mt-1">
        Remplissez l’en-tête et ajoutez les lignes budgétaires en détail
      </p>
    </div> 
  </div>

  <form onSubmit={handleSubmitPrevision(onSubmitPrevision)} className="space-y-6">
    {/* En-tête */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">En-tête</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Exercice */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Exercice Budgétaire <span className="text-red-500">*</span>
          </label>
          <select
            {...registerPrevision("idExercice", { required: true })}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
            onChange={getPlanfondByExercice}
          >
            <option value="">Sélectionner l'exercice</option>
            {exercices.map((element) => (
              <option key={element.id} value={element.id}>
                {element.libelle}
              </option>
            ))}
          </select>
        </div>

        {/* Projet */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Projet <span className="text-red-500">*</span>
          </label>
          <select
            {...registerPrevision("idProjet", { required: true })}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
            onChange={(e) => getPlanfondNatureByprogramme(e.target.value)}
          >
            <option value="">Sélectionner le projet</option>
            {projets.map((element) => (
              <option key={element.id} value={element.id}>
                {element.code} - {element.libelle}
              </option>
            ))}
          </select>
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Catégorie <span className="text-red-500">*</span>
          </label>
          <select
            {...registerPrevision("idCategorie", { required: true })}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
            onChange={(e) => {
              getClasseInPlafondNatureByCaterie(e.target.value);
              getPrevisionByCategorie(e.target.value);
            }}
          >
            <option value="">Sélectionner la catégorie</option>
            {planfontNatures?.map((element) => (
              <option key={element?.categorie.id} value={element?.categorie.id}>
                {element?.categorie.code} - {element?.categorie.libelle}
              </option>
            ))}
          </select>
        </div>

        {/* Classe */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nature de dépense <span className="text-red-500">*</span>
          </label>
          <select
            {...registerPrevision("idClasse", { required: true })}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm shadow-sm focus:outline-none"
          >
            <option value={classeplafond?.id}>{classeplafond?.libelle}</option>
          </select>
        </div>

        {/* Montant plafond */}
        <div className="md:col-span-2">
          <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-200">
            <span className="text-sm font-semibold text-green-700">
              Montant total par catégorie :
            </span>
            <span className="text-sm font-bold text-green-900">
              {montantplafond}
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Détails */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h3 className="text-lg font-bold text-gray-800">Détails des Lignes Budgétaires</h3>

        <button
          type="button"
          onClick={() =>
            addDetailLinePlanfontPrevision({
              id: null,
              idPlanComptable: null,
              idSource: null,
              idBeneficiaire: null,
              idActivite: null,
              prixUnitaire: null,
              quantite: null,
              montant: "",
            })
          }
          className="inline-flex items-center justify-center rounded-xl bg-green-600 text-white px-5 py-2.5 font-semibold shadow hover:bg-green-700 transition"
        >
          + Ajouter une ligne
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="px-4 py-3 text-left font-bold">Compte</th>
              <th className="px-4 py-3 text-left font-bold">Bailleur</th>
              <th className="px-4 py-3 text-left font-bold">Bénéficiaire</th>
              <th className="px-4 py-3 text-left font-bold">Ligne Budgétaire</th>
              <th className="px-4 py-3 text-left font-bold">Prix Unitaire</th>
              <th className="px-4 py-3 text-left font-bold">Quantité</th>
              <th className="px-4 py-3 text-left font-bold">Montant</th>
              <th className="px-4 py-3 text-center font-bold w-24">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {fieldsPrevision.map((field, index) => (
              <tr key={field.id} className="hover:bg-gray-50 transition">
                {/* Hidden ID */}
                <td hidden>
                  <input
                    type="number"
                    {...registerPrevision(`details.${index}.id`, { required: false })}
                  />
                </td>

                {/* Compte */}
                <td className="px-3 py-3">
                  <select
                    {...registerPrevision(`details.${index}.idPlanComptable`, { required: true })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  >
                    <option value="">Compte comptable</option>
                    {plancomptables.map((element) => (
                      <option key={element.id} value={element.id}>
                        {element.numero} - {element.libelle}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Bailleur */}
                <td className="px-3 py-3">
                  <select
                    {...registerPrevision(`details.${index}.idSource`, { required: true })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  >
                    <option value="">Source de financement</option>
                    {bailleurs.map((element) => (
                      <option key={element.id} value={element.id}>
                        {element.code} - {element.libelle}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Beneficiaire */}
                <td className="px-3 py-3">
                  <select
                    {...registerPrevision(`details.${index}.idBeneficiaire`, { required: true })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  >
                    <option value="">Bénéficiaire</option>
                    {beneficieres.map((element) => (
                      <option key={element.id} value={element.id}>
                        {element.libelle}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Activité */}
                <td className="px-3 py-3">
                  <select
                    {...registerPrevision(`details.${index}.idActivite`, { required: true })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  >
                    <option value="">Activités</option>
                    {activites.map((element) => (
                      <option key={element.id} value={element.id}>
                        {element.code} - {element.libelle}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Prix unitaire */}
                <td className="px-3 py-3">
                  <input
                    type="number"
                    step="0.01"
                    {...registerPrevision(`details.${index}.prixUnitaire`, { required: true })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </td>

                {/* Quantité */}
                <td className="px-3 py-3">
                  <input
                    type="number"
                    step="0.01"
                    {...registerPrevision(`details.${index}.quantite`, { required: true })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </td>

                {/* Montant */}
                <td className="px-3 py-3">
                  <input
                    type="number"
                    step="0.01"
                    {...registerPrevision(`details.${index}.montant`, {
                      required: true,
                      disabled: true,
                    })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700"
                    placeholder="0.00"
                  />
                </td>

                {/* Action */}
                <td className="px-3 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => removePrevision(index)}
                    className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}

            {/* Total */}
            <tr className="bg-blue-50">
              <td className="px-4 py-3 font-bold text-right text-gray-700" colSpan={6}>
                Total
              </td>
              <td className="px-4 py-3 font-extrabold text-blue-900" colSpan={2}>
                {calculateTotal().toLocaleString("fr-FR", { minimumFractionDigits: 2 })} FBU
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Submit */}
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="rounded-xl bg-green-600 text-white px-8 py-3 font-semibold shadow-md hover:bg-green-700 transition"
        >
          Enregistrer
        </button>
      </div>
    </div>
  </form>
</div>

  );



   
}