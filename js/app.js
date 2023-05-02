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
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.monto, 0 );
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter( gasto => gasto.id !== id );
        this.calcularRestante();
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

    mostrarGastos(gastos) {
        this.limpiarHTML();

        // Iterar sobre los gastos
        gastos.forEach(gastoList => {
            const { gasto, monto, id } = gastoList;

            // Crear un li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            // Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${gasto} <span class="badge badge-primary badge-pill"> s/ ${monto} </span>`;

            // Botón para borrar un gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.innerHTML = 'Borrar &times;'
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }

            nuevoGasto.appendChild(btnBorrar);

            // Agregar el HTML
            listaGastos.appendChild(nuevoGasto);
        });
    }

    limpiarHTML() {
        while (listaGastos.firstChild) {
            listaGastos.removeChild(listaGastos.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoUsuario) {
        const { presupuesto, restante } = presupuestoUsuario;
        const restanteDiv = document.querySelector('.restante');
        
        // Comprobar 25%
        if((presupuesto/4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        }
        else if((presupuesto/2) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        }
        else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        // Si el total es 0 o menor
        if(restante < 1) {
            ui.alerta('El presupuesto se ha agotado', 'error');
            form.querySelector('button[type="submit"]').disabled = true;
        }
        else {
            form.querySelector('button[type="submit"]').disabled = false;
        }
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
    if(gasto === '' || monto == '') {
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

    // mostrar la lista de gastos en el HTML
    const {gastos, restante} = presupuestoUsuario;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuestoUsuario);

    // Reinicia el formulario
    form.reset();
}

function eliminarGasto(id) {
    // Elimina los gastos del objeto
    presupuestoUsuario.eliminarGasto(id);

    // Elimina los gastos del HTML
    const { gastos, restante } = presupuestoUsuario;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuestoUsuario);
}