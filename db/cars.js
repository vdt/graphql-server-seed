import Mongoose from 'mongoose';

const CarSchema = Mongoose.Schema({
    name: {type: String, required: true, unique: true, index: true}
}, {collection : 'Car'});

const CarModel= Mongoose.model('Car', CarSchema);

export { CarModel };