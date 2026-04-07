import { URGENCY_META } from '../../constants/data';
import { daysFromToday } from '../../lib/utils';
import { AppState, Urgency, PanelData } from '../../types';
import styles from './RoadmapPanel.module.css';

interface RoadmapPanelProps {
  dates: Record<string, string | null>;
  state: AppState;
  urgencies: Record<string, Urgency>;
  appData: Record<string, PanelData>;
}

export const RoadmapPanel = ({ dates, state, urgencies, appData }: RoadmapPanelProps) => {
  const itemsWithDates: any[] = [];

  (['back', 'front', 'entregaveis'] as const).forEach((mode) => {
    if (!appData[mode]) return;
    
    appData[mode].sections.forEach((sec, si) => {
      if (sec.isTrail) return;
      sec.items.forEach((item, ii) => {
        const key = `${mode}_${si}_${ii}`;
        if (dates[key]) {
          itemsWithDates.push({
            date: dates[key],
            label: item.label,
            mode,
            isDone: !!state[mode][`${si}_${ii}`],
            urgency: urgencies[key] || item.urgency,
          });
        }
      });
    });
  });

  if (itemsWithDates.length === 0) {
    return (
      <div className={styles.roadmapEmpty}>
        Nenhum prazo definido ainda.<br />
        Adicione datas aos itens do checklist para montar seu roadmap automaticamente.
      </div>
    );
  }

  const grouped: Record<string, any[]> = {};
  itemsWithDates.forEach((item) => {
    if (!grouped[item.date]) grouped[item.date] = [];
    grouped[item.date].push(item);
  });

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return (
    <div className={styles.roadmapView}>
      <div className={styles.timeline}>
        {sortedDates.map((date) => {
          const diff = daysFromToday(date);
          let dotClass = styles.futuro;
          let labelClass = '';
          let labelText = '';

          if (diff < 0) { dotClass = styles.passado; labelText = 'Atrasado'; }
          else if (diff === 0) { dotClass = styles.hoje; labelClass = styles.hoje; labelText = 'Hoje'; }
          else { labelText = `Faltam ${diff} dias`; }

          const dateObj = new Date(date + 'T00:00:00');
          const dateStr = dateObj.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });

          return (
            <div key={date} className={styles.timelineItem}>
              <div className={`${styles.timelineDot} ${dotClass}`} />
              <div className={styles.timelineDate}>
                {dateStr} <span className={`${styles.timelineDateLabel} ${labelClass}`}>{labelText}</span>
              </div>
              <div className={styles.timelineTasks}>
                {grouped[date].map((task, idx) => {
                  const urg = URGENCY_META[task.urgency];
                  let sourceClass = '';
                  let sourceName = '';

                  if (task.mode === 'back') { sourceClass = styles.tlSourceBack; sourceName = 'Back'; }
                  else if (task.mode === 'front') { sourceClass = styles.tlSourceFront; sourceName = 'Front'; }
                  else if (task.mode === 'entregaveis') { sourceClass = styles.tlSourceEntregaveis; sourceName = 'Entregáveis'; }

                  return (
                    <div key={idx} className={`${styles.tlTask} ${task.isDone ? styles.done : ''}`}>
                      <div className={styles.tlUrgency} style={{ background: urg.dot }} title={urg.label} />
                      <div className={`${styles.tlTaskSource} ${sourceClass}`}>{sourceName}</div>
                      <div className={styles.tlTaskLabel}>{task.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};