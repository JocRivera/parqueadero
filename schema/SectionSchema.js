const { Schema, model } = require('mongoose');
const SectionSchema = new Schema({

    number: {
        type: Number,
        max: 10,
        require: [true, 'field is required']

    },
    status: {
        type: String,
        enum: ['disponible', 'no disponible'],
        default: 'disponible'
    },
    plate: {
        type: String,
        maxLength: 6,
        default: ""

    },
    dateEntry: {
        type: Date,
        default: Date.now
    },
    dateExit: {
        type: Date,
        default: Date.now
    },
    pin: {
        type: String,

    }
})

SectionSchema.statics.incrementNumber = async function () {
    const lastCell = await this.findOne().sort({ number: -1 });
    return lastCell ? lastCell.number + 1 : 1;
};



const SectionModel = model('Section', SectionSchema, 'section');

module.exports = SectionModel;