var aboutText = document.getElementById("aboutTextId");
var moreButton = document.querySelector(".more");
var expander = document.querySelector(".expandable");

var arrival = document.querySelector("#arrival");
var departure = document.querySelector("#departure");
var price = document.querySelector(".price");
var countnights = document.querySelector(".countnights");
var calcprice = document.querySelector(".calcprice");
var servicefee = document.querySelector(".servicefee");
var finalprice = document.querySelector(".finalprice");
var searchButton = document.querySelector(".searchButton");
var bookBlock = document.getElementById('apartmentBook');
var thankBlock = document.querySelector('.thankBook');

moreButton.addEventListener("click", function(){
	aboutText.style.height = "300px";
	moreButton.style.display = "none";
	expander.style.display = "none";
});

//searchbox

arrival.addEventListener("change", function(){
	if(departure.value != ""){
		var beginDate = new Date(document.querySelectorAll(".date-picker")[0].value);
		var endDate = new Date(document.querySelectorAll(".date-picker")[1].value);
		var timeDiff = Math.abs(endDate.getTime() - beginDate.getTime());
		var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
		countnights.innerHTML = diffDays;
		calcprice.innerHTML = parseInt(price.innerHTML) * diffDays;
		servicefee.innerHTML = Math.round(parseInt(price.innerHTML) * diffDays * 0.1);
		finalprice.innerHTML = parseInt(servicefee.innerHTML) + parseInt(calcprice.innerHTML);
	}
});

departure.addEventListener("change", function(){
	if(arrival.value != ""){
		var beginDate = new Date(document.querySelectorAll(".date-picker")[0].value);
		var endDate = new Date(document.querySelectorAll(".date-picker")[1].value);
		var timeDiff = Math.abs(endDate.getTime() - beginDate.getTime());
		var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
		countnights.innerHTML = diffDays;
		calcprice.innerHTML = parseInt(price.innerHTML) * diffDays;
		servicefee.innerHTML = Math.round(parseInt(price.innerHTML) * diffDays * 0.1);
		finalprice.innerHTML = parseInt(servicefee.innerHTML) + parseInt(calcprice.innerHTML);
	}
});

function getAjax() {
    try {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            try {
                return new ActiveXObject('Msxml2.XMLHTTP');
            } catch (try_again) {
                return new ActiveXObject('Microsoft.XMLHTTP');
            }
        }
    } catch (fail) {
        return null;
    }
}

searchButton.addEventListener("click", function(){
	var exit = false;
	var email = document.getElementById("fromEmail").value;
	var arrival = document.querySelector("#arrival").value;
	var departure = document.querySelector("#departure").value;
	if (arrival === ""){
		document.querySelector("#arrival").style.border = "2px solid #FF0000";
		exit = true;
	}
	else{
		document.querySelector("#arrival").style.border = "2px inset";
		exit = false;
	} 
	if (departure === ""){
		document.querySelector("#departure").style.border = "2px solid #FF0000";
		exit = true;
	}
	else{
		document.querySelector("#departure").style.border = "2px inset";
		exit = false;
	}  
	if (!/^[0-9a-zA-Z]+([0-9a-zA-Z]*[-._+])*[0-9a-zA-Z]+@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)*([0-9a-zA-Z]*[.])[a-zA-Z]{2,6}$/.test(email)){
		document.getElementById("fromEmail").style.border = "2px solid #FF0000";
		exit = true;
	}
	else{
		document.getElementById("fromEmail").style.border = "2px inset";
		exit = false;
	} 
	if(exit == true){
		return;
	} 
	var guests = document.querySelector(".guestsDropdown").options[document.querySelector(".guestsDropdown").selectedIndex].value;
	var offer = document.querySelector(".finalprice").innerHTML;
	var obj = {
		from: email,
    	to: 'travelagencyx@gmail.com',
    	subject: 'Booking request from ' + email,
    	text: 'Check in: ' + arrival + '. Check out: ' + departure + '. Number of guests: ' + guests + '. Total offer: ' + offer + '€.'
	};
	
	var xhr = getAjax();
	xhr.open('POST', "/sendEmail");
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(obj));

    bookBlock.style.display = 'none';
    thankBlock.style.display = 'inline-block';

});