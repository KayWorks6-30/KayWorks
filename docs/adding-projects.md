# Adding a KayWorks Project

KayWorks is intentionally designed so adding another real application does not require redesigning the hub.

## When a project is still in development

Keep it in the Lab section with:

- a real project name or honest working title
- a short problem/idea description
- a visible WIP status
- no fake launch URL
- no claims for functionality that has not been built

## When a project becomes usable

1. Move or add its card in the Apps section.
2. Add its real URL.
3. Add only a few useful traits/labels.
4. Update the Project Status board.
5. Keep the launcher focused on the most important apps rather than every experiment.
6. Run `npm run check`.

## Application data

Each app owns its own local data and storage boundary. Do not create cross-subdomain localStorage assumptions in KayWorks.
