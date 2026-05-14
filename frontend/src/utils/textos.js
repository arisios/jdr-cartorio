export const TIPOS = [
  {id:'amor',      emoji:'❤️', label:'União por Amor'},
  {id:'comida',    emoji:'🌽', label:'Sociedade da Comida Típica'},
  {id:'quentao',   emoji:'🍻', label:'Sociedade do Quentão'},
  {id:'forro',     emoji:'🪗', label:'Par Oficial do Forró'},
  {id:'bagunca',   emoji:'😂', label:'Parceiros da Bagunça'},
  {id:'quadrilha', emoji:'👒', label:'Compadres da Quadrilha'},
  {id:'arrastape', emoji:'🎶', label:'Dupla do Arrasta-pé'},
];

export const TIPO_LABEL = Object.fromEntries(TIPOS.map(t => [t.id, t.label]));
export const TIPO_EMOJI = Object.fromEntries(TIPOS.map(t => [t.id, t.emoji]));
