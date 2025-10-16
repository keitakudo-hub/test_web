
document.addEventListener('DOMContentLoaded', () => {
    const mapElement = document.getElementById('map');
    const messageLog = document.getElementById('message-log');
    const battleScene = document.getElementById('battle-scene');

    // Game state
    const gameState = {
        inBattle: false,
    };

    // Player
    const player = {
        x: 5,
        y: 5,
        hp: 100,
        attack: 10,
        element: null,
    };

    // Map Data (0: grass)
    const mapData = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    const TILE_SIZE = 32;

    // Enemies
    const enemies = [
        { x: 8, y: 8, hp: 30, attack: 5, element: null, name: 'スライム' },
        { x: 12, y: 3, hp: 30, attack: 5, element: null, name: 'スライム' },
    ];
    let currentEnemy = null;

    function logMessage(message) {
        const p = document.createElement('p');
        p.textContent = message;
        messageLog.insertBefore(p, messageLog.firstChild);
    }

    function drawMap() {
        mapElement.innerHTML = '';
        for (let y = 0; y < mapData.length; y++) {
            for (let x = 0; x < mapData[y].length; x++) {
                const tile = document.createElement('div');
                tile.className = 'tile grass';
                tile.style.left = `${x * TILE_SIZE}px`;
                tile.style.top = `${y * TILE_SIZE}px`;
                mapElement.appendChild(tile);
            }
        }
    }

    function drawPlayer() {
        if (!player.element) {
            player.element = document.createElement('div');
            player.element.className = 'player';
            mapElement.appendChild(player.element);
        }
        player.element.style.left = `${player.x * TILE_SIZE}px`;
        player.element.style.top = `${player.y * TILE_SIZE}px`;
    }

    function drawEnemies() {
        enemies.forEach(enemy => {
            if (!enemy.element) {
                enemy.element = document.createElement('div');
                enemy.element.className = 'enemy';
                mapElement.appendChild(enemy.element);
            }
            enemy.element.style.left = `${enemy.x * TILE_SIZE}px`;
            enemy.element.style.top = `${enemy.y * TILE_SIZE}px`;
            enemy.element.style.display = 'block';
        });
    }

    function handleKeyPress(e) {
        if (gameState.inBattle) return;

        switch (e.key) {
            case 'ArrowUp':
                player.y = Math.max(0, player.y - 1);
                break;
            case 'ArrowDown':
                player.y = Math.min(mapData.length - 1, player.y + 1);
                break;
            case 'ArrowLeft':
                player.x = Math.max(0, player.x - 1);
                break;
            case 'ArrowRight':
                player.x = Math.min(mapData[0].length - 1, player.x + 1);
                break;
        }
        drawPlayer();
        checkForEncounter();
    }

    function checkForEncounter() {
        const enemy = enemies.find(e => e.x === player.x && e.y === player.y && e.hp > 0);
        if (enemy) {
            startBattle(enemy);
        }
    }

    function startBattle(enemy) {
        gameState.inBattle = true;
        currentEnemy = enemy;
        logMessage(`${enemy.name} があらわれた！`);
        battleScene.classList.remove('hidden');

        document.getElementById('attack-command').onclick = () => attack();
        document.getElementById('run-command').onclick = () => run();
    }

    function attack() {
        if (!gameState.inBattle) return;

        // Player's turn
        const playerDamage = player.attack;
        currentEnemy.hp -= playerDamage;
        logMessage(`プレイヤーのこうげき！ ${currentEnemy.name} に ${playerDamage} のダメージ！`);

        if (currentEnemy.hp <= 0) {
            logMessage(`${currentEnemy.name} をたおした！`);
            endBattle();
            return;
        }

        // Enemy's turn
        const enemyDamage = currentEnemy.attack;
        player.hp -= enemyDamage;
        logMessage(`${currentEnemy.name} のこうげき！ プレイヤーは ${enemyDamage} のダメージをうけた！`);

        if (player.hp <= 0) {
            logMessage('プレイヤーはたおれてしまった...');
            // Game over logic would go here
            gameState.inBattle = false; // For now, just stop the battle
        }
    }

    function run() {
        if (!gameState.inBattle) return;
        logMessage('にげだした！');
        endBattle();
    }
    
    function endBattle() {
        if (currentEnemy && currentEnemy.hp <= 0) {
            // Hide the defeated enemy
            if (currentEnemy.element) {
                currentEnemy.element.style.display = 'none';
            }
        }
        gameState.inBattle = false;
        currentEnemy = null;
        battleScene.classList.add('hidden');
    }


    function init() {
        drawMap();
        drawPlayer();
        drawEnemies();
        window.addEventListener('keydown', handleKeyPress);
        logMessage('矢印キーで移動してください。');
    }

    init();
});
