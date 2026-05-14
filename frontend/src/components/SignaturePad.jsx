import React, { useRef, useEffect, useState } from 'react';
export default function SignaturePad({ onChange }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#1a0a2e'; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
    };

    const start = (e) => { e.preventDefault(); drawing.current = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
    const draw = (e) => { e.preventDefault(); if (!drawing.current) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); setIsEmpty(false); };
    const stop = () => { drawing.current = false; if (!isEmpty) onChange(canvas.toDataURL()); };

    canvas.addEventListener('mousedown', start); canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stop); canvas.addEventListener('mouseleave', stop);
    canvas.addEventListener('touchstart', start, {passive:false}); canvas.addEventListener('touchmove', draw, {passive:false});
    canvas.addEventListener('touchend', stop);
    return () => {
      canvas.removeEventListener('mousedown', start); canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stop); canvas.removeEventListener('mouseleave', stop);
      canvas.removeEventListener('touchstart', start); canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stop);
    };
  }, [onChange, isEmpty]);

  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true); onChange(null);
  };

  return (
    <div>
      <canvas ref={canvasRef} width={600} height={150} style={{ border:'1.5px solid rgba(199,154,59,0.4)', borderRadius:8, background:'rgba(255,255,255,0.6)', display:'block', width:'100%', touchAction:'none', cursor:'crosshair' }}/>
      <div className="flex justify-between items-center mt-1.5">
        <span className="text-xs" style={{color:'rgba(58,31,20,0.4)'}}>Assine com o dedo ou mouse</span>
        {!isEmpty && <button type="button" onClick={clear} className="text-xs font-medium" style={{color:'#C21874',background:'none',border:'none',cursor:'pointer'}}>Limpar</button>}
      </div>
    </div>
  );
}
