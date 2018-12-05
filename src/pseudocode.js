// (1) LOADING PAGE
// User chooses to log in or continue as guest
  // Log in - Firebase authentication
    // Store user info in local storage - name, user ID, photo
    // Append info to login status div in top right corner
  // Continue as guest - no auth
  // Continue to dashboard page

// (2) DASHBOARD PAGE
  // "Start a new trip" button
    // On click, navigate to trip page
  // "See all trips" button
    // **For guest - greyed out; on click, trigger alert for sign in auth
    // **For user - on click, navigate to (5) Saved Trips Dashboard

// (3) CREATE NEW TRIP (MAP) PAGE
  // Form with inputs for:
    // a) Starting point
    // b) Destination point
    // c) Date + time of start of trip
    // d) Type of travel - driving, biking
    // e) Trip preferences - avoid highways? avoid tolls? avoid ferries?
    // f) Toggle whether to include tips based on weather
  // User can toggle form inputs, then click "view map" -- on click, navigate to (4) Created Trip Page

// (4) YOUR TRIP PAGE
  // Overview of trip section
    // Average temperature
    // Average conditions
    // Icons for any extreme warnings (weather conditions, trip issues, etc.) 
  // Other times section
    // Some other time options within 4hr window (2 before, 2 after)
    // On click, update map to include that time and update weather conditions accordingly
  // Tips section
    // Includes tips on what to brings
    // Includes tips on what to consider about the trip (e.g. trip length, etc.)
  // Map
    // Displays directions from origin to destination
    // Shows equidistant weather points + any extreme climate warning points
    // On click of map point, modal popup shows with more detailed weather info (weather type, temperature, any precipitation, etc.)
  // SAVE TRIP button
    // User can click to save their trip - can give their trip a name, will push object containing all relevant trip info to Firebase, then will navigate to saved trips dashboard
    // ** If guest, prompts alert to do Google authentication to save trip
  // START OVER button
    // On click, user returns to (3) New trip page
  // HOME button (top right)
    // On click, return to dashboard

// (5) SAVED TRIPS DASHBOARD
  // List of all previously saved trips (Firebase integration)
    // Name, trip info, date added
  // NEW TRIP button - on click, navigates back to (3) Create New Trip
  // HOME button (top right)
    // On click, return to dashboard

// ADDITIONAL PAGES/GOALS
  // Konami code - name version
  // Transitions/animations on elements
  // Mutliple points on journey
  
