import subprocess
import sys
import os

def create_virtual_env():
    print("Creating virtual environment in .venv...")
    try:
        subprocess.check_call([sys.executable, '-m', 'venv', '.venv'])
    except subprocess.CalledProcessError as e:
        print(f"Failed to create virtual environment: {e}")
        sys.exit(1)

def install_dependencies():
    venv_python = os.path.join('.venv', 'Scripts', 'python.exe') if os.name == 'nt' else os.path.join('.venv', 'bin', 'python')
    
    if os.path.exists('requirements.txt'):
        print("Installing dependencies from requirements.txt...")
        try:
            subprocess.check_call([venv_python, '-m', 'pip', 'install', '-r', 'requirements.txt'])
        except subprocess.CalledProcessError as e:
            print(f"Failed to install dependencies: {e}")
            sys.exit(1)
    else:
        print("requirements.txt not found. Skipping dependency installation.")

def setup_virtual_env():
    if not os.path.exists('.venv'):
        print("Virtual environment (.venv) not found. Creating one...")
        create_virtual_env()
        install_dependencies()
    else:
        print("Virtual environment (.venv) already exists. Installing dependencies...")
        install_dependencies()

if __name__ == '__main__':
    try:
        setup_virtual_env()
        print("Virtual environment is set up and dependencies are installed.")
    except subprocess.CalledProcessError as e:
        print(f"Error during the process: {e}")
        sys.exit(1)
