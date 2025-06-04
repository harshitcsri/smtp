const { SMTPServer } = require("smtp-server");

const server = new SMTPServer({
  // Require authentication
  authOptional: false,

  // Handle login
  onAuth(auth, session, callback) {
    const { username, password } = auth;

    // Replace with your expected credentials
    if (username === "freshdesk" && password === "block123") {
      console.log("SMTP Auth Success");
      return callback(null, { user: username });
    } else {
      console.log("SMTP Auth Failed");
      return callback(new Error("Invalid SMTP credentials"));
    }
  },

  // Handle incoming mail
  onData(stream, session, callback) {
    let emailData = '';
    stream.on("data", chunk => emailData += chunk.toString());
    stream.on("end", () => {
      console.log("✉️ Blocked outbound email:\n", emailData);
      callback(); // Don't relay, just pretend to accept
    });
  },

  // Handle MAIL FROM and RCPT TO
  onMailFrom(address, session, callback) {
    console.log("MAIL FROM:", address.address);
    callback();
  },
  onRcptTo(address, session, callback) {
    console.log("RCPT TO:", address.address);
    callback();
  },

  logger: true
});

server.listen(2526, () => {
  console.log("🚀 Local SMTP proxy running on port 2526");
});
