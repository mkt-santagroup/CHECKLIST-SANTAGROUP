// src/components/Tabs/Tabs.tsx

import { TabMode } from '../../types';
import styles from './Tabs.module.css';

interface TabsProps {
  current: TabMode;
  onSwitchTab: (tab: TabMode) => void;
  driveLink?: string;
}

export const Tabs = ({ current, onSwitchTab, driveLink }: TabsProps) => {
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
      
      {/* Container agrupando ROADMAP e Drive juntos */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          className={`${styles.roadmapBtn} ${current === 'roadmap' ? styles.activeRoadmap : ''}`}
          onClick={() => onSwitchTab('roadmap')}
        >
          🗺️ ROADMAP
        </button>

        {/* Usando a mesma classe styles.roadmapBtn para ficarem idênticos */}
        <a 
          href={driveLink || '#'}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => { 
            if (!driveLink) { 
              e.preventDefault(); 
              alert('Link não configurado! Vá em Ajustes (ícone de engrenagem) para definir.'); 
            } 
          }}
          className={styles.roadmapBtn}
          style={{ textDecoration: 'none' }}
        >
          📁 Drive ↗
        </a>
      </div>
    </div>
  );
};