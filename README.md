# LaPlateforme.io - Hub Étudiant

![Logo](https://intra.pro.laplateforme.io/assets/img/logo.png)

**LaPlateforme.io - Hub Étudiant** est une extension Chrome qui centralise tous les outils essentiels pour les étudiants de LaPlateforme.io, offrant un accès rapide et intuitif à vos espaces personnels, outils de développement et plateformes de design.

---

## 📌 Fonctionnalités

- **Gestion des emails étudiants** : sauvegarde et utilisation de votre email `@laplateforme.io`
- **Vérification des sessions** : détecte si vous êtes connecté sur Plesk ou Figma
- **Accès rapide aux outils** :
  - **LaPlateforme** : Intra
  - **Intérim** : Armado
  - **Local** : Localhost, PhpMyAdmin
  - **Développement** : GitHub, site GitHub, Panel Plesk, site Plesk
  - **Design & Outils** : Figma
- **Interface interactive** : notifications toast, cartes dynamiques et interface responsive

---

## 🛠 Installation

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/pascal-fortunati/laplateforme-hub.git
   ```

2. Ouvrez Chrome et allez dans `chrome://extensions/`

3. Activez le **mode développeur**

4. Cliquez sur **Charger l'extension non empaquetée** et sélectionnez le dossier du projet

5. L'extension apparaîtra dans la barre d'outils

---

## 🚀 Utilisation

1. Cliquez sur l'icône de l'extension dans Chrome
2. Saisissez votre email `@laplateforme.io` pour configurer votre compte
3. Accédez rapidement aux différents outils directement depuis le hub
4. Les outils Plesk et Figma afficheront si vous êtes déjà connecté ou non

---

## 🧩 Structure du projet

```
laplateforme-hub/
│
├─ icons/                  # Icônes de l'extension
├─ popup.html              # Interface principale
├─ popup.js                # Logique de l'extension
├─ style.css               # Styles personnalisés
├─ manifest.json           # Manifest Chrome
└─ README.md               # Documentation
```

---

## ⚡ Technologies utilisées

- **JavaScript (ES6)** pour la logique interactive
- **HTML5 & CSS3** pour l'interface
- **Bootstrap 5** pour la mise en page
- **Font Awesome** pour les icônes
- **Chrome Storage API** pour la gestion des emails et liens
- **Manifest V3** pour l'extension Chrome

---

## 📄 Licence

Ce projet est open-source.

---

## ✨ Auteur

**Pascal Fortunati**

- GitHub : [@pascal-fortunati](https://github.com/pascal-fortunati)

---

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à proposer une pull request.

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request
