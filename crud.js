var trEdicao;
var nomeBuscado;
var indice_selecionado = +localStorage.index || 0;
var localSt = localStorage.getItem("tbCadastros");
$("#imgPesquisa").hide();

localSt = JSON.parse(localSt);
if (localSt == null)
    localSt = [];


var geraTr = function (obj) {
    var tr = $('<tr data-id="' + obj.ID + '"/>');
    tr.append("<td>" + obj.Nome + "</td>");
    tr.append("<td>" + obj.CPF + "</td>");
    tr.append("<td><button data-remove>Excluir</button></td>");
    tr.append('<td><button data-edit>Editar</button></td>');
    return tr;
};

for (var i = 0; i < localSt.length; i++)
    $("#tabelaNomes").append(geraTr(localSt[i]));

// -------------- INSERIR CADASTRO ----------------
$("#enviar").on("click", function () {
    var obj = {
        ID: trEdicao ? +trEdicao.attr("data-id") : ++indice_selecionado,
        Nome: $("#txtNome").val(),
        CPF: $("#cpf").val()
    };

    var tr = geraTr(obj);
    var files = $("#uplImg")[0].files;
    if (files.length > 0) {
        getBase64(files[0], function (url) {
            try {
                obj.IMG = url;
                if (!trEdicao) {
                    localSt.push(obj);
                    localStorage.index = indice_selecionado + 1;
                    $("#tabelaNomes").append(tr);
                } else {
                    localSt = localSt.map(function (item) {
                        if (item.ID == obj.ID) {
                            console.log("Editei!", obj);
                            return obj;
                        }
                        return item;
                    });
                    trEdicao.html(tr.html());
                }

                localStorage.setItem("tbCadastros", JSON.stringify(localSt));
                $("#fieldNovoCadastro").slideUp(200);
                $("#txtNome, #cpf, #uplImg").val("");
                $("#exibeImg").attr('src', );
            }
            catch (e) {
                console.log("Falha ao salvar no localStorage: " + e);
            }
        });
    }
    else
        alert("Informe uma imagem!");
});

// ------------ PREVIEW DA IMAGEM ----------------
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#exibeImg').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$("#uplImg").on('change', function () {
    readURL(this);
});

// ----------- BUSCA DE CADASTROS -------------
$("#busca").on("click", function () {
    nomeBuscado = $("#txtBusca").val();
    var tabela = $("#tabelaNomes");
    var obj = localSt.filter(function (item) {
        return item.Nome == nomeBuscado;
    })[0];
    console.log(obj);
    $("#legendPesquisa").text("Cadastro Pesquisado")
    $('#tabelaNomes tr').each(function () {
        // linha
        var tr = $(this)
        if ($(this).find('td:eq(0)').text() != nomeBuscado) {
            tr.hide();
            $("#imgPesquisa").attr('src', obj.IMG).show();
        }
    });
});
// ----------- BOTÃO REMOVE CADASTROS --------------
$("#tabelaNomes").on("click", "button[data-remove]", function () {
    if (!confirm("Você deseja realmente excluir o registro?"))
        return;

    var tr = $(this).closest('tr'),
        id = tr.attr("data-id"); 0,

            localSt = localSt.filter(function (obj) {
                return obj.ID != id;
            });

    localStorage.setItem("tbCadastros", JSON.stringify(localSt));
    tr.remove();
    $("#imgPesquisa").removeAttr('src')
});

// -------------- BOTÃO EDITA CADASTROS ----------------
$("#tabelaNomes").on("click", "button[data-edit]", function () {
    $("#fieldNovoCadastro").slideDown(200);
    $("#legendField").text("Editar Cadastro");

    trEdicao = $(this).closest('tr');
    var id = trEdicao.attr("data-id"),
        obj = localSt.filter(function (item) {
            return item.ID == id;
        })[0];
    if (id == obj.ID) {
        $("#exibeImg").attr('src', obj.IMG);
    }

    if (!obj) {
        console.log("Cadastro nao encontrado para edição");
    }

    $("#txtNome").val(obj.Nome);
    $("#cpf").val(obj.CPF);
    $("#exibeImg").show();
})

// ---------- FECHA FIELDSET NOVO CADASTRO ------------
$("#fechaGridCadas").on("click", function () {
    $("#fieldNovoCadastro").slideUp(200);
})

$("#limpaForm").on("click", function () {
    $("#txtBusca").val("");
    $("#txtNome").val("");
    localStorage.clear(localSt);
    location.reload();
})

//----------- CONVERTE IMG EM BASE64 ---------------
function getBase64(file, callback) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (img) {
        url = reader.result;
        $("#exibeImg").attr('src', url);
        if (typeof callback === "function")
            callback(url);
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
    trEdicao = null;
    $("#legendField").text("Novo Cadastro");
    $("#legendPesquisa").text("Lista de Cadastros")
    $("#txtNome, #cpf").val("");
    $("#exibeImg").removeAttr('src');
    $("#imgPesquisa").hide();
    // $("#exibeImg").hide();
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
