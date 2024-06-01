import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { Server } from "socket.io";
import { CheckCyberBullying, type Analysis, type Conversation } from './src/lib/index';

export default defineConfig({
	plugins: [
		sveltekit(),
		{
			name: 'socket-io',
			configureServer(server) {

				const io = new Server(server.httpServer!);

				const conversation: Conversation[] = [];
				const bullyingResponse: Analysis[] = [];

				io.on('connection', (socket) => {
					console.log('a user connected');
					io.emit('eventFromServer', conversation);
					console.log(bullyingResponse.length);
					io.emit('bullyingResponse', bullyingResponse);

					socket.on('eventFromClient', (msg: Conversation) => {
						conversation.push(msg);
						io.emit('eventFromServer', msg);

						CheckCyberBullying(conversation, {
							type: 'contextual',
							targetType: 'general'
						}).then(res => {
							console.log(res);
							if (res.result.response) {
								bullyingResponse.push(res.result.response);

								io.emit('bullyingResponse', bullyingResponse);
							}
						});
					});

					socket.on('disconnect', () => {
						console.log('user disconnected');
					});
				});
			}
		}]
});
