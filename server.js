
const ASSERT = require("assert");
const NODEMAILER = require("nodemailer");
const SMTP_TRANSPORT = require("nodemailer-smtp-transport");


// TODO: Only bind to local IP instead of all IPs to avoid creating an open relay by default.
require("io.pinf.server.www").for(module, __dirname, function(app, config, HELPERS) {

	var transporter = null;

	if (config.config.smtp) {
		transporter = NODEMAILER.createTransport(SMTP_TRANSPORT({
		    host: config.config.smtp.host,
		    port: config.config.smtp.port || 25,
		    auth: {
		        user: config.config.smtp.user,
		        pass: config.config.smtp.pass
		    }
		}));
	}

	app.post("/send", function (req, res, next) {
		try {
			if (!transporter) {
				throw new Error("No SMTP transporter configured!");
			}
			var opts = {
			    from: req.body.from || config.config.smtp.from || 'system@devcomp.io',
			    to: (req.body.to && req.body.to.join(", ")) || config.config.smtp.to || ASSERT.fail("'to' must be set!"),
			    subject: req.body.subject || config.config.smtp.subject || "",
			    text: req.body.text || (!req.body.html && ASSERT.fail("'text' or 'html' must be set!")) || null,
			    html: req.body.html || null
			};
			console.log("Sending email from", opts.from, "to", opts.to, "with subject", opts.subject);
			return transporter.sendMail(opts, function (err, info) {
				if (err) return next(err);

				console.log("Sent email:", info);

				return res.end("{}");
			});
		} catch (err) {
			return next(err);
		}
	});

});
