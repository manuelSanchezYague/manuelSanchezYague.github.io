function Untold() {
this.userPreferredLanguage = "es";
this.availableLanguages = new Map();
this.langTemplates = {};
this.langTemplates.es = {
"app_title":"UNTOLD: La aventura te espera",
"switchLangLink": "Cambiar idioma",
"scene1__title": "UN DILEMA PELIGROSO",
"scene2__title": "LA TRAMA SE COMPLICA",
"scene3__title": "UN COMBATE HEROICO",
"scene4__title": "LA VERDAD REVELADA",
"scene5__title": "EL DUELO FINAL",
};
this.langTemplates.en = {
"app_title":"UNTOLD: Adventures Await",
"switchLangLink": "Change language",
"scene1__title": "A DANGEROUS DILEMMA",
"scene2__title": "THE PLOT THICKENS",
"scene3__title": "AN HEROIC UNDERTAKING",
"scene4__title": "THE TRUTH REVEALED",
"scene5__title": "THE FINAL SHOWDOWN",
};
this.switchLanguage = function(lang){
	if(lang != null){
		this.userPreferredLanguage = lang;
		localStorage.setItem("userPreferredLanguage", lang);
		this.processLangDocument();
	}
};
this.processLangDocument = function(){
    var tags = document.querySelectorAll('span,img,a,label,li,option,h1,h2,h3,h4,h5,h6');
    Array.from(tags).forEach(function(value, index){
        var key = value.dataset.langkey;
		var currentLang = untold.availableLanguages.get(untold.userPreferredLanguage);
        if(currentLang[key]) value.innerText = currentLang[key];
    });
};

this.dragItem = null;

this.dragStart = function() {
	dragItem = this;
};

this.dragEnd = function() {
  	dragItem = null;
};

this.dragOver = function(e) {
	e.preventDefault();
};

this.dragDrop = function() {
    this.append(dragItem);
};

this.setDragAndDropListeners = function() {
	const thrownDice = document.querySelectorAll('.thrownDie');
	thrownDice.forEach(thrownDie => {
		thrownDie.addEventListener('dragstart', untold.dragStart);
		thrownDie.addEventListener('dragend', untold.dragEnd);
	});
	const scenes = document.querySelectorAll('.scene');
	scenes.forEach(scene => {
		scene.addEventListener('dragover', untold.dragOver);
		scene.addEventListener('drop', untold.dragDrop);
	});
	const diceTrays = document.querySelectorAll('.dice-tray');
	diceTrays.forEach(diceTray => {
		diceTray.addEventListener('dragover', untold.dragOver);
		diceTray.addEventListener('drop', untold.dragDrop);
	});
};

this.setLanguageChangeListeners = function(){
	var elLangEsLink = document.querySelector("#langEsLink");
	elLangEsLink.onclick = function() {untold.switchLanguage("es");};
	var elLangEnLink = document.querySelector("#langEnLink");
	elLangEnLink.onclick = function() {untold.switchLanguage("en");};
};

this.setListeners = function() {
	this.setLanguageChangeListeners();
	this.setDragAndDropListeners();
};

this.main = function(){
	this.availableLanguages.set("es", this.langTemplates.es);
	this.availableLanguages.set("en", this.langTemplates.en);
	if (typeof(Storage) !== "undefined") {
		var auxLang = localStorage.getItem("userPreferredLanguage");
		this.userPreferredLanguage = auxLang != null ? auxLang : "es";
	} else {
		alert("Local storage is not allowed");
		this.userPreferredLanguage = "es";
	}
	this.setListeners();
};
}