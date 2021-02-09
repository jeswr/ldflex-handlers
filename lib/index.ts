// @ts-ignore
import * as ldflex from 'ldflex';
import allHandlers from './handlers/allHandlers';

const defaultHandlers = Object();
Object.assign(defaultHandlers, allHandlers);
Object.assign(defaultHandlers, ldflex.defaultHandlers);

export {
  defaultHandlers,
};

export * from './handlers/IterableMethodsHandler';
