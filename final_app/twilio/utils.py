import os
import json
import subprocess
import time
import re
import requests
from tkinter import messagebox
from twilio.rest import Client
from dotenv import load_dotenv
import gspread
from gspread_dataframe import get_as_dataframe, set_with_dataframe

import signal
import sys


from dotenv import load_dotenv
load_dotenv(override=True)

def update_env_variable(key, value):
    """Updates or adds a key-value pair to the .env file."""
    env_file = '.env'
    # Read existing .env content
    if os.path.exists(env_file):
        with open(env_file, 'r') as f:
            lines = f.readlines()
    else:
        lines = []

    # Check if key exists, and replace it
    updated = False
    for i in range(len(lines)):
        if lines[i].startswith(f"{key}="):
            lines[i] = f"{key}={value}\n"
            updated = True
            break

    # If the key doesn't exist, add it
    if not updated:
        lines.append(f"{key}={value}\n")

    # Write back to .env file
    with open(env_file, 'w') as f:
        f.writelines(lines)

def store_response(iteration, user_response, twilio_response, selection):
    """Store user response, Twilio response, and selection to a JSON file."""
    data = {
        'iteration': iteration,
        'user_response': user_response,
        'twilio_response': twilio_response,
        'selection': selection
    }
    
    # Set up results directory
    current_dir = os.getcwd()
    results_dir = os.path.join(current_dir, 'call_results')
    os.makedirs(results_dir, exist_ok=True)

    # Define the path to the responses.json file in the call_results folder
    file_path = os.path.join(results_dir, 'responses.json')

    # Load existing data
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            all_data = json.load(f)
    else:
        all_data = {}

    # Store data with iteration as key
    all_data[f'response_{iteration}'] = data

    # Write back to JSON file
    with open(file_path, 'w') as f:
        json.dump(all_data, f, indent=4)

def start_ngrok(port):
    """Start the ngrok tunel."""
    global ngrok_process
    # Start with subprocess
    ngrok_process = subprocess.Popen(['ngrok', 'http', str(port)])
    time.sleep(5) 
    try:
        # get the ngrok url
        response = requests.get("http://localhost:4040/api/tunnels")
        url = re.search(r'"public_url":"(https:[^"]+)', response.text).group(1)
        print(f"Public tunel created: {url}")
        return url
    except Exception as e:
        print(f"Error to get the ngrok url: {e}")
        return None

def disconnect_and_exit():
    """Disconnect from all services and terminate the script."""
    try:
        # Stop ngrok process if running
        global ngrok_process
        if ngrok_process:
            ngrok_process.terminate()
            print("Ngrok process terminated.")
        
        # Kill Flask process (current process)
        print("Shutting down Flask server...")
        os.kill(os.getpid(), signal.SIGINT)

    except Exception as e:
        print(f"Error during disconnection: {e}")
    finally:
        print("Exiting the application.")
        sys.exit(0)  # Exit the Python process
        
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


def check_flask_and_ngrok(ngrok_url_var, status_var):
    """Check if Flask is running on localhost:5000 and if Ngrok URL is valid."""
    status_var.set("Checking Flask and Ngrok...")

    # Check if Flask is running by making a request to localhost:5000
    try:
        response = requests.get("http://localhost:5000/voice")
        if response.status_code == 200:
            flask_status = "Flask is running."
        else:
            flask_status = "Flask is not running."
    except requests.exceptions.RequestException:
        flask_status = "Flask is not running."

    # Check if Ngrok is running
    load_dotenv(override=True)
    ngrok_url = f"{os.getenv('NGROK_URL')}/voice"
    print(ngrok_url)

    if ngrok_url:
        try:
            response = requests.get(ngrok_url)
            if response.status_code == 200:
                ngrok_status = f"Ngrok is running"
            else:
                ngrok_status = "Ngrok is not running."
        except requests.exceptions.RequestException:
            ngrok_status = "Ngrok is not running."
    else:
        ngrok_status = "Ngrok URL not found in .env."

    # Combine Flask and Ngrok statuses
    if "not running" in flask_status or "not running" in ngrok_status:
        status_var.set(f"{flask_status}\n{ngrok_status}\nPlease start both services.")
        ngrok_url_var.set("")  # Clear the Ngrok URL
        return False
    else:
        status_var.set(f"{flask_status}\n{ngrok_status}")
        ngrok_url_var.set(ngrok_url)
        return True

def start_app(ngrok_url_var, status_var):
    """Start the application and check Flask/Ngrok status."""
    if check_flask_and_ngrok(ngrok_url_var, status_var):
        status_var.set("Both Flask and Ngrok are running.")
        ngrok_url_var.set(os.getenv('NGROK_URL'))  # Show Ngrok URL if running
    else:
        status_var.set("Waiting for Flask and Ngrok to start...")

def start_app_script():
    """Start the main_twilio.py script as a subprocess within the virtual environment."""
    try:
        subprocess.Popen([os.path.join('.venv', 'Scripts', 'python'), 'twilio/main_twilio.py'])  # This will run main_twilio.py in the background within the virtual environment
        messagebox.showinfo("App Started", "Flask and Ngrok have been started.")
    except Exception as e:
        messagebox.showerror("Error", f"Failed to start the app: {e}")

def download_data_from_spreadsheet(spreadsheet_key, json_credential_path, sheet_name):
    """
    Downloads data from a specified Google Sheets spreadsheet and sheet name, returning it as a DataFrame.

    Parameters:
    spreadsheet_key (str): The unique ID of the Google Sheets spreadsheet.
    json_credential_path (str): The path to the JSON file containing Google service account credentials.
    sheet_name (str): The name of the sheet/tab within the spreadsheet from which to download data.

    Returns:
    pd.DataFrame: A DataFrame containing the data from the specified sheet.
    """
    try:
        # Authenticate using the JSON credentials file
        gc = gspread.service_account(filename=json_credential_path)

        # Open the Google Sheets spreadsheet by its unique ID
        sh = gc.open_by_key(spreadsheet_key)

        # Access the specified worksheet within the spreadsheet
        worksheet = sh.worksheet(sheet_name)

        # Download the data as a DataFrame
        df = get_as_dataframe(worksheet)

        return df

    except Exception as e:
        print(f"\nAn error occurred: {e}")
        return None


# Example usage:
# spreadsheet_key = 'your_spreadsheet_key'
# json_credential_path = 'path_to_your_json_credentials_file'
# sheet_name = 'Sheet1'

# df = download_data_from_spreadsheet(spreadsheet_key, json_credential_path, sheet_name)
# if df is not None:
#     print(df.head())
# else:
#     print("Failed to download data.")

# Função que autentica o gsheet com arquivo JSON

def upload_data_to_spreadsheet(df, spreadsheet_key, json_credential_path, sheet_name):
    # Example of usage

    # Supondo que você tem quatro dataframes
    # df_list = '[df1, df2, df3, df4]' #Substitua pelo nome de cada dataframe
    # spreadsheet_key = 'Id da planilha' #Substitua 'Id da planilha' pelo ID real da sua planilha
    # json_credential_path = "path JSON" #Substitua 'path JSON' pelo path real do JSON
    # sheet_names = ['Página1', 'Página2', 'Página3', 'Página4'] #Substitua pelo nome de cada aba da planilha
    #
    # # Chamando a função para enviar os dados para as abas correspondentes
    # upload_data_to_spreadsheet(df_list, spreadsheet_key, json_credential_path, sheet_names)

    gc = gspread.service_account(filename=json_credential_path)  # Autentica usando o arquivo de credenciais JSON
    sh = gc.open_by_key(spreadsheet_key)  # Abre a planilha Google Sheets usando seu ID exclusivo.

    # loop que garante que cada dataframe em df_list seja inserido em sua respectiva planilha no gsheet
    worksheet = sh.worksheet(
        sheet_name)  # acessa a planilha correspondente no arquivo do Google Sheets e armazena a referência a essa planilha na variável worksheet
    worksheet.clear()  # remove todos os dados e formatação existentes na planilha
    df = df.dropna(how='all')
    num_rows = df.shape[0]  # Número de linhas no DataFrame

    if num_rows == 0:
        # Adiciona uma linha em branco se o DataFrame estiver vazio
        worksheet.resize(2)  # Redimensiona para 2 linhas
        worksheet.append_row([""])  # Adiciona uma linha em branco
    else:
        worksheet.resize(num_rows+1)  # Redimensiona a planilha para ter exatamente o número de linhas do DataFrame
        # Atualizar a planilha com os dados do DataFrame
        set_with_dataframe(worksheet, df)