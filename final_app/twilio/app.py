from tkinter import Tk, Label, Button, StringVar, messagebox, Text
from tkinter.ttk import Frame, Style, Entry
from utils import check_flask_and_ngrok, start_app_script, download_data_from_spreadsheet

import threading
import os
import time
import signal

from twilio.rest import Client
from dotenv import load_dotenv


def start_gui():
    def check_services_ui():
        """Check Flask and Ngrok services for up to 1 minute."""
        status_var.set("Checking services, please wait...")

        for _ in range(60):  # Check for 1 minute (60 seconds)
            if check_flask_and_ngrok(ngrok_url_var, status_var):
                return
            time.sleep(1)  # Wait 1 second before rechecking

        # If services are not running after 1 minute
        status_var.set("Failed to start services within 1 minute. Please retry.")
        

    def start_services_ui():
        """Start Flask and Ngrok services in a background thread and verify them."""
        threading.Thread(target=start_app_script).start()
        threading.Thread(target=check_services_ui).start()

    def make_call(number):
        load_dotenv(override=True)
        client = Client(os.getenv('TWILIO_ACCOUNT_SID'), os.getenv('TWILIO_AUTH'))

        # Get Ngrok URL
        ngrok_url = os.getenv('NGROK_URL')
        if not ngrok_url:
            raise ValueError("NGROK_URL is not set in the .env file.")

        print(ngrok_url)

        # Initiate the call using the /voice endpoint
        call = client.calls.create(
            url=f"{ngrok_url}/voice",  # Use /voice endpoint
            to=number,
            from_=os.getenv('TWLIO_NUMBER')
        )

        print("Call initiated. Call SID:", call.sid)
        return call.sid
    
    def wait_for_call_completion(call_sid):
        """Wait for the Twilio call to complete."""
        client = Client(os.getenv('TWILIO_ACCOUNT_SID'), os.getenv('TWILIO_AUTH'))

        while True:
            call = client.calls(call_sid).fetch()
            if call.status == 'completed':
                print(f"Call with SID {call_sid} completed.")
                time.sleep(3)  # Wait for 3 seconds before proceeding
                break
            elif call.status in ['failed', 'busy', 'no-answer']:
                print(f"Call with SID {call_sid} failed with status: {call.status}.")
                break
            else:
                print(f"Call with SID {call_sid} in progress. Current status: {call.status}.")
                time.sleep(2)  # Check again after 2 seconds

    def make_calls_ui():
        """Initiate calls to multiple numbers, ensuring one call finishes before the next starts."""
        numbers = numbers_text.get("1.0", "end").strip().split("\n")
        if not numbers or all(n.strip() == "" for n in numbers):
            messagebox.showwarning("Input Error", "Please enter at least one phone number.")
            return

        def call_numbers():
            try:
                for number in numbers:
                    number = number.strip()
                    if number:
                        try:
                            # Make the call and get the Call SID
                            call_sid = make_call(number)
                            status_var.set(f"Call initiated to {number}. Waiting for completion.")
                            
                            # Wait for the call to complete before proceeding
                            wait_for_call_completion(call_sid)
                        except Exception as e:
                            messagebox.showerror("Error", f"Failed to make the call to {number}: {e}")
                            break
                # After all calls are completed
                status_var.set("All calls are completed.")
                messagebox.showinfo("Completion", "All calls are completed successfully!")
            except Exception as e:
                messagebox.showerror("Error", f"An error occurred during the calling process: {e}")

        threading.Thread(target=call_numbers).start()
    
    def kill_console():
        os.kill(os.getpid(), signal.SIGINT)
        os.kill(os.getpid(), signal.SIGINT)
        os.kill(os.getpid(), signal.SIGINT)

        print('here')
        
        if root.winfo_exists():  # Check if the Tkinter window still exists
            root.destroy()  # Destroy the Tkinter window
    

    def fetch_data_from_sheet():
        """Fetch data from the Google Sheet and display it in the text box."""
        spreadsheet_id = sheet_id_var.get().strip()
        sheet_name = sheet_name_var.get().strip()
        phone_field = phone_field_var.get().strip()
        json_credential_path = 'jsons/invest369-ai-gsheets.json'

        if not spreadsheet_id or not sheet_name or not phone_field:
            messagebox.showwarning("Input Error", "Please fill in all fields to fetch data.")
            return

        try:
            # Fetch the data from the Google Sheet
            data = download_data_from_spreadsheet(spreadsheet_id, json_credential_path, sheet_name)
            if data is not None:
                if phone_field not in data.columns:
                    messagebox.showerror("Error", f"The column '{phone_field}' does not exist in the sheet.")
                    return

                # Extract phone numbers from the specified column
                numbers = data[phone_field].dropna().astype(str).tolist()

                # Update the text box with the phone numbers
                numbers_text.delete("1.0", "end")
                numbers_text.insert("1.0", "\n".join(numbers))
                status_var.set("Data successfully fetched from the Google Sheet.")
            else:
                status_var.set("Failed to fetch data. Please check your inputs.")
        except Exception as e:
            messagebox.showerror("Error", f"An error occurred: {e}")


    # Create the main window
    root = Tk()
    root.title("Twilio and Ngrok UI")
    root.geometry("700x600")
    
    # Bind the disconnect_and_exit function to the close button
    root.protocol("WM_DELETE_WINDOW", kill_console)

    # Create a styled frame
    style = Style()
    style.configure("TFrame", background="#f0f0f0")
    frame = Frame(root, style="TFrame", padding=5)
    frame.pack(fill="both", expand=True)

    # Labels and input fields
    ngrok_url_var = StringVar(value="Ngrok not started")
    sheet_id_var = StringVar()
    sheet_name_var = StringVar()
    phone_field_var = StringVar()
    status_var = StringVar(value="Waiting for services to start...")


    Label(root, text="Google Sheets ID:").pack(pady=5)
    Entry(root, textvariable=sheet_id_var).pack(pady=5)

    Label(root, text="Google Sheets Name:").pack(pady=5)
    Entry(root, textvariable=sheet_name_var).pack(pady=5)

    Label(root, text="Phone Field Name:").pack(pady=5)
    Entry(root, textvariable=phone_field_var).pack(pady=5)

    Label(root, text="Phone Numbers:").pack(pady=5)
    numbers_text = Text(root, height=10, width=50)
    numbers_text.pack(pady=5)

    Label(root, text="Ngrok URL:").pack(pady=5)
    Label(root, textvariable=ngrok_url_var, fg="black").pack(pady=5)

    Label(root, textvariable=status_var, fg="green", font=("Arial", 12)).pack(pady=5)

    # Buttons
    button_frame = Frame(root)
    button_frame.pack(side="bottom", pady=10)

    Button(button_frame, text="Fetch Data", command=fetch_data_from_sheet, bg="#007BFF", fg="white", font=("Arial", 12), width=15).pack(side="left", padx=10)
    Button(button_frame, text="Make Calls", command=make_calls_ui, bg="#007BFF", fg="white", font=("Arial", 12), width=15).pack(side="left", padx=10)


    # Automatically check and start services on UI load
    threading.Thread(target=start_services_ui).start()

    # Run the GUI event loop
    root.mainloop()


if __name__ == "__main__":
    start_gui()
