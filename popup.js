// Récupération des infos utilisateur
async function getUserInfo() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['userEmail'], (result) => {
      console.log('📦 Email récupéré:', result.userEmail || 'Aucun');
      resolve(result);
    });
  });
}

// Sauvegarde de l'email utilisateur
async function saveUserEmail(email) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ userEmail: email }, () => {
      console.log('💾 Email sauvegardé:', email);
      resolve();
    });
  });
}

// Extraction du nom d'utilisateur depuis l'email
function extractUsername(email) {
  if (!email) return null;
  const match = email.match(/^(.+)@laplateforme\.io$/);
  return match ? match[1] : null;
}

// Vérification de la session Plesk
async function checkPleskSession() {
  try {
    const response = await fetch("https://students-laplateforme.io:8443/", {
      credentials: "include"
    });
    const text = await response.text();

    if (text.includes("plesk-login") || text.includes("loginForm")) {
      return false; // non connecté
    }
    return true; // connecté
  } catch (err) {
    console.error("Erreur check Plesk:", err);
    return false;
  }
}

// Vérification de la session Figma
async function checkFigmaSession() {
  try {
    const response = await fetch("https://www.figma.com/files/", {
      credentials: "include"
    });
    const text = await response.text();

    if (text.includes("Log in") || text.includes("login-form") || text.includes("figma-login")) {
      return false; // pas connecté
    }
    return true; // connecté
  } catch (err) {
    console.error("Erreur check Figma:", err);
    return false;
  }
}

// Vérification de la session Balsamiq
async function checkBalsamiqSession() {
  try {
    const response = await fetch("https://balsamiq.cloud/", { credentials: "include" });
    const text = await response.text();

    if (text.toLowerCase().includes("login") || text.toLowerCase().includes("connexion")) {
      return false; // pas connecté
    }
    return true; // connecté
  } catch (err) {
    console.error("Erreur check Balsamiq:", err);
    return false;
  }
}

// Génération des liens dynamiques
function generateLinks(username) {
  return [
    {
      category: "LaPlateforme",
      tools: [
        { name: "Intra", description: "Espace étudiant", icon: "fa-solid fa-graduation-cap", url: "https://intra.laplateforme.io" },
      ]
    },
    {
      category: "Intérim",
      tools: [
        { name: "Armado", description: "Espace intérim", icon: "fa-solid fa-ribbon", url: "https://myarmado.fr" },
        { name: "campuslavarappe", description: "Espace intérim", icon: "fa-solid fa-tent", url: "https://campuslavarappe.digiforma.net" }
      ]
    },
    {
      category: "Local",
      tools: [
        { name: "Localhost", description: "Votre environnement local", icon: "fa-solid fa-server", url: `http://localhost` },
        { name: "Phpmyadmin", description: "Gestion de base de données", icon: "fa-solid fa-database", url: `http://localhost/phpmyadmin` },
      ]
    },
    {
      category: "Développement",
      tools: [
        { name: "GitHub", description: "Votre profil", icon: "fa-brands fa-github", url: `https://github.com/${username}` },
        { name: "Site GitHub", description: "Votre site GitHub", icon: "fa-brands fa-github", url: `https://${username}.github.io` },
        { name: "Panel Plesk", description: "Administration serveur", icon: "fa-solid fa-server", url: "https://students-laplateforme.io:8443" },
        { name: "Site Plesk", description: "Votre hébergement web", icon: "fa-solid fa-globe", url: `https://${username}.students-laplateforme.io` }
      ]
    },
    {
      category: "Design & Outils",
      tools: [
        { name: "Figma", description: "Design collaboratif", icon: "fa-brands fa-figma", url: "https://www.figma.com" },
        { name: "Balsamiq", description: "Wireframing", icon: "fa-solid fa-icicles", url: "https://www.balsamiq.com" }
      ]
    }
  ];
}

// Animation d'apparition
function fadeIn(element) {
  element.style.opacity = 0;
  element.style.transition = 'opacity 0.4s';
  requestAnimationFrame(() => { element.style.opacity = 1; });
}

// Affichage d'une notification toast
function showToast(message) {
  const oldToast = document.getElementById('copyToast');
  if (oldToast) oldToast.remove();

  const toast = document.createElement('div');
  toast.id = 'copyToast';
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '15px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = '#0062ff';
  toast.style.color = '#fff';
  toast.style.padding = '8px 15px';
  toast.style.borderRadius = '8px';
  toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
  toast.style.fontSize = '13px';
  toast.style.zIndex = '9999';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.3s';

  document.body.appendChild(toast);

  // Animation d'apparition
  requestAnimationFrame(() => { toast.style.opacity = '1'; });

  // Animation de disparition après 2 secondes
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.addEventListener('transitionend', () => toast.remove());
  }, 2000);
}

// Affichage de l'interface principale
async function renderConnectedView(email, username) {
  const links = generateLinks(username);

  let html = `
    <div class="container-custom">
      <div class="user-badge">
        <i class="fa-solid fa-circle-check"></i>
        <div class="user-email">${email}</div>
        <button id="copyEmailBtn" class="btn btn-sm btn-outline-light ms-auto" title="Copier l'email">
          <i class="fa-regular fa-copy"></i>
        </button>
      </div>
  `;

  // Génération des sections et des outils
  links.forEach(section => {
    html += `<div class="section-title">${section.category}</div><div class="tools-grid">`;
    section.tools.forEach(tool => {
      if (tool.name === "Panel Plesk") {
        html += `<div id="pleskButtonWrapper"></div>`;
      } else if (tool.name === "Figma") {
        html += `<div id="figmaButtonWrapper"></div>`;
      } else if (tool.name === "Balsamiq") {
        html += `<div id="balsamiqButtonWrapper"></div>`;
      } else if (tool.name.toLowerCase() === "campuslavarappe") {
        html += `<div id="campusButtonWrapper"></div>`;
      } else {
        // Cartes normales
        html += `
          <a href="#" class="tool-card" data-url="${tool.url}">
            <div class="tool-icon"><i class="${tool.icon}"></i></div>
            <div class="tool-content">
              <div class="tool-name">${tool.name}</div>
              <div class="tool-description">${tool.description}</div>
            </div>
            <i class="fa-solid fa-arrow-right tool-arrow"></i>
          </a>
        `;
      }
    });
    html += `</div>`;
  });

  html += `
      <div class="text-center">
        <a href="#" class="btn-link" id="changeEmailBtn">
          <i class="fa-solid fa-pen"></i> Changer d'email
        </a>
      </div>
    </div>
  `;

  const app = document.getElementById('app');
  app.innerHTML = html;
  fadeIn(app);

  // Cartes normales
  document.querySelectorAll('.tool-card').forEach(card => {
    if (!card.dataset.url) return;
    card.addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: card.dataset.url });
    });
  });

  // Copier l'email
  document.getElementById('copyEmailBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(email);
    showToast('📋 Email copié !');
  });

  // Changer l'email
  document.getElementById('changeEmailBtn').addEventListener('click', (e) => {
    e.preventDefault();
    renderSetupView();
  });

  // Vérification Plesk
  checkPleskSession().then(isConnected => {
    const wrapper = document.getElementById("pleskButtonWrapper");
    if (wrapper) {
      wrapper.innerHTML = `
        <a href="https://students-laplateforme.io:8443" target="_blank"
           class="tool-card ${isConnected ? 'connected' : 'not-connected'}">
          <div class="tool-icon"><i class="fa-solid fa-server"></i></div>
          <div class="tool-content">
            <div class="tool-name">Panel Plesk</div>
            <div class="tool-description">${isConnected ? "Déjà connecté ✅" : "Connexion requise ⚠️"}</div>
          </div>
          <i class="fa-solid fa-arrow-right tool-arrow"></i>
        </a>
      `;
    }
  });

  // Vérification Figma
  checkFigmaSession().then(isConnected => {
    const wrapper = document.getElementById("figmaButtonWrapper");
    if (wrapper) {
      wrapper.innerHTML = `
        <a href="https://www.figma.com/files/" target="_blank"
           class="tool-card ${isConnected ? 'connected' : 'not-connected'}">
          <div class="tool-icon"><i class="fa-brands fa-figma"></i></div>
          <div class="tool-content">
            <div class="tool-name">Figma</div>
            <div class="tool-description">${isConnected ? "Déjà connecté ✅" : "Connexion requise ⚠️"}</div>
          </div>
          <i class="fa-solid fa-arrow-right tool-arrow"></i>
        </a>
      `;
    }
  });

  // Vérification Balsamiq
  checkBalsamiqSession().then(isConnected => {
    const wrapper = document.getElementById("balsamiqButtonWrapper");
    if (wrapper) {
      wrapper.innerHTML = `
        <a href="https://www.balsamiq.com/" target="_blank"
           class="tool-card ${isConnected ? 'connected' : 'not-connected'}">
          <div class="tool-icon"><i class="fa-solid fa-icicles"></i></div>
          <div class="tool-content">
            <div class="tool-name">Balsamiq</div>
            <div class="tool-description">${isConnected ? "Déjà connecté ✅" : "Connexion requise ⚠️"}</div>
          </div>
          <i class="fa-solid fa-arrow-right tool-arrow"></i>
        </a>
      `;
    }
  });

  // Gestion Campus La Varappe
  const campusWrapper = document.getElementById("campusButtonWrapper");
  chrome.storage.sync.get(['campusLink'], (res) => {
    let savedLink = res.campusLink || '';

    const renderCampusCard = () => {
      campusWrapper.innerHTML = `
        <a href="#" class="tool-card ${savedLink ? 'connected' : 'not-connected'}" id="campusCard">
          <div class="tool-icon"><i class="fa-solid fa-tent"></i></div>
          <div class="tool-content">
            <div class="tool-name">Campus La Varappe</div>
            <div class="tool-description">${savedLink ? "Lien enregistré ✅" : "Cliquez pour coller le lien reçu par mail ⚠️"}</div>
          </div>
          <i class="fa-solid fa-arrow-right tool-arrow"></i>
        </a>
      `;

      document.getElementById('campusCard').addEventListener('click', (e) => {
        e.preventDefault();
        if (savedLink) {
          chrome.tabs.create({ url: savedLink });
        } else {
          // Affichage du toast pour coller le lien
          const oldToast = document.getElementById('campusToast');
          if (oldToast) oldToast.remove();

          const toast = document.createElement('div');
          toast.id = 'campusToast';
          toast.style.position = 'fixed';
          toast.style.bottom = '15px';
          toast.style.left = '50%';
          toast.style.transform = 'translateX(-50%)';
          toast.style.background = '#0062ff';
          toast.style.color = '#fff';
          toast.style.padding = '15px';
          toast.style.borderRadius = '8px';
          toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
          toast.style.fontSize = '13px';
          toast.style.zIndex = '9999';
          toast.style.opacity = '0';
          toast.style.transition = 'opacity 0.3s';
          toast.innerHTML = `
            <div>Collez le lien reçu par mail :</div>
            <input id="campusInput" type="text" placeholder="https://app.digiforma.com" style="width:100%;margin-top:5px;padding:5px;border-radius:4px;border:none" />
            <button id="saveCampusBtn" style="margin-top:5px;padding:5px 10px;border:none;border-radius:4px;background:#fff;color:#0062ff;cursor:pointer">Enregistrer</button>
          `;
          document.body.appendChild(toast);
          requestAnimationFrame(() => { toast.style.opacity = '1'; });

          document.getElementById('saveCampusBtn').addEventListener('click', () => {
            const input = document.getElementById('campusInput');
            if (input.value.trim()) {
              savedLink = input.value.trim();
              chrome.storage.sync.set({ campusLink: savedLink }, () => {
                toast.remove();
                renderCampusCard();
              });
            }
          });
        }
      });
    };

    renderCampusCard();
  });
}

// Affichage de l'interface de configuration
function renderSetupView() {
  const html = `
    <div class="setup-container">
      <div class="setup-icon"><i class="fa-solid fa-envelope"></i></div>
      <div class="setup-title">Configuration</div>
      <div class="setup-description">
        Entrez votre email @laplateforme.io
      </div>
      <div class="mb-3">
        <input type="email" class="form-control" id="emailInput" placeholder="prenom-nom@laplateforme.io" autocomplete="off">
      </div>
      <button class="btn btn-primary w-100" id="saveBtn">
        <i class="fa-solid fa-check me-2"></i>Valider
      </button>
    </div>
    <div class="footer">Format attendu : prenom-nom@laplateforme.io</div>
  `;

  const app = document.getElementById('app');
  app.innerHTML = html;
  fadeIn(app);

  const input = document.getElementById('emailInput');
  const saveBtn = document.getElementById('saveBtn');
  setTimeout(() => input.focus(), 100);

  // Validation et sauvegarde de l'email
  const validateAndSave = async () => {
    const email = input.value.trim().toLowerCase();
    if (!email.match(/^[\w-]+@laplateforme\.io$/)) {
      input.classList.add('is-invalid');
      if (!document.getElementById('emailError')) {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'emailError';
        errorDiv.className = 'invalid-feedback d-block text-start mt-2';
        errorDiv.style.color = '#ff4757';
        errorDiv.innerHTML = '<i class="fa-solid fa-triangle-exclamation me-2"></i>Format invalide.';
        input.parentNode.appendChild(errorDiv);
      }
      return;
    }

    // Désactivation du bouton et indication de chargement
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sauvegarde...';

    await saveUserEmail(email);
    setTimeout(() => init(), 500);
  };

  saveBtn.addEventListener('click', validateAndSave);
  input.addEventListener('keypress', (e) => { if (e.key === 'Enter') validateAndSave(); });
}

// Initialisation
async function init() {
  console.log('🚀 Initialisation du Hub...');
  const userInfo = await getUserInfo();
  if (userInfo.userEmail) {
    const username = extractUsername(userInfo.userEmail);
    if (username) {
      renderConnectedView(userInfo.userEmail, username);
    } else {
      renderSetupView();
    }
  } else {
    renderSetupView();
  }
}

// Démarrage au chargement du DOM
document.addEventListener('DOMContentLoaded', init);