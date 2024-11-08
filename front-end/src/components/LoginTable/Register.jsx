import React, { useState } from 'react';

function Register({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // 在这里处理注册逻辑，例如发送请求到服务器
    if (password !== confirmPassword) {
      alert('密码不匹配');
      return;
    }
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="register-container">
      <h2>注册</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">邮箱:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">密码:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">确认密码:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">注册</button>
      </form>
      <p>已经有账号？ <button onClick={onSwitch}>登录</button></p>
    </div>
  );
}

export default Register;
