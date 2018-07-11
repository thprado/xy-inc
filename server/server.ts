import { handleError } from './error.handler';
import { environment } from './../common/environment';
import * as restify from 'restify'
import { Router } from '../common/router'
import * as mongoose from 'mongoose'

export class Server {

	application: restify.Server

	// - Connect with the database
	initializeDb(): mongoose.MongooseThenable {
		// - Workaround to typescript fix function deprecated
		(<any>mongoose).Promise = global.Promise
		return mongoose.connect(environment.db.url, {
			useMongoClient: true
		})
	}

	// - Initializing the routes
	initRoutes(routers: Router[]): Promise<any>{
		return new Promise((resolve, reject) => {
			try {
				this.application = restify.createServer({
					name: 'xy-inc',
					version: '1.0.0'
				})

				// - Parse parameters of URL
				this.application.use(restify.plugins.queryParser())
				// - Parse buffer to object JSON
				this.application.use(restify.plugins.bodyParser())

				// - Listen the Server
				this.application.listen(environment.server.port, () => {
					resolve(this.application)
				})

				// - Registering the treatment of errors
				this.application.on('restifyError',handleError)

				// - Routes
				for (let router of routers) {
					router.applyRoutes(this.application)
				}
			} catch (error) {
				reject(error);
			}
		})
	}

	bootstrap(routers: Router[] = []): Promise<Server>{
		return this.initializeDb().then(() =>
			this.initRoutes(routers).then(() => this)
		)
	}

	shutdown() {
		return mongoose.disconnect().then(()=>this.application.close())
	}
}