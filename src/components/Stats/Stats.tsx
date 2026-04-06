import { TabMode } from '../../types';
import styles from './Stats.module.css';

interface StatsProps {
  current: TabMode;
  done: number;
  total: number;
}

export const Stats = ({ current, done, total }: StatsProps) => {
  if (current === 'roadmap') return null;

  return (
    <div className={styles.stats}>
      <div className={styles.stat}>
        <div className={styles.statNum}>{done}</div>
        <div className={styles.statLabel}>concluídos</div>
      </div>
      <div className={styles.stat}>
        <div className={styles.statNum}>{total}</div>
        <div className={styles.statLabel}>total</div>
      </div>
      <div className={styles.stat}>
        <div className={styles.statNum}>{total - done}</div>
        <div className={styles.statLabel}>restantes</div>
      </div>
    </div>
  );
};
