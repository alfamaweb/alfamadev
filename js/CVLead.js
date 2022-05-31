
function validarCampos(form, campos) {
    var retorno = true;
    Object.values(campos).forEach(function(val) {
        if(form[val].value == null || form[val].value == '') {
            retorno =  false;
        }
    });
    return retorno;
}

function montarDados(form, campos) {
    var json = {};
    Object.values(campos).forEach(function(val) {
        json[val] = form[val].value;
    });

    json['origem'] = 'SI';
    json['acao'] = 'salvar_editar';

    return JSON.stringify(json);
}

var CVLead = function (cliente, token, campos) {
    var mapear = function (campos) {
        var campos,
            formulario = function () {
                var f = document.querySelector('form');
                if (f == null) {
                    console.warn("CVLeads: Nenhum formulario encontrado");
                    return false;
                }
                return f;
            },
            submit = function () {
                var s = document.querySelector('input[type="submit"], button');
                if (s == null) {
                    console.warn("CVLeads: Nenhum botao de submit encontrado");
                    return false;
                }
                return s;
            },inputs = function (campos) {
                var retornoInputs = true;
                    retornoInputs = formulario();
                    retornoInputs = submit();
                Object.values(campos).forEach(function(val) {
                    var i = document.querySelector('input[name="' + val + '"]');
                    if (i == null) {
                        console.warn("CVLeads: Nenhum input '" +  val + "' encontrado");
                        retornoInputs = false;
                    }
                });
                return retornoInputs;
            };

        return inputs(campos);
    }

    var integrar = function (form, campos, token) {
        if (validarCampos(form, campos)) {
            var formdata = montarDados(form, campos);
            var requestHeader = new Headers();
                requestHeader.append("token", token);
                requestHeader.append("Content-Type", "application/json");
            var requestOptions = {
                method: 'POST',
                headers: requestHeader,
                body : formdata,
            }
            const response = fetch(
                'https://' + cliente + '.cvcrm.com.br/api/cvio/lead', 
                requestOptions    
            )
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data.mensagem);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        }
    }

    if (mapear(campos)) {
        document.querySelector('input[type="submit"], button').addEventListener("click", function (e) {
            integrar(e.target.parentNode.form.elements, campos, token);
        });
    };
};