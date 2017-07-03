// GET ALL ARTICLES FROM THE COLLECTION
// Grab the articles as a json and display on the page
$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
        var wrapper = $("<div>");
        wrapper.addClass("col s12 m4");

        var card = $("<div>");
        card.addClass("card teal lighten-2");

        var cardContent = $("<div>");
        cardContent.addClass("card-content white-text");

        var content = "<span class='card-title'>" + data[i].title + "</span>";
            content += "<p>" + data[i].description + "</p></div>";
            content += "<div class='card-action'>";
            content += "<a href='" + data[i].link + "'>Read Story</a>";
            content += "<a>";
            content += "<i class='tooltipped save material-icons right-align' data-position='right'";
            content += "data-delay='50' data-tooltip='Save this article'";
            content += "data-id='" + data[i]._id + "'>star</i></a></div></div></div>";
        
        cardContent.append(content);
        card.append(cardContent);
        wrapper.append(card);

        $("#allarticles").append(wrapper);
    }

    // SAVE AN ARTICLE FOR COMMENTING
    // Whenever someone clicks the save article (star) icon
    $('.save').click(function(event) {

        event.preventDefault();
        // Save the id
        var thisId = $(this).attr("data-id");

        // Now make an ajax request to add it to saved articles
        $.ajax(
        {
            method: "PUT",
            url: "/articles/saved/" + thisId
        }
        ).done(function(data) {
            console.log(data);
        });
    });
    // intialize tooltips
    $('.tooltipped').tooltip({delay: 50});
});
        
