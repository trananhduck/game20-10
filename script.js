document.addEventListener('DOMContentLoaded', () => {
    // Biến toàn cục
    let playerName = '';
    let currentScreen = 'welcome-screen';

    // Lấy các element từ DOM
    const screens = document.querySelectorAll('.screen');
    const welcomeScreen = document.getElementById('welcome-screen');
    const game1Screen = document.getElementById('game1-screen');
    const game2Screen = document.getElementById('game2-screen');
    const game3Screen = document.getElementById('game3-screen');
    const finalScreen = document.getElementById('final-screen');

    const playerNameInput = document.getElementById('player-name-input');
    const startGameBtn = document.getElementById('start-game-btn');
    const finalMessage = document.getElementById('final-message');

    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');
    const modalButton = document.getElementById('modal-button');

    // Hàm chuyển màn hình
    const showScreen = (screenId) => {
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        currentScreen = screenId;
    };

    // Hàm hiển thị modal
    const showModal = (title, text, buttonText, callback) => {
        modalTitle.textContent = title;
        modalText.textContent = text;
        modalButton.textContent = buttonText || 'Tiếp tục';
        modal.style.display = 'flex';

        modalButton.onclick = () => {
            modal.style.display = 'none';
            if (callback) callback();
        };
    };

    // Xử lý màn hình chào mừng
    startGameBtn.addEventListener('click', () => {
        playerName = playerNameInput.value.trim();
        if (playerName === '') {
            alert('Cậu chưa nhập tên kìa!');
            return;
        }
        showScreen('game1-screen');
        initGame1();
    });

    // =================================================================
    // GAME 1: 15 PUZZLE
    // =================================================================
    const puzzleContainer = document.getElementById('puzzle-container');
    let tiles = [];
    let emptyTile = { row: 3, col: 3 };

    function initGame1() {
        createPuzzle();
        shufflePuzzle();
        renderPuzzle();
    }

    function createPuzzle() {
        tiles = [];
        let count = 1;
        for (let i = 0; i < 4; i++) {
            tiles[i] = [];
            for (let j = 0; j < 4; j++) {
                if (i === 3 && j === 3) {
                    tiles[i][j] = null;
                } else {
                    tiles[i][j] = count++;
                }
            }
        }
    }

    function renderPuzzle() {
        puzzleContainer.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const tileValue = tiles[i][j];
                const tileEl = document.createElement('div');
                tileEl.classList.add('puzzle-tile');
                if (tileValue === null) {
                    tileEl.classList.add('empty');
                } else {
                    tileEl.textContent = tileValue;
                    tileEl.addEventListener('click', () => onTileClick(i, j));
                }
                puzzleContainer.appendChild(tileEl);
            }
        }
    }

    function onTileClick(row, col) {
        const dRow = Math.abs(row - emptyTile.row);
        const dCol = Math.abs(col - emptyTile.col);

        if ((dRow === 1 && dCol === 0) || (dRow === 0 && dCol === 1)) {
            tiles[emptyTile.row][emptyTile.col] = tiles[row][col];
            tiles[row][col] = null;
            emptyTile = { row, col };
            renderPuzzle();
            checkGame1Win();
        }
    }

    function shufflePuzzle() {
        for (let i = 0; i < 1000; i++) {
            const neighbors = [];
            const { row, col } = emptyTile;
            if (row > 0) neighbors.push({ row: row - 1, col });
            if (row < 3) neighbors.push({ row: row + 1, col });
            if (col > 0) neighbors.push({ row, col: col - 1 });
            if (col < 3) neighbors.push({ row, col: col + 1 });

            const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];

            tiles[emptyTile.row][emptyTile.col] = tiles[randomNeighbor.row][randomNeighbor.col];
            tiles[randomNeighbor.row][randomNeighbor.col] = null;
            emptyTile = randomNeighbor;
        }
    }

    function checkGame1Win() {
        let count = 1;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (i === 3 && j === 3) {
                    if (tiles[i][j] !== null) return false;
                } else {
                    if (tiles[i][j] !== count++) return false;
                }
            }
        }
        setTimeout(() => {
            showModal('Tuyệt vời!', 'Cậu đã hoàn thành thử thách đầu tiên!', 'Chơi tiếp', () => {
                showScreen('game2-screen');
                initGame2();
            });
        }, 300);
        return true;
    }

    // =================================================================
    // GAME 2: COLOR GRID
    // =================================================================
    const colorGrid = document.getElementById('color-grid');
    const colorGridContainer = document.getElementById('color-grid-container');
    const shuffleGame2Btn = document.getElementById('shuffle-game2-btn');
    let colorTiles = [];
    let game2Started = false;
    const solutionGame2 = [
        'red', 'red', 'green', 'green',
        'red', 'red', 'green', 'green',
        'blue', 'blue', 'yellow', 'yellow',
        'blue', 'blue', 'yellow', 'yellow'
    ];
    const initialGame2 = [
        'red', 'red', 'green', 'green',
        'red', 'red', 'green', 'green',
        'blue', 'blue', 'yellow', 'yellow',
        'blue', 'blue', 'yellow', 'yellow'
    ];

    function initGame2() {
        colorTiles = [...initialGame2];
        game2Started = false;
        shuffleGame2Btn.disabled = false;
        renderColorGrid();
        createRotateNodes();
        shuffleGame2Btn.onclick = () => {
            shuffleGame2(20);
            game2Started = true;
            shuffleGame2Btn.disabled = true;
        };
    }

    function renderColorGrid() {
        colorGrid.innerHTML = '';
        colorTiles.forEach(color => {
            const tileEl = document.createElement('div');
            tileEl.classList.add('color-tile');
            tileEl.style.backgroundColor = color;
            colorGrid.appendChild(tileEl);
        });
    }

    function createRotateNodes() {
        colorGridContainer.querySelectorAll('.rotate-node').forEach(node => node.remove());
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const node = document.createElement('div');
                node.classList.add('rotate-node');

                // <<< THAY ĐỔI DUY NHẤT Ở ĐÂY: DÙNG % THAY VÌ PX
                node.style.top = `${(row + 1) * 25}%`;
                node.style.left = `${(col + 1) * 25}%`;

                node.addEventListener('click', () => rotateTiles(row, col));
                colorGridContainer.appendChild(node);
            }
        }
    }

    function rotateTiles(row, col, clockwise = true) {
        if (!game2Started) return;

        const topLeft = row * 4 + col;
        const topRight = topLeft + 1;
        const bottomLeft = topLeft + 4;
        const bottomRight = bottomLeft + 1;
        const indices = [topLeft, topRight, bottomRight, bottomLeft];

        const temp = colorTiles[indices[0]];
        if (clockwise) {
            colorTiles[indices[0]] = colorTiles[indices[3]];
            colorTiles[indices[3]] = colorTiles[indices[2]];
            colorTiles[indices[2]] = colorTiles[indices[1]];
            colorTiles[indices[1]] = temp;
        } else { // Counter-clockwise
            colorTiles[indices[0]] = colorTiles[indices[1]];
            colorTiles[indices[1]] = colorTiles[indices[2]];
            colorTiles[indices[2]] = colorTiles[indices[3]];
            colorTiles[indices[3]] = temp;
        }

        renderColorGrid();
        checkGame2Win();
    }

    function shuffleGame2(moves) {
        let count = 0;
        const interval = setInterval(() => {
            if (count >= moves) {
                clearInterval(interval);
                return;
            }
            const randomRow = Math.floor(Math.random() * 3);
            const randomCol = Math.floor(Math.random() * 3);
            rotateTiles(randomRow, randomCol, false);
            count++;
        }, 100);
    }

    function checkGame2Win() {
        if (!game2Started) return false;

        for (let i = 0; i < solutionGame2.length; i++) {
            if (colorTiles[i] !== solutionGame2[i]) {
                return false;
            }
        }
        setTimeout(() => {
            showModal('Xuất sắc!', 'Thử thách màu sắc đã được cậu giải mã!', 'Đến thử thách cuối!', () => {
                showScreen('game3-screen');
                initGame3();
            });
        }, 300);
        return true;
    }

    // =================================================================
    // GAME 3: RIVER CROSSING
    // =================================================================
    const leftBankEl = document.getElementById('left-bank');
    const rightBankEl = document.getElementById('right-bank');
    const boatEl = document.getElementById('boat');
    const crossRiverBtn = document.getElementById('cross-river-btn');
    const allCharacters = ['farmer', 'wolf', 'sheep', 'cabbage'];
    let gameState3 = {};

    function initGame3() {
        gameState3 = {
            locations: {
                farmer: 'left',
                wolf: 'left',
                sheep: 'left',
                cabbage: 'left',
            },
            boatLocation: 'left',
            isMoving: false,
        };
        renderGame3();
    }

    function renderGame3() {
        allCharacters.forEach(id => {
            const charEl = document.getElementById(id);
            const location = gameState3.locations[id];

            if (location === 'left') {
                leftBankEl.appendChild(charEl);
                charEl.classList.remove('in-boat');
            } else if (location === 'right') {
                rightBankEl.appendChild(charEl);
                charEl.classList.remove('in-boat');
            } else { // on the boat
                boatEl.appendChild(charEl);
                charEl.classList.add('in-boat');
            }
        });

        boatEl.className = 'boat'; // Reset class
        if (gameState3.boatLocation === 'left') {
            boatEl.classList.add('at-left');
        } else {
            boatEl.classList.add('at-right');
        }
    }

    function handleCharacterClick(id) {
        if (gameState3.isMoving) return;

        const characterLocation = gameState3.locations[id];
        const boatOccupants = allCharacters.filter(charId => gameState3.locations[charId] === 'boat');

        if (characterLocation === 'boat') {
            gameState3.locations[id] = gameState3.boatLocation;
        } else if (characterLocation === gameState3.boatLocation) {
            if (boatOccupants.length < 2) {
                gameState3.locations[id] = 'boat';
            } else {
                alert('Thuyền đầy rồi!');
            }
        }
        renderGame3();
    }

    allCharacters.forEach(id => {
        document.getElementById(id).addEventListener('click', () => handleCharacterClick(id));
    });

    crossRiverBtn.addEventListener('click', () => {
        if (gameState3.isMoving) return;

        const boatOccupants = allCharacters.filter(id => gameState3.locations[id] === 'boat');

        if (!boatOccupants.includes('farmer')) {
            alert('Phải có người nông dân để lái thuyền chứ!');
            return;
        }

        gameState3.isMoving = true;
        const departingBankLocation = gameState3.boatLocation;
        gameState3.boatLocation = departingBankLocation === 'left' ? 'right' : 'left';
        renderGame3();

        setTimeout(() => {
            gameState3.isMoving = false;

            // Cập nhật vị trí của các nhân vật trên thuyền
            boatOccupants.forEach(id => {
                gameState3.locations[id] = gameState3.boatLocation;
            });

            // Kiểm tra bờ vừa rời đi
            const itemsLeftBehind = allCharacters.filter(id => gameState3.locations[id] === departingBankLocation);
            if (isUnsafe(itemsLeftBehind)) {
                showModal('Ôi không!', 'Tình huống ở bờ cậu vừa rời đi không an toàn. Sói đã ăn cừu hoặc cừu đã ăn bắp cải rồi!', 'Chơi lại', initGame3);
                return;
            }

            checkGame3Win();
        }, 1000);
    });

    function isUnsafe(itemsOnBank) {
        const hasWolf = itemsOnBank.includes('wolf');
        const hasSheep = itemsOnBank.includes('sheep');
        const hasCabbage = itemsOnBank.includes('cabbage');
        return (hasWolf && hasSheep) || (hasSheep && hasCabbage);
    }

    function checkGame3Win() {
        const itemsOnRightBank = allCharacters.filter(id => gameState3.locations[id] === 'right');
        if (itemsOnRightBank.length === 4) {
            setTimeout(() => {
                showModal('Hoàn thành!', 'Cậu thật thông minh! Tất cả đã qua sông an toàn!', 'Xem lời chúc!', () => {
                    showScreen('final-screen');
                    finalMessage.textContent = `Chúc ${playerName} ngày 20/10 vui vẻ và luôn hạnh phúc nhé! ❤️`;
                });
            }, 500);
        }
    }

    // Khởi tạo
    showScreen('welcome-screen');
});