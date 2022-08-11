$(function() {

    let currentSearch = "";
    let activePage = 1;
    let numberOfPages = 0;
    $("#error").hide();
    $("#movieDetailsContainer").hide();
    
    document.forms.searchForm.reset();
    document.forms.searchForm.onsubmit = function(e) {
        e.preventDefault();
    };


    function displayResults(data) {
        
        for(var i=0; i<data.Search.length; i++) {
            var poster = (data.Search[i].Poster=="N/A")?"":data.Search[i].Poster;
            $("#searchResults").append(`
            <div class="col-12 col-md-6 col-lg-6 col-xl-3">`+
                `<div class="row movieContainer">`+
                    `<div class="col-4 py-2 moviePoster">`+
                        `<div class="row"><img src="${poster}" alt="${data.Search[i].Title}" class="img-responsive"></div>`+
                    `</div>`+
                    `<div class="col-8 py-2 movieInfo">`+
                        `<div class="row"><p class="movieTitle">${data.Search[i].Title}</p></div>`+
                        `<div class="row"><p class="movieYear my-0">${data.Search[i].Year}</p></div>`+
                        `<div class="row"><p class="movieType">${data.Search[i].Type}</p></div>`+
                        `<div class="row"><button class="detailsButton" id=${data.Search[i].imdbID}>Details</button></div>`+
                    `</div>`+
                `</div>`+
            `</div>`);
        }
        for(var j=data.Search.length; j<data.totalResults; j++) {
            $("#searchResults").append("<div></div>");
        }
        numberOfPages = Math.ceil(data.totalResults/10);
    }


    $("#searchButton").on("click", function(e) {
        $("#error").hide();
        $("#searchResults").empty();
        $("#movieDetailsContainer").hide();
        currentSearch = $("#searchTitle").val();

        $.ajax({
            type: "GET",
            url: `http://www.omdbapi.com/?apikey=2495b749&s=${currentSearch}&type=${$("#searchType").val()}`,
            dataType: "json",
            timeout: 5000,
            success: function(data) {
                if(data.Response==="False") {
                    $("#error").show();
                    $(".pagination-containerPN").remove();
                }
                else {
                    displayResults(data);
                    $(".pagination-containerPN").remove();
                    $('#searchResults').paginathing({
                    perPage: 10,
                    insertAfter: '#searchResults',
                    firstLast: false,
                    containerClass: 'pagination-containerPN',
                    liClass: 'pagePN',
                    activeClass: 'activePN'
                    });
                    activePage = 1;
                }
            }
        });

    });
    

    $(document).on("click", "a", function(e) {
        $("#searchResults").empty();
        $("#movieDetailsContainer").hide();
        
        if($(this).text()=="«") {
            if(activePage<=1) activePage=1;
            else activePage--;
        }
        else if($(this).text()=="»") {
            if(activePage>=numberOfPages) activePage=numberOfPages;
            else activePage++;
        }
        else activePage = +$(this).text();

        $.ajax({
            type: "GET",
            url: `http://www.omdbapi.com/?apikey=2495b749&s=${currentSearch}&type=${$("#searchType").val()}&page=${activePage}`,
            dataType: "json",
            success: function(data) {
                displayResults(data);
                
            }
        });

    });


    $(document).on("click", ".detailsButton", function(e) {
        $.ajax({
            type: "GET",
            url: `http://www.omdbapi.com/?apikey=2495b749&i=${this.id}`,
            dataType: "json",
            timeout: 5000,
            success: function(data) {
                var poster2 = (data.Poster=="N/A")?"":data.Poster;
                $("#movieDetailsContainer").empty();
                $("#movieDetailsContainer").append(
                    `<div class="col-12">`+
                        `<div class="row">`+
                            `<div class="myHeader">Movie details:</div>`+
                        `</div>`+
                        `<div class="row" id="movieDetails">`+
                            `<div class="col-12 col-md-4 py-3 px-3" id="movieDetailsPoster">`+
                                `<div class="row"><img src="${poster2}" alt="${data.Title}" class="mx-auto"></div>`+
                            `</div>`+
                            `<div class="col-12 col-md-8 py-3 px-3" id="movieDetailsInfo">`+
                                `<div class="row detailsRow">`+
                                    `<div class="detailsLeft">Title</div>`+
                                    `<div class="detailsRight">${data.Title}</div>`+
                                `</div>`+
                                `<div class="row detailsRow">`+
                                    `<div class="detailsLeft">Released</div>`+
                                    `<div class="detailsRight">${data.Released}</div>`+
                                `</div>`+
                                `<div class="row detailsRow">`+
                                    `<div class="detailsLeft">Genres</div>`+
                                    `<div class="detailsRight">${data.Genre}</div>`+
                                `</div>`+
                                `<div class="row detailsRow">`+
                                    `<div class="detailsLeft">Country</div>`+
                                    `<div class="detailsRight">${data.Country}</div>`+
                                `</div>`+
                                `<div class="row detailsRow">`+
                                    `<div class="detailsLeft">Director</div>`+
                                    `<div class="detailsRight">${data.Director}</div>`+
                                `</div>`+
                                `<div class="row detailsRow">`+
                                `<div class="detailsLeft">Writers</div>`+
                                `<div class="detailsRight">${data.Writer}</div>`+
                                `</div>`+
                                `<div class="row detailsRow">`+
                                    `<div class="detailsLeft">Actors</div>`+
                                    `<div class="detailsRight">${data.Actors}</div>`+
                                `</div>`+
                                `<div class="row detailsRow">`+
                                    `<div class="detailsLeft">Awards</div>`+
                                    `<div class="detailsRight">${data.Awards}</div>`+
                                `</div>`+
                            `</div>`+
                        `</div>`+
                    `</div>`);
                $("#movieDetailsContainer").show();
            }
        });
    });


});