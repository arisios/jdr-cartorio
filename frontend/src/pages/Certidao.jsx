import React from 'react';
import { UPLOADS_URL } from '../utils/api';
import { TIPO_LABEL, TIPO_EMOJI } from '../utils/textos';

const formatDate = (dateStr) => {
  const d = dateStr ? new Date(dateStr) : new Date();
  return d.toLocaleDateString('pt-BR', { day:'numeric', month:'long', year:'numeric' });
};

export default function Certidao({ certidao }) {
  const { tipo, nome1, nome2, foto1_path, foto2_path, texto_usado, assinatura, assinatura2, carimbo, event_name, created_at } = certidao;
  const tipoLabel = TIPO_LABEL[tipo] || tipo;
  const tipoEmoji = TIPO_EMOJI[tipo] || '💍';

  return (
    <div id="certidao-doc" style={{ width:'100%', maxWidth:600, margin:'0 auto', background:'linear-gradient(135deg, #f7ead0 0%, #ede0b5 40%, #e5d4a0 100%)', borderRadius:12, padding:'32px 28px', position:'relative', fontFamily:'"IM Fell English","Playfair Display",Georgia,serif', boxShadow:'0 8px 40px rgba(58,31,20,0.2)', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:8, border:'2px solid rgba(199,154,59,0.5)', borderRadius:8, pointerEvents:'none' }}/>
      <div style={{ position:'absolute', inset:13, border:'1px solid rgba(199,154,59,0.25)', borderRadius:6, pointerEvents:'none' }}/>

      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:20, position:'relative', zIndex:1 }}>
        <div style={{ fontSize:10, letterSpacing:'0.3em', color:'#6F2DA8', fontFamily:'"DM Sans",sans-serif', fontWeight:700, textTransform:'uppercase', marginBottom:4 }}>
          Juninas do Rio · {event_name || 'Juninas 2026'}
        </div>
        <h1 style={{ fontSize:22, fontWeight:700, color:'#3A1F14', margin:'4px 0', letterSpacing:'0.05em' }}>
          CARTÓRIO JUNINO DA VILA
        </h1>
        <div style={{ fontSize:11, color:'#C79A3B', fontStyle:'italic', marginTop:2 }}>
          "Registre seus votos juninos."
        </div>
        <div style={{ width:80, height:2, background:'linear-gradient(90deg, transparent, #C79A3B, transparent)', margin:'10px auto 0' }}/>
      </div>

      {/* Tipo */}
      <div style={{ textAlign:'center', marginBottom:18, position:'relative', zIndex:1 }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(199,154,59,0.15)', border:'1px solid rgba(199,154,59,0.4)', borderRadius:8, padding:'6px 16px' }}>
          <span style={{ fontSize:18 }}>{tipoEmoji}</span>
          <span style={{ fontSize:12, fontWeight:700, color:'#4B1E6D', letterSpacing:'0.1em', textTransform:'uppercase', fontFamily:'"DM Sans",sans-serif' }}>
            CERTIDÃO DE {tipoLabel.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Fotos */}
      {(foto1_path || foto2_path) && (
        <div style={{ display:'flex', justifyContent:'center', gap:20, marginBottom:16, position:'relative', zIndex:1 }}>
          {[foto1_path, foto2_path].map((foto, i) => foto ? (
            <div key={i} style={{ textAlign:'center' }}>
              <div style={{ width:72, height:72, borderRadius:'50%', overflow:'hidden', border:'2.5px solid #C79A3B', boxShadow:'0 4px 12px rgba(58,31,20,0.2)' }}>
                <img src={`${UPLOADS_URL}/${foto}`} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} crossOrigin="anonymous"/>
              </div>
              <div style={{ fontSize:10, color:'#3A1F14', fontWeight:600, marginTop:4, fontFamily:'"DM Sans",sans-serif' }}>{i===0?nome1:nome2}</div>
            </div>
          ) : null)}
        </div>
      )}

      {/* Nomes */}
      <div style={{ textAlign:'center', marginBottom:14, position:'relative', zIndex:1 }}>
        <div style={{ fontSize:10, color:'#C79A3B', letterSpacing:'0.15em', textTransform:'uppercase', fontFamily:'"DM Sans",sans-serif', marginBottom:5 }}>As partes contratantes</div>
        <div style={{ fontSize:19, fontWeight:700, color:'#3A1F14', fontStyle:'italic' }}>
          {nome1}
          <span style={{ fontSize:13, fontWeight:400, color:'#6F2DA8', margin:'0 10px', fontStyle:'normal' }}>&amp;</span>
          {nome2}
        </div>
      </div>

      {/* Divisor */}
      <div style={{ display:'flex', alignItems:'center', gap:8, margin:'0 0 14px', position:'relative', zIndex:1 }}>
        <div style={{ flex:1, height:1, background:'rgba(199,154,59,0.3)' }}/>
        <span style={{ fontSize:12, color:'#C79A3B' }}>✦</span>
        <div style={{ flex:1, height:1, background:'rgba(199,154,59,0.3)' }}/>
      </div>

      {/* Texto oficial */}
      <div style={{ marginBottom:18, position:'relative', zIndex:1 }}>
        <p style={{ fontSize:12.5, lineHeight:1.85, color:'#3A1F14', textAlign:'justify', fontFamily:'"IM Fell English","Playfair Display",Georgia,serif', fontStyle:'italic', background:'rgba(255,255,255,0.3)', borderRadius:8, padding:'12px 14px', borderLeft:'3px solid #C79A3B' }}>
          {texto_usado}
        </p>
      </div>

      {/* Data e assinaturas */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:14, position:'relative', zIndex:1, gap:8 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:9, color:'#C79A3B', letterSpacing:'0.1em', textTransform:'uppercase', fontFamily:'"DM Sans",sans-serif', marginBottom:3 }}>Data</div>
          <div style={{ fontSize:11, color:'#3A1F14', fontStyle:'italic' }}>{formatDate(created_at)}</div>
        </div>
        <div style={{ flex:1.5, textAlign:'center' }}>
          <div style={{ fontSize:8, color:'#C79A3B', letterSpacing:'0.08em', textTransform:'uppercase', fontFamily:'"DM Sans",sans-serif', marginBottom:2 }}>{nome1}</div>
          {assinatura
            ? <img src={assinatura} alt="assinatura" style={{ height:40, maxWidth:'100%', objectFit:'contain' }} crossOrigin="anonymous"/>
            : <div style={{ borderBottom:'1px solid rgba(58,31,20,0.25)', height:40 }}/>
          }
        </div>
        <div style={{ flex:1.5, textAlign:'center' }}>
          <div style={{ fontSize:8, color:'#C79A3B', letterSpacing:'0.08em', textTransform:'uppercase', fontFamily:'"DM Sans",sans-serif', marginBottom:2 }}>{nome2}</div>
          {assinatura2
            ? <img src={assinatura2} alt="assinatura2" style={{ height:40, maxWidth:'100%', objectFit:'contain' }} crossOrigin="anonymous"/>
            : <div style={{ borderBottom:'1px solid rgba(58,31,20,0.25)', height:40 }}/>
          }
        </div>
      </div>

      {/* Rodapé */}
      <div style={{ textAlign:'center', position:'relative', zIndex:1 }}>
        <div style={{ width:60, height:1, background:'rgba(199,154,59,0.4)', margin:'0 auto 6px' }}/>
        <div style={{ fontSize:9, color:'rgba(58,31,20,0.45)', letterSpacing:'0.15em', textTransform:'uppercase', fontFamily:'"DM Sans",sans-serif' }}>
          Juninas do Rio · Documento Afetivo Oficial
        </div>
      </div>

      {/* Carimbo */}
      <div style={{ position:'absolute', bottom:36, right:20, transform:'rotate(-12deg)', border:'2.5px solid rgba(194,24,116,0.55)', borderRadius:8, padding:'5px 10px', background:'rgba(255,255,255,0.15)', zIndex:5 }}>
        <div style={{ fontSize:8.5, fontWeight:700, color:'rgba(194,24,116,0.7)', textTransform:'uppercase', letterSpacing:'0.06em', fontFamily:'"DM Sans",sans-serif', lineHeight:1.35, maxWidth:90, textAlign:'center' }}>
          {carimbo}
        </div>
      </div>

      {/* Selo */}
      <div style={{ position:'absolute', top:28, right:20, width:50, height:50, borderRadius:'50%', border:'2px solid rgba(199,154,59,0.5)', display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(199,154,59,0.08)', zIndex:5 }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:14 }}>🌽</div>
          <div style={{ fontSize:6, color:'#C79A3B', fontWeight:700, letterSpacing:'0.05em', fontFamily:'"DM Sans",sans-serif', textTransform:'uppercase' }}>VILA</div>
        </div>
      </div>
    </div>
  );
}
