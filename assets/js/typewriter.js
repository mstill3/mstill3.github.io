// @ts-check

// Global variables
const COLORS = ['#BF616A', '#D08770', '#EBCB8B', '#A3BE8C', '#B48EAD'];
const DELETE_LETTER_SPEED =  100;
const SHOW_NO_WORD_TIME =  100;
const SHOW_WORD_TIME =  600;
const TYPE_LETTER_SPEED =  200;
const WORDS = ['iOS-App', 'Website', 'Game', 'Back-end', 'Software'];

/** 
 * waits for given number of milliseconds
 * @param {number} ms Number of milliseconds to wait
 * @returns {Promise<void>} completion of waited time
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/** 
 * Changes the currently shown word
 * @param {string} currentWord word to change into
 * @param {string} currentColor color of word to be shown
 * @param {HTMLElement} spanElement HTML element to display the words on
 * @returns {Promise<void>} completion of word change
 */
async function changeWord(currentWord, currentColor, spanElement) {

    spanElement.style.color = currentColor;
    spanElement.innerText = '';

    // type in word, one letter at a time
    for(const letter of currentWord) {
        spanElement.innerText += letter;
        await sleep(TYPE_LETTER_SPEED);
    }

    await sleep(SHOW_WORD_TIME);

    // delete letters from word, one letter at a time
    for (const _letter of currentWord) {
        let typedWord = spanElement.innerText;
        spanElement.innerText = typedWord.substring(0, typedWord.length - 1);
        await sleep(DELETE_LETTER_SPEED);
    }

    await sleep(SHOW_NO_WORD_TIME);
}

/**
 * Auto run main method.  
 * Keeps typing and deleting each colored word to the webpage.
 * @returns {Promise<void>} completion
 */
async function main() {
    let currentWordIndex = 0;
    const rotateWordSpan = document.getElementById('rotate-word');

    if (!rotateWordSpan) return;

    while (true) {
        let currentWord = WORDS[currentWordIndex];
        let currentColor = COLORS[currentWordIndex];

        await changeWord(currentWord, currentColor, rotateWordSpan);

        // move index to next word, loops back around
        currentWordIndex = currentWordIndex < WORDS.length - 1 ? currentWordIndex + 1 : 0;
    }
}

main();
