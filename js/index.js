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
        let foundContainer = null;
        for (let option of options) {
            this.containerName = option[0];
            this.supportedPageObj = option[1];
            this.editAction = option[2]?.action;
            foundContainer = this.checkForContainer();
            console.log(foundContainer);
            if (foundContainer) {
                this.containerEl = foundContainer;
                this[this.editAction]();
                break;
            }
        }
        if (!foundContainer) {
            return;
        }
        this.injectView();
    }
    checkForContainer() {
        const wpHeading = document.querySelector(this.supportedPageObj.class);
        if (wpHeading && wpHeading.innerText === this.supportedPageObj.text) {
            return [this.containerName,this.supportedPageObj,this.editAction];
        }
    }

    editTextArea() {
        const textarea = document.querySelector(this.containerEl[0]);
        console.log(this.containerEl);
        const textBoxParent = textarea.parentElement;
        this.containerEl[0] = textBoxParent;
    }
    editTinyMce() {
        try {
            const mce = $(this.containerEl[0]).contents().find("#tinymce");
            this.containerEl[0] = mce;
        }
        catch (e) {
            this.containerEl[2] = "editTextArea";
            this.containerEl[0] = ".wp-editor-area";
            this.editTextArea();
        }
    }
    injectView() {
        // Create a div element for the popup
        const popup = document.createElement("div");
        popup.style.width = "300px";
        popup.style.height = "300px";
        popup.style.border = "1px solid #ccc";
        popup.style.position = "absolute";
        popup.style.top = "70px";
        popup.style.left = "70px";
        popup.style.backgroundColor = "white";
        popup.style.padding = "20px";
        popup.style.zIndex = "9999";

        // Create close button
        const closeButton = document.createElement("button");
        closeButton.innerText = "X";
        closeButton.style.position = "absolute";
        closeButton.style.top = "5px";
        closeButton.style.right = "5px";
        closeButton.addEventListener("click", () => {
            document.body.removeChild(popup);
        });
        popup.appendChild(closeButton);

        // Create radio buttons
        const radioDiv = document.createElement("div");
        const radioLabel = document.createElement("label");
        radioLabel.innerHTML = '' +
            '<input type="radio" name="saleOrInfo" value="Sale"> Sale' +
            '<input type="radio" name="saleOrInfo" value="Info"> Info';
        radioLabel.style.marginLeft = "10px";
        radioDiv.appendChild(document.createTextNode("Pgen AI - Page Sale (Sale/Info):"));
        radioDiv.appendChild(radioLabel);
        radioDiv.style.marginTop = "10px"; // Adjust spacing
        radioDiv.style.marginBottom = "10px"; // Adjust spacing
        popup.appendChild(radioDiv);

        // Create file input
        const fileDiv = document.createElement("div");
        fileDiv.appendChild(document.createTextNode("Pgen AI - Select Product Image"));
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileDiv.appendChild(fileInput);
        fileDiv.style.marginTop = "10px"; // Adjust spacing
        fileDiv.style.marginBottom = "10px"; // Adjust spacing
        popup.appendChild(fileDiv);

        // Create input fields
        const nameDiv = document.createElement("div");
        nameDiv.appendChild(document.createTextNode("Pgen AI - Product Name Options:"));
        const productNameOptions = document.createElement("input");
        productNameOptions.type = "text";
        nameDiv.appendChild(productNameOptions);
        nameDiv.style.marginTop = "10px"; // Adjust spacing
        nameDiv.style.marginBottom = "10px"; // Adjust spacing
        popup.appendChild(nameDiv);

        const keywordDiv = document.createElement("div");
        keywordDiv.appendChild(document.createTextNode("Pgen AI - Product Keyword Options:"));
        const productKeywordOptions = document.createElement("input");
        productKeywordOptions.type = "text";
        keywordDiv.appendChild(productKeywordOptions);
        keywordDiv.style.marginTop = "10px"; // Adjust spacing
        keywordDiv.style.marginBottom = "10px"; // Adjust spacing
        popup.appendChild(keywordDiv);

        const brandDiv = document.createElement("div");
        brandDiv.appendChild(document.createTextNode("Pgen AI - Product Brand Options:"));
        const productBrandOptions = document.createElement("input");
        productBrandOptions.type = "text";
        brandDiv.appendChild(productBrandOptions);
        brandDiv.style.marginTop = "10px"; // Adjust spacing
        brandDiv.style.marginBottom = "10px"; // Adjust spacing
        popup.appendChild(brandDiv);


        // Append the popup to the body
        this.containerEl[0].appendChild(popup);
    };

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
        ['.wp-editor-area',{class: '.wp-heading-inline', text: 'Add new product'},{action: "editTextArea"}],
        ['#content_ifr',{class: '.wp-heading-inline', text: 'Add new product'}, {action: "editTinyMce"}],

]);


