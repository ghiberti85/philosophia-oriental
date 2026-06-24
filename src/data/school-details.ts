import type { Localized } from '@/lib/i18n';

/**
 * Deep-dive content for the dashboard popups: one expanded essay per core
 * idea (same index order as `school.coreIdeas`) and a longer historical
 * context (one paragraph per array entry) per school. Optional per school —
 * the UI falls back to the short description when a detail is absent.
 */
export interface SchoolDetail {
  /** ideaDetails[i] expands coreIdeas[i]. */
  ideaDetails: Localized<string[]>;
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
      ],
      pt: [
        'Confúcio viveu durante o período das Primaveras e Outonos, quando a autoridade da dinastia Zhou se esfacelava nas rivalidades que dariam nos Reinos Combatentes. A essa desordem ele ofereceu não novos deuses ou leis, mas uma visão de renovação moral enraizada nos rituais idealizados dos primeiros Zhou. Rejeitado pelos governantes de seu tempo, dedicou-se ao ensino, e foram seus discípulos, e os discípulos destes, que levaram seu nome adiante.',
        'Por séculos o confucionismo competiu com o taoísmo, o moísmo e o legalismo. Seu triunfo veio sob a dinastia Han, que o fez doutrina oficial do Estado e currículo dos exames que selecionavam os funcionários — papel que manteve, com interrupções e reinvenções, até o século XX. Nenhum corpo de pensamento moldou mais vidas humanas.',
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
      ],
      pt: [
        'O taoísmo surgiu na mesma era de tumulto que o confucionismo, mas apontava para a direção oposta. Onde Confúcio buscava reparar a sociedade pelo ritual e pelo dever, os textos taoístas aconselhavam recuar da ambição e afinar-se com os ritmos da natureza. Os dois tornaram-se os grandes polos complementares da mente chinesa — muitos eruditos foram confucianos no cargo e taoístas na reclusão.',
        'Para além da filosofia, o taoísmo deu origem a uma vasta tradição religiosa de alquimia, meditação e busca da longevidade, e moldou a poesia, a pintura e a medicina chinesas. Seu encontro com o budismo indiano ajudou a fazer nascer o Chan, que viajou ao Japão como Zen.',
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
      ],
      pt: [
        'O budismo começou na planície do Ganges por volta do século V a.C., em meio a um fervilhar de ascetas errantes que questionavam a autoridade dos Vedas. O ensino do Buda espalhou-se primeiro pela Índia sob o patrocínio do imperador Ashoka e depois pelas rotas comerciais até a Ásia Central, Oriental e do Sudeste, adaptando-se a cada cultura que encontrava.',
        'Com o tempo, ramificou-se no Theravada do Sri Lanka e do Sudeste Asiático, no Mahayana da China, Coreia e Japão, e no Vajrayana do Tibete. Apesar das diferenças, todos carregam a intuição central do Buda sobre o sofrimento e seu fim — e uma sofisticada filosofia da mente que segue atraindo o interesse da psicologia e do pensamento ocidental.',
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
      ],
      pt: [
        'O Zen começou como Chan na China, quando a corrente meditativa do budismo indiano encontrou o naturalismo do taoísmo. A tradição o faz remontar ao monge indiano Bodhidharma e a uma linhagem de patriarcas, florescendo nas dinastias Tang e Song no estilo iconoclasta de mestres que gritavam, golpeavam e propunham enigmas para sacudir os discípulos rumo ao despertar.',
        'Levado ao Japão nos séculos XII e XIII, o Chan tornou-se Zen, cindindo-se na escola Rinzai do koan e na escola Sōtō de Dōgen, do sentar silencioso. Ali moldou a classe guerreira, a cerimônia do chá e toda uma estética de contenção e vazio que ainda define a arte japonesa.',
      ],
    },
  },
};
