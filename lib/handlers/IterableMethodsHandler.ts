import * as async from 'async';

function IterableMethodsFactory<T, E = Error>(
  asyncFunction: (
    arr: async.IterableCollection<T>,
    iterator: async.AsyncIterator<T, E>,
    callback: async.AsyncResultCallback<T, E>
  ) => void,
) {
  return class {
    handle(pathData, path) {
      return function (parameterFunction: Function, memo?: any) {
        return new Promise((resolve, reject) => {
          asyncFunction(
            path,
            memo ?? (async (item, callback: async.AsyncResultCallback<Error>) => {
              // console.log('inside async function call', item, parameterFunction(item));
              const result = await parameterFunction(item);
              callback(null, result);
            }),
            (err, res) => {
              console.log('inside callback', err, res);
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            },
          );
        });
      };

      // return (parameterFunction: Function, memo?: any) => asyncFunction(
      //   path, memo ?? ((item) => {
      //     console.log('inside async function call', item, parameterFunction(item));
      //     return parameterFunction(item);
      //   }), memo,
      // );
    }
  };
}

function IterableLimitMethodsFactory(asyncFunction: Function) {
  return class {
    handle(pathData, path) {
      return (parameterFunction: Function, limit: number = 5) => asyncFunction(
        path, limit, (item) => parameterFunction(item),
      );
    }
  };
}

export const find = IterableMethodsFactory(async.detect);
export const findLimit = IterableLimitMethodsFactory(async.detectLimit);
export const findSeries = IterableMethodsFactory(async.detectSeries);

// TODO: ADD TESTS FOR BELOW FUNCTIONS
export const forEach = IterableMethodsFactory(async.each);
export const forEachLimit = IterableLimitMethodsFactory(async.eachLimit);
export const forEachSeries = IterableMethodsFactory(async.eachSeries);

// export const forEachOf = IterableMethodsFactory(async.eachOf);
export const forEachOfLimit = IterableLimitMethodsFactory(async.eachOfLimit);
// export const forEachOfSeries = IterableMethodsFactory(async.eachOfSeries);

export const every = IterableMethodsFactory(async.every);
export const everyLimit = IterableLimitMethodsFactory(async.everyLimit);
export const everySeries = IterableMethodsFactory(async.everySeries);

export const filter = IterableMethodsFactory(async.filter);
export const filterLimit = IterableLimitMethodsFactory(async.filterLimit);
export const filterSeries = IterableMethodsFactory(async.filterSeries);

export const map = IterableMethodsFactory(async.map);
export const mapLimit = IterableLimitMethodsFactory(async.mapLimit);
export const mapSeries = IterableMethodsFactory(async.mapSeries);

// export const reduce = IterableMethodsFactory(async.reduce);
// export const reduceRight = IterableMethodsFactory(async.reduceRight);

export const reject = IterableMethodsFactory(async.reject);
export const rejectLimit = IterableLimitMethodsFactory(async.rejectLimit);
export const rejectSeries = IterableMethodsFactory(async.rejectSeries);

export const some = IterableMethodsFactory(async.some);
export const someLimit = IterableLimitMethodsFactory(async.someLimit);
export const someSeries = IterableMethodsFactory(async.someSeries);
// May be some issues because of the 2nd arg accumulartor
export const transform = IterableMethodsFactory(async.transform);
