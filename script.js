
  // Initialize AOS for animations
    AOS.init({
        duration: 500,
        once: true,
    });

   
let lastVisibleSection = "adminPanel";

// 🔐 Admin Login
function verifyAdmin() {
  const pass = document.getElementById("adminPassInput").value;
  const msg = document.getElementById("adminMsg");
  if (pass === "admin123") {
    msg.textContent = "🔄 Logging in...";
    msg.style.color = "orange";
    localStorage.setItem("adminLoggedIn", "true");
    loadAdminData();
  } else {
    msg.textContent = "❌ Incorrect password!";
    msg.style.color = "red";
  }
}

// 👁️ Toggle Password
function togglePassword() {
  const input = document.getElementById("adminPassInput");
  const icon = document.getElementById("togglePass");
  if (input.type === "password") {
    input.type = "text";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  }
}

// 📤 Feedback
function toggleFeedback() {
  hideAllSections();
  document.getElementById("feedbackForm").style.display = "block";
  lastVisibleSection = "feedbackForm";
  document.getElementById("idInput").value = '';
  document.getElementById("messageInput").value = '';
  document.getElementById("thankyou").textContent = '';
}
function closeFeedback() {
  document.getElementById("feedbackForm").style.display = "none";
  document.getElementById(lastVisibleSection).style.display = "block";
}

// 🆘 Help Center
function showHelpCenter() {
  hideAllSections();
  document.getElementById("helpCenter").style.display = "block";
  lastVisibleSection = "helpCenter";
}

// 🔁 Hide all sections
function hideAllSections() {
  ["adminPanel", "historySection", "feedbackForm", "helpCenter"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
}

// 🔓 Logout
function backToAdminPanel() {
  localStorage.removeItem("adminLoggedIn");
  hideAllSections();
  document.getElementById("adminPanel").style.display = "block";
  lastVisibleSection = "adminPanel";
  document.getElementById("adminMsg").textContent = '';
}

// 📊 Load Attendance
async function loadAdminData() {
  const msg = document.getElementById("adminMsg");
  msg.textContent = "🔄 Loading data...";
  msg.style.color = "orange";
  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbz-3AhxhrO7q-vI4Mr2ELmryKemFSCCUXMcbXnXd1_QXYb-HyK8XPKmmPI5OOfQfa-Z/exec");
    const data = await res.json();

    hideAllSections();
    document.getElementById("historySection").style.display = "block";
    lastVisibleSection = "historySection";
    msg.textContent = "";

    const tbody = document.querySelector("#historyTable tbody");
    tbody.innerHTML = "";

    let totalUsers = new Set();
    let totalAttendance = 0;

    data.reverse().forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.id}</td>
        <td>${row.name}<br>${row.phone}</td>
        <td>${row.date}<br>${row.time}</td>
        <td>${row.location.replace(",", "<br>")}</td>
        <td>${row.status === "IN" ? "🟢&nbsp;&nbsp;&nbsp; IN" : "🔴 OUT"}</td>`;
      tbody.appendChild(tr);
      totalUsers.add(row.id);
      if (row.status === "IN") totalAttendance++;
    });

    document.getElementById("totalUsers").textContent = totalUsers.size;
    document.getElementById("totalAttendance").textContent = totalAttendance;

  } catch (err) {
    msg.textContent = "❌ Failed to load data.";
    msg.style.color = "red";
  }
}

// 📥 Download PDF


  function downloadHistoryPDF() {
  const element = document.getElementById("historyTable"); // जिस div में टेबल है उसका ID

  const opt = {
    margin:       0.3,
    filename:     'attendance.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }  // ये जरूरी है
  };

  html2pdf().set(opt).from(element).save();
}


// 🔍 Search
function filterByDate() {
  const inputDate = document.getElementById("filterDate").value;
  if (!inputDate) {
    renderAdminTable(adminData); // Reset to full data
    return;
  }

  const inputDateFormatted = new Date(inputDate).toLocaleDateString("en-GB"); // 'DD/MM/YYYY'

  const filtered = adminData.filter(row => row.date === inputDateFormatted);
  renderAdminTable(filtered);
}
function filterTable() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  document.querySelectorAll("#historyTable tbody tr").forEach(row => {
    const match = [...row.cells].some(cell =>
      cell.textContent.toLowerCase().includes(input)
    );
    row.style.display = match ? "" : "none";
  });
}

// 📅 Filter by Date
function convertToInputFormat(dateStr) {
  const parts = dateStr.split("/"); // DD/MM/YYYY
  if (parts.length !== 3) return "";
  const [dd, mm, yyyy] = parts;
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`; // YYYY-MM-DD
}
function filterByDate() {
  const inputDate = document.getElementById("filterDate").value;
  const rows = document.querySelectorAll("#historyTable tbody tr");

  rows.forEach(row => {
    const dateCell = row.cells[2]?.innerText.split("\n")[0]; // Extract date from "date\ntime"
    const converted = convertToInputFormat(dateCell);
    if (!inputDate || converted === inputDate) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// 📤 Send Feedback
const idNameMap = {
  "101": "Rahul", "102": "Vishal", "103": "Sushil", "104": "Priya", "105": "Anjali","106": "Yash"
};
async function sendFeedback() {
  const id = document.getElementById("idInput").value.trim();
  const message = document.getElementById("messageInput").value.trim();
  const name = idNameMap[id];
  const thankyou = document.getElementById("thankyou");
  if (!id || !message) {
    thankyou.textContent = "❗ कृपया सभी फ़ील्ड भरें।";
    thankyou.style.color = "red";
    return;
  }
  if (!name) {
    thankyou.textContent = "❌ मान्य ID नहीं hai!";
    thankyou.style.color = "red";
    return;
  }
  thankyou.innerHTML = "🔄 कृपया प्रतीक्षा करें...";
  const now = new Date();
  const date = now.toLocaleDateString("en-GB");
  const time = now.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
  const formData = new URLSearchParams({ id, name, message, date, time });
  const res = await fetch("https://script.google.com/macros/s/AKfycbwPGdp_k3_Vm0q_LniwZPWRozTSHru7lsI2r7rQSGDHZzHT3t4alxgEGrfAjhoZZjJf6A/exec", {
    method: "POST", body: formData
  });
  if (res.ok) {
    thankyou.textContent = `Thanks! : ${name}`;
    thankyou.style.color = "#0984e3";
  } else {
    thankyou.textContent = "❌ Data भेजने में त्रुटि हुई।";
    thankyou.style.color = "red";
  }
}

// 🚀 Auto Login
window.onload = function () {
  if (localStorage.getItem("adminLoggedIn") === "true") {
    loadAdminData();
  }
};

function applyFilters() {
  const inputText = document.getElementById("searchInput").value.toLowerCase();
  const inputDate = document.getElementById("filterDate").value;

  let filtered = [...adminData]; // Always start with full data

  // 📅 Filter by Date
  if (inputDate) {
    const formattedDate = new Date(inputDate).toLocaleDateString("en-GB"); // 'DD/MM/YYYY'
    filtered = filtered.filter(row => row.date === formattedDate);
  }

  // 🔍 Filter by Text
  if (inputText) {
    filtered = filtered.filter(row => {
      return (
        (row.id && row.id.toLowerCase().includes(inputText)) ||
        (row.name && row.name.toLowerCase().includes(inputText)) ||
        (row.phone && row.phone.toLowerCase().includes(inputText))
      );
    });
  }

  renderAdminTable(filtered);
}
