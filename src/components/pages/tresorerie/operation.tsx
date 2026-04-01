import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import { getAllClasse } from "../../../data/classification/classes";
import { getAllPlancompte } from "../../../data/classification/planComptable";
import { create,update,getAll } from "../../../data/classification/operationComptable";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";


const OperationForm = () => {
  const { register, control, handleSubmit, reset,
    formState: { errors }, } = useForm({
      defaultValues: {
        id:null,
        libelle: "",
        type: "",
        classeid: null,
        details: [{ id:null,debitid: null, creditid: null }],
      },
    });

  const [plancomptables, setPlancomptables] = useState([]);
  const [classes, setClasses] = useState([])
  
  const [operations, setOperations] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const dataClasse = async () => {
    const data = await getAllClasse();
    setClasses(data)
  }

   const dataAllOperation = async () => {
    const data = await getAll();
    setOperations(data)
  }

  const dataPlancompte = async () => {
    const data = await getAllPlancompte();
    setPlancomptables(data);
  }

  useEffect(() => {
    dataClasse();
    dataPlancompte();
    if (showModal) {
     dataAllOperation();
    }
  }, [])

  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

 

  
    const submitForm = async (data: any) => {
      try { 
          await create(data); 
        toast.success("Operation effectuée avec succès !");
        reset({
        id:null,
        libelle: "",
        type: "",
        classeid: null,
        details: [{ id:null,debitid: null, creditid: null }]}); 
      } catch (error: any) {
        toast.error("Erreur lors de l'operation'.", { style: { backgroundColor: "red", color: "white" } });
      }
    };
  
    const hendleDelete = (id: number) => {
      try {
        // deleteActivite(id);
        // dataActivite(projetId, null);
        toast.success("Supression effectuée avec succès !");
      
      } catch (error) {
        toast.error("Erreur lors de l'operation'.", { style: { backgroundColor: "red", color: "white" } });
        // setCategories([])
        // dataActivite(projetId, null);
      }
    }
  
    const hendleUpdata = (data: any) => {
      reset(data);
      setShowModal(false)
  
    }

    const getgetData=()=>{
      dataAllOperation();
       setShowModal(true);
    }
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Nouvelle opération comptable
        </h1>

        <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
          <div>
              <input {...register("id", { required: false })} readOnly hidden />
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Libellé
            </label>
            <input
              {...register("libelle", { required: true })}
              placeholder="Ex: Achat matériel"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Type</label>
              <select
                {...register("type")}
                className="w-full border rounded-xl px-3 py-2"
              >
                <option value="DEPENSE">DEPENSE</option>
                <option value="RECETTE">RECETTE</option>
              </select>
            </div> 
    

            <div>
              <label className="text-sm text-gray-600">Classe</label>
              <select
                {...register("classeid")}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.classeId ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white`}
              >
                <option value="">Choisir</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.type} - {c.libelle}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <h2 className="font-semibold mb-3">Lignes comptables</h2>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-3 gap-3 mb-3 items-center"
              >
                <div className="relative">

                  <div className=" z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                   
                 <input {...register(`details.${index}.id`, { required: false })} readOnly hidden />
                <select
                  {...register(`details.${index}.debitid`)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Débit</option>
                  {plancomptables.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p?.numero} - {p.libelle}
                    </option>
                  ))}
                </select> 
                  </div>

                </div> 
                
                <div className="relative"> 
                  <div className="z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                   
                      <select
                        {...register(`details.${index}.creditid`)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="">Crédit</option>
                        {plancomptables.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p?.numero} - {p.libelle}
                          </option>
                        ))}
                      </select>
                    
                  </div>

                </div>
                <div className="relative">
                  <div className="z-10 mt-1 w-12 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-1.5 rounded-lg transition-colors text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                   
                  </div>
                </div>
              </div>
            ))}

          <button
              type="button"
              onClick={() => append({ id:null, debitid: null, creditid: null })}
              className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded-xl hover:bg-indigo-600"
            >
              + Ajouter ligne
            </button>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button 
          className="flex items-center space-x-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
          Enregistrer
          </button>
          </div>
        </form>

        <button
          onClick={getgetData}
          className="mt-6 w-full bg-gray-800 text-white py-2 rounded-xl"
        >
          Voir les opérations
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-3/4 max-h-[80vh] overflow-auto shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Opérations</h2>

            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Libellé</th>
                  <th>Classe</th>
                  <th>Détails</th>
                  <th>Modifier</th>
                </tr>
              </thead>
              <tbody>
                {operations.map((op, i) => (
                  <tr key={i} className="border-t  text-center">
                    <td className="p-2">{op.libelle}</td>
                    <td>{op.classe.libelle}</td>
                    <td>
                      {op.details.map((d, j) => (
                        <div key={j}>
                          D: {d?.debit.numero}-{d?.debit.libelle} | C: {d?.credit.numero}-{d?.debit.libelle}
                        </div>
                      ))}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => hendleUpdata(op)}
                  > Modifier</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button 
              onClick={() => setShowModal(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-xl"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperationForm;