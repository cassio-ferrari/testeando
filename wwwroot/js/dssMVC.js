var dssMVC = window.dssMVC = {

    InicializarComponentes: function()
    {
        $('[data-toggle="tooltip"]').tooltip();

        $('[data-default]').each(function () {
            var vSeletor = $(this).data("default");
            $(this).find("input").not(vSeletor).off("keydown").on("keydown", function (e) {
                if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
                    $(vSeletor).click();
                }
            });
        });

        $("input[data-val-maxlength-max]").each(function () {
            $(this).attr("maxlength", $(this).attr("data-val-maxlength-max"));
        });
    },


    AdicionarOverlay: function(aSeletor, aTexto) {
        var vDestino = $(aSeletor);
        aTexto = aTexto || "Carregando dados...";

        var vOverlay = $("<div>").addClass("dssOverlay").css({
            position: aSeletor == "body" ? "fixed" : "absolute",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000000,
            "background-color": "rgba(0,0,0,0.8)",
            color: "white",
            padding: "20px",
            "text-align": "center",
            display: "none"
        });

        $("<h2>").html(aTexto).appendTo(vOverlay);

        vOverlay.appendTo(vDestino.css("position", "relative")).fadeIn(300);

        return vDestino;
    },

    RemoverOverlay: function(aSeletor)
    {
        var vDestino = $(aSeletor);
        vDestino.find(".dssOverlay").fadeOut(300, function () { vDestino.find(".dssOverlay").remove() });
    },

    OpenModal: function (aParametros)
    {
        var vDivContainer = $("<div>").addClass("modal fade").attr("role", "dialog").on('hidden.bs.modal', function () { this.remove(); });
        if (aParametros.MarginTop)
            vDivContainer.addClass("mt-" + aParametros.MarginTop);

        var vDivModal = $("<div>").addClass("modal-dialog").attr("role", "document").appendTo(vDivContainer);
        if (aParametros.Tamanho)
            vDivModal.addClass("modal-" + aParametros.Tamanho);

        var vDivContent = $("<div>").addClass("modal-content").appendTo(vDivModal);

        if(aParametros.onClose)
            vDivContainer.on('hidden.bs.modal', function () { aParametros.onClose(); });

        if (aParametros.Titulo) {
            var vDivHeader = $("<div>").addClass("modal-header").appendTo(vDivContent);
            if (aParametros.ClasseTitulo)
                vDivHeader.addClass(aParametros.ClasseTitulo);
            $("<h5>").addClass("modal-title").html(aParametros.Titulo).appendTo(vDivHeader);
            $("<button>").attr("type", "button").addClass("close").attr("data-dismiss", "modal").html("&times;").appendTo(vDivHeader);
        }

        var vDivBody = $("<div>").addClass("modal-body").appendTo(vDivContent);
        if (aParametros.bodyId)
            vDivBody.attr("id", aParametros.bodyId);

        if (aParametros.Texto)
            $("<div>").html(aParametros.Texto).appendTo(vDivBody);

        var vDivFooter = $("<div>").addClass("modal-footer").appendTo(vDivContent);
        var tmpBotao;
        $.each(aParametros.Botoes || {}, function (aTexto, aParametrosBotao) {
            tmpBotao = $("<button>").attr("type", "button").addClass("btn").html(aTexto);
            if (aParametrosBotao.Glyphicon)
                $("<span>").addClass("glyphicon glyphicon-" + aParametrosBotao.Glyphicon).css("margin-right", "10px").prependTo(tmpBotao);

            if (aParametrosBotao.FontAwesome)
                $("<i>").addClass(aParametrosBotao.FontAwesome).css("margin-right", "10px").prependTo(tmpBotao);

            tmpBotao.addClass(aParametrosBotao.Classe || "btn-default");

            if (aParametrosBotao.id)
                tmpBotao.attr("id", aParametrosBotao.id);

            if (aParametrosBotao.Callback)
                tmpBotao.on('click', aParametrosBotao.Callback)

            tmpBotao.appendTo(vDivFooter);
        });
        var vBotaoFechar = $("<button>").attr("type", "button").addClass("btn").addClass(aParametros.ClasseBotaoFechar || "btn-secondary").attr("data-dismiss", "modal").html(aParametros.TextoBotaoFechar || "Fechar").appendTo(vDivFooter);
        if (aParametros.GlyphiconBotaoFechar)
            $("<span>").addClass("glyphicon glyphicon-" + aParametros.GlyphiconBotaoFechar).css("margin-right", "10px").prependTo(vBotaoFechar);
        if (aParametros.FontAwesomeBotaoFechar)
            $("<i>").addClass(aParametros.FontAwesomeBotaoFechar).css("margin-right", "10px").prependTo(vBotaoFechar);

        vDivContainer.appendTo("body").modal('show');

        if (aParametros.PartialView && aParametros.PartialView.Url)
        { 
            $("<div>").addClass("modal-loading text-info").html("Carregando - Aguarde...").appendTo(vDivBody);

            aParametros.PartialView.Dados = aParametros.PartialView.Dados || {};
            vDivBody.load(aParametros.PartialView.Url, aParametros.PartialView.Dados, function (response, status, xhr) {
                if (status == "error") {
                    vDivBody.empty();
                    vDivFooter.find("[data-dismiss!='modal']").remove();
                    $("<div>").addClass("text-danger").html("<strong>Erro " + xhr.status + "</strong>: " + xhr.statusText).appendTo(vDivBody);
                }

                if (aParametros.PartialView.onLoad)
                    aParametros.PartialView.onLoad();
            });
        }
    },

    Confirm: function (aParametros)
    {
        if ((aParametros == null) || (aParametros.Mensagem == null))
            return false;

        aParametros.Titulo = ('Titulo' in aParametros ? aParametros.Titulo : "Confirmação");
        aParametros.TextoBotaoTrue = ('TextoBotaoTrue' in aParametros ? aParametros.TextoBotaoTrue : "Sim");
        aParametros.TextoBotaoFalse = ('TextoBotaoFalse' in aParametros ? aParametros.TextoBotaoFalse : "Não");

        var vDivConfirm = $("<div>").addClass("modal fade").attr("role", "dialog").on('hidden.bs.modal', function () { this.remove(); });
        var vDivModal = $("<div>").addClass("modal-dialog modal-sm").appendTo(vDivConfirm);
        var vDivContent = $("<div>").addClass("modal-content").appendTo(vDivModal);

        var vDivHeader = $("<div>").addClass("modal-header").appendTo(vDivContent);
        $("<h4>").addClass("modal-title").html(aParametros.Titulo).appendTo(vDivHeader);

        var vDivBody = $("<div>").addClass("modal-body").appendTo(vDivContent);
        $("<p>").html(aParametros.Mensagem).appendTo(vDivBody);

        var vDivFooter = $("<div>").addClass("modal-footer").appendTo(vDivContent);
        var vBotaoTrue = $("<button>").attr("type", "button").addClass("btn").html(aParametros.TextoBotaoTrue).addClass(aParametros.ClasseBotaoTrue || "btn-success").appendTo(vDivFooter);
        vBotaoTrue.click(function () { vDivConfirm.DialogResult = true; vDivConfirm.modal("hide"); });
        var vBotaoFalse = $("<button>").attr("type", "button").addClass("btn").attr("data-dismiss", "modal").html(aParametros.TextoBotaoFalse).addClass(aParametros.ClasseBotaoFalse || "btn-danger").appendTo(vDivFooter);

        vDivConfirm.DialogResult = false;

        vDivConfirm.on("hidden.bs.modal", function (e) {
            if (aParametros.CallbackFunction)
                aParametros.CallbackFunction(vDivConfirm.DialogResult, aParametros.ExtraCallbackParams);
        });

        vDivConfirm.appendTo("body").modal('show');
    },

    Alert: function (aMensagem, aTitulo, aTextoBotao, aClasse, aOnClose)
    {
        var vTexto = $("<p>").html(aMensagem);
        var vClasseBotao = false;
        var vClasseTitulo = false;

        if (aClasse)
        {
            vClasseTitulo = "text-" + aClasse;
            vTexto.addClass(vClasseTitulo);
            vClasseBotao = "btn-" + aClasse;
        }

        dssMVC.OpenModal({
            Texto: vTexto,
            Titulo: aTitulo,
            ClasseTitulo: vClasseTitulo,
            TextoBotaoFechar: aTextoBotao || "OK",
            ClasseBotaoFechar: vClasseBotao,
            onClose: aOnClose
        });
    }

}

$(document).ready(function () {
    dssMVC.InicializarComponentes()
});

$(document).ajaxComplete(function () {
    dssMVC.InicializarComponentes()
})