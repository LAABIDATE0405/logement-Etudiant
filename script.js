// Sections
const studentSection = document.getElementById("studentSection");
const ownerSection = document.getElementById("ownerSection");

// Forms
const studentForm = document.getElementById("studentForm");
const ownerForm = document.getElementById("ownerForm");
const studentList = document.getElementById("studentList");
const ownerList = document.getElementById("ownerList");

// Role & Language
const roleSelect = document.getElementById("role");
const langSelect = document.getElementById("lang");

function updateView(){
  if(roleSelect.value==="student"){
    studentSection.style.display="block";
    ownerSection.style.display="none";
  } else {
    studentSection.style.display="none";
    ownerSection.style.display="block";
  }
}
roleSelect.addEventListener("change", updateView);
updateView();

// Dummy Data
let logements=[];

// Owner form submit
ownerForm.addEventListener("submit", e=>{
  e.preventDefault();
  const adresse = ownerForm.adresse.value;
  const prix = ownerForm.prix.value;
  const chambres = ownerForm.chambres.value;
  logements.push({adresse, prix, chambres});
  renderOwnerList();
  ownerForm.reset();
});

function renderOwnerList(){
  ownerList.innerHTML="";
  logements.forEach(l=>{
    const li=document.createElement("li");
    li.textContent=`${l.adresse} — ${l.chambres} chambre(s) — ${l.prix} DH`;
    ownerList.appendChild(li);
  });
}

// Student form submit (search simulation)
studentForm.addEventListener("submit", e=>{
  e.preventDefault();
  renderStudentList();
});

function renderStudentList(){
  studentList.innerHTML="";
  logements.forEach(l=>{
    const li=document.createElement("li");
    li.textContent=`${l.adresse} — ${l.chambres} chambre(s) — ${l.prix} DH`;
    studentList.appendChild(li);
  });
}

// Language change
langSelect.addEventListener("change", ()=>{
  const lang = langSelect.value;
  const translations = {
    fr:{
      student:"Étudiant",
      owner:"Propriétaire",
      studentTitle:"Logements disponibles",
      ownerTitle:"Ajouter un logement",
      search:"Chercher",
      publish:"Publier"
    },
    en:{
      student:"Student",
      owner:"Owner",
      studentTitle:"Available housing",
      ownerTitle:"Add a housing",
      search:"Search",
      publish:"Publish"
    },
    ar:{
      student:"طالب",
      owner:"مالك",
      studentTitle:"المساكن المتوفرة",
      ownerTitle:"إضافة مسكن",
      search:"بحث",
      publish:"نشر"
    }
  };

  const t = translations[lang];

  studentSection.querySelector("h2").textContent = t.studentTitle;
  studentForm.querySelector("button").textContent = t.search;
  ownerSection.querySelector("h2").textContent = t.ownerTitle;
  ownerForm.querySelector("button").textContent = t.publish;
  document.querySelector("label[for='role']").textContent = t.student + " / " + t.owner;
});
