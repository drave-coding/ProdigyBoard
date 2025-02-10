import requests
import logging
import tkinter as tk
from tkinter import filedialog, messagebox, simpledialog
import csv
import gspread

# Configure logging
logging.basicConfig(filename='message_log.txt', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

# Function to send a single message
def send_message(phone_number_id, access_token, recipient_number, template_name, dryrun=False, media_file=None, message_type="template"):
    url = f"https://graph.facebook.com/v17.0/{phone_number_id}/messages"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    if message_type == "template":
        payload = {
            "messaging_product": "whatsapp",
            "to": recipient_number,
            "type": "template",
            "template": {
                "name": template_name,
                "language": {"code": "en"}
            }
        }
    elif message_type == "image" and media_file:
        payload = {
            "messaging_product": "whatsapp",
            "to": recipient_number,
            "type": "image",
            "image": {"link": media_file}
        }
    elif message_type == "document" and media_file:
        payload = {
            "messaging_product": "whatsapp",
            "to": recipient_number,
            "type": "document",
            "document": {"link": media_file}
        }

    if dryrun:
        logging.info(f"[Dryrun] {message_type.capitalize()} message to {recipient_number}: {media_file or template_name}")
        return

    try:
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200:
            logging.info(f"Message sent to {recipient_number}: {response.json()}")
        else:
            logging.error(f"Failed to send message to {recipient_number}: {response.json()}")
    except Exception as e:
        logging.error(f"Error: {e}")

# Function to load numbers from file
def load_numbers_from_file(file_path):
    numbers = []
    try:
        if file_path.endswith('.csv'):
            with open(file_path, 'r') as file:
                csv_reader = csv.reader(file)
                for row in csv_reader:
                    if row:
                        numbers.append(row[0])
        elif file_path.endswith('.txt'):
            with open(file_path, 'r') as file:
                for line in file:
                    number = line.strip()
                    if number:
                        numbers.append(number)
    except Exception as e:
        logging.error(f"Error reading file: {e}")
    return numbers

# Function to fetch numbers from Google Sheets
def fetch_numbers_from_google_sheet():
    try:
        # Ask the user to select the JSON credentials file
        json_path = filedialog.askopenfilename(filetypes=[("JSON Files", "*.json")])
        if not json_path:
            return
        
        # Ask the user to provide the Google Sheet ID
        sheet_id = simpledialog.askstring("Google Sheet ID", "Enter the Google Sheet ID:")
        if not sheet_id:
            return
        
        # Authenticate using the JSON file
        client = gspread.service_account(filename=json_path)
        sheet = client.open_by_key(sheet_id)
        
        # Access the first worksheet
        worksheet = sheet.get_worksheet(0)
        
        # Fetch all values from the first column
        numbers = [row[0] for row in worksheet.get_all_values()]
        
        # Save numbers globally and update the GUI
        global recipient_numbers
        recipient_numbers = numbers
        entry_file.delete(0, tk.END)
        entry_file.insert(0, "Fetched from Google Sheets")
        messagebox.showinfo("Success", "Numbers fetched successfully from Google Sheets!")
    except Exception as e:
        messagebox.showerror("Error", f"Failed to fetch Google Sheet: {e}")

# Bulk messaging function
def start_bulk_messaging():
    phone_number_id = entry_phone_number_id.get()
    access_token = entry_access_token.get()
    template_name = entry_template_name.get()
    message_type = message_type_var.get()
    dryrun = dryrun_var.get()

    if not phone_number_id or not access_token or not template_name:
        messagebox.showerror("Error", "Please fill in all required fields.")
        return

    for number in recipient_numbers:
        send_message(phone_number_id, access_token, number, template_name, dryrun=dryrun, message_type=message_type)
    messagebox.showinfo("Success", "Bulk messaging process completed!")

# File selection
def select_file():
    file_path = filedialog.askopenfilename(filetypes=[("CSV and Text files", "*.csv *.txt")])
    global recipient_numbers
    recipient_numbers = load_numbers_from_file(file_path)
    entry_file.delete(0, tk.END)
    entry_file.insert(0, file_path)

# GUI Setup
root = tk.Tk()
root.title("WhatsApp Bulk Messaging Tool")
root.geometry("600x600")
root.config(bg="#1A1A2E")  # Set background color

# Title
title_label = tk.Label(root, text="WhatsApp Bulk Messaging Tool", font=("Arial", 16, "bold"), fg="#FFFFFF", bg="#1A1A2E")
title_label.pack(pady=10)

# Input fields
frame = tk.Frame(root, bg="#16213E")
frame.pack(pady=20, padx=20, fill="x")

def create_labeled_entry(parent, label_text, row, show=""):
    label = tk.Label(parent, text=label_text, font=("Arial", 10, "bold"), fg="#FFFFFF", bg="#16213E")
    label.grid(row=row, column=0, sticky="w", padx=10, pady=5)
    entry = tk.Entry(parent, font=("Arial", 10), show=show, width=40)
    entry.grid(row=row, column=1, padx=10, pady=5)
    return entry

entry_phone_number_id = create_labeled_entry(frame, "Phone Number ID:", 0)
entry_access_token = create_labeled_entry(frame, "Access Token:", 1, show="*")
entry_template_name = create_labeled_entry(frame, "Template Name:", 2)
entry_file = create_labeled_entry(frame, "Select File:", 3)

file_button = tk.Button(frame, text="Browse File", command=select_file, bg="#0F3460", fg="#FFFFFF", font=("Arial", 10, "bold"))
file_button.grid(row=3, column=2, padx=10, pady=5)

sheet_button = tk.Button(frame, text="Google Sheet", command=fetch_numbers_from_google_sheet, bg="#0F3460", fg="#FFFFFF", font=("Arial", 10, "bold"))
sheet_button.grid(row=4, column=1, padx=10, pady=5)

# Message Type Selection
frame_message_type = tk.LabelFrame(root, text="Message Type", bg="#16213E", fg="#FFFFFF", font=("Arial", 12, "bold"))
frame_message_type.pack(padx=20, pady=20, fill="x")

message_type_var = tk.StringVar(value="template")
tk.Radiobutton(frame_message_type, text="Text Message", variable=message_type_var, value="template", font=("Arial", 10), fg="#FFFFFF", bg="#16213E").pack(anchor="w", padx=10)
tk.Radiobutton(frame_message_type, text="Image Message", variable=message_type_var, value="image", font=("Arial", 10), fg="#FFFFFF", bg="#16213E").pack(anchor="w", padx=10)
tk.Radiobutton(frame_message_type, text="Document Message", variable=message_type_var, value="document", font=("Arial", 10), fg="#FFFFFF", bg="#16213E").pack(anchor="w", padx=10)

# Dry-run option
dryrun_var = tk.BooleanVar(value=False)
dryrun_checkbox = tk.Checkbutton(root, text="Dry Run (Test Mode)", variable=dryrun_var, bg="#1A1A2E", fg="#FFFFFF", font=("Arial", 10, "bold"))
dryrun_checkbox.pack(pady=10)

# Start Button
start_button = tk.Button(root, text="Start Messaging", command=start_bulk_messaging, bg="#E94560", fg="#FFFFFF", font=("Arial", 12, "bold"))
start_button.pack(pady=20)

# Footer
footer = tk.Label(root, text="© 2024 | WhatsApp Bulk Messenger", bg="#1A1A2E", fg="#FFFFFF", font=("Arial", 10))
footer.pack(side="bottom", pady=10)

root.mainloop()
