import { BrowserRouter, Route, Routes } from "react-router-dom";

import GatewayList from "./views/GatewayList";
import GatewayDetails from "./views/GatewayDetails";
import DefaultLayout from "./layouts/DefaultLayout";

const App = () => (
  <DefaultLayout>
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={GatewayList} />
        <Route path="/gateways/:serialNumber" Component={GatewayDetails} />
      </Routes>
    </BrowserRouter>
  </DefaultLayout>
)

export default App