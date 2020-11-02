const React = require("react");
const io = require("socket.io-client");

function PreviewProvider({ children }) {
  const [showReloadBar, setShowReloadBar] = React.useState(false);

  const [showInProgressBar, setInProgess] = React.useState(false);

  React.useEffect(() => {
    const socket = io();

    socket.on("connect", () => {
      console.log("Connected to cloud runner");
    });

    socket.on("reload", (data) => {
      console.log(`Received data for reload`, data);
      setInProgess(false);
      setShowReloadBar(true);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });

    socket.on("building", (data) => {
      console.log(`Received data for building`, data);
      setInProgess(true);
      setShowReloadBar(false);
    });

    return () => {
      return socket.close();
    };
  });

  return (
    <>
      {showReloadBar && (
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
          Your Preview is reloading...
        </div>
      )}

      {showInProgressBar && (
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
          Your Preview is rebuilding...
        </div>
      )}

      {children}
    </>
  );
}

exports.wrapRootElement = ({ element }) => {
  return <PreviewProvider>{element}</PreviewProvider>;
};
