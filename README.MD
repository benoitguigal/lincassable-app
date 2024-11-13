# lincassable-app


## Supabase 

### Démarrer Supabase

`npx supabase start`

### Mettre à jour le fichier de seed avec les données de la prod

`npx supabase db dump --exclude storage.buckets,storage.objects  --data-only -f supabase/seed.sql`

### Générer une migration à partir des changements faits depuis le Studio

`npx supabase db diff -f <nom_de_la_migration>`

### Reset la base de données  

Ré-applique les migrations et le seed.

`npx supabase db reset`

## Edge function

`npx supabase functions serve`


## Refine

This [Refine](https://github.com/refinedev/refine) project was generated with [create refine-app](https://github.com/refinedev/refine/tree/master/packages/create-refine-app).

## Getting Started

A React Framework for building internal tools, admin panels, dashboards & B2B apps with unmatched flexibility ✨

Refine's hooks and components simplifies the development process and eliminates the repetitive tasks by providing industry-standard solutions for crucial aspects of a project, including authentication, access control, routing, networking, state management, and i18n.

## Available Scripts

### Running the development server.

```bash
    npm run dev
```

### Building for production.

```bash
    npm run build
```

### Running the production server.

```bash
    npm run start
```

## Learn More

To learn more about **Refine**, please check out the [Documentation](https://refine.dev/docs)

- **Supabase Data Provider** [Docs](https://refine.dev/docs/core/providers/data-provider/#overview)
- **Ant Design** [Docs](https://refine.dev/docs/ui-frameworks/antd/tutorial/)
- **Inferencer** [Docs](https://refine.dev/docs/packages/documentation/inferencer)
- **React Router** [Docs](https://refine.dev/docs/core/providers/router-provider/)

## License

MIT
