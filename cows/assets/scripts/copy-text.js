// @ts-check

/** in seconds */
const SNACK_TIMEOUT = 3;

/** Copies the terminal-input text to the user's clipboard */
function copyTerminalInputText() {
    const inputDiv = document.getElementById("terminal-input");
    if (!inputDiv) return;

    const textToCopy = inputDiv.innerText;
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
        showCopyTerminalInputTextSnack();
    }).catch(err => {
        console.error('Error copying text: ', err);
    });
}

/** Displays a snack to the webpage notifying user the terminal-input text was copied */
function showCopyTerminalInputTextSnack() {
    const snack = document.getElementById("copy-terminal-input-text-snack");
    if (!snack) return;
    snack.style.visibility = 'visible';
    snack.style.opacity = '1';

    setTimeout(() => {
        snack.style.visibility = 'hidden';
        snack.style.opacity = '0';
    }, SNACK_TIMEOUT * 1000);
}
