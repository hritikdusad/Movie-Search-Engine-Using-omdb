'use strict'

/* declaring the required variables*/

var totalListings;
var title;
var ajaxpageNumber;
var movieId;
var url = 'http://www.omdbapi.com/?apikey=5a539bcc&';
var container = document.getElementById('root');
var container1 = document.getElementById('detail');


/* my function for onclick event on search button*/

function myFunction() {
    title = document.getElementById('movies').value;
    ajaxpageNumber = 1;
    searchMovies(title, ajaxpageNumber);
}

/* 
    creating a function for fetching the data from the API using the user input and also handling the errors
*/

function searchMovies(title, ajaxpageNumber) {
    fetch(url + 's=' + title + '&page=' + ajaxpageNumber)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            var html = "";
            console.log(data.Response);
            if (data.Response == "False") {
                var child = document.createElement('div');
                html += "<li class='no-movies'>";
                html += "<i class='material-icons icon-help'>help_outline</i>No movies found that match: " + title + "</li>";
                child.innerHTML = html;
                container.appendChild(child);
            } else {
                console.log(data);
                var c = data.Search;
                var html = "";
                for (var i = 0; i < c.length; i++) {
                    var poster;
                    if (c[i].Poster == 'N/A') {
                        poster = "<img class='movie-poster' src ='img/img.jpg'>"
                    } else {
                        poster = "<img class='movie-poster' src=" + c[i].Poster + ">" + "<p>" + c[i].Title + "</h1>";
                    }
                    html += "<li>";
                    html += "<div class='poster-wrap' id='" + c[i].imdbID + "'" + " onclick='goToDetail(this.id)'>";
                    html += poster;
                    html += "</a></div>";
                    html += "<span class='movie-title'>" + c[i].Title + "</span>";
                    html += "<span class='movie-year'>" + c[i].Year + "</span>";
                    html += "</li>";

                }
                container.innerHTML = html;
            }
            totalListings = data.totalResults;

            paginate(totalListings);
        })
        .catch((err) => {
            console.log(err);
        });
}

/* This function calculates and creats the total number pf pges requires it is actually the pagination of above data */

function paginate(totalListings) {
    var pagesNeeded = Math.ceil(totalListings / 10);
    console.log("here in paginationlist");
    // Append a pagination div
    var body = document.getElementById('page');
    var footer = document.createElement('footer');
    var att = document.createAttribute("id");
    att.value = "pagination";
    footer.setAttributeNode(att);
    var ul = document.createElement('ul');
    var att1 = document.createAttribute("id");
    att1.value = "paginationlist";
    ul.setAttributeNode(att1);
    footer.appendChild(ul);
    body.appendChild(footer);


    // Add the correct number of buttons to bottom of page, and set their contents and links.
    for (var i = 0; i < pagesNeeded; i++) {
        var newPageNumber = document.createElement('li');
        var att2 = document.createAttribute("id");
        var att3 = document.createAttribute("onclick");
        att3.value = "updateAjaxCall(this.id)"
        att2.value = i + 1;
        newPageNumber.innerHTML = i + 1;
        newPageNumber.setAttributeNode(att2);
        newPageNumber.setAttributeNode(att3);
        document.getElementById("paginationlist").appendChild(newPageNumber);

    }


}

/*updateAjaxCall() is for the movies that must be fetched on the new clicked page */

function updateAjaxCall(id) {
    var page = document.getElementById('paginationlist');
    page.remove();
    ajaxpageNumber = id;
    searchMovies(title, ajaxpageNumber);
}

/* function called on specific clicked event on ny of the thumbnail*/

function goToDetail(id) {
    window.document.location = './movie.html';
    localStorage.setItem('movieID', id);
}

/* onLoad function that displays the details of the movvies on the details page*/

function onLoad() {
    var a = localStorage.getItem('movieID');
    fetch(url + "i=" + a + "&plot=" + 'full')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            var html = `
                        <header id="header">
                          <h1>${data.Title}</h1>
                        </header>
                        <main id="flex-container">
                          <div id="div1">
                            <img class="image-movie"src="${data.Poster}">
                          </div>
                          <div id="div2">
                              <p><b> IMdb Rating:</b> ${data.imdbRating}/10.0</p>
                                    <p><b>Directed By:</b> ${data.Director}</p>
                                    <p id="writer"><b>Writer:</b>${data.Writer}</p>
                                    
                                    <p><b>STARRING:</b>${data.Actors}</p>
                                    
                                    <p><b>Genre:</b> ${data.Genre}</p>
                                    <p><b>Released:</b> ${data.Year}</p>
                                    <p><b>Runtime:</b> ${data.Runtime}</p>
                                    <p><b>Plot:</b> ${data.Plot}</p>
                                    <p><b>BoxOffice:</b> ${data.BoxOffice}  </p>   
                          </div>
                        </main>`;
            container1.innerHTML = html;
        })
        .catch(err => {
            console.log(err);
        })
}

/* Back button function which on click takes us to the previous pages*/

function goBack() {
    window.history.back();
}