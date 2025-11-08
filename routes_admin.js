// routes_admin.js — Admin login, dashboard, actions

const {
  searchUsers,
  listUsers,
  getUserByUID,
  getTotalByUserId,
  insertTransactionAndUpdateTotal,
  quickRegisterLink,
  deleteUserCascade
} = require("./db");
const { layoutAdmin } = require("./layouts");
const { ADMIN_USER, ADMIN_PASS } = require("./config");

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  return res.redirect("/admin/login");
}

// Login
function getLogin(req, res) {
  if (req.session.isAdmin) return res.redirect("/admin");
  const body = `
  <div class="card" style="max-width:360px;margin:80px auto;">
    <h3>Admin Login</h3>
    <form method="post">
      <div class="row"><input name="username" placeholder="Username" required style="width:100%;"></div>
      <div class="row"><input type="password" name="password" placeholder="Password" required style="width:100%;"></div>
      <button type="submit" style="width:100%;">Sign in</button>
    </form>
  </div>`;
  res.send(layoutAdmin("Login", body));
}

function postLogin(req, res) {
  const { username, password } = req.body || {};
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    req.session.isAdmin = true;
    return res.redirect("/admin");
  }
  const body = `
  <div class="card" style="max-width:360px;margin:80px auto;">
    <h3>Admin Login</h3>
    <p class="err">Нэвтрэх нэр эсвэл нууц үг буруу.</p>
    <form method="post">
      <div class="row"><input name="username" placeholder="Username" required style="width:100%;"></div>
      <div class="row"><input type="password" name="password" placeholder="Password" required style="width:100%;"></div>
      <button type="submit" style="width:100%;">Sign in</button>
    </form>
  </div>`;
  res.send(layoutAdmin("Login", body));
}

function getLogout(req, res) {
  req.session.destroy(() => res.redirect("/admin/login"));
}

// Dashboard
function getAdmin(req, res) {
  const q = (req.query.q || "").trim();
  const users = q ? searchUsers(q, 100) : listUsers(50);

  const act_msg = req.query.act_msg || "";
  const act_ok = req.query.act_ok === "1";

  const rowsHtml =
    users
      .map((u) => {
        const t = getTotalByUserId(u.id);
        const total = t ? t.total.toLocaleString("en-US") : "0";
        return `<tr>
          <td>${u.id}</td>
          <td>${u.name}</td>
          <td>${u.nickname || ""}</td>
          <td>${u.uid || "-"}</td>
          <td>${total}</td>
          <td>
            <form class="inline" method="post" action="/admin/delete-user"
              onsubmit="return confirm('Устгах уу?');">
              <input type="hidden" name="user_id" value="${u.id}">
              <button type="submit">Delete</button>
            </form>
          </td>
        </tr>`;
      })
      .join("") || `<tr><td colspan="6">Одоогоор хэрэглэгч алга.</td></tr>`;

  const body = `
  <div class="grid">
    <div class="card">
      <h3>Live scan</h3>
      <p>Сүүлд ирсэн UID: <b id="lastUid">—</b>
        <span id="lastUidStatus" class="muted"></span></p>
      <p id="lastUidUser" class="muted"></p>
      <p class="muted">Сүүлд уншсан UID-аар доорх Action хэсэг автоматаар солигдоно.</p>
    </div>

    <div class="card">
      <h3>Action</h3>
      <form id="formAddTx" method="post" action="/admin/quick-add-tx" style="display:none">
        <input type="hidden" name="uid" id="tx_uid">
        <div class="row">
          <input name="user_label" id="tx_user_label" readonly style="flex:1;">
          <input name="amount" type="number" step="0.01" min="0.01"
                 placeholder="Дүн (₮)" required style="width:120px;">
        </div>
        <button type="submit">Дүн нэмэх</button>
      </form>

      <form id="formQuickReg" method="post" action="/admin/quick-register-link" style="display:none">
        <input type="hidden" name="uid" id="reg_uid">
        <div class="row">
          <input name="name" placeholder="Нэр" required style="flex:1;">
          <input name="nickname" placeholder="Хоч">
          <input name="profession" placeholder="Мэргэжил">
        </div>
        <button type="submit">Бүртгээд холбох</button>
      </form>

      ${
        act_msg
          ? `<p class="${act_ok ? "ok" : "err"}">${act_msg}</p>`
          : ""
      }
    </div>

    <div class="card">
      <h3>Хэрэглэгчид</h3>
      <form method="get" action="/admin">
        <div class="row">
          <input name="q" value="${q}" placeholder="Нэр/хоч/UID/мэргэжил" style="flex:1;">
          <button type="submit">Хайх</button>
        </div>
      </form>
      <table>
        <thead>
          <tr><th>ID</th><th>Нэр</th><th>Хоч</th><th>UID</th><th>Нийт</th><th></th></tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>
  </div>

<script>
async function poll(){
  try{
    const r = await fetch("/api/last-scan");
    const j = await r.json();
    const uid = j.uid || "";
    const st = document.getElementById('lastUidStatus');
    const u = j.user;
    document.getElementById('lastUid').textContent = uid || "—";

    const fTx = document.getElementById('formAddTx');
    const fReg = document.getElementById('formQuickReg');

    if(uid && u){
      st.textContent = " (бүртгэлтэй)";
      document.getElementById('lastUidUser').textContent =
        "ID " + u.id + " · " + u.name + (u.nickname ? " ("+u.nickname+")" : "");
      fReg.style.display = "none";
      fTx.style.display = "block";
      document.getElementById('tx_uid').value = uid;
      document.getElementById('tx_user_label').value =
        "ID " + u.id + " · " + u.name;
    } else if(uid){
      st.textContent = " (бүртгэлгүй)";
      document.getElementById('lastUidUser').textContent = "";
      fTx.style.display = "none";
      fReg.style.display = "block";
      document.getElementById('reg_uid').value = uid;
    } else {
      st.textContent = "";
      document.getElementById('lastUidUser').textContent = "";
      fTx.style.display = "none";
      fReg.style.display = "none";
    }
  } catch(e){}
}
poll(); setInterval(poll,1000);
</script>
`;
  res.send(layoutAdmin("Admin", body));
}

// POST /admin/quick-add-tx
function postQuickAddTx(req, res) {
  const uid = (req.body.uid || "").toString().trim().toUpperCase();
  const amount = parseFloat(req.body.amount || "0");
  const user = getUserByUID(uid);

  if (!uid || !user || !(amount > 0)) {
    return res.redirect(
      "/admin?act_msg=" +
        encodeURIComponent("Алдаа: UID/хэрэглэгч/дүн буруу.") +
        "&act_ok=0"
    );
  }

  insertTransactionAndUpdateTotal(user.id, amount);

  return res.redirect(
    "/admin?act_msg=" +
      encodeURIComponent(
        `ID ${user.id} · ${user.name} +${amount.toFixed(0)}₮ нэмлээ`
      ) +
      "&act_ok=1"
  );
}

// POST /admin/quick-register-link
function postQuickRegisterLink(req, res) {
  const uid = (req.body.uid || "").toString().trim().toUpperCase();
  const name = (req.body.name || "").toString().trim();
  const nickname = (req.body.nickname || "").toString().trim();
  const profession = (req.body.profession || "").toString().trim();

  if (!uid || !name) {
    return res.redirect(
      "/admin?act_msg=" +
        encodeURIComponent("UID/нэр хоосон.") +
        "&act_ok=0"
    );
  }

  try {
    quickRegisterLink({ uid, name, nickname, profession });
    return res.redirect(
      "/admin?act_msg=" +
        encodeURIComponent(`'${name}' бүртгэж UID ${uid} холбосон.`) +
        "&act_ok=1"
    );
  } catch (e) {
    return res.redirect(
      "/admin?act_msg=" +
        encodeURIComponent("Алдаа: " + e.message) +
        "&act_ok=0"
    );
  }
}

// POST /admin/delete-user
function postDeleteUser(req, res) {
  const id = parseInt(req.body.user_id || "0", 10);
  if (!id) {
    return res.redirect(
      "/admin?act_msg=" +
        encodeURIComponent("ID буруу.") +
        "&act_ok=0"
    );
  }
  try {
    deleteUserCascade(id);
    return res.redirect(
      "/admin?act_msg=" +
        encodeURIComponent(`Хэрэглэгч ID ${id} устгалаа.`) +
        "&act_ok=1"
    );
  } catch (e) {
    return res.redirect(
      "/admin?act_msg=" +
        encodeURIComponent("Устгах үед алдаа: " + e.message) +
        "&act_ok=0"
    );
  }
}

function registerAdminRoutes(app) {
  app.get("/admin/login", getLogin);
  app.post("/admin/login", postLogin);
  app.get("/admin/logout", getLogout);

  app.get("/admin", requireAdmin, getAdmin);
  app.post("/admin/quick-add-tx", requireAdmin, postQuickAddTx);
  app.post(
    "/admin/quick-register-link",
    requireAdmin,
    postQuickRegisterLink
  );
  app.post("/admin/delete-user", requireAdmin, postDeleteUser);
}

module.exports = { registerAdminRoutes };
