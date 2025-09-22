// ===== API Service Layer =====
const API_BASE = "http://127.0.0.1:8000"; // FastAPI server

const apiService = {
    // Fetch leaderboard data
    getLeaderboard: async () => {
        try {
            const response = await fetch(`${API_BASE}/leaderboard`);
            if (!response.ok) throw new Error("Failed to fetch leaderboard");
            return await response.json();
        } catch (err) {
            console.error("Error fetching leaderboard:", err);
            return { leaderboard: [] };
        }
    },

    // Trigger manual step update
    updateSteps: async () => {
        try {
            const response = await fetch(`${API_BASE}/update-steps`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            if (!response.ok) throw new Error("Failed to update steps");
            return await response.json();
        } catch (err) {
            console.error("Error updating steps:", err);
            return { message: "Error" };
        }
    }
};

// ===== Leaderboard UI =====
async function loadLeaderboard() {
    const data = await apiService.getLeaderboard();
    const leaderboardList = document.getElementById("leaderboard-list");
    leaderboardList.innerHTML = "";

    data.leaderboard.forEach((user, index) => {
        const item = document.createElement("div");
        item.className = "leaderboard-item";
        item.innerHTML = `
            <div class="rank">${index + 1}</div>
            <div class="user-info">
                <span class="user-name">${user.UserName}</span>
            </div>
            <div class="points">${user.Steps} steps</div>
        `;
        leaderboardList.appendChild(item);
    });
}

// ===== Manual update button =====
document.getElementById("updateButton").addEventListener("click", async () => {
    const result = await apiService.updateSteps();
    alert(result.message);
    await loadLeaderboard(); // Refresh leaderboard
});

// ===== Init =====
window.onload = () => {
    loadLeaderboard();
};