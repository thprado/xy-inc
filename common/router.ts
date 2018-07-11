import * as restify from 'restify'
import { NotFoundError } from 'restify-errors'

export abstract class Router {
	abstract applyRoutes(application: restify.Server)

	render(response: restify.Response, next: restify.Next) {
		return (document) => {
			if (document) {
				response.json(document)
			} else {
				throw new NotFoundError('Document not found')
			}
			return next()
		}
	}
}