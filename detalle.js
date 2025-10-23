const params = new URLSearchParams(window.location.search);
const nombre = params.get('nombre');
const detalleDiv = document.getElementById('detalle_pokemon');

document.getElementById('volver_inicio').onclick = function() {
    window.location.href = "index.html";
};

async function mostrarDetalle(nombrePokemon) {
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
        li.textContent = error.message;
    }

}

if (nombre) {
    mostrarDetalle(nombre);
} else {
    detalleDiv.textContent = "No se indicó ningún Pokémon.";
}
