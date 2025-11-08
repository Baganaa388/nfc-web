// layouts.js — Public & Admin HTML layout-ууд

function layoutPublic(bodyHtml, title = "Mazaalai Conservation Leaderboard") {
  return `<!doctype html>
<html lang="mn">
<head>
<meta charset="utf-8">
<title>${title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
:root {
  --bg:#030712;
  --bg-soft:#020817;
  --brand:rgba(255,240,1,1); /* GOLD-YELLOW */  
  --brand-soft:rgba(255,240,1,0.16);
  --brand-soft2:rgba(255,240,1,0.06);
  --text:#e5e7eb;
  --muted:#9ca3af;
  --row:#020817;
  --row-hover:#040b1a;
  --border:#111827;
  --shadow:0 20px 50px rgba(0,0,0,0.85);
  font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0;}
body{
  min-height:100vh;
  background:
    radial-gradient(circle at top, rgba(255,240,1,0.10), transparent 60%),
    radial-gradient(circle at bottom, rgba(15,118,110,0.20), transparent 55%),
    var(--bg);
  color:var(--text);
  display:flex;
  justify-content:center;
  padding:20px;
}
.wrap{
  width:100%;
  max-width:980px;
  margin:auto;
  display:flex;
  flex-direction:column;
  gap:10px;
}

/* HEADER */
.header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:16px;
}
.logo{
  display:flex;
  align-items:center;
  gap:10px;
}
.logo-img{
  width:40px;
  height:40px;
  border-radius:999px;
  object-fit:cover;
  border:2px solid var(--brand);
  box-shadow:0 0 18px var(--brand-soft);
  background:#020817;
}
.logo-text-top{
  font-size:11px;
  letter-spacing:0.18em;
  text-transform:uppercase;
  color:var(--brand);
}
.logo-title{
  font-size:18px;
  font-weight:700;
  letter-spacing:0.06em;
}
.logo-sub{
  font-size:10px;
  color:var(--muted);
}
.pulse-dot{
  display:inline-block;
  width:7px;
  height:7px;
  border-radius:999px;
  background:var(--brand);
  box-shadow:0 0 12px var(--brand);
  margin-left:4px;
}
.header-right{
  display:flex;
  flex-direction:column;
  align-items:flex-end;
  gap:4px;
}
.timer{
  font-size:10px;
  color:var(--muted);
}
.top-nav{
  display:flex;
  gap:8px;
  align-items:center;
  font-size:9px;
}
.top-nav a{
  color:var(--muted);
  text-decoration:none;
  padding:4px 9px;
  border-radius:999px;
  border:1px solid transparent;
}
.top-nav a:hover{
  color:var(--brand);
  border-color:var(--brand-soft);
  background:rgba(3,7,18,1);
}

/* BOARD */
.board{
  margin-top:4px;
  padding:16px 16px 10px;
  border-radius:20px;
  background:radial-gradient(circle at top,rgba(9,9,11,0.6),var(--bg-soft));
  border:1px solid rgba(148,163,253,0.06);
  box-shadow:var(--shadow);
  backdrop-filter:blur(18px);
}
.board-header{
  display:flex;
  justify-content:space-between;
  align-items:flex-end;
  gap:14px;
  margin-bottom:10px;
}
.board-title{
  font-size:13px;
  font-weight:600;
  letter-spacing:0.18em;
  text-transform:uppercase;
  color:var(--brand);
}
.board-main{
  font-size:12px;
  color:var(--text);
}
.board-sub{
  font-size:10px;
  color:var(--muted);
  margin-top:2px;
}
.badge-row{
  display:flex;
  gap:6px;
  margin-top:4px;
  flex-wrap:wrap;
}
.badge{
  padding:3px 8px;
  border-radius:999px;
  border:1px solid var(--brand-soft);
  font-size:8px;
  color:var(--brand);
  background:rgba(2,6,23,1);
  display:inline-flex;
  align-items:center;
  gap:4px;
}
.badge span.icon-dot{
  width:6px;
  height:6px;
  border-radius:999px;
  background:var(--brand);
}
.chip-total{
  font-size:10px;
  padding:5px 10px;
  border-radius:999px;
  border:1px solid var(--brand-soft);
  background:var(--brand-soft2);
  color:var(--brand);
  text-align:right;
}

/* TABLE */
.table-wrap{
  margin-top:8px;
  border-radius:14px;
  overflow:hidden;
  border:1px solid rgba(31,41,55,0.9);
  background:radial-gradient(circle at top,rgba(9,9,11,1),rgba(2,6,23,1));
}
.row{
  display:grid;
  grid-template-columns:40px 2fr 0.9fr;
  align-items:center;
  padding:7px 11px;
  font-size:11px;
  background:var(--row);
  transition:all .22s ease;
}
.row.head{
  font-size:9px;
  text-transform:uppercase;
  letter-spacing:0.16em;
  color:var(--muted);
  background:rgba(3,7,18,1);
  border-bottom:1px solid rgba(31,41,55,1);
}
.row:not(.head)+.row{
  border-top:1px solid rgba(15,23,42,1);
}
.rank{
  color:var(--muted);
}
.name{
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.amt{
  text-align:right;
  font-variant-numeric:tabular-nums;
  color:var(--brand);
}
.row.gold{
  background:linear-gradient(to right,rgba(255,240,1,0.22),rgba(3,7,18,1));
}
.row.silver{
  background:linear-gradient(to right,rgba(148,163,253,0.18),rgba(3,7,18,1));
}
.row.bronze{
  background:linear-gradient(to right,rgba(248,150,69,0.22),rgba(3,7,18,1));
}
.row.r4{
  background:linear-gradient(to right,rgba(22,163,74,0.14),rgba(3,7,18,1));
}
.row.r5{
  background:linear-gradient(to right,rgba(56,189,248,0.14),rgba(3,7,18,1));
}
.row.gold .rank,
.row.silver .rank,
.row.bronze .rank{
  font-weight:700;
  color:var(--brand);
}
.row.gold .rank::after{content:" ★";}
.row.silver .rank::after{content:" ★";}
.row.bronze .rank::after{content:" ★";}
.row:hover{
  background:var(--row-hover);
  transform:translateY(-1px);
  box-shadow:0 12px 28px rgba(0,0,0,0.9);
}
.empty{
  padding:16px 10px;
  font-size:11px;
  color:var(--muted);
  text-align:center;
}

/* Footer */
footer{
  margin-top:10px;
  padding-top:8px;
  border-top:1px solid rgba(31,41,55,0.9);
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  justify-content:space-between;
  align-items:flex-start;
  font-size:9px;
  color:var(--muted);
}
.footer-left{
  display:flex;
  flex-direction:column;
  gap:2px;
}
.footer-right{
  display:flex;
  flex-direction:column;
  gap:2px;
  text-align:right;
}
footer a{
  color:var(--brand);
  text-decoration:none;
}
footer a:hover{
  text-decoration:underline;
}

/* Icons */
.icon{
  width:13px;
  height:13px;
  display:inline-block;
  vertical-align:-2px;
  margin-right:4px;
  fill:var(--brand);
}

@media (max-width:600px){
  body{padding:12px;}
  .logo-title{font-size:14px;}
  .board{padding:12px;}
  .row{padding:6px 7px;}
  .footer-right{text-align:left;}
}
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <div class="logo">
      <img src="https://scontent-nrt1-1.xx.fbcdn.net/v/t39.30808-6/275130473_1299560400455995_8693570699170206627_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=va6tg0kTL04Q7kNvwEffGxP&_nc_oc=AdloglaDXdNDZ8RzWHcZ010T_1gFedw0UJsp0KvM6QgKdJSebG8ka6D2owRydZ5a-PNlDrUMDwmmjV8DBrxCm0eJ&_nc_zt=23&_nc_ht=scontent-nrt1-1.xx&_nc_gid=DRvdxGFvSSGFsvzhhOio6g&oh=00_Afim9YAIhWMa3ytpxEDqaMIfYV07-2tDBpz4gMCZ6Wl8ag&oe=69153B7F" alt="Mazaalai logo" class="logo-img">
      <div>
        <div class="logo-text-top">MAZAALAI GUARDIANS</div>
        <div class="logo-title">Leaderboard</div>
        <div class="logo-sub">
          Байгаль, зэрлэг амьтны төлөө тууштай зүтгэж буй хүмүүсийн амьд жагсаалт<span class="pulse-dot"></span>
        </div>
      </div>
    </div>
    <div class="header-right">
      <div class="timer" id="timer">Last update · --:--</div>
      <div class="top-nav">
        <a href="/">Leaderboard</a>
        <a href="/about">About Mazaalai</a>
      </div>
    </div>
  </div>

  ${bodyHtml}

  <footer>
    <div class="footer-left">
      <div>© ${new Date().getFullYear()} Mazaalai Guardians</div>
      <div>Энд бүртгэлтэй хүмүүс бол Говийн эзэн Мазаалай болон Монголын байгалийг хамгаалах бодит баатрууд.</div>
    </div>
    <div class="footer-right">
      <div>
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2C5.57 4 4 5.57 4 7.5v9C4 18.99 5.01 20 6.5 20h11a2.5 2.5 0 0 0 2.5-2.5v-9C20 5.57 18.43 4 16.5 4h-9zM17 7.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 .001 6.001A3 3 0 0 0 12 9z"/>
        </svg>
        Instagram:
        <a href="https://www.instagram.com/baganaa59/" target="_blank" rel="noopener">
          @baganaa59
        </a>
      </div>
      <div>
        <svg class="icon" viewBox="0 0 24 24">
          <path d="M12 2a7 7 0 0 1 7 7c0 4.05-3.64 8.38-6.02 10.64a1.3 1.3 0 0 1-1.96 0C8.64 17.38 5 13.05 5 9a7 7 0 0 1 7-7zm0 2a5 5 0 0 0-5 5c0 2.91 2.37 6.29 5 8.97 2.63-2.68 5-6.06 5-8.97a5 5 0 0 0-5-5zm0 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
        </svg>
        “Mazaalai Hub” — хамгаалалтын бүсийн хамтын шүтээн
      </div>
    </div>
  </footer>
</div>
<script>
function updateClock(){
  var el=document.getElementById('timer');
  if(!el) return;
  var d=new Date();
  el.textContent="Last update · "
    + String(d.getHours()).padStart(2,'0')
    + ":" + String(d.getMinutes()).padStart(2,'0');
}
updateClock();
setInterval(updateClock,15000);
</script>
</body>
</html>`;
}


function layoutAdmin(title, bodyHtml) {
  return `<!doctype html>
<html lang="mn">
<head>
<meta charset="utf-8">
<title>${title || "Admin"}</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{margin:0;font-family:system-ui,Arial,sans-serif;background:#020817;color:#e5e7eb;}
.wrap{max-width:1080px;margin:auto;padding:20px;}
header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;}
.nav a{color:#9ca3af;text-decoration:none;margin-left:10px;font-size:13px;}
.nav a:hover{color:#e5e7eb;}
.card{background:#020817;border:1px solid #111827;border-radius:14px;padding:14px;margin-bottom:14px;}
.grid{display:grid;grid-template-columns:2fr 2fr 3fr;gap:12px;}
table{width:100%;border-collapse:collapse;font-size:12px;}
th,td{padding:6px 4px;border-bottom:1px solid #111827;vertical-align:top;}
input,button,select{
  background:#020817;color:#e5e7eb;border-radius:6px;
  border:1px solid #374151;padding:6px 8px;font-size:12px;
}
button{cursor:pointer;}
.row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:6px;}
.ok{color:#6ee7b7;} .err{color:#fca5a5;} .muted{color:#9ca3af;font-size:11px;}
form.inline{display:inline;}
</style>
</head>
<body>
<div class="wrap">
<header>
  <div><strong>Admin · NFC Leaderboard</strong></div>
  <div class="nav">
    <a href="/admin">Dashboard</a>
    <a href="/admin/logout">Logout</a>
  </div>
</header>
${bodyHtml}
</div>
</body>
</html>`;
}

module.exports = { layoutPublic, layoutAdmin };
