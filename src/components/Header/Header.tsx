import styles from './Header.module.css';

interface HeaderProps {
  currentView: 'home' | 'settings';
  onNavigate: (view: 'home' | 'settings') => void;
}

export const Header = ({ currentView, onNavigate }: HeaderProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.titles}>
        <div className={styles.title}>Checklist de lançamento</div>
        <div className={styles.subtitle}>Garanta que todo lançamento seja igual</div>
      </div>
      
      <button 
        className={styles.navBtn} 
        onClick={() => onNavigate(currentView === 'home' ? 'settings' : 'home')}
      >
        {currentView === 'home' ? '⚙️ Ajustes' : '🏠 Voltar'}
      </button>
    </div>
  );
};