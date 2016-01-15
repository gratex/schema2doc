module.exports.emptyArray = function(size) {
	return Array.apply(null, Array(size))
}
module.exports.objectValues = function(obj) {
	return Object.keys(obj).map(key => obj[key]);
}
module.exports.wrapSubstitute = function(str) {
	return "${"+str+"}"
}