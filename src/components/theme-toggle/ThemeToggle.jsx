import './ThemeToggle.css';

const ThemeToggle = ({ darkMode, setDarkMode }) => {
  const toggleDarkMode = () => {
    setDarkMode(!darkMode); 
  };

  return (
    <button 
      onClick={toggleDarkMode}
      className="theme-toggle-btn"
      aria-label={darkMode ? 'Light Mode' : 'Dark Mode'}
    >
      <span className="theme-icon">
        {darkMode ? '☀︎' : '☾'}
      </span>
    </button>
  );
};

export default ThemeToggle;