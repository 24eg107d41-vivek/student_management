// Student Management JavaScript Helper

document.addEventListener("DOMContentLoaded", () => {
  // Auto-dismiss alert messages after 4 seconds
  const alerts = document.querySelectorAll(".alert-dismissible");
  alerts.forEach((alert) => {
    setTimeout(() => {
      const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
      if (bsAlert) {
        bsAlert.close();
      }
    }, 4000);
  });

  // Client-side quick filter
  const quickSearchInput = document.getElementById("clientSearchInput");
  if (quickSearchInput) {
    quickSearchInput.addEventListener("input", function () {
      const query = this.value.toLowerCase().trim();
      const rows = document.querySelectorAll("#studentTableBody tr");

      let visibleCount = 0;
      rows.forEach((row) => {
        const text = row.innerText.toLowerCase();
        if (text.includes(query)) {
          row.style.display = "";
          visibleCount++;
        } else {
          row.style.display = "none";
        }
      });

      const emptyRow = document.getElementById("noFilterResultsRow");
      if (emptyRow) {
        emptyRow.style.display = (visibleCount === 0 && rows.length > 0) ? "" : "none";
      }
    });
  }

  // Department Filter
  const deptFilter = document.getElementById("deptFilterSelect");
  if (deptFilter) {
    deptFilter.addEventListener("change", function () {
      const selectedDept = this.value.toLowerCase().trim();
      const rows = document.querySelectorAll("#studentTableBody tr");

      let visibleCount = 0;
      rows.forEach((row) => {
        const dept = row.getAttribute("data-dept") || "";
        if (!selectedDept || dept.toLowerCase().includes(selectedDept)) {
          row.style.display = "";
          visibleCount++;
        } else {
          row.style.display = "none";
        }
      });

      const emptyRow = document.getElementById("noFilterResultsRow");
      if (emptyRow) {
        emptyRow.style.display = (visibleCount === 0 && rows.length > 0) ? "" : "none";
      }
    });
  }
});

// Populate edit modal
function populateEditModal(id, name, email, phone, department, year) {
  const form = document.getElementById("editStudentForm");
  if (form) {
    form.action = `/students/update/${id}`;
  }
  document.getElementById("editId").value = id;
  document.getElementById("editName").value = name;
  document.getElementById("editEmail").value = email;
  document.getElementById("editPhone").value = phone;
  document.getElementById("editDepartment").value = department;
  document.getElementById("editYear").value = year;
}

// Populate delete modal
function populateDeleteModal(id, name) {
  document.getElementById("deleteStudentName").textContent = name;
  const deleteBtn = document.getElementById("confirmDeleteBtn");
  if (deleteBtn) {
    deleteBtn.href = `/students/delete/${id}`;
  }
}

// Export visible table rows to CSV
function exportTableToCSV(filename = "students_export.csv") {
  const rows = document.querySelectorAll("#studentTable tr");
  let csv = [];

  rows.forEach((row) => {
    if (row.style.display === "none") return;
    const cols = row.querySelectorAll("th, td");
    const rowData = [];
    // Skip the last action column
    for (let i = 0; i < cols.length - 1; i++) {
      let text = cols[i].innerText.replace(/"/g, '""').trim();
      rowData.push(`"${text}"`);
    }
    if (rowData.length > 0) {
      csv.push(rowData.join(","));
    }
  });

  const csvFile = new Blob([csv.join("\n")], { type: "text/csv;charset=utf-8;" });
  const downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
