import type { Localized } from '@/lib/i18n';

/** A dated historical fact that situates a school within its era. */
export interface HistoricalFact {
  /** Formatted year(s), e.g. "221 BC" / "221 a.C." kept locale-neutral here. */
  year: string;
  fact: Localized;
}

/**
 * Parallel history per school — wars, dynasties, inventions and milestones
 * that help the reader picture what was happening while these ideas took
 * shape. Shown inside the historical-context modal.
 */
export const historicalFacts: Record<string, HistoricalFact[]> = {
  confucianism: [
    { year: '770 BC', fact: { en: 'The Eastern Zhou begins; royal authority wanes and rival states multiply.', pt: 'Começa o Zhou Oriental; a autoridade real declina e os Estados rivais se multiplicam.' } },
    { year: '551 BC', fact: { en: 'Confucius is born in the small state of Lu.', pt: 'Confúcio nasce no pequeno Estado de Lu.' } },
    { year: '481–221 BC', fact: { en: 'The Warring States period: relentless warfare drives the search for social order.', pt: 'O período dos Reinos Combatentes: a guerra incessante impulsiona a busca por ordem social.' } },
    { year: '213 BC', fact: { en: 'The Qin "burning of the books" targets Confucian classics.', pt: 'A "queima dos livros" de Qin tem como alvo os clássicos confucianos.' } },
    { year: '136 BC', fact: { en: 'Emperor Wu of Han makes Confucianism the state orthodoxy and founds the imperial academy.', pt: 'O imperador Wu de Han faz do confucionismo a ortodoxia do Estado e funda a academia imperial.' } },
  ],
  taoism: [
    { year: '6th c. BC', fact: { en: 'Laozi, by tradition a keeper of the Zhou royal archives, lives in this age.', pt: 'Laozi, segundo a tradição guardião dos arquivos reais Zhou, vive nesta época.' } },
    { year: '4th c. BC', fact: { en: 'Zhuangzi writes amid the "Hundred Schools of Thought".', pt: 'Zhuangzi escreve em meio às "Cem Escolas de Pensamento".' } },
    { year: '142 AD', fact: { en: 'Zhang Daoling founds the Way of the Celestial Masters — religious Taoism.', pt: 'Zhang Daoling funda o Caminho dos Mestres Celestiais — o taoísmo religioso.' } },
    { year: '3rd c. AD', fact: { en: 'Wang Bi revives philosophical Taoism in the "Mysterious Learning" (Xuanxue).', pt: 'Wang Bi revive o taoísmo filosófico no "Aprendizado Misterioso" (Xuanxue).' } },
    { year: '618–907', fact: { en: 'Tang emperors claim descent from Laozi and Taoism flourishes at court.', pt: 'Os imperadores Tang reivindicam descendência de Laozi e o taoísmo floresce na corte.' } },
  ],
  legalism: [
    { year: '356 BC', fact: { en: 'Shang Yang launches his reforms, forging Qin into a disciplined war-state.', pt: 'Shang Yang lança suas reformas, forjando Qin como um Estado de guerra disciplinado.' } },
    { year: '247 BC', fact: { en: 'The future First Emperor ascends the throne of Qin as a boy-king.', pt: 'O futuro Primeiro Imperador sobe ao trono de Qin ainda menino.' } },
    { year: '233 BC', fact: { en: 'Han Feizi, the great Legalist theorist, dies in a Qin prison.', pt: 'Han Feizi, o grande teórico legalista, morre numa prisão de Qin.' } },
    { year: '221 BC', fact: { en: 'Qin unifies China; writing, weights, axle-widths and law are standardized.', pt: 'Qin unifica a China; escrita, pesos, eixos e leis são padronizados.' } },
    { year: '206 BC', fact: { en: 'The Qin collapses after a single generation; its harshness becomes a byword.', pt: 'O Qin desmorona após uma só geração; sua dureza torna-se proverbial.' } },
  ],
  mohism: [
    { year: 'c. 470 BC', fact: { en: 'Mozi is born, rising from the artisan class rather than the aristocracy.', pt: 'Mozi nasce, vindo da classe artesã e não da aristocracia.' } },
    { year: '5th–4th c. BC', fact: { en: 'Disciplined Mohist bands travel to defend cities against aggressive war.', pt: 'Bandos moístas disciplinados viajam para defender cidades da guerra agressiva.' } },
    { year: '4th c. BC', fact: { en: 'The later Mohists pioneer logic, optics and geometry — China\'s first science.', pt: 'Os moístas tardios são pioneiros da lógica, óptica e geometria — a primeira ciência da China.' } },
    { year: '221 BC', fact: { en: 'Under the unified empire, organized Mohism rapidly fades.', pt: 'Sob o império unificado, o moísmo organizado desaparece rapidamente.' } },
    { year: '1st c. AD →', fact: { en: 'The Mohist texts are nearly lost, to be rediscovered only centuries later.', pt: 'Os textos moístas quase se perdem, sendo redescobertos só séculos depois.' } },
  ],
  buddhism: [
    { year: 'c. 563 BC', fact: { en: 'Siddhartha Gautama is born in Lumbini, in the foothills of the Himalayas.', pt: 'Sidarta Gautama nasce em Lumbini, no sopé do Himalaia.' } },
    { year: 'c. 528 BC', fact: { en: 'His awakening under the Bodhi tree at Bodh Gaya (traditional date).', pt: 'Seu despertar sob a árvore Bodhi em Bodh Gaya (data tradicional).' } },
    { year: '268–232 BC', fact: { en: 'Emperor Ashoka embraces Buddhism and sends missions across and beyond India.', pt: 'O imperador Ashoka adota o budismo e envia missões por toda a Índia e além.' } },
    { year: '1st c. BC', fact: { en: 'The Pali Canon is committed to writing in Sri Lanka.', pt: 'O Cânone Páli é posto por escrito no Sri Lanka.' } },
    { year: '1st c. AD', fact: { en: 'Buddhism reaches China along the Silk Road.', pt: 'O budismo chega à China pela Rota da Seda.' } },
  ],
  zen: [
    { year: 'c. 520 AD', fact: { en: 'Bodhidharma is said to arrive in China, seeding the Chan lineage.', pt: 'Diz-se que Bodhidharma chega à China, semeando a linhagem Chan.' } },
    { year: '7th–9th c.', fact: { en: 'Chan flourishes in Tang China in the era of its iconoclastic masters.', pt: 'O Chan floresce na China Tang, na era de seus mestres iconoclastas.' } },
    { year: '1191', fact: { en: 'Eisai brings Rinzai Zen from China to Japan.', pt: 'Eisai traz o Zen Rinzai da China para o Japão.' } },
    { year: '1227', fact: { en: 'Dōgen returns from China and founds the Sōtō school.', pt: 'Dōgen retorna da China e funda a escola Sōtō.' } },
    { year: '14th–16th c.', fact: { en: 'Zen shapes the tea ceremony, gardens and ink painting under the Ashikaga.', pt: 'O Zen molda a cerimônia do chá, os jardins e a pintura a nanquim sob os Ashikaga.' } },
  ],
  vedanta: [
    { year: '8th–5th c. BC', fact: { en: 'The principal Upanishads, the visionary source of Vedanta, are composed.', pt: 'Compõem-se os Upanixades principais, a fonte visionária do Vedanta.' } },
    { year: 'c. 2nd c. BC', fact: { en: 'The Bhagavad Gita and Patanjali\'s Yoga Sutras take their classical form.', pt: 'A Bhagavad Gita e os Yoga Sutras de Patañjali tomam sua forma clássica.' } },
    { year: 'c. 8th c. AD', fact: { en: 'Shankara systematizes Advaita and founds four monastic seats across India.', pt: 'Shankara sistematiza o Advaita e funda quatro sés monásticas pela Índia.' } },
    { year: '11th–12th c.', fact: { en: 'Ramanuja articulates Vishishtadvaita, a qualified non-dualism of devotion.', pt: 'Ramanuja articula o Vishishtadvaita, um não-dualismo qualificado da devoção.' } },
    { year: '13th c.', fact: { en: 'Madhva founds Dvaita, the dualist school of Vedanta.', pt: 'Madhva funda o Dvaita, a escola dualista do Vedanta.' } },
  ],
  bushido: [
    { year: '1185', fact: { en: 'The Kamakura shogunate begins; the samurai become Japan\'s ruling class.', pt: 'Começa o xogunato de Kamakura; os samurais tornam-se a classe dirigente do Japão.' } },
    { year: '1274 & 1281', fact: { en: 'Mongol invasions are repelled, aided by the "kamikaze" (divine wind) typhoons.', pt: 'As invasões mongóis são repelidas, com ajuda dos tufões "kamikaze" (vento divino).' } },
    { year: '1336–1573', fact: { en: 'In the Ashikaga era, Zen deeply colors warrior culture and the arts.', pt: 'Na era Ashikaga, o Zen tinge profundamente a cultura guerreira e as artes.' } },
    { year: '1600', fact: { en: 'The Battle of Sekigahara opens two centuries of Tokugawa peace.', pt: 'A Batalha de Sekigahara abre dois séculos de paz Tokugawa.' } },
    { year: '1868', fact: { en: 'The Meiji Restoration abolishes the samurai class — and idealizes its code.', pt: 'A Restauração Meiji abole a classe samurai — e idealiza o seu código.' } },
  ],
};

/** Historical facts for a school, or an empty list when none are defined. */
export function getHistoricalFacts(slug: string): HistoricalFact[] {
  return historicalFacts[slug] ?? [];
}
