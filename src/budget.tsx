import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign,Settings2,BadgeDollarSign } from 'lucide-react';
 
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
import RenderLiquidationPage from "./components/pages/LiquidationPage"; 
import RenderRapportLiquidationPage from "./components/pages/RapportLiquidationPage"; 
import RenderRapportEngagementPage from "./components/pages/RapportEngagementPage"; 
import RenderEngagementPage from "./components/pages/EngagementPage";   

const BudgetApp = () => { 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('');
  const [activeSubMenu, setActiveSubMenu] = useState('');
  const [activePage, setActivePage] = useState('');
  const [expandedMenus, setExpandedMenus] = useState({
    classification: false,  
    prevision: false, 
    execution: false,
    tresorerie:false,
    parametre:false
  });

 const [expandedSubMenus, setExpandedSubMenus] = useState({ 
    economique: false, 
    programmatique: false,
    srcFinancement: false, 
    etatSortie: false, 
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});
  const [detailLines, setDetailLines] = useState([{ id: 1, compte: '', montant: '' }]);
  const [showPreview, setShowPreview] = useState(false);
 

  const toggleMenu = (menu) => {
  setExpandedMenus(prev => {
    const newState = {};

    Object.keys(prev).forEach(key => {
      newState[key] = key === menu ? !prev[key] : false;
    });

    return newState;
  });
};

  const toggleSubMenu = (menu) => {
    setExpandedSubMenus(prev => ({
      ...prev,
      [menu]: !prev[menu] 
    }));
  };
 
  const handleSubMenuClick = (subMenu:any) => {  
 
    if (subMenu!=='etatSortie') { 
    setActivePage('') 
    setActiveSubMenu(subMenu);
    }
     
  };

 
 

  const handleInputChange = (e:any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

 


  //menu
  const menuStructure = [
    {
      id: 'classification',
      name: 'Classification',
      icon: <Layers className="w-5 h-5" />,
      subMenus: [
        { 
          id: 'economique', 
          name: 'Économique',
          icon: <DollarSign className="w-4 h-4" />,
          pages: [
            { id: 'classe', name: 'Classe' },
            { id: 'planComptable', name: 'Plan Comptable' }
          ]
        },
        { 
          id: 'programmatique', 
          name: 'Programmatique',
          icon: <FileText className="w-4 h-4" />,
          pages: [
            { id: 'projet', name: 'Projet' },
            { id: 'categorie', name: 'Catégorie' },
            { id: 'activite', name: 'Activité' }
          ]
        },
        { 
          id: 'srcFinancement', 
          name: 'Source de Financement',
          icon: <PieChart className="w-4 h-4" />,
           pages: [
            { id: 'typeBailleur', name: 'typeBailleur' },
            { id: 'bailleur', name: 'bailleur' },
            { id: 'beneficiaire', name: 'beneficiaire' }
          ]
        }
      ]
    },
    {
      id: 'prevision',
      name: 'Prévision',
      icon: <TrendingUp className="w-5 h-5" />,
      subMenus: [
        { 
          id: 'plafond', 
          name: 'Plafond de Dépense',
          icon: <BookOpen className="w-4 h-4" />
        },
        { 
          id: 'plafondNature', 
          name: 'Plafond par nature',
          icon: <BookOpen className="w-4 h-4" />
        },
        { 
          id: 'elaboration', 
          name: 'Élaboration',
          icon: <BookOpen className="w-4 h-4" />
        },
        { 
          id: 'etatSortie', 
          name: 'État de Sortie',
          icon: <FileText className="w-4 h-4" />,
          pages: [
            { id: 'parProjet', name: 'Plafond par projet' },
            { id: 'parClasse', name: 'Prevision par nature' },
            { id: 'parActivite', name: 'prevision annuelle' }
          ]
        }
      ]
    },
    {
      id: 'execution',
      name: 'Exécution',
      icon: <CheckSquare className="w-5 h-5" />,
      subMenus: [
        { 
          id: 'engagement', 
          name: 'Engagement',
          icon: <FileText className="w-4 h-4" />
        },
        { 
          id: 'liquidation', 
          name: 'Liquidation',
          icon: <DollarSign className="w-4 h-4" />
        }
        ,
        { 
          id: 'movementCredit', 
          name: 'Mouvement credit',
          icon: <DollarSign className="w-4 h-4" />
        },
        { 
          id: 'traitementEngagement', 
          name: 'Traitement engagement',
          icon: <DollarSign className="w-4 h-4" />
        },
        { 
          id: 'traitementLiquidation', 
          name: 'Traitement liquidation',
          icon: <DollarSign className="w-4 h-4" />
        },
        { 
          id: 'rapportEngagement', 
          name: 'Rapport Engagement',
          icon: <PieChart className="w-4 h-4" />
        },
        { 
          id: 'rapportLiquidation', 
          name: 'Rapport Liquidation',
          icon: <TrendingUp className="w-4 h-4" />
        },
        { 
          id: 'rapportMouvmentcerdit', 
          name: 'Rapport Mouvement credit',
          icon: <TrendingUp className="w-4 h-4" />
        }
      ]
    },
     {
      id: 'tresorerie',
      name: 'Tresorerie',
      icon: <CheckSquare className="w-5 h-5" />,
      subMenus: [
         { 
          id: 'banque', 
          name: 'Banque',
          icon: <FileText className="w-4 h-4" />
        },
        { 
          id: 'compteBancaire', 
          name: 'Compte bancaire',
          icon: <FileText className="w-4 h-4" />
        },
        { 
          id: 'encaissement', 
          name: 'Encaissement',
          icon: <FileText className="w-4 h-4" />
        },
        { 
          id: 'decaissement', 
          name: 'Decaissement',
          icon: <DollarSign className="w-4 h-4" />
        },
        { 
          id: 'rapportEncaissement', 
          name: 'Rapport Encaissement',
          icon: <PieChart className="w-4 h-4" />
        },
        { 
          id: 'rapportDecaissement', 
          name: 'Rapport Decaissement',
          icon: <TrendingUp className="w-4 h-4" />
        }
      ]
    },
     {
      id: 'parametre',
      name: 'Parametre',
      icon: <Settings2 className="w-5 h-5" />,
      subMenus: [
        { 
          id: 'exercice', 
          name: 'Exercice',
          icon: <FileText className="w-4 h-4" />
        },
        { 
          id: 'devise', 
          name: 'Devise',
          icon: <BadgeDollarSign className="w-4 h-4" />
        }
      ]
    }
  ];
 
  const getAllDataInTable=(type:any)=>{ 
    if(type==='plafond'){ 
    }else if(type==='plafondNature'){ 
    }else if(type==='elaboration'){ 
    }else if(type==='parProjet'){ 
    }else if(type==='parClasse'){ 
    }
  }


const renderContent = () => {
  switch (true) {

    case activePage === 'classe':
      return <RenderClassePage />;

    case activePage === 'planComptable':
      return <RenderPlanComptablePage />;

    case activePage === 'projet':
      return <RenderProjetPage />;

    case activePage === 'categorie':
      return <RenderCategoriePage />;

    case activePage === 'activite':
      return <RenderActivitePage />;

    case activePage === 'typeBailleur':
      return <RenderTypeBailleurPage />;

    case activePage === 'bailleur':
      return <RenderBailleurPage />;

    case activePage === 'beneficiaire':
      return <RenderBeneficiairePage />;

    case activeSubMenu === 'exercice':
      return <RenderExercicePage />;

    case activeSubMenu === 'devise':
      return <RenderDevisePage />; 

    case activeSubMenu === 'elaboration':
      return <RenderElaborationPage />;

    case activeSubMenu === 'plafond':
      return <RenderPlafondPage />;

    case activeSubMenu === 'plafondNature':
      return <RenderPlafonNaturePage />;

    case activePage === 'parProjet':
      return <RenderParProjetPage />;

    case activePage === 'parClasse':
      return <RenderParCategoriePage />;

    case activePage === 'parActivite':
      return <RenderParActivitePage />;

  
    case activeSubMenu === 'engagement':
      return <RenderEngagementPage />;

    case activeSubMenu === 'liquidation':
      return <RenderLiquidationPage />;

    // case activeSubMenu === 'traitementLiquidation':
    //   return renderLiquidationPage();

    // case activeSubMenu === 'traitementEngagement':
    //   return renderLiquidationPage();

    // case activeSubMenu === 'movementCredit':
    //   return renderLiquidationPage();

    case activeSubMenu === 'rapportEngagement':
      return <RenderRapportEngagementPage />;

    case activeSubMenu === 'rapportLiquidation':
      return <RenderRapportLiquidationPage />;

    // case activeSubMenu === 'rapportMouvementCredit':
    //   return renderDefaultPage('Rapport Mouvement credit');

    default:
      return null;
  }
}; 

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-gray-800 text-white transition-all duration-300 overflow-hidden`}>
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h1 className="text-xl font-bold">Budget Manager</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4">
          {menuStructure.map(menu => (
            <div key={menu.id} className="mb-2">
              <button
                onClick={() => {
                  setActiveMenu(menu.id);
                  toggleMenu(menu.id);
                  if (!menu.subMenus) {
                    setActiveSubMenu(null);
                  }
                }}
                className={`w-full flex items-center justify-between p-3 rounded transition ${
                  activeMenu === menu.id ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  {menu.icon}
                  <span>{menu.name}</span>
                </div>
                {menu.subMenus && (
                  expandedMenus[menu.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {menu.subMenus && expandedMenus[menu.id] && (
                <div className="ml-4 mt-2 space-y-1">
                  {menu.subMenus.map(subMenu => (
                    <div key={subMenu.id}>
                      <button
                        onClick={() => {
                          getAllDataInTable(subMenu.id);
                          handleSubMenuClick(subMenu.id);
                          if (subMenu.pages) {
                            toggleSubMenu(subMenu.id);
                          }
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded text-sm transition ${
                          activeSubMenu === subMenu.id ? 'text-green-500' : 'hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {subMenu.icon}
                          <span>{subMenu.name}</span>
                        </div>
                        {subMenu.pages && (
                          expandedSubMenus[subMenu.id] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
                        )}
                      </button>

                      {subMenu.pages && expandedSubMenus[subMenu.id] && (
                        <div className="ml-6 mt-1 space-y-1">
                          {subMenu.pages.map(page => (
                            <button
                              key={page.id}
                              onClick={() => {
                                setActivePage(page.id);
                                getAllDataInTable(page.id);
                              }}
                              className={`w-full text-left p-2 rounded text-sm transition ${
                                activePage === page.id ? 'bg-green-400' : 'hover:bg-gray-700'
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

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded">
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            Gestion du Budget
          </h2>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                {modalType === 'classe' ? 'Ajouter une Classe' : 
                 modalType === 'planComptable' ? 'Ajouter un Compte' : 
                 'Ajouter un Élément'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

              {renderModalForm()}
 
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetApp;