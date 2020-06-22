import * as firebase from 'firebase';
import * as d3 from 'd3';



// Your web app's Firebase configuration
export const firebaseConfig = {
    apiKey: "AIzaSyC7cqpyFRK5Pzh6tReSEhU0zdfhXAaRbeU",
    authDomain: "covid-annotation.firebaseapp.com",
    databaseURL: "https://covid-annotation.firebaseio.com",
    storageBucket: "gs://covid-annotation.appspot.com/",
    projectId: "covid-annotation",
    storageBucket: "covid-annotation.appspot.com",
    messagingSenderId: "297369575962",
    appId: "1:297369575962:web:be320c5d86a0b719a467a3",
    measurementId: "G-H9JT7JZCZ8"
};

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

export function checkDatabase(ref, callback){
 
  ref.on("value", function(snapshot) {

      callback(snapshot.val());
  }, function (error) {
      console.log("Error: " + error.code);
  });

}
  
export const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
      
        return true;
      },
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById('loader').style.display = 'none';
      },
    
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: '/coronavirus_annotation/annotation.html',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    
};