
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

    calcularSueldoLiquidoAPI() {
        const url = 'https://jsonplaceholder.typicode.com/posts';
        const options = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            sueldoNominal: this.sueldoNominal,
            hijos: this.hijos,
            conyugue: this.conyugue,    
            hijoscondiscapacidad: this.hijoscondiscapacidad,
            hijossindiscapacidad: this.hijossindiscapacidad,
            fondosolidaridad: this.fondosolidaridad,
            cajanotarial: this.cajanotarial
            })
        };
    
        return fetch(url, options)
            .then(response => {
            if (!response.ok) {
            throw new Error('La solicitud de calcular sueldo líquido falló');
            }
            return response.json();
            })
            .then(data => {
            // Devuelve los resultados del cálculo de sueldo líquido
            return data;
            })
            .catch(error => {
            console.error('Error al calcular el sueldo líquido:', error);
            });
        }
}

/** CALCULATIONS */

function calculoSueldoLiquido(user){
    /** Valor BPC 2022. */
    const bpc = 5164;
    const aporte_jubilatorio = 15;
    /* Porcentaje de aportes FONASA para personas con salario hasta a 2.5 BPC. */
    const aporte_fonasa_hasta25bpc = 3;
        /* Porcentaje de aportes FONASA para personas con salario desde a 2.5 BPC. */
    const aporte_fonasa_desde25bpc = 4.5;

    const aporte_frl = 0.1;
    /* Porcentaje de deducciones de IRPF para personas con salario hasta 15 BPC. */
    const tasa_deducciones_hasta15bpc = 10;
    /* Porcentaje de deducciones de IRPF para personas con salario desde 15 BPC. */
    const tasa_deducciones_desde15bpc = 8;

    /* Cantidad deducida del IRPF por cada hijo sin discapacidad. */
    const deduccion_hijosindiscapacidad = (13 * bpc) / 12;
    /* Cantidad deducida del IRPF por cada hijo con discapacidad.*/
    const deduccion_hijoconiscapacidad = (26 * bpc) / 12;

    /* Adicional al fondo de solidaridad que debe pagarse en carreras de duracion igual o mayor a cinco años.*/
    const adicional_fondosolidaridad = ((5 / 3) * bpc) / 12;

    if (user.aportaFondoSolidaridad)   descuento_fondosolidaridad = adicional_fondosolidaridad;
    else descuento_fondosolidaridad = 0 

    if (user.hijosSinDiscapacidad > 0) IRPF_sindiscapacidad = ( IRPF - deduccion_hijosindiscapacidad) 
    else IRPF_sindiscapacidad = 0

    if (user.hijosConDiscapacidad > 0) IRPF_condiscapacidad = ( IRPF - deduccion_hijoconiscapacidad) 
    else IRPF_condiscapacidad = 0

    var descuento_fonasa = 0;
    var descuento_jubilatorio = (user.sueldoNominal * aporte_jubilatorio) / 100
    var descuento_frl = (user.sueldoNominal * aporte_frl) / 100

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
    var descuentoirpf = irpf.calculodescuentoIRPF(user.sueldoNominal)
    
    if (user.sueldoNominal > 25 * bpc) descuento_fonasa = (user.sueldoNominal * aporte_fonasa_desde25bpc) / 100
    else descuento_fonasa = (user.sueldoNominal * aporte_fonasa_hasta25bpc) / 100
    if (user.sueldoNominal > 15 * bpc) descuentoirpf = (descuentoirpf * tasa_deducciones_desde15bpc) / 100
    else descuentoirpf = (descuentoirpf * tasa_deducciones_hasta15bpc) / 100
    return (Math.round (user.sueldoNominal - descuentoirpf - descuento_jubilatorio - descuento_frl - descuento_fonasa - IRPF_sindiscapacidad - IRPF_condiscapacidad - descuento_fondosolidaridad))
}


var form = document.querySelector('#submit');
submit.addEventListener('click', (event) => {
    event.preventDefault(); // evita que se recargue la página al enviar el formulario
    Swal.fire({
        title: "¿Deseas continuar?",
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar'
        })
        .then((result) => {
            if (result.isConfirmed) { //calcula el sueldo liquido 
                var sueldoNominal = parseFloat(document.querySelector('#sueldonominal').value);
                var tieneHijos = document.querySelector('input[name="hijos-cargo"]:checked').value === 'si';
                var tieneConyugue = document.querySelector('input[name="pareja-cargo"]:checked').value === 'si';
                var hijosConDiscapacidad = parseInt(document.querySelector('#hijos-discapacidad').value);
                var hijosSinDiscapacidad = parseInt(document.querySelector('#hijos-sin-discapacidad').value);
                var aportaFondoSolidaridad = document.querySelector('input[name="aporta-solidaridad"]:checked').value === 'si';
                var aportaCajaNotarial = document.querySelector('input[name="aporte-caja-notarial"]:checked').value === 'si';
                
                var user = new User(sueldoNominal, tieneHijos, tieneConyugue, hijosConDiscapacidad, hijosSinDiscapacidad, aportaFondoSolidaridad, aportaCajaNotarial);
                var sueldoLiquido = calculoSueldoLiquido(user);
                
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
            }
            })
});

const guardarLocal = (clave, valor) => { localStorage.setItem(clave, valor) };
guardarLocal("datosUser", JSON.stringify(User));
const almacenados = JSON.parse(localStorage.getItem("User"));
