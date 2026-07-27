/**
 * Blueprint Lattice — interactive network background.
 * Drifting nodes connected by hairlines in the brand cyan;
 * the mesh bends away from the cursor and brightens around it.
 *
 * Respects prefers-reduced-motion (renders a single static frame).
 */
(function () {
  var canvas = document.getElementById('stars-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none)').matches;

  var ACCENT = [62, 197, 240];
  var LINK_DIST = 130;
  var MOUSE_RADIUS = 170;

  var W, H, DPR;
  var nodes = [];
  var mouse = { x: -9999, y: -9999, active: false };

  function rand(min, max) { return min + Math.random() * (max - min); }

  function createNodes() {
    var count = Math.min(Math.floor((W * H) / (isTouch ? 30000 : 20000)), 150);
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: rand(-0.12, 0.12),
        vy: rand(-0.12, 0.12),
        r: rand(0.8, 1.9),
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: rand(0.004, 0.012),
        bright: Math.random() < 0.12, // a few key nodes glow softly
      });
    }
  }

  function drawFrame(time) {
    ctx.clearRect(0, 0, W, H);

    var i, j, n, m;

    // Links
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      for (j = i + 1; j < nodes.length; j++) {
        m = nodes[j];
        var dx = n.x - m.x;
        var dy = n.y - m.y;
        var distSq = dx * dx + dy * dy;
        if (distSq > LINK_DIST * LINK_DIST) continue;
        var dist = Math.sqrt(distSq);
        var alpha = (1 - dist / LINK_DIST) * 0.10;

        // Brighten links near the cursor
        if (mouse.active) {
          var mx = (n.x + m.x) / 2 - mouse.x;
          var my = (n.y + m.y) / 2 - mouse.y;
          var mDist = Math.sqrt(mx * mx + my * my);
          if (mDist < MOUSE_RADIUS) {
            alpha += (1 - mDist / MOUSE_RADIUS) * 0.22;
          }
        }

        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = 'rgba(' + ACCENT[0] + ',' + ACCENT[1] + ',' + ACCENT[2] + ',' + alpha + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Nodes
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      var op = 0.28 + Math.sin(time * n.pulseSpeed * 0.06 + n.pulse) * 0.14;
      if (n.bright) op += 0.25;

      if (mouse.active) {
        var ddx = n.x - mouse.x;
        var ddy = n.y - mouse.y;
        var d = Math.sqrt(ddx * ddx + ddy * ddy);
        if (d < MOUSE_RADIUS) op = Math.min(op + (1 - d / MOUSE_RADIUS) * 0.5, 0.95);
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + ACCENT[0] + ',' + ACCENT[1] + ',' + ACCENT[2] + ',' + op + ')';
      ctx.fill();

      if (n.bright) {
        var gr = n.r * 6;
        var glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, gr);
        glow.addColorStop(0, 'rgba(' + ACCENT[0] + ',' + ACCENT[1] + ',' + ACCENT[2] + ',' + (op * 0.18) + ')');
        glow.addColorStop(1, 'rgba(' + ACCENT[0] + ',' + ACCENT[1] + ',' + ACCENT[2] + ',0)');
        ctx.fillStyle = glow;
        ctx.fillRect(n.x - gr, n.y - gr, gr * 2, gr * 2);
      }
    }
  }

  function step(time) {
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      // Gentle push away from the cursor
      if (mouse.active) {
        var dx = n.x - mouse.x;
        var dy = n.y - mouse.y;
        var distSq = dx * dx + dy * dy;
        if (distSq < MOUSE_RADIUS * MOUSE_RADIUS && distSq > 0.01) {
          var dist = Math.sqrt(distSq);
          var force = (1 - dist / MOUSE_RADIUS) * 0.35;
          n.x += (dx / dist) * force;
          n.y += (dy / dist) * force;
        }
      }

      // Wrap around edges
      if (n.x < -10) n.x = W + 10;
      if (n.x > W + 10) n.x = -10;
      if (n.y < -10) n.y = H + 10;
      if (n.y > H + 10) n.y = -10;
    }

    drawFrame(time);
    requestAnimationFrame(step);
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    createNodes();
    if (reduced) drawFrame(0);
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 250);
  });

  if (!isTouch && !reduced) {
    window.addEventListener('pointermove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }, { passive: true });
    window.addEventListener('pointerleave', function () {
      mouse.active = false;
    });
  }

  resize();

  if (!reduced) {
    requestAnimationFrame(step);
  }
})();
