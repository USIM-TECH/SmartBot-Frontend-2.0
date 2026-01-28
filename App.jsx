
import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

import { AuthProvider } from './context/AuthContext';

const App = () => {
  // Store selection state (to be moved to Context later if needed)
  const [selectedStoreIds, setSelectedStoreIds] = useState(new Set());
  
  const hasSelectedStores = selectedStoreIds.size > 0;

  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes 
          hasSelectedStores={hasSelectedStores}
          selectedStoreIds={selectedStoreIds}
          setSelectedStoreIds={setSelectedStoreIds}
        />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
