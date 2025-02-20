import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from './Home/Register';
import HomePage from './Home/HomePage';
import CallRecords from './Call records/Callrecords';
import BuyerSellerChart from "./BuyerSellerChart";
import UploadFile from "./UploadFile";  // Import Upload Component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/call-records" element={<CallRecords />} />
        <Route path="/buyer-seller-chart" element={<BuyerSellerChart />} />
        <Route path="/upload" element={<UploadFile />} />
      </Routes>
    </Router>
  );
}

export default App;

