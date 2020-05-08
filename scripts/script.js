const wellness = document.querySelector(".wellness");
const construction = document.querySelector(".construction");
const stability = document.querySelector(".stability");
const preview = document.querySelector("#mood_images");
const save_btn = document.querySelector(".mood_form__btn");
const preview_imgs = document.querySelectorAll("#mood_images img");
const btnAdd = document.querySelector(".installPrompt");
const pushBtn = document.querySelector(".pushPrompt");
const nav_links = document.querySelectorAll(".nav__link");
const tabs = document.querySelectorAll(".tabs");
const history = document.querySelector(".history_contents");
const overlay= document.querySelector(".update_overlay")
const close_overlay= document.querySelector(".close_overlay")

var s_list = [];
var c_list = [];
var w_list = [];
var last_week_labels = [];


wellness.addEventListener("input", (e) => {
  let new_value = (e.target.value - 1) * -129;
  preview.style.transform = `translateX(${new_value}px)`;
});

construction.addEventListener("input", (e) => {
  preview.style.filter = `grayscale(${1 - ((e.target.value - 1) * 1) / 10})`;
});

fetch("https://type.fit/api/quotes")
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    
    let index = Math.floor(Math.random() * Math.floor(data.length))
    
    document.querySelector(".overlay_quote").innerHTML = data[index].text
    let author = data[index].author == null ? "Someone famous" : data[index].author
    document.querySelector(".overlay_author").innerHTML = `&#8211;${author}`
  });

stability.addEventListener("input", (e) => {
  preview_imgs.forEach((el) => el.classList.remove("mood_image"));
  void preview.offsetWidth; // trigger a DOM reflow
  preview_imgs.forEach((el) => el.classList.add("mood_image"));
  let new_value = 10 - e.target.value;
  preview_imgs.forEach(
    (el) => (el.style.animationIterationCount = `${new_value}`)
  );
});


save_btn.addEventListener("click", () => {
  overlay.style.display = "block";
  console.log(overlay)
  save_mood();

});

close_overlay.addEventListener("click", ()=>{
  overlay.style.display = "none";
})
nav_links.forEach((nav_link) => {
  nav_link.addEventListener("click", (e) => {
    let current_name = e.target.getAttribute("data-tab");
    // let link_name = e.target.getAttribute("data-tab");

    e.preventDefault();
    nav_links.forEach((el) => el.classList.remove("nav__link--active"));
    document
      .querySelector(`.nav__link__${current_name}`)
      .classList.add("nav__link--active");

    tabs.forEach((tab) => (tab.style.display = "none"));
    document.querySelector(`.tab__${current_name}`).style.display = "flex";
    // console.log(current_name);
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
// enregistrerSurnom(e)
afficher_surnom();

function enregistrerSurnom(event) {
  event.preventDefault();
  // Extraire la valeur de l'input
  let pseudo = document.querySelector(".tab__info__pseudo_input").value;
  pseudo = pseudo == "" ? "Person" : pseudo;

  localStorage["pseudo"] = pseudo;
  // Verification de l'existence d'un surnom et affichage
  afficher_surnom();
}

// Affiche un surnom s'il en existe un localement
function afficher_surnom() {
  let pseudo = localStorage["pseudo"];
  if (!pseudo_text || !pseudo_form) return null;
  pseudo = pseudo == "" ? "Person" : pseudo;
  pseudo = pseudo == undefined ? "Person" : pseudo;
  // console.log(pseudo);
  pseudo_text.innerHTML = pseudo;
  document.querySelector(".greetings__pseudo").innerHTML = pseudo;
  pseudo_form.style.display = "none";
  pseudo_text.style.display = "inline-block";
  pseudo_text.addEventListener("click", function () {
    pseudo_text.style.display = "none";
    pseudo_form.style.display = "inline-block";
  });
}

const date_el = document.querySelector(".header_date");
let today = new Date();
// console.log(today);
var dd = String(today.getDate()).padStart(2, "0");
var mm = Intl.DateTimeFormat("en-US", { month: "long" }).format(today); //January is 0!
var yyyy = today.getFullYear();

today = `${dd}, ${mm} ${yyyy}`;
date_el.innerHTML = today;
// -------------------------------------

const temporary = () => {
  const date_ms = Date.now();
  var current_date = new Date(date_ms);
  // console.log(typeof today);
  // console.log(today);
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
  // const date_ms = Date.now();
  let today = new Date();
  // console.log(typeof today);
  // console.log(today);
  let current_month = today.getMonth();
  let current_year = today.getFullYear();
  let current_day = today.getDay();
  let current_date = today.getDate();

  let stored_moods = getFromStorage("moods");
  // console.log(stored_moods)
  let year_entry = stored_moods[current_year] ? stored_moods[current_year] : {};
  let month_entry = year_entry[current_month] ? year_entry[current_month] : {};
  let date_entry = current_mood;
  // let date_obj = {}
  // date_obj[]
  month_entry[current_date] = date_entry;
  year_entry[current_month] = month_entry;
  stored_moods[current_year] = year_entry;

  saveInStorage("moods", stored_moods);
//   alert("265");
  makeHistory();
//   alert("post hist");
};

const getFromStorage = (key) => {
  // Recuperer les cartes du local Storage labelé key s'il existe, sinon renvoyé un objet vide
  let valeurText = localStorage[key] ? localStorage[key] : "{}";
  // console.log("object")
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
  // console.log(stored_moods);
//   alert("290")
  let today = new Date();
  let current_year = today.getFullYear();
  let current_month = parseInt(today.getMonth());
  let current_date = today.getDate();

  let current_monthtxt = Intl.DateTimeFormat("en-US", { month: "long" }).format(
    today
  );

  // console.log(stored_moods[current_year][current_month])
  var history_tab = document.querySelector(".history_contents");
  var weekCanvas = makeElement("div", "chartContainer", "");
  let cvs = makeElement("canvas", "weekChart", "");
  weekCanvas.appendChild(cvs);
//   alert("307")
  let history_wrapper = makeElement("div", "month_history", "");

  if (
    !stored_moods[current_year] ||
    !stored_moods[current_year][current_month]
  ) {
    history_tab.innerHTML = "<h4>No entry yet for this month</h4>";
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
//   alert("329")
  for (date in stored_moods[current_year][current_month]) {
//   alert("331")

    // console.log(date);
    let stability = parseInt(
      stored_moods[current_year][current_month][date]["s"]
    );
    let construction = parseInt(
      stored_moods[current_year][current_month][date]["c"]
    );
    let wellness = parseInt(
      stored_moods[current_year][current_month][date]["b"]
    );
	// alert("343")

    s_list.push(stability);
    c_list.push(construction);
    w_list.push(wellness);
    // last_week_data.push(stability+construction+wellness)
    last_week_labels.push(`${date} ${current_monthtxt}`);
	// alert("350")
    // let temp_date = new Date(`${current_year}-${current_month + 1}-${date}`);
    let temp_date = new Date(current_year, current_month, date);
	// console.log(temp_date);
	// alert("354")
	
    // console.log(Intl.DateTimeFormat("en-US", {weekday: "long"}).format(temp_date));
	// temp_date = new Date()
	let temp_weekday = Intl.DateTimeFormat("en-US", {weekday: "short"}).format(temp_date);
	

	// alert("360")

    let day_card = makeElement("div", "day_card", "");
    if (current_date == date) day_card.classList.add("current_day");
    // console.log(typeof date)
    // day_card.classList.add()
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
    // days_slider.appendChild(day_card)
    days_slider.insertBefore(day_card, days_slider.firstChild);
	// alert("380")
    
  }
//   alert("383")

  // console.log(last_week_labels);
  history_tab.innerHTML = "";
  history_tab.appendChild(history_wrapper);
  // console.log(weekCanvas);
  history_tab.appendChild(weekCanvas);

  // <canvas id="myChart"></canvas>
  // console.log(history_wrapper);
//   console.log("393")
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
  console.log(ctx);
  let total = []
  for (i=0; i<s_list.length; i++){
    total[i] = s_list[i] + c_list[i] + w_list[i]
  }
  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: weekLabels,
      datasets: [
        {
          label: "Stability",
          stack: "stability",
          data: s_list,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      
        {
          label: "Construction",
          stack: "Construction",
          data: c_list,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
        {
          label: "Wellness",
          stack: "Wellness",

          data: w_list,
          backgroundColor: "rgba(255, 206, 86, 0.2)",
          borderColor: "rgba(255, 206, 86, 1)",
          borderWidth: 1,
        },
        {
          label: "Total",
          type: "line",
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
      title: {
        display:true,
        text:"Mood Chart"
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


// 
// Open the modal
netlifyIdentity.open();

// Get the current user:
const user = netlifyIdentity.currentUser();

// Bind to events
netlifyIdentity.on('init', user => console.log('init', user));
netlifyIdentity.on('login', user => {
  console.log('login', user.user_metadata.full_name)

});
netlifyIdentity.on('logout', () => {
  console.log('Logged out')
});
// netlifyIdentity.on('error', err => console.error('Error', err));
// netlifyIdentity.on('open', () => console.log('Widget opened'));
// netlifyIdentity.on('close', () => console.log('Widget closed'));

// Close the modal
netlifyIdentity.close();

// Log out the user
netlifyIdentity.logout();

// ------------------
// var key = 'AAAAYxu6hNk:APA91bE-BkcEJblXMSH6saXf5GrXRO2Af6Z-oKKLHwLWIDh7WyrDdMlJOGrgKL6iUrmwPf9t4Pu4lyhgoQIhGmM4wiz-X7RD0sVBFkmqDCQpKhrKcxQffePyhhOJxUDk8yLfTWFVCYAq';
// var to = 'eqBDCQyaquy93TbxXzblPk:APA91bFZK3wAjH_H_OMgPvbLMItDkKpEPf-j1GWrMBAPUEhOJWu683A33GMoTRHvx-XdmwCjRgc2TPL28YgZiD9cDgB8pnKlgnrgPQVVKGATzHRn2zegfIDWM2_m7Yl1xJ0i-UYJm558';
// var notification = {
//   'title': 'Portugal vs. Denmark',
//   'body': '5 to 1'
// };

// fetch('https://fcm.googleapis.com/fcm/send', {
//   'method': 'POST',
//   'headers': {
//     'Authorization': 'key=' + key,
//     'Content-Type': 'application/json'
//   },
//   'body': JSON.stringify({
//     'notification': notification,
//     'to': to
//   })
// }).then(function(response) {
//   console.log(response);
// }).catch(function(error) {
//   console.error(error);
// })