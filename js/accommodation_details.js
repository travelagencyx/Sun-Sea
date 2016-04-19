var aboutText = document.getElementById("aboutTextId");
var moreButton = document.querySelector(".more");
var expander = document.querySelector(".expandable");

moreButton.addEventListener("click", function(){
	aboutText.style.height = "300px";
	moreButton.style.display = "none";
	expander.style.display = "none";
});
