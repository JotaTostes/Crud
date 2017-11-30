$("#enviar").on("click", function () {
    var localSt = localStorage.getItem(nome, cpf)
    var nome = $("#txtNome").val()
    var cpf = $("#cpf").val()
    var tabela = $("#tabelaNomes")
    $("#tabelaNomes").append('<tr><td data-nome>' + nome + "</td><td data-cpf>" + cpf + "</td><td><button onclick='excluirTr(this)'>Excluir</button></td><td><button onclick='editaTr(this)'>Editar</button></td></tr>")
    
    // Adicionando no localStorage
    localStorage.setItem("Nome", nome)
    $("#txtNome, #cpf").val("");
    $("#fieldNovoCadastro").slideUp(200);
})
var textolegend = $("#legendField").text();

function excluirTr(btnExcluitr) {
    $(btnExcluitr).closest('tr').remove();
}

function editaTr(btnEditatr) {
    var b = "Editar Cadastro";
    $(btnEditatr).on("click", function () {
        $("#fieldNovoCadastro").slideDown(200)
        if (textolegend == "Novo Cadastro") {
            $("#legendField").text(b)
            textolegend = b;
        }
        var tr = $(btnEditatr).closest('tr');
        var trnome = tr.find("td[data-nome]").text();
        var trcpf = tr.find("td[data-cpf]").text();
        $("#txtNome").val(trnome);
        $("#cpf").val(trcpf);
    })
}
function editaCadastro() {
    var tr = $(btnEditatr).closest('tr');
    var editaNome = tr.find("td[data-nome]").text();
    var editaCpf = tr.find("td[data-cpf]").text();
    
}

$("#fechaGridCadas").on("click", function () {
    $("#fieldNovoCadastro").slideUp(200);
})

$("#fechaGridEdicao").on("click", function () {
    $("#fieldEditaCadastro").slideUp(200);
})

// $("#enviaEdicao").on("click", function () {
//     $("#fieldEditaCadastro").slideUp(200);
// })

$("#novoCadas").click(function () {
    var a = "Novo Cadastro";
    if (textolegend == "Editar Cadastro") {
        $("#legendField").text(a);
        textolegend = a;
    }
    $("#txtNome, #cpf").val("");
    $("#fieldNovoCadastro").slideDown(200);
});

$("#editaCadas").on("click", function () {
    localStorage.removeItem('Nome');
    var nomeAtualizado = $("#attNome").val();
    var local = localStorage.setItem('NomeAtualizado', nomeAtualizado)
})

$("#deleta").on("click", function () {
    localStorage.removeItem('NomeAtualizado')
})

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