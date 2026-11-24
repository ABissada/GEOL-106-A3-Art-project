const canvas = document.getElementById('wave');
const ctx = canvas.getContext('2d');
const slider = document.getElementById('slider');
const num = document.getElementById('num');
const msg = document.getElementById('msg');

let mag = 2.0;
let t = 0;

function fixSize() {
  // Match internal canvas pixels to its displayed size so the line isn't blurry
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

function getMsg(val) {
  if (val < 2.5) return val.toFixed(1) + ' — Basically a passing truck';
  if (val < 4.0) return val.toFixed(1) + ' — Did the cat jump off the fridge?';
  if (val < 5.5) return val.toFixed(1) + ' — Coffee mug rattles dramatically';
  if (val < 7.0) return val.toFixed(1) + ' — Existential dread & falling bookshelves';
  if (val < 8.5) return val.toFixed(1) + ' — Tectonic tantrum';
  if (val < 9.5) return val.toFixed(1) + ' — Hollywood disaster movie trailer';
  return val.toFixed(1) + ' — Goodbye crust';
}

function onSlide() {
  mag = parseFloat(slider.value);
  num.textContent = mag.toFixed(1);
  msg.textContent = getMsg(mag);

  // Normalize slider from 1..10 to 0..1, then ease hue from teal (195) toward red (0)
  const ratio = (mag - 1) / 9;
  const hue = Math.round(195 * Math.pow(1 - ratio, 1.4));
  const sat = Math.round(45 + ratio * 40);
  const light = Math.round(16 + ratio * 22);
  document.body.style.backgroundColor = `hsl(${hue}, ${sat}%, ${light}%)`;
}

function loop() {
  const w = canvas.width;
  const h = canvas.height;
  const mid = h / 2;
  const ratio = (mag - 1) / 9;

  // Shake the whole page past 4.2, scaling up faster near the top of the range
  if (mag > 4.2) {
    const amt = Math.pow((mag - 4.2) / 5.8, 1.8) * 14;
    const xMove = (Math.random() - 0.5) * amt;
    const yMove = (Math.random() - 0.5) * amt;
    document.body.style.transform = `translate(${xMove}px, ${yMove}px)`;
  } else {
    document.body.style.transform = 'translate(0px, 0px)';
  }

  ctx.clearRect(0, 0, w, h);
  ctx.beginPath();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3 + ratio * 3;

  const amp = (h * 0.42) * Math.pow(ratio, 1.5) + 4;
  const freq = 0.02 + ratio * 0.09;
  t += 0.06 + ratio * 0.35;

  for (let x = 0; x <= w; x += 3) {
    // sin(0..PI) fades amplitude down to 0 at both left and right edges
    const edge = Math.sin((x / w) * Math.PI);
    const yWave = Math.sin(x * freq + t) * 0.65 + Math.sin(x * freq * 2.3 - t * 1.4) * 0.35;
    const extraJitter = ratio > 0.45 ? (Math.random() - 0.5) * amp * 0.35 : 0;
    const y = mid + (yWave * amp + extraJitter) * edge;

    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
  requestAnimationFrame(loop);
}

window.addEventListener('resize', fixSize);
slider.addEventListener('input', onSlide);

fixSize();
onSlide();
loop();