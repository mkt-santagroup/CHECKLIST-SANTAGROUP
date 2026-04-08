import { useState } from 'react';
import { PanelData, TabMode, Urgency } from '../../types';
import styles from './Settings.module.css';
import { IconEdit, IconTrash, IconUp, IconDown } from './Icons';
import { TaskItem } from './TaskItem';
import { CORES_PREDEFINIDAS } from './CategoryForm';

interface SectionCardProps {
  sec: any;
  si: number;
  selectedCat: TabMode;
  appData: Record<string, PanelData>;
  setAppData: React.Dispatch<React.SetStateAction<Record<string, PanelData>>>;
  itemUrgencies: Record<string, Urgency>;
  setItemUrgencies: React.Dispatch<React.SetStateAction<Record<string, Urgency>>>;
  itemDates: Record<string, string | null>;
  setItemDates: React.Dispatch<React.SetStateAction<Record<string, string | null>>>;
  
  isExpanded: boolean;
  onToggleExpand: () => void;
  moveSection: (si: number, dir: -1 | 1) => void;
  handleDeleteSec: (si: number) => void;
  
  isSecDragOver: boolean;
  isSecDragging: boolean;
  onSecDragStart: (e: React.DragEvent) => void;
  onSecDragOver: (e: React.DragEvent) => void;
  onSecDragLeave: (e: React.DragEvent) => void;
  onSecDrop: (e: React.DragEvent) => void;
  onSecDragEnd: () => void;

  expandedTasks: Record<string, boolean>;
  toggleTaskExpansion: (si: number, ii: number) => void;

  dragOverKey: string | null;
  draggingKey: string | null;
  handleItemDragStart: (e: React.DragEvent, si: number, ii: number) => void;
  handleItemDragOver: (e: React.DragEvent, si: number, ii: number) => void;
  handleItemDrop: (e: React.DragEvent, targetSi: number, targetIi: number) => void;
  cleanItemDrag: () => void;
  setDragOverKey: (key: string | null) => void;

  handleDropZoneDragOver: (e: React.DragEvent, si: number) => void;
  handleDropZoneDrop: (e: React.DragEvent, si: number) => void;
}

export const SectionCard = ({
  sec, si, selectedCat, appData, setAppData,
  itemUrgencies, setItemUrgencies, itemDates, setItemDates,
  isExpanded, onToggleExpand, moveSection, handleDeleteSec,
  isSecDragOver, isSecDragging, onSecDragStart, onSecDragOver, onSecDragLeave, onSecDrop, onSecDragEnd,
  expandedTasks, toggleTaskExpansion,
  dragOverKey, draggingKey, handleItemDragStart, handleItemDragOver, handleItemDrop, cleanItemDrag, setDragOverKey,
  handleDropZoneDragOver, handleDropZoneDrop
}: SectionCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editHasGoals, setEditHasGoals] = useState(false);
  const [editGoalText, setEditGoalText] = useState('');
  const [newTaskText, setNewTaskText] = useState('');
  const [dragEnabled, setDragEnabled] = useState(false);

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTitle(sec.title);
    setEditColor(sec.color || CORES_PREDEFINIDAS[0]);
    setEditHasGoals(sec.hasGoals || false);
    setEditGoalText(sec.goalText || '');
    setIsEditing(true);
  };

  const saveEdit = () => {
    if (editTitle.trim() || editColor) {
      setAppData(prev => {
        const s = [...prev[selectedCat].sections];
        s[si] = { ...s[si], title: editTitle || s[si].title, color: editColor, hasGoals: editHasGoals, goalText: editGoalText };
        return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: s } };
      });
    }
    setIsEditing(false);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setAppData(prev => {
      const s = [...prev[selectedCat].sections];
      s[si] = { ...s[si], items: [...s[si].items, { label: newTaskText, urgency: 'planejamento', info: '' }] };
      return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: s } };
    });
    toggleTaskExpansion(si, sec.items.length);
    setNewTaskText('');
  };

  const secColor = sec.color || '#FFFFFF';

  return (
    <div className={`${styles.secCard} ${isSecDragOver ? styles.secDragOver || '' : ''} ${isSecDragging ? styles.secBeingDragged || '' : ''}`} draggable={dragEnabled} onDragStart={onSecDragStart} onDragOver={onSecDragOver} onDragLeave={onSecDragLeave} onDrop={onSecDrop} onDragEnd={onSecDragEnd} style={{ borderLeft: `4px solid ${secColor}` }}>
      <div className={`${styles.secHeader} ${isExpanded ? styles.secHeaderOpen : ''}`}>
        {isEditing ? (
          <div className={styles.editRow} onClick={e => e.stopPropagation()} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px', padding: '8px 0', width: '100%' }}>
            <input autoFocus className={styles.editInput} value={editTitle} onChange={e => setEditTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveEdit()} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>{CORES_PREDEFINIDAS.map(cor => (<button key={cor} type="button" onClick={() => setEditColor(cor)} style={{ backgroundColor: cor, width: '24px', height: '24px', borderRadius: '50%', border: editColor === cor ? '2px solid #534AB7' : '2px solid #333', cursor: 'pointer' }} />))}</div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem' }}><input type="checkbox" checked={editHasGoals} onChange={(e) => setEditHasGoals(e.target.checked)} />Habilitar Metas</label>
                <button onClick={saveEdit} style={{ padding: '6px 12px', background: '#534AB7', color: '#FFF', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginLeft: 'auto' }}>Salvar</button>
              </div>
              {editHasGoals && (<input type="text" className={styles.editInput} placeholder="Escreva qual é a meta..." value={editGoalText} onChange={e => setEditGoalText(e.target.value)} style={{ width: '100%', fontSize: '0.9rem', borderLeft: `3px solid ${editColor !== '#FFFFFF' ? editColor : '#534AB7'}` }} />)}
            </div>
          </div>
        ) : (
          <div className={styles.secTitleWrap} onClick={onToggleExpand}><span className={styles.secDragHandle} title="Arrastar seção" onMouseEnter={() => setDragEnabled(true)} onMouseLeave={() => setDragEnabled(false)} onTouchStart={() => setDragEnabled(true)} onTouchEnd={() => setDragEnabled(false)}>⠿</span><span className={styles.secTitle} style={{ color: secColor }}>{sec.title} {sec.hasGoals && '🎯'}</span><span className={styles.secBadge}>{sec.items.length} itens</span></div>
        )}
        <div className={styles.actionGroup}><button className={styles.iconBtn} title="Mover para cima" onClick={e => { e.stopPropagation(); moveSection(si, -1); }}><IconUp /></button><button className={styles.iconBtn} title="Mover para baixo" onClick={e => { e.stopPropagation(); moveSection(si, 1); }}><IconDown /></button><button className={styles.iconBtn} onClick={startEditing} title="Editar"><IconEdit /></button><button className={`${styles.iconBtn} ${styles.iconDanger}`} onClick={e => { e.stopPropagation(); handleDeleteSec(si); }} title="Excluir"><IconTrash /></button><div className={styles.chevron} onClick={onToggleExpand}>{isExpanded ? '▲' : '▼'}</div></div>
      </div>
      {isExpanded && (
        <div className={styles.secBody}>
          {sec.items.map((item: any, ii: number) => (<TaskItem key={ii} item={item} si={si} ii={ii} selectedCat={selectedCat} appData={appData} setAppData={setAppData} itemUrgencies={itemUrgencies} setItemUrgencies={setItemUrgencies} itemDates={itemDates} setItemDates={setItemDates} isExpanded={!!expandedTasks[`${si}_${ii}`]} onToggleExpand={() => toggleTaskExpansion(si, ii)} isDragOver={dragOverKey === `${si}_${ii}`} isBeingDragged={draggingKey === `${si}_${ii}`} onDragStart={e => handleItemDragStart(e, si, ii)} onDragOver={e => handleItemDragOver(e, si, ii)} onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverKey(null); }} onDrop={e => handleItemDrop(e, si, ii)} onDragEnd={cleanItemDrag} />))}
          <div className={`${styles.dropZone} ${dragOverKey === `${si}_dropzone` ? styles.dropZoneActive : ''}`} onDragOver={e => handleDropZoneDragOver(e, si)} onDragLeave={() => { if (dragOverKey === `${si}_dropzone`) setDragOverKey(null); }} onDrop={e => handleDropZoneDrop(e, si)}>{dragOverKey === `${si}_dropzone` ? 'Soltar aqui para mover para o final' : ''}</div>
          <form className={styles.addFormTask} onSubmit={handleAddItem}><input type="text" className={styles.inputTask} placeholder="+ Adicionar nova tarefa principal..." value={newTaskText} onChange={e => setNewTaskText(e.target.value)} /><button type="submit" className={styles.submitBtnTask} disabled={!newTaskText.trim()}>Adicionar</button></form>
        </div>
      )}
    </div>
  );
};