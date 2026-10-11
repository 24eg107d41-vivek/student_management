// Student Management Frontend Controller (Vanilla JavaScript)

// Dynamic API detection:
// When served on cloud (Render) or localhost:8080, use relative "/api/students".
// Only fall back to http://localhost:8080 when opened via file:// or dev Live Server (port 5500).
const isDevLiveServer = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") && window.location.port !== "8080" && window.location.port !== "";
const API_BASE = isDevLiveServer || window.location.protocol === "file:"
  ? "http://localhost:8080/api/students"
  : "/api/students";

// Global In-Memory State
let studentsList = [];
let deleteTargetId = null;

// Bootstrap Modal and Toast instances
let studentModalInstance = null;
let deleteModalInstance = null;
let toastInstance = null;

// Avatar Palette
const AVATAR_COLORS = [
  "linear-gradient(135deg, #6366f1, #8b5cf6)",
  "linear-gradient(135deg, #3b82f6, #06b6d4)",
  "linear-gradient(135deg, #10b981, #059669)",
  "linear-gradient(135deg, #f59e0b, #d97706)",
  "linear-gradient(135deg, #ec4899, #8b5cf6)",
  "linear-gradient(135deg, #14b8a6, #0284c7)"
];

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  studentModalInstance = new bootstrap.Modal(document.getElementById("studentModal"));
  deleteModalInstance = new bootstrap.Modal(document.getElementById("deleteConfirmModal"));
  toastInstance = new bootstrap.Toast(document.getElementById("actionToast"));

  // Fetch initial student list
  loadStudents();
});

// Update Server Connection Status Indicator
function updateConnectionStatus(isOnline, message) {
  const pill = document.getElementById("backendStatusPill");
  const text = document.getElementById("backendStatusText");
  if (!pill || !text) return;

  pill.className = "status-pill " + (isOnline ? "status-online" : "status-offline");
  text.textContent = isOnline ? "Connected (Spring Boot)" : (message || "Backend Offline");
}

// Fetch Students from REST API
async function loadStudents() {
  const refreshIcon = document.getElementById("refreshIcon");
  if (refreshIcon) refreshIcon.classList.add("spin-animation");

  try {
    const response = await fetch(API_BASE, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    studentsList = await response.json();
    updateConnectionStatus(true);
    renderStudents(studentsList);
    updateStats(studentsList);
    populateDepartmentFilter(studentsList);
  } catch (err) {
    console.error("Failed to load students:", err);
    updateConnectionStatus(false, "Server Offline (Check port 8080)");
    renderTableError("Unable to connect to Spring Boot API. Make sure the backend server is running on port 8080.");
  } finally {
    if (refreshIcon) refreshIcon.classList.remove("spin-animation");
  }
}

// Manual Refresh
function refreshStudentData() {
  loadStudents();
  showToast("Student data refreshed", "info");
}

// Render Table Rows
function renderStudents(list) {
  const tbody = document.getElementById("studentTableBody");
  const emptyState = document.getElementById("emptyState");
  const visibleCount = document.getElementById("visibleCount");

  if (!tbody) return;
  tbody.innerHTML = "";

  visibleCount.textContent = list.length;

  if (list.length === 0) {
    emptyState.classList.remove("d-none");
    return;
  }

  emptyState.classList.add("d-none");

  list.forEach((student, index) => {
    const tr = document.createElement("tr");

    // Initials & Color
    const initials = student.name ? student.name.charAt(0).toUpperCase() : "?";
    const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

    // Department Badge Class
    const deptClass = getDeptBadgeClass(student.department);

    tr.innerHTML = `
      <td>
        <span class="badge bg-light text-dark border fw-bold">#${student.id}</span>
      </td>
      <td>
        <div class="d-flex align-items-center">
          <div class="avatar-badge" style="background: ${avatarColor};">${initials}</div>
          <div>
            <div class="fw-bold text-dark">${escapeHtml(student.name)}</div>
            <small class="text-muted">Student ID: ${student.id}</small>
          </div>
        </div>
      </td>
      <td>
        <div>
          <a href="mailto:${escapeHtml(student.email)}" class="text-decoration-none text-dark d-block">
            <i class="bi bi-envelope me-1 text-muted"></i>${escapeHtml(student.email)}
          </a>
          ${student.phone ? `
            <a href="tel:${escapeHtml(student.phone)}" class="text-decoration-none small text-muted">
              <i class="bi bi-telephone me-1"></i>${escapeHtml(student.phone)}
            </a>
          ` : ""}
        </div>
      </td>
      <td>
        <span class="dept-pill ${deptClass}">
          ${escapeHtml(student.department || "General")}
        </span>
      </td>
      <td>
        <span class="badge bg-secondary-subtle text-secondary px-2 py-1 rounded">
          <i class="bi bi-calendar3 me-1"></i>Year ${student.year || 1}
        </span>
      </td>
      <td class="text-end">
        <button type="button" class="btn btn-action btn-outline-primary me-1" title="Edit Student" onclick="openEditModal(${student.id})">
          <i class="bi bi-pencil-fill"></i>
        </button>
        <button type="button" class="btn btn-action btn-outline-danger" title="Delete Student" onclick="openDeleteModal(${student.id}, '${escapeHtml(student.name)}')">
          <i class="bi bi-trash-fill"></i>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// Compute Department Badge Class
function getDeptBadgeClass(dept) {
  if (!dept) return "dept-default";
  const d = dept.toLowerCase();
  if (d.includes("computer") || d.includes("cs") || d.includes("software")) return "dept-cs";
  if (d.includes("information") || d.includes("it")) return "dept-it";
  if (d.includes("mech")) return "dept-mech";
  if (d.includes("elec") || d.includes("comm") || d.includes("ece")) return "dept-ece";
  return "dept-default";
}

// Update Top Stat Cards
function updateStats(list) {
  const totalStudentsEl = document.getElementById("statTotalStudents");
  const totalDeptsEl = document.getElementById("statTotalDepartments");
  const topDeptEl = document.getElementById("statTopDepartment");

  if (totalStudentsEl) totalStudentsEl.textContent = list.length;

  const deptCounts = {};
  list.forEach((s) => {
    if (s.department) {
      const d = s.department.trim();
      deptCounts[d] = (deptCounts[d] || 0) + 1;
    }
  });

  const depts = Object.keys(deptCounts);
  if (totalDeptsEl) totalDeptsEl.textContent = depts.length;

  if (topDeptEl) {
    if (depts.length === 0) {
      topDeptEl.textContent = "-";
    } else {
      let top = depts[0];
      for (const d of depts) {
        if (deptCounts[d] > deptCounts[top]) top = d;
      }
      topDeptEl.textContent = top;
    }
  }
}

// Populate Department Filter Dropdown
function populateDepartmentFilter(list) {
  const select = document.getElementById("departmentFilter");
  if (!select) return;

  const currentVal = select.value;
  const uniqueDepts = Array.from(new Set(list.map((s) => s.department).filter(Boolean))).sort();

  select.innerHTML = '<option value="">All Departments</option>';
  uniqueDepts.forEach((dept) => {
    const opt = document.createElement("option");
    opt.value = dept;
    opt.textContent = dept;
    if (dept === currentVal) opt.selected = true;
    select.appendChild(opt);
  });
}

// Real-Time Filter / Search
function filterStudents() {
  const searchInput = document.getElementById("searchInput");
  const deptFilter = document.getElementById("departmentFilter");
  const clearBtn = document.getElementById("clearSearchBtn");

  const query = (searchInput ? searchInput.value : "").toLowerCase().trim();
  const selectedDept = (deptFilter ? deptFilter.value : "").toLowerCase().trim();

  if (clearBtn) {
    clearBtn.classList.toggle("d-none", query.length === 0);
  }

  const filtered = studentsList.filter((s) => {
    const matchQuery =
      !query ||
      (s.name && s.name.toLowerCase().includes(query)) ||
      (s.email && s.email.toLowerCase().includes(query)) ||
      (s.department && s.department.toLowerCase().includes(query)) ||
      (s.phone && s.phone.includes(query)) ||
      (s.year && String(s.year).includes(query));

    const matchDept = !selectedDept || (s.department && s.department.toLowerCase() === selectedDept);

    return matchQuery && matchDept;
  });

  renderStudents(filtered);
}

// Clear Search Query
function clearSearch() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.value = "";
  filterStudents();
}

// Open Modal in Add Mode
function openAddModal() {
  document.getElementById("studentForm").reset();
  document.getElementById("studentId").value = "";
  document.getElementById("studentModalTitle").innerHTML =
    '<i class="bi bi-person-plus-fill me-2"></i> Enroll Student';
  document.getElementById("modalHeader").className = "modal-header bg-gradient-primary text-white";
  document.getElementById("saveSubmitBtn").innerHTML =
    '<i class="bi bi-check2-circle me-1"></i> Save Student';
  studentModalInstance.show();
}

// Open Modal in Edit Mode
function openEditModal(id) {
  const student = studentsList.find((s) => s.id === id);
  if (!student) return;

  document.getElementById("studentId").value = student.id;
  document.getElementById("studentName").value = student.name || "";
  document.getElementById("studentEmail").value = student.email || "";
  document.getElementById("studentPhone").value = student.phone || "";
  document.getElementById("studentDepartment").value = student.department || "";
  document.getElementById("studentYear").value = student.year || 1;

  document.getElementById("studentModalTitle").innerHTML =
    '<i class="bi bi-pencil-square me-2"></i> Update Student #' + student.id;
  document.getElementById("modalHeader").className = "modal-header bg-gradient-edit text-white";
  document.getElementById("saveSubmitBtn").innerHTML =
    '<i class="bi bi-check-lg me-1"></i> Update Changes';

  studentModalInstance.show();
}

// Handle Form Submission (Add or Update)
async function handleFormSubmit(event) {
  event.preventDefault();

  const id = document.getElementById("studentId").value;
  const studentPayload = {
    name: document.getElementById("studentName").value.trim(),
    email: document.getElementById("studentEmail").value.trim(),
    phone: document.getElementById("studentPhone").value.trim(),
    department: document.getElementById("studentDepartment").value.trim(),
    year: parseInt(document.getElementById("studentYear").value, 10) || 1
  };

  const isEdit = Boolean(id);
  const targetUrl = isEdit ? `${API_BASE}/${id}` : API_BASE;
  const method = isEdit ? "PUT" : "POST";

  const submitBtn = document.getElementById("saveSubmitBtn");
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';

  try {
    const res = await fetch(targetUrl, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentPayload)
    });

    if (!res.ok) {
      throw new Error(`Failed to save: ${res.statusText}`);
    }

    studentModalInstance.hide();
    showToast(isEdit ? "Student updated successfully!" : "Student enrolled successfully!", "success");
    await loadStudents();
  } catch (err) {
    console.error("Save error:", err);
    showToast("Error saving student: " + err.message, "danger");
  } finally {
    submitBtn.disabled = false;
  }
}

// Open Delete Confirmation Modal
function openDeleteModal(id, name) {
  deleteTargetId = id;
  document.getElementById("deleteTargetName").textContent = name;
  deleteModalInstance.show();
}

// Execute Student Delete
async function executeDeleteStudent() {
  if (!deleteTargetId) return;

  const btn = document.getElementById("confirmDeleteBtn");
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Deleting...';

  try {
    const res = await fetch(`${API_BASE}/${deleteTargetId}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      throw new Error(`Failed to delete: ${res.statusText}`);
    }

    deleteModalInstance.hide();
    showToast("Student deleted successfully!", "success");
    await loadStudents();
  } catch (err) {
    console.error("Delete error:", err);
    showToast("Error deleting student: " + err.message, "danger");
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-trash-fill me-1"></i> Delete';
    deleteTargetId = null;
  }
}

// Export visible students to CSV
function exportStudentsToCSV() {
  if (studentsList.length === 0) {
    showToast("No student records available to export.", "warning");
    return;
  }

  const headers = ["ID", "Name", "Email", "Phone", "Department", "Year"];
  const rows = studentsList.map((s) => [
    s.id,
    `"${(s.name || "").replace(/"/g, '""')}"`,
    `"${(s.email || "").replace(/"/g, '""')}"`,
    `"${(s.phone || "").replace(/"/g, '""')}"`,
    `"${(s.department || "").replace(/"/g, '""')}"`,
    s.year || 1
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `students_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("CSV file downloaded successfully", "success");
}

// Show Toast Notification
function showToast(message, type = "success") {
  const toastEl = document.getElementById("actionToast");
  const msgEl = document.getElementById("toastMessage");
  const iconEl = document.getElementById("toastIcon");

  if (!toastEl || !msgEl) return;

  msgEl.textContent = message;

  // Set color and icon
  toastEl.className = "toast align-items-center border-0 text-white shadow-lg";
  if (type === "success") {
    toastEl.classList.add("bg-success");
    iconEl.className = "bi bi-check-circle-fill fs-5 me-2";
  } else if (type === "danger") {
    toastEl.classList.add("bg-danger");
    iconEl.className = "bi bi-exclamation-triangle-fill fs-5 me-2";
  } else if (type === "warning") {
    toastEl.classList.add("bg-warning", "text-dark");
    iconEl.className = "bi bi-exclamation-circle-fill fs-5 me-2";
  } else {
    toastEl.classList.add("bg-primary");
    iconEl.className = "bi bi-info-circle-fill fs-5 me-2";
  }

  toastInstance.show();
}

// Render Table Error state
function renderTableError(message) {
  const tbody = document.getElementById("studentTableBody");
  if (!tbody) return;

  tbody.innerHTML = `
    <tr>
      <td colspan="6" class="text-center py-5 text-danger">
        <i class="bi bi-wifi-off fs-1 d-block mb-2"></i>
        <h5 class="fw-bold">Connection Error</h5>
        <p class="small text-muted mb-3">${escapeHtml(message)}</p>
        <button class="btn btn-outline-primary btn-sm" onclick="loadStudents()">
          <i class="bi bi-arrow-clockwise me-1"></i> Retry Connection
        </button>
      </td>
    </tr>
  `;
}

// Simple HTML Escaping helper
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
