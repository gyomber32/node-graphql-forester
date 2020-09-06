import authResolver from './auth';
import treeResolver from './tree';
import seedlingResolver from './seedling';
import seedResolver from './seed';
import migrate from "./migrate";

const rootResolvers = {
    ...authResolver,
    ...treeResolver,
    ...seedlingResolver,
    ...seedResolver,
    ...migrate
};

export default rootResolvers;