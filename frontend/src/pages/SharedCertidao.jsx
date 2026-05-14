import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import Certidao from './Certidao';
import Bandeirinhas from '../components/Bandeirinhas';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SharedCertidao() {
  const { token } = useParams();
  const [certidao, setCertidao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/certidoes/token/${token}`)
      .then(res => setCertidao(res.data.certidao))
      .catch(() => setError('Certidão não encontrada'))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-junina flex flex-col">
      <Bandeirinhas />
      <div className="flex-1 px-3 py-8">
        <div className="max-w-lg mx-auto">
          {loading && <div className="flex justify-center py-16"><LoadingSpinner size="lg" text="Carregando certidão..."/></div>}
          {error && (
            <div className="card-junina p-12 text-center">
              <span className="text-5xl block mb-3">💍</span>
              <p className="font-display text-lg" style={{color:'#4B1E6D'}}>{error}</p>
            </div>
          )}
          {certidao && (
            <div className="animate-slide-up">
              <div className="text-center mb-5">
                <p className="text-sm" style={{color:'rgba(58,31,20,0.5)'}}>Certidão oficial das Juninas do Rio</p>
              </div>
              <Certidao certidao={certidao}/>
            </div>
          )}
        </div>
      </div>
      <Bandeirinhas />
    </div>
  );
}
