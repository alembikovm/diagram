import * as React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from "react-router-dom";

import PieDiagramm from "components/LinksStatistic";

const App = () => (
  <Router>
    <PieDiagramm />

    <Switch>
      <Route path="/:id" children={<Child />} />
    </Switch>
  </Router>
);

const Child = () => {
  let { id } = useParams();

  return (
    <div>
      <h3>ID: {id}</h3>
    </div>
  );
};

export default App;
