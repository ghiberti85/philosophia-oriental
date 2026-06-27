import type { School } from './types';

/**
 * The eight schools of Eastern thought rendered as nodes in the knowledge
 * graph. Each `relations` entry is a directed edge listed once; the graph
 * layer (`lib/graph.ts`) treats them as undirected and derives every node's
 * neighbours, so an edge never needs to be declared on both sides.
 */
export const schools: School[] = [
  {
    slug: 'confucianism',
    name: { en: 'Confucianism', pt: 'Confucionismo' },
    period: { en: '6th century BC →', pt: 'Século VI a.C. →' },
    region: 'china',
    emblem: '儒',
    tagline: {
      en: 'To govern the world, first cultivate yourself.',
      pt: 'Para governar o mundo, primeiro cultive a si mesmo.',
    },
    description: {
      en: 'Confucianism is less a religion than an ethics of relationship: a tradition founded by Confucius (Kongzi) in a fractured age of warring states, teaching that social harmony grows from the moral cultivation of each person. Its keywords — ren (humaneness), li (ritual propriety), xiao (filial piety) and the junzi (the noble person) — describe a ladder from self-mastery to a well-ordered family, state and world. For over two millennia it shaped the civil-service ideals, family life and education of East Asia.',
      pt: 'O confucionismo é menos uma religião do que uma ética da relação: tradição fundada por Confúcio (Kongzi) numa era fraturada de reinos combatentes, ensinando que a harmonia social nasce do cultivo moral de cada pessoa. Suas palavras-chave — ren (humanidade), li (ritual e decoro), xiao (piedade filial) e o junzi (a pessoa nobre) — descrevem uma escada que vai do domínio de si a uma família, um Estado e um mundo bem ordenados. Por mais de dois milênios moldou os ideais do funcionalismo, a vida familiar e a educação no Leste Asiático.',
    },
    coreIdeas: {
      en: [
        'Ren — humaneness, the supreme virtue of caring for others',
        'Li — ritual propriety that orders relationships and society',
        'The rectification of names: words and roles must match reality',
        'Self-cultivation as the root of a well-governed world',
      ],
      pt: [
        'Ren — a humanidade, virtude suprema de cuidar do outro',
        'Li — o ritual e o decoro que ordenam as relações e a sociedade',
        'A retificação dos nomes: palavras e papéis devem corresponder à realidade',
        'O cultivo de si como raiz de um mundo bem governado',
      ],
    },
    philosopherSlugs: ['confucius', 'mencius', 'xunzi', 'zhu-xi'],
    relations: [
      { to: 'legalism', type: 'opposition' },
      { to: 'mohism', type: 'opposition' },
      { to: 'taoism', type: 'opposition' },
      { to: 'bushido', type: 'influence' },
    ],
    accent: '#c2922f',
    keyWorks: [
      { title: { en: 'The Analects', pt: 'Os Analectos' }, author: { en: 'Confucius (disciples)', pt: 'Confúcio (discípulos)' }, year: 'c. 5th c. BC', note: { en: 'Sayings collected after his death', pt: 'Ditos reunidos após sua morte' } },
      { title: { en: 'The Mencius', pt: 'Mêncio' }, author: { en: 'Mencius', pt: 'Mêncio' }, year: 'c. 300 BC', note: { en: 'Human nature is innately good', pt: 'A natureza humana é inatamente boa' } },
      { title: { en: 'The Great Learning', pt: 'O Grande Aprendizado' }, author: { en: 'Tradition', pt: 'Tradição' }, year: 'c. 5th–3rd c. BC', note: { en: 'From self-cultivation to world order', pt: 'Do cultivo de si à ordem do mundo' } },
      { title: { en: 'The Doctrine of the Mean', pt: 'A Doutrina do Meio' }, author: { en: 'Zisi (attrib.)', pt: 'Zisi (atrib.)' }, year: 'c. 5th c. BC', note: { en: 'Harmony through the centred path', pt: 'A harmonia pelo caminho do meio' } },
    ],
  },
  {
    slug: 'taoism',
    name: { en: 'Taoism', pt: 'Taoísmo' },
    period: { en: '6th century BC →', pt: 'Século VI a.C. →' },
    region: 'china',
    emblem: '道',
    tagline: {
      en: 'The Way that can be spoken is not the eternal Way.',
      pt: 'O Caminho que pode ser dito não é o Caminho eterno.',
    },
    description: {
      en: 'Taoism (Daoism) answers Confucian striving with the art of yielding. The Tao — the Way — is the nameless source and pattern of all things, and wisdom lies in aligning with it through wu wei, effortless action that does not force. Where Confucius reforms society, Laozi and Zhuangzi counsel naturalness, spontaneity and humility before a cosmos too vast to master. Its imagery of water, the uncarved block and the empty vessel made it the perennial complement — and rival — of Confucian order.',
      pt: 'O taoísmo (daoísmo) responde ao esforço confuciano com a arte de ceder. O Tao — o Caminho — é a fonte sem nome e o padrão de todas as coisas, e a sabedoria está em afinar-se com ele pelo wu wei, a ação sem esforço que não força. Onde Confúcio reforma a sociedade, Laozi e Zhuangzi aconselham naturalidade, espontaneidade e humildade diante de um cosmos vasto demais para ser dominado. Suas imagens da água, do bloco não esculpido e do vaso vazio fizeram dele o complemento perene — e rival — da ordem confuciana.',
    },
    coreIdeas: {
      en: [
        'The Tao: the ineffable source and pattern of all that is',
        'Wu wei: effortless action in harmony with nature',
        'The unity and interplay of opposites (yin and yang)',
        'Simplicity, spontaneity and the return to the natural',
      ],
      pt: [
        'O Tao: a fonte inefável e o padrão de tudo o que é',
        'Wu wei: a ação sem esforço, em harmonia com a natureza',
        'A unidade e o jogo dos opostos (yin e yang)',
        'A simplicidade, a espontaneidade e o retorno ao natural',
      ],
    },
    philosopherSlugs: ['laozi', 'zhuangzi', 'liezi', 'wang-bi'],
    relations: [{ to: 'zen', type: 'synthesis' }],
    accent: '#3f8a60',
    keyWorks: [
      { title: { en: 'Tao Te Ching', pt: 'Tao Te Ching' }, author: { en: 'Laozi', pt: 'Laozi' }, year: 'c. 4th c. BC', note: { en: 'Eighty-one verses on the Way', pt: 'Oitenta e um versos sobre o Caminho' } },
      { title: { en: 'Zhuangzi', pt: 'Zhuangzi' }, author: { en: 'Zhuangzi', pt: 'Zhuangzi' }, year: 'c. 3rd c. BC', note: { en: 'Parables of freedom and relativity', pt: 'Parábolas de liberdade e relatividade' } },
      { title: { en: 'Liezi', pt: 'Liezi' }, author: { en: 'Lie Yukou (attrib.)', pt: 'Lie Yukou (atrib.)' }, year: 'c. 4th c. BC', note: { en: 'Tales on fate and spontaneity', pt: 'Contos sobre destino e espontaneidade' } },
      { title: { en: 'Daodejing commentaries', pt: 'Comentários ao Daodejing' }, author: { en: 'Wang Bi', pt: 'Wang Bi' }, year: 'c. 240 AD', note: { en: 'The classic philosophical reading', pt: 'A leitura filosófica clássica' } },
    ],
  },
  {
    slug: 'legalism',
    name: { en: 'Legalism', pt: 'Legalismo' },
    period: { en: '4th–3rd century BC', pt: 'Séculos IV–III a.C.' },
    region: 'china',
    emblem: '法',
    tagline: {
      en: 'Rule by clear law, not by the virtue of men.',
      pt: 'Governar por leis claras, não pela virtude dos homens.',
    },
    description: {
      en: 'Legalism (Fajia) is the hard-headed statecraft that unified China. Against the Confucian faith in moral example, its theorists — above all Han Feizi — argued that human beings respond to incentives, so order must rest on impartial law (fa), administrative method (shu) and the ruler\'s positional power (shi). Harsh and pragmatic, it gave the Qin the machinery to forge an empire; its excesses then made it a byword for tyranny, even as later dynasties quietly kept its tools.',
      pt: 'O legalismo (Fajia) é a estatística dura que unificou a China. Contra a fé confuciana no exemplo moral, seus teóricos — sobretudo Han Feizi — sustentavam que os seres humanos respondem a incentivos, de modo que a ordem deve repousar sobre a lei imparcial (fa), o método administrativo (shu) e o poder posicional do governante (shi). Áspero e pragmático, deu ao Qin a engrenagem para forjar um império; seus excessos o tornaram sinônimo de tirania, ainda que dinastias posteriores guardassem em silêncio suas ferramentas.',
    },
    coreIdeas: {
      en: [
        'Fa: impartial, publicly known law applied to all alike',
        'Shu: the administrative techniques of the ruler',
        'Shi: authority flows from position, not personal virtue',
        'Reward and punishment as the "two handles" of government',
      ],
      pt: [
        'Fa: a lei imparcial e pública, aplicada igualmente a todos',
        'Shu: as técnicas administrativas do governante',
        'Shi: a autoridade vem da posição, não da virtude pessoal',
        'Recompensa e castigo como as "duas alavancas" do governo',
      ],
    },
    philosopherSlugs: ['han-feizi', 'shang-yang', 'shen-buhai', 'li-si'],
    relations: [{ to: 'mohism', type: 'influence' }],
    accent: '#a63420',
    keyWorks: [
      { title: { en: 'Han Feizi', pt: 'Han Feizi' }, author: { en: 'Han Feizi', pt: 'Han Feizi' }, year: 'c. 230 BC', note: { en: 'The synthesis of Legalist thought', pt: 'A síntese do pensamento legalista' } },
      { title: { en: 'The Book of Lord Shang', pt: 'O Livro do Senhor Shang' }, author: { en: 'Shang Yang (school)', pt: 'Shang Yang (escola)' }, year: 'c. 4th c. BC', note: { en: 'Reforms of agriculture and war', pt: 'Reformas da agricultura e da guerra' } },
      { title: { en: 'Guanzi (Legalist chapters)', pt: 'Guanzi (capítulos legalistas)' }, author: { en: 'Tradition', pt: 'Tradição' }, year: 'c. 4th–1st c. BC', note: { en: 'Statecraft and political economy', pt: 'Estatística e economia política' } },
    ],
  },
  {
    slug: 'mohism',
    name: { en: 'Mohism', pt: 'Moísmo' },
    period: { en: '5th–3rd century BC', pt: 'Séculos V–III a.C.' },
    region: 'china',
    emblem: '墨',
    tagline: {
      en: 'Care for everyone, impartially and without exception.',
      pt: 'Cuide de todos, imparcialmente e sem exceção.',
    },
    description: {
      en: 'Mohism, founded by Mozi, was Confucianism\'s great early rival: a movement of artisans and logicians preaching jian ai — impartial, universal care — against the graded, family-first love of the Confucians. Practical and anti-war, the Mohists judged every custom by its benefit to the people, pioneered early logic and the defence of besieged cities, and built a disciplined organisation. Eclipsed under the empire, their rigorous arguments were rediscovered as China\'s first systematic ethics and proto-science.',
      pt: 'O moísmo, fundado por Mozi, foi o grande rival inicial do confucionismo: um movimento de artesãos e lógicos que pregava o jian ai — o cuidado imparcial e universal — contra o amor graduado e familista dos confucianos. Prático e antibélico, os moístas julgavam cada costume por seu benefício ao povo, foram pioneiros da lógica e da defesa de cidades sitiadas e ergueram uma organização disciplinada. Eclipsados sob o império, seus argumentos rigorosos foram redescobertos como a primeira ética sistemática e protociência da China.',
    },
    coreIdeas: {
      en: [
        'Jian ai: impartial care extended equally to all',
        'Judging actions by their benefit to the people',
        'Condemnation of offensive war and wasteful luxury',
        'Early rigorous logic and standards of argument',
      ],
      pt: [
        'Jian ai: o cuidado imparcial estendido igualmente a todos',
        'Julgar as ações por seu benefício ao povo',
        'A condenação da guerra ofensiva e do luxo perdulário',
        'Uma lógica rigorosa pioneira e padrões de argumentação',
      ],
    },
    philosopherSlugs: ['mozi', 'qin-huali'],
    relations: [],
    accent: '#5b7fb9',
    keyWorks: [
      { title: { en: 'The Mozi', pt: 'O Mozi' }, author: { en: 'Mozi (school)', pt: 'Mozi (escola)' }, year: 'c. 4th c. BC', note: { en: 'Ethics, logic and the arts of defence', pt: 'Ética, lógica e as artes da defesa' } },
      { title: { en: 'The Mohist Canons', pt: 'Os Cânones Moístas' }, author: { en: 'Later Mohists', pt: 'Moístas tardios' }, year: 'c. 3rd c. BC', note: { en: 'Definitions in logic and optics', pt: 'Definições em lógica e óptica' } },
    ],
  },
  {
    slug: 'buddhism',
    name: { en: 'Buddhism', pt: 'Budismo' },
    period: { en: '5th century BC →', pt: 'Século V a.C. →' },
    region: 'india',
    emblem: '佛',
    tagline: {
      en: 'All that we are is the result of what we have thought.',
      pt: 'Tudo o que somos é resultado do que pensamos.',
    },
    description: {
      en: 'Buddhism begins with a diagnosis: life as we live it is shot through with dukkha, unsatisfactoriness, born of craving and the illusion of a fixed self. The Buddha\'s Four Noble Truths and Eightfold Path chart a way to its cessation — nirvana — through ethics, meditation and insight into impermanence and dependent origination. Spreading from India across Asia, it branched into Theravada, Mahayana and Vajrayana, carrying a psychology of mind that still speaks to philosophy and science today.',
      pt: 'O budismo começa com um diagnóstico: a vida como a vivemos está atravessada por dukkha, a insatisfação, nascida do desejo e da ilusão de um eu fixo. As Quatro Nobres Verdades e o Nobre Caminho Óctuplo do Buda traçam o rumo de sua cessação — o nirvana — pela ética, pela meditação e pela compreensão da impermanência e da originação dependente. Espalhando-se da Índia por toda a Ásia, ramificou-se em Theravada, Mahayana e Vajrayana, levando uma psicologia da mente que ainda hoje dialoga com a filosofia e a ciência.',
    },
    coreIdeas: {
      en: [
        'The Four Noble Truths: suffering and the path beyond it',
        'Anatta: there is no permanent, unchanging self',
        'Anicca: all conditioned things are impermanent',
        'Dependent origination: nothing exists independently',
      ],
      pt: [
        'As Quatro Nobres Verdades: o sofrimento e o caminho além dele',
        'Anatta: não há um eu permanente e imutável',
        'Anicca: tudo o que é condicionado é impermanente',
        'A originação dependente: nada existe de modo independente',
      ],
    },
    philosopherSlugs: ['buddha', 'nagarjuna', 'vasubandhu', 'buddhaghosa'],
    relations: [{ to: 'zen', type: 'lineage' }],
    accent: '#d9ad4f',
    keyWorks: [
      { title: { en: 'The Dhammapada', pt: 'O Dhammapada' }, author: { en: 'Buddhist tradition', pt: 'Tradição budista' }, year: 'c. 3rd c. BC', note: { en: 'Verses on the path of wisdom', pt: 'Versos sobre o caminho da sabedoria' } },
      { title: { en: 'Mūlamadhyamakakārikā', pt: 'Mūlamadhyamakakārikā' }, author: { en: 'Nagarjuna', pt: 'Nagarjuna' }, year: 'c. 2nd c. AD', note: { en: 'The philosophy of emptiness', pt: 'A filosofia da vacuidade' } },
      { title: { en: 'The Heart Sutra', pt: 'O Sutra do Coração' }, author: { en: 'Mahayana tradition', pt: 'Tradição Mahayana' }, year: 'c. 1st c. AD', note: { en: 'Form is emptiness, emptiness is form', pt: 'A forma é vacuidade, a vacuidade é forma' } },
      { title: { en: 'The Pali Canon', pt: 'O Cânone Páli' }, author: { en: 'Theravada tradition', pt: 'Tradição Theravada' }, year: 'c. 1st c. BC', note: { en: 'The earliest collected teachings', pt: 'Os ensinamentos reunidos mais antigos' } },
    ],
  },
  {
    slug: 'zen',
    name: { en: 'Zen', pt: 'Zen' },
    period: { en: '6th century AD →', pt: 'Século VI d.C. →' },
    region: 'japan',
    emblem: '禅',
    tagline: {
      en: 'A special transmission outside the scriptures.',
      pt: 'Uma transmissão especial fora das escrituras.',
    },
    description: {
      en: 'Zen (Chan in China) is Buddhism distilled to direct experience. Born when Indian meditation met Taoist naturalness, it distrusts words and doctrine, pointing instead to sudden awakening (satori) through seated meditation (zazen) and, in the Rinzai line, the koan — a paradox that exhausts the rational mind. From Bodhidharma to Dōgen it shaped the arts of tea, calligraphy, archery and the garden, prizing simplicity, presence and the ordinary moment as the very face of enlightenment.',
      pt: 'O Zen (Chan na China) é o budismo destilado em experiência direta. Nascido quando a meditação indiana encontrou a naturalidade taoísta, desconfia das palavras e da doutrina e aponta para o despertar súbito (satori) pela meditação sentada (zazen) e, na linhagem Rinzai, pelo koan — um paradoxo que esgota a mente racional. De Bodhidharma a Dōgen, moldou as artes do chá, da caligrafia, do arco e do jardim, exaltando a simplicidade, a presença e o momento comum como a própria face da iluminação.',
    },
    coreIdeas: {
      en: [
        'Direct pointing to the mind, beyond words and scripture',
        'Zazen: seated meditation as the heart of practice',
        'The koan: paradox that breaks the grip of logic',
        'Enlightenment in the ordinary, present moment',
      ],
      pt: [
        'O apontar direto para a mente, além das palavras e escrituras',
        'Zazen: a meditação sentada como coração da prática',
        'O koan: o paradoxo que quebra o domínio da lógica',
        'A iluminação no momento comum e presente',
      ],
    },
    philosopherSlugs: ['bodhidharma', 'dogen', 'huineng', 'hakuin'],
    relations: [{ to: 'bushido', type: 'influence' }],
    accent: '#6a7b8c',
    keyWorks: [
      { title: { en: 'Shōbōgenzō', pt: 'Shōbōgenzō' }, author: { en: 'Dōgen', pt: 'Dōgen' }, year: 'c. 1231–1253', note: { en: 'Treasury of the True Dharma Eye', pt: 'Tesouro do Olho do Verdadeiro Dharma' } },
      { title: { en: 'The Gateless Gate', pt: 'A Barreira Sem Portão' }, author: { en: 'Wumen Huikai', pt: 'Wumen Huikai' }, year: '1228', note: { en: 'Classic collection of koans', pt: 'Coletânea clássica de koans' } },
      { title: { en: 'The Platform Sutra', pt: 'O Sutra do Estrado' }, author: { en: 'Huineng (attrib.)', pt: 'Huineng (atrib.)' }, year: 'c. 8th c. AD', note: { en: 'The Sixth Patriarch on sudden awakening', pt: 'O Sexto Patriarca sobre o despertar súbito' } },
    ],
  },
  {
    slug: 'vedanta',
    name: { en: 'Vedanta', pt: 'Vedanta' },
    period: { en: '8th century BC →', pt: 'Século VIII a.C. →' },
    region: 'india',
    emblem: 'ॐ',
    tagline: {
      en: 'That thou art — Atman is Brahman.',
      pt: 'Isto és tu — o Atman é o Brahman.',
    },
    description: {
      en: 'Vedanta — "the end of the Vedas" — is the stream of Indian philosophy that meditates on the Upanishads. In its most influential form, Shankara\'s Advaita (non-dualism), it teaches that the deepest self, Atman, is identical with Brahman, the single reality underlying the universe; the world of separateness is maya, a veiling appearance. Liberation (moksha) is not attainment but recognition: waking from the dream of the divided self. Alongside it, the Yoga of Patanjali maps the disciplined stilling of the mind.',
      pt: 'O Vedanta — "o fim dos Vedas" — é a corrente da filosofia indiana que medita sobre os Upanixades. Em sua forma mais influente, o Advaita (não-dualismo) de Shankara, ensina que o eu mais profundo, o Atman, é idêntico ao Brahman, a realidade única que sustenta o universo; o mundo da separação é maya, uma aparência que vela. A libertação (moksha) não é conquista, mas reconhecimento: despertar do sonho do eu dividido. Ao seu lado, o Yoga de Patañjali mapeia o aquietamento disciplinado da mente.',
    },
    coreIdeas: {
      en: [
        'Atman is Brahman: the self and the absolute are one',
        'Maya: the world of multiplicity as veiling appearance',
        'Moksha: liberation as recognition of one\'s true nature',
        'Yoga: the disciplined stilling of the fluctuations of mind',
      ],
      pt: [
        'Atman é Brahman: o eu e o absoluto são um só',
        'Maya: o mundo da multiplicidade como aparência que vela',
        'Moksha: a libertação como reconhecimento da verdadeira natureza',
        'Yoga: o aquietamento disciplinado das flutuações da mente',
      ],
    },
    philosopherSlugs: ['shankara', 'patanjali', 'ramanuja', 'madhva'],
    relations: [{ to: 'buddhism', type: 'influence' }],
    accent: '#b06a3f',
    keyWorks: [
      { title: { en: 'The Principal Upanishads', pt: 'Os Upanixades Principais' }, author: { en: 'Vedic seers', pt: 'Videntes védicos' }, year: 'c. 800–300 BC', note: { en: 'The visionary source texts', pt: 'Os textos-fonte visionários' } },
      { title: { en: 'Brahma Sutra Bhāṣya', pt: 'Brahma Sutra Bhāṣya' }, author: { en: 'Shankara', pt: 'Shankara' }, year: 'c. 8th c. AD', note: { en: 'The foundational Advaita commentary', pt: 'O comentário fundador do Advaita' } },
      { title: { en: 'Yoga Sutras', pt: 'Yoga Sutras' }, author: { en: 'Patanjali', pt: 'Patañjali' }, year: 'c. 2nd c. BC', note: { en: 'The eight limbs of yoga', pt: 'Os oito membros do yoga' } },
      { title: { en: 'Bhagavad Gita', pt: 'Bhagavad Gita' }, author: { en: 'Vyasa (attrib.)', pt: 'Vyasa (atrib.)' }, year: 'c. 2nd c. BC', note: { en: 'Duty, devotion and the paths to the divine', pt: 'Dever, devoção e os caminhos ao divino' } },
    ],
  },
  {
    slug: 'jainism',
    name: { en: 'Jainism', pt: 'Jainismo' },
    period: { en: '6th century BC →', pt: 'Século VI a.C. →' },
    region: 'india',
    emblem: 'ज',
    tagline: {
      en: 'Harm no living being; the soul is its own liberator.',
      pt: 'Não prejudiques nenhum ser vivo; a alma é sua própria libertadora.',
    },
    description: {
      en: 'Jainism is one of the world\'s oldest living religions and philosophies, founded in its current form by Mahavira in the 6th century BC. Its bedrock is ahimsa — non-violence toward all living beings, down to the smallest insect — and the conviction that each soul is infinite in knowledge and bliss, temporarily bound by karmic matter. Liberation (moksha) is achieved not through divine grace but through the soul\'s own discipline: right knowledge, right faith and right conduct, the three jewels that dissolve karma and return the soul to its native splendour.',
      pt: 'O jainismo é uma das mais antigas religiões e filosofias vivas do mundo, fundado em sua forma atual por Mahavira no século VI a.C. Seu alicerce é o ahimsa — a não-violência em relação a todos os seres vivos, até o menor inseto — e a convicção de que cada alma é infinita em conhecimento e beatitude, temporariamente presa pela matéria cármica. A libertação (moksha) não se alcança pela graça divina, mas pela própria disciplina da alma: conhecimento correto, fé correta e conduta correta, as três joias que dissolvem o karma e devolvem a alma ao seu esplendor original.',
    },
    coreIdeas: {
      en: [
        'Ahimsa: absolute non-violence toward every living being',
        'Anekantavada: reality is many-sided; no single view is complete',
        'Karma as a subtle substance that binds the soul through action',
        'Moksha: the soul\'s liberation by its own effort, not divine grace',
      ],
      pt: [
        'Ahimsa: não-violência absoluta em relação a todos os seres vivos',
        'Anekantavada: a realidade é multifacetada; nenhuma visão é completa',
        'Karma como substância sutil que aprisiona a alma pela ação',
        'Moksha: a libertação da alma pelo próprio esforço, não pela graça divina',
      ],
    },
    philosopherSlugs: ['mahavira', 'kundakunda', 'umasvati'],
    relations: [
      { to: 'buddhism', type: 'opposition' },
      { to: 'vedanta', type: 'opposition' },
    ],
    accent: '#4a90a4',
    keyWorks: [
      { title: { en: 'Tattvartha Sutra', pt: 'Tattvartha Sutra' }, author: { en: 'Umasvati', pt: 'Umasvati' }, year: 'c. 2nd c. AD', note: { en: 'First systematic account of Jain philosophy', pt: 'Primeiro relato sistemático da filosofia jain' } },
      { title: { en: 'Samayasara', pt: 'Samayasara' }, author: { en: 'Kundakunda', pt: 'Kundakunda' }, year: 'c. 2nd c. AD', note: { en: 'The soul in its pure, liberated nature', pt: 'A alma em sua natureza pura e liberta' } },
      { title: { en: 'Acaranga Sutra', pt: 'Acaranga Sutra' }, author: { en: 'Jain tradition', pt: 'Tradição jain' }, year: 'c. 4th c. BC', note: { en: 'The oldest Jain canonical text', pt: 'O mais antigo texto canônico jain' } },
    ],
  },
  {
    slug: 'shintoism',
    name: { en: 'Shintō', pt: 'Xintoísmo' },
    period: { en: 'Antiquity →', pt: 'Antiguidade →' },
    region: 'japan',
    emblem: '神',
    tagline: {
      en: 'The kami dwell in all things; purity opens the path.',
      pt: 'Os kami habitam todas as coisas; a pureza abre o caminho.',
    },
    description: {
      en: 'Shintō, "the way of the kami," is Japan\'s indigenous spirituality — not a system of doctrine but a lived relationship with the sacred forces (kami) that dwell in nature, ancestors and the land itself. Its values are purity (harae), sincerity (makoto) and gratitude, expressed in ritual, festival and the careful maintenance of shrines. Shintō provided the spiritual vocabulary of Japanese identity for millennia and shaped poetry, the arts and the warrior ethic; its encounter with Buddhism produced the rich syncretic tradition of shinbutsu-shūgō.',
      pt: 'O Xintoísmo, "o caminho dos kami", é a espiritualidade indígena do Japão — não um sistema de doutrina, mas uma relação vivida com as forças sagradas (kami) que habitam a natureza, os ancestrais e a própria terra. Seus valores são a pureza (harae), a sinceridade (makoto) e a gratidão, expressos no ritual, na festa e no cuidadoso trato dos santuários. O Xintoísmo forneceu o vocabulário espiritual da identidade japonesa por milênios e moldou a poesia, as artes e a ética guerreira; seu encontro com o budismo gerou a rica tradição sincrética do shinbutsu-shūgō.',
    },
    coreIdeas: {
      en: [
        'Kami: sacred powers dwelling in nature, ancestors and place',
        'Makoto no kokoro: sincerity and purity of heart as the highest virtue',
        'Harae: ritual purification that restores harmony with the sacred',
        'Musubi: the creative, generative force that unites all living things',
      ],
      pt: [
        'Kami: forças sagradas que habitam a natureza, os ancestrais e o lugar',
        'Makoto no kokoro: a sinceridade e a pureza do coração como virtude máxima',
        'Harae: a purificação ritual que restaura a harmonia com o sagrado',
        'Musubi: a força criadora e geradora que une todos os seres vivos',
      ],
    },
    philosopherSlugs: ['motoori-norinaga', 'hirata-atsutane', 'kitabatake-chikafusa'],
    relations: [
      { to: 'zen', type: 'synthesis' },
      { to: 'bushido', type: 'influence' },
    ],
    accent: '#c94a2a',
    keyWorks: [
      { title: { en: 'Kojikiden', pt: 'Kojikiden' }, author: { en: 'Motoori Norinaga', pt: 'Motoori Norinaga' }, year: '1798', note: { en: '44-volume commentary on the Kojiki', pt: 'Comentário em 44 volumes sobre o Kojiki' } },
      { title: { en: 'Kojiki', pt: 'Kojiki' }, author: { en: 'O no Yasumaro', pt: 'O no Yasumaro' }, year: '712', note: { en: 'Japan\'s oldest chronicle of the gods', pt: 'A mais antiga crônica japonesa dos deuses' } },
      { title: { en: 'Jinnō Shōtōki', pt: 'Jinnō Shōtōki' }, author: { en: 'Kitabatake Chikafusa', pt: 'Kitabatake Chikafusa' }, year: '1339', note: { en: 'On the divine lineage of Japan\'s emperors', pt: 'Sobre a linhagem divina dos imperadores do Japão' } },
    ],
  },
  {
    slug: 'bushido',
    name: { en: 'Bushidō', pt: 'Bushidō' },
    period: { en: '12th–19th century AD', pt: 'Séculos XII–XIX d.C.' },
    region: 'japan',
    emblem: '武',
    tagline: {
      en: 'The way of the warrior is found in death.',
      pt: 'O caminho do guerreiro encontra-se na morte.',
    },
    description: {
      en: 'Bushidō, the "way of the warrior," is the ethical code of the samurai — a synthesis of Zen detachment, Confucian loyalty and Shinto purity forged over centuries of feudal Japan. It prizes honour (meiyo), courage, rectitude (gi), benevolence and an unflinching readiness to face death, so that the warrior acts wholly in each moment, free of fear and hesitation. Codified late in works like the Hagakure and Musashi\'s Book of Five Rings, it became the moral imagination of Japan well beyond the battlefield.',
      pt: 'O Bushidō, o "caminho do guerreiro", é o código ético do samurai — síntese do desapego zen, da lealdade confuciana e da pureza xintoísta forjada ao longo de séculos do Japão feudal. Exalta a honra (meiyo), a coragem, a retidão (gi), a benevolência e uma prontidão inabalável para encarar a morte, de modo que o guerreiro aja por inteiro em cada instante, livre de medo e hesitação. Codificado tardiamente em obras como o Hagakure e o Livro dos Cinco Anéis de Musashi, tornou-se a imaginação moral do Japão muito além do campo de batalha.',
    },
    coreIdeas: {
      en: [
        'Gi — rectitude and moral courage in every act',
        'Meiyo — honour, the warrior\'s living and dying concern',
        'Loyalty (chūgi) to lord and duty above self-interest',
        'Readiness for death as the ground of fearless action',
      ],
      pt: [
        'Gi — a retidão e a coragem moral em cada ato',
        'Meiyo — a honra, o cuidado de viver e morrer do guerreiro',
        'A lealdade (chūgi) ao senhor e ao dever acima do interesse próprio',
        'A prontidão para a morte como base da ação sem medo',
      ],
    },
    philosopherSlugs: ['musashi', 'tsunetomo', 'takuan', 'nitobe'],
    relations: [],
    accent: '#8a4b4b',
    keyWorks: [
      { title: { en: 'The Book of Five Rings', pt: 'O Livro dos Cinco Anéis' }, author: { en: 'Miyamoto Musashi', pt: 'Miyamoto Musashi' }, year: '1645', note: { en: 'Strategy of the sword and of life', pt: 'A estratégia da espada e da vida' } },
      { title: { en: 'Hagakure', pt: 'Hagakure' }, author: { en: 'Yamamoto Tsunetomo', pt: 'Yamamoto Tsunetomo' }, year: 'c. 1716', note: { en: 'Hidden leaves: the samurai code', pt: 'Folhas ocultas: o código do samurai' } },
      { title: { en: 'Bushidō: The Soul of Japan', pt: 'Bushidō: A Alma do Japão' }, author: { en: 'Nitobe Inazō', pt: 'Nitobe Inazō' }, year: '1900', note: { en: 'The code explained to the West', pt: 'O código explicado ao Ocidente' } },
    ],
  },
];

/** Lookup a school by slug. */
export function getSchool(slug: string): School | undefined {
  return schools.find((s) => s.slug === slug);
}
