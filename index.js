function logResults(jsonResponse, gitHubHandle) {
    console.log(jsonResponse);
    $('.repos').empty();
    $('.repos').removeClass('hidden');
    if (jsonResponse.message === "Not Found") {
        console.log("user not found!");
        $('.repos').append(`<div class="user-not-found">User not found!</div>`);
    }
    else if (jsonResponse.length == 0) {
        console.log("no repos!");
        $('.repos').append(`<div class="no-repos">This user doesn't have any public repos!</div>`);
    }
    else {
        for (i = 0; i < jsonResponse.length; i++) {
            $('.repos').append(`<div class="repo-name">${jsonResponse[i].name}</div>
                <a class="repo-url" href="${jsonResponse[i].html_url}">${jsonResponse[i].html_url}</a>`);
        }
    }
}

function getRepos(gitHubHandle) {
    let fetchUrl = "https://api.github.com/users/" + gitHubHandle + "/repos";
    fetch(fetchUrl)
        .then(response => response.json())
        .then(jsonResponse => logResults(jsonResponse, gitHubHandle))
        .catch(error => alert("something's wrong!"));
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