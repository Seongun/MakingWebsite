AllPosts = [];
currentCoutner = 0;

$(document).ready(function(){

	getAllPosts();

});


class PostObj{

	constructor(dataObj){
		this.dataObj = dataObj;

		this.fname = dataObj.fname;
		this.lname = dataObj.lname;
		this.email = dataObj.email;
		this.subject = dataObj.subject;
		this.message = dataObj.message;
		this.created_at = dataObj.created_at;
		this.comments = dataObj.comments;

	}

	createDomElement(){
		var htmlString = '';
		htmlString += '<li class ="postObject">' + this.fname + " "+this.lname + ' : ';
		htmlString += '<p>('+this.email+')<p>@'+this.created_at+'<br>';
		htmlString += '<h5 class = "postSubject">'+this.subject+'<h5>';
		htmlString += '<h5 class = "postContent">'+this.message+'<h5>';
		htmlString += '<form id="comment-us"><input type="text" id="email" class="form-control" placeholder="Your email address">';
		htmlString += '<input type="hidden" value="'+currentCoutner+'">';
		htmlString += '<input type="text" id="subject" class="form-control" placeholder="Your Comment">'
		htmlString += '<input type="submit" id="'+ this.dataObj._rev+'" value="Comment" class="btn btn-primary"></form>';
		
		if( this.comments){

			for (var i=0; i<this.comments.length; i++){
						htmlString += this.comments[i].makeHTML;
			}
		}
		
		htmlString += '</li>';

		//Bind DOM events within the class
		var curObj = this;
		curObj.element = $(htmlString).appendTo('#Posts');
		curObj.element.click(function(e){
			var theID = $(e.target).attr("id");
			if (theID == curObj.dataObj._rev){
				sendUpdateRequest(curObj.dataObj);
			}
		});
	};

}


class Comment{

	constructor(dataObj){
		this.email = dataObj.email;
		this.message = dataObj.message;
		this.created_at = dataObj.created_at;
	}
	makeHTML(){

		var htmlString = '';
		htmlString += '<div class ="comment"><p>'+this.email; 
		htmlString += '@'+this.created_at+'</p><br>';
		htmlString += '<h5 class = "commentContent">'+this.message+'<h5>';
		htmlString += "</div>"
		return htmlString;
	}

} 


function getAllPosts(){
	AllPosts = [];
	currentCoutner = 0;

	$.ajax({
		url: '/contacts/_all',
		type: 'GET',
		dataType: 'json',
		error: function(data){
			alert("Oh No! Try a refresh?");
		},
		success: function(data){
			console.log(data);
			//You could do this on the server
			var dbData = data.map(function(d){
				return d.doc;
			});
			//Clear out current data on the page if any
			if(dbData.length > 0 ){
				$('#Posts').html('<ul id="theDataList">');
				//Create Fav Word objects
				dbData.forEach(function(d){
					
					var tempObj = new PostObj(d);
					tempObj.createDomElement();
					currentCoutner+=1;
					AllPosts.append(tempObj);

				});
				$('#Posts').append('</ul>');
			}else{
				$('#Posts').html('<h5>No Posts are currently available</h5>');
			}
			
		}
	});
}
	



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


$("#comment-us").submit(function () {


	//make new comment

	//append the thing to the info.


	$.ajax({
		url: '/update',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(newContactInfo),
		error: function(resp){
			console.log("Oh no...");
			console.log(resp);
		},
		success: function(resp){
			console.log('Updated!');
			console.log(resp);
			getAllData();
		}
	});
	//Return false to prevent the form from submitting itself
	return false;
});

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
		created_at: new Date(),
		comments: [],
		responded: false
	};



	//Send the data to our saveRecord function
	saveRecord(contactInfo);


	//Return false to prevent the form from submitting itself
	return false;
});