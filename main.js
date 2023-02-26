
/** DATA ENTRY  */
function solicitarSueldoNominal() {
    return prompt (`Ingrese su sueldo nominal`)
} 

/** CALCULATIONS */

function calculoSueldoLiquido(sueldoNominal){
    /** Valor BPC 2022. */
    const BPC = 5164;

    const TOPE1 = 7 * BPC;
    const TOPE2 = 10 * BPC;
    const TOPE3 = 15 * BPC;
    const TOPE4 = 30 * BPC;
    const TOPE5 = 50 * BPC;
    const TOPE6 = 75 * BPC;
    const TOPE7 = 115 * BPC;

    const TASA7 = 36;
    const TASA6 = 31;
    const TASA5 = 27;
    const TASA4 = 25;
    const TASA3 = 24;
    const TASA2 = 15;
    const TASA1 = 10;

    const APORTES_JUBILATORIOS = 15;
    const APORTES_FONASA_HASTA25BPC = 3;
    const APORTES_FONASA_DESDE25BPC = 4.5;
    const APORTE_FRL = 0.1;
    const TASA_DEDUCCIONES_HASTA15BPC = 10;
    const TASA_DEDUCCIONES_DESDE15BPC = 8;

    var irpf = 0;
    var apfonasa = 0;
    var ap_jub = (sueldoNominal * APORTES_JUBILATORIOS) / 100
    var ap_frl = (sueldoNominal * APORTE_FRL) / 100
    
    switch (true) {
        case sueldoNominal > TOPE7 :
            irpf = ((sueldoNominal - TOPE7) * TASA7 ) / 100;
            break;
        case sueldoNominal > TOPE6 :
           irpf = ((sueldoNominal - TOPE6) * TASA6 ) / 100;
            break;
        case sueldoNominal > TOPE5 :
            irpf = ((sueldoNominal - TOPE5) * TASA5 ) / 100;
            break;
        case sueldoNominal > TOPE4 :
            irpf = ((sueldoNominal - TOPE4) * TASA4 ) / 100;
            break;
        case sueldoNominal > TOPE3 :
            irpf = ((sueldoNominal - TOPE3) * TASA3 ) / 100;
            break;
        case sueldoNominal > TOPE2 :
            irpf = ((sueldoNominal - TOPE2) * TASA2 ) / 100;
            break;
        case sueldoNominal > TOPE1 :
            irpf = ((sueldoNominal - TOPE1) * TASA1 ) / 100;
            break;
        default:
            irpf = 0
            break;
    }
    if (sueldoNominal > 25 * BPC) apfonasa = (sueldoNominal * APORTES_FONASA_DESDE25BPC) / 100
    else apfonasa = (sueldoNominal * APORTES_FONASA_HASTA25BPC) / 100
    if (sueldoNominal > 15 * BPC) irpf = (irpf * TASA_DEDUCCIONES_DESDE15BPC) / 100
    else irpf = (irpf * TASA_DEDUCCIONES_HASTA15BPC) / 100
    return (Math.round (sueldoNominal - irpf - ap_jub - ap_frl - apfonasa))
}

function mostrarSueldoLiquido(sueldoLiquido) {
    alert ("Su sueldo liquido es de $" + sueldoLiquido)
}

/** MAIN */
var sueldoNominal = solicitarSueldoNominal()
var sueldoLiquido = calculoSueldoLiquido(sueldoNominal)
mostrarSueldoLiquido(sueldoLiquido)