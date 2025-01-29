const blacklist = new Set();

const revokeAccessToken = (token) => {
    blacklist.add(token);
}

module.exports = {
    revokeAccessToken,
    blacklist
}