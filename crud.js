$("#enviar").on("click", function () {
    var localSt = localStorage.getItem(nome,cpf)
    var nome = $("#txtNome").val()
    var cpf = $("#cpf").val()
    var tabela = $("#tabelaNomes")
    cadastro = [];
    
     $("#tabelaNomes").append("<tr><td>" + nome + "</td>,<td>"+cpf+"</td><td><button>Excluir</button></td><td><button>Editar</button></td></tr>")
    // Adicionando no localStorage

    localStorage.setItem('Nome', nome , cpf)
    $("#txtNome").val("");
    $("#cpf").val("")
})
 

$("#fechaGridCadas").on("click", function () {
    $("#fieldNovoCadastro").slideUp(200)
})

$("#fechaGridEdicao").on("click", function () {
    $("#fieldEditaCadastro").slideUp(200)
})

$("#novoCadas").click(function () {
    $("#fieldNovoCadastro").slideDown(200)
});

$("#editaCadas").click(function () {
    $("#fieldEditaCadastro").slideDown(200)
})


$("#editaCadas").on("click", function () {
    localStorage.removeItem('Nome');
    var nomeAtualizado = $("#attNome").val();
    var local = localStorage.setItem('NomeAtualizado', nomeAtualizado)
})

$("#deleta").on("click", function () {
    localStorage.removeItem('NomeAtualizado')
})

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