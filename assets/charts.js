/* ============================================================
   Velumi · Charts ligeros en SVG
   ============================================================ */
(function () {
  const MKT = window.MKT = window.MKT || {};

  function smooth(pts) {
    if (!pts.length) return '';
    if (pts.length === 1) return `M${pts[0][0]},${pts[0][1]}`;
    const d = [`M${pts[0][0]},${pts[0][1]}`];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d.push(`C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`);
    }
    return d.join(' ');
  }

  function sparkline(host) {
    if (!host) return;
    const values = (host.dataset.spark || '').split(',').map(Number).filter(v => !isNaN(v));
    if (!values.length) return;
    const color = host.dataset.color || '#1428E8';
    const W = 80, H = 30, pad = 2.5;
    const min = Math.min(...values), max = Math.max(...values);
    const range = max - min || 1;
    const pts = values.map((v, i) => [
      pad + (i * (W - pad * 2)) / (values.length - 1),
      H - pad - ((v - min) / range) * (H - pad * 2)
    ]);
    const d = smooth(pts);
    const area = `${d} L${W - pad},${H - 1} L${pad},${H - 1} Z`;
    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%" aria-hidden="true">
      <path d="${area}" fill="${color}" opacity=".12"/>
      <path d="${d}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="${pts[pts.length - 1][0]}" cy="${pts[pts.length - 1][1]}" r="2.2" fill="${color}"/>
    </svg>`;
  }

  function lineChart(target, cfg) {
    const host = typeof target === 'string' ? document.getElementById(target) : target;
    if (!host) return;
    const W = 720;
    const H = cfg.height || 230;
    const padL = 42, padR = 16, padT = 18, padB = 30;
    const innerW = W - padL - padR;
    const innerH = H - padT - padB;
    const labels = cfg.labels || [];
    const series = cfg.series || [];
    const all = series.flatMap(s => s.values);
    const max = cfg.max || Math.ceil(Math.max(...all) / 4) * 4;
    const x = i => padL + (innerW * i) / Math.max(1, labels.length - 1);
    const y = v => padT + innerH * (1 - v / max);
    const uid = 'g' + Math.random().toString(36).slice(2, 8);

    let defs = '';
    series.forEach((s, si) => {
      if (s.fill) {
        defs += `<linearGradient id="${uid}${si}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${s.color}" stop-opacity=".22"/>
          <stop offset="1" stop-color="${s.color}" stop-opacity="0"/>
        </linearGradient>`;
      }
    });

    let grid = '';
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      const gy = padT + (innerH * i) / steps;
      const val = max - (max * i) / steps;
      grid += `<line class="grid-line" x1="${padL}" y1="${gy}" x2="${W - padR}" y2="${gy}"/>`;
      grid += `<text class="axis-text" x="${padL - 9}" y="${gy + 3.5}" text-anchor="end">${Math.round(val)}k</text>`;
    }
    labels.forEach((l, i) => {
      grid += `<text class="axis-text" x="${x(i)}" y="${H - 8}" text-anchor="middle">${l}</text>`;
    });

    let targetLine = '';
    if (cfg.target) {
      const ty = y(cfg.target);
      targetLine = `<line class="target-line" x1="${padL}" y1="${ty}" x2="${W - padR}" y2="${ty}"/>
        <text class="target-text" x="${W - padR}" y="${ty - 6}" text-anchor="end">Meta $${cfg.target}.000</text>`;
    }

    let body = '';
    series.forEach((s, si) => {
      const pts = s.values.map((v, i) => [x(i), y(v)]);
      const d = smooth(pts);
      if (s.fill) {
        body += `<path d="${d} L${x(s.values.length - 1)},${padT + innerH} L${x(0)},${padT + innerH} Z" fill="url(#${uid}${si})"/>`;
      }
      body += `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="${s.width || 2.4}" stroke-linecap="round" stroke-linejoin="round" ${s.dashed ? 'stroke-dasharray="5 4"' : ''}/>`;
      if (s.dots) {
        pts.forEach((p, i) => {
          body += `<circle cx="${p[0]}" cy="${p[1]}" r="${i === pts.length - 1 ? 4 : 3}" fill="#fff" stroke="${s.color}" stroke-width="2"><title>${labels[i]}: ${s.values[i]}k</title></circle>`;
        });
      }
    });

    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${cfg.aria || 'Gráfico de evolución'}">
      <defs>${defs}</defs>
      ${grid}
      ${targetLine}
      ${body}
    </svg>`;
  }

  MKT.charts = { sparkline, lineChart, smooth };
})();
