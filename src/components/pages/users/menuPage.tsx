import React, { useState } from "react";

// ENUMS
const menus = [
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
  TRESORERIE: ["TABLE_DE_BORT","BANQUE","COMPTE_BANCAIRE","JOURNAL_TRESORERIE","RAPPROCHEMENT_BANCAIRE"],
  COMPTABILITE: ["JOURNAL", "GRAND_LIVRE", "BALANCE", "BILAN", "COMPTE_RESULTAT"],
  PARAMENTRAGE: ["EXERCICE","DEVISE"],
  UTILISATEUR: ["USER","ROLE","PARAMETRAGE_ROLE"]
};

// FAKE DATA: menu déjà assigné au rôle
const assignedMenus = {
  COMPTABILITE: ["ENGAGEMENT", "LIQUIDATION"],
  EXECUTION: ["ENGAGEMENT"]
};

export default function RoleMenuPermission() {
  const [roleId, setRoleId] = useState<number | null>(null);
  const [checked, setChecked] = useState<Record<string, string[]>>({});

  const handleRoleChange = (id: number) => {
    setRoleId(id);

    // simulate backend response
    setChecked(assignedMenus);
  };

  const toggleMenu = (menu: string) => {
    setChecked(prev => {
      const newState = { ...prev };
      if (newState[menu]) delete newState[menu];
      else newState[menu] = sousMenusMap[menu] || [];
      return newState;
    });
  };

  const toggleSousMenu = (menu: string, sm: string) => {
    setChecked(prev => {
      const current = prev[menu] || [];
      const exists = current.includes(sm);

      const updated = exists
        ? current.filter(i => i !== sm)
        : [...current, sm];

      return { ...prev, [menu]: updated };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6 space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">Gestion des permissions</h1>
          <p className="text-gray-500">Associer menus et sous-menus à un rôle</p>
        </div>

        {/* ROLE SELECT */}
        <select
          className="border p-3 rounded-xl w-full"
          onChange={(e) => handleRoleChange(Number(e.target.value))}
        >
          <option value="">Choisir un rôle</option>
          <option value="1">ADMIN</option>
          <option value="2">USER</option>
        </select>

        {/* MENUS */}
        <div className="space-y-4">
          {menus.map(menu => (
            <div key={menu} className="border rounded-xl p-4">

              {/* MENU CHECK */}
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
                  {sousMenusMap[menu]?.map(sm => (
                    <label key={sm} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={checked[menu]?.includes(sm)}
                        onChange={() => toggleSousMenu(menu, sm)}
                      />
                      {sm}
                    </label>
                  ))}
                </div>
              )}

            </div>
          ))}
        </div>

        {/* ACTION */}
        <button className="w-full bg-black text-white py-3 rounded-xl">
          Enregistrer les permissions
        </button>
      </div>
    </div>
  );
}
