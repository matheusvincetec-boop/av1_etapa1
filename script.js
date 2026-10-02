// Arquivo de configuração e processamento do Partido PDisney

// Array global para armazenar os candidatos filtrados do partido com os novos campos
const candidatos = [];

// Array global para armazenar as candidaturas válidas registradas em memória
const registroCandidaturas = [];

// Configuração Fixa do seu Partido Sorteado
const MEU_PARTIDO = "PDisney";
const NUMERO_PARTIDO = "91";
const NOME_ARQUIVO = "PDisney.json";

// Dados integrados com links abertos de alta disponibilidade (Evita erro de imagem quebrada)
const candidatos = [
    { id: 1, nome: "Mickey Mouse", foto: "https://gstatic.com" },
    { id: 2, nome: "Minnie Mouse", foto: "https://gstatic.com" },
    { id: 3, nome: "Pato Donald", foto: "https://gstatic.com" },
    { id: 4, nome: "Pateta", foto: "https://gstatic.com" },
    { id: 5, nome: "Pluto", foto: "https://gstatic.com" },
    { id: 6, nome: "Tio Patinhas", foto: "https://gstatic.com" },
    { id: 7, nome: "Margarida", foto: "https://gstatic.com" },
    { id: 8, nome: "Zé Carioca", foto: "https://gstatic.com" },
    { id: 9, nome: "Mago Merlin", foto: "https://gstatic.com" },
    { id: 10, nome: "Gastão", "foto": "https://gstatic.com" }
];


function carregarCandidatos() {
    window.todosCandidatosJSON = dadosEmbutidosJSON;
    console.log("Carga de dados local executada.");
    
    const txtPartido = document.getElementById("txtNumeroPartido");
    if (txtPartido) {
        txtPartido.value = NUMERO_PARTIDO;
        processarPartido(); // Renderiza os personagens imediatamente na inicialização
    }
}

function processarPartido() {
    const numPartido = document.getElementById("txtNumeroPartido").value.trim();
    const lblNome = document.getElementById("lblNomePartido");
    const msgErro = document.getElementById("msgErroPartido");
    const lstCandidatos = document.getElementById("lstCandidatos");

    lblNome.innerHTML = "<b>---</b>";
    msgErro.textContent = "";
    lstCandidatos.innerHTML = "";
    candidatos.length = 0; 

    if (numPartido !== NUMERO_PARTIDO) {
        msgErro.textContent = `Número incorreto para este ambiente de chapa. Use o número do seu partido (${NUMERO_PARTIDO}).`;
        return;
    }

    lblNome.innerHTML = `<b>${MEU_PARTIDO}</b>`;

    const filtrados = window.todosCandidatosJSON[MEU_PARTIDO] || [];

    filtrados.forEach((filiado, index) => {
        const candidatoFormatado = {
            id: index + 1,
            nome: filiado.nome,
            foto: filiado.foto || "",
            partido: MEU_PARTIDO,
            cargo: "",
            numero: ""
        };

        candidatos.push(candidatoFormatado);

        const option = document.createElement("option");
        option.value = candidatoFormatado.id;
        option.textContent = candidatoFormatado.nome;
        lstCandidatos.appendChild(option);
    });
}

function selecionarCandidato() {
    // CORRIGIDO: Removido o erro de atribuição dupla que quebrava o script
    const lstCandidatos = document.getElementById("lstCandidatos");
    const candId = lstCandidatos.value;
    
    const candidato = candidatos.find(c => c.id == candId);
    if (!candidato) return;

    document.getElementById("lstCargos").value = candidato.cargo || "Presidente";
    document.getElementById("txtNumeroCandidato").value = candidato.numero || "";

    document.getElementById("infoNome").textContent = candidato.nome;
    document.getElementById("infoCargo").textContent = candidato.cargo || "-";
    document.getElementById("infoNumero").textContent = candidato.numero || "-";
    
    const imgFoto = document.getElementById("infoFoto");
    imgFoto.src = candidato.foto;
    imgFoto.alt = `Foto de ${candidato.nome}`;
    
    document.getElementById("painelCandidato").style.display = "block";
}

function registrarCandidatura() {
    const lstCandidatos = document.getElementById("lstCandidatos");
    const lstCargos = document.getElementById("lstCargos");
    const txtNumeroCandidato = document.getElementById("txtNumeroCandidato");
    const msgErroNumero = document.getElementById("msgErroNumero");
    const feedbackAcao = document.getElementById("msgFeedbackAcao");

    msgErroNumero.textContent = "";
    feedbackAcao.textContent = "";
    feedbackAcao.className = "";

    const candId = lstCandidatos.value;
    const cargo = lstCargos.value;
    const numero = txtNumeroCandidato.value.trim();

    if (!candId || !cargo || !numero) {
        return alert("Por favor, selecione o Candidato, o Cargo e informe o Número.");
    }

    const candidato = candidatos.find(c => c.id == candId);

    if (!validarNumeroCandidato(numero, cargo)) {
        msgErroNumero.textContent = "Número inválido ou incompatível com as regras do cargo.";
        return;
    }

    const jaRegistrado = registroCandidaturas.some(rc => rc.id == candId);
    if (jaRegistrado) {
        return alert(`Incoerência: O filiado ${candidato.nome} já possui uma candidatura registrada nesta chapa.`);
    }

    const qtdNoCargo = registroCandidaturas.filter(rc => rc.cargo === cargo).length;
    if (cargo === "Presidente" && qtdNoCargo >= 1) return alert("Limite atingido: máximo de 1 candidato para Presidente.");
    if (cargo === "Governador(a)" && qtdNoCargo >= 1) return alert("Limite atingido: máximo de 1 candidato para Governador(a).");
    if (cargo === "Senador(a)" && qtdNoCargo >= 2) return alert("Limite atingido: máximo de 2 candidatos para Senador(a).");

    candidato.cargo = cargo;
    candidato.numero = numero;

    document.getElementById("infoCargo").textContent = cargo;
    document.getElementById("infoNumero").textContent = numero;

    registroCandidaturas.push({
        id: candidato.id,
        nome: candidato.nome,
        numero: candidato.numero,
        foto: candidato.foto,
        cargo: candidato.cargo
    });

    const listaUL = document.getElementById("listaRegistrados");
    listaUL.innerHTML = "";
    registroCandidaturas.forEach(rc => {
        const li = document.createElement("li");
        li.textContent = `[${rc.cargo}] N° ${rc.numero} - ${rc.nome}`;
        listaUL.appendChild(li);
    });

    feedbackAcao.className = "sucesso";
    feedbackAcao.textContent = `Candidatura de ${candidato.nome} registrada localmente!`;
    
    txtNumeroCandidato.value = "";
}

function gravarEEnviarTSE() {
    const feedbackAcao = document.getElementById("msgFeedbackAcao");

    feedbackAcao.textContent = "";
    feedbackAcao.className = "";

    if (registroCandidaturas.length === 0) {
        return alert("Não existem candidaturas registradas no sistema para enviar ao TSE.");
    }

    const payloadTSE = registroCandidaturas.map(rc => ({
        nome: rc.nome,
        numero: rc.numero,
        foto: rc.foto,
        cargo: rc.cargo
    }));

    const jsonString = JSON.stringify(payloadTSE, null, 2);

    console.log("Payload Oficial Enviado ao TSE:", payloadTSE);
    localStorage.setItem(`chapa_tse_${MEU_PARTIDO}`, jsonString);

    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = NOME_ARQUIVO;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    feedbackAcao.className = "sucesso";
    feedbackAcao.innerHTML = `<b>Chapa enviada ao TSE com sucesso! Arquivo "${NOME_ARQUIVO}" gerado para download.</b>`;
    
    document.getElementById("txtNumeroPartido").value = NUMERO_PARTIDO;
    document.getElementById("txtNumeroCandidato").value = "";
    document.getElementById("painelCandidato").style.display = "none";
    document.getElementById("listaRegistrados").innerHTML = "";
    
    registroCandidaturas.length = 0;
}

function validarNumeroCandidato(numero, cargo) {
    const numStr = numero.toString();

    if (!numStr.startsWith(NUMERO_PARTIDO)) return false;

    switch (cargo) {
        case "Presidente":          return numStr.length === 2;
        case "Governador(a)":       return numStr.length === 2;
        case "Senador(a)":          return numStr.length === 3;
        case "Deputado(a) Federal":  return numStr.length === 4;
        case "Deputado(a) Estadual": return numStr.length === 5;
        default: return false;
    }
}

// Inicializa a aplicação
carregarCandidatos();
