import React, { useState } from 'react';
import { ChecklistItemData, Urgency } from '../../types';
import { URGENCY_META } from '../../constants/data';
import { daysFromToday } from '../../lib/utils';
import styles from './ChecklistItem.module.css';

interface ChecklistItemProps {
  item: ChecklistItemData;
  itemKey: string;
  mode: string;
  isChecked: boolean;
  onToggle: () => void;
  isSubtaskChecked: (subI: number) => boolean;
  onToggleSubtask: (subI: number) => void;
  urgency: Urgency;
  date: string | null;
  isHidden: boolean;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
  item,
  mode,
  isChecked,
  onToggle,
  isSubtaskChecked,
  onToggleSubtask,
  urgency,
  date,
  isHidden
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  if (isHidden) return null;

  const meta = URGENCY_META[urgency];
  const colorClass = mode === 'back' ? styles.cbBack : mode === 'front' ? styles.cbFront : styles.cbEntregaveis;

  const getDaysPill = () => {
    if (!date) return null;
    const diff = daysFromToday(date);
    let cls = styles.far;
    let txt = `${diff}d restantes`;

    if (diff < 0) { cls = styles.overdue; txt = `${Math.abs(diff)}d atrasado`; }
    else if (diff === 0) { cls = styles.today; txt = 'Hoje!'; }
    else if (diff <= 2) { cls = styles.near; txt = `${diff}d restante${diff > 1 ? 's' : ''}`; }
    else if (diff <= 7) { cls = styles.ok; txt = `${diff}d restantes`; }

    return <span className={`${styles.daysPill} ${styles.visible} ${cls}`}>📅 {txt}</span>;
  };

  return (
    <div className={`${styles.item} ${isChecked ? styles.done : ''}`}>
      <div className={styles.itemRow} onClick={onToggle}>
        <div className={`${styles.checkbox} ${isChecked ? colorClass : ''}`}>
          <svg className={styles.checkIcon} viewBox="0 0 11 11" fill="none">
            <path d="M1.5 5.5L4.5 8.5L9.5 2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        
        <span className={styles.itemLabel}>
          {item.label}
          {item.optional && <span className={styles.optional}>opcional</span>}
        </span>
        
        <div className={styles.pillWrap}>
          <span className={`${styles.urgPill} ${styles[meta.cls]}`}>
            {meta.emoji} {meta.text}
          </span>
        </div>

        {getDaysPill()}

        {item.info && (
          <button
            className={`${styles.infoBtn} ${isPanelOpen ? styles.active : ''}`}
            onClick={(e) => { e.stopPropagation(); setIsPanelOpen(!isPanelOpen); }}
          >
            i
          </button>
        )}
      </div>

      {item.subtasks && item.subtasks.length > 0 && !isChecked && (
        <div className={styles.subtasksWrapper}>
          {item.subtasks.map((sub, sIdx) => {
            const isSubDone = isSubtaskChecked(sIdx);
            return (
              <div key={sIdx} className={`${styles.subtaskRow} ${isSubDone ? styles.done : ''}`} onClick={() => onToggleSubtask(sIdx)}>
                <div className={`${styles.subCheckbox} ${isSubDone ? colorClass : ''}`}>
                  <svg className={styles.checkIcon} viewBox="0 0 11 11" fill="none">
                    <path d="M1.5 5.5L4.5 8.5L9.5 2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className={styles.subLabel}>{sub.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {item.info && (
        <div className={`${styles.itemBottom} ${isPanelOpen ? styles.open : ''}`}>
          <div className={styles.infoText}>{item.info}</div>
        </div>
      )}
    </div>
  );
};