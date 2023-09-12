'use strict';
// Product Gen AI
// Released at:
// Version :
// By:
// License:
class Pgenai {
    containerName;
    supportedPageObj;
    editAction;
    containerEl;
    constructor(options) {
        for (let option of options) {
            this.containerName = option[0];
            this.supportedPageObj = option[1];
            this.editAction = option[2]?.action;
            const foundContainer = this.checkForContainer();
            if (foundContainer) {
                this.containerEl = foundContainer;
                this[this.editAction]();
                break;
            }
        }
    }
    checkForContainer() {
        const wpHeading = document.querySelector(this.supportedPageObj.class);
        if (wpHeading && wpHeading.innerText === this.supportedPageObj.text) {
            return [this.containerName,this.supportedPageObj,this.editAction];
        }
    }

    editTextArea() {
        console.log("edit text area");
    }
    editTinyMce() {
        console.log("edit mce");
    }
}



(function() {
    var startingTime = new Date().getTime();
    // Load the script
    var script = document.createElement("SCRIPT");
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName("head")[0].appendChild(script);

    // Poll for jQuery to come into existance
    var checkReady = function(callback) {
        if (window.jQuery) {
            callback(jQuery);
        }
        else {
            window.setTimeout(function() { checkReady(callback); }, 20);
        }
    };

    // Start polling...
    checkReady(function($) {
        $(function() {
            var endingTime = new Date().getTime();
            var tookTime = endingTime - startingTime;
        });
    });
})();
const pgenai = new Pgenai(
    [
    ['#content_ifr', {class: '.wp-heading-inline', text: 'Edit product'},{action: "editTinyMce"}],
    ['.wp-editor-area',{class: '.wp-heading-inline', text: 'Edit product'},{action: "editTextArea"}],
        ['#wp-editor-area',{class: '.wp-heading-inline', text: 'Add new product'},{action: "editTextArea"}],
        ['#content_ifr',{class: '.wp-heading-inline', text: 'Add new product'}, {action: "editTinyMce"}],

]);


