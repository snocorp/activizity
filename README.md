# activizity

[![Build Status](https://secure.travis-ci.org/snocorp/activizity.png?branch=master)](http://travis-ci.org/snocorp/activizity)


## Installation

Install with [Bower](http://bower.io):

```
bower install --save activizity
```

The component can be used as a Common JS module, an AMD module, or a global.


## API

### activizity()


## Testing

Install [Node](http://nodejs.org) (comes with npm) and Bower.

From the repo root, install the project's development dependencies:

```
npm install
bower install
```

Testing relies on the Karma test-runner. If you'd like to use Karma to
automatically watch and re-run the test file during development, it's easiest
to globally install Karma and run it from the CLI.

```
npm install -g karma
karma start
```

To run the tests in Firefox, just once, as CI would:

```
npm test
```


## Browser support

* Google Chrome (latest)
* Opera (latest)
* Firefox 4+
* Safari 5+
* Internet Explorer 8+
