import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Certidao from './Certidao';
import Bandeirinhas from '../components/Bandeirinhas';

export default function Resultado({ data, onNew }) {
  const [downloading, setDownloading] = useState('');
  const { certidao, cert_token } = data;
  const shareUrl = `${window.location.origin}/c/${cert_token}`;

  const downloadPNG = async () => {
    setDownloading('png');
    try {
      const canvas = await window.html2canvas(document.getElementById('certidao-doc'), { scale: 2.5, useCORS: true, backgroundColor: null, logging: false });
      const link = document.createElement('a');
      link.download = `certidao-junina-${certidao.nome1}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Imagem baixada!');
    } catch { toast.error('Erro ao baixar imagem'); }
    finally { setDownloading(''); }
  };

  const downloadPDF = async () => {
    setDownloading('pdf');
    try {
      const canvas = await window.html2canvas(document.getElementById('certidao-doc'), { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, (297 - pdfHeight) / 2, pdfWidth, pdfHeight);
      pdf.save(`certidao-junina-${certidao.nome1}.pdf`);
      toast.success('PDF baixado!');
    } catch { toast.error('Erro ao gerar PDF'); }
    finally { setDownloading(''); }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copiado!');
  };

  return (
    <div className="min-h-screen bg-junina flex flex-col">
      <Bandeirinhas />
      <div className="flex-1 px-3 py-6">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-5 animate-pop">
            <div className="text-5xl mb-2">🎉</div>
            <h2 className="font-display text-2xl font-bold" style={{color:'#4B1E6D'}}>Certidão emitida!</h2>
            <p className="text-sm mt-1" style={{color:'rgba(58,31,20,0.5)'}}>Documento oficial das Juninas do Rio</p>
          </div>

          {/* Certidão */}
          <div className="mb-5 animate-slide-up">
            <Certidao certidao={certidao}/>
          </div>

          {/* Botões de download */}
          <div className="card-junina p-4 mb-4">
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{color:'#C79A3B'}}>Baixar e compartilhar</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button onClick={downloadPNG} disabled={!!downloading}
                className="py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                style={{background:'rgba(0,124,145,0.12)',color:'#007C91',border:'1.5px solid rgba(0,124,145,0.25)'}}>
                {downloading==='png' ? '...' : '🖼 Baixar PNG'}
              </button>
              <button onClick={downloadPDF} disabled={!!downloading}
                className="py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                style={{background:'rgba(194,24,116,0.1)',color:'#C21874',border:'1.5px solid rgba(194,24,116,0.25)'}}>
                {downloading==='pdf' ? '...' : '📄 Baixar PDF'}
              </button>
            </div>
            <button onClick={copyLink} className="w-full py-2.5 rounded-xl text-sm font-semibold"
              style={{background:'rgba(199,154,59,0.15)',color:'#C79A3B',border:'1.5px solid rgba(199,154,59,0.3)'}}>
              🔗 Copiar link para compartilhar
            </button>
          </div>

          <button className="btn-primary" onClick={onNew}>💍 Gerar outra certidão</button>
        </div>
      </div>
      <Bandeirinhas />
    </div>
  );
}
