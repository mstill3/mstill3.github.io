// @ts-check

// Global variables

/** @type {HTMLSelectElement} */
// @ts-ignore
const cowSelectBox = document.getElementById('cow-input');
/** @type {HTMLSelectElement} */
// @ts-ignore
const cowMethodSelectBox = document.getElementById('cow-method');
/** @type {HTMLInputElement} */
// @ts-ignore
const cowMessageInput = document.getElementById('cow-message');

let selectedCow = '';
let selectedCowFileContent = '';
let selectedCowFormattedContent = '';
/** @type {'cowsay' | 'cowthink'} */
let selectedCowMethod = 'cowsay';
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
    if (data && data.content) {
      return atob(data.content); // Decode from base64
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
    const thoughtChar = selectedCowMethod === 'cowsay' ? '\\' : 'o';
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
  terminalInputDivElement.innerText = `echo "${inputCowMessage}" | ${selectedCowMethod} -f ${selectedCow}`;
  terminalOutputDivElement.innerText = selectedCowFormattedContent;
  attributionDivElement.innerHTML = 'aabbcc';
}

/** 
 * Handles change event for cow select box
 */
async function handleCowSelectChange() {
  const selectedInputCow = cowSelectBox.value;
  if (selectedInputCow) {
    selectedCow = selectedInputCow
    selectedCowFileContent = await getCowFileContents(selectedCow);
    selectedCowFormattedContent = formatCow(selectedCowFileContent);
  }
  redrawCow();
}

/** 
 * Handles change event for cow method select box
 */
function handleCowMethodChange() {
  const selectedMethod = cowMethodSelectBox.value;
  if (selectedMethod) {
    // @ts-ignore
    selectedCowMethod = selectedMethod;
  }
  redrawCow();
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
  // Get cow file names
  const cowFileNames = await getCowFileNames();

  // Set as options in the cowSelectBox
  
  if (!cowSelectBox || !cowMethodSelectBox || !cowMessageInput) return;

  // Clear any existing options
  cowSelectBox.innerHTML = '';

  // Add each cow file name as an option
  cowFileNames.forEach(cowFileName => {
    const option = document.createElement('option');
    option.value = cowFileName; // Set the value to the cow name
    option.textContent = cowFileName; // Set the displayed text to the cow name
    cowSelectBox.appendChild(option);
  });

  // Attach event listeners
  cowSelectBox.addEventListener('change', handleCowSelectChange);
  cowMethodSelectBox.addEventListener('change', handleCowMethodChange);
  cowMessageInput.addEventListener('input', handleCowMessageChange);
}

// Execute the function on page load
onPageLoad();

