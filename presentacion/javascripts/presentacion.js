var api = impress();
api.init();

var writeEffect = function(event){
	var target = event.target;
	var writeEffectclass = target.querySelector(".writeEffect");
	if(writeEffectclass){
		var text = writeEffectclass.dataset.text;
		var length = text.length;
		var idx = 0;
		var write = setInterval(function(){
			writeEffectclass.innerHTML = (idx>0 ? text.substr(0, idx):'') + '<span>' + text[idx] + '</span>';
			idx++;
			if(idx == length){
				clearInterval(write);
			}
		}, 40);
	};
};

document.addEventListener("impress:substep:enter", function(event){
	writeEffect(event);
}, false);

