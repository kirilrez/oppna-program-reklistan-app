# oppna-program-reklistan-app

Work in progress!

### Release for production
In `app.js`, remember to set all appSettings to production mode. 

### Note on Babel usage
We're currently not including the Babel polyfill in the App runtime, which means that you cannot use these:

|Feature | Requirements |
|--------|--------------|
|Abstract References | Symbol |
|Array destructuring | Symbol |
|Async functions, Generators | regenerator runtime |
|Comprehensions | Array.from |
|For Of | Symbol, prototype[Symbol.iterator] |
|Spread | Array.from |


