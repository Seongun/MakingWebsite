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
		htmlString += '<input class="commentInput"></input><button id=' + this.dataObj._rev + ' class="commentButton">Comment</button>';
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


class Comments{

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