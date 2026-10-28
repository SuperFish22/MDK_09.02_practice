// Переключение темы и тесты для самопроверки.
(function () {
  // ---- Тема ----
  var root = document.documentElement;
  try { var saved = localStorage.getItem('up0902-theme'); if (saved) root.setAttribute('data-theme', saved); } catch (e) {}
  var btn = document.querySelector('.theme-btn');
  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function paint() { if (btn) { btn.textContent = isDark() ? '☀' : '☾'; btn.setAttribute('aria-label', isDark() ? 'Светлая тема' : 'Тёмная тема'); } }
  if (btn) btn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('up0902-theme', next); } catch (e) {}
    paint();
  });
  paint();

  // ---- Тест ----
  var data = document.getElementById('quiz-data');
  var box = document.getElementById('quiz');
  if (!data || !box) return;
  var QUESTIONS = JSON.parse(data.textContent);
  var LETTERS = ['А', 'Б', 'В', 'Г', 'Д'];

  function el(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }

  function render() {
    box.innerHTML = '';
    var answered = 0;
    var bar = el('div', 'quiz-bar');
    var prog = el('span', 'progress', 'Отвечено: 0 из ' + QUESTIONS.length);
    var again = el('button', 'btn ghost', '↻ Пройти заново');
    again.type = 'button';
    again.addEventListener('click', function () { render(); box.scrollIntoView({ behavior: 'smooth' }); });
    bar.appendChild(prog); bar.appendChild(again);

    QUESTIONS.forEach(function (q, qi) {
      var card = el('div', 'q');
      card.appendChild(el('h4', null, '<span>' + (qi + 1) + '.</span>' + q.q));
      var opts = el('div', 'opts');
      var fb = el('div', 'fb');
      fb.setAttribute('role', 'status');
      fb.setAttribute('aria-live', 'polite');
      // Перемешиваем варианты, чтобы правильный ответ не стоял всегда на одном месте
      var order = q.o.map(function (_, i) { return i; });
      for (var k = order.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)); var tmp = order[k]; order[k] = order[j]; order[j] = tmp; }
      var shuffled = order.map(function (i) { return q.o[i]; });
      var correct = order.indexOf(q.a);
      var buttons = shuffled.map(function (o, oi) {
        var b = el('button', 'opt', '<b>' + LETTERS[oi] + '.</b> ' + o[0]);
        b.type = 'button';
        b.addEventListener('click', function () {
          buttons.forEach(function (x, xi) {
            x.disabled = true;
            if (xi === correct) x.classList.add('right');
            else if (xi === oi) x.classList.add('wrong');
            else x.classList.add('dim');
          });
          if (oi === correct) {
            fb.className = 'fb show ok';
            fb.innerHTML = '<b>Верно!</b> ' + q.ok;
          } else {
            fb.className = 'fb show no';
            fb.innerHTML = '<b>Неверно.</b> ' + o[1] +
              '<br><b>Правильный ответ: ' + LETTERS[correct] + '.</b> ' + q.ok;
          }
          answered++;
          prog.textContent = 'Отвечено: ' + answered + ' из ' + QUESTIONS.length;
        });
        opts.appendChild(b);
        return b;
      });
      card.appendChild(opts);
      card.appendChild(fb);
      box.appendChild(card);
    });
    box.appendChild(bar);
  }
  render();
})();
