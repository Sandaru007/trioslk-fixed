import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button 
      onClick={toggleTheme} 
      className={`theme-toggle-fab ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}
      aria-label="Toggle Theme"
    >
      <div className="icon-wrapper">
        {theme === 'dark' ? <Sun size={24} color="#f8f9fa" /> : <Moon size={24} color="#111827" />}
      </div>
    </button>
  );
};

export default ThemeToggle;
