import type { Philosopher } from './types';

/**
 * Secondary sages, kept in a separate module so the core file stays readable.
 * Merged into the exported `philosophers` array in `philosophers.ts`.
 */
export const philosophersExtra: Philosopher[] = [
  // ── Confucianism ───────────────────────────────────────────────────────
  {
    slug: 'xunzi',
    name: { en: 'Xunzi', pt: 'Xunzi' },
    years: { en: 'c. 310–235 BC', pt: 'c. 310–235 a.C.' },
    birthplace: { en: 'State of Zhao', pt: 'Estado de Zhao' },
    schoolSlugs: ['confucianism'],
    epithet: { en: 'The Realist Confucian', pt: 'O Confuciano Realista' },
    biography: {
      en: [
        'Xunzi was the third great Confucian of antiquity and its most systematic thinker. Against Mencius, he held that human nature is bad — or rather crude and selfish — and that goodness is the hard-won achievement of culture, ritual and education, not a sprouting of innate seeds.',
        'Far from pessimism, this made him a passionate champion of learning and civilization as the forces that refine the raw human being. A rigorous, almost scientific mind, he taught two of the most consequential students in Chinese history — the Legalists Han Feizi and Li Si.',
      ],
      pt: [
        'Xunzi foi o terceiro grande confuciano da antiguidade e seu pensador mais sistemático. Contra Mêncio, sustentava que a natureza humana é má — ou antes, crua e egoísta — e que a bondade é uma conquista árdua da cultura, do ritual e da educação, não o brotar de sementes inatas.',
        'Longe de pessimismo, isso fez dele um defensor apaixonado do aprendizado e da civilização como forças que refinam o ser humano bruto. Mente rigorosa, quase científica, formou dois dos discípulos mais consequentes da história chinesa — os legalistas Han Feizi e Li Si.',
      ],
    },
    contributions: {
      en: [
        'Argued that human nature is bad and virtue is made by culture',
        'Gave Confucianism its most rigorous, systematic philosophy',
        'Defended ritual and learning as the engines of civilization',
      ],
      pt: [
        'Sustentou que a natureza humana é má e a virtude é feita pela cultura',
        'Deu ao confucionismo sua filosofia mais rigorosa e sistemática',
        'Defendeu o ritual e o aprendizado como motores da civilização',
      ],
    },
    quotes: [
      { text: { en: 'Learning must never cease.', pt: 'O aprendizado nunca deve cessar.' } },
      { text: { en: 'Pride and excess bring disaster.', pt: 'O orgulho e o excesso trazem o desastre.' } },
    ],
    traits: {
      en: ['Systematic', 'Sceptical of superstition', 'Devoted to education'],
      pt: ['Sistemático', 'Cético quanto à superstição', 'Devotado à educação'],
    },
    facts: {
      en: [
        'His pupils Han Feizi and Li Si became the architects of Legalist Qin.',
        'He rejected belief in omens, urging people to master nature instead of fearing it.',
      ],
      pt: [
        'Seus alunos Han Feizi e Li Si tornaram-se os arquitetos do Qin legalista.',
        'Rejeitava a crença em presságios, instando as pessoas a dominar a natureza em vez de temê-la.',
      ],
    },
    figureImage: '/figures/xunzi.svg',
  },
  {
    slug: 'zhu-xi',
    name: { en: 'Zhu Xi', pt: 'Zhu Xi' },
    years: { en: '1130–1200', pt: '1130–1200' },
    birthplace: { en: 'Fujian, Song China', pt: 'Fujian, China Song' },
    schoolSlugs: ['confucianism'],
    epithet: { en: 'The Neo-Confucian Master', pt: 'O Mestre Neoconfuciano' },
    biography: {
      en: [
        'Zhu Xi was the towering synthesizer of Neo-Confucianism, the movement that revived and re-grounded Confucian thought after centuries of Buddhist and Taoist dominance. He gave the tradition a new metaphysics built on li (principle) and qi (vital force), explaining how a single rational order underlies all things.',
        'He selected and annotated the "Four Books" that would become the core of the imperial examinations for six hundred years, shaping the education of all East Asia. To investigate things and extend knowledge, he taught, is itself a path of moral cultivation.',
      ],
      pt: [
        'Zhu Xi foi o grande sintetizador do neoconfucionismo, o movimento que reavivou e refundou o pensamento confuciano após séculos de domínio budista e taoísta. Deu à tradição uma nova metafísica erguida sobre o li (princípio) e o qi (força vital), explicando como uma única ordem racional subjaz a todas as coisas.',
        'Selecionou e anotou os "Quatro Livros" que se tornariam o núcleo dos exames imperiais por seiscentos anos, moldando a educação de todo o Leste Asiático. Investigar as coisas e ampliar o conhecimento, ensinava, é em si um caminho de cultivo moral.',
      ],
    },
    contributions: {
      en: [
        'Synthesized Neo-Confucian metaphysics of principle (li) and force (qi)',
        'Canonized the Confucian "Four Books" for the examination system',
        'Made the "investigation of things" central to self-cultivation',
      ],
      pt: [
        'Sintetizou a metafísica neoconfuciana do princípio (li) e da força (qi)',
        'Canonizou os "Quatro Livros" confucianos para o sistema de exames',
        'Fez da "investigação das coisas" o centro do cultivo de si',
      ],
    },
    quotes: [
      { text: { en: 'Today investigate one thing, tomorrow another.', pt: 'Hoje investigue uma coisa, amanhã outra.' } },
      { text: { en: 'The mind of man is alive; it is never still.', pt: 'A mente do homem é viva; nunca está imóvel.' } },
    ],
    traits: {
      en: ['Encyclopedic', 'Systematic metaphysician', 'Tireless commentator'],
      pt: ['Enciclopédico', 'Metafísico sistemático', 'Comentador incansável'],
    },
    facts: {
      en: [
        'His edition of the Four Books shaped the exams until 1905.',
        'His rationalist orthodoxy dominated East Asian thought for centuries.',
      ],
      pt: [
        'Sua edição dos Quatro Livros moldou os exames até 1905.',
        'Sua ortodoxia racionalista dominou o pensamento do Leste Asiático por séculos.',
      ],
    },
    figureImage: '/figures/zhu-xi.svg',
  },

  // ── Taoism ─────────────────────────────────────────────────────────────
  {
    slug: 'liezi',
    name: { en: 'Liezi', pt: 'Liezi' },
    years: { en: 'c. 5th century BC', pt: 'c. século V a.C.' },
    birthplace: { en: 'State of Zheng', pt: 'Estado de Zheng' },
    schoolSlugs: ['taoism'],
    epithet: { en: 'The Master of Emptiness', pt: 'O Mestre do Vazio' },
    biography: {
      en: [
        'Liezi is the semi-legendary sage to whom the third great Taoist classic, the Liezi, is ascribed. By tradition he could ride upon the wind, an image of perfect harmony with the natural flow of things.',
        'The book under his name gathers tales, fables and thought-experiments on fate, spontaneity and the relativity of dream and waking. Lighter and more fantastical than Laozi, it spreads the Taoist message through unforgettable stories — including the famous worrier of Qi who feared the sky would fall.',
      ],
      pt: [
        'Liezi é o sábio semilendário a quem se atribui o terceiro grande clássico taoísta, o Liezi. Segundo a tradição, podia cavalgar o vento, imagem da harmonia perfeita com o fluxo natural das coisas.',
        'O livro sob seu nome reúne contos, fábulas e experimentos mentais sobre o destino, a espontaneidade e a relatividade entre sonho e vigília. Mais leve e fantasioso que Laozi, difunde a mensagem taoísta por histórias inesquecíveis — como o famoso aflito de Qi que temia que o céu desabasse.',
      ],
    },
    contributions: {
      en: [
        'Gave Taoism its third classic, the Liezi',
        'Taught acceptance of fate and effortless harmony with nature',
        'Spread Taoist ideas through memorable fables',
      ],
      pt: [
        'Deu ao taoísmo seu terceiro clássico, o Liezi',
        'Ensinou a aceitação do destino e a harmonia sem esforço com a natureza',
        'Difundiu ideias taoístas por fábulas memoráveis',
      ],
    },
    quotes: [
      { text: { en: 'Those who dream of feasting wake to lamentation.', pt: 'Quem sonha com banquetes acorda em lamento.' } },
      { text: { en: 'The way is empty, yet use will not drain it.', pt: 'O caminho é vazio, mas o uso não o esgota.' } },
    ],
    traits: {
      en: ['Imaginative', 'Serene', 'Lover of paradox'],
      pt: ['Imaginativo', 'Sereno', 'Amante do paradoxo'],
    },
    facts: {
      en: [
        'Legend says he could ride the wind for fifteen days at a time.',
        'The Chinese idiom for needless anxiety comes from a fable in his book.',
      ],
      pt: [
        'A lenda diz que podia cavalgar o vento por quinze dias seguidos.',
        'A expressão chinesa para a preocupação inútil vem de uma fábula de seu livro.',
      ],
    },
    figureImage: '/figures/liezi.svg',
  },
  {
    slug: 'wang-bi',
    name: { en: 'Wang Bi', pt: 'Wang Bi' },
    years: { en: '226–249', pt: '226–249' },
    birthplace: { en: 'Shanyang, China', pt: 'Shanyang, China' },
    schoolSlugs: ['taoism'],
    epithet: { en: 'The Young Commentator', pt: 'O Jovem Comentador' },
    biography: {
      en: [
        'Wang Bi was a dazzling prodigy who died at just twenty-three yet left the most influential philosophical commentaries on the Tao Te Ching and the Book of Changes ever written. He led the "Mysterious Learning" (Xuanxue) that revived Taoist metaphysics in the third century.',
        'For Wang Bi, all the multiplicity of the world rests upon and returns to a single, nameless "non-being" — wu — the formless ground from which all forms arise. His reading turned the Tao Te Ching from a book of aphorisms into a rigorous metaphysics of being and nothingness.',
      ],
      pt: [
        'Wang Bi foi um prodígio deslumbrante que morreu com apenas vinte e três anos, mas deixou os comentários filosóficos mais influentes já escritos sobre o Tao Te Ching e o Livro das Mutações. Liderou o "Aprendizado Misterioso" (Xuanxue), que reavivou a metafísica taoísta no século III.',
        'Para Wang Bi, toda a multiplicidade do mundo repousa sobre e retorna a um único "não-ser" sem nome — o wu —, o fundo sem forma de que todas as formas surgem. Sua leitura transformou o Tao Te Ching de um livro de aforismos numa metafísica rigorosa do ser e do nada.',
      ],
    },
    contributions: {
      en: [
        'Wrote the classic philosophical commentary on the Tao Te Ching',
        'Founded "Mysterious Learning" (Xuanxue), reviving Taoist metaphysics',
        'Made "non-being" (wu) the ground of all being',
      ],
      pt: [
        'Escreveu o comentário filosófico clássico ao Tao Te Ching',
        'Fundou o "Aprendizado Misterioso" (Xuanxue), reavivando a metafísica taoísta',
        'Fez do "não-ser" (wu) o fundamento de todo ser',
      ],
    },
    quotes: [
      { text: { en: 'All things in the world come from being; being comes from non-being.', pt: 'Todas as coisas vêm do ser; o ser vem do não-ser.' } },
      { text: { en: 'Once you have the meaning, you can forget the words.', pt: 'Uma vez que se tem o sentido, pode-se esquecer as palavras.' } },
    ],
    traits: {
      en: ['Precocious genius', 'Abstract and subtle', 'Synthesizer of traditions'],
      pt: ['Gênio precoce', 'Abstrato e sutil', 'Sintetizador de tradições'],
    },
    facts: {
      en: [
        'He wrote his masterpieces before the age of twenty-four, when he died.',
        'His commentaries are still printed alongside the classics today.',
      ],
      pt: [
        'Escreveu suas obras-primas antes dos vinte e quatro anos, quando morreu.',
        'Seus comentários ainda hoje são impressos ao lado dos clássicos.',
      ],
    },
    figureImage: '/figures/wang-bi.svg',
  },

  // ── Legalism ───────────────────────────────────────────────────────────
  {
    slug: 'shen-buhai',
    name: { en: 'Shen Buhai', pt: 'Shen Buhai' },
    years: { en: 'c. 400–337 BC', pt: 'c. 400–337 a.C.' },
    birthplace: { en: 'State of Zheng', pt: 'Estado de Zheng' },
    schoolSlugs: ['legalism'],
    epithet: { en: 'Master of Administrative Method', pt: 'Mestre do Método Administrativo' },
    biography: {
      en: [
        'Shen Buhai served as chancellor of the state of Han for fifteen years and is credited with developing shu — the administrative technique that would become one of Legalism\'s three pillars. While others stressed law or raw power, he focused on the art of management itself.',
        'His key insight was accountability: match each official\'s title and duties precisely to their performance, hold them to it, and let the ruler govern through impartial system rather than personal exertion. His writings are largely lost, but Han Feizi preserved and built upon his method.',
      ],
      pt: [
        'Shen Buhai foi chanceler do Estado de Han por quinze anos e é creditado pelo desenvolvimento do shu — a técnica administrativa que se tornaria um dos três pilares do legalismo. Enquanto outros enfatizavam a lei ou o poder bruto, ele se concentrou na própria arte de administrar.',
        'Sua intuição central era a responsabilização: ajustar com precisão o título e os deveres de cada funcionário ao seu desempenho, cobrá-los disso e deixar o governante reger por sistema imparcial em vez de esforço pessoal. Seus escritos em grande parte se perderam, mas Han Feizi preservou e ampliou seu método.',
      ],
    },
    contributions: {
      en: [
        'Developed shu, the administrative technique of statecraft',
        'Pioneered accountability of officials to their stated duties',
        'Shaped the bureaucratic method Han Feizi later synthesized',
      ],
      pt: [
        'Desenvolveu o shu, a técnica administrativa da arte de governar',
        'Foi pioneiro da responsabilização dos funcionários por seus deveres',
        'Moldou o método burocrático que Han Feizi depois sintetizou',
      ],
    },
    quotes: [
      { text: { en: 'The skilful ruler is impartial and quiescent, and nothing escapes him.', pt: 'O governante hábil é imparcial e quieto, e nada lhe escapa.' } },
      { text: { en: 'Names are the starting point of government.', pt: 'Os nomes são o ponto de partida do governo.' } },
    ],
    traits: {
      en: ['Methodical', 'Pragmatic administrator', 'Reserved'],
      pt: ['Metódico', 'Administrador pragmático', 'Reservado'],
    },
    facts: {
      en: [
        'He governed Han for fifteen years with no foreign invasion succeeding.',
        'His concept of matching "name and reality" entered the Legalist toolkit.',
      ],
      pt: [
        'Governou Han por quinze anos sem que nenhuma invasão estrangeira vingasse.',
        'Seu conceito de ajustar "nome e realidade" entrou no arsenal legalista.',
      ],
    },
    figureImage: '/figures/shen-buhai.svg',
  },
  {
    slug: 'li-si',
    name: { en: 'Li Si', pt: 'Li Si' },
    years: { en: 'c. 280–208 BC', pt: 'c. 280–208 a.C.' },
    birthplace: { en: 'State of Chu', pt: 'Estado de Chu' },
    schoolSlugs: ['legalism'],
    epithet: { en: 'Chancellor of the First Emperor', pt: 'Chanceler do Primeiro Imperador' },
    biography: {
      en: [
        'Li Si was the statesman who put Legalism into practice on the grandest scale. A student of the Confucian Xunzi, he rose to become chancellor of Qin and the chief architect of the unified Chinese empire after 221 BC.',
        'He standardized the script, weights, measures and laws across the conquered states, abolished feudalism in favour of centrally appointed administrators, and — notoriously — urged the burning of books to silence dissent. After the First Emperor\'s death he was outmanoeuvred in a palace intrigue and executed; his life is the supreme cautionary tale of Legalist power.',
      ],
      pt: [
        'Li Si foi o estadista que pôs o legalismo em prática na maior das escalas. Discípulo do confuciano Xunzi, ascendeu a chanceler de Qin e principal arquiteto do império chinês unificado após 221 a.C.',
        'Padronizou a escrita, os pesos, as medidas e as leis pelos Estados conquistados, aboliu o feudalismo em favor de administradores nomeados pelo centro e — notoriamente — instigou a queima de livros para calar a dissidência. Após a morte do Primeiro Imperador, foi vencido numa intriga palaciana e executado; sua vida é a suprema parábola de advertência sobre o poder legalista.',
      ],
    },
    contributions: {
      en: [
        'Engineered the administrative unification of China under Qin',
        'Standardized script, weights, measures and law across the empire',
        'Applied Legalist statecraft at imperial scale',
      ],
      pt: [
        'Engendrou a unificação administrativa da China sob Qin',
        'Padronizou escrita, pesos, medidas e leis por todo o império',
        'Aplicou a estatística legalista em escala imperial',
      ],
    },
    quotes: [
      { text: { en: 'A single law, observed by all, makes the state strong.', pt: 'Uma só lei, observada por todos, torna o Estado forte.' } },
      { text: { en: 'Sever the past so the present may be ruled.', pt: 'Romper com o passado para que o presente possa ser governado.' } },
    ],
    traits: {
      en: ['Ambitious', 'Ruthless statesman', 'Brilliant administrator'],
      pt: ['Ambicioso', 'Estadista implacável', 'Administrador brilhante'],
    },
    facts: {
      en: [
        'He standardized Chinese writing into a single official script.',
        'He was executed by the very Legalist methods he had wielded.',
      ],
      pt: [
        'Padronizou a escrita chinesa num único sistema oficial.',
        'Foi executado pelos próprios métodos legalistas que empunhara.',
      ],
    },
    figureImage: '/figures/li-si.svg',
  },

  // ── Mohism ─────────────────────────────────────────────────────────────
  {
    slug: 'qin-huali',
    name: { en: 'Qin Huali', pt: 'Qin Huali' },
    years: { en: 'c. 5th century BC', pt: 'c. século V a.C.' },
    birthplace: { en: 'China', pt: 'China' },
    schoolSlugs: ['mohism'],
    epithet: { en: 'Chief Disciple of Mozi', pt: 'Discípulo Principal de Mozi' },
    biography: {
      en: [
        'Qin Huali was Mozi\'s foremost disciple and the man who carried the Mohist movement forward after the master. Where Mozi laid down the doctrine of impartial care and the condemnation of aggressive war, Qin Huali helped turn it into a disciplined, enduring organization.',
        'Tradition makes him the keeper of the Mohists\' practical knowledge — especially the celebrated arts of defending besieged cities. Through such disciples the Mohist order survived as a tightly knit brotherhood of engineers and moralists for generations.',
      ],
      pt: [
        'Qin Huali foi o principal discípulo de Mozi e o homem que levou adiante o movimento moísta depois do mestre. Onde Mozi estabeleceu a doutrina do cuidado imparcial e a condenação da guerra agressiva, Qin Huali ajudou a convertê-la numa organização disciplinada e duradoura.',
        'A tradição faz dele o guardião do saber prático dos moístas — sobretudo as célebres artes de defender cidades sitiadas. Por discípulos assim, a ordem moísta sobreviveu como uma irmandade coesa de engenheiros e moralistas por gerações.',
      ],
    },
    contributions: {
      en: [
        'Carried Mohism forward as Mozi\'s chief successor',
        'Helped preserve the Mohist arts of city defense',
        'Sustained the movement\'s disciplined organization',
      ],
      pt: [
        'Levou o moísmo adiante como principal sucessor de Mozi',
        'Ajudou a preservar as artes moístas de defesa de cidades',
        'Sustentou a organização disciplinada do movimento',
      ],
    },
    quotes: [
      { text: { en: 'What benefits the people, do; what harms them, refrain.', pt: 'O que beneficia o povo, faça; o que o prejudica, evite.' } },
      { text: { en: 'A doctrine unpractised is no doctrine at all.', pt: 'Uma doutrina não praticada não é doutrina alguma.' } },
    ],
    traits: {
      en: ['Loyal', 'Practical', 'Disciplined'],
      pt: ['Leal', 'Prático', 'Disciplinado'],
    },
    facts: {
      en: [
        'He is named in the Mozi as the master\'s leading follower.',
        'Through him the Mohists kept their engineering knowledge alive.',
      ],
      pt: [
        'É citado no Mozi como o principal seguidor do mestre.',
        'Por meio dele os moístas mantiveram vivo seu saber de engenharia.',
      ],
    },
    figureImage: '/figures/qin-huali.svg',
  },

  // ── Buddhism ───────────────────────────────────────────────────────────
  {
    slug: 'vasubandhu',
    name: { en: 'Vasubandhu', pt: 'Vasubandhu' },
    years: { en: 'c. 4th–5th century AD', pt: 'c. séculos IV–V d.C.' },
    birthplace: { en: 'Gandhara (present-day Pakistan)', pt: 'Gandhara (atual Paquistão)' },
    schoolSlugs: ['buddhism'],
    epithet: { en: 'Master of Mind-Only', pt: 'Mestre do Só-Mente' },
    biography: {
      en: [
        'Vasubandhu was one of the most influential Buddhist philosophers, first a master of the analytical Abhidharma and later, with his half-brother Asanga, a founder of the Yogācāra or "Mind-Only" school of Mahayana Buddhism.',
        'His Yogācāra works argue that the world we experience is a construction of consciousness, and trace the subtle workings of mind, perception and the "storehouse consciousness" that carries our karmic seeds. His earlier Abhidharmakośa remains a classic encyclopedia of Buddhist psychology.',
      ],
      pt: [
        'Vasubandhu foi um dos filósofos budistas mais influentes, primeiro mestre do analítico Abhidharma e depois, com seu meio-irmão Asanga, fundador da escola Yogācāra, ou "Só-Mente", do budismo Mahayana.',
        'Suas obras Yogācāra sustentam que o mundo que experimentamos é uma construção da consciência, e rastreiam o funcionamento sutil da mente, da percepção e da "consciência-depósito" que carrega nossas sementes cármicas. Seu Abhidharmakośa, anterior, permanece uma enciclopédia clássica da psicologia budista.',
      ],
    },
    contributions: {
      en: [
        'Co-founded the Yogācāra ("Mind-Only") school of Mahayana',
        'Wrote the Abhidharmakośa, a classic of Buddhist psychology',
        'Analyzed consciousness and the storehouse of karmic seeds',
      ],
      pt: [
        'Cofundou a escola Yogācāra ("Só-Mente") do Mahayana',
        'Escreveu o Abhidharmakośa, um clássico da psicologia budista',
        'Analisou a consciência e o depósito das sementes cármicas',
      ],
    },
    quotes: [
      { text: { en: 'All this is mere consciousness, for there appear objects that are not there.', pt: 'Tudo isto é mera consciência, pois aparecem objetos que não estão lá.' } },
      { text: { en: 'The world arises from the imagination of what is unreal.', pt: 'O mundo surge da imaginação do que é irreal.' } },
    ],
    traits: {
      en: ['Encyclopedic', 'Psychologically subtle', 'Rigorous analyst'],
      pt: ['Enciclopédico', 'Psicologicamente sutil', 'Analista rigoroso'],
    },
    facts: {
      en: [
        'He reportedly converted from one Buddhist school to another mid-career.',
        'Yogācāra ideas deeply influenced Zen and Tibetan Buddhism.',
      ],
      pt: [
        'Diz-se que se converteu de uma escola budista a outra no meio da carreira.',
        'As ideias Yogācāra influenciaram profundamente o Zen e o budismo tibetano.',
      ],
    },
    figureImage: '/figures/vasubandhu.svg',
  },
  {
    slug: 'buddhaghosa',
    name: { en: 'Buddhaghosa', pt: 'Buddhaghosa' },
    years: { en: 'c. 5th century AD', pt: 'c. século V d.C.' },
    birthplace: { en: 'India / Sri Lanka', pt: 'Índia / Sri Lanka' },
    schoolSlugs: ['buddhism'],
    epithet: { en: 'Voice of the Buddha', pt: 'A Voz do Buda' },
    biography: {
      en: [
        'Buddhaghosa was the greatest scholar of Theravada Buddhism, the tradition of the Pali Canon preserved in Sri Lanka. His name means "Voice of the Buddha," and he devoted his life to organizing and commenting on the earliest teachings.',
        'His masterwork, the Visuddhimagga ("Path of Purification"), is a vast and orderly manual of Buddhist ethics, meditation and wisdom — still the single most authoritative guide to Theravada practice fifteen centuries later.',
      ],
      pt: [
        'Buddhaghosa foi o maior erudito do budismo Theravada, a tradição do Cânone Páli preservada no Sri Lanka. Seu nome significa "Voz do Buda", e dedicou a vida a organizar e comentar os ensinamentos mais antigos.',
        'Sua obra-prima, o Visuddhimagga ("Caminho da Purificação"), é um vasto e ordenado manual de ética, meditação e sabedoria budistas — ainda hoje, quinze séculos depois, o guia mais autoritativo da prática Theravada.',
      ],
    },
    contributions: {
      en: [
        'Wrote the Visuddhimagga, the great manual of Theravada practice',
        'Systematized the commentaries on the Pali Canon',
        'Preserved and clarified the earliest Buddhist teachings',
      ],
      pt: [
        'Escreveu o Visuddhimagga, o grande manual da prática Theravada',
        'Sistematizou os comentários ao Cânone Páli',
        'Preservou e esclareceu os ensinamentos budistas mais antigos',
      ],
    },
    quotes: [
      { text: { en: 'Purification is to be understood as nibbana, free from all stains.', pt: 'A purificação deve ser entendida como o nibbana, livre de toda mácula.' } },
      { text: { en: 'Virtue, concentration, wisdom — this is the whole of the path.', pt: 'Virtude, concentração, sabedoria — eis todo o caminho.' } },
    ],
    traits: {
      en: ['Methodical', 'Devoted scholar', 'Clear expositor'],
      pt: ['Metódico', 'Erudito devotado', 'Expositor claro'],
    },
    facts: {
      en: [
        'He worked at the Mahavihara monastery in Anuradhapura, Sri Lanka.',
        'The Visuddhimagga is still studied by Theravada monks worldwide.',
      ],
      pt: [
        'Trabalhou no mosteiro Mahavihara, em Anuradhapura, no Sri Lanka.',
        'O Visuddhimagga ainda é estudado por monges Theravada no mundo todo.',
      ],
    },
    figureImage: '/figures/buddhaghosa.svg',
  },

  // ── Zen ────────────────────────────────────────────────────────────────
  {
    slug: 'huineng',
    name: { en: 'Huineng', pt: 'Huineng' },
    years: { en: '638–713', pt: '638–713' },
    birthplace: { en: 'Guangdong, Tang China', pt: 'Guangdong, China Tang' },
    schoolSlugs: ['zen'],
    epithet: { en: 'The Sixth Patriarch', pt: 'O Sexto Patriarca' },
    biography: {
      en: [
        'Huineng is revered as the Sixth Patriarch of Chan and the most pivotal figure after Bodhidharma. An illiterate woodcutter, he is said to have grasped awakening on merely hearing the Diamond Sutra recited in a market, and to have received the patriarch\'s robe over learned monks.',
        'His teaching, recorded in the Platform Sutra — the only Chinese work granted the title of "sutra" — champions sudden awakening: enlightenment is not built up by gradual effort but seen directly into one\'s own original nature. From his lineage the great schools of Zen would flow.',
      ],
      pt: [
        'Huineng é venerado como o Sexto Patriarca do Chan e a figura mais decisiva depois de Bodhidharma. Lenhador analfabeto, diz-se que alcançou o despertar apenas ao ouvir o Sutra do Diamante recitado num mercado, e que recebeu o manto do patriarca à frente de monges eruditos.',
        'Seu ensino, registrado no Sutra do Estrado — a única obra chinesa a receber o título de "sutra" —, defende o despertar súbito: a iluminação não se constrói por esforço gradual, mas se vê diretamente na própria natureza original. De sua linhagem fluiriam as grandes escolas do Zen.',
      ],
    },
    contributions: {
      en: [
        'Championed sudden awakening over gradual cultivation',
        'Inspired the Platform Sutra, a foundational Chan text',
        'Founded the lineage from which later Zen schools descend',
      ],
      pt: [
        'Defendeu o despertar súbito acima do cultivo gradual',
        'Inspirou o Sutra do Estrado, texto fundador do Chan',
        'Fundou a linhagem da qual descendem as escolas posteriores do Zen',
      ],
    },
    quotes: [
      { text: { en: 'From the first, not a thing is.', pt: 'Desde o princípio, não há coisa alguma.' } },
      { text: { en: 'It is your mind that moves, not the flag.', pt: 'É a sua mente que se move, não a bandeira.' } },
    ],
    traits: {
      en: ['Intuitive', 'Unschooled yet profound', 'Direct'],
      pt: ['Intuitivo', 'Sem instrução, mas profundo', 'Direto'],
    },
    facts: {
      en: [
        'He was an illiterate woodcutter before becoming patriarch.',
        'The Platform Sutra is the only Chinese text honored as a "sutra".',
      ],
      pt: [
        'Era um lenhador analfabeto antes de se tornar patriarca.',
        'O Sutra do Estrado é o único texto chinês honrado como "sutra".',
      ],
    },
    figureImage: '/figures/huineng.svg',
  },
  {
    slug: 'hakuin',
    name: { en: 'Hakuin Ekaku', pt: 'Hakuin Ekaku' },
    years: { en: '1686–1769', pt: '1686–1769' },
    birthplace: { en: 'Hara, Japan', pt: 'Hara, Japão' },
    schoolSlugs: ['zen'],
    epithet: { en: 'Reviver of Rinzai Zen', pt: 'O Renovador do Zen Rinzai' },
    biography: {
      en: [
        'Hakuin Ekaku single-handedly revived the Rinzai school of Zen in Japan after a long decline. A fierce and tireless teacher, painter and calligrapher, he reorganized koan practice into a systematic path and brought Zen out of the monasteries to ordinary farmers and townsfolk.',
        'He is the author of the most famous koan of all — "What is the sound of one hand?" — and of vivid writings on the great doubt, the great awakening, and the bottomless work of post-enlightenment practice. His ink paintings are treasures of Zen art.',
      ],
      pt: [
        'Hakuin Ekaku revitalizou sozinho a escola Rinzai do Zen no Japão, após um longo declínio. Mestre, pintor e calígrafo feroz e incansável, reorganizou a prática dos koans num caminho sistemático e levou o Zen para fora dos mosteiros, até camponeses e citadinos comuns.',
        'É o autor do koan mais famoso de todos — "Qual é o som de uma só mão?" — e de escritos vívidos sobre a grande dúvida, o grande despertar e o trabalho sem fundo da prática após a iluminação. Suas pinturas a nanquim são tesouros da arte zen.',
      ],
    },
    contributions: {
      en: [
        'Revived and systematized Rinzai koan practice',
        'Created the famous koan "the sound of one hand"',
        'Brought Zen teaching to ordinary lay people',
      ],
      pt: [
        'Revitalizou e sistematizou a prática de koans Rinzai',
        'Criou o famoso koan "o som de uma só mão"',
        'Levou o ensino zen às pessoas leigas comuns',
      ],
    },
    quotes: [
      { text: { en: 'What is the sound of one hand clapping?', pt: 'Qual é o som de uma só mão batendo palma?' } },
      { text: { en: 'All beings are fundamentally Buddha.', pt: 'Todos os seres são, em essência, Buda.' } },
    ],
    traits: {
      en: ['Fierce teacher', 'Artist and calligrapher', 'Indefatigable'],
      pt: ['Mestre feroz', 'Artista e calígrafo', 'Infatigável'],
    },
    facts: {
      en: [
        'Thousands of his vigorous ink paintings survive.',
        'Nearly every Japanese Rinzai master today traces their lineage to him.',
      ],
      pt: [
        'Milhares de suas vigorosas pinturas a nanquim sobreviveram.',
        'Quase todo mestre Rinzai japonês de hoje traça sua linhagem até ele.',
      ],
    },
    figureImage: '/figures/hakuin.svg',
  },

  // ── Vedanta ────────────────────────────────────────────────────────────
  {
    slug: 'ramanuja',
    name: { en: 'Ramanuja', pt: 'Ramanuja' },
    years: { en: '1017–1137', pt: '1017–1137' },
    birthplace: { en: 'Sriperumbudur, India', pt: 'Sriperumbudur, Índia' },
    schoolSlugs: ['vedanta'],
    epithet: { en: 'Champion of Devotion', pt: 'O Defensor da Devoção' },
    biography: {
      en: [
        'Ramanuja was the great philosopher of Vishishtadvaita, or "qualified non-dualism," the chief rival reading of Vedanta to Shankara\'s austere monism. Against the idea that the personal world is mere illusion, he argued that the world and individual souls are real — the living body of a personal God.',
        'For Ramanuja the path to liberation is not cold knowledge alone but bhakti, loving devotion and surrender to God, who is full of auspicious qualities. He gave intellectual depth to the devotional movements that would reshape Hindu life across India.',
      ],
      pt: [
        'Ramanuja foi o grande filósofo do Vishishtadvaita, ou "não-dualismo qualificado", a principal leitura rival do Vedanta frente ao monismo austero de Shankara. Contra a ideia de que o mundo pessoal é mera ilusão, sustentou que o mundo e as almas individuais são reais — o corpo vivo de um Deus pessoal.',
        'Para Ramanuja, o caminho da libertação não é só o conhecimento frio, mas a bhakti, a devoção amorosa e a entrega a Deus, pleno de qualidades auspiciosas. Deu profundidade intelectual aos movimentos devocionais que remodelariam a vida hindu por toda a Índia.',
      ],
    },
    contributions: {
      en: [
        'Founded Vishishtadvaita, the qualified non-dualist Vedanta',
        'Defended the reality of the world and individual souls',
        'Made loving devotion (bhakti) central to liberation',
      ],
      pt: [
        'Fundou o Vishishtadvaita, o Vedanta não-dualista qualificado',
        'Defendeu a realidade do mundo e das almas individuais',
        'Fez da devoção amorosa (bhakti) o centro da libertação',
      ],
    },
    quotes: [
      { text: { en: 'The soul finds its fullness in loving service to God.', pt: 'A alma encontra sua plenitude no serviço amoroso a Deus.' } },
      { text: { en: 'The world is real, for it is the body of the Lord.', pt: 'O mundo é real, pois é o corpo do Senhor.' } },
    ],
    traits: {
      en: ['Devotional', 'Rigorous theologian', 'Inclusive reformer'],
      pt: ['Devocional', 'Teólogo rigoroso', 'Reformador inclusivo'],
    },
    facts: {
      en: [
        'He is said to have lived to the age of 120.',
        'He opened temple worship and learning to people of all castes.',
      ],
      pt: [
        'Diz-se que viveu até os 120 anos.',
        'Abriu o culto no templo e o aprendizado a pessoas de todas as castas.',
      ],
    },
    figureImage: '/figures/ramanuja.svg',
  },
  {
    slug: 'madhva',
    name: { en: 'Madhva', pt: 'Madhva' },
    years: { en: '1238–1317', pt: '1238–1317' },
    birthplace: { en: 'Pajaka, India', pt: 'Pajaka, Índia' },
    schoolSlugs: ['vedanta'],
    epithet: { en: 'Founder of Dualism', pt: 'O Fundador do Dualismo' },
    biography: {
      en: [
        'Madhva was the boldest dissenter within Vedanta, founder of Dvaita or "dualism." Where Shankara saw ultimate oneness, Madhva insisted on an eternal, unbridgeable distinction between the supreme God, individual souls, and matter — each fully real, each forever distinct.',
        'A vigorous debater and devotee of Vishnu, he argued that liberation is not merging into the absolute but eternal loving relationship with a God who is wholly other. His sharply realist, pluralist vision stands as the great counterweight to Advaita in Indian thought.',
      ],
      pt: [
        'Madhva foi o mais ousado dissidente dentro do Vedanta, fundador do Dvaita, ou "dualismo". Onde Shankara via a unidade última, Madhva insistia numa distinção eterna e intransponível entre o Deus supremo, as almas individuais e a matéria — cada um plenamente real, cada um para sempre distinto.',
        'Debatedor vigoroso e devoto de Vishnu, argumentava que a libertação não é fundir-se no absoluto, mas a relação amorosa eterna com um Deus que é totalmente outro. Sua visão acentuadamente realista e pluralista é o grande contrapeso ao Advaita no pensamento indiano.',
      ],
    },
    contributions: {
      en: [
        'Founded Dvaita (dualist) Vedanta',
        'Defended an eternal distinction between God, souls and matter',
        'Made eternal relationship with God the goal, not merger',
      ],
      pt: [
        'Fundou o Dvaita (Vedanta dualista)',
        'Defendeu a distinção eterna entre Deus, almas e matéria',
        'Fez da relação eterna com Deus a meta, não a fusão',
      ],
    },
    quotes: [
      { text: { en: 'The soul is forever distinct from, and dependent on, God.', pt: 'A alma é para sempre distinta de Deus, e dele dependente.' } },
      { text: { en: 'Difference is the very nature of reality.', pt: 'A diferença é a própria natureza da realidade.' } },
    ],
    traits: {
      en: ['Combative debater', 'Uncompromising realist', 'Ardent devotee'],
      pt: ['Debatedor combativo', 'Realista intransigente', 'Devoto ardente'],
    },
    facts: {
      en: [
        'His followers maintain a major pilgrimage center at Udupi.',
        'He was a strong athlete as well as a formidable philosopher.',
      ],
      pt: [
        'Seus seguidores mantêm um grande centro de peregrinação em Udupi.',
        'Foi atleta vigoroso, além de filósofo formidável.',
      ],
    },
    figureImage: '/figures/madhva.svg',
  },

  // ── Bushidō ────────────────────────────────────────────────────────────
  {
    slug: 'takuan',
    name: { en: 'Takuan Sōhō', pt: 'Takuan Sōhō' },
    years: { en: '1573–1645', pt: '1573–1645' },
    birthplace: { en: 'Izushi, Japan', pt: 'Izushi, Japão' },
    schoolSlugs: ['bushido'],
    epithet: { en: 'The Sword-Mind Monk', pt: 'O Monge da Mente-Espada' },
    biography: {
      en: [
        'Takuan Sōhō was a Rinzai Zen master, calligrapher, poet and gardener whose teaching bound Zen to the way of the sword. His celebrated letters to the sword master Yagyū Munenori — "The Unfettered Mind" — became a cornerstone of the spiritual side of Bushidō.',
        'His core teaching was the "mind that does not stop": in combat as in life, the moment attention sticks to anything — the opponent\'s blade, one\'s own fear — it is already lost. Only a mind that flows freely, abiding nowhere, can respond with perfect freedom.',
      ],
      pt: [
        'Takuan Sōhō foi mestre Zen Rinzai, calígrafo, poeta e jardineiro cujo ensino uniu o Zen ao caminho da espada. Suas célebres cartas ao mestre de espada Yagyū Munenori — "A Mente Sem Amarras" — tornaram-se pedra angular do lado espiritual do Bushidō.',
        'Seu ensino central era a "mente que não para": no combate como na vida, no instante em que a atenção se prende a algo — a lâmina do oponente, o próprio medo — já está perdida. Só uma mente que flui livremente, sem repousar em parte alguma, pode responder com liberdade perfeita.',
      ],
    },
    contributions: {
      en: [
        'Joined Zen practice to the way of the sword',
        'Wrote "The Unfettered Mind" on the mind that does not stop',
        'Shaped the spiritual dimension of Bushidō',
      ],
      pt: [
        'Uniu a prática Zen ao caminho da espada',
        'Escreveu "A Mente Sem Amarras" sobre a mente que não para',
        'Moldou a dimensão espiritual do Bushidō',
      ],
    },
    quotes: [
      { text: { en: 'The mind must not stop anywhere, or it is lost.', pt: 'A mente não deve parar em lugar algum, ou está perdida.' } },
      { text: { en: 'Let the mind go free, abiding nowhere.', pt: 'Deixe a mente livre, sem repousar em parte alguma.' } },
    ],
    traits: {
      en: ['Contemplative', 'Artist and poet', 'Free-spirited'],
      pt: ['Contemplativo', 'Artista e poeta', 'De espírito livre'],
    },
    facts: {
      en: [
        'The takuan pickled radish is traditionally said to be named after him.',
        'He advised both shoguns and legendary swordsmen of his age.',
      ],
      pt: [
        'O rabanete em conserva "takuan" é, por tradição, dito ter o nome dele.',
        'Aconselhou tanto xoguns quanto espadachins lendários de sua época.',
      ],
    },
    figureImage: '/figures/takuan.svg',
  },
  {
    slug: 'nitobe',
    name: { en: 'Nitobe Inazō', pt: 'Nitobe Inazō' },
    years: { en: '1862–1933', pt: '1862–1933' },
    birthplace: { en: 'Morioka, Japan', pt: 'Morioka, Japão' },
    schoolSlugs: ['bushido'],
    epithet: { en: 'Interpreter of Bushidō', pt: 'O Intérprete do Bushidō' },
    biography: {
      en: [
        'Nitobe Inazō was a scholar, diplomat and educator who, in 1900, wrote "Bushidō: The Soul of Japan" — in English, for a Western audience — and so gave the warrior code its most famous modern statement. A Christian and internationalist, he sought to explain Japanese ethics to the world.',
        'His book framed Bushidō as the moral backbone of Japan: a chivalry built on rectitude, courage, benevolence, honor and self-control. Though later scholars debate how faithfully it mirrors the historical samurai, it powerfully shaped how both the West and modern Japan understand the warrior ideal.',
      ],
      pt: [
        'Nitobe Inazō foi um erudito, diplomata e educador que, em 1900, escreveu "Bushidō: A Alma do Japão" — em inglês, para o público ocidental — e assim deu ao código guerreiro sua formulação moderna mais famosa. Cristão e internacionalista, buscava explicar a ética japonesa ao mundo.',
        'Seu livro apresentou o Bushidō como a espinha dorsal moral do Japão: uma cavalaria erguida sobre retidão, coragem, benevolência, honra e autocontrole. Embora estudiosos posteriores debatam quão fielmente ele espelha o samurai histórico, moldou poderosamente como o Ocidente e o Japão moderno entendem o ideal guerreiro.',
      ],
    },
    contributions: {
      en: [
        'Wrote "Bushidō: The Soul of Japan", explaining the code to the world',
        'Framed the samurai ethic as a coherent moral philosophy',
        'Bridged Japanese and Western thought as scholar and diplomat',
      ],
      pt: [
        'Escreveu "Bushidō: A Alma do Japão", explicando o código ao mundo',
        'Apresentou a ética samurai como uma filosofia moral coerente',
        'Uniu o pensamento japonês e ocidental como erudito e diplomata',
      ],
    },
    quotes: [
      { text: { en: 'Bushidō made the sword its emblem of power and prowess.', pt: 'O Bushidō fez da espada seu emblema de poder e destreza.' } },
      { text: { en: 'Courage is doing what is right.', pt: 'A coragem é fazer o que é certo.' } },
    ],
    traits: {
      en: ['Cosmopolitan', 'Bridge-builder', 'Idealist'],
      pt: ['Cosmopolita', 'Construtor de pontes', 'Idealista'],
    },
    facts: {
      en: [
        'He served as an Under-Secretary General of the League of Nations.',
        'His face once appeared on the Japanese 5,000-yen banknote.',
      ],
      pt: [
        'Foi subsecretário-geral da Liga das Nações.',
        'Seu rosto já figurou na nota japonesa de 5.000 ienes.',
      ],
    },
    figureImage: '/figures/nitobe.svg',
  },
];
