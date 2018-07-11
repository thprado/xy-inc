import * as restify from 'restify'
import { NotFoundError } from 'restify-errors'

import { Router } from '../common/router'
import { Point } from './points.model'


class PointsRouter extends Router {
	applyRoutes(application: restify.Server) {
		// - List all registers
		application.get('/points', (req,resp,next) => {
			Point.find()
				.then(this.render(resp, next))
				.catch(next)
		})

		// - List by Id
		application.get('/points/:id', (req, resp, next) => {
			if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
				Point.findById(req.params.id)
					.then(this.render(resp, next))
					.catch(next)
			} else {
				resp.send(404)
			}
		})

		// - Find the nearest points
		application.get('/near/', (req,resp,next) => {
			Point.find({
				coordinates: {
					$geoWithin: {
						$center: [[req.query.x, req.query.y], req.query.distance],
					},
				},
			}, 'name coordinates -_id').exec()
				.then(this.render(resp, next))
				.catch(next);
		})

		// - Save new Poi
		application.post('/points', (req, resp, next) => {
			// - Instance the Model
			let point = new Point(req.body);
			point.save()
				.then(this.render(resp, next))
				.catch(next)
		})

		// - Update some Poi
		application.put('/points/:id', (req, resp, next) => {
			// - Tell to Mongoose, you want overwrite that document
			const options = { overwrite: true }
			// - Do the update
			Point.update({ _id: req.params.id }, req.body, options)
				.exec().then(result => {
					if (result.n) {
						// - Return the object updated
						return Point.findById(req.params.id)
					} else {
						throw new NotFoundError('Document not found')
					}
				})
				.then(this.render(resp, next))
				.catch(next)
				
		})
	}
}

export const pointsRouter = new PointsRouter()