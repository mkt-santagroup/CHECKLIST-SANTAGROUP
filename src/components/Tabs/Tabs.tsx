import { TabMode } from '../../types';
import styles from './Tabs.module.css';

interface TabsProps {
  current: TabMode;
  onSwitchTab: (tab: TabMode) => void;
}

export const Tabs = ({ current, onSwitchTab }: TabsProps) => {
  return (
    <div className={styles.controlsRow}>
      <div className={styles.toggle}>
        <button
          className={`${styles.tab} ${current === 'back' ? styles.activeBack : ''}`}
          onClick={() => onSwitchTab('back')}
        >
          Backstage
        </button>
        <button
          className={`${styles.tab} ${current === 'front' ? styles.activeFront : ''}`}
          onClick={() => onSwitchTab('front')}
        >
          Frontline
        </button>
        <button
          className={`${styles.tab} ${current === 'entregaveis' ? styles.activeEntregaveis : ''}`}
          onClick={() => onSwitchTab('entregaveis')}
        >
          Entregáveis
        </button>
      </div>
      <button
        className={`${styles.roadmapBtn} ${current === 'roadmap' ? styles.activeRoadmap : ''}`}
        onClick={() => onSwitchTab('roadmap')}
      >
        🗺️ ROADMAP
      </button>
    </div>
  );
};
