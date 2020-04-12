const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export { canvas, ctx, clearCanvas };