import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign,Settings2,BadgeDollarSign } from 'lucide-react';
import {createClasse,deleteClasse,getAllClasse,updateClasse} from "../../data/classification/classes";
import {createProjet,deleteProjet,getAllProjet,updateProjet} from "../../data/classification/projet";
import {createCategorie,deleteCategorie,getAllCategorie,updateCategorie,getAllCategorieByProgramme} from "../../data/classification/categorie";
import {createExercice,deleteExercice,getAllExercice,updateExercice} from "../../data/classification/exercice";
import {createPlanfontnature,deletePlanfontnature,getAllPlanfontnature,updatePlanfontnature} from "../../data/classification/planfontnature";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast"; 

export default function renderPlafonNaturePage (){ 

  const [classes, setClasses] = useState([]) 
    const [projets, setProjets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [projetId, setProjetId] = useState();
    const [exerciceId, setExerciceId] = useState();
    const [categorieId, setCategorieId] = useState();
      const [planfondprojets, setPlanfontprojets] = useState([]);
    const [exercices, setExercices] = useState([]);
    const [planfontNatures, setPlanfontNature] = useState([]);
    const [classeplafond, setClasseplafond] = useState();
    const [montantplafond, setMontantplafond] = useState(0.0);

    
     
    const totalProjetcategorie = (classes:any) =>
      Object.values(classes).reduce(
        (sum, cl:any) => sum + totalClasse(cl.categories),
        0
      );
    
     // GET
      const dataClasse =async ()=>{
        const data=await getAllClasse(); 
        setClasses(data) 
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
    }
    
    
    
      const dataExercice =async ()=>{
        const data=await getAllExercice(); 
        setExercices(data)
      }  
       
      const getAllDataInTable=()=>{  
          dataExercice(); 
          dataClasse(); 
          dataProjet();
      }

      useEffect(()=>{
        getAllDataInTable();
      },[])
   
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
    
      const [showModal, setShowModal] = useState(false);
      const [modalType, setModalType] = useState('');
      const [formData, setFormData] = useState({});
      const [detailLines, setDetailLines] = useState([{ id: 1, compte: '', montant: '' }]);
      const [showPreview, setShowPreview] = useState(false);
      const [showEngagementList, setShowEngagementList] = useState(false);
      const [showLiquidationList, setShowLiquidationList] = useState(false);
 
     

        const addDetailLinePlanfontnature = () => {
          appendNature({id: null, idClasse: null, idSource: null, montant: "",exercice:null });
        };
          
        
        const { fields: fieldsNature,append: appendNature,remove: removeNature} = useFieldArray({
          control:controlNature, 
          name: "details",
        });
         
         
        const removeDetailLinePlanfontnature = (index: number) => {
          removeNature(index);
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
        Plafond par nature
      </h2>
      <p className="text-sm text-gray-500 mt-1">
        Configurez les plafonds budgétaires par catégorie et nature de dépense
      </p>
    </div>
  </div>

  <form
    onSubmit={handleSubmitPlanfontNature(onSubmitPlanfontnature)}
    className="space-y-6"
  >
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
            {...registerPlanfontNature("exercice", { required: true })}
            onChange={getPlanfondByExercice}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm
              focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
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
            {...registerPlanfontNature("idProjet", { required: true })}
            onChange={(e) => getPlanfondNatureByprogramme(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm
              focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
          >
            <option value="">Sélectionner un projet</option>
            {projets.map((element) => (
              <option key={element.id} value={element.id}>
                {element.libelle}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>

    {/* Détails */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Détails des projets
          </h3>
          <p className="text-sm text-gray-500">
            Ajoutez les catégories, natures et montants plafonds
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            addDetailLinePlanfontnature({
              id: null,
              idCategorie: null,
              idClasse: null,
              montant: "",
              exercice: null,
            })
          }
          className="inline-flex items-center justify-center rounded-xl bg-green-600 text-white px-5 py-2.5
            font-semibold shadow hover:bg-green-700 transition"
        >
          + Ajouter une ligne
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="px-4 py-3 text-left font-bold">Catégorie</th>
              <th className="px-4 py-3 text-left font-bold">Nature</th>
              <th className="px-4 py-3 text-left font-bold">Montant</th>
              <th className="px-4 py-3 text-center font-bold w-24">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {fieldsNature.map((field, index) => (
              <tr key={field.id} className="hover:bg-gray-50 transition">
                {/* Catégorie */}
                <td className="px-3 py-3">
                  <select
                    {...registerPlanfontNature(`details.${index}.idCategorie`, {
                      required: true,
                    })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 shadow-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((element) => (
                      <option key={element.id} value={element.id}>
                        {element.libelle}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Nature */}
                <td className="px-3 py-3">
                  <select
                    {...registerPlanfontNature(`details.${index}.idClasse`, {
                      required: false,
                    })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 shadow-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                  >
                    <option value="">Sélectionner la nature de dépense</option>
                    {classes.map((element) =>
                      element.type === "Dépense" ? (
                        <option key={element.id} value={element.id}>
                          {element.libelle}
                        </option>
                      ) : null
                    )}
                  </select>
                </td>

                {/* Montant */}
                <td className="px-3 py-3">
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      {...registerPlanfontNature(`details.${index}.montant`, {
                        required: true,
                      })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 shadow-sm
                        focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                      placeholder="0.00"
                    />
                  </div>
                </td>

                {/* Supprimer */}
                <td className="px-3 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => removeNature(index)}
                    className="inline-flex items-center justify-center rounded-lg px-3 py-2
                      text-red-600 hover:bg-red-50 hover:text-red-700 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}

            {/* Total */}
            <tr className="bg-blue-50">
              <td className="px-4 py-3 font-bold text-center text-gray-700" colSpan={2}>
                Total
              </td>
              <td className="px-4 py-3 font-extrabold text-blue-900" colSpan={2}>
                {calculateTotal().toLocaleString("fr-FR", {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row justify-end gap-3 mt-6">
        <button
          type="submit"
          className="rounded-xl bg-green-600 text-white px-7 py-3 font-semibold shadow-md
            hover:bg-green-700 transition"
        >
          Enregistrer
        </button>

        <button
          type="button"
          className="rounded-xl bg-gray-900 text-white px-7 py-3 font-semibold shadow-md
            hover:bg-gray-800 transition"
        >
          Imprimer
        </button>
      </div>
    </div>
  </form>
</div>

  );


   
}