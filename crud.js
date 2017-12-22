var trEdicao;
var nomeBuscado;
var indice_selecionado = +localStorage.index || 0;
var localSt = localStorage.getItem("tbCadastros");
var obj;
localSt = JSON.parse(localSt);
if (localSt == null)
    localSt = [];

var geraTr = function (obj) {
    var tr = $('<tr data-id="' + obj.ID + '"/>');
    tr.append("<td>" + obj.Nome + "</td>");
    tr.append("<td>" + obj.CPF + "</td>");
    tr.append("<td>" + (obj.Sexo == 1 ? "Homem" : "Mulher") + " </td>");
    tr.append("<td>" + (obj.Status == 1 ? "Ativo" : "Inativo") + "</td>");
    tr.append("<td><button data-remove class='buttons'>Excluir</button></td>");
    tr.append("<td><button data-edit class='buttons'>Editar</button></td>");
    tr.append("<td><img src='" + obj.IMG + "' class='resizeImgLista'></td>");
    return tr;
};
for (var i = 0; i < localSt.length; i++)
    $("#tabelaNomes").append(geraTr(localSt[i]));

// -------------- INSERIR CADASTRO ----------------
$("#enviar").on("click", function () {
    obj = {
        ID: trEdicao ? +trEdicao.attr("data-id") : ++indice_selecionado,
        Nome: $("#txtNome").val().trim(),
        CPF: $("#cpf").val(),
        Status: $(":radio[name=status]:checked").val(),
        Sexo: $("#comboGenero").val(),
    };
    var files = $("#uplImg")[0].files;
    if (!obj.Nome || !obj.CPF || !obj.Sexo || !obj.Status) {
        alert("Alguns campos obrigatórios nao foram preenchidos!!");
        return;
    }
    if (!files.length)
        setBase64($("#baseImg").val(), inseriEdita);
    else
        getBase64(files[0], inseriEdita);
});

function inseriEdita(url) {
    try {
        if (url == null) {
            obj.IMG = $("#baseImg").val();
            var tr = geraTr(obj);
            if (!trEdicao) {
                localSt.push(obj);
                localStorage.index = indice_selecionado + 1;
                $("#tabelaNomes").append(tr);
                $("#exibeImgTabela").attr('src', obj.IMG)
                location.reload(true);
            } else {
                files = url
                localSt = localSt.map(function (item) {
                    if (item.ID == obj.ID)
                        return obj;
                    return item;
                });
                trEdicao.html(tr.html());
                location.reload(true);
            }
        } else {
            obj.IMG = url;
            var tr = geraTr(obj);
            if (!trEdicao) {
                localSt.push(obj);
                localStorage.index = indice_selecionado + 1;
                $("#tabelaNomes").append(tr);
                $("#exibeImgTabela").attr('src', obj.IMG)
                location.reload(true);
            } else {
                files = url
                localSt = localSt.map(function (item) {
                    if (item.ID == obj.ID)
                        return obj;
                    return item;
                });
                trEdicao.html(tr.html());
                location.reload(true);
            }
        }
        localStorage.setItem("tbCadastros", JSON.stringify(localSt));
        $("#fieldNovoCadastro").slideUp(200);
        $("#txtNome, #cpf, #uplImg").val("");
    } catch (e) {
        alert("Falha ao salvar no localStorage: " + e);
    }
}

// ------------ PREVIEW DA IMAGEM ----------------
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#exibeImg').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}
$("#uplImg").on('change', function () {
    readURL(this);
});

// ----------- BUSCA DE CADASTROS -------------
function buscaCadastro() {
    // Variaveis 
    var td, i,
        txtBuscado = $("#txtBusca").val(),
        filter = txtBuscado.toLowerCase(),
        tabela = document.getElementById("tabelaNomes"),
        tr = tabela.getElementsByTagName("tr");

    // Faz um loop nas tr's da tabela e esconde as que nao batem com o filter
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
      
        if (td) {
            if (td.innerHTML.toLowerCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

// ----------- BOTÃO REMOVE CADASTROS --------------
$("#tabelaNomes").on("click", "button[data-remove]", function () {
    if (!confirm("Você deseja realmente excluir o registro?"))
        return;

    var tr = $(this).closest('tr'),
        id = tr.attr("data-id");

    localSt = localSt.filter(function (obj) {
        return obj.ID != id;
    });

    localStorage.setItem("tbCadastros", JSON.stringify(localSt));
    tr.remove();
    $("#exibeImg").removeAttr('src')
    $("#txtNome,#txtBusca").val("");
    $("#cpf").val("");
    $("#fieldNovoCadastro").slideUp(200);
    location.reload(true)
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

    $("#baseImg").val(obj.IMG);

    if (id == obj.ID) {
        $("#exibeImg").attr('src', obj.IMG);
        $("#comboGenero").val(obj.Sexo);
        $(":radio[name=status][value=" + obj.Status + "]").prop("checked", true);
    }

    if (!obj) {
        console.log("Cadastro nao encontrado para edição");
    }
    $("#txtNome").val(obj.Nome);
    $("#cpf").val(obj.CPF);
    $("#exibeImg").show();
});

// ---------- FECHA FIELDSET NOVO CADASTRO ------------
$("#fechaGridCadas").on("click", function () {
    $("#fieldNovoCadastro").slideUp(200);
});

$("#limpaForm").on("click", function () {
    $("#txtBusca").val("");
    $("#txtNome").val("");
    localStorage.clear(localSt);
    location.reload();
});

//----------- FUNÇAO CONVERTE IMG EM BASE64 ---------------
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
};

function setBase64(file, callback) {
    $("#exibeImg").attr('src', file);
    callback();
};

// ------------ BOTÃO NOVO CADASTRO -------------
$("#novoCadas").click(function () {
    trEdicao = null;
    $("#legendField").text("Novo Cadastro");
    $("#legendPesquisa").text("Lista de Cadastros")
    $("#txtNome, #cpf").val("");
    $("#exibeImg").removeAttr('src');
    $("#radioAtivo").prop("checked", true);
    $("#comboGenero").val(1);
    $("#fieldNovoCadastro").slideDown(200);
});


// .val() pega o valor do combo
//.text() pega o texto do combo

//-------------------- AREA DE MASCARAS DE INPUTS ----------------------
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

function mascara(o, f) {
    v_obj = o
    v_fun = f
    setTimeout("execmascara()", 1)
}
function execmascara() {
    v_obj.value = v_fun(v_obj.value)
}
function soLetras(v) {
    return v.replace(/\d/g, "") //Remove tudo o que não é Letra
}
//--------------------- MASCARAS NÃO UTILIZADAS -----------------
// function soLetrasMA(v) {
//     v = v.toUpperCase() //Maiúsculas
//     return v.replace(/\d/g, "") //Remove tudo o que não é Letra ->maiusculas
// }
// function soLetrasMI(v) {
//     v = v.toLowerCase() //Minusculas
//     return v.replace(/\d/g, "") //Remove tudo o que não é Letra ->minusculas
// }
// function soNumeros(v) {
//     return v.replace(/\D/g, "") //Remove tudo o que não é dígito
// }function soNumeros(v) {
//     return v.replace(/\D/g, "") //Remove tudo o que não é dígito
// }
