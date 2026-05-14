import React from 'react';
import { useNavigate } from 'react-router-dom';
import Bandeirinhas from '../components/Bandeirinhas';
import { TIPOS } from '../utils/textos';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-junina flex flex-col">
      <Bandeirinhas />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm text-center animate-slide-up">
          <div className="text-6xl mb-5 animate-float inline-block">💍</div>
          <h1 className="font-display text-3xl font-bold mb-2" style={{color:'#4B1E6D'}}>Cartório Junino da Vila</h1>
          <p className="text-base italic mb-8" style={{color:'#C79A3B'}}>"Registre seus votos juninos."</p>

          <div className="card-junina p-4 mb-6 text-left">
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{color:'#C79A3B'}}>Tipos de certidão disponíveis</p>
            <div className="grid grid-cols-2 gap-2">
              {TIPOS.map(t => (
                <div key={t.id} className="flex items-center gap-2 text-sm" style={{color:'#4B1E6D'}}>
                  <span>{t.emoji}</span><span>{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-primary text-lg py-4 mb-3" onClick={() => navigate('/registrar')}>
            💍 Registrar Nossa União
          </button>
          <p className="text-xs" style={{color:'rgba(58,31,20,0.4)'}}>Rápido, gratuito e instagramável</p>
        </div>
      </div>
      <Bandeirinhas />
    </div>
  );
}
