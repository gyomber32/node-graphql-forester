import authResolver from './auth';
import treeResolver from './tree';
import seedlingResolver from './seedling';
import seedResolver from './seed';

const rootResolvers = {
    ...authResolver,
    ...treeResolver,
    ...seedlingResolver,
    ...seedResolver,
};

export default rootResolvers;