import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import Bandeirinhas from '../components/Bandeirinhas';
import LoadingSpinner from '../components/LoadingSpinner';
import { TIPOS, TIPO_EMOJI, TIPO_LABEL } from '../utils/textos';

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('certidoes');
  const [certidoes, setCertidoes] = useState([]);
  const [textos, setTextos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterTipo, setFilterTipo] = useState('');
  const [novoTexto, setNovoTexto] = useState({ tipo:'amor', variacao:'', texto:'' });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const params = filterTipo ? `?tipo=${filterTipo}` : '';
      const [c, t, s] = await Promise.all([api.get(`/admin/certidoes${params}`), api.get('/admin/textos'), api.get('/admin/stats')]);
      setCertidoes(c.data.certidoes); setTextos(t.data.textos); setStats(s.data.stats);
    } catch { toast.error('Erro ao carregar'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, [filterTipo]);

  const handleDelete = async (id) => {
    if (!confirm('Excluir certidão?')) return;
    try { await api.delete(`/admin/certidoes/${id}`); toast.success('Excluída'); fetchAll(); }
    catch { toast.error('Erro'); }
  };

  const handleToggleTexto = async (t) => {
    try { await api.patch(`/admin/textos/${t.id}`, { ativo: !t.ativo, texto: t.texto }); fetchAll(); }
    catch { toast.error('Erro'); }
  };

  const handleAddTexto = async () => {
    if (!novoTexto.variacao || !novoTexto.texto) return toast.error('Preencha todos os campos');
    try { await api.post('/admin/textos', novoTexto); toast.success('Texto adicionado!'); setNovoTexto({ tipo:'amor', variacao:'', texto:'' }); fetchAll(); }
    catch { toast.error('Erro'); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });

  return (
    <div className="min-h-screen bg-junina flex flex-col">
      <Bandeirinhas />
      <header className="px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display text-lg font-bold" style={{color:'#4B1E6D'}}>Admin · Cartório Junino</h1>
            <p className="text-xs" style={{color:'#C79A3B'}}>@{user?.instagram || user?.name}</p>
          </div>
          <button onClick={logout} className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{color:'#6F2DA8'}}>Sair</button>
        </div>
      </header>

      <div className="px-4 mb-4">
        <div className="max-w-2xl mx-auto flex gap-1 rounded-xl p-1" style={{background:'rgba(199,154,59,0.15)'}}>
          {['certidoes','textos','stats'].map(t=>(
            <button key={t} onClick={()=>setTab(t)} className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all capitalize"
              style={tab===t?{background:'#fff',color:'#4B1E6D',boxShadow:'0 2px 8px rgba(75,30,109,0.1)'}:{color:'#6F2DA8'}}>
              {t==='certidoes'?'💍 Certidões':t==='textos'?'📝 Textos':'📊 Stats'}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 px-4 pb-8">
        <div className="max-w-2xl mx-auto">
          {loading ? <div className="flex justify-center py-12"><LoadingSpinner text="Carregando..."/></div> : (
            <>
              {/* CERTIDÕES */}
              {tab==='certidoes' && (
                <div>
                  <div className="flex gap-2 mb-4">
                    <select value={filterTipo} onChange={e=>setFilterTipo(e.target.value)} className="input-junina text-xs py-2 flex-1">
                      <option value="">Todos os tipos</option>
                      {TIPOS.map(t=><option key={t.id} value={t.id}>{t.emoji} {t.label}</option>)}
                    </select>
                    <span className="text-xs py-2 px-3 font-medium" style={{color:'#C79A3B',background:'rgba(199,154,59,0.1)',borderRadius:10}}>{certidoes.length}</span>
                  </div>
                  <div className="space-y-3">
                    {certidoes.map(c=>(
                      <div key={c.id} className="card-junina p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{TIPO_EMOJI[c.tipo]}</span>
                              <span className="text-xs font-bold" style={{color:'#C79A3B'}}>{TIPO_LABEL[c.tipo]}</span>
                            </div>
                            <p className="font-display font-bold" style={{color:'#4B1E6D'}}>{c.nome1} & {c.nome2}</p>
                            <p className="text-xs mt-1" style={{color:'rgba(58,31,20,0.45)'}}>{formatDate(c.created_at)} · {c.carimbo}</p>
                          </div>
                          <div className="flex gap-1.5">
                            <a href={`/c/${c.cert_token}`} target="_blank" rel="noreferrer"
                              className="text-xs px-2.5 py-1.5 rounded-lg font-medium"
                              style={{background:'rgba(0,124,145,0.1)',color:'#007C91'}}>🔗</a>
                            <button onClick={()=>handleDelete(c.id)}
                              className="text-xs px-2.5 py-1.5 rounded-lg font-medium"
                              style={{background:'rgba(194,24,116,0.1)',color:'#C21874'}}>🗑</button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {certidoes.length===0&&<div className="card-junina p-10 text-center"><span className="text-4xl">💍</span><p className="mt-2" style={{color:'#4B1E6D'}}>Nenhuma certidão ainda</p></div>}
                  </div>
                </div>
              )}

              {/* TEXTOS */}
              {tab==='textos' && (
                <div className="space-y-4">
                  <div className="card-junina p-4">
                    <p className="text-xs font-bold mb-3" style={{color:'#C79A3B'}}>+ Adicionar texto</p>
                    <div className="space-y-2">
                      <select className="input-junina text-xs py-2" value={novoTexto.tipo} onChange={e=>setNovoTexto(f=>({...f,tipo:e.target.value}))}>
                        {TIPOS.map(t=><option key={t.id} value={t.id}>{t.emoji} {t.label}</option>)}
                      </select>
                      <input className="input-junina" type="number" min="1" max="10" placeholder="Variação (ex: 5)" value={novoTexto.variacao} onChange={e=>setNovoTexto(f=>({...f,variacao:e.target.value}))}/>
                      <textarea className="input-junina resize-none" rows={3} placeholder="Texto oficial..." value={novoTexto.texto} onChange={e=>setNovoTexto(f=>({...f,texto:e.target.value}))}/>
                      <button className="btn-primary text-sm" onClick={handleAddTexto}>Adicionar</button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {textos.map(t=>(
                      <div key={t.id} className="card-junina p-3" style={{opacity:t.ativo?1:0.5}}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold" style={{color:'#C79A3B'}}>{TIPO_EMOJI[t.tipo]} {TIPO_LABEL[t.tipo]} · V{t.variacao}</span>
                            <p className="text-xs mt-1 leading-relaxed" style={{color:'#3A1F14'}}>{t.texto.slice(0,100)}...</p>
                          </div>
                          <button onClick={()=>handleToggleTexto(t)} className="text-xs px-2 py-1 rounded font-medium flex-shrink-0"
                            style={{background:t.ativo?'rgba(0,124,145,0.1)':'rgba(194,24,116,0.1)',color:t.ativo?'#007C91':'#C21874'}}>
                            {t.ativo?'✓ Ativo':'✗ Off'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STATS */}
              {tab==='stats' && stats && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="card-junina p-5 text-center"><span className="text-3xl block mb-1">💍</span><p className="text-3xl font-bold" style={{color:'#4B1E6D'}}>{stats.total}</p><p className="text-xs mt-0.5" style={{color:'#C79A3B'}}>Certidões</p></div>
                    <div className="card-junina p-5 text-center"><span className="text-3xl block mb-1">📝</span><p className="text-3xl font-bold" style={{color:'#4B1E6D'}}>{stats.textos}</p><p className="text-xs mt-0.5" style={{color:'#C79A3B'}}>Textos ativos</p></div>
                  </div>
                  <div className="card-junina p-4">
                    <p className="text-xs font-bold mb-3" style={{color:'#C79A3B'}}>Por tipo de união</p>
                    {stats.porTipo.map(p=>(
                      <div key={p.tipo} className="flex justify-between py-1.5">
                        <span className="text-sm" style={{color:'#3A1F14'}}>{TIPO_EMOJI[p.tipo]} {TIPO_LABEL[p.tipo]}</span>
                        <span className="text-sm font-bold" style={{color:'#C79A3B'}}>{p.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Bandeirinhas />
    </div>
  );
}
