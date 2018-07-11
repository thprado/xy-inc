import * as restify from 'restify'

export const handleError = (req: restify.Request, resp: restify.Response, err, done) => {
	err.toJSON = () => {
		return {
			message: err.message
		}
	}

	switch (err.name) {
		case 'MongoError':
			if (err.code == 11000) {
				err.statusCode = 400
			}
			break
		case 'ValidationError':
			err.statusCode = 400
			// - Iterating in errors messages
			const messages: any[] = []
			for (let name in err.errors) {
				messages.push({message: err.errors[name].message});
			}
			// - Overwrite the toJSON method in this case
			err.toJSON = () => ({
				errors: messages
			})
			break
	}
	done()
}