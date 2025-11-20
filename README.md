# Meet App

## 📋 Project Overview
The **Meet App** is a serverless, progressive web application (PWA) built with **React** using a **test-driven development (TDD)** approach.  
It integrates the **Google Calendar API** to fetch and display upcoming events and includes data visualization to make event insights easy to understand.

Users can search for events by city, adjust how many results are displayed, view detailed event information, install the app on their home screen, and even access previously viewed data offline.

---

## 🎯 Objectives
- Build a **React PWA** using the **TDD** technique.
- Implement **serverless architecture** with **AWS Lambda** for the authorization server.
- Use **OAuth2 authentication** and the **Google Calendar API**.
- Ensure the app works **offline** and passes the **Lighthouse PWA checklist**.
- Incorporate **data visualization** to display event statistics.
- Deploy the app on **Vercel** and maintain source control with **GitHub**.

---

## 💡 Key Features
1. Filter Events by City  
2. Show/Hide Event Details  
3. Specify Number of Events  
4. Use the App When Offline  
5. Add an App Shortcut to the Home Screen  
6. Display Charts Visualizing Event Details  

---

## 👥 User Stories & Scenarios

### **Feature 1: Filter Events by City**

**User Story:**  
As a user, I should be able to filter events by city so that I can see a list of upcoming events in the location I’m interested in.

**Scenarios:**
```gherkin
Scenario 1: When user hasn’t searched for a city, show upcoming events from all cities
  Given the user hasn’t searched for a city
  When the user opens the app
  Then the user should see a list of upcoming events from all cities

Scenario 2: User should see a list of suggestions when they search for a city
  Given the user is typing a city name
  When suggestions are available
  Then a list of suggested cities should be displayed

Scenario 3: User can select a city from the suggested list
  Given the user has typed a city name and suggestions are displayed
  When the user selects a city from the list
  Then the list of upcoming events should update to show only events for that city
```

---

### **Feature 2: Show/Hide Event Details**

**User Story:**  
As a user, I should be able to expand or collapse an event so that I can view more or less information about it depending on my interest.

**Scenarios:**
```gherkin
Scenario 1: An event element is collapsed by default
  Given the user is viewing the list of events
  When the events are displayed
  Then each event’s details section should be hidden by default

Scenario 2: User can expand an event to see details
  Given an event is collapsed
  When the user clicks on the “Show Details” button
  Then the event’s details should be displayed

Scenario 3: User can collapse an event to hide details
  Given an event’s details are visible
  When the user clicks on the “Hide Details” button
  Then the event’s details should collapse
```

---

### **Feature 3: Specify Number of Events**

**User Story:**  
As a user, I should be able to specify how many events I want to see so that I can control the amount of information displayed.

**Scenarios:**
```gherkin
Scenario 1: When user hasn’t specified a number, 32 events are shown by default
  Given the user has not specified a number of events
  When the events are loaded
  Then 32 events should be displayed by default

Scenario 2: User can change the number of events displayed
  Given the user is viewing the list of events
  When the user specifies a number of events (e.g., 10)
  Then only that number of events should be displayed
```

---

### **Feature 4: Use the App When Offline**

**User Story:**  
As a user, I should be able to use the app even when I’m offline so that I can still access event information I previously viewed.

**Scenarios:**
```gherkin
Scenario 1: Show cached data when there’s no internet connection
  Given the user has used the app online before
  When the user opens the app without internet connection
  Then the app should show cached event data

Scenario 2: Show error when user changes search settings (city, number of events)
  Given the user is offline
  When the user attempts to change search settings
  Then the app should display an error message indicating that data cannot be updated
```

---

### **Feature 5: Add an App Shortcut to the Home Screen**

**User Story:**  
As a user, I should be able to install the Meet app as a shortcut on my device’s home screen so that I can easily access it without using a browser.

**Scenario:**
```gherkin
Scenario 1: User can install the meet app as a shortcut on their device home screen
  Given the user is using a supported device and browser
  When the app meets PWA installation requirements
  Then the user should see a prompt to install the app to their home screen
```

---

### **Feature 6: Display Charts Visualizing Event Details**

**User Story:**  
As a user, I should be able to view charts visualizing event details so that I can quickly understand the distribution and popularity of events in different cities.

**Scenario:**
```gherkin
Scenario 1: Show a chart with the number of upcoming events in each city
  Given the user is viewing the events list
  When the app loads event data
  Then the app should display a chart showing the number of upcoming events per city
```

---

## 🧠 Technologies Used
- **React** (Frontend)
- **Vite** (Build tool)
- **Google Calendar API**
- **OAuth2 Authentication**
- **AWS Lambda (Serverless functions)**
- **Jest / Enzyme** (Testing)
- **Recharts or D3.js** (Data Visualization)
- **Service Workers** (Offline functionality)
- **Vercel** (Deployment)
- **GitHub** (Version control)

---

## 🚀 Deployment
The app is deployed on **Vercel** and publicly accessible at:  
👉 [Your Vercel App URL Here]

Repository available on GitHub:  
👉 [Your GitHub Repo URL Here]

---

## 🧾 Author Notes
This README includes all **user stories** and **Gherkin scenarios** for project features 1–6 as defined in the *Meet App Project Brief (Achievement 4)*.  
The app demonstrates the integration of serverless technology, progressive web app features, and test-driven development practices.
