window.carGame = {
    init: function (canvasId) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');

        const laneCount = 6;
        const laneWidth = canvas.width / laneCount;
        const carWidth = laneWidth * 0.6;
        const carHeight = carWidth * 1.2;

        const state = { lane: Math.floor(laneCount / 2) };
        const road = { x: 0, width: canvas.width };
        const carY = canvas.height - carHeight - 20;

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

        function drawCar() {
            ctx.fillStyle = 'blue';
            ctx.fillRect(laneCenter(state.lane), carY, carWidth, carHeight);
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawRoad();
            drawCar();
        }

        function handleKey(e) {
            if (e.key === 'ArrowLeft') state.lane = Math.max(0, state.lane - 1);
            if (e.key === 'ArrowRight') state.lane = Math.min(laneCount - 1, state.lane + 1);
            draw();
        }

        canvas.addEventListener('keydown', handleKey);
        canvas.focus();
        draw();
    }
};
