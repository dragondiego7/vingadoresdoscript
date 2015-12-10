function selecionaUsuario(idEnvia){
	$("#idEnvio").val(idEnvia);
};

function removeUsuarioLista(id){
	$("[element-id = '" + id + "']").remove();
}

$(document).ready(function(){
	var mensagem = "";
	
	var listaUsuarios = "";
	
	var conn = io.connect('http://localhost:3000');
	
	conn.on('connect', function(){
		conn.emit('presence', usuario);
		
		conn.on('presence', function(usuario){
			$(".lista-usuarios").append("<div onclick='selecionaUsuario(" + usuario.id + ")'>" + usuario.login + "</div><br />");
		});
		
		conn.on('recebeLista', function(usuarios){
			$.each(usuarios, function(id, login){
				if(usuario.id != id){
					$(".lista-usuarios").append("<div onclick='selecionaUsuario(" + id + ")'>" + login + "</div><br />");
				}
			})
		});
		
		conn.on('removeLista', function(idUsuario){
			removeUsuarioLista(idUsuario);
		});
		
		conn.on('mensagem', function(mensagem){
			$(".lista-mensagem").append(mensagem.de + ": " + mensagem.mensagem + "<br /><br />");
		});
	});
	
    $("#enviar").click(function(){
    	var idEnvio = $("#idEnvio").val();
    	
    	if(idEnvio != ""){
	    	mensagem = $("#mensagem").val();
	    	$(".lista-mensagem").append("Eu: " + mensagem + "<br /><br />");
	    	
	    	var pacote = {
				id: idEnvio,
				mensagem: mensagem
			};
			
	    	conn.emit('mensagem', pacote);
    	} else {
    		alert("Selecione para quem vai mandar essa mensagem!");
    	}
    });
});