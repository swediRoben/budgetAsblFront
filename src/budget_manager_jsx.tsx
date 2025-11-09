import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Menu, X, PieChart, TrendingUp, CheckSquare, Layers, BookOpen, FileText, DollarSign } from 'lucide-react';

const BudgetApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('classification');
  const [activeSubMenu, setActiveSubMenu] = useState('economique');
  const [activePage, setActivePage] = useState('classe');
  const [expandedMenus, setExpandedMenus] = useState({
    classification: true,
    economique: false,
    programmatique: false,
    srcFinancement: false,
    prevision: false,
    etatSortie: false,
    execution: false
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});
  const [detailLines, setDetailLines] = useState([{ id: 1, compte: '', montant: '' }]);
  const [showPreview, setShowPreview] = useState(false);
  const [showEngagementList, setShowEngagementList] = useState(false);
  const [showLiquidationList, setShowLiquidationList] = useState(false);
  const [engagements, setEngagements] = useState([
    { id: 1, numero: 'ENG-2025-001', date: '2025-01-15', beneficiaire: 'Fournisseur A', montant: 5000000, statut: 'En cours' },
    { id: 2, numero: 'ENG-2025-002', date: '2025-01-20', beneficiaire: 'Fournisseur B', montant: 3500000, statut: 'Validé' }
  ]);
  const [liquidations, setLiquidations] = useState([
    { id: 1, numero: 'LIQ-2025-001', engagement: 'ENG-2025-001', date: '2025-02-10', montant: 5000000, statut: 'Payé' },
    { id: 2, numero: 'LIQ-2025-002', engagement: 'ENG-2025-002', date: '2025-02-15', montant: 3500000, statut: 'En attente' }
  ]);

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const handleSubMenuClick = (subMenu) => {
    setActiveSubMenu(subMenu);
    if (subMenu === 'economique') {
      setActivePage('classe');
    } else if (subMenu === 'programmatique') {
      setActivePage('projet');
    } else if (subMenu === 'srcFinancement') {
      setActivePage('typeBailleur');
    } else if (subMenu === 'etatSortie') {
      setActivePage('parClasse');
    } else if (subMenu === 'elaboration') {
      setActivePage(null);
    } else if (subMenu === 'engagement' || subMenu === 'liquidation' || 
               subMenu === 'rapportEngagement' || subMenu === 'rapportLiquidation') {
      setActivePage(null);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setFormData({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    closeModal();
  };

  const addDetailLine = () => {
    setDetailLines([...detailLines, { id: detailLines.length + 1, compte: '', montant: '' }]);
  };

  const removeDetailLine = (id) => {
    if (detailLines.length > 1) {
      setDetailLines(detailLines.filter(line => line.id !== id));
    }
  };

  const handleDetailChange = (id, field, value) => {
    setDetailLines(detailLines.map(line => 
      line.id === id ? { ...line, [field]: value } : line
    ));
  };

  const handleAfficher = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const calculateTotal = () => {
    return detailLines.reduce((sum, line) => sum + (parseFloat(line.montant) || 0), 0);
  };

  const handleAfficherEngagementList = (e) => {
    e.preventDefault();
    const newEngagement = {
      id: engagements.length + 1,
      numero: `ENG-2025-${String(engagements.length + 1).padStart(3, '0')}`,
      date: formData.dateEngagement,
      beneficiaire: formData.beneficiaire,
      montant: parseFloat(formData.montantEngagement || 0),
      statut: 'En cours'
    };
    setEngagements([...engagements, newEngagement]);
    setShowEngagementList(true);
  };

  const handleAfficherLiquidationList = (e) => {
    e.preventDefault();
    const newLiquidation = {
      id: liquidations.length + 1,
      numero: `LIQ-2025-${String(liquidations.length + 1).padStart(3, '0')}`,
      engagement: formData.engagementRef,
      date: formData.dateLiquidation,
      montant: parseFloat(formData.montantLiquidation || 0),
      statut: 'En attente'
    };
    setLiquidations([...liquidations, newLiquidation]);
    setShowLiquidationList(true);
  };

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
            { id: 'parClasse', name: 'Par Classe' },
            { id: 'parProjet', name: 'Par Projet' }
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
        }
      ]
    }
  ];

  const renderClassePage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Classes Économiques</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('classe')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter une Classe
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Libellé</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">1</td>
              <td className="border border-gray-300 px-4 py-2">Charges de Personnel</td>
              <td className="border border-gray-300 px-4 py-2">Dépense</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button className="text-blue-600 hover:text-blue-800 mr-2">Modifier</button>
                <button className="text-red-600 hover:text-red-800">Supprimer</button>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">2</td>
              <td className="border border-gray-300 px-4 py-2">Biens et Services</td>
              <td className="border border-gray-300 px-4 py-2">Dépense</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button className="text-blue-600 hover:text-blue-800 mr-2">Modifier</button>
                <button className="text-red-600 hover:text-red-800">Supprimer</button>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">3</td>
              <td className="border border-gray-300 px-4 py-2">Transferts et Subventions</td>
              <td className="border border-gray-300 px-4 py-2">Dépense</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button className="text-blue-600 hover:text-blue-800 mr-2">Modifier</button>
                <button className="text-red-600 hover:text-red-800">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPlanComptablePage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Plan Comptable</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('planComptable')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter un Compte
        </button>
      </div>

      <div className="mb-4 flex gap-4">
        <input 
          type="text" 
          placeholder="Rechercher un compte..."
          className="flex-1 border border-gray-300 rounded px-4 py-2"
        />
        <select className="border border-gray-300 rounded px-4 py-2">
          <option>Toutes les classes</option>
          <option>Classe 1</option> 
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Numéro</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Intitulé</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Classe</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Statut</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">611</td>
              <td className="border border-gray-300 px-4 py-2">Salaires et Traitements</td>
              <td className="border border-gray-300 px-4 py-2">Classe 1</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Actif</span>
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button className="text-blue-600 hover:text-blue-800 mr-2">Modifier</button>
                <button className="text-red-600 hover:text-red-800">Supprimer</button>
              </td>
            </tr> 
          </tbody>
        </table>
      </div>
    </div>
  );

    const renderProjetPage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Projet</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('projet')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter un projet
        </button>
      </div>

      <div className="mb-4 flex gap-4">
        <input 
          type="text" 
          placeholder="Rechercher un projet..."
          className="flex-1 border border-gray-300 rounded px-4 py-2"
        />
        <p>du</p>
           <input 
          type="date" 
          placeholder="Date de début..."
          className="flex-1 border border-gray-300 rounded px-4 py-2"
        />
        <p>au</p>
        <input 
          type="date" 
          placeholder="Date de fin..."
          className="flex-1 border border-gray-300 rounded px-4 py-2"
        />
      </div>
      <hr />
      <br />  
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Numéro</th>
              <th className="border border-gray-300 px-4 py-2 text-left">code</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Intitulé</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Date de début</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Date de fin</th> 
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">611</td>
              <td className="border border-gray-300 px-4 py-2">001</td>
              <td className="border border-gray-300 px-4 py-2">Projet 1</td>
              <td className="border border-gray-300 px-4 py-2">01/01/2022</td>
              <td className="border border-gray-300 px-4 py-2">31/12/2022</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button className="text-blue-600 hover:text-blue-800 mr-2">Modifier</button>
                <button className="text-red-600 hover:text-red-800">Supprimer</button>
              </td>
            </tr> 
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCategoriePage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Categorie</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('categorie')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter une categorie
        </button>
      </div>

      <div className="mb-4 flex gap-4">
        <input 
          type="text" 
          placeholder="Rechercher un compte..."
          className="flex-1 border border-gray-300 rounded px-4 py-2"
        />
        <select className="border border-gray-300 rounded px-4 py-2">
          <option>Toutes les projet</option>
          <option>projet 1</option> 
        </select>
      </div>
      <hr />
      <br />  

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Intitulé</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Projet</th> 
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">611</td>
              <td className="border border-gray-300 px-4 py-2">Salaires et Traitements</td>
              <td className="border border-gray-300 px-4 py-2">priet 1</td> 
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button className="text-blue-600 hover:text-blue-800 mr-2">Modifier</button>
                <button className="text-red-600 hover:text-red-800">Supprimer</button>
              </td>
            </tr> 
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTypeBailleurPage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Type de bailleur</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('typeBailleur')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter un type de bailleur
        </button>
      </div>

      <div className="mb-4 flex gap-4">
        <input 
          type="text" 
          placeholder="Rechercher un compte..."
          className="flex-1 border border-gray-300 rounded px-4 py-2"
        />
      </div>
      <hr />
      <br />  

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100"> 
              <th className="border border-gray-300 px-4 py-2 text-left">Intitulé</th> 
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50"> 
              <td className="border border-gray-300 px-4 py-2">ONG</td>    
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button className="text-blue-600 hover:text-blue-800 mr-2">Modifier</button>
                <button className="text-red-600 hover:text-red-800">Supprimer</button>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">  
              <td className="border border-gray-300 px-4 py-2">Banque</td>   
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button className="text-blue-600 hover:text-blue-800 mr-2">Modifier</button>
                <button className="text-red-600 hover:text-red-800">Supprimer</button>
              </td>
            </tr> 
            <tr className="hover:bg-gray-50">  
              <td className="border border-gray-300 px-4 py-2">Gouvernement</td>   
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button className="text-blue-600 hover:text-blue-800 mr-2">Modifier</button>
                <button className="text-red-600 hover:text-red-800">Supprimer</button>
              </td>
            </tr> 
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBailleurPage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Bailleur</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('bailleur')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter un bailleur
        </button>
      </div>

      <div className="mb-4 flex gap-4">
        <input 
          type="text" 
          placeholder="Rechercher un compte..."
          className="flex-1 border border-gray-300 rounded px-4 py-2"
        />
        <select className="border border-gray-300 rounded px-4 py-2">
          <option>Toutes les types de bailleur</option> 
           <option>ong</option> 
           <option>banque</option> 
           <option>gouvernement</option> 
        </select>

        <select className="border border-gray-300 rounded px-4 py-2">
          <option>Sources</option>
          <option>Interne</option> 
           <option>Externe</option> 
           <option>Mixte</option>  
        </select>
      </div>
      <hr />
      <br />  

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Intitulé</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Type de bailleur</th> 
              <th className="border border-gray-300 px-4 py-2 text-left">Source</th> 
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">611</td>
              <td className="border border-gray-300 px-4 py-2">Salaires et Traitements</td>
              <td className="border border-gray-300 px-4 py-2">ONG </td> 
              <td className="border border-gray-300 px-4 py-2">Interne </td> 
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button className="text-blue-600 hover:text-blue-800 mr-2">Modifier</button>
                <button className="text-red-600 hover:text-red-800">Supprimer</button>
              </td>
            </tr> 
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBeneficiairePage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Beneficiaire</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('beneficiaire')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter un beneficiaire
        </button>
      </div>

      <div className="mb-4 flex gap-4">
        <input 
          type="text" 
          placeholder="Rechercher un compte..."
          className="flex-1 border border-gray-300 rounded px-4 py-2"
        />
      </div>
      <hr />
      <br />  

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100"> 
              <th className="border border-gray-300 px-4 py-2 text-left">Intitulé</th> 
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50"> 
              <td className="border border-gray-300 px-4 py-2">Beneficiaire 1</td> 
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button className="text-blue-600 hover:text-blue-800 mr-2">Modifier</button>
                <button className="text-red-600 hover:text-red-800">Supprimer</button>
              </td>
            </tr> 
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderActivitePage = () => (
       <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Activite</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => openModal('activite')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter une activite
        </button>
      </div>

      <div className="mb-4 flex gap-4">
        <input 
          type="text" 
          placeholder="Rechercher un compte..."
          className="flex-1 border border-gray-300 rounded px-4 py-2"
        />
        <select className="border border-gray-300 rounded px-4 py-2">
          <option>Toutes les projet</option>
          <option>projet 1</option> 
        </select>
        <select className="border border-gray-300 rounded px-4 py-2">
          <option>Toutes les categorie</option>
          <option> categorie 1</option> 
        </select>
      </div>
      <hr />
      <br />  

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Intitulé</th>
              <th className="border border-gray-300 px-4 py-2 text-left">categorie</th> 
              <th className="border border-gray-300 px-4 py-2 text-left">Projet</th> 
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">611</td>
              <td className="border border-gray-300 px-4 py-2">activite Salaires et Traitements</td>
              <td className="border border-gray-300 px-4 py-2">categorie 1</td> 
              <td className="border border-gray-300 px-4 py-2">priet 1</td> 
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button className="text-blue-600 hover:text-blue-800 mr-2">Modifier</button>
                <button className="text-red-600 hover:text-red-800">Supprimer</button>
              </td>
            </tr> 
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDefaultPage = (title) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
      <div className="mb-6">
        <button 
          onClick={() => openModal(title.toLowerCase())}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter
        </button>
      </div>
      <p className="text-gray-600">Contenu de la section {title} à venir...</p>
    </div>
  );

  const renderElaborationPage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Élaboration du Budget</h2>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition font-semibold"
          >
            Afficher l'Aperçu
          </button>
        </div>
        
      <form onSubmit={handleAfficher}>
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">En-tête</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Exercice Budgétaire</label>
              <select
                name="exercice"
                value={formData.exercice || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Sélectionner l'exercice</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Projet</label>
              <select
                name="typeBudget"
                value={formData.projet || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Sélectionner un projet</option>
                <option value="Initial">611 - Projet 1</option>
                <option value="projet">612 - Projet 2</option>
                <option value="projet1">613 - Projet 3</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Categorie</label>
              <select
                name="typeBudget"
                value={formData.categorie || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Sélectionner une categorie</option>
                <option value="Initial">611 - Categorie 1</option>
                <option value="projet">612 - Categorie 2</option>
                <option value="projet1">613 - Categorie 3</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Classe</label>
              <input
                type="text"
                name="classeId"
                value={formData.classeId || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                required
                readOnly
              />
            </div>
            <div>
                <span className="px-4 py-2 bg-green-600 text-white rounded-full font-semibold text-sm shadow">
                  Montant restant par catégorie: <strong>5 000 000 000</strong>
                </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Détails des Lignes Budgétaires</h3>
            <button
              type="button"
              onClick={addDetailLine}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
            >
              + Ajouter une ligne
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">Compte</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Montant</th>
                  <th className="border border-gray-300 px-4 py-2 text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody>
                {detailLines.map((line) => (
                  <tr key={line.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-2 py-2">
                      <select
                        value={line.compte}
                        onChange={(e) => handleDetailChange(line.id, 'compte', e.target.value)}
                        className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                        required
                      >
                        <option value="">Sélectionner un compte</option>
                        <option value="611">611 - Salaires et Traitements</option>
                        <option value="612">612 - Charges Sociales</option>
                        <option value="621">621 - Fournitures de Bureau</option>
                        <option value="622">622 - Services Extérieurs</option>
                        <option value="623">623 - Déplacements</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="number"
                        value={line.montant}
                        onChange={(e) => handleDetailChange(line.id, 'montant', e.target.value)}
                        className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                        placeholder="0.00"
                        step="0.01"
                        required
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeDetailLine(line.id)}
                        className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                        disabled={detailLines.length === 1}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-semibold">
                  <td className="border border-gray-300 px-4 py-2 text-right">Total</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {calculateTotal().toLocaleString('fr-FR', { minimumFractionDigits: 2 })} FBU
                  </td>
                  <td className="border border-gray-300"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      
      </form>

    </div>
  );

  const renderPlafondPage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Planfond de dépense</h2>
      
      <form onSubmit={handleAfficher}>
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">En-tête</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Exercice Budgétaire</label>
              <select
                name="exercice"
                value={formData.exercice || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Sélectionner l'exercice</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Détails des projets</h3>
            <button
              type="button"
              onClick={addDetailLine}
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
                {detailLines.map((line) => (
                  <tr key={line.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-2 py-2">
                      <select
                        value={line.projet}
                        onChange={(e) => handleDetailChange(line.id, 'projet', e.target.value)}
                        className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                        required
                      >
                        <option value="">Sélectionner un projet</option>
                        <option value="611">611 - Projet 1</option>
                        <option value="612">612 - Projet 2</option>
                        <option value="613">613 - Projet 3</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <select
                        value={line.bailleur}
                        onChange={(e) => handleDetailChange(line.id, 'bailleur', e.target.value)}
                        className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Sélectionner un bailleur</option>
                        <option value="611">1 - bailleur 1</option>
                        <option value="612">2 - bailleur 2</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="number"
                        value={line.montant}
                        onChange={(e) => handleDetailChange(line.id, 'montant', e.target.value)}
                        className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                        placeholder="0.00"
                        step="0.01"
                        required
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeDetailLine(line.id)}
                        className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                        disabled={detailLines.length === 1}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-semibold" > 
                  <td className="border border-gray-300 px-4 py-2 text-center"  colSpan={2}>Total</td>
                  <td className="border border-gray-300 px-4 py-2 text-center"  colSpan={2}>
                    {calculateTotal().toLocaleString('fr-FR', { minimumFractionDigits: 2 })} 
                  </td> 
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end">
            <div className="flex gap-4 justify-end">
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
              Enregistrer
            </button>
            <button className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition">
              Imprimer
            </button>
          </div>
        </div>
      </form>
    </div>
  );

 const renderPlafondNaturePage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Planfond par nature</h2>
      
      <form onSubmit={handleAfficher}>
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">En-tête</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Exercice Budgétaire</label>
              <select
                name="exercice"
                value={formData.exercice || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Sélectionner l'exercice</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
            <div>
            <label className="block text-gray-700 font-medium mb-2">Projet</label>
              <select
                name="projet"
                value={formData.projet || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                required
                      >
                        <option value="">Sélectionner un projet</option>
                        <option value="611">611 - Projet 1</option>
                        <option value="612">612 - Projet 2</option>
                        <option value="613">613 - Projet 3</option>
               </select>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Détails des projets</h3>
            <button
              type="button"
              onClick={addDetailLine}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
            >
              + Ajouter une ligne
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200"> 
                  <th className="border border-gray-300 px-4 py-2 text-left">Nature</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Categorie</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Montant</th>
                  <th className="border border-gray-300 px-4 py-2 text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody>
                {detailLines.map((line) => (
                  <tr key={line.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-2 py-2">
                      <select
                        value={line.classe}
                        onChange={(e) => handleDetailChange(line.id, 'classe', e.target.value)}
                        className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                        required
                      >
                        <option value="">Sélectionner une classe</option>
                        <option value="611">611 - Bien et services</option>
                        <option value="612">612 - Deplacement</option> 
                      </select>
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <select
                        value={line.categorie}
                        onChange={(e) => handleDetailChange(line.id, 'categorie', e.target.value)}
                        className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                        required
                     >
                        <option value="">Sélectionner un categorie</option>
                        <option value="611">1 - categorie 1</option>
                        <option value="612">2 - categorie 2</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="number"
                        value={line.montant}
                        onChange={(e) => handleDetailChange(line.id, 'montant', e.target.value)}
                        className="w-full border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500"
                        placeholder="0.00"
                        step="0.01"
                        required
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeDetailLine(line.id)}
                        className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                        disabled={detailLines.length === 1}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-semibold" > 
                  <td className="border border-gray-300 px-4 py-2 text-center"  colSpan={2}>Total</td>
                  <td className="border border-gray-300 px-4 py-2 text-center"  colSpan={2}>
                    {calculateTotal().toLocaleString('fr-FR', { minimumFractionDigits: 2 })} 
                  </td> 
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end">
            <div className="flex gap-4 justify-end">
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
              Enregistrer
            </button>
            <button className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition">
              Imprimer
            </button>
          </div>
        </div>
      </form>
    </div>
  );
  

  const renderEngagementPage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Engagement de Dépense</h2>
      
      <form onSubmit={handleAfficherEngagementList}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Date d'Engagement</label>
            <input
              type="date"
              name="dateEngagement"
              value={formData.dateEngagement || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Bénéficiaire</label>
            <input
              type="text"
              name="beneficiaire"
              value={formData.beneficiaire || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Nom du bénéficiaire"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Objet</label>
            <input
              type="text"
              name="objetEngagement"
              value={formData.objetEngagement || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Objet de l'engagement"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Montant</label>
            <input
              type="number"
              name="montantEngagement"
              value={formData.montantEngagement || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Ligne Budgétaire</label>
            <select
              name="ligneBudgetaire"
              value={formData.ligneBudgetaire || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Sélectionner une ligne</option>
              <option value="611">611 - Salaires et Traitements</option>
              <option value="621">621 - Fournitures de Bureau</option>
              <option value="622">622 - Services Extérieurs</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Responsable</label>
            <input
              type="text"
              name="responsable"
              value={formData.responsable || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Nom du responsable"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Observations</label>
          <textarea
            name="observationsEngagement"
            value={formData.observationsEngagement || ''}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            rows="3"
            placeholder="Observations..."
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Afficher la Liste
          </button>
        </div>
      </form>

      {showEngagementList && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Liste des Engagements</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">N° Engagement</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Bénéficiaire</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Montant</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Statut</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {engagements.map((eng) => (
                  <tr key={eng.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{eng.numero}</td>
                    <td className="border border-gray-300 px-4 py-2">{eng.date}</td>
                    <td className="border border-gray-300 px-4 py-2">{eng.beneficiaire}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {eng.montant.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <span className={`px-2 py-1 rounded text-sm ${
                        eng.statut === 'Validé' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {eng.statut}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">Voir</button>
                      <button className="text-green-600 hover:text-green-800">Modifier</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderLiquidationPage = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Liquidation de Dépense</h2>
      
      <form onSubmit={handleAfficherLiquidationList}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Référence Engagement</label>
            <select
              name="engagementRef"
              value={formData.engagementRef || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Sélectionner un engagement</option>
              {engagements.map((eng) => (
                <option key={eng.id} value={eng.numero}>
                  {eng.numero} - {eng.beneficiaire}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Date de Liquidation</label>
            <input
              type="date"
              name="dateLiquidation"
              value={formData.dateLiquidation || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Montant Liquidé (FBU)</label>
            <input
              type="number"
              name="montantLiquidation"
              value={formData.montantLiquidation || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Mode de Paiement</label>
            <select
              name="modePaiement"
              value={formData.modePaiement || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Sélectionner un mode</option>
              <option value="Virement">Virement Bancaire</option>
              <option value="Cheque">Chèque</option>
              <option value="Especes">Espèces</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">N° de Facture</label>
            <input
              type="text"
              name="numeroFacture"
              value={formData.numeroFacture || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="N° de facture"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Validé par</label>
            <input
              type="text"
              name="validePar"
              value={formData.validePar || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Nom du validateur"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Observations</label>
          <textarea
            name="observationsLiquidation"
            value={formData.observationsLiquidation || ''}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            rows="3"
            placeholder="Observations..."
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Afficher la Liste
          </button>
        </div>
      </form>

      {showLiquidationList && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Liste des Liquidations</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">N° Liquidation</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Engagement</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Montant</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Statut</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {liquidations.map((liq) => (
                  <tr key={liq.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{liq.numero}</td>
                    <td className="border border-gray-300 px-4 py-2">{liq.engagement}</td>
                    <td className="border border-gray-300 px-4 py-2">{liq.date}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {liq.montant.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <span className={`px-2 py-1 rounded text-sm ${
                        liq.statut === 'Payé' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {liq.statut}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">Voir</button>
                      <button className="text-green-600 hover:text-green-800">Imprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderModalForm = () => {
    if (modalType === 'classe') {
      return (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Code</label>
            <input
              type="text"
              name="code"
              value={formData.code || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Ex: 1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Libellé</label>
            <input
              type="text"
              name="libelle"
              value={formData.libelle || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Ex: Charges de Personnel"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Type</label>
            <select
              name="type"
              value={formData.type || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">Sélectionner un type</option>
              <option value="Dépense">Dépense</option>
              <option value="Recette">Recette</option>
            </select>
          </div>
        </>
      );
    } else if (modalType === 'planComptable') {
      return (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Numéro de Compte</label>
            <input
              type="text"
              name="numero"
              value={formData.numero || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Ex: 611"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Intitulé</label>
            <input
              type="text"
              name="intitule"
              value={formData.libelle || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Ex: Salaires et Traitements"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Classe</label>
            <select
              name="classe"
              value={formData.classe || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">Sélectionner une classe</option>
              <option value="Classe 1">Classe 1</option> 
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Statut</label>
            <select
              name="statut"
              value={formData.typeCompte || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">Sélectionner un type de compte</option>
              <option value="Actif">Actif</option>
              <option value="Inactif">passif</option>
              <option value="Inactif">neutre</option>
            </select>
          </div>
        </>
      );
    } else if (modalType === 'projet') {
      return (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">code</label>
            <input
              type="text"
              name="code"
              value={formData.code || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Ex: 611"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Intitulé</label>
            <input
              type="text"
              name="intitule"
              value={formData.libelle || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Ex: Salaires et Traitements"
            />
          </div>
          <div className="mb-4"> 
            <label className="block text-gray-700 font-semibold mb-2">Date de début</label>
            <input
              type="date"
              name="dateDebut"
              value={formData.dateDebut || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4"> 
            <label className="block text-gray-700 font-semibold mb-2">Date de fin</label>
            <input
              type="date"
              name="dateFin"
              value={formData.dateFin || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
        </>
      );
    } else if (modalType === 'categorie') {
      return (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">code</label>
            <input
              type="text"
              name="code"
              value={formData.code || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Ex: 611"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Intitulé</label>
            <input
              type="text"
              name="intitule"
              value={formData.libelle || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Ex: Salaires et Traitements"
            />
          </div>
          <div className="mb-4"> 
            <label className="block text-gray-700 font-semibold mb-2">Projet</label>
            <select
              name="projet"
              value={formData.projet || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">Selectionner un projet</option>
              <option value="projet1">Projet 1</option>
              <option value="projet2">Projet 2</option>
            </select>
          </div>
        </>
      );
    } else if (modalType === 'activite') {
      return (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">code</label>
            <input
              type="text"
              name="code"
              value={formData.code || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Ex: 611"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Intitulé</label>
            <input
              type="text"
              name="intitule"
              value={formData.libelle || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Ex: Salaires et Traitements"
            />
          </div>
          <div className="mb-4"> 
            <label className="block text-gray-700 font-semibold mb-2">Projet</label>
            <select
              name="projet"
              value={formData.projet || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">Selectionner un projet</option>
              <option value="projet1">Projet 1</option>
              <option value="projet2">Projet 2</option>
            </select>
          </div>
          <div className="mb-4"> 
            <label className="block text-gray-700 font-semibold mb-2">categorie</label>
            <select
              name="categorie"
              value={formData.categorie || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">Selectionner une categorie</option>
              <option value="categorie1">Categorie 1</option>
              <option value="categorie2">Categorie 2</option>
            </select>
          </div>
        </>
      );
    }
    return null;
  };

  const renderContent = () => {
    if (activeMenu === 'classification' && activeSubMenu === 'economique') {
      if (activePage === 'classe') return renderClassePage();
      if (activePage === 'planComptable') return renderPlanComptablePage();
    }
    
    if (activeMenu === 'classification' && activeSubMenu === 'programmatique') {
      if (activePage === 'projet') return renderProjetPage();
      if (activePage === 'categorie') return renderCategoriePage();
      if (activePage === 'activite') return renderActivitePage();
    }
    
    if (activeMenu === 'classification' && activeSubMenu === 'srcFinancement') {
      if (activePage === 'typeBailleur') return renderTypeBailleurPage();
      if (activePage === 'bailleur') return renderBailleurPage();
      if (activePage === 'beneficiaire') return renderBeneficiairePage();
    }
    
    if (activeMenu === 'prevision' && activeSubMenu === 'elaboration') {
      return renderElaborationPage();
    }
    
    if (activeMenu === 'prevision' && activeSubMenu === 'plafond') {
      return renderPlafondPage();
    }
    
    if (activeMenu === 'prevision' && activeSubMenu === 'plafondNature') {
      return renderPlafondNaturePage();
    }
    
    if (activeMenu === 'prevision' && activeSubMenu === 'etatSortie') {
      if (activePage === 'parClasse') return renderDefaultPage('État de Sortie par Classe');
      if (activePage === 'parProjet') return renderDefaultPage('État de Sortie par Projet');
    }
    
    if (activeMenu === 'execution') {
      if (activeSubMenu === 'engagement') return renderEngagementPage();
      if (activeSubMenu === 'liquidation') return renderLiquidationPage();
      if (activeSubMenu === 'rapportEngagement') return renderDefaultPage('Rapport Engagement');
      if (activeSubMenu === 'rapportLiquidation') return renderDefaultPage('Rapport Liquidation');
    }
    
    return renderClassePage();
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
                          handleSubMenuClick(subMenu.id);
                          if (subMenu.pages) {
                            toggleMenu(subMenu.id);
                          }
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded text-sm transition ${
                          activeSubMenu === subMenu.id ? 'bg-blue-500' : 'hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {subMenu.icon}
                          <span>{subMenu.name}</span>
                        </div>
                        {subMenu.pages && (
                          expandedMenus[subMenu.id] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
                        )}
                      </button>

                      {subMenu.pages && expandedMenus[subMenu.id] && (
                        <div className="ml-6 mt-1 space-y-1">
                          {subMenu.pages.map(page => (
                            <button
                              key={page.id}
                              onClick={() => setActivePage(page.id)}
                              className={`w-full text-left p-2 rounded text-sm transition ${
                                activePage === page.id ? 'bg-blue-400' : 'hover:bg-gray-700'
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

            <form onSubmit={handleSubmit} className="p-6">
              {renderModalForm()}

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetApp;