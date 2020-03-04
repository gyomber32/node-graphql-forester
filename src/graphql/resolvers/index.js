const authResolver = require('./auth');
const plantingResolver = require('./planting');

const rootResolvers = {
    ...authResolver,
    ...plantingResolver
}

export default rootResolvers;