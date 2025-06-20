window.carGame = {
    init: function (canvasId) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');

        const overlay = document.getElementById('reset-overlay');
        const resetButton = document.getElementById('reset-button');
        let gamePaused = false;

        const laneCount = 6;
        let laneWidth;
        let carWidth;
        let carHeight;

        const playerImg = new Image();
        playerImg.src = 'Images/Player.jpg';

        const enemyImgs = ['Images/Enemy.jpg', 'Images/enemy 2.jpg', 'Images/Enemy 3.jpg']
            .map(p => { const i = new Image(); i.src = p; return i; });

        const truckImg = new Image();
        truckImg.src = 'Images/Enemy truck.png';

        const state = { lane: Math.floor(laneCount / 2) };
        const road = { x: 0, width: 0 };
        let carY;
        const enemies = [];
        let lastSpawn = 0;
        let lastSpawnLane = Math.floor(Math.random() * laneCount);

        function resize() {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = window.innerHeight - rect.top;
            laneWidth = canvas.width / laneCount;
            carWidth = laneWidth * 0.6;
            carHeight = carWidth * 1.2;
            road.width = canvas.width;
            carY = canvas.height - carHeight - 20;
        }

        function laneCenter(lane) {
            return lane * laneWidth + laneWidth / 2 - carWidth / 2;
        }


        function drawRoad() {
            ctx.fillStyle = 'green';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'gray';
            ctx.fillRect(road.x, 0, road.width, canvas.height);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.setLineDash([15, 15]);
            for (let i = 1; i < laneCount; i++) {
                ctx.beginPath();
                ctx.moveTo(road.x + i * laneWidth, 0);
                ctx.lineTo(road.x + i * laneWidth, canvas.height);
                ctx.stroke();
            }
            ctx.setLineDash([]);
        }

        function drawPlayer() {
            ctx.drawImage(playerImg, laneCenter(state.lane), carY, carWidth, carHeight);
        }

        function drawEnemies() {
            for (const e of enemies) {
                ctx.drawImage(e.image, laneCenter(e.lane), e.y, carWidth, e.height);
            }
        }

        function checkCollision() {
            const px = laneCenter(state.lane);
            for (const e of enemies) {
                const ex = laneCenter(e.lane);
                if (px < ex + carWidth && px + carWidth > ex &&
                    carY < e.y + e.height && carY + carHeight > e.y) {
                    return true;
                }
            }
            return false;
        }

        function resetGame() {
            enemies.length = 0;
            state.lane = Math.floor(laneCount / 2);
            overlay.style.display = 'none';
            gamePaused = false;
            lastSpawn = performance.now();
            lastTime = performance.now();
            requestAnimationFrame(gameLoop);
        }

        function spawnEnemy() {
            const isTruck = Math.random() < 0.1; // rare truck
            const height = isTruck ? carHeight * 1.5 : carHeight;
            let rand = Math.random() * laneCount;
            let laneSpawn = Math.floor(rand);
            if (laneSpawn === lastSpawnLane) {
                laneSpawn = Math.floor(Math.random() * laneCount);
            }

            const image = isTruck
                ? truckImg
                : enemyImgs[Math.floor(Math.random() * enemyImgs.length)];

            enemies.push({ lane: laneSpawn, y: -height, type: isTruck ? 'truck' : 'car', height: height, image: image });

            lastSpawnLane = laneSpawn;
        }

        function update(delta) {
            for (const e of enemies) {
                e.y += delta * 0.25; // speed factor
            }
            while (enemies.length && enemies[0].y > canvas.height) {
                enemies.shift();
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawRoad();
            drawPlayer();
            drawEnemies();
        }

        function handleKey(e) {
            if (e.key === 'ArrowLeft') state.lane = Math.max(0, state.lane - 1);
            if (e.key === 'ArrowRight') state.lane = Math.min(laneCount - 1, state.lane + 1);
        }

        canvas.addEventListener('keydown', handleKey);
        resetButton.addEventListener('click', resetGame);
        window.addEventListener('resize', resize);

        resize();
        canvas.focus();

        let lastTime = performance.now();
        function gameLoop(timestamp) {
            if (gamePaused) {
                return;
            }

            const delta = timestamp - lastTime;
            lastTime = timestamp;

            if (timestamp - lastSpawn > 1500) {
                spawnEnemy();
                lastSpawn = timestamp;
            }

            update(delta);
            if (checkCollision()) {
                overlay.style.display = 'flex';
                gamePaused = true;
                return;
            }
            draw();
            requestAnimationFrame(gameLoop);
        }
        requestAnimationFrame(gameLoop);
    }
};
