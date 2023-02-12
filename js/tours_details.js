var sendButton = document.querySelector(".sendButton");
var bookBlock = document.getElementById('contactForm');
var thankBlock = document.querySelector('.thankForm');

var inquiryButton = document.querySelector('.inquiryButton');
var inquiryForm = document.querySelector('.inquiryForm');
var toursInfoText = document.querySelector('.toursInfoText');

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

sendButton.addEventListener("click", function(){
	var exit = false;
	var email = document.getElementById("fromEmail").value;
	var name = document.querySelector("#name").value;
	var adults = document.querySelector("#adults").value;
	var children = document.querySelector("#children").value;
	var message = document.querySelector("#message").value;
	var date = document.querySelector("#arrival").value;
	var tour = document.querySelector(".toursInfoHeader").innerHTML;
	if (name === ""){
		document.querySelector("#name").style.border = "2px solid #FF0000";
		exit = true;
	}
	else{
		document.querySelector("#name").style.border = "2px inset";
		exit = false;
	}
	if ((adults === "") || (children === "")){
		if ((adults === "") && (children === "")){
			document.querySelector("#adults").style.border = "2px solid #FF0000";
			exit = true;
		} else if (adults === ""){
			document.querySelector("#adults").style.border = "2px solid #FF0000";
			exit = true;
		} else {
			document.querySelector("#children").style.border = "2px solid #FF0000";
			exit = true;
		}
	}
	else{
		document.querySelector("#adults").style.border = "2px inset";
		document.querySelector("#children").style.border = "2px inset";
		exit = false;
	} 
	if (date === ""){
		document.querySelector("#arrival").style.border = "2px solid #FF0000";
		exit = true;
	}
	else{
		document.querySelector("#arrival").style.border = "2px inset";
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

	var obj = {
		from: email,
    	to: 'travelagencyx@gmail.com',
    	subject: 'Message from ' + name + ' for' + tour,
    	text: 'Message: ' + message + '. I would love to go to ' + tour + ' at ' + date + '. Adults: ' + adults + '. Children ' + children + '.'
	};
	
	var xhr = getAjax();
	xhr.open('POST', "/api/SendEmail");
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(obj));

    bookBlock.style.display = "none";
	toursInfoText.style.display = "block";
	inquiryForm.style.display = "block";
	inquiryButton.innerHTML = "Thank you."
	inquiryButton.disabled = true;
});

inquiryButton.addEventListener("click", function(){
	if (bookBlock.style.display === "none"){
		bookBlock.style.display = "block";
		toursInfoText.style.display = "none";
		inquiryForm.style.display = "none";
	}
});