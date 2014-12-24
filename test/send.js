
const ASSERT = require("assert");
const PATH = require("path");
const FS = require("fs");
const REQUEST = require("request");


function getConfig() {
    var path = PATH.join(__dirname, "../../.pio.json");
    if (!FS.existsSync(path)) {
        throw new Error("This service must be deployed before it may be tested!");
    }
    var pioConfig = JSON.parse(FS.readFileSync(path));
    return {
    	host: "127.0.0.1:" + pioConfig.env.PORT
    };
}


describe("send", function() {

    it("simple", function(done) {

    	var config = getConfig();

        return REQUEST({
            uri: "http://" + config.host + "/send",
            method: "POST",
            json: {
            	subject: "Test subject",
                text: "Test text"
            }
        }, function(err, res, body) {
            if (err) return done(err);

            ASSERT.equal(res.statusCode, 200);

            return done();
        });
    });

});

