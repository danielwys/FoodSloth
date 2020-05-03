var currentUserID = "" 
var currentUserType = ""

function notLoggedIn() {
    return (this.currentUserID === "" && this.currentUserType === "")
}

function wrongUserType(expectedType) {
    return !(this.currentUserType == expectedType)
}

module.exports = {
    currentUserID,
    currentUserType,
    notLoggedIn,
    wrongUserType
}