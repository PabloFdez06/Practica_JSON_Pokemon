const nombre = document.getElementById('nombre_pokemon');
const tipo = document.getElementById('tipo_pokemon');
const button2 = document.getElementById('solicitar_pokemon');

const errorCard = document.getElementById('error_card');

const liNombre = document.getElementById('nombre');
const liAltura = document.getElementById('altura');
const liPeso = document.getElementById('peso');
const datos_pokemon = document.getElementById('datos_pokemon');

let imgn = document.createElement('img');
datos_pokemon.appendChild(imgn);

// --- Búsqueda automática por input, a partir de la 3 letra ---
let debounceTimer;
nombre.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const nombrePokemon = nombre.value.trim().toLowerCase();
        if (nombrePokemon.length >= 3 && tipo.value.trim() === '') {
            buscarPokemon();
        }
    }, 500);
});

button2.addEventListener('click', buscarPokemon);

async function buscarPokemon() {
    const nombrePokemon = nombre.value.trim().toLowerCase();
    const tipoPokemon = tipo.value.trim().toLowerCase();

    // --- Limpia resultados e inicializa estructura ---
    liNombre.textContent = '';
    liAltura.textContent = '';
    liPeso.textContent = '';
    imgn.src = '';
    errorCard.hidden = true;
    datos_pokemon.innerHTML = '';

    // --- Validación de campos ---
    if (!nombrePokemon && !tipoPokemon) {
        console.warn('Debes ingresar al menos un nombre o un tipo.');
        errorCard.hidden = false;
        errorCard.textContent = 'Debes ingresar al menos un nombre o un tipo.';
        setTimeout(() => { errorCard.hidden = true; }, 4000);
        return;
    }

    if (nombrePokemon && tipoPokemon) {
        console.warn('Por favor busca solo por nombre o por tipo, no ambos.');
        errorCard.hidden = false;
        errorCard.textContent = 'Por favor busca solo por nombre o por tipo, no ambos.';
        setTimeout(() => { errorCard.hidden = true; }, 4000);
        return;
    }

    datos_pokemon.innerHTML = '';

    // --- Búsqueda por nombre ---
    if (nombrePokemon) {
        try {
            const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1300');
            const data = await res.json();
            const matches = data.results.filter(p => p.name.startsWith(nombrePokemon));
            if (matches.length === 0) throw new Error(`No se encontraron Pokémon que empiecen por "${nombrePokemon}".`);

            for (const poke of matches) {
                const res = await fetch(poke.url);
                const info = await res.json();
                const li = document.createElement('li');
                li.innerHTML = `
                    Nombre: ${info.name} <br>
                    Altura: ${info.height} m <br>
                    Peso: ${info.weight} kg
                    <img class="pokemon-img" src="${info.sprites.front_default}" />
                    <hr>
                `;
                datos_pokemon.appendChild(li);
            }
        } catch (error) {
            console.error('Error al buscar por nombre:', error.message);
            errorCard.hidden = false;
            errorCard.textContent = error.message;
            setTimeout(() => { errorCard.hidden = true; }, 4000);
        }
        return;
    }

    // --- Búsqueda por tipo ---
    if (tipoPokemon) {
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/type/${tipoPokemon}`);
            if (!res.ok) throw new Error('Tipo de Pokémon no encontrado');
            const data = await res.json();

            const pokemons = data.pokemon;
            if (pokemons.length === 0) throw new Error('No se encontraron Pokémon de ese tipo.');

            for (let i = 0; i < pokemons.length; i++) {
                const pokeRes = await fetch(pokemons[i].pokemon.url);
                const info = await pokeRes.json();

                const li = document.createElement('li');
                li.innerHTML = `
                    Nombre: ${info.name} <br>
                    Altura: ${info.height} m <br>
                    Peso: ${info.weight} kg
                    <img class="pokemon-img" src="${info.sprites.front_default}" />
                    <hr>
                `;
                datos_pokemon.appendChild(li);
            }
        } catch (error) {
            console.error('Error al obtener los Pokémon por tipo:', error.message);
            errorCard.hidden = false;
            errorCard.textContent = error.message;
            setTimeout(() => { errorCard.hidden = true; }, 4000);
        }
    }
}
