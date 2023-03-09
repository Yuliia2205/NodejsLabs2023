//Replace every letter with its position in the alphabet.
// If anything in the text isn't a letter, ignore it and don't return it.
function alphabetPosition(text) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const positions = [];
    for (let i = 0; i < text.length; i++) {
        const letter = text[i].toLowerCase();
        const position = alphabet.indexOf(letter);
        if (position !== -1) {
            positions.push(position + 1);
        }
    }
    return positions.join(" ");
}
console.log("Replacing every letter with its position in the alphabet:")
console.log(alphabetPosition("The sunset sets at twelve o' clock."));

//Move the first letter of each word to the end of it, then add "ay" to the end of the word. Leave punctuation marks untouched
function pigIt(str) {
    const words = str.split(" ");
    const pigLatinWords = words.map(word => {
        if (/^[a-zA-Z]+$/.test(word)) { // check if the word is alphabetic
            const firstLetter = word[0];
            const restOfWord = word.slice(1);
            return restOfWord + firstLetter + "ay";
        } else {
            return word;
        }
    });
    return pigLatinWords.join(" ");
}
console.log("\nMoving the first letter of each word to the end of it, then add ay to the end of the word:")
console.log(pigIt('Pig latin is cool')); // igPay atinlay siay oolcay
console.log(pigIt('Hello world !'));     // elloHay orldway !