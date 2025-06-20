window.carGame = {
    init: function(canvasId) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        const state = { x: canvas.width / 2 - 10, y: canvas.height - 60, w: 20, h: 40 };
        const road = { x: canvas.width / 2 - 50, width: 100 };

        function drawRoad() {
            ctx.fillStyle = 'green';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'gray';
            ctx.fillRect(road.x, 0, road.width, canvas.height);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.setLineDash([10, 10]);
            ctx.beginPath();
            ctx.moveTo(road.x + road.width / 2, 0);
            ctx.lineTo(road.x + road.width / 2, canvas.height);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        function drawCar() {
            ctx.fillStyle = 'blue';
            ctx.fillRect(state.x, state.y, state.w, state.h);
        }

        function draw() {
            drawRoad();
            drawCar();
        }

        function handleKey(e) {
            const step = 5;
            if (e.key === 'ArrowUp') state.y -= step;
            if (e.key === 'ArrowDown') state.y += step;
            if (e.key === 'ArrowLeft') state.x -= step;
            if (e.key === 'ArrowRight') state.x += step;
            draw();
        }

        canvas.addEventListener('keydown', handleKey);
        canvas.focus();
        draw();
    }
};
