I have a working website prototype created in Figma.

Prototype URL:
https://grainy-storm-08876313.figma.site

Your task is to upgrade this prototype into a functional web application while keeping the current design style.

Add the following two major systems:

---

1. Ambulance Live Tracking System

Add a real-time ambulance tracking map to the website.

Requirements:

• Display an interactive map
• Detect and show the user's current location
• Show nearby ambulances as moving markers
• When an ambulance is selected, show:

* distance from the user
* estimated arrival time (ETA)
* route from ambulance to user

Map Features:

• Live location updates
• Animated ambulance marker moving on the road
• Route path drawn between ambulance and user
• Zoom and pan functionality

Use a map provider such as:
• Google Maps API
• Mapbox
• OpenStreetMap (Leaflet.js)

Add a large **"Request Ambulance"** button.

When clicked:

• detect user location
• assign the nearest ambulance
• display live tracking until arrival

---

2. AI Chatbot Assistant

Add a chatbot assistant panel to the website.

Requirements:

• ChatGPT-style chat interface
• message bubbles for user and AI
• typing animation when AI is responding
• conversation history panel
• scrollable chat area
• input box with send button

AI Behavior:

The assistant should act as a helpful emergency support assistant.

Example tasks:

• guide users during emergencies
• answer health or safety questions
• help users request an ambulance
• provide instructions while help is arriving

AI Integration:

Use an AI model such as:

• Claude API
• GPT API

---

3. UI Layout

Add a two-panel layout:

Left side:
AI Chatbot

Right side:
Live Ambulance Map

Bottom section:
Large "Request Ambulance" emergency button

---

4. Technology Stack

Frontend:
React or Next.js

Styling:
Tailwind CSS

Maps:
Google Maps API / Mapbox / Leaflet

Backend:
Node.js with Express

AI:
Claude API or OpenAI API

---

Goal:

Transform the existing prototype into an interactive emergency support platform with a real-time ambulance tracking system and an AI assistant interface.
