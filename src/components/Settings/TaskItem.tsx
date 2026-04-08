import { useState } from 'react';
import { PanelData, TabMode, Urgency } from '../../types';
import { URGENCY_META } from '../../constants/data';
import styles from './Settings.module.css';
import { IconEdit, IconTrash, IconGrip } from './Icons';

interface TaskItemProps {
  item: any;
  si: number;
  ii: number;
  selectedCat: TabMode;
  appData: Record<string, PanelData>;
  setAppData: React.Dispatch<React.SetStateAction<Record<string, PanelData>>>;
  itemUrgencies: Record<string, Urgency>;
  setItemUrgencies: React.Dispatch<React.SetStateAction<Record<string, Urgency>>>;
  itemDates: Record<string, string | null>;
  setItemDates: React.Dispatch<React.SetStateAction<Record<string, string | null>>>;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isDragOver: boolean;
  isBeingDragged: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

export const TaskItem = ({
  item, si, ii, selectedCat, appData, setAppData,
  itemUrgencies, setItemUrgencies, itemDates, setItemDates,
  isExpanded, onToggleExpand,
  isDragOver, isBeingDragged,
  onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd
}: TaskItemProps) => {
  const itemKey = `${selectedCat}_${si}_${ii}`;
  const currentUrgency = itemUrgencies[itemKey] || item.urgency;
  const currentDate = itemDates[itemKey] || '';
  const meta = URGENCY_META[currentUrgency];

  const [isEditingTask, setIsEditingTask] = useState(false);
  const [taskEditValue, setTaskEditValue] = useState('');

  const [editingSubIdx, setEditingSubIdx] = useState<number | null>(null);
  const [subEditValue, setSubEditValue] = useState('');

  const [newSubtext, setNewSubtext] = useState('');
  const [isUrgencyOpen, setIsUrgencyOpen] = useState(false);
  const [dragEnabled, setDragEnabled] = useState(false);

  const saveEditTask = () => {
    if (taskEditValue.trim()) {
      setAppData(prev => {
        const s = [...prev[selectedCat].sections];
        const items = [...s[si].items];
        items[ii] = { ...items[ii], label: taskEditValue };
        s[si] = { ...s[si], items };
        return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: s } };
      });
    }
    setIsEditingTask(false);
  };

  const handleDeleteTask = () => {
    setAppData(prev => {
      const s = [...prev[selectedCat].sections];
      s[si] = { ...s[si], items: s[si].items.filter((_, i) => i !== ii) };
      return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: s } };
    });
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtext.trim()) return;
    setAppData(prev => {
      const s = [...prev[selectedCat].sections];
      const items = [...s[si].items];
      items[ii] = { ...items[ii], subtasks: [...(items[ii].subtasks || []), { label: newSubtext }] };
      s[si] = { ...s[si], items };
      return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: s } };
    });
    setNewSubtext('');
  };

  const saveEditSubtask = (subI: number) => {
    if (subEditValue.trim()) {
      setAppData(prev => {
        const s = [...prev[selectedCat].sections];
        const items = [...s[si].items];
        const subs = [...(items[ii].subtasks || [])];
        subs[subI] = { ...subs[subI], label: subEditValue };
        items[ii] = { ...items[ii], subtasks: subs };
        s[si] = { ...s[si], items };
        return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: s } };
      });
    }
    setEditingSubIdx(null);
  };

  const handleDeleteSubtask = (subI: number) => {
    setAppData(prev => {
      const s = [...prev[selectedCat].sections];
      const items = [...s[si].items];
      items[ii] = { ...items[ii], subtasks: items[ii].subtasks?.filter((_, i) => i !== subI) };
      s[si] = { ...s[si], items };
      return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: s } };
    });
  };

  const handleInfoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAppData(prev => {
      const s = [...prev[selectedCat].sections];
      const items = [...s[si].items];
      items[ii] = { ...items[ii], info: e.target.value };
      s[si] = { ...s[si], items };
      return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: s } };
    });
  };

  return (
    <div className={`${styles.itemBox} ${isDragOver ? styles.dragOverActive : ''} ${isBeingDragged ? styles.beingDragged : ''}`} draggable={dragEnabled} onDragStart={onDragStart} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} onDragEnd={onDragEnd}>
      <div className={styles.itemRow}>
        <div className={styles.dragHandle} title="Arrastar para reordenar" onMouseEnter={() => setDragEnabled(true)} onMouseLeave={() => setDragEnabled(false)} onTouchStart={() => setDragEnabled(true)} onTouchEnd={() => setDragEnabled(false)}><IconGrip /></div>
        {isEditingTask ? (
          <div className={styles.editRow} onClick={e => e.stopPropagation()}>
            <input autoFocus className={styles.editInput} value={taskEditValue} onChange={e => setTaskEditValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveEditTask()} onBlur={saveEditTask} />
          </div>
        ) : (
          <div className={styles.itemLabel} onClick={onToggleExpand}>📝 {item.label}</div>
        )}
        <div className={styles.actionGroupTask}>
          <button className={styles.iconBtnSmall} onClick={() => { setTaskEditValue(item.label); setIsEditingTask(true); }}><IconEdit /></button>
          <button className={`${styles.iconBtnSmall} ${styles.iconDanger}`} onClick={handleDeleteTask}><IconTrash /></button>
          <div className={styles.taskChevron} onClick={onToggleExpand}>{isExpanded ? '▲' : '▼'}</div>
        </div>
      </div>

      {isExpanded && (
        <div className={styles.taskExpandedBody}>
          <div className={styles.itemConfigRow}>
            <div className={styles.pillWrap}>
              <button className={`${styles.urgPill} ${styles[meta.cls]}`} onClick={() => setIsUrgencyOpen(!isUrgencyOpen)}><span className={styles.urgDot} style={{ background: meta.dot }} />{meta.text} ▾</button>
              {isUrgencyOpen && (
                <div className={styles.urgDropdown}>
                  {(Object.keys(URGENCY_META) as Urgency[]).map(u => (
                    <div key={u} className={`${styles.urgOpt} ${currentUrgency === u ? styles.selected : ''}`} onClick={() => { setItemUrgencies({ ...itemUrgencies, [itemKey]: u }); setIsUrgencyOpen(false); }}><span className={styles.urgDot} style={{ background: URGENCY_META[u].dot }} /><span style={{ color: URGENCY_META[u].dot }}>{URGENCY_META[u].text}</span></div>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.datePickerWrap}><span className={styles.dateIcon}>📅</span><input type="date" className={styles.dateInput} value={currentDate} onChange={e => setItemDates({ ...itemDates, [itemKey]: e.target.value || null })} />{currentDate && <button className={styles.clearDateBtn} onClick={() => setItemDates({ ...itemDates, [itemKey]: null })}>✕</button>}</div>
          </div>
          <textarea className={styles.infoTextarea} placeholder="Adicionar descrição ou informações adicionais da tarefa..." value={item.info || ''} onChange={handleInfoChange} />
          <div className={styles.subtasksWrap}>
            {item.subtasks?.map((sub: any, subI: number) => (
              <div key={subI} className={styles.subtaskRow}><span className={styles.subtaskTree}>└</span>{editingSubIdx === subI ? <input autoFocus className={styles.editInputSmall} value={subEditValue} onChange={e => setSubEditValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveEditSubtask(subI)} onBlur={() => saveEditSubtask(subI)} /> : <span className={styles.subtaskLabel}>{sub.label}</span>}<div className={styles.actionGroupSub}><button className={styles.iconBtnSub} onClick={() => { setSubEditValue(sub.label); setEditingSubIdx(subI); }}><IconEdit /></button><button className={`${styles.iconBtnSub} ${styles.iconDanger}`} onClick={() => handleDeleteSubtask(subI)}><IconTrash /></button></div></div>
            ))}
            <form className={styles.miniForm} onSubmit={handleAddSubtask}><span className={styles.subtaskTree}>└</span><input type="text" placeholder="Adicionar subtarefa e apertar Enter..." value={newSubtext} onChange={e => setNewSubtext(e.target.value)} /></form>
          </div>
        </div>
      )}
    </div>
  );
};