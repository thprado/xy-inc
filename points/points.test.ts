import 'jest'
import * as request from 'supertest'
import { Server } from '../server/server'
import { environment } from '../common/environment'
import { Point } from './points.model'
import { pointsRouter } from './points.router'

let address: string
let server: Server

const initValues = [
	{ name: "Lanchonete",	coordinates: [27, 12]},
	{ name: "Posto",		coordinates: [31, 18]},
	{ name: "Joalheria", 	coordinates: [15, 12]},
	{ name: "Floricultura", coordinates: [19, 21]},
	{ name: "Pub",			coordinates: [12, 8]},
	{ name: "Supermercado", coordinates: [23, 6]},
	{ name: "Churrascaria", coordinates: [28, 2]}
]

const registerValid = {
	name: 'Banco',
	coordinates: [15, 20]
}

const pointInvalidName = {
	name: '',
	coordinates: [1, 5]
};

const pointInvaliCoord_1 = {
	name: 'Some Place',
	coordinates: [-5, -10]
};

const pointInvalidCoord_2 = {
	name: 'Some Place too',
	coordinates: ['string one', 'string two']
}

const pointInvalidCoord_3 = {
	name: 'Some Place too',
	coordinates: [-5, 1]
}

const pointInvalidCoord_4 = {
	name: 'Some Place too',
	coordinates: [1, -5]
}

const pointInvalidCoord_5 = {
	name: 'Some Place too',
	coordinates: []
}

const expectedResult = [
	{ name: 'Lanchonete', 	coordinates: [27,12]},
	{ name: 'Joalheria', 	coordinates: [15,12]},
	{ name: 'Pub', 			coordinates: [12,8]},
	{ name: 'Supermercado', coordinates: [23,6]}
]

beforeAll(() => {
	environment.db.url = process.env.DB_URL || 'mongodb://localhost/db-test'
	environment.server.port = process.env.SERVER_PORT || 3001
	address = `http://localhost:${environment.server.port}`
	server = new Server()
	return server.bootstrap([pointsRouter])
		.then(() =>
			Point.remove({}).exec()			
		).then(() => 
			Point.insertMany(initValues)
		)
		.catch(console.error)
})

test('Testing string values on coordinate', () => {
	return request(address)
		.post('/points')
		.send(pointInvalidCoord_2)
		.then(response => {
			expect(response.status).toBe(400)
		})
		.catch(fail)
})

test('Valid point insertion - Bank', () => {
	return request(address)
		.post('/points')
		.send(registerValid)
		.then(response => {
			expect(response.status).toBe(200)
			expect(response.body._id).toBeDefined()
			expect(response.body.name).toEqual(registerValid.name)
			expect(response.body.coordinates).toEqual(registerValid.coordinates)
		})
		.catch(fail)
})

test('Testing negative values in coordinates - #1', () => {
	return request(address)
		.post('/points')
		.send(pointInvaliCoord_1)
		.then(response => {
			expect(response.status).toBe(400)
		})
		.catch(fail)
})

test('Testing negative values in coordinates - #2', () => {
	return request(address)
		.post('/points')
		.send(pointInvalidCoord_3)
		.then(response => {
			expect(response.status).toBe(400)
		})
		.catch(fail)
})

test('Testing negative values in coordinates - #3', () => {
	return request(address)
		.post('/points')
		.send(pointInvalidCoord_4)
		.then(response => {
			expect(response.status).toBe(400)
		})
		.catch(fail)
})

test('Creating a new register without a coordinate valid', () => {
	return request(address)
		.post('/points')
		.send(pointInvalidCoord_5)
		.then(response => {
			expect(response.status).toBe(400)
		})
		.catch(fail)
})

test('Creating a new register without name', () => {
	return request(address)
		.post('/points')
		.send(pointInvalidName)
		.then(response => {
			expect(response.status).toBe(400)
		})
		.catch(fail)
})

test('Testing a invalid route', () => {
	return request(address)
		.get('/points/aaaaa')
		.then(response => {
			expect(response.status).toBe(404)
		})
		.catch(fail)
})

test('Getting the list of all registers', () => {
	return request(address)
		.get('/points')
		.then(response => {
			expect(response.status).toBe(200)
			expect(response.body).toBeInstanceOf(Array)
		})
		.catch(fail)
})

test('Testing the nearest point based in some values', () => {
	return request(address)
		.get('/near/?x=20&y=10&distance=10')
		.then(response => {
			expect(response.status).toBe(200)
			expect(response.body.map(a => a.name).sort()).toEqual(expectedResult.map(a => a.name).sort())
			expect(response.body).toBeInstanceOf(Array)
			expect(response.body).toHaveLength(4)			
		})
		.catch(fail)
})

afterAll(() => {
	return server.shutdown()
})