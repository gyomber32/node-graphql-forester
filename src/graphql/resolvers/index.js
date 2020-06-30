const authResolver = require('./auth');
const treeResolver = require('./tree');
const seedlingResolver = require('./seedling');
const seedResolver = require('./seed');

const rootResolvers = {
    ...authResolver,
    ...treeResolver,
    ...seedlingResolver,
    ...seedResolver,
}

export default rootResolvers;