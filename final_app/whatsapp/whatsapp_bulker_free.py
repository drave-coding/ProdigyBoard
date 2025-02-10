import threading
import csv
from urllib.parse import quote
from time import sleep
from tkinter import Tk, filedialog, messagebox, scrolledtext, Frame, Label, Entry, Button
import tkinter.font as tkFont
from tkinter import simpledialog  
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

import gspread
from google.oauth2.service_account import Credentials


class WhatsAppBulkMessenger:
    def __init__(self, root):
        # Set the window title and size
        root.title("WhatsApp Bulker - Rule369")
        root.geometry("1000x600")
        root.configure(bg="#e6f2ff")  # Light blue background

        # Custom Fonts
        title_font = tkFont.Font(family="Helvetica", size=14, weight="bold")
        button_font = tkFont.Font(family="Helvetica", size=10, weight="bold")

        # Title Label
        title_label = Label(root, text="WhatsApp Bulker - Rule369", font=title_font, bg="#e6f2ff", fg="#004080")
        title_label.pack(pady=10)

        # Select Numbers File Frame
        select_frame = Frame(root, bg="#e6f2ff")
        select_frame.pack(pady=10)
        select_label = Label(select_frame, text="Select Numbers File", bg="#e6f2ff", fg="#004080")
        select_label.grid(row=0, column=0)
        self.numbers_entry = Entry(select_frame, width=40)  # Entry for numbers file
        self.numbers_entry.grid(row=0, column=1, padx=5)
        select_button = Button(select_frame, text="Select", command=self.upload_numbers_file, bg="#004080", fg="white", font=button_font)
        select_button.grid(row=0, column=2, padx=5)

        # Select Google Sheet Button
        sheet_button = Button(select_frame, text="Select Google Sheet", command=self.select_google_sheet, bg="#004080", fg="white", font=button_font)
        sheet_button.grid(row=0, column=3, padx=5)

        # Select Message File Frame
        message_frame = Frame(root, bg="#e6f2ff")
        message_frame.pack(pady=10)
        message_label = Label(message_frame, text="Select Message File", bg="#e6f2ff", fg="#004080")
        message_label.grid(row=0, column=0)
        self.message_entry = Entry(message_frame, width=40)  # Entry for message file
        self.message_entry.grid(row=0, column=1, padx=5)
        message_button = Button(message_frame, text="Select", command=self.upload_message_file, bg="#004080", fg="white", font=button_font)
        message_button.grid(row=0, column=2, padx=5)

        # Message Entry Box (Optional)
        message_label = Label(root, text="Or enter the message directly:", bg="#e6f2ff", fg="#004080")
        message_label.pack(pady=5)
        self.message_text = scrolledtext.ScrolledText(root, wrap="word", width=60, height=5, font=("Arial", 10))
        self.message_text.pack(padx=10, pady=5)

        # Upload Image Button
        self.image_entry = Entry(root, width=40)  # Entry for image file
        self.image_entry.pack(pady=5)
        image_button = Button(root, text="Select Image File", command=self.upload_image_file, bg="#004080", fg="white", font=button_font)
        image_button.pack(pady=5)

        # Upload Document Button
        self.document_entry = Entry(root, width=40)  # Entry for document file
        self.document_entry.pack(pady=5)
        document_button = Button(root, text="Select Document File", command=self.upload_document_file, bg="#004080", fg="white", font=button_font)
        document_button.pack(pady=5)

        # Buttons Frame
        button_frame = Frame(root, bg="#e6f2ff")
        button_frame.pack(pady=20)
        start_button = Button(button_frame, text="Start", command=self.start_messaging, bg="#008080", fg="white", font=button_font, width=10)
        start_button.grid(row=0, column=0, padx=10)
        clear_button = Button(button_frame, text="Clear", command=self.clear, bg="#5bc0de", fg="white", font=button_font, width=10)
        clear_button.grid(row=0, column=1, padx=10)

        # Status Label
        self.status_label = Label(root, text="", bg="#e6f2ff", fg="#004080")
        self.status_label.pack(pady=10)

    def upload_numbers_file(self):
        file_path = filedialog.askopenfilename(filetypes=[("CSV Files", "*.csv"), ("Text Files", "*.txt")])
        if file_path:
            self.numbers_entry.delete(0, 'end')
            self.numbers_entry.insert(0, file_path)

    def upload_message_file(self):
        file_path = filedialog.askopenfilename(filetypes=[("Text Files", "*.txt")])
        if file_path:
            self.message_entry.delete(0, 'end')
            self.message_entry.insert(0, file_path)
            with open(file_path, "r", encoding="utf-8") as f:
                message = f.read()
                self.message_text.delete(1.0, 'end')
                self.message_text.insert('end', message)

    def upload_image_file(self):
        file_path = filedialog.askopenfilename(filetypes=[("Image Files", "*.jpg;*.jpeg;*.png")])
        if file_path:
            self.image_entry.delete(0, 'end')
            self.image_entry.insert(0, file_path)

    def upload_document_file(self):
        file_path = filedialog.askopenfilename(filetypes=[("Document Files", "*.pdf;*.docx;*.txt")])
        if file_path:
            self.document_entry.delete(0, 'end')
            self.document_entry.insert(0, file_path)

    def select_google_sheet(self):
        try:
            json_path = filedialog.askopenfilename(filetypes=[("JSON Files", "*.json")])
            if not json_path:
                return
        
            sheet_id = simpledialog.askstring("Google Sheet ID", "Enter the Google Sheet ID:")
            if not sheet_id:
                return
        
            client = gspread.service_account(json_path)
            sheet = client.open_by_key(sheet_id)
            worksheet = sheet.get_worksheet(0)  # Assuming the first worksheet
            numbers = [row[0] for row in worksheet.get_all_values()]
        
            with open("numbers_from_google_sheet.csv", "w", newline="", encoding="utf-8") as file:
                writer = csv.writer(file)
                writer.writerows([[num] for num in numbers])
        
            self.numbers_entry.delete(0, 'end')
            self.numbers_entry.insert(0, "numbers_from_google_sheet.csv")
            messagebox.showinfo("Success", "Numbers fetched and saved successfully!")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to fetch Google Sheet: {e}")

    def start_messaging(self):
        self.status_label.config(text="Starting to send messages...")
        message = self.message_text.get(1.0, 'end').strip()
        numbers_file = self.numbers_entry.get()
        image_file = self.image_entry.get()
        document_file = self.document_entry.get()

        if not message and not image_file and not document_file:
            messagebox.showwarning("Warning", "Please enter a message or select an image/document.")
            return

        if not numbers_file:
            messagebox.showwarning("Warning", "Please load a numbers file.")
            return

        self.status_label.config(text="Opening WhatsApp Web...")
        threading.Thread(target=self.send_messages, args=(numbers_file, message, image_file, document_file)).start()

    def send_messages(self, numbers_file, message, image_file, document_file):
        options = Options()
        options.add_argument("--user-data-dir=/tmp/chrome_user_data")

        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
        driver.get('https://web.whatsapp.com')

        WebDriverWait(driver, 1000).until(EC.presence_of_element_located((By.TAG_NAME, "body")))

        try:
            if numbers_file.endswith('.csv'):
                with open(numbers_file, 'r') as file:
                    reader = csv.reader(file)
                    numbers = [row[0] for row in reader if row]
            elif numbers_file.endswith('.txt'):
                with open(numbers_file, 'r') as file:
                    numbers = [line.strip() for line in file if line.strip()]

            for number in numbers:
                number = number.strip()
                if number:
                    url = f'https://web.whatsapp.com/send?phone={number}&text={quote(message)}'
                    driver.get(url)
                    try:
                        send_btn = WebDriverWait(driver, 60).until(EC.element_to_be_clickable((By.XPATH, "//span[@data-icon='send']")))
                        send_btn.click()
                        self.update_status(f'Message sent to: {number}')
                        sleep(10)  # Pause to avoid triggering spam detection
                    except Exception as e:
                        self.update_status(f'Failed to send message to: {number}, Error: {e}')
        finally:
            driver.quit()
            self.update_status("Message sending completed!")

    def update_status(self, message):
        self.status_label.config(text=message)

    def clear(self):
        self.numbers_entry.delete(0, 'end')
        self.message_entry.delete(0, 'end')
        self.message_text.delete(1.0, 'end')
        self.image_entry.delete(0, 'end')
        self.document_entry.delete(0, 'end')
        self.status_label.config(text="")
        

# Create the Tkinter app
if __name__ == "__main__":
    root = Tk()
    app = WhatsAppBulkMessenger(root)
    root.mainloop()
