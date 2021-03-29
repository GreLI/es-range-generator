# ES Range generator for javascript

ES Range generator is zero-dependency tiny module that provides `range()` function
similar to one that's in Python. Its main purpose is to use in `for-of` loops
with a far more convenient syntax than common hacks like

```javascript
Array.from(Array(10), (_, i) => i + 1).forEach(i => { /*...*/ })
```

Usage:
```javascript
import range from "es-range-generator";

for (let i of range(1, 10)) {
    console.log(i);
}
// → 1
// → 2
// → 3
// ...
```

It supports 1-argument syntax, higher-to-lower values ranges, floating point values, bigints
and built upon ES2015 generators:

```javascript
[...range(5)]                // → [0, 1, 2, 3, 4]
[...range(-5)]               // → [0, -1, -2, -3, -4]
[...range(3, 0, -1)]         // → [3, 2, 1]
[...range(10, 5)]            // → [10, 9, 8, 7, 6]
[...range(.25, 1, .125)]     // → [.25, .375, .5, .625, .75, .875]
[...range(1e16, 1e16 + 100)] // → [10000000000000000n, 10000000000000001n, ...]
```

## Why another generator?

There are plenty of other python-like range functions in the wild,
however, all of them lack noticable features.

Almost none of them uses ES2015 generators, producing an extra array.
This one returns iterator which produces values lazily, only when needed.
It is the nature of iterators.

Many of them doesn't support negative steps, noone support BigInt.
They even can lead to infinite loop in certain conditions!
In a browser this would cause tab to hang for a while and crash.

Some other are bloated with functions, while this one takes only
around 600 bytes in total.

## How it works

As stated in its name, range generator uses ES2015 generator
returning an iterator, which is the most natural way for implementing.
Just like it's done in Python. Of course this module is an ES module.
It made as simple as possible.

Following with JS way, its params are converted to numbers.
The only exception is when numbers are larger than `MAX_SAFE_INTEGER`
(or lower than `MIN_SAFE_INTEGER`, accordingly)—in that case
they are casted to BigInt. BigInt input is respected as well.
In such a case BigInt is an essential requirement.
However, it's not needed if that is not the case.

While this module is written to prevent possible infinite loops
one still can pass large values which will be iterated
above the reasonable time. Such a case is beyond the scope.
Be careful.

No transpilation or polyfill is used in this module. Common, it's 2021!
Microsoft already replaces Internet Explorer in Windows updates.
If you need support for such an old browser you should already know what to do.

## Usage

Usage of range is quite intuitive, but nevertheless here it is:

```
range(stop)
range(start, stop, [step])
```

Range is iterated from `start` to `stop` (excluding) with increment equal to `step`.
When only one argument is passed it's considered as `stop`
with default `start` value equal `0`. Usually `step` defaults to `1`,
however in couple of cases it can be equal `-1`.
It's somewhat that is not in Python implementation
(wonder, why it's not there):

```javascript
[...range(-5)]    // → [0, -1, -2, -3, -4]
[...range(10, 5)] // → [10, 9, 8, 7, 6]
```

The function can be used everywhere an iterator fits: in `for-of` loops,
with array spread operator, in `Array.from()`, function rest operator:

```javascript
import range from "es-range-generator"

for (let i of range(1, 10)) {
    /* ... */
}
let arr1 = [...range(10)];
let arr2 = Array.from(range(10));
someFunc('list', ...range(2, 10, 2));
```

…and so on.
