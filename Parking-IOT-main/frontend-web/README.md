# Frontend Web – Smart Parking Dashboard

Aplikacioni web per administrim te sistemit te parkimit.

## Teknologjia
- `React`
- `Vite` ose `Create React App`
- `Axios` per API calls
- `Chart.js` ose `Recharts` per grafike
- `React Router` per navigim
- `Tailwind CSS` ose `Material UI` per stilim

## Struktura e propozuar

```text
frontend-web/
├── public/
├── src/
│   ├── components/     UI components
│   ├── pages/          Dashboard, Login, Users, Parking
│   ├── services/       API calls (axios)
│   ├── hooks/          Custom hooks
│   ├── context/        Auth context, JWT
│   ├── utils/          Helpers
│   └── App.jsx
├── package.json
└── vite.config.js
```

## Si te fillohet
```bash
npm create vite@latest . -- --template react
npm install
npm install axios react-router-dom recharts
npm run dev
```

## Faqet kryesore
- `Login`
- `Dashboard` (statistika ne kohe reale)
- `Parking Slots` (pamja e vendeve)
- `Users Management`
- `Zones`
- `Reports`
- `Reservations`

## Pergjegjes
- `Personi 5` – `Dashboard`, `Parking`, `Auth`
- `Personi 6` – `Users`, `Reports`, `Reservations`

## Shenim
Aplikacioni duhet te jete `responsive` qe te funksionoje edhe nga telefoni, pasi `mobile app` eshte opsional.
