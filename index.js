const input = document.getElementById('nombre_pokemon');
const button2 = document.getElementById('solicitar_pokemon');

const errorCard = document.getElementById('error_card');

const liNombre = document.getElementById('nombre');
const liAltura = document.getElementById('altura');
const liPeso = document.getElementById('peso');
const datos_pokemon = document.getElementById('datos_pokemon');

let imgn = document.createElement('img');
datos_pokemon.appendChild(imgn);



button2.addEventListener('click', (e) => {
    const nombrePokemon = input.value.trim().toLowerCase();

    if (!nombrePokemon) {
        console.warn('No se ha seleccionado ningún Pokémon.');
        return;
    }
    // creamos los elementos aqui para que al hacer una busqueda por chu, los elementos no se pierdan
    liNombre.textContent = '';
    liAltura.textContent = '';
    liPeso.textContent = '';
    imgn.src = '';
    errorCard.hidden = true;

    // NUEVO BLOQUE para búsqueda parcial con "chu"
    if (nombrePokemon === 'chu') {
        datos_pokemon.innerHTML = '';
        fetch('https://pokeapi.co/api/v2/pokemon?limit=1300')
            .then(res => res.json())
            .then(async (data) => {
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
                errorCard.hidden = true;
            })
            .catch(error => {
                console.error('Error en búsqueda "chu":', error.message);
                errorCard.hidden = false;
                setTimeout(() => { errorCard.hidden = true; }, 5000);
            });

    } else {
        datos_pokemon.innerHTML = '';
        datos_pokemon.appendChild(liNombre);
        datos_pokemon.appendChild(liAltura);
        datos_pokemon.appendChild(liPeso);
        datos_pokemon.appendChild(imgn);

        // esto hace la busqueda normal y corriente segun el nombre que le metamos.
        fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Pokémon no encontrado');
                }
                return response.json();
            })
            .then(data => {
                liNombre.textContent = `Nombre: ${data.name}`;
                liAltura.textContent = `Altura: ${data.height} m`;
                liPeso.textContent = `Peso: ${data.weight} kg`;

                const tipos = data.types.map(tipoInfo => tipoInfo.type.name);
                console.log('Tipos:', tipos.join(', '));

                console.log('Imagen:', data.sprites.front_default);

                imgn.src = data.sprites.front_default;
                errorCard.hidden = true;

            })
            .catch(error => {
                console.error('Error al obtener el Pokémon:', error.message);

                errorCard.hidden = false;

                // 5 segundos
                setTimeout(() => {
                    errorCard.hidden = true;
                }, 5000);
            });
    }


});
