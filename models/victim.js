const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Victim = new Schema({
    name: String,
    need: String,
    members: Number,
    address: String,
	location: {
        lat: Number,
        long: Number
    },
    data: Date
});

module.exports = mongoose.model('Victim', Victim);
