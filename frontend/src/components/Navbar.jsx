import React from 'react';
import { GraduationCap, RefreshCw, Sun, Moon } from 'lucide-react';

export function Navbar({ serverStatus, onRefresh, isRefreshing, darkMode, setDarkMode }) {
  const getStatusText = () => {
    switch (serverStatus) {
      case 'online':
        return 'Connected (Spring Boot)';
      case 'connecting':
        return 'Connecting...';
      case 'offline':
      default:
        return 'Backend Offline';
    }
  };

  const getStatusClass = () => {
    switch (serverStatus) {
      case 'online':
        return 'status-online';
      case 'connecting':
        return 'status-connecting';
      case 'offline':
      default:
        return 'status-offline';
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand-section">
          <div className="brand-icon-wrapper">
            <GraduationCap size={24} strokeWidth={2.2} />
          </div>
          <div className="brand-text">
            <h1>Student Portal</h1>
            <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
              <span className="brand-badge">Spring Boot 4.x</span>
              <span className="brand-badge">React</span>
            </div>
          </div>
        </div>

        <div className="nav-actions">
          {/* Live Spring Boot Connection Indicator */}
          <div className={`status-pill ${getStatusClass()}`} title="Spring Boot REST API Health">
            <span className="status-dot"></span>
            <span>{getStatusText()}</span>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            className="btn btn-outline-light btn-sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh student records from Spring Boot backend"
          >
            <RefreshCw size={15} className={isRefreshing ? 'spin-animation' : ''} />
            <span>Refresh</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="btn btn-outline-light btn-icon-only btn-sm"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
}
