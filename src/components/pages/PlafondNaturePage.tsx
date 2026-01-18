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


   
}