// Global variables
const rotateWordSpan = document.getElementById('rotate-word');
const words = ['iOS-App', 'Website', 'Game', 'Back-end', 'Software'];
const colors = ['#BF616A', '#D08770', '#EBCB8B', '#A3BE8C', '#B48EAD']
let currentWordIndex = 0;


// Changes the currently shown word
const changeWord = async() => {
    let currentWord = words[currentWordIndex];
    let currentColor = colors[currentWordIndex];

    rotateWordSpan.style.color = currentColor;
    rotateWordSpan.innerText = "";

    // type in word, one letter at a time
    for(var i = 0; i < currentWord.length; i++) {
        let currentLetter = currentWord[i];
        rotateWordSpan.innerText += currentLetter;
        // time to wait after adding a letter
        await sleep(200);
    }

    // show full word time
    await sleep(500);

    // remove letters from word
    for(var i = 0; i < currentWord.length; i++) {
        let currentWord = rotateWordSpan.innerText;
        let trimWord = currentWord.substring(0, currentWord.length - 1);
        console.log(currentWord, trimWord)
        rotateWordSpan.innerText = trimWord;
        // time to wait after removing a letter
        await sleep(200);
    }

    // time to show no word
    await sleep(200);

    // move index to next word
    currentWordIndex = currentWordIndex < words.length - 1 ? currentWordIndex + 1 : 0;

    // call this method again
    await changeWord();
}

// waits for given number of milliseconds
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// Auto run main method
const main = async() => {
    await changeWord();
}

main();
