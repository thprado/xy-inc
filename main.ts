import { pointsRouter } from './points/points.router';
import { Server } from './server/server'

const server = new Server();
server.bootstrap([pointsRouter]).then(server => {
	console.log('Server is listening on:', server.application.address())
}).catch(error => {
	console.log('Server failed to start')
	console.error(error)
	process.exit(1)
})