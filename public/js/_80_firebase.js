
firebaseConfig = {
  apiKey: "AIzaSyAj0GInhoN4pxHcs259t3YxefXIoh4JLCg",
  authDomain: "bgde.rs",
  databaseURL: "https://bgde-173.firebaseio.com",
  projectId: "bgde-173",
  storageBucket: "bgde-173.appspot.com",
  messagingSenderId: "705918056064",
  appId: "1:705918056064:web:a8fec83e889d03b90e1865",
  measurementId: "G-TSS281LRSC"
};

function initFirebase() {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();

  // auth UI
  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true;
      },
    },
    signInSuccessUrl: '/',
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      // firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    ],
    tosUrl: '<your-tos-url>',
    privacyPolicyUrl: '<your-privacy-policy-url>',
  };

  // Initialize the FirebaseUI Widget using Firebase
  const ui = new firebaseui.auth.AuthUI(firebase.auth());
  // The start method will wait until the DOM is loaded.
  ui.start('#firebaseui-auth-container', uiConfig);

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      signedIn(user);
    } else {
      signedOut();
    }
  });
}
