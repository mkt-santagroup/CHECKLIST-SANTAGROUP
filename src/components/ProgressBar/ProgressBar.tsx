import { TabMode } from '../../types';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  current: TabMode;
  percentage: number;
  onReset: () => void;
}

export const ProgressBar = ({ current, percentage, onReset }: ProgressBarProps) => {
  if (current === 'roadmap') return null;

  const getFillClass = () => {
    if (current === 'back') return styles.pfBack;
    if (current === 'front') return styles.pfFront;
    if (current === 'entregaveis') return styles.pfEntregaveis;
    return '';
  };

  return (
    <div className={styles.progressRow}>
      <div className={styles.progressBar}>
        <div
          className={`${styles.progressFill} ${getFillClass()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={styles.progressLabel}>{percentage}%</span>
      <button className={styles.resetBtn} onClick={onReset}>
        resetar
      </button>
    </div>
  );
};
