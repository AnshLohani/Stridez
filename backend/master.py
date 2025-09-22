# master.py
from fastapi import FastAPI
from apscheduler.schedulers.background import BackgroundScheduler
import mysql.connector
import scheduler  # our scheduler.py file
from fastapi.middleware.cors import CORSMiddleware


# FastAPI app
app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # you can restrict later to http://localhost:5500 etc
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database config
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "yourpassword",
    "database": "Stridez"
}

# Background scheduler
sched = BackgroundScheduler()

# Run scheduler.update_steps() every 2 hours
sched.add_job(scheduler.update_steps, "interval", hours=0.1)
sched.start()

# Leaderboard API
@app.get("/leaderboard")
def get_leaderboard():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT UserName, Steps FROM tempUser ORDER BY Steps DESC")
    leaderboard = cursor.fetchall()

    cursor.close()
    conn.close()
    return {"leaderboard": leaderboard}

# Optional: manual trigger route
@app.post("/update-steps")
def manual_update():
    scheduler.update_steps()
    return {"message": "Steps updated manually"}

@app.get("/health")
def health():
    return {"status": "ok"}