
module.exports.substitute = function(template, map, transform) {
	/* heavily inspired by Dojo (dojo/string api) */
	

	transform = transform ? transform : function(v){ return v; };

	return template.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g,
		function(match, key){
			var value = map[key];
			return transform(value, key).toString();
		}); // String
}