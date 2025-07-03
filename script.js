function togglePassword() {
  const passField = document.getElementById("adminPassInput");
  passField.type = passField.type === "password" ? "text" : "password";
}
function showFeatureMessage(msg) {
  const featureMsg = document.getElementById("featureMsg");
  featureMsg.textContent = "⚠️ " + msg;
}

async function verifyAdmin() {
  const pass = document.getElementById("adminPassInput").value.trim();
  const msg = document.getElementById("adminMsg");

  if (pass === "Sushil@55") {
    msg.textContent = "✅ Access granted. Loading data...";
    msg.style.color = "#0984e3";
    await loadAdminData();
  } else {
    msg.textContent = "❌ गलत पासवर्ड!";
    msg.style.color = "red";
    document.getElementById("historyTable").style.display = "none";
  }
}

async function loadAdminData() {
  const tbody = document.querySelector("#historyTable tbody");
  const msg = document.getElementById("adminMsg");

  tbody.innerHTML = "";

  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbz-3AhxhrO7q-vI4Mr2ELmryKemFSCCUXMcbXnXd1_QXYb-HyK8XPKmmPI5OOfQfa-Z/exec");
    const data = await res.json();

    if (!data || data.length === 0) {
      msg.textContent = "⚠️ No records found.";
      msg.style.color = "#e17055";
      return;
    }

    document.getElementById("historyTable").style.display = "table";

    data.forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.id}</td>
        <td>${row.name}<br>${row.phone}</td>
        <td>${row.date}<br>${row.time}</td>
        <td>${row.location.replace(",", "<br>")}</td>
        <td>${row.status === "IN" ? "🟢 IN" : "🔴 OUT"}</td>
      `;
      tbody.appendChild(tr);
    });

    msg.textContent = `✅ ${data.length} records loaded.`;
    msg.style.color = "#00b894";
  } catch (err) {
    msg.textContent = "❌ Error loading data.";
    msg.style.color = "red";
  }
}
