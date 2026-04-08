import { useState } from 'react';
import styles from './Settings.module.css';

export const CORES_PREDEFINIDAS = ['#FFFFFF', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];

interface CategoryFormProps {
  onAdd: (title: string, color: string, hasGoals: boolean, goalText: string) => void;
}

export const CategoryForm = ({ onAdd }: CategoryFormProps) => {
  const [newSubcatTitle, setNewSubcatTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState(CORES_PREDEFINIDAS[0]);
  const [hasGoals, setHasGoals] = useState(false);
  const [goalText, setGoalText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubcatTitle.trim()) return;
    onAdd(newSubcatTitle, selectedColor, hasGoals, goalText);
    setNewSubcatTitle('');
    setHasGoals(false);
    setGoalText('');
    setSelectedColor(CORES_PREDEFINIDAS[0]);
  };

  return (
    <form className={styles.addFormBase} onSubmit={handleSubmit} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
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

        {hasGoals && (
          <div style={{ marginTop: '8px' }}>
            <input type="text" className={styles.inputMain} placeholder="Escreva qual é a meta desta categoria..." value={goalText} onChange={e => setGoalText(e.target.value)} style={{ width: '100%', fontSize: '0.9rem', borderLeft: `3px solid ${selectedColor !== '#FFFFFF' ? selectedColor : '#534AB7'}` }} />
          </div>
        )}
      </div>
    </form>
  );
};