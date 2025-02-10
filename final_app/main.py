import subprocess
import tkinter as tk
from tkinter import messagebox
import os

# Function to run the respective scripts
def run_script(script_name):

    try:
        print("Current Directory:", os.getcwd())
        subprocess.Popen([os.path.join('.venv', 'Scripts', 'python'), script_name]) 
        messagebox.showinfo("Success", f"Running {script_name}...")
    except Exception as e:
        messagebox.showerror("Error", f"Failed to run {script_name}.\nError: {e}")

# Create the main window
root = tk.Tk()
root.title("Feature Launcher")
root.geometry("400x300")

# Title Label
title_label = tk.Label(root, text="Feature Launcher", font=("Arial", 16, "bold"))
title_label.pack(pady=10)

# Buttons for each feature
features = {
    "WhatsApp Bulker (Free Version)": "whatsapp/whatsapp_bulker_free.py",
    "WhatsApp Bulker (Official API)": "whatsapp/whatsapp_bulker_api.py",
    "Web Scraper": "web_scraping/app.py",
    "AI Calling Feature": "twilio/app.py"
}

for feature_name, script_name in features.items():
    button = tk.Button(
        root, 
        text=feature_name, 
        font=("Arial", 12), 
        command=lambda script_name=script_name: run_script(script_name),
        width=30, 
        bg="lightblue"
    )
    button.pack(pady=5)

# Exit Button
exit_button = tk.Button(root, text="Exit", font=("Arial", 12), command=root.quit, bg="red", fg="white")
exit_button.pack(pady=20)

# Run the application
root.mainloop()