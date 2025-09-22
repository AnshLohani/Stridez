const API_BASE = "http://localhost:8000";  // Change if backend runs elsewhere

// Utility to select DOM elements
const el = (id) => document.getElementById(id);

const apiService = {
  getLeaderboard: async () => {
    try {
      const resp = await fetch(`${API_BASE}/leaderboard`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return await resp.json();
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      throw err;
    }
  },
  updateSteps: async () => {
    try {
      const resp = await fetch(`${API_BASE}/update-steps`, { method: "POST" });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return await resp.json();
    } catch (err) {
      console.error("Error calling update-steps:", err);
      throw err;
    }
  }
};

async function refreshLeaderboard() {
  try {
    showLoading(true, "Loading leaderboard...");
    const data = await apiService.getLeaderboard();
    displayLeaderboard(data.leaderboard);
  } catch (err) {
    showMessage("Failed to load leaderboard", "error");
  } finally {
    showLoading(false);
  }
}

async function manualUpdate() {
  try {
    showLoading(true, "Updating steps...");
    const result = await apiService.updateSteps();
    showMessage(result.message || "Steps updated", "success");
    await refreshLeaderboard();
  } catch (err) {
    showMessage("Update failed", "error");
  } finally {
    showLoading(false);
  }
}

function displayLeaderboard(list) {
  const container = el("leaderboard-list");
  container.innerHTML = "";

  if (!list || list.length === 0) {
    container.innerHTML = `<p>No data yet.</p>`;
    return;
  }

  list.forEach((user, idx) => {
    const item = document.createElement("div");
    item.className = "leaderboard-item";

    const rankDiv = document.createElement("div");
    rankDiv.className = "rank";
    rankDiv.textContent = idx + 1;

    const infoDiv = document.createElement("div");
    infoDiv.className = "user-info";
    const nameSpan = document.createElement("span");
    nameSpan.className = "user-name";
    nameSpan.textContent = user.UserName;
    infoDiv.append(nameSpan);

    const pointsDiv = document.createElement("div");
    pointsDiv.className = "points";
    pointsDiv.textContent = user.Steps;

    item.append(rankDiv, infoDiv, pointsDiv);
    container.append(item);
  });
}

function showMessage(msg, type="success") {
  const mc = el("messageContainer");
  mc.innerHTML = `<div class="${type}-message message">${msg}</div>`;
  setTimeout(() => {
    mc.innerHTML = "";
  }, 4000);
}

function showLoading(isLoading, text="") {
  const ld = el("loading");
  const lt = el("loadingText");
  if (isLoading) {
    ld.style.display = "block";
    if (text) lt.textContent = text;
  } else {
    ld.style.display = "none";
  }
}

window.onload = () => {
  // Setup button event handlers
  el("manualUpdateBtn").addEventListener("click", manualUpdate);
  el("refreshBtn").addEventListener("click", refreshLeaderboard);

  // Try ping backend
  fetch(`${API_BASE}/leaderboard`)
    .then(resp => {
      if (resp.ok) {
        el("statusDot").classList.remove("error");
        el("statusText").textContent = "Server Connected";
      } else {
        throw new Error("Bad status");
      }
    })
    .catch(_ => {
      el("statusDot").classList.add("error");
      el("statusText").textContent = "Server Unreachable";
    });

  // Initial load
  refreshLeaderboard();
};
