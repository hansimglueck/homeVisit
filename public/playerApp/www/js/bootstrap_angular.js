// This is a function that bootstraps AngularJS, which is called from later code
function bootstrapAngular() {
    console.log("Bootstrapping AngularJS");
    // This assumes your app is named "app" and is on the body tag: <body ng-app="app">
    // Change the selector from "body" to whatever you need
    var domElement = document.querySelector('body');
    // Change the application name from "app" if needed
    angular.bootstrap(domElement, ['playerApp']);
}

// This is my preferred Cordova detection method, as it doesn't require updating.
if (document.URL.indexOf( 'http://' ) === -1
    && document.URL.indexOf( 'https://' ) === -1
    && document.URL.indexOf( 'file://' ) === -1) {
    console.log("URL: Running in Cordova/PhoneGap");
    document.addEventListener("deviceready", bootstrapAngular, false);
} else {
    console.log("URL: Running in browser");
    angular.element(document).ready(function() {
        bootstrapAngular();
    });
}
