import { useState, useEffect } from 'react';
import { auth } from '../../services/Firebase';
import { signInWithGoogle, logout } from '../../services/firebaseService';
import { onAuthStateChanged } from 'firebase/auth';
import './Login.css';

const LoginButton = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setError(''); 
    const result = await signInWithGoogle();
    if (!result.success) {
      setError('Error al iniciar sesión. Inténtalo de nuevo.');
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) return <div className="login-loading">...</div>;

  if (user) {
    return (
      <div className="user-info">
        <img 
          src={user.photoURL || 'https://via.placeholder.com/32'} 
          alt={user.displayName}
          className="user-avatar"
        />
        <span className="user-name">{user.displayName}</span>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    );
  }

  return (
    <>
      <button onClick={handleLogin} className="login-btn">
        <img 
          src="https://www.google.com/favicon.ico" 
          alt="Google" 
          className="google-icon"
        />
        Sign in with Google
      </button>
      {error && <div className="login-error">{error}</div>}
    </>
  );
};

export default LoginButton;