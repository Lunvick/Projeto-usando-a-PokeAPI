const botao = document.getElementById("btnBuscar");
    const input = document.getElementById("pokemonInput");
    const resultado = document.getElementById("resultado");

    botao.addEventListener("click", buscarPokemon);

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        buscarPokemon();
      }
    });

    async function buscarPokemon() {
      let valorDigitado = input.value.trim().toLowerCase();

      if (valorDigitado === "") {
      resultado.innerHTML = '<p class="erro">Digite o nome ou número de um Pokémon.</p>';
        return;
      }

     resultado.innerHTML = '<p>Carregando...</p>';

      try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${valorDigitado}`);

        if (!resposta.ok) {
          throw new Error("Pokémon não encontrado.");
        }

        const pokemon = await resposta.json();
        mostrarPokemon(pokemon);

      } catch (erro) {
        resultado.innerHTML = `
          <p class="erro">${erro.message}</p>
          <p>Tente pesquisar por exemplo: <strong>pikachu</strong>, <strong>charizard</strong> ou <strong>25</strong>.</p>
        `;
      }
    }

    function mostrarPokemon(pokemon) {
      const nome = pokemon.name;
      const numero = pokemon.id;
      const imagem =
        pokemon.sprites.other["official-artwork"].front_default ||
        pokemon.sprites.front_default ||
        "";

      const tipos = pokemon.types.map(tipo => tipo.type.name).join(", ");
      const altura = pokemon.height / 10;
      const peso = pokemon.weight / 10;
      const habilidades = pokemon.abilities.map(hab => hab.ability.name).join(", ");

      const statsHTML = pokemon.stats.map(stat => {
        return `
          <div class="stat">
            <strong>${traduzirStat(stat.stat.name)}:</strong> ${stat.base_stat}
          </div>
        `;
      }).join("");

      resultado.innerHTML = `
        <div class="card">
          <img src="${imagem}" alt="${nome}">
          <h2>${nome}</h2>
          <p class="numero">Pokédex Nº ${numero}</p>

          <div class="info">
            <p><strong>Tipo:</strong> ${tipos}</p>
            <p><strong>Altura:</strong> ${altura} m</p>
            <p><strong>Peso:</strong> ${peso} kg</p>
            <p><strong>Habilidades:</strong> ${habilidades}</p>
          </div>

          <div class="stats">
            <h3>Status Base</h3>
            ${statsHTML}
          </div>
        </div>
      `;
    }

    function traduzirStat(stat) {
      const traducoes = {
        hp: "HP",
        attack: "Ataque",
        defense: "Defesa",
        "special-attack": "Ataque Especial",
        "special-defense": "Defesa Especial",
        speed: "Velocidade"
      };

      return traducoes[stat] || stat;
    }