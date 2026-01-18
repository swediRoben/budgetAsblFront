import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign,Settings2,BadgeDollarSign } from 'lucide-react';
import {createProjet,deleteProjet,getAllProjet,updateProjet} from "../../data/classification/projet";
import {createBailleur,deleteBailleur,getAllBailleur,updateBailleur} from "../../data/classification/bailleur";
import {createExercice,deleteExercice,getAllExercice,updateExercice} from "../../data/classification/exercice";
import {createPlanfontprojet,deletePlanfontprojet,getAllPlanfontprojet,updatePlanfontprojet} from "../../data/classification/planfontprojet";
 import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast"; 

export default function renderPlafondPage (){ 

    const [projets, setProjets] = useState([]);
    const [projetId, setProjetId] = useState();
    const [exerciceId, setExerciceId] = useState(); 
    const [bailleurs, setBailleurs] = useState([]);  
    const [exercices, setExercices] = useState([]);
    const [planfondprojets, setPlanfontprojets] = useState([]);
     const [montantplafond, setMontantplafond] = useState(0.0);
 
    const dataProjet =async ()=>{
        const data=await getAllProjet(); 
        setProjets(data) 
      } 

     const dataBailleur =async ()=>{
        const data=await getAllBailleur(); 
        setBailleurs(data) 
      } 
      
      const dataExercice =async ()=>{
        const data=await getAllExercice(); 
        setExercices(data)
      } 
     
      const getAllDataInTable=()=>{  
          dataExercice();
          dataBailleur();
          dataProjet(); 
      }
     
    
      useEffect(()=>{
        return getAllDataInTable();
      },[])
       
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
    
  
    const hendleDeletePlanfondProjet=(id:number,exercice:any)=>{ 
      try {
        deletePlanfontprojet(id);  
        getPlanfondByExercice(exercice)
      toast.success("Supression effectuée avec succès !");
   
      } catch (error) {
      toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
        getPlanfondByExercice(exercice)
      }
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
        }
           
        const addDetailLinePlanfontprojet = () => {
          appendProjet({ id: null, idProjet: null, idSource: null, montant: "" });
        };
     
        const { fields: fieldsProjet,append: appendProjet,remove: removeProjet} = useFieldArray({
          control:controlProjet, 
          name: "details",
        });
        
       
        const removeDetailLinePlanfontprojet = (index: number) => {
          removeProjet(index);
        };
        
   

 return (
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
 


   
}