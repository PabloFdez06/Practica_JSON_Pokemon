const button = document.getElementById('nombre_pokemon');
const button2 = document.getElementById('solicitar_pokemon');

const liNombre = document.getElementById('nombre');
const liAltura = document.getElementById('altura');
const liPeso = document.getElementById('peso');
const datos_pokemon = document.getElementById('datos_pokemon');

let nombrePokemon = '';
let imgn = document.createElement('img');
datos_pokemon.appendChild(imgn);

button.addEventListener('click', (e) => {
    nombrePokemon = button.value;
});

button2.addEventListener('click', (e) => {
    if (!nombrePokemon) {
        console.warn('No se ha seleccionado ningún Pokémon.');
        return;
    }

    fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Pokémon no encontrado');
            }
            return response.json();
        })
        .then(data => {
            liNombre.textContent = `Nombre: ${data.name}`;
            liAltura.textContent = `Altura: ${data.height}`;
            liPeso.textContent = `Peso: ${data.weight}`;

            const tipos = data.types.map(tipoInfo => tipoInfo.type.name);
            console.log('Tipos:', tipos.join(', '));

            console.log('Imagen:', data.sprites.back_default);

            imgn.src = data.sprites.back_default;
        })
        .catch(error => {
            console.error('Error al obtener el Pokémon:', error.message);
        });
});
