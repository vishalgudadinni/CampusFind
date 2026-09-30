import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/public/Home";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import ReportLost from "./pages/items/ReportLost";
import ReportFound from "./pages/items/ReportFound";
import Matches from "./pages/matches/Matches";
import ClaimItem from "./pages/claims/ClaimItem";
import ClaimRequests from "./pages/claims/ClaimRequests";
import Chat from "./pages/chat/Chat";
import ReturnConfirmation from "./pages/returns/ReturnConfirmation";
import Wallet from "./pages/wallet/Wallet";
import MyItems from "./pages/items/MyItems";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/items/report-lost" element={<ReportLost />} />
          <Route path="/items/report-found" element={<ReportFound />} />
          <Route path="/items/:itemId/matches" element={<Matches />}/>
          <Route path="/claims/items/:itemId" element={<ClaimItem />}/>
          <Route path="/claims/received" element={<ClaimRequests />}/>
          <Route path="/chat/:claimId" element={<Chat />}/>
          <Route path="/returns/:claimId" element={<ReturnConfirmation />}/>
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/items/my-items" element={<MyItems />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;