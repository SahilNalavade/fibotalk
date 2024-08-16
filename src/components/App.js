import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard';
import ConnectForm from './ConnectForm';
import DatabasePage from './DatabasePage';
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
            <Route path="/" element={<Dashboard />} />
            <Route path="/connect" element={<ConnectForm />} />
            <Route path='/DatabasePage' element={<DatabasePage />} />
            <Route path='/schema-page' element={<SchemaPage />} />
            <Route path='/chat-page' element={<ChatPage />} />
            <Route path='/reports' element={<Reports />} />
            <Route path='/details' element={<DetailedPage />} />
            <Route path="*" element={<NotFoundPage />} /> {/* Fallback route */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
