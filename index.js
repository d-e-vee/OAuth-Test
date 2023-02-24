//database imports
const pgPool = require("./Database/queryExport");
const tokenDB = require("./Database/tokenDB")(pgPool);
const userDB = require("./Database/userDB")(pgPool);

//auth imports
const authService = require("./AuthLayer/tokenService")(userDB, tokenDB);
const authServer = require("node-oauth2-server");

//express
const express = require("express");
const app = express();
app.oauth = authServer({
    model: authService,
    grants: ["password"],
    debug: true,
});

//testing imports
const testAPIServices = require("./Testing/testAPIServices");
const testAPIRoutes = require("./Testing/testAPIRoutes")(
    express.Router(),
    app,
    testAPIServices,
);

//auth + routes
const authenticator = require("./AuthLayer/authenticator")(userDB);
const routes = require("./AuthLayer/routes")(
    express.Router(),
    app,
    authenticator
);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(app.oauth.errorHandler());
app.use("/auth", routes);
app.use("/test", testAPIRoutes);
const port = 3000;

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
