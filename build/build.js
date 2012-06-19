({
    baseUrl: "../src",
    include: ['main'],
    insertRequire: ['main'],
    out: '../dist/toe.min.js',
    name: '../build/ext/almond',
    paths: {
        jquery: '../build/jquery'
    }
})