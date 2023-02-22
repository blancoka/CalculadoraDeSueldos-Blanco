/** Valor BPC 2022. */
const BPC = 5164;

const Tope1 = 7 * BPC;
const Tope2 = 10 * BPC;
const Tope3 = 15 * BPC;
const Tope4 = 30 * BPC;
const Tope5 = 50 * BPC;
const Tope6 = 75 * BPC;
const Tope7 = 115 * BPC;

const tasa7 = 36;
const tasa6 = 31;
const tasa5 = 27;
const tasa4 = 25;
const tasa3 = 24;
const tasa2 = 15;
const tasa1 = 10;


const APORTES_JUBILATORIOS = 15;
const APORTES_FONASA_HASTA25BPC = 3;
const APORTES_FONASA_DESDE25BPC = 4.5;
const APORTE_FRL = 0.1;
const TASA_DEDUCCIONES_HASTA15BPC = 10;
const TASA_DEDUCCIONES_DESDE15BPC = 8;

var IRPF = 0;
var APFONASA = 0;


let sueldoNominal = prompt (`Ingresar sueldo nominal`)

switch (true) {
    case sueldoNominal > Tope7 :
        IRPF = ((sueldoNominal - Tope7) * tasa7 ) / 100;
        break;
    case sueldoNominal > Tope6 :
       IRPF = ((sueldoNominal - Tope6) * tasa6 ) / 100;
        break;
    case sueldoNominal > Tope5 :
        IRPF = ((sueldoNominal - Tope5) * tasa5 ) / 100;
        break;
    case sueldoNominal > Tope4 :
        IRPF = ((sueldoNominal - Tope4) * tasa4 ) / 100;
        break;
    case sueldoNominal > Tope3 :
        IRPF = ((sueldoNominal - Tope3) * tasa3 ) / 100;
        break;
    case sueldoNominal > Tope2 :
        IRPF = ((sueldoNominal - Tope2) * tasa2 ) / 100;
        break;
    case sueldoNominal > Tope1 :
        IRPF = ((sueldoNominal - Tope1) * tasa1 ) / 100;
        break;
    default:
        IRPF = 0
        break;
}

var AP_JUB = (sueldoNominal * APORTES_JUBILATORIOS) / 100
var AP_FRL = (sueldoNominal * APORTE_FRL) / 100


if (sueldoNominal > 25 * BPC) APFONASA = (sueldoNominal * 4.5) / 100
else APFONASA = (sueldoNominal * 3) / 100

if (sueldoNominal > 15 * BPC) IRPF = (IRPF * 8) / 100
else IRPF = (IRPF * 10) / 100

alert (Math.round (sueldoNominal - IRPF - AP_JUB - AP_FRL - APFONASA))

