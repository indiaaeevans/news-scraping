// GET ALL SAVED ARTICLES FROM THE COLLECTION
// Grab the articles as a json and display on the page
$.getJSON("/articles/saved", function(data) {
    for (var i = 0; i < data.length; i++) {
        var wrapper = $("<div>");
        wrapper.addClass("col s12 m4");

        var card = $("<div>");
        card.addClass("card blue lighten-2");

        var cardContent = $("<div>");
        cardContent.addClass("card-content white-text");

        var content = "<span class='card-title'>" + data[i].title + "</span>";
            content += "<p>" + data[i].description + "</p></div>";
            content += "<div class='card-action'>";
            content += "<a href='" + data[i].link + "'>Read Story</a>";
            content += "<a href='#modal1'>";
            content += "<i class='tooltipped comment material-icons' data-position='right'";
            content += "data-delay='50' data-tooltip='New Comment'";
            content += "data-id='" + data[i]._id + "'>message</i></a>";
            content += "<a href='#modal2'>";
            content += "<i class='tooltipped view material-icons' data-position='right'";
            content += "data-delay='50' data-tooltip='View Comments'";
            content += "data-id='" + data[i]._id + "'>library_books</i></a>";
            content += "</div></div></div>";
        
        cardContent.append(content);
        card.append(cardContent);
        wrapper.append(card);

        $("#savedarticles").append(wrapper);
    }
    // intialize tooltips
    $('.tooltipped').tooltip({delay: 50});
});
        


// SAVING COMMENTS FOR SAVED ARTICLES
// ==================================
// // When you click the submit button
// $(document).on("click", "#submit", function() {
//   // Grab the id associated with the article from the submit button
//   var thisId = $(this).attr("data-id");
//   // Run a POST request using the input values
//   $.ajax({
//     method: "POST",
//     url: "/articles/" + thisId,
//     data: {
//       // Value taken from title input
//       name: $("#nameinput").val(),
//       // Value taken from note textarea
//       body: $("#bodyinput").val()
//     }
//   })
//     // With that done
//     .done(function(data) {
//       // Log the response
//       console.log(data);
//     });
//   // remove the values entered in the input and textarea for note entry
//   $("#nameinput").val("");
//   $("#bodyinput").val("");
// });
