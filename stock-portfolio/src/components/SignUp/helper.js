export function validatePassword(p) {
    var errors = [];
    if (p.length < 8) {
        // errors.push("Your password must be at least 8 characters"); 
        return false;
    }
    if (p.search(/[a-z]/i) < 0) {
        return false;
        // errors.push("Your password must contain at least one letter.");
    }
    if (p.search(/[0-9]/) < 0) {
        return false;
        // errors.push("Your password must contain at least one digit."); 
    }
    return true;
}

export function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // console.log();
    return re.test(email);
}