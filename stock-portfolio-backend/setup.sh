#!/usr/bin/bash

# Get python version. We want python 3
python_command="python"
output=`python -c 'import sys; print(sys.version_info[:][0])'`
if [ $output = '2' ];
then
    python_command="python3"
fi

# Check if env folder exists
install_requirements=false
if [ ! -d "env" ]
then
    $python_command -m venv env
    install_requirements=true
fi

# Activate enviroment
if [ -d "env/Scripts" ]
then
    # Windows
    source env/Scripts/activate
else
    # VLAB
    source env/bin/activate
fi

# Install dependenceies if needed.
if [ "$install_requirements" = true ];
then
    pip install -r requirements.txt
fi

# Start server
$python_command run.py

