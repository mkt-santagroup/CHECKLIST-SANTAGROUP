export type Urgency = 'urgente' | 'importante' | 'planejamento' | 'opcional';

export interface Subtask {
  label: string;
}

export interface ChecklistItemData {
  label: string;
  urgency: Urgency;
  info?: string;
  optional?: boolean;
  subtasks?: Subtask[];
}

export interface Section {
  id?: string;
  title: string;
  color?: string; 
  hasGoals?: boolean;
  goalText?: string; // <-- NOVO: Guarda o texto da meta!
  items: ChecklistItemData[];
  isTrail?: boolean; 
}

export interface PanelData {
  color: string;
  sections: Section[];
}

export interface Goal {
  id: string;
  categoryId: string;
  title: string;
  completed: boolean;
}

export interface AppState {
  back: Record<string, boolean>;
  front: Record<string, boolean>;
  entregaveis: Record<string, boolean>;
}

export interface PostState {
  [key: string]: boolean;
}

export interface MetaState {
  [key: number]: boolean;
}

export type TabMode = 'back' | 'front' | 'entregaveis' | 'roadmap';