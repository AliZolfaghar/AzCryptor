import { Transform } from 'stream';

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return '0B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const digits = value >= 100 || unit === 0 ? 0 : value >= 10 ? 1 : 2;
  return `${value.toFixed(digits)}${units[unit]}`;
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--';
  const total = Math.ceil(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function renderBar(ratio, width = 20) {
  const clamped = Math.min(1, Math.max(0, ratio));
  const filled = Math.round(clamped * width);
  return `[${'█'.repeat(filled)}${'-'.repeat(width - filled)}]`;
}

/**
 * Creates a Transform that counts bytes and prints a progress line to stderr.
 * @param {number} totalBytes
 * @param {string} label
 */
export function createProgressTransform(totalBytes, label = 'Processing') {
  const show = Boolean(process.stderr.isTTY);
  let transferred = 0;
  const startedAt = Date.now();
  let lastDraw = 0;

  const draw = (force = false) => {
    if (!show) return;
    const now = Date.now();
    if (!force && now - lastDraw < 100) return;
    lastDraw = now;

    const elapsedSec = Math.max((now - startedAt) / 1000, 0.001);
    const ratio = totalBytes > 0 ? transferred / totalBytes : 0;
    const percent = totalBytes > 0 ? Math.min(100, Math.floor(ratio * 100)) : 0;
    const speed = transferred / elapsedSec;
    const remaining = totalBytes > transferred ? totalBytes - transferred : 0;
    const eta = speed > 0 ? remaining / speed : NaN;

    const line = `${label}... ${renderBar(ratio)} ${String(percent).padStart(3, ' ')}%  ${formatBytes(transferred)}/${formatBytes(totalBytes)}  ${formatBytes(speed)}/s  ETA ${formatDuration(eta)}`;
    process.stderr.write(`\r\x1b[K${line}`);
  };

  const transform = new Transform({
    transform(chunk, encoding, callback) {
      transferred += chunk.length;
      draw();
      callback(null, chunk);
    },
    flush(callback) {
      transferred = totalBytes > 0 ? Math.max(transferred, totalBytes) : transferred;
      draw(true);
      if (show) process.stderr.write('\n');
      callback();
    },
  });

  return transform;
}
