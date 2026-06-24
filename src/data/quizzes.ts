import type { QuizQuestion } from './types';
import { quizzesExtra } from './quizzes-extra';

/**
 * The quiz bank. Convention: in every question the FIRST option is the
 * correct answer — `lib/quiz.ts` shuffles the options at runtime and tracks
 * where the correct one lands. The data-integrity test guarantees every
 * philosopher has at least one question and every question has four distinct,
 * fully translated options. Questions for the secondary sages live in
 * `quizzes-extra.ts` and are merged below.
 */
const baseQuizQuestions: QuizQuestion[] = [
  // ── Confucius ──────────────────────────────────────────────────────────
  {
    id: 'confucius-1',
    philosopherSlug: 'confucius',
    prompt: { en: 'What is the supreme virtue in Confucian ethics?', pt: 'Qual é a virtude suprema na ética confuciana?' },
    options: {
      en: ['Ren (humaneness)', 'Wu wei (non-action)', 'Jian ai (impartial care)', 'Moksha (liberation)'],
      pt: ['Ren (humanidade)', 'Wu wei (não-ação)', 'Jian ai (cuidado imparcial)', 'Moksha (libertação)'],
    },
    explanation: { en: 'Ren, humaneness or benevolence, is the central virtue for Confucius.', pt: 'O ren, humanidade ou benevolência, é a virtude central para Confúcio.' },
  },
  {
    id: 'confucius-2',
    philosopherSlug: 'confucius',
    prompt: { en: 'Which text collects the sayings of Confucius?', pt: 'Qual texto reúne os ditos de Confúcio?' },
    options: {
      en: ['The Analects', 'The Tao Te Ching', 'The Dhammapada', 'The Hagakure'],
      pt: ['Os Analectos', 'O Tao Te Ching', 'O Dhammapada', 'O Hagakure'],
    },
    explanation: { en: 'The Analects were compiled by his disciples after his death.', pt: 'Os Analectos foram compilados por seus discípulos após sua morte.' },
  },
  {
    id: 'confucius-3',
    philosopherSlug: 'confucius',
    prompt: { en: 'For Confucius, the "junzi" (noble person) is defined by what?', pt: 'Para Confúcio, o "junzi" (pessoa nobre) define-se por quê?' },
    options: {
      en: ['Moral character', 'Noble birth', 'Military power', 'Inherited wealth'],
      pt: ['Caráter moral', 'Nascimento nobre', 'Poder militar', 'Riqueza herdada'],
    },
    explanation: { en: 'Confucius redefined nobility as a matter of cultivated character, not birth.', pt: 'Confúcio redefiniu a nobreza como questão de caráter cultivado, não de nascimento.' },
  },
  {
    id: 'confucius-4',
    philosopherSlug: 'confucius',
    prompt: { en: 'What does "li" refer to in Confucian thought?', pt: 'A que se refere o "li" no pensamento confuciano?' },
    options: {
      en: ['Ritual propriety', 'Emptiness', 'Fate', 'The absolute self'],
      pt: ['Ritual e decoro', 'Vacuidade', 'Destino', 'O eu absoluto'],
    },
    explanation: { en: 'Li is ritual propriety — the forms that order relationships and society.', pt: 'O li é o ritual e o decoro — as formas que ordenam as relações e a sociedade.' },
  },

  // ── Mencius ────────────────────────────────────────────────────────────
  {
    id: 'mencius-1',
    philosopherSlug: 'mencius',
    prompt: { en: 'What is Mencius famous for claiming about human nature?', pt: 'Pelo que Mêncio é famoso ao falar da natureza humana?' },
    options: {
      en: ['It is innately good', 'It is innately evil', 'It is a blank slate', 'It does not exist'],
      pt: ['É inatamente boa', 'É inatamente má', 'É uma folha em branco', 'Não existe'],
    },
    explanation: { en: 'Mencius argued that humans are born with "four sprouts" of goodness.', pt: 'Mêncio sustentava que nascemos com os "quatro brotos" da bondade.' },
  },
  {
    id: 'mencius-2',
    philosopherSlug: 'mencius',
    prompt: { en: 'What did Mencius say a ruler loses by failing his people?', pt: 'O que Mêncio dizia que um governante perde ao falhar com seu povo?' },
    options: {
      en: ['The Mandate of Heaven', 'His private wealth', 'His military rank', 'His ancestors'],
      pt: ['O Mandato do Céu', 'Sua riqueza pessoal', 'Sua patente militar', 'Seus ancestrais'],
    },
    explanation: { en: 'A ruler who fails the people forfeits the Mandate of Heaven and may be deposed.', pt: 'Quem falha com o povo perde o Mandato do Céu e pode ser deposto.' },
  },
  {
    id: 'mencius-3',
    philosopherSlug: 'mencius',
    prompt: { en: 'Mencius is traditionally honoured with which title?', pt: 'Mêncio é tradicionalmente honrado com qual título?' },
    options: {
      en: ['The Second Sage', 'The First Teacher', 'The Old Master', 'The Awakened One'],
      pt: ['O Segundo Sábio', 'O Primeiro Mestre', 'O Velho Mestre', 'O Desperto'],
    },
    explanation: { en: 'He is revered as the "Second Sage" after Confucius himself.', pt: 'É venerado como o "Segundo Sábio", após o próprio Confúcio.' },
  },

  // ── Laozi ──────────────────────────────────────────────────────────────
  {
    id: 'laozi-1',
    philosopherSlug: 'laozi',
    prompt: { en: 'Which foundational Taoist text is ascribed to Laozi?', pt: 'Qual texto taoísta fundador é atribuído a Laozi?' },
    options: {
      en: ['The Tao Te Ching', 'The Analects', 'The Yoga Sutras', 'The Book of Five Rings'],
      pt: ['O Tao Te Ching', 'Os Analectos', 'Os Yoga Sutras', 'O Livro dos Cinco Anéis'],
    },
    explanation: { en: 'The Tao Te Ching, some five thousand characters, is ascribed to Laozi.', pt: 'O Tao Te Ching, de cerca de cinco mil caracteres, é atribuído a Laozi.' },
  },
  {
    id: 'laozi-2',
    philosopherSlug: 'laozi',
    prompt: { en: 'What does the Taoist principle "wu wei" mean?', pt: 'O que significa o princípio taoísta "wu wei"?' },
    options: {
      en: ['Effortless, non-forcing action', 'Strict obedience to law', 'Universal love', 'Ritual sacrifice'],
      pt: ['Ação sem esforço, que não força', 'Obediência estrita à lei', 'Amor universal', 'Sacrifício ritual'],
    },
    explanation: { en: 'Wu wei is acting in harmony with nature without forcing outcomes.', pt: 'O wu wei é agir em harmonia com a natureza sem forçar os resultados.' },
  },
  {
    id: 'laozi-3',
    philosopherSlug: 'laozi',
    prompt: { en: 'Which natural image does the Tao Te Ching use for supple strength?', pt: 'Que imagem natural o Tao Te Ching usa para a força flexível?' },
    options: {
      en: ['Water', 'Fire', 'Stone', 'Iron'],
      pt: ['A água', 'O fogo', 'A pedra', 'O ferro'],
    },
    explanation: { en: 'Water yields yet wears away rock — a key Taoist image of soft strength.', pt: 'A água cede e ainda assim desgasta a rocha — imagem-chave da força branda taoísta.' },
  },

  // ── Zhuangzi ───────────────────────────────────────────────────────────
  {
    id: 'zhuangzi-1',
    philosopherSlug: 'zhuangzi',
    prompt: { en: 'Which famous dream is associated with Zhuangzi?', pt: 'Qual sonho famoso está associado a Zhuangzi?' },
    options: {
      en: ['Dreaming he was a butterfly', 'Dreaming of a burning house', 'Dreaming of the Buddha', 'Dreaming of a dragon'],
      pt: ['Sonhar que era uma borboleta', 'Sonhar com uma casa em chamas', 'Sonhar com o Buda', 'Sonhar com um dragão'],
    },
    explanation: { en: 'He woke unsure if he was a man who dreamt a butterfly or the reverse.', pt: 'Acordou sem saber se era um homem que sonhara ser borboleta, ou o contrário.' },
  },
  {
    id: 'zhuangzi-2',
    philosopherSlug: 'zhuangzi',
    prompt: { en: 'What did Zhuangzi reportedly do rather than mourn his wife\'s death?', pt: 'O que Zhuangzi teria feito em vez de lamentar a morte da esposa?' },
    options: {
      en: ['Sang and drummed on a bowl', 'Burned all his books', 'Went to war', 'Built a temple'],
      pt: ['Cantou e tamborilou numa tigela', 'Queimou todos os seus livros', 'Foi à guerra', 'Construiu um templo'],
    },
    explanation: { en: 'For Zhuangzi, death was a natural transformation, not only a loss.', pt: 'Para Zhuangzi, a morte era uma transformação natural, não apenas uma perda.' },
  },
  {
    id: 'zhuangzi-3',
    philosopherSlug: 'zhuangzi',
    prompt: { en: 'A recurring theme of Zhuangzi\'s parables is the relativity of what?', pt: 'Um tema recorrente das parábolas de Zhuangzi é a relatividade de quê?' },
    options: {
      en: ['All viewpoints and distinctions', 'The price of grain', 'Military ranks', 'Royal bloodlines'],
      pt: ['Todos os pontos de vista e distinções', 'O preço do grão', 'As patentes militares', 'As linhagens reais'],
    },
    explanation: { en: 'He pressed how big/small, useful/useless depend on perspective.', pt: 'Ele enfatizava como grande/pequeno, útil/inútil dependem da perspectiva.' },
  },

  // ── Han Feizi ──────────────────────────────────────────────────────────
  {
    id: 'han-feizi-1',
    philosopherSlug: 'han-feizi',
    prompt: { en: 'On what should government rest, according to Han Feizi?', pt: 'Em que deve repousar o governo, segundo Han Feizi?' },
    options: {
      en: ['Law, technique and power', 'The ruler\'s personal virtue', 'Universal love', 'Meditation'],
      pt: ['Lei, técnica e poder', 'A virtude pessoal do governante', 'O amor universal', 'A meditação'],
    },
    explanation: { en: 'He synthesised fa (law), shu (technique) and shi (positional power).', pt: 'Sintetizou fa (lei), shu (técnica) e shi (poder posicional).' },
  },
  {
    id: 'han-feizi-2',
    philosopherSlug: 'han-feizi',
    prompt: { en: 'What are the "two handles" of government in Legalist thought?', pt: 'Quais são as "duas alavancas" do governo no pensamento legalista?' },
    options: {
      en: ['Reward and punishment', 'Prayer and sacrifice', 'Love and ritual', 'Silence and study'],
      pt: ['Recompensa e castigo', 'Oração e sacrifício', 'Amor e ritual', 'Silêncio e estudo'],
    },
    explanation: { en: 'Legalists held that rulers govern through reward and punishment.', pt: 'Os legalistas sustentavam que se governa por recompensa e castigo.' },
  },
  {
    id: 'han-feizi-3',
    philosopherSlug: 'han-feizi',
    prompt: { en: 'Han Feizi studied under which Confucian philosopher?', pt: 'Han Feizi foi discípulo de qual filósofo confuciano?' },
    options: {
      en: ['Xunzi', 'Mencius', 'Confucius', 'Mozi'],
      pt: ['Xunzi', 'Mêncio', 'Confúcio', 'Mozi'],
    },
    explanation: { en: 'He studied under Xunzi but drew Legalist conclusions from his ideas.', pt: 'Estudou com Xunzi, mas tirou de suas ideias conclusões legalistas.' },
  },

  // ── Shang Yang ─────────────────────────────────────────────────────────
  {
    id: 'shang-yang-1',
    philosopherSlug: 'shang-yang',
    prompt: { en: 'Which state did Shang Yang reform into a powerful war machine?', pt: 'Qual Estado Shang Yang reformou numa poderosa máquina de guerra?' },
    options: {
      en: ['Qin', 'Lu', 'Chu', 'Wey'],
      pt: ['Qin', 'Lu', 'Chu', 'Wey'],
    },
    explanation: { en: 'His reforms made Qin strong enough to later unify China.', pt: 'Suas reformas tornaram Qin forte o bastante para depois unificar a China.' },
  },
  {
    id: 'shang-yang-2',
    philosopherSlug: 'shang-yang',
    prompt: { en: 'A core principle of Shang Yang\'s reforms was that law should be what?', pt: 'Um princípio central das reformas de Shang Yang era que a lei deveria ser o quê?' },
    options: {
      en: ['Applied equally regardless of rank', 'Secret and known only to nobles', 'Decided case by case', 'Abolished entirely'],
      pt: ['Aplicada igualmente, sem distinção de posição', 'Secreta e conhecida só dos nobres', 'Decidida caso a caso', 'Inteiramente abolida'],
    },
    explanation: { en: 'He insisted the law bind noble and commoner alike.', pt: 'Insistia que a lei obrigasse nobres e plebeus por igual.' },
  },

  // ── Mozi ───────────────────────────────────────────────────────────────
  {
    id: 'mozi-1',
    philosopherSlug: 'mozi',
    prompt: { en: 'What is the central ethical idea of Mohism?', pt: 'Qual é a ideia ética central do moísmo?' },
    options: {
      en: ['Jian ai (impartial care for all)', 'Graded love of family first', 'Rule by law', 'Non-action'],
      pt: ['Jian ai (cuidado imparcial por todos)', 'Amor graduado, à família primeiro', 'Governo pela lei', 'Não-ação'],
    },
    explanation: { en: 'Mozi preached impartial, universal care against graded Confucian love.', pt: 'Mozi pregava o cuidado imparcial e universal contra o amor graduado confuciano.' },
  },
  {
    id: 'mozi-2',
    philosopherSlug: 'mozi',
    prompt: { en: 'By what test did Mozi judge customs like elaborate funerals?', pt: 'Por que critério Mozi julgava costumes como os funerais suntuosos?' },
    options: {
      en: ['Their benefit to the people', 'Their antiquity', 'Their beauty', 'Their cost'],
      pt: ['Seu benefício ao povo', 'Sua antiguidade', 'Sua beleza', 'Seu custo'],
    },
    explanation: { en: 'Mohists asked of every practice: does it benefit the people?', pt: 'Os moístas perguntavam de cada prática: ela beneficia o povo?' },
  },
  {
    id: 'mozi-3',
    philosopherSlug: 'mozi',
    prompt: { en: 'The Mohists were notably opposed to what?', pt: 'Os moístas eram notavelmente contrários a quê?' },
    options: {
      en: ['Offensive war', 'Farming', 'Writing', 'Trade'],
      pt: ['A guerra ofensiva', 'A agricultura', 'A escrita', 'O comércio'],
    },
    explanation: { en: 'They condemned aggressive war and even helped defend besieged cities.', pt: 'Condenavam a guerra agressiva e até ajudavam a defender cidades sitiadas.' },
  },

  // ── The Buddha ─────────────────────────────────────────────────────────
  {
    id: 'buddha-1',
    philosopherSlug: 'buddha',
    prompt: { en: 'What does the title "Buddha" mean?', pt: 'O que significa o título "Buda"?' },
    options: {
      en: ['The awakened one', 'The great king', 'The first teacher', 'The eternal self'],
      pt: ['O desperto', 'O grande rei', 'O primeiro mestre', 'O eu eterno'],
    },
    explanation: { en: '"Buddha" is a title meaning "the awakened one," not a personal name.', pt: '"Buda" é um título que significa "o desperto", não um nome próprio.' },
  },
  {
    id: 'buddha-2',
    philosopherSlug: 'buddha',
    prompt: { en: 'What do the Four Noble Truths primarily concern?', pt: 'Com o que se ocupam principalmente as Quatro Nobres Verdades?' },
    options: {
      en: ['Suffering and its cessation', 'The creation of the world', 'The duties of kings', 'The structure of the soul'],
      pt: ['O sofrimento e sua cessação', 'A criação do mundo', 'Os deveres dos reis', 'A estrutura da alma'],
    },
    explanation: { en: 'They diagnose suffering, its cause, its end, and the path to its end.', pt: 'Diagnosticam o sofrimento, sua causa, seu fim e o caminho para esse fim.' },
  },
  {
    id: 'buddha-3',
    philosopherSlug: 'buddha',
    prompt: { en: 'The doctrine of "anatta" denies the existence of what?', pt: 'A doutrina do "anatta" nega a existência de quê?' },
    options: {
      en: ['A permanent, unchanging self', 'The external world', 'Cause and effect', 'Other people'],
      pt: ['Um eu permanente e imutável', 'O mundo externo', 'A causa e o efeito', 'As outras pessoas'],
    },
    explanation: { en: 'Anatta, "no-self," denies a fixed, permanent soul behind experience.', pt: 'O anatta, "não-eu", nega uma alma fixa e permanente por trás da experiência.' },
  },
  {
    id: 'buddha-4',
    philosopherSlug: 'buddha',
    prompt: { en: 'The Buddha advocated a "middle way" between what?', pt: 'O Buda defendia um "caminho do meio" entre o quê?' },
    options: {
      en: ['Indulgence and harsh asceticism', 'War and peace', 'Wealth and poverty', 'Speech and silence'],
      pt: ['A indulgência e o ascetismo severo', 'A guerra e a paz', 'A riqueza e a pobreza', 'A fala e o silêncio'],
    },
    explanation: { en: 'After trying extreme asceticism, he taught a balanced middle way.', pt: 'Após experimentar o ascetismo extremo, ensinou um equilibrado caminho do meio.' },
  },

  // ── Nagarjuna ──────────────────────────────────────────────────────────
  {
    id: 'nagarjuna-1',
    philosopherSlug: 'nagarjuna',
    prompt: { en: 'Which doctrine is central to Nagarjuna\'s philosophy?', pt: 'Qual doutrina é central na filosofia de Nagarjuna?' },
    options: {
      en: ['Shunyata (emptiness)', 'Atman (the absolute self)', 'Wu wei (non-action)', 'Li (ritual propriety)'],
      pt: ['Shunyata (vacuidade)', 'Atman (o eu absoluto)', 'Wu wei (não-ação)', 'Li (ritual e decoro)'],
    },
    explanation: { en: 'He held all things "empty" of inherent, independent existence.', pt: 'Sustentava que todas as coisas são "vazias" de existência inerente e independente.' },
  },
  {
    id: 'nagarjuna-2',
    philosopherSlug: 'nagarjuna',
    prompt: { en: 'Which Buddhist school did Nagarjuna found?', pt: 'Qual escola budista Nagarjuna fundou?' },
    options: {
      en: ['Madhyamaka (the Middle Way)', 'Pure Land', 'Theravada', 'Vajrayana'],
      pt: ['Madhyamaka (o Caminho do Meio)', 'Terra Pura', 'Theravada', 'Vajrayana'],
    },
    explanation: { en: 'Nagarjuna founded the Madhyamaka or "Middle Way" school.', pt: 'Nagarjuna fundou a escola Madhyamaka, ou do "Caminho do Meio".' },
  },

  // ── Bodhidharma ────────────────────────────────────────────────────────
  {
    id: 'bodhidharma-1',
    philosopherSlug: 'bodhidharma',
    prompt: { en: 'Bodhidharma is revered as the founder of what in China?', pt: 'Bodhidharma é venerado como fundador de quê na China?' },
    options: {
      en: ['Chan (Zen) Buddhism', 'Confucianism', 'Legalism', 'Pure Land Buddhism'],
      pt: ['O budismo Chan (Zen)', 'O confucionismo', 'O legalismo', 'O budismo da Terra Pura'],
    },
    explanation: { en: 'He is the legendary first patriarch of Chan, which became Zen.', pt: 'É o lendário primeiro patriarca do Chan, que se tornou o Zen.' },
  },
  {
    id: 'bodhidharma-2',
    philosopherSlug: 'bodhidharma',
    prompt: { en: 'For how many years did legend say Bodhidharma meditated facing a wall?', pt: 'Por quantos anos diz a lenda que Bodhidharma meditou diante de uma parede?' },
    options: {
      en: ['Nine', 'Three', 'Twelve', 'Forty'],
      pt: ['Nove', 'Três', 'Doze', 'Quarenta'],
    },
    explanation: { en: 'He is said to have gazed at a wall for nine years at Shaolin.', pt: 'Diz-se que contemplou uma parede por nove anos em Shaolin.' },
  },

  // ── Dōgen ──────────────────────────────────────────────────────────────
  {
    id: 'dogen-1',
    philosopherSlug: 'dogen',
    prompt: { en: 'Which school of Zen did Dōgen found in Japan?', pt: 'Qual escola do Zen Dōgen fundou no Japão?' },
    options: {
      en: ['Sōtō', 'Rinzai', 'Tendai', 'Shingon'],
      pt: ['Sōtō', 'Rinzai', 'Tendai', 'Shingon'],
    },
    explanation: { en: 'Dōgen founded the Sōtō school, centred on "just sitting."', pt: 'Dōgen fundou a escola Sōtō, centrada no "apenas sentar".' },
  },
  {
    id: 'dogen-2',
    philosopherSlug: 'dogen',
    prompt: { en: 'What is Dōgen\'s view of the relation between practice and enlightenment?', pt: 'Qual é a visão de Dōgen sobre a relação entre prática e iluminação?' },
    options: {
      en: ['They are one and the same', 'Practice earns enlightenment later', 'Enlightenment makes practice useless', 'Neither is possible'],
      pt: ['São uma só e a mesma coisa', 'A prática conquista a iluminação depois', 'A iluminação torna a prática inútil', 'Nenhuma é possível'],
    },
    explanation: { en: 'For Dōgen, to sit in zazen is already the expression of awakening.', pt: 'Para Dōgen, sentar-se em zazen já é a expressão do despertar.' },
  },

  // ── Adi Shankara ───────────────────────────────────────────────────────
  {
    id: 'shankara-1',
    philosopherSlug: 'shankara',
    prompt: { en: 'What does Shankara\'s Advaita Vedanta teach about Atman and Brahman?', pt: 'O que o Advaita Vedanta de Shankara ensina sobre Atman e Brahman?' },
    options: {
      en: ['They are one (non-dual)', 'They are eternally separate', 'Neither exists', 'Brahman depends on Atman'],
      pt: ['São um só (não-duais)', 'São eternamente separados', 'Nenhum existe', 'O Brahman depende do Atman'],
    },
    explanation: { en: 'Advaita means "non-dual": the self and the absolute are ultimately one.', pt: 'Advaita significa "não-dual": o eu e o absoluto são, em última instância, um só.' },
  },
  {
    id: 'shankara-2',
    philosopherSlug: 'shankara',
    prompt: { en: 'In Advaita, what is "maya"?', pt: 'No Advaita, o que é "maya"?' },
    options: {
      en: ['The veiling appearance of multiplicity', 'The supreme deity', 'Ritual sacrifice', 'The warrior code'],
      pt: ['A aparência que vela a multiplicidade', 'A divindade suprema', 'O sacrifício ritual', 'O código guerreiro'],
    },
    explanation: { en: 'Maya is the appearance of a separate world veiling the one reality.', pt: 'Maya é a aparência de um mundo separado que vela a realidade única.' },
  },

  // ── Patanjali ──────────────────────────────────────────────────────────
  {
    id: 'patanjali-1',
    philosopherSlug: 'patanjali',
    prompt: { en: 'How do the Yoga Sutras define yoga?', pt: 'Como os Yoga Sutras definem o yoga?' },
    options: {
      en: ['The stilling of the fluctuations of the mind', 'The worship of many gods', 'The art of war', 'Rule by law'],
      pt: ['O aquietamento das flutuações da mente', 'A adoração de muitos deuses', 'A arte da guerra', 'O governo pela lei'],
    },
    explanation: { en: 'Patanjali defines yoga as "the stilling of the fluctuations of the mind."', pt: 'Patañjali define o yoga como "o aquietamento das flutuações da mente".' },
  },
  {
    id: 'patanjali-2',
    philosopherSlug: 'patanjali',
    prompt: { en: 'How many "limbs" of yoga does Patanjali describe?', pt: 'Quantos "membros" do yoga Patañjali descreve?' },
    options: {
      en: ['Eight', 'Four', 'Ten', 'Three'],
      pt: ['Oito', 'Quatro', 'Dez', 'Três'],
    },
    explanation: { en: 'The famous "eight limbs" run from ethical restraint to samadhi.', pt: 'Os famosos "oito membros" vão da contenção ética ao samadhi.' },
  },

  // ── Miyamoto Musashi ───────────────────────────────────────────────────
  {
    id: 'musashi-1',
    philosopherSlug: 'musashi',
    prompt: { en: 'Which book did Miyamoto Musashi write on strategy?', pt: 'Que livro Miyamoto Musashi escreveu sobre estratégia?' },
    options: {
      en: ['The Book of Five Rings', 'The Hagakure', 'The Analects', 'The Tao Te Ching'],
      pt: ['O Livro dos Cinco Anéis', 'O Hagakure', 'Os Analectos', 'O Tao Te Ching'],
    },
    explanation: { en: 'He wrote The Book of Five Rings on swordsmanship and strategy.', pt: 'Escreveu o Livro dos Cinco Anéis sobre a esgrima e a estratégia.' },
  },
  {
    id: 'musashi-2',
    philosopherSlug: 'musashi',
    prompt: { en: 'What was distinctive about Musashi\'s sword style?', pt: 'O que havia de distintivo no estilo de espada de Musashi?' },
    options: {
      en: ['He used two swords at once', 'He refused all weapons', 'He fought only on horseback', 'He never trained'],
      pt: ['Usava duas espadas ao mesmo tempo', 'Recusava todas as armas', 'Lutava só a cavalo', 'Nunca treinava'],
    },
    explanation: { en: 'He founded a two-sword school, Niten Ichi-ryū.', pt: 'Fundou uma escola de duas espadas, a Niten Ichi-ryū.' },
  },

  // ── Yamamoto Tsunetomo ─────────────────────────────────────────────────
  {
    id: 'tsunetomo-1',
    philosopherSlug: 'tsunetomo',
    prompt: { en: 'Which classic text of Bushidō did Tsunetomo inspire?', pt: 'Qual texto clássico do Bushidō Tsunetomo inspirou?' },
    options: {
      en: ['The Hagakure', 'The Book of Five Rings', 'The Dhammapada', 'The Mozi'],
      pt: ['O Hagakure', 'O Livro dos Cinco Anéis', 'O Dhammapada', 'O Mozi'],
    },
    explanation: { en: 'His reflections were recorded as the Hagakure, "Hidden Leaves."', pt: 'Suas reflexões foram registradas como o Hagakure, "Folhas Ocultas".' },
  },
  {
    id: 'tsunetomo-2',
    philosopherSlug: 'tsunetomo',
    prompt: { en: 'The Hagakure famously says the Way of the warrior is found in what?', pt: 'O Hagakure diz, célebre, que o Caminho do guerreiro se encontra em quê?' },
    options: {
      en: ['Death', 'Wealth', 'Fame', 'Comfort'],
      pt: ['Na morte', 'Na riqueza', 'Na fama', 'No conforto'],
    },
    explanation: { en: 'Its opening lines say the warrior\'s Way is found in readiness for death.', pt: 'Suas linhas iniciais dizem que o Caminho do guerreiro está na prontidão para a morte.' },
  },
];

/** The full quiz bank: core questions plus those for the secondary sages. */
export const quizQuestions: QuizQuestion[] = [...baseQuizQuestions, ...quizzesExtra];

/** All questions for a given philosopher. */
export function getQuestionsFor(philosopherSlug: string): QuizQuestion[] {
  return quizQuestions.filter((q) => q.philosopherSlug === philosopherSlug);
}
