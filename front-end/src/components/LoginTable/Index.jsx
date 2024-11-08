import React, { useState } from 'react';
import Login from './Login.jsx';
import Register from './Register.jsx';

function Index() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="app-container">
      {isLogin ? <Login onSwitch={toggleForm} /> : <Register onSwitch={toggleForm} />}
    </div>
  );
}

export default Index;
