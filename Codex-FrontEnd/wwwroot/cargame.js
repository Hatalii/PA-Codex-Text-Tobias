window.carGame = {
    init: function(canvasId) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        const state = { x: 180, y: 180, size: 20 };

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'blue';
            ctx.fillRect(state.x, state.y, state.size, state.size*2);
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
