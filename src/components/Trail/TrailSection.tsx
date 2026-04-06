import { useState } from 'react';
import { Milestone } from '../../types';
import styles from './TrailSection.module.css';

interface TrailSectionProps {
  milestones: Milestone[];
}

export const TrailSection = ({ milestones }: TrailSectionProps) => {
  const [postState, setPostState] = useState<Record<string, boolean>>({});
  const [metaState, setMetaState] = useState<Record<number, boolean>>({});

  const togglePost = (mi: number, pi: number) => {
    const key = `${mi}_${pi}`;
    setPostState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleMeta = (mi: number) => {
    setMetaState((prev) => ({ ...prev, [mi]: !prev[mi] }));
  };

  if (!milestones || milestones.length === 0) return null;

  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>Trilha de posts — metas de engajamento orgânico</div>
      {milestones.map((m, mi) => (
        <div key={mi} className={styles.marco}>
          <div className={styles.marcoHeader}>
            <span className={styles.marcoNum}>#{mi + 1}</span>
            <span className={styles.marcoTitle}>{m.title}</span>
            {m.meta && <span className={styles.metaBadge}>{m.meta} reações</span>}
          </div>
          <div className={styles.marcoPosts}>
            {m.posts.map((p, pi) => {
              const checked = !!postState[`${mi}_${pi}`];
              return (
                <div key={pi} className={`${styles.postRow} ${checked ? styles.pdone : ''}`}>
                  <div className={`${styles.postCheck} ${checked ? styles.done : ''}`} onClick={() => togglePost(mi, pi)}>
                    <svg className={styles.pcheckIcon} viewBox="0 0 9 9" fill="none">
                      <path d="M1 4.5L3.5 7L8 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className={styles.postLabel} onClick={() => togglePost(mi, pi)}>{p}</span>
                </div>
              );
            })}
            {m.meta && (
              <div className={styles.metaRow}>
                <div className={`${styles.metaCheck} ${metaState[mi] ? styles.done : ''}`} onClick={() => toggleMeta(mi)}>
                  <svg className={styles.pcheckIcon} viewBox="0 0 9 9" fill="none">
                    <path d="M1 4.5L3.5 7L8 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className={styles.metaLabel}>
                  Meta atingida: <span>{m.meta} reações orgânicas</span>
                  {m.unlocks && <span className={styles.unlocks}> → libera {m.unlocks}</span>}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};