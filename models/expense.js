const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    income: {
        type: Number,
        defaultValue: 0
    },
    expense: {
        type: Number,
        defaultValue: 0
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Expense', expenseSchema)
