// DOM selections
const wellness = document.querySelector(".wellness");
const construction = document.querySelector(".construction");
const stability = document.querySelector(".stability");
const preview = document.querySelector(".mood__preview__images");
const save_btn = document.querySelector(".mood__form__button");
const preview_imgs = document.querySelectorAll(".mood__preview__images .mood__image");
const btnAdd = document.querySelector(".install_prompt");
const pushBtn = document.querySelector(".push_prompt");
const nav_links = document.querySelectorAll(".nav__link");
const tabs = document.querySelectorAll(".tabs");
const history = document.querySelector(".tab__history__contents");
const overlay= document.querySelector(".tab__today__overlay")
const close_overlay= document.querySelector(".close_overlay")

var s_list = [];
var c_list = [];
var w_list = [];
var last_week_labels = [];


wellness.addEventListener("input", (e) => {
  let new_value = Math.abs(e.target.value ) * -5 ;
  console.log(new_value);
  preview.style.transform = `translateX(${new_value}em)`;
});

construction.addEventListener("input", (e) => {
  preview.style.filter = `grayscale(${1 - ((e.target.value - 1) * 1) / 10})`;
});


stability.addEventListener("input", (e) => {
  console.log("stability")
  preview_imgs.forEach((el) => el.classList.remove("mood__image"));
  void preview.offsetWidth; // trigger a DOM reflow
  preview_imgs.forEach((el) => el.classList.add("mood__image"));
  let new_value = 10 - e.target.value;
  console.log(new_value)
  preview_imgs.forEach(
    (el) => (el.style.animationIterationCount = `${new_value}`)
  );
});


save_btn.addEventListener("click", (e) => {
  e.preventDefault()
  overlay.style.display = "block";
  save_mood();

});

close_overlay.addEventListener("click", ()=>{
  overlay.style.display = "none";
})
nav_links.forEach((nav_link) => {
  nav_link.addEventListener("click", (e) => {
    let current_name = e.currentTarget.getAttribute("data-tab");
    e.preventDefault();
    nav_links.forEach((el) => el.classList.remove("nav__link--active"));
    document
      .querySelector(`.nav__link__${current_name}`)
      .classList.add("nav__link--active");

    tabs.forEach((tab) => (tab.style.display = "none"));
    document.querySelector(`.tab__${current_name}`).style.display = "flex";
    showChart(s_list, c_list, w_list, last_week_labels);
  });
});

// Pseudo

// Affichage du surnom sur la page d'accueil
const pseudo_form = document.querySelector(".tab__info__pseudo_form");
const pseudo_input = document.querySelector(".tab__info__pseudo_input");
const pseudo_text = document.querySelector(".tab__info__pseudo_text");
pseudo_form.addEventListener("submit", (e) => enregistrerSurnom(e));
pseudo_form.addEventListener("focusout", (e) => enregistrerSurnom(e));
afficher_surnom();

function enregistrerSurnom(event) {
  event.preventDefault();
  // Extraire la valeur de l'input
  let pseudo = document.querySelector(".tab__info__pseudo_input").value;
  pseudo = pseudo == "" ? "" : pseudo;

  localStorage["pseudo"] = pseudo;
  // Verification de l'existence d'un surnom et affichage
  afficher_surnom();
}

// Affiche un surnom s'il en existe un localement
function afficher_surnom() {
  let pseudo = localStorage["pseudo"];
  if (!pseudo_text || !pseudo_form) return null;
  pseudo = pseudo == "" ? "" : pseudo;
  pseudo = pseudo == undefined ? "" : pseudo;
  // console.log(pseudo);
  pseudo_text.innerHTML = pseudo;
  document.querySelector(".greetings__title__pseudo").innerHTML = pseudo;
  pseudo_form.style.display = "none";
  pseudo_text.style.display = "inline-block";
  pseudo_text.addEventListener("click", function () {
    pseudo_text.style.display = "none";
    pseudo_input.value = pseudo
    pseudo_form.style.display = "inline-block";
  });
}

const date_el = document.querySelector(".header_date");
let today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = Intl.DateTimeFormat("en-US", { month: "long" }).format(today); //January is 0!
var yyyy = today.getFullYear();

today = `${mm} ${dd}, ${yyyy}`;
date_el.innerHTML = today;
// -------------------------------------

const temporary = () => {
  const date_ms = Date.now();
  var current_date = new Date(date_ms);
  let current_month = current_date.getMonth();
  let current_year = current_date.getFullYear();
  let current_day = current_date.getDay();
  var options = { weekday: "long" };
  let current_weekday = Intl.DateTimeFormat("en-US", options).format(
    current_date
  );
  let current_monthtxt = Intl.DateTimeFormat("en-US", { month: "long" }).format(
    current_date
  );

  let localdata = {
    pseudo: "johnny",
    moods: {
      2020: [{ 1: [{ 29: [5, 6, 7] }] }, { 1: [{ 30: [5, 7, 7] }] }],
    },
    2021: [{ 1: [{ 29: [5, 6, 7] }] }],
  };
};

const save_mood = () => {
  s_list = [];
  c_list = [];
  w_list = [];
  last_week_labels = [];
  // recupere les 3 valeurs de l'échelle
  let current_stability = stability.value;
  let current_construction = construction.value;
  let current_wellness = wellness.value;
  let current_mood = {
    s: current_stability,
    c: current_construction,
    b: current_wellness,
  };
  // recupere les 3 valeurs de la date
  let today = new Date();
  let current_month = today.getMonth();
  let current_year = today.getFullYear();
  let current_day = today.getDay();
  let current_date = today.getDate();

  let stored_moods = getFromStorage("moods");
  let year_entry = stored_moods[current_year] ? stored_moods[current_year] : {};
  let month_entry = year_entry[current_month] ? year_entry[current_month] : {};
  let date_entry = current_mood;
  month_entry[current_date] = date_entry;
  year_entry[current_month] = month_entry;
  stored_moods[current_year] = year_entry;

  saveInStorage("moods", stored_moods);
  makeHistory();
};

const getFromStorage = (key) => {
  // Recuperer les cartes du local Storage labelé key s'il existe, sinon renvoyé un objet vide
  let valeurText = localStorage[key] ? localStorage[key] : "{}";
  // Conversion de la chaine de caractères en objet Javascript
  let valeur = JSON.parse(valeurText);
  return valeur;
};

// Mets à jour la valeur de la clé specifiée avec une nouvelleValeur
const saveInStorage = (clé, nouvelleValeur) => {
  // Convertir l'objet en chaine de caractères pour pouvoir le stocker
  nouvelleValeur = JSON.stringify(nouvelleValeur);
  // Enregister cette chaines de caractères localement
  localStorage[clé] = nouvelleValeur;
};

const makeHistory = () => {
  let stored_moods = getFromStorage("moods");
  let today = new Date();
  let current_year = today.getFullYear();
  let current_month = parseInt(today.getMonth());
  let current_date = today.getDate();

  let current_monthtxt = Intl.DateTimeFormat("en-US", { month: "long" }).format(
    today
  );

  // console.log(stored_moods[current_year][current_month])
  var history_tab = document.querySelector(".tab__history__contents");
  var weekCanvas = makeElement("div", "chartContainer", "");
  let cvs = makeElement("canvas", "weekChart", "");
  weekCanvas.appendChild(cvs);
  let history_wrapper = makeElement("div", "month_history", "");

  if (
    !stored_moods[current_year] ||
    !stored_moods[current_year][current_month]
  ) {
    history_tab.innerHTML = "<h4>No entry yet for this month. Save your mood today to see more details here</h4>";
    return null;
  }
  let month_title = makeElement(
    "h3",
    "month_title",
    `${current_monthtxt}  &#8227;&#10085;`
  );
  let days_slider = makeElement("div", "days_cards_slider", "");
  history_wrapper.appendChild(month_title);
  history_wrapper.appendChild(days_slider);
  s_list = [];
  c_list = [];
  w_list = [];
  last_week_labels = [];
  for (date in stored_moods[current_year][current_month]) {

    let stability = parseInt(
      stored_moods[current_year][current_month][date]["s"]
    );
    let construction = parseInt(
      stored_moods[current_year][current_month][date]["c"]
    );
    let wellness = parseInt(
      stored_moods[current_year][current_month][date]["b"]
    );

    s_list.push(stability);
    c_list.push(construction);
    w_list.push(wellness);
    last_week_labels.push(`${date} ${current_monthtxt}`);
    let temp_date = new Date(current_year, current_month, date);
	
	let temp_weekday = Intl.DateTimeFormat("en-US", {weekday: "short"}).format(temp_date);
	


    let day_card = makeElement("div", "day_card", "");
    if (current_date == date) day_card.classList.add("current_day");
    let day_title = makeElement("div", "day_title", temp_weekday);
    let date_number = makeElement("div", "date_number", date);
    let day_face = makeElement("div", "day_face", "");
    let day_image = makeElement("img", "day_img", "");
    day_image.setAttribute("src", `./images/dog${wellness}.png`);
    day_image.style.filter = `grayscale(${1 - ((construction - 1) * 1) / 10})`;
    day_image.style.animationIterationCount = `${stability}`;
    day_face.appendChild(day_image);
    day_card.appendChild(day_title);
    day_card.appendChild(date_number);
    day_card.appendChild(day_face);
    days_slider.insertBefore(day_card, days_slider.firstChild);
    
  }

  history_tab.innerHTML = "";
  history_tab.appendChild(history_wrapper);
  history_tab.appendChild(weekCanvas);


};

const makeElement = (balise, classe, texte) => {
  let element = document.createElement(balise);
  element.classList.add(classe);
  element.innerHTML = texte;
  return element;
};

const showChart = (s_list, c_list, w_list, weekLabels) => {
  if (s_list.length == 0) {
    return null;
  }
  var ctx = document.querySelector(".weekChart").getContext("2d");
  // console.log(ctx);
  let total = []
  for (i=0; i<s_list.length; i++){
    total[i] = s_list[i] + c_list[i] + w_list[i]
  }
  var myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: weekLabels,
      datasets: [
        {
          label: "Relaxed",
          stack: "Relaxed",
          data: s_list,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      
        {
          label: "Energy",
          stack: "Energy",
          data: c_list,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
        {
          label: "Wellbeing",
          stack: "Wellbeing",
          data: w_list,
          backgroundColor: "rgba(255, 206, 86, 0.2)",
          borderColor: "rgba(255, 206, 86, 1)",
          borderWidth: 1,
        },
        {
          label: "Mood Score",
          type: "bar",
          stack: "total",
          data: total,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        }
      ],
    },
    options: {
      maintainAspectRatio: false,

      title: {
        display:true,
        text:"Your mood this month"
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
            stacked: true,
          },
        ],
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
            stacked: true,
          },
        ],
      },
    },
  });
};
makeHistory();


