import { PanelData, TabMode, Urgency, Milestone } from '../../types';
import { ChecklistItem } from './ChecklistItem';
import { TrailSection } from '../Trail/TrailSection';
import styles from './ChecklistPanel.module.css';

interface ChecklistPanelProps {
  mode: TabMode;
  data: PanelData;
  milestones: Milestone[];
  state: Record<string, boolean>;
  onToggle: (key: string) => void;
  onToggleSubtask: (si: number, ii: number, subI: number) => void;
  urgencies: Record<string, Urgency>;
  onUrgencyChange: (key: string, urg: Urgency) => void;
  dates: Record<string, string | null>;
  onDateChange: (key: string, date: string | null) => void;
  activeFilter: string;
}

export const ChecklistPanel = ({
  mode, data, milestones, state, onToggle, onToggleSubtask, urgencies, onUrgencyChange, dates, onDateChange, activeFilter,
}: ChecklistPanelProps) => {
  return (
    <div className={styles.panel}>
      {data.sections.map((section, si) => {
        if (section.isTrail) {
          return <TrailSection key="trail" milestones={milestones} />; // <--- Passado aqui!
        }

        return (
          <div key={si} className={styles.section}>
            <div className={styles.sectionTitle}>{section.title}</div>
            {section.items.map((item, ii) => {
              const key = `${mode}_${si}_${ii}`;
              const urgency = urgencies[key] || item.urgency;
              const date = dates[key] || null;

              let isHidden = false;
              if (activeFilter !== 'all') {
                if (activeFilter === 'com-data') { isHidden = !date; } 
                else { isHidden = urgency !== activeFilter; }
              }

              return (
                <ChecklistItem key={key} item={item} itemKey={key} mode={mode} isChecked={!!state[`${si}_${ii}`]}
                  onToggle={() => onToggle(`${si}_${ii}`)} isSubtaskChecked={(subI) => !!state[`${si}_${ii}_sub_${subI}`]}
                  onToggleSubtask={(subI) => onToggleSubtask(si, ii, subI)} urgency={urgency} onUrgencyChange={(urg: Urgency) => onUrgencyChange(key, urg)}
                  date={date} onDateChange={(d: string | null) => onDateChange(key, d)} isHidden={isHidden} />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};