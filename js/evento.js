const formulario = document.getElementById("formEvento");
const listaPalestrantes = document.getElementById("palestrantes");
const titulo = document.getElementById("tituloFormulario");

const parametros = new URLSearchParams(window.location.search);
const idEvento = parametros.get("id");


async function carregarPalestrantes() {

    try {

        const resposta = await fetch(
            "http://localhost:3000/palestrantes"
        );

        if (!resposta.ok) {
            throw new Error("Erro ao buscar palestrantes.");
        }

        const palestrantes = await resposta.json();

        listaPalestrantes.innerHTML =
            '<option value="">Selecione um palestrante</option>';

        palestrantes.forEach((palestrante) => {

            const opcao = document.createElement("option");

            opcao.value = palestrante.id;
            opcao.textContent = palestrante.nome;

            listaPalestrantes.appendChild(opcao);
        });

    } catch (erro) {

        console.error(erro);

        alert("Não foi possível carregar os palestrantes.");
    }
}


async function carregarEvento() {

    if (!idEvento) {
        return;
    }

    titulo.textContent = "Editar Evento";

    try {

        const resposta = await fetch(
            `http://localhost:3000/eventos/${idEvento}`
        );

        if (!resposta.ok) {
            alert("Evento não encontrado.");
            return;
        }

        const evento = await resposta.json();

        console.log("Evento carregado:", evento);

        document.getElementById("nome").value = evento.nome;
        document.getElementById("descricao").value = evento.descricao;
        document.getElementById("local").value = evento.local;

        if (
            evento.palestrantes &&
            evento.palestrantes.length > 0
        ) {

            listaPalestrantes.value =
                evento.palestrantes[0].palestranteId;
        }

    } catch (erro) {

        console.error(erro);

        alert("Erro ao carregar o evento.");
    }
}


formulario.addEventListener("submit", async function (event) {

    event.preventDefault();

    const nome =
        document.getElementById("nome").value.trim();

    const descricao =
        document.getElementById("descricao").value.trim();

    const local =
        document.getElementById("local").value.trim();

    const palestranteId =
        listaPalestrantes.value;


    if (!nome || !descricao || !local || !palestranteId) {

        alert("Preencha todos os campos.");

        return;
    }


    try {

        const url = idEvento
            ? `http://localhost:3000/eventos/${idEvento}`
            : "http://localhost:3000/eventos";

        const metodo = idEvento
            ? "PUT"
            : "POST";


        const corpo = {

            nome: nome,

            descricao: descricao,

            local: local,

            palestrantes: [
                Number(palestranteId)
            ]
        };


        console.log("URL:", url);
        console.log("Método:", metodo);
        console.log("Dados:", corpo);


        const resposta = await fetch(url, {

            method: metodo,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(corpo)
        });


        const dados = await resposta.json();

        console.log("Resposta da API:", dados);


        if (!resposta.ok) {

            alert(
                dados.mensagem ||
                "Não foi possível salvar o evento."
            );

            return;
        }


        alert(
            idEvento
                ? "Evento atualizado com sucesso."
                : "cadastro concluído com sucesso"
        );


       window.location.href = "editarEventos.html";


    } catch (erro) {

        console.error("Erro:", erro);

        alert("Erro ao conectar com o servidor.");
    }
});


async function iniciar() {

    await carregarPalestrantes();

    await carregarEvento();
}


iniciar();