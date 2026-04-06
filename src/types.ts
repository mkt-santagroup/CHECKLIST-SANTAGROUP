export type Urgency = 'urgente' | 'importante' | 'planejamento' | 'opcional';

export interface Subtask {
  label: string;
}

export interface ChecklistItemData {
  label: string;
  urgency: Urgency;
  info?: string;
  optional?: boolean;
  subtasks?: Subtask[]; // <-- Nova propriedade adicionada
}

export interface Section {
  title: string;
  items: ChecklistItemData[];
  isTrail?: boolean;
}

export interface PanelData {
  color: string;
  sections: Section[];
}

export interface Milestone {
  title: string;
  meta: number | null;
  unlocks: string | null;
  posts: string[];
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