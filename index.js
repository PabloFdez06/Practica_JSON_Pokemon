"use strict";


const nombre = document.getElementById('nombre_pokemon');
const tipo = document.getElementById('tipo_pokemon');
const button2 = document.getElementById('solicitar_pokemon');
const errorCard = document.getElementById('error_card');
const datos_pokemon = document.getElementById('datos_pokemon');

// Inputs dependientes
function toggleInputs(entradaInput, inputADesactivar) {
  if (entradaInput.value.trim() !== '') {
    inputADesactivar.disabled = true;
    inputADesactivar.placeholder = '-';
  } else {
    inputADesactivar.disabled = false;
    inputADesactivar.placeholder = inputADesactivar === nombre ? 'Ingresa un nombre' : 'Ingresa un tipo';
  }
}
nombre.addEventListener('input', () => toggleInputs(nombre, tipo));
tipo.addEventListener('input', () => toggleInputs(tipo, nombre));

// Búsqueda automática por input (desde 3 letras)
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

// Búsqueda principal y rendering
async function buscarPokemon() {
  const nombrePokemon = nombre.value.trim().toLowerCase();
  const tipoPokemon = tipo.value.trim().toLowerCase();

  errorCard.hidden = true;
  datos_pokemon.innerHTML = '';

  if (!nombrePokemon && !tipoPokemon) {
    errorCard.hidden = false;
    errorCard.textContent = 'Debes ingresar al menos un nombre o un tipo.';
    setTimeout(() => { errorCard.hidden = true; }, 4000);
    return;
  }

  if (nombrePokemon && tipoPokemon) {
    errorCard.hidden = false;
    errorCard.textContent = 'Por favor busca solo por nombre o por tipo, no ambos.';
    setTimeout(() => { errorCard.hidden = true; }, 4000);
    return;
  }

  // Búsqueda por nombre
  if (nombrePokemon) {
    try {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1300');
      const data = await res.json();
      const matches = data.results.filter(p => p.name.startsWith(nombrePokemon));
      if (matches.length === 0) throw new Error(`No se encontraron Pokémon que empiecen por "${nombrePokemon}".`);

      for (const poke of matches) {
        const resPoke = await fetch(poke.url);
        const info = await resPoke.json();
        const li = document.createElement('li');
        li.innerHTML = `
          Nombre: ${info.name} <br>
          Altura: ${info.height} cm <br>
          Peso: ${info.weight} g
          <img class="pokemon-img" src="${info.sprites.front_default}" data-nombre="${info.name}" />
          <hr>
        `;
        const foto = li.querySelector('.pokemon-img');
        foto.addEventListener('click', function() {
          mostrarDetalle(info.name);
        });
        datos_pokemon.appendChild(li);
      }
    } catch (error) {
      errorCard.hidden = false;
      errorCard.textContent = error.message;
      setTimeout(() => { errorCard.hidden = true; }, 4000);
    }
    return;
  }

  // Búsqueda por tipo
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
          Altura: ${info.height} cm <br>
          Peso: ${info.weight} g
          <img class="pokemon-img" src="${info.sprites.front_default}" data-nombre="${info.name}" />
          <hr>
        `;
        const foto = li.querySelector('.pokemon-img');
        foto.addEventListener('click', function() {
          mostrarDetalle(info.name);
        });
        datos_pokemon.appendChild(li);
      }
    } catch (error) {
      errorCard.hidden = false;
      errorCard.textContent = error.message;
      setTimeout(() => { errorCard.hidden = true; }, 4000);
    }
  }
}

// Modal de detalle
async function mostrarDetalle(nombrePokemon) {
  const modal = document.getElementById('detalle_pokemon_modal');
  modal.style.display = 'block';
  setTimeout(() => {
    modal.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 120); // Timeout corto para asegurar que el modal ya está visible
  const detalleDiv = document.getElementById('detalle_pokemon');
  detalleDiv.innerHTML = '';
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon.toLowerCase()}`);
    if (!res.ok) throw new Error('Pokémon no encontrado');
    const info = await res.json();
    const li = document.createElement('li');
    li.innerHTML = `
      <h2>${info.name}</h2>
      <img src="${info.sprites.front_default}" />
      <p>Altura: ${info.height} cm</p>
      <p>Peso: ${info.weight} g</p>
      <p>Experiencia base: ${info.base_experience}</p>
      <p>Tipo: ${info.types.map(t => t.type.name).join(', ')}</p>
      <p>Habilidades: ${info.abilities.map(a => a.ability.name).join(', ')}</p>
    `;
    detalleDiv.appendChild(li);
  } catch (error) {
    detalleDiv.textContent = error.message;
  }
}
document.getElementById('cerrar_detalle').onclick = function() {
  document.getElementById('detalle_pokemon_modal').style.display = 'none';
};
