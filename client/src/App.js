import { BrowserRouter, Switch, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home";
import MintToken from "./components/MintToken";
import MyNFT from "./components/MyNFT";
import DashBoard from "./components/DashBoard";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/minttoken" component={MintToken} />
        <Route exact path="/mynft" component={MyNFT} />
        <Route exact path="/dashboard" component={DashBoard} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
