const wordSpans = document.getElementsByClassName('word');
let currentWordIndex = 0;

function changeWord() {
    for (let i = 0; i < wordSpans.length; i++) {
        wordSpans[i].style.display = "none";
    }
    let currentWordSpan = wordSpans[currentWordIndex];
    // console.log(currentWordSpan);
    currentWordSpan.style.display = "inline";
    currentWordIndex = currentWordIndex < wordSpans.length - 1 ? currentWordIndex + 1 : 0;
}

changeWord();
setInterval(changeWord, 2000);

