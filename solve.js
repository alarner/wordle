const words = require('./5letterwords');

const getMatchingWordMap = (guesses) => (
    words.map(w => {
        const letters = w.split('');
        for(const { word, result } of guesses) {
            const resultArray = result.split('');
            const guessLetters = word.split('');
            for(const [i, r] of resultArray.entries()) {
                if(r === '0') {
                    if(letters.includes(guessLetters[i])) {
                        return 0;
                    }
                }
                else if(r === '1') {
                    if(!letters.includes(guessLetters[i])) {
                        return 0;
                    }
                    if(letters[i] === guessLetters[i]) {
                        return 0;
                    }
                }
                else if(r === '2') {
                    if(letters[i] !== guessLetters[i]) {
                        return 0;
                    }
                }
            }
        }
        return 1;
    })
);

const getLetterLikelihood = (matchingMap) => {
    const letterLikelihood = {};
    for(const [i, matches] of matchingMap.entries()) {
        if(matches) {
            const letters = new Set(words[i].split(''));
            for(const l of letters) {
                if(!letterLikelihood[l]) {
                    letterLikelihood[l] = 1;
                }
                else {
                    letterLikelihood[l]++;
                }
            }
        }
    }
    return letterLikelihood;
}

const getScore = (word, likelihood) => {
    const letters = [...new Set(word.split(''))];
    return letters.reduce((score, l) => score + likelihood[l] || 0, 0);
};

const sortByScore = (likelihood) => (a, b) => getScore(b, likelihood) - getScore(a, likelihood);

const getSecondGuess = (guesses, letterLikelihood) => {
    const firstGuess = guesses[0];
    const firstGuessLetters = [ ...new Set(firstGuess.word.split('')) ];
    const adjustedLetterLikelihood = { ...letterLikelihood };
    for(const l of firstGuessLetters) {
        adjustedLetterLikelihood[l] = 0;
    }
    const bestGuess = words.sort(sortByScore(adjustedLetterLikelihood))[0];
    return bestGuess;
    
}

// 1. Make an initial guess
const guesses = [
    { word: 'later', result: '20100' },
];

// 2. Find all possible words that could match the results from that guess
let matchingWordMap = getMatchingWordMap(guesses);

// 3. Of all the possible remaining words, how likely is each letter to show up in that word?
const letterLikelihood = getLetterLikelihood(matchingWordMap);

// 4. For the second guess we want to find a word that doesn't use any letters that our first guess
//    had and maximizes the letter likelihood
const secondGuess = getSecondGuess(guesses, letterLikelihood);

// 5. Make a second guess and record the result
guesses.push({ word: 'noisy', result: '00100' });

// 6. Figure out which words remain and guess these words until you get the answer
matchingWordMap = getMatchingWordMap(guesses);

console.log(words.filter((w, i) => matchingWordMap[i]));
