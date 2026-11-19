const USER_KEY = "smarthire_user";
const TOKEN_KEY = "smarthire_token";
const PAGE = document.body.dataset.page;
const BASE = PAGE === "404" ? "/" : "";
const API_BASE = (window.SMART_HIRE_API_URL || "http://localhost:8080").replace(/\/$/, "");
const Auth = {
  get() { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; } },
  token() { return localStorage.getItem(TOKEN_KEY); },
  save(u) { localStorage.setItem(USER_KEY, JSON.stringify(u)); },
  async api(path, options = {}) {
    const headers = { ...(options.headers || {}) };
    if (options.body && !(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
    if (this.token()) headers.Authorization = `Bearer ${this.token()}`;
    let response;
    try { response = await fetch(`${API_BASE}${path}`, { ...options, headers }); }
    catch { throw new Error("Cannot reach the Java backend. Start Spring Boot and check the backend URL."); }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || data.message || `Request failed (${response.status}).`);
    return data;
  },
  accept(data) { localStorage.setItem(TOKEN_KEY, data.token); this.save(data.user); return data.user; },
  async register(u) { const data = await this.api("/api/auth/signup", { method: "POST", body: JSON.stringify(u) }); return this.accept(data); },
  async login(email, password) { const data = await this.api("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }); return this.accept(data); },
  async refresh() { const u = await this.api("/api/profile"); this.save(u); return u; },
  async update(u) { const updated = await this.api("/api/profile", { method: "PUT", body: JSON.stringify(u) }); this.save(updated); return updated; },
  logout() { localStorage.removeItem(USER_KEY); localStorage.removeItem(TOKEN_KEY); location.href = BASE + "index.html"; },
  guard() { if (["dashboard", "profile", "details"].includes(PAGE) && !this.token()) { location.replace("login.html"); return false; } return true; }
};
const norm = s => String(s).trim().toLowerCase();
function titleCase(s) { return s.replace(/\b\w/g, c => c.toUpperCase()); }
function scoreClass(p) { return p >= 70 ? "green" : p >= 40 ? "yellow" : "red"; }
function calculateMatch(user, job) {
  const have = new Set((user.skills || []).map(norm));
  const matched = job.skills.filter(([name]) => have.has(norm(name))).map(([name,w]) => ({name,w}));
  const missing = job.skills.filter(([name]) => !have.has(norm(name))).map(([name,w]) => ({name,w}));
  const pct = job.skills.length ? Math.round(matched.length / job.skills.length * 100) : 0;
  return { final:pct, skillScore:pct, qualScore:0, expScore:0, matched, missing };
}
function simpleScore(user, job) { const m=calculateMatch(user,job); return {pct:m.final,matched:m.matched,missing:m.missing}; }
function recommend(user,jobs) { return jobs.map(job=>({job,m:calculateMatch(user,job)})).filter(r=>r.m.matched.length>0).sort((a,b)=>b.m.final-a.m.final); }
