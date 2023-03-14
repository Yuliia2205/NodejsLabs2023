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

// Given an integer x, return true if x is a palindrome, and false otherwise.

function isPalindrome(x) {
    if (x < 0) {
        return false;
    }

    const numStr = x.toString();
    const length = numStr.length;

    for (let i = 0; i < length / 2; i++) {
        if (numStr[i] !== numStr[length - 1 - i]) {
            return false;
        }
    }

    return true;
}

console.log("\nx is a palindrome:")
console.log(isPalindrome(31413));
console.log(isPalindrome(314413));
console.log(isPalindrome(42));
console.log(isPalindrome(-42));

// Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
//
// An input string is valid if:
//
// Open brackets must be closed by the same type of brackets.
//     Open brackets must be closed in the correct order.
//     Every close bracket has a corresponding open bracket of the same type.

function isValid(s) {
    const stack = [];

    for (let i = 0; i < s.length; i++) {
        const char = s.charAt(i);

        if (char === '(' || char === '{' || char === '[') {
            stack.push(char);
        } else if (char === ')' && stack.length > 0 && stack[stack.length - 1] === '(') {
            stack.pop();
        } else if (char === '}' && stack.length > 0 && stack[stack.length - 1] === '{') {
            stack.pop();
        } else if (char === ']' && stack.length > 0 && stack[stack.length - 1] === '[') {
            stack.pop();
        } else {
            return false;
        }
    }

    return stack.length === 0;
}

console.log("\nBrackets:")
console.log(isValid("{()}[]"))
console.log(isValid("{([])}"))
console.log(isValid("([])}"))