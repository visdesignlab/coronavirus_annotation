import '../styles/index.scss';
import 'bootstrap';
import * as firebase from 'firebase';
import * as firebaseui from 'firebaseui'
import { firebaseConfig, uiConfig } from './firebaseStuff';


/**
 * Firebase shenannigans
 */



// Initialize Firebase
//export const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.apps[0];
if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

export const authOb = firebase.auth();

  // Initialize the FirebaseUI Widget using Firebase.
export const ui = new firebaseui.auth.AuthUI(authOb);


// The start method will wait until the DOM is loaded.
ui.start('#sign-in-container', uiConfig);

/**
 * End Firebase shennanigans
 */

