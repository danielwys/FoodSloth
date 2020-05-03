
let backendRequestError = { errorMessage: "Something went wrong. The backend is not responding." }
let noSuchUserError = { errorMessage: "No such user was found!" }
let incorrectUserType = { errorMessage: "You are logging in as the wrong user type!" }
let notLoggedIn = { errorMessage: "You are not logged in!" }

module.exports = {
    backendRequestError,
    noSuchUserError,
    incorrectUserType,
    notLoggedIn,
}