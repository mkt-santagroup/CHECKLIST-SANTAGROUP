import { daysFromToday, formatDate } from '../../lib/utils';
import styles from './LaunchBanner.module.css';

interface LaunchBannerProps {
  launchDate: string | null;
  onSetLaunchDate: (date: string) => void;
  onClearLaunchDate: () => void;
}

export const LaunchBanner = ({ launchDate, onSetLaunchDate, onClearLaunchDate }: LaunchBannerProps) => {
  const getCountdown = () => {
    if (!launchDate) return { text: '', cls: '' };
    const diff = daysFromToday(launchDate);
    if (diff < 0) return { text: `Lançamento foi há ${Math.abs(diff)} dia${Math.abs(diff) > 1 ? 's' : ''}`, cls: styles.urgente };
    if (diff === 0) return { text: '🚀 É hoje!', cls: styles.urgente };
    if (diff <= 3) return { text: `Faltam ${diff} dia${diff > 1 ? 's' : '' } — atenção máxima`, cls: styles.urgente };
    if (diff <= 7) return { text: `Faltam ${diff} dias — semana do lançamento`, cls: styles.proximo };
    return { text: `Faltam ${diff} dias`, cls: styles.ok };
  };

  const countdown = getCountdown();

  return (
    <div className={styles.launchBanner}>
      <div className={styles.launchBannerLeft}>
        <div className={styles.launchLabel}>Data do lançamento</div>
        <div className={`${styles.launchDateDisplay} ${!launchDate ? styles.empty : ''}`}>
          {launchDate ? formatDate(launchDate) : 'Nenhuma data definida'}
        </div>
        <div className={`${styles.launchCountdown} ${countdown.cls}`}>
          {countdown.text}
        </div>
      </div>
      <div className={styles.dateInputWrap}>
        <input
          type="date"
          className={styles.dateInput}
          value={launchDate || ''}
          onChange={(e) => onSetLaunchDate(e.target.value)}
        />
        <button className={styles.clearDateBtn} onClick={onClearLaunchDate}>Limpar</button>
      </div>
    </div>
  );
};
