import React, { useEffect, useState } from "react";
import "./styles.css";
import {logout} from "../services/userServices";
import {createPublication,deletePublication,getAllPublications,updatePublication} from "../services/publicationServices";
import {createProjet,deleteProjet,getAllProjets,updateProjet} from "../services/projectServices"
import {create,deleteUsers,getAllUsers} from "../services/userServices"
import {createDonation,deleteDonation,updateDonation,getDonations} from "../services/donationService"
import {API_URL} from "../services/imageService"
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast"; 

export default function Welcome() { 
  const navigation=useNavigate()
  const [activeSection, setActiveSection] = useState("dashboard");
  const [openedModal, setOpenedModal] = useState(null); // null ou 'projetMondal' / 'publicationModal' / 'userModal'
  const [projetdata, setProjetdata] = useState({ data: [] });
  const [pubdata, setPubdata] = useState({ data: [] });
  const [userdata, setUserdata] = useState([]);
  const [donationdata, setDonationdata] = useState({data: []});

  // Pour le projet
  const {
    register: registerProjet,
    handleSubmit: handleSubmitProjet,
    reset: resetProjet,
    formState: { errors: errorsProjet },
  } = useForm();

    // Pour le projet
  const {
    register: registerUser,
    handleSubmit: handleSubmitUser,
    reset: resetUser,
    formState: { errors: errorsUser },
  } = useForm();

  const {
  register: registerPublication,
  handleSubmit: handleSubmitPublication,
  reset: resetPublication,
  formState: { errors: errorsPublication },
} = useForm(); 

const {
  register: registerDonation,
  handleSubmit: handleSubmitDonation,
  reset: resetDonation,
  formState: { errors: errorsDonation },
} = useForm(); 

  const dataProject =async (page,size)=>{
    const data=await getAllProjets(null,page,size);
    setProjetdata(data) 
  } 

  const dataUser =async ()=>{
    const data=await getAllUsers();
    setUserdata(data) 
  } 

  const dataPublication =async (page,size)=>{ 
    const data=await getAllPublications(null,page,size);  
    setPubdata(data) 
  } 

  const dataDonation =async (page,size)=>{ 
    const data=await getDonations(page,size);  
    setDonationdata(data) 
  }    

  const token = sessionStorage.getItem("token");

  useEffect(() => {
   if (!token) {
    navigation("/admLogin")
  }
  });

  const handleNavClick = (section) => {
    setActiveSection(section);
  };

  function openModal(modalId) {
    cleanModal()
    setOpenedModal(modalId);
  } 

  const deconnection=()=>{
     logout()
     navigation("/admLogin")
  }

  function closeModal() {
    // tu peux vérifier modalId si tu veux 
    setOpenedModal(null);
  }

  function cleanModal(){ 
    resetProjet({
      id:null,
      title:null,
      secteur:null,
      status:null,
      fichier:null,
      typeFichier:null,
      beneficier:null,
      budget:null,
      devise:null,
      avencement:null,
      debut:new Date(null).toISOString().slice(0, 16),
      fin:new Date(null).toISOString().slice(0, 16),
      contenu:null,
      urlVideo:null
    });
    resetPublication({
      id:null,
      title:null,
      type:null,
      status:null,
      fichier:null, 
      typeFichier:null,
      contenu:null,
      urlVideo:null
    }); 

    resetDonation({
      id:null,
      donateur:null,
      montant:null,
      devise:null,
      email:null,  
      status:null
    }); 

    resetDonation({
      id:null,
      username:null,
      email:null,
      role:null,
      password:null
    });
  }

    // Extract YouTube video ID from various URL formats
    const extractYouTubeId = (url) => {
      if (!url) return null;
      try {
        const u = new URL(url);
        if (u.hostname.includes('youtu.be')) {
          // https://youtu.be/VIDEO_ID
          return u.pathname.replace('/', '').split('?')[0];
        }
        if (u.hostname.includes('youtube.com')) {
          // https://www.youtube.com/watch?v=VIDEO_ID
          if (u.searchParams.get('v')) return u.searchParams.get('v');
          // https://www.youtube.com/embed/VIDEO_ID or /shorts/VIDEO_ID
          const parts = u.pathname.split('/').filter(Boolean);
          const idx = parts.findIndex(p => p === 'embed' || p === 'shorts' || p === 'v');
          if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
        }
      } catch (_) {
        // Not a valid URL, maybe a raw ID passed already
        if (typeof url === 'string' && url.length >= 10 && url.length <= 64) return url;
      }
      return null;
    };

  const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
};

      // Soumission projet
    const onSubmitProjet = async (data) => {
      try { 
       const budget=parseFloat(data.budget) 
        const avencement=parseFloat(data.avencement)
        const beneficier=parseFloat(data.beneficier) 

        const formData = new FormData(); 
        formData.append("title", data.title);
        formData.append("contenu", data.contenu);
        formData.append("status", data.status);
        formData.append("devise", data.devise);
        formData.append("typeFichier", data.typeFichier);
        formData.append("debut", data.debut);
        formData.append("fin", data.fin); 
        formData.append("secteur", data.secteur);
        formData.append("budget", budget);
        formData.append("avencement", avencement);
        formData.append("beneficier", beneficier);

    if (data.typeFichier === "VIDEO") {
      // vidéo = URL
      formData.append("urlVideo", data.urlVideo);
    } else {
      // image ou pdf = fichier
      if (data.fichier && data.fichier[0]) {
        formData.append("fichier", data.fichier[0]); // data.fichier est un FileList
      }
    }


        if (!data.id) {
          await createProjet(formData);
        } else {
          await updateProjet(data.id,formData); 
        }
        toast.success("Operation effectuée avec succès !");
        resetProjet();
        dataProject(1,10)
        closeModal("projetMondal");
      } catch (error) {
        console.error("Erreur création projet:", error);
        toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
        alert();
      }
    };

    
const onSubmitPublication = async (data) => {
  try {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("contenu", data.contenu);
    formData.append("type", data.type);
    formData.append("typeFichier", data.typeFichier);

    if (data.typeFichier === "VIDEO") {
      // vidéo = URL
      formData.append("urlVideo", data.urlVideo);
    } else {
      // image ou pdf = fichier
      if (data.fichier && data.fichier[0]) {
        formData.append("fichier", data.fichier[0]); // data.fichier est un FileList
      }
    }

    if (!data.id) {
      await createPublication(formData); // côté back-end attend FormData
    } else {
      await updatePublication(data.id, formData);
    }

    toast.success("Opération effectuée avec succès !");
    resetPublication();
    dataPublication(1, 10);
    closeModal("publicationModal");
  } catch (error) {
    console.error("Erreur création publication:", error);
    toast.error("Erreur lors de l'opération.", { style: { backgroundColor: "red", color: "white" } });
  }
};


    const [selectedTypeFichierPublication, setSelectedTypeFichierPublication] = useState("IMAGES");
    const [selectedTypeFichierProjet, setSelectedTypeFichierProjet] = useState("IMAGES");

    // Soumission publications
    const onSubmitUser = async (data) => {
      try { 
        await create(data);  
         toast.success("Operation effectuée avec succès ! !");
         resetUser();
        dataUser(1,10)
         closeModal("userModal");
      } catch (error) {
        console.error("Erreur création publication:", error);
        toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}}); 
      }
    }; 

      // Soumission donztion
    const onSubmitDonation = async (data) => {
      try {
        console.log(data.id)
        data.montant=parseFloat(data.montant) 
        if (!data.id) { 
          await createDonation(data);
        } else { 
          await updateDonation(data.id,data); 
        }
        toast.success("Operation effectuée avec succès !");
        resetDonation();
        dataDonation(1,10)
        closeModal("donationprojetMondal");
      } catch (error) {
        console.error("Erreur création projet:", error);
        toast.error("Erreur lors de l'operation'.",{style:{backgroundColor:"red",color:"white"}});
        alert();
      }
    };

    // Edit part 
  function projetUpdate(element) {
    setSelectedTypeFichierProjet(element.typeFichier);
    resetProjet({
      id:element.id,
      title:element.title,
      secteur:element.secteur,
      status:element.status,
      fichier:element.fichier,
      typeFichier:element.typeFichier,
      beneficier:element.beneficier,
      budget:element.budget,
      devise:element.devise,
      urlVideo:element.fichier,
      avencement:element.avencement,
      debut:new Date(element.debut).toISOString().slice(0, 16),
      fin:new Date(element.fin).toISOString().slice(0, 16),
      contenu:element.contenu
    })
    setOpenedModal("projetMondal");
  }

   function publicationUpdate(element) { 
    setSelectedTypeFichierPublication(element.typeFichier);
    resetPublication({
      id:element.id,
      title:element.title,
      type:element.type,
      status:element.status, 
      urlVideo:element.fichier,
      fichier:element.fichier, 
      typeFichier:element.typeFichier,
      contenu:element.contenu
    })
    setOpenedModal("publicationModal");
  }

  function donationUpdate(element) { 
    resetDonation({
      id:element.id,
      donateur:element.donateur,
      montant:element.montant,
      devise:element.devise,
      email:element.email,
      status:element.status
    })
    setOpenedModal("donationprojetMondal");
  }

  
    const deleteProjets=async (id)=>{
     const confirmed = window.confirm("Voulez-vous vraiment supprimer ?");
    if (!confirmed) return;
    await deleteProjet(id) 
    dataProject(1,10)
  }

  const deletePublications=async (id)=>{
     const confirmed = window.confirm("Voulez-vous vraiment supprimer ?");
    if (!confirmed) return;
    await deletePublication(id)
    dataPublication(1,10)
  }

  const deleteUser=async (id)=>{
     const confirmed = window.confirm("Voulez-vous vraiment supprimer ?");
    if (!confirmed) return;
    await deleteUsers(id) 
    dataUser(1,10)
  }

    const deleteDonations=async (id)=>{
     const confirmed = window.confirm("Voulez-vous vraiment supprimer ?");
     if (!confirmed) return;
     await deleteDonation(id)
     dataDonation(1,10)
  }


  return (
    <>  
      {/* Modals */}
      <div id="projetMondal" className={`modal ${openedModal === "projetMondal" ? "active" : ""}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>Créer un Nouveau Projet</h3>
            <button className="modal-close" onClick={() => closeModal("projetMondal")}>
              &times;
            </button>
          </div>
       <form className="modal-form" onSubmit={handleSubmitProjet(onSubmitProjet)}>
        <div className="form-group">
          <label htmlFor="reportTitle">Titre du projet</label>
          <input type="text" {...registerProjet("id", { required: false })} hidden placeholder="Entrez le id..." />
          <input type="text" {...registerProjet("title", { required: true })} placeholder="Entrez le titre..." />
          {errorsProjet.title && <p className="error">{errorsProjet.title.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="secteur">Secteur</label>
          <select {...registerProjet("secteur", { required: true })} defaultValue="">
            <option value="" disabled>Sélectionnez le secteur</option>
            <option value="EDUCATION">EDUCATION</option>
            <option value="SANTE">SANTE</option>
            <option value="ENVIRONNEMENT">ENVIRONNEMENT</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select {...registerProjet("status", { required: true })} defaultValue="">
            <option value="" disabled>Sélectionnez le status</option>
            <option value="BROUILLON">BROUILLON</option>
            <option value="ENCOURS">ENCOURS</option>
            <option value="REALISER">REALISER</option>
          </select>
        </div>
 
        <div className="form-group">
          <label htmlFor="type file">Type de fichier :</label>
          <div style={{ display: "flex", gap: "20px" }}>
            <label><input type="radio" {...registerProjet("typeFichier")} onChange={() => setSelectedTypeFichierProjet("IMAGES")} value="IMAGES" /> Image</label>
            <label><input type="radio" {...registerProjet("typeFichier")} onChange={() => setSelectedTypeFichierProjet("VIDEO")} value="VIDEO" /> Vidéo</label>
            <label><input type="radio" {...registerProjet("typeFichier")} onChange={() => setSelectedTypeFichierProjet("PDF")} value="PDF" /> PDF</label>
          </div>
        </div>

          <div className="form-group">
              {selectedTypeFichierProjet === "VIDEO" ? (
                <>
                  <label htmlFor="urlVideo">URL de la vidéo</label> 
                  <input type="text" {...registerProjet("urlVideo")} placeholder="Entrez l'URL de la vidéo..." />
                </>
              ) : (
                <>
                  <label htmlFor="file">Fichier</label>
                  <input type="file" {...registerProjet("fichier")} />
                </>
              )}
              
            </div>

        <div className="form-group">
          <label htmlFor="benef">Nombre de bénéficiaires</label>
          <input type="text" {...registerProjet("beneficier")} placeholder="Nombre de bénéficiaires..." />
        </div>

        <div className="form-group">
          <label htmlFor="budget">Budget</label>
          <input type="text" {...registerProjet("budget")} placeholder="Entrez le montant..." />
        </div>

        <div className="form-group">
          <label htmlFor="devise">Devise</label>
          <input type="text" {...registerProjet("devise")} placeholder="Entrez la devise..." />
        </div>

          <div className="form-group">
            <label htmlFor="avancement">Avancement du projet (%)</label>
            <input
              type="number"
              {...registerProjet("avencement", {
                min: { value: 0, message: "Le minimum est 0" },
                max: { value: 100, message: "Le maximum est 100" },
              })}
              placeholder="Pourcentage..."
            />
          </div>


        <div className="form-group">
          <label htmlFor="debut">Date début</label>
          <input type="datetime-local" {...registerProjet("debut")} />
        </div>

        <div className="form-group">
          <label htmlFor="fin">Date fin</label>
          <input type="datetime-local" {...registerProjet("fin")} />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea {...registerProjet("contenu")} rows={3} placeholder="Entrez la description..."></textarea>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={() => closeModal("projetMondal")}>
            Annuler
          </button>
          <button type="submit" className="btn btn-primary">
            Créer
          </button>
        </div>
      </form>
        </div>
      </div>

      <div id="publicationModal" className={`modal ${openedModal === "publicationModal" ? "active" : ""}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>Créer une Nouvelle Publication</h3>
            <button className="modal-close" onClick={() => closeModal("publicationModal")}>
              &times;
            </button>
          </div>
                <form className="modal-form" onSubmit={handleSubmitPublication(onSubmitPublication)}>
        <div className="form-group">
          <label htmlFor="title">Titre de la publication</label>
          <input type="text" {...registerPublication("id", { required: false})} hidden placeholder="Entrez le id..." />
          <input type="text" {...registerPublication("title", { required: true })} placeholder="Entrez le titre..." />
             {errorsPublication.title && <p className="error">{errorsPublication.title.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="type pub">Type de publication</label>
          <select {...registerPublication("type", { required: true })} defaultValue="">
            <option value="" disabled>Sélectionnez le type</option>
            <option value="ACTUALITES">ACTUALITES</option>
            <option value="RAPPORTS">RAPPORTS</option>
            <option value="NEWSLETTER">NEWSLETTER</option>
            <option value="TEMOIGNAGE">TEMOIGNAGE</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="type file">Type de fichier :</label>
          <div style={{ display: "flex", gap: "20px" }}>
            <label><input type="radio" {...registerPublication("typeFichier")} onChange={() => setSelectedTypeFichierPublication("IMAGES")} value="IMAGES" /> Image</label>
            <label><input type="radio" {...registerPublication("typeFichier")} onChange={() => setSelectedTypeFichierPublication("VIDEO")} value="VIDEO" /> Vidéo</label>
            <label><input type="radio" {...registerPublication("typeFichier")} onChange={() => setSelectedTypeFichierPublication("PDF")} value="PDF" /> PDF</label>
          </div>
        </div>

          <div className="form-group">
              {selectedTypeFichierPublication === "VIDEO" ? (
                <>
                  <label htmlFor="urlVideo">URL de la vidéo</label> 
                  <input type="text" {...registerPublication("urlVideo")} placeholder="Entrez l'URL de la vidéo..." />
                </>
              ) : (
                <>
                  <label htmlFor="file">Fichier</label>
                  <input type="file" {...registerPublication("fichier")} />
                </>
              )}
            </div>

        <div className="form-group">
          <label htmlFor="desc">Description</label>
          <textarea {...registerPublication("contenu")} rows={3} placeholder="Entrez la description..."></textarea>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={() => closeModal("publicationModal")}>
            Annuler
          </button>
          <button type="submit" className="btn btn-primary">
            Créer
          </button>
        </div>
      </form>

        </div>
      </div>

      <div id="userModal" className={`modal ${openedModal === "userModal" ? "active" : ""}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>Créer un Nouvel Utilisateur</h3>
            <button className="modal-close" onClick={() => closeModal("publicationModal")}>
              &times;
            </button>
          </div>
        <form className="modal-form" onSubmit={handleSubmitUser(onSubmitUser)}>
                {/* Nom */}
                <div className="form-group">
                  <label htmlFor="userName">Nom de l'utilisateur</label>
                 <input type="text" {...registerUser("id", { required: false })} hidden placeholder="Entrez le id..." />
                   <input type="text" {...registerUser("username")} placeholder="Entrez nom d'utilisateur..." /> 
               {errorsUser.username && <p className="error">{errorsUser.username.message}</p>}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="userEmail">Email</label>
                  <input type="email" {...registerUser("email")} id="userEmail" placeholder="Entrez l'email..." />
                </div>

                {/* password */}
                <div className="form-group">
                  <label htmlFor="userEmail">Mot de passe</label>
                  <input type="password" {...registerUser("password")} id="userEmail" placeholder="Entrez le mot de passe..." />
                </div>
            
                <div className="form-group">
                  <label htmlFor="type file">Roles :</label>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <label><input type="radio" {...registerPublication("role")} value="ADMIN" /> Administrateur</label>
                    <label><input type="radio" {...registerPublication("role")} value="POSTER" /> Utilisateur simple</label>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => closeModal("publicationModal")}>
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Créer
                  </button>
                </div>
              </form>

        </div>
      </div> 

      <div id="donationprojetMondal" className={`modal ${openedModal === "donationprojetMondal" ? "active" : ""}`} >
        <div className="modal-content">
          <div className="modal-header">
            <h3>Générer un Rapport de Donation</h3>
            <button
              className="modal-close"
              onClick={() => closeModal("donationprojetMondal")}
            >
              &times;
            </button>
          </div>
          <form className="modal-form" onSubmit={handleSubmitDonation(onSubmitDonation)} >
            <div className="form-group">
               <label htmlFor="donateur">Donateur</label>
            <input type="text" id="id" {...registerDonation("id", { required: false })} hidden placeholder="Entrez le id..." />
            <input
                type="text"
                id="donateur"
                {...registerDonation("donateur", { required: true })} 
                placeholder="Nom du donateur"
                required
              />
             {errorsDonation.title && <p className="error">{errorsDonation.donateur.message}</p>}
            </div> 

            <div className="form-group">
              <label htmlFor="montant">Montant (€)</label>
              <input
                type="number"
                id="montant"
                {...registerDonation("montant", { required: true })} 
                placeholder="Montant du don"
                min="0"
                step="0.01"
                required
              />
            </div> 

             <div className="form-group">
              <label htmlFor="devise">Devise</label>
              <input
                type="text"
                id="devise"
                {...registerDonation("devise", { required: true })} 
                placeholder="entre devise..."
                min="0"
                step="0.01"
                required
              />
            </div> 

             <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                {...registerDonation("email", { required: false })} 
                placeholder="entre email..."
                min="0"
                step="0.01"
                required
              />
            </div> 

            <div className="form-group">
              <label htmlFor="status">Statut</label>
              <div style={{ display: "flex", gap: "20px", marginTop: "5px" }}>
                <label> 
                  <input type="radio" {...registerDonation("status")}  value="CONFIRME" /> Confirmé
                </label>
                <label>
                  <input type="radio" {...registerDonation("status")}  value="EN_ATTENTE" /> En attente
                </label>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => closeModal("donationprojetMondal")}
              >
                Annuler
              </button>
              <button type="submit" className="btn btn-primary">
                Générer
              </button>
            </div>
          </form>
        </div>
      </div>

 {/* FIN MODAL  */}


      <aside className="sidebar" id="sidebar">
        <div className="sidebar-header">
          <h1>Admin Dashboard</h1>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <a
                href="#dashboard"
                className={`nav-link ${activeSection === "dashboard" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("dashboard");
                }}
                data-section="dashboard"
              >
                <i className="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="#reports"
                className={`nav-link ${activeSection === "projets" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("projets");
                   dataProject(1,10);
                }}
                data-section="reports"
              >
                <i className="fas fa-file-alt"></i>
                <span>Projets</span>
              </a>
            </li>
            <li>
              <a
                href="#publications"
                className={`nav-link ${activeSection === "publications" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("publications");
                  dataPublication(1,10);
                }}
                data-section="publications"
              >
                <i className="fas fa-newspaper"></i>
                <span>Publications</span>
              </a>
            </li>
            <li>
              <a
                href="#users"
                className={`nav-link ${activeSection === "users" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("users");
                  dataUser()
                }}
                data-section="users"
              >
                <i className="fas fa-users"></i>
                <span>Utilisateurs</span>
              </a>
            </li>
            <li>
              <a
                href="#donations"
                className={`nav-link ${activeSection === "donations" ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("donations");
                  dataDonation(1,10);
                }}
                data-section="donations"
              >
                <i className="fas fa-heart"></i>
                <span>Donations</span>
              </a>
            </li>
          </ul>
         <div className="sidebar-footer"> 

              <button className="nav-link logout"  onClick={deconnection}>
                <i className="fas fa-sign-out-alt"></i>
                <span>Déconnexion</span>
              </button>
            </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button className="mobile-menu-btn" id="mobileMenuBtn">
              <i className="fas fa-bars"></i>
            </button>
            <h2 id="pageTitle">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h2>
          </div>
          <div className="header-right">
            <button className="notification-btn">
              <i className="fas fa-bell"></i>
            </button>
            <div className="user-profile">
              <div className="avatar">A</div>
              <span>Admin User</span>
            </div>
          </div>
        </header>

        {/* Sections */}

        {/* Dashboard dashboard */}
        <section
          style={{width:"100%"}}
          id="dashboard-section"
          className={`content-section ${activeSection === "dashboard" ? "active" : "hidden"}`}
        >
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon primary">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="stat-content">
                <h3 id="totalReports">1</h3>
                <p>Total Projets</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon success">
                <i className="fas fa-newspaper"></i>
              </div>
              <div className="stat-content">
                <h3 id="totalPublications">1</h3>
                <p>Publications</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-content">
                <h3 id="totalUsers">1</h3>
                <p>Utilisateurs</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon danger">
                <i className="fas fa-heart"></i>
              </div>
              <div className="stat-content">
                <h3 id="totalDonations">€50</h3>
                <p>Donations</p>
              </div>
            </div>
          </div>

          <div className="activity-card">
            <h3>Activité Récente</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-dot primary"></div>
                <div className="activity-content">
                  <p>Nouveau rapport publié: "Rapport Mensuel Janvier 2024"</p>
                  <span className="activity-time">Il y a 2 heures</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-dot success"></div>
                <div className="activity-content">
                  <p>Nouvel utilisateur créé: Marie Dubois</p>
                  <span className="activity-time">Il y a 4 heures</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-dot warning"></div>
                <div className="activity-content">
                  <p>Nouvelle donation reçue: €50</p>
                  <span className="activity-time">Il y a 6 heures</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projet projets */}
        <section
          style={{width:"100%"}}
          id="reports-section"
          className={`content-section ${activeSection === "projets" ? "active" : "hidden"}`}
        >
          <div className="section-header">
            <h3>Gestion des Projets</h3>
            <button className="btn btn-primary" onClick={() => openModal("projetMondal")}>
              <i className="fas fa-plus"></i> Nouveau Projet
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Titre</th>
                  <th>Statut</th>
                  <th>Secteur</th>
                  <th>Date debut</th>
                  <th>Date fin</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="reportsTable">
           {projetdata.data?.map((element, i) => (
                <tr key={element.id}>
                  <td>
                    <div className="table-cell-title">{i + 1}</div>
                  </td>
                  <td>
                    <div className="table-cell-title">{element.title}</div>
                    <div className="table-cell-subtitle">{element.contenu.slice(0, 15)} ...</div>
                  </td>
                  <td>
                    <span className="badge success">{element.status}</span>
                  </td>
                   <td>
                    <span className="badge success">{element.secteur}</span>
                  </td>
                  <td className="table-cell-date"> {formatDate(element.debut)}</td>
                  <td className="table-cell-date">{formatDate(element.fin)}</td>
                  <td>
                    <div className="action-buttons">
                     <button className="btn-icon">👁</button>
                      <button className="btn-icon" onClick={()=>projetUpdate(element)}>✏️</button>
                      <button className="btn-icon danger" onClick={()=>deleteProjets(element.id)}>🗑</button> 
                    </div>
                  </td>
                </tr>
              ))}

               
             
              </tbody>
            </table>
          </div>
        </section>

        {/* Publications publications */}
        <section
          style={{width:"100%"}}
          id="publications-section"
          className={`content-section ${activeSection === "publications" ? "active" : "hidden"}`}
        >
          <div className="section-header">
            <h3>Gestion des Publications</h3>
            <button className="btn btn-primary" onClick={() => openModal("publicationModal")}>
              <i className="fas fa-plus"></i> Nouvelle Publication
            </button>
          </div>
          <div className="publications-grid">
          {pubdata.data?.map((element) => (
            <div className="publication-card" key={element.id}> 
             <div className="publication-image">  
                {element.typeFichier === "IMAGES" && (
                  <img
                   src={`${API_URL}/${element.fichier}`}
                    alt={element.title}
                    
                  />
                )}


                {element.typeFichier === "VIDEO" && (() => {
                  const yid = extractYouTubeId(element.fichier);
                  const src = yid ? `https://www.youtube.com/embed/${yid}` : element.fichier;
                  return (
                    <iframe
                      src={src}
                      title={element.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  );
                })()} 

                {element.typeFichier === "PDF" && (
                  <a href={`${API_URL}/${element.fichier}`} target="_blank" rel="noopener noreferrer">
                    Ouvrir le PDF
                  </a>
                )} 

              </div>
              <div className="publication-content">
                <h4>{element.title}</h4>
                <p>{element.contenu.slice(0,200)} ...</p>
                <div className="publication-footer">
                  <span className="badge success">{element.type}</span>
                <div className="action-buttons">
                  <button className="btn-icon edit" onClick={()=>publicationUpdate(element)} title="Modifier">
                    ✏️
                  </button>
                  <button className="btn-icon delete" onClick={()=>deletePublications(element.id)} title="Supprimer">
                    🗑️
                  </button> 
                </div>

                </div>
              </div>
            </div>
                   ))}
        </div>
       
        </section>

        {/* Users users */}
        <section
          style={{width:"100%"}}
          id="users-section"
          className={`content-section ${activeSection === "users" ? "active" : "hidden"}`}
        >
          <div className="section-header">
            <h3>Gerer les utilisateurs</h3>
            <button className="btn btn-primary" onClick={() => openModal("userModal")}>
              <i className="fas fa-plus"></i> Nouvel Utilisateur
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Email</th>
                  <th>Rôle</th> 
                  <th>Actions</th>
                </tr>
              </thead> 
              <tbody id="usersTable">
                {userdata?.map((element) => (
                <tr key={element.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">AU</div>
                      <div className="user-info">
                        <div className="user-name">{element.username}</div>
                        {/* <div className="user-date">{element.password}</div> */}
                      </div>
                    </div>
                  </td>
                  <td>{element.email}</td>
                  <td> 
                   <span className="badge success"> {element.role==null?"Pas de role":element.role}</span>
                  </td> 
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon">
                        <i className="fas fa-eye" onClick={()=>deleteUser(element.id)}>🗑️</i>
                      </button>  
                      </div>
                  </td>
                </tr>
                 ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Donations Donations */}
        <section
          style={{width:"100%"}}
          id="donations-section"
          className={`content-section ${activeSection === "donations" ? "active" : "hidden"}`}
        >
          <div className="section-header">
            <h3>Suivi des Donations</h3> 
            <button className="btn btn-primary" onClick={() => openModal("donationprojetMondal")}>Générer Rapport</button>
          </div>

          <div className="donation-stats">
            <div className="stat-card">
              <div className="stat-content">
                <h3>€50</h3>
                <p>Total ce mois</p>
                <span className="trend success">+12% vs mois dernier</span>
              </div>
              <div className="stat-icon success">
                <i className="fas fa-trending-up"></i>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <h3>1</h3>
                <p>Nombre de donateurs</p>
                <span className="trend primary">+3 nouveaux</span>
              </div>
              <div className="stat-icon primary">
                <i className="fas fa-users"></i>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-content">
                <h3>€50</h3>
                <p>Don moyen</p>
                <span className="trend neutral">Stable</span>
              </div>
              <div className="stat-icon purple">
                <i className="fas fa-heart"></i>
              </div>
            </div>
          </div>

          <div className="donations-card">
            <h3>Donations Récentes</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Donateur</th>
                    <th>Montant</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Statut</th>
                  </tr>
                </thead>  
                <tbody>
                {Array.isArray(donationdata?.data?.data) &&
                    donationdata.data.data.map((element) =>(  
                  <tr key={element.id}>
                    <td>
                      <div className="table-cell-title">{element.donateur}</div>
                      {/* <div className="table-cell-subtitle">sophie.leroux@email.com</div> */}
                    </td>
                    <td className="font-semibold">{element.montant}{element.devise}</td>
                    <td className="table-cell-date">{element.email}</td>
                    <td className="table-cell-date">{formatDate(element.date)}</td>
                    <td>
                      <span className="badge success">{element.status}</span>
                    </td>
                    <td>
                    <div className="action-buttons">
                     <button className="btn-icon">👁</button>
                      <button className="btn-icon" onClick={()=>donationUpdate(element)}>✏️</button>
                      <button className="btn-icon danger" onClick={()=>deleteDonations(element.id)}>🗑</button> 
                    </div>
                  </td>
                  </tr>
                 ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

 
    </>
  );
}
