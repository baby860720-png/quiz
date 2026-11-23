// 共用測驗引擎：每個測驗頁在 window.QUIZ 放題目和結果，這支只負責流程。不收集、不送出任何資料。
(function () {
  const Q = window.QUIZ, $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let i = 0, score = 0, picks = [];
  function show(id) { ["#intro", "#quiz", "#result"].forEach((s) => $(s).classList.toggle("hide", s !== id)); window.scrollTo(0, 0); }
  function render() {
    const q = Q.questions[i];
    $("#bar").style.width = (i / Q.questions.length) * 100 + "%";
    $("#qno").textContent = `第 ${i + 1} 題 / 共 ${Q.questions.length} 題`;
    $("#q").textContent = q.q;
    $("#opts").innerHTML = q.options.map((o, k) => `<button class="opt" data-k="${k}">${esc(o.t)}</button>`).join("");
    $("#back").classList.toggle("hide", i === 0);
  }
  function result() {
    const r = Q.results.find((r) => score >= r.min && score <= r.max) || Q.results[Q.results.length - 1];
    $("#bar").style.width = "100%";
    $("#rtag").textContent = r.tag;
    $("#rtitle").textContent = r.title;
    $("#rbody").textContent = r.body;
    $("#rtip").innerHTML = `<b>小練習：</b>${esc(r.tip)}`;
    show("#result");
  }
  $("#start").onclick = () => { i = 0; score = 0; picks = []; render(); show("#quiz"); };
  $("#opts").onclick = (e) => {
    const b = e.target.closest(".opt"); if (!b) return;
    b.classList.add("on");
    const s = Q.questions[i].options[+b.dataset.k].s; picks.push(s); score += s;
    setTimeout(() => { i++; i < Q.questions.length ? render() : result(); }, 180);
  };
  $("#back").onclick = () => { if (i > 0) { i--; score -= picks.pop(); render(); } };
  $("#again").onclick = () => show("#intro");
})();
