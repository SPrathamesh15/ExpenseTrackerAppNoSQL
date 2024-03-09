const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const { v4: uuidv4 } = require('uuid');

const forgotPasswordSchema = new Schema({
    id: {
        type: Schema.Types.UUID,
        required: true,
        default: uuidv4
    },
    isActive: {
        type: Boolean,
        default: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('ForgotPasswordRequest', forgotPasswordSchema)

// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const { v4: uuidv4 } = require('uuid');

// const ForgotPasswordRequest = sequelize.define('forgotPasswordRequest', {
//     id: {
//         type: Sequelize.UUID,
//         defaultValue: Sequelize.UUIDV4,
//         allowNull: false,
//         primaryKey: true,
//     },
//     isActive: {
//         type: Sequelize.BOOLEAN,
//         defaultValue: false,
//     }
// });

// module.exports = ForgotPasswordRequest;
