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
 <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-xl border border-gray-100 p-6">
  {/* Header */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
    <div>
      <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
        Plafond de dépense
      </h2>
      <p className="text-sm text-gray-500 mt-1">
        Définissez les plafonds budgétaires par projet et source de financement
      </p>
    </div>
  </div>

  <form
    onSubmit={handleSubmitPlanfontprojet(onSubmitPlanfontprojet)}
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
            {...registerPlanfontprojet("exercice", { required: true })}
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

          {errorsPlanfontprojet.exercice && (
            <p className="mt-2 text-xs text-red-600 font-medium">
              Champ obligatoire
            </p>
          )}
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
            Ajoutez les projets, bailleurs et montants plafonds
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            addDetailLinePlanfontprojet({
              id: null,
              idProjet: null,
              idSource: null,
              montant: "",
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
              <th className="px-4 py-3 text-left font-bold">Projet</th>
              <th className="px-4 py-3 text-left font-bold">Bailleur</th>
              <th className="px-4 py-3 text-left font-bold">Montant</th>
              <th className="px-4 py-3 text-center font-bold w-24">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {fieldsProjet.map((field, index) => (
              <tr key={field.id} className="hover:bg-gray-50 transition">
                {/* Hidden ID */}
                <td hidden>
                  <input
                    type="number"
                    {...registerPlanfontprojet(`details.${index}.id`, {
                      required: false,
                    })}
                  />
                </td>

                {/* Projet */}
                <td className="px-3 py-3">
                  <select
                    {...registerPlanfontprojet(`details.${index}.idProjet`, {
                      required: true,
                    })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 shadow-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                  >
                    <option value="">Sélectionner un projet</option>
                    {projets.map((element) => (
                      <option key={element.id} value={element.id}>
                        {element.libelle}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Bailleur */}
                <td className="px-3 py-3">
                  <select
                    {...registerPlanfontprojet(`details.${index}.idSource`)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 shadow-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                  >
                    <option value="">Sélectionner un bailleur</option>
                    {bailleurs.map((element) => (
                      <option key={element.id} value={element.id}>
                        {element.libelle}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Montant */}
                <td className="px-3 py-3">
                  <input
                    type="number"
                    step="0.01"
                    {...registerPlanfontprojet(`details.${index}.montant`, {
                      required: true,
                    })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 shadow-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
                    placeholder="0.00"
                  />
                </td>

                {/* Action */}
                <td className="px-3 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      const id = getValues(`details.${index}.id`);
                      const exercice = getValues("exercice");
                      hendleDeletePlanfondProjet(id, exercice);
                      removeDetailLinePlanfontprojet(index);
                    }}
                    className="inline-flex items-center justify-center rounded-lg px-3 py-2
                      text-red-600 hover:bg-red-50 hover:text-red-700 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
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
      </div>
    </div>
  </form>
</div>

  );
 


   
}