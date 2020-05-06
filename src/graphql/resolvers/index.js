const authResolver = require('./auth');
const seedlingResolver = require('./seedling');
const seedResolver = require('./seed');

const rootResolvers = {
    ...authResolver,
    ...seedlingResolver,
    ...seedResolver
}

export default rootResolvers;