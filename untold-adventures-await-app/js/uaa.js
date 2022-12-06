function Untold() {
this.userPreferredLanguage = "es";
this.availableLanguages = new Map();
this.langTemplates = {};
this.langTemplates.es = {
"app_title":"UNTOLD: La aventura te espera",
"switchLangLink": "Cambiar idioma"
};
this.langTemplates.en = {
"app_title":"UNTOLD: Adventures Await",
"switchLangLink": "Change language"
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

this.allowDrop = function(ev) {
  ev.preventDefault();
}

this.drag = function(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

this.drop = function(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}

this.setListeners = function() {
	var elLangEsLink = document.querySelector("#langEsLink");
	elLangEsLink.onclick = function() {untold.switchLanguage("es");};
	var elLangEnLink = document.querySelector("#langEnLink");
	elLangEnLink.onclick = function() {untold.switchLanguage("en");};
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