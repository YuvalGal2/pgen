'use strict';
// Product Gen AI
// Released at:
// Version : 1.0.0
// By: Yuval Gal
// License: Open Source
class Pgenai {
    containerName;
    supportedPageObj;
    editAction;
    popupSpawnLocation;

    constructor(popupSpawnLocation) {
        this.popupSpawnLocation = popupSpawnLocation;
        this.injectView();
    }

    checkForContainer() {
        // const wpHeading = document.querySelector(this.supportedPageObj.class);
        // if (wpHeading && wpHeading.innerText === this.supportedPageObj.text) {
        //     return [this.containerName, this.supportedPageObj, this.editAction];
        // }
    }

    getTextArea() {
        // const textarea = document.querySelector(this.containerEl[0]);
        // const textBoxParent = textarea.parentElement;
        // return [textBoxParent, textarea];
    }

    getTinyMce() {
        // const mce = $(this.containerEl[0]).contents().find("#tinymce");
        // const iframe = $(this.containerEl[0])[0];
        // return [iframe, mce];
    }


    createFileBrowserButton() {
        const fileDiv = document.createElement("div");
        fileDiv.appendChild(document.createTextNode("Pgen AI - Select Product Image"));
        const fileInput = document.createElement("input");
        fileInput.style.marginTop = "40px";
        fileInput.style.marginBottom = "20px";
        fileInput.type = "file";
        fileDiv.appendChild(fileInput);
        fileDiv.style.marginTop = "10px";
        fileDiv.style.marginBottom = "10px";
        return fileDiv;
    }
    createRadioButtons() {
        // Create an array of radio button labels and values
        const radioOptions = [
            { label: "Default radio", id: "flexRadioDefault1", checked: false },
            { label: "Default checked radio", id: "flexRadioDefault2", checked: true },
        ];

// Create a container div for the radio buttons
        const containerDiv = document.createElement("div");
        containerDiv.className = "form-check";

// Loop through the radioOptions array to create radio buttons
        radioOptions.forEach((option) => {
            const radioDiv = document.createElement("div");
            radioDiv.className = "form-check-el";
            radioDiv.style.display = "flex"; // Add display: flex;
            radioDiv.style.marginTop = "5px";
            radioDiv.style.alignItems = "center"; // Add align-items: center;
            radioDiv.style.padding = "0px"; // Add padding: 0px;
            const radioInput = document.createElement("input");
            radioInput.className = "form-check-input";
            radioInput.type = "radio";
            radioInput.name = "flexRadioDefault";
            radioInput.id = option.id;
            radioInput.checked = option.checked;

            const radioLabel = document.createElement("label");
            radioLabel.className = "form-check-label";
            radioLabel.htmlFor = option.id;
            radioLabel.textContent = option.label;

            radioDiv.appendChild(radioInput);
            radioDiv.appendChild(radioLabel);

            containerDiv.appendChild(radioDiv);
        });
        return containerDiv;
    }
    createCloseButton(popup) {
        // Create close button
        const closeButton = document.createElement("button");
        closeButton.innerText = "X";
        closeButton.classList.add('btn-danger');
        closeButton.classList.add('btn');
        closeButton.style.position = "absolute";
        closeButton.style.top = "5px";
        closeButton.style.right = "5px";
        closeButton.addEventListener("click", (event) => {
            event.stopPropagation();
            event.preventDefault();
            popup.remove();
        });
        return closeButton;
    }

    createBaseView() {
        const popup = document.createElement("div");
        popup.classList.add("popup-view");
        popup.style.width = "400px";
        popup.style.minHeight = "500px";
        popup.style.border = "1px solid #ccc";
        popup.style.position = "absolute";
        popup.style.top = "70px";
        popup.style.left = "70px";
        popup.style.backgroundColor = "white";
        popup.style.padding = "20px";
        popup.style.zIndex = "9999";
        return popup;
    }
    injectView() {
        // Create a div element for the popup
        const popup = this.createBaseView();

        // Create popup close button
        const closeButton = this.createCloseButton(popup);
        popup.appendChild(closeButton);

        // Create radio input
        const radiosDiv = this.createRadioButtons();
        popup.appendChild(radiosDiv);
        //  Create file input
        const fileDiv = this.createFileBrowserButton();
        popup.appendChild(fileDiv);
        //  Create inputs fields
        this.createInputs(popup);

        const popupSpawnLocation = document.querySelector(this.popupSpawnLocation);
        if (popupSpawnLocation) {
            popupSpawnLocation.appendChild(popup);
        }
    }

    createInputs(popup) {
        const nameDiv = document.createElement("div");
        nameDiv.appendChild(document.createTextNode("Pgen AI - Product Name Options:"));
        nameDiv.appendChild(document.createElement('br'));
        const productNameOptions = document.createElement("input");
        productNameOptions.classList.add("tag-input");
        productNameOptions.style.marginTop = "10px";
        productNameOptions.style.marginBottom = "10px";
        productNameOptions.style.width = "100%";
        productNameOptions.style.border = "none";
        productNameOptions.style.outline = "none";
        nameDiv.appendChild(productNameOptions);
        popup.appendChild(nameDiv);
        this.createTagInput(productNameOptions, nameDiv);

        const keywordDiv = document.createElement("div");
        keywordDiv.appendChild(document.createTextNode("Pgen AI - Product Keyword Options:"));
        keywordDiv.appendChild(document.createElement('br'));
        const productKeywordOptions = document.createElement("input");
        productKeywordOptions.classList.add("tag-input");

        productKeywordOptions.style.marginTop = "10px";
        productKeywordOptions.style.marginBottom = "10px";
        productKeywordOptions.style.width = "100%";
        productKeywordOptions.style.border = "none";
        productKeywordOptions.style.outline = "none";
        keywordDiv.appendChild(productKeywordOptions);
        popup.appendChild(keywordDiv);
        this.createTagInput(productKeywordOptions, keywordDiv);

        const brandDiv = document.createElement("div");
        brandDiv.appendChild(document.createTextNode("Pgen AI - Product Brand Options:"));
        brandDiv.appendChild(document.createElement('br'));
        const productBrandOptions = document.createElement("input");
        productBrandOptions.classList.add("tag-input");

        productBrandOptions.style.marginTop = "10px";
        productBrandOptions.style.marginBottom = "10px";
        productBrandOptions.style.width = "100%";
        productBrandOptions.style.border = "none";
        productBrandOptions.style.outline = "none";
        brandDiv.appendChild(productBrandOptions);
        popup.appendChild(brandDiv);
        this.createTagInput(productBrandOptions, brandDiv);

    }
    createTagInput(inputField, container) {
        inputField.addEventListener("keydown", (event) => {
            if (event.key === "," || event.key === "Enter") {
                event.preventDefault();
                const tagValue = inputField.value.trim();
                if (tagValue) {
                    const tagElement = document.createElement("span");
                    tagElement.classList.add('badge');
                    tagElement.classList.add('bg-primary');
                    tagElement.innerText = tagValue;
                    tagElement.style.marginTop = '5px';
                    tagElement.style.marginLeft = '5px';

                    // Add a button to remove the tag
                    const removeButton = document.createElement("span");
                    removeButton.className = "remove-tag";
                    removeButton.innerText = "x";
                    removeButton.style.marginTop = "5px";
                    removeButton.style.marginBottom = "5px";
                    removeButton.style.height = "20px";
                    removeButton.style.marginLeft = "10px";
                    removeButton.classList.add('btn-sm');
                    removeButton.addEventListener("click", () => {
                        tagElement.remove();
                    });

                    tagElement.appendChild(removeButton);
                    container.insertBefore(tagElement, inputField);

                    // Clear the input field
                    inputField.value = "";
                }
            }
        });
    }
}



// injection system for scripts
document.onreadystatechange = () => {
    const scriptsLink = [
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.min.js',
    ]
    scriptsLink.forEach((link) => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = link;
        document.head.appendChild(script);
    });
    const styleLinks = [
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css',
    ]
    styleLinks.forEach((link) => {
        const linkEl = document.createElement("link");
        linkEl.rel = "stylesheet";
        linkEl.href = link;
        document.head.appendChild(linkEl);
    });

    if (document.readyState === "complete") {
        const popupSpawnLocation = '#wp-content-editor-container';
        const pgenai = new Pgenai(popupSpawnLocation);
    }
}



