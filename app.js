// --- STATE & STORAGE ---
const DEFAULT_MENTORS = [
  { name: "Dr. R. Verma", email: "mentor@edutrack.edu", username: "mentor", password: "admin123", dept: "CSE (AI & DS)" },
  { name: "Prof. S. Kulkarni", email: "kulkarni@edutrack.edu", username: "kulkarni", password: "123", dept: "Computer Science" },
  { name: "Dr. A. Deshmukh", email: "deshmukh@edutrack.edu", username: "deshmukh", password: "123", dept: "Data Science" },
  { name: "Prof. N. Joshi", email: "joshi@edutrack.edu", username: "joshi", password: "123", dept: "Information Technology" },
  { name: "Dr. P. Nair", email: "nair@edutrack.edu", username: "nair", password: "123", dept: "Artificial Intelligence" }
];

const DEMO_STUDENTS = [
  { Student_ID: "STU101", Name: "Aarav Sharma", Email: "aarav.sharma@college.edu", Course: "B.Tech CSE (AI & DS)", Mentor: "Dr. R. Verma", Status: "At Risk", Remarks: "Missed 3 consecutive lab sessions" },
  { Student_ID: "STU102", Name: "Diya Patil", Email: "diya.patil@college.edu", Course: "B.Tech CSE (AI & DS)", Mentor: "Dr. R. Verma", Status: "Active", Remarks: "Consistent attendance and assignment scores" },
  { Student_ID: "STU103", Name: "Rohan Mehta", Email: "rohan.mehta@college.edu", Course: "B.Tech Computer Science", Mentor: "Prof. S. Kulkarni", Status: "Active", Remarks: "Participating in coding club" },
  { Student_ID: "STU104", Name: "Ananya Iyer", Email: "ananya.iyer@college.edu", Course: "B.Tech Data Science", Mentor: "Dr. A. Deshmukh", Status: "Completed", Remarks: "Completed semester mentoring cycle" },
  { Student_ID: "STU105", Name: "Kabir Singh", Email: "kabir.singh@college.edu", Course: "B.Tech IT", Mentor: "Prof. N. Joshi", Status: "Inactive", Remarks: "No response to last 2 check-in emails" },
  { Student_ID: "STU106", Name: "Sneha Rao", Email: "sneha.rao@college.edu", Course: "B.Tech AI", Mentor: "Dr. P. Nair", Status: "At Risk", Remarks: "Low mid-term score in Engineering Mechanics" },
  { Student_ID: "STU107", Name: "Vikram Joshi", Email: "vikram.joshi@college.edu", Course: "B.Tech Computer Science", Mentor: "Prof. S. Kulkarni", Status: "Active", Remarks: "On track for project submission" },
  { Student_ID: "STU108", Name: "Meera Nair", Email: "meera.nair@college.edu", Course: "B.Tech Data Science", Mentor: "Dr. A. Deshmukh", Status: "At Risk", Remarks: "Needs extra support with Python assignments" },
  { Student_ID: "STU109", Name: "Aditya Verma", Email: "aditya.verma@college.edu", Course: "B.Tech IT", Mentor: "Prof. N. Joshi", Status: "Completed", Remarks: "All coursework verified" },
  { Student_ID: "STU110", Name: "Priya Kulkarni", Email: "priya.kulkarni@college.edu", Course: "B.Tech AI", Mentor: "Dr. P. Nair", Status: "Active", Remarks: "Strong progress in lab practicals" }
];

let mentors = JSON.parse(localStorage.getItem("edutrack_mentors")) || DEFAULT_MENTORS;
let activeMentor = null;

// Separate datasets registry (never merged)
const DATASETS = {
  file1: { label: "Dataset 1 (file1.xlsx)", path: "data/file1.xlsx", records: [] },
  file2: { label: "Dataset 2 (file2.xlsx)", path: "data/file2.xlsx", records: [] }
};
let currentDsKey = "file1";
let editingIndex = null;

// --- 1. LOGIN & AUTHENTICATION ---
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const idInput = document.getElementById("login-user").value.trim().toLowerCase();
  const passInput = document.getElementById("login-pass").value.trim();

  const found = mentors.find(
    m => (m.email.toLowerCase() === idInput || m.username.toLowerCase() === idInput) && m.password === passInput
  );

  if (!found) {
    document.getElementById("login-error").classList.remove("hidden");
    return;
  }

  document.getElementById("login-error").classList.add("hidden");
  activeMentor = found;
  updateMentorUI();

  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("app-container").classList.remove("hidden");

  await loadDataset("file1");
});

document.getElementById("logout-btn").addEventListener("click", () => {
  activeMentor = null;
  document.getElementById("app-container").classList.add("hidden");
  document.getElementById("login-screen").classList.remove("hidden");
});

// --- 2. MENTOR PROFILE & MULTI-ACCOUNT ---
function updateMentorUI() {
  if (!activeMentor) return;
  const initials = activeMentor.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  document.getElementById("sidebar-avatar").textContent = initials;
  document.getElementById("sidebar-mentor-name").textContent = activeMentor.name;
  document.getElementById("drawer-email").textContent = activeMentor.email;
  document.getElementById("drawer-dept").textContent = activeMentor.dept;

  document.getElementById("active-mentor-details").innerHTML = `
    <p><strong>Full Name:</strong> ${activeMentor.name}</p>
    <p><strong>Email / Login ID:</strong> ${activeMentor.email}</p>
    <p><strong>Department:</strong> ${activeMentor.dept}</p>
    <p><strong>Active Dataset:</strong> ${DATASETS[currentDsKey].label}</p>
  `;

  document.getElementById("mentor-accounts-tbody").innerHTML = mentors.map(m => `
    <tr>
      <td><strong>${m.name}</strong></td>
      <td>${m.email}</td>
      <td>${m.dept}</td>
      <td><span class="badge ${m.email === activeMentor.email ? 'badge-active' : 'badge-inactive'}">
        ${m.email === activeMentor.email ? 'Active Session' : 'Registered'}
      </span></td>
    </tr>
  `).join("");
}

document.getElementById("sidebar-account-toggle").addEventListener("click", () => {
  document.getElementById("sidebar-account-drawer").classList.toggle("hidden");
});

document.getElementById("add-mentor-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("new-mentor-name").value.trim();
  const email = document.getElementById("new-mentor-email").value.trim();
  const dept = document.getElementById("new-mentor-dept").value.trim();
  const password = document.getElementById("new-mentor-pass").value.trim();

  mentors.push({ name, email, username: email.split("@")[0], password, dept });
  localStorage.setItem("edutrack_mentors", JSON.stringify(mentors));
  e.target.reset();
  updateMentorUI();
  alert(`Mentor account created for ${name}.`);
});

// --- 3. EXCEL LOADING & SEPARATE DATASET MANAGEMENT ---
function normalizeRow(row, idx) {
  return {
    Student_ID: row.Student_ID || row["Student ID"] || row.ID || `STU${100 + idx}`,
    Name: row.Name || row["Student Name"] || "Unknown Student",
    Email: row.Email || row["Email Address"] || "—",
    Course: row.Course || row["Registered Course"] || "General",
    Mentor: row.Mentor || row["Mentor Name"] || activeMentor?.name || "Unassigned",
    Status: ["Active", "At Risk", "Inactive", "Completed"].includes(row.Status) ? row.Status : "Active",
    Remarks: row.Remarks || row["Mentor Remarks"] || ""
  };
}

async function loadDataset(dsKey) {
  currentDsKey = dsKey;
  document.getElementById("active-dataset-label").textContent = `Viewing: ${DATASETS[dsKey].label}`;

  const cached = localStorage.getItem(`edutrack_ds_${dsKey}`);
  if (cached) {
    DATASETS[dsKey].records = JSON.parse(cached);
    refreshAllViews();
    return;
  }

  if (DATASETS[dsKey].path) {
    try {
      const res = await fetch(DATASETS[dsKey].path);
      if (!res.ok) throw new Error("File not found");
      const buf = await res.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const raw = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "" });
      DATASETS[dsKey].records = raw.length > 0 ? raw.map(normalizeRow) : (dsKey === "file1" ? [...DEMO_STUDENTS] : []);
    } catch (err) {
      DATASETS[dsKey].records = dsKey === "file1" ? [...DEMO_STUDENTS] : [];
      console.warn(`Could not fetch ${DATASETS[dsKey].path}, using fallback:`, err);
    }
  }
  refreshAllViews();
}

// Import additional .xlsx as a separate selectable tab
document.getElementById("excel-upload").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const raw = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "" });

  const key = `custom_${Date.now()}`;
  DATASETS[key] = { label: file.name, path: null, records: raw.map(normalizeRow) };
  localStorage.setItem(`edutrack_ds_${key}`, JSON.stringify(DATASETS[key].records));

  const btn = document.createElement("button");
  btn.className = "ds-btn";
  btn.dataset.ds = key;
  btn.textContent = file.name;
  btn.addEventListener("click", () => selectDatasetTab(key));
  document.getElementById("dataset-tabs").appendChild(btn);

  selectDatasetTab(key);
  e.target.value = "";
});

function selectDatasetTab(dsKey) {
  document.querySelectorAll(".ds-btn").forEach(b => b.classList.toggle("active", b.dataset.ds === dsKey));
  loadDataset(dsKey);
}

document.querySelectorAll(".ds-btn").forEach(btn => {
  btn.addEventListener("click", () => selectDatasetTab(btn.dataset.ds));
});

// --- 4. RENDERING KPIs, TABLES & FILTERS ---
function refreshAllViews() {
  const list = DATASETS[currentDsKey].records;

  // KPIs
  document.getElementById("kpi-total").textContent = list.length;
  document.getElementById("kpi-active").textContent = list.filter(s => s.Status === "Active").length;
  document.getElementById("kpi-risk").textContent = list.filter(s => s.Status === "At Risk").length;
  document.getElementById("kpi-inactive").textContent = list.filter(s => s.Status === "Inactive").length;
  document.getElementById("kpi-completed").textContent = list.filter(s => s.Status === "Completed").length;

  // Populate Mentor Filter Dropdown
  const mentorSelect = document.getElementById("mentor-filter");
  const prevMentor = mentorSelect.value;
  const uniqueMentors = [...new Set(list.map(s => s.Mentor).filter(Boolean))];
  mentorSelect.innerHTML = `<option value="All">All Mentors</option>` +
    uniqueMentors.map(m => `<option value="${m}">${m}</option>`).join("");
  if (uniqueMentors.includes(prevMentor)) mentorSelect.value = prevMentor;

  // Dashboard Priority At-Risk Table (Top 8)
  const atRiskList = list.map((s, idx) => ({ ...s, _idx: idx })).filter(s => s.Status === "At Risk");
  document.getElementById("dashboard-risk-tbody").innerHTML = atRiskList.slice(0, 8).map(s => `
    <tr>
      <td><strong>${s.Student_ID}</strong></td>
      <td>${s.Name}</td>
      <td>${s.Course}</td>
      <td>${s.Remarks || "Needs review"}</td>
      <td><button class="btn-secondary" onclick="openProfile(${s._idx})">Inspect</button></td>
    </tr>
  `).join("") || `<tr><td colspan="5" class="muted">No At-Risk students in this dataset.</td></tr>`;

  // Mentor Workload Summary
  const counts = {};
  list.forEach(s => { counts[s.Mentor] = (counts[s.Mentor] || 0) + 1; });
  document.getElementById("mentor-summary-list").innerHTML = Object.entries(counts).map(([m, c]) => `
    <div class="summary-item"><span>${m}</span><strong>${c} students</strong></div>
  `).join("") || `<p class="muted">No records loaded.</p>`;

  renderStudentTable();
  updateMentorUI();
}

function renderStudentTable() {
  const list = DATASETS[currentDsKey].records;
  const q = document.getElementById("search-input").value.toLowerCase();
  const statusVal = document.getElementById("status-filter").value;
  const mentorVal = document.getElementById("mentor-filter").value;

  const filtered = list
    .map((s, idx) => ({ ...s, _idx: idx }))
    .filter(s => {
      const okStatus = statusVal === "All" || s.Status === statusVal;
      const okMentor = mentorVal === "All" || s.Mentor === mentorVal;
      const okQuery =
        String(s.Student_ID).toLowerCase().includes(q) ||
        String(s.Name).toLowerCase().includes(q) ||
        String(s.Email).toLowerCase().includes(q) ||
        String(s.Course).toLowerCase().includes(q) ||
        String(s.Mentor).toLowerCase().includes(q);
      return okStatus && okMentor && okQuery;
    });

  document.getElementById("showing-count").textContent = `Showing ${filtered.length} of ${list.length} records`;

  document.getElementById("student-tbody").innerHTML = filtered.map(s => {
    const badgeClass = `badge-${s.Status.toLowerCase().replace(/\s+/g, "-")}`;
    return `
      <tr>
        <td><strong>${s.Student_ID}</strong></td>
        <td>${s.Name}</td>
        <td>${s.Email}</td>
        <td>${s.Course}</td>
        <td>${s.Mentor}</td>
        <td><span class="badge ${badgeClass}">${s.Status}</span></td>
        <td>${s.Remarks || "—"}</td>
        <td><button class="btn-secondary" onclick="openProfile(${s._idx})">View / Edit</button></td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="8" class="muted">No matching student records found.</td></tr>`;
}

// --- 5. NAVIGATION ---
window.switchPage = function(page) {
  document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.page === page));
  document.getElementById("page-dashboard").classList.toggle("hidden", page !== "dashboard");
  document.getElementById("page-mentor-profile").classList.toggle("hidden", page !== "mentor-profile");
  document.getElementById("page-students").classList.toggle("hidden", page !== "students" && page !== "at-risk");

  if (page === "at-risk") {
    document.getElementById("students-page-title").textContent = "At-Risk Student Monitoring";
    document.getElementById("status-filter").value = "At Risk";
    renderStudentTable();
  } else if (page === "students") {
    document.getElementById("students-page-title").textContent = "Students Directory";
    document.getElementById("status-filter").value = "All";
    renderStudentTable();
  }
};

document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", () => switchPage(btn.dataset.page));
});

document.getElementById("search-input").addEventListener("input", renderStudentTable);
document.getElementById("status-filter").addEventListener("change", renderStudentTable);
document.getElementById("mentor-filter").addEventListener("change", renderStudentTable);

// --- 6. INDIVIDUAL STUDENT PROFILE & REMARKS MODAL ---
window.openProfile = function(idx) {
  editingIndex = idx;
  const s = DATASETS[currentDsKey].records[idx];
  document.getElementById("modal-name").textContent = s.Name;
  document.getElementById("modal-id-badge").textContent = `Student ID: ${s.Student_ID}`;
  document.getElementById("modal-email").textContent = s.Email;
  document.getElementById("modal-course").textContent = s.Course;
  document.getElementById("modal-mentor").textContent = s.Mentor;
  document.getElementById("modal-dataset").textContent = DATASETS[currentDsKey].label;
  document.getElementById("modal-status").value = s.Status;
  document.getElementById("modal-remarks").value = s.Remarks;
  document.getElementById("student-modal").classList.remove("hidden");
};

function closeModal() {
  document.getElementById("student-modal").classList.add("hidden");
}
document.getElementById("close-modal").addEventListener("click", closeModal);
document.getElementById("cancel-modal-btn").addEventListener("click", closeModal);

document.getElementById("save-student-btn").addEventListener("click", () => {
  if (editingIndex === null) return;
  const record = DATASETS[currentDsKey].records[editingIndex];
  record.Status = document.getElementById("modal-status").value;
  record.Remarks = document.getElementById("modal-remarks").value.trim();
  localStorage.setItem(`edutrack_ds_${currentDsKey}`, JSON.stringify(DATASETS[currentDsKey].records));
  closeModal();
  refreshAllViews();
});

// --- 7. RESET & EXPORT ---
document.getElementById("reset-btn").addEventListener("click", () => {
  localStorage.removeItem(`edutrack_ds_${currentDsKey}`);
  loadDataset(currentDsKey);
});

document.getElementById("export-btn").addEventListener("click", () => {
  const ws = XLSX.utils.json_to_sheet(DATASETS[currentDsKey].records);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Students");
  XLSX.writeFile(wb, `${currentDsKey}_updated.xlsx`);
});
