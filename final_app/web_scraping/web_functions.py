from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options
from selenium import webdriver
from selenium.webdriver.chrome.service import Service

from webdriver_manager.chrome import ChromeDriverManager

from utils import upload_data_to_spreadsheet

import pandas as pd
import time
import re
import csv
import os
import json

def chrome_setup():
    """
    Seting up the google chrome options.
    
    """

    # Configure ChromeOptions
    chrome_options = Options()
    chrome_options.add_argument("--lang=en")  # Set language to English
    chrome_options.add_argument("--incognito")  # Open browser in incognito mode
    chrome_options.add_argument("--headless")  # Run browser in headless mode (invisible)
    chrome_options.add_experimental_option('excludeSwitches', ['enable-logging'])

    # Optionally, add other options as needed
    chrome_options.add_argument("--disable-gpu")  # Recommended for headless mode on Windows
    chrome_options.add_argument("--window-size=1920x1080")  # Set window size to ensure full page loads

    return chrome_options


def get_element_text(driver, xpath, wait_time=10):
    """
    Retrieves the text of an element located by the given XPath if it is present within the specified wait time.
    """
    try:
        element = WebDriverWait(driver, wait_time).until(
            EC.presence_of_element_located((By.XPATH, xpath))
        )
        return element.text
    except TimeoutException:
        return 'N/A'
    
# Function to retrieve element's attribute
def get_element_attribute(driver, xpath, attribute, wait_time=4):
    try:
        element = WebDriverWait(driver, wait_time).until(
            EC.presence_of_element_located((By.XPATH, xpath))
        )
        return element.get_attribute(attribute)
    except:
        return 'N/A'
    
def scroll_panel_to_bottom(driver, panel_xpath, pause_time):
    """
    Scrolls the panel until the refresh/loading div is no longer present
    or the "end of list" message appears.

    :param driver: Selenium WebDriver instance.
    :param panel_xpath: XPath to locate the scrolling panel.
    :param pause_time: Time to wait between scrolls.
    """
    panel_element = driver.find_element(By.XPATH, panel_xpath)
    
    while True:
        # Get the height before scrolling
        last_height = driver.execute_script("return arguments[0].scrollHeight", panel_element)
        
        # Scroll to the bottom of the panel
        driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", panel_element)
        time.sleep(pause_time)
        
        # Get the new height after scrolling
        new_height = driver.execute_script("return arguments[0].scrollHeight", panel_element)
        
        print("Current height:", new_height, "Last height:", last_height)

        # If height hasn't changed, check for loading and end message
        if new_height == last_height:
            time.sleep(3)  # Wait a bit longer to ensure all elements have loaded
            
            # Check for the loading div using get_element_text
            loading_xpath = "//div[@class='qjESne veYFef']"
            loading_text = get_element_text(driver, loading_xpath, wait_time=1)
            if loading_text != 'N/A':
                print("Loading detected, continue scrolling...")
                continue  # If loading is present, continue scrolling
            
            # Check for the end-of-list message using get_element_text
            end_message_xpath = "//span[@class='HlvSq' and text()=\"You've reached the end of the list.\"]"
            end_message_text = get_element_text(driver, end_message_xpath, wait_time=2)
            if end_message_text != 'N/A':
                print("Reached the end of the list.")
                break  # End message found, break the loop
            
            print("End message not found, continue scrolling...")

def get_link_places(driver):
    """
    Get the links of all the places that we got in our search.

    :param driver: Selenium WebDriver instance.

    """

    item_links = []
    items = driver.find_elements(By.CLASS_NAME, "hfpxzc")
    for item in items:
        link = item.get_attribute('href')
        if link:
            item_links.append(link)

    print(f"Found {len(item_links)} items.")

    return item_links

def extract_data(driver, item_links, csv_file_path, json_file_path):
    """
    Extracts data from item links and writes them to both a CSV file and a JSON file.
    
    :param driver: Selenium WebDriver instance.
    :param item_links: List of URLs to scrape data from.
    :param csv_file_path: Path to the CSV file where data will be stored.
    :param json_file_path: Path to the JSON file where data will be stored.
    """
    # List to hold JSON objects
    json_data = []
    
    # Open CSV file for writing
    with open(csv_file_path, 'w', newline='', encoding='utf-8') as csv_file:
        csv_writer = csv.writer(csv_file)
        
        # Write the header row to CSV
        csv_writer.writerow(['Title', 'Rating', 'Reviews', 'Category', 'Address', 'Website', 'Phone Number'])
        
        # Iterate over each item link and extract data
        for idx, link in enumerate(item_links):
            try:
                driver.get(link)
                time.sleep(2)
                
                # Initialize variables with default values
                title = rating = reviews = category = address = website = phone_number = 'N/A'
                
                # Title
                title_xpath = "//h1[contains(@class, 'DUwDvf')]"
                title = get_element_text(driver, title_xpath, wait_time=2)
                
                # Updated XPath
                rating_xpath = "//span[@class='ceNzKf' and contains(@aria-label, 'stars')]"
                rating_aria_label = get_element_attribute(driver, rating_xpath, "aria-label", wait_time=4)

                # Extract numeric rating
                if rating_aria_label != 'N/A':
                    rating_match = re.search(r'([\d\.]+)', rating_aria_label)
                    if rating_match:
                        rating = rating_match.group(1)
                        print("Extracted rating:", rating)
                
                # Reviews
                reviews_xpath = "//span[contains(@aria-label, 'reviews') and contains(text(), '(')]"
                reviews_text = get_element_text(driver, reviews_xpath, wait_time=2)
                if reviews_text != 'N/A':
                    reviews_match = re.search(r'\d+', reviews_text)
                    if reviews_match:
                        reviews = reviews_match.group()
                
                # Category
                category_xpath = "//button[@class='DkEaL ']"
                category = get_element_text(driver, category_xpath, wait_time=1)  # Optional, quick check
                
                # Address
                address_xpath = "//div[contains(@class, 'Io6YTe')]"
                address = get_element_text(driver, address_xpath, wait_time=1)  # Optional, quick check
                
                # Website
                website_xpath = "//a[contains(@aria-label, 'Website')]"
                website_elems = driver.find_elements(By.XPATH, website_xpath)
                if website_elems:
                    website = website_elems[0].get_attribute('href')
                
                # Phone Number
                phone_xpath = "//button[contains(@aria-label, 'Phone')]"
                phone_elems = driver.find_elements(By.XPATH, phone_xpath)
                if phone_elems:
                    phone_number = phone_elems[0].get_attribute('aria-label').replace('Phone:', '').replace('+', '').strip()
                
                # Write data to CSV
                csv_writer.writerow([title, rating, reviews, category, address, website, phone_number])
                
                # Append data to JSON list
                json_data.append({
                    "Title": title,
                    "Rating": rating,
                    "Reviews": reviews,
                    "Category": category,
                    "Address": address,
                    "Website": website,
                    "Phone Number": phone_number
                })
                
                print(f"Extracted data for item {idx+1}: {title}")
                
            except Exception as e:
                print(f"Error extracting data for item {idx+1}: {e}")
                continue
    
    # Write JSON data to file
    with open(json_file_path, 'w', encoding='utf-8') as json_file:
        json.dump(json_data, json_file, ensure_ascii=False, indent=4)
    print(f"Data successfully saved to {csv_file_path} and {json_file_path}")

def maps_scraping(cities, search_term, spreadsheet_key, sheet_name):
    chrome_options = chrome_setup()

    # Initialize the ChromeDriver with the specified options
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)

    # Set up results directory
    current_dir = os.getcwd()
    results_dir = os.path.join(current_dir, 'scraping_results')
    os.makedirs(results_dir, exist_ok=True)

    # Specify path for CSV output and extract data
    csv_file_path = os.path.join(results_dir, 'places.csv')
    json_file_path = os.path.join(results_dir, 'places.json')


    for city in cities:
        try:
            print(city)

            url = f"https://www.google.com/maps/search/{search_term}+in+{city}/?hl=en&gl=us"
            # Open the web page
            driver.get(url)

            # Clear cookies and set implicit wait
            driver.delete_all_cookies()
            driver.implicitly_wait(10)


            # Scroll to load all items and get links
            panel_xpath = "//div[@role='feed']"
            scroll_panel_to_bottom(driver, panel_xpath, pause_time=1)
            item_links = get_link_places(driver)

            #item_links = ['https://www.google.com/maps/place/Falafel+%26+Shawarma+London/data=!4m7!3m6!1s0x4876037f7232b62d:0xc60a2b5c43a97ff2!8m2!3d51.474036!4d-0.090309!16s%2Fg%2F11byp63d_3!19sChIJLbYycn8DdkgR8n-pQ1wrCsY?authuser=0&hl=en&rclk=1']
            extract_data(driver, item_links, csv_file_path, json_file_path)

            print(f"Data has been saved to '{csv_file_path}'")
        except:
            print("An exception occurred")
            continue

    # Close the WebDriver
    driver.quit()
    df = pd.read_csv(csv_file_path)

    json = 'jsons/invest369-ai-gsheets.json'

    #spreadsheet_key = '1ejSzICfPPYpHL5jeW9zYFI6xf205gbwSdJC-299b6ww'
    #sheet_names = 'Scraping Data'
    upload_data_to_spreadsheet(df, spreadsheet_key, json, sheet_name)