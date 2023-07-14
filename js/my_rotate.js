const rotateWordSpan = document.getElementById('rotate-word');
const words = ['iOS App', 'Website', 'Game', 'Back-end', 'Software'];
let currentWordIndex = 0;
const colors = ['#BF616A', '#D08770', '#EBCB8B', '#A3BE8C', '#B48EAD']

function changeWord() {
    rotateWordSpan.innerText = words[currentWordIndex];
    rotateWordSpan.style.color = colors[currentWordIndex];
    currentWordIndex = currentWordIndex < words.length - 1 ? currentWordIndex + 1 : 0;
}

changeWord();
setInterval(changeWord, 2000);
