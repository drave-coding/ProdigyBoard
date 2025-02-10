import tkinter as tk
from tkinter import ttk, messagebox
import pandas as pd

from web_functions import maps_scraping    

# Load the CSV file
file_path = 'web_scraping/Zip Code.csv'
data = pd.read_csv(file_path)

# Initialize the tkinter app
root = tk.Tk()
root.title("City, State, Country Selector")
root.geometry("500x400")

# Variables for dropdown values
country_var = tk.StringVar()
state_var = tk.StringVar()
city_var = tk.StringVar()
search_term_var = tk.StringVar()
sheet_id_var = tk.StringVar()
sheet_name_var = tk.StringVar()

# Functions to update dropdowns dynamically
def update_states(*args):
    selected_country = country_var.get()
    if selected_country:
        states = data[data['country'] == selected_country]['subcountry'].dropna().unique()
        state_menu['values'] = sorted(states)
        state_var.set("")
        city_menu['values'] = []
        city_var.set("")
    else:
        state_menu['values'] = []
        city_menu['values'] = []

def update_cities(*args):
    selected_country = country_var.get()
    selected_state = state_var.get()
    if selected_country and selected_state:
        cities = data[(data['country'] == selected_country) & 
                      (data['subcountry'] == selected_state)]['name'].dropna().unique()
        city_menu['values'] = sorted(cities)
        city_var.set("")
    else:
        city_menu['values'] = []

def start_scraping():
    # Get selected values
    country = country_var.get()
    state = state_var.get()
    city = city_var.get()
    search_term = search_term_var.get()
    sheet_id = sheet_id_var.get()
    sheet_name = sheet_name_var.get()
    
    if not country or not search_term or not sheet_id or not sheet_name:
        messagebox.showerror("Input Error", "Please provide all required fields: Search Term, Google Sheets ID, and Country.")
        return
    
    results = []  # To store results for scraping logic
    
    if city:
        # If a city is selected, scrape for that city
        messagebox.showinfo("Info", f"Searching for '{search_term}' in City: {city}, State: {state}, Country: {country}")
        results.append(f"Scraping city: {city} in state: {state}, country: {country}")
        cities = [city]
        maps_scraping(cities, search_term, sheet_id, sheet_name)
    
    elif state:
        # If only a state is selected, iterate over all cities in the state
        cities = data[(data['country'] == country) & (data['subcountry'] == state)]['name'].dropna().unique()
        messagebox.showinfo("Info", f"Searching for '{search_term}' in all cities of State: {state}, Country: {country}")
        maps_scraping(cities, search_term, sheet_id, sheet_name)
    
    else:
        # If only a country is selected, iterate over all states and cities in the country
        states = data[data['country'] == country]['subcountry'].dropna().unique()
        messagebox.showinfo("Info", f"Searching for '{search_term}' in all cities of Country: {country}")
        for state in states:
            cities = data[(data['country'] == country) & (data['subcountry'] == state)]['name'].dropna().unique()
        maps_scraping(cities, search_term, sheet_id, sheet_name)

# Widgets for the UI
ttk.Label(root, text="Search Term:").grid(row=0, column=0, padx=10, pady=5)
ttk.Entry(root, textvariable=search_term_var).grid(row=0, column=1, padx=10, pady=5)

ttk.Label(root, text="Google Sheets ID:").grid(row=1, column=0, padx=10, pady=5)
ttk.Entry(root, textvariable=sheet_id_var).grid(row=1, column=1, padx=10, pady=5)

ttk.Label(root, text="Google Sheets Name:").grid(row=2, column=0, padx=10, pady=5)
ttk.Entry(root, textvariable=sheet_name_var).grid(row=2, column=1, padx=10, pady=5)

ttk.Label(root, text="Country:").grid(row=3, column=0, padx=10, pady=5)
countries = sorted(data['country'].dropna().unique())
country_menu = ttk.Combobox(root, textvariable=country_var, values=countries, state="readonly")
country_menu.grid(row=3, column=1, padx=10, pady=5)

ttk.Label(root, text="State:").grid(row=4, column=0, padx=10, pady=5)
state_menu = ttk.Combobox(root, textvariable=state_var, values=[], state="readonly")
state_menu.grid(row=4, column=1, padx=10, pady=5)

ttk.Label(root, text="City:").grid(row=5, column=0, padx=10, pady=5)
city_menu = ttk.Combobox(root, textvariable=city_var, values=[], state="readonly")
city_menu.grid(row=5, column=1, padx=10, pady=5)

# Trace variables to update states and cities
country_var.trace("w", update_states)
state_var.trace("w", update_cities)


# Add a button to start scraping
ttk.Button(root, text="Start Scraping", command=start_scraping).grid(row=6, column=0, columnspan=2, pady=20)

root.mainloop()
