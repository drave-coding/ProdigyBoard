import gspread
from gspread_dataframe import get_as_dataframe, set_with_dataframe

import time


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