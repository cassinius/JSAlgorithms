/// <reference path="../tsrefs/node.d.ts" />
var ROOT;

var Helper;
(function (Helper) {
    function setModule(name, mod) {
        ROOT[name] = mod;
    }
    Helper.setModule = setModule;

    function initGEObject() {
        if (typeof module !== 'undefined' && module.exports) {
            ROOT = global;
        } else {
            ROOT = window;
        }
    }

    initGEObject();
    setModule('setModule', setModule);
})(Helper || (Helper = {}));
