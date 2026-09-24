# Audit accessibilité et vitesse — `card.html` et `index.html`

> Fait le 24/09/2026, en session cloud, sur la révision `9ac6489` (« CLAUDE.md : les consignes du
> dépôt »). **Les numéros de ligne cités sont ceux de cette révision, avant les corrections de la PR
> qui accompagne ce document.** Ni le design, ni les textes, ni les couleurs, ni les appels serveur,
> ni les règles du programme, ni les badges Apple/Google n'ont été touchés. La PR a ensuite été
> rebasée sur `1196c89` (« Google Wallet ouvert à tous ») : ce commit ne change que la logique
> d'affichage du bouton Google et les commentaires autour ; les numéros de ligne au-dessus de 1580
> dans `card.html` y sont décalés de 2 (aucun n'est cité ici).

## Comment ces chiffres ont été obtenus

Il n'y a pas d'essai dans ce dépôt et pas de téléphone en session cloud. Les deux pages ont donc été
ouvertes dans un **vrai Chromium (141, sans écran) en iPhone émulé** (390 × 844, densité 2, tactile,
navigateur annoncé comme Safari iOS), avec un **serveur doublé** (réponses figées pour `fid_open`,
`fid_rewards`, `evenement`…, registre `commerces.json` du dépôt), sans aucun appel réel. **24 vues**
ont été photographiées et mesurées : la carte (chargement, active, quatre fenêtres modales, nouvelle,
inconnue, erreur, programme arrêté, démo boulangerie) et l'inscription (accueil, accueil après 15 s,
avis cliqué, roue, roue arrêtée, Wallet, formulaire, e-mail envoyé, fin, carte déjà jouée, programme
arrêté, accueil sans `?type`).

Sur chaque vue :
- **axe-core** (règles WCAG 2.0, 2.1, 2.2 niveaux A et AA, plus les bonnes pratiques) ;
- **contrastes** : calcul WCAG sur le fond *effectif* (couches semi-transparentes composées ; sous un
  dégradé, le pire arrêt de couleur) — les valeurs coïncident avec celles d'axe là où axe sait
  conclure ;
- **cibles tactiles** : boîte de chaque contrôle, puis zone réellement touchable mesurée avec
  `elementFromPoint` (ce que le doigt atteint, pseudo-éléments compris) ;
- **focus** : touche Tab jusqu'au retour au début, avec la visibilité du contour à chaque arrêt ;
- **mouvement réduit** : la même vue avec `prefers-reduced-motion: reduce`, inventaire des animations
  encore en cours ;
- **vitesse** : réseau « 4G lent » (1,6 Mbit/s, 150 ms d'aller-retour), processeur ralenti ×4, feuille
  de polices Google servie avec 300 ms de latence, médiane de trois chargements.

**Preuve « zéro changement visuel »** : les captures avant / après (mêmes polices servies localement,
même heure figée, même suite « aléatoire ») sont comparées **pixel à pixel**. Résultat : 18 vues sur 24
identiques au pixel près ; les 6 autres (la carte active et ses modales) diffèrent de moins de 0,02 %
des pixels, tous dans les **étincelles du tampon gagné** (l'effet dopamine, dont le déclenchement se
joue à la milliseconde) — voir § 12.

Statuts utilisés : ✅ corrigé dans cette PR · 🔜 à décider (change une couleur, une taille ou un
comportement : hors périmètre demandé) · 📝 constat, laissé tel quel et expliqué.

## Résumé

| Sujet | Avant | Après | Statut |
|---|---|---|---|
| Défauts axe, 24 vues cumulées | 462 | 45 | ✅ (reste : zoom bloqué et contrastes, § 1 et § 8) |
| Textes sous le seuil de contraste (uniques) | 24 | 24 | 🔜 ce sont des couleurs |
| Contrôles dont la zone touchable < 44 px | 9 | 0 | ✅ |
| Champs sans nom accessible | 5 | 0 | ✅ |
| Fenêtres modales sans rôle ni gestion du focus | 4 | 0 | ✅ |
| Titres / repère principal sur les écrans | aucun / aucun | oui / oui | ✅ |
| Animations encore actives en mouvement réduit | 0 | 0 | 📝 déjà bon |
| Feuille de polices bloquant le premier rendu | oui (« blocking ») | non | ✅ |
| Premier rendu (FCP), carte / inscription | 616 ms / 684 ms | 460 ms / 348 ms | ✅ |
| Zoom bloqué (`user-scalable=no`) | oui | oui | 🔜 § 8 |
| Code mort (CSS, JS, HTML) | ≈ 60 lignes | 0 | ✅ |

---

## 1. Contrastes mesurés

Seuils WCAG AA : **4,5:1** pour le texte courant, **3:1** pour le texte large (≥ 24 px, ou ≥ 18,66 px en
gras) et pour les icônes. Aucune couleur n'a été changée dans cette PR : tout ce qui suit est 🔜 ou 📝,
avec la correction proposée (à décider avec le design).

### 1.1 Blanc sur orange : tous les boutons d'action 🔜

Le texte blanc en 700 sur le dégradé `--gold` → `--gold2` (#FF6B2C → #E85A1B) donne **2,84:1** au bord
clair et **3,55:1** au bord foncé (mesuré, confirmé par axe sur `#omBtn`). Le seuil est 4,5:1.

| Élément | Taille | Ratio | Fichier : ligne |
|---|---|---|---|
| `.msg .cta` (« Commencer → », « Réessayer ») | 15 px / 700 | 2,84 | card.html : 95 |
| `.st.use` (« Utiliser ») | 12 px / 700 | 2,84 | card.html : 212 |
| `.use-go` (« Oui, je suis en caisse ») | 15 px / 700 | 2,84 | card.html : 235 |
| `.rw .btn.go` (« Échanger ») | 13 px / 700 | 2,84 | card.html : 314 |
| `.offre-go` (« Activer mon offre ») | 13 px / 700 | 2,84 | card.html : 347 |
| `.cm-btn` (« Super, merci ! ») | 15 px / 700 | 2,84 | card.html : 402 |
| `.om-btn` (« Valider »), aplat `--gold` | 14 px / 700 | 2,84 | card.html : 484 |
| `.use-ok` (coche ✓, icône) | 38 px | 2,84 (seuil 3) | card.html : 239 |
| `.btn-google` (« Laisser votre avis Google ») | 15 px / 700 | 2,84 | index.html : 90 |
| `.wheel-hub` (« Lancer »), aplat `--gold2` | 14 px / 800 | 3,55 | index.html : 151 |
| `.wheel-hint .etape b` (1, 2, 3) | 13 px / 800 | 3,55 | index.html : 180 |
| `.btn-claim` (« Récupérer mon cadeau 🎁 ») | 15 px / 700 | 2,84 | index.html : 222 |
| `.s3-submit` (« Recevoir mon coupon 🎁 ») | 15 px / 700 | 2,84 | index.html : 305 |
| `.s4-etapes b` (1, 2, 3) | 12 px / 800 | 3,55 | index.html : 321 |

**Proposition.** Garder l'orange (c'est la marque) et mettre le texte en **encre** `--ink` (#1B1F3B),
comme le fait déjà `.already-cta` (index.html : 329, encre sur `--gold`) : 5,7:1 sur #FF6B2C et
4,6:1 sur #E85A1B, donc au-dessus du seuil sur toute la longueur du dégradé. L'autre voie, un dégradé
qui finit plus foncé, touche à la charte du 23/09 : c'est un choix de design.

### 1.2 Les autres échecs

| Élément | Couleurs mesurées | Ratio | Seuil | Fichier : ligne | Proposition |
|---|---|---|---|---|---|
| `#unlockMsg` « Parfait — la roue est débloquée ! » | #7ECB40 sur #DEE7DA, 13 px | **1,57** | 4,5 | index.html : 98 | `--green-dk` (#15803D, déjà dans `:root` ligne 19) pour le texte et le point : 4,7:1 |
| `#arrDepuis` « Depuis le 20/09/2026 » (programme arrêté) | #6B7086 sur le fond nuit, 12 px | **1,92** | 4,5 | card.html : 562 (`style="color:var(--muted2)"`) | `--surbg-doux` comme les autres textes du fond nuit (5,5:1) |
| `#s3PrizeLabel` « Vous avez gagné : … » | `--gold` sur crème, 12 px / 700 | **2,44** | 4,5 | index.html : 293 | `--gold-ink`, la règle du CLAUDE.md pour l'orange en texte (4,6:1) |
| `#googleBtn` après le clic (« ✓ Merci ») | blanc à 60 % d'opacité sur orange | 2,78 | 4,5 | index.html : 962 (`opacity:.6`) | suit 1.1 |
| `.s4-code-label` « Votre code unique » | crème à 38 %, 10 px / 700 | **2,92** | 4,5 | index.html : 315 | opacité ≥ .7 |
| `.s4-code-sub` « Valable 30 jours · Usage unique » | crème à 40 %, 11 px | **3,08** | 4,5 | index.html : 317 | opacité ≥ .7 |
| `.s1-skip` « Continuer sans laisser d'avis » | crème à 45 %, 12 px | **3,88** | 4,5 | index.html : 95 | .78, comme `.already-desc` l'a déjà fait pour la même raison (index.html : 327) |
| `.st.done.live .ok` « ✓ Validé » | #15803D sur vert doux #E3F4E9, 12 px / 700 | **4,39** | 4,5 | card.html : 219 | un vert d'encre un peu plus foncé (#166534 : 6,2:1) — le commentaire de `--green-ink` (« 5,1:1 sur blanc ») ne vaut pas sur le fond vert doux |
| `.cm-badge` « ✓ Cadeau confirmé » | idem, 11 px / 700 | **4,39** | 4,5 | card.html : 394 | idem |
| `.sw-alt` « Recevoir par email » | crème à 50 %, 13 px | **4,46** | 4,5 | index.html : 280 | .78 |

### 1.3 À la limite, mais qui passent 📝

`.s1-heading .accent` (4,62), la mention du consentement (4,61), `.cm-codelbl` (4,65 — en **10 px**),
`--muted2` sur blanc partout (4,90), `--gold-ink` sur blanc (5,18), `--surbg-doux` sur le fond nuit
(5,46). Rien à faire, mais aucune marge : une teinte plus pâle « pour faire léger » ferait basculer
tout ce lot.

Le gros chiffre des tampons (`#cSolde`, card.html : 186) est **rempli par le dégradé orange** sur
blanc : 62 px gras, donc texte large et seuil 3:1 — 2,84 au bord clair, 3,55 au bord foncé. Décision
de design du 23/09, notée.

### 1.4 Hors texte 🔜

- L'étoile blanche de Trustpilot sur son vert #00B67A (`.slink.tp`, card.html : 423) : **2,6:1**, seuil
  3:1 pour une icône. Le vert est celui de la marque ; une étoile en encre, ou un liseré, réglerait le
  point.
- L'indicateur de focus des champs de saisie est un bord orange 1,5 px sur crème (`.om-input:focus`,
  card.html : 481 ; `.field-input:focus`, index.html : 300) : **2,7:1**. Il existe, donc le critère AA
  « focus visible » est tenu ; la recommandation 3:1 pour l'indicateur ne l'est pas. `--gold-ink` en
  bord de focus donnerait 4,6:1.

---

## 2. Cibles tactiles (44 × 44 px minimum : Apple, WCAG 2.5.5 ; 24 px : WCAG 2.5.8 AA)

Hauteur **réellement touchable** (mesure `elementFromPoint`, ce qui compte sous le doigt) :

| Contrôle | Avant | Après | Fichier : ligne | Comment |
|---|---|---|---|---|
| `#skipReviewBtn` « Continuer sans laisser d'avis » — c'était un `<div>` | **15 px** | 45 px | index.html : 95 et 383 | devenu un vrai `<button>` (mêmes lettres, même place : capture identique), zone étendue de 15 px au-dessus et au-dessous |
| `.st.use` « Utiliser » (récupérer un cadeau) | **24 px** | 45 px | card.html : 212 | pseudo-élément invisible `::before` qui déborde |
| `#omDesinscrire` « Ne plus recevoir nos offres » | 27 px | 44 px | card.html : 492 | idem |
| `.plink` « Mes données personnelles » | 28 px | 45 px | card.html : 371 | idem |
| `.sw-alt` « Recevoir par email » | 32 px | 45 px | index.html : 280 | idem |
| `.offre-go` « Activer mon offre » | 36 px | 45 px | card.html : 347 | idem |
| `.rw .btn` « Échanger » / « Plus que N tampons » | 38 px | 45 px | card.html : 313 | idem |
| `.btn-fallback` « Lancer la roue → » | 38 px | 45 px | index.html : 215 | idem |
| `.pv-close` « Fermer » / « Annuler » | 42 px | 47 px | card.html : 383 | idem |
| `.st.done.live` « ✓ Validé » | 44 px | 47 px | card.html : 216 | idem |

Le principe : le bouton ne change pas de taille ni de place ; un `::before` positionné en absolu
déborde verticalement de quelques pixels, et comme il fait partie du bouton, le doigt qui le touche
déclenche le bouton. Les débordements sont choisis pour ne pas empiéter sur un autre contrôle (le seul
voisinage serré, « Ne plus recevoir nos offres » sous sa note, ouvre une fenêtre de confirmation).
La case à cocher du consentement (`#fieldOptin`, 20 × 20 px, index.html : 303) est dans un `<label>`
de 70 px de haut : c'est le libellé entier qui est la cible, rien à faire.

---

## 3. Images et alternatives

Toutes les images ont un attribut `alt`, et il est juste :

| Image | `alt` | Verdict |
|---|---|---|
| Logo Perify en pied et en tête (`.marque`) | « Perify » | ✅ avec `width`/`height` (pas de saut de mise en page) |
| Badges Apple / Google | « Ajouter à l'app Cartes Apple » / « Ajouter au Google Wallet » | ✅ le bouton porte le même `aria-label` |
| Photos des récompenses (`.ph-img`), visuel du lot, image d'offre | `""` (décoratives : le nom est écrit à côté) | ✅ le conteneur est maintenant `aria-hidden` pour que l'emoji de repli ne soit pas lu non plus |
| Logo TripAdvisor dans son lien | `""`, le lien porte `aria-label="TripAdvisor"` | ✅ |
| Logo du commerce en tête de carte (injecté, card.html : 1235) | le nom du commerce | ✅ (sans `width`/`height` : léger saut possible à l'arrivée du fichier, 📝) |

Les emojis qui ne sont **que** décoratifs étaient lus par VoiceOver (« croissant », « étoile étoile
étoile étoile étoile », sept fois « hamburger » pour la grille de tampons…). Passés en `aria-hidden` ✅ :
`.mic` (card.html : 539-560), l'avatar `#cAv` (593), la grille `#stampGrid` (608), `.gift .ic` (2046),
`.offre-img` (2174), `.agb-emoji` (2233), `.rw .ph` (1456), `.use-ok` (582), `.cm-ph` (768), `.oi`
(719) ; index.html : `.s1-stars` (357), `.s1-optional-icon` (377), `.croissant-fallback` (353),
`.wr-emoji` (416), `.sw-prize-emoji` (436), `.s3-emoji-big` (473), `.s4-check` (507, 523),
`.already-emoji` (534, 547).

---

## 4. Noms accessibles, rôles, titres, repères

| Constat | Fichier : ligne | Correction ✅ |
|---|---|---|
| Les quatre champs du formulaire n'avaient pas de libellé associé (`<label>` sans `for`) : VoiceOver annonçait « champ de texte » sans dire lequel ; axe : `label` critique sur la date | index.html : 482-485 | `for="fieldPrenom"`, `fieldNom`, `fieldEmail`, `fieldNaissance` — toucher le libellé met le focus dans le champ |
| Le champ e-mail de la carte n'avait que son `placeholder` pour nom | card.html : 742 | `aria-labelledby="omTitre" aria-describedby="omNote"` : le titre du bloc (qui change selon l'état) nomme le champ, la mention légale le décrit |
| Six boutons « Échanger » identiques à l'oreille | card.html : 1459 | `aria-label="Échanger 6 tampons contre Boisson"` (le texte visible reste « Échanger ») |
| Les tuiles verrouillées sont des `<button>` qui ne font rien : quatre arrêts Tab inutiles | card.html : 1460 | `aria-disabled="true" tabindex="-1"` (pas `disabled`, qui les grisait à 50 %) |
| Aucun titre (`h1`…) sur l'écran principal de la carte ni sur aucun écran de l'inscription : le rotor « Titres » de VoiceOver était vide | card.html : 592, 613, 620, 626, 641, 678, 691, 719 ; index.html : 355, 363, 393, 417, 438, 474, 478, 505, 521, 535, 548 | `role="heading"` avec `aria-level` (1 pour l'enseigne / le titre d'écran, 2 pour les sections) — aucune balise changée, donc aucun style changé ; les `h2` des écrans plein page reçoivent `aria-level="1"` |
| Aucun repère principal (`main`) : « aller au contenu » impossible | card.html : 527-559, 591 ; index.html : chaque `.screen-inner` | `role="main"` sur chaque écran (un seul est affiché à la fois) |
| Les fenêtres modales (cadeau confirmé, mes données, désinscription, utiliser un cadeau) n'étaient pas des dialogues | card.html : 567, 766, 780, 801 | `role="dialog" aria-modal="true" aria-labelledby=<titre>` ; pour « utiliser », le titre suit l'étape (« Tu es en caisse ? » puis « Validé ») |
| Les messages qui apparaissent (« +1 tampon », « Préparation… », « Parfait — la roue est débloquée ! », le résultat de la roue, l'avertissement avant effacement) n'étaient pas annoncés | card.html : 763 (`#toast`), 698 (`#walHint`), 747 (`#omNote`), 782 (`#pvWarn`), 530 (« Chargement… ») ; index.html : 373 (`#unlockMsg`), 414 (`#wheelResult`) | `role="status"` / `aria-live="polite"` / `role="alert"` |
| La barre de progression n'était qu'un dessin | card.html : 607 | `role="progressbar"` + `aria-valuenow` / `aria-valuemax` tenus à jour par les deux dessinateurs (`render`, `applySolde`) |
| Le carrousel des récompenses est une zone qui défile ; quand aucune tuile n'est déblocable, plus rien à l'intérieur n'est atteignable au clavier | card.html : 623 | `role="list"` (+ `listitem` sur chaque tuile) et `tabindex="0"` : les flèches le font défiler |
| Le lien Google après le clic (« ✓ Merci ») reste un lien actif pour un lecteur d'écran | index.html : 962 | `aria-disabled="true"` |

Seule la vue « Chargement… » de la carte (card.html : 530) reste sans titre de niveau 1 : elle ne dure qu'un
instant et son texte est déjà annoncé comme statut ; y ajouter un titre ferait lire deux fois la même chose.

---

## 5. Focus : visible, ordonné, gardé dans les fenêtres

**Visibilité.** Chromium affichait déjà son contour par défaut sur les boutons et les liens ; il
était **supprimé** sur les champs (`outline:none`, card.html : 480 ; index.html : 299) et remplacé par
un bord orange pâle (cf. § 1.4). Ajouté ✅ : une règle `:focus-visible` explicite, 3 px, sur tous les
liens et boutons — encre orange (`--gold-ink`) sur les cartes claires, jaune (`--gold3`) sur le fond
nuit — deux couleurs de la charte, contrastées ≥ 4,6:1 sur leur fond. `:focus-visible` ne s'allume
**jamais** au doigt, seulement au clavier ou au lecteur d'écran : l'écran tactile ne change pas.

**Ordre de tabulation.** Il suit l'ordre visuel sur les deux pages (vérifié : la position verticale de
chaque arrêt est croissante ; aucun `tabindex` positif). Avant la PR, sur la carte, Tab traversait
17 arrêts dont 4 tuiles verrouillées inertes ; après, 13.

**Fenêtres modales** (le point le plus grave pour un utilisateur clavier ou VoiceOver) : avant, Tab
sortait de la fenêtre et parcourait toute la page derrière elle ; « Mes données » venait en 18e
position, après tout le reste ; Échap ne faisait rien ; à la fermeture, le focus était perdu. Après ✅ :
- à l'ouverture, le focus entre dans la fenêtre (sur la boîte, `tabindex="-1"`, sans contour) ;
- Tab et Maj+Tab **bouclent** à l'intérieur (mesuré : 2 arrêts puis retour au début) ;
- **Échap** ferme ;
- à la fermeture, le focus **revient** sur le bouton d'origine — jamais sur un champ de saisie, ce
  qui rouvrirait le clavier du téléphone.

**Changement d'écran.** `show()` (card.html : 1308) et `showScreen()` (index.html : 837) passaient
d'un écran à l'autre sans déplacer le focus : un lecteur d'écran restait « sur » un bouton disparu.
Après ✅ : l'écran qui apparaît reçoit le focus (sans contour), **sauf s'il était déjà affiché** —
la carte se redessine quand le serveur répond, et cela ne doit pas fermer le clavier d'un client en
train de taper son adresse (course déjà documentée le 12/09 et le 13/09 dans le code).

---

## 6. Ordre de lecture 📝

L'ordre du DOM est l'ordre visuel sur les deux pages : aucun repositionnement CSS (`order`,
`position:absolute` sur du contenu lu), aucun `tabindex` positif, aucun identifiant en double (vérifié
sur les 24 vues). Les fenêtres modales de la carte sont dans le DOM avant ou après le contenu, mais
elles sont `display:none` tant qu'elles sont fermées, donc invisibles aux lecteurs d'écran ; ouvertes,
`aria-modal` les isole.

Deux points de lecture, laissés tels quels : « glisse → » (card.html : 620) est lu comme un mot par un
lecteur d'écran (harmless) ; sur la roue, « × × × » et l'ellipse dessinée étaient déjà `aria-hidden`
(index.html : 397-398, bien fait).

---

## 7. Animations et `prefers-reduced-motion` 📝 (déjà bon, complété)

Inventaire sous « réduire les animations » : **0 animation encore active** sur les quatre vues
testées (chargement, carte active, accueil, roue), avant comme après.

- `card.html` : chaque animation a sa règle `@media (prefers-reduced-motion: reduce)` (lignes 154, 198,
  246, 257, 274, 516) ; les confettis et les étincelles sont coupés en JavaScript (1324, 1347). Choix
  documenté et gardé : l'indicateur de chargement est **ralenti** (6 s) et non figé (ligne 154 : un
  chargeur immobile fait croire à une panne).
- `index.html` : une règle globale (ligne 337-340) ramène toute animation et toute transition à
  0,01 ms, la rotation de la roue comprise (le résultat apparaît alors sans tourner, après le même
  délai de 5,2 s). Complété ✅ : les particules et les confettis (`spawnParticles`, `spawnConfetti`,
  1540 et 1549) ne créent plus 55 éléments pour une animation de 0,01 ms.

Rien ne clignote plus de trois fois par seconde ; aucune animation n'est déclenchée sans geste, hormis
les six emojis flottants de la carte (`.fl`, coupés en mouvement réduit) et l'ampoule du bouton
« Lancer » (idem).

---

## 8. Zoom bloqué 🔜 (le point le plus important qui reste)

`<meta name="viewport" content="… maximum-scale=1.0, user-scalable=no">` (card.html : 5, index.html : 5)
interdit le zoom par pincement (WCAG 1.4.4, axe `meta-viewport` sur les 24 vues). Un client malvoyant
ne peut pas agrandir « Plus que 3 tampons » ou le code à six chiffres.

Non corrigé ici, exprès : Safari iOS ignore `user-scalable=no` mais **honore `maximum-scale=1` pour
ne pas zoomer automatiquement sur un champ dont la police fait moins de 16 px** — et les deux champs
de saisie font 15 px (`.om-input` card.html : 480, `.field-input` index.html : 299). Retirer la ligne
telle quelle ferait « sauter » l'écran à chaque toucher du champ e-mail. La correction complète tient
en deux lignes et touche une taille de texte, donc au design :

```
<meta name="viewport" content="width=device-width, initial-scale=1">
.om-input, .field-input { font-size: 16px }   /* 15 → 16 : plus de zoom automatique sur iOS */
```

À vérifier sur un vrai iPhone (le zoom automatique n'est pas émulable).

---

## 9. Vitesse

### 9.1 Ce qui a été mesuré

Conditions : réseau « 4G lent » (1,6 Mbit/s, 150 ms), processeur ×4 plus lent, feuille Google Fonts
servie avec **300 ms** de latence artificielle (ordre de grandeur d'un aller-retour mobile vers un
domaine tiers, DNS et TLS compris ; en production la valeur réelle varie), médiane de 3 chargements,
serveur doublé (le temps de réponse d'`api.perify.app` n'est donc **pas** dans ces chiffres).

| | Avant | Après |
|---|---|---|
| Carte — premier rendu (FCP) | 616 ms | **460 ms** |
| Carte — plus grand élément (LCP) | 2 160 ms | 2 184 ms |
| Inscription — premier rendu (FCP) | 684 ms | **348 ms** |
| Inscription — plus grand élément (LCP) | 1 120 ms | 1 112 ms |
| Feuille de polices : statut de rendu (Resource Timing) | `blocking` | `non-blocking` |

Le gain sur le premier rendu est, à peu de chose près, la latence de la feuille de polices : c'est
exactement ce qu'elle bloquait. Le LCP ne bouge pas : il est fait par les photos des récompenses (voir
9.3), pas par les polices.

### 9.2 La feuille Google Fonts était le seul chargement bloquant ✅

`<link rel="stylesheet" href="https://fonts.googleapis.com/…">` (card.html : 19, index.html : 10) : un
fichier CSS externe est bloquant par nature — le navigateur n'affiche rien tant qu'il n'est pas arrivé.
C'était la seule ressource bloquante des deux pages (tout le reste est en ligne dans le HTML), et donc
la seule chose qui s'opposait à « la carte s'ouvre en moins de 2 s » côté page.

Corrigé : `<link rel="preload" as="style" … onload="this.rel='stylesheet'">` + `<noscript>` de
secours. La feuille est demandée aussi tôt qu'avant (priorité haute), mais le premier écran se dessine
sans l'attendre, en police de secours (`display=swap` faisait déjà ce remplacement pendant le
chargement des fichiers de police) ; la vraie police prend le relais au même moment qu'avant. Aucune
capture ne change une fois les polices chargées (§ 12).

Complété :
- `index.html` n'anticipait la connexion que vers `fonts.googleapis.com`, pas vers
  `fonts.gstatic.com` d'où viennent les fichiers de police (ligne 9) : ajouté ;
- les deux pages anticipent maintenant aussi la connexion vers `api.perify.app`, le serveur du seul
  commerce en production — les deux lignes vers Google restent (un commerce encore chez Google en a
  besoin) ;
- les graisses **jamais utilisées** ne sont plus demandées : Plus Jakarta Sans 600 (les deux pages),
  Inter 500 (carte), Inter 300 (inscription). Vérifié par l'inventaire des `font-weight` du CSS et des
  graisses calculées à l'écran : carte = Inter 400/600/700/800 + PJS 700/800 ; inscription = Inter
  400/500/600/700/800 + PJS 700/800. Google sert des polices variables (un fichier par famille et par
  alphabet) : le gain est une feuille plus courte et moins de règles `@font-face` à parser, pas des
  fichiers en moins.

### 9.3 Poids et ressources 📝 (rien à changer sans toucher au design)

Carte du Bap's, chargement complet : HTML 152 Ko (50 Ko compressé ; avant 147 / 49 Ko — la
différence est les commentaires de cette PR), deux fichiers de police (Inter 48 Ko, Plus Jakarta Sans
27 Ko), cinq photos de récompenses (17 à 34 Ko chacune, 130 Ko en tout, `loading="lazy"` mais dans la
zone chargée d'emblée), badge Apple 24 Ko, logo 8 Ko, TripAdvisor 2,5 Ko, logo du commerce 7 Ko.

- Le **badge Google Wallet (16 Ko) est téléchargé sur chaque ouverture** de la carte et de
  l'inscription, même quand son bouton reste `hidden` (card.html : 695 ; index.html : 457) : sur
  iPhone toujours, et sur Android pour un commerce encore servi par Google (depuis le 24/09 il
  s'affiche sur Android pour un commerce servi par Perify). Un `<img>` dans un élément masqué se
  charge quand même. `loading="lazy"` sur cette image l'éviterait (une image
  paresseuse dans un élément non affiché n'est pas demandée). Non appliqué : la consigne est de ne pas
  toucher aux badges — à décider (🔜).
- Le badge Apple de l'inscription (24 Ko) est chargé dès l'accueil pour un écran qui vient trois étapes
  plus tard : même remède possible (🔜).
- Les photos de récompenses sont le LCP de la carte. Elles sont déjà petites ; les 4 hors écran à
  droite du carrousel sont chargées quand même (le seuil de `loading="lazy"` est large sur mobile).
  Rien à gagner sans changer leur format.
- Aucun script externe, donc rien à mettre en `defer` ni à réordonner : les deux scripts de
  l'inscription sont en ligne, courts, et le script de la carte est en fin de `<body>`.
- Le bruit de fond de l'inscription (`body::after`, index.html : 44) est un SVG `feTurbulence` en
  `position:fixed` plein écran : coûteux au premier tracé mais composé une seule fois. Design.

### 9.4 Code mort retiré ✅ (prouvé mort : aucune occurrence hors commentaires dans le HTML ni le JS)

| Fichier : lignes (avant) | Quoi | Preuve |
|---|---|---|
| card.html : 96, 155 | `.spin` et `@keyframes rot` | plus aucun élément `.spin` (le chargeur est `.pl`) |
| card.html : 184 | `.badge-lvl` | rangs retirés le 04/09 |
| card.html : 188-189 | `.hero-sub` | plus d'élément `.hero-sub` |
| card.html : 322-331 | `.bonus`, `.bn`, `.bn .ic.trip`, `.trust`, `.bn .t`, `.bn .s` | tuiles remplacées par les rangées `.social` le 12/09 |
| card.html : 357 | `.gift .st.todo` | seuls `.st.use` et `.st.done.live` sont générés |
| card.html : 429-436 | `.tier-line`, `.tier-chip`, `.tc-*` | rangs retirés le 04/09 |
| card.html : 509-515 | `.switch`, `.sl` | interrupteur retiré le 12/09 |
| card.html : 826 | `const NIVEAUX` | jamais lue |
| card.html : 1000 | `const GIVE` | jamais lue |
| index.html : 71-72, 352 | `#threeCanvas` (CSS et `<canvas>`) | l'aperçu 3D est mort depuis le 08/09 (commentaire ligne 975) |
| index.html : 76-78, 354 | `.viewer-loading`, `@keyframes fadePulse`, `.gone`, « Chargement… » | idem ; le repli s'affiche maintenant **dès le premier rendu** au lieu d'attendre `load` |
| index.html : 75, 580-581, 590, 914, 990-995 | `.croissant-fallback.show`, `initThree`, `showFallback` et leurs appels | idem |
| index.html : 737 | `GLB_PATH` | jamais lue |
| index.html : 248-251 | `.sw-title` | remplacé par `.sw-welcome` le 22/09 |
| index.html : 467-468 | deux `</div>` en trop après l'écran Wallet | balises fermantes sans ouvrante : le navigateur les ignorait ; capture identique |
| index.html : 602 | `<!-- Three.js -->` | commentaire orphelin |

Gardés, exprès : `#screen2.s2-clair` (index.html : 184-191), variante claire documentée et
activable ; `.wheel-pointer` (148), invisible mais requis par `startWheelTicks` (1126) pour le
tic-tac du moyeu.

---

## 10. Tailles de texte 📝

Le CLAUDE.md fixe « texte ≥ 15 px ». Une quarantaine de règles sont en dessous, les plus petites :
`.wr-badge` 9,5 px (index.html : 204), `.cm-codelbl`, `.s4-code-label`, `.agb-h .tag` 10 px
(card.html : 399, index.html : 315, card.html : 440), `.st.done.live .cd` 10,5 px (card.html : 220),
`.hero-label`, `.head .eyebrow`, `.gift .st`, `.field-label`, `.s3-legal`, `.s4-code-sub` 11 px. C'est
du design : rien n'a été changé, mais c'est là que le § 8 (zoom) pèse le plus.

---

## 11. Ce que fait la PR — et ce qu'elle ne fait pas

**Change** (`card.html`, `index.html`, `ACCESSIBILITE.md`) : feuille de polices non bloquante et
graisses inutiles retirées, connexions anticipées, `:focus-visible`, zones tactiles de 44 px, rôles et
noms ARIA, titres et repères, dialogues avec focus et Échap, régions vivantes, barre de progression
annoncée, carrousel focusable, `<div onclick>` devenu `<button>`, garde-fou mouvement réduit sur les
particules, code mort retiré.

**Ne change pas** : aucune couleur, aucune taille, aucun texte visible, aucun appel serveur (les
mêmes actions, les mêmes paramètres, dans le même ordre), aucune règle du programme (`PRIZES`, une roue
par carte, tampons), aucun badge Apple/Google, ni `commerces.json`, ni le viewport (§ 8).

---

## 12. Comment vérifier chaque point

Sur un iPhone et, pour le clavier, un ordinateur (ou un clavier Bluetooth). `?demo=1` sur la carte
fonctionne hors ligne mais n'a ni cadeau ni offre : pour « Utiliser » et « Activer mon offre », prendre
une vraie carte.

| Point | Où | Geste | Attendu |
|---|---|---|---|
| Rien n'a bougé à l'écran | `card.html?demo=1&type=baps`, `index.html?type=baps` et les écrans suivants | comparer à la production | identique ; le croissant de l'accueil apparaît sans « Chargement… » |
| Polices non bloquantes | `card.html?demo=1` avec le mode avion activé **après** la première ouverture (cache) ou en réseau lent | ouvrir | le texte s'affiche tout de suite (police système), puis prend Inter / Plus Jakarta Sans ; dans l'inspecteur Safari, `css2?family=…` n'est plus « bloquant » |
| Connexions anticipées | inspecteur Safari, onglet Réseau, sur une vraie carte du Bap's | ouvrir | `api.perify.app` est joint sans nouvelle poignée de main (temps de connexion 0) |
| Focus visible | ordinateur, `card.html?demo=1&type=baps` | Tab | contour orange sur les boutons des cartes blanches, jaune sur « Mes données personnelles » ; au doigt, rien |
| Zones de 44 px | vraie carte | toucher 8 px au-dessus de « Utiliser », « Mes données personnelles », « Ne plus recevoir nos offres », « Activer mon offre », « Échanger » | le bouton répond |
| Bouton « Continuer sans laisser d'avis » | `index.html?type=baps`, attendre 15 s | Tab jusqu'à lui, Entrée ; puis au doigt | la roue s'ouvre ; visuellement identique à avant |
| Formulaire nommé | `index.html?type=baps` → roue → « Recevoir par email » | VoiceOver, ou toucher le mot « Prénom » | VoiceOver dit « Prénom, champ de texte » ; toucher le libellé ouvre le clavier dans le champ |
| Titres et repère | VoiceOver, rotor « Titres » | carte : « Le Bap's » (1), « Nouvelle offre », « Mes récompenses », « Gagner plus de tampons »… (2) ; inscription : « Le Bap's » (1), « Un cadeau vous attend ici. » (2) ; roue : « Bienvenue sur la Roue de la Chance ! » (1) | tous présents ; rotor « Repères » : « principal » |
| Fenêtres modales | vraie carte, « Mes données personnelles » | clavier : Tab, Tab, Maj+Tab, Échap ; VoiceOver | Tab reste dans la fenêtre ; Échap ferme ; le focus revient sur le bouton ; VoiceOver annonce « Tes données, fenêtre » |
| Annonces | VoiceOver, vraie carte | gagner un tampon, valider une adresse, appuyer sur « Effacer mes informations » | « +1 tampon pour ton passage », la mention sous le champ, l'avertissement avant effacement sont lus sans y aller |
| Barre de progression | VoiceOver | se poser sur la barre | « Plus que 3 tampons pour Frites, barre de progression, 7 sur 10 » |
| Tuiles verrouillées et carrousel | clavier | Tab | les tuiles « Plus que N tampons » ne sont plus des arrêts ; le carrousel se met en évidence et défile aux flèches |
| Mouvement réduit | Réglages iOS › Accessibilité › Mouvement › Réduire les animations | gagner un tampon ; jouer la roue | pas d'étincelles ni de confettis ; la roue montre son résultat sans tourner ; les emojis flottants sont immobiles |
| Code mort | `index.html` (sans `?type`) | ouvrir | le croissant est là dès l'ouverture, plus de « Chargement… » qui pulse |
| Contrastes (non corrigés) | pas de geste : ce sont les valeurs du § 1 | | à décider avec le design |
| Zoom (non corrigé) | pincer sur la carte | | toujours bloqué ; § 8 |

**Ce que la session a pu prouver elle-même** : captures avant/après des 24 vues comparées pixel à pixel
(18 identiques ; 6 avec 91 à 633 pixels de différence, tous dans les étincelles du tampon gagné dont le
minutage n'est pas reproductible à la milliseconde) ; axe-core de 462 à 45 défauts sur les 24 vues, les
45 restants étant le viewport (24, § 8), les contrastes (20, § 1) et la vue « Chargement… » sans titre (1,
§ 4) ; zones tactiles ; boucle du focus dans les fenêtres ; statut « non bloquant » de la feuille de polices et gain de premier rendu. L'outil de
mesure (Chromium + axe-core + comparaison d'images, ≈ 400 lignes) n'est pas dans le dépôt — il n'y a
pas d'outillage Node ici ; il peut être ajouté à `_outils/tests` sur demande.
