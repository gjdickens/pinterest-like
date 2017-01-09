import Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

const Pic = new Schema({
    title: String,
    image_url: String,
    username: String,
    timestamp: Date,
    likes: Array,
    imgHeight: String
});

module.exports = Mongoose.model('Pic', Pic);
