var textolegend = $("#legendField").text();
var editaCadastro = "F";
var trEdicao;

$("#enviar").on("click", function () {
    var localSt = localStorage.getItem(cadastro);
    var nome = $("#txtNome").val();
    var cpf = $("#cpf").val();
    var tabela = $("#tabelaNomes");
    var cadastro = JSON.stringify({
        Nome: $("#txtNome").val(),
        CPF: $("#cpf").val()
    });

    var tr = $("<tr/>");
    tr.append("<td data-nome>" + nome + "</td>");
    tr.append("<td data-cpf>" + cpf + "</td>");
    tr.append("<td><button data-remove>Excluir</button></td>");
    tr.append('<td><button data-edit>Editar</button></td>');

    if (!trEdicao) 
        $("#tabelaNomes").append(tr);
    else
        trEdicao.html(tr.html());

    // Adicionando no localStorage
    localStorage.setItem("Cadastros", cadastro)
    $("#txtNome, #cpf").val("");
    $("#fieldNovoCadastro").slideUp(200);
});

$("#busca").on("click", function () {
    $("#fieldPesquisa").slideDown(200);
    console.log("teste");
    $("tabelaNomes").find("td[data-nome]").text() == nome
    $("#fieldPesquisa").append("<p>" + nome + "</p>")
})

$("#tabelaNomes").on("click", "button[data-remove]", function() {
    if (!confirm("Você deseja realmente excluir o registro?"))
        return;
    
    $(this).closest('tr').remove();
    localStorage.removeItem("Cadastros");
});

$("#tabelaNomes").on("click", "button[data-edit]", function() {
    editaCadastro = "T";
    $("#fieldNovoCadastro").slideDown(200)
    $("#legendField").text("Editar Cadastro")
    trEdicao = $(this).closest('tr');
    var trnome = trEdicao.find("td[data-nome]").text();
    var trcpf = trEdicao.find("td[data-cpf]").text();
    $("#txtNome").val(trnome);
    $("#cpf").val(trcpf);
});

$("#fechaGridCadas").on("click", function () {
    $("#fieldNovoCadastro").slideUp(200);
})

$("#fechaGridEdicao").on("click", function () {
    $("#fieldEditaCadastro").slideUp(200);
})

$("#novoCadas").click(function () {
    trEdicao = null;
    editaCadastro = "F";
    $("#legendField").text("Novo Cadastro");
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