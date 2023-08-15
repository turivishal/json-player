(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const pasteButton = document.getElementById('paste-button'),
            formatButton = document.getElementById('format-button'),
            copyButton = document.getElementById('copy-button'),
            clearButton = document.getElementById('clear-button'),
            jsonInput = document.getElementById('json-input'),
            aboutButton = document.getElementById('about-button'),
            dynamicModal = document.getElementById('dynamic-modal'),
            dynamicModalMessage = document.getElementById('dynamic-modal-message'),
            closeDynamicModal = document.getElementById('close-dynamic-modal'),
            shareButton = document.getElementById('shareButton'),
            urlParams = new URLSearchParams(window.location.search);
        jsonInput.addEventListener('input', function () {
            JsonInputChange();
        });
        jsonInput.addEventListener('focus', function () {
            JsonInputChange();
        });
        pasteButton.addEventListener('click', function () {
            navigator.clipboard.readText().then(text => {
                if (text) jsonInput.value = text;
            });
        });
        formatButton.addEventListener('click', function () {
            if (jsonInput.value) {
                let b = jsonInput.value.replace(/\n/g, " ").replace(/\r/g, " "),
                    e = [],
                    p = 0,
                    obj = false,
                    i = 0,
                    bLength = b.length;
                for (; i < bLength; i++) {
                    let type = b.charAt(i);
                    if (obj && type === obj) {
                        if ("\\" !== b.charAt(i - 1)) {
                            obj = false;
                        }
                    } else {
                        if (obj || '"' !== type && "'" !== type) {
                            if (obj || " " !== type && "\t" !== type) {
                                if (obj || ":" !== type) {
                                    if (obj || "," !== type) {
                                        if (obj || "[" !== type && "{" !== type) {
                                            if (!(obj || "]" !== type && "}" !== type)) {
                                                p--;
                                                type = "\n" + ' '.repeat(2 * p) + type;
                                            }
                                        } else {
                                            p++;
                                            type = type + ("\n" + ' '.repeat(2 * p));
                                        }
                                    } else {
                                        type = type + ("\n" + ' '.repeat(2 * p));
                                    }
                                } else {
                                    type = type + " ";
                                }
                            } else {
                                type = "";
                            }
                        } else {
                            obj = type;
                        }
                    }
                    e.push(type);
                }
                jsonInput.value = e.join("");
            }
        });
        copyButton.addEventListener('click', function () {
            if (jsonInput.value) {
                try {
                    jsonInput.select();
                    jsonInput.setSelectionRange(0, 99999);
                    navigator.clipboard.writeText(jsonInput.value);
                } catch (error) {
                    console.error('Copy failed:', error);
                    displayModalMessage('Copy failed!', 'error');
                }
            }
        });
        clearButton.addEventListener('click', function () {
            if (jsonInput.value) {
                jsonInput.value = '';
                jsonInput.classList.remove('error');
                jsonInput.classList.remove('success');
            }
        });
        aboutButton.addEventListener('click', function () {
            displayModalMessage(`
                <div>
                    <h2>About JSON Player</h2>
                    <p>Welcome to JSON Player, a tool designed to help developers work with JSON data effectively. JSON (JavaScript Object Notation) is a lightweight data interchange format that's easy for both humans and machines to understand. JSON is commonly used for storing and exchanging data between a server and a web application.</p>
                    <h3>Key Features:</h3>
                    <ul>
                        <li>Prettify your JSON data for better readability.</li>
                        <li>Validate JSON syntax to ensure correct format.</li>
                        <li>Copy formatted JSON to your clipboard with ease.</li>
                    </ul>
                    <h3>Learn More:</h3>
                    <p>Here are some helpful resources to learn more about JSON:</p>
                    <ul>
                        <li><a href="https://www.json.org/" target="_blank" rel="noopener noreferrer">JSON Official Website</a></li>
                        <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON" target="_blank" rel="noopener noreferrer">MDN Web Docs - JSON</a></li>
                        <li><a href="https://www.w3schools.com/js/js_json_intro.asp" target="_blank" rel="noopener noreferrer">W3Schools - JSON Introduction</a></li>
                    </ul>
                    <h3>Usage Instructions:</h3>
                    <ol>
                        <li>Paste your JSON data into the textarea.</li>
                        <li>Click the "Format" button to prettify the JSON for better readability.</li>
                        <li>Click the "Copy" button to copy the formatted JSON to your clipboard.</li>
                        <li>Click the "Clear" button to remove the JSON data from the textarea.</li>
                    </ol>
                    <p>Thank you for using JSON Player. Happy JSON formatting!</p>
                </div>
            `, 'success');
        });
        shareButton.addEventListener('click', function () {
            const jsonValue = jsonInput.value.trim();
            if (jsonValue) {
                const shareURL = window.location.origin + window.location.pathname + '/?j=' + encodeURIComponent(jsonValue);
                setTimeout(() => {
                    navigator.clipboard.writeText(shareURL);
                }, 0);
                prompt('Copied to clipboard ', shareURL);
            }
        });
        function JsonInputChange() {
            if (jsonInput.value) {
                try {
                    JSON.parse(jsonInput.value);
                    jsonInput.classList.remove('error');
                    jsonInput.classList.add('success');
                } catch (error) {
                    jsonInput.classList.remove('success');
                    jsonInput.classList.add('error');
                }
            } else {
                jsonInput.classList.remove('success');
                jsonInput.classList.remove('error');
            }
        }
        function displayModalMessage(message, type) {
            dynamicModalMessage.innerHTML = message;
            if (type === 'error') {
                dynamicModalMessage.classList.add('modal-error');
            } else if (type === 'success') {
                dynamicModalMessage.classList.add('modal-success');
            }
            dynamicModal.style.display = 'block';
            document.body.classList.add('modal-open');
            window.addEventListener('keydown', function (event) {
                if (event.key === 'Escape') {
                    closeModal();
                }
            });          
        }
        function closeModal() {
            dynamicModalMessage.innerHTML = '';
            dynamicModal.style.display = 'none';
            dynamicModalMessage.classList.remove('modal-error', 'modal-success');
            document.body.classList.remove('modal-open');
        }
        closeDynamicModal.addEventListener('click', function () {
            closeModal();
        });
        const sharedJSON = urlParams.get('j');
        if (sharedJSON) {
            jsonInput.value = decodeURIComponent(sharedJSON);
            jsonInput.focus();
        }
    });
})();