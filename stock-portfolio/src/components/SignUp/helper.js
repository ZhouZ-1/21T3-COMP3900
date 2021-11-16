export function validatePassword(p) {
    if (p.length < 8) {
        return false;
    }
    if (p.search(/[a-z]/i) < 0) {
        return false;
    }
    if (p.search(/[0-9]/) < 0) {
        return false;
    }
    return true;
}

export function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}