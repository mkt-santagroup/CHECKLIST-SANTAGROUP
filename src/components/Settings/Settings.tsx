import { useState, useRef } from 'react';
import { PanelData, TabMode, Urgency } from '../../types';
import styles from './Settings.module.css';
import { CategoryForm } from './CategoryForm';
import { SectionCard } from './SectionCard';
import { DrivePanel } from '../Drive/DrivePanel';

interface SettingsProps {
  appData: Record<string, PanelData>;
  setAppData: React.Dispatch<React.SetStateAction<Record<string, PanelData>>>;
  itemUrgencies: Record<string, Urgency>;
  setItemUrgencies: React.Dispatch<React.SetStateAction<Record<string, Urgency>>>;
  itemDates: Record<string, string | null>;
  setItemDates: React.Dispatch<React.SetStateAction<Record<string, string | null>>>;
}

const generateId = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36);

export const Settings = ({
  appData, setAppData, itemUrgencies, setItemUrgencies, itemDates, setItemDates
}: SettingsProps) => {
  const [selectedCat, setSelectedCat] = useState<TabMode>('back');
  const [expandedSecs, setExpandedSecs] = useState<Record<number, boolean>>({});
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

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

  const handleAddCategory = (title: string, color: string, hasGoals: boolean, goalText: string) => {
    if (selectedCat === 'roadmap') return;
    setAppData(prev => ({
      ...prev,
      [selectedCat]: { 
        ...prev[selectedCat], 
        sections: [{ 
          id: generateId(),
          title, 
          color,
          hasGoals,
          goalText,
          items: [] 
        }, ...prev[selectedCat].sections] 
      }
    }));
  };

  const handleDeleteSec = (si: number) => {
    if (!confirm('Tem certeza que deseja excluir esta seção inteira?')) return;
    setAppData(prev => ({
      ...prev,
      [selectedCat]: { ...prev[selectedCat], sections: prev[selectedCat].sections.filter((_, i) => i !== si) }
    }));
    setExpandedSecs({}); // Limpa os estados abertos pois a ordem dos índices mudou
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
    setExpandedSecs({});
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
    setExpandedSecs({});
    cleanSecDrag();
  };
  const cleanSecDrag = () => {
    dragSec.current = null;
    dragOverSec.current = null;
    setDraggingSecIdx(null);
    setDragOverSecIdx(null);
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

  const toggleTaskExpansion = (si: number, ii: number) => {
    const key = `${si}_${ii}`;
    setExpandedTasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Gerenciar Checklists</h2>
        <p className={styles.pageSubtitle}>Personalize categorias, escolha cores de destaque, defina metas e organize suas tarefas.</p>
      </div>

      <div className={styles.catSelector}>
        {(['back', 'front', 'entregaveis'] as TabMode[]).map(cat => (
          <button key={cat} className={`${styles.catBtn} ${selectedCat === cat ? styles.active : ''}`}
            onClick={() => { setSelectedCat(cat); setExpandedSecs({}); }}>
            {cat === 'back' ? 'Backstage' : cat === 'front' ? 'Frontline' : 'Entregáveis'}
          </button>
        ))}
      </div>

      <div className={styles.layoutGrid} style={{ gridTemplateColumns: '1fr' }}>

        <div className={styles.colMain}>
          <DrivePanel />
          <CategoryForm onAdd={handleAddCategory} />

          <div className={styles.accordionList}>
            {appData[selectedCat].sections.map((sec, si) => (
              <SectionCard
                key={si}
                sec={sec} si={si} selectedCat={selectedCat}
                appData={appData} setAppData={setAppData}
                itemUrgencies={itemUrgencies} setItemUrgencies={setItemUrgencies}
                itemDates={itemDates} setItemDates={setItemDates}
                isExpanded={!!expandedSecs[si]}
                onToggleExpand={() => setExpandedSecs(prev => ({ ...prev, [si]: !prev[si] }))}
                moveSection={moveSection}
                handleDeleteSec={handleDeleteSec}
                isSecDragOver={dragOverSecIdx === si}
                isSecDragging={draggingSecIdx === si}
                onSecDragStart={e => handleSecDragStart(e, si)}
                onSecDragOver={e => handleSecDragOver(e, si)}
                onSecDragLeave={() => setDragOverSecIdx(null)}
                onSecDrop={e => handleSecDrop(e, si)}
                onSecDragEnd={cleanSecDrag}
                expandedTasks={expandedTasks}
                toggleTaskExpansion={toggleTaskExpansion}
                dragOverKey={dragOverKey}
                draggingKey={draggingKey}
                handleItemDragStart={handleItemDragStart}
                handleItemDragOver={handleItemDragOver}
                handleItemDrop={handleItemDrop}
                cleanItemDrag={cleanItemDrag}
                setDragOverKey={setDragOverKey}
                handleDropZoneDragOver={handleDropZoneDragOver}
                handleDropZoneDrop={handleDropZoneDrop}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};