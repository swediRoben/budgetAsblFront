// import React, { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Trash2, Plus } from "lucide-react";

// // Types
// interface PlanComptable {
//   id: number;
//   numero: string;
//   libelle: string;
// }

// interface OperationDetail {
//   id: number;
//   debit?: PlanComptable;
//   credit?: PlanComptable;
// }

// interface OperationComptable {
//   id: number;
//   libelle: string;
//   type: string;
//   classe: string;
//   details: OperationDetail[];
// }

// // Fake data
// const comptes: PlanComptable[] = [
//   { id: 1, numero: "601", libelle: "Achat" },
//   { id: 2, numero: "401", libelle: "Fournisseur" },
//   { id: 3, numero: "512", libelle: "Banque" },
// ];

// const types = ["CHARGE", "PRODUIT", "ACTIF", "PASSIF"];

// export default function OperationComptableCRUD() {
//   const [operations, setOperations] = useState<OperationComptable[]>([]);
//   const [current, setCurrent] = useState<OperationComptable>({
//     id: 0,
//     libelle: "",
//     type: "",
//     classe: "",
//     details: [],
//   });

//   const addDetail = () => {
//     setCurrent({
//       ...current,
//       details: [...current.details, { id: Date.now() }],
//     });
//   };

//   const updateDetail = (index: number, field: string, value: any) => {
//     const updated = [...current.details];
//     updated[index] = { ...updated[index], [field]: value };
//     setCurrent({ ...current, details: updated });
//   };

//   const removeDetail = (index: number) => {
//     const updated = current.details.filter((_, i) => i !== index);
//     setCurrent({ ...current, details: updated });
//   };

//   const saveOperation = () => {
//     if (!current.libelle) return;

//     if (current.id === 0) {
//       setOperations([...operations, { ...current, id: Date.now() }]);
//     } else {
//       setOperations(
//         operations.map((op) => (op.id === current.id ? current : op))
//       );
//     }

//     resetForm();
//   };

//   const editOperation = (op: OperationComptable) => {
//     setCurrent(op);
//   };

//   const deleteOperation = (id: number) => {
//     setOperations(operations.filter((op) => op.id !== id));
//   };

//   const resetForm = () => {
//     setCurrent({ id: 0, libelle: "", type: "", classe: "", details: [] });
//   };

//   return (
//     <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
//       {/* Form */}
//       <Card className="lg:col-span-1">
//         <CardContent className="space-y-4 p-4">
//           <h2 className="text-xl font-bold">Operation Comptable</h2>

//           <Input
//             placeholder="Libellé"
//             value={current.libelle}
//             onChange={(e) => setCurrent({ ...current, libelle: e.target.value })}
//           />

//           <Select
//             value={current.type}
//             onValueChange={(value) => setCurrent({ ...current, type: value })}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Type" />
//             </SelectTrigger>
//             <SelectContent>
//               {types.map((t) => (
//                 <SelectItem key={t} value={t}>
//                   {t}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <Input
//             placeholder="Classe"
//             value={current.classe}
//             onChange={(e) => setCurrent({ ...current, classe: e.target.value })}
//           />

//           {/* Details */}
//           <div className="space-y-2">
//             <div className="flex justify-between items-center">
//               <h3 className="font-semibold">Détails</h3>
//               <Button size="sm" onClick={addDetail}>
//                 <Plus size={16} />
//               </Button>
//             </div>

//             {current.details.map((d, index) => (
//               <div key={d.id} className="flex gap-2 items-center">
//                 <Select
//                   onValueChange={(value) =>
//                     updateDetail(
//                       index,
//                       "debit",
//                       comptes.find((c) => c.id === Number(value))
//                     )
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Débit" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {comptes.map((c) => (
//                       <SelectItem key={c.id} value={String(c.id)}>
//                         {c.numero} - {c.libelle}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 <Select
//                   onValueChange={(value) =>
//                     updateDetail(
//                       index,
//                       "credit",
//                       comptes.find((c) => c.id === Number(value))
//                     )
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Crédit" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {comptes.map((c) => (
//                       <SelectItem key={c.id} value={String(c.id)}>
//                         {c.numero} - {c.libelle}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 <Button
//                   variant="destructive"
//                   size="icon"
//                   onClick={() => removeDetail(index)}
//                 >
//                   <Trash2 size={16} />
//                 </Button>
//               </div>
//             ))}
//           </div>

//           <div className="flex gap-2">
//             <Button onClick={saveOperation} className="w-full">
//               Enregistrer
//             </Button>
//             <Button variant="outline" onClick={resetForm}>
//               Reset
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* List */}
//       <Card className="lg:col-span-2">
//         <CardContent className="p-4">
//           <h2 className="text-xl font-bold mb-4">Liste des opérations</h2>

//           <div className="space-y-3">
//             {operations.map((op) => (
//               <div
//                 key={op.id}
//                 className="border rounded-xl p-3 flex justify-between items-center"
//               >
//                 <div>
//                   <p className="font-semibold">{op.libelle}</p>
//                   <p className="text-sm text-gray-500">
//                     {op.type} | {op.classe}
//                   </p>
//                 </div>

//                 <div className="flex gap-2">
//                   <Button size="sm" onClick={() => editOperation(op)}>
//                     Edit
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="destructive"
//                     onClick={() => deleteOperation(op.id)}
//                   >
//                     Delete
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// PARTIE DEUX

// import React, { useState } from "react";
// // import { motion } from "framer-motion";
// import { Plus, Trash2 } from "lucide-react";

// interface PlanComptable {
//   id: number;
//   numero: string;
//   libelle: string;
// }

// interface OperationDetail {
//   id: number;
//   debit?: PlanComptable;
//   credit?: PlanComptable;
// }

// interface OperationComptable {
//   id: number;
//   libelle: string;
//   type: string;
//   classe: string;
//   details: OperationDetail[];
// }

// const comptes: PlanComptable[] = [
//   { id: 1, numero: "601", libelle: "Achat" },
//   { id: 2, numero: "401", libelle: "Fournisseur" },
//   { id: 3, numero: "512", libelle: "Banque" },
// ];

// const types = ["CHARGE", "PRODUIT", "ACTIF", "PASSIF"];

// export default function ModernCRUD() {
//   const [operations, setOperations] = useState<OperationComptable[]>([]);
//   const [current, setCurrent] = useState<OperationComptable>({
//     id: 0,
//     libelle: "",
//     type: "",
//     classe: "",
//     details: [],
//   });

//   const addDetail = () => {
//     setCurrent({ ...current, details: [...current.details, { id: Date.now() }] });
//   };

//   const updateDetail = (index: number, field: string, value: any) => {
//     const updated = [...current.details];
//     updated[index] = { ...updated[index], [field]: value };
//     setCurrent({ ...current, details: updated });
//   };

//   const removeDetail = (index: number) => {
//     setCurrent({ ...current, details: current.details.filter((_, i) => i !== index) });
//   };

//   const save = () => {
//     if (!current.libelle) return;

//     if (current.id === 0) {
//       setOperations([...operations, { ...current, id: Date.now() }]);
//     } else {
//       setOperations(operations.map(o => (o.id === current.id ? current : o)));
//     }

//     setCurrent({ id: 0, libelle: "", type: "", classe: "", details: [] });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">

//         {/* FORM */}
//         <div
//         //   initial={{ opacity: 0, y: 20 }}
//         //   animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-2xl shadow-lg p-6 space-y-5"
//         >
//           <h2 className="text-2xl font-bold">Nouvelle opération</h2>

//           <input
//             className="w-full border rounded-xl p-3"
//             placeholder="Libellé"
//             value={current.libelle}
//             onChange={(e) => setCurrent({ ...current, libelle: e.target.value })}
//           />

//           <div className="grid grid-cols-2 gap-3">
//             <select
//               className="border rounded-xl p-3"
//               value={current.type}
//               onChange={(e) => setCurrent({ ...current, type: e.target.value })}
//             >
//               <option value="">Type</option>
//               {types.map(t => <option key={t}>{t}</option>)}
//             </select>

//             <input
//               className="border rounded-xl p-3"
//               placeholder="Classe"
//               value={current.classe}
//               onChange={(e) => setCurrent({ ...current, classe: e.target.value })}
//             />
//           </div>

//           {/* DETAILS */}
//           <div className="space-y-3">
//             <div className="flex justify-between items-center">
//               <h3 className="font-semibold">Écritures</h3>
//               <button
//                 onClick={addDetail}
//                 className="bg-black text-white px-3 py-1 rounded-lg flex items-center gap-1"
//               >
//                 <Plus size={16} /> Ajouter
//               </button>
//             </div>

//             {current.details.map((d, i) => (
//               <div
//                 key={d.id}
//                 // initial={{ opacity: 0 }}
//                 // animate={{ opacity: 1 }}
//                 className="grid grid-cols-3 gap-2"
//               >
//                 <select
//                   className="border rounded-lg p-2"
//                   onChange={(e) => updateDetail(i, "debit", comptes.find(c => c.id === +e.target.value))}
//                 >
//                   <option>Débit</option>
//                   {comptes.map(c => (
//                     <option key={c.id} value={c.id}>
//                       {c.numero}
//                     </option>
//                   ))}
//                 </select>

//                 <select
//                   className="border rounded-lg p-2"
//                   onChange={(e) => updateDetail(i, "credit", comptes.find(c => c.id === +e.target.value))}
//                 >
//                   <option>Crédit</option>
//                   {comptes.map(c => (
//                     <option key={c.id} value={c.id}>
//                       {c.numero}
//                     </option>
//                   ))}
//                 </select>

//                 <button
//                   onClick={() => removeDetail(i)}
//                   className="bg-red-500 text-white rounded-lg flex items-center justify-center"
//                 >
//                   <Trash2 size={16} />
//                 </button>
//               </div>
//             ))}
//           </div>

//           <button
//             onClick={save}
//             className="w-full bg-black text-white py-3 rounded-xl font-semibold"
//           >
//             Enregistrer
//           </button>
//         </div>

//         {/* LIST */}
//         <div className="space-y-4">
//           <h2 className="text-2xl font-bold">Opérations</h2>

//           {operations.map(op => (
//             <div
//             //   key={op.id}
//             //   initial={{ opacity: 0, y: 10 }}
//             //   animate={{ opacity: 1, y: 0 }}
//               className="bg-white p-4 rounded-2xl shadow flex justify-between items-center"
//             >
//               <div>
//                 <p className="font-semibold">{op.libelle}</p>
//                 <p className="text-sm text-gray-500">{op.type} • {op.classe}</p>
//               </div>

//               <button
//                 onClick={() => setOperations(operations.filter(o => o.id !== op.id))}
//                 className="text-red-500"
//               >
//                 Supprimer
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
