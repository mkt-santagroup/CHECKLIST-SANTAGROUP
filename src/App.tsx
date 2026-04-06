import { useState, useMemo, useEffect, useRef } from 'react';
import { supabase } from './lib/supabase';
import { Header } from './components/Header/Header';
import { LaunchBanner } from './components/LaunchBanner/LaunchBanner';
import { Tabs } from './components/Tabs/Tabs';
import { ProgressBar } from './components/ProgressBar/ProgressBar';
import { Stats } from './components/Stats/Stats';
import { Legend } from './components/Legend/Legend';
import { FilterBar } from './components/FilterBar/FilterBar';
import { ChecklistPanel } from './components/Checklist/ChecklistPanel';
import { RoadmapPanel } from './components/Roadmap/RoadmapPanel';
import { Settings } from './components/Settings/Settings';

// A MÁGICA: Importando os dados originais de volta!
import { DATA, MARCOS } from './constants/data';
import { AppState, TabMode, Urgency, Milestone } from './types';

// Mudei o ID para ele criar uma nova linha 100% preenchida no seu banco
const BOARD_ID = '22222222-2222-2222-2222-222222222222'; 

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'home' | 'settings'>('home');
  const [currentTab, setCurrentTab] = useState<TabMode>('back');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Estados de Dados (Agora iniciando com as constantes)
  const [appData, setAppData] = useState(DATA); 
  const [milestones, setMilestones] = useState<Milestone[]>(MARCOS);
  const [launchDate, setLaunchDate] = useState<string | null>(null);
  const [checklistState, setChecklistState] = useState<AppState>({ back: {}, front: {}, entregaveis: {} });
  const [itemUrgencies, setItemUrgencies] = useState<Record<string, Urgency>>({});
  const [itemDates, setItemDates] = useState<Record<string, string | null>>({});

  const lastSyncStr = useRef("");

  useEffect(() => {
    const fetchBoard = async () => {
      const { data, error } = await supabase.from('launch_board').select('*').eq('id', BOARD_ID).single();

      if (error || !data) {
        // Se o banco for novo, INSERE O DATA E O MARCOS ORIGINAIS
        await supabase.from('launch_board').insert([{
          id: BOARD_ID,
          app_data: DATA,
          milestones: MARCOS,
          checklist_state: { back: {}, front: {}, entregaveis: {} },
          item_urgencies: {},
          item_dates: {},
          launch_date: null
        }]);
      } else {
        setAppData(data.app_data);
        setMilestones(data.milestones || []);
        setChecklistState(data.checklist_state);
        setItemUrgencies(data.item_urgencies);
        setItemDates(data.item_dates);
        setLaunchDate(data.launch_date);
        
        lastSyncStr.current = JSON.stringify({ 
          appData: data.app_data, milestones: data.milestones, checklistState: data.checklist_state, 
          itemUrgencies: data.item_urgencies, itemDates: data.item_dates, launchDate: data.launch_date 
        });
      }
      setLoading(false);
    };

    fetchBoard();

    const channel = supabase.channel('board-updates').on(
      'postgres_changes', { event: 'UPDATE', schema: 'public', table: 'launch_board', filter: `id=eq.${BOARD_ID}` },
      (payload) => {
        const n = payload.new;
        lastSyncStr.current = JSON.stringify({
          appData: n.app_data, milestones: n.milestones, checklistState: n.checklist_state,
          itemUrgencies: n.item_urgencies, itemDates: n.item_dates, launchDate: n.launch_date
        });
        
        setAppData(n.app_data);
        setMilestones(n.milestones || []);
        setChecklistState(n.checklist_state);
        setItemUrgencies(n.item_urgencies);
        setItemDates(n.item_dates);
        setLaunchDate(n.launch_date);
      }
    ).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (loading) return;
    const currentStr = JSON.stringify({ appData, milestones, checklistState, itemUrgencies, itemDates, launchDate });
    if (currentStr === lastSyncStr.current) return;

    const timer = setTimeout(async () => {
      lastSyncStr.current = currentStr;
      await supabase.from('launch_board').update({
        app_data: appData,
        milestones: milestones,
        checklist_state: checklistState,
        item_urgencies: itemUrgencies,
        item_dates: itemDates,
        launch_date: launchDate
      }).eq('id', BOARD_ID);
    }, 500);

    return () => clearTimeout(timer);
  }, [appData, milestones, checklistState, itemUrgencies, itemDates, launchDate, loading]);

  const stats = useMemo(() => {
    if (currentTab === 'roadmap') return { done: 0, total: 0, percentage: 0 };
    const d = appData[currentTab];
    let total = 0; let done = 0;
    d?.sections.forEach((sec, si) => {
      if (sec.isTrail) return;
      sec.items.forEach((_, ii) => {
        total++;
        if (checklistState[currentTab][`${si}_${ii}`]) done++;
      });
    });
    const percentage = total ? Math.round((done / total) * 100) : 0;
    return { done, total, percentage };
  }, [currentTab, checklistState, appData]);

  const handleToggle = (key: string) => {
    if (currentTab === 'roadmap') return;
    setChecklistState(prev => ({ ...prev, [currentTab]: { ...prev[currentTab], [key]: !prev[currentTab][key] } }));
  };

  const handleToggleSubtask = (si: number, ii: number, subI: number) => {
    if (currentTab === 'roadmap') return;
    const key = `${si}_${ii}_sub_${subI}`;
    setChecklistState(prev => ({ ...prev, [currentTab]: { ...prev[currentTab], [key]: !prev[currentTab][key] } }));
  };

  const handleReset = () => {
    if (currentTab === 'roadmap') return;
    if(confirm("Tem certeza que deseja resetar o progresso desta categoria?")) {
      setChecklistState(prev => ({ ...prev, [currentTab]: {} }));
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: '#534AB7' }}>
        <h2>Conectando ao banco de dados...</h2>
      </div>
    );
  }

  return (
    <div className={`container ${currentView === 'settings' ? 'wide' : ''}`}>
      <Header currentView={currentView} onNavigate={setCurrentView} />

      {currentView === 'settings' ? (
        <Settings 
          appData={appData} setAppData={setAppData} 
          milestones={milestones} setMilestones={setMilestones}
          itemUrgencies={itemUrgencies} setItemUrgencies={setItemUrgencies}
          itemDates={itemDates} setItemDates={setItemDates}
        />
      ) : (
        <>
          <LaunchBanner launchDate={launchDate} onSetLaunchDate={setLaunchDate} onClearLaunchDate={() => setLaunchDate(null)} />
          <Tabs current={currentTab} onSwitchTab={setCurrentTab} />
          <ProgressBar current={currentTab} percentage={stats.percentage} onReset={handleReset} />
          <Stats current={currentTab} done={stats.done} total={stats.total} />
          <Legend current={currentTab} />
          <FilterBar current={currentTab} activeFilter={activeFilter} onFilterChange={setActiveFilter} />

          {currentTab !== 'roadmap' ? (
            <ChecklistPanel
              mode={currentTab}
              data={appData[currentTab]}
              milestones={milestones}
              state={checklistState[currentTab]}
              onToggle={handleToggle}
              onToggleSubtask={handleToggleSubtask}
              urgencies={itemUrgencies}
              onUrgencyChange={(key, urg) => setItemUrgencies((prev) => ({ ...prev, [key]: urg }))}
              dates={itemDates}
              onDateChange={(key, date) => setItemDates((prev) => ({ ...prev, [key]: date }))}
              activeFilter={activeFilter}
            />
          ) : (
            <RoadmapPanel dates={itemDates} state={checklistState} urgencies={itemUrgencies} appData={appData} />
          )}
        </>
      )}
    </div>
  );
}