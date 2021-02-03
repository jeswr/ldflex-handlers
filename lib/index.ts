import { defaultHandlers, PathFactory } from 'ldflex';
import allHandlers from './handlers/allHandlers';

const MydefaultHandlers = {
  ...defaultHandlers,
  ...allHandlers,
};

class MyPathFactory {
  constructor(settings, data) {
    return new PathFactory({
      handlers: MydefaultHandlers, ...settings,
    }, data);
  }
}

export default {
  ...allHandlers,
  defaultHandlers: MydefaultHandlers,
  PathFactory: MyPathFactory,
};
