
import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  // Simple auth simulation for flow
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedStoreIds, setSelectedStoreIds] = useState(new Set());
  
  const hasSelectedStores = selectedStoreIds.size > 0;

  return (
    <HashRouter>
      <AppRoutes 
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        hasSelectedStores={hasSelectedStores}
        selectedStoreIds={selectedStoreIds}
        setSelectedStoreIds={setSelectedStoreIds}
      />
    </HashRouter>
  );
};

export default App;
