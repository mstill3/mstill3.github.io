const rotateWordSpan = document.getElementById('rotate-word');
const words = ['iOS-App', 'Website', 'Game', 'Back-end', 'Software'];
let currentWordIndex = 0;
const colors = ['#BF616A', '#D08770', '#EBCB8B', '#A3BE8C', '#B48EAD']

async function changeWord() {
    let currentWord = words[currentWordIndex];
    let currentColor = colors[currentWordIndex];
    rotateWordSpan.style.color = currentColor;
    rotateWordSpan.innerText = "";
    for(var i = 0; i < currentWord.length; i++) {
        let currentLetter = currentWord[i];
        rotateWordSpan.innerText += currentLetter;
        await sleep(200);
    }
    await sleep(500);
    for(var i = 0; i < currentWord.length; i++) {
        let currentWord = rotateWordSpan.innerText;
        let trimWord = currentWord.substring(0, currentWord.length - 1);
        console.log(currentWord, trimWord)
        rotateWordSpan.innerText = trimWord;
        await sleep(100);
    }
    await sleep(200);
    // rotateWordSpan.innerText = currentWord;
    currentWordIndex = currentWordIndex < words.length - 1 ? currentWordIndex + 1 : 0;
    changeWord();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

changeWord();
