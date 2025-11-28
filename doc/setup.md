# Guide d'installation

### Cloner le projet Github

#### Windows

1. Ouvrez l’invite de commandes (cmd) ou PowerShell.
2. Accédez au dossier où vous souhaitez cloner le projet :

```powershell
cd C:\Users\<VotreNom>\Workspace
```

Remplacez `<VotreNom>` par votre nom d’utilisateur Windows.

3. Clonez le dépôt GitHub :

```powershell
git clone https://github.com/benoitguigal/lincassable-app.git
```

4. Accédez au dossier du projet :

```powershell
cd lincassable-app
```

### Installation de Docker Destop

Docker est utilisé pour faire tourner Supabase en local

#### Windows

1. Accédez à [Docker Desktop pour Windows](https://www.docker.com/products/docker-desktop/).
2. Téléchargez l’installeur et exécutez-le.
3. Suivez les instructions d’installation (WSL 2 recommandé pour Windows 10/11).
4. Redémarrez votre ordinateur si nécessaire.
5. Vérifiez l’installation avec :

```powershell
docker --version
```

### Installation de Node.js

Node.js est nécessaire pour exécuter l’application. Il est recommandé d’utiliser **nvm** (Node Version Manager) pour gérer facilement les versions de Node.js.

#### Windows

1. Téléchargez et installez [nvm-windows](https://github.com/coreybutler/nvm-windows/releases).
2. Ouvrez un nouveau terminal (cmd ou PowerShell).
3. Vérifiez l’installation avec :

```powershell
nvm version
```

4. Installez la version de Node.js indiquée dans le fichier `.nvmrc` :

```powershell
nvm install <version>
```

Remplacez `<version>` par le contenu du fichier `.nvmrc` (par exemple : `18.18.0`).

5. Activez cette version :

```powershell
nvm use <version>
```

**Remarque :** Pour connaître la version à utiliser, affichez le contenu du fichier `.nvmrc` :

```bash
cat .nvmrc
```

### Lancement de Supabase

#### Windows

1. Ouvrez un terminal (cmd ou PowerShell) dans le dossier du projet :

```powershell
cd C:\Users\<VotreNom>\Workspace\lincassable-app
```

2. Lancez Supabase en local avec la commande suivante :

```powershell
npx supabase start
```

3. Attendez que tous les services soient démarrés. Vous pouvez maintenant accéder à Supabase Studio via l’URL affichée dans le terminal (par défaut : http://localhost:54323).

**Remarque :** Si c’est la première fois que vous lancez cette commande, les images Docker nécessaires seront téléchargées, ce qui peut prendre quelques minutes.

4. Vous pouvez vérifier que tout fonctionne comme il faut en faisant

```powershell
npx supabase status
```

5. Appliquer les migrations et ajoute des données (un fichier seed.sql doit être présent dans le dossier supabase)

```powershell
npx supabase db reset
```

### Lancement de l'application React

1. Installer les dépendances du projet

```powershell
npm install
```

2. Lancer l'application en faisant

```powershell
npm run dev
```

3. Ouvrir un navigateur web (Firefox, Chrome, etc) et se rendre à l'adresse http://localhost:5173/. La page de connexion est sensée s'afficher.
