
/** DATA ENTRY */

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

        pertenece(sueldoNominal){  // verifica en que franja de IRPF 'cae' el sueldo Nominal
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


var form = document.querySelector('#form');

form.addEventListener('submit', (event) => {
    event.preventDefault(); // evita que se recargue la página al enviar el formulario
    
    var sueldoNominal = parseFloat(document.querySelector('#sueldonominal').value);
    var tieneHijos = document.querySelector('input[name="hijos-cargo"]:checked').value === 'si';
    var tieneConyugue = document.querySelector('input[name="pareja-cargo"]:checked').value === 'si';
    var hijosConDiscapacidad = parseInt(document.querySelector('#hijos-discapacidad').value);
    var hijosSinDiscapacidad = parseInt(document.querySelector('#hijos-sin-discapacidad').value);
    var aportaFondoSolidaridad = document.querySelector('input[name="aporta-solidaridad"]:checked').value === 'si';
    var aportaCajaNotarial = document.querySelector('input[name="aporte-caja-notarial"]:checked').value === 'si';
    
    var user = new User(sueldoNominal, tieneHijos, tieneConyugue, hijosConDiscapacidad, hijosSinDiscapacidad, aportaFondoSolidaridad, aportaCajaNotarial);
    var sueldoLiquido = calculoSueldoLiquido(user.sueldoNominal, user.hijos, user.conyugue, user.hijoscondiscapacidad, user.hijossindiscapacidad, user.fondosolidaridad, user.cajanotarial);
    
    let final = document.getElementById("inicio");
    final.remove();

    let divSueldoLiquido = document.createElement("div");
    divSueldoLiquido.innerHTML = `<h2 id=SueldoLiquido> Tu sueldo líquido es de $ ${sueldoLiquido} </h2>`;
    document.body.appendChild(divSueldoLiquido);
    
    let divbotonVolver = document.createElement("div");
    divbotonVolver.innerHTML = `<button id="botonVolver">VOLVER</button>`;
    document.body.appendChild(divbotonVolver);

    let botonVolver = document.getElementById("botonVolver")
    botonVolver.onclick = () =>{location.reload()}
});

const guardarLocal = (clave, valor) => { localStorage.setItem(clave, valor) };
guardarLocal("datosUser", JSON.stringify(User));
const almacenados = JSON.parse(localStorage.getItem("User"));
