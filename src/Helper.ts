/// <reference path="../tsrefs/node.d.ts" />

var ROOT;

module Helper {

    declare var window;

    export function setModule(name: string, mod: any) {
            ROOT[name] = mod;
    }

    function initGEObject() {
        if (typeof module !== 'undefined' && module.exports) {
            ROOT = global;
        } else {
            ROOT = window;
        }
    }

    initGEObject();
    setModule('setModule', setModule);
}
