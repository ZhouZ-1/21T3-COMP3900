# Stock Portfolio Backend
Welcome to the backend for the stock portfolio management system. 

## Requirements
Make sure that you have C++ installed. You can install it at https://visualstudio.microsoft.com/downloads/. 

## Quickstart
Note: First time loading of the backend will be significantly slower due to retrieval of stock listings.
If this is your first time using the backend, use the setup script given in this directory to get started immediately by running the command `sh setup.py` in the backend directory.

If that doesn't work, you can set up the backend manually by following the instructions below. Note that this may differ for other operating systems, and has only been tested on Windows and VLAB.

To set up the backend:
1. Navigate to the backend directory
	`cd stock-portfolio-backend`
2. Set up a virtual enviroment
	`python -m venv env`
3. Activate the virtual enviroment. 	For Windows:
	`source env/Scripts/activate`
	For VLAB:
	`source env/bin/activate`
4. Install the required dependencies:   
	`pip install -r requirements.txt`

And that's it for setting up the dev enviroment.
## Running the backend
To start the backend, make sure your terminal's virtual enviroment is activated by looking for the `(env)` text in your terminal, or by running  `source env/Scripts/activate` or `source env/bin/activate`.

Run the command `python run.py` to start the server. http://127.0.0.1:27439/ should be used for the backend. This location also contains documentation for all endpoints.

## Flushing the database
To reset the database to it's original state, delete the file `database.db` located in the `db/` folder and restart the server. If there are any schema changes to the tables, you may need to delete this file for the backend to work.
