import NodeCache from "node-cache";

const STORAGE_KEY = "storage";

const globalProperties = Object.getOwnPropertyNames(global);
const alreadyExists: boolean = (globalProperties.indexOf(STORAGE_KEY) > -1);

export interface StorageInterface {
  cache: NodeCache;
};

let storageInstance: StorageInterface;

if (!alreadyExists){
  storageInstance = {
    cache: new NodeCache()
  };
  Object.defineProperty(global, STORAGE_KEY, {
    get: function(): StorageInterface {
      return storageInstance;
    }
  });
  Object.freeze(storageInstance);
} else {
  storageInstance = (global as NodeJS.Global)[STORAGE_KEY];
}
export default storageInstance;