/* SmartHire - job data, rendering and UI logic */
let JOBS = [
  { id: 101, title: "QA Engineer", company: "HCLTech", location: "Noida", exp: 0, expLabel: "Fresher", qual: "B.Tech CSE", salary: "3.5 - 5 LPA", desc: "Design and run test plans for web applications, automate regression suites and report defects to the engineering team.", skills: [["selenium", 5], ["java", 4], ["testing", 5], ["manual testing", 3], ["jira", 2]] },
  { id: 102, title: "Backend Developer", company: "Infosys", location: "Bengaluru", exp: 1, expLabel: "1+ yr", qual: "B.Tech CSE", salary: "6 - 9 LPA", desc: "Build and maintain REST services with Spring Boot, model data in MySQL and ship containerised releases.", skills: [["java", 5], ["spring boot", 5], ["mysql", 4], ["rest api", 4], ["git", 2], ["docker", 3]] },
  { id: 103, title: "Data Scientist", company: "TCS", location: "Pune", exp: 2, expLabel: "2+ yrs", qual: "M.Tech", salary: "8 - 12 LPA", desc: "Clean datasets, train machine learning models and present statistical findings to business teams.", skills: [["python", 5], ["sql", 3], ["machine learning", 5], ["pandas", 4], ["statistics", 4]] },
  { id: 104, title: "Full Stack Developer", company: "Zoho", location: "Chennai", exp: 2, expLabel: "2+ yrs", qual: "B.Tech IT", salary: "7 - 11 LPA", desc: "Own features end to end, from React interfaces to Node.js APIs and MongoDB collections.", skills: [["javascript", 5], ["react", 4], ["node.js", 4], ["mongodb", 3], ["html", 2], ["css", 2], ["git", 2]] },
  { id: 105, title: "Android Developer", company: "Paytm", location: "Noida", exp: 1, expLabel: "1+ yr", qual: "B.Tech CSE", salary: "6 - 10 LPA", desc: "Develop payment and wallet features for the Android app using Kotlin and Java.", skills: [["kotlin", 5], ["java", 4], ["android", 5], ["rest api", 3], ["git", 2]] },
  { id: 106, title: "Frontend Developer", company: "Flipkart", location: "Bengaluru", exp: 1, expLabel: "1+ yr", qual: "BCA", salary: "6 - 10 LPA", desc: "Turn designs into fast, accessible storefront pages with React and modern CSS.", skills: [["html", 3], ["css", 3], ["javascript", 5], ["react", 5], ["git", 2]] },
  { id: 107, title: "DevOps Engineer", company: "CloudNine", location: "Hyderabad", exp: 2, expLabel: "2+ yrs", qual: "B.Tech CSE", salary: "8 - 13 LPA", desc: "Automate build and deploy pipelines, manage Kubernetes clusters and monitor cloud infrastructure.", skills: [["docker", 5], ["kubernetes", 5], ["linux", 4], ["jenkins", 3], ["aws", 4], ["git", 2]] },
  { id: 108, title: "UI/UX Designer", company: "DesignHub", location: "Gurugram", exp: 0, expLabel: "Fresher", qual: "B.Sc", salary: "4 - 6 LPA", desc: "Research user needs, create wireframes and prototypes in Figma and hand off clean specs.", skills: [["figma", 5], ["wireframing", 4], ["user research", 4], ["html", 2], ["css", 2]] }
];

const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ring = (pct, lg) => `<div class="ring ${scoreClass(pct)}${lg ? " lg" : ""}" style="--p:${pct}" role="img" aria-label="${pct}% match"><span>${pct}%</span></div>`;

function toast(msg, kind = "success") {
  const el = document.createElement("div");
  el.className = `toast align-items-center text-bg-${kind} border-0`;
  el.setAttribute("role", "status");
  el.innerHTML = `<div class="d-flex"><div class="toast-body">${esc(msg)}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>`;
  $("#toasts").appendChild(el);
  el.addEventListener("hidden.bs.toast", () => el.remove());
  new bootstrap.Toast(el, { delay: 3000 }).show();
}

function renderChrome() {
  const user = Auth.get();
  const links = [["index", "Home"], ["jobs", "Jobs"], ["dashboard", "Dashboard"], ["profile", "Profile"], ["about", "About"]];
  const items = links.map(([k, t]) => `<li class="nav-item"><a class="nav-link${PAGE === k || (k === "jobs" && PAGE === "details") || (k === "index" && PAGE === "home") ? " active" : ""}" href="${BASE}${k}.html">${t}</a></li>`).join("");
  const right = user
    ? `<span class="text-white me-3 small d-none d-lg-inline"><i class="bi bi-person-circle"></i> ${esc(user.name.split(" ")[0])}</span><button class="btn btn-light btn-sm fw-semibold" id="logoutBtn">Logout</button>`
    : `<a class="btn btn-outline-light btn-sm me-2" href="${BASE}login.html">Login</a><a class="btn btn-light btn-sm fw-semibold" href="${BASE}register.html">Register</a>`;
  $("#nav").innerHTML = `<nav class="navbar navbar-expand-lg navbar-x" aria-label="Main"><div class="container">
    <a class="navbar-brand" href="${BASE}index.html">⚡ SmartHire</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu" aria-controls="navMenu" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
    <div class="collapse navbar-collapse" id="navMenu"><ul class="navbar-nav me-auto mb-2 mb-lg-0">${items}</ul><div class="d-flex align-items-center pb-2 pb-lg-0">${right}</div></div></div></nav>`;
  $("#foot").className = "foot";
  $("#foot").innerHTML = `<div class="container d-flex justify-content-between flex-wrap gap-2"><span>© 2026 SmartHire. All rights reserved.</span><a href="${BASE}about.html">About</a></div>`;
  const lb = $("#logoutBtn"); if (lb) lb.addEventListener("click", () => Auth.logout());
}

function jobCard(job, pct, matched, missing) {
  return `<div class="col-md-6 col-xl-4"><article class="card-x job-card">
    <div class="d-flex justify-content-between align-items-start gap-2 mb-3">
      <div><h3>${esc(job.title)}</h3><div class="fw-semibold text-secondary">${esc(job.company)}</div><div class="meta"><i class="bi bi-geo-alt"></i> ${esc(job.location)} · ${esc(job.expLabel)}</div></div>
      ${ring(pct)}
    </div>
    <div class="mb-3 flex-grow-1">
      ${matched.map(s => `<span class="b-ok"><i class="bi bi-check-lg"></i>${esc(titleCase(s.name))}</span>`).join("")}
      ${missing.map(s => `<span class="b-bad"><i class="bi bi-x-lg"></i>${esc(titleCase(s.name))}</span>`).join("")}
    </div>
    <a class="btn btn-grad w-100" href="${BASE}job-details.html?id=${job.id}">View Details</a>
  </article></div>`;
}


async function loadJobs() {
  const rows = await Auth.api("/api/jobs");
  JOBS = rows.map(j => ({ id:j.id, title:j.title, company:j.company, location:j.location, exp:j.exp, expLabel:j.expLabel, qual:j.qualification, salary:j.salary, desc:j.description, skills:(j.skills||[]).map(name=>[name,1]) }));
  return JOBS;
}

function validate(form) { form.classList.add("was-validated"); return form.checkValidity(); }

/* ---------- pages ---------- */
async function initLogin() {
  const f = $("#loginForm");
  $("#forgot").addEventListener("click", e => { e.preventDefault(); toast("Password reset is not available in this demo.", "primary"); });
  f.addEventListener("submit", async e => {
    e.preventDefault();
    if (!validate(f)) return;
    const btn = f.querySelector('button[type="submit"]'); btn.disabled = true; btn.textContent = "Signing in…";
    try { await Auth.login($("#email").value.trim(), $("#password").value); location.href = "dashboard.html"; }
    catch (err) { toast(err.message, "danger"); btn.disabled = false; btn.textContent = "Login"; }
  });
  $("#password").addEventListener("input", e => e.target.setCustomValidity(""));
}

async function initRegister() {
  const f = $("#registerForm");
  const check = () => $("#confirm").setCustomValidity($("#confirm").value === $("#password").value ? "" : "mismatch");
  $("#password").addEventListener("input", check); $("#confirm").addEventListener("input", check);
  f.addEventListener("submit", async e => {
    e.preventDefault(); check();
    if (!validate(f)) return;
    const btn = f.querySelector('button[type="submit"]'); btn.disabled = true; btn.textContent = "Creating account…";
    try { await Auth.register({ name: $("#name").value.trim(), email: $("#email").value.trim(), password: $("#password").value, qualification: $("#qualification").value, experience: Number($("#experience").value) }); location.href = "profile.html"; }
    catch (err) { toast(err.message, "danger"); btn.disabled = false; btn.textContent = "Create Account"; }
  });
}

async function initProfile() {
  let user;
  try { await loadJobs(); user = await Auth.refresh(); } catch (err) { toast(err.message, "danger"); return; }
  const paint = () => {
    $("#avatar").textContent = (user.name || "?").charAt(0).toUpperCase();
    $("#pName").textContent = user.name; $("#pEmail").textContent = user.email;
    const scores = JOBS.map(j => simpleScore(user, j).pct);
    $("#cSkills").textContent = user.skills.length;
    $("#cMatches").textContent = scores.filter(p => p >= 40).length;
    $("#cBest").textContent = Math.max(...scores) + "%";
    $("#skillList").innerHTML = user.skills.length
      ? user.skills.map((s, i) => `<span class="skill-pill">${esc(titleCase(s))}<button type="button" data-i="${i}" aria-label="Remove ${esc(s)}">×</button></span>`).join("")
      : `<span class="text-muted">No skills yet. Add your first one below.</span>`;
  };
  $("#fName").value = user.name; $("#fEmail").value = user.email; $("#fQual").value = user.qualification; $("#fExp").value = user.experience;
  $("#detailsForm").addEventListener("submit", async e => {
    e.preventDefault();
    if (!validate(e.target)) return;
    user = { ...user, name: $("#fName").value.trim(), email: $("#fEmail").value.trim(), qualification: $("#fQual").value, experience: Number($("#fExp").value) || 0 };
    try { user = await Auth.update({name:user.name,email:user.email,qualification:user.qualification,experience:user.experience,skills:user.skills}); paint(); renderChrome(); toast("Profile saved."); } catch(err) { toast(err.message,"danger"); }
  });
  $("#skillForm").addEventListener("submit", async e => {
    e.preventDefault();
    const v = norm($("#skillInput").value);
    if (!v) return toast("Type a skill first.", "warning");
    if (user.skills.map(norm).includes(v)) return toast("That skill is already in your list.", "warning");
    user.skills.push(v); try { user = await Auth.update({name:user.name,email:user.email,qualification:user.qualification,experience:user.experience,skills:user.skills}); $("#skillInput").value = ""; paint(); toast(`${titleCase(v)} added.`); } catch(err) { user.skills.pop(); toast(err.message,"danger"); }
  });
  $("#skillList").addEventListener("click", e => {
    const b = e.target.closest("button[data-i]"); if (!b) return;
    const [removed] = user.skills.splice(Number(b.dataset.i), 1);
    Auth.update({name:user.name,email:user.email,qualification:user.qualification,experience:user.experience,skills:user.skills}).then(u=>{user=u;paint();toast(`${titleCase(removed)} removed.`,"secondary");}).catch(err=>{user.skills.splice(Number(b.dataset.i),0,removed);paint();toast(err.message,"danger");});
  });
  const resumeForm = $("#resumeForm");
  if (resumeForm) resumeForm.addEventListener("submit", async e => {
    e.preventDefault(); const file=$("#resumeFile").files[0]; if(!file) return;
    const btn=resumeForm.querySelector("button"); btn.disabled=true; btn.textContent="Analyzing…";
    try { const fd=new FormData(); fd.append("file",file); const result=await Auth.api("/api/resume/upload",{method:"POST",body:fd});
      const found=result.skills||[]; const merged=[...new Set([...(user.skills||[]),...found])];
      user=await Auth.update({name:user.name,email:user.email,qualification:user.qualification,experience:user.experience,skills:merged}); paint();
      $("#resumeResult").textContent=found.length?`Detected and saved ${found.length} skill(s): ${found.join(", ")}`:"No supported skills were detected. You can add skills manually below.";
    } catch(err) { $("#resumeResult").textContent=err.message; } finally { btn.disabled=false; btn.textContent="Analyze Resume"; }
  });
  paint();
}

async function initJobs() {
  try { await loadJobs(); } catch(err) { toast(err.message,"danger"); return; }
  let user = Auth.get() || {skills:[]};
  if (Auth.token()) { try { user = await Auth.refresh(); } catch(err) { toast(err.message,"warning"); user={skills:[]}; } }
  let serverMatches = []; try { serverMatches = await Auth.api("/api/match", {method:"POST",body:JSON.stringify({skills:user.skills,qualification:user.qualification,experience:user.experience})}); } catch(err) { toast(err.message,"danger"); return; }
  const scored = new Map(serverMatches.map(r => [r.job.id, {pct:r.score,matched:r.matched.map(name=>({name,w:1})),missing:r.missing.map(name=>({name,w:1}))}]));
  let filter = "all", q = "";
  const draw = () => {
    const rows = JOBS.map(job => ({ job, s: scored.get(job.id) || {pct:0,matched:[],missing:job.skills.map(([name])=>({name,w:1}))} })).sort((a, b) => b.s.pct - a.s.pct)
      .filter(r => (r.job.title + " " + r.job.company).toLowerCase().includes(q))
      .filter(r => filter === "all" || (filter === "best" ? r.s.pct >= 70 : r.s.pct >= 40 && r.s.pct < 70));
    $("#count").textContent = `${rows.length} of ${JOBS.length} jobs`;
    $("#jobGrid").innerHTML = rows.length ? rows.map(r => jobCard(r.job, r.s.pct, r.s.matched, r.s.missing)).join("")
      : `<div class="col-12"><div class="card-x p-5 text-center text-muted">No jobs match your search. Try a different title or filter.</div></div>`;
  };
  $("#search").addEventListener("input", e => { q = e.target.value.trim().toLowerCase(); draw(); });
  $("#chips").addEventListener("click", e => {
    const c = e.target.closest(".chip"); if (!c) return;
    filter = c.dataset.f;
    document.querySelectorAll(".chip").forEach(x => x.classList.toggle("active", x === c));
    draw();
  });
  draw();
}

async function initDashboard() {
  let user; try { await loadJobs(); user = await Auth.refresh(); } catch(err) { toast(err.message,"danger"); return; }
  let serverMatches=[]; try { serverMatches=await Auth.api("/api/match", {method:"POST",body:JSON.stringify({skills:user.skills,qualification:user.qualification,experience:user.experience})}); } catch(err) { toast(err.message,"danger"); return; }
  const recs = serverMatches.map(r=>{const job=JOBS.find(j=>j.id===r.job.id);return job?{job,m:{final:r.score,matched:r.matched.map(name=>({name,w:1})),missing:r.missing.map(name=>({name,w:1}))}}:null;}).filter(Boolean);
  $("#welcome").textContent = `Welcome back, ${user.name.split(" ")[0]} 👋`;
  const learn = {};
  recs.forEach(r => r.m.missing.forEach(s => { learn[s.name] = (learn[s.name] || 0) + 1; }));
  const learnList = Object.entries(learn).sort((a, b) => b[1] - a[1]);
  $("#sRec").textContent = recs.length;
  $("#sAvg").textContent = (recs.length ? Math.round(recs.reduce((t, r) => t + r.m.final, 0) / recs.length) : 0) + "%";
  $("#sSkills").textContent = user.skills.length;
  $("#sLearn").textContent = learnList.length;
  $("#topJobs").innerHTML = recs.length ? recs.slice(0, 3).map(r => jobCard(r.job, r.m.final, r.m.matched, r.m.missing)).join("")
    : `<div class="col-12"><div class="card-x p-5 text-center text-muted">No matches yet. <a href="profile.html">Add skills to your profile</a> to see recommendations.</div></div>`;
  $("#learn").innerHTML = learnList.length ? learnList.slice(0, 6).map(([s, n]) => {
    const pct = Math.round((n / recs.length) * 100);
    return `<div class="mb-3"><div class="d-flex justify-content-between mb-1"><span class="fw-semibold">${esc(titleCase(s))}</span><span class="text-muted small">Missing in ${n} of ${recs.length} matched jobs</span></div>
      <div class="progress" role="progressbar" aria-label="${esc(s)}" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" style="width:${pct}%"></div></div></div>`;
  }).join("") : `<span class="text-muted">Nothing to learn right now. Add skills or check back as new jobs arrive.</span>`;
  try { const apps=await Auth.api("/api/applications"); $("#applications").innerHTML=apps.length?`<div class="table-responsive"><table class="table align-middle mb-0"><thead><tr><th>Role</th><th>Company</th><th>Status</th><th>Applied</th></tr></thead><tbody>${apps.map(a=>`<tr><td>${esc(a.jobTitle)}</td><td>${esc(a.company)}</td><td><span class="badge text-bg-success">${esc(a.status)}</span></td><td>${new Date(a.appliedAt).toLocaleDateString()}</td></tr>`).join("")}</tbody></table></div>`:`<p class="text-muted mb-0">You have not submitted any applications yet. Open a job and select Apply Now to track it here.</p>`; } catch(err) { $("#applications").textContent=err.message; }
}

async function initDetails() {
  let user; try { await loadJobs(); user = await Auth.refresh(); } catch(err) { toast(err.message,"danger"); return; }
  const id = Number(new URLSearchParams(location.search).get("id"));
  const job = JOBS.find(j => j.id === id), box = $("#detail");
  if (!job) { box.innerHTML = `<div class="card-x p-5 text-center"><h1 class="h4">Job not found</h1><p class="text-muted">That job ID does not exist.</p><a href="jobs.html" class="btn btn-grad">Back to Jobs</a></div>`; return; }
  let serverMatch; try { const rows=await Auth.api("/api/match",{method:"POST",body:JSON.stringify({skills:user.skills})}); serverMatch=rows.find(r=>r.job.id===job.id); } catch(err) { toast(err.message,"danger"); return; }
  const m = serverMatch ? {final:serverMatch.score,matched:serverMatch.matched.map(name=>({name,w:1})),missing:serverMatch.missing.map(name=>({name,w:1}))} : {final:0,matched:[],missing:job.skills.map(([name])=>({name,w:1}))};
  const top = m.missing.slice()[0];
  const why = [
    `You cover ${m.matched.length} of ${job.skills.length} required skills. The match percentage is calculated as matched skills divided by total required skills.`,
    `The role lists ${esc(job.qual)} as its preferred qualification and ${esc(job.expLabel)} experience. These are shown as job details and are not part of the report's current skill-coverage score.`,
    top ? `A useful next skill to learn is <b>${esc(titleCase(top.name))}</b>.` : "You already have every required skill."
  ];
  const list = (arr, ok) => arr.length ? `<ul class="skill-list ${ok ? "ok" : "bad"}">${arr.map(s => `<li><span><i class="bi ${ok ? "bi-check-circle-fill" : "bi-x-circle-fill"} me-2"></i>${esc(titleCase(s.name))}</span><small>Required skill</small></li>`).join("")}</ul>` : `<p class="text-muted mb-0">${ok ? "No matched skills yet." : "Nothing missing."}</p>`;
  document.title = `${job.title} at ${job.company} | SmartHire`;
  box.innerHTML = `<a href="jobs.html" class="d-inline-block mb-3"><i class="bi bi-arrow-left"></i> Back to Jobs</a>
  <div class="card-x p-4 p-md-5 mb-4"><div class="row align-items-center g-4">
    <div class="col-md"><h1 class="fw-bold mb-1">${esc(job.title)}</h1><div class="h5 text-secondary">${esc(job.company)}</div>
      <div class="meta mb-3"><i class="bi bi-geo-alt"></i> ${esc(job.location)} · <i class="bi bi-briefcase"></i> ${esc(job.expLabel)} · <i class="bi bi-mortarboard"></i> ${esc(job.qual)} · <i class="bi bi-cash"></i> ${esc(job.salary)}</div>
      <p class="mb-3">${esc(job.desc)}</p><button class="btn btn-grad btn-lg" id="applyBtn">Apply Now</button></div>
    <div class="col-md-auto text-center">${ring(m.final, true)}<div class="mt-2 fw-semibold">Overall match</div></div>
  </div></div>
  <div class="row g-4 mb-4">
    <div class="col-md-6"><div class="card-x p-4 h-100"><h2 class="h5 fw-bold mb-3 text-success">Matched Skills</h2>${list(m.matched, true)}</div></div>
    <div class="col-md-6"><div class="card-x p-4 h-100"><h2 class="h5 fw-bold mb-3 text-danger">Missing Skills</h2>${list(m.missing, false)}</div></div>
  </div>
  <div class="card-x p-4"><h2 class="h5 fw-bold mb-3">Why This Match?</h2>
    <div class="row g-3 mb-3 text-center"><div class="col-12"><div class="mini-stat"><b>${m.final}%</b><span>Required-skill coverage</span></div></div></div>
    <ul class="mb-0">${why.map(w => `<li class="mb-2">${w}</li>`).join("")}</ul></div>`;
  $("#applyBtn").addEventListener("click", async () => { const b=$("#applyBtn"); b.disabled=true; try { await Auth.api("/api/applications",{method:"POST",body:JSON.stringify({jobId:job.id})}); toast(`Application recorded for ${job.title}.`); b.textContent="Application Submitted"; } catch(err) { toast(err.message,"danger"); b.disabled=false; } });
}

/* ---------- boot ---------- */
if (Auth.guard()) {
  renderChrome();
  ({ login: initLogin, register: initRegister, profile: initProfile, jobs: initJobs, dashboard: initDashboard, details: initDetails }[PAGE] || (() => {}))();
}
