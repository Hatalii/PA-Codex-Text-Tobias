window.carGame = {
    init: function (canvasId) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');

        const laneCount = 6;
        let laneWidth;
        let carWidth;
        let carHeight;

        const state = { lane: Math.floor(laneCount / 2) };
        const road = { x: 0, width: 0 };
        let carY;
        const enemies = [];
        let lastSpawn = 0;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
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
            ctx.fillStyle = 'blue';
            ctx.fillRect(laneCenter(state.lane), carY, carWidth, carHeight);
        }

        function drawEnemies() {
            ctx.fillStyle = 'red';
            for (const e of enemies) {
                ctx.fillRect(laneCenter(e.lane), e.y, carWidth, carHeight);
            }
        }

        function spawnEnemy() {
            enemies.push({ lane: Math.floor(Math.random() * laneCount), y: -carHeight });
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
        window.addEventListener('resize', resize);

        resize();
        canvas.focus();

        let lastTime = performance.now();
        function gameLoop(timestamp) {
            const delta = timestamp - lastTime;
            lastTime = timestamp;

            if (timestamp - lastSpawn > 1500) {
                spawnEnemy();
                lastSpawn = timestamp;
            }

            update(delta);
            draw();
            requestAnimationFrame(gameLoop);
        }
        requestAnimationFrame(gameLoop);
    }
};
