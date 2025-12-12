# MissingLink — Missing Person Case Management System

MissingLink is a web application designed to centralise missing-person information. Instead of relying on scattered WhatsApp forwards, Instagram stories, or community posts, MissingLink allows users to manage missing person reports by allowing them to create, update, delete in one accessible centralized platform. The goal is to improve clarity, accuracy, and speed during critical search efforts.

# Features & Functionalities 
## View all missing persons
- Displays all records in a clean, card-based layout  
- Includes name, age, gender, last-seen details, status (Missing/Found), and photo  
- “Found” status appears in green; “Missing” appears in red  
- Buttons for editing and deleting records  

## Update existing records
Update Existing Records  
- Edit name, age, gender, status, date missing, last-seen details, and more  
- Optional latitude/longitude fields  
- Upload or replace the person's photo (Base64)  
- Smart validation (detects unchanged fields, missing input, etc.)  
- Confirmation, cancellation, and success modals for user clarity  

## Photo upload function
 Click-to-upload UI  
- Live preview after selecting a photo  
- Stores image safely in Base64 format  

## Stores data in Local JSON Storage
- all missing-person data is stored in `missing_person.json`  
- Express.js handles reading and writing records  

# HOW TO RUN OUR PROJECT
- to run our project MissingLink locally, open up the vscode terminal for our project then move on to step 1

## STEP 1
- npm init - y
- npm install express

## STEP 2
node index.js
- this is to run the application, once successfully fun you should see MissingLink running at: http://localhost:5050 inside your terminal

## Step 3
- click on http://localhost:5050 to open the application and it should run 