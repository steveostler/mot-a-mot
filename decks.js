// Mot à Mot – the built-in flashcard decks.
//
// Each card has:
//   en   – the English prompt the learner sees
//   fr   – a list of accepted French answers (the first one is shown as "the" answer)
//   note – optional extra info shown after answering (e.g. the gender of an l' noun)
//
// To add a card, copy a line and change the words. Keep each "en" unique
// within its deck, because it's used to save progress for that card.

const DECKS = [
  {
    id: 'travel',
    title: 'Travel & Transport',
    french: 'Voyages et transports',
    cards: [
      { en: 'the train station', fr: ['la gare'] },
      { en: 'the platform', fr: ['le quai'] },
      { en: 'the ticket office', fr: ['le guichet'] },
      { en: 'a return ticket', fr: ['un aller-retour', 'un billet aller-retour'] },
      { en: 'a one-way ticket', fr: ['un aller simple', 'un billet aller simple'] },
      { en: 'the delay', fr: ['le retard'] },
      { en: 'the luggage', fr: ['les bagages'] },
      { en: 'the suitcase', fr: ['la valise'] },
      { en: 'the flight', fr: ['le vol'] },
      { en: 'the boarding pass', fr: ["la carte d'embarquement"] },
      { en: 'customs (at the border)', fr: ['la douane'] },
      { en: 'the motorway', fr: ["l'autoroute"], note: 'feminine: une autoroute' },
      { en: 'the traffic jam', fr: ["l'embouteillage", 'le bouchon'], note: "l'embouteillage is masculine" },
      { en: 'the roundabout', fr: ['le rond-point'] },
      { en: 'the departure', fr: ['le départ'] },
      { en: 'the arrival', fr: ["l'arrivée"], note: 'feminine: une arrivée' },
      { en: 'the passport', fr: ['le passeport'] },
      { en: 'the connection (change of train)', fr: ['la correspondance'] },
      { en: 'to book', fr: ['réserver'] },
      { en: 'to miss (a train)', fr: ['rater', 'manquer'] }
    ]
  },
  {
    id: 'work',
    title: 'Work & Office',
    french: 'Le travail et le bureau',
    cards: [
      { en: 'the meeting', fr: ['la réunion'] },
      { en: 'the deadline', fr: ['la date limite', "l'échéance"] },
      { en: 'the salary', fr: ['le salaire'] },
      { en: 'the colleague (male)', fr: ['le collègue'] },
      { en: 'the boss', fr: ['le patron', 'le chef'] },
      { en: 'the job interview', fr: ["l'entretien d'embauche"], note: 'masculine: un entretien' },
      { en: 'the company', fr: ["l'entreprise", 'la société'], note: "l'entreprise is feminine" },
      { en: 'the desk', fr: ['le bureau'] },
      { en: 'the printer', fr: ["l'imprimante"], note: 'feminine: une imprimante' },
      { en: 'the email', fr: ['le mail', "l'e-mail", "l'email", 'le courriel'] },
      { en: 'the training course', fr: ['la formation'] },
      { en: 'the skills', fr: ['les compétences'] },
      { en: 'the contract', fr: ['le contrat'] },
      { en: 'the promotion (at work)', fr: ['la promotion'] },
      { en: 'the strike', fr: ['la grève'] },
      { en: 'unemployment', fr: ['le chômage'] },
      { en: 'the file (folder)', fr: ['le dossier'] },
      { en: 'the project', fr: ['le projet'] },
      { en: 'to hire', fr: ['embaucher', 'engager', 'recruter'] },
      { en: 'to resign', fr: ['démissionner'] }
    ]
  },
  {
    id: 'feelings',
    title: 'Feelings & Personality',
    french: 'Sentiments et personnalité',
    cards: [
      { en: 'proud', fr: ['fier', 'fière'] },
      { en: 'disappointed', fr: ['déçu', 'déçue'] },
      { en: 'worried', fr: ['inquiet', 'inquiète'] },
      { en: 'jealous', fr: ['jaloux', 'jalouse'] },
      { en: 'shy', fr: ['timide'] },
      { en: 'stubborn', fr: ['têtu', 'têtue'] },
      { en: 'lazy', fr: ['paresseux', 'paresseuse'] },
      { en: 'generous', fr: ['généreux', 'généreuse'] },
      { en: 'annoyed', fr: ['agacé', 'agacée', 'énervé', 'énervée'] },
      { en: 'relieved', fr: ['soulagé', 'soulagée'] },
      { en: 'ashamed', fr: ['honteux', 'honteuse'] },
      { en: 'grateful', fr: ['reconnaissant', 'reconnaissante'] },
      { en: 'the anger', fr: ['la colère'] },
      { en: 'the fear', fr: ['la peur'] },
      { en: 'the sadness', fr: ['la tristesse'] },
      { en: 'happiness', fr: ['le bonheur'] },
      { en: 'homesickness', fr: ['le mal du pays'] },
      { en: 'to get angry', fr: ['se fâcher', 'se mettre en colère'] },
      { en: 'to feel (an emotion)', fr: ['se sentir', 'ressentir'] },
      { en: 'to be bored', fr: ["s'ennuyer"] }
    ]
  },
  {
    id: 'home',
    title: 'Home & Daily Life',
    french: 'La maison et la vie quotidienne',
    cards: [
      { en: 'the kitchen', fr: ['la cuisine'] },
      { en: 'the bedroom', fr: ['la chambre'] },
      { en: 'the bathroom', fr: ['la salle de bains', 'la salle de bain'] },
      { en: 'the washing machine', fr: ['la machine à laver', 'le lave-linge'] },
      { en: 'the dishwasher', fr: ['le lave-vaisselle'] },
      { en: 'the fridge', fr: ['le frigo', 'le réfrigérateur'] },
      { en: 'the rent', fr: ['le loyer'] },
      { en: 'the landlord', fr: ['le propriétaire'] },
      { en: 'the neighbour (male)', fr: ['le voisin'] },
      { en: 'the stairs', fr: ["l'escalier", 'les escaliers'], note: 'masculine: un escalier' },
      { en: 'the shelf', fr: ["l'étagère"], note: 'feminine: une étagère' },
      { en: 'the drawer', fr: ['le tiroir'] },
      { en: 'the pillow', fr: ["l'oreiller"], note: 'masculine: un oreiller' },
      { en: 'the bin', fr: ['la poubelle'] },
      { en: 'the alarm clock', fr: ['le réveil'] },
      { en: 'to do the washing-up', fr: ['faire la vaisselle'] },
      { en: 'to do the laundry', fr: ['faire la lessive'] },
      { en: 'to tidy up', fr: ['ranger'] },
      { en: 'to wake up', fr: ['se réveiller'] },
      { en: 'to move house', fr: ['déménager'] }
    ]
  },
  {
    id: 'food',
    title: 'Food & Cooking',
    french: 'La cuisine et les repas',
    cards: [
      { en: 'the oven', fr: ['le four'] },
      { en: 'the saucepan', fr: ['la casserole'] },
      { en: 'the frying pan', fr: ['la poêle'] },
      { en: 'the chopping board', fr: ['la planche à découper'] },
      { en: 'the flour', fr: ['la farine'] },
      { en: 'the butter', fr: ['le beurre'] },
      { en: 'the garlic', fr: ["l'ail"], note: 'masculine noun' },
      { en: 'the mushroom', fr: ['le champignon'] },
      { en: 'the strawberry', fr: ['la fraise'] },
      { en: 'the egg', fr: ["l'œuf"], note: 'masculine: un œuf (you can type "oe" for œ)' },
      { en: 'the beef', fr: ['le bœuf'] },
      { en: 'the bill (in a restaurant)', fr: ["l'addition"], note: 'feminine: une addition' },
      { en: 'the starter', fr: ["l'entrée"], note: 'feminine: une entrée' },
      { en: 'the main course', fr: ['le plat principal'] },
      { en: 'the tip', fr: ['le pourboire'] },
      { en: 'the recipe', fr: ['la recette'] },
      { en: 'to boil', fr: ['bouillir', 'faire bouillir'] },
      { en: 'to peel', fr: ['éplucher', 'peler'] },
      { en: 'to slice', fr: ['trancher', 'couper en tranches'] },
      { en: 'to bake', fr: ['cuire au four', 'faire cuire au four'] }
    ]
  },
  {
    id: 'verbs',
    title: 'Useful Verbs',
    french: 'Verbes utiles',
    cards: [
      { en: 'to reach (a goal)', fr: ['atteindre'] },
      { en: 'to borrow', fr: ['emprunter'] },
      { en: 'to lend', fr: ['prêter'] },
      { en: 'to choose', fr: ['choisir'] },
      { en: 'to forget', fr: ['oublier'] },
      { en: 'to succeed', fr: ['réussir'] },
      { en: 'to improve', fr: ['améliorer', "s'améliorer"] },
      { en: 'to explain', fr: ['expliquer'] },
      { en: 'to share', fr: ['partager'] },
      { en: 'to complain', fr: ['se plaindre'] },
      { en: 'to remember', fr: ['se souvenir', 'se rappeler'] },
      { en: 'to look for', fr: ['chercher'] },
      { en: 'to try', fr: ['essayer'] },
      { en: 'to avoid', fr: ['éviter'] },
      { en: 'to wonder', fr: ['se demander'] },
      { en: 'to belong', fr: ['appartenir'] },
      { en: 'to get used to', fr: ["s'habituer"] },
      { en: 'to warn', fr: ['prévenir', 'avertir'] },
      { en: 'to manage (to cope)', fr: ['se débrouiller'] },
      { en: 'to deserve', fr: ['mériter'] }
    ]
  }
];
