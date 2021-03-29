import test from "ava"
import range from "./index.js"

const INF_LOOP_COUNT = 1000

function *infLoopGuard(t) {
    for (let n = 0; n < INF_LOOP_COUNT; ++n) yield n
    throw new RangeError("range generator should not make infinite loop")
}

test("range iterator", t => {
    let arr = [], loop = infLoopGuard(t)
    for (let n of range(10, 16, 2)) {
        arr.push(n)
        loop.next()
    }
    t.deepEqual(arr, [10, 12, 14], "general syntax")

    arr.length = 0, loop = infLoopGuard(t)
    for (let n of range(1, 1)) {
        arr.push(n)
        loop.next()
    }
    t.deepEqual(arr, [], "zero range")

    arr.length = 0, loop = infLoopGuard(t)
    for (let n of range(5, -5, 1)) {
        arr.push(n)
        loop.next()
    }
    t.deepEqual(arr, [], "empty range on out of bounds")

    arr.length = 0, loop = infLoopGuard(t)
    for (let n of range(-5, 5, -1)) {
        arr.push(n)
        loop.next()
    }
    t.deepEqual(arr, [], "empty range on out of bounds negative")

    arr.length = 0, loop = infLoopGuard(t)
    for (let n of range(10, 13)) {
        arr.push(n)
        loop.next()
    }
    t.deepEqual(arr, [10, 11, 12], "step is optional")

    arr.length = 0, loop = infLoopGuard(t)
    for (let n of range(10, 7, -1)) {
        arr.push(n)
        loop.next()
    }
    t.deepEqual(arr, [10, 9, 8], "negative step")

    arr.length = 0, loop = infLoopGuard(t)
    for (let n of range(10, 7)) {
        arr.push(n)
        loop.next()
    }
    t.deepEqual(arr, [10, 9, 8], "negative step is optional")

    arr.length = 0, loop = infLoopGuard(t)
    for (let n of range(4, -4, -2)) {
        arr.push(n)
        loop.next()
    }
    t.deepEqual(arr, [4, 2, 0, -2], "negative step through 0")

    arr.length = 0, loop = infLoopGuard(t)
    for (let n of range(3)) {
        arr.push(n)
        loop.next()
    }
    t.deepEqual(arr, [0, 1, 2], "1 argument only range")

    arr.length = 0, loop = infLoopGuard(t)
    for (let n of range(-5)) {
        arr.push(n)
        loop.next()
    }
    t.deepEqual(arr, [0, -1, -2, -3, -4], "1 argument only range negative")

    arr.length = 0, loop = infLoopGuard(t)
    for (let n of range(.25, 1, .125)) {
        arr.push(n)
        loop.next()
    }
    t.deepEqual(arr, [.25, .375, .5, .625, .75, .875], "floating point")

    t.deepEqual([...range(1, 4)], [1, 2, 3], "supports array spread")

    t.deepEqual(Array.from(range(1, 4)), [1, 2, 3], "supports Array.from()")
})


test("converting params", t => {
    let arr = [], loop = infLoopGuard(t)
    for (let n of range("1", "6", "1")) {
        arr.push(n)
        loop.next()
    }
    t.deepEqual(arr, [1, 2, 3, 4, 5], "params are converted to number")

    arr.length = 0, loop = infLoopGuard(t)
    for (let n of range(1e16, 10000000000000100, 30)) {
        arr.push(n)
        loop.next()
    }
    t.deepEqual(arr,
        [10000000000000000n, 10000000000000030n, 10000000000000060n, 10000000000000090n],
        "large numbers are converted to bigint"
    )

    arr.length = 0, loop = infLoopGuard(t)
    for (let n of range(-1e16, -10000000000000100, -30)) {
        arr.push(n)
        loop.next()
    }
    t.deepEqual(arr,
        [-10000000000000000n, -10000000000000030n, -10000000000000060n, -10000000000000090n],
        "large negative numbers are converted to bigint"
    )
})


test("throw on invalid params", t => {
    t.throws(() => {
        let loop = infLoopGuard(t)
        for (let n of range(1, 10, 0)) loop.next()
    }, {message: "range() argument 3 must be not zero"})

    t.throws(() => {
        let loop = infLoopGuard(t)
        for (let n of range(Infinity)) loop.next()
    }, {instanceOf: RangeError})

    t.throws(() => {
        let loop = infLoopGuard(t)
        for (let n of range("a", "z", " ")) loop.next()
    }, {message: "range() arguments must be numbers"})
})
