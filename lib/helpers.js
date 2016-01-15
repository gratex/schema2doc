
module.exports.objectValues = function(obj) {
	return Object.keys(obj).map(key => obj[key]);
}
module.exports.wrapSubstitute = function(str) {
	return "${"+str+"}"
}