import 'jest'
import * as request from 'supertest'
import { Server } from '../server/server'
import { environment } from '../common/environment'
import { Point } from './points.model'
import { pointsRouter } from './points.router'

let address: string
let server: Server
beforeAll(() => {
	environment.db.url = process.env.DB_URL || 'mongodb://localhost/db-test'
	environment.server.port = process.env.SERVER_PORT || 3001
	address = `http://localhost:${environment.server.port}`
	server = new Server()
	return server.bootstrap([pointsRouter])
		.then(() => Point.remove({}).exec())
		.catch(console.error)
})

test('post /points', () => {
	return request(address)
		.post('/points')
		.send({
			name: 'test1',
			coordinates: ['valor1','valor2']
		})
		.then(response => {
			expect(response.status).toBe(400)
		})
		.catch(fail)
})

test('post /points', () => {
	return request(address)
		.post('/points')
		.send({
			name: 'Another Test',
			coordinates: ['1','5']
		})
		.then(response => {
			expect(response.status).toBe(200)
			expect(response.body._id).toBeDefined()
		})
		.catch(fail)
})

test('post /points', () => {
	return request(address)
		.post('/points')
		.send({
			name: 'Another Test',
			coordinates: [0,5]
		})
		.then(response => {
			expect(response.status).toBe(400)
		})
		.catch(fail)
})

test('post /points', () => {
	return request(address)
		.post('/points')
		.send({
			name: 'test2',
			coordinates: [-4,-5]
		})
		.then(response => {
			expect(response.status).toBe(400)
		})
		.catch(fail)
})

test('post /points', () => {
	return request(address)
		.post('/points')
		.send({
			name: 'test3',
			coordinates: [-4,5]
		})
		.then(response => {
			expect(response.status).toBe(400)
		})
		.catch(fail)
})

test('post /points', () => {
	return request(address)
		.post('/points')
		.send({
			name: 'test4',
			coordinates: [4,-5]
		})
		.then(response => {
			expect(response.status).toBe(400)
		})
		.catch(fail)
})

test('post /points', () => {
	return request(address)
		.post('/points')
		.send({
			name: 'test2',
			coordinates: []
		})
		.then(response => {
			expect(response.status).toBe(400)
		})
		.catch(fail)
})

test('get /points/aaaaa -- ', () => {
	return request(address)
		.get('/points/aaaaa')
		.then(response => {
			expect(response.status).toBe(404)
		})
		.catch(fail)
})


test('get /points/bbbb -- ', () => {
	return request(address)
		.get('/points/aaaaa')
		.then(response => {
			expect(response.status).toBe(404)
		})
		.catch(fail)
})

afterAll(() => {
	return server.shutdown()
})