import { TabMode } from '../../types';
import styles from './Legend.module.css';

interface LegendProps {
  current: TabMode;
}

export const Legend = ({ current }: LegendProps) => {
  if (current === 'roadmap') return null;

  return (
    <div className={styles.urgencyLegend}>
      <div className={styles.urgBadge}>
        <div className={`${styles.urgDot} ${styles.urgente}`} />
        Urgente — bloqueia o lançamento
      </div>
      <div className={styles.urgBadge}>
        <div className={`${styles.urgDot} ${styles.importante}`} />
        Importante — impacta a qualidade
      </div>
      <div className={styles.urgBadge}>
        <div className={`${styles.urgDot} ${styles.planejamento}`} />
        Planejamento — antecipação necessária
      </div>
      <div className={styles.urgBadge}>
        <div className={`${styles.urgDot} ${styles.opcional}`} />
        Opcional — quando aplicável
      </div>
    </div>
  );
};
