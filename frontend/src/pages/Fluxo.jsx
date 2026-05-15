import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { compressImage } from '../utils/compress';
import { TIPOS } from '../utils/textos';
import Bandeirinhas from '../components/Bandeirinhas';
import LoadingSpinner from '../components/LoadingSpinner';
import SignaturePad from '../components/SignaturePad';
import WalletBadge from '../components/WalletBadge';

const STEPS = ['tipo','nomes','fotos','assinatura'];

export default function Fluxo({ onSuccess }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [tipo, setTipo] = useState('');
  const [nome1, setNome1] = useState('');
  const [nome2, setNome2] = useState('');
  const [foto1, setFoto1] = useState(null);
  const [foto2, setFoto2] = useState(null);
  const [foto1Preview, setFoto1Preview] = useState(null);
  const [foto2Preview, setFoto2Preview] = useState(null);
  const [assinatura, setAssinatura] = useState(null);
  const [assinatura2, setAssinatura2] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const foto1Ref = useRef();
  const foto2Ref = useRef();

  const pct = Math.round((step / (STEPS.length - 1)) * 100);
  const tipoInfo = TIPOS.find(t => t.id === tipo);

  const handleFoto = async (e, num) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const compressed = await compressImage(f);
      if (num === 1) { setFoto1(compressed); setFoto1Preview(URL.createObjectURL(compressed)); }
      else { setFoto2(compressed); setFoto2Preview(URL.createObjectURL(compressed)); }
    } catch { toast.error('Erro ao processar imagem'); }
  };

  const handleEnviar = async () => {
    setEnviando(true);
    try {
      const fd = new FormData();
      fd.append('tipo', tipo); fd.append('nome1', nome1); fd.append('nome2', nome2);
      if (foto1) fd.append('foto1', foto1);
      if (foto2) fd.append('foto2', foto2);
      if (assinatura) fd.append('assinatura', assinatura);
      if (assinatura2) fd.append('assinatura2', assinatura2);

      const { data } = await api.post('/certidoes', fd, {
        onUploadProgress: e => setProgresso(Math.round(e.loaded / e.total * 100)),
      });
      onSuccess(data);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao gerar certidão');
    } finally { setEnviando(false); setProgresso(0); }
  };

  return (
    <div className="min-h-screen bg-junina flex flex-col">
      <Bandeirinhas />
      <div className="flex justify-end px-4 pt-2"><WalletBadge /></div>

      {/* Progresso */}
      <div className="px-4 pt-3">
        <div className="max-w-sm mx-auto">
          <div className="h-1.5 rounded-full overflow-hidden" style={{background:'rgba(199,154,59,0.2)'}}>
            <div className="h-full rounded-full transition-all duration-500" style={{width:`${pct}%`,background:'linear-gradient(90deg,#C21874,#6F2DA8)'}}/>
          </div>
          <div className="flex justify-between text-xs mt-1" style={{color:'rgba(199,154,59,0.6)'}}>
            <span>Tipo</span><span>Nomes</span><span>Fotos</span><span>Assinar</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-sm animate-slide-up">

          {/* STEP 0 — Tipo */}
          {step === 0 && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-1 text-center" style={{color:'#4B1E6D'}}>Qual é a união?</h2>
              <p className="text-sm text-center mb-5" style={{color:'rgba(58,31,20,0.5)'}}>Escolha o tipo de certidão</p>
              <div className="space-y-2 mb-6">
                {TIPOS.map(t => (
                  <button key={t.id} onClick={() => setTipo(t.id)}
                    className="w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all"
                    style={{ background: tipo===t.id ? 'linear-gradient(135deg,rgba(194,24,116,0.15),rgba(111,45,168,0.15))' : 'rgba(255,255,255,0.7)', border: `2px solid ${tipo===t.id ? '#C21874' : 'rgba(199,154,59,0.25)'}`, boxShadow: tipo===t.id ? '0 4px 12px rgba(194,24,116,0.2)' : 'none' }}>
                    <span className="text-2xl">{t.emoji}</span>
                    <span className="font-semibold text-sm" style={{color:tipo===t.id?'#4B1E6D':'#3A1F14'}}>{t.label}</span>
                    {tipo===t.id && <span className="ml-auto text-xs font-bold" style={{color:'#C21874'}}>✓</span>}
                  </button>
                ))}
              </div>
              <button className="btn-primary" disabled={!tipo} onClick={() => setStep(1)}>Continuar →</button>
            </div>
          )}

          {/* STEP 1 — Nomes */}
          {step === 1 && (
            <div>
              <button onClick={() => setStep(0)} className="text-sm mb-5 flex items-center gap-1" style={{color:'#C79A3B'}}>← Voltar</button>
              <div className="text-center mb-5">
                <span className="text-4xl">{tipoInfo?.emoji}</span>
                <h2 className="font-display text-2xl font-bold mt-2" style={{color:'#4B1E6D'}}>{tipoInfo?.label}</h2>
                <p className="text-sm mt-1" style={{color:'rgba(58,31,20,0.5)'}}>Quem são as partes?</p>
              </div>
              <div className="space-y-3 mb-6">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{color:'#4B1E6D'}}>Parte 1 *</label>
                  <input className="input-junina" placeholder="Nome completo ou apelido" value={nome1} onChange={e=>setNome1(e.target.value)} autoFocus/>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{color:'#4B1E6D'}}>Parte 2 *</label>
                  <input className="input-junina" placeholder="Nome completo ou apelido" value={nome2} onChange={e=>setNome2(e.target.value)}/>
                </div>
              </div>
              <button className="btn-primary" disabled={!nome1.trim()||!nome2.trim()} onClick={() => setStep(2)}>Continuar →</button>
            </div>
          )}

          {/* STEP 2 — Fotos */}
          {step === 2 && (
            <div>
              <button onClick={() => setStep(1)} className="text-sm mb-5 flex items-center gap-1" style={{color:'#C79A3B'}}>← Voltar</button>
              <h2 className="font-display text-2xl font-bold mb-1 text-center" style={{color:'#4B1E6D'}}>Fotos (opcional)</h2>
              <p className="text-sm text-center mb-5" style={{color:'rgba(58,31,20,0.5)'}}>Aparecem no documento final</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[{num:1,nome:nome1,foto:foto1Preview,ref:foto1Ref,onChange:e=>handleFoto(e,1)},{num:2,nome:nome2,foto:foto2Preview,ref:foto2Ref,onChange:e=>handleFoto(e,2)}].map(({num,nome,foto,ref,onChange})=>(
                  <div key={num} className="text-center">
                    <div onClick={()=>ref.current?.click()} className="cursor-pointer mx-auto rounded-full overflow-hidden flex items-center justify-center" style={{width:80,height:80,border:`2px dashed ${foto?'#C21874':'rgba(199,154,59,0.4)'}`,background:'rgba(255,255,255,0.5)'}}>
                      {foto ? <img src={foto} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <span className="text-3xl">📷</span>}
                    </div>
                    <p className="text-xs font-semibold mt-2" style={{color:'#4B1E6D'}}>{nome}</p>
                    <input ref={ref} type="file" accept="image/*" className="hidden" onChange={onChange}/>
                  </div>
                ))}
              </div>
              <button className="btn-primary mb-2" onClick={() => setStep(3)}>Continuar →</button>
              <button className="btn-secondary w-full text-sm" onClick={() => setStep(3)}>Pular fotos</button>
            </div>
          )}

          {/* STEP 3 — Assinaturas */}
          {step === 3 && (
            <div>
              <button onClick={() => setStep(2)} className="text-sm mb-5 flex items-center gap-1" style={{color:'#C79A3B'}}>← Voltar</button>
              <h2 className="font-display text-2xl font-bold mb-1 text-center" style={{color:'#4B1E6D'}}>Assinaturas</h2>
              <p className="text-sm text-center mb-5" style={{color:'rgba(58,31,20,0.5)'}}>Cada parte assina o documento</p>

              {/* Assinatura 1 */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{background:'linear-gradient(135deg,#C21874,#6F2DA8)'}}>1</div>
                  <p className="text-sm font-semibold" style={{color:'#4B1E6D'}}>{nome1}</p>
                  {assinatura && <span className="ml-auto text-xs font-bold" style={{color:'#007C91'}}>✓ Assinado</span>}
                </div>
                <div className="card-junina p-3">
                  <SignaturePad onChange={setAssinatura} key="sig1"/>
                </div>
              </div>

              {/* Assinatura 2 */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{background:'linear-gradient(135deg,#6F2DA8,#007C91)'}}>2</div>
                  <p className="text-sm font-semibold" style={{color:'#4B1E6D'}}>{nome2}</p>
                  {assinatura2 && <span className="ml-auto text-xs font-bold" style={{color:'#007C91'}}>✓ Assinado</span>}
                </div>
                <div className="card-junina p-3">
                  <SignaturePad onChange={setAssinatura2} key="sig2"/>
                </div>
              </div>

              {enviando && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1" style={{color:'#6F2DA8'}}>
                    <span>Gerando certidão...</span><span>{progresso}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{background:'rgba(199,154,59,0.2)'}}>
                    <div className="h-full rounded-full transition-all" style={{width:`${progresso}%`,background:'linear-gradient(90deg,#C21874,#6F2DA8)'}}/>
                  </div>
                </div>
              )}
              <button className="btn-primary text-lg py-4 mb-2" onClick={handleEnviar} disabled={enviando}>
                {enviando ? <span className="flex items-center justify-center gap-2"><LoadingSpinner size="sm"/> Gerando...</span> : '💍 Gerar Certidão Oficial!'}
              </button>
              <button className="btn-secondary w-full text-sm" onClick={handleEnviar} disabled={enviando || !!assinatura || !!assinatura2}>
                Gerar sem assinaturas
              </button>
            </div>
          )}
        </div>
      </div>
      <Bandeirinhas />
    </div>
  );
}
