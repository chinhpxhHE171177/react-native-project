//validate email
export const isValidEmail = (stringEmail) =>
    (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(stringEmail))

//validate password
export const isValidPassword = (stringPassword) =>
    stringPassword.length >= 6

export const isValidRePassword = (stringPassword, stringRePassword) =>
    stringRePassword == stringPassword