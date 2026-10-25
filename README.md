# Salary Pay Check Planner

A simple static web page that estimates your monthly take-home pay in Malaysia after statutory contributions.

**Live demo:** https://pizforge.github.io/Salary-pay-check-planner/

## Features

- Enter your monthly gross salary and see an estimated net salary
- Employee EPF (KWSP) at 11%
- SOCSO (PERKESO) and EIS (SIP) with a wage ceiling of RM6,000
- Optional Lindung 24 Jam toggle (0.75%)
- All rates and ceilings are read from `data.json`, so they are easy to update
- No framework, no build step, no dependencies

## Run locally

`data.json` is loaded with `fetch`, so the page must be served over HTTP. Opening `index.html` directly will not work.

```bash
# Python
python -m http.server 3000

# or use the Live Server extension in VS Code
```

Then open http://localhost:3000.

## Project structure

```
index.html   Page markup
styles.css   Styling
app.js       Calculation and UI logic
data.json    Contribution rates and wage ceilings
```

## Updating rates

Edit `data.json` when EPF, SOCSO, EIS or Lindung 24 Jam rates change. No code changes are needed.

## Disclaimer

Results are estimates only. SOCSO is calculated at a flat 0.5% employee rate, while actual contributions follow the PERKESO contribution schedule. Monthly income tax (PCB) is not included. Always confirm with your employer or the official sources:

- KWSP (EPF): https://www.kwsp.gov.my
- PERKESO (SOCSO and EIS): https://www.perkeso.gov.my

## License

MIT
