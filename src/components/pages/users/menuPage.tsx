import React, { useEffect, useState } from "react";
import { getAllRole } from "../../../data/utilisateur/role";
import { create, getAllMenu } from "../../../data/utilisateur/menu";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const menuss = [
  "CLASSIFICATION",
  "PREVISION",
  "EXECUTION",
  "TRESORERIE",
  "COMPTABILITE",
  "PARAMENTRAGE",
  "UTILISATEUR"
];

const sousMenusMap: Record<string, string[]> = {
  CLASSIFICATION: ["ECONOMIQUE", "PROGRAMMATIQUE", "SOUR_FINANCEMENT"],
  PREVISION: [
    "PREVISION_PAR_PROJET_ET_RAPPORTS",
    "PREVISION_PAR_CATEGORIE_ET_RAPPORTS",
    "PREVISION_PAR_ACTIVITE_ET_RAPPORTS"
  ],
  EXECUTION: [
    "ENGAGEMENT",
    "LIQUIDATION",
    "TRAITEMENT_ENGAGEMENT",
    "TRAITEMENT_LIQUIDATION",
    "RAPPORT_ENGANGEMENT",
    "RAPPORT_LIQUIDATION",
    "RAPPORT_EXECITON"
  ],
  TRESORERIE: [
    "TABLE_DE_BORT",
    "BANQUE",
    "COMPTE_BANCAIRE",
    "JOURNAL_TRESORERIE",
    "RAPPROCHEMENT_BANCAIRE"
  ],
  COMPTABILITE: [
    "JOURNAL",
    "GRAND_LIVRE",
    "BALANCE",
    "BILAN",
    "COMPTE_RESULTAT"
  ],
  PARAMENTRAGE: ["EXERCICE", "DEVISE"],
  UTILISATEUR: ["USER", "ROLE", "PARAMETRAGE_ROLE"]
};

export default function RoleMenuPermission() {
  const [checked, setChecked] = useState<Record<string, string[]>>({});
  const [roles, setRoles] = useState([]);

  const { register, handleSubmit, reset } = useForm();

  // ================= GET ROLES =================
  const dataRole = async () => {
    const data = await getAllRole();
    setRoles(data);
  };

  // ================= GET MENUS PAR ROLE =================
  const handleRoleChange = async (id: number) => {
    try {
      const data = await getAllMenu(id);

      // transformer backend -> checked
      const formatted: Record<string, string[]> = {};

      data.forEach((item: any) => {
        formatted[item.menu] = item.sousMenus.map(
          (sm: any) => sm.sousmenu
        );
      });

      setChecked(formatted);
    } catch (e) {
      // fallback si pas de backend
      setChecked({});
    }
  };

  useEffect(() => {
    dataRole();
  }, []);

  // ================= CHECK MENU =================
  const toggleMenu = (menu: string) => {
    setChecked((prev) => {
      const newState = { ...prev };

      if (newState[menu]) {
        delete newState[menu];
      } else {
        newState[menu] = [];
      }

      return newState;
    });
  };

  // ================= CHECK SOUS MENU =================
  const toggleSousMenu = (menu: string, sm: string) => {
    setChecked((prev) => {
      const current = prev[menu] || [];
      const exists = current.includes(sm);

      const updated = exists
        ? current.filter((i) => i !== sm)
        : [...current, sm];

      return { ...prev, [menu]: updated };
    });
  };

  // ================= SUBMIT =================
  const onSubmit = async (formData: any) => {
    try {
     const payload = Object.entries(checked).map(
  ([menu, sousMenus]) => ({
    id: formData.id ?? null,
    idRole: Number(formData.idRole),
    menu,
    sousMenus: sousMenus.map((sm: any) => ({
      id: isEdit ? sm.id : null,
      sousmenu: sm.sousmenu
    }))
  })
);

      console.log("DATA ENVOYEE :", payload);

      await create(payload);

      toast.success("Opération effectuée avec succès !");
      reset();
      setChecked({});
    } catch (error: any) {
      toast.error("Erreur lors de l'opération", {
        style: { backgroundColor: "red", color: "white" }
      });
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Gestion des permissions</h1>
          <p className="text-gray-500">
            Associer menus et sous-menus à un rôle
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* SELECT ROLE */}
          <select
            className="border p-3 rounded-xl w-full"
            {...register("idRole")}
            onChange={(e) =>
              handleRoleChange(Number(e.target.value))
            }
          >
             <input {...register("id", { required: false })} readOnly hidden />
            <option value="">Choisir un rôle</option>
            {roles?.map((r: any) => (
              <option key={r.id} value={r.id}>
                {r.role}
              </option>
            ))}
          </select>

          {/* MENUS */}
          <div className="space-y-4 mt-4">
            {menuss.map((menu) => (
              <div
                key={menu}
                className="border rounded-xl p-4"
              >
                {/* MENU */}
                <label className="flex items-center gap-2 font-semibold">
                  <input
                    type="checkbox"
                    checked={!!checked[menu]}
                    onChange={() => toggleMenu(menu)}
                  />
                  {menu}
                </label>

                {/* SOUS MENUS */}
                {checked[menu] && (
                  <div className="ml-6 mt-3 grid grid-cols-2 gap-2">
                    {sousMenusMap[menu]?.map((sm) => (
                      <label
                        key={sm}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={checked[menu]?.includes(sm)}
                          onChange={() =>
                            toggleSousMenu(menu, sm)
                          }
                        />
                        {sm}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl mt-4"
          >
            Enregistrer les permissions
          </button>
        </form>
      </div>
    </div>
  );
}