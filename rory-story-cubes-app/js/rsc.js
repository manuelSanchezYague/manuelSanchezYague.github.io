function RSCApp () {
	this.bespokeDice = [];
}

RSCApp.prototype.hideAllByClass = function(clazz) {
	var allDiceSets = document.querySelectorAll(clazz);
	var keyArray = Object.keys(allDiceSets);
	keyArray.forEach(function(key){
        allDiceSets[key].classList.add('is-hidden');
    });
}

RSCApp.prototype.showById = function(id) {
	var diceSet = document.getElementById(id);
	diceSet.classList.remove('is-hidden');
}

RSCApp.prototype.showDiceSet = function(diceSetId) {
	this.hideAllByClass('.c-dice-set');
	this.hideAllByClass('.dice-faces');
	this.showById(diceSetId);
	var menuCheckbox = document.getElementById("menu-btn");
	menuCheckbox.checked = false;
}

RSCApp.prototype.selectDieFace = function(a) {
	var clazz = a.dataset.clazz;
	if (!this.bespokeDice.includes(clazz)) {
		if (this.bespokeDice.length < 54) {
			a.classList.toggle("bespoke-die-face-selected");
			this.bespokeDice.push(clazz);
		}
	} else {
		a.classList.toggle("bespoke-die-face-selected");
		index = this.bespokeDice.indexOf(clazz);
		this.bespokeDice.splice(index, 1);
	}
}

RSCApp.prototype.deselectAllDieFaces = function() {
	for(var i = 0; i < this.bespokeDice.length; i++){
		var links = document.getElementsByClassName(this.bespokeDice[i]);
		links[0].classList.toggle("bespoke-die-face-selected");
	}
	this.bespokeDice = [];
}

RSCApp.prototype.showAllDieFaces = function() {
	this.hideAllByClass(".c-dice-set");
	this.showById("diceFaces");
	var self = this;
	var menuCheckbox = document.getElementById("menu-btn");
	menuCheckbox.checked = false;
	
	var diceFacesDiv = document.getElementById("diceFaces");
	if(diceFacesDiv.innerHTML == ""){
		var deselectorContainer = document.createElement("div");
		var deselectAllDieFacesButton = document.createElement("input");
		deselectAllDieFacesButton.type = "button";
		deselectAllDieFacesButton.value = "Deseleccionar todo";
		deselectAllDieFacesButton.classList.add("c-button");
		deselectAllDieFacesButton.classList.add("c-button--white");
		deselectAllDieFacesButton.addEventListener("click", function() {self.deselectAllDieFaces();});
		deselectorContainer.appendChild(deselectAllDieFacesButton);
		diceFacesDiv.appendChild(deselectorContainer);
		
		for(var i = 1; i <= 162; i++){
			if(i<=81 || (i>=109 && i<=126)){
				for(var j = 1; j <= 6; j++){
					var a = document.createElement("a");
					a.classList.add("thrownDie");
					a.classList.add("thrownDie" + i + "_" + j);
					a.dataset.clazz="thrownDie" + i + "_" + j;
					a.addEventListener("click", function() {self.selectDieFace(this);});
					diceFacesDiv.appendChild(a);
				}
			}
		}
		
		deselectorContainer = document.createElement("div");
		deselectAllDieFacesButton = document.createElement("input");
		deselectAllDieFacesButton.type = "button";
		deselectAllDieFacesButton.value = "Deseleccionar todo";
		deselectAllDieFacesButton.classList.add("c-button");
		deselectAllDieFacesButton.classList.add("c-button--white");
		deselectAllDieFacesButton.addEventListener("click", function() {self.deselectAllDieFaces();});
		deselectorContainer.appendChild(deselectAllDieFacesButton);
		diceFacesDiv.appendChild(deselectorContainer);
	}
}

RSCApp.prototype.initMenuEvents = function() {
	var self = this;
	var allCloseButtons = document.querySelectorAll("input[class*='js-closeButton']");
	for(var i = 0; i < allCloseButtons.length; i++) {
		allCloseButtons[i].addEventListener("click", function(event){event.preventDefault();self.hideAllByClass('.c-dice-set')}, false);  
	}
	var menuOriginal = document.getElementById("menu_original");
	menuOriginal.addEventListener("click", function(event){event.preventDefault();self.showDiceSet('original')}, false);
	var menuActions = document.getElementById("menu_actions");
	menuActions.addEventListener("click", function(event){event.preventDefault();self.showDiceSet('actions')}, false);
	var menuVoyages = document.getElementById("menu_voyages");
	menuVoyages.addEventListener("click", function(event){event.preventDefault();self.showDiceSet('voyages')}, false);
	var menuFantasia = document.getElementById("menu_fantasia");
	menuFantasia.addEventListener("click", function(event){event.preventDefault();self.showDiceSet('fantasia')}, false);
	var menuMystery = document.getElementById("menu_mystery");
	menuMystery.addEventListener("click", function(event){event.preventDefault();self.showDiceSet('mystery')}, false);
	var menuPrimal = document.getElementById("menu_primal");
	menuPrimal.addEventListener("click", function(event){event.preventDefault();self.showDiceSet('primal')}, false);
	var menuEmergency = document.getElementById("menu_emergency");
	menuEmergency.addEventListener("click", function(event){event.preventDefault();self.showDiceSet('emergency')}, false);
	var menuHeroes = document.getElementById("menu_heroes");
	menuHeroes.addEventListener("click", function(event){event.preventDefault();self.showDiceSet('heroes')}, false);
	var menuAstro = document.getElementById("menu_astro");
	menuAstro.addEventListener("click", function(event){event.preventDefault();self.showDiceSet('astro')}, false);




	var menuScoobyDoo = document.getElementById("menu_scooby-doo");
	menuScoobyDoo.addEventListener("click", function(event){event.preventDefault();self.showDiceSet('scooby-doo')}, false);
	var menuDoctorWho = document.getElementById("menu_doctor-who");
	menuDoctorWho.addEventListener("click", function(event){event.preventDefault();self.showDiceSet('doctor-who')}, false);
	var menuBespoke = document.getElementById("menu_bespoke");
	menuBespoke.addEventListener("click", function(event){event.preventDefault();self.showAllDieFaces()}, false);
}

RSCApp.prototype.checkAllDiceFromSet = function(id, check) {
	var allDiceSets = document.querySelectorAll("input[id^='" + id + "']");
	var keyArray = Object.keys(allDiceSets);
	keyArray.forEach(function(key){
        if(allDiceSets[key].id != id + '_all_dice') {
			allDiceSets[key].checked = check;
		}
    });
}

RSCApp.prototype.initCheckboxAllDiceEventsForId = function(allDiceId) {
	var self = this;
	var checkboxAllDice = document.getElementById(allDiceId + "_all_dice");
	checkboxAllDice.addEventListener("click", function(event){
		self.checkAllDiceFromSet(allDiceId, checkboxAllDice.checked);
	}, false);
}

RSCApp.prototype.initCheckboxAllDiceEvents = function() {
	this.initCheckboxAllDiceEventsForId("original");
	this.initCheckboxAllDiceEventsForId("actions");
	this.initCheckboxAllDiceEventsForId("voyages");
	this.initCheckboxAllDiceEventsForId("fantasia");
	this.initCheckboxAllDiceEventsForId("mystery");
	this.initCheckboxAllDiceEventsForId("primal");
	this.initCheckboxAllDiceEventsForId("emergency");
	this.initCheckboxAllDiceEventsForId("heroes");
	this.initCheckboxAllDiceEventsForId("astro");
	this.initCheckboxAllDiceEventsForId("scooby-doo");
	this.initCheckboxAllDiceEventsForId("doctor-who");
}

RSCApp.prototype.getDiceToShow = function(originalSelectedDice) {
	var diceToShow;
	diceToShow = [];
	var copy = originalSelectedDice.slice();
	for(var i=0;i<9;i++){
		var randomIndex = Math.floor(Math.random() * copy.length);
		var selected = copy.splice(randomIndex, 1);
		diceToShow.push(selected[0]);
	}
	return diceToShow;
}

RSCApp.prototype.rethrowDie = function(id, dieNumber) {
	var elm = document.getElementById(id);
	var currentClass = elm.getAttribute('class');
	var dieFace = Math.ceil(Math.random() * 6);
	var newClass = "thrownDie thrownDie" + dieNumber + "_" + dieFace;
	while(newClass == currentClass){
		dieFace = Math.ceil(Math.random() * 6);
		newClass = "thrownDie thrownDie" + dieNumber + "_" + dieFace;
	}
	elm.setAttribute('class', newClass);
}

RSCApp.prototype.showDice = function(dice) {
	var elem = document.getElementById("diceLayout");
	var html = "";
	var i;
	var dieFace;
	for (i=0;i<dice.length;i++){
		dieFace = Math.ceil(Math.random() * 6);
		html += "<div id=\"thrownDie" + (i+1) + "\" class=\"thrownDie thrownDie" + dice[i] + "_" + dieFace + "\" onclick=\"rscApp.rethrowDie('thrownDie" + (i+1) + "', " + dice[i] + ")\"></div>";
	}
	elem.innerHTML = html;
}

RSCApp.prototype.rethrowBespokeDie = function(id, dieNumber) {
	var elm = document.getElementById(id);
	var currentClass = elm.getAttribute('class');
	var dieFace = Math.ceil(Math.random() * 6);
	var newClass = "thrownDie " + this.bespokeDice[6*dieNumber+dieFace-1];
	while(newClass == currentClass){
		dieFace = Math.ceil(Math.random() * 6);
		newClass = "thrownDie " + this.bespokeDice[6*dieNumber+dieFace-1];
	}
	elm.setAttribute('class', newClass);
}

RSCApp.prototype.showBespokeDice = function() {
	var elem = document.getElementById("diceLayout");
	var html = "";
	var diceNumber = Math.floor(this.bespokeDice.length / 6);
	for (i=0;i<diceNumber;i++){
		var dieFace = Math.ceil(Math.random() * 6);
		var clazz = this.bespokeDice[6*i+dieFace-1];
		html += "<div id=\"thrownDie" + (i+1) + "\" class=\"thrownDie " + clazz + "\" onclick=\"rscApp.rethrowBespokeDie('thrownDie" + (i+1) + "', " + i + ")\"></div>";
	}
	elem.innerHTML = html;
}

RSCApp.prototype.throwDice = function() {
	this.clear();
	this.hideAllByClass('.c-dice-set');
	this.hideAllByClass('.dice-faces');
	var allCheckedDice = document.querySelectorAll("input[class='c-dice-set__checkbox']:checked");
	var keyArray = Object.keys(allCheckedDice);
	if(keyArray.length > 0){
		var dice = [];
		keyArray.forEach(function(key){
			var value = allCheckedDice[key].value;
			dice.push(value)
		});
		dice = this.getDiceToShow(dice);
		this.showDice(dice);
	} else if (this.bespokeDice.length >= 6) {
		this.showBespokeDice();
	} else {
		this.showErrorMessage("Debes seleccionar al menos 1 dado o 6 caras a medida");
	}
}

RSCApp.prototype.initThrowDiceEventButton = function() {
	var self = this;
	var throwDice = document.getElementById("throwDice");
	throwDice.addEventListener("click", function(event){ self.throwDice(); }, false);
}

RSCApp.prototype.initClearSelectedDiceButtonEvent = function() {
	var self = this;
	var deselectAllDieFacesButton = document.getElementById("clear");
	deselectAllDieFacesButton.addEventListener("click", function(event){
		self.checkAllDiceFromSet("original", false);
		self.checkAllDiceFromSet("actions", false);
		self.checkAllDiceFromSet("voyages", false);
		self.checkAllDiceFromSet("fantasia", false);
		self.checkAllDiceFromSet("mystery", false);
		self.checkAllDiceFromSet("primal", false);
		self.checkAllDiceFromSet("emergency", false);
		self.checkAllDiceFromSet("heroes", false);
		self.checkAllDiceFromSet("astro", false);
		self.checkAllDiceFromSet("looney-tunes", false);
		self.checkAllDiceFromSet("moomin", false);
		self.checkAllDiceFromSet("adventure-time", false);
		self.checkAllDiceFromSet("scooby-doo", false);
		self.checkAllDiceFromSet("doctor-who", false);
		self.checkAllDiceFromSet("batman", false);
		self.checkAllDiceFromSet("star-wars", false);
		self.hideAllByClass('.c-dice-set');
		self.hideAllByClass('.dice-faces');
		
		var checkAllDiceCheckboxes = document.querySelectorAll("input[id$=_all_dice]");
		for(var i = 0; i < checkAllDiceCheckboxes.length; i++) {
			checkAllDiceCheckboxes[i].checked = false;   
		}
		self.clear();
	}, false);
}
	
RSCApp.prototype.throwNineRandomDice = function(onlyBasic) {
	var deselectAllDieFacesButton = document.getElementById("clear");
	deselectAllDieFacesButton.click();
	var i = 0;
	var availableSets = onlyBasic ? 9 : 18;
	while(i < 9) {
		var diceSet = Math.ceil(Math.random() * availableSets);
		var dieId;
		switch(diceSet) {
			case 1:
				dieId = "original_";
				break;
			case 2:
				dieId = "actions_";
				break;
			case 3:
				dieId = "voyages_";
				break;
			case 4:
				dieId = "fantasia_";
				break;
			case 5:
				dieId = "mystery_";
				break;
			case 6:
				dieId = "primal_";
				break;
			case 7:
				dieId = "emergency_";
				break;
			case 8:
				dieId = "heroes_";
				break;
			case 9:
				dieId = "astro_";
				break;
				/*
			case 10:
				dieId = "looney-tunes_";
				break;
			case 11:
				dieId = "moomin_";
				break;
			case 12:
				dieId = "adventure-time_";
				break;
*/
			case 13:
				dieId = "scooby-doo_";
				break;
			case 14:
				dieId = "doctor-who_";
				break;
/*
			case 15:
				dieId = "batman_";
				break;
			case 16:
				dieId = "doraemon_";
				break;
			case 17:
				dieId = "star-wars_";
				break;
			case 18:
				dieId = "totoro_";
				break;
				*/
			default:
				dieId = "original_";
		}
		var die = Math.ceil(Math.random() * 9);
		var dieCheckbox = document.getElementById(dieId + die);
		if(dieCheckbox.checked == false) {
			dieCheckbox.checked = true;
			i++;
		}
	}
	var throwDice = document.getElementById("throwDice");
	throwDice.click();
}

RSCApp.prototype.initThrowNineRandomDiceButtonEvent = function() {
	var self = this;
	var throwNineRandomDiceButton = document.getElementById("throwNineRandomDice");
	throwNineRandomDiceButton.addEventListener("click", function(event){
		self.throwNineRandomDice(false);
	}, false);
}

RSCApp.prototype.initThrowNineBasicRandomDiceButtonEvent = function() {
	var self = this;
	var throwNineRandomDiceButton = document.getElementById("throwNineBasicRandomDice");
	throwNineRandomDiceButton.addEventListener("click", function(event){
		self.throwNineRandomDice(true);
	}, false);
}

RSCApp.prototype.initEvents = function() {
	this.initMenuEvents();
	this.initCheckboxAllDiceEvents();
	this.initThrowDiceEventButton();
	this.initClearSelectedDiceButtonEvent();
	this.initThrowNineBasicRandomDiceButtonEvent();
	this.initThrowNineRandomDiceButtonEvent();
}

RSCApp.prototype.clear = function() {
	var elem = document.getElementById("diceLayout");
	elem.innerHTML = "";
}

RSCApp.prototype.showErrorMessage = function(text) {
	var elem = document.getElementById("diceLayout");
	elem.innerHTML = "<p class=\"error-message\">" + text + "</p>";
}

RSCApp.prototype.reset = function() {
	var checkboxes = document.getElementsByTagName('input');
	for (var i=0; i<checkboxes.length; i++)  {
		if (checkboxes[i].type == 'checkbox')   {
			checkboxes[i].checked = false;
		}
	}
	this.clear();
}

RSCApp.prototype.main = function() {
	this.reset();
	this.initEvents();
}

var rscApp = new RSCApp();
rscApp.main();
