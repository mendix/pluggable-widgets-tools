module.exports =(env) => {
    env = env ? env : "prod";
    return require(`./webpack.config.${env}.js`)
}
