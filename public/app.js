   // Import the functions you need from the SDKs you need
   import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
   import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-analytics.js";
   // TODO: Add SDKs for Firebase products that you want to use
   // https://firebase.google.com/docs/web/setup#available-libraries
 
   // Your web app's Firebase configuration
   // For Firebase JS SDK v7.20.0 and later, measurementId is optional
   const firebaseConfig = {
     apiKey: "AIzaSyDLQfR0AZhhbXRCRgp4vx3J6eUWWYaxeV0",
     authDomain: "attributes-api.firebaseapp.com",
     projectId: "attributes-api",
     storageBucket: "attributes-api.appspot.com",
     messagingSenderId: "940879453028",
     appId: "1:940879453028:web:3a9dd116ffa5cd0f277871",
     measurementId: "G-4G6TJ09J5Q"
   };
 
   // Initialize Firebase
   const app = initializeApp(firebaseConfig);
   const analytics = getAnalytics(app);
   document.addEventListener('DOMContentLoaded', function() {

    
   })
 