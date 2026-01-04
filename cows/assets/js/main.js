// @ts-check

// Global variables

/** @type {HTMLSelectElement | null} */
// @ts-ignore
const cowSelectBox = document.getElementById('cow-input');
/** @type {HTMLInputElement | null} */
// @ts-ignore
const cowMessageInput = document.getElementById('cow-message');

let selectedCow = '';
let selectedCowFileContent = '';
let selectedCowFormattedContent = '';
let inputCowMessage = '';

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
 * Fetches HTML response
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
 * @returns {Promise<string[]>} Array of cow file names
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
 * @param {string} selectedCowFileContent
 * @returns {string}
 */
function formatCow(selectedCowFileContent) {
    console.log({ selectedCowFileContent });

    // Split the content into lines using the correct newline character
    let selectedCowFileContentLines = selectedCowFileContent.split('\n');

    const messageBubble = 'asassa';
    const thoughtChar = '\\';
    const eyeChar = 'o';
    const eyesStr = 'oo';
    const toungeChar = '';

    // Remove trailing spaces, filter out empty lines and comments
    let formattedCow = selectedCowFileContentLines
        .map(line => line.replace(/\s+$/, '')) // Trim trailing whitespace
        .map(line => line.replace('EOC', ''))
        .map(line => line.replace('$the_cow = <<;', messageBubble)) // remove top
        .map(line => line.replace('$the_cow = <<"";', messageBubble)) // remove top
        .map(line => line.replace('$eye = chop($eyes);', ''))
        .map(line => line.replaceAll('\\\\', '\\'))
        .map(line => line.replace('$thoughts', thoughtChar))
        .map(line => line.replace('${thoughts}', thoughtChar))
        .map(line => line.replace('$eyes', eyesStr))
        .map(line => line.replace('${eyes}', eyesStr))
        .map(line => line.replaceAll('$eye', eyeChar))
        .map(line => line.replaceAll('${eye}', eyeChar))
        .map(line => line.replaceAll('$tounge', toungeChar))
        .map(line => line.replaceAll('${tounge}', toungeChar))
        .filter(line => line.length > 0 && !line.startsWith('#')); // Remove empty lines and comments

    // Join the valid lines back together
    return formattedCow.join('\n');
}

async function redrawCow() {
    terminalInputDivElement.innerText = `echo "${inputCowMessage}" | cowsay -f ${selectedCow}`;
    terminalOutputDivElement.innerText = selectedCowFormattedContent;
    attributionDivElement.innerHTML = 'aabbcc';
}

/**
 * 
 * @param {string} cowName 
 */
async function setCow(cowName) {
    selectedCow = cowName;
    selectedCowFileContent = await getCowFileContents(selectedCow);
    selectedCowFormattedContent = formatCow(selectedCowFileContent);
    redrawCow();
}

/** 
 * Handles change event for cow select box
 */
function handleCowSelectChange() {
    if (!cowSelectBox) return;
    const selectedInputCow = cowSelectBox.value;
    if (!selectedInputCow) return;
    setCow(selectedInputCow);
}

/** 
 * Handles change event for cow message input
 */
function handleCowMessageChange() {
    if (!cowMessageInput) return;
    inputCowMessage = cowMessageInput.value;
    redrawCow();
}

/** 
 * Executes on page load
 */
async function onPageLoad() { 
    if (!cowSelectBox || !cowMessageInput) return;

    // Attach event listeners
    cowSelectBox.addEventListener('change', handleCowSelectChange);
    cowMessageInput.addEventListener('input', handleCowMessageChange);

    // Get cow file names
    const cowFileNames = await getCowFileNames();

    // Clear any existing options
    cowSelectBox.innerHTML = '';

    // Add each cow file name as an option
    cowFileNames.forEach(cowFileName => {
        const option = document.createElement('option');
        option.value = cowFileName; // Set the value to the cow name
        option.textContent = cowFileName; // Set the displayed text to the cow name
        cowSelectBox.appendChild(option);
    });
    if (cowFileNames.length > 0) {
        setCow(cowFileNames[0]);
    }
}

// Execute the function on page load
onPageLoad();
