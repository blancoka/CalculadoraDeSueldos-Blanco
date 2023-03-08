
/** DATA ENTRY */
function solicitarSueldoNominal() {
    return prompt (`Ingrese su sueldo nominal`)
} 

class User{
    constructor (sueldoNominal, hijos, conyugue, hijoscondiscapacidad, hijossindiscapacidad, fondosolidaridad, cajanotarial){
    this.sueldoNominal = sueldoNominal; 
    this.hijos = hijos; 
    this.conyugue = conyugue;
    this.hijoscondiscapacidad = hijoscondiscapacidad;
    this.hijossindiscapacidad = hijossindiscapacidad;
    this.fondosolidaridad = fondosolidaridad;
    this.cajanotarial = cajanotarial;
    }
}

var sueldoNominal = document.getElementById("sueldoNominal")
var hijosAcargo = document.getElementById("hijosAcargo")
var conyugueAcargo = document.getElementById("parejaAcargo")
var hijosCondiscapacidad = document.getElementById("hijosdiscapacitados")
var hijosSindiscapacidad = document.getElementById("hijosnodiscapacitados")
var fondodesolid = document.getElementById("fondodesolid")
var cajaNotarial = document.getElementById("cajaNotarial")

var Usuario = new User(sueldoNominal, hijosAcargo, conyugueAcargo, hijosCondiscapacidad, hijosSindiscapacidad, fondodesolid, cajaNotarial)

/** CALCULATIONS */

function calculoSueldoLiquido(sueldoNominal){
    /** Valor BPC 2022. */
    const bpc = 5164;
    const aporte_jubilatorio = 15;
    const aporte_fonasa_hasta25bpc = 3;
    const aporte_fonasa_desde25bpc = 4.5;
    const aporte_frl = 0.1;
    const tasa_deducciones_hasta15bpc = 10;
    const tasa_deducciones_desde15bpc = 8;

    var descuento_fonasa = 0;
    var descuento_jubilatorio = (sueldoNominal * aporte_jubilatorio) / 100
    var descuento_frl = (sueldoNominal * aporte_frl) / 100

    class Franja {
        constructor(min, max, aporteirpf){
            this.min = min;
            this.max = max;
            this.aporteirpf = aporteirpf;
        }

        pertenece(sueldoNominal){
            if ((sueldoNominal > this.min) && (sueldoNominal < this.max) )
            return true
            else return false
        }
    }
    
    class IRPF{
        constructor(franjas){
            this.franjas = franjas
        }
    
        calculodescuentoIRPF(sueldoNominal) {
            var franja = franjas.find(f => f.pertenece(sueldoNominal)); //me devuelve la franja que cumple que franja.min < sueldoNominal < franja.max
            var descuento = (franja.aporteirpf * sueldoNominal) / 100; //calculo la plata que se le va a descontar de irpf segun el sueldo nominal que ingreso
            return descuento;
        }
        }


    var franja1 = new Franja(0, (7 * bpc) - 1, 0)
    var franja2 = new Franja(7 * bpc, (10 * bpc) - 1, 10)
    var franja3 = new Franja(10 * bpc, (15 * bpc) - 1, 15)
    var franja4 = new Franja(15 * bpc, (30 * bpc) - 1, 24)
    var franja5 = new Franja(30 * bpc, (50 * bpc) - 1, 25)
    var franja6 = new Franja(50 * bpc, (75* bpc) - 1, 27)
    var franja7 = new Franja(75 * bpc, (115 * bpc) - 1, 31)
    var franja8 = new Franja(115 * bpc, Number.MAX_VALUE, 36)

    const franjas = [franja1, franja2, franja3, franja4, franja5, franja6, franja7, franja8] 
    var irpf = new IRPF (franjas)
    var descuentoirpf = irpf.calculodescuentoIRPF(sueldoNominal)

    if (sueldoNominal > 25 * bpc) descuento_fonasa = (sueldoNominal * aporte_fonasa_desde25bpc) / 100
    else descuento_fonasa = (sueldoNominal * aporte_fonasa_hasta25bpc) / 100
    if (sueldoNominal > 15 * bpc) descuentoirpf = (descuentoirpf * tasa_deducciones_desde15bpc) / 100
    else descuentoirpf = (descuentoirpf * tasa_deducciones_hasta15bpc) / 100
    return (Math.round (sueldoNominal - descuentoirpf - descuento_jubilatorio - descuento_frl - descuento_fonasa))
}

function mostrarSueldoLiquido(sueldoLiquido) {
    alert ("Su sueldo liquido es de $" + sueldoLiquido)
}


/** MAIN */
var sueldoNominal = solicitarSueldoNominal()
var sueldoLiquido = calculoSueldoLiquido(sueldoNominal)
mostrarSueldoLiquido(sueldoLiquido)