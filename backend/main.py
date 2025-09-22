from fastapi import FastAPI, Request, Form
from fastapi.responses import RedirectResponse, JSONResponse, HTMLResponse
from fastapi.templating import Jinja2Templates
import requests, time

app = FastAPI()
templates = Jinja2Templates(directory="templates")

# ===== CONFIG =====
CLIENT_ID = "YOUR_CLIENT_ID"
CLIENT_SECRET = "YOUR_CLIENT_SECRET"
REDIRECT_URI = "http://localhost:8000/auth/callback"

AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"
USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"
FIT_AGGREGATE_URL = "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate"

SCOPES = "https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/userinfo.profile"

# ===== In-memory leaderboard =====
leaderboard = []


@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/add_entry")
def add_entry(
    name: str = Form(...),
    steps: int = Form(...),
    weight: float = Form(...),
    height: int = Form(...),
    age: int = Form(...),
    team: str = Form("")
):
    entry = {
        "name": name,
        "steps": steps,
        "weight": weight,
        "height": height,
        "age": age,
        "team": team,
        "points": steps  # keep simple, or use your calc
    }
    leaderboard.append(entry)
    return {"msg": "Entry added", "entry": entry}


@app.get("/leaderboard")
def get_leaderboard():
    sorted_board = sorted(leaderboard, key=lambda x: x["points"], reverse=True)
    return {"leaderboard": sorted_board}


@app.get("/login")
def login():
    google_auth_url = (
        f"{AUTH_URL}?client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        f"&response_type=code"
        f"&scope={SCOPES}"
        f"&access_type=offline"
        f"&prompt=consent"
    )
    return RedirectResponse(google_auth_url)


@app.get("/auth/callback")
def auth_callback(code: str):
    # Exchange code for tokens
    data = {
        "code": code,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code",
    }
    token_resp = requests.post(TOKEN_URL, data=data).json()
    access_token = token_resp.get("access_token")

    if not access_token:
        return JSONResponse({"error": "Failed to get access token", "details": token_resp})

    # Fetch profile
    headers = {"Authorization": f"Bearer {access_token}"}
    userinfo = requests.get(USERINFO_URL, headers=headers).json()
    name = userinfo.get("name", "Unknown User")

    # Fetch step count
    start_of_day = int(time.time()) - (int(time.time()) % 86400)
    end_of_day = start_of_day + 86400
    body = {
        "aggregateBy": [{
            "dataTypeName": "com.google.step_count.delta",
            "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
        }],
        "bucketByTime": {"durationMillis": 86400000},
        "startTimeMillis": start_of_day * 1000,
        "endTimeMillis": end_of_day * 1000,
    }
    steps_resp = requests.post(FIT_AGGREGATE_URL, headers=headers, json=body).json()

    step_count = 0
    for bucket in steps_resp.get("bucket", []):
        for dataset in bucket.get("dataset", []):
            for point in dataset.get("point", []):
                for value in point.get("value", []):
                    step_count += value.get("intVal", 0)

    # Insert into leaderboard automatically
    leaderboard.append({
        "name": name,
        "steps": step_count,
        "team": "Google Fit",  # mark as Fit user
        "points": step_count
    })

    # Redirect back to leaderboard
    return RedirectResponse("/")