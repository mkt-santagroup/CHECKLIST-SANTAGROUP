import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export const DrivePanel = () => {
  const [link, setLink] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('link_drive').select('link').eq('id', 1).single().then(({ data }) => {
      if (data) setLink(data.link);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('link_drive').upsert({ id: 1, link });
    setSaving(false);
    if (!error) {
      alert('Link do Drive salvo com sucesso!');
    } else {
      alert('Erro ao salvar o link.');
    }
  };

  if (loading) return <div style={{ color: '#888', marginTop: '2rem', textAlign: 'center' }}>Carregando Drive...</div>;

  return (
    <div style={{ background: '#141416', padding: '2rem', borderRadius: '12px', border: '1px solid #222225', marginTop: '1.5rem' }}>
      <h2 style={{ fontSize: '20px', color: '#f0f0ee', marginBottom: '8px', fontFamily: 'Syne, sans-serif' }}>Acesso ao Google Drive</h2>
      <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>
        Defina aqui o link oficial da pasta do Google Drive com todos os materiais, artes e vídeos deste lançamento.
      </p>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={link}
          onChange={e => setLink(e.target.value)}
          placeholder="Cole o link do Google Drive aqui..."
          style={{
            flex: 1,
            minWidth: '250px',
            background: '#0a0a0b',
            border: '1px solid #222225',
            color: '#eee',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            fontFamily: 'Inter, sans-serif'
          }}
        />
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ background: '#534AB7', color: '#fff', border: 'none', padding: '0 24px', borderRadius: '8px', fontWeight: 'bold', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s', height: '45px' }}
        >
          {saving ? 'Salvando...' : 'Salvar Link'}
        </button>
      </div>

      {link && (
        <div style={{ padding: '16px', background: '#0a0a0b', borderRadius: '8px', border: '1px dashed #333' }}>
          <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '12px' }}>Link atual configurado:</p>
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1D9E75', color: '#fff', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}
          >
            Abrir Pasta no Drive ↗
          </a>
        </div>
      )}
    </div>
  );
};