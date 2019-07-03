/* jshint esversion:6 */
module.exports = {
	emptyArray : function(size) {
		return Array.apply(null, Array(size));
	},
	objectValues : function(obj) {
		return Object.keys(obj).map(key => obj[key]);
	},
	wrapSubstitute : function(str) {
		return "${"+str+"}";
	}
};
