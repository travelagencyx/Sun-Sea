var sendButton = document.querySelector(".sendButton");
var bookBlock = document.getElementById('contactForm');
var thankBlock = document.querySelector('.thankForm');

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
	var message = document.querySelector("#message").value;
	if (name === ""){
		document.querySelector("#name").style.border = "2px solid #FF0000";
		exit = true;
	}
	else{
		document.querySelector("#name").style.border = "2px inset";
		exit = false;
	} 
	if (message === ""){
		document.querySelector("#message").style.border = "2px solid #FF0000";
		exit = true;
	}
	else{
		document.querySelector("#message").style.border = "2px inset";
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
    	subject: 'Message from webpage ' + email,
    	text: message
	};
	
	var xhr = getAjax();
	xhr.open('POST', "/sendEmail");
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(obj));

    bookBlock.style.display = 'none';
    thankBlock.style.display = 'inline-block';

});