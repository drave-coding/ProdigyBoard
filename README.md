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


# Usage Guide for the Web Application

## Overview

This tool enables users to manage projects, tasks, requests, and audience data efficiently. The application allows users to track project details, view relevant graphs, manage tasks, and submit requests for various services. 

## **Getting Started**

### 1. **Sign Up and Profile Setup**
To begin using the tool:

1. **Sign Up:**
   - Visit the sign-up page and create an account.
   - After signing up, you will be automatically redirected to the Profile page.

2. **Complete Your Profile:**
   - Fill in your profile details to ensure proper configuration of the tool.
   - Once complete, you will be redirected to the **Dashboard** page.

### 2. **Dashboard Overview**
The **Dashboard** page provides an overview of your data, including relevant graphs based on the information you’ve provided. 

## **Project Management**

### 1. **Create or Add a Project**
To add a new project:

1. **Click on "Add Project"** from the dashboard or Projects section.
2. **Fill in Project Details:**
   - **Project Name:** Enter a unique name for your project.
   - **Description:** Add a brief description of your project.
   - **Industry:** Select the industry that your project belongs to.
   - **Transaction Type:** Choose the transaction type for the project.
   - **Project Duration:** Select the start and end dates for your project.
   - **Investment:** Enter the investment amount.
   - **Competitors:** List any competitors related to the project.
     - **Add Competitor:** Click "Add Competitor" to add more.
   - **Social Links:** Provide any relevant social media links associated with your project.

3. **Submit the Project:**
   - Once all the information is filled out, click on **Submit** to save your project and be redirected to the **Project Details** page.

4. **Drive Access:**
   - Please ensure to talk to our representative for clearing the access for the drive.

5. **View Project Details:**
   - After submission, you will be redirected to the **Project Details** page, where you can view the project data.

### 2. **View All Projects**
To see all your projects:

1. Click on **Projects** in the Navbar to view a list of all your projects.
2. You can also see the tasks associated with each project here.

## **Request Section**

### 1. **Submit Requests for Tools**
To submit requests for the tools we provide:

1. Navigate to the **Request** section in the Navbar.
2. Submit requests for the following tools:
   - **WP Bulker**
   - **AI Calling**
   - **Data Scraping**

3. **Submit Required Information:**
   - Provide the necessary details, including any links or data required for each request.
   - Remember to provide access to the list of the audience for **WP Bulker** and **AI Calling**.

4. **Track Request Status:**
   - Upon completion, the request status will be updated to either **Completed** or **Stopped**, and remarks will be provided.

### 2. **View Audience Data**
Once your requests are processed:

1. Navigate to the **Audience** section in the Navbar to view a list of audiences generated for your project.
2. This section will display the audience details relevant to the requests made.

## **Task Management**

### 1. **Add Tasks to Projects**
To manage tasks for a project:

1. Navigate to the **Tasks** section in the Navbar.
2. Select the project for which you want to add tasks.
3. **Add New Task:**
   - Enter task details including the **task name**, **description**, **status**, and **deadline**.
4. The tasks will be displayed with their respective deadlines and status.

### 2. **View Tasks**
- In the **Tasks** section, you will see a list of tasks along with their respective deadlines.
- Tasks are displayed in order of their deadline.

## **Static Pages**

You can navigate to all the other static pages of the application as per your requirement by using the navigation bar.

---

## **Notes and Reminders**

1. **Talk to Our Representative:** Ensure that you talk to our representative about the drive access and any necessary permissions for seamless functionality.
2. **Data Privacy:** All the data provided is handled with care and confidentiality.

## **Support**
For any inquiries or support, please contact at [abhishek2022.work@gmail.com](mailto:abhishek2022.work@gmail.com).

---


