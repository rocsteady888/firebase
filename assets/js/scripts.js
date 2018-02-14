// Initialize Firebase
var config = {
  apiKey: "AIzaSyA2JFk2kNJzBUMF2ZVa3k2zB2AhOsDFLR4",
  authDomain: "train-app-c88dc.firebaseapp.com",
  databaseURL: "https://train-app-c88dc.firebaseio.com",
  projectId: "train-app-c88dc",
  storageBucket: "",
  messagingSenderId: "1098781017328"
};
firebase.initializeApp(config);

const dbRef = firebase.database().ref('recentTrainPush');

// Daclare variable for Train Details

var trnTitle;
var trnDest;
var trnStartTime;
var trnFrequency;
var trnExpectedArrival;
var trnMinutesAway;

// Add Train on Button click event
$("#add-train").on("click", function(event) {

  event.preventDefault();

  // Setting the input value to a variable and then clearing the input
  trnTitle = $("#Train-name").val().trim();
  $("#Train-name").val("");

  trnDest = $("#Train-destination").val().trim();
  $("#Train-destination").val("");

  trnStartTime = moment($("#Train-firstTrainTime").val().trim(), "HH:mm").subtract(10, "years").format("X");
  $("#Train-firstTrainTime").val("");

  trnFrequency = $("#Train-frequency").val().trim();
  $("#Train-frequency").val("");

   // push instead of set (notice the additional property)
    dbRef.push({
        name: trnTitle,
        destination: trnDest,
        firstTrainTime: trnStartTime,
        frequency: trnFrequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});

// Firebase watcher + initial loader + order/limit HINT: .on("child_added"
dbRef.orderByChild("dateAdded")
     .on("child_added", function(snapshot) {
        // storing the snapshot.val() in a variable for convenience
        const sv = snapshot.val();

        // Console.loging the last trains's data
        console.log(sv);

        // Change the HTML to reflect
        trnTitle=sv.name;
        trnDest=sv.destination;
        trnStartTime=sv.firstTrainTime;
        trnFrequency=sv.frequency;

        // function call to display current train details
        displayTrainDetails();

        // Handle the errorss
}, function(errorObject) {
       console.log("Errors handled: " + errorObject.code);
});

function displayTrainDetails(){

	var trainTR = $("<tr>");
	var nameTD =$("<td>").text(trnTitle);
	var destinationTD =$("<td>").text(trnDest);
	var frequencyTD =$("<td>").text(trnFrequency);

  var diffTime = moment().diff(moment.unix(trnStartTime), "minutes");
  var timeRemainder = moment().diff(moment.unix(trnStartTime), "minutes") % trnFrequency ;
  var minutes = trnFrequency - timeRemainder;

      trnExpectedArrival = moment().add(minutes, "m").format("hh:mm A");

	var expectedArrivalTD =$("<td>").text(trnExpectedArrival);
	var minsAwayTD =$("<td>").text(minutes);

	trainTR.append(nameTD,destinationTD,frequencyTD,expectedArrivalTD,minsAwayTD);

	$("#displayTrains").append(trainTR);
}
