import '../styles/index.scss';
import * as firebase from 'firebase';
import * as firebaseui from 'firebaseui'


/**
 * Firebase shenannigans
 */

 // Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyC7cqpyFRK5Pzh6tReSEhU0zdfhXAaRbeU",
    authDomain: "covid-annotation.firebaseapp.com",
    databaseURL: "https://covid-annotation.firebaseio.com",
    projectId: "covid-annotation",
    storageBucket: "covid-annotation.appspot.com",
    messagingSenderId: "297369575962",
    appId: "1:297369575962:web:be320c5d86a0b719a467a3",
    measurementId: "G-H9JT7JZCZ8"
  };

  // Initialize Firebase
let app = firebase.initializeApp(firebaseConfig);
  firebase.analytics();

var database = firebase.database();

  // Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
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
      }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: '/annotation.html',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
};

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

 

/**
 * End Firebase shennanigans
 */



// const nav = [
//     {"key":"Draw", "callback":vid.formatCanvas}
// ]

// let mainWrap = document.getElementById('main-wrap');
// vid.formatVidPlayer(mainWrap, './public/spike_protein_fusion_movie.mp4');
// //vid.formatCanvas(mainWrap);

// renderNav(document.getElementById('sidebar'), nav)
