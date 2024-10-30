// @ts-check

// Global variables
const colors = ['#BF616A', '#D08770', '#EBCB8B', '#A3BE8C', '#B48EAD'];
let currentWordIndex = 0;
const delete_letter_speed =  100;
const rotateWordSpan = document.getElementById('rotate-word');
const show_no_word_time =  100;
const show_word_time =  600;
const type_letter_speed =  200;
const words = ['iOS-App', 'Website', 'Game', 'Back-end', 'Software'];

/** 
 * Changes the currently shown word
 */
async function changeWord() {
    let currentWord = words[currentWordIndex];

    if (!rotateWordSpan) {
        return;
    }

    rotateWordSpan.style.color = colors[currentWordIndex];
    rotateWordSpan.innerText = '';

    // type in word, one letter at a time
    for(const letter of currentWord) {
        rotateWordSpan.innerText += letter;
        await sleep(type_letter_speed);
    }

    await sleep(show_word_time);

    // remove letters from word
    for(const letter of currentWord) {
        let typedWord = rotateWordSpan.innerText;
        rotateWordSpan.innerText = typedWord.substring(0, typedWord.length - 1);
        await sleep(delete_letter_speed);
    }

    await sleep(show_no_word_time);

    // move index to next word
    currentWordIndex = currentWordIndex < words.length - 1 ? currentWordIndex + 1 : 0;

    // call this method again
    await changeWord();
}

/** 
 * waits for given number of milliseconds
 * @param {number} ms Number of milliseconds to wait
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/** Auto run main method */
async function main() {
    await changeWord();
}

main();
