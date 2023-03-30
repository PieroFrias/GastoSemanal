// Variables y selectores
const form = document.querySelector('#agregar-gasto');
const listaGastos = document.querySelector('#gastos ul');

// Eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
}

// Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
}

class UI {

}

let presupuestoUsuario;

//Funciones
function preguntarPresupuesto() {
    const presupuesto = prompt('¿Cuál es su presupuesto?');

    Number(presupuesto);

    if(presupuesto === '' || presupuesto === null || presupuesto <= 0 || isNaN(presupuesto)) {
        window.location.reload();
    }

    presupuestoUsuario = new Presupuesto(presupuesto);
}