import type { QuizQuestion } from './types';

/**
 * Quiz questions for the secondary sages (see philosophers-extra.ts).
 * Convention: the FIRST option is always the correct answer.
 */
export const quizzesExtra: QuizQuestion[] = [
  // ── Xunzi ──────────────────────────────────────────────────────────────
  {
    id: 'xunzi-1',
    philosopherSlug: 'xunzi',
    prompt: { en: 'What was Xunzi\'s view of human nature?', pt: 'Qual era a visão de Xunzi sobre a natureza humana?' },
    options: {
      en: ['It is bad and must be reformed by culture', 'It is innately good', 'It does not exist', 'It is divine'],
      pt: ['É má e deve ser reformada pela cultura', 'É inatamente boa', 'Não existe', 'É divina'],
    },
    explanation: { en: 'Against Mencius, Xunzi held that goodness is achieved through ritual and learning.', pt: 'Contra Mêncio, Xunzi sustentava que a bondade se conquista pelo ritual e pelo aprendizado.' },
  },
  {
    id: 'xunzi-2',
    philosopherSlug: 'xunzi',
    prompt: { en: 'Which two famous Legalists studied under Xunzi?', pt: 'Quais dois famosos legalistas estudaram com Xunzi?' },
    options: {
      en: ['Han Feizi and Li Si', 'Shang Yang and Mozi', 'Laozi and Zhuangzi', 'Confucius and Mencius'],
      pt: ['Han Feizi e Li Si', 'Shang Yang e Mozi', 'Laozi e Zhuangzi', 'Confúcio e Mêncio'],
    },
    explanation: { en: 'His pupils Han Feizi and Li Si became architects of the Legalist Qin.', pt: 'Seus alunos Han Feizi e Li Si tornaram-se arquitetos do Qin legalista.' },
  },

  // ── Zhu Xi ─────────────────────────────────────────────────────────────
  {
    id: 'zhu-xi-1',
    philosopherSlug: 'zhu-xi',
    prompt: { en: 'Zhu Xi was the great synthesizer of which movement?', pt: 'Zhu Xi foi o grande sintetizador de qual movimento?' },
    options: {
      en: ['Neo-Confucianism', 'Legalism', 'Pure Land Buddhism', 'Mohism'],
      pt: ['Neoconfucionismo', 'Legalismo', 'Budismo da Terra Pura', 'Moísmo'],
    },
    explanation: { en: 'He revived Confucianism with a new metaphysics of li (principle) and qi (force).', pt: 'Reavivou o confucionismo com uma nova metafísica de li (princípio) e qi (força).' },
  },
  {
    id: 'zhu-xi-2',
    philosopherSlug: 'zhu-xi',
    prompt: { en: 'What did Zhu Xi canonize for the imperial examinations?', pt: 'O que Zhu Xi canonizou para os exames imperiais?' },
    options: {
      en: ['The "Four Books"', 'The Tao Te Ching', 'The Pali Canon', 'The Book of Five Rings'],
      pt: ['Os "Quatro Livros"', 'O Tao Te Ching', 'O Cânone Páli', 'O Livro dos Cinco Anéis'],
    },
    explanation: { en: 'His edition of the Four Books shaped the exams for some six centuries.', pt: 'Sua edição dos Quatro Livros moldou os exames por cerca de seis séculos.' },
  },

  // ── Liezi ──────────────────────────────────────────────────────────────
  {
    id: 'liezi-1',
    philosopherSlug: 'liezi',
    prompt: { en: 'The Liezi is counted among the classics of which tradition?', pt: 'O Liezi é contado entre os clássicos de qual tradição?' },
    options: {
      en: ['Taoism', 'Confucianism', 'Legalism', 'Zen'],
      pt: ['Taoísmo', 'Confucionismo', 'Legalismo', 'Zen'],
    },
    explanation: { en: 'It is the third great Taoist classic, after the Tao Te Ching and Zhuangzi.', pt: 'É o terceiro grande clássico taoísta, após o Tao Te Ching e o Zhuangzi.' },
  },
  {
    id: 'liezi-2',
    philosopherSlug: 'liezi',
    prompt: { en: 'According to legend, what could Liezi do?', pt: 'Segundo a lenda, o que Liezi podia fazer?' },
    options: {
      en: ['Ride upon the wind', 'Turn lead into gold', 'Speak with the dead', 'Stop the sun'],
      pt: ['Cavalgar o vento', 'Transformar chumbo em ouro', 'Falar com os mortos', 'Deter o sol'],
    },
    explanation: { en: 'Riding the wind symbolizes perfect harmony with the natural flow.', pt: 'Cavalgar o vento simboliza a harmonia perfeita com o fluxo natural.' },
  },

  // ── Wang Bi ────────────────────────────────────────────────────────────
  {
    id: 'wang-bi-1',
    philosopherSlug: 'wang-bi',
    prompt: { en: 'Wang Bi is famous for his commentary on which text?', pt: 'Wang Bi é famoso por seu comentário a qual texto?' },
    options: {
      en: ['The Tao Te Ching', 'The Analects', 'The Dhammapada', 'The Hagakure'],
      pt: ['O Tao Te Ching', 'Os Analectos', 'O Dhammapada', 'O Hagakure'],
    },
    explanation: { en: 'His commentary became the classic philosophical reading of the text.', pt: 'Seu comentário tornou-se a leitura filosófica clássica do texto.' },
  },
  {
    id: 'wang-bi-2',
    philosopherSlug: 'wang-bi',
    prompt: { en: 'What did Wang Bi make the ground of all being?', pt: 'O que Wang Bi fez o fundamento de todo ser?' },
    options: {
      en: ['Non-being (wu)', 'Law (fa)', 'The self (atman)', 'Ritual (li)'],
      pt: ['O não-ser (wu)', 'A lei (fa)', 'O eu (atman)', 'O ritual (li)'],
    },
    explanation: { en: 'For Wang Bi, all being arises from a nameless "non-being".', pt: 'Para Wang Bi, todo ser surge de um "não-ser" sem nome.' },
  },

  // ── Shen Buhai ─────────────────────────────────────────────────────────
  {
    id: 'shen-buhai-1',
    philosopherSlug: 'shen-buhai',
    prompt: { en: 'Which pillar of Legalism is Shen Buhai credited with developing?', pt: 'Qual pilar do legalismo é creditado a Shen Buhai?' },
    options: {
      en: ['Shu (administrative technique)', 'Fa (law)', 'Ren (humaneness)', 'Wu wei (non-action)'],
      pt: ['Shu (técnica administrativa)', 'Fa (lei)', 'Ren (humanidade)', 'Wu wei (não-ação)'],
    },
    explanation: { en: 'He focused on shu, the techniques of managing officials.', pt: 'Ele se concentrou no shu, as técnicas de gerir os funcionários.' },
  },
  {
    id: 'shen-buhai-2',
    philosopherSlug: 'shen-buhai',
    prompt: { en: 'Shen Buhai served as chancellor of which state?', pt: 'Shen Buhai foi chanceler de qual Estado?' },
    options: {
      en: ['Han', 'Qin', 'Lu', 'Chu'],
      pt: ['Han', 'Qin', 'Lu', 'Chu'],
    },
    explanation: { en: 'He governed the state of Han for some fifteen years.', pt: 'Governou o Estado de Han por cerca de quinze anos.' },
  },

  // ── Li Si ──────────────────────────────────────────────────────────────
  {
    id: 'li-si-1',
    philosopherSlug: 'li-si',
    prompt: { en: 'As chancellor of Qin, what did Li Si famously standardize?', pt: 'Como chanceler de Qin, o que Li Si famosamente padronizou?' },
    options: {
      en: ['The script, weights and measures', 'The calendar of festivals', 'The rules of poetry', 'The tea ceremony'],
      pt: ['A escrita, os pesos e as medidas', 'O calendário de festas', 'As regras da poesia', 'A cerimônia do chá'],
    },
    explanation: { en: 'He unified writing, weights, measures and law across the empire.', pt: 'Unificou escrita, pesos, medidas e leis por todo o império.' },
  },
  {
    id: 'li-si-2',
    philosopherSlug: 'li-si',
    prompt: { en: 'Li Si was a student of which philosopher?', pt: 'Li Si foi discípulo de qual filósofo?' },
    options: {
      en: ['Xunzi', 'Mozi', 'Laozi', 'Mencius'],
      pt: ['Xunzi', 'Mozi', 'Laozi', 'Mêncio'],
    },
    explanation: { en: 'He studied under the Confucian Xunzi, alongside Han Feizi.', pt: 'Estudou com o confuciano Xunzi, ao lado de Han Feizi.' },
  },

  // ── Qin Huali ──────────────────────────────────────────────────────────
  {
    id: 'qin-huali-1',
    philosopherSlug: 'qin-huali',
    prompt: { en: 'Qin Huali was the chief disciple of whom?', pt: 'Qin Huali foi o principal discípulo de quem?' },
    options: {
      en: ['Mozi', 'Confucius', 'Laozi', 'Han Feizi'],
      pt: ['Mozi', 'Confúcio', 'Laozi', 'Han Feizi'],
    },
    explanation: { en: 'He carried the Mohist movement forward after Mozi.', pt: 'Levou adiante o movimento moísta depois de Mozi.' },
  },
  {
    id: 'qin-huali-2',
    philosopherSlug: 'qin-huali',
    prompt: { en: 'Which practical art did Qin Huali help preserve?', pt: 'Qual arte prática Qin Huali ajudou a preservar?' },
    options: {
      en: ['The defense of besieged cities', 'Court poetry', 'Alchemy', 'Landscape painting'],
      pt: ['A defesa de cidades sitiadas', 'A poesia de corte', 'A alquimia', 'A pintura de paisagem'],
    },
    explanation: { en: 'The Mohists were famous engineers of city defense against aggressive war.', pt: 'Os moístas eram célebres engenheiros da defesa de cidades contra a guerra agressiva.' },
  },

  // ── Vasubandhu ─────────────────────────────────────────────────────────
  {
    id: 'vasubandhu-1',
    philosopherSlug: 'vasubandhu',
    prompt: { en: 'Vasubandhu helped found which Mahayana school?', pt: 'Vasubandhu ajudou a fundar qual escola Mahayana?' },
    options: {
      en: ['Yogācāra ("Mind-Only")', 'Madhyamaka', 'Theravada', 'Pure Land'],
      pt: ['Yogācāra ("Só-Mente")', 'Madhyamaka', 'Theravada', 'Terra Pura'],
    },
    explanation: { en: 'With Asanga he founded the "Mind-Only" Yogācāra school.', pt: 'Com Asanga, fundou a escola Yogācāra do "Só-Mente".' },
  },
  {
    id: 'vasubandhu-2',
    philosopherSlug: 'vasubandhu',
    prompt: { en: 'His Abhidharmakośa is a classic encyclopedia of what?', pt: 'Seu Abhidharmakośa é uma enciclopédia clássica de quê?' },
    options: {
      en: ['Buddhist psychology', 'Military strategy', 'Court ritual', 'Astronomy'],
      pt: ['Psicologia budista', 'Estratégia militar', 'Ritual de corte', 'Astronomia'],
    },
    explanation: { en: 'The Abhidharmakośa systematizes the analysis of mind and experience.', pt: 'O Abhidharmakośa sistematiza a análise da mente e da experiência.' },
  },

  // ── Buddhaghosa ────────────────────────────────────────────────────────
  {
    id: 'buddhaghosa-1',
    philosopherSlug: 'buddhaghosa',
    prompt: { en: 'Buddhaghosa was the great scholar of which Buddhist tradition?', pt: 'Buddhaghosa foi o grande erudito de qual tradição budista?' },
    options: {
      en: ['Theravada', 'Zen', 'Vajrayana', 'Yogācāra'],
      pt: ['Theravada', 'Zen', 'Vajrayana', 'Yogācāra'],
    },
    explanation: { en: 'He worked on the Pali Canon of Theravada Buddhism in Sri Lanka.', pt: 'Trabalhou sobre o Cânone Páli do budismo Theravada no Sri Lanka.' },
  },
  {
    id: 'buddhaghosa-2',
    philosopherSlug: 'buddhaghosa',
    prompt: { en: 'What is the name of Buddhaghosa\'s great manual of practice?', pt: 'Qual o nome do grande manual de prática de Buddhaghosa?' },
    options: {
      en: ['The Visuddhimagga', 'The Platform Sutra', 'The Heart Sutra', 'The Analects'],
      pt: ['O Visuddhimagga', 'O Sutra do Estrado', 'O Sutra do Coração', 'Os Analectos'],
    },
    explanation: { en: 'The Visuddhimagga, the "Path of Purification", guides Theravada practice.', pt: 'O Visuddhimagga, o "Caminho da Purificação", guia a prática Theravada.' },
  },

  // ── Huineng ────────────────────────────────────────────────────────────
  {
    id: 'huineng-1',
    philosopherSlug: 'huineng',
    prompt: { en: 'Huineng is revered as which patriarch of Chan?', pt: 'Huineng é venerado como qual patriarca do Chan?' },
    options: {
      en: ['The Sixth', 'The First', 'The Tenth', 'The Second'],
      pt: ['O Sexto', 'O Primeiro', 'O Décimo', 'O Segundo'],
    },
    explanation: { en: 'He is the Sixth Patriarch, the most pivotal after Bodhidharma.', pt: 'É o Sexto Patriarca, o mais decisivo depois de Bodhidharma.' },
  },
  {
    id: 'huineng-2',
    philosopherSlug: 'huineng',
    prompt: { en: 'What did Huineng champion as the path to awakening?', pt: 'O que Huineng defendeu como caminho do despertar?' },
    options: {
      en: ['Sudden awakening', 'Gradual ritual purification', 'Memorizing scriptures', 'Ascetic starvation'],
      pt: ['O despertar súbito', 'A purificação ritual gradual', 'Memorizar escrituras', 'A inanição ascética'],
    },
    explanation: { en: 'He taught direct, sudden insight into one\'s own nature.', pt: 'Ensinou a intuição direta e súbita da própria natureza.' },
  },

  // ── Hakuin ─────────────────────────────────────────────────────────────
  {
    id: 'hakuin-1',
    philosopherSlug: 'hakuin',
    prompt: { en: 'Which famous koan did Hakuin create?', pt: 'Qual koan famoso Hakuin criou?' },
    options: {
      en: ['The sound of one hand', 'The dog\'s Buddha-nature', 'The flag and the wind', 'The ox and its herder'],
      pt: ['O som de uma só mão', 'A natureza-búdica do cão', 'A bandeira e o vento', 'O boi e seu pastor'],
    },
    explanation: { en: '"What is the sound of one hand?" is his best-known koan.', pt: '"Qual é o som de uma só mão?" é seu koan mais conhecido.' },
  },
  {
    id: 'hakuin-2',
    philosopherSlug: 'hakuin',
    prompt: { en: 'Hakuin revived which school of Japanese Zen?', pt: 'Hakuin revitalizou qual escola do Zen japonês?' },
    options: {
      en: ['Rinzai', 'Sōtō', 'Tendai', 'Shingon'],
      pt: ['Rinzai', 'Sōtō', 'Tendai', 'Shingon'],
    },
    explanation: { en: 'He single-handedly revived and systematized Rinzai koan practice.', pt: 'Revitalizou e sistematizou sozinho a prática de koans Rinzai.' },
  },

  // ── Ramanuja ───────────────────────────────────────────────────────────
  {
    id: 'ramanuja-1',
    philosopherSlug: 'ramanuja',
    prompt: { en: 'Ramanuja founded which school of Vedanta?', pt: 'Ramanuja fundou qual escola do Vedanta?' },
    options: {
      en: ['Vishishtadvaita (qualified non-dualism)', 'Advaita (non-dualism)', 'Madhyamaka', 'Yogācāra'],
      pt: ['Vishishtadvaita (não-dualismo qualificado)', 'Advaita (não-dualismo)', 'Madhyamaka', 'Yogācāra'],
    },
    explanation: { en: 'His "qualified non-dualism" made room for a personal God and devotion.', pt: 'Seu "não-dualismo qualificado" abriu espaço para um Deus pessoal e a devoção.' },
  },
  {
    id: 'ramanuja-2',
    philosopherSlug: 'ramanuja',
    prompt: { en: 'What did Ramanuja make central to liberation?', pt: 'O que Ramanuja fez central para a libertação?' },
    options: {
      en: ['Loving devotion (bhakti)', 'Impartial law', 'Silent sitting', 'Ritual sacrifice'],
      pt: ['A devoção amorosa (bhakti)', 'A lei imparcial', 'O sentar silencioso', 'O sacrifício ritual'],
    },
    explanation: { en: 'For Ramanuja, liberation comes through bhakti, loving surrender to God.', pt: 'Para Ramanuja, a libertação vem pela bhakti, a entrega amorosa a Deus.' },
  },

  // ── Madhva ─────────────────────────────────────────────────────────────
  {
    id: 'madhva-1',
    philosopherSlug: 'madhva',
    prompt: { en: 'Madhva founded which school of Vedanta?', pt: 'Madhva fundou qual escola do Vedanta?' },
    options: {
      en: ['Dvaita (dualism)', 'Advaita (non-dualism)', 'Legalism', 'Theravada'],
      pt: ['Dvaita (dualismo)', 'Advaita (não-dualismo)', 'Legalismo', 'Theravada'],
    },
    explanation: { en: 'Dvaita keeps God, souls and matter eternally distinct.', pt: 'O Dvaita mantém Deus, almas e matéria eternamente distintos.' },
  },
  {
    id: 'madhva-2',
    philosopherSlug: 'madhva',
    prompt: { en: 'How did Madhva differ most sharply from Shankara?', pt: 'Em que Madhva mais se distinguia de Shankara?' },
    options: {
      en: ['He insisted on real difference, not ultimate oneness', 'He denied God entirely', 'He rejected the Upanishads', 'He taught non-action'],
      pt: ['Insistia na diferença real, não na unidade última', 'Negava Deus por completo', 'Rejeitava os Upanixades', 'Ensinava a não-ação'],
    },
    explanation: { en: 'Against Advaita\'s oneness, Madhva held difference to be the nature of reality.', pt: 'Contra a unidade do Advaita, Madhva via a diferença como a natureza da realidade.' },
  },

  // ── Takuan ─────────────────────────────────────────────────────────────
  {
    id: 'takuan-1',
    philosopherSlug: 'takuan',
    prompt: { en: 'Takuan Sōhō linked Zen practice to what?', pt: 'Takuan Sōhō ligou a prática Zen a quê?' },
    options: {
      en: ['The way of the sword', 'The art of poetry alone', 'Court administration', 'Sea navigation'],
      pt: ['O caminho da espada', 'Apenas a arte da poesia', 'A administração da corte', 'A navegação marítima'],
    },
    explanation: { en: 'His letters on "the unfettered mind" shaped the spirit of Bushidō.', pt: 'Suas cartas sobre "a mente sem amarras" moldaram o espírito do Bushidō.' },
  },
  {
    id: 'takuan-2',
    philosopherSlug: 'takuan',
    prompt: { en: 'What is the core of Takuan\'s teaching for the warrior?', pt: 'Qual é o cerne do ensino de Takuan para o guerreiro?' },
    options: {
      en: ['The mind must not stop or fixate', 'Strike first, always', 'Trust only armor', 'Never train alone'],
      pt: ['A mente não deve parar nem se fixar', 'Golpear primeiro, sempre', 'Confiar só na armadura', 'Nunca treinar sozinho'],
    },
    explanation: { en: 'A mind that sticks to anything — fear, the blade — is already defeated.', pt: 'Uma mente que se prende a algo — o medo, a lâmina — já está derrotada.' },
  },

  // ── Nitobe ─────────────────────────────────────────────────────────────
  {
    id: 'nitobe-1',
    philosopherSlug: 'nitobe',
    prompt: { en: 'Nitobe Inazō is best known for writing what?', pt: 'Nitobe Inazō é mais conhecido por escrever o quê?' },
    options: {
      en: ['"Bushidō: The Soul of Japan"', '"The Book of Five Rings"', '"The Hagakure"', '"The Analects"'],
      pt: ['"Bushidō: A Alma do Japão"', '"O Livro dos Cinco Anéis"', '"O Hagakure"', '"Os Analectos"'],
    },
    explanation: { en: 'In 1900 he explained the samurai code to the West in English.', pt: 'Em 1900, explicou o código samurai ao Ocidente, em inglês.' },
  },
  {
    id: 'nitobe-2',
    philosopherSlug: 'nitobe',
    prompt: { en: 'Besides scholarship, what international role did Nitobe hold?', pt: 'Além da erudição, que papel internacional Nitobe ocupou?' },
    options: {
      en: ['Under-Secretary General of the League of Nations', 'Emperor of Japan', 'Shogun', 'Pope'],
      pt: ['Subsecretário-geral da Liga das Nações', 'Imperador do Japão', 'Xogum', 'Papa'],
    },
    explanation: { en: 'He was a diplomat and an Under-Secretary General of the League of Nations.', pt: 'Foi diplomata e subsecretário-geral da Liga das Nações.' },
  },
];
