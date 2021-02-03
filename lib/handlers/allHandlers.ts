import * as IterableMethods from './IterableMethodsHandler';

export class PredicatesOf { // TOFO PROPERLy
  handle(pathData) {
    return pathData.extendPath({
      distinct: true,
      select: '?predicate',
      finalClause: async () => [await pathData.subject, 'predicate', 'object'],
      property: pathData.property,
    });
  }
}

export default {
  toRDFPrimitive: toRDFPrimitiveHandler(),
  list: listHandler(), // subjectToListHandler(),
  container: containerHandler(false),
  containerAsSet: containerHandler(true),

  // Further utils
  predicatesOf: new PredicatesOf(),

  // TODO: unit tests
  // URI Handlers
  prefix: subjectToComponentsHandler('prefix'),
  namespace: subjectToComponentsHandler('namespace'),
  fragment: subjectToComponentsHandler('fragment'),

  // Add more iteration helpers
  // @ts-ignore
  prefixes: handler((_, path) => path.toArray((subject) => subjectToComponentsHandler('prefix').handle({ subject }))),
  // @ts-ignore
  namespaces: handler((_, path) => path.toArray((subject) => subjectToComponentsHandler('namespace').handle({ subject }))),
  // @ts-ignore
  fragments: handler((_, path) => path.toArray((subject) => subjectToComponentsHandler('fragment').handle({ subject }))),

  // Further async/iteration helpers
  every: new IterableMethods.every(),
  everyLimit: new IterableMethods.everyLimit(),
  everySeries: new IterableMethods.everySeries(),

  // TODO: Improve this by handling as much as possible in sparql query
  filter: new IterableMethods.filter(),
  filterLimit: new IterableMethods.filterLimit(),
  filterSeries: new IterableMethods.filterSeries(),

  find: new IterableMethods.find(),
  findLimit: new IterableMethods.filterLimit(),
  findSeries: new IterableMethods.filterSeries(),

  forEach: new IterableMethods.forEach(),
  forEachLimit: new IterableMethods.forEachLimit(),
  forEachSeries: new IterableMethods.forEachSeries(),

  map: new IterableMethods.map(),
  mapLimit: new IterableMethods.mapLimit(),
  mapSeries: new IterableMethods.mapSeries(),

  reduce: new IterableMethods.reduce(),
  reduceRight: new IterableMethods.reduceRight(),

  reject: new IterableMethods.reject(),
  rejectLimit: new IterableMethods.rejectLimit(),
  rejectSeries: new IterableMethods.rejectSeries(),

  some: new IterableMethods.some(),
  someLimit: new IterableMethods.someLimit(),
  someSeries: new IterableMethods.someSeries(),

  transform: new IterableMethods.transform(),
};

// Creates a handler from the given function
function handler(handle) {
  return { handle };
}

function subjectToComponentsHandler(component: 'namespace' | 'fragment' | 'prefix') {
  return handler(async ({ subject, prefixes = {} }): Promise<string | undefined> => {
    if (subject?.termType === 'NamedNode') {
      if (component === 'namespace') {
        return /^[^]*[#/]/.exec(subject.value)?.[0];
      } if (component === 'fragment') {
        return /(?![/#])[^/#]*$/.exec(subject.value)?.[0];
      } if (component === 'prefix') {
        const ns = /^[^]*[#/]/.exec(subject.value)?.[0];
        const pref = ns ? prefixes[ns] : undefined;
        try {
          // TODO: Get prefixes from the engines first (if possible)
          const prefix = pref ?? /[a-z]*$/i.exec((await fetch(`http://prefix.cc/reverse?uri=${ns}`)).url)?.[0] ?? undefined;
          // eslint-disable-next-line no-unused-expressions, no-param-reassign
          ns && prefix && (prefixes[ns] = prefix);
          return prefix;
        } catch {
          return undefined;
        }
      }
    }
    return undefined;
  });
}

// TODO MAKE PR WITH THIS
function listHandler() {
  // eslint-disable-next-line no-empty-pattern
  return handler(async ({}, path) => {
    const list = [];
    while (path != 'http://www.w3.org/1999/02/22-rdf-syntax-ns#nil') {
      list.push(path['http://www.w3.org/1999/02/22-rdf-syntax-ns#first']);
      // eslint-disable-next-line no-param-reassign
      path = await path['http://www.w3.org/1999/02/22-rdf-syntax-ns#rest'];
    }
    return Promise.all(list);
    // typeof subject?.termType !== 'string' ?
    // undefined : termToPrimitive(subject)
  });
}

function containerHandler(set?: boolean) {
  // eslint-disable-next-line no-empty-pattern
  return handler(async ({}, path) => {
    const container = [];
    let elem;
    let count = 0;
    // eslint-disable-next-line no-cond-assign, no-plusplus
    while (elem = await path[`http://www.w3.org/1999/02/22-rdf-syntax-ns#_${++count}`]) {
      container.push(elem);
    }
    return set ? new Set(container) : container;
  });
}

// TODO: Discuass handling of setting values
function toRDFPrimitiveHandler() {
  return handler(async ({ subject }, path) => {
    switch (`${await path['http://www.w3.org/1999/02/22-rdf-syntax-ns#type']}`) {
      case 'http://www.w3.org/1999/02/22-rdf-syntax-ns#List':
        return path.list;
      case 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Bag':
        return path.containerAsSet;
      case 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Alt':
      case 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Seq':
      case 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Container':
        return path.container;
      default:
        // In this case none of the appropriate containers apply
        return subject;
    }
  });
}
