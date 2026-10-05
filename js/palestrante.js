const formulario = document.getElementById("formPalestrante");

formulario.addEventListener("submit", async function (event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();

    console.log("Tentando enviar:", nome, email);

    try {

        const resposta = await fetch("http://localhost:3000/palestrantes", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                nome: nome,
                email: email
            })
        });

        console.log("Status:", resposta.status);

        const dados = await resposta.json();

        console.log("Resposta:", dados);

        if (!resposta.ok) {
            alert(dados.mensagem || "Erro ao cadastrar.");
            return;
        }

        alert("cadastro concluído com sucesso");

        formulario.reset();

    } catch (erro) {

        console.error("Erro:", erro);

        alert("Erro ao conectar com o servidor.");
    }
});