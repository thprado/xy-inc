import * as mongoose from 'mongoose'

export interface Point extends mongoose.Document {
	name: string,
	coordinates: [Number]
}

const PointsSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	coordinates: {
		type: [Number],
		index: '2d',
		required: true,
		validate: {
			validator: function (value) {
				if (Array.isArray(value) && value.length == 2 && !value.some(isNaN)) {
					for (let i = 0; i < value.length; i++) {
						if (value[i] < 0) {
							return false;
						}
					}
				} else {
					return false;
				}
				return true;
			},
			message: 'Its not a valid coordinate.'
		}
	}
});

export const Point = mongoose.model<Point>('points', PointsSchema);