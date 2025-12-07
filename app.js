// Traductions
const translations = {
    fr: {
        title: "Plateforme de Logements",
        formTitle: "Ajouter un Logement",
        listeTitle: "Liste des Logements",
        labelTitre: "Titre :",
        labelAdresse: "Adresse :",
        labelPrix: "Prix / mois :",
        labelDescription: "Description :",
        btnAjouter: "Ajouter",
    },
    en: {
        title: "Housing Platform",
        formTitle: "Add a Rental",
        listeTitle: "Housing List",
        labelTitre: "Title:",
        labelAdresse: "Address:",
        labelPrix: "Price / month:",
        labelDescription: "Description:",
        btnAjouter: "Add",
    },
    ar: {
        title: "منصة السكن",
        formTitle: "إضافة سكن",
        listeTitle: "قائمة السكن",
        labelTitre: "العنوان:",
        labelAdresse: "العنوان الكامل:",
        labelPrix: "السعر / شهرياً:",
        labelDescription: "الوصف:",
        btnAjouter: "إضافة",
    }
};

document.getElementById("languageSelect").addEventListener("change", changeLanguage);
document.getElementById("userTypeSelect").addEventListener("change", updateUserType);
document.getElementById("logementForm").addEventListener("submit", addLogement);

// 🟦 Fonction: changer langage
function changeLanguage() {
    const lang = document.getElementById("languageSelect").value;
    const t = translations[lang];

    document.body.classList.toggle("rtl", lang === "ar");

    document.getElementById("title").innerText = t.title;
    document.getElementById("formTitle").innerText = t.formTitle;
    document.getElementById("listeTitle").innerText = t.listeTitle;
    document.getElementById("labelTitre").innerText = t.labelTitre;
    document.getElementById("labelAdresse").innerText = t.labelAdresse;
    document.getElementById("labelPrix").innerText = t.labelPrix;
    document.getElementById("labelDescription").innerText = t.labelDescription;
    document.getElementById("btnAjouter").innerText = t.btnAjouter;
}

// 🟧 Afficher owner ou student
function updateUserType() {
    const type = document.getElementById("userTypeSelect").value;

    if (type === "owner") {
        document.getElementById("formSection").classList.remove("hidden");
    } else {
        document.getElementById("formSection").classList.add("hidden");
    }
}

// 🟩 Ajouter logement
function addLogement(e) {
    e.preventDefault();

    const container = document.getElementById("logementsContainer");

    const titre = document.getElementById("titre").value;
    const adresse = document.getElementById("adresse").value;
    const prix = document.getElementById("prix").value;
    const description = document.getElementById("description").value;

    const div = document.createElement("div");
    div.className = "logement";
    div.innerHTML = `<h3>${titre}</h3>
                     <p>${adresse}</p>
                     <p><strong>${prix}</strong></p>
                     <p>${description}</p>`;

    container.appendChild(div);

    document.getElementById("logementForm").reset();
}
