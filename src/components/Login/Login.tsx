import { useState } from 'react';
import styles from './Login.module.css';

interface LoginProps {
  onLogin: () => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Verifica se a senha bate com a do seu .env
    if (password === import.meta.env.VITE_APP_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Checklist de Lançamento</h2>
        <p className={styles.subtitle}>Acesso restrito à equipe</p>
        
        <input
          type="password"
          className={`${styles.input} ${error ? styles.error : ''}`}
          placeholder="Digite a senha de acesso..."
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          autoFocus
        />
        
        {error && <span className={styles.errorText}>Senha incorreta. Tente novamente.</span>}
        
        <button type="submit" className={styles.submitBtn}>Entrar no Painel</button>
      </form>
    </div>
  );
};