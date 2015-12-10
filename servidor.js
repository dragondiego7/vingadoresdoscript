// Variavel "app" que irá ter os dados do servidor
var app = require("http").createServer();

// Variavel "io" com os dados do socket.io que permite a comunição servidor cliente
var io = require("socket.io")(app);

// Array que ira armazena as conexões no servidor
var usuariosOnline = {};
var usuariosOnlineCompleto = {};

// Porta de conexão utilizada no servidor
app.listen(3000);

// Evento de conexão, chamado quando um cliente acessar a url do servidor
io.on('connection', function(socket) {
	// Retorna para o usuario que acabou de se conectar, a lista de usuarios cadastrados
	socket.emit('recebeLista', usuariosOnline);
	
	// Evento de presença para adicionar o cliente conectado na lista de clientes conectados no servidor
	socket.on('presence', function(usuario){
		// Adiciona um atributo ao objeto de conexão com os dados do cliente que se conectou
		socket.usuario = usuario;
		
		// Adiciona o cliente que se conectou a lista de clientes conectados no servidor
		usuariosOnline[usuario.id] = usuario.login;
		
		usuariosOnlineCompleto[usuario.id] = {
			login: usuario.login,
			para: socket
		}
		
		//["login"] = usuario.login;
		//usuariosOnlineCompleto[usuario.id]["socket"] = socket;
		
		// Emite para todos os clientes conectados no servidor a informação de conexão do novo cliente.
		socket.broadcast.emit('presence', {
			id: socket.usuario.id,
			login: socket.usuario.login
		});
	});
	
	// Função de envio de mensagem
	socket.on('mensagem', function(pacote){
		var de = usuariosOnlineCompleto[pacote.idUsuario].login;
		var para = usuariosOnlineCompleto[pacote.idEnvio].para;
		var mensagem = pacote.mensagem;
		para.emit('recebeMensagem', { de: de, mensagem: mensagem });
	});
	
	// Função para quando um cliente perde a conexão removelo da listagem de usuários online e informar os outros clientes
	socket.on('disconnect', function(){
		delete usuariosOnline[socket.usuario.id];
		delete usuariosOnlineCompleto[socket.usuario.id];
		socket.broadcast.emit('removeLista', socket.usuario.id);
	});
});