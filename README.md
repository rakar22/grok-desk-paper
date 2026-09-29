# Alfa Kraken

Mini App: **demo paper** with public Kraken tickers.
Real orders: **server only** (`server/kraken_bot.py`). LIVE LOCK in the browser.

## Demo (works now)

Open the Mini App → **Demo** → START.
Prices from `GET https://api.kraken.com/0/public/Ticker`.

## Real money (VPS)

1. Kraken Pro → Settings → API → Create key  
   Permissions: Query Funds, Query Open/Closed Orders, Create & Modify Orders, Cancel.  
   **No Withdraw.** IP whitelist the VPS.
2. On the VPS:

```bash
export KRAKEN_API_KEY=...
export KRAKEN_API_SECRET=...
export KRAKEN_PAIR=XBTUSD
export KRAKEN_VOLUME=0.0001
python3 server/kraken_bot.py          # dry run
export KRAKEN_LIVE=1
python3 server/kraken_bot.py          # one market buy — review first
```

Spot UAT is on request from Kraken. Futures sandbox: https://demo-futures.kraken.com

Do not paste secrets into Telegram or this frontend.
