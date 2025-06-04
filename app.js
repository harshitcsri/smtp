// smtp-proxy.js
const { SMTPServer } = require("smtp-server");

const server = new SMTPServer({
  authOptional: true,
  onData(stream, session, callback) {
    let emailData = '';
    stream.on("data", chunk => emailData += chunk.toString());
    stream.on("end", () => {
      // ✅ Log the outbound email attempt
      console.log("Blocked outbound email:");
      console.log(emailData);

      // ❌ Drop the email silently
      callback(null); // don't relay it
    });
  },
  onMailFrom(address, session, callback) {
    console.log("MAIL FROM:", address.address);
    callback(); // allow
  },
  onRcptTo(address, session, callback) {
    console.log("RCPT TO:", address.address);
    callback(); // allow
  }
});

server.listen(2526, () => {
  console.log("Fake SMTP server running on port 2526");
});
