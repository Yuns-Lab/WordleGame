const board = document.getElementById("board");
const wordInput = document.getElementById("wordInput");
const submitWord = document.getElementById("submitWord");
const wordLength = JSON.parse(localStorage.getItem("wordLength") ?? 5);
const maxAttempts = JSON.parse(localStorage.getItem("maxAttempts") ?? 6);
document.getElementById("wordLength").value = wordLength;
document.getElementById("maxAttempts").value = maxAttempts;
document.getElementById("wordInput").maxLength = wordLength;
let secretWordDict;
function getRandomWord() {
    return new Promise((resolve, _reject) => {
        // // 从 A-Z 挑一个出来
        // const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        // const index = Math.floor(Math.random() * 26);
        // const letter = letters[index];
        // // 插入位置
        // const positions = [0, 1, 2, 3, 4];
        // const positionIndex = Math.floor(Math.random() * 5);
        // const position = positions[positionIndex];
        // // 生成查询字符串
        // let query = "?".repeat(wordLength);
        // query = query.slice(0, position) + letter + query.slice(position + 1);
        // // 查询 API
        // const url = `https://api.datamuse.com/words?sp=${query}`;
        // // XHR
        // const xhr = new XMLHttpRequest();
        // xhr.open("GET", url);
        // xhr.onload = function () {
        //     if (xhr.status === 200) {
        //         const response = JSON.parse(xhr.responseText);
        //         if (response.length > 0) {
        //             resolve(response[0].word);
        //         }
        //     }
        // };
        // xhr.onerror = function (e) {
        //     console.error(e);
        //     Gmal.notice(
        //         "Failed to get word from API.\nYou may need to check your internet connection, or turn on the VPN.\nPlease try again later",
        //         {
        //             type: "error",
        //             timeout: 5000,
        //         }
        //     );
        // };
        // xhr.send();
        // XHR
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "dict.json");
        xhr.onload = function () {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.length > 0) {
                    secretWordDict = response;
                    resolve(
                        response[Math.floor(Math.random() * response.length)]
                    );
                }
            }
        };
        xhr.onerror = function (e) {
            console.error(e);
            Gmal.notice(
                "Failed to get word from server.\nYou may need to check your internet connection, or turn on the VPN.\nPlease try again later",
                {
                    type: "error",
                    timeout: 5000,
                }
            );
        };
        xhr.send();
    });
}
let secretWord;

const secretWordMap = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
    H: 0,
    I: 0,
    J: 0,
    K: 0,
    L: 0,
    M: 0,
    N: 0,
    O: 0,
    P: 0,
    Q: 0,
    R: 0,
    S: 0,
    T: 0,
    U: 0,
    V: 0,
    W: 0,
    X: 0,
    Y: 0,
    Z: 0,
};

let attempts = 0;

// 初始化棋盘
function initBoard() {
    for (let i = 0; i < maxAttempts * wordLength; i++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        board.style.gridTemplateColumns = `repeat(${wordLength}, 50px)`;
        board.appendChild(tile);
    }
    for (let i = 0; i < secretWord.length; i++) {
        const letter = secretWord[i];
        secretWordMap[letter.toUpperCase()]++;
    }
}

function updateBoard(response, guess) {
    for (let i = 0; i < response.length; i++) {
        const secretWordGuessMap = {
            A: 0,
            B: 0,
            C: 0,
            D: 0,
            E: 0,
            F: 0,
            G: 0,
            H: 0,
            I: 0,
            J: 0,
            K: 0,
            L: 0,
            M: 0,
            N: 0,
            O: 0,
            P: 0,
            Q: 0,
            R: 0,
            S: 0,
            T: 0,
            U: 0,
            V: 0,
            W: 0,
            X: 0,
            Y: 0,
            Z: 0,
        };
        const rowStart = attempts * wordLength;
        for (let i = 0; i < wordLength; i++) {
            const tile = board.children[rowStart + i];
            tile.textContent = guess[i];
            secretWordGuessMap[guess[i].toUpperCase()]++;
            if (guess[i] === secretWord[i]) {
                tile.style.backgroundColor = "#00bd55";
            } else if (
                secretWord.includes(guess[i]) &&
                secretWordGuessMap[guess[i].toUpperCase()] <=
                    secretWordMap[guess[i].toUpperCase()]
            ) {
                tile.style.backgroundColor = "#e69900";
            } else {
                tile.style.backgroundColor = "#53626a";
            }
            tile.style.color = "#fff";
        }
        attempts++;
        if (guess === secretWord) {
            Gmal.notice("Congratulations! You guessed the word.", {
                type: "success",
                timeout: 2500,
            });
            submitWord.disabled = true;
        } else if (attempts === maxAttempts) {
            Gmal.notice("Game over! The word was: " + secretWord, {
                type: "warn",
                timeout: 5000,
            });
            submitWord.disabled = true;
        }
        wordInput.value = "";
        return;
    }
}

function crackUpdateBoard(target) {
    for (let i = 0; i < 5; i++) {
        const tile = board.children[i];
        tile.textContent = "CMD"[i];
        tile.style.backgroundColor = ["#d10700", "#d10700", "#d10700", "#53626a", "#53626a"][i];
        tile.style.color = "#fff";
    }
    for (let i = 5; i < 10; i++) {
        const tile = board.children[i];
        tile.textContent = "Crack"[i - 5];
        tile.style.backgroundColor = "#d10700";
        tile.style.color = "#fff";
    }
    for (let i = 10; i < 15; i++) {
        const tile = board.children[i];
        tile.textContent = ""[i - 10];
        tile.style.backgroundColor = "#53626a";
        tile.style.color = "#fff";
    }
    for (let i = 15; i < 20; i++) {
        const tile = board.children[i];
        tile.textContent = ""[i - 15];
        tile.style.backgroundColor = "#53626a";
        tile.style.color = "#fff";
    }
    for (let i = 20; i < 25; i++) {
        const tile = board.children[i];
        tile.textContent = target[i - 20];
        tile.style.backgroundColor = "#00bd55";
        tile.style.color = "#fff";
    }
    for (let i = 25; i < 30; i++) {
        const tile = board.children[i];
        tile.textContent = ""[i - 25];
        tile.style.backgroundColor = "#53626a";
        tile.style.color = "#fff";
    }
}

// 检查用户输入的单词
function checkWord() {
    const guess = wordInput.value.toLowerCase();
    if (guess.length !== wordLength) {
        Gmal.notice(`Word must be ${wordLength} letters!`, {
            type: "warn",
            timeout: 2500,
        });
        return;
    }
    // 检查单词是否有效
    // const url = `https://api.datamuse.com/words?sp=${guess}`;
    // const xhr = new XMLHttpRequest();
    // xhr.open("GET", url);
    // xhr.onload = function () {
    //     if (xhr.status === 200) {
    //         const response = JSON.parse(xhr.responseText);
    //         updateBoard(response, guess);
    //     }
    // };
    // xhr.onerror = function (e) {
    //     console.error(e);
    //     Gmal.notice(
    //         "Failed to check word from API.\nYou may need to check your internet connection, or turn on the VPN.\nPlease try again later",
    //         {
    //             type: "error",
    //             timeout: 5000,
    //         }
    //     );
    // };
    // xhr.send();
    if (secretWordDict.includes(guess)) {
        updateBoard(secretWordDict, guess);
    } else {
        Gmal.notice("That is not a word . . .", {
            type: "warn",
            timeout: 2500,
        });
        wordInput.value = "";
    }
}

// 添加事件监听器
submitWord.addEventListener("click", checkWord);
wordInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        checkWord();
    }
});

document.getElementById("wordLength").addEventListener("change", function () {
    document.getElementById("maxAttempts").value =
        JSON.parse(document.getElementById("wordLength").value) + 1;
});
document.getElementById("newGame").addEventListener("click", function () {
    localStorage.setItem(
        "wordLength",
        document.getElementById("wordLength").value
    );
    localStorage.setItem(
        "maxAttempts",
        document.getElementById("maxAttempts").value
    );
    location.reload();
});

// 初始化游戏
function startGame() {
    getRandomWord().then((word) => {
        // 不包含除了英文以外的字符
        if (/* word.match(/[^a-zA-Z]/) */ false) {
            startGame();
        } else {
            secretWord = word;
            initBoard();
        }
    });
}
startGame();

var Crack = () => {
    crackUpdateBoard(secretWord);
    console.log('Cracking! The word is: "' + secretWord + '"');
    submitWord.disabled = true;
};
