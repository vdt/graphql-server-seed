import {TrainModel} from '../../db/trains'
import logger from '../../core/logger/app-logger'
import { pubsub } from '../subscriptions/subscriptions'

const resolveFunctions = {
    Query: {
        train (_, {name}){
            let where = {};
            if (name != undefined) {
                Object.assign(where, {name: name})
            }
            return TrainModel.find(where, (err, trains) => {
                if (err) {
                    logger.error("Error- ", err);
                }
            })
        }

    },
    Mutation: {
        updateTrain (_, {id, name, speed, diesel}) {
            let where = {};
            let updateDocument = {};
            Object.assign(where, {_id: id});
            if(name) {
                Object.assign(updateDocument, {name});
            }
            if(speed) {
                Object.assign(updateDocument, {speed});
            }
            if(diesel !== undefined) {
                Object.assign(updateDocument, {diesel});
            }
            TrainModel.findOneAndUpdate(where, {$set:updateDocument} , {upsert : true}, (err, trains) => {
                if(err) {
                    logger.error('Got error - ' , err);
                }
                pubsub.publish('trainUpdated', trains);
                return trains
            })
        },

        addTrain (_, {name, speed, diesel}) {
            let newTrain = new TrainModel({name, speed, diesel})
            newTrain.save((err, savedTrain) => {
                if(err) {
                    logger.error('Got error - ', err)
                }
                pubsub.publish('trainAdded', savedTrain);
                return savedTrain;
            })
        },
        deleteTrain(_, {name}) {
            let where = {};
            Object.assign(where, {name: name});
            TrainModel.findOneAndRemove(where, (err, deleted) => {
                if (err) {
                    logger.error('Got error - ', err);
                }
                logger.info('Removed train- ', deleted.name);
                pubsub.publish('trainDeleted', deleted);
                return deleted;
            })
        }
    },
    Subscription: {
        trainUpdated(train) {
            return train
        },
        trainAdded(train) {
            return train
        },
        trainDeleted(train) {
            return train
        }
    }
};

export default resolveFunctions;