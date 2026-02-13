// @ts-check

// Global variables

/** @type {HTMLSelectElement | null} */
// @ts-ignore
const cowSelectBox = document.getElementById('cow-input');
/** @type {HTMLInputElement | null} */
// @ts-ignore
const cowMessageInput = document.getElementById('cow-message');

/** @type {string[]} */
let cowFileNames = [];

let inputCowMessage = '';
let selectedCow = '';
let selectedCowFileContent = '';
let selectedCowFormattedContent = '';
let selectedCowAttributes = '';

/** @type {HTMLElement} */
// @ts-ignore
const terminalInputDivElement = document.getElementById('terminal-input');
/** @type {HTMLElement} */
// @ts-ignore
const terminalOutputDivElement = document.getElementById('terminal-output');
/** @type {HTMLElement} */
// @ts-ignore
const attributionDivElement = document.getElementById('attributions');

/** 
 * Responds with a random integer within a given range (min <= n < max)
 * @param {number} min - minimum range value (inclusive)
 * @param {number} max - maximum range value (exclusive)
 * @returns {number} ranger integer within specified range
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 
 * Fetches HTML response as JSON
 * @param {string} url Input URL to hit
 * @returns {Promise<{name: string}[]>} URL response
 */
async function simplyFetch(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return [];
    }
}

/**
 * Fetches the content of a specific file from a GitHub repository.
 * @param {string} owner Repository owner's username
 * @param {string} repo Repository name
 * @param {string} path Path to the specific file in the repository
 * @returns {Promise<string>} Contents of the file
 */
async function fetchFileFromGitHub(owner, repo, path) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    try {
        const response = await fetch(url);

        // Check if response is ok
        if (!response.ok) {
            if (response.status === 403) {
                alert("Github API rate limit hit. Please wait a few moments before trying again.");
            }
            throw new Error('Network response was not ok. Status: ' + response.status);
        }

        const data = await response.json();
        // Decode content if it's base64 encoded
        if (data?.content) {
            const base64Content = data.content;
            const binaryString = atob(base64Content);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);

            // Convert binary string to byte array
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            // Use TextDecoder to handle UTF-8
            const decoder = new TextDecoder('utf-8');
            return decoder.decode(bytes);
        }

        throw new Error('File content is not available');
    } catch (error) {
        console.error('Error fetching the file:', error);
        return '';
    }
}

/** 
 * Fetches the cow file names from GitHub repository
 * @returns {Promise<string[]>} cow file names
 */
async function getCowFileNames() {
  const cowsGithubApiResp = await simplyFetch('https://api.github.com/repos/mstill3/cowsay-files/contents/cows');
  return cowsGithubApiResp.map(row => row.name.replace('.cow', ''));
}

/** 
 * Fetches the cow file from GitHub repository by cow name
 * @param {string} cowFileName input cow file to read
 * @returns {Promise<string>} cow file contents
 */
async function getCowFileContents(cowFileName) {
  const cowGithubApiResp = await fetchFileFromGitHub('mstill3', 'cowsay-files', `cows/${cowFileName}.cow`);
  console.log(cowGithubApiResp);
  return cowGithubApiResp;
}

/**
 * Splits a given sentence string into an array of line strings to fit a given width and word splitting
 * @param {string} sentence input sentence to split into lines
 * @param {number} maxLineWidth max width for each line
 * @returns {string[]} lines string array of substrings from input sentence
 */
function splitIntoLines(sentence, maxLineWidth) {
    const words = sentence.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
        // Check if the current word exceeds the maximum width
        if (word.length > maxLineWidth) {
            // If there's already content in the current line, push it to lines
            if (currentLine.length > 0) {
                lines.push(currentLine.trim());
                currentLine = '';
            }

            // Split the long word into chunks of maxLineWidth
            for (let i = 0; i < word.length; i += maxLineWidth - 2) {
                lines.push(word.slice(i, i + maxLineWidth - 2));
            }
        } else {
            // Check if adding this word exceeds the max line width
            if (currentLine.length + word.length + 1 > maxLineWidth) {
                if (currentLine.length > 0) {
                    lines.push(currentLine.trim());
                    currentLine = '';
                }
            }

            // Append the word to the current line with a space
            currentLine += word + ' ';
        }
    }

    // Add any remaining words in currentLine to lines
    if (currentLine.length > 0) {
        lines.push(currentLine.trim());
    }

    return lines;
}

/**
 * Generates the cowsay message banner
 * @param {string} message what the cow is to say
 * @returns {string} formatted message within the ascii banner
 */
function generateCowMessageBanner(message) {
    const MAX_COW_MESSAGE_LINE_WIDTH = 40;
    const width = Math.min(message.length + 2, MAX_COW_MESSAGE_LINE_WIDTH);
    const horizontalLine = '─'.repeat(width);

    const messageLines = splitIntoLines(message, MAX_COW_MESSAGE_LINE_WIDTH);

    if (messageLines.length == 1) return ` ${horizontalLine}\n< ${message} >\n ${horizontalLine}`;

    /** @type {string[]} */
    let messageBannerLines = [];
    messageBannerLines.push(` ${horizontalLine}`);
    for(let lineNum = 0; lineNum < messageLines.length; lineNum++) {
        const messageChunk = messageLines[lineNum];

        // Fill the message chunk with trailing spaces to meet the max width
        const spaceFillAmount = width - messageChunk.length - 2;
        const filledMessageChunk = messageChunk + ' '.repeat(Math.max(spaceFillAmount, 0));

        if (lineNum === 0) {
            messageBannerLines.push(`/ ${filledMessageChunk} \\`);
        } else if (lineNum === messageLines.length - 1) {
            messageBannerLines.push(`\\ ${filledMessageChunk} /`);
        } else {
            messageBannerLines.push(`| ${filledMessageChunk} |`);
        }
    }
    messageBannerLines.push(` ${horizontalLine}`);
    return messageBannerLines.join('\n');
}

/** Formats the cow properly for web view
 * @param {string} selectedCowFileContent input cow file content
 * @returns {string} just the cow portion, properly formatted for web view
 */
function formatCow(selectedCowFileContent) {
    // Split the content into lines using the correct newline character
    let selectedCowFileContentLines = selectedCowFileContent.split('\n');

    const thoughtChar = '\\';
    const eyeChar = 'o';
    const eyesStr = 'oo';
    const tongueChar = '';

    // Remove trailing spaces, filter out empty lines and comments
    let formattedCow = selectedCowFileContentLines
        .map(line => line.replace(/\s+$/, ''))                      // trim trailing whitespace
        .map(line => line.replace('EOC', ''))
        .map(line => line.replace('$the_cow = <<;', ''))            // remove message banner for now
        .map(line => line.replace('$the_cow = <<"";', ''))          // remove message banner for now
        .map(line => line.replace('$eye = chop($eyes);', ''))
        .map(line => line.replaceAll('\\@', '@'))
        .map(line => line.replaceAll('\\\\', '\\'))
        .map(line => line.replace('$thoughts', thoughtChar))
        .map(line => line.replace('${thoughts}', thoughtChar))
        .map(line => line.replace('$eyes', eyesStr))
        .map(line => line.replace('${eyes}', eyesStr))
        .map(line => line.replaceAll('$eye', eyeChar))
        .map(line => line.replaceAll('${eye}', eyeChar))
        .map(line => line.replaceAll('$tongue', tongueChar))
        .map(line => line.replaceAll('${tongue}', tongueChar))
        .filter(line => line.length > 0 && !line.startsWith('#'));  // Remove empty lines and comments

    // Join the valid lines back together
    return formattedCow.join('\n');
}

/**
 * Extracts the attributions from the input cow file content
 * @param {string} selectedCowFileContent input cow file content
 * @returns {string} just the attributions portion
 */
function pullAttributes(selectedCowFileContent) {
    return selectedCowFileContent.split('\n')
        .map(line => line.replace(/\s+$/, ''))
        .filter(line => line.length > 0 && line.startsWith('#'))
        .map(line => line.replace('# ', ''))
        .join('\n');
}

/** Clears and renders the cow, attributions, and input terminal text within the webpage */
async function redrawCow() {
    terminalInputDivElement.innerText = `echo "${inputCowMessage}" | cowsay -f ${selectedCow}`;
    const cowMessageBanner = generateCowMessageBanner(inputCowMessage);
    terminalOutputDivElement.innerText = cowMessageBanner + '\n' + selectedCowFormattedContent;
    attributionDivElement.innerText = selectedCowAttributes;
}

/**
 * Logic to handle changing a selected cow
 * @param {string} cowName cow to switch to
 */
async function setCow(cowName) {
    selectedCow = cowName;
    selectedCowFileContent = await getCowFileContents(selectedCow);
    selectedCowFormattedContent = formatCow(selectedCowFileContent);
    selectedCowAttributes = pullAttributes(selectedCowFileContent);
    redrawCow();
}

/** Handles change event for cow select box */
function handleCowSelectChange() {
    if (!cowSelectBox) return;
    const selectedInputCow = cowSelectBox.value;
    if (!selectedInputCow) return;
    setCow(selectedInputCow);
}

/** Handles change event for cow message input */
function handleCowMessageChange() {
    if (!cowMessageInput) return;
    inputCowMessage = cowMessageInput.value;
    redrawCow();
}

/** Executes on page load */
async function onPageLoad() { 
    if (!cowSelectBox || !cowMessageInput) return;

    // set default input message
    const defaultMessage = 'hello world';
    inputCowMessage = defaultMessage;
    cowMessageInput.value = defaultMessage; 

    // Attach event listeners
    cowSelectBox.addEventListener('change', handleCowSelectChange);
    cowMessageInput.addEventListener('input', handleCowMessageChange);

    // Get cow file names
    cowFileNames = await getCowFileNames();

    // Clear any existing options
    cowSelectBox.innerHTML = '';

    // Add each cow file name as an option
    cowFileNames.forEach(cowFileName => {
        const option = document.createElement('option');
        // Set the value to the cow name
        option.value = cowFileName;
        // Set the displayed text to the cow name
        option.textContent = cowFileName;
        cowSelectBox.appendChild(option);
    });

    // auto load random cow
    if (cowFileNames.length > 0) {
        const randomCowIndex = getRandomInt(0, cowFileNames.length);
        console.log(randomCowIndex);
        setCow(cowFileNames[randomCowIndex]);
    }
}

/**
 * On key press logic.  
 * Conditionally switch cow files
 * @param {KeyboardEvent} event input key event
 */
function handleKeyPress(event) {
    if (cowFileNames.length > 0) {
        const currentCowIndex = cowFileNames.indexOf(selectedCow);
        let newCowIndex = currentCowIndex;
        if (event.key === 'P') {
            newCowIndex = (currentCowIndex > 0) ? currentCowIndex - 1 : cowFileNames.length - 1;
        } else if (event.key === 'N') {
            newCowIndex = (currentCowIndex < cowFileNames.length - 1) ? currentCowIndex + 1 : 0;
        }
        const newCowName = cowFileNames[newCowIndex];
        setCow(newCowName);
        if (!cowSelectBox) return;
        cowSelectBox.value = newCowName;
    }
}

// Execute the function on page load
onPageLoad();

// add key listener
document.addEventListener('keydown', handleKeyPress);
