import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard';
import ConnectForm from './ConnectForm';
import DatabasePage from './DatabasePage';
import DatabasePagecopy from './DatabasePagecopy';
import SchemaPage from './SchemaPage';
import { AuthProvider } from '../auth'; // Import AuthProvider
import ChatPage from './ChatPage';
import Reports from './Reports';
import DetailedPage from './DetailedPage';
import NotFoundPage from './NotFoundPage'; // Import a NotFoundPage component


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Reports />} />
            <Route path='/DatabasePage' element={<DatabasePage />} />
            <Route path='/DatabasePagec' element={<DatabasePagecopy />} />
            <Route path='/schema-page' element={<SchemaPage />} />
            <Route path='/chat-page' element={<ChatPage />} />
            <Route path='/connections' element={<Dashboard />} />
            <Route path='/details' element={<DetailedPage />} />
            <Route path="*" element={<NotFoundPage />} /> {/* Fallback route */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
