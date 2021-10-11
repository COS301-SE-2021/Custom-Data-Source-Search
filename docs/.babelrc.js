module.exports = {
    presets: ['@babel/preset-env'],
    publicPath: process.env.NODE_ENV === 'production'
        ? '/Custom-Data-Source-Search/'
        : '/'
}