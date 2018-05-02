function saveRecord (theData) {
	// Set the namespace for this note
	theData.namespace = window.key;
	console.log("Trying to Post");
	console.log(theData);
	
	$.ajax({
		url: "/savecontact",
		contentType: "application/json",
		type: "POST",
		data: JSON.stringify(theData),
		error: function (resp) {
			console.log(resp);
			console.log("error");
			alert("there was an error in your submission, please try again");
			// Add an error message before the new note form.
		},
		success: function (resp) {
			alert("We have received your information, we'll be in touch with you shortly");
			// Render the note
			
			// Empty the form.
			// Deselect the submit button.
			$("#note-submit").blur();
			$("#fname").val("");
			$("#lname").val("");
			$("#email").val("");
			$("#subject").val("");
			$("#message").val("");
			
		}
	});
}

$("#contact-us").submit(function () {
	if( ! ($("#fname").val() && $("#lname").val() && $("#email").val() && $("#subject").val() && $("#message").val() ) ){
		alert("please make sure to fill out all elements of the form befor you submit. Danke.");
	}

	// Get the information we want from the form including creating a new date.
	
	var contactInfo = {
		fname: $("#fname").val(),
		lname: $("#lname").val(),
		email: $("#email").val(),
		subject: $("#subject").val(),
		message: $("#message").val(),
		created_at: new Date()
		responded: false
	};



	//Send the data to our saveRecord function
	saveRecord(contactInfo);


	//Return false to prevent the form from submitting itself
	return false;
});