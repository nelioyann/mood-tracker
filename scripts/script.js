// alert("yo")

const wellness = document.querySelector(".wellness");
const construction = document.querySelector(".construction");
const stability = document.querySelector(".stability");
const preview = document.querySelector("#mood_images");
const save_btn = document.querySelector(".mood_form__btn");
const preview_imgs = document.querySelectorAll("#mood_images img");
const btnAdd = document.querySelector(".installPrompt");
const pushBtn = document.querySelector(".pushPrompt");
const nav_links = document.querySelectorAll(".nav__link")
const tabs = document.querySelectorAll(".tabs")
// console.log(preview_imgs)


wellness.addEventListener("input", (e)=>{
    let new_value = (e.target.value - 1) * -115;
    // console.log(new_value)
    preview.style.transform = `translateY(${new_value}px)`
})

construction.addEventListener("input", e=>{
    // console.log((e.target.value -1)*1/10 + 1/10)
    preview.style.filter = `grayscale(${1 - (e.target.value - 1)*1/10 })`
})

stability.addEventListener("input", e=>{
    // element.classList.remove("animate");
    // console.log(preview_imgs)
    preview_imgs.forEach( el => el.classList.remove("mood_image"))
    void preview.offsetWidth; // trigger a DOM reflow
    preview_imgs.forEach(el => el.classList.add("mood_image"))
    // element.classList.add("animate");
    let new_value = 10 - (e.target.value);
    // console.log(new_value);
    // console.log((e.target.value -1)*1/10 + 1/10)
    preview_imgs.forEach(el => el.style.animationIterationCount = `${new_value}`)
})

//  Installation de la PWA
let deferredPrompt;

window.addEventListener("beforeinstallprompt", e => {
	console.log("before install prompt");
	e.preventDefault();
	deferredPrompt = e;
	btnAdd.style.visibility = "visible";
});

window.addEventListener("appinstalled", evt => {
    app.logEvent("a2hs", "installed");
    btnAdd.style.visibility = "hidden";
    console.log("it is installed")
});

btnAdd.addEventListener("click", () => {
	deferredPrompt.prompt();
	deferredPrompt.userChoice.then(choiceResult => {
		if (choiceResult.outcome === "accepted") {
            // alert()
			console.log("User accepted the A2HS prompt");
		}
		deferredPrompt = null;
	});
});

// Push notifications

pushBtn.addEventListener("click", ()=>{
	Notification.requestPermission(function(status) {
	console.log("Notification permission status:", status);
});
})

if (Notification.permission == "granted") pushBtn.style.visibility = "hidden";

function displayNotification  (title, body) {
	if (Notification.permission == "granted") {
        
		navigator.serviceWorker.getRegistration().then(function(reg) {
			var options = {
				body: body,
				icon: "/images/icons/icon-72x72.png",
				vibrate: [100, 50, 100],
				data: {
					dateOfArrival: Date.now(),
					primaryKey: 1
				}
			};
			reg.showNotification(title, options);
		}).catch(err => console.log(err));
	}
}

save_btn.addEventListener("click",()=> displayNotification("Hey you ...", "You better have a nice f*cking day ! "))

nav_links.forEach(nav_link =>{
    nav_link.addEventListener("click", e=>{
        let current_name = e.target.getAttribute("data-tab"); 
        // let link_name = e.target.getAttribute("data-tab"); 
        e.preventDefault();
        nav_links.forEach( el => el.classList.remove("nav__link--active"));
        document.querySelector(`.nav__link__${current_name}`).classList.add("nav__link--active");

        tabs.forEach(tab => tab.style.display = "none")
        document.querySelector(`.tab__${current_name}`).style.display = "flex";
        console.log(current_name)
    })
})