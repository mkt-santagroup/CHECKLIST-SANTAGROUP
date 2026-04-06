import { useState } from 'react';
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

  // D&D e Menus
  const [draggedTask, setDraggedTask] = useState<{si: number, ii: number} | null>(null);
  const [dragOverTask, setDragOverTask] = useState<{si: number, ii: number} | null>(null);
  const [openUrgencyKey, setOpenUrgencyKey] = useState<string | null>(null);

  // Estados Checklists
  const [newSubcatTitle, setNewSubcatTitle] = useState('');
  const [newItemText, setNewItemText] = useState<Record<number, string>>({});
  const [newSubtaskText, setNewSubtaskText] = useState<Record<string, string>>({});
  const [editingSec, setEditingSec] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<{si: number, ii: number} | null>(null);
  const [editingSubtask, setEditingSubtask] = useState<{si: number, ii: number, subI: number} | null>(null);
  const [editValue, setEditValue] = useState("");

  // Estados Trilha de Posts (Milestones)
  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(null);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newPostText, setNewPostText] = useState<Record<number, string>>({});
  const [editingMilestone, setEditingMilestone] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<{mi: number, pi: number} | null>(null);

  // ================= CRIAÇÃO CHECKLISTS ================= //
  const handleAddSubcat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubcatTitle.trim() || selectedCat === 'roadmap') return;
    setAppData((prev) => ({
      ...prev,
      [selectedCat]: { ...prev[selectedCat], sections: [{ title: newSubcatTitle, items: [] }, ...prev[selectedCat].sections] }
    }));
    setNewSubcatTitle('');
  };

  const handleAddItem = (e: React.FormEvent, si: number) => {
    e.preventDefault();
    if (!newItemText[si]?.trim()) return;
    setAppData((prev) => {
      const newSections = [...prev[selectedCat].sections];
      newSections[si] = { ...newSections[si], items: [...newSections[si].items, { label: newItemText[si], urgency: 'planejamento', info: '' }] };
      return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: newSections } };
    });
    setExpandedTasks(prev => ({ ...prev, [`${si}_${appData[selectedCat].sections[si].items.length}`]: true }));
    setNewItemText({ ...newItemText, [si]: '' });
  };

  const handleAddSubtask = (e: React.FormEvent, si: number, ii: number) => {
    e.preventDefault();
    const key = `${si}_${ii}`;
    if (!newSubtaskText[key]?.trim()) return;
    setAppData((prev) => {
      const newSections = [...prev[selectedCat].sections];
      const newItems = [...newSections[si].items];
      newItems[ii] = { ...newItems[ii], subtasks: [...(newItems[ii].subtasks || []), { label: newSubtaskText[key] }] };
      newSections[si] = { ...newSections[si], items: newItems };
      return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: newSections } };
    });
    setNewSubtaskText({ ...newSubtaskText, [key]: '' });
  };

  // ================= EXCLUSÃO CHECKLISTS ================= //
  const handleDeleteSec = (si: number) => {
    if(!confirm("Tem certeza que deseja excluir esta seção inteira?")) return;
    setAppData(prev => ({ ...prev, [selectedCat]: { ...prev[selectedCat], sections: prev[selectedCat].sections.filter((_, i) => i !== si) } }));
  };
  const handleDeleteItem = (si: number, ii: number) => {
    setAppData(prev => {
      const newSections = [...prev[selectedCat].sections];
      newSections[si].items = newSections[si].items.filter((_, i) => i !== ii);
      return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: newSections } };
    });
  };
  const handleDeleteSubtask = (si: number, ii: number, subI: number) => {
    setAppData(prev => {
      const newSections = [...prev[selectedCat].sections];
      const newItems = [...newSections[si].items];
      newItems[ii].subtasks = newItems[ii].subtasks?.filter((_, i) => i !== subI);
      newSections[si].items = newItems;
      return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: newSections } };
    });
  };

  // ================= EDIÇÃO CHECKLISTS ================= //
  const saveEditSec = (si: number) => {
    if (editValue.trim()) {
      setAppData(prev => {
        const newSections = [...prev[selectedCat].sections];
        newSections[si] = { ...newSections[si], title: editValue };
        return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: newSections } };
      });
    }
    setEditingSec(null);
  };
  const saveEditItem = (si: number, ii: number) => {
    if (editValue.trim()) {
      setAppData(prev => {
        const newSections = [...prev[selectedCat].sections];
        const newItems = [...newSections[si].items];
        newItems[ii] = { ...newItems[ii], label: editValue };
        newSections[si].items = newItems;
        return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: newSections } };
      });
    }
    setEditingItem(null);
  };
  const saveEditSubtask = (si: number, ii: number, subI: number) => {
    if (editValue.trim()) {
      setAppData(prev => {
        const newSections = [...prev[selectedCat].sections];
        const newItems = [...newSections[si].items];
        const newSubtasks = [...(newItems[ii].subtasks || [])];
        newSubtasks[subI] = { ...newSubtasks[subI], label: editValue };
        newItems[ii] = { ...newItems[ii], subtasks: newSubtasks };
        newSections[si].items = newItems;
        return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: newSections } };
      });
    }
    setEditingSubtask(null);
  };

  // ================= TRILHA DE POSTS (MILESTONES) ================= //
  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    setMilestones(prev => [...prev, { title: newMilestoneTitle, meta: null, unlocks: null, posts: [] }]);
    setNewMilestoneTitle('');
  };
  const handleDeleteMilestone = (mi: number) => {
    if(!confirm("Excluir esta meta da trilha?")) return;
    setMilestones(prev => prev.filter((_, i) => i !== mi));
  };
  const handleAddPost = (e: React.FormEvent, mi: number) => {
    e.preventDefault();
    if (!newPostText[mi]?.trim()) return;
    setMilestones(prev => {
      const copy = [...prev];
      copy[mi].posts.push(newPostText[mi]);
      return copy;
    });
    setNewPostText({ ...newPostText, [mi]: '' });
  };
  const handleDeletePost = (mi: number, pi: number) => {
    setMilestones(prev => {
      const copy = [...prev];
      copy[mi].posts = copy[mi].posts.filter((_, i) => i !== pi);
      return copy;
    });
  };
  const saveEditMilestone = (mi: number) => {
    if(editValue.trim()) {
      setMilestones(prev => {
        const copy = [...prev];
        copy[mi].title = editValue;
        return copy;
      });
    }
    setEditingMilestone(null);
  };
  const saveEditPost = (mi: number, pi: number) => {
    if(editValue.trim()) {
      setMilestones(prev => {
        const copy = [...prev];
        copy[mi].posts[pi] = editValue;
        return copy;
      });
    }
    setEditingPost(null);
  };

  // ================= DRAG AND DROP ================= //
  const handleDragStart = (e: React.DragEvent, si: number, ii: number) => {
    setDraggedTask({ si, ii });
    setTimeout(() => { e.dataTransfer.effectAllowed = 'move'; }, 0);
  };
  const handleDragOver = (e: React.DragEvent, si: number, ii: number) => {
    e.preventDefault(); 
    if (draggedTask && draggedTask.si === si) {
      if (dragOverTask?.ii !== ii) setDragOverTask({ si, ii });
    }
  };
  const handleDrop = (e: React.DragEvent, targetSi: number, targetIi: number) => {
    e.preventDefault();
    if (!draggedTask) return;
    if (draggedTask.si === targetSi && draggedTask.ii !== targetIi) {
      setAppData(prev => {
        const newSections = [...prev[selectedCat].sections];
        const items = [...newSections[targetSi].items];
        const [movedItem] = items.splice(draggedTask.ii, 1);
        items.splice(targetIi, 0, movedItem);
        newSections[targetSi].items = items;
        return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: newSections } };
      });
    }
    setDraggedTask(null);
    setDragOverTask(null);
  };

  const toggleTaskExpansion = (si: number, ii: number) => {
    const key = `${si}_${ii}`;
    setExpandedTasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const IconEdit = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const IconTrash = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const IconGrip = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>;

  const isFrontline = selectedCat === 'front';

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Gerenciar Checklists</h2>
        <p className={styles.pageSubtitle}>Personalize categorias, adicione descrições, arraste tarefas para reordenar, ajuste prazos e níveis de urgência.</p>
      </div>

      <div className={styles.catSelector}>
        {(['back', 'front', 'entregaveis'] as TabMode[]).map((cat) => (
          <button key={cat} className={`${styles.catBtn} ${selectedCat === cat ? styles.active : ''}`} onClick={() => {setSelectedCat(cat); setExpandedSec(null);}}>
            {cat === 'back' ? 'Backstage' : cat === 'front' ? 'Frontline' : 'Entregáveis'}
          </button>
        ))}
      </div>

      <div className={`${styles.layoutGrid} ${isFrontline ? styles.twoColumns : ''}`}>
        
        {/* COLUNA 1: CHECKLISTS NORMAIS */}
        <div className={styles.colMain}>
          <form className={styles.addFormBase} onSubmit={handleAddSubcat}>
            <input type="text" className={styles.inputMain} placeholder="Nome da nova categoria/seção..." value={newSubcatTitle} onChange={(e) => setNewSubcatTitle(e.target.value)} />
            <button type="submit" className={styles.submitBtnMain} disabled={!newSubcatTitle.trim()}>+ Nova Categoria</button>
          </form>

          <div className={styles.accordionList}>
            {appData[selectedCat].sections.map((sec, si) => {
              if (sec.isTrail) return null; 
              return (
                <div key={si} className={styles.secCard}>
                  <div className={`${styles.secHeader} ${expandedSec === si ? styles.secHeaderOpen : ''}`}>
                    {editingSec === si ? (
                      <div className={styles.editRow} onClick={e => e.stopPropagation()}>
                        <input autoFocus className={styles.editInput} value={editValue} onChange={e => setEditValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveEditSec(si)} onBlur={() => saveEditSec(si)} />
                      </div>
                    ) : (
                      <div className={styles.secTitleWrap} onClick={() => setExpandedSec(expandedSec === si ? null : si)}>
                        <span className={styles.secTitle}>{sec.title}</span>
                        <span className={styles.secBadge}>{sec.items.length} itens</span>
                      </div>
                    )}
                    <div className={styles.actionGroup}>
                      <button className={styles.iconBtn} onClick={(e) => { e.stopPropagation(); setEditValue(sec.title); setEditingSec(si); }} title="Editar"><IconEdit /></button>
                      <button className={`${styles.iconBtn} ${styles.iconDanger}`} onClick={(e) => { e.stopPropagation(); handleDeleteSec(si); }} title="Excluir"><IconTrash /></button>
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
                        const isDragOver = dragOverTask?.si === si && dragOverTask?.ii === ii;
                        const isBeingDragged = draggedTask?.si === si && draggedTask?.ii === ii;

                        return (
                          <div key={ii} 
                            className={`${styles.itemBox} ${isDragOver ? styles.dragOverActive : ''} ${isBeingDragged ? styles.beingDragged : ''}`}
                            draggable onDragStart={(e) => handleDragStart(e, si, ii)} onDragOver={(e) => handleDragOver(e, si, ii)} onDragLeave={() => setDragOverTask(null)} onDrop={(e) => handleDrop(e, si, ii)} onDragEnd={() => { setDraggedTask(null); setDragOverTask(null); }}>
                            
                            <div className={styles.itemRow}>
                              <div className={styles.dragHandle} title="Arrastar para reordenar"><IconGrip /></div>
                              {editingItem?.si === si && editingItem?.ii === ii ? (
                                <div className={styles.editRow} onClick={e => e.stopPropagation()}>
                                  <input autoFocus className={styles.editInput} value={editValue} onChange={e => setEditValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveEditItem(si, ii)} onBlur={() => saveEditItem(si, ii)} />
                                </div>
                              ) : (
                                <div className={styles.itemLabel} onClick={() => toggleTaskExpansion(si, ii)}>📝 {item.label}</div>
                              )}
                              <div className={styles.actionGroupTask}>
                                <button className={styles.iconBtnSmall} onClick={() => { setEditValue(item.label); setEditingItem({si, ii}); }}><IconEdit /></button>
                                <button className={`${styles.iconBtnSmall} ${styles.iconDanger}`} onClick={() => handleDeleteItem(si, ii)}><IconTrash /></button>
                                <div className={styles.taskChevron} onClick={() => toggleTaskExpansion(si, ii)}>{isTaskExpanded ? '▲' : '▼'}</div>
                              </div>
                            </div>

                            {isTaskExpanded && (
                              <div className={styles.taskExpandedBody}>
                                
                                {/* METADATA (Urgência e Prazo) */}
                                <div className={styles.itemConfigRow}>
                                  <div className={styles.pillWrap}>
                                    <button className={`${styles.urgPill} ${styles[meta.cls]}`} onClick={() => setOpenUrgencyKey(openUrgencyKey === itemKey ? null : itemKey)}>
                                      <span className={styles.urgDot} style={{ background: meta.dot }} />{meta.text} ▾
                                    </button>
                                    {openUrgencyKey === itemKey && (
                                      <div className={styles.urgDropdown}>
                                        {(Object.keys(URGENCY_META) as Urgency[]).map((u) => (
                                          <div key={u} className={`${styles.urgOpt} ${currentUrgency === u ? styles.selected : ''}`} onClick={() => { setItemUrgencies({...itemUrgencies, [itemKey]: u}); setOpenUrgencyKey(null); }}>
                                            <span className={styles.urgDot} style={{ background: URGENCY_META[u].dot }} />
                                            <span style={{color: URGENCY_META[u].dot}}>{URGENCY_META[u].text}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <div className={styles.datePickerWrap}>
                                    <span className={styles.dateIcon}>📅</span>
                                    <input type="date" className={styles.dateInput} value={currentDate} onChange={(e) => setItemDates({...itemDates, [itemKey]: e.target.value || null})} />
                                    {currentDate && (<button className={styles.clearDateBtn} onClick={() => setItemDates({...itemDates, [itemKey]: null})}>✕</button>)}
                                  </div>
                                </div>

                                {/* CAMPO DE DESCRIÇÃO (Aparece o 'i' na Home) */}
                                <textarea
                                  className={styles.infoTextarea}
                                  placeholder="Adicionar descrição ou informações adicionais da tarefa..."
                                  value={item.info || ''}
                                  onChange={(e) => {
                                    setAppData(prev => {
                                      const newSections = [...prev[selectedCat].sections];
                                      const newItems = [...newSections[si].items];
                                      newItems[ii] = { ...newItems[ii], info: e.target.value };
                                      newSections[si].items = newItems;
                                      return { ...prev, [selectedCat]: { ...prev[selectedCat], sections: newSections } };
                                    });
                                  }}
                                />
                                
                                {/* SUBTAREFAS */}
                                <div className={styles.subtasksWrap}>
                                  {item.subtasks?.map((sub, subI) => (
                                    <div key={subI} className={styles.subtaskRow}>
                                      <span className={styles.subtaskTree}>└</span>
                                      {editingSubtask?.si === si && editingSubtask?.ii === ii && editingSubtask?.subI === subI ? (
                                        <input autoFocus className={styles.editInputSmall} value={editValue} onChange={e => setEditValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveEditSubtask(si, ii, subI)} onBlur={() => saveEditSubtask(si, ii, subI)} />
                                      ) : (
                                        <span className={styles.subtaskLabel}>{sub.label}</span>
                                      )}
                                      <div className={styles.actionGroupSub}>
                                        <button className={styles.iconBtnSub} onClick={() => { setEditValue(sub.label); setEditingSubtask({si, ii, subI}); }}><IconEdit /></button>
                                        <button className={`${styles.iconBtnSub} ${styles.iconDanger}`} onClick={() => handleDeleteSubtask(si, ii, subI)}><IconTrash /></button>
                                      </div>
                                    </div>
                                  ))}
                                  <form className={styles.miniForm} onSubmit={(e) => handleAddSubtask(e, si, ii)}>
                                    <span className={styles.subtaskTree}>└</span>
                                    <input type="text" placeholder="Adicionar subtarefa e apertar Enter..." value={newSubtaskText[`${si}_${ii}`] || ''} onChange={(e) => setNewSubtaskText({ ...newSubtaskText, [`${si}_${ii}`]: e.target.value })} />
                                  </form>
                                </div>

                              </div>
                            )}
                          </div>
                        );
                      })}
                      <form className={styles.addFormTask} onSubmit={(e) => handleAddItem(e, si)}>
                        <input type="text" className={styles.inputTask} placeholder="+ Adicionar nova tarefa principal..." value={newItemText[si] || ''} onChange={(e) => setNewItemText({ ...newItemText, [si]: e.target.value })} />
                        <button type="submit" className={styles.submitBtnTask} disabled={!newItemText[si]?.trim()}>Adicionar</button>
                      </form>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUNA 2: TRILHA DE POSTS (Só aparece no Frontline) */}
        {isFrontline && (
          <div className={styles.colSide}>
            <div className={styles.trailHeader}>
              <h3 className={styles.trailTitle}>🏁 Trilha de Posts (Metas)</h3>
            </div>
            
            <form className={styles.addFormBase} onSubmit={handleAddMilestone}>
              <input type="text" className={styles.inputMain} placeholder="Nome do novo marco / meta..." value={newMilestoneTitle} onChange={(e) => setNewMilestoneTitle(e.target.value)} />
              <button type="submit" className={styles.submitBtnTrail} disabled={!newMilestoneTitle.trim()}>+ Novo Marco</button>
            </form>

            <div className={styles.accordionList}>
              {milestones.map((m, mi) => (
                <div key={mi} className={`${styles.secCard} ${styles.trailCard}`}>
                  <div className={`${styles.secHeader} ${expandedMilestone === mi ? styles.secHeaderOpen : ''}`}>
                    
                    {editingMilestone === mi ? (
                      <div className={styles.editRow} onClick={e => e.stopPropagation()}>
                        <input autoFocus className={styles.editInput} value={editValue} onChange={e => setEditValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveEditMilestone(mi)} onBlur={() => saveEditMilestone(mi)} />
                      </div>
                    ) : (
                      <div className={styles.secTitleWrap} onClick={() => setExpandedMilestone(expandedMilestone === mi ? null : mi)}>
                        <span className={styles.trailNum}>#{mi + 1}</span>
                        <span className={styles.secTitle}>{m.title}</span>
                      </div>
                    )}

                    <div className={styles.actionGroup}>
                      <button className={styles.iconBtn} onClick={(e) => { e.stopPropagation(); setEditValue(m.title); setEditingMilestone(mi); }}><IconEdit /></button>
                      <button className={`${styles.iconBtn} ${styles.iconDanger}`} onClick={(e) => { e.stopPropagation(); handleDeleteMilestone(mi); }}><IconTrash /></button>
                      <div className={styles.chevron} onClick={() => setExpandedMilestone(expandedMilestone === mi ? null : mi)}>{expandedMilestone === mi ? '▲' : '▼'}</div>
                    </div>
                  </div>

                  {expandedMilestone === mi && (
                    <div className={styles.secBody}>
                      {m.posts.map((post, pi) => (
                        <div key={pi} className={styles.subtaskRow}>
                          {editingPost?.mi === mi && editingPost?.pi === pi ? (
                            <input autoFocus className={styles.editInputSmall} value={editValue} onChange={e => setEditValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveEditPost(mi, pi)} onBlur={() => saveEditPost(mi, pi)} />
                          ) : (
                            <span className={styles.subtaskLabel}>📱 {post}</span>
                          )}
                          <div className={styles.actionGroupSub}>
                            <button className={styles.iconBtnSub} onClick={() => { setEditValue(post); setEditingPost({mi, pi}); }}><IconEdit /></button>
                            <button className={`${styles.iconBtnSub} ${styles.iconDanger}`} onClick={() => handleDeletePost(mi, pi)}><IconTrash /></button>
                          </div>
                        </div>
                      ))}
                      
                      <form className={styles.miniForm} onSubmit={(e) => handleAddPost(e, mi)}>
                        <input type="text" placeholder="+ Adicionar post/ação e apertar Enter..." value={newPostText[mi] || ''} onChange={(e) => setNewPostText({ ...newPostText, [mi]: e.target.value })} />
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