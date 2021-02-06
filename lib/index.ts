// @ts-ignore
import * as ldflex from 'ldflex';
import allHandlers from './handlers/allHandlers';

// const __PathFactory = _PathFactory as any;

const defaultHandlers = Object();
Object.assign(defaultHandlers, allHandlers);
Object.assign(defaultHandlers, ldflex.defaultHandlers);

export {
  defaultHandlers,
};

export * from './handlers/IterableMethodsHandler';

// export class PathFactory extends __PathFactory {
//   constructor(settings, data?) {
//     console.log('the handlers being applied are', defaultHandlers)
//     super({ handlers: defaultHandlers, ...settings }, data);
//     // return new _PathFactory({ handlers: defaultHandlers, ...settings }, data);
//   }
// }

// class MyPathFactory {
//   // eslint-disable-next-line no-unused-vars
//   public create(settings: any): any {}

//   constructor(settings, data) {
//     return new _PathFactory({
//       handlers: MydefaultHandlers, ...settings,
//     }, data);
//   }
// }

// export default {
//   ...allHandlers,
//   defaultHandlers: MydefaultHandlers,
//   PathFactory: MyPathFactory,
// };
