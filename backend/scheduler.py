# scheduler.py
import mysql.connector
import random

db_config = {
    "host": "localhost",
    "user": "root",
    "password": "yourpassword",
    "database": "Stridez"
}

def update_steps():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT USERID, Steps FROM tempUser")
    users = cursor.fetchall()

    for user in users:
        # Random increment between 10–100 steps
        new_steps = user["Steps"] + random.randint(10, 100)
        cursor.execute(
            "UPDATE tempUser SET Steps = %s WHERE USERID = %s",
            (new_steps, user["USERID"])
        )

    conn.commit()
    cursor.close()
    conn.close()
    print("✅ Steps updated successfully")