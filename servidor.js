// Variavel "app" que irá ter os dados do servidor
var app = require("http").createServer();
// Variavel "io" com os dados do socket.io que permite a comunição servidor cliente
var io = require("socket.io")(app);
// Array que ira armazena as conexões no servidor
var usuariosOnline = {};

// Porta de conexão utilizada no servidor
app.listen(3000);

// Evento de conexão, chamado quando um cliente acessar a url do servidor
io.on('connection', function(socket) {
	// Evento de presença para adicionar o cliente conectado na lista de clientes conectados no servidor
	socket.on('presence', function(usuario){
		// Adiciona um atributo ao objeto de conexão com os dados do cliente que se conectou
		socket.usuario = usuario;
		// Adiciona o cliente que se conectou a lista de clientes conectados no servidor
		usuariosOnline[usuario.id] = usuario.login;
		
		// Emite para todos os clientes conectados no servidor a informação de conexão do novo cliente.
		socket.broadcast.emit('presence', {
			id: socket.usuario.id,
			login: socket.usuario.login
		});
	});
	
	// Retorna para o usuario que acabou de se conectar, a lista de usuarios cadastrados
	socket.emit('recebeLista', usuariosOnline);
	
	socket.on('mensagem', function(mensagem){
		var outro = {
			mensagem: mensagem
		};
		socket.emit('mensagem', outro);
	});
	
	socket.on('disconnect', function(){
		/*
		if(usuario.socket == socket){
			delete usuariosOnline[usuario.id];
			socket.broacast('removeLista', usuario.id);
		}
		*/
		console.log('Desconectou');
	});
});