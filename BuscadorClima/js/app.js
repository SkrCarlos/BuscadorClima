const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

let tiempo = 1500;

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e) {
    e.preventDefault();

    //Validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if (ciudad === '' || pais === '') {
        mostrarError('Ambos campos son obligatorios');
        return;
    }


    //Consultamos la API
    consultarAPI(ciudad, pais);

}

function consultarAPI(ciudad, pais) {

    const appID = 'c2d28ba890f80ae14a8223a4c9b159aa';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`;
    console.log(url);

    Spinner(); //Muestra el spinner

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {

            if (datos.cod === "404") { //Verifica que exista el lugar
                limpiarHTML();
                mostrarError('Ciudad no encontrada');
                return;
            }

            //Imprime la respuesta en el HTML
            mostrarClima(datos);
        })
        .catch(e => console.log(e));

}

function mostrarClima(datos) {

    limpiarHTML();

    const { name, main: { temp, temp_max, temp_min, humidity }, wind: { speed } } = datos;

    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.innerHTML = `${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl');

    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl');

    const tempMaxMin = document.createElement('p');
    tempMaxMin.innerHTML = `Max: ${max} &#8451; &nbsp;&nbsp;&nbsp; Min: ${min} &#8451;`;
    tempMaxMin.classList.add('text-xl');

    const humedad = document.createElement('p');
    humedad.innerHTML = `Humedad: ${humidity}%`;
    humedad.classList.add('text-xl');

    const viento = document.createElement('p');
    viento.innerHTML = `Viento a ${speed} km/h`;
    viento.classList.add('text-xl');


    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxMin);
    resultadoDiv.appendChild(humedad);
    resultadoDiv.appendChild(viento);

    resultado.appendChild(resultadoDiv);
}

const kelvinACentigrados = grados => parseInt(grados - 273.15);

function Spinner() {

    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-cube-grid');
    divSpinner.innerHTML = `
    <div class="sk-cube sk-cube1"></div>
    <div class="sk-cube sk-cube2"></div>
    <div class="sk-cube sk-cube3"></div>
    <div class="sk-cube sk-cube4"></div>
    <div class="sk-cube sk-cube5"></div>
    <div class="sk-cube sk-cube6"></div>
    <div class="sk-cube sk-cube7"></div>
    <div class="sk-cube sk-cube8"></div>
    <div class="sk-cube sk-cube9"></div>
    `;

    resultado.appendChild(divSpinner);
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarError(mensaje) {
    const alerta = document.querySelector('.bg-red-100');
    if (!alerta) {

        const alerta = document.createElement('div');

        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
        <strong class = "font-bold">Error!</strong>
        <span class = "block">${mensaje}</span>
        `;

        container.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 2000);
    }


}