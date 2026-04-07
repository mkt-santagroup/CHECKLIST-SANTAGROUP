import { useState, useRef } from 'react';
import { PanelData, TabMode, Urgency } from '../../types';
import { URGENCY_META } from '../../constants/data';
import styles from './Settings.module.css';

interface SettingsProps {
  appData: Record<string, PanelData>;
  setAppData: React.Dispatch<React.SetStateAction<Record<string, PanelData>>>;
  itemUrgencies: Record<string, Urgency>;
  setItemUrgencies: React.Dispatch<React.SetStateAction<Record<string, Urgency>>>;
  itemDates: Record<string, string | null>;
  setItemDates: React.Dispatch<React.SetStateAction<Record<string, string | null>>>;
}

// 5 CORES: Branco como padrão!
const CORES_PREDEFINIDAS = ['#FFFFFF', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B']; 

const generateId = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36);

export const Settings = ({
  appData, setAppData, itemUrgencies, setItemUrgencies, itemDates, setItemDates
}: SettingsProps) => {
  const [selectedCat, setSelectedCat] = useState<TabMode>('back');
  const [expandedSec, setExpandedSec] = useState<number | null>(null);
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

  // Opções da Nova Categoria
  const [newSubcatTitle, setNewSubcatTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState(CORES_PREDEFINIDAS[0]);
  const [hasGoals, setHasGoals] = useState(false);
  const [goalText, setGoalText] = useState('');

  // Opções de Edição da Categoria
  const [editColor, setEditColor] = useState(CORES_PREDEFINIDAS[0]);
  const [editHasGoals, setEditHasGoals] = useState(false);
  const [editGoalText, setEditGoalText] = useState('');

  // D&D de ITENS
  const dragItem = useRef<{ si: number; ii: number } | null>(null);
  const dragOverItem = useRef<{ si: number; ii: number } | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const [draggingKey, setDraggingKey] = useState<string | null>(null);

  // D&D de SEÇÕES
  const dragSec = useRef<number | null>(null);
  const dragOverSec = useRef<number | null>(null);
  const [dragOverSecIdx, setDragOverSecIdx] = useState<number | null>(null);
  const [draggingSecIdx, setDraggingSecIdx] = useState<number | null>(null);

  const [openUrgencyKey, setOpenUrgencyKey] = useState<string | null>(null);

  const [newItemText, setNewItemText] = useState<Record<number, string>>({});
  const [newSubtaskText, setNewSubtaskText] = useState<Record<string, string>>({});
  const [editingSec, setEditingSec] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<{ si: number; ii: number } | null>(null);
  const [editingSubtask, setEditingSubtask] = useState<{ si: number; ii: number; subI: number } | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAddSubcat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubcatTitle.trim() || selectedCat === 'roadmap') return;
    setAppData(prev => ({
      ...prev,
      [selectedCat]: { 
        ...prev[selectedCat], 
        sections: [{ 
          id: generateId(),
          title: newSubcatTitle, 
          color: selectedColor,
          hasGoals: hasGoals,
          goalText: goalText,
          items: [] 
        }, ...prev[selectedCat].sections] 
      }
    }));
    setNewSubcatTitle('');
    setHasGoals(false);
    setGoalText('');
    setSelectedColor(CORES_PREDEFINIDAS[0]);
  };

  const handleDeleteSec = (si: number) => {
    if (!confirm('Tem certeza que deseja excluir esta seção inteira?')) return;
    setAppData(prev => ({
      ...prev,
      [selectedCat]: { ...prev[selectedCat], sections: prev[selectedCat].sections.filter((_, i) => i !== si) }
    }));
    if (expandedSec === si) setExpandedSec(null);
  };

  const saveEditSec = (si: number) => {
    if (editValue.trim() || editColor) {
      setAppData(prev => {
        const s = [...prev[selectedCat].sections];
        s[si] = { ...s[si], title: editValue || s[si].title, color: editColor, hasGoals: editHasGoals, goalText: editGoalText };
        return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: s } };
      });
    }
    setEditingSec(null);
  };

  const moveSection = (si: number, dir: -1 | 1) => {
    const target = si + dir;
    const sections = appData[selectedCat].sections;
    if (target < 0 || target >= sections.length) return;
    setAppData(prev => {
      const s = [...prev[selectedCat].sections];
      [s[si], s[target]] = [s[target], s[si]];
      return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: s } };
    });
    setExpandedSec(target);
  };

  const handleSecDragStart = (e: React.DragEvent, si: number) => {
    dragSec.current = si;
    setDraggingSecIdx(si);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleSecDragOver = (e: React.DragEvent, si: number) => {
    e.preventDefault();
    if (dragSec.current !== null && dragSec.current !== si) {
      dragOverSec.current = si;
      setDragOverSecIdx(si);
    }
  };
  const handleSecDrop = (e: React.DragEvent, targetSi: number) => {
    e.preventDefault();
    const from = dragSec.current;
    if (from === null || from === targetSi) { cleanSecDrag(); return; }
    setAppData(prev => {
      const s = [...prev[selectedCat].sections];
      const [moved] = s.splice(from, 1);
      s.splice(targetSi, 0, moved);
      return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: s } };
    });
    setExpandedSec(targetSi);
    cleanSecDrag();
  };
  const cleanSecDrag = () => {
    dragSec.current = null;
    dragOverSec.current = null;
    setDraggingSecIdx(null);
    setDragOverSecIdx(null);
  };

  const handleAddItem = (e: React.FormEvent, si: number) => {
    e.preventDefault();
    if (!newItemText[si]?.trim()) return;
    setAppData(prev => {
      const s = [...prev[selectedCat].sections];
      s[si] = { ...s[si], items: [...s[si].items, { label: newItemText[si], urgency: 'planejamento', info: '' }] };
      return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: s } };
    });
    setExpandedTasks(prev => ({ ...prev, [`${si}_${appData[selectedCat].sections[si].items.length}`]: true }));
    setNewItemText({ ...newItemText, [si]: '' });
  };

  const handleDeleteItem = (si: number, ii: number) => {
    setAppData(prev => {
      const s = [...prev[selectedCat].sections];
      s[si] = { ...s[si], items: s[si].items.filter((_, i) => i !== ii) };
      return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: s } };
    });
  };

  const saveEditItem = (si: number, ii: number) => {
    if (editValue.trim()) {
      setAppData(prev => {
        const s = [...prev[selectedCat].sections];
        const items = [...s[si].items];
        items[ii] = { ...items[ii], label: editValue };
        s[si] = { ...s[si], items };
        return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: s } };
      });
    }
    setEditingItem(null);
  };

  const handleItemDragStart = (e: React.DragEvent, si: number, ii: number) => {
    dragItem.current = { si, ii };
    setDraggingKey(`${si}_${ii}`);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${si}_${ii}`);
  };

  const handleItemDragOver = (e: React.DragEvent, si: number, ii: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragItem.current) return;
    if (dragItem.current.si !== si) return; 
    const key = `${si}_${ii}`;
    if (dragOverKey !== key) {
      dragOverItem.current = { si, ii };
      setDragOverKey(key);
    }
  };

  const handleItemDrop = (e: React.DragEvent, targetSi: number, targetIi: number) => {
    e.preventDefault();
    e.stopPropagation();
    const from = dragItem.current;
    if (!from || from.si !== targetSi || from.ii === targetIi) { cleanItemDrag(); return; }

    setAppData(prev => {
      const s = [...prev[selectedCat].sections];
      const items = [...s[targetSi].items];
      const [moved] = items.splice(from.ii, 1);
      items.splice(targetIi, 0, moved);
      s[targetSi] = { ...s[targetSi], items };
      return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: s } };
    });
    cleanItemDrag();
  };

  const cleanItemDrag = () => {
    dragItem.current = null;
    dragOverItem.current = null;
    setDraggingKey(null);
    setDragOverKey(null);
  };

  const handleDropZoneDragOver = (e: React.DragEvent, si: number) => {
    e.preventDefault();
    if (!dragItem.current || dragItem.current.si !== si) return;
    const lastIdx = appData[selectedCat].sections[si].items.length - 1;
    setDragOverKey(`${si}_dropzone`);
    dragOverItem.current = { si, ii: lastIdx + 1 };
  };

  const handleDropZoneDrop = (e: React.DragEvent, si: number) => {
    e.preventDefault();
    const from = dragItem.current;
    if (!from || from.si !== si) { cleanItemDrag(); return; }
    const lastIdx = appData[selectedCat].sections[si].items.length;
    if (from.ii === lastIdx - 1) { cleanItemDrag(); return; } 

    setAppData(prev => {
      const s = [...prev[selectedCat].sections];
      const items = [...s[si].items];
      const [moved] = items.splice(from.ii, 1);
      items.push(moved);
      s[si] = { ...s[si], items };
      return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: s } };
    });
    cleanItemDrag();
  };

  const handleAddSubtask = (e: React.FormEvent, si: number, ii: number) => {
    e.preventDefault();
    const key = `${si}_${ii}`;
    if (!newSubtaskText[key]?.trim()) return;
    setAppData(prev => {
      const s = [...prev[selectedCat].sections];
      const items = [...s[si].items];
      items[ii] = { ...items[ii], subtasks: [...(items[ii].subtasks || []), { label: newSubtaskText[key] }] };
      s[si] = { ...s[si], items };
      return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: s } };
    });
    setNewSubtaskText({ ...newSubtaskText, [key]: '' });
  };

  const handleDeleteSubtask = (si: number, ii: number, subI: number) => {
    setAppData(prev => {
      const s = [...prev[selectedCat].sections];
      const items = [...s[si].items];
      items[ii] = { ...items[ii], subtasks: items[ii].subtasks?.filter((_, i) => i !== subI) };
      s[si] = { ...s[si], items };
      return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: s } };
    });
  };

  const saveEditSubtask = (si: number, ii: number, subI: number) => {
    if (editValue.trim()) {
      setAppData(prev => {
        const s = [...prev[selectedCat].sections];
        const items = [...s[si].items];
        const subs = [...(items[ii].subtasks || [])];
        subs[subI] = { ...subs[subI], label: editValue };
        items[ii] = { ...items[ii], subtasks: subs };
        s[si] = { ...s[si], items };
        return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: s } };
      });
    }
    setEditingSubtask(null);
  };

  const toggleTaskExpansion = (si: number, ii: number) => {
    const key = `${si}_${ii}`;
    setExpandedTasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const IconEdit = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  const IconTrash = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  const IconGrip = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></svg>;
  const IconUp = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  const IconDown = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>;

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Gerenciar Checklists</h2>
        <p className={styles.pageSubtitle}>Personalize categorias, escolha cores de destaque, defina metas e organize suas tarefas.</p>
      </div>

      <div className={styles.catSelector}>
        {(['back', 'front', 'entregaveis'] as TabMode[]).map(cat => (
          <button key={cat} className={`${styles.catBtn} ${selectedCat === cat ? styles.active : ''}`}
            onClick={() => { setSelectedCat(cat); setExpandedSec(null); }}>
            {cat === 'back' ? 'Backstage' : cat === 'front' ? 'Frontline' : 'Entregáveis'}
          </button>
        ))}
      </div>

      <div className={styles.layoutGrid} style={{ gridTemplateColumns: '1fr' }}>

        <div className={styles.colMain}>
          <form className={styles.addFormBase} onSubmit={handleAddSubcat} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ display: 'flex', width: '100%', gap: '12px' }}>
              <input type="text" className={styles.inputMain} placeholder="Nome da nova categoria/seção..."
                value={newSubcatTitle} onChange={e => setNewSubcatTitle(e.target.value)} style={{ flex: 1 }} />
              <button type="submit" className={styles.submitBtnMain} disabled={!newSubcatTitle.trim()}>+ Nova Categoria</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#A1A1AA' }}>Cor:</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {CORES_PREDEFINIDAS.map(cor => (
                      <button key={cor} type="button" onClick={() => setSelectedColor(cor)}
                        style={{ backgroundColor: cor, width: '28px', height: '28px', borderRadius: '50%', border: selectedColor === cor ? '2px solid #534AB7' : '2px solid #333', cursor: 'pointer' }} />
                    ))}
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#E4E4E7' }}>
                  <input type="checkbox" checked={hasGoals} onChange={(e) => setHasGoals(e.target.checked)} style={{ accentColor: selectedColor !== '#FFFFFF' ? selectedColor : '#534AB7', width: '18px', height: '18px' }} />
                  <strong>Habilitar Metas para esta Categoria</strong>
                </label>
              </div>

              {/* DESCE AQUI O CAMPO PARA ESCREVER A META SE ESTIVER MARCADO */}
              {hasGoals && (
                <div style={{ marginTop: '8px' }}>
                  <input 
                    type="text" 
                    className={styles.inputMain} 
                    placeholder="Escreva qual é a meta desta categoria..." 
                    value={goalText} 
                    onChange={e => setGoalText(e.target.value)} 
                    style={{ width: '100%', fontSize: '0.9rem', borderLeft: `3px solid ${selectedColor !== '#FFFFFF' ? selectedColor : '#534AB7'}` }} 
                  />
                </div>
              )}
            </div>
          </form>

          <div className={styles.accordionList}>
            {appData[selectedCat].sections.map((sec, si) => {
              const isSecDragOver = dragOverSecIdx === si;
              const isSecDragging = draggingSecIdx === si;
              const secColor = sec.color || '#FFFFFF';

              return (
                <div key={si}
                  className={`${styles.secCard} ${isSecDragOver ? styles.secDragOver : ''} ${isSecDragging ? styles.secBeingDragged : ''}`}
                  draggable
                  onDragStart={e => handleSecDragStart(e, si)}
                  onDragOver={e => handleSecDragOver(e, si)}
                  onDragLeave={() => setDragOverSecIdx(null)}
                  onDrop={e => handleSecDrop(e, si)}
                  onDragEnd={cleanSecDrag}
                  style={{ borderLeft: `4px solid ${secColor}` }}
                >
                  <div className={`${styles.secHeader} ${expandedSec === si ? styles.secHeaderOpen : ''}`}>
                    {editingSec === si ? (
                      <div className={styles.editRow} onClick={e => e.stopPropagation()} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px', padding: '8px 0', width: '100%' }}>
                        <input autoFocus className={styles.editInput} value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && saveEditSec(si)} />
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {CORES_PREDEFINIDAS.map(cor => (
                                <button key={cor} type="button" onClick={() => setEditColor(cor)}
                                  style={{ backgroundColor: cor, width: '24px', height: '24px', borderRadius: '50%', border: editColor === cor ? '2px solid #534AB7' : '2px solid #333', cursor: 'pointer' }} />
                              ))}
                            </div>
                            
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                              <input type="checkbox" checked={editHasGoals} onChange={(e) => setEditHasGoals(e.target.checked)} />
                              Habilitar Metas
                            </label>
                            
                            <button onClick={() => saveEditSec(si)} style={{ padding: '6px 12px', background: '#534AB7', color: '#FFF', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginLeft: 'auto' }}>Salvar</button>
                          </div>
                          
                          {/* CAMPO DE EDIÇÃO DA META */}
                          {editHasGoals && (
                            <input 
                              type="text" 
                              className={styles.editInput} 
                              placeholder="Escreva qual é a meta..." 
                              value={editGoalText} 
                              onChange={e => setEditGoalText(e.target.value)} 
                              style={{ width: '100%', fontSize: '0.9rem', borderLeft: `3px solid ${editColor !== '#FFFFFF' ? editColor : '#534AB7'}` }} 
                            />
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className={styles.secTitleWrap} onClick={() => setExpandedSec(expandedSec === si ? null : si)}>
                        <span className={styles.secDragHandle} title="Arrastar seção">⠿</span>
                        <span className={styles.secTitle} style={{ color: secColor }}>{sec.title} {sec.hasGoals && '🎯'}</span>
                        <span className={styles.secBadge}>{sec.items.length} itens</span>
                      </div>
                    )}
                    <div className={styles.actionGroup}>
                      <button className={styles.iconBtn} title="Mover para cima" onClick={e => { e.stopPropagation(); moveSection(si, -1); }}><IconUp /></button>
                      <button className={styles.iconBtn} title="Mover para baixo" onClick={e => { e.stopPropagation(); moveSection(si, 1); }}><IconDown /></button>
                      <button className={styles.iconBtn} onClick={e => { e.stopPropagation(); setEditValue(sec.title); setEditColor(sec.color || CORES_PREDEFINIDAS[0]); setEditHasGoals(sec.hasGoals || false); setEditGoalText(sec.goalText || ''); setEditingSec(si); }} title="Editar"><IconEdit /></button>
                      <button className={`${styles.iconBtn} ${styles.iconDanger}`} onClick={e => { e.stopPropagation(); handleDeleteSec(si); }} title="Excluir"><IconTrash /></button>
                      <div className={styles.chevron} onClick={() => setExpandedSec(expandedSec === si ? null : si)}>{expandedSec === si ? '▲' : '▼'}</div>
                    </div>
                  </div>

                  {expandedSec === si && (
                    <div className={styles.secBody}>
                      {sec.items.map((item, ii) => {
                        const itemKey = `${selectedCat}_${si}_${ii}`;
                        const currentUrgency = itemUrgencies[itemKey] || item.urgency;
                        const currentDate = itemDates[itemKey] || '';
                        const meta = URGENCY_META[currentUrgency];
                        const isTaskExpanded = expandedTasks[`${si}_${ii}`];
                        const isDragOver = dragOverKey === `${si}_${ii}`;
                        const isBeingDragged = draggingKey === `${si}_${ii}`;

                        return (
                          <div key={ii}
                            className={`${styles.itemBox} ${isDragOver ? styles.dragOverActive : ''} ${isBeingDragged ? styles.beingDragged : ''}`}
                            draggable
                            onDragStart={e => handleItemDragStart(e, si, ii)}
                            onDragOver={e => handleItemDragOver(e, si, ii)}
                            onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverKey(null); }}
                            onDrop={e => handleItemDrop(e, si, ii)}
                            onDragEnd={cleanItemDrag}
                          >
                            <div className={styles.itemRow}>
                              <div className={styles.dragHandle} title="Arrastar para reordenar"><IconGrip /></div>
                              {editingItem?.si === si && editingItem?.ii === ii ? (
                                <div className={styles.editRow} onClick={e => e.stopPropagation()}>
                                  <input autoFocus className={styles.editInput} value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && saveEditItem(si, ii)}
                                    onBlur={() => saveEditItem(si, ii)} />
                                </div>
                              ) : (
                                <div className={styles.itemLabel} onClick={() => toggleTaskExpansion(si, ii)}>
                                  📝 {item.label}
                                </div>
                              )}
                              <div className={styles.actionGroupTask}>
                                <button className={styles.iconBtnSmall} onClick={() => { setEditValue(item.label); setEditingItem({ si, ii }); }}><IconEdit /></button>
                                <button className={`${styles.iconBtnSmall} ${styles.iconDanger}`} onClick={() => handleDeleteItem(si, ii)}><IconTrash /></button>
                                <div className={styles.taskChevron} onClick={() => toggleTaskExpansion(si, ii)}>{isTaskExpanded ? '▲' : '▼'}</div>
                              </div>
                            </div>

                            {isTaskExpanded && (
                              <div className={styles.taskExpandedBody}>
                                <div className={styles.itemConfigRow}>
                                  <div className={styles.pillWrap}>
                                    <button className={`${styles.urgPill} ${styles[meta.cls]}`} onClick={() => setOpenUrgencyKey(openUrgencyKey === itemKey ? null : itemKey)}>
                                      <span className={styles.urgDot} style={{ background: meta.dot }} />{meta.text} ▾
                                    </button>
                                    {openUrgencyKey === itemKey && (
                                      <div className={styles.urgDropdown}>
                                        {(Object.keys(URGENCY_META) as Urgency[]).map(u => (
                                          <div key={u} className={`${styles.urgOpt} ${currentUrgency === u ? styles.selected : ''}`}
                                            onClick={() => { setItemUrgencies({ ...itemUrgencies, [itemKey]: u }); setOpenUrgencyKey(null); }}>
                                            <span className={styles.urgDot} style={{ background: URGENCY_META[u].dot }} />
                                            <span style={{ color: URGENCY_META[u].dot }}>{URGENCY_META[u].text}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <div className={styles.datePickerWrap}>
                                    <span className={styles.dateIcon}>📅</span>
                                    <input type="date" className={styles.dateInput} value={currentDate} onChange={e => setItemDates({ ...itemDates, [itemKey]: e.target.value || null })} />
                                    {currentDate && <button className={styles.clearDateBtn} onClick={() => setItemDates({ ...itemDates, [itemKey]: null })}>✕</button>}
                                  </div>
                                </div>

                                <textarea className={styles.infoTextarea} placeholder="Adicionar descrição ou informações adicionais da tarefa..." value={item.info || ''}
                                  onChange={e => {
                                    setAppData(prev => {
                                      const s = [...prev[selectedCat].sections];
                                      const items = [...s[si].items];
                                      items[ii] = { ...items[ii], info: e.target.value };
                                      s[si] = { ...s[si], items };
                                      return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: s } };
                                    });
                                  }}
                                />

                                <div className={styles.subtasksWrap}>
                                  {item.subtasks?.map((sub, subI) => (
                                    <div key={subI} className={styles.subtaskRow}>
                                      <span className={styles.subtaskTree}>└</span>
                                      {editingSubtask?.si === si && editingSubtask?.ii === ii && editingSubtask?.subI === subI ? (
                                        <input autoFocus className={styles.editInputSmall} value={editValue}
                                          onChange={e => setEditValue(e.target.value)}
                                          onKeyDown={e => e.key === 'Enter' && saveEditSubtask(si, ii, subI)}
                                          onBlur={() => saveEditSubtask(si, ii, subI)} />
                                      ) : (
                                        <span className={styles.subtaskLabel}>{sub.label}</span>
                                      )}
                                      <div className={styles.actionGroupSub}>
                                        <button className={styles.iconBtnSub} onClick={() => { setEditValue(sub.label); setEditingSubtask({ si, ii, subI }); }}><IconEdit /></button>
                                        <button className={`${styles.iconBtnSub} ${styles.iconDanger}`} onClick={() => handleDeleteSubtask(si, ii, subI)}><IconTrash /></button>
                                      </div>
                                    </div>
                                  ))}
                                  <form className={styles.miniForm} onSubmit={e => handleAddSubtask(e, si, ii)}>
                                    <span className={styles.subtaskTree}>└</span>
                                    <input type="text" placeholder="Adicionar subtarefa e apertar Enter..." value={newSubtaskText[`${si}_${ii}`] || ''} onChange={e => setNewSubtaskText({ ...newSubtaskText, [`${si}_${ii}`]: e.target.value })} />
                                  </form>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      <div className={`${styles.dropZone} ${dragOverKey === `${si}_dropzone` ? styles.dropZoneActive : ''}`} onDragOver={e => handleDropZoneDragOver(e, si)} onDragLeave={() => { if (dragOverKey === `${si}_dropzone`) setDragOverKey(null); }} onDrop={e => handleDropZoneDrop(e, si)}>
                        {dragOverKey === `${si}_dropzone` ? 'Soltar aqui para mover para o final' : ''}
                      </div>

                      <form className={styles.addFormTask} onSubmit={e => handleAddItem(e, si)}>
                        <input type="text" className={styles.inputTask} placeholder="+ Adicionar nova tarefa principal..." value={newItemText[si] || ''} onChange={e => setNewItemText({ ...newItemText, [si]: e.target.value })} />
                        <button type="submit" className={styles.submitBtnTask} disabled={!newItemText[si]?.trim()}>Adicionar</button>
                      </form>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};