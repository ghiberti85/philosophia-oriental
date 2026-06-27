import type { Localized } from '@/lib/i18n';

/**
 * Deep-dive content for the dashboard popups: one expanded essay per core
 * idea (same index order as `school.coreIdeas`) and a longer historical
 * context (one paragraph per array entry) per school. Optional per school —
 * the UI falls back to the short description when a detail is absent.
 */
export interface SchoolDetail {
  /** ideaDetails[i] expands coreIdeas[i]. Optional — falls back to the short idea text. */
  ideaDetails?: Localized<string[]>;
  /** Extended historical context, one paragraph per entry. */
  contextLong: Localized<string[]>;
}

export const schoolDetails: Record<string, SchoolDetail> = {
  confucianism: {
    ideaDetails: {
      en: [
        'Ren, often translated as humaneness or benevolence, is for Confucius the supreme virtue and the inner reality of which ritual is the outer form. It is not abstract love of humankind but the cultivated disposition to treat each person — parent, ruler, stranger — with the care their relationship deserves. Ren cannot be installed by decree; it grows through practice, reflection and the company of the good.',
        'Li covers ritual, etiquette and the whole web of customary forms by which people show respect and find their place. Far from empty formality, li is for Confucius the choreography of a humane society: bowing, mourning, hosting and addressing others rightly trains the heart and binds the community. Ritual without feeling is hollow, but feeling without form runs to chaos.',
        'The "rectification of names" holds that disorder begins when words drift from realities — when a ruler is called a ruler but does not rule justly, or a father is a father in name only. Set the names right, Confucius taught, and conduct follows; let them slip, and "the people have nowhere to put hand or foot." Language, for him, is a moral instrument.',
        'For Confucius, the reform of the world begins not with institutions but with the self. The famous sequence runs from investigating things to sincerity of will, to an ordered family, to a well-governed state, to peace under heaven. Because the ruler\'s character radiates outward like wind over grass, the cultivation of virtue in those who lead is the root of everything else.',
      ],
      pt: [
        'O ren, traduzido por humanidade ou benevolência, é para Confúcio a virtude suprema e a realidade interior de que o ritual é a forma exterior. Não é amor abstrato à humanidade, mas a disposição cultivada de tratar cada pessoa — pai, governante, estranho — com o cuidado que sua relação merece. O ren não se instala por decreto; cresce pela prática, pela reflexão e pela companhia dos bons.',
        'O li abrange o ritual, a etiqueta e toda a teia de formas costumeiras pelas quais as pessoas demonstram respeito e encontram seu lugar. Longe de formalidade vazia, o li é para Confúcio a coreografia de uma sociedade humana: reverenciar, prantear, receber e dirigir-se ao outro corretamente educa o coração e une a comunidade. Ritual sem sentimento é oco, mas sentimento sem forma desemboca no caos.',
        'A "retificação dos nomes" sustenta que a desordem começa quando as palavras se afastam das realidades — quando um governante é chamado governante mas não governa com justiça, ou um pai é pai apenas no nome. Acerte os nomes, ensinava Confúcio, e a conduta seguirá; deixe-os escorregar, e "o povo não terá onde pôr a mão ou o pé". A linguagem, para ele, é um instrumento moral.',
        'Para Confúcio, a reforma do mundo começa não nas instituições, mas no eu. A famosa sequência vai da investigação das coisas à sinceridade da vontade, à família ordenada, ao Estado bem governado, à paz sob o céu. Porque o caráter do governante se irradia como o vento sobre a relva, o cultivo da virtude em quem lidera é a raiz de todo o resto.',
      ],
    },
    contextLong: {
      en: [
        'Confucius lived during the Spring and Autumn period, as the Zhou dynasty\'s authority crumbled into the rivalries that would become the Warring States. Into this disorder he offered not new gods or laws but a vision of moral renewal rooted in the idealised rituals of early Zhou. Rejected by the rulers of his day, he poured himself into teaching, and it was his students and their students who carried his name forward.',
        'For centuries Confucianism competed with Taoism, Mohism and Legalism. Its triumph came under the Han dynasty, which made it the official doctrine of the state and the curriculum of the examinations that selected officials — a role it held, with interruptions and reinventions, into the twentieth century. No body of thought has shaped more human lives.',
        'Confucianism never hardened into a single creed. It absorbed Buddhist and Taoist ideas, was reborn as the rigorous metaphysics of the Song-dynasty Neo-Confucians, was attacked as a relic during China\'s twentieth-century revolutions, and is studied again today across East Asia — and increasingly the West — as a living ethic of family, learning, ritual and public responsibility.',
      ],
      pt: [
        'Confúcio viveu durante o período das Primaveras e Outonos, quando a autoridade da dinastia Zhou se esfacelava nas rivalidades que dariam nos Reinos Combatentes. A essa desordem ele ofereceu não novos deuses ou leis, mas uma visão de renovação moral enraizada nos rituais idealizados dos primeiros Zhou. Rejeitado pelos governantes de seu tempo, dedicou-se ao ensino, e foram seus discípulos, e os discípulos destes, que levaram seu nome adiante.',
        'Por séculos o confucionismo competiu com o taoísmo, o moísmo e o legalismo. Seu triunfo veio sob a dinastia Han, que o fez doutrina oficial do Estado e currículo dos exames que selecionavam os funcionários — papel que manteve, com interrupções e reinvenções, até o século XX. Nenhum corpo de pensamento moldou mais vidas humanas.',
        'O confucionismo nunca se cristalizou num credo único. Absorveu ideias budistas e taoístas, renasceu como a rigorosa metafísica dos neoconfucianos da dinastia Song, foi atacado como relíquia durante as revoluções chinesas do século XX e hoje volta a ser estudado em todo o Leste Asiático — e cada vez mais no Ocidente — como uma ética viva da família, do estudo, do ritual e da responsabilidade pública.',
      ],
    },
  },
  taoism: {
    ideaDetails: {
      en: [
        'The Tao is the nameless source from which all things arise and to which they return — not a god or a thing, but the way reality moves. Because naming and dividing belong to the human mind, the Tao itself can never be captured in words: "the Tao that can be spoken is not the eternal Tao." Wisdom begins in humility before this mystery.',
        'Wu wei, literally "non-action," does not mean passivity but action so attuned to circumstances that it seems effortless — like water finding its way around stone. The sage acts without forcing, leads without dominating, and accomplishes much by not contending. Striving and over-management, the Taoists warn, usually produce the opposite of what they intend.',
        'In the Taoist vision opposites are not enemies but partners: there is no high without low, no full without empty, no being without non-being. The famous yin-yang names this dance of complementary forces that generate and balance each other. To grasp it is to stop clinging to one pole and to move with the turning of things.',
        'Against Confucian cultivation and Mohist calculation, Taoism prizes the natural and uncarved — the simplicity of the infant, the usefulness of the empty vessel, the strength of the supple. Civilisation\'s cleverness, it suggests, often leads us away from our true nature. To return to simplicity is to recover spontaneity and peace.',
      ],
      pt: [
        'O Tao é a fonte sem nome de que todas as coisas surgem e à qual retornam — não um deus ou uma coisa, mas o modo como a realidade se move. Porque nomear e dividir pertencem à mente humana, o próprio Tao jamais pode ser capturado em palavras: "o Tao que pode ser dito não é o Tao eterno". A sabedoria começa na humildade diante desse mistério.',
        'O wu wei, literalmente "não-ação", não significa passividade, mas ação tão afinada às circunstâncias que parece sem esforço — como a água que contorna a pedra. O sábio age sem forçar, conduz sem dominar e realiza muito por não disputar. O esforço excessivo e o controle, advertem os taoístas, costumam produzir o oposto do que pretendem.',
        'Na visão taoísta, os opostos não são inimigos, mas parceiros: não há alto sem baixo, cheio sem vazio, ser sem não-ser. O famoso yin-yang nomeia essa dança de forças complementares que se geram e equilibram. Compreendê-la é deixar de se apegar a um polo e mover-se com o girar das coisas.',
        'Contra o cultivo confuciano e o cálculo moísta, o taoísmo prefere o natural e o não esculpido — a simplicidade do recém-nascido, a utilidade do vaso vazio, a força do flexível. A esperteza da civilização, sugere, muitas vezes nos afasta de nossa verdadeira natureza. Voltar à simplicidade é reaver a espontaneidade e a paz.',
      ],
    },
    contextLong: {
      en: [
        'Taoism arose in the same age of turmoil as Confucianism, but pointed in the opposite direction. Where Confucius sought to repair society through ritual and duty, the Taoist texts counselled stepping back from ambition and aligning with the rhythms of nature. The two became the great complementary poles of the Chinese mind — many a scholar was a Confucian in office and a Taoist in retirement.',
        'Beyond philosophy, Taoism gave rise to a vast religious tradition of alchemy, meditation and the pursuit of longevity, and it shaped Chinese poetry, painting and medicine. Its encounter with Indian Buddhism helped give birth to Chan, which travelled to Japan as Zen.',
        'Its love of nature and spontaneity flows through the landscape paintings and mountain poetry of imperial China, and its counsel of yielding, emptiness and the strength of the soft still circulates worldwide through the Tao Te Ching — one of the most translated books ever written.',
      ],
      pt: [
        'O taoísmo surgiu na mesma era de tumulto que o confucionismo, mas apontava para a direção oposta. Onde Confúcio buscava reparar a sociedade pelo ritual e pelo dever, os textos taoístas aconselhavam recuar da ambição e afinar-se com os ritmos da natureza. Os dois tornaram-se os grandes polos complementares da mente chinesa — muitos eruditos foram confucianos no cargo e taoístas na reclusão.',
        'Para além da filosofia, o taoísmo deu origem a uma vasta tradição religiosa de alquimia, meditação e busca da longevidade, e moldou a poesia, a pintura e a medicina chinesas. Seu encontro com o budismo indiano ajudou a fazer nascer o Chan, que viajou ao Japão como Zen.',
        'Seu amor pela natureza e pela espontaneidade atravessa a pintura de paisagem e a poesia das montanhas da China imperial, e seu conselho de ceder, esvaziar-se e confiar na força do brando ainda circula pelo mundo através do Tao Te Ching — um dos livros mais traduzidos já escritos.',
      ],
    },
  },
  buddhism: {
    ideaDetails: {
      en: [
        'The Four Noble Truths are the Buddha\'s diagnosis and cure: that life as ordinarily lived involves suffering (dukkha); that suffering arises from craving and attachment; that it can cease; and that the way to its cessation is the Eightfold Path of right view, intention, speech, action, livelihood, effort, mindfulness and concentration. The framework is famously practical — closer to medicine than metaphysics.',
        'Anatta, "no-self," denies that behind our changing experience lies a permanent, unchanging soul. What we call "I" is a bundle of ever-shifting processes — body, sensation, perception, will and consciousness — with no fixed core. Seeing through the illusion of a solid self loosens the grip of craving and fear that the self-illusion sustains.',
        'Anicca is the truth that everything conditioned is impermanent: thoughts, bodies, mountains, civilisations all arise and pass. Suffering comes largely from clutching at what cannot last. To absorb impermanence is not despair but freedom — a way of holding life lightly and meeting change with equanimity.',
        'Dependent origination teaches that nothing exists on its own; every thing and event arises in dependence on conditions and passes when they do. This interconnectedness undercuts the notion of independent, self-existing things and grounds both the no-self teaching and, later, Nagarjuna\'s philosophy of emptiness.',
      ],
      pt: [
        'As Quatro Nobres Verdades são o diagnóstico e a cura do Buda: que a vida vivida de modo comum envolve sofrimento (dukkha); que o sofrimento nasce do desejo e do apego; que ele pode cessar; e que o caminho de sua cessação é o Nobre Caminho Óctuplo — visão, intenção, fala, ação, meio de vida, esforço, atenção e concentração corretos. O esquema é célebre por sua praticidade — mais perto da medicina do que da metafísica.',
        'O anatta, "não-eu", nega que por trás de nossa experiência mutável exista uma alma permanente e imutável. O que chamamos de "eu" é um feixe de processos em incessante mudança — corpo, sensação, percepção, vontade e consciência — sem núcleo fixo. Ver através da ilusão de um eu sólido afrouxa o domínio do desejo e do medo que essa ilusão sustenta.',
        'O anicca é a verdade de que tudo o que é condicionado é impermanente: pensamentos, corpos, montanhas, civilizações, tudo surge e passa. O sofrimento vem em grande parte de agarrar o que não pode durar. Absorver a impermanência não é desespero, mas liberdade — um modo de segurar a vida com leveza e encarar a mudança com equanimidade.',
        'A originação dependente ensina que nada existe por si; cada coisa e evento surge na dependência de condições e passa quando elas passam. Essa interdependência mina a noção de coisas independentes e autoexistentes e fundamenta tanto o ensino do não-eu quanto, mais tarde, a filosofia da vacuidade de Nagarjuna.',
      ],
    },
    contextLong: {
      en: [
        'Buddhism began in the Ganges plain around the fifth century BC, amid a ferment of wandering ascetics questioning the authority of the Vedas. The Buddha\'s teaching spread first across India under the patronage of the emperor Ashoka, then along trade routes into Central, East and Southeast Asia, adapting to each culture it met.',
        'Over time it branched into the Theravada of Sri Lanka and Southeast Asia, the Mahayana of China, Korea and Japan, and the Vajrayana of Tibet. Despite their differences, all carry the Buddha\'s core insight into suffering and its end — and a sophisticated philosophy of mind that continues to draw interest from psychology and Western thought.',
        'Curiously, Buddhism eventually faded in the India that birthed it, even as it became the faith of much of Asia. In the modern age it has become a global movement: its meditation practices are studied by neuroscientists, and its analysis of mind, self and suffering is in active dialogue with physics, philosophy and the cognitive sciences.',
      ],
      pt: [
        'O budismo começou na planície do Ganges por volta do século V a.C., em meio a um fervilhar de ascetas errantes que questionavam a autoridade dos Vedas. O ensino do Buda espalhou-se primeiro pela Índia sob o patrocínio do imperador Ashoka e depois pelas rotas comerciais até a Ásia Central, Oriental e do Sudeste, adaptando-se a cada cultura que encontrava.',
        'Com o tempo, ramificou-se no Theravada do Sri Lanka e do Sudeste Asiático, no Mahayana da China, Coreia e Japão, e no Vajrayana do Tibete. Apesar das diferenças, todos carregam a intuição central do Buda sobre o sofrimento e seu fim — e uma sofisticada filosofia da mente que segue atraindo o interesse da psicologia e do pensamento ocidental.',
        'Curiosamente, o budismo acabou por declinar na própria Índia que o gerou, ainda que se tornasse a fé de boa parte da Ásia. Na era moderna virou um movimento global: suas práticas de meditação são estudadas por neurocientistas, e sua análise da mente, do eu e do sofrimento dialoga ativamente com a física, a filosofia e as ciências cognitivas.',
      ],
    },
  },
  zen: {
    ideaDetails: {
      en: [
        'Zen\'s defining claim is "a special transmission outside the scriptures, not relying on words and letters." Concepts and doctrines, however true, are fingers pointing at the moon, not the moon itself. Awakening is a direct seeing into one\'s own nature, transmitted mind-to-mind from master to student rather than learned from books.',
        'Zazen, seated meditation, is the beating heart of Zen practice. In the Sōtō tradition especially, one simply sits in alert, open awareness — "just sitting" — neither suppressing thoughts nor chasing them. This is not a technique for getting somewhere else; for Dōgen, to sit fully present is already the expression of awakening.',
        'The koan is a paradoxical question or story — "What is the sound of one hand?" — that cannot be solved by ordinary reasoning. Wrestled with in the Rinzai school, it exhausts the discursive mind until it lets go, opening a space for sudden insight. The koan turns the intellect against its own habit of grasping.',
        'Zen locates enlightenment not in some far mystical realm but in the most ordinary acts: chopping wood, carrying water, drinking tea. To be fully awake in the present moment, free of the chatter of past and future, is the whole of it. This is why Zen so deeply shaped the everyday arts of tea, gardening and calligraphy.',
      ],
      pt: [
        'A tese definidora do Zen é "uma transmissão especial fora das escrituras, sem depender de palavras e letras". Conceitos e doutrinas, por mais verdadeiros, são dedos que apontam para a lua, não a lua. O despertar é um ver direto a própria natureza, transmitido de mente a mente, do mestre ao discípulo, e não aprendido nos livros.',
        'O zazen, a meditação sentada, é o coração pulsante da prática zen. Na tradição Sōtō, em especial, simplesmente se senta numa consciência atenta e aberta — "apenas sentar" —, sem suprimir os pensamentos nem persegui-los. Não é técnica para chegar a outro lugar; para Dōgen, sentar-se plenamente presente já é a expressão do despertar.',
        'O koan é uma pergunta ou história paradoxal — "Qual é o som de uma só mão?" — que não se resolve pelo raciocínio comum. Trabalhado na escola Rinzai, esgota a mente discursiva até que ela se solte, abrindo espaço para a intuição súbita. O koan volta o intelecto contra seu próprio hábito de agarrar.',
        'O Zen situa a iluminação não em algum reino místico distante, mas nos atos mais comuns: cortar lenha, carregar água, beber chá. Estar plenamente desperto no momento presente, livre do falatório do passado e do futuro, é tudo. Por isso o Zen moldou tão profundamente as artes cotidianas do chá, do jardim e da caligrafia.',
      ],
    },
    contextLong: {
      en: [
        'Zen began as Chan in China, when the meditative current of Indian Buddhism met the naturalism of Taoism. Tradition traces it to the Indian monk Bodhidharma and a lineage of patriarchs, flowering in the Tang and Song dynasties into the iconoclastic style of masters who shouted, struck and posed riddles to jolt students awake.',
        'Carried to Japan in the twelfth and thirteenth centuries, Chan became Zen, splitting into the Rinzai school of the koan and Dōgen\'s Sōtō school of silent sitting. There it shaped the warrior class, the tea ceremony and an entire aesthetic of restraint and emptiness that still defines Japanese art.',
        'In the twentieth century teachers like D. T. Suzuki carried Zen to the West, where it touched artists, poets and the modern mindfulness movement. True to its origins, it still insists that the point is not to talk about awakening but to sit down and taste it directly.',
      ],
      pt: [
        'O Zen começou como Chan na China, quando a corrente meditativa do budismo indiano encontrou o naturalismo do taoísmo. A tradição o faz remontar ao monge indiano Bodhidharma e a uma linhagem de patriarcas, florescendo nas dinastias Tang e Song no estilo iconoclasta de mestres que gritavam, golpeavam e propunham enigmas para sacudir os discípulos rumo ao despertar.',
        'Levado ao Japão nos séculos XII e XIII, o Chan tornou-se Zen, cindindo-se na escola Rinzai do koan e na escola Sōtō de Dōgen, do sentar silencioso. Ali moldou a classe guerreira, a cerimônia do chá e toda uma estética de contenção e vazio que ainda define a arte japonesa.',
        'No século XX, mestres como D. T. Suzuki levaram o Zen ao Ocidente, onde tocou artistas, poetas e o moderno movimento de mindfulness. Fiel às suas origens, ele ainda insiste em que o ponto não é falar sobre o despertar, mas sentar-se e prová-lo diretamente.',
      ],
    },
  },
  legalism: {
    contextLong: {
      en: [
        'Legalism crystallized in the chaos of the Warring States, when seven great kingdoms fought for survival and the old aristocratic order was breaking down. Thinkers like Shang Yang, Shen Buhai and Han Feizi asked a ruthless question: how can a ruler hold and strengthen a state when neither tradition nor personal virtue can be relied upon?',
        'Their answer was system over sentiment — clear public law, impartial reward and punishment, and administrative method that did not depend on the ruler being wise or good. Adopted wholesale by the state of Qin, these methods built the army and bureaucracy that conquered every rival and, in 221 BC, unified China for the first time.',
        'But the Qin\'s severity — forced labor, censorship, brutal punishments — provoked rebellion, and the dynasty fell within a single generation. Legalism was forever branded as tyranny; yet every later dynasty quietly kept its tools, governing in practice with a Confucian face over a Legalist skeleton.',
      ],
      pt: [
        'O legalismo cristalizou-se no caos dos Reinos Combatentes, quando sete grandes reinos lutavam pela sobrevivência e a velha ordem aristocrática ruía. Pensadores como Shang Yang, Shen Buhai e Han Feizi faziam uma pergunta implacável: como um governante pode manter e fortalecer um Estado quando nem a tradição nem a virtude pessoal são confiáveis?',
        'Sua resposta foi o sistema acima do sentimento — lei pública clara, recompensa e castigo imparciais e um método administrativo que não dependia de o governante ser sábio ou bom. Adotados em bloco pelo Estado de Qin, esses métodos ergueram o exército e a burocracia que conquistaram todos os rivais e, em 221 a.C., unificaram a China pela primeira vez.',
        'Mas a severidade de Qin — trabalho forçado, censura, punições brutais — provocou a revolta, e a dinastia caiu em uma só geração. O legalismo ficou para sempre marcado como tirania; ainda assim, toda dinastia posterior guardou em silêncio suas ferramentas, governando na prática com um rosto confuciano sobre um esqueleto legalista.',
      ],
    },
  },
  mohism: {
    contextLong: {
      en: [
        'Mohism arose in the fifth century BC as the first organized rival to Confucianism, founded by Mozi, a man of the artisan class rather than the scholar-gentry. In an age of constant war between states, the Mohists were radicals of peace and utility, judging every custom by a single test: does it benefit the common people?',
        'They were not only philosophers but a disciplined, almost military brotherhood. Famous as expert engineers of fortification, they would march to any city threatened by aggressive war and organize its defense, turning their doctrine of impartial care into concrete action. The later Mohists also built China\'s first systematic logic and studied optics and geometry.',
        'Under the unified empire, with its hostility to independent organizations, Mohism declined rapidly and its texts were nearly lost. Rediscovered and re-edited only in modern times, it is now recognized as one of classical China\'s most original and rigorous schools — its impartial ethics strikingly close to later ideals of universal benevolence.',
      ],
      pt: [
        'O moísmo surgiu no século V a.C. como o primeiro rival organizado do confucionismo, fundado por Mozi, homem da classe artesã e não da nobreza letrada. Numa era de guerra constante entre os Estados, os moístas eram radicais da paz e da utilidade, julgando cada costume por um único teste: ele beneficia o povo comum?',
        'Não eram apenas filósofos, mas uma irmandade disciplinada, quase militar. Célebres como exímios engenheiros de fortificação, marchavam a qualquer cidade ameaçada por guerra agressiva e organizavam sua defesa, convertendo a doutrina do cuidado imparcial em ação concreta. Os moístas tardios também ergueram a primeira lógica sistemática da China e estudaram óptica e geometria.',
        'Sob o império unificado, hostil às organizações independentes, o moísmo declinou depressa e seus textos quase se perderam. Redescoberto e reeditado apenas nos tempos modernos, é hoje reconhecido como uma das escolas mais originais e rigorosas da China clássica — sua ética imparcial surpreendentemente próxima de ideais posteriores de benevolência universal.',
      ],
    },
  },
  vedanta: {
    contextLong: {
      en: [
        'Vedanta — literally "the end of the Vedas" — grew from the Upanishads, the visionary dialogues composed in India from around the eighth century BC that turned away from ritual sacrifice toward the inner question of the self. What, they asked, is the reality behind appearances, and who are we beneath the changing play of the senses?',
        'Over the centuries this stream divided into great schools. Shankara\'s Advaita (non-dualism) held that the self and the absolute are utterly one and the world a veiling appearance; Ramanuja\'s qualified non-dualism made room for love and a personal God; Madhva\'s dualism kept soul and God forever distinct. Their debates are among the most subtle in all of philosophy.',
        'Carried alongside the Bhagavad Gita and the disciplined practice of yoga, Vedanta became the philosophical backbone of Hindu thought. In the modern era figures like Vivekananda brought it to a global audience, and its vision of a single reality underlying all things still fascinates philosophers, scientists and seekers worldwide.',
      ],
      pt: [
        'O Vedanta — literalmente "o fim dos Vedas" — nasceu dos Upanixades, os diálogos visionários compostos na Índia a partir de cerca do século VIII a.C., que se voltaram do sacrifício ritual para a questão interior do eu. Qual, perguntavam, é a realidade por trás das aparências, e quem somos nós sob o jogo mutável dos sentidos?',
        'Ao longo dos séculos essa corrente dividiu-se em grandes escolas. O Advaita (não-dualismo) de Shankara sustentava que o eu e o absoluto são absolutamente um, e o mundo uma aparência que vela; o não-dualismo qualificado de Ramanuja abriu espaço para o amor e um Deus pessoal; o dualismo de Madhva manteve alma e Deus para sempre distintos. Seus debates estão entre os mais sutis de toda a filosofia.',
        'Levado ao lado da Bhagavad Gita e da prática disciplinada do yoga, o Vedanta tornou-se a espinha dorsal filosófica do pensamento hindu. Na era moderna, figuras como Vivekananda o levaram a um público global, e sua visão de uma realidade única que sustenta todas as coisas ainda fascina filósofos, cientistas e buscadores pelo mundo.',
      ],
    },
  },
  jainism: {
    ideaDetails: {
      en: [
        'Ahimsa — non-violence — is the supreme principle of Jainism, elevated by Mahavira from a monastic rule into a cosmic and ethical absolute. Every living being, from a human to a single-celled organism, possesses a soul (jiva) that deserves not to be harmed. This conviction shaped not only Jain monasticism — monks sweep the path before them and strain water before drinking — but also the communities of Jain merchants and artisans who made non-violent livelihoods a social practice, and influenced figures as remote as Mahatma Gandhi.',
        'Anekantavada, the "doctrine of many-sidedness," is Jainism\'s remarkable contribution to logic and epistemology. It holds that reality is infinitely complex and that no single perspective can capture it fully — every statement is true "in some respect" (syat). From this follows syadvada, the sevenfold predication that maps what can and cannot be said about any object from any angle. Far from relativism, it is an argument for intellectual humility: the great errors of history, Jains hold, come from mistaking a partial view for the whole.',
        'In Jain physics, karma is not a moral principle but a literal substance — ultra-fine particles of matter that adhere to the soul when it acts, thinks or speaks with passion. Each karmic particle adds a "stain" of a particular colour (lesha) to the soul, weighing it down and binding it to the cycle of rebirth. Liberation requires not merely good deeds but the cessation of karmic inflow (samvara) and the burning off of existing karma (nirjara) through austerity, so that the soul, purified, rises to its natural place at the apex of the cosmos.',
        'Moksha in Jainism is a state of infinite knowledge, infinite perception, infinite bliss and infinite energy — the soul\'s own nature, fully uncovered. Unlike Hindu liberation, it does not merge the soul with God or Brahman; each liberated soul (siddha) remains distinct, dwelling in eternal self-luminous isolation at the summit of the universe. There is no divine grace involved: each soul liberates itself alone, by its own effort. This radical individualism of the spiritual path gives Jain soteriology its singular character.',
      ],
      pt: [
        'O ahimsa — não-violência — é o princípio supremo do jainismo, elevado por Mahavira de uma regra monástica a um absoluto cósmico e ético. Todo ser vivo, de um ser humano a um organismo unicelular, possui uma alma (jiva) que merece não ser prejudicada. Essa convicção moldou não só o monasticismo jain — monges varrem o caminho antes de caminhar e filtram a água antes de bebê-la — mas também as comunidades de comerciantes e artesãos jains que tornaram meios de vida não-violentos uma prática social, e influenciou figuras tão distantes quanto Mahatma Gandhi.',
        'O anekantavada, a "doutrina da multifaceticidade", é a notável contribuição do jainismo à lógica e à epistemologia. Sustenta que a realidade é infinitamente complexa e que nenhuma perspectiva isolada pode captá-la inteiramente — toda afirmação é verdadeira "de algum modo" (syat). Disso decorre o syadvada, a predicação sétupla que mapeia o que pode e não pode ser dito sobre qualquer objeto de qualquer ângulo. Longe do relativismo, é um argumento pela humildade intelectual: os grandes erros da história, sustentam os jains, advêm de tomar uma visão parcial pelo todo.',
        'Na física jain, o karma não é um princípio moral, mas uma substância literal — partículas ultrafinas de matéria que aderem à alma quando ela age, pensa ou fala com paixão. Cada partícula cármica adiciona uma "mancha" de determinada cor (lesha) à alma, pesando-a e aprisionando-a ao ciclo das reencarnações. A libertação requer não apenas boas ações, mas a cessação do influxo cármico (samvara) e a queima do karma existente (nirjara) pela austeridade, para que a alma, purificada, suba ao seu lugar natural no ápice do cosmos.',
        'O moksha no jainismo é um estado de conhecimento infinito, percepção infinita, beatitude infinita e energia infinita — a própria natureza da alma, plenamente desvelada. Ao contrário da libertação hindu, não funde a alma com Deus ou o Brahman; cada alma liberta (siddha) permanece distinta, habitando em isolamento eterno e auto-luminoso no cume do universo. Não há graça divina envolvida: cada alma se liberta sozinha, pelo próprio esforço. Esse individualismo radical do caminho espiritual confere à soteriologia jain seu caráter singular.',
      ],
    },
    contextLong: {
      en: [
        'Jainism emerged in the 6th century BC in the Gangetic plain of northern India, in the same milieu that produced the Buddha. Both Mahavira and Siddhartha Gautama were born into the warrior-noble (Kshatriya) caste, both rejected Vedic sacrificial religion, and both founded communities of monks and laypersons around an ethic of non-violence and liberation from rebirth. Yet their philosophies diverged sharply: Buddhism denied a permanent soul; Jainism made the eternal, individual soul the very centre of its metaphysics.',
        'For over two millennia Jainism survived as a minority religion — never numerically large, but culturally and economically significant. Jain merchants, following their ahimsa ethic, gravitated toward trade and banking rather than agriculture or war, accumulating wealth that funded extraordinary temples, libraries and manuscript traditions. The cave temples of Ellora and the marble complex at Palitana testify to a patronage of the arts unmatched by their numbers.',
        'In the modern era, Jainism\'s influence has extended far beyond its perhaps five million adherents. Gandhi acknowledged Jain neighbour Shrimad Rajchandra as one of his greatest early guides, and the concept of ahimsa he absorbed from both Jainism and Hinduism reshaped twentieth-century politics. Today Jain philosophers contribute actively to debates on environmental ethics, animal rights and the epistemology of religious diversity, offering anekantavada as a model for pluralist dialogue.',
      ],
      pt: [
        'O jainismo emergiu no século VI a.C. na planície gangética do norte da Índia, no mesmo meio que produziu o Buda. Tanto Mahavira quanto Siddhartha Gautama nasceram na casta guerreira-nobre (Kshatriya), ambos rejeitaram a religião sacrificial védica e ambos fundaram comunidades de monges e leigos em torno de uma ética de não-violência e libertação da reencarnação. Contudo, suas filosofias divergiram acentuadamente: o budismo negou uma alma permanente; o jainismo fez da alma eterna e individual o próprio centro de sua metafísica.',
        'Por mais de dois milênios o jainismo sobreviveu como religião minoritária — nunca numericamente grande, mas cultural e economicamente significativo. Os comerciantes jains, seguindo sua ética do ahimsa, gravitaram para o comércio e a banca em vez da agricultura ou da guerra, acumulando riqueza que financiou templos, bibliotecas e tradições manuscritas extraordinários. Os templos escavados na rocha de Ellora e o complexo de mármore de Palitana testemunham um mecenato das artes inigualado para seu tamanho.',
        'Na era moderna, a influência do jainismo se estendeu muito além de seus talvez cinco milhões de seguidores. Gandhi reconheceu o vizinho jain Shrimad Rajchandra como um de seus maiores guias nos primeiros anos, e o conceito de ahimsa que absorveu tanto do jainismo quanto do hinduísmo reformulou a política do século XX. Hoje, filósofos jains contribuem ativamente para debates de ética ambiental, direitos animais e epistemologia da diversidade religiosa, oferecendo o anekantavada como modelo para o diálogo pluralista.',
      ],
    },
  },
  shintoism: {
    ideaDetails: {
      en: [
        'Kami are the sacred powers at the heart of Shintō — not gods in the Western sense of omnipotent, transcendent beings, but rather the numinous quality felt in the presence of anything that evokes awe, reverence or wonder: a twisted cedar tree, a rushing mountain waterfall, the spirit of a great ancestor, the sun goddess Amaterasu. There are traditionally said to be eight million kami, a number meaning "uncountably many," dwelling in nature, in communities and in the imperial line. Shintō is thus less a theology than an ongoing relationship of gratitude and reverence with these sacred presences.',
        'Makoto no kokoro — sincerity of heart — is the central virtue of Shintō, the disposition that enables authentic relationship with the kami. Where Confucianism emphasises ritual correctness and Buddhism emphasises detachment, Shintō insists on a pure, undivided heart that does not calculate, pretend or hold back. The Kojiki\'s heroes are admired less for moral perfection than for this transparency of intention; the priest at the shrine and the warrior on the battlefield are both serving the kami with the same sincere heart.',
        'Harae, ritual purification, is the practical heart of Shintō worship — the ceremonies, gestures and prayers by which a person who has become kegare (ritually impure) through contact with death, blood, illness or sin returns to a state of harmony with the sacred. The great national purification rites (oharae) were performed twice a year in classical Japan to cleanse the whole people. In daily life, the rinse of the hands and mouth at the shrine entrance (temizuya) is a miniature harae that marks the transition from the profane to the sacred.',
        'Musubi is the creative, binding force that generates life and connects all things — the power by which the kami breathed the universe into existence and by which growth, fertility and relationship continue. It is most visible in the kami Takami-musubi and Kami-musubi, but it pervades the whole Shintō understanding of reality: the world is not a mechanism but a living web of sacred relatedness. Musubi also names the outcome of purification — the reconnection of the human heart to the generative vitality of the cosmos.',
      ],
      pt: [
        'Os kami são os poderes sagrados no coração do Xintoísmo — não deuses no sentido ocidental de seres onipotentes e transcendentes, mas antes a qualidade numinosa sentida na presença de qualquer coisa que evoca admiração, reverência ou maravilha: um cedro retorcido, uma cachoeira de montanha impetuosa, o espírito de um grande ancestral, a deusa do sol Amaterasu. Diz-se tradicionalmente que há oito milhões de kami, número que significa "incontavelmente muitos", habitando a natureza, as comunidades e a linhagem imperial. O Xintoísmo é assim menos uma teologia do que uma relação contínua de gratidão e reverência com essas presenças sagradas.',
        'Makoto no kokoro — a sinceridade do coração — é a virtude central do Xintoísmo, a disposição que permite a relação autêntica com os kami. Onde o confucionismo enfatiza a correção ritual e o budismo enfatiza o desapego, o Xintoísmo insiste num coração puro e indiviso que não calcula, não finge e não se retém. Os heróis do Kojiki são admirados menos pela perfeição moral do que por essa transparência de intenção; o sacerdote no santuário e o guerreiro no campo de batalha servem os kami com o mesmo coração sincero.',
        'O harae, a purificação ritual, é o coração prático do culto xintoísta — as cerimônias, gestos e orações pelos quais uma pessoa que se tornou kegare (ritualmente impura) pelo contato com a morte, o sangue, a doença ou o pecado retorna a um estado de harmonia com o sagrado. Os grandes ritos nacionais de purificação (oharae) eram realizados duas vezes por ano no Japão clássico para purificar todo o povo. Na vida cotidiana, o enxágue das mãos e da boca na entrada do santuário (temizuya) é um harae em miniatura que marca a transição do profano ao sagrado.',
        'Musubi é a força criadora e vinculante que gera vida e conecta todas as coisas — o poder pelo qual os kami insufliram o universo e pelo qual o crescimento, a fertilidade e o relacionamento continuam. É mais visível nos kami Takami-musubi e Kami-musubi, mas permeia toda a compreensão xintoísta da realidade: o mundo não é um mecanismo, mas uma teia viva de relacionamento sagrado. Musubi também nomeia o resultado da purificação — a reconexão do coração humano à vitalidade geradora do cosmos.',
      ],
    },
    contextLong: {
      en: [
        'Shintō has no single founder, no fixed canon of scripture and no precise moment of origin — it grew from the animistic and ancestral practices of prehistoric Japan, finding its first literary expression in the Kojiki (712) and Nihon Shoki (720), the chronicles compiled by the early imperial court. These texts arranged the stories of the kami into a mythology that placed the imperial family at the apex of the sacred genealogy, descending from the sun goddess Amaterasu, and the land of Japan as the most sacred place on earth.',
        'When Buddhism arrived from Korea and China in the 6th century AD, Shintō did not die but transformed. Over the following millennium, the two traditions merged in a syncretic practice called shinbutsu-shūgō: the same buildings housed both Buddhist statues and Shintō shrines; kami were reinterpreted as manifestations of Buddhist deities; Buddhist monks tended Shintō sites. This rich fusion shaped the entire visual, literary and ritual culture of classical and medieval Japan, including the arts of the samurai, the poetry of the imperial court, and the design of sacred landscape gardens.',
        'The Meiji Restoration of 1868 forcibly separated Shintō and Buddhism, elevating Shintō to a state ideology centred on imperial divinity. "State Shintō," as historians call it, was abolished after Japan\'s defeat in 1945. The tradition now exists in a more diverse form: thousands of shrines across Japan maintain local traditions, the great festivals (matsuri) mark the agricultural and seasonal year, and Shintō ethics of sincerity, gratitude and care for the natural world have found new audiences far beyond Japan.',
      ],
      pt: [
        'O Xintoísmo não tem um único fundador, nenhum cânone fixo de escrituras e nenhum momento preciso de origem — cresceu das práticas animistas e ancestrais do Japão pré-histórico, encontrando sua primeira expressão literária no Kojiki (712) e no Nihon Shoki (720), as crônicas compiladas pela corte imperial primitiva. Esses textos organizaram as histórias dos kami numa mitologia que situava a família imperial no ápice da genealogia sagrada, descendendo da deusa do sol Amaterasu, e a terra do Japão como o lugar mais sagrado da terra.',
        'Quando o budismo chegou da Coreia e da China no século VI d.C., o Xintoísmo não morreu, mas se transformou. Ao longo do milênio seguinte, as duas tradições se fundiram numa prática sincrética chamada shinbutsu-shūgō: os mesmos edifícios abrigavam estátuas budistas e santuários xintoístas; os kami foram reinterpretados como manifestações de divindades budistas; monges budistas cuidavam de locais xintoístas. Essa rica fusão moldou toda a cultura visual, literária e ritual do Japão clássico e medieval, incluindo as artes dos samurais, a poesia da corte imperial e o design de jardins de paisagem sagrada.',
        'A Restauração Meiji de 1868 separou forçosamente o Xintoísmo e o budismo, elevando o Xintoísmo a uma ideologia de Estado centrada na divindade imperial. O "Xintoísmo de Estado", como os historiadores o chamam, foi abolido após a derrota do Japão em 1945. A tradição hoje existe de forma mais diversa: milhares de santuários em todo o Japão mantêm tradições locais, os grandes festivais (matsuri) marcam o ano agrícola e sazonal, e a ética xintoísta de sinceridade, gratidão e cuidado com o mundo natural encontrou novos públicos muito além do Japão.',
      ],
    },
  },
  bushido: {
    contextLong: {
      en: [
        'Bushidō was not set down as a code until late in its history; it grew over centuries as the lived ethos of the samurai, the warrior class that ruled Japan from the Kamakura shogunate of 1185 until the nineteenth century. Loyalty to one\'s lord, fearlessness in battle and honor unto death were forged in an age of near-constant civil war.',
        'Into this warrior life flowed three great currents: Zen, which trained the mind to act without hesitation or fear of death; Confucianism, which supplied ideals of loyalty, duty and rectitude; and Shinto, with its reverence for ancestors and purity. The result was a demanding fusion of discipline, aesthetics and ethics that shaped swordsmanship, tea, poetry and calligraphy alike.',
        'Paradoxically, the code received its most famous expression — Musashi\'s Book of Five Rings and the Hagakure — during the long Tokugawa peace, when the samurai had few wars left to fight. After the Meiji Restoration of 1868 abolished the class, Bushidō was reimagined as the "soul of Japan", an idealized heritage whose meaning is still debated today.',
      ],
      pt: [
        'O Bushidō só foi posto por escrito como código tardiamente; cresceu ao longo de séculos como o ethos vivido dos samurais, a classe guerreira que governou o Japão do xogunato de Kamakura, em 1185, até o século XIX. A lealdade ao senhor, a destemidez em combate e a honra até a morte forjaram-se numa era de guerra civil quase contínua.',
        'A essa vida guerreira afluíram três grandes correntes: o Zen, que treinava a mente para agir sem hesitação nem medo da morte; o confucionismo, que fornecia ideais de lealdade, dever e retidão; e o xintoísmo, com sua reverência aos ancestrais e à pureza. O resultado foi uma fusão exigente de disciplina, estética e ética que moldou a esgrima, o chá, a poesia e a caligrafia.',
        'Paradoxalmente, o código recebeu sua expressão mais famosa — o Livro dos Cinco Anéis de Musashi e o Hagakure — durante a longa paz Tokugawa, quando aos samurais restavam poucas guerras a travar. Depois que a Restauração Meiji de 1868 aboliu a classe, o Bushidō foi reimaginado como a "alma do Japão", uma herança idealizada cujo sentido ainda hoje se debate.',
      ],
    },
  },
};
