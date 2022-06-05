import logo from "../logo.svg";
import { Button } from "react-bootstrap";

export const Cover = ({ connect, name, description }) => {
  const connectWallet = async () => {
    try {
      await connect();
    } catch (e) {
      console.log({ e });
    }
  };
  return (
    <>
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        {name}<br />
        <small>{description}</small>
      </p>
      <Button variant="primary" onClick={connectWallet}>
        Connect Wallet
      </Button>
    </>
  );
};
