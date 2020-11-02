const React = require("react");
const io = require("socket.io-client");

function PreviewProvider({ children }) {
  const [showStatusBar, setShowStatus] = React.useState(false);
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    const socket = io();

    socket.on("connect", () => {
      console.log("Connected to Gatsby Preview");
    });

    socket.on("status", (data) => {
      console.log(`Received data for reload`, data);

      if (data && data.event) {
        showStatusBar(true);
      }

      if (data && data.event === "SUCCESS") {
        setMessage("You Gatsby Preview is reloading...");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setMessage(
          "You Gatsby Preview is building, the page will reload when complete..."
        );
      }
    });

    return () => {
      return socket.close();
    };
  });

  return (
    <>
      {showStatusBar && (
        <div
          style={{
            position: `fixed`,
            width: `100%`,
            top: 0,
            left: 0,
            backgroundColor: `purple`,
            color: `white`,
            textAlign: `center`,
          }}
        >
          {message}
        </div>
      )}

      {children}
    </>
  );
}

exports.wrapRootElement = ({ element }) => {
  return <PreviewProvider>{element}</PreviewProvider>;
};
