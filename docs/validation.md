# KayWorks V1 Validation

Run:

```bash
npm run check
```

This validates:

- local assets referenced by HTML and the manifest
- JavaScript syntax
- required sections
- exact Money Tracker production/demo links
- WIP labeling and absence of fake WIP domains
- manifest/Home Screen basics
- privacy wording basics
- placeholder-text absence
- obvious secrets and forbidden private-data paths

## Manual browser smoke checks

Before deployment, also verify:

1. homepage loads with no console errors
2. mobile navigation opens/closes and remains keyboard usable
3. all section anchors work
4. Money Tracker links open the intended origins
5. Home Screen guide opens/closes
6. responsive layout works at narrow phone width and normal desktop width
7. no content clips horizontally
8. the raccoon/icon assets render
9. service worker registration does not affect external application subdomains
