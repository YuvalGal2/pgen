'use strict';

let pgenai;
// Product Gen AI
// Released at:
// Version : 1.0.0
// By: Yuval Gal
// License: Open Source
class Pgenai {
    popupSpawnLocation;
    formEl;
    file;
    productName;
    productKeyWords;
    productBrand;
    productDescription;
    productDescriptions;
    offsetX = false;
    offsetY = false;
    isDragging = false;
    whiteListPayload = {};
    blackListPayload = {};
    constructor(popupSpawnLocation) {
        this.popupSpawnLocation = popupSpawnLocation;
        this.injectView();
    }


     createFileBrowserButton() {
         // Create a container div for the custom file input
         const fileContainer = document.createElement("div");
         fileContainer.className = "custom-file-div";
         fileContainer.style.width = "100%"; // Set a custom width
         fileContainer.style.height = "80px"; // Set a custom height
         fileContainer.style.display = 'flex';
         fileContainer.style.justifyContent = 'center';
         fileContainer.style.alignItems = 'center';
         fileContainer.style.backgroundColor = '#333333';
         fileContainer.style.marginTop = '30px';
         fileContainer.style.marginBottom = '30px';
         fileContainer.style.color = '#ffffff';
         fileContainer.style.border = '1px solid #ffffff';

         // Create a label for the custom file input
         const fileLabel = document.createElement("label");
         fileLabel.classList.add('pgen-upload-label');
         fileLabel.textContent = "Select Product Image";
         fileLabel.style.cursor = "pointer";
         fileContainer.appendChild(fileLabel);

         const fileInput = document.createElement('input');
         fileInput.setAttribute('type','file');
         fileInput.classList.add('custom-file-input');
         fileInput.style.display = 'none';
         fileContainer.addEventListener('dragenter', this.handleDragEnter, false)
         fileContainer.addEventListener('dragleave',  this.handleDragLeave, false)
         fileContainer.addEventListener('dragover', this.handleDragOver, false)
         fileContainer.addEventListener('drop', this.handleFileDrop, false)
         fileContainer.addEventListener('click', this.handleBrowse.bind(this), false)
         fileInput.addEventListener("change", () => {
             const getFileEl = document.querySelector('.custom-file-input');
             this.file = getFileEl.files[0];
             if (this.file) {
                 this.formEl.append('image', this.file);
                 fileLabel.innerHTML = `Selected ${this.file.name}`;
                 fileInput.setAttribute('disabled', true);
                 fileInput.setAttribute('set',this.file.name);
             }
         }, false);
         fileContainer.appendChild(fileInput);
         return fileContainer;
    }

    cloneAndConvertSets(obj) {
        const result = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] instanceof Set) {
                    // Convert the Set to an Array and assign it to the new object
                    result[key] = Array.from(obj[key]);
                } else if (typeof obj[key] === 'object') {
                    // Recursively call the function for nested objects
                    result[key] = this.cloneAndConvertSets(obj[key]);
                } else {
                    // Copy other non-object, non-Set values directly
                    result[key] = obj[key];
                }
            }
        }
        return result;
    }


    onSubmitClicked(improveResults = false) {
        const parsedWhiteList = this.cloneAndConvertSets(this.whiteListPayload);
        const parsedBlackList = this.cloneAndConvertSets(this.blackListPayload);
        // console.log(parsedWhiteList);
        // console.log(parsedBlackList);
        const uploadLabel = document.querySelector('.pgen-upload-label');
        let url = 'http://127.0.0.2:81';
        if (improveResults) {
            this.formEl.delete('whitelist');
            this.formEl.delete('blacklist');
            this.formEl.append('whitelist',JSON.stringify(parsedWhiteList));
            this.formEl.append('blacklist',JSON.stringify(parsedBlackList));
        }
        uploadLabel.innerHTML = "Loading...";
        fetch(`${url}/upload`, {
            method: 'POST',
            body: this.formEl,
        })
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                uploadLabel.innerHTML = "Select Product Image";
                document.querySelector('.improve').style.display = 'unset';
                this.handleFetchedData(data,improveResults)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }




    handleFetchedData(payload) {

        /// called after the data is fetched.
        if (payload) {
            const triggerEventMap = [
                {
                    container: '.pgen-name-container',
                    genAt: 'pgen-name',
                    genValue: payload.msgParams[2] ?? '',
                    splitBy: ' ',
                },
                {
                    container: '.pgen-keywords-container',
                    genAt: 'pgen-keywords',
                    genValue: payload.msgParams[1] ?? '',
                    splitBy: ' ',

                },
                {
                    allowOverWrite: true,
                    container: '.pgen-description-container',
                    genAt: 'pgen-description',
                    genValue: payload.suggestedText?.textVersion ?? ''
                },
                {
                    container: '.pgen-brand-container',
                    genAt: 'pgen-brand',
                    genValue: payload.msgParams[0] ?? '',
                    splitBy: ' '
                },
            ]
            // Create a new "keydown" event -- showing all tags
            const event = new KeyboardEvent("keydown", {
                key: "Enter", // Simulate the "Enter" key
                keyCode: 13,   // Key code for the "Enter" key
                bubbles: true, // Allow event to bubble up the DOM
                cancelable: true, // Allow event to be canceled
            });


            triggerEventMap.forEach((obj) => {
                // make sure the sets exists per each input
                if (! this.whiteListPayload[`${obj.genAt}-whitelist`]) {
                    this.whiteListPayload[`${obj.genAt}-whitelist`] = new Set();
                }
                if (! this.blackListPayload[`${obj.genAt}-blacklist`]) {
                    this.blackListPayload[`${obj.genAt}-blacklist`] = new Set();
                }
                const whiteList = this.whiteListPayload[`${obj.genAt}-whitelist`];
                const blackList = this.blackListPayload[`${obj.genAt}-blacklist`];

                const container = document.querySelector(obj.container);
                container.style.display = 'block';
                let data = obj.genValue;
                if (obj.splitBy) {
                    data = obj.genValue.split(obj.splitBy);
                    // if more then one item and not a item which requested to be whole
                    data.forEach((word) => {
                        // console.log(word);
                        // TODO: if a user want to force remove from  blacklist, give them the option. and add to whitelist.
                        if (
                            !blackList.has(word.toLowerCase())
                            && !whiteList.has(word.toLowerCase())
                            ) {
                            word = `${word}`;
                            $(`.${obj.genAt}`)[0].value += word;
                            let inputField = document.querySelector(`.${obj.genAt}`);
                            inputField.dispatchEvent(event);
                        }
                    })
                } else {
                    if (
                        !blackList.has(data.toLowerCase())
                        && !whiteList.has(data.toLowerCase())
                    ) {
                        //  a item which requested to be whole
                        if (!obj.allowOverWrite) {
                            $(`.${obj.genAt}`)[0].value += data;
                        }
                        else {
                            $(`.${obj.genAt}`)[0].value = data;
                        }
                        let inputField = document.querySelector(`.${obj.genAt}`);
                        // console.log(data);
                        inputField.dispatchEvent(event);
                    }
                }

            })
        }
        // console.log(this.whiteListPayload);
        // console.log(this.blackListPayload);
    }


    handleBrowse = () => {
        if (!this.file) {
            document.querySelector('.custom-file-input').click();

        }
    }
    handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.add("dragover");
    }

    handleDragEnter = (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.remove("dragenter");
    }
    handleDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.remove("dragover");
    }

    handleFileDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const label = document.querySelector('.pgen-upload-label');
        const inputEl = document.querySelector('.custom-file-input');
        const files = event.dataTransfer.files;
        if (inputEl.hasAttribute('set')) {
            const fileName = inputEl.getAttribute('set');
            return label.innerHTML = `
            <p style="color:orangered">Sorry,  But this Pigeon can only carry one file at the time!</p> Selected: <b>${fileName}</b>`;
        }
        event.currentTarget.classList.remove("dragover");
        if (files.length > 0) {
            // Handle dropped files here
            this.file = files[0];
            this.formEl.append('image', this.file);
            label.innerHTML = `Selected ${files[0].name}`;
            inputEl.setAttribute('set',files[0].name);
        }
    }
    createPushButtons() {
        // Create an array of radio button labels and values
        const buttonOptions = [
            { label: "Sales Type Post", className: "btn btn-primary btn-sm ", role: "button", value: 'sales' },
            { label: "Information Type Post", className: "btn btn-secondary btn-sm", role: "button", value: 'info' },
        ];

        // Create a container div for the buttons
        const containerDiv = document.createElement("div");
        containerDiv.style.display = "flex"; // Add display: flex;
        containerDiv.style.marginTop = "5px";
        containerDiv.style.alignItems = "center"; // Add align-items: center;
        containerDiv.style.padding = "0px"; // Add padding: 0px;

        // Loop through the buttonOptions array to create buttons
        buttonOptions.forEach((option) => {
            const buttonElement = document.createElement("a");
            buttonElement.href = "#";
            buttonElement.setAttribute('value',option.value);
            buttonElement.className = option.className;
            buttonElement.style.marginLeft = '7px';
            buttonElement.role = option.role;
            buttonElement.textContent = option.label;
            buttonElement.addEventListener("click", (event) => {
                this.formEl.delete('genType');
                this.formEl.append('genType',event.target.getAttribute('value'))
            });
            containerDiv.appendChild(buttonElement);
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
    createListsButton(popup) {
        // Create reset lists button
        const resetListsButton = document.createElement("button");
        resetListsButton.innerText = "Reset Blacklist";
        resetListsButton.classList.add('btn-info');
        resetListsButton.classList.add('btn');
        resetListsButton.style.position = "absolute";
        resetListsButton.style.bottom = "20px";
        resetListsButton.style.right = "15px";
        resetListsButton.addEventListener("click", (event) => {
        Object.entries(this.blackListPayload).forEach((set) => {
            set[1].clear();
        })
        event.stopPropagation();
        event.preventDefault();
        });
        return resetListsButton;
    }
    createBaseView(darkMode = true) {
        const popup = document.createElement("div");

        popup.classList.add("popup-view");
        popup.style.width = "400px";
        if (darkMode) {
            popup.style.backgroundColor = '#333333';
            popup.style.color = '#ffffff';
        }
        else {
            popup.style.backgroundColor = "white";
        }
        popup.style.minHeight = "200px";
        popup.style.border = "1px solid #ccc";
        popup.style.position = "fixed";
        popup.style.top = "100px";
        popup.style.left = "70%";
        popup.style.padding = "20px";
        popup.setAttribute('draggable','true');
        popup.style.zIndex = "9999";
        const formData = new FormData();
        this.formEl = formData;
        // console.log("formData Created");
        // console.log(this.formEl);


        // Event listener for mouse down on the draggable element
        popup.addEventListener('mousedown', (e) => {
            if (e.target === popup) {
                e.preventDefault();
                this.isDragging = true;
                // Calculate the offset between the mouse position and the element's position
                this.offsetX = e.clientX - popup.getBoundingClientRect().left;
                this.offsetY = e.clientY - popup.getBoundingClientRect().top;
                // Change cursor style
                popup.style.cursor = 'grabbing';
                // Prevent default browser behavior
            }

        });
        return popup;
    }
    injectView() {
        // Create a div element for the popup
        const popup = this.createBaseView();

        // Create popup close button
        const closeButton = this.createCloseButton(popup);
        popup.appendChild(closeButton);
        const resetListsButton = this.createListsButton(popup);
        popup.appendChild(resetListsButton);
        // Create pushDiv input
        const pushDiv = this.createPushButtons();
        popup.appendChild(pushDiv);
        //  Create file input
        const fileDiv = this.createFileBrowserButton();
        popup.appendChild(fileDiv);
        //  Create inputs fields
        this.createInputs(popup);

        const submitButton = this.createSubmitButton(false, 'Render');
        popup.appendChild(submitButton);
        const improveButton = this.createSubmitButton(true, 'Improve');
        popup.appendChild(improveButton);
        // spawn popup
        this.spawnPopUp(popup);

    }

    createSubmitButton(improve = false, nodeText) {
        // Create submit button
        const submitButton = document.createElement("button");
        submitButton.innerText = nodeText;
        if (improve) {
            submitButton.style.display = 'none';
            submitButton.classList.add('improve');
            submitButton.classList.add('btn-success');
        }
        submitButton.classList.add('btn-primary');
        submitButton.classList.add('btn');
        submitButton.style.marginLeft = '3px';
        submitButton.addEventListener("click", (event) => {
            event.stopPropagation();
            event.preventDefault();
            this.onSubmitClicked(improve);
            //  popup.remove();
        });
        return submitButton;
    }
    createInputs(popup) {
        const inputs = [
            {
                textNode:'Pgen AI - Product Name Options:',
                containerClass: 'pgen-name-container',
                inputClass:'tag-input pgen-name',
                inputType: 'text',
                inputPlaceHolder: '',
            },
            {
                textNode:'Pgen AI - Suggested Product Description:',
                containerClass: 'pgen-description-container',
                inputClass:'pgen-description',
                inputType: 'textarea',
                inputPlaceHolder: '',
                minHeight: '300px',
                noTags: true
            },
            {
                textNode:'Pgen AI - Product Keyword Options:',
                containerClass: 'pgen-keywords-container',
                inputClass:'tag-input pgen-keywords',
                inputType: 'text',
                inputPlaceHolder: '',
            },
            {
                textNode:'Pgen AI - Product Brand Options:',
                containerClass: 'pgen-brand-container',
                inputClass:'tag-input pgen-brand',
                inputType: 'text',
                inputPlaceHolder: '',
            },

        ]
        inputs.forEach((input) => {
            let container = document.createElement("div");
            container.appendChild(document.createTextNode(`${input.textNode}`));
            container.appendChild(document.createElement('br'));
            container.classList.add(`${input.containerClass}`);
            container.style.display = 'none';
            let inputEl = null;
            if (input.inputType !== "textarea") {
                 inputEl = document.createElement("input");
            } else {
                 inputEl = document.createElement("textarea");
            }
            inputEl.className = input.inputClass;
            inputEl.style.marginTop = "10px";
            inputEl.style.marginBottom = "10px";
            inputEl.style.minHeight = input.minHeight ? input.minHeight : '';
            inputEl.style.width = "100%";
            inputEl.style.border = "none";
            inputEl.style.outline = "none";
            container.appendChild(inputEl);
            popup.appendChild(container);
            if (!input.noTags) {
                this.createTagInput(inputEl, container);
            }
            inputEl.value = '';
            inputEl.innerText = '';
            inputEl.innerHTML = '';
        });
    }
    createTagInput(inputField, container) {
        const ogClass = inputField.className.split(' ')[1];
        if (! this.whiteListPayload[`${ogClass}-whitelist`]) {
            this.whiteListPayload[`${ogClass}-whitelist`] = new Set();
        }
        if (! this.blackListPayload[`${ogClass}-blacklist`]) {
            this.blackListPayload[`${ogClass}-blacklist`] = new Set();
        }
        const whiteList = this.whiteListPayload[`${ogClass}-whitelist`];
        const blackList = this.blackListPayload[`${ogClass}-blacklist`];
        // called on every enter keyword, and on first view init.
        inputField.addEventListener("keydown", (event) => {
            if (event.key === "," || event.key === "Enter") {
                event.preventDefault();
                const tagValue = inputField.value.trim();
                if (tagValue) {
                    if (!whiteList.has(tagValue.toLowerCase())) {
                        whiteList.add(tagValue.toLowerCase());
                        const tagElement = document.createElement("span");
                        tagElement.classList.add('badge');
                        tagElement.classList.add(`${ogClass}-badge`);
                        tagElement.classList.add('bg-primary');
                        tagElement.innerText = tagValue;
                        tagElement.style.marginTop = '5px';
                        tagElement.style.marginLeft = '5px';

                        // this.improveDataPayload[`${ogClass}-improve`].add(tagValue.toLowerCase());
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
                            // remove from whitelist
                            whiteList.delete(tagValue.toLowerCase());
                            // add to blacklist.
                            blackList.add(tagValue.toLowerCase());
                            tagElement.remove();
                        });

                        tagElement.appendChild(removeButton);
                        container.insertBefore(tagElement, inputField);
                        // Clear the input field
                        inputField.value = "";
                    }
                }
            }
        });

    }
    spawnPopUp(popup) {
        const popupSpawnLocation = document.querySelector(this.popupSpawnLocation);
        if (popupSpawnLocation) {
            popupSpawnLocation.appendChild(popup);
        }
    }
}

// injection system for dependency scripts (cdn)
document.onreadystatechange = () => {
    const popup = document.querySelector('.popup-view');
    const scriptsLink = [
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.min.js',
        'https://code.jquery.com/jquery-3.7.1.slim.min.js'
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
        pgenai = new Pgenai(popupSpawnLocation);
    }

    document.addEventListener('mouseup', (e) => {
        if (document.readyState === "complete") {
            if (pgenai.isDragging) {
                pgenai.isDragging = false;
                const popup = document.querySelector('.popup-view');
                // Calculate new position
                const x = e.clientX - pgenai.offsetX;
                const y = e.clientY - pgenai.offsetY;
                // Apply the new position to the element
                popup.style.left = `${x}px`;
                popup.style.top = `${y}px`;
            }
        }
    });
}

