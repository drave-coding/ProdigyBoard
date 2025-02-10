# README: Usage Guide for Features

## **Environment Setup**


### **Requirements**
- Python 3.12 [(Download link)](https://www.python.org/downloads/release/python-3128/)
- Ngrok [(Download link)](https://ngrok.com/)

### **Installation**

1. **Set Up the Environment**  
   - **Automatically**:  
     Double-click the `set_up_environment.bat` file to run the `set_up_environment.py` script.  

   - **Manually**: Follow these steps:  
     - Create a virtual environment:  
       ```bash
       python -m venv venv
       ```  
     - Activate the virtual environment:  
       - **Windows**:  
         ```bash
         venv\Scripts\activate
         ```  
       - **MacOS / Linux**:  
         ```bash
         source venv/bin/activate
         ```  
     - Install the required dependencies:  
       ```bash
       pip install -r requirements.txt
       ```  

2. **Run the Application**:
   - **Automatically**:  
      Double-click the `main.exe` file to run the `main.py` script.
   
   - **Manually**: run the python file:
      ```bash
      python app.py
      ```


- Required Python libraries:
  - `Flask`
  - `Twilio`
  - `Selenium`
  - `dotenv`
  - `requests`
  - `pandas`
  - `gspread`
  - `gspread_dataframe`
  - `webdriver_manager`
  - `tkinter` (built-in for Python)


## **Troubleshooting**
- **Ngrok Not Connecting**: Check your Ngrok setup and ensure your auth token is properly configured in the `.env` file.
- **Call Fails**: Ensure the Twilio credentials are correct, and the recipient number is valid.
- **Data Not Uploaded to Google Sheets**: Verify the Google Sheets ID, sheet name, and credentials.
- **Flask or Ngrok Not Starting**: Restart the app and ensure no other processes are using port 5000.

---

## **Contact**
For support or inquiries, please reach out via email at [Invest369.ai@gmail.com](mailto:Invest369.ai@gmail.com).

---

## **1. WhatsApp Bulker (Free Version)**


### **Description**
The WhatsApp Bulker allows users to send bulk messages via the WhatsApp Business API. The Free Version provides the ability to send template messages, images, and documents to multiple recipients.

### **Features**
- Send text, image, or document messages.
- Bulk messaging using CSV or Google Sheets as input for phone numbers.
- Option for Dry Run (test mode) without sending real messages.

### **How to Use**
1. **Launch the App**:
   - Run the `main.py` script.
   - Click on **"WhatsApp Bulker (Free Version)"**.

2. **Input Details**:
   - **Phone Number ID**: Enter the unique phone number identifier.
   - **Access Token**: Provide the access token for WhatsApp API access.
   - **Template Name**: If using templates, provide the template name.

3. **Select Message Type**:
   - Choose Text, Image, or Document.
   - Upload an image or document URL if required.

4. **Upload Contacts**:
   - Upload a CSV or TXT file containing the recipient numbers.
   - Alternatively, fetch contacts from Google Sheets.

5. **Enable Dry Run (Optional)**:
   - Check the "Dry Run" box if you want to log the messages without actually sending them.

6. **Send Messages**:
   - Click **Start Messaging** to begin the process.
   - Review the message log for status updates.

---

## **2. AI Calling Feature**
### **Description**
The AI Calling Feature allows users to make automated phone calls to multiple recipients using the Twilio API. The system supports voice recognition and DTMF (keypad) input to navigate call options. The latest version also features **Google Sheets integration**, enabling users to dynamically fetch phone numbers from a Google Sheets file.

---

### **Features**
- **Automated Calls**: Calls can be made to multiple phone numbers sequentially.
- **Interactive Voice Response (IVR)**: Voice prompts and menu navigation using voice or keypad inputs.
- **Google Sheets Integration**: Fetch phone numbers directly from a Google Sheets file.
- **Dynamic Call List**: Users can input phone numbers manually or load them from a Google Sheet.
- **Service Automation**: Ngrok and Flask start automatically, ensuring a seamless experience.
- **Data Logging**: Logs user responses and system events for analysis.

---

### **How to Use**

### **How to Use**
1. **Launch the App**:
   - Run the `main.py` script.
   - Click on **"AI Calling Feature"**.
   - The GUI will load, displaying input fields and status information.

#### **2. Start Services**
- The system will automatically start **Ngrok** and **Flask** services.
- Wait for the status message to confirm that services are running.

#### **3. Input Details**
- **Option 1**: Enter phone numbers manually by listing them one per line in the provided input field.
- **Option 2**: Use the **Google Sheets Integration** to fetch phone numbers from a spreadsheet.
  - Enter the **Google Sheets ID**, **Sheet Name**, and **Phone Field Name** into the respective fields.
  - Click **Fetch Data** to populate the phone numbers list.

#### **4. Make Calls**
- Click the **"Make Calls"** button.
- The system will initiate calls to each phone number.
- Calls are spaced at 60-second intervals to avoid conflicts.

#### **5. Interactive Voice Response (IVR)**
- When recipients receive the call, they will hear a message and can respond using voice or keypad inputs.
- The user can select options like "Yes" or "No" and choose from options like **Pharmacy**, **Industrial**, or **Food**.

#### **6. View Responses**
- User responses and selections are logged in the `responses.json` file for review and analysis.

---

## **3. Web Scraping Tool**
### **Description**
This tool automates the process of extracting data from Google Maps using Selenium. It allows users to search for specific terms in a city, state, or country and store the results in a Google Sheet.

### **Features**
- Scrapes data from Google Maps.
- Saves data in CSV and JSON files.
- Uploads data to Google Sheets.

### **How to Use**
1. **Launch the App**:
   - Run the `Web Scraper` script.
   - Click on **"AI Calling Feature"**.
   - The GUI will load, displaying input fields for country, state, and city selection.

### **How to Use**
1. **Launch the App**:
   - Run the `app.py` script.
   - The GUI will load, displaying input fields for country, state, and city selection.

2. **Input Details**:
   - **Search Term**: Enter the type of business (e.g., "restaurants").
   - **Google Sheets ID**: Provide the Google Sheets ID where results will be uploaded.
   - **Sheet Name**: Enter the specific tab/sheet name where data will be stored.

3. **Select Location**:
   - Select **Country**, **State**, and **City** from the dropdown menus.

4. **Start Scraping**:
   - Click the **Start Scraping** button.
   - The system will scrape Google Maps for the specified search term in the selected location.

5. **Data Upload**:
   - Scraped data is automatically uploaded to the specified Google Sheet.

6. **Output Files**:
   - Data is also stored locally as `places.csv` and `places.json` in the `scraping_results` directory.
