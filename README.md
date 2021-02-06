# ldflex handlers
My custom handlers for use with the [LDflex](https://github.com/ldflex/ldflex) Library

### Usage

```ts
import { defaultHandlers } from '@jeswr/ldflex-handlers'
import { PathFactory } from 'ldflex'

const myPath = new PathFactory({
  handlers: defaultHandlers,
  context: // see https://github.com/ldflex/ldflex for usage
  queryEngine: // see https://github.com/ldflex/ldflex for usage
});
```

All exposed handlers are declared [here](https://github.com/jeswr/ldflex-handlers/blob/beta/lib/handlers/allHandlers.ts)

