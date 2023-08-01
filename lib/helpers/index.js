function isComponentName(name) {
    return Boolean(name.match(/^[A-Z]/))
}

module.exports = {
    isComponentName
}
