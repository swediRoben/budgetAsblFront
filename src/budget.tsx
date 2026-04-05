import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  PieChart,
  TrendingUp,
  CheckSquare,
  Layers,
  BookOpen,
  FileText,
  DollarSign,
  Settings2,
  BadgeDollarSign,
} from "lucide-react";

import { getAllExercice } from "./data/classification/exercice";

import RenderActivitePage from "./components/pages/ActivitePage";
import RenderTypeBailleurPage from "./components/pages/TypeBailleurPage";
import RenderBailleurPage from "./components/pages/BailleurPage";
import RenderBeneficiairePage from "./components/pages/BeneficiairePage";
import RenderExercicePage from "./components/pages/ExercicePage";
import RenderProjetPage from "./components/pages/ProjetPage";
import RenderPlanComptablePage from "./components/pages/PlanComptablePage";
import RenderCategoriePage from "./components/pages/CategoriePage";
import RenderClassePage from "./components/pages/ClassePage";
import RenderDevisePage from "./components/pages/DevisePage";
import RenderPlafondPage from "./components/pages/PlafondPage";
import RenderPlafonNaturePage from "./components/pages/PlafondNaturePage";
import RenderParProjetPage from "./components/pages/ParProjetPage";
import RenderParActivitePage from "./components/pages/ParActivitePage";
import RenderParCategoriePage from "./components/pages/ParClassePage";
import RenderElaborationPage from "./components/pages/ElaborationPage";
import RenderRapportLiquidationPage from "./components/pages/RapportLiquidationPage";
import RenderRapportExecutionPage from "./components/pages/RapportExecutionPage";
import RenderRapportEngagementPage from "./components/pages/RapportEngagementPage";
import RenderEngagementPage from "./components/pages/EngagementPage";
import RenderLiquidationPage from "./components/pages/LiquidationPage";
import RenderTraitementEngagementPage from "./components/pages/TraitementEngagementPage";
import RenderTraitementLiquidationPage from "./components/pages/TraitementLiquidationPage";
import RenderFonctionnairePage from "./components/pages/FonctionnairePage";
import RenderTresorieTableBorPage from "./components/pages/tresorerie/tableDebord";
import RenderTresorieBanquePage from "./components/pages/tresorerie/banque";
import RenderTresorieCompteBancairePage from "./components/pages/tresorerie/compteBancaire";
import RenderTresorieJournalPage from "./components/pages/tresorerie/journal";
import RenderTresorieRapprochementPage from "./components/pages/tresorerie/rapprochement";
import JournalTresorerieForm from "./components/pages/tresorerie/decaissement";
import ComptabilitePage from "./components/pages/tresorerie/comptabilite";
import OperationComptablePage from "./components/pages/tresorerie/operation";
import UserMenuPage from "./components/pages/users/menuPage";
import RenderRolePage from "./components/pages/users/RolePage";
import RenderUserPage from "./components/pages/users/UserPage";
import RenderEtatVentillationPage from "./components/pages/tresorerie/RapportVentillation";
import RenderEtatRessourcePage from "./components/pages/tresorerie/RapportResources";
import RenderEtatCompteresultatPage from "./components/pages/tresorerie/RapportCompteresultat";
import RenderEtatVentillationChargePage from "./components/pages/tresorerie/RapportVentillationCharge";
import ExcelImportPage from "./components/pages/importPlanComptable"
import RenderStructirePage from "./components/pages/parametre/structurePage"


type ExpandedMenusType = {
  [key: string]: boolean;
};

type MenuPage = {
  id: string;
  name: string;
};

type SubMenuType = {
  id: string;
  name: string;
  icon: React.ReactNode;
  pages?: MenuPage[];
};

type MenuType = {
  id: string;
  name: string;
  icon: React.ReactNode;
  subMenus?: SubMenuType[];
};

const BudgetApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // La page active (soit page enfant, soit submenu direct)
  const [activePage, setActivePage] = useState<string>("");

  // Pour coloration du menu sélectionné
  const [activeMenu, setActiveMenu] = useState<string>("");

  // Pour coloration du submenu sélectionné
  const [activeSubMenu, setActiveSubMenu] = useState<string>(""); 
  
  const token = JSON.parse(localStorage.getItem("token"));
  
  // menus ouverts
  const [expandedMenus, setExpandedMenus] = useState<ExpandedMenusType>({
    classification: false,
    prevision: false,
    execution: false,
    tresorerie: false,
    parametre: false,
    utilisateur: false,
    comptabilite: false,
  });

  // submenus parents ouverts (ceux qui ont pages)
  const [expandedSubMenus, setExpandedSubMenus] = useState<ExpandedMenusType>({
    economique: false,
    programmatique: false,
    srcFinancement: false,
    etatSortie: false,
  });

  // A VERIFIER MENU
  // const normalize = (v: string) =>
  // v?.toLowerCase().replace(/\s/g, "");
  // const menuStructureNouveau: MenuType[] = menuStructure
  // .map((menu) => {
  //   // toutes les permissions qui match ce menu
  //   const permissionsForMenu = token?.permission?.filter(
  //     (p) => normalize(p.menu) === normalize(menu.id)
  //   );

  //   if (!permissionsForMenu?.length) return null;

  //   return {
  //     ...menu,
  //     subMenus: menu.subMenus
  //       .map((sub) => {
  //         // vérifier si AU MOINS une permission contient ce sous-menu
  //         const allowed = permissionsForMenu.some((perm) =>
  //           perm.sousMenus?.some(
  //             (s) =>
  //               normalize(s.sousmenu) === normalize(sub.id)
  //           )
  //         );

  //         if (!allowed) return null;

  //         return sub;
  //       })
  //       .filter(Boolean),
  //   };
  // })
  // .filter(Boolean);


  // =========================
  // MENU STRUCTURE
  // =========================
  const menuStructure: MenuType[] = [
    {
      id: "classification",
      name: "Classification",
      icon: <Layers className="w-5 h-5" />,
      subMenus: [
        {
          id: "economique",
          name: "Économique",
          icon: <DollarSign className="w-4 h-4" />,
          pages: [
            { id: "classe", name: "Classe" },
            { id: "planComptable", name: "Plan Comptable" },
            { id: "operationComptable", name: "Operation Comptable" },
            { id: "importExcel", name: "Importer Plan Comptable" },
          ],
        },
        {
          id: "programmatique",
          name: "Programmatique",
          icon: <FileText className="w-4 h-4" />,
          pages: [
            { id: "projet", name: "Projet" },
            { id: "categorie", name: "Catégorie" },
            { id: "activite", name: "Activité" },
          ],
        },
        {
          id: "srcFinancement",
          name: "Source de Financement",
          icon: <PieChart className="w-4 h-4" />,
          pages: [
            { id: "typeBailleur", name: "Type Bailleur" },
            { id: "bailleur", name: "Bailleur" },
            { id: "beneficiaire", name: "Bénéficiaire" },
          ],
        },
      ],
    },
    {
      id: "prevision",
      name: "Prévision",
      icon: <TrendingUp className="w-5 h-5" />,
      subMenus: [
        {
          id: "plafond",
          name: "Prévision par projet",
          icon: <BookOpen className="w-4 h-4" />,
        },
        {
          id: "plafondNature",
          name: "Prévision par nature",
          icon: <BookOpen className="w-4 h-4" />,
        },
        {
          id: "elaboration",
          name: "Prévision par activité",
          icon: <BookOpen className="w-4 h-4" />,
        },
        {
          id: "etatSortie",
          name: "Rapports Prévisionnels",
          icon: <FileText className="w-4 h-4" />,
          pages: [
            { id: "parProjet", name: "Prévision par projet" },
            { id: "parClasse", name: "Prévision par nature" },
            { id: "parActivite", name: "Prévision annuelle" },
          ],
        },
      ],
    },
    {
      id: "execution",
      name: "Exécution",
      icon: <CheckSquare className="w-5 h-5" />,
      subMenus: [
        {
          id: "engagement",
          name: "Engagement",
          icon: <FileText className="w-4 h-4" />,
        },
        {
          id: "liquidation",
          name: "Liquidation",
          icon: <DollarSign className="w-4 h-4" />,
        },
        {
          id: "traitementengagment",
          name: "Traitement engagement",
          icon: <FileText className="w-4 h-4" />,
        },
        {
          id: "traitementliquidation",
          name: "Traitement liquidation",
          icon: <DollarSign className="w-4 h-4" />,
        },
        {
          id: "rapportEngagement",
          name: "Rapport Engagement",
          icon: <PieChart className="w-4 h-4" />,
        },
        {
          id: "rapportLiquidation",
          name: "Rapport Liquidation",
          icon: <TrendingUp className="w-4 h-4" />,
        },
        {
          id: "rapportExecution",
          name: "Rapport Execution",
          icon: <TrendingUp className="w-4 h-4" />,
        },
      ],
    },
    {
      id: "tresorerie",
      name: "Trésorerie",
      icon: <CheckSquare className="w-5 h-5" />,
      subMenus: [
        // {
        //   id: "tableBord",
        //   name: "Table de bord",
        //   icon: <FileText className="w-4 h-4" />,
        // },
        {
          id: "banque",
          name: "Banque",
          icon: <FileText className="w-4 h-4" />,
        },
        {
          id: "compteBancaire",
          name: "Compte bancaire",
          icon: <FileText className="w-4 h-4" />,
        },
        {
          id: "journal",
          name: "Journal de tresorerie",
          icon: <FileText className="w-4 h-4" />,
        },
        {
          id: "rapprochement",
          name: "Rapprochement",
          icon: <FileText className="w-4 h-4" />,
        },
        // {
        //   id: "situation",
        //   name: "Situation",
        //   icon: <FileText className="w-4 h-4" />,
        // },
        {
          id: "etatFinancier",
          name: "Etas Financiers",
          icon: <FileText className="w-4 h-4" />,
          pages: [
            { id: "bilanTresorerie", name: "bilan" },
            { id: "ventilation", name: "Ventilation" },
            { id: "compteResultat", name: "Compte de résultat" },
            { id: "ventilationCharge", name: "Ventilation des charges" },
            { id: "resourceEmplois", name: "Ressources et emplois" },
          ],
        },
      ],
    },
    {
      id: "comptabilite",
      name: "Comptabilite",
      icon: <CheckSquare className="w-5 h-5" />,
      subMenus: [
        {
          id: "JournalComptable",
          name: "Journal",
          icon: <FileText className="w-4 h-4" />,
        },
        {
          id: "grandlivre",
          name: "Grand livre",
          icon: <FileText className="w-4 h-4" />,
        },
        {
          id: "balance",
          name: "Balance",
          icon: <FileText className="w-4 h-4" />,
        },
        {
          id: "Bilan",
          name: "Billan",
          icon: <FileText className="w-4 h-4" />,
        },
        {
          id: "compteesultat",
          name: "Compte de resultat",
          icon: <FileText className="w-4 h-4" />,
        }
      ],
    },
    {
      id: "parametre",
      name: "Paramètre",
      icon: <Settings2 className="w-5 h-5" />,
      subMenus: [
        {
          id: "exercice",
          name: "Exercice",
          icon: <FileText className="w-4 h-4" />,
        },
        {
          id: "devise",
          name: "Devise",
          icon: <BadgeDollarSign className="w-4 h-4" />,
        },{
          id: "structure",
          name: "Structure administrative",
          icon: <BadgeDollarSign className="w-4 h-4" />,
        },
      ],
    },
    {
      id: "utilisateur",
      name: "Utilisateur",
      icon: <Settings2 className="w-5 h-5" />,
      subMenus: [
        {
          id: "fonctionnaire",
          name: "Fonctionnaire",
          icon: <FileText className="w-4 h-4" />,
        },
        {
          id: "role",
          name: "role",
          icon: <BadgeDollarSign className="w-4 h-4" />,
        },
        {
          id: "menu",
          name: "Permission",
          icon: <BadgeDollarSign className="w-4 h-4" />,
        },
        {
          id: "user",
          name: "Users",
          icon: <BadgeDollarSign className="w-4 h-4" />,
        },
      ],
    },
  ];

  // =========================
  // TOGGLES
  // =========================
  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) => {
      const newState: ExpandedMenusType = {};
      Object.keys(prev).forEach((key) => {
        newState[key] = key === menuId ? !prev[key] : false;
      });
      return newState;
    });
  };

  const toggleSubMenu = (subMenuId: string) => {
    setExpandedSubMenus((prev) => ({
      ...prev,
      [subMenuId]: !prev[subMenuId],
    }));
  };

  // =========================
  // CLICK HANDLERS
  // =========================

    const [exercices, setExercices] = useState([]); 
    
  useEffect(() => { 
    dataExercice();
  }, []);

  const dataExercice =async ()=>{
       const data=await getAllExercice(); 
       setExercices(data) 
     } 
  /**
   * Click sur submenu
   * - Si submenu a des pages => ouvre/ferme seulement (NE CHANGE PAS LA PAGE)
   * - Sinon => submenu est une page directe => on ouvre la page
   */
  const handleSubMenuClick = (subMenu: SubMenuType) => {
    setActiveSubMenu(subMenu.id);

    if (subMenu.pages && subMenu.pages.length > 0) {
      // submenu parent : ouvrir/fermer seulement
      toggleSubMenu(subMenu.id);
      return;
    }

    // submenu direct : ouvrir la page
    setActivePage(subMenu.id);
  };

  /**
   * Click sur page enfant
   */
  const handlePageClick = (pageId: string) => {
    setActivePage(pageId);
  };

  // =========================
  // RENDER CONTENT
  // =========================
  const renderContent = () => {
    switch (activePage) {
      // classification -> economique
      case "classe":
        return <RenderClassePage />;
      case "planComptable":
        return <RenderPlanComptablePage />;
      case "operationComptable":
        return <OperationComptablePage />;
      case "importExcel":
        return <ExcelImportPage />;
 
      // classification -> programmatique
      case "projet":
        return <RenderProjetPage />;
      case "categorie":
        return <RenderCategoriePage />;
      case "activite":
        return <RenderActivitePage />;

      // classification -> source financement
      case "typeBailleur":
        return <RenderTypeBailleurPage />;
      case "bailleur":
        return <RenderBailleurPage />;
      case "beneficiaire":
        return <RenderBeneficiairePage />;

      // prevision
      case "plafond":
        return <RenderPlafondPage />;
      case "plafondNature":
        return <RenderPlafonNaturePage />;
      case "elaboration":
        return <RenderElaborationPage />;

      // prevision -> etat sortie
      case "parProjet":
        return <RenderParProjetPage />;
      case "parClasse":
        return <RenderParCategoriePage />;
      case "parActivite":
        return <RenderParActivitePage />;

      // execution
      case "engagement":
        return <RenderEngagementPage />;
      case "liquidation":
        return <RenderLiquidationPage />;
      case "traitementengagment":
        return <RenderTraitementEngagementPage />;
      case "traitementliquidation":
        return <RenderTraitementLiquidationPage />;
      case "rapportEngagement":
        return <RenderRapportEngagementPage />;
      case "rapportLiquidation":
        return <RenderRapportLiquidationPage />;
      case "rapportExecution":
        return <RenderRapportExecutionPage />;

      //Tresorerie
      // case "tableBord":
      //   return <RenderTresorieTableBorPage />;
      case "banque":
        return <RenderTresorieBanquePage />;
      case "compteBancaire":
        return <RenderTresorieCompteBancairePage />;
      case "journal":
        return <RenderTresorieJournalPage />;
      case "rapprochement":
        return <RenderTresorieRapprochementPage />;
      // case "situation":
      //   return <JournalTresorerieForm />;

      //comptabilite
      case "JournalComptable":
        return <ComptabilitePage />;

       case "ventilation":
        return <RenderEtatVentillationPage />;
       case "compteResultat":
        return <RenderEtatCompteresultatPage />;
       case "ventilationCharge":
        return <RenderEtatVentillationChargePage />;
       case "resourceEmplois":
        return <RenderEtatRessourcePage />;

      // parametre
      case "exercice":
        return <RenderExercicePage />;
      case "devise":
        return <RenderDevisePage />;
      case "structure":
        return <RenderStructirePage />;

      // utilisateur
      case "fonctionnaire":
        return <RenderFonctionnairePage />;
      case "role":
        return <RenderRolePage />;
      case "menu":
        return <UserMenuPage />;
      case "user":
        return <RenderUserPage />;

      default:
        return (
          <div className="text-gray-500">
            Sélectionnez un menu pour afficher une page.
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-0"
          } bg-gray-800 text-white transition-all duration-300 overflow-hidden`}
      >
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h1 className="text-xl font-bold">Budget Manager</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

      <nav className="p-4 h-full overflow-y-auto custom-scroll">
          {menuStructure.map((menu) => (
            <div key={menu.id} className="mb-2">
              {/* MENU BUTTON */}
              <button
                onClick={() => {
                  setActiveMenu(menu.id);
                  toggleMenu(menu.id);
                }}
                className={`w-full flex items-center justify-between p-3 rounded transition ${activeMenu === menu.id ? "bg-blue-600" : "hover:bg-gray-700"
                  }`}
              >
                <div className="flex items-center gap-2">
                  {menu.icon}
                  <span>{menu.name}</span>
                </div>
                {menu.subMenus &&
                  (expandedMenus[menu.id] ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  ))}
              </button>

              {/* SUBMENUS */}
              {menu.subMenus && expandedMenus[menu.id] && (
                <div className="ml-4 mt-2 space-y-1">
                  {menu.subMenus.map((subMenu) => (
                    <div key={subMenu.id}>
                      <button
                        onClick={() => handleSubMenuClick(subMenu)}
                        className={`w-full flex items-center justify-between p-2 rounded text-sm transition ${activeSubMenu === subMenu.id
                            ? "text-green-400"
                            : "hover:bg-gray-700"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          {subMenu.icon}
                          <span>{subMenu.name}</span>
                        </div>

                        {subMenu.pages &&
                          (expandedSubMenus[subMenu.id] ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          ))}
                      </button>

                      {/* PAGES ENFANTS */}
                      {subMenu.pages && expandedSubMenus[subMenu.id] && (
                        <div className="ml-6 mt-1 space-y-1">
                          {subMenu.pages.map((page) => (
                            <button
                              key={page.id}
                              onClick={() => handlePageClick(page.id)}
                              className={`w-full text-left p-2 rounded text-sm transition ${activePage === page.id
                                  ? "bg-green-500 text-white"
                                  : "hover:bg-gray-700"
                                }`}
                            >
                              {page.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* MAIN */}
<div className="flex-1 flex flex-col overflow-hidden">
  <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
    
    {/* LEFT */}
    <div className="flex items-center gap-4">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 hover:bg-gray-100 rounded"
      >
        <Menu className="w-6 h-6" />
      </button>

      <h2 className="text-xl font-semibold text-gray-800">
        Gestion du Budget
      </h2>
    </div>

    {/* RIGHT */}
    <div className="flex items-center gap-6">
      
      {/* Select Exercice */}
      <select
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        defaultValue="2022"
      >
         {exercices.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.libelle}
                          </option>
              ))}
      </select>

      {/* Utilisateur */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
          FAP
        </div>
        
        <div className="text-sm">
          <p className="font-medium text-gray-800">{token?.username}</p>
          <p className="text-gray-500 text-xs">{token?.fonctionnaireNom}</p>
        </div>
      </div>

    </div>
  </header>

  <main className="flex-1 overflow-auto p-6">
    {renderContent()}
  </main>
</div>
    </div>
  );
};

export default BudgetApp;
