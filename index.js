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



button2.addEventListener('click', async () => {
    const nombrePokemon = nombre.value.trim().toLowerCase();
    const tipoPokemon = tipo.value.trim().toLowerCase();

    // Limpia resultados e inicializa estructura
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

    // --- Búsqueda por nombre ---
    if (nombrePokemon) {
        if (nombrePokemon === 'chu') {
            try {
                const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1300');
                const data = await res.json();
                const matches = data.results.filter(p => p.name.includes('chu'));
                if (matches.length === 0) throw new Error('No se encontraron Pokémon con "chu".');

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
                console.error('Error en búsqueda "chu":', error.message);
                errorCard.hidden = false;
                errorCard.textContent = error.message;
                setTimeout(() => { errorCard.hidden = true; }, 4000);
            }
        } else {
            try {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`);
                if (!res.ok) throw new Error('Pokémon no encontrado');
                const data = await res.json();

                liNombre.textContent = `Nombre: ${data.name}`;
                liAltura.textContent = `Altura: ${data.height} m`;
                liPeso.textContent = `Peso: ${data.weight} kg`;
                imgn.src = data.sprites.front_default;

                datos_pokemon.appendChild(liNombre);
                datos_pokemon.appendChild(liAltura);
                datos_pokemon.appendChild(liPeso);
                datos_pokemon.appendChild(imgn);
            } catch (error) {
                console.error('Error al obtener el Pokémon:', error.message);
                errorCard.hidden = false;
                errorCard.textContent = error.message;
                setTimeout(() => { errorCard.hidden = true; }, 4000);
            }
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

            for (let i = 0; i < Math.min(pokemons.length); i++) {
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
});

