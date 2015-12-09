$(document).ready(function(){
	var mensagem = "";
	
	var listaUsuarios = "";
	
	var conn = io.connect('http://localhost:3000');
	
	conn.on('connect', function(){
		conn.emit('presence', usuario);
		
		conn.on('presence', function(usuario){
			$(".lista-usuarios").append("<div id='conversa' element-id='" + usuario.id + "'>" + usuario.login + "</div><br />");
		});
		
		conn.on('recebeLista', function(usuarios){
			$.each(usuarios, function(id, login){
				$(".lista-usuarios").append("<div id='conversa' element-id='" + id + "'>" + login + "</div><br />");
			})
		});
		
		conn.on('removeLista', function(usuario){
			removeUsuarioLista(usuario.id);
		});
		
		conn.on('mensagem', function(mensagem){
			$(".lista-mensagem").append(mensagem.login + ": " + mensagem.mensagem + "<br /><br />");
		});
	});
	
    $("#enviar").click(function(){
    	mensagem = $("#mensagem").val();
    	$(".lista-mensagem").append("Eu: " + mensagem + "<br /><br />");
    	
    	var pacote = {
				id: 3,
				mensagem: mensagem
		};
		
    	conn.emit('mensagem', mensagem);
    });
    
    $("#conversa").click(function(){
    	var idEnvia = this.attr("element-id");
    	
    	console.log(idEnvia + " teste");
    	
    });
    
    function removeUsuarioLista(id){
    	console.log("ID " + id);
    	$("[element-id = '" + id + "']").remove();
    }
});