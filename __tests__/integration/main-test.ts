import ComunicaEngine from '@ldflex/comunica';
import { newEngine } from '@comunica/actor-init-sparql-file';
import path from 'path';
import { namedNode } from '@rdfjs/data-model';
import { PathFactory } from 'ldflex';// '../../lib';
import { defaultHandlers } from '../../lib';

describe('Integration tests using a local file data source & comunica', () => {
  // let pathFactory;
  // beforeEach(() => {
  //   const engine = new ComunicaEngine();
  //   engine._engine = newEngine();
  //   engine._sources = [path.join(__dirname, 'data', 'iterated-literal.ttl')];
  //   console.log('the default handlers exported from lib are');
  //   pathFactory = new PathFactory({ context: {}, queryEngine: engine });
  //   // pathData = pathFactory.create({ subject: namedNode('http://example.org/myList') });
  // });

  describe('Testing .find method', () => {
    const engine = new ComunicaEngine();
    engine._engine = newEngine();
    engine._sources = [path.join(__dirname, '..', 'integration', 'data', 'iterated-literal.ttl')];
    const pathFactory = new PathFactory({
      context: {},
      queryEngine: engine,
      handlers: defaultHandlers,
    });
    const pathData = pathFactory.create({ subject: namedNode('http://example.org/Jesse') });
    it('should run without error', async () => {
      const attr = await pathData['http://example.org/literalAttribute'].find((x) => x > 7);
      expect(attr == 9).toEqual(true);
    });
  });
});
//   it('should handle .find', async () => {
//     console.log('pre creation');
//     const pathData = await pathFactory.create({ subject: namedNode('http://example.org/Jesse') });
//     console.log('the path data in the main test is', pathData);
//     const result = await pathData['http://example.org/literalAttribute']; // .find((x) => x > 7);
//     expect(result).toEqual(9);
//   });
// });

// it('should handle .list', async () => {
// const engine = new ComunicaEngine();
// engine._engine = newEngine();
// engine._sources = [path.join(__dirname, 'data', 'list.ttl')];
// const pathFactory = new PathFactory({ context: {}, queryEngine: engine }, undefined);
// const p = pathFactory.create({ subject: namedNode('http://example.org/myList') });
//   expect(await p['http://example.org/'].list).resolves.toBeInstanceOf(Array);
//   expect(await p['http://example.org/'].list).resolves.toEqual([1, 2, 3, 4, 5, 6]);
// });
