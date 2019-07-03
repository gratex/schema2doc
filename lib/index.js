// templates
var toCommon = require('../lib/toCommon'); // contains processing of schema
var toCsv = require('../lib/toCsv');
var toHtml = require('../lib/toHtml');
var toRaw = require('../lib/toRaw');

var columnsMap = {
    rqnn: {
        title: "RQ/NN",
        visible: kernelTrue
    },
    field: {
        title: "Field",
        visible: kernelTrue
    },
    type: {
        title: "Type",
        visible: kernelTrue
    },
    format: {
        title: "Format",
        visible: kernelTrue
    },
    constraints: {
        title: "Constraints",
        visible: function(options) {
            return options.a || options.constraints;
        }
    },
    description: { title: "Desc", visible: kernelTrue }
};
function createOptions(args) {
    var columns = {};
    Object.keys(columnsMap).forEach(function(key) {
        columnsMap[key].visible(args) && (columns[key] = columnsMap[key].title);
    });

    return {
        columns: columns
    };
}

function wrapper(renderer) {
    return function(jsonInput, options) {
        return renderer(createOptions(options || {}))(jsonInput, toCommon);
    };
}

function kernelTrue() {
    return true;
}

module.exports = {
    toCsv : wrapper(toCsv),
    toHtml: wrapper(toHtml),
    toRaw: wrapper(toRaw)
};
