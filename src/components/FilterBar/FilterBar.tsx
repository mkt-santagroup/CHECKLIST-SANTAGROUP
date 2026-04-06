import { TabMode } from '../../types';
import styles from './FilterBar.module.css';

interface FilterBarProps {
  current: TabMode;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const FilterBar = ({ current, activeFilter, onFilterChange }: FilterBarProps) => {
  if (current === 'roadmap') return null;

  const filters = [
    { id: 'all', label: 'Todos', emoji: '' },
    { id: 'urgente', label: 'Urgente', emoji: '🔴' },
    { id: 'importante', label: 'Importante', emoji: '🟠' },
    { id: 'planejamento', label: 'Planejamento', emoji: '🟡' },
    { id: 'opcional', label: 'Opcional', emoji: '⚪' },
    { id: 'com-data', label: 'Com prazo', emoji: '📅' },
  ];

  return (
    <div className={styles.filterBar}>
      {filters.map((f) => (
        <button
          key={f.id}
          className={`${styles.filterBtn} ${activeFilter === f.id ? styles.active : ''}`}
          data-filter={f.id}
          onClick={() => onFilterChange(f.id)}
        >
          {f.emoji} {f.label}
        </button>
      ))}
    </div>
  );
};
