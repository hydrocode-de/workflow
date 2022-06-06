import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import HomePage from './pages/HomePage';

// import pages
import WorkflowPage from './pages/WorkflowPage';
import LearningGeostatPage from './pages/LearningGeostatPage';

function App() {
  return (
    <Router>
      <CssBaseline />

      <Routes>
        
        <Route path="/" element={<HomePage />} />

        <Route path="/workflow" element={<WorkflowPage />} />

        <Route path="learn" element={<LearningGeostatPage />} />

        <Route path="*" element={<HomePage />} />

      </Routes>

    </Router>
  );
}

export default App;
