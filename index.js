function logResults(jsonResponse, gitHubHandle) {
    console.log(jsonResponse);
    $('.repos').empty();
    $('.repos').removeClass('hidden');
    if (jsonResponse.length == 0) {
        $('.repos').append(`<div class="no-repos"><h3>This user doesn't have any public repos!</h3></div>`);
    }
    else {
        for (i = 0; i < jsonResponse.length; i++) {
            $('.repos').append(`<div class="repo-name"><h2>${jsonResponse[i].name}</h2></div>
                <a class="repo-url" href="${jsonResponse[i].html_url}">${jsonResponse[i].html_url}</a>`);
        }
    }
}

function getRepos(gitHubHandle) {
    let fetchUrl = "https://api.github.com/users/" + gitHubHandle + "/repos";
    fetch(fetchUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error(response.statusText);
            }
        })
        .then(jsonResponse => logResults(jsonResponse, gitHubHandle))
        .catch(error => {
            $('.repos').empty();
            $('.repos').append(`<div class="error"><h3>Bad Request: ${error.message}!!!</h3></div>`);
            $('.repos').removeClass('hidden');
        });
}

function whichHandle() {
    let gitHubHandle = $('#gitHubUser').val();
    getRepos(gitHubHandle);
}
function watchForSubmit() {
    $('form').submit(function(event) {
        event.preventDefault();
        whichHandle();
    })
}

$(watchForSubmit)