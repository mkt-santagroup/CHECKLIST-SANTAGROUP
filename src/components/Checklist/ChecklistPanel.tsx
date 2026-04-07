import { PanelData, TabMode, Urgency } from '../../types';
import { ChecklistItem } from './ChecklistItem';
import styles from './ChecklistPanel.module.css';

interface ChecklistPanelProps {
  mode: TabMode;
  data: PanelData;
  state: Record<string, boolean>;
  onToggle: (key: string) => void;
  onToggleSubtask: (si: number, ii: number, subI: number) => void;
  urgencies: Record<string, Urgency>;
  dates: Record<string, string | null>;
  activeFilter: string;
}

export const ChecklistPanel = ({
  mode, data, state, onToggle, onToggleSubtask, urgencies, dates, activeFilter,
}: ChecklistPanelProps) => {
  return (
    <div className={styles.panel}>
      {data.sections.map((section, si) => {
        if (section.isTrail) return null; 

        return (
          <div key={si} className={styles.section}>
            <div className={styles.sectionTitle} style={{ color: section.color || '#FFFFFF' }}>
              {section.title}
            </div>
            
            {/* DESTAQUE DA META (Aparece direto no Checklist!) */}
            {section.hasGoals && section.goalText && (
              <div style={{ 
                marginBottom: '16px', 
                padding: '12px 16px', 
                backgroundColor: 'rgba(255,255,255,0.03)', 
                borderLeft: `4px solid ${section.color && section.color !== '#FFFFFF' ? section.color : '#534AB7'}`,
                borderRadius: '0 8px 8px 0',
                color: '#E4E4E7',
                fontSize: '0.95rem'
              }}>
                🎯 <strong style={{ color: '#A1A1AA', marginRight: '6px' }}>Objetivo:</strong> {section.goalText}
              </div>
            )}
            
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
                <ChecklistItem 
                  key={key} 
                  item={item} 
                  itemKey={key} 
                  mode={mode} 
                  isChecked={!!state[`${si}_${ii}`]}
                  onToggle={() => onToggle(`${si}_${ii}`)} 
                  isSubtaskChecked={(subI) => !!state[`${si}_${ii}_sub_${subI}`]}
                  onToggleSubtask={(subI) => onToggleSubtask(si, ii, subI)} 
                  urgency={urgency} 
                  date={date} 
                  isHidden={isHidden} 
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};