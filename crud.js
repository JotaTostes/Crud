var trEdicao;
var nomeBuscado;
var indice_selecionado = 0;
var idbotao = -1;
var localSt = localStorage.getItem("cadastro");
localSt = JSON.parse(localSt);
if (localSt == null)
    localSt = [];

// -------------- INSERIR CADASTRO ----------------
$("#enviar").on("click", function () {

    var nome = $("#txtNome").val();
    var cpf = $("#cpf").val();
    var tabela = $("#tabelaNomes");
    // Cria obj e converte pra string para adicionar no local storage
    var cadastro = JSON.stringify({
        ID: indice_selecionado++,
        Nome: $("#txtNome").val(),
        CPF: $("#cpf").val()
    });
    // Criando tabela de cadastros
    var tr = $("<tr/>");
    tr.append("<td data-nome>" + nome + "</td>");
    tr.append("<td data-cpf>" + cpf + "</td>");
    tr.append("<td><button data-remove>Excluir</button></td>");
    tr.append('<td><button data-edit id="' + idbotao + '">Editar</button></td>');
    // Verifico se esta editando ou inserindo novo cadastro
    if (!trEdicao) {
        $("#tabelaNomes").append(tr);
        // Adicionando no localStorage
        localSt.push(cadastro);
        localStorage.setItem("tbCadastros", JSON.stringify(localSt));
        $("#txtNome, #cpf").val("");
        $("#fieldNovoCadastro").slideUp(200);
    }
    else
        trEdicao.html(tr.html());
});

// ----------- BUSCA DE CADASTROS -------------
$("#busca").on("click", function () {
    nomeBuscado = $("#txtBusca").val();
    var tabela = $("#tabelaNomes");
    var pesquinome = $("#tabelaNomes").find("td[data-nome]").text();
    $("#legendPesquisa").text("Cadastro Pesquisado")
    $('#tabelaNomes tr').each(function () {
        // linha
        var tr = $(this)
        if ($(this).find('td:eq(0)').text() != nomeBuscado) {
            tr.hide();
        }
    });
});

// ----------- REMOVE CADASTROS --------------
$("#tabelaNomes").on("click", "button[data-remove]", function () {
    if (!confirm("Você deseja realmente excluir o registro?"))
        return;

    $(this).closest('tr').remove();
    localSt.splice(indice_selecionado, 1);
    localStorage.setItem("tbCadastros", JSON.stringify(localSt));
});

// -------------- EDITA CADASTROS ----------------
$("#tabelaNomes").on("click", "button[data-edit]", function () {
    $("#fieldNovoCadastro").slideDown(200)
    $("#legendField").text("Editar Cadastro")
    trEdicao = $(this).closest('tr');
    var trnome = trEdicao.find("td[data-nome]").text();
    var trcpf = trEdicao.find("td[data-cpf]").text();
    $("#txtNome").val(trnome);
    $("#cpf").val(trcpf);
    cadastro.forEach(function (cadastro) {
        cadastro = JSON.parse(cadastro)
        var cadastro2 = cadastro;
        console.log(cadastro2);
        // if (JSON.parse(cadastro2.Nome) == trcpf)
        //     cadastro.Nome = 
    });
});

// edita no localStorage
// localSt[indice_selecionado] = JSON.stringify({
//     Nome: $("#txtNome").val(),
//     CPF: $("#cpf").val()
// });//Altera o item selecionado na tabela
// localStorage.setItem("tbCadastros", JSON.stringify(localSt));
// return true;


// ---------- FECHA FIELDSET NOVO CADASTRO ------------
$("#fechaGridCadas").on("click", function () {
    $("#fieldNovoCadastro").slideUp(200);
})

$("#limpaForm").on("click", function () {
    $("#txtBusca").val("");
    $("#txtNome").val("");
})

// ----------- UPLOAD DE IMAGEM --------------

$("#enviaImg").on("click", function () {
    var imagem = $("#uplImg").imagem;
    if (imagem.length > 0) {
        getBase64(imagem[0]);
    }
    
});

function getBase64(imagem) {
    var reader = new FileReader();
    reader.readAsDataURL(imagem);
    reader.onload = function () {
        console.log(reader.result);
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}

// ---------- FECHA FIELDSET DE EDIÇAO ------------
$("#fechaGridEdicao").on("click", function () {
    $("#fieldEditaCadastro").slideUp(200);
})

// ------------ BOTÃO NOVO CADASTRO -------------
$("#novoCadas").click(function () {
    idbotao++;
    trEdicao = null;
    $("#legendField").text("Novo Cadastro");
    $("#legendPesquisa").text("Lista de Cadastros")
    $("#txtNome, #cpf").val("");
    $("#fieldNovoCadastro").slideDown(200);
});

// Daqui pra baixo é tudo referente a mascara do input de cpf
$("#cpf").keyup(function () {
    mcpf($("#cpf").val());
}).keydown(function (e) {
    if (e.which == 109 || e.which == 107 || e.which == 69 || e.which == 189 || e.which == 188 || e.which == 190)
        return false;
    mcpf($("#cpf").val());
}).on("blur", function () {
    mcpf($("#cpf").val());
});

function mcpf(v) {
    //retirando caracteres a mais do campo
    if ($("#cpf").val().length > 14) {
        $("#cpf").val($("#cpf").val().substr(0, 13));
        $("#cpf").keydown();
    }
    v = v.replace(/\D/g, "");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    $("#cpf").val(v);
}