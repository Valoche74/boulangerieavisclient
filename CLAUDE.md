# site client — consignes pour toute session Claude (locale ou cloud)

Les pages que **le client** d'un commerce ouvre dans son téléphone (Perify, carte de fidélité) :
- `card.html` — **la carte de fidélité** (tampons, progression, cadeaux, offres, réseaux, ajout à
  Apple / Google Wallet, paniers anti-gaspi). Ouverte au comptoir, souvent dehors, à bout de bras.
- `index.html` — **le parcours d'inscription** : avis Google → roue de la chance (une seule fois par
  carte) → ajout de la carte au Wallet → écran « Scannez le QR code pour débloquer votre compte ».
- `commerces.json` — **le registre des commerces**, servi en statique, lu par toutes les pages, le
  service Wallet et la nuit. Il est PRODUIT depuis la base du serveur : ne pas l'éditer à la main.
- `valider.html`, `showroom.html`, `card-pulse.html`, `card-v3-maquette.html` : anciens annexes et essais,
  gardés dans le dépôt mais **pas publiés** (`.vercelignore`, 30/10) — n'y faire aucun lien.

HTML / CSS / JS simple, **sans framework ni build**. Hébergé sur Vercel (déploiement à chaque push
sur `main`). Un seul commerce en production : Le Bap's. Le propriétaire, Valentin CARRILLO, n'est pas
développeur : écris-lui en français simple.

## Ce qui ne se discute pas
- **Tout passe par `?c=<cle>`** (le commerce) lu dans `commerces.json` ; `?type=<metier>` reste accepté
  (alias) parce que des cartes Wallet déjà dans les téléphones le portent. Jamais de valeur en dur
  par commerce dans le code : le thème vient des tables de thème et du registre.
- **Les badges « Ajouter à l'app Cartes Apple » / « Ajouter au Google Wallet »** sont les fichiers
  officiels (`assets/wallet/`) : jamais redessinés, jamais recolorés, jamais estompés, 48 px minimum ;
  badge Apple grand : 280 px de large sur l'inscription (240 sur la carte). Sous 340 px d'écran, le
  bouton long de Google passerait sous 48 px : un `<picture>` sert alors son badge compact officiel.
- **La roue se joue une fois par carte** ; les seuils des lots (`PRIZES`, `prob` cumulé) et
  « 1 tampon par passage et par jour » sont des règles du produit, pas du design. Le lot est tiré
  AVANT l'animation, la roue ne fait que le montrer : 6 secteurs, le lot le plus fréquent sur 3, le
  moyen sur 2, **le plus rare sur un seul** (`secteursDeLaRoue`, décision du 30/10 : « le tacos une
  fois »), jamais deux secteurs voisins identiques ; la pointe s'arrête toujours sur un secteur du lot
  tiré, et les libellés restent droits.
- **Direction visuelle D1 « app native épurée »** (choisie le 30/10/2026, remplace la direction nuit
  du 23/09) : fond clair `#F2F2F7`, surfaces blanches, Inter seule (servie par le site,
  `assets/polices/`) ; la couleur du commerce tient en 7 jetons (bloc `PERIFY_HABILLAGE`, le MÊME
  dans `card.html` et `index.html`, une entrée par métier ; Le Bap's en `#A04E27`, Falman en son
  vert `#3A7A1E`, sinon l'orange Perify) — le commerce désigné (`?c=`, préfixe de carte) passe avant
  le métier : jamais la couleur d'un commerce chez un autre. **« Vous » partout** (fin du mélange
  tu/vous). Contrastes mesurés ≥ 4,5:1 (`--marque-encre` pour la marque en texte, jamais `--marque`),
  texte ≥ 16 px, cibles ≥ 48 px, grilles en `minmax(0,1fr)` (jamais une colonne `auto` ou `1fr`
  seule) et `overflow-x:clip` sur html et body (Safari iPhone zoome toute la page sinon),
  `prefers-reduced-motion` respecté, aucun emoji en guise d'icône (pictogrammes SVG `PICTO`, les
  mêmes dans les deux pages).
- **Vitesse** : la carte doit s'ouvrir en moins de 2 s au comptoir. Pas de police lourde, pas d'image
  de fond énorme, rien de bloquant avant le premier rendu.
- **Aucun chiffre inventé**, aucun commerce nommé sans accord, aucune adresse e-mail en clair.
- Le serveur (`api.perify.app`) répond toujours du JSON en HTTP 200 ; les erreurs sont dans `status`.
  Apps Script (ancien serveur d'un commerce) peut répondre du HTML : on réessaie, on ne plante pas.
- Commentaires en **français**, datés quand on explique un choix ou un piège.

## Vérifier
- Il n'y a pas d'essai dans ce dépôt : la vérification se fait sur la machine de Valentin (suite
  `_outils/tests`, captures téléphone). Une PR doit donc **décrire comment vérifier** (quelle page,
  quels paramètres, quel geste) et rester petite.
- Les pages doivent rester valides sans réseau (elles sont ouvertes avec une doublure de serveur pour
  les captures) : pas d'appel réseau bloquant au chargement.

## Ce qu'une session cloud ne peut pas faire (le dire, ne pas contourner)
- Pousser sur `main` : **tout passe par une PR**. Voir un rendu, un téléphone, Apple Wallet, la base
  ou les autres dépôts (serveur, espace commerçant, service Wallet). Si un changement ici impose un
  changement ailleurs, l'écrire dans la PR.
