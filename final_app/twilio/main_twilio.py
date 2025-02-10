import os
from flask import Flask, request
from flask_sock import Sock
import ngrok

from twilio.twiml.voice_response import VoiceResponse, Gather
from twilio.rest import Client
from dotenv import load_dotenv

from utils import store_response, update_env_variable, disconnect_and_exit, start_ngrok

# Load environment variables
load_dotenv(override=True)

# Flask app
PORT = 5000
DEBUG = False
app = Flask(__name__)
sock = Sock(app)

# Twilio authentication
account_sid = os.environ['TWILIO_ACCOUNT_SID']
api_key = os.environ['TWILIO_AUTH']
twilio_client = Client(account_sid, api_key)

# ngrok authentication
ngrok.set_auth_token(os.getenv("NGROK_AUTHTOKEN"))
ngrok_process = None

# Initialize Twilio client
#twilio_client = Client(os.environ['TWILIO_ACCOUNT_SID'], os.environ['TWILIO_AUTH'])

# Twilio Voice route
@app.route("/voice", methods=['GET', 'POST'])
def voice():
    """Handles the incoming Twilio voice request."""
    response = VoiceResponse()
    
    # Initial prompt
    twilio_msg = "Hello, we are Chef Connect. Are you interested in our services?"
    response.say(twilio_msg)
    
    # Use Gather to collect user input (both digits and spoken response)
    gather = Gather(
        input='speech dtmf',
        action='/handle_response',
        method='POST'
    )
    gather.say("Press 1 for Yes, Press 2 for No, or you can also say your response.")
    response.append(gather)

    # If no input is received, re-prompt the user
    response.redirect('/voice')
    return str(response)

# Handle call redirection based on user input or transcription
@app.route("/handle_response", methods=['GET', 'POST'])
def handle_response():
    """Handles the response based on user's transcription or numeric input."""
    # Capture all incoming parameters
    incoming_params = request.values.to_dict()
    #print(f"Incoming parameters: {json.dumps(incoming_params, indent=2)}")
    
    digits = request.values.get('Digits')
    user_response = request.values.get('SpeechResult', '').strip().lower()
    
    # Debugging: log the received inputs
    print(f"Received Digits: {digits}")
    print(f"Received User Response: {user_response}")

    response = VoiceResponse()
    
    iteration = 1  # Initialize the iteration counter
    twilio_response = ""

    # Determine user selection based on digits or speech
    if digits == '1' or 'yes' in user_response:
        selection = 'Yes'
        twilio_response = "Thank you for confirming. We offer services in these three segments:"
        response.say(twilio_response)
        response.say("For Pharmacy, press 1 or say Pharmacy.")
        response.say("For Industrial, press 2 or say Industrial.")
        response.say("For Food, press 3 or say Food.")

        # Use Gather to collect further input
        gather = Gather(
            input='speech dtmf',
            action='/process_selection',
            method='POST'
        )
        response.append(gather)

    elif digits == '2' or 'no' in user_response:
        selection = 'No'
        twilio_response = "Thank you for your time. Goodbye."
        response.say(twilio_response)
        response.hangup()
    else:
        selection = 'Invalid'
        twilio_response = "I'm sorry, I didn't understand that. Please try again."
        response.say(twilio_response)
        response.redirect('/voice')

    # Store the response and selection
    store_response(iteration, user_response, twilio_response, selection)
        
    return str(response)

@app.route("/process_selection", methods=['GET', 'POST'])
def process_selection():
    """Processes the user's selection for services."""
    digits = request.values.get('Digits')
    user_response = request.values.get('SpeechResult', '').strip().lower()
    response = VoiceResponse()

    iteration = 2  # Increment iteration for further responses
    selection = ""
    twilio_response = ""

    # Define keyword sets for each option
    pharmacy_keywords = ['1', 'one', 'pharmacy']
    industrial_keywords = ['2', 'two', 'industrial']
    food_keywords = ['3', 'three', 'food']

    # Determine selection based on both digits and keywords in user_response
    if digits == '1' or any(keyword in user_response for keyword in pharmacy_keywords):
        selection = 'Pharmacy'
        twilio_response = "You have selected Pharmacy."
        response.say(twilio_response)
    elif digits == '2' or any(keyword in user_response for keyword in industrial_keywords):
        selection = 'Industrial'
        twilio_response = "You have selected Industrial."
        response.say(twilio_response)
    elif digits == '3' or any(keyword in user_response for keyword in food_keywords):
        selection = 'Food'
        twilio_response = "You have selected Food."
        response.say(twilio_response)
    else:
        selection = 'Invalid'
        twilio_response = "Invalid selection."
        response.say(twilio_response)
        response.redirect('/voice')
        # Store response and return
        store_response(iteration, user_response, twilio_response, selection)
        return str(response)

    # Store the response
    store_response(iteration, user_response, twilio_response, selection)

    response.say("Thank you for your time. Goodbye.")
    response.hangup()
    return str(response)

if __name__ == "__main__":
    try:
        # Open Ngrok tunnel
        #ngrok.disconnect()
        #ngrok.kill()
        #listener = ngrok.forward(f"http://localhost:{5000}")
        #ngrok_url = listener.url()
        ngrok_url = start_ngrok(PORT)
        if not ngrok_url:
            raise RuntimeError("Not possible to start the ngrok.")

        # Update .env with the Ngrok URL
        update_env_variable("NGROK_URL", ngrok_url)
        print(f"Ngrok URL {ngrok_url} written to .env")

        # Run the app
        app.run(port=PORT, debug=DEBUG)
    finally:
        # Always disconnect the ngrok tunnel
        disconnect_and_exit()