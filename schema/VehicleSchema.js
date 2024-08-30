const { Schema, model } = require('mongoose')
const VehicleSchema = new Schema({
    plate: {
        type: String,
        minLength: 2,
        maxLength: 6,
        unique: true,
        required: true
    }
})