const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../database/cartoriojunino.db');
let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

const TEXTOS_SEED = [
  {tipo:'amor',variacao:1,texto:'Fica oficialmente registrado perante esta Vila Junina que as partes acima identificadas assumem livremente a responsabilidade afetiva de ser o primeiro contato em caso de forró animado, saudade excessiva e qualquer situação que exija presença física imediata nas proximidades da fogueira.'},
  {tipo:'amor',variacao:2,texto:'Reconhece este Cartório Junino que os envolvidos demonstraram sinais evidentes de romance após permanência prolongada na mesma área de dança, trocas de olhares durante a quadrilha e compartilhamento voluntário de milho verde sem solicitação prévia.'},
  {tipo:'amor',variacao:3,texto:'As partes declaram, em livre e espontânea vontade, que passaram a dividir pensamentos românticos, playlists sofridas e a responsabilidade mútua de aparecer nas histórias do Instagram um do outro sem aviso prévio, causando especulações entre terceiros.'},
  {tipo:'amor',variacao:4,texto:'Lavrou-se o presente voto junino para registrar que o arrasta-pé aproximou oficialmente dois corações em situação aparentemente irreversível, conforme atestado pelo sanfoneiro e testemunhado pelo milho assado da barraca número três.'},
  {tipo:'comida',variacao:1,texto:'Fica oficialmente registrado perante esta Vila Junina que as partes acima identificadas assumem o compromisso irrevogável de dividir igualmente milho, canjica e qualquer alimento visualmente apetitoso adquirido durante os festejos, sob pena de exclusão da fila do milho.'},
  {tipo:'comida',variacao:2,texto:'Determina-se que toda pamonha, churrasquinho ou prato típico adquirido durante a festa pertence oficialmente às duas partes, sendo vedada a ingestão solitária de qualquer item classificado como bom demais pra comer sozinho perante esta Vila.'},
  {tipo:'comida',variacao:3,texto:'As partes assumem responsabilidade compartilhada por filas de comida, decisões impulsivas envolvendo doces e qualquer compra motivada por cheiro irresistível identificado a mais de dez metros de distância da barraca oficial.'},
  {tipo:'comida',variacao:4,texto:'Fica decretado que nenhum alimento considerado bom demais pra dividir poderá ser consumido escondido da outra parte, sob pena de ruptura imediata da Sociedade e vexame público perante a barraca do milho e seus frequentadores.'},
  {tipo:'quentao',variacao:1,texto:'Reconhece este Cartório Junino a união recreativa das partes acima qualificadas para fins festivos, emocionais e potencialmente históricos, com validade garantida até o encerramento da última música ou esgotamento do estoque de quentão, o que ocorrer primeiro.'},
  {tipo:'quentao',variacao:2,texto:'As partes comprometem-se a não abandonar uma à outra em situações envolvendo dança excessiva, perda temporária de coordenação motora ou qualquer episódio classificado como memorável na manhã seguinte à festa.'},
  {tipo:'quentao',variacao:3,texto:'Fica oficialmente autorizada a divisão proporcional de quentão, risadas altas e histórias que provavelmente serão esquecidas até a manhã seguinte mas registradas com carinho neste documento perante a Vila.'},
  {tipo:'quentao',variacao:4,texto:'Lavrou-se o presente documento para registrar que qualquer ideia considerada ruim após meia-noite passa automaticamente a ser responsabilidade conjunta das partes, sem possibilidade de atribuição individual do resultado.'},
  {tipo:'forro',variacao:1,texto:'Declaram as partes, em livre e espontânea vontade, estarem oficialmente vinculadas para fins de dança agarradinha, giro sincronizado e qualquer movimento considerado tecnicamente improvável mas emocionalmente necessário na pista.'},
  {tipo:'forro',variacao:2,texto:'Fica estabelecido que qualquer execução de forró considerada boa demais pra ficar parado exige comparecimento imediato de ambas as partes na pista, independentemente do estado físico, emocional ou calçado utilizado no momento.'},
  {tipo:'forro',variacao:3,texto:'As partes reconhecem que abandonar o par durante música animada poderá ser interpretado como quebra contratual perante esta Vila, sujeito a análise do sanfoneiro e deliberação do comitê do arrasta-pé.'},
  {tipo:'forro',variacao:4,texto:'O presente voto junino entra em vigor imediatamente após o primeiro passo sincronizado e permanece válido até o encerramento oficial da última música, conforme programação do evento ou decisão espontânea do acordeonista.'},
  {tipo:'bagunca',variacao:1,texto:'Reconhece este Cartório Junino que as partes acima demonstram comportamento incompatível com a tranquilidade da Vila, sendo sua presença simultânea classificada como fator de risco moderado para a ordem pública do arrasta-pé.'},
  {tipo:'bagunca',variacao:2,texto:'As partes assumem conjuntamente responsabilidade por risadas excessivas, coreografias mal executadas e qualquer deslize social ocorrido no perímetro da festa, sendo vedada a atribuição de culpa individual perante terceiros.'},
  {tipo:'bagunca',variacao:3,texto:'Fica registrado que, caso uma das partes tenha uma ideia claramente duvidosa, a outra provavelmente aceitará participar sem resistência significativa, e ambas arcarão igualmente com as consequências perante a Vila.'},
  {tipo:'bagunca',variacao:4,texto:'Lavrou-se o presente documento para oficializar esta parceria reconhecida como ameaça moderada à ordem do arrasta-pé, cujos membros se comprometem a causar alegria, confusão e pelo menos uma história boa por noite de festa.'},
  {tipo:'quadrilha',variacao:1,texto:'Fica reconhecida oficialmente perante esta Vila a amizade junina das partes acima qualificadas, unidas pela tradição, pelo improviso na quadrilha e pelo compromisso tácito de aparecer fantasiados sem combinar previamente.'},
  {tipo:'quadrilha',variacao:2,texto:'As partes assumem o dever moral de ocupar lugar estratégico próximo ao milho e incentivar terceiros a participar do arrasta-pé, mediante promessas de que a música está boa e que a fila da comida anda rápido.'},
  {tipo:'quadrilha',variacao:3,texto:'Determina-se que qualquer grito de olha a chuva deverá ser respondido com entusiasmo proporcional à animação da quadrilha, independentemente das condições climáticas reais verificadas no momento do aviso.'},
  {tipo:'quadrilha',variacao:4,texto:'Lavrou-se o presente registro para eternizar parceria oficialmente aprovada pelo sanfoneiro da Vila, cujos membros se comprometem a aparecer na quadrilha mesmo sem saber os passos e a fingir que sabem com convicção.'},
  {tipo:'arrastape',variacao:1,texto:'Reconhece este Cartório Junino que as partes acima identificadas apresentam nível elevado de resistência física em ambiente festivo, tendo sido observadas em pista de dança por períodos que desafiam explicação médica convencional.'},
  {tipo:'arrastape',variacao:2,texto:'As partes comprometem-se a permanecer no clima da festa até a última música, mesmo após sinais evidentes de cansaço, fome extrema ou qualquer comunicado oficial de encerramento por parte da organização do evento.'},
  {tipo:'arrastape',variacao:3,texto:'Fica oficialmente decretado que qualquer tentativa de ir embora antes do encerramento da quadrilha deverá ser debatida entre as partes por período mínimo de duas músicas, com direito a recurso junto ao sanfoneiro.'},
  {tipo:'arrastape',variacao:4,texto:'Lavrou-se o presente documento para oficializar dupla reconhecida por transformar qualquer forró em evento de longa duração, cuja presença é considerada fator determinante para o sucesso da festa perante a Vila Junina.'},
];

const CARIMBOS = [
  'Reconhecido pela quadrilha','União aprovada pela sanfona','Documento afetivo oficial',
  'Válido até acabar o milho','Autenticado no arrasta-pé','Certificado pelo forrozeiro-mor',
  'Testemunhado pelo cangaceiro','Aprovado na fogueira de São João','Reconhecido pelo milho dourado',
  'Validado pela canjica oficial','Homologado pelo comitê do forró','Reconhecido perante a Vila Junina',
];

function randomCarimbo() {
  return CARIMBOS[Math.floor(Math.random() * CARIMBOS.length)];
}

function randomTexto(tipo) {
  const db = getDb();
  const textos = db.prepare("SELECT * FROM textos WHERE tipo=? AND ativo=1").all(tipo);
  if (!textos.length) return null;
  return textos[Math.floor(Math.random() * textos.length)];
}

function initDb() {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS textos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL,
      variacao INTEGER NOT NULL,
      texto TEXT NOT NULL,
      ativo INTEGER DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS certidoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL,
      nome1 TEXT NOT NULL,
      nome2 TEXT NOT NULL,
      foto1_path TEXT,
      foto2_path TEXT,
      texto_id INTEGER,
      texto_usado TEXT NOT NULL,
      assinatura TEXT,
      carimbo TEXT NOT NULL,
      cert_token TEXT UNIQUE NOT NULL,
      event_name TEXT DEFAULT 'Juninas 2026',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const count = db.prepare('SELECT COUNT(*) as c FROM textos').get().c;
  if (count === 0) {
    const ins = db.prepare('INSERT INTO textos (tipo,variacao,texto) VALUES (?,?,?)');
    for (const t of TEXTOS_SEED) ins.run(t.tipo, t.variacao, t.texto);
    console.log('✅ 28 textos oficiais criados');
  }

  require('../../../../shared/users-db').getUsersDb();
  console.log('✅ Banco Cartório Junino inicializado');
  return db;
}

module.exports = { getDb, initDb, randomCarimbo, randomTexto, CARIMBOS };
