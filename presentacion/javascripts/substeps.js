var substepsAll = document.querySelectorAll(".substep");
for (var i = 0; i < substepsAll.length; i++) {
    substepsAll[i].classList.add("future");
}

function substepNext() {
    var activeStep = document.querySelector(".step.active");
    var future = activeStep.querySelectorAll(".future");
    var present = activeStep.querySelectorAll(".present");
    var past = activeStep.querySelectorAll(".past")

    if (future.length === 0) {
        impress().next(); 
        if(present[0]){
            present[0].classList.add("past");
            present[0].classList.remove("present");
        }
    } else {
        future[0].classList.add("present");
        future[0].classList.remove("future");
        if (present.length > 0) {
            present[0].classList.add("past");
            present[0].classList.remove("present");
        }
        var event = document.createEvent("CustomEvent");
        // se dispara el evento
        event.initCustomEvent("impress:substep:enter", true, true, undefined);
        //  el evento esta asociado al primer elemento con las clases "substep future"  
        future[0].dispatchEvent(event);
    }
}

function substepPrev() {
    impress().prev();
}

document.addEventListener("keyup", function (event) {
    if (event.keyCode === 9 || (event.keyCode >= 32 && event.keyCode <= 34) || (event.keyCode >= 37 && event.keyCode <= 40)) {
        switch (event.keyCode) {
        case 33: // pg up
        case 37: // left
        case 38: // up
            substepPrev();
            break;
        case 9: // tab
        case 32: // space
        case 34: // pg down
        case 39: // right
        case 40: // down
            substepNext();
            break;
        }

        event.preventDefault();
    }
}, false);

// presentacion automatica
function automatedPresentationWithSubsteps() {
    var delayedNext = function (e) {
        var duration = e.target.dataset.duration;

        if (duration) {
            var timing = setTimeout(function() {
                substepNext();
            }, duration);
        }
    }
    document.addEventListener("impress:stepenter", delayedNext, false);
    document.addEventListener("impress:substep:enter", delayedNext, false);
}

var fixedBackground = document.querySelector('.cd-fixed-bg');
var logo = document.querySelector('#fp-logo img');
var innovaciones = document.querySelector('#innovaciones');
var video1 = document.getElementById('video1');
var videogrid = document.getElementById('grid');
var intro = document.getElementById('introduccion');
function javascriptsAnimation(){
    var animationHandler = function(e){
        var bandera = e.target.id;
        switch (bandera){
            case 'logoband':
                logo.classList.add('encabezado');
                break;
            case 'introband':
                // fixedBackground.classList.add('bg-introduccion');
                logo.classList.add('opaco');
                break;
            case 'introduccion':
                // document.getElementById('introduccion').classList.add('bg-introduccion');
                // fixedBackground.classList.remove('bg-introduccion');
                break;
            case 'situacionActual':
                //fixedBackground.classList.remove('bg-introduccion');
                break;
            case 'administracion':
                video1.currentTime = 0;
                video1.play();
                break;
            case 'bigband':
                intro.classList.remove('opacidad');
                break;
            case 'connectworld':
                intro.classList.add('opacidad');
                innovaciones.classList.add('opacidad');
                break;
            case 'videogrid':
                videogrid.currentTime = 0;
                videogrid.play();
                break;
            default:
                null;
        }
    }
    document.addEventListener("impress:stepenter", animationHandler, false);
    document.addEventListener("impress:substep:enter", animationHandler, false);
}

// habilitamos la presentacion automatica
automatedPresentationWithSubsteps();
// habilitamos las animaciones con javascripts
javascriptsAnimation();
