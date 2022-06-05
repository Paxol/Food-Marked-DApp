import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";
import { Notification } from "./components/ui/Notifications";
import { Wallet } from "./components/Wallet";
import { Cover } from "./components/Cover";
import { MainPage } from "./components/MainPage";
import "./App.css";
import { LoadingAlert } from "./components/LoadingAlert";
import { useLoadingContext } from "./context/LoadingContext";
import { useNotificationsContext } from "./context/NotificationsContext";
import { useBalanceContext } from "./context/BalanceContext";

const App = function AppWrapper({ name, description }) {
  const { address, destroy, connect } = useContractKit();
  const [balance] = useBalanceContext();

  const [loading] = useLoadingContext();
  const [notifications] = useNotificationsContext();

  return (
    <>
      {address ? (
        <Container fluid="md">
          <Navbar className="py-3" style={{ justifyContent: "space-between" }}>
            <Navbar.Brand>{name}</Navbar.Brand>

            <Nav className="justify-content-end">
              <Nav.Item>
                {/*display user wallet*/}
                {/* TODO: Change to generic ERC20 */}
                <Wallet
                  address={address}
                  amount={balance.cUSD}
                  symbol="cUSD"
                  destroy={destroy}
                />
              </Nav.Item>
            </Nav>
          </Navbar>

          <div className="sticky-top">
            {loading && <LoadingAlert />}

            {
              notifications.map((notification, index) => (
                <Notification
                  key={index}
                  status={notification.status}
                  text={notification.text}
                />
              ))
            }
          </div>

          {/* display cover */}
          <main>
            <MainPage />
          </main>
        </Container>
      ) : (
        // display cover if user is not connected
        <div className="App">
          <header className="App-header">
            <Cover {...{ connect, name, description }} />
          </header>
        </div>
      )}
    </>
  );
};

export default App;
