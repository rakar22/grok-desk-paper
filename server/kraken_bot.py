#!/usr/bin/env python3
"""Alfa Kraken bot — DEMO by default. Set KRAKEN_LIVE=1 only on a VPS.
Never put secrets in the Mini App.
Docs: https://docs.kraken.com/exchange/guides/rest/authentication
"""
import hashlib
import hmac
import base64
import time
import os
import urllib.parse
import urllib.request
import json

API_URL = "https://api.kraken.com"
API_KEY = os.environ.get("KRAKEN_API_KEY", "")
API_SECRET = os.environ.get("KRAKEN_API_SECRET", "")
LIVE = os.environ.get("KRAKEN_LIVE", "0") == "1"
PAIR = os.environ.get("KRAKEN_PAIR", "XBTUSD")
VOLUME = os.environ.get("KRAKEN_VOLUME", "0.0001")


def public(path, data=None):
    url = API_URL + path
    if data:
        url += "?" + urllib.parse.urlencode(data)
    with urllib.request.urlopen(url, timeout=20) as r:
        return json.loads(r.read().decode())


def sign(path, data, secret):
    post = urllib.parse.urlencode(data)
    encoded = (str(data["nonce"]) + post).encode()
    message = path.encode() + hashlib.sha256(encoded).digest()
    mac = hmac.new(base64.b64decode(secret), message, hashlib.sha512)
    return base64.b64encode(mac.digest()).decode(), post


def private(path, data):
    if not API_KEY or not API_SECRET:
        raise SystemExit("Set KRAKEN_API_KEY and KRAKEN_API_SECRET")
    data = dict(data)
    data["nonce"] = str(int(time.time() * 1000))
    sig, post = sign(path, data, API_SECRET)
    req = urllib.request.Request(
        API_URL + path,
        data=post.encode(),
        headers={"API-Key": API_KEY, "API-Sign": sig},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode())


def ticker(pair):
    j = public("/0/public/Ticker", {"pair": pair})
    if j.get("error"):
        raise RuntimeError(j["error"])
    key = next(iter(j["result"]))
    return float(j["result"][key]["c"][0])


def add_order(pair, side, volume):
    return private(
        "/0/private/AddOrder",
        {"ordertype": "market", "type": side, "volume": volume, "pair": pair},
    )


def main():
    px = ticker(PAIR)
    print("ticker", PAIR, px, "live", LIVE)
    if not LIVE:
        print("DEMO: no AddOrder. export KRAKEN_LIVE=1 on VPS to enable.")
        return
    print("LIVE order", PAIR, "buy", VOLUME)
    print(add_order(PAIR, "buy", VOLUME))


if __name__ == "__main__":
    main()
