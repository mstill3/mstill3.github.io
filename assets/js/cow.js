// @ts-check

/** Auto run main method */
function main() {
    const cowElement = document.getElementById('cowsay-cow');
    if (!cowElement) return;
    cowElement.textContent = `^__^\n(oo)\\____\n(__)\\\n    ||---\n    ||`;
}

main();
