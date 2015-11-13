var api = impress();
api.init();

var writeEfect = function(event){
	var target = event.target;
	var writeEfectclass = target.querySelector(".writeEfect");
	if(writeEfectclass){
		var text = writeEfectclass.dataset.text;
		var length = text.length;
		var idx = 0;
		var write = setInterval(function(){
			writeEfectclass.innerHTML = (idx>0 ? text.substr(0, idx):'') + '<span>' + text[idx] + '</span>';
			idx++;
			if(idx == length){
				clearInterval(write);
			}
		}, 40);
	};
};

document.addEventListener("impress:stepenter", function(event){
	writeEfect(event);
}, false);

document.addEventListener("impress:substep:enter", function(event){
	writeEfect(event);
	console.log("substep adentro");
}, false);
