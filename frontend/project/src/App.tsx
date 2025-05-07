import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import DatasetsPage from './pages/DatasetsPage';
import VisualizationPage from './pages/VisualizationPage';
import { DataProvider } from './context/DataContext';

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="datasets" element={<DatasetsPage />} />
            <Route path="visualization/:filename?" element={<VisualizationPage />} />
          </Route>
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;