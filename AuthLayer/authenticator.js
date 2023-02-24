let userDB;

module.exports = (injected) => {
    userDB = injected;

    return {
        registerUser,
        login,
    };
};

function registerUser(req, res) {
    userDB.isValidUser(req.body.username, (error, isValidUser) => {
        if (error || !isValidUser) {
            const message = error
                ? "big bad oh no (error, something went wrong)"
                : "absolute clone get creative idiot (user already exists)";

            sendResponse(res, message, error);

            return;
        }

        userDB.register(req.body.username, req.body.password, (response) => {
            sendResponse(
                res,
                response.error === undefined ? "let's goo (successful)" : "very tragic (unsuccessful)",
                response.error
            );
        });
    });
}

function login(query, res) {}

function sendResponse(res, message, error) {
    res.status(error !== undefined ? 400 : 200).json({
        message: message,
        error: error,
    });
}