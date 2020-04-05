var api_estado_url="https://servicodados.ibge.gov.br/api/v1";
var api_ondeAchar_url="https://covid19-onde-achar.herokuapp.com";

function createProduto(){
    var produto = {
        id: $("#idProduto").val(),
        descricao: $("#nomeProduto").val(),
    };

    console.log(JSON.stringify(produto));

    var request = $.ajax({
        type: "POST",
        contentType: 'application/json',
        url: api_ondeAchar_url+"/produtos",
        data: JSON.stringify(produto)
      });

    request.done(function( msg ) {
        toastr.success(msg, 'Produto cadastrado');
    });

    request.fail(function( jqXHR, status ) {
        toastr.error( "Não foi possível incluir o produto. Status: " + status, 'Erro ao inserir' );
    });
}

function carregaProdutos(){
    var exibeProdutos = $.get( api_ondeAchar_url+"/produtos", function(produtos) {
        $(".lista-produtos").remove();
        $.each(produtos, function(index, obj) {
            var linha = "<tr><td></td>"
            +"<td>"+obj.id+"</td>"
            +"<td>"+obj.descricao+"</td>"
            +"<td><i class='fa fa-edit' onclick='updateDoador("+obj.id+")'></i> <i class='fa fa-remove' onclick='removeProduto("+obj.id+")'></i></td>"
            +"</tr>";
            $(linha).appendTo("#lista-produtos");
        });
        if(produtos.length == 0){
            toastr.info('Nenhum produto encontrado!');}
        else{
            toastr.success("Qtd: "+produtos.length, 'Busca efetuada com sucesso!');
        }
    })
    .done(function() {
    })
    .fail(function() {
        toastr.error('Erro ao buscar a lista de produtos!');
    })
    .always(function() {
    });
}

function removeProduto(idProdutoRemover){
    var request = $.ajax({
            type: "DELETE",
            url: api_ondeAchar_url+"/produtos/"+idProdutoRemover,
          });

        request.done(function( msg ) {
            toastr.success(msg, 'Produto removido');
        });

        request.fail(function( jqXHR, status ) {
            toastr.error( "Não foi possível remover o produto. Status: " + status, 'Erro ao remover' );
        });
}

function createSolicitacao(){
    var solicitacao = {
          celular: $("#telefone").val(),
          cidade: $("#cidade").val(),
          cpf: $("#cpf").val(),
          email: $("#email").val(),
          necessidade: [
            {
              idProduto: $("#Produto").val(),
              mensagem: $("#Justificativa").val(),
            }
          ],
          nome: $("#nome").val(),
    };

    console.log(JSON.stringify(solicitacao));

    var request = $.ajax({
        type: "POST",
        contentType: 'application/json',
        url: api_ondeAchar_url+"/usuarios",
        data: JSON.stringify(solicitacao)
      });

    request.done(function( msg ) {
        toastr.success(msg, 'Solicitação cadastrada com sucesso');
    });

    request.fail(function( jqXHR, status ) {
        toastr.error( "Não foi possível incluir a solicitação. Status: " + status, 'Erro ao inserir' );
    });
}

function carregaSolicitacoes(){
    var exibeSolicitacoes = $.get( api_ondeAchar_url+"/usuarios", function(solicitacao) {
        $.each(solicitacao, function(index, obj) {
            var linha = "<tr><td></td>"
//            +"<td style="display: none;">"+obj.cpf+"</td>"
            +"<td>"+obj.nome+"</td>"
            +"<td>"+obj.celular+"</td>"
            +"<td>"+obj.email+"</td>"
            +"<td>"+obj.cidade+"</td>"
            +"<td>"+obj.necessidade[0].idProduto+"</td>"
            +"<td>"+obj.necessidade[0].mensagem+"</td>"
            +"<td><i class='fa fa-edit' onclick='updateSolicitacao("+obj.id+")'></i> <i class='fa fa-remove' onclick='removeSolicitacao("+obj.id+")'></i></td>"
            +"</tr>";
            $(linha).appendTo("#lista-ajude");
        });
        if(produtos.length == 0){
            toastr.info('Nenhum produto encontrado!');}
        else{
            toastr.success("Qtd: "+produtos.length, 'Busca efetuada com sucesso!');
        }
    })
    .done(function() {
    })
    .fail(function() {
        toastr.error('Erro ao buscar a lista de produtos!');
    })
    .always(function() {
    });
}

function hide(){
    $(".conteudo").hide();
}

function menu(){
    $(".menu.nav-link").on('click',function(){
        hide();
        var item = $(this).attr("href");
        $(item).show();
        $(item).trigger('ready');
    });
}


$(document).ready(function(){
    menu();
    
    $.get(api_estado_url+"/localidades/estados",function(estados){
        estados.sort(function (a, b) {
            if (a.sigla > b.sigla) return 1;
            if (a.sigla < b.sigla) return -1;
            return 0;
        });
        $.each(estados, function(index, obj) {
            $("<option data-id=\""+obj.id+"\" value=\""+obj.id+"\">"+obj.sigla+" - "+obj.nome+"</option>").appendTo("#UF");
            $("<option data-id=\""+obj.id+"\" value=\""+obj.id+"\">"+obj.sigla+" - "+obj.nome+"</option>").appendTo("#FiltraUF");
        });
    });

    $.get(api_ondeAchar_url+"/produtos", function(produtos){
        $.each(produtos, function(index, obj) {
            $("<option data-id=\""+obj.id+"\" value=\""+obj.id+"\">"+obj.id+" - "+obj.descricao+"</option>").appendTo("#Produto");
            $("<option data-id=\""+obj.id+"\" value=\""+obj.id+"\">"+obj.id+" - "+obj.descricao+"</option>").appendTo("#FiltraProduto");
        });
    });

    $("body").on("change","#UF", function(obj){
        var uf = $("#UF").find(":selected").data("id");
        $(".cidade").remove();
        $.get(api_estado_url+"/localidades/estados/"+uf+"/municipios",function(cidades){
            $.each(cidades, function(index, obj) {
                $("<option class='cidade' value=\""+obj.id+"\">"+obj.nome+"</option>").appendTo("#cidade");
            });
        });
    });
    
    $("body").on("change","#FiltraUF", function(obj){
        var uf = $("#FiltraUF").find(":selected").data("id");
        $(".cidade").remove();
        $.get(api_estado_url+"/localidades/estados/"+uf+"/municipios",function(cidades){
            $.each(cidades, function(index, obj) {
                $("<option class='cidade' value=\""+obj.id+"\">"+obj.nome+"</option>").appendTo("#FiltraCidade");
            });
        });
    });


    $("body").on("click","#buscaSolicitacoes",function(){
        carregaSolicitacoes($("#FiltraProduto").val(),$("#FiltraUF").val(),$("#FiltraCidade").val());
    });

    toastr.options = {
        "positionClass": "toast-top-right",
      };
});
