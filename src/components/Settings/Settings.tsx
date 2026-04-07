import { useState, useRef } from 'react';
import { PanelData, TabMode, Urgency, Milestone } from '../../types';
import { URGENCY_META } from '../../constants/data';
import styles from './Settings.module.css';

interface SettingsProps {
  appData: Record<string, PanelData>;
  setAppData: React.Dispatch<React.SetStateAction<Record<string, PanelData>>>;
  milestones: Milestone[];
  setMilestones: React.Dispatch<React.SetStateAction<Milestone[]>>;
  itemUrgencies: Record<string, Urgency>;
  setItemUrgencies: React.Dispatch<React.SetStateAction<Record<string, Urgency>>>;
  itemDates: Record<string, string | null>;
  setItemDates: React.Dispatch<React.SetStateAction<Record<string, string | null>>>;
}

export const Settings = ({
  appData, setAppData, milestones, setMilestones, itemUrgencies, setItemUrgencies, itemDates, setItemDates
}: SettingsProps) => {
  const [selectedCat, setSelectedCat] = useState<TabMode>('back');
  const [expandedSec, setExpandedSec] = useState<number | null>(null);
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

  // D&D de ITENS dentro de uma seção
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

  const [newSubcatTitle, setNewSubcatTitle] = useState('');
  const [newItemText, setNewItemText] = useState<Record<number, string>>({});
  const [newSubtaskText, setNewSubtaskText] = useState<Record<string, string>>({});
  const [editingSec, setEditingSec] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<{ si: number; ii: number } | null>(null);
  const [editingSubtask, setEditingSubtask] = useState<{ si: number; ii: number; subI: number } | null>(null);
  const [editValue, setEditValue] = useState('');

  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(null);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newPostText, setNewPostText] = useState<Record<number, string>>({});
  const [editingMilestone, setEditingMilestone] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<{ mi: number; pi: number } | null>(null);

  // ========================= SEÇÕES ========================= //
  const handleAddSubcat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubcatTitle.trim() || selectedCat === 'roadmap') return;
    setAppData(prev => ({
      ...prev,
      [selectedCat]: { ...prev[selectedCat], sections: [{ title: newSubcatTitle, items: [] }, ...prev[selectedCat].sections] }
    }));
    setNewSubcatTitle('');
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
    if (editValue.trim()) {
      setAppData(prev => {
        const s = [...prev[selectedCat].sections];
        s[si] = { ...s[si], title: editValue };
        return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: s } };
      });
    }
    setEditingSec(null);
  };

  // Mover seção para cima/baixo com setas
  const moveSection = (si: number, dir: -1 | 1) => {
    const target = si + dir;
    const sections = appData[selectedCat].sections;
    if (target < 0 || target >= sections.length) return;
    // Não deixar pular por cima de seção isTrail
    if (sections[target]?.isTrail) return;
    setAppData(prev => {
      const s = [...prev[selectedCat].sections];
      [s[si], s[target]] = [s[target], s[si]];
      return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: s } };
    });
    setExpandedSec(target);
  };

  // D&D de seções
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
    const sections = appData[selectedCat].sections;
    if (sections[targetSi]?.isTrail || sections[from]?.isTrail) { cleanSecDrag(); return; }
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

  // ========================= ITENS ========================= //
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

  // D&D de itens — reescrito com abordagem mais robusta
  const handleItemDragStart = (e: React.DragEvent, si: number, ii: number) => {
    dragItem.current = { si, ii };
    setDraggingKey(`${si}_${ii}`);
    e.dataTransfer.effectAllowed = 'move';
    // Necessário para o drag funcionar em alguns browsers
    e.dataTransfer.setData('text/plain', `${si}_${ii}`);
  };

  const handleItemDragOver = (e: React.DragEvent, si: number, ii: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragItem.current) return;
    if (dragItem.current.si !== si) return; // só na mesma seção
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

  // Drop zone invisível no final da lista para permitir mover para o último slot
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
    if (from.ii === lastIdx - 1) { cleanItemDrag(); return; } // já é o último

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

  // ========================= SUBTAREFAS ========================= //
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

  // ========================= MILESTONES ========================= //
  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    setMilestones(prev => [...prev, { title: newMilestoneTitle, meta: null, unlocks: null, posts: [] }]);
    setNewMilestoneTitle('');
  };

  const handleDeleteMilestone = (mi: number) => {
    if (!confirm('Excluir esta meta da trilha?')) return;
    setMilestones(prev => prev.filter((_, i) => i !== mi));
  };

  const handleAddPost = (e: React.FormEvent, mi: number) => {
    e.preventDefault();
    if (!newPostText[mi]?.trim()) return;
    setMilestones(prev => {
      const copy = [...prev];
      copy[mi] = { ...copy[mi], posts: [...copy[mi].posts, newPostText[mi]] };
      return copy;
    });
    setNewPostText({ ...newPostText, [mi]: '' });
  };

  const handleDeletePost = (mi: number, pi: number) => {
    setMilestones(prev => {
      const copy = [...prev];
      copy[mi] = { ...copy[mi], posts: copy[mi].posts.filter((_, i) => i !== pi) };
      return copy;
    });
  };

  const saveEditMilestone = (mi: number) => {
    if (editValue.trim()) {
      setMilestones(prev => {
        const copy = [...prev];
        copy[mi] = { ...copy[mi], title: editValue };
        return copy;
      });
    }
    setEditingMilestone(null);
  };

  const saveEditPost = (mi: number, pi: number) => {
    if (editValue.trim()) {
      setMilestones(prev => {
        const copy = [...prev];
        copy[mi] = { ...copy[mi], posts: copy[mi].posts.map((p, i) => (i === pi ? editValue : p)) };
        return copy;
      });
    }
    setEditingPost(null);
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

  const isFrontline = selectedCat === 'front';

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Gerenciar Checklists</h2>
        <p className={styles.pageSubtitle}>Personalize categorias, adicione descrições, arraste tarefas para reordenar, ajuste prazos e níveis de urgência.</p>
      </div>

      <div className={styles.catSelector}>
        {(['back', 'front', 'entregaveis'] as TabMode[]).map(cat => (
          <button key={cat} className={`${styles.catBtn} ${selectedCat === cat ? styles.active : ''}`}
            onClick={() => { setSelectedCat(cat); setExpandedSec(null); }}>
            {cat === 'back' ? 'Backstage' : cat === 'front' ? 'Frontline' : 'Entregáveis'}
          </button>
        ))}
      </div>

      <div className={`${styles.layoutGrid} ${isFrontline ? styles.twoColumns : ''}`}>

        {/* COLUNA 1: CHECKLISTS */}
        <div className={styles.colMain}>
          <form className={styles.addFormBase} onSubmit={handleAddSubcat}>
            <input type="text" className={styles.inputMain} placeholder="Nome da nova categoria/seção..."
              value={newSubcatTitle} onChange={e => setNewSubcatTitle(e.target.value)} />
            <button type="submit" className={styles.submitBtnMain} disabled={!newSubcatTitle.trim()}>+ Nova Categoria</button>
          </form>

          <div className={styles.accordionList}>
            {appData[selectedCat].sections.map((sec, si) => {
              if (sec.isTrail) return null;
              const isSecDragOver = dragOverSecIdx === si;
              const isSecDragging = draggingSecIdx === si;

              return (
                <div key={si}
                  className={`${styles.secCard} ${isSecDragOver ? styles.secDragOver : ''} ${isSecDragging ? styles.secBeingDragged : ''}`}
                  draggable
                  onDragStart={e => handleSecDragStart(e, si)}
                  onDragOver={e => handleSecDragOver(e, si)}
                  onDragLeave={() => setDragOverSecIdx(null)}
                  onDrop={e => handleSecDrop(e, si)}
                  onDragEnd={cleanSecDrag}
                >
                  <div className={`${styles.secHeader} ${expandedSec === si ? styles.secHeaderOpen : ''}`}>
                    {editingSec === si ? (
                      <div className={styles.editRow} onClick={e => e.stopPropagation()}>
                        <input autoFocus className={styles.editInput} value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && saveEditSec(si)}
                          onBlur={() => saveEditSec(si)} />
                      </div>
                    ) : (
                      <div className={styles.secTitleWrap} onClick={() => setExpandedSec(expandedSec === si ? null : si)}>
                        <span className={styles.secDragHandle} title="Arrastar seção">⠿</span>
                        <span className={styles.secTitle}>{sec.title}</span>
                        <span className={styles.secBadge}>{sec.items.length} itens</span>
                      </div>
                    )}
                    <div className={styles.actionGroup}>
                      {/* Setas para mover seção */}
                      <button className={styles.iconBtn} title="Mover para cima"
                        onClick={e => { e.stopPropagation(); moveSection(si, -1); }}>
                        <IconUp />
                      </button>
                      <button className={styles.iconBtn} title="Mover para baixo"
                        onClick={e => { e.stopPropagation(); moveSection(si, 1); }}>
                        <IconDown />
                      </button>
                      <button className={styles.iconBtn}
                        onClick={e => { e.stopPropagation(); setEditValue(sec.title); setEditingSec(si); }}
                        title="Editar"><IconEdit /></button>
                      <button className={`${styles.iconBtn} ${styles.iconDanger}`}
                        onClick={e => { e.stopPropagation(); handleDeleteSec(si); }}
                        title="Excluir"><IconTrash /></button>
                      <div className={styles.chevron}
                        onClick={() => setExpandedSec(expandedSec === si ? null : si)}>
                        {expandedSec === si ? '▲' : '▼'}
                      </div>
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
                            onDragLeave={e => {
                              // Só limpa se saiu do elemento mesmo (não de um filho)
                              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                                setDragOverKey(null);
                              }
                            }}
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
                                <button className={styles.iconBtnSmall}
                                  onClick={() => { setEditValue(item.label); setEditingItem({ si, ii }); }}>
                                  <IconEdit />
                                </button>
                                <button className={`${styles.iconBtnSmall} ${styles.iconDanger}`}
                                  onClick={() => handleDeleteItem(si, ii)}>
                                  <IconTrash />
                                </button>
                                <div className={styles.taskChevron} onClick={() => toggleTaskExpansion(si, ii)}>
                                  {isTaskExpanded ? '▲' : '▼'}
                                </div>
                              </div>
                            </div>

                            {isTaskExpanded && (
                              <div className={styles.taskExpandedBody}>
                                <div className={styles.itemConfigRow}>
                                  <div className={styles.pillWrap}>
                                    <button className={`${styles.urgPill} ${styles[meta.cls]}`}
                                      onClick={() => setOpenUrgencyKey(openUrgencyKey === itemKey ? null : itemKey)}>
                                      <span className={styles.urgDot} style={{ background: meta.dot }} />
                                      {meta.text} ▾
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
                                    <input type="date" className={styles.dateInput} value={currentDate}
                                      onChange={e => setItemDates({ ...itemDates, [itemKey]: e.target.value || null })} />
                                    {currentDate && (
                                      <button className={styles.clearDateBtn}
                                        onClick={() => setItemDates({ ...itemDates, [itemKey]: null })}>✕</button>
                                    )}
                                  </div>
                                </div>

                                <textarea className={styles.infoTextarea}
                                  placeholder="Adicionar descrição ou informações adicionais da tarefa..."
                                  value={item.info || ''}
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
                                        <button className={styles.iconBtnSub}
                                          onClick={() => { setEditValue(sub.label); setEditingSubtask({ si, ii, subI }); }}>
                                          <IconEdit />
                                        </button>
                                        <button className={`${styles.iconBtnSub} ${styles.iconDanger}`}
                                          onClick={() => handleDeleteSubtask(si, ii, subI)}>
                                          <IconTrash />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                  <form className={styles.miniForm} onSubmit={e => handleAddSubtask(e, si, ii)}>
                                    <span className={styles.subtaskTree}>└</span>
                                    <input type="text" placeholder="Adicionar subtarefa e apertar Enter..."
                                      value={newSubtaskText[`${si}_${ii}`] || ''}
                                      onChange={e => setNewSubtaskText({ ...newSubtaskText, [`${si}_${ii}`]: e.target.value })} />
                                  </form>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Drop zone para o último slot */}
                      <div
                        className={`${styles.dropZone} ${dragOverKey === `${si}_dropzone` ? styles.dropZoneActive : ''}`}
                        onDragOver={e => handleDropZoneDragOver(e, si)}
                        onDragLeave={() => { if (dragOverKey === `${si}_dropzone`) setDragOverKey(null); }}
                        onDrop={e => handleDropZoneDrop(e, si)}
                      >
                        {dragOverKey === `${si}_dropzone` ? 'Soltar aqui para mover para o final' : ''}
                      </div>

                      <form className={styles.addFormTask} onSubmit={e => handleAddItem(e, si)}>
                        <input type="text" className={styles.inputTask} placeholder="+ Adicionar nova tarefa principal..."
                          value={newItemText[si] || ''}
                          onChange={e => setNewItemText({ ...newItemText, [si]: e.target.value })} />
                        <button type="submit" className={styles.submitBtnTask} disabled={!newItemText[si]?.trim()}>Adicionar</button>
                      </form>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUNA 2: TRILHA DE POSTS (Frontline) */}
        {isFrontline && (
          <div className={styles.colSide}>
            <div className={styles.trailHeader}>
              <h3 className={styles.trailTitle}>🏁 Trilha de Posts (Metas)</h3>
            </div>

            <form className={styles.addFormBase} onSubmit={handleAddMilestone}>
              <input type="text" className={styles.inputMain} placeholder="Nome do novo marco / meta..."
                value={newMilestoneTitle} onChange={e => setNewMilestoneTitle(e.target.value)} />
              <button type="submit" className={styles.submitBtnTrail} disabled={!newMilestoneTitle.trim()}>+ Novo Marco</button>
            </form>

            <div className={styles.accordionList}>
              {milestones.map((m, mi) => (
                <div key={mi} className={`${styles.secCard} ${styles.trailCard}`}>
                  <div className={`${styles.secHeader} ${expandedMilestone === mi ? styles.secHeaderOpen : ''}`}>
                    {editingMilestone === mi ? (
                      <div className={styles.editRow} onClick={e => e.stopPropagation()}>
                        <input autoFocus className={styles.editInput} value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && saveEditMilestone(mi)}
                          onBlur={() => saveEditMilestone(mi)} />
                      </div>
                    ) : (
                      <div className={styles.secTitleWrap}
                        onClick={() => setExpandedMilestone(expandedMilestone === mi ? null : mi)}>
                        <span className={styles.trailNum}>#{mi + 1}</span>
                        <span className={styles.secTitle}>{m.title}</span>
                      </div>
                    )}
                    <div className={styles.actionGroup}>
                      <button className={styles.iconBtn}
                        onClick={e => { e.stopPropagation(); setEditValue(m.title); setEditingMilestone(mi); }}>
                        <IconEdit />
                      </button>
                      <button className={`${styles.iconBtn} ${styles.iconDanger}`}
                        onClick={e => { e.stopPropagation(); handleDeleteMilestone(mi); }}>
                        <IconTrash />
                      </button>
                      <div className={styles.chevron}
                        onClick={() => setExpandedMilestone(expandedMilestone === mi ? null : mi)}>
                        {expandedMilestone === mi ? '▲' : '▼'}
                      </div>
                    </div>
                  </div>

                  {expandedMilestone === mi && (
                    <div className={styles.secBody}>
                      {m.posts.map((post, pi) => (
                        <div key={pi} className={styles.subtaskRow}>
                          {editingPost?.mi === mi && editingPost?.pi === pi ? (
                            <input autoFocus className={styles.editInputSmall} value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && saveEditPost(mi, pi)}
                              onBlur={() => saveEditPost(mi, pi)} />
                          ) : (
                            <span className={styles.subtaskLabel}>📱 {post}</span>
                          )}
                          <div className={styles.actionGroupSub}>
                            <button className={styles.iconBtnSub}
                              onClick={() => { setEditValue(post); setEditingPost({ mi, pi }); }}>
                              <IconEdit />
                            </button>
                            <button className={`${styles.iconBtnSub} ${styles.iconDanger}`}
                              onClick={() => handleDeletePost(mi, pi)}>
                              <IconTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                      <form className={styles.miniForm} onSubmit={e => handleAddPost(e, mi)}>
                        <input type="text" placeholder="+ Adicionar post/ação e apertar Enter..."
                          value={newPostText[mi] || ''}
                          onChange={e => setNewPostText({ ...newPostText, [mi]: e.target.value })} />
                      </form>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};