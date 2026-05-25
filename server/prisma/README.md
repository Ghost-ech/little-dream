# Prisma — gestion du schéma & migrations

Prisma est utilisé **uniquement** pour gérer les migrations du schéma de la base. Le code applicatif (controllers, models) continue d'utiliser `pg` directement.

## Setup initial (à faire une fois)

### 1. Renseigner `DATABASE_URL` dans `.env`

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/little_dream?schema=public"
```

⚠️ Les caractères spéciaux du mot de passe doivent être url-encodés : `@` → `%40`, `:` → `%3A`, `#` → `%23`, etc.

### 2. Introspecter la base existante

```bash
npm run db:pull
```

Cette commande se connecte à `DATABASE_URL` et remplit `schema.prisma` avec les modèles correspondant **exactement** à l'état actuel de la base (tables, colonnes, types, contraintes, FK).

### 3. Baseline la base de prod (à faire une fois en prod)

La base contient déjà toutes les tables — il ne faut **pas** que Prisma essaie de les recréer. On crée donc une migration "initiale" et on la marque comme déjà appliquée.

**En local :**
```bash
# Crée le dossier prisma/migrations/0_init/ avec un fichier migration.sql
# représentant l'état actuel
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql
```

(Il faut créer le dossier `prisma/migrations/0_init/` avant.)

**En prod :** une fois la migration `0_init` commitée et déployée :
```bash
npx prisma migrate resolve --applied 0_init
```
→ Prisma marque cette migration comme déjà jouée sans toucher aux données.

À partir de là, prod est "synchronisée" avec Prisma.

## Workflow quotidien

### Ajouter / modifier une table

1. Éditer `prisma/schema.prisma` (ajouter un model, une colonne, etc.)
2. Créer la migration en local :
   ```bash
   npm run migrate:dev -- --name add_xxx
   ```
   → Prisma génère le SQL dans `prisma/migrations/<timestamp>_add_xxx/` ET applique en local.
3. Commiter le dossier de migration + `schema.prisma`.
4. En prod, après déploiement du code :
   ```bash
   npm run migrate:deploy
   ```
   → applique uniquement les migrations non encore exécutées.

### Vérifier l'état des migrations

```bash
npm run migrate:status
```

### Re-synchroniser le schéma depuis la DB (si modif faite directement en SQL)

```bash
npm run db:pull
```
Met à jour `schema.prisma`. À éviter — préférer toujours passer par `migrate:dev`.

### Explorer la base graphiquement

```bash
npm run prisma:studio
```

## Pourquoi pas d'utilisation du client Prisma dans le code ?

Choix volontaire : on garde le code Express existant (`pg.query`) intact pour éviter une refonte. Prisma sert **uniquement** d'outil de gestion du schéma. Migrer le code applicatif vers `@prisma/client` pourra se faire plus tard, model par model.

## Fichiers importants

- `prisma/schema.prisma` — source de vérité du schéma. À commiter.
- `prisma/migrations/` — historique des migrations. À commiter intégralement.
- `database/schema.sql` — **legacy**, ne plus modifier à la main. À conserver tant que `npm run init-db` est utilisé pour les setups frais, sinon supprimable.
