// @ts-check

/** @type {{ [key: string]: string }} */
const COWS = {
    'cow':   '^__^\n(oo)\\____\n(__)\\\n    ||---\n    ||',
    'goose': "      _.-.\n __.-( o  \\\n'--'-'._   \\\n        '.  \\\n          \\\n           \\",
    'pig':   '      ,.\n     (_|,.\n    ,\' /, )____\n __j o``-\'\n(")\n`-j\n   `-._(\n      |_\\  |---\n     /_]\'|_|\n        /_]\''
};

/** Auto run main method */
function main() {
    const cowElement = document.getElementById('cowsay-cow');
    if (!cowElement) return;
    const numVisits = Number.parseInt(localStorage.getItem('numVisits') || '0');
    localStorage.setItem('numVisits', `${numVisits + 1}`);
    const cowNames = Object.keys(COWS);
    const numCows = cowNames.length;
    const cowIndex = numCows > 0 ? numVisits % numCows : 0; 
    cowElement.textContent = COWS[cowNames[cowIndex]];
}

main();
