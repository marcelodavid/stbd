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
var innovaciones = document.querySelector('#innovaciones');
var logo = document.querySelector('#fp-logo img');
var video1 = document.getElementById('video1');
var videogrid = document.getElementById('grid');
var intro = document.getElementById('introduccion');
var esquema = document.getElementById('esquema');
var eventLoop = document.getElementById('eventLoop');
var dbs = document.getElementById('dbs');
var dataCenter = document.getElementById('dataCenter');
var diseño = document.querySelector('#Diseno img');
var diagrama = document.querySelectorAll('.diagramaFlujo');
var psoc = document.getElementById('psoc');
var mesh = document.getElementById('mesh');
var gabeta = document.getElementById('gabeta');
var image_presupuesto = document.getElementById('image_presupuesto');
var lector = document.getElementById('lector');
var lector_video = document.getElementById('lector_video');
var video3 = document.getElementById('video3');
var marcamovil = document.getElementById('marcamovil');
function javascriptsAnimation(){
    var animationHandler = function(e){
        var bandera = e.target.id;
        var clase = e.target.className.match(/break/);
        if(clase){
            document.querySelector('.break.present').parentNode.classList.add('hidden');
            gabeta.classList.add('hidden');
        }
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
            case 'dbs':
                eventLoop.classList.add('hidden');
                break;
            case 'dataCenter':
                dbs.classList.add('hidden');
                break;
            case 'finesquema':
                dataCenter.classList.add('hidden');
                esquema.classList.add('opacidad');
                break;
            case 'algoritmo':
                for(var i=0; i<diagrama.length; i++){
                    diagrama[i].classList.add('visible');
                }
                break;
            case 'lector':
                lector_video.classList.remove('hidden');
                video3.play();
                break;
            case 'psoc':
                lector.classList.add('hidden');
                lector_video.classList.add('hidden');
                break;
            case 'mesh':
                for(var i=0; i<diagrama.length; i++){
                    diagrama[i].classList.add('fadeOut');
                }
                psoc.classList.add('fadeOut');
                diseño.classList.add('pos1');
                break;
            case 'meshOut':
                diseño.classList.remove('pos1');
                diseño.classList.add('pos2');
                mesh.classList.add('hidden');
                break;
            case 'arquitecturaView1':
                diseño.classList.remove('pos2');
                diseño.classList.add('pos3');
                break;
            case 'presupuesto2':
                image_presupuesto.classList.add('rot1');
                break;
            case 'presupuesto3':
                image_presupuesto.classList.remove('rot1');
                image_presupuesto.classList.add('rot2');
                break;
            case 'conclusion1':
                marcamovil.classList.add('pos1');
                break;
            case 'conclusion2':
                marcamovil.classList.remove('pos1');
                marcamovil.classList.add('pos2');
                break;
            case 'conclusion3':
                marcamovil.classList.remove('pos2');
                marcamovil.classList.add('pos3');
                break;
            case 'conclusion4':
                marcamovil.classList.remove('pos3');
                marcamovil.classList.add('pos4');
                break;
            case 'conclusion5':
                marcamovil.classList.remove('pos4');
                marcamovil.classList.add('pos5');
                break;
            case 'webapp':
                document.getElementById("APP").play();
            default:
                if(bandera=='portada'){
                    logo.classList.add('visible');
                }
        }
    }
    document.addEventListener("impress:stepenter", animationHandler, false);
    document.addEventListener("impress:substep:enter", animationHandler, false);
}

// habilitamos la presentacion automatica
automatedPresentationWithSubsteps();
// habilitamos las animaciones con javascripts
javascriptsAnimation();
