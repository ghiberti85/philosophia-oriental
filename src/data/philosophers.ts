import type { Philosopher } from './types';

/**
 * The sages of the eight schools. Each entry is fully bilingual and
 * cross-referenced with its school(s); the data-integrity test guarantees
 * every reference resolves and every locale is filled in.
 */
export const philosophers: Philosopher[] = [
  {
    slug: 'confucius',
    name: { en: 'Confucius', pt: 'Confúcio' },
    years: { en: '551–479 BC', pt: '551–479 a.C.' },
    birthplace: { en: 'Qufu, State of Lu', pt: 'Qufu, Estado de Lu' },
    schoolSlugs: ['confucianism'],
    epithet: { en: 'The First Teacher', pt: 'O Primeiro Mestre' },
    biography: {
      en: [
        'Kong Qiu, known in the West as Confucius, was born into modest circumstances in the State of Lu during the turbulent Spring and Autumn period. Largely self-taught, he became a teacher who accepted students regardless of class, and briefly held office before spending years wandering between states in a frustrated search for a ruler who would put his ethics into practice.',
        'He claimed to transmit rather than invent, looking back to the sage-kings of antiquity. Yet by reframing nobility as moral cultivation rather than birth, he quietly revolutionised Chinese thought. His conversations, recorded by disciples as the Analects, became the most influential book in East Asian history.',
      ],
      pt: [
        'Kong Qiu, conhecido no Ocidente como Confúcio, nasceu em condições modestas no Estado de Lu, durante o turbulento período das Primaveras e Outonos. Em grande parte autodidata, tornou-se um mestre que aceitava discípulos sem distinção de classe e ocupou brevemente cargos públicos antes de passar anos peregrinando entre Estados, em busca frustrada de um governante que pusesse sua ética em prática.',
        'Dizia transmitir, e não inventar, voltando-se aos reis-sábios da antiguidade. Mas, ao redefinir a nobreza como cultivo moral e não como nascimento, revolucionou silenciosamente o pensamento chinês. Suas conversas, registradas pelos discípulos como os Analectos, tornaram-se o livro mais influente da história do Leste Asiático.',
      ],
    },
    contributions: {
      en: [
        'Made ren (humaneness) and li (ritual propriety) the centre of ethics',
        'Reframed the "noble person" (junzi) as a matter of character, not birth',
        'Founded a tradition of education open to all who sought to learn',
      ],
      pt: [
        'Colocou o ren (humanidade) e o li (ritual e decoro) no centro da ética',
        'Redefiniu a "pessoa nobre" (junzi) como questão de caráter, não de nascimento',
        'Fundou uma tradição de educação aberta a todos que buscassem aprender',
      ],
    },
    quotes: [
      { text: { en: 'Do not impose on others what you do not wish for yourself.', pt: 'Não imponha aos outros o que não deseja para si.' } },
      { text: { en: 'It does not matter how slowly you go, so long as you do not stop.', pt: 'Não importa quão devagar você vá, desde que não pare.' } },
    ],
    traits: {
      en: ['Tireless in learning', 'Devoted to ritual and propriety', 'Humane and unfailingly courteous'],
      pt: ['Incansável no aprendizado', 'Devotado ao ritual e ao decoro', 'Humano e invariavelmente cortês'],
    },
    facts: {
      en: [
        'He is traditionally said to have had three thousand disciples.',
        'For two millennia, Chinese civil servants were examined on his teachings.',
      ],
      pt: [
        'A tradição diz que teve três mil discípulos.',
        'Por dois milênios, os funcionários chineses foram examinados em seus ensinamentos.',
      ],
    },
    figureImage: '/figures/confucius.svg',
  },
  {
    slug: 'mencius',
    name: { en: 'Mencius', pt: 'Mêncio' },
    years: { en: 'c. 372–289 BC', pt: 'c. 372–289 a.C.' },
    birthplace: { en: 'State of Zou', pt: 'Estado de Zou' },
    schoolSlugs: ['confucianism'],
    epithet: { en: 'The Second Sage', pt: 'O Segundo Sábio' },
    biography: {
      en: [
        'Meng Ke, called Mencius, lived a century after Confucius and became the tradition\'s most powerful interpreter. Like his master he travelled among rulers urging benevolent government, arguing boldly that a king who failed his people forfeited the Mandate of Heaven and could rightly be deposed.',
        'His great philosophical claim was that human nature is innately good: every person possesses the "four sprouts" of compassion, shame, courtesy and judgement, which education and effort must cultivate like seedlings. This optimism shaped the Confucian view of human dignity ever after.',
      ],
      pt: [
        'Meng Ke, chamado Mêncio, viveu um século depois de Confúcio e tornou-se o intérprete mais poderoso da tradição. Como o mestre, percorreu as cortes pregando o governo benevolente, argumentando com ousadia que o rei que falhasse com o povo perderia o Mandato do Céu e poderia ser legitimamente deposto.',
        'Sua grande tese filosófica foi a de que a natureza humana é inatamente boa: toda pessoa possui os "quatro brotos" da compaixão, da vergonha, da cortesia e do discernimento, que a educação e o esforço devem cultivar como mudas. Esse otimismo moldou para sempre a visão confuciana da dignidade humana.',
      ],
    },
    contributions: {
      en: [
        'Argued that human nature is innately good (the "four sprouts")',
        'Developed the right of the people to depose an unjust ruler',
        'Systematised Confucian ethics into a coherent moral psychology',
      ],
      pt: [
        'Sustentou que a natureza humana é inatamente boa (os "quatro brotos")',
        'Desenvolveu o direito do povo de depor o governante injusto',
        'Sistematizou a ética confuciana numa psicologia moral coerente',
      ],
    },
    quotes: [
      { text: { en: 'The great man is he who does not lose his child\'s heart.', pt: 'O grande homem é aquele que não perde o coração de criança.' } },
      { text: { en: 'A person without compassion is not human.', pt: 'Quem não tem compaixão não é humano.' } },
    ],
    traits: {
      en: ['Eloquent and combative debater', 'Optimistic about human nature', 'Bold before kings'],
      pt: ['Debatedor eloquente e combativo', 'Otimista quanto à natureza humana', 'Audaz diante dos reis'],
    },
    facts: {
      en: [
        'His mother\'s devotion to his upbringing became a model of parenting in China.',
        'The Mencius is one of the Confucian "Four Books" of classical education.',
      ],
      pt: [
        'A dedicação de sua mãe à sua criação tornou-se um modelo de educação na China.',
        'O Mêncio é um dos "Quatro Livros" confucianos da educação clássica.',
      ],
    },
    figureImage: '/figures/mencius.svg',
  },
  {
    slug: 'laozi',
    name: { en: 'Laozi', pt: 'Laozi' },
    years: { en: 'c. 6th century BC', pt: 'c. século VI a.C.' },
    birthplace: { en: 'State of Chu (traditional)', pt: 'Estado de Chu (tradicional)' },
    schoolSlugs: ['taoism'],
    epithet: { en: 'The Old Master', pt: 'O Velho Mestre' },
    biography: {
      en: [
        'Laozi — literally "the Old Master" — is the semi-legendary figure to whom the Tao Te Ching is ascribed. Tradition makes him an archivist of the Zhou court who, weary of its corruption, rode west on a water-buffalo; at the frontier a gatekeeper begged him to leave his wisdom behind, and he wrote the five thousand characters of the Tao Te Ching before vanishing.',
        'Whether one man or many, the text under his name became the fountainhead of Taoism: terse, paradoxical verses praising the Way, the power of softness, and the wisdom of doing without forcing. Few books have been translated more often or read more variously.',
      ],
      pt: [
        'Laozi — literalmente "o Velho Mestre" — é a figura semilendária a quem se atribui o Tao Te Ching. A tradição o faz arquivista da corte Zhou que, cansado de sua corrupção, partiu para o oeste montado num búfalo; na fronteira, um guarda implorou que deixasse sua sabedoria, e ele escreveu os cinco mil caracteres do Tao Te Ching antes de desaparecer.',
        'Fosse um só homem ou muitos, o texto sob seu nome tornou-se a nascente do taoísmo: versos lacônicos e paradoxais que louvam o Caminho, a força da brandura e a sabedoria de agir sem forçar. Poucos livros foram traduzidos tantas vezes ou lidos de modos tão diversos.',
      ],
    },
    contributions: {
      en: [
        'Gave the Tao Te Ching, the foundational text of Taoism',
        'Articulated wu wei — effortless, non-forcing action',
        'Made paradox and softness into instruments of wisdom',
      ],
      pt: [
        'Legou o Tao Te Ching, texto fundador do taoísmo',
        'Articulou o wu wei — a ação sem esforço, que não força',
        'Fez do paradoxo e da brandura instrumentos de sabedoria',
      ],
    },
    quotes: [
      { text: { en: 'The journey of a thousand miles begins with a single step.', pt: 'A jornada de mil milhas começa com um único passo.' } },
      { text: { en: 'Nature does not hurry, yet everything is accomplished.', pt: 'A natureza não tem pressa, e ainda assim tudo se cumpre.' } },
    ],
    traits: {
      en: ['Reclusive and enigmatic', 'Lover of simplicity', 'Suspicious of striving and ambition'],
      pt: ['Recluso e enigmático', 'Amante da simplicidade', 'Desconfiado do esforço e da ambição'],
    },
    facts: {
      en: [
        'He may be legendary; some scholars doubt a single historical author.',
        'In later Taoist religion he was deified as a supreme deity.',
      ],
      pt: [
        'Pode ser lendário; alguns estudiosos duvidam de um único autor histórico.',
        'Na religião taoísta posterior, foi divinizado como uma divindade suprema.',
      ],
    },
    figureImage: '/figures/laozi.svg',
  },
  {
    slug: 'zhuangzi',
    name: { en: 'Zhuangzi', pt: 'Zhuangzi' },
    years: { en: 'c. 369–286 BC', pt: 'c. 369–286 a.C.' },
    birthplace: { en: 'Town of Meng, State of Song', pt: 'Cidade de Meng, Estado de Song' },
    schoolSlugs: ['taoism'],
    epithet: { en: 'The Laughing Sage', pt: 'O Sábio que Ri' },
    biography: {
      en: [
        'Zhuang Zhou was the great literary genius of Taoism, a minor official who preferred poverty and freedom to the burdens of office — famously declining a prime ministership rather than be a sacrificial ox decked in finery. His book brims with parables, jokes and tall tales that puncture human self-importance.',
        'Where Laozi is gnomic, Zhuangzi is playful and dazzling. He dreamt he was a butterfly and woke unsure whether he was a man who had dreamt a butterfly or a butterfly now dreaming a man — a story that has haunted philosophy\'s questions about reality and the self ever since.',
      ],
      pt: [
        'Zhuang Zhou foi o grande gênio literário do taoísmo, um funcionário menor que preferia a pobreza e a liberdade aos fardos do cargo — recusou célebre um posto de primeiro-ministro em vez de ser como o boi sacrificial enfeitado de finos paramentos. Seu livro transborda de parábolas, piadas e histórias fantásticas que furam a autoimportância humana.',
        'Onde Laozi é sentencioso, Zhuangzi é brincalhão e deslumbrante. Sonhou que era uma borboleta e acordou sem saber se era um homem que sonhara ser borboleta ou uma borboleta a sonhar agora ser homem — história que desde então assombra as perguntas da filosofia sobre a realidade e o eu.',
      ],
    },
    contributions: {
      en: [
        'Gave Taoism its richest literary and philosophical text',
        'Pressed the relativity of all viewpoints and distinctions',
        'Modelled spiritual freedom through humour and detachment',
      ],
      pt: [
        'Deu ao taoísmo seu texto literário e filosófico mais rico',
        'Levou ao extremo a relatividade de todos os pontos de vista e distinções',
        'Encarnou a liberdade espiritual pelo humor e pelo desapego',
      ],
    },
    quotes: [
      { text: { en: 'Flow with whatever may happen and let your mind be free.', pt: 'Flua com o que acontecer e deixe sua mente livre.' } },
      { text: { en: 'The wise man looks into space and does not regard the small as too little.', pt: 'O sábio contempla o espaço e não tem o pequeno por insignificante.' } },
    ],
    traits: {
      en: ['Witty and irreverent', 'Indifferent to status', 'Master of parable'],
      pt: ['Espirituoso e irreverente', 'Indiferente ao status', 'Mestre da parábola'],
    },
    facts: {
      en: [
        'His butterfly dream is among the most famous thought-experiments in philosophy.',
        'He reportedly sang and drummed on a bowl rather than mourn his wife\'s death.',
      ],
      pt: [
        'Seu sonho da borboleta está entre os mais célebres experimentos mentais da filosofia.',
        'Diz-se que cantou e tamborilou numa tigela em vez de lamentar a morte da esposa.',
      ],
    },
    figureImage: '/figures/zhuangzi.svg',
  },
  {
    slug: 'han-feizi',
    name: { en: 'Han Feizi', pt: 'Han Feizi' },
    years: { en: 'c. 280–233 BC', pt: 'c. 280–233 a.C.' },
    birthplace: { en: 'State of Han', pt: 'Estado de Han' },
    schoolSlugs: ['legalism'],
    epithet: { en: 'The Synthesiser of Legalism', pt: 'O Sintetizador do Legalismo' },
    biography: {
      en: [
        'A prince of the doomed State of Han, Han Fei stammered and wrote rather than spoke. Studying under the Confucian Xunzi, he drew the opposite conclusion from his teacher\'s view of human nature as flawed: if people cannot be trusted to be good, the state must rely on law, technique and power rather than virtue.',
        'His essays so impressed the king of Qin that he sought him out — only for Han Fei to be slandered and forced to take poison by a jealous former classmate, Li Si. Yet his ideas armed the Qin to unify China, and his book remains the sharpest statement of Legalist statecraft.',
      ],
      pt: [
        'Príncipe do condenado Estado de Han, Han Fei gaguejava e escrevia em vez de falar. Discípulo do confuciano Xunzi, tirou da visão do mestre sobre a natureza humana falha a conclusão oposta: se não se pode confiar na bondade das pessoas, o Estado deve apoiar-se na lei, na técnica e no poder, não na virtude.',
        'Seus ensaios impressionaram tanto o rei de Qin que este o procurou — mas Han Fei foi caluniado e forçado a tomar veneno por um antigo colega invejoso, Li Si. Ainda assim, suas ideias armaram o Qin para unificar a China, e seu livro permanece a formulação mais aguda da estatística legalista.',
      ],
    },
    contributions: {
      en: [
        'Synthesised fa (law), shu (technique) and shi (power) into one theory',
        'Argued that government must rest on systems, not on the ruler\'s virtue',
        'Wrote the classic analysis of incentives in politics',
      ],
      pt: [
        'Sintetizou fa (lei), shu (técnica) e shi (poder) numa só teoria',
        'Defendeu que o governo deve repousar em sistemas, não na virtude do governante',
        'Escreveu a análise clássica dos incentivos na política',
      ],
    },
    quotes: [
      { text: { en: 'When the ruler relies on law, the strong cannot oppress the weak.', pt: 'Quando o governante se apoia na lei, o forte não pode oprimir o fraco.' } },
      { text: { en: 'No man can be trusted who is trusted only because he is watched.', pt: 'Não se confia em ninguém que só é confiável porque está sendo vigiado.' } },
    ],
    traits: {
      en: ['Coldly analytical', 'Distrustful of human motives', 'Brilliant essayist'],
      pt: ['Analítico e frio', 'Desconfiado dos motivos humanos', 'Ensaísta brilhante'],
    },
    facts: {
      en: [
        'He was killed by Li Si, who later became Qin\'s chancellor.',
        'The First Emperor of China reportedly admired his writings deeply.',
      ],
      pt: [
        'Foi morto por Li Si, que depois se tornou chanceler de Qin.',
        'O Primeiro Imperador da China teria admirado profundamente seus escritos.',
      ],
    },
    figureImage: '/figures/han-feizi.svg',
  },
  {
    slug: 'shang-yang',
    name: { en: 'Shang Yang', pt: 'Shang Yang' },
    years: { en: 'c. 390–338 BC', pt: 'c. 390–338 a.C.' },
    birthplace: { en: 'State of Wey', pt: 'Estado de Wey' },
    schoolSlugs: ['legalism'],
    epithet: { en: 'The Reformer of Qin', pt: 'O Reformador de Qin' },
    biography: {
      en: [
        'Shang Yang was the statesman who turned the State of Qin into a war machine. As chief minister he abolished hereditary privilege, organised the population into mutually responsible units, rewarded farming and military merit, and enforced a single harsh code of law applied — at least in principle — to noble and commoner alike.',
        'His reforms made Qin the strongest of the warring states and laid the groundwork for China\'s unification a century later. But he made powerful enemies; when his patron died, he was hunted down and executed by the very laws he had imposed.',
      ],
      pt: [
        'Shang Yang foi o estadista que transformou o Estado de Qin numa máquina de guerra. Como ministro-chefe, aboliu o privilégio hereditário, organizou a população em unidades de responsabilidade mútua, premiou a agricultura e o mérito militar e impôs um código de leis único e severo, aplicado — ao menos em princípio — a nobres e plebeus por igual.',
        'Suas reformas fizeram de Qin o mais forte dos reinos combatentes e prepararam a unificação da China um século depois. Mas criou inimigos poderosos; morto seu protetor, foi caçado e executado pelas próprias leis que impusera.',
      ],
    },
    contributions: {
      en: [
        'Engineered the legal and economic reforms that empowered Qin',
        'Insisted that law apply equally regardless of rank',
        'Tied reward and punishment to farming and military service',
      ],
      pt: [
        'Engendrou as reformas legais e econômicas que fortaleceram Qin',
        'Insistiu que a lei se aplicasse igualmente, sem distinção de posição',
        'Vinculou recompensa e castigo à agricultura e ao serviço militar',
      ],
    },
    quotes: [
      { text: { en: 'A wise man creates laws; a foolish man is controlled by them.', pt: 'O sábio cria as leis; o tolo é controlado por elas.' } },
      { text: { en: 'If the law is not uniform, it will not be obeyed.', pt: 'Se a lei não for uniforme, não será obedecida.' } },
    ],
    traits: {
      en: ['Ruthless reformer', 'Uncompromising on the law', 'Indifferent to popularity'],
      pt: ['Reformador implacável', 'Inflexível quanto à lei', 'Indiferente à popularidade'],
    },
    facts: {
      en: [
        'He reportedly proved his laws by punishing the crown prince\'s tutors.',
        'He died by the harsh statutes he himself had written.',
      ],
      pt: [
        'Diz-se que provou suas leis punindo os tutores do príncipe herdeiro.',
        'Morreu sob os estatutos severos que ele mesmo escrevera.',
      ],
    },
    figureImage: '/figures/shang-yang.svg',
  },
  {
    slug: 'mozi',
    name: { en: 'Mozi', pt: 'Mozi' },
    years: { en: 'c. 470–391 BC', pt: 'c. 470–391 a.C.' },
    birthplace: { en: 'State of Lu', pt: 'Estado de Lu' },
    schoolSlugs: ['mohism'],
    epithet: { en: 'The Universal Lover', pt: 'O Amante Universal' },
    biography: {
      en: [
        'Mo Di, founder of Mohism, rose from the artisan class and never lost its practical, anti-aristocratic spirit. Against Confucian ritual and graded love, he preached jian ai — impartial care for all people equally — and judged every practice, from music to elaborate funerals, by a single test: does it benefit the people?',
        'A fierce opponent of aggressive war, he and his disciplined followers would travel to threatened cities to organise their defence, pairing moral argument with real engineering skill. The Mohists also pioneered China\'s first systematic logic before fading under the unified empire.',
      ],
      pt: [
        'Mo Di, fundador do moísmo, veio da classe artesã e nunca perdeu seu espírito prático e antiaristocrático. Contra o ritual confuciano e o amor graduado, pregou o jian ai — o cuidado imparcial por todas as pessoas igualmente — e julgava cada prática, da música aos funerais suntuosos, por um único teste: ela beneficia o povo?',
        'Ferrenho opositor da guerra agressiva, ele e seus seguidores disciplinados viajavam às cidades ameaçadas para organizar sua defesa, unindo o argumento moral a real perícia de engenharia. Os moístas também foram pioneiros da primeira lógica sistemática da China antes de declinar sob o império unificado.',
      ],
    },
    contributions: {
      en: [
        'Proposed jian ai, impartial universal care, as the root of ethics',
        'Founded a disciplined, anti-war movement of city defenders',
        'Pioneered systematic logic and standards of argument in China',
      ],
      pt: [
        'Propôs o jian ai, o cuidado universal imparcial, como raiz da ética',
        'Fundou um movimento disciplinado e antibélico de defensores de cidades',
        'Foi pioneiro da lógica sistemática e dos padrões de argumentação na China',
      ],
    },
    quotes: [
      { text: { en: 'When everyone regards the states of others as his own, who would attack them?', pt: 'Quando cada um considera os Estados alheios como seus, quem os atacaria?' } },
      { text: { en: 'The purpose of a doctrine is to be put into practice.', pt: 'O propósito de uma doutrina é ser posta em prática.' } },
    ],
    traits: {
      en: ['Austere and practical', 'Egalitarian', 'Anti-war activist'],
      pt: ['Austero e prático', 'Igualitário', 'Ativista antiguerra'],
    },
    facts: {
      en: [
        'He once walked ten days to dissuade a state from an invasion — and succeeded.',
        'The Mohists wrote some of the earliest treatises on optics and geometry in China.',
      ],
      pt: [
        'Certa vez caminhou dez dias para dissuadir um Estado de uma invasão — e conseguiu.',
        'Os moístas escreveram alguns dos primeiros tratados de óptica e geometria da China.',
      ],
    },
    figureImage: '/figures/mozi.svg',
  },
  {
    slug: 'buddha',
    name: { en: 'The Buddha', pt: 'O Buda' },
    years: { en: 'c. 563–483 BC', pt: 'c. 563–483 a.C.' },
    birthplace: { en: 'Lumbini, present-day Nepal', pt: 'Lumbini, atual Nepal' },
    schoolSlugs: ['buddhism'],
    epithet: { en: 'The Awakened One', pt: 'O Desperto' },
    biography: {
      en: [
        'Siddhartha Gautama was born a prince of the Shakya clan, sheltered from all suffering. Encountering old age, sickness and death for the first time, he renounced his palace and family to seek an end to suffering, trying extreme asceticism before rejecting it for a "middle way." Meditating beneath the Bodhi tree, he attained awakening and became the Buddha — the Awakened One.',
        'For forty-five years he taught the Four Noble Truths and the Eightfold Path across northern India, founding a community of monks and nuns. He left no writings; his words, memorised and later transcribed by disciples, seeded one of the world\'s great religions and philosophies.',
      ],
      pt: [
        'Sidarta Gautama nasceu príncipe do clã Shakya, protegido de todo sofrimento. Ao deparar pela primeira vez com a velhice, a doença e a morte, renunciou ao palácio e à família para buscar o fim do sofrimento; experimentou o ascetismo extremo antes de recusá-lo por um "caminho do meio". Meditando sob a árvore Bodhi, alcançou o despertar e tornou-se o Buda — o Desperto.',
        'Por quarenta e cinco anos ensinou as Quatro Nobres Verdades e o Nobre Caminho Óctuplo pelo norte da Índia, fundando uma comunidade de monges e monjas. Não deixou escritos; suas palavras, memorizadas e depois transcritas pelos discípulos, semearam uma das grandes religiões e filosofias do mundo.',
      ],
    },
    contributions: {
      en: [
        'Formulated the Four Noble Truths and the Eightfold Path',
        'Taught anatta (no-self) and the impermanence of all things',
        'Founded a monastic community that carried his teaching across Asia',
      ],
      pt: [
        'Formulou as Quatro Nobres Verdades e o Nobre Caminho Óctuplo',
        'Ensinou o anatta (não-eu) e a impermanência de todas as coisas',
        'Fundou uma comunidade monástica que levou seu ensino por toda a Ásia',
      ],
    },
    quotes: [
      { text: { en: 'All that we are is the result of what we have thought.', pt: 'Tudo o que somos é resultado do que pensamos.' } },
      { text: { en: 'Hatred is never ended by hatred, but by love alone.', pt: 'O ódio nunca cessa pelo ódio, mas somente pelo amor.' } },
    ],
    traits: {
      en: ['Serene and compassionate', 'A patient teacher', 'Practical about suffering'],
      pt: ['Sereno e compassivo', 'Mestre paciente', 'Prático diante do sofrimento'],
    },
    facts: {
      en: [
        'The title "Buddha" is not a name but means "the awakened one."',
        'He taught a "middle way" between indulgence and harsh asceticism.',
      ],
      pt: [
        'O título "Buda" não é um nome: significa "o desperto".',
        'Ensinou um "caminho do meio" entre a indulgência e o ascetismo severo.',
      ],
    },
    figureImage: '/figures/buddha.svg',
  },
  {
    slug: 'nagarjuna',
    name: { en: 'Nagarjuna', pt: 'Nagarjuna' },
    years: { en: 'c. 150–250 AD', pt: 'c. 150–250 d.C.' },
    birthplace: { en: 'South India', pt: 'Sul da Índia' },
    schoolSlugs: ['buddhism'],
    epithet: { en: 'The Second Buddha', pt: 'O Segundo Buda' },
    biography: {
      en: [
        'Nagarjuna was the towering philosopher of Mahayana Buddhism, founder of the Madhyamaka or "Middle Way" school. In tightly argued verses he developed the doctrine of shunyata — emptiness — holding that all things are empty of inherent, independent existence because they arise only in dependence on other things.',
        'His dialectic dismantled every metaphysical position, including its own, to free the mind from clinging to fixed views. Revered across the Mahayana world as a "second Buddha," he profoundly shaped Tibetan and East Asian thought, including Zen.',
      ],
      pt: [
        'Nagarjuna foi o grande filósofo do budismo Mahayana, fundador da escola Madhyamaka, ou do "Caminho do Meio". Em versos rigorosamente argumentados, desenvolveu a doutrina do shunyata — a vacuidade —, sustentando que todas as coisas são vazias de existência inerente e independente, pois só surgem em dependência de outras.',
        'Sua dialética desmontava toda posição metafísica, inclusive a própria, para libertar a mente do apego a visões fixas. Venerado em todo o mundo Mahayana como um "segundo Buda", moldou profundamente o pensamento tibetano e do Leste Asiático, inclusive o Zen.',
      ],
    },
    contributions: {
      en: [
        'Founded the Madhyamaka philosophy of emptiness (shunyata)',
        'Showed all phenomena to be empty of inherent existence',
        'Refined a dialectic that frees the mind from fixed views',
      ],
      pt: [
        'Fundou a filosofia Madhyamaka da vacuidade (shunyata)',
        'Mostrou que todos os fenômenos são vazios de existência inerente',
        'Refinou uma dialética que liberta a mente das visões fixas',
      ],
    },
    quotes: [
      { text: { en: 'Whatever is dependently arisen is explained to be emptiness.', pt: 'Tudo o que surge de modo dependente é explicado como vacuidade.' } },
      { text: { en: 'There is no thing that is not dependently arisen.', pt: 'Não há coisa alguma que não tenha surgido de modo dependente.' } },
    ],
    traits: {
      en: ['Rigorous dialectician', 'Subtle and paradoxical', 'Deeply systematic'],
      pt: ['Dialético rigoroso', 'Sutil e paradoxal', 'Profundamente sistemático'],
    },
    facts: {
      en: [
        'Legend says he retrieved hidden Mahayana scriptures from the realm of serpents (nagas).',
        'His "tetralemma" anticipates moves in modern logic about negation.',
      ],
      pt: [
        'A lenda diz que recuperou escrituras Mahayana ocultas no reino das serpentes (nagas).',
        'Seu "tetralemma" antecipa movimentos da lógica moderna sobre a negação.',
      ],
    },
    figureImage: '/figures/nagarjuna.svg',
  },
  {
    slug: 'bodhidharma',
    name: { en: 'Bodhidharma', pt: 'Bodhidharma' },
    years: { en: 'c. 5th–6th century AD', pt: 'c. séculos V–VI d.C.' },
    birthplace: { en: 'South India', pt: 'Sul da Índia' },
    schoolSlugs: ['zen'],
    epithet: { en: 'The First Patriarch of Chan', pt: 'O Primeiro Patriarca do Chan' },
    biography: {
      en: [
        'Bodhidharma, a wandering Indian monk, is revered as the founder of Chan (Zen) Buddhism in China. Legend has him crossing the Yangtze on a reed and meditating for nine years facing a wall at Shaolin, refusing the emperor\'s expectation of merit for pious works with the bracing reply that there was "no merit at all."',
        'Whatever the history, the tradition crystallised around him a distinctive teaching: a direct transmission of awakening "outside the scriptures," pointing straight at the mind. His legend also links him to the martial and breathing exercises of Shaolin.',
      ],
      pt: [
        'Bodhidharma, monge indiano errante, é venerado como fundador do budismo Chan (Zen) na China. A lenda o faz atravessar o Yangtsé sobre um junco e meditar nove anos diante de uma parede em Shaolin, recusando a expectativa do imperador de mérito por obras piedosas com a resposta cortante de que não havia "mérito algum".',
        'Seja qual for a história, a tradição cristalizou em torno dele um ensino distinto: a transmissão direta do despertar "fora das escrituras", apontando diretamente para a mente. Sua lenda também o liga aos exercícios marciais e respiratórios de Shaolin.',
      ],
    },
    contributions: {
      en: [
        'Brought the Chan (Zen) lineage from India to China',
        'Emphasised wall-gazing meditation over scripture and merit',
        'Embodied the ideal of direct, wordless transmission',
      ],
      pt: [
        'Trouxe a linhagem Chan (Zen) da Índia para a China',
        'Enfatizou a meditação de contemplação da parede acima da escritura e do mérito',
        'Encarnou o ideal da transmissão direta e sem palavras',
      ],
    },
    quotes: [
      { text: { en: 'To find a Buddha, you have to see your own nature.', pt: 'Para encontrar um Buda, é preciso ver a própria natureza.' } },
      { text: { en: 'All know the way; few actually walk it.', pt: 'Todos conhecem o caminho; poucos de fato o trilham.' } },
    ],
    traits: {
      en: ['Severe and uncompromising', 'Wordless teacher', 'Iron-willed'],
      pt: ['Severo e intransigente', 'Mestre sem palavras', 'De vontade de ferro'],
    },
    facts: {
      en: [
        'He is often depicted with fierce, wide-open eyes and a heavy beard.',
        'Japanese daruma dolls are modelled on his nine years of seated meditation.',
      ],
      pt: [
        'É frequentemente retratado com olhos ferozes e arregalados e barba cerrada.',
        'Os bonecos daruma japoneses se inspiram em seus nove anos de meditação sentada.',
      ],
    },
    figureImage: '/figures/bodhidharma.svg',
  },
  {
    slug: 'dogen',
    name: { en: 'Dōgen', pt: 'Dōgen' },
    years: { en: '1200–1253', pt: '1200–1253' },
    birthplace: { en: 'Kyoto, Japan', pt: 'Quioto, Japão' },
    schoolSlugs: ['zen'],
    epithet: { en: 'Founder of Sōtō Zen', pt: 'Fundador do Zen Sōtō' },
    biography: {
      en: [
        'Orphaned young, Dōgen became a monk haunted by a question: if we already possess Buddha-nature, why must we practise at all? Dissatisfied with the answers in Japan, he travelled to China, where a master\'s phrase — "drop off body and mind" — awakened him. He returned to found the Sōtō school of Zen.',
        'His answer to his own question was radical: practice is not a means to enlightenment but its very expression. To sit in zazen is already to be Buddha. His masterwork, the Shōbōgenzō, is among the most profound and difficult texts in all of Buddhist philosophy.',
      ],
      pt: [
        'Órfão ainda jovem, Dōgen tornou-se monge atormentado por uma pergunta: se já possuímos a natureza de Buda, por que precisamos praticar? Insatisfeito com as respostas no Japão, viajou à China, onde a frase de um mestre — "abandone corpo e mente" — o despertou. De volta, fundou a escola Sōtō do Zen.',
        'Sua resposta à própria pergunta foi radical: a prática não é meio para a iluminação, mas sua própria expressão. Sentar-se em zazen já é ser Buda. Sua obra-prima, o Shōbōgenzō, está entre os textos mais profundos e difíceis de toda a filosofia budista.',
      ],
    },
    contributions: {
      en: [
        'Founded the Sōtō school of Zen in Japan',
        'Taught "just sitting" (shikantaza) as practice-realisation',
        'Wrote the Shōbōgenzō, a landmark of Buddhist philosophy',
      ],
      pt: [
        'Fundou a escola Sōtō do Zen no Japão',
        'Ensinou o "apenas sentar" (shikantaza) como prática-realização',
        'Escreveu o Shōbōgenzō, um marco da filosofia budista',
      ],
    },
    quotes: [
      { text: { en: 'To study the self is to forget the self.', pt: 'Estudar o eu é esquecer o eu.' } },
      { text: { en: 'If you cannot find the truth right where you are, where else do you expect to find it?', pt: 'Se você não encontra a verdade onde está, onde mais espera encontrá-la?' } },
    ],
    traits: {
      en: ['Rigorous and contemplative', 'Poetic philosopher', 'Devoted to practice'],
      pt: ['Rigoroso e contemplativo', 'Filósofo poético', 'Devotado à prática'],
    },
    facts: {
      en: [
        'He insisted enlightenment and practice are one and the same.',
        'The Shōbōgenzō was largely neglected for centuries before its modern rediscovery.',
      ],
      pt: [
        'Insistia que iluminação e prática são uma só e mesma coisa.',
        'O Shōbōgenzō ficou em grande parte esquecido por séculos até sua redescoberta moderna.',
      ],
    },
    figureImage: '/figures/dogen.svg',
  },
  {
    slug: 'shankara',
    name: { en: 'Adi Shankara', pt: 'Adi Shankara' },
    years: { en: 'c. 700–750 AD', pt: 'c. 700–750 d.C.' },
    birthplace: { en: 'Kaladi, Kerala', pt: 'Kaladi, Kerala' },
    schoolSlugs: ['vedanta'],
    epithet: { en: 'Master of Non-Dualism', pt: 'Mestre do Não-Dualismo' },
    biography: {
      en: [
        'Adi Shankara was the philosopher who systematised Advaita Vedanta, the non-dualist reading of the Upanishads. Said to have lived only thirty-two years, he travelled the length of India debating rival schools, writing luminous commentaries, and founding monastic centres that endure to this day.',
        'His central teaching is austere and exhilarating: the individual self (Atman) and the absolute (Brahman) are not two. The world of separate things is real only as appearance (maya); liberation is the direct realisation of the one reality that we already are.',
      ],
      pt: [
        'Adi Shankara foi o filósofo que sistematizou o Advaita Vedanta, a leitura não-dualista dos Upanixades. Diz-se que viveu apenas trinta e dois anos; percorreu a Índia inteira debatendo escolas rivais, escrevendo comentários luminosos e fundando centros monásticos que perduram até hoje.',
        'Seu ensino central é austero e arrebatador: o eu individual (Atman) e o absoluto (Brahman) não são dois. O mundo das coisas separadas só é real como aparência (maya); a libertação é a realização direta da realidade única que já somos.',
      ],
    },
    contributions: {
      en: [
        'Systematised Advaita (non-dual) Vedanta philosophy',
        'Wrote foundational commentaries on the Upanishads and Brahma Sutras',
        'Distinguished conventional from ultimate truth in Indian thought',
      ],
      pt: [
        'Sistematizou a filosofia Advaita (não-dual) do Vedanta',
        'Escreveu comentários fundadores aos Upanixades e Brahma Sutras',
        'Distinguiu a verdade convencional da última no pensamento indiano',
      ],
    },
    quotes: [
      { text: { en: 'Brahman is real; the world is appearance; the self is none other than Brahman.', pt: 'O Brahman é real; o mundo é aparência; o eu não é senão o Brahman.' } },
      { text: { en: 'Knowledge alone destroys ignorance; action cannot.', pt: 'Só o conhecimento destrói a ignorância; a ação não.' } },
    ],
    traits: {
      en: ['Formidable debater', 'Synthesising genius', 'Ascetic and tireless'],
      pt: ['Debatedor formidável', 'Gênio da síntese', 'Asceta e incansável'],
    },
    facts: {
      en: [
        'He founded four monastic seats (mathas) at the cardinal points of India.',
        'Tradition credits him with reviving Hindu thought against rival schools.',
      ],
      pt: [
        'Fundou quatro sés monásticas (mathas) nos pontos cardeais da Índia.',
        'A tradição lhe credita o reerguimento do pensamento hindu frente a escolas rivais.',
      ],
    },
    figureImage: '/figures/shankara.svg',
  },
  {
    slug: 'patanjali',
    name: { en: 'Patanjali', pt: 'Patañjali' },
    years: { en: 'c. 2nd century BC', pt: 'c. século II a.C.' },
    birthplace: { en: 'India', pt: 'Índia' },
    schoolSlugs: ['vedanta'],
    epithet: { en: 'Compiler of the Yoga Sutras', pt: 'Compilador dos Yoga Sutras' },
    biography: {
      en: [
        'Patanjali is the name attached to the Yoga Sutras, the classical text that systematised yoga as a philosophy and discipline of the mind. In fewer than two hundred terse aphorisms it defines yoga as "the stilling of the fluctuations of the mind" and lays out the famous eight limbs, from ethical restraint to absorption (samadhi).',
        'Little is known of the historical author, and the work may compile older teachings. Yet through it the goal of Indian contemplative practice — liberation through the disciplined mastery of attention — received its most enduring and exportable form.',
      ],
      pt: [
        'Patañjali é o nome ligado aos Yoga Sutras, o texto clássico que sistematizou o yoga como filosofia e disciplina da mente. Em menos de duzentos aforismos lacônicos, define o yoga como "o aquietamento das flutuações da mente" e expõe os famosos oito membros, da contenção ética à absorção (samadhi).',
        'Pouco se sabe do autor histórico, e a obra pode compilar ensinamentos anteriores. Ainda assim, foi por ela que a meta da prática contemplativa indiana — a libertação pelo domínio disciplinado da atenção — recebeu sua forma mais duradoura e exportável.',
      ],
    },
    contributions: {
      en: [
        'Compiled the Yoga Sutras, the classical charter of yoga',
        'Defined yoga as the stilling of the mind\'s fluctuations',
        'Mapped the eight limbs of contemplative discipline',
      ],
      pt: [
        'Compilou os Yoga Sutras, a carta clássica do yoga',
        'Definiu o yoga como o aquietamento das flutuações da mente',
        'Mapeou os oito membros da disciplina contemplativa',
      ],
    },
    quotes: [
      { text: { en: 'Yoga is the stilling of the fluctuations of the mind.', pt: 'O yoga é o aquietamento das flutuações da mente.' } },
      { text: { en: 'When you are inspired, dormant forces and talents come alive.', pt: 'Quando você se inspira, forças e talentos adormecidos despertam.' } },
    ],
    traits: {
      en: ['Concise and systematic', 'Inward-turning', 'Master of method'],
      pt: ['Conciso e sistemático', 'Voltado para dentro', 'Mestre do método'],
    },
    facts: {
      en: [
        'The entire Yoga Sutras can be recited in under an hour.',
        'His "eight limbs" still structure yoga practice worldwide today.',
      ],
      pt: [
        'Os Yoga Sutras inteiros podem ser recitados em menos de uma hora.',
        'Seus "oito membros" ainda estruturam a prática do yoga em todo o mundo.',
      ],
    },
    figureImage: '/figures/patanjali.svg',
  },
  {
    slug: 'musashi',
    name: { en: 'Miyamoto Musashi', pt: 'Miyamoto Musashi' },
    years: { en: '1584–1645', pt: '1584–1645' },
    birthplace: { en: 'Harima Province, Japan', pt: 'Província de Harima, Japão' },
    schoolSlugs: ['bushido'],
    epithet: { en: 'The Sword-Saint', pt: 'O Santo da Espada' },
    biography: {
      en: [
        'Miyamoto Musashi was Japan\'s most celebrated swordsman, undefeated in some sixty duels — the first reportedly at thirteen. A rōnin who wandered in search of mastery, he developed a two-sword style and famously won a climactic duel with Sasaki Kojirō using only a wooden sword carved from an oar.',
        'In his final years, secluded in a cave, he wrote The Book of Five Rings, distilling a lifetime of combat into a philosophy of strategy, awareness and the Way. He was also an accomplished painter and calligrapher, embodying the Bushidō ideal of the cultivated warrior.',
      ],
      pt: [
        'Miyamoto Musashi foi o mais célebre espadachim do Japão, invicto em cerca de sessenta duelos — o primeiro, segundo se conta, aos treze anos. Rōnin que vagava em busca da maestria, desenvolveu um estilo de duas espadas e venceu, célebre, o duelo decisivo contra Sasaki Kojirō usando apenas uma espada de madeira talhada de um remo.',
        'Em seus últimos anos, recolhido numa caverna, escreveu o Livro dos Cinco Anéis, destilando uma vida de combate numa filosofia de estratégia, percepção e o Caminho. Foi também pintor e calígrafo consumado, encarnando o ideal do guerreiro cultivado do Bushidō.',
      ],
    },
    contributions: {
      en: [
        'Wrote The Book of Five Rings on strategy and the warrior\'s Way',
        'Founded the two-sword Niten Ichi-ryū school of swordsmanship',
        'Fused martial skill with art, calligraphy and philosophy',
      ],
      pt: [
        'Escreveu o Livro dos Cinco Anéis sobre estratégia e o Caminho do guerreiro',
        'Fundou a escola Niten Ichi-ryū de esgrima com duas espadas',
        'Fundiu a perícia marcial com a arte, a caligrafia e a filosofia',
      ],
    },
    quotes: [
      { text: { en: 'Think lightly of yourself and deeply of the world.', pt: 'Pense levemente de si mesmo e profundamente do mundo.' } },
      { text: { en: 'You can only fight the way you practice.', pt: 'Você só luta do modo como treina.' } },
    ],
    traits: {
      en: ['Self-disciplined to the extreme', 'Independent and solitary', 'Artist and warrior'],
      pt: ['Autodisciplinado ao extremo', 'Independente e solitário', 'Artista e guerreiro'],
    },
    facts: {
      en: [
        'He reportedly never lost a duel in his life.',
        'His ink paintings are treasured works of Japanese art.',
      ],
      pt: [
        'Segundo se conta, nunca perdeu um duelo na vida.',
        'Suas pinturas a nanquim são obras preciosas da arte japonesa.',
      ],
    },
    figureImage: '/figures/musashi.svg',
  },
  {
    slug: 'tsunetomo',
    name: { en: 'Yamamoto Tsunetomo', pt: 'Yamamoto Tsunetomo' },
    years: { en: '1659–1719', pt: '1659–1719' },
    birthplace: { en: 'Saga Domain, Japan', pt: 'Domínio de Saga, Japão' },
    schoolSlugs: ['bushido'],
    epithet: { en: 'Voice of the Hagakure', pt: 'A Voz do Hagakure' },
    biography: {
      en: [
        'Yamamoto Tsunetomo was a samurai retainer of the Saga domain who, when his lord died, was forbidden by law to follow him in ritual suicide. He instead became a Buddhist monk, and in his retirement dictated to a young samurai the reflections that became the Hagakure — "Hidden Leaves."',
        'The book is a vivid, sometimes startling meditation on loyalty, death and the spirit of the warrior in a peaceful age when the samurai\'s role was fading. Its opening lines — that the Way of the warrior is found in death — became the most famous, and most debated, expression of Bushidō.',
      ],
      pt: [
        'Yamamoto Tsunetomo foi um samurai a serviço do domínio de Saga que, ao morrer seu senhor, foi impedido por lei de segui-lo no suicídio ritual. Tornou-se então monge budista e, na aposentadoria, ditou a um jovem samurai as reflexões que se tornaram o Hagakure — "Folhas Ocultas".',
        'O livro é uma meditação viva, por vezes desconcertante, sobre lealdade, morte e o espírito do guerreiro numa era de paz em que o papel do samurai se desvanecia. Suas linhas iniciais — que o Caminho do guerreiro se encontra na morte — tornaram-se a expressão mais famosa, e mais debatida, do Bushidō.',
      ],
    },
    contributions: {
      en: [
        'Gave Bushidō its most famous text, the Hagakure',
        'Articulated loyalty and readiness for death as the warrior\'s core',
        'Preserved the samurai ethos as its historical role declined',
      ],
      pt: [
        'Deu ao Bushidō seu texto mais famoso, o Hagakure',
        'Articulou a lealdade e a prontidão para a morte como cerne do guerreiro',
        'Preservou o ethos samurai enquanto seu papel histórico declinava',
      ],
    },
    quotes: [
      { text: { en: 'The Way of the warrior is to be found in dying.', pt: 'O Caminho do guerreiro encontra-se no morrer.' } },
      { text: { en: 'There is surely nothing other than the single purpose of the present moment.', pt: 'Não há, decerto, nada além do único propósito do momento presente.' } },
    ],
    traits: {
      en: ['Intense and uncompromising', 'Devoted to his lord', 'Contemplative in retirement'],
      pt: ['Intenso e intransigente', 'Devotado ao seu senhor', 'Contemplativo na reclusão'],
    },
    facts: {
      en: [
        'The Hagakure was little known until the 20th century made it famous.',
        'He spent his last years as a monk after his lord forbade his ritual suicide.',
      ],
      pt: [
        'O Hagakure era pouco conhecido até o século XX torná-lo famoso.',
        'Passou seus últimos anos como monge depois que seu senhor proibiu seu suicídio ritual.',
      ],
    },
    figureImage: '/figures/tsunetomo.svg',
  },
];

/** Lookup a philosopher by slug. */
export function getPhilosopher(slug: string): Philosopher | undefined {
  return philosophers.find((p) => p.slug === slug);
}
