# Hash router

Very simple hash router that I couldn't find elsewhere.

## Documentation

Your links looks like this:

```html
<a href='#'>Index</a>
<a href='#about'>About</a>
<a href='#page/2'>Page 2</a>
```

You include or require the module.

```javascript
import hashRouter from 'simple-hash-router';
// or
var hashRouter = require('simple-hash-router');
// or just include it in the head of the html


// Then you attach a your favorite listener to the `hashRouter`

hashRouter.register(function (page, params) {
    console.log(page);      // Name of the page
    console.log(params);    // Object with parameters

    // This is where you'd do your matic.
});


// Then you define your routes. They have to be a list because the order
// matters. hashRouter will trigger on the first matched route.

hashRouter.addRoutes([
   {'/': 'index-page'},
   {'about': 'about-page'},
   {'page/:id': 'paginated-page'}
]);

// Lastly, you start it. When starting it, it will also trigger the approrpate
// route even though the URL did not change.
```

That's it! Check `/examples` for a working example. :-)

### 404?

In case you link to an undefined route, it will notify registered functions
with a `not-found` page name.

### License

MIT.

### Contributions

Sure! Dive in. There's nothing out of the ordinary going on in the code.
