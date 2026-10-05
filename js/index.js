const listaEventos = document.getElementById("listaEventos");


async function carregarEventos() {

    try {

        const resposta = await fetch(
            "http://localhost:3000/eventos"
        );

        if (!resposta.ok) {
            throw new Error("Não foi possível buscar os eventos.");
        }

        const eventos = await resposta.json();

        listaEventos.innerHTML = "";


        if (eventos.length === 0) {

            listaEventos.innerHTML =
                "<p>Nenhum evento cadastrado.</p>";

            return;
        }


        eventos.forEach((evento) => {

            const div = document.createElement("div");

            div.classList.add("evento");


            let nomePalestrante = "Não informado";


            if (
                evento.palestrantes &&
                evento.palestrantes.length > 0 &&
                evento.palestrantes[0].palestrante
            ) {

                nomePalestrante =
                    evento.palestrantes[0].palestrante.nome;
            }


            div.innerHTML = `
                <h3>${evento.nome}</h3>

                <p>
                    <strong>Descrição:</strong>
                    ${evento.descricao}
                </p>

                <p>
                    <strong>Local:</strong>
                    ${evento.local}
                </p>

                <p>
                    <strong>Palestrante:</strong>
                    ${nomePalestrante}
                </p>

                <div class="botoes">

                    <button
                        class="botao-editar"
                        onclick="editarEvento(${evento.id})">
                        Editar
                    </button>

                    <button
                        class="botao-excluir"
                        onclick="excluirEvento(${evento.id})">
                        Excluir
                    </button>

                </div>
            `;


            listaEventos.appendChild(div);
        });


    } catch (erro) {

        console.error(erro);

        listaEventos.innerHTML =
            "<p>Não foi possível carregar os eventos.</p>";
    }
}


/* EDITAR EVENTO */

function editarEvento(id) {
    window.location.href = `editarEvento.html?id=${id}`;
}



/* EXCLUIR EVENTO */

async function excluirEvento(id) {

    const confirmar = confirm(
        "Tem certeza que deseja excluir este evento?"
    );


    if (!confirmar) {
        return;
    }


    try {

        const resposta = await fetch(
            `http://localhost:3000/eventos/${id}`,
            {
                method: "DELETE"
            }
        );


        const dados = await resposta.json();


        if (!resposta.ok) {

            alert(
                dados.mensagem ||
                "Não foi possível excluir o evento."
            );

            return;
        }


        alert("Evento excluído com sucesso.");

        carregarEventos();


    } catch (erro) {

        console.error(erro);

        alert("Erro ao conectar com o servidor.");
    }
}


carregarEventos();