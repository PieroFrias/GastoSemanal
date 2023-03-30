// Variables y selectores
const form = document.querySelector('#agregar-gasto');
const listaGastos = document.querySelector('#gastos ul');
const tituloPrimario = document.querySelector('#tituloPrimario');

// Eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    form.addEventListener('submit', agregarGastos);
}

// Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos];
        console.log(gasto);
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        // Obteniendo los valores
        const { presupuesto, restante } = cantidad;

        // Asignarlos al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    alerta(mensaje, tipo) {
        // crear div
        const divAlerta = document.createElement('div');
        divAlerta.classList.add('text-center', 'alert');

        if(tipo === 'error') {
            divAlerta.classList.add('alert-danger');
        }
        else {
            divAlerta.classList.add('alert-success');
        }

        // mensaje
        divAlerta.textContent = mensaje;

        // insertarlo en el HTML
        document.querySelector('.primario').insertBefore(divAlerta, tituloPrimario);

        // quitar del HTML
        setTimeout(() => {
            divAlerta.remove();
        }, 2000);
    }
}

// instanciar
const ui = new UI();
let presupuestoUsuario;

//Funciones
function preguntarPresupuesto() {
    const presupuesto = prompt('¿Cuál es su presupuesto?');

    Number(presupuesto);

    if(presupuesto === '' || presupuesto === null || presupuesto <= 0 || isNaN(presupuesto)) {
        window.location.reload();
    }

    presupuestoUsuario = new Presupuesto(presupuesto);

    ui.insertarPresupuesto(presupuestoUsuario);
}

function agregarGastos(e) {
    e.preventDefault();

    // Leer los datos del form
    const gasto = document.querySelector('#gasto').value;
    const monto = Number(document.querySelector('#cantidad').value);

    // Validar
    if(gasto === '' || monto === '') {
        ui.alerta('Ambos campos son requeridos', 'error');
        return;
    }
    else if(monto < 0 || isNaN(monto)) {
        ui.alerta('Cantidad no válida', 'error');
        return;
    }

    // Generar un objeto con el gasto
    const gastoUsuario = {gasto, monto, id: Date.now()};

    // Agrega un nuevo gasto
    presupuestoUsuario.nuevoGasto(gastoUsuario);

    ui.alerta('Gasto agregado correctamente', 'success');

    // Reinicia el formulario
    form.reset();
}