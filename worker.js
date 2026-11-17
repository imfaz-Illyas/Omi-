// OMI LANKA – complete game server + website in one file for Cloudflare Workers. Generated; edit the source project instead.
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/worker.js
import { DurableObject } from "cloudflare:workers";

// src/engine.js
var sleep = /* @__PURE__ */ __name((ms) => new Promise((r) => setTimeout(r, ms)), "sleep");
function pick(a) {
  return a[rand(a.length)];
}
__name(pick, "pick");
var REPLY = { "\u{1F602}": "\u{1F602}", "\u{1F60E}": "\u{1F440}", "\u{1F525}": "\u{1F60E}", "\u{1F926}": "\u{1F602}", "\u{1F480}": "\u{1F62D}", "\u2764\uFE0F": "\u2764\uFE0F", "\u{1F62D}": "\u{1F602}", "\u{1F440}": "\u{1F60E}" };
var TIME_SCALE = /* @__PURE__ */ __name(() => globalThis.__OMI_TIME_SCALE || 1, "TIME_SCALE");
var SUITS = ["S", "H", "C", "D"];
var RANKS = ["7", "8", "9", "10", "J", "Q", "K", "A"];
function rand(n) {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] % n;
}
__name(rand, "rand");
var Omi = {
  deck() {
    const d = [];
    for (const s of SUITS) for (const r of RANKS) d.push({ s, r, id: r + s });
    return d;
  },
  shuffle(a) {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) {
      const j = rand(i + 1);
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  },
  v(c) {
    return RANKS.indexOf(c.r);
  },
  legal(hand, trick) {
    if (!trick.length) return hand.slice();
    const led = trick[0].card.s;
    const f = hand.filter((c) => c.s === led);
    return f.length ? f : hand.slice();
  },
  isLegal(hand, trick, card) {
    return Omi.legal(hand, trick).some((c) => c.id === card.id);
  },
  beats(a, b, trump) {
    if (a.s === b.s) return Omi.v(a) > Omi.v(b);
    return a.s === trump;
  },
  winnerIdx(trick, trump) {
    let w = 0;
    for (let i = 1; i < trick.length; i++) if (Omi.beats(trick[i].card, trick[w].card, trump)) w = i;
    return w;
  },
  scoreRound(tricks, callerTeam, cfg) {
    if (tricks[0] === tricks[1]) return { tie: true };
    const wt = tricks[0] > tricks[1] ? 0 : 1, kap = tricks[wt] === 8;
    let pts = wt === callerTeam ? 1 : 2;
    if (kap) {
      if (cfg.kapothi === "game") pts = Infinity;
      else if (cfg.kapothi === "3") pts = 3;
    }
    return { winnerTeam: wt, points: pts, kapothi: kap, byCaller: wt === callerTeam };
  }
};
var C = {
  start: [["\u0D9C\u0DDA\u0DB8 \u0DB4\u0DA7\u0DB1\u0DCA \u0D9C\u0DB8\u0DD4! \u{1F4AA}", "Game patan gamu! \u{1F4AA}", "Let\u2019s go! \u{1F4AA}"], ["\u0D85\u0DAF \u0DB1\u0DB8\u0DCA \u0D85\u0DB4\u0DD2 \u0DAF\u0DD2\u0DB1\u0DB1\u0DC0\u0DCF!", "Ada nam api dinanawa!", "We\u2019re winning today!"], ["\u0D9A\u0DCF\u0DA9\u0DCA \u0DC4\u0DDC\u0DB3\u0DA7 \u0DB6\u0DD9\u0DAF\u0DB4\u0DB1\u0DCA \u0DC4\u0DDC\u0DB3\u0DDA \u{1F602}", "Card hondata bedapan honde \u{1F602}", "Deal me good cards, okay? \u{1F602}"]],
  goodHand: [["\u0D85\u0DAF \u0DB1\u0DB8\u0DCA \u0D9C\u0DDC\u0DA9!", "Ada nam goda!", "Today\u2019s a jackpot!"], ["\u0D85\u0DB8\u0DCA\u0DB8\u0DDD! \u0DC3\u0DD4\u0DB4\u0DD2\u0DBB\u0DD2 \u0D9A\u0DCF\u0DA9\u0DCA \u0DA7\u0DD2\u0D9A\u0D9A\u0DCA!", "Ammo! Supiri card tikak!", "Wow, what a hand!"], ["\u0D85\u0DAF \u0DB8\u0D9C\u0DDA \u0DAF\u0DC0\u0DC3!", "Ada mage dawasa!", "Today is my day!"], ["\u0D9C\u0DDA\u0DB8 \u0DB8\u0D9C\u0DDA \u0D85\u0DAD\u0DDA!", "Game mage athe!", "The game is in my hands!"]],
  badMove: [["\u0DB8\u0DDC\u0D9A\u0D9A\u0DCA\u0DAF \u0DB6\u0D82 \u0D92 \u0DAF\u0DD0\u0DB8\u0DCA\u0DB8\u0DDA? \u{1F602}", "Mokakda bang e damme? \u{1F602}", "What did you just play, machan? \u{1F602}"], ["\u0D9A\u0DCF\u0DA9\u0DCA \u0D9C\u0DC4\u0DB1\u0DCA\u0DB1 \u0DAF\u0DB1\u0DCA\u0DB1\u0DD9 \u0DB1\u0DD0\u0DAF\u0DCA\u0DAF?", "Card gahanna danne naddha?", "Do you even know how to play?"], ["\u0D85\u0DB1\u0DDA \u0D85\u0DB8\u0DCA\u0DB8\u0DDD!", "Ane ammo!", "Oh my goodness!"], ["\u0D92\u0D9A \u0DB1\u0DB8\u0DCA \u0DC4\u0DD2\u0DAD\u0DCF\u0D9C\u0DB1\u0DCA\u0DB1 \u0DB6\u0DD1!", "Eka nam hithaganna bae!", "Never saw that coming!"], ["\u0DB4\u0DCF\u0DA7\u0DCA\u0DB1\u0DBB\u0DCA\u0D9C\u0DDA \u0D85\u0DAD\u0DAD\u0DCA \u0D9A\u0DB4\u0DB1\u0DC0\u0DAF? \u{1F926}", "Partnerge athath kapanawada? \u{1F926}", "Cutting your own partner? \u{1F926}"]],
  trickWin: [["\u0D85\u0DB1\u0DCA\u0DB1 \u0DC0\u0DD0\u0DA9\u0DCA\u0DA9\u0DCF!", "Anna wadda!", "That\u2019s a master!"], ["\u0D9A\u0DDC\u0DC4\u0DDC\u0DB8\u0DAF \u0D92\u0D9A?", "Kohomada eka?", "How about that?"], ["\u0DC3\u0DD4\u0DB4\u0DD2\u0DBB\u0DD2 \u0D9C\u0DD0\u0DC4\u0DD2\u0DBD\u0DCA\u0DBD\u0D9A\u0DCA!", "Supiri gahillak!", "Super shot!"], ["\u0DAF\u0DD0\u0DB1\u0DCA \u0DAD\u0DB8\u0DBA\u0DD2 \u0D9C\u0DDA\u0DB8!", "Dan thamai game!", "Now it\u2019s a game!"]],
  aceLost: [["A \u0D91\u0D9A\u0DAD\u0DCA \u0D9C\u0DD2\u0DBA\u0DCF! \u0D85\u0DB1\u0DDA \u0D85\u0DB4\u0DDC\u0DBA\u0DD2 \u{1F62D}", "A ekath giya! Ane apoi \u{1F62D}", "Even the Ace is gone! \u{1F62D}"], ["\u0D86\u0DC3\u0DCA \u0D91\u0D9A\u0D9A\u0DCA \u0D9A\u0DD1\u0DC0\u0DCF! \u{1F602}", "Ace ekak kaewa! \u{1F602}", "Somebody ate an Ace! \u{1F602}"]],
  roundWin: [["\u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 \u0DA7\u0DD2\u0D9A \u0D91\u0DB1\u0DC0\u0DCF! \u{1F525}", "Lakunu tika enawa! \u{1F525}", "Points rolling in! \u{1F525}"], ["\u0DAF\u0DD0\u0DB1\u0DCA \u0DAD\u0DB8\u0DBA\u0DD2 \u0D9C\u0DDA\u0DB8!", "Dan thamai game!", "Now it\u2019s a game!"], ["\u0D85\u0DB4\u0DD2\u0DC0 \u0DB1\u0DC0\u0DAD\u0DCA\u0DAD\u0DB1\u0DCA\u0DB1 \u0DB6\u0DD1!", "Apiwa nawaththanna bae!", "Nobody can stop us!"]],
  lose: [["\u0D85\u0DAF \u0DB1\u0DB8\u0DCA \u0D85\u0DB4\u0DD2 \u0D89\u0DC0\u0DBB\u0DBA\u0DD2!", "Ada nam api iwarai!", "We\u2019re done for today!"], ["\u0DC0\u0DCF\u0DC3\u0DB1\u0DCF\u0DC0 \u0DB1\u0DD0\u0DAD\u0DD2 \u0DAF\u0DC0\u0DC3\u0D9A\u0DCA!", "Waasanawa nathi dawasak!", "Just not our lucky day!"], ["\u0D8A\u0DC5\u0D9F \u0D9C\u0DDA\u0DB8\u0DDA \u0DB6\u0DBD\u0DB8\u0DD4!", "Eelanga game eke balamu!", "We\u2019ll see next game!"], ["\u0D9A\u0DCF\u0DA9\u0DCA \u0DA7\u0DD2\u0D9A\u0DAD\u0DCA \u0D85\u0DB4\u0DD2\u0DA7 \u0DC0\u0DD2\u0DBB\u0DD4\u0DAF\u0DCA\u0DB0\u0DBA\u0DD2!", "Card tikath apita viruddhai!", "Even the cards are against us!"]],
  gameWin: [["\u0D9A\u0DC0\u0DD4\u0DAF \u0DAF\u0DD0\u0DB1\u0DCA \u0DC0\u0DD0\u0DA9\u0DCA\u0DA9\u0DDD?", "Kawda dan waddo?", "Who\u2019s the boss now?"], ["\u0D85\u0DB1\u0DCA\u0DB1 \u0D92\u0D9A\u0DBA\u0DD2 \u0D9C\u0DDA\u0DB8!", "Anna ekai game!", "Now THAT\u2019s a game!"], ["\u0DA2\u0DBA\u0D9C\u0DCA\u200D\u0DBB\u0DC4\u0DAB\u0DBA \u0D85\u0DB4\u0DDA!", "Jayagrahanaya ape!", "Victory is ours!"], ["\u0D85\u0DAF \u0DBB\u0DD1 \u0D85\u0DB4\u0DDA \u0DBB\u0DD1!", "Ada rae ape rae!", "Tonight is our night!"]],
  kapothi: [["\u0D9A\u0DB4\u0DDD\u0DAD\u0DD2! \u{1F54A}\uFE0F \u0D9A\u0DC0\u0DD4\u0DAF \u0DAF\u0DD0\u0DB1\u0DCA \u0DC0\u0DD0\u0DA9\u0DCA\u0DA9\u0DDD?", "Kapothi! \u{1F54A}\uFE0F Kawda dan waddo?", "Kapothi! \u{1F54A}\uFE0F Who\u2019s the boss now?"], ["\u0D85\u0DAD\u0DCA \u0D85\u0DA7\u0DB8 \u0D85\u0DB4\u0DDA! \u{1F60E}", "Ath atama ape! \u{1F60E}", "All eight tricks are ours! \u{1F60E}"]]
};
var BOTS = [
  { avatar: "uncle", names: ["\u0DC3\u0DD4\u0DB1\u0DD2\u0DBD\u0DCA \u0DB8\u0DCF\u0DB8\u0DCF", "Sunil Mama", "Uncle Sunil"] },
  { avatar: "sleepy", names: ["\u0DB1\u0DD2\u0DAF\u0DD2\u0DB8\u0DAD \u0DB1\u0DD2\u0DB8\u0DBD\u0DCA", "Nidimatha Nimal", "Sleepy Nimal"] },
  { avatar: "champ", names: ["\u0DA0\u0DD0\u0DB8\u0DCA\u0DB4\u0DD2\u0DBA\u0DB1\u0DCA \u0DA0\u0DB8\u0DD2\u0DB1\u0DCA\u0DAF", "Champion Chaminda", "Champion Chaminda"] },
  { avatar: "angry", names: ["\u0D9A\u0DDA\u0DB1\u0DCA\u0DAD\u0DD2 \u0D9A\u0DB8\u0DBD\u0DCA", "Kenthi Kamal", "Grumpy Kamal"] },
  { avatar: "village", names: ["\u0D9C\u0DB8\u0DDA \u0D9C\u0DD4\u0DAB\u0DDA", "Game Gune", "Village Gune"] },
  { avatar: "cat", names: ["\u0DB4\u0DD6\u0DC3\u0DCF \u0DB4\u0DD4\u0D82\u0DA0\u0DD2", "Poosa Punchi", "Punchi the Cat"] },
  { avatar: "elephant", names: ["\u0D85\u0DBD\u0DD2\u0DBA\u0DCF \u0D85\u0DA2\u0DD2\u0DAD\u0DCA", "Aliya Ajith", "Ajith the Elephant"] },
  { avatar: "cool", names: ["\u0D9A\u0DD6\u0DBD\u0DCA \u0D9A\u0DC3\u0DD4\u0DB1\u0DCA", "Cool Kasun", "Cool Kasun"] }
];
var Bot = {
  chooseTrump(h) {
    let best = h[0].s, bs = -1;
    for (const s of SUITS) {
      const cs = h.filter((c) => c.s === s);
      if (!cs.length) continue;
      const sc = cs.length * 10 + cs.reduce((a, c) => a + Omi.v(c), 0) + rand(3);
      if (sc > bs) {
        bs = sc;
        best = s;
      }
    }
    return best;
  },
  play(h, tr, T, seat) {
    const legal = Omi.legal(h, tr), cost = /* @__PURE__ */ __name((c) => (c.s === T ? 20 : 0) + Omi.v(c), "cost");
    const low = /* @__PURE__ */ __name((a) => a.slice().sort((x, y) => cost(x) - cost(y))[0], "low"), high = /* @__PURE__ */ __name((a) => a.slice().sort((x, y) => cost(y) - cost(x))[0], "high");
    if (!tr.length) {
      const nonT = legal.filter((c) => c.s !== T), trumps = legal.filter((c) => c.s === T);
      const aces = nonT.filter((c) => c.r === "A");
      if (aces.length) return aces[0];
      if (trumps.length >= 3 && trumps.some((c) => c.r === "A" || c.r === "K")) return high(trumps);
      if (nonT.length) {
        const by = {};
        nonT.forEach((c) => (by[c.s] = by[c.s] || []).push(c));
        return low(Object.values(by).sort((a, b) => b.length - a.length)[0]);
      }
      return low(legal);
    }
    const wi = Omi.winnerIdx(tr, T), wc = tr[wi].card, led = tr[0].card.s;
    if (tr[wi].seat % 2 === seat % 2) return low(legal);
    const winners = legal.filter((c) => Omi.beats(c, wc, T));
    if (winners.length) {
      if (tr.length === 3) return low(winners);
      const top = winners.filter((c) => c.s === led && c.r === "A");
      return top.length ? top[0] : low(winners);
    }
    return low(legal);
  }
};
function createHost(S, o) {
  const SPD = /* @__PURE__ */ __name(() => ({ slow: 1.5, normal: 1, fast: 0.55 }[S.speed] || 1) * TIME_SCALE(), "SPD");
  function makeHost(o2) {
    const H = { gen: 0, ids: ["me", null, null, null], pk: [null, null, null, null], lastSeq: [0, 0, 0, 0], lastRx: [], offAt: [0, 0, 0, 0], pending: null, contRes: null, contRej: null, lastSay: 0, lastIdx: {}, enc: [], hands: [[], [], [], []], trick: [], pubTbl: !!o2.pubTbl, lobbyEnd: o2.pubTbl ? Date.now() + 25e3 : 0, rbN: 0, endN: 0 };
    const s = H.s = { v: 0, ph: o2.lobby ? "lobby" : "start", seats: o2.seats, sc: [0, 0], cr: 0, tg: S.target, kp: S.kapothi, dl: 0, cl: null, tp: null, tu: null, tk: [], tr: [0, 0], nc: [0, 0, 0, 0], pt: [0, 0, 0, 0], calls: [0, 0, 0, 0], rn: 0, cx: [0, -1], ev: [0], rb: null, end: null, tl: 0, as: 0 };
    H.view = () => JSON.parse(JSON.stringify(s));
    H.pub = () => {
      s.v++;
      o2.onPub(H);
    };
    H.isBot = (i) => !!(s.seats[i] && s.seats[i].b !== void 0);
    H.wait = async (ms) => {
      const g = H.gen;
      await sleep(ms * SPD());
      if (g !== H.gen) throw "cancel";
    };
    H.later = (fn, ms) => {
      const g = H.gen;
      setTimeout(() => {
        if (g === H.gen) {
          fn();
          H.pub();
        }
      }, ms);
    };
    const bots = /* @__PURE__ */ __name((f) => [0, 1, 2, 3].filter((i) => H.isBot(i) && (!f || f(i))), "bots");
    H.speaker = (f) => {
      const b = bots(f);
      return b.length ? pick(b) : -1;
    };
    H.say = (seat, key, force) => {
      const now = Date.now();
      if (!force && now - H.lastSay < 1800) return;
      H.lastSay = now;
      const arr = C[key];
      let i = rand(arr.length);
      if (arr.length > 1 && i === H.lastIdx[key]) i = (i + 1) % arr.length;
      H.lastIdx[key] = i;
      s.ev = [s.ev[0] + 1, seat, key, i];
    };
    H.rx = (seat, e) => {
      if (seat >= 0) s.ev = [s.ev[0] + 1, seat, "@", e];
    };
    H.humanRx = (seat, e) => {
      if (!REPLY[e] || Math.random() >= 0.45) return;
      const b = H.speaker((i) => i !== seat);
      if (b >= 0) H.later(() => H.rx(b, REPLY[e]), 900 + rand(600));
    };
    H.input = (seat, kind, val) => {
      const p = H.pending;
      if (!p || p.seat !== seat || p.kind !== kind) return false;
      if (kind === "trump") {
        if (!SUITS.includes(val)) return false;
        H.pending = null;
        p.res(val);
        return true;
      }
      const card = H.hands[seat].find((c) => c.id === val);
      if (!card || !Omi.isLegal(H.hands[seat], H.trick, card)) return false;
      H.pending = null;
      p.res(card);
      return true;
    };
    H.auto = () => {
      const p = H.pending;
      if (!p) return;
      H.input(p.seat, p.kind, p.kind === "trump" ? Bot.chooseTrump(H.hands[p.seat]) : Bot.play(H.hands[p.seat], H.trick, s.tp, p.seat).id);
    };
    H.waitFor = (seat, kind) => new Promise((res, rej) => {
      H.pending = { seat, kind, res, rej, t0: Date.now() };
    });
    H.abort = () => {
      H.gen++;
      if (H.pending) {
        const p = H.pending;
        H.pending = null;
        p.rej("cancel");
      }
      if (H.contRej) {
        const r = H.contRej;
        H.contRej = H.contRes = null;
        r("cancel");
      }
    };
    H.destroy = () => {
      H.abort();
      clearInterval(H.tickI);
    };
    H.cont = () => {
      if (H.contRes) H.contRes();
    };
    H.tickI = setInterval(() => {
      const p = H.pending;
      if (p) {
        const st = s.seats[p.seat];
        const off = st && st.h && !st.on && Date.now() - H.offAt[p.seat] > 8e3;
        if (S.timer && Date.now() - p.t0 > 30500 || off) H.auto();
      }
      if (s.ph === "lobby" && H.pubTbl) {
        const rem = Math.max(0, Math.ceil((H.lobbyEnd - Date.now()) / 1e3));
        if (rem === 0 || [1, 2, 3].every((i) => s.seats[i])) H.start();
        else if (rem !== s.as) {
          s.as = rem;
          H.pub();
        }
      }
    }, 400);
    H.start = () => {
      const used = new Set(s.seats.filter(Boolean).map((x) => x.a));
      const pool = Omi.shuffle(BOTS.map((b, i) => i).filter((i) => !used.has(BOTS[i].avatar)));
      for (let i = 1; i < 4; i++) if (!s.seats[i]) s.seats[i] = { b: pool.pop() };
      H.run();
    };
    H.deal = async (deck, start, n) => {
      let idx = start;
      for (let i = 0; i < 4; i++) {
        const seat = (s.cl + i) % 4;
        H.hands[seat].push(...deck.slice(idx, idx + n));
        idx += n;
        s.nc[seat] += n;
        H.pub();
        await H.wait(n * 55 + 170);
      }
      await H.wait(250);
    };
    H.trickTalk = (w, done) => {
      const ace = done.find((x) => x.card.r === "A" && x.seat !== w);
      if (ace && Math.random() < 0.55) {
        H.say(H.speaker((i) => i !== ace.seat), "aceLost");
        return;
      }
      if (!H.isBot(w)) {
        const pt = (w + 2) % 4;
        if (H.isBot(pt) && Math.random() < 0.5) H.say(pt, "trickWin");
        else if (Math.random() < 0.35) H.rx(H.speaker((i) => i % 2 !== w % 2), pick(["\u{1F62D}", "\u{1F926}", "\u{1F440}"]));
      } else if (Math.random() < 0.28) H.say(w, "trickWin");
      else if (Math.random() < 0.2) H.rx(w, "\u{1F60E}");
    };
    H.round = async () => {
      s.rn++;
      H.hands = [[], [], [], []];
      H.trick = [];
      s.nc = [0, 0, 0, 0];
      s.tk = [];
      s.tr = [0, 0];
      s.tp = null;
      s.cl = (s.dl + 1) % 4;
      s.tu = null;
      s.ph = "deal";
      s.rb = null;
      H.pub();
      const deck = Omi.shuffle(Omi.deck());
      await H.deal(deck, 0, 4);
      s.ph = "trump";
      s.tu = s.cl;
      s.tl = H.isBot(s.cl) ? 0 : S.timer ? 3e4 : 0;
      H.pub();
      let tp;
      if (H.isBot(s.cl)) {
        await H.wait(1300);
        tp = Bot.chooseTrump(H.hands[s.cl]);
      } else tp = await H.waitFor(s.cl, "trump");
      s.tp = tp;
      s.calls[s.cl]++;
      s.tu = null;
      s.ph = "deal";
      H.pub();
      await H.wait(1300);
      await H.deal(deck, 16, 4);
      const strong = bots((i) => {
        const h = H.hands[i];
        return h.filter((c) => c.s === tp).length * 2 + h.filter((c) => c.r === "A").length >= 7;
      });
      if (strong.length && Math.random() < 0.7) H.say(pick(strong), "goodHand");
      s.ph = "play";
      let leader = s.cl;
      for (let n8 = 0; n8 < 8; n8++) {
        H.trick = [];
        s.tk = [];
        for (let k = 0; k < 4; k++) {
          const seat = (leader + k) % 4, bot = H.isBot(seat);
          s.tu = seat;
          s.tl = bot ? 0 : S.timer ? 3e4 : 0;
          H.pub();
          let card;
          if (bot) {
            await H.wait(650 + rand(550));
            card = Bot.play(H.hands[seat], H.trick, tp, seat);
          } else card = await H.waitFor(seat, "play");
          if (!Omi.isLegal(H.hands[seat], H.trick, card)) card = Omi.legal(H.hands[seat], H.trick)[0];
          const prev = H.trick.length ? H.trick[Omi.winnerIdx(H.trick, tp)] : null;
          H.hands[seat] = H.hands[seat].filter((c) => c.id !== card.id);
          s.nc[seat]--;
          H.trick.push({ seat, card });
          s.tk.push([seat, card.id]);
          if (prev && prev.seat !== seat && prev.seat % 2 === seat % 2 && card.s === tp && H.trick[0].card.s !== tp && Omi.beats(card, prev.card, tp)) {
            const sp = H.isBot((seat + 2) % 4) ? (seat + 2) % 4 : H.speaker((i) => i !== seat);
            H.later(() => H.say(sp, "badMove", true), 450);
          }
          s.tu = null;
          H.pub();
          await H.wait(380);
        }
        await H.wait(900);
        const w = H.trick[Omi.winnerIdx(H.trick, tp)].seat;
        s.tr[w % 2]++;
        s.pt[w]++;
        H.trickTalk(w, H.trick);
        s.cx = [s.cx[0] + 1, w];
        s.tk = [];
        H.pub();
        await H.wait(900);
        leader = w;
      }
      const res = Omi.scoreRound(s.tr, s.cl % 2, { kapothi: s.kp });
      H.rbN++;
      const rb = { n: H.rbN, t: s.tr.slice() };
      if (res.tie) {
        s.cr += 1;
        Object.assign(rb, { tie: 1, cr: s.cr });
      } else {
        let p = res.points === Infinity ? Math.max(s.tg - s.sc[res.winnerTeam], 1) : res.points;
        const carry = s.cr;
        s.cr = 0;
        p += carry;
        s.sc[res.winnerTeam] += p;
        Object.assign(rb, { wt: res.winnerTeam, p, kap: res.kapothi ? 1 : 0, byC: res.byCaller ? 1 : 0, carry });
        H.say(H.speaker((i) => i % 2 === res.winnerTeam), res.kapothi ? "kapothi" : "roundWin", true);
        const lb = H.speaker((i) => i % 2 !== res.winnerTeam);
        if (lb >= 0) H.later(() => H.say(lb, "lose", true), 1600);
      }
      s.rb = rb;
      s.ph = "round";
      s.tu = null;
      H.pub();
      await new Promise((res2, rej) => {
        const to = setTimeout(() => {
          H.contRes = H.contRej = null;
          res2();
        }, 6500 * SPD());
        H.contRes = () => {
          clearTimeout(to);
          H.contRes = H.contRej = null;
          res2();
        };
        H.contRej = (e) => {
          clearTimeout(to);
          rej(e);
        };
      });
    };
    H.run = async () => {
      H.abort();
      Object.assign(s, { sc: [0, 0], cr: 0, dl: rand(4), rn: 0, pt: [0, 0, 0, 0], calls: [0, 0, 0, 0], end: null, rb: null, tk: [], tr: [0, 0], nc: [0, 0, 0, 0], tp: null, tu: null, cl: null, ph: "start", tg: S.target, kp: S.kapothi, as: 0, tl: 0 });
      H.hands = [[], [], [], []];
      H.trick = [];
      H.pub();
      H.later(() => H.say(H.speaker(), "start", true), 900);
      try {
        await H.wait(1900);
        while (true) {
          await H.round();
          if (s.sc[0] >= s.tg || s.sc[1] >= s.tg) {
            H.endN++;
            s.ph = "end";
            s.end = { n: H.endN, w: s.sc[0] > s.sc[1] ? 0 : 1 };
            s.tu = null;
            H.pub();
            return;
          }
          s.dl = (s.dl + 1) % 4;
        }
      } catch (e) {
        if (e !== "cancel") console.error(e);
      }
    };
    return H;
  }
  __name(makeHost, "makeHost");
  return makeHost(o);
}
__name(createHost, "createHost");
var AVATARS = ["uncle", "champ", "sleepy", "angry", "cool", "village", "cat", "elephant"];
var REACTS = Object.keys(REPLY);

// src/rooms.js
var ALPH = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
var Room = class {
  static {
    __name(this, "Room");
  }
  constructor(mgr, code, { pub, settings }) {
    this.mgr = mgr;
    this.code = code;
    this.pub = !!pub;
    this.ids = [null, null, null, null];
    this.sock = [null, null, null, null];
    this.spect = /* @__PURE__ */ new Set();
    this.hostId = null;
    this.created = Date.now();
    this.emptySince = 0;
    this.track = { maxDef: [0, 0], kap: [0, 0], rbN: 0, endN: 0 };
    this.lastRx = [0, 0, 0, 0];
    this.H = createHost(settings, { seats: [null, null, null, null], lobby: true, pubTbl: this.pub, onPub: /* @__PURE__ */ __name(() => this.broadcast(), "onPub") });
  }
  seatOf(sk) {
    return this.sock.indexOf(sk);
  }
  isHost(sk) {
    const s = this.seatOf(sk);
    return s >= 0 && this.ids[s] === this.hostId;
  }
  join(sk) {
    const id = sk.data.id, s = this.H.s;
    let seat = this.ids.indexOf(id);
    if (seat < 0 && s.ph === "lobby") {
      const free = [0, 2, 1, 3].find((i) => !s.seats[i]);
      if (free !== void 0) {
        seat = free;
        this.ids[seat] = id;
        s.seats[seat] = { h: 1, on: 1 };
        if (!this.hostId) this.hostId = id;
      }
    }
    if (seat >= 0) {
      const old = this.sock[seat];
      if (old && old !== sk) {
        old.leave(this.code);
        old.data.room = null;
        old.emit("closed", { reason: "elsewhere" });
      }
      this.sock[seat] = sk;
      const st = s.seats[seat];
      st.on = 1;
      st.n = sk.data.name;
      st.a = sk.data.avatar;
    } else this.spect.add(sk);
    sk.join(this.code);
    sk.data.room = this;
    this.emptySince = 0;
    this.H.pub();
  }
  leave(sk, explicit) {
    this.spect.delete(sk);
    const seat = this.seatOf(sk);
    if (seat < 0) {
      if (!this.connected()) this.emptySince = Date.now();
      return;
    }
    this.sock[seat] = null;
    const s = this.H.s;
    if (s.ph === "lobby") {
      s.seats[seat] = null;
      const id = this.ids[seat];
      this.ids[seat] = null;
      if (seat === 0) {
        const other = [2, 1, 3].find((i) => this.sock[i]);
        if (other !== void 0) {
          s.seats[0] = s.seats[other];
          s.seats[other] = null;
          this.ids[0] = this.ids[other];
          this.ids[other] = null;
          this.sock[0] = this.sock[other];
          this.sock[other] = null;
        }
      }
      if (id === this.hostId) this.hostId = this.ids.find((x, i) => x && this.sock[i]) || null;
    } else {
      s.seats[seat].on = 0;
      this.H.offAt[seat] = Date.now();
      if (this.ids[seat] === this.hostId) {
        const i = this.ids.findIndex((x, j) => x && this.sock[j]);
        if (i >= 0) this.hostId = this.ids[i];
      }
    }
    if (!this.connected()) this.emptySince = Date.now();
    this.H.pub();
  }
  sit(sk, to) {
    const s = this.H.s, seat = this.seatOf(sk);
    if (s.ph !== "lobby" || seat < 1 || ![1, 2, 3].includes(to) || s.seats[to]) return;
    s.seats[to] = s.seats[seat];
    s.seats[seat] = null;
    this.ids[to] = this.ids[seat];
    this.ids[seat] = null;
    this.sock[to] = sk;
    this.sock[seat] = null;
    this.H.pub();
  }
  setProfile(sk) {
    const seat = this.seatOf(sk);
    if (seat < 0) return;
    const st = this.H.s.seats[seat];
    if (st && st.h) {
      st.n = sk.data.name;
      st.a = sk.data.avatar;
      this.H.pub();
    }
  }
  connected() {
    return this.sock.some(Boolean) || this.spect.size > 0;
  }
  broadcast() {
    const H = this.H, g = H.view();
    if (g.rb && g.rb.n !== this.track.rbN) {
      this.track.rbN = g.rb.n;
      if (g.rb.kap && !g.rb.tie) this.track.kap[g.rb.wt]++;
    }
    for (const t of [0, 1]) this.track.maxDef[t] = Math.max(this.track.maxDef[t], g.sc[1 - t] - g.sc[t]);
    if (g.ph === "end" && g.end && g.end.n !== this.track.endN) {
      this.track.endN = g.end.n;
      this.recordEnd(g);
      this.track.maxDef = [0, 0];
      this.track.kap = [0, 0];
    }
    for (let i = 0; i < 4; i++) {
      const sk = this.sock[i];
      if (sk) sk.emit("state", { g, hand: H.hands[i].map((c) => c.id), you: i, code: this.code, host: this.ids[i] === this.hostId, pub: this.pub });
    }
    for (const sk of this.spect) sk.emit("state", { g, hand: [], you: -1, code: this.code, host: false, pub: this.pub });
  }
  recordEnd(g) {
    const humans = this.ids.filter(Boolean).length;
    if (!this.mgr.cfg.countBotGames && humans < 2) return;
    for (let i = 0; i < 4; i++) {
      const id = this.ids[i];
      if (!id) continue;
      const team = i % 2, win = g.end.w === team, st = g.seats[i] || {};
      this.mgr.store.record(id, { name: st.n, avatar: st.a, win, kap: this.track.kap[team], comeback: win && this.track.maxDef[team] >= 5, whitewash: !win && g.sc[team] === 0 }).catch((e) => console.error("record failed", e));
    }
  }
  destroy() {
    this.H.destroy();
    for (const sk of [...this.sock, ...this.spect]) if (sk) {
      sk.leave(this.code);
      sk.data.room = null;
      sk.emit("closed", {});
    }
  }
  summary() {
    const s = this.H.s;
    return {
      code: this.code,
      ph: s.ph,
      pub: this.pub,
      score: s.sc,
      round: s.rn,
      created: this.created,
      players: s.seats.map((x, i) => x ? x.b !== void 0 ? { bot: true } : { name: x.n || "Player", online: !!this.sock[i], id: this.ids[i] } : null),
      watchers: this.spect.size
    };
  }
};
var Rooms = class {
  static {
    __name(this, "Rooms");
  }
  constructor(store, cfg) {
    this.store = store;
    this.cfg = cfg || { countBotGames: true, maxRooms: 3e3 };
    this.map = /* @__PURE__ */ new Map();
    setInterval(() => this.gc(), 15e3);
  }
  newCode() {
    let c;
    do {
      c = Array.from({ length: 5 }, () => ALPH[rand(ALPH.length)]).join("");
    } while (this.map.has(c));
    return c;
  }
  create(opts) {
    if (this.map.size >= (this.cfg.maxRooms || 3e3)) throw new Error("full");
    const r = new Room(this, this.newCode(), opts);
    this.map.set(r.code, r);
    return r;
  }
  get(code) {
    return this.map.get(code);
  }
  quick(settings) {
    for (const r of this.map.values()) if (r.pub && r.H.s.ph === "lobby" && r.connected() && [1, 2, 3].some((i) => !r.H.s.seats[i])) return r;
    return this.create({ pub: true, settings });
  }
  close(code) {
    const r = this.map.get(code);
    if (r) {
      r.destroy();
      this.map.delete(code);
    }
  }
  gc() {
    const now = Date.now();
    for (const [c, r] of this.map) {
      const since = r.emptySince || r.created;
      if (!r.connected() && now - since > (r.H.s.ph === "lobby" ? 3e4 : 12e4)) this.close(c);
    }
  }
};

// src/store.js
function periodKeys() {
  const d = new Date(Date.now() + 5.5 * 36e5);
  const y = d.getUTCFullYear(), mo = y + "-" + String(d.getUTCMonth() + 1).padStart(2, "0");
  const t0 = new Date(Date.UTC(y, d.getUTCMonth(), d.getUTCDate()));
  const day = (t0.getUTCDay() + 6) % 7;
  t0.setUTCDate(t0.getUTCDate() - day + 3);
  const fy = t0.getUTCFullYear(), w = 1 + Math.round(((t0 - Date.UTC(fy, 0, 4)) / 864e5 - 3 + (new Date(Date.UTC(fy, 0, 4)).getUTCDay() + 6) % 7) / 7);
  return { wk: fy + "-W" + String(w).padStart(2, "0"), mo };
}
__name(periodKeys, "periodKeys");
var blank = /* @__PURE__ */ __name((id) => ({ id, name: "", avatar: "cool", played: 0, wins: 0, losses: 0, streak: 0, best: 0, kapothis: 0, comebacks: 0, whitewash: 0, wk: null, wk_wins: 0, wk_played: 0, mo: null, mo_wins: 0, mo_played: 0 }), "blank");
function apply(r, info) {
  const k = periodKeys();
  if (r.wk !== k.wk) {
    r.wk = k.wk;
    r.wk_wins = 0;
    r.wk_played = 0;
  }
  if (r.mo !== k.mo) {
    r.mo = k.mo;
    r.mo_wins = 0;
    r.mo_played = 0;
  }
  if (info.name) r.name = info.name;
  if (info.avatar) r.avatar = info.avatar;
  r.played++;
  r.wk_played++;
  r.mo_played++;
  if (info.win) {
    r.wins++;
    r.wk_wins++;
    r.mo_wins++;
    r.streak++;
    r.best = Math.max(r.best, r.streak);
    if (info.comeback) r.comebacks++;
  } else {
    r.losses++;
    r.streak = 0;
    if (info.whitewash) r.whitewash++;
  }
  r.kapothis += info.kap | 0;
  r.updated_at = (/* @__PURE__ */ new Date()).toISOString();
  return r;
}
__name(apply, "apply");
function badges(r) {
  const e = [];
  if (r.wins >= 10) e.push("\u{1F451}");
  if (r.losses >= 5) e.push("\u{1F602}");
  if (r.comebacks >= 1) e.push("\u{1F525}");
  if (r.whitewash >= 1) e.push("\u{1F480}");
  if (r.kapothis >= 1) e.push("\u{1F3AF}");
  if (r.played >= 50) e.push("\u{1F0CF}");
  return e.join("");
}
__name(badges, "badges");
function rows(list, period, meId) {
  const k = periodKeys();
  const out = list.map((r) => {
    const w = period === "week" ? r.wk === k.wk ? r.wk_wins : 0 : period === "month" ? r.mo === k.mo ? r.mo_wins : 0 : r.wins;
    const p = period === "week" ? r.wk === k.wk ? r.wk_played : 0 : period === "month" ? r.mo === k.mo ? r.mo_played : 0 : r.played;
    return { name: r.name || "Player", avatar: r.avatar, w, p, pct: p ? Math.round(w / p * 100) : 0, badges: badges(r), me: r.id === meId };
  }).filter((x) => x.p > 0);
  out.sort((a, b) => b.w - a.w || b.pct - a.pct || a.p - b.p);
  return out.slice(0, 50);
}
__name(rows, "rows");
var COLS = ["id", "name", "avatar", "played", "wins", "losses", "streak", "best", "kapothis", "comebacks", "whitewash", "wk", "wk_wins", "wk_played", "mo", "mo_wins", "mo_played", "updated_at"];
var SqlStore = class {
  static {
    __name(this, "SqlStore");
  }
  constructor(sql) {
    this.sql = sql;
    this.kind = "durable-object-sqlite";
    sql.exec(`CREATE TABLE IF NOT EXISTS players(id TEXT PRIMARY KEY,name TEXT NOT NULL DEFAULT '',avatar TEXT NOT NULL DEFAULT 'cool',played INTEGER NOT NULL DEFAULT 0,wins INTEGER NOT NULL DEFAULT 0,losses INTEGER NOT NULL DEFAULT 0,streak INTEGER NOT NULL DEFAULT 0,best INTEGER NOT NULL DEFAULT 0,kapothis INTEGER NOT NULL DEFAULT 0,comebacks INTEGER NOT NULL DEFAULT 0,whitewash INTEGER NOT NULL DEFAULT 0,wk TEXT,wk_wins INTEGER NOT NULL DEFAULT 0,wk_played INTEGER NOT NULL DEFAULT 0,mo TEXT,mo_wins INTEGER NOT NULL DEFAULT 0,mo_played INTEGER NOT NULL DEFAULT 0,updated_at TEXT)`);
    sql.exec(`CREATE INDEX IF NOT EXISTS players_wins ON players(wins DESC)`);
    sql.exec(`CREATE INDEX IF NOT EXISTS players_wk ON players(wk, wk_wins DESC)`);
    sql.exec(`CREATE INDEX IF NOT EXISTS players_mo ON players(mo, mo_wins DESC)`);
    sql.exec(`CREATE TABLE IF NOT EXISTS banned(id TEXT PRIMARY KEY,reason TEXT NOT NULL DEFAULT '',created_at TEXT)`);
    sql.exec(`CREATE TABLE IF NOT EXISTS reports(id INTEGER PRIMARY KEY AUTOINCREMENT,reporter TEXT,target TEXT,target_name TEXT,room TEXT,reason TEXT,created_at TEXT)`);
  }
  all(q, ...p) {
    return this.sql.exec(q, ...p).toArray();
  }
  one(q, ...p) {
    return this.all(q, ...p)[0] || null;
  }
  async record(id, info) {
    const r = apply(this.one("SELECT * FROM players WHERE id=?", id) || blank(id), info);
    this.sql.exec(`INSERT OR REPLACE INTO players(${COLS.join(",")}) VALUES(${COLS.map(() => "?").join(",")})`, ...COLS.map((c) => r[c] === void 0 ? null : r[c]));
  }
  async leaderboard(period, meId) {
    const k = periodKeys();
    let list;
    if (period === "week") list = this.all("SELECT * FROM players WHERE wk=? AND wk_played>0 ORDER BY wk_wins DESC LIMIT 200", k.wk);
    else if (period === "month") list = this.all("SELECT * FROM players WHERE mo=? AND mo_played>0 ORDER BY mo_wins DESC LIMIT 200", k.mo);
    else list = this.all("SELECT * FROM players WHERE played>0 ORDER BY wins DESC LIMIT 200");
    return rows(list, period, meId);
  }
  async setProfile(id, name, avatar) {
    if (name) this.sql.exec("UPDATE players SET name=?,avatar=? WHERE id=?", name, avatar, id);
    else this.sql.exec("UPDATE players SET avatar=? WHERE id=?", avatar, id);
  }
  async mergeGuest(from, to) {
    if (this.one("SELECT id FROM players WHERE id=?", to) || !this.one("SELECT id FROM players WHERE id=?", from)) return;
    this.sql.exec("UPDATE players SET id=? WHERE id=?", to, from);
  }
  async isBanned(id) {
    return !!this.one("SELECT id FROM banned WHERE id=?", id);
  }
  async ban(id, reason) {
    this.sql.exec("INSERT OR REPLACE INTO banned(id,reason,created_at) VALUES(?,?,?)", id, reason || "", (/* @__PURE__ */ new Date()).toISOString());
  }
  async unban(id) {
    this.sql.exec("DELETE FROM banned WHERE id=?", id);
  }
  async rename(id, name) {
    this.sql.exec("UPDATE players SET name=? WHERE id=?", name, id);
  }
  async report(x) {
    this.sql.exec("INSERT INTO reports(reporter,target,target_name,room,reason,created_at) VALUES(?,?,?,?,?,?)", x.reporter, x.target, x.target_name || "", x.room || "", x.reason || "", (/* @__PURE__ */ new Date()).toISOString());
    this.sql.exec("DELETE FROM reports WHERE id NOT IN (SELECT id FROM reports ORDER BY id DESC LIMIT 1000)");
  }
  async adminData(q) {
    const players = q ? this.all("SELECT * FROM players WHERE lower(name) LIKE ? ORDER BY played DESC LIMIT 100", "%" + q.toLowerCase().replace(/[%_]/g, "") + "%") : this.all("SELECT * FROM players ORDER BY played DESC LIMIT 100");
    return { total: this.one("SELECT COUNT(*) AS n FROM players").n, players, banned: this.all("SELECT * FROM banned ORDER BY created_at DESC LIMIT 200"), reports: this.all("SELECT * FROM reports ORDER BY id DESC LIMIT 100") };
  }
};

// src/assets.js
var FILES = { "/admin.html": { "t": "text/html; charset=utf-8", "s": '<!DOCTYPE html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">\n<title>OMI LANKA admin</title><link rel="stylesheet" href="/css/page.css">\n<style>main{max-width:1100px}table{font-size:14px}button{font:inherit;cursor:pointer;border:0;border-radius:10px;padding:4px 10px;background:#0b1a3a;color:#fff}button.red{background:#e8434a}input{font:inherit;padding:8px 12px;border-radius:10px;border:1px solid #9aa}.row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.k{display:inline-block;background:rgba(127,127,127,.12);border-radius:12px;padding:6px 14px;margin:4px;font-weight:700}code{font-size:12px}</style>\n</head><body>\n<header class="top"><a class="logo" href="/">\u{1F0CF} OMI LANKA</a><h1>Admin</h1></header>\n<main>\n<div class="row" id="login"><input id="tok" type="password" placeholder="Admin token" autocomplete="current-password"><button id="go">Open dashboard</button></div>\n<div id="dash" hidden>\n  <div id="kpi"></div>\n  <h2>Active games</h2><div id="rooms"></div>\n  <h2>Reported players</h2><div id="reports"></div>\n  <h2>Players</h2><div class="row"><input id="q" placeholder="Search nickname"><button id="search">Search</button></div><div id="players"></div>\n  <h2>Banned</h2><div id="banned"></div>\n</div>\n</main>\n<script src="/js/admin.js"><\/script>\n</body></html>\n' }, "/sw.js": { "t": "text/javascript; charset=utf-8", "s": "// OMI LANKA service worker: app shell offline (bots mode works without internet).\nconst V='omi-v1';\nconst SHELL=['/','/css/app.css?v=1','/js/app.js?v=1','/manifest.webmanifest','/icons/icon-192.png'];\nself.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});\nself.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});\nself.addEventListener('fetch',e=>{\n  const u=new URL(e.request.url);\n  if(e.request.method!=='GET'||u.origin!==location.origin||u.pathname.startsWith('/ws')||u.pathname.startsWith('/api'))return;\n  if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).catch(()=>caches.match('/')));return}\n  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{if(res.ok&&/^\\/(css|js|icons)\\//.test(u.pathname)){const c=res.clone();caches.open(V).then(x=>x.put(e.request,c))}return res})));\n});\n" }, "/og-image.png": { "t": "image/png", "b": "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" }, "/index.html": { "t": "text/html; charset=utf-8", "s": '<!DOCTYPE html>\n<html lang="si">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<title>OMI LANKA \u2013 \u0D95\u0DB8\u0DD2 \u0D9C\u0DDA\u0DB8\u0DCA Online | Play Sri Lankan Omi with Friends</title>\n<meta name="description" content="\u0D95\u0DB8\u0DD2 \u0D9C\u0DC4\u0DB8\u0DD4! \u0DBA\u0DCF\u0DC5\u0DD4\u0DC0\u0DDD \u0D91\u0D9A\u0DCA\u0D9A online \u0D95\u0DB8\u0DD2 \u0D9C\u0DC4\u0DB1\u0DCA\u0DB1 \u2014 \u0DB1\u0DDC\u0DB8\u0DD2\u0DBD\u0DDA, sign up \u0DB1\u0DD0\u0DAD\u0DD4\u0DC0. Play the Sri Lankan Omi card game online with friends or bots: real Omi rules, Sinhala jokes, leaderboards.">\n<link rel="canonical" href="%%SITE_URL%%/">\n<link rel="alternate" hreflang="si" href="%%SITE_URL%%/">\n<link rel="alternate" hreflang="x-default" href="%%SITE_URL%%/">\n<meta name="theme-color" content="#0b1a3a">\n<link rel="manifest" href="/manifest.webmanifest">\n<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32.png">\n<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">\n<meta property="og:type" content="website">\n<meta property="og:site_name" content="OMI LANKA">\n<meta property="og:title" content="OMI LANKA \u2013 \u0DBA\u0DCF\u0DC5\u0DD4\u0DC0\u0DDD \u0D91\u0D9A\u0DCA\u0D9A Online \u0D95\u0DB8\u0DD2 \u0D9C\u0DC4\u0DB8\u0DD4! \u{1F0CF}\u{1F1F1}\u{1F1F0}">\n<meta property="og:description" content="Free online Sri Lankan Omi card game. Private rooms, random players, funny Sinhala comments and leaderboards.">\n<meta property="og:url" content="%%SITE_URL%%/">\n<meta property="og:image" content="%%SITE_URL%%/og-image.png">\n<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">\n<meta property="og:locale" content="si_LK"><meta property="og:locale:alternate" content="en_US">\n<meta name="twitter:card" content="summary_large_image">\n<script type="application/ld+json">{"@context":"https://schema.org","@type":["VideoGame","WebApplication"],"name":"OMI LANKA","alternateName":["\u0D95\u0DB8\u0DD2 \u0DBD\u0D82\u0D9A\u0DCF","Omi Game Online"],"url":"%%SITE_URL%%/","description":"Play the traditional Sri Lankan Omi card game online with friends or bots, in Sinhala, Singlish or English.","genre":["Card game","Trick-taking game"],"gamePlatform":"Web browser","applicationCategory":"GameApplication","operatingSystem":"Any","inLanguage":["si","en"],"playMode":["MultiPlayer","SinglePlayer"],"numberOfPlayers":{"@type":"QuantitativeValue","value":4},"offers":{"@type":"Offer","price":"0","priceCurrency":"LKR"},"image":"%%SITE_URL%%/og-image.png"}<\/script>\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Noto+Sans+Sinhala:wght@400;600;800&display=swap" rel="stylesheet">\n<link rel="stylesheet" href="/css/app.css?v=1">\n</head>\n<body>\n<noscript><div style="padding:24px;font-family:sans-serif;background:#fff;color:#0b1a3a"><h1>OMI LANKA \u2013 Online \u0D95\u0DB8\u0DD2</h1><p>\u0D95\u0DB8\u0DD2 \u0D9C\u0DC4\u0DB1\u0DCA\u0DB1 JavaScript \u0D95\u0DB1\u0DDA. Please enable JavaScript to play Omi online.</p><p><a href="/how-to-play/">\u0D95\u0DB8\u0DD2 \u0D9C\u0DC4\u0DB1 \u0DC4\u0DD0\u0DA7\u0DD2</a> \xB7 <a href="/en/how-to-play/">How to play Omi</a></p></div></noscript>\n\n<div id="app">\n  <section id="home" class="screen active">\n    <div class="bgcards" id="bgcards" aria-hidden="true"></div>\n    <header class="topbar">\n      <button class="chip-btn" id="profileChip"><span class="avs" id="chipAv"></span><span id="chipName"></span></button>\n      <div class="langsw" id="langsw"><button data-lang="si">\u0DC3\u0DD2\u0D82</button><button data-lang="sl">Singlish</button><button data-lang="en">EN</button></div>\n    </header>\n    <div class="hero">\n      <div class="fan" id="fan" aria-hidden="true"></div>\n      <h1 class="logo"><span class="omi">OMI</span><span class="lanka">LANKA \u{1F1F1}\u{1F1F0}</span></h1>\n      <div class="sublogo">\u0D95\u0DB8\u0DD2 \u0DBD\u0D82\u0D9A\u0DCF</div>\n      <div class="welcome" id="welcome"></div>\n    </div>\n    <div class="menu">\n      <button class="btn big yellow" id="btnPlay"><span data-t="play"></span><small data-t="playSub"></small></button>\n      <button class="btn emerald" id="btnRandom">\u{1F3B2} <span data-t="random"></span></button>\n      <div class="row2">\n        <button class="btn coral" id="btnPrivate">\u{1F512} <span data-t="private"></span></button>\n        <button class="btn navy" id="btnJoin">\u{1F511} <span data-t="join"></span></button>\n      </div>\n      <div class="row3">\n        <button class="btn ghost" id="btnBoard"><b>\u{1F3C6}</b><span data-t="leaderboard"></span></button>\n        <button class="btn ghost" id="btnSettings"><b>\u2699\uFE0F</b><span data-t="settings"></span></button>\n        <button class="btn ghost" id="btnRules"><b>\u{1F4DC}</b><span data-t="rules"></span></button>\n      </div>\n    </div>\n    <footer class="foot"><nav><a href="/how-to-play/">\u{1F4DC} \u0D95\u0DB8\u0DD2 \u0D9C\u0DC4\u0DB1 \u0DC4\u0DD0\u0DA7\u0DD2</a><a href="/en/how-to-play/" hreflang="en">How to play Omi</a></nav><div>Serious gameplay. Crazy Sri Lankan fun. \u{1F1F1}\u{1F1F0}\u{1F602}</div></footer>\n  </section>\n\n  <section id="lobby" class="screen">\n    <div class="lobby-card">\n      <div class="lb-top"><button class="ib" id="lbLeave" aria-label="Leave">\u2190</button><div class="code"><small data-t="roomCode"></small><b id="lbCode">\xB7\xB7\xB7\xB7\xB7</b></div><button class="ib" id="lbCopy" aria-label="Copy code">\u{1F4CB}</button></div>\n      <div class="lb-kind" id="lbKind"></div>\n      <p class="lb-note" data-t="lobbyNote"></p>\n      <div class="lb-table"><button class="lb-seat" data-s="2"></button><button class="lb-seat" data-s="3"></button><div class="lb-felt">\u0D95\u0DB8\u0DD2</div><button class="lb-seat" data-s="1"></button><button class="lb-seat" data-s="0"></button></div>\n      <div id="lbStatus"></div>\n      <button class="btn big yellow" id="lbStart"></button>\n    </div>\n  </section>\n  <section id="game" class="screen">\n    <div class="hud">\n      <button class="ib" id="hudHome" aria-label="Home">\u{1F3E0}</button>\n      <div class="scores">\n        <div class="sp teamA"><b data-t="us"></b><span id="scA">0</span></div>\n        <div class="target"><span>/<span id="tgt">10</span></span><em id="carry" hidden></em></div>\n        <div class="sp teamB"><b data-t="them"></b><span id="scB">0</span></div>\n      </div>\n      <div class="trumpbox" id="trumpBox"><small data-t="trump"></small><span id="trumpSym">?</span></div>\n      <div class="trickbox"><small data-t="tricks"></small><span><b id="trA">0</b> \u2013 <b id="trB">0</b></span></div>\n      <button class="ib" id="hudSettings" aria-label="Settings">\u2699\uFE0F</button>\n    </div>\n    <div class="tablewrap" id="table">\n      <div class="felt"><div class="feltlogo">\u0D95\u0DB8\u0DD2 \u0DBD\u0D82\u0D9A\u0DCF</div></div>\n      <div class="seat" id="seat2"></div>\n      <div class="seat" id="seat1"></div>\n      <div class="seat" id="seat3"></div>\n      <div class="seat" id="seat0"></div>\n      <div id="trick"><div class="slot" id="slot0"></div><div class="slot" id="slot1"></div><div class="slot" id="slot2"></div><div class="slot" id="slot3"></div></div>\n      <div id="status"><span id="statusText"></span><i id="timerBar"></i></div>\n      <div id="hand"></div>\n      <button id="reactBtn" aria-label="Reactions">\u{1F602}</button>\n      <div id="reactPanel"></div>\n      <div id="trumpPick" class="centerpanel"></div>\n      <div id="roundBanner" class="centerpanel"></div>\n      <div id="splash"></div>\n      <div id="fx"></div>\n    </div>\n  </section>\n</div>\n\n<div class="modalbg" id="modalbg"><div class="modal" id="modal"></div></div>\n<div id="results"></div>\n<canvas id="confetti"></canvas>\n<div id="toast"></div>\n\n<script src="/js/ws.js?v=1"><\/script>\n<script src="/js/app.js?v=1" defer><\/script>\n</body>\n</html>\n' }, "/manifest.webmanifest": { "t": "application/manifest+json", "s": '{\n  "name": "OMI LANKA \u2013 \u0D95\u0DB8\u0DD2 \u0D9C\u0DDA\u0DB8\u0DCA",\n  "short_name": "OMI LANKA",\n  "description": "Play the Sri Lankan Omi card game online with friends.",\n  "start_url": "/",\n  "scope": "/",\n  "display": "standalone",\n  "orientation": "any",\n  "background_color": "#0b1a3a",\n  "theme_color": "#0b1a3a",\n  "lang": "si",\n  "categories": ["games"],\n  "icons": [\n    {"src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png"},\n    {"src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png"},\n    {"src": "/icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}\n  ]\n}\n' }, "/en/how-to-play/index.html": { "t": "text/html; charset=utf-8", "s": `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>How to Play Omi \u2013 Rules & Scoring of the Sri Lankan Card Game | OMI LANKA</title>
<meta name="description" content="Learn the Sri Lankan Omi card game: the 32-card deck, choosing trump, following suit, winning tricks, scoring, kapothi and strategy tips. Then play Omi online free with friends.">
<link rel="canonical" href="%%SITE_URL%%/en/how-to-play/">
<link rel="alternate" hreflang="en" href="%%SITE_URL%%/en/how-to-play/">
<link rel="alternate" hreflang="si" href="%%SITE_URL%%/how-to-play/">
<link rel="alternate" hreflang="x-default" href="%%SITE_URL%%/en/how-to-play/">
<meta property="og:title" content="How to Play Omi \u2013 Sri Lankan Card Game Rules"><meta property="og:image" content="%%SITE_URL%%/og-image.png"><meta property="og:url" content="%%SITE_URL%%/en/how-to-play/"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="/icons/favicon-32.png"><meta name="theme-color" content="#0b1a3a">
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;800&family=Noto+Sans+Sinhala:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/page.css">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","inLanguage":"en","mainEntity":[
{"@type":"Question","name":"How many cards are used in Omi?","acceptedAnswer":{"@type":"Answer","text":"32 cards: remove the 2s to 6s from a standard 52-card deck, leaving 7 to Ace in each suit."}},
{"@type":"Question","name":"Who chooses trump in Omi?","acceptedAnswer":{"@type":"Answer","text":"The player to the dealer's right, after looking at their first four cards."}},
{"@type":"Question","name":"How is Omi scored?","acceptedAnswer":{"@type":"Answer","text":"The team taking 5 or more of the 8 tricks wins the round: 1 point if they called trump, 2 points if the other team called it. The first team to 10 points wins."}},
{"@type":"Question","name":"Can I play Omi online for free?","acceptedAnswer":{"@type":"Answer","text":"Yes. OMI LANKA is free and you can play as a guest without signing up, with friends in a private room, with random players, or against bots."}}]}<\/script>
</head>
<body>
<header class="top"><a class="logo" href="/">\u{1F0CF} OMI LANKA</a><nav><a href="/">Play now</a> \xB7 <a href="/how-to-play/" hreflang="si">\u0DC3\u0DD2\u0D82\u0DC4\u0DBD</a></nav><h1>How to play Omi</h1></header>
<main>
<p class="lead">Omi is Sri Lanka\u2019s favourite trick-taking card game, played at home, in boarding houses and at the office. Four players in two teams pick a trump suit and battle to win the most tricks. Here are the rules, the scoring and a few tips.</p>
<h2>The deck and the players</h2>
<p>Omi uses <b>32 cards</b>: take a standard deck and remove the 2s to 6s, leaving <b>7, 8, 9, 10, J, Q, K, A</b> in spades, hearts, diamonds and clubs.</p>
<table><tr><th>Highest</th><td>A \u2192 K \u2192 Q \u2192 J \u2192 10 \u2192 9 \u2192 8 \u2192 7</td><th>Lowest</th></tr></table>
<p>Four players form two teams. Partners sit opposite each other.</p>
<h2>Dealing and choosing trump</h2>
<p>Play moves to the right (anticlockwise). The player to the <b>dealer\u2019s right</b> receives four cards first, looks at only those four and names the <b>trump</b> suit. Everyone then receives four more cards, so each player holds eight.</p>
<h2>Playing a round</h2>
<ul>
<li>The trump caller leads the first trick.</li>
<li>Everyone must <b>follow the suit that was led</b> if they can. Only if you have none of that suit may you play any card, including a trump to cut.</li>
<li>The highest trump wins the trick; if no trump was played, the highest card of the led suit wins.</li>
<li>The winner of each trick leads the next one. Eight tricks make a round.</li>
</ul>
<h2>Scoring</h2>
<table>
<tr><th>Result</th><th>Points</th></tr>
<tr><td>Trump-calling team takes 5+ tricks</td><td>1</td></tr>
<tr><td>Other team takes 5+ tricks</td><td>2</td></tr>
<tr><td>All 8 tricks (kapothi)</td><td>Depends on house rules (OMI LANKA default: 3)</td></tr>
<tr><td>4\u20134 tie</td><td>0, and the next round\u2019s winner gets +1</td></tr>
</table>
<p>The first team to <b>10 points</b> wins the game. The deal passes to the right after every round.</p>
<h2>House rules</h2>
<p>Omi is played slightly differently from village to village. In OMI LANKA you can change the kapothi value and the winning score in <b>Settings</b> to match the way your group plays.</p>
<h2>Tips to win \u{1F4A1}</h2>
<ul>
<li>Before naming trump, pick the suit where you hold the most cards and the high ones (A, K).</li>
<li>If your partner is already winning the trick, play a low card instead of wasting a high one.</li>
<li>Save trumps for the right moment, such as cutting an opponent\u2019s Ace.</li>
<li>Keep track of which suits each player has run out of.</li>
</ul>
<h2>Frequently asked questions</h2>
<details><summary>How many cards are used in Omi?</summary><p>32: remove the 2s to 6s from a standard deck.</p></details>
<details><summary>Who chooses trump?</summary><p>The player to the dealer\u2019s right, after seeing their first four cards.</p></details>
<details><summary>Is online Omi free?</summary><p>Yes. OMI LANKA is completely free, and you can play as a guest without signing up.</p></details>
<details><summary>How do I play with friends?</summary><p>Create a private room and send the invite link on WhatsApp or Messenger. Bots fill any empty seats.</p></details>
<a class="cta" href="/">\u{1F0CF} Play Omi now</a>
</main>
<footer>\xA9 OMI LANKA \xB7 <a href="/how-to-play/" hreflang="si">\u0D95\u0DB8\u0DD2 \u0D9C\u0DC4\u0DB1 \u0DC4\u0DD0\u0DA7\u0DD2 (\u0DC3\u0DD2\u0D82\u0DC4\u0DBD)</a></footer>
</body>
</html>
` }, "/how-to-play/index.html": { "t": "text/html; charset=utf-8", "s": '<!DOCTYPE html>\n<html lang="si">\n<head>\n<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">\n<title>\u0D95\u0DB8\u0DD2 \u0D9C\u0DC4\u0DB1 \u0DC4\u0DD0\u0DA7\u0DD2 \u2013 Omi \u0DB1\u0DD3\u0DAD\u0DD2 \u0DC3\u0DC4 \u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 \u0D9A\u0DCA\u200D\u0DBB\u0DB8\u0DBA | OMI LANKA</title>\n<meta name="description" content="\u0D95\u0DB8\u0DD2 \u0D9A\u0DCF\u0DA9\u0DCA \u0D9C\u0DDA\u0DB8\u0DCA \u0D91\u0D9A \u0D9C\u0DC4\u0DB1 \u0DC4\u0DD0\u0DA7\u0DD2 \u0DC3\u0DBB\u0DBD\u0DC0: \u0D9A\u0DCF\u0DA9\u0DCA 32, \u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA \u0DAD\u0DDA\u0DBB\u0DD3\u0DB8, \u0D85\u0DAD\u0DCA \u0D9C\u0DB1\u0DCA\u0DB1 \u0DC4\u0DD0\u0DA7\u0DD2, \u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 \u0D9A\u0DCA\u200D\u0DBB\u0DB8\u0DBA, \u0D9A\u0DB4\u0DDD\u0DAD\u0DD2 \u0DC3\u0DC4 \u0DAF\u0DD2\u0DB1\u0DB1\u0DCA\u0DB1 tips. \u0D8A\u0DA7 \u0DB4\u0DC3\u0DCA\u0DC3\u0DDA OMI LANKA \u0D91\u0D9A\u0DDA online \u0D9C\u0DC4\u0DB1\u0DCA\u0DB1!">\n<link rel="canonical" href="%%SITE_URL%%/how-to-play/">\n<link rel="alternate" hreflang="si" href="%%SITE_URL%%/how-to-play/">\n<link rel="alternate" hreflang="en" href="%%SITE_URL%%/en/how-to-play/">\n<link rel="alternate" hreflang="x-default" href="%%SITE_URL%%/en/how-to-play/">\n<meta property="og:title" content="\u0D95\u0DB8\u0DD2 \u0D9C\u0DC4\u0DB1 \u0DC4\u0DD0\u0DA7\u0DD2 \u2013 Omi \u0DB1\u0DD3\u0DAD\u0DD2 | OMI LANKA"><meta property="og:image" content="%%SITE_URL%%/og-image.png"><meta property="og:url" content="%%SITE_URL%%/how-to-play/"><meta name="twitter:card" content="summary_large_image">\n<link rel="icon" type="image/png" href="/icons/favicon-32.png"><meta name="theme-color" content="#0b1a3a">\n<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;800&family=Noto+Sans+Sinhala:wght@400;700&display=swap" rel="stylesheet">\n<link rel="stylesheet" href="/css/page.css">\n<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","inLanguage":"si","mainEntity":[\n{"@type":"Question","name":"\u0D95\u0DB8\u0DD2 \u0DC0\u0DBD\u0DA7 \u0D9A\u0DCF\u0DA9\u0DCA \u0D9A\u0DD3\u0DBA\u0D9A\u0DCA \u0D95\u0DB1\u0DD9\u0DAF?","acceptedAnswer":{"@type":"Answer","text":"\u0D9A\u0DCF\u0DA9\u0DCA 32\u0DBA\u0DD2. \u0DC3\u0DCF\u0DB8\u0DCF\u0DB1\u0DCA\u200D\u0DBA 52 \u0D9A\u0DA7\u0DCA\u0DA7\u0DD4\u0DC0\u0DD9\u0DB1\u0DCA 2 \u0DC3\u0DD2\u0DA7 6 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0D9A\u0DCF\u0DA9\u0DCA \u0D85\u0DBA\u0DD2\u0DB1\u0DCA \u0D9A\u0DBB\u0DBD\u0DCF, \u0DC4\u0DD0\u0DB8 \u0DB4\u0DCF\u0DA7\u0D9A\u0DD2\u0DB1\u0DCA\u0DB8 7 \u0DC3\u0DD2\u0DA7 A \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0D9A\u0DCF\u0DA9\u0DCA 8 \u0DB6\u0DD0\u0D9C\u0DD2\u0DB1\u0DCA \u0DAD\u0DD2\u0DBA\u0DCF\u0D9C\u0DB1\u0DCA\u0DB1\u0DC0\u0DCF."}},\n{"@type":"Question","name":"\u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA \u0D91\u0D9A \u0DAD\u0DDD\u0DBB\u0DB1\u0DCA\u0DB1\u0DDA \u0D9A\u0DC0\u0DD4\u0DAF?","acceptedAnswer":{"@type":"Answer","text":"\u0DB6\u0DD9\u0DAF\u0DB1 \u0D9A\u0DD9\u0DB1\u0DCF\u0D9C\u0DDA \u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DB4\u0DD0\u0DAD\u0DCA\u0DAD\u0DDA \u0D89\u0DB1\u0DCA\u0DB1 \u0D9A\u0DD9\u0DB1\u0DCF. \u0D91\u0DBA\u0DCF\u0DA7 \u0DB8\u0DD4\u0DBD\u0DD2\u0DB1\u0DCA \u0DBD\u0DD0\u0DB6\u0DD9\u0DB1 \u0D9A\u0DCF\u0DA9\u0DCA 4 \u0DB6\u0DBD\u0DBD\u0DCF \u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA \u0DB4\u0DCF\u0DA7 \u0DAD\u0DDD\u0DBB\u0DB1\u0DC0\u0DCF."}},\n{"@type":"Question","name":"\u0D95\u0DB8\u0DD2 \u0DC0\u0DBD \u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 \u0DAF\u0DD9\u0DB1\u0DCA\u0DB1\u0DDA \u0D9A\u0DDC\u0DC4\u0DDC\u0DB8\u0DAF?","acceptedAnswer":{"@type":"Answer","text":"\u0D85\u0DAD\u0DCA 8\u0DB1\u0DCA 5\u0D9A\u0DCA \u0DC4\u0DDD \u0DC0\u0DD0\u0DA9\u0DD2\u0DBA \u0D9C\u0DAD\u0DCA\u0DAD \u0DA7\u0DD3\u0DB8\u0DCA \u0D91\u0D9A \u0DC0\u0DA7\u0DBA \u0DAF\u0DD2\u0DB1\u0DB1\u0DC0\u0DCF. \u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA \u0D9A\u0DD2\u0DC0\u0DCA\u0DC0 \u0DA7\u0DD3\u0DB8\u0DCA \u0D91\u0D9A \u0DAF\u0DD2\u0DB1\u0DD4\u0DC0\u0DDC\u0DAD\u0DCA \u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 1\u0DBA\u0DD2, \u0D85\u0DB1\u0DD2\u0DAD\u0DCA \u0DA7\u0DD3\u0DB8\u0DCA \u0D91\u0D9A \u0DAF\u0DD2\u0DB1\u0DD4\u0DC0\u0DDC\u0DAD\u0DCA \u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 2\u0DBA\u0DD2. \u0DB8\u0DD4\u0DBD\u0DD2\u0DB1\u0DCA\u0DB8 \u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 10\u0DA7 \u0DBA\u0DB1 \u0DA7\u0DD3\u0DB8\u0DCA \u0D91\u0D9A \u0D9C\u0DDA\u0DB8 \u0DAF\u0DD2\u0DB1\u0DB1\u0DC0\u0DCF."}},\n{"@type":"Question","name":"Online \u0D95\u0DB8\u0DD2 \u0DB1\u0DDC\u0DB8\u0DD2\u0DBD\u0DDA\u0DAF?","acceptedAnswer":{"@type":"Answer","text":"\u0D94\u0DC0\u0DCA. OMI LANKA \u0DC3\u0DB8\u0DCA\u0DB4\u0DD6\u0DBB\u0DCA\u0DAB\u0DBA\u0DD9\u0DB1\u0DCA\u0DB8 \u0DB1\u0DDC\u0DB8\u0DD2\u0DBD\u0DDA. Sign up \u0DB1\u0DD0\u0DAD\u0DD4\u0DC0 Guest \u0DC0\u0DD2\u0DAF\u0DD2\u0DC4\u0DA7 \u0DC0\u0DD4\u0DAB\u0DAD\u0DCA \u0D9C\u0DC4\u0DB1\u0DCA\u0DB1 \u0DB4\u0DD4\u0DC5\u0DD4\u0DC0\u0DB1\u0DCA."}}]}<\/script>\n</head>\n<body>\n<header class="top"><a class="logo" href="/">\u{1F0CF} OMI LANKA</a><nav><a href="/">\u0D9C\u0DDA\u0DB8\u0DCA \u0D91\u0D9A\u0DA7</a> \xB7 <a href="/en/how-to-play/" hreflang="en">English</a></nav><h1>\u0D95\u0DB8\u0DD2 \u0D9C\u0DC4\u0DB1 \u0DC4\u0DD0\u0DA7\u0DD2</h1></header>\n<main>\n<p class="lead">\u0D95\u0DB8\u0DD2 \u0D9A\u0DD2\u0DBA\u0DB1\u0DCA\u0DB1\u0DDA \u0DBD\u0D82\u0D9A\u0DCF\u0DC0\u0DDA \u0D9C\u0DD9\u0DC0\u0DBD\u0DCA\u0DC0\u0DBD, \u0DB6\u0DDD\u0DA9\u0DD2\u0D82\u0DC0\u0DBD, \u0D94\u0DC6\u0DD2\u0DC3\u0DCA \u0DC0\u0DBD \u0D9C\u0DDC\u0DA9\u0D9A\u0DCA \u0DA2\u0DB1\u0DB4\u0DCA\u200D\u0DBB\u0DD2\u0DBA \u0D9A\u0DCF\u0DA9\u0DCA \u0D9C\u0DDA\u0DB8\u0DCA \u0D91\u0D9A\u0D9A\u0DCA. \u0DC4\u0DAD\u0DBB \u0DAF\u0DD9\u0DB1\u0DD9\u0D9A\u0DCA \u0DA7\u0DD3\u0DB8\u0DCA \u0DAF\u0DD9\u0D9A\u0D9A\u0DA7 \u0DB6\u0DD9\u0DAF\u0DD2\u0DBD\u0DCF, \u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA \u0D91\u0D9A\u0D9A\u0DCA \u0DAD\u0DDD\u0DBB\u0D9C\u0DD9\u0DB1, \u0D85\u0DAD\u0DCA \u0D9C\u0DB1\u0DCA\u0DB1 \u0DAD\u0DBB\u0D9F \u0D9A\u0DBB\u0DB1\u0DC0\u0DCF. \u0DB8\u0DD9\u0DAD\u0DB1 \u0DAD\u0DD2\u0DBA\u0DD9\u0DB1\u0DCA\u0DB1\u0DDA \u0DB1\u0DD3\u0DAD\u0DD2, \u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 \u0D9A\u0DCA\u200D\u0DBB\u0DB8\u0DBA \u0DC3\u0DC4 \u0DAF\u0DD2\u0DB1\u0DB1\u0DCA\u0DB1 tips \u0DA7\u0DD2\u0D9A\u0D9A\u0DCA.</p>\n\n<h2>\u0D9A\u0DCF\u0DA9\u0DCA \u0DC3\u0DC4 \u0D9A\u0DA7\u0DCA\u0DA7\u0DD2\u0DBA</h2>\n<p>\u0D95\u0DB8\u0DD2 \u0DC0\u0DBD\u0DA7 <b>\u0D9A\u0DCF\u0DA9\u0DCA 32</b>\u0D9A\u0DCA \u0DB4\u0DCF\u0DC0\u0DD2\u0DA0\u0DCA\u0DA0\u0DD2 \u0D9A\u0DBB\u0DB1\u0DC0\u0DCF. \u0DC3\u0DCF\u0DB8\u0DCF\u0DB1\u0DCA\u200D\u0DBA \u0D9A\u0DA7\u0DCA\u0DA7\u0DD4\u0DC0\u0DD9\u0DB1\u0DCA 2 \u0D89\u0DB3\u0DB1\u0DCA 6 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0D9A\u0DCF\u0DA9\u0DCA \u0D85\u0DBA\u0DD2\u0DB1\u0DCA \u0D9A\u0DBB\u0DBD\u0DCF, \u0DC4\u0DD0\u0DB8 \u0DB4\u0DCF\u0DA7\u0D9A\u0DD2\u0DB1\u0DCA\u0DB8 (\u0D89\u0DC3\u0DCA\u0DB4\u0DDA\u0DA9\u0DCA, \u0DC4\u0DCF\u0DA7\u0DCA, \u0DAF\u0DD2\u0DBA\u0DB8\u0DB1\u0DCA\u0DAD\u0DD2, \u0D9A\u0DBD\u0DCF\u0DC0\u0DBB\u0DCA) <b>7, 8, 9, 10, J, Q, K, A</b> \u0DAD\u0DD2\u0DBA\u0DCF\u0D9C\u0DB1\u0DCA\u0DB1\u0DC0\u0DCF.</p>\n<table><tr><th>\u0DBD\u0DDC\u0D9A\u0DD4\u0DB8</th><td>A \u2192 K \u2192 Q \u2192 J \u2192 10 \u2192 9 \u2192 8 \u2192 7</td><th>\u0DB4\u0DDC\u0DA9\u0DD2\u0DB8</th></tr></table>\n<p>\u0DC3\u0DD9\u0DBD\u0DCA\u0DBD\u0DB8\u0DCA \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1\u0DDA \u0DC4\u0DAD\u0DBB \u0DAF\u0DD9\u0DB1\u0DBA\u0DD2. \u0DA7\u0DD3\u0DB8\u0DCA \u0DAF\u0DD9\u0D9A\u0DBA\u0DD2. \u0D94\u0DBA\u0DCF\u0D9C\u0DDA \u0DB4\u0DCF\u0DA7\u0DCA\u0DB1\u0DBB\u0DCA \u0D89\u0DB1\u0DCA\u0DB1\u0DDA \u0D9A\u0DD9\u0DC5\u0DD2\u0DB1\u0DCA\u0DB8 \u0D89\u0DC3\u0DCA\u0DC3\u0DBB\u0DC4\u0DD2\u0DB1\u0DCA.</p>\n\n<h2>\u0D9A\u0DCF\u0DA9\u0DCA \u0DB6\u0DD9\u0DAF\u0DD3\u0DB8 \u0DC3\u0DC4 \u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA \u0DAD\u0DDA\u0DBB\u0DD3\u0DB8</h2>\n<p>\u0D9C\u0DDA\u0DB8 \u0DBA\u0DB1\u0DCA\u0DB1\u0DDA \u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DB4\u0DD0\u0DAD\u0DCA\u0DAD\u0DA7 (anticlockwise). \u0DB6\u0DD9\u0DAF\u0DB1 \u0D9A\u0DD9\u0DB1\u0DCF\u0D9C\u0DDA <b>\u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DB4\u0DD0\u0DAD\u0DCA\u0DAD\u0DDA \u0D89\u0DB1\u0DCA\u0DB1 \u0D9A\u0DD9\u0DB1\u0DCF\u0DA7</b> \u0DB8\u0DD4\u0DBD\u0DD2\u0DB1\u0DCA\u0DB8 \u0D9A\u0DCF\u0DA9\u0DCA 4\u0D9A\u0DCA \u0DBD\u0DD0\u0DB6\u0DD9\u0DB1\u0DC0\u0DCF. \u0D92 \u0D9A\u0DCF\u0DA9\u0DCA 4 \u0DC0\u0DD2\u0DAD\u0DBB\u0D9A\u0DCA \u0DB6\u0DBD\u0DBD\u0DCF \u0D91\u0DBA\u0DCF <b>\u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA</b> \u0DB4\u0DCF\u0DA7 \u0D9A\u0DD2\u0DBA\u0DB1\u0DC0\u0DCF. \u0D8A\u0DA7 \u0DB4\u0DC3\u0DCA\u0DC3\u0DDA \u0DC4\u0DD0\u0DB8\u0DDD\u0DA7\u0DB8 \u0DAD\u0DC0 \u0D9A\u0DCF\u0DA9\u0DCA 4 \u0DB6\u0DD0\u0D9C\u0DD2\u0DB1\u0DCA \u0DB6\u0DD9\u0DAF\u0DB1\u0DC0\u0DCF \u2014 \u0D91\u0DAD\u0D9A\u0DDC\u0DA7 \u0DC4\u0DD0\u0DB8\u0DDD \u0DC5\u0D9F\u0DB8 \u0D9A\u0DCF\u0DA9\u0DCA 8\u0DBA\u0DD2.</p>\n\n<h2>\u0D9C\u0DDA\u0DB8 \u0D9C\u0DC4\u0DB1 \u0DC4\u0DD0\u0DA7\u0DD2</h2>\n<ul>\n<li>\u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA \u0D9A\u0DD2\u0DBA\u0DB4\u0DD4 \u0D9A\u0DD9\u0DB1\u0DCF \u0DB4\u0DC5\u0DB8\u0DD4 \u0D85\u0DAD\u0DA7 \u0D9A\u0DCF\u0DA9\u0DCA \u0D91\u0D9A\u0D9A\u0DCA \u0DAF\u0DCF\u0DB1\u0DC0\u0DCF.</li>\n<li>\u0D85\u0DB1\u0DD2\u0DAD\u0DCA \u0D85\u0DBA <b>\u0DB8\u0DD4\u0DBD\u0DD2\u0DB1\u0DCA \u0DAF\u0DCF\u0DB4\u0DD4 \u0DB4\u0DCF\u0DA7\u0DB8</b> \u0DAF\u0DCF\u0DB1\u0DCA\u0DB1 \u0D95\u0DB1\u0DDA. \u0D92 \u0DB4\u0DCF\u0DA7 \u0DB1\u0DD0\u0DAD\u0DCA\u0DB1\u0DB8\u0DCA \u0DC0\u0DD2\u0DAD\u0DBB\u0D9A\u0DCA \u0D95\u0DB1 \u0D9A\u0DCF\u0DA9\u0DCA \u0D91\u0D9A\u0D9A\u0DCA \u0DAF\u0DCF\u0DB1\u0DCA\u0DB1 \u0DB4\u0DD4\u0DC5\u0DD4\u0DC0\u0DB1\u0DCA \u2014 \u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA \u0D91\u0D9A\u0D9A\u0DD2\u0DB1\u0DCA \u0D85\u0DAD \u0D9A\u0DB4\u0DB1\u0DCA\u0DB1\u0DAD\u0DCA \u0DB4\u0DD4\u0DC5\u0DD4\u0DC0\u0DB1\u0DCA.</li>\n<li>\u0D85\u0DAD\u0DDA \u0DBD\u0DDC\u0D9A\u0DD4\u0DB8 \u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA \u0D91\u0D9A, \u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA \u0DB1\u0DD0\u0DAD\u0DCA\u0DB1\u0DB8\u0DCA \u0DB8\u0DD4\u0DBD\u0DD2\u0DB1\u0DCA \u0DAF\u0DCF\u0DB4\u0DD4 \u0DB4\u0DCF\u0DA7\u0DDA \u0DBD\u0DDC\u0D9A\u0DD4\u0DB8 \u0D9A\u0DCF\u0DA9\u0DCA \u0D91\u0D9A \u0D85\u0DAD \u0D9C\u0DB1\u0DCA\u0DB1\u0DC0\u0DCF.</li>\n<li>\u0D85\u0DAD \u0D9C\u0DAD\u0DCA\u0DAD \u0D9A\u0DD9\u0DB1\u0DCF \u0D8A\u0DC5\u0D9F \u0D85\u0DAD \u0DB4\u0DA7\u0DB1\u0DCA \u0D9C\u0DB1\u0DCA\u0DB1\u0DC0\u0DCF. \u0DB8\u0DD9\u0DC4\u0DD9\u0DB8 \u0D85\u0DAD\u0DCA 8\u0D9A\u0DCA \u0D9C\u0DC4\u0DB1\u0DC0\u0DCF.</li>\n</ul>\n\n<h2>\u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 \u0D9A\u0DCA\u200D\u0DBB\u0DB8\u0DBA</h2>\n<table>\n<tr><th>\u0DC0\u0DD9\u0DB1 \u0DAF\u0DDA</th><th>\u0DBD\u0D9A\u0DD4\u0DAB\u0DD4</th></tr>\n<tr><td>\u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA \u0D9A\u0DD2\u0DC0\u0DCA\u0DC0 \u0DA7\u0DD3\u0DB8\u0DCA \u0D91\u0D9A \u0D85\u0DAD\u0DCA 5+ \u0D9C\u0DAD\u0DCA\u0DAD\u0DDC\u0DAD\u0DCA</td><td>1</td></tr>\n<tr><td>\u0D85\u0DB1\u0DD2\u0DAD\u0DCA \u0DA7\u0DD3\u0DB8\u0DCA \u0D91\u0D9A \u0D85\u0DAD\u0DCA 5+ \u0D9C\u0DAD\u0DCA\u0DAD\u0DDC\u0DAD\u0DCA</td><td>2</td></tr>\n<tr><td>\u0D85\u0DAD\u0DCA 8\u0DB8 \u0D9C\u0DAD\u0DCA\u0DAD\u0DDC\u0DAD\u0DCA (\u0D9A\u0DB4\u0DDD\u0DAD\u0DD2)</td><td>\u0D9C\u0DB8\u0DDA \u0DB1\u0DD3\u0DAD\u0DD2\u0DBA \u0D85\u0DB1\u0DD4\u0DC0 (OMI LANKA default: 3)</td></tr>\n<tr><td>\u0D85\u0DAD\u0DCA 4\u20134 \u0DC3\u0DB8 \u0DC0\u0DD4\u0DAB\u0DDC\u0DAD\u0DCA</td><td>0 \u2014 \u0D8A\u0DC5\u0D9F \u0DC0\u0DA7\u0DBA \u0DAF\u0DD2\u0DB1\u0DB1 \u0DA7\u0DD3\u0DB8\u0DCA \u0D91\u0D9A\u0DA7 +1</td></tr>\n</table>\n<p>\u0DB8\u0DD4\u0DBD\u0DD2\u0DB1\u0DCA\u0DB8 <b>\u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 10</b>\u0DA7 \u0DBA\u0DB1 \u0DA7\u0DD3\u0DB8\u0DCA \u0D91\u0D9A \u0D9C\u0DDA\u0DB8 \u0DAF\u0DD2\u0DB1\u0DB1\u0DC0\u0DCF. \u0DC4\u0DD0\u0DB8 \u0DC0\u0DA7\u0DBA\u0D9A\u0DA7\u0DB8 \u0DB6\u0DD9\u0DAF\u0DB1 \u0D9A\u0DD9\u0DB1\u0DCF \u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DB4\u0DD0\u0DAD\u0DCA\u0DAD\u0DA7 \u0DB8\u0DCF\u0DBB\u0DD4 \u0DC0\u0DD9\u0DB1\u0DC0\u0DCF.</p>\n\n<h2>\u0D9C\u0DB8\u0DCA \u0DC0\u0DBD \u0DC0\u0DD9\u0DB1\u0DC3\u0DCA\u0D9A\u0DB8\u0DCA</h2>\n<p>\u0D95\u0DB8\u0DD2 \u0D9C\u0DC4\u0DB1 \u0DC0\u0DD2\u0DAF\u0DD2\u0DC4 \u0D9C\u0DB8\u0DD9\u0DB1\u0DCA \u0D9C\u0DB8\u0DA7, \u0DBA\u0DCF\u0DC5\u0DD4 \u0D9A\u0DAB\u0DCA\u0DA9\u0DCF\u0DBA\u0DB8\u0DD9\u0DB1\u0DCA \u0D9A\u0DAB\u0DCA\u0DA9\u0DCF\u0DBA\u0DB8\u0DA7 \u0DB4\u0DDC\u0DA9\u0DCA\u0DA9\u0D9A\u0DCA \u0DC0\u0DD9\u0DB1\u0DC3\u0DCA. \u0D9A\u0DB4\u0DDD\u0DAD\u0DD2\u0DBA\u0DA7 \u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 \u0D9A\u0DD3\u0DBA\u0DAF, \u0D9C\u0DDA\u0DB8 \u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 \u0D9A\u0DD3\u0DBA\u0DA7 \u0D9C\u0DC4\u0DB1\u0DC0\u0DAF \u0DC0\u0D9C\u0DDA \u0DAF\u0DDA\u0DC0\u0DBD\u0DCA OMI LANKA \u0D91\u0D9A\u0DDA <b>\u0DC3\u0DD0\u0D9A\u0DC3\u0DD4\u0DB8\u0DCA</b> \u0DC0\u0DBD\u0DD2\u0DB1\u0DCA \u0D94\u0DBA\u0DCF\u0DBD\u0D9C\u0DDA \u0DC0\u0DD2\u0DAF\u0DD2\u0DC4\u0DA7 \u0DC0\u0DD9\u0DB1\u0DC3\u0DCA \u0D9A\u0DBB\u0D9C\u0DB1\u0DCA\u0DB1 \u0DB4\u0DD4\u0DC5\u0DD4\u0DC0\u0DB1\u0DCA.</p>\n\n<h2>\u0DAF\u0DD2\u0DB1\u0DB1\u0DCA\u0DB1 tips \u{1F4A1}</h2>\n<ul>\n<li>\u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA \u0DAD\u0DDD\u0DBB\u0DB1\u0DCA\u0DB1 \u0D9A\u0DBD\u0DD2\u0DB1\u0DCA \u0D9A\u0DCF\u0DA9\u0DCA 4 \u0DC4\u0DDC\u0DB3\u0DA7 \u0DB6\u0DBD\u0DB1\u0DCA\u0DB1. \u0DC0\u0DD0\u0DA9\u0DD2\u0DB4\u0DD4\u0DBB\u0DB8 \u0DAD\u0DD2\u0DBA\u0DD9\u0DB1, A/K \u0DC0\u0D9C\u0DDA \u0DBD\u0DDC\u0D9A\u0DD4 \u0D9A\u0DCF\u0DA9\u0DCA \u0DAD\u0DD2\u0DBA\u0DD9\u0DB1 \u0DB4\u0DCF\u0DA7 \u0DAD\u0DDD\u0DBB\u0DB1\u0DCA\u0DB1.</li>\n<li>\u0DB4\u0DCF\u0DA7\u0DCA\u0DB1\u0DBB\u0DCA \u0D85\u0DAD \u0D9C\u0DB1\u0DCA\u0DB1\u0DC0\u0DCF \u0DB1\u0DB8\u0DCA \u0DBD\u0DDC\u0D9A\u0DD4 \u0D9A\u0DCF\u0DA9\u0DCA \u0DB1\u0DCF\u0DC3\u0DCA\u0DAD\u0DD2 \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1 \u0D91\u0DB4\u0DCF \u2014 \u0DB4\u0DDC\u0DA9\u0DD2 \u0D91\u0D9A\u0D9A\u0DCA \u0DAF\u0DCF\u0DB1\u0DCA\u0DB1.</li>\n<li>\u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA \u0DA7\u0DD2\u0D9A \u0DC0\u0DD9\u0DBD\u0DCF\u0DC0\u0DA7 \u0DAD\u0DD2\u0DBA\u0DCF\u0D9C\u0DB1\u0DCA\u0DB1. \u0DB4\u0DCA\u200D\u0DBB\u0DAD\u0DD2\u0DC0\u0DCF\u0DAF\u0DD3\u0DB1\u0DCA\u0D9C\u0DDA A \u0D91\u0D9A\u0D9A\u0DCA \u0D9A\u0DB4\u0DB1\u0DCA\u0DB1 \u0D92\u0DC0\u0DCF \u0DC0\u0DA7\u0DD2\u0DB1\u0DC0\u0DCF.</li>\n<li>\u0D9A\u0DCF\u0D9C\u0DDA \u0DC5\u0D9F \u0DB8\u0DDC\u0DB1 \u0DB4\u0DCF\u0DA7 \u0D89\u0DC0\u0DBB\u0DAF \u0D9A\u0DD2\u0DBA\u0DBD\u0DCF \u0DB8\u0DAD\u0D9A \u0DAD\u0DD2\u0DBA\u0DCF\u0D9C\u0DB1\u0DCA\u0DB1.</li>\n</ul>\n\n<h2>\u0DB1\u0DD2\u0DAD\u0DBB \u0D85\u0DC4\u0DB1 \u0DB4\u0DCA\u200D\u0DBB\u0DC1\u0DCA\u0DB1</h2>\n<details><summary>\u0D95\u0DB8\u0DD2 \u0DC0\u0DBD\u0DA7 \u0D9A\u0DCF\u0DA9\u0DCA \u0D9A\u0DD3\u0DBA\u0D9A\u0DCA \u0D95\u0DB1\u0DD9\u0DAF?</summary><p>\u0D9A\u0DCF\u0DA9\u0DCA 32\u0DBA\u0DD2. 52 \u0D9A\u0DA7\u0DCA\u0DA7\u0DD4\u0DC0\u0DD9\u0DB1\u0DCA 2\u20136 \u0D9A\u0DCF\u0DA9\u0DCA \u0D85\u0DBA\u0DD2\u0DB1\u0DCA \u0D9A\u0DBB\u0DBD\u0DCF, \u0DC4\u0DD0\u0DB8 \u0DB4\u0DCF\u0DA7\u0D9A\u0DD2\u0DB1\u0DCA\u0DB8 7 \u0DC3\u0DD2\u0DA7 A \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DAD\u0DD2\u0DBA\u0DCF\u0D9C\u0DB1\u0DCA\u0DB1\u0DC0\u0DCF.</p></details>\n<details><summary>\u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA \u0D91\u0D9A \u0DAD\u0DDD\u0DBB\u0DB1\u0DCA\u0DB1\u0DDA \u0D9A\u0DC0\u0DD4\u0DAF?</summary><p>\u0DB6\u0DD9\u0DAF\u0DB1 \u0D9A\u0DD9\u0DB1\u0DCF\u0D9C\u0DDA \u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DB4\u0DD0\u0DAD\u0DCA\u0DAD\u0DDA \u0D89\u0DB1\u0DCA\u0DB1 \u0D9A\u0DD9\u0DB1\u0DCF, \u0DB8\u0DD4\u0DBD\u0DD2\u0DB1\u0DCA \u0DBD\u0DD0\u0DB6\u0DD9\u0DB1 \u0D9A\u0DCF\u0DA9\u0DCA 4 \u0DB6\u0DBD\u0DBD\u0DCF.</p></details>\n<details><summary>Online \u0D95\u0DB8\u0DD2 \u0DB1\u0DDC\u0DB8\u0DD2\u0DBD\u0DDA\u0DAF?</summary><p>\u0D94\u0DC0\u0DCA. OMI LANKA \u0DC3\u0DB8\u0DCA\u0DB4\u0DD6\u0DBB\u0DCA\u0DAB\u0DBA\u0DD9\u0DB1\u0DCA\u0DB8 \u0DB1\u0DDC\u0DB8\u0DD2\u0DBD\u0DDA. Sign up \u0DB1\u0DD0\u0DAD\u0DD4\u0DC0 Guest \u0DC0\u0DD2\u0DAF\u0DD2\u0DC4\u0DA7 \u0DC0\u0DD4\u0DAB\u0DAD\u0DCA \u0D9C\u0DC4\u0DB1\u0DCA\u0DB1 \u0DB4\u0DD4\u0DC5\u0DD4\u0DC0\u0DB1\u0DCA.</p></details>\n<details><summary>\u0DBA\u0DCF\u0DC5\u0DD4\u0DC0\u0DDD \u0D91\u0D9A\u0DCA\u0D9A \u0D9C\u0DC4\u0DB1\u0DCA\u0DB1\u0DDA \u0D9A\u0DDC\u0DC4\u0DDC\u0DB8\u0DAF?</summary><p>\u201CPrivate Room\u201D \u0D91\u0D9A\u0D9A\u0DCA \u0DC4\u0DAF\u0DBD\u0DCF invite link \u0D91\u0D9A WhatsApp/Messenger \u0D91\u0D9A\u0DDA \u0DBA\u0DC0\u0DB1\u0DCA\u0DB1. \u0DC4\u0DD2\u0DC3\u0DCA \u0DAD\u0DD0\u0DB1\u0DCA \u0DAD\u0DD2\u0DBA\u0DD9\u0DB1\u0DC0\u0DCF \u0DB1\u0DB8\u0DCA Bots \u0DBD\u0DCF \u0D91\u0D9A\u0DAD\u0DD4 \u0DC0\u0DD9\u0DB1\u0DC0\u0DCF.</p></details>\n\n<a class="cta" href="/">\u{1F0CF} \u0DAF\u0DD0\u0DB1\u0DCA\u0DB8 \u0D95\u0DB8\u0DD2 \u0D9C\u0DC4\u0DB8\u0DD4!</a>\n</main>\n<footer>\xA9 OMI LANKA \xB7 <a href="/en/how-to-play/" hreflang="en">How to play Omi (English)</a></footer>\n</body>\n</html>\n' }, "/icons/icon-maskable-512.png": { "t": "image/png", "b": "iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AABkpUlEQVR4nO3dd5gc1Z09/FPVOU5WmJGEAhJCQhghksFgMsjIARtwwjjbGNvrtPt7HdY2XuecMayxjQP24l3YJdlkZEwWQSIKSShLI2lydQ5V9/2jVa2Z0Uz3dE91Vzqf59FjM9PTfaenq+6p7711rxTpPlWAiIiIXEU2uwFERETUfAwARERELsQAQERE5EIMAERERC7EAEBERORCDABEREQuxABARETkQgwARERELsQAQERE5EIMAERERC7EAEBERORCDABEREQuxABARETkQgwARERELsQAQERE5EIMAERERC7EAEBERORCDABEREQuxABARETkQgwARERELsQAQERE5EIMAERERC7EAEBERORCDABEREQuxABARETkQgwARERELsQAQERE5EIMAERERC7EAEBERORCDABEREQuxABARETkQgwARERELsQAQERE5EIMAERERC7EAEBERORCDABEREQuxABARETkQgwARERELsQAQERE5EIMAERERC7EAEBERORCDABEREQuxABARETkQgwARERELsQAQERE5EIMAERERC7EAEBERORCDABEREQuxABARETkQgwARERELsQAQERE5EIMAERERC7EAEBERORCDABEREQuxABARETkQgwARERELsQAQERE5EIMAERERC7EAEBERORCDABEREQuxABARETkQl6zG0BExgj8dk3TXiv3gTua9lpE1BhSpPtUYXYjiGhizezUG4VhgciaGACITOaETr5eDAdE5mEAIGoiN3f2U8VQQNQcDABEDcLO3jgMBUTGYwAgMgg7/OZhICCaPgYAojqxw7cOBgKi2jEAEE0RO3z7YCAgqo4BgKgCdvr2xzBANDEGAKJx2Ok7F8MA0SEMAERgp+9GDAPkdgwA5Frs9EnHMEBuxABArsJOn6phGCC3YAAgx2OnT/ViGCAnYwAgx2LHT0ZhECAnYgAgx2HHT43CIEBOwgBAjsBOn5qNYYDsjgGAbI0dP5mNQYDsigGAbIkdP1kNgwDZDQMA2Qo7frI6BgGyCwYAsgV2/GQ3DAJkdQwAZGns+MnuGATIqhgAyJLY8ZPTMAiQ1TAAkKWw4yenYxAgq2AAIEtgx09uwyBAZmMAIFOx4ye3YxAgs8hmN4Dci50/EY8D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LgCienhlyEs7IB8/C/Lxs6ZX5p8iMZJD8ffPNXycWj5uJrzvPRZSS+N/p0q0dXtR/OMLEMm8qe0gcioGAKI6BX67xpTX1Z7uhfrYHohtw6WNeLRpHsKyBKklAGlBKzyv7YG8arYxDTWAUHJQ79sO7bkDEH0pIFNtX2UimioGACKDmBUI3Cj3gTvMbgKR7TEAEDUIA4Fx2OETGY8BgKiJGAqqY2dP1BwMAEQmc3MoYGdPZB4GACILc0I4YCdPZE0MAEQO0cywwE6dyP4YAIiIiFyISwETERG5EAMAERGRCzEAEBERuRADABERkQsxABAREbkQAwAREZELMQAQERG5EAMAERGRCzEAEBERuRADABERkQsxABAREbkQAwAREZELMQAQERG5EAMAERGRCzEAEBERuRADABERkQsxABAREbkQAwAREZELMQAQERG5EAMAERGRCzEAEBERuRADABERkQsxABAREbkQAwAREZELMQAQERG5EAMAERGRCzEAEBERuRADABERkQsxABAREbkQAwAREZELMQAQERG5EAMAERGRCzEAEBERuRADABERkQsxABAREbkQAwAREZELMQAQERG5EAMAERGRCzEAEBERuRADABERkQsxABAREbkQAwAREZELMQAQERG5EAMAERGRCzEAEBERuRADABERkQsxABAREbkQAwAREZELMQAQERG5EAMAERGRCzEAEBERuRADABERkQsxABAREbkQAwAREZELMQAQERG5EAMAERGRCzEAEBERuRADABERkQsxABAREbkQAwAREZEL/f+jwn9ROXMISwAAAABJRU5ErkJggg==" }, "/icons/icon-192.png": { "t": "image/png", "b": "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" }, "/icons/apple-touch-icon.png": { "t": "image/png", "b": "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" }, "/icons/favicon-32.png": { "t": "image/png", "b": "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAJqklEQVR4nIWXe4xdV3XGf2vvfc59ztx5j8djj+2EGTNRggOOQ3BiYjDQKKIJLxNBGlVCqBWVIgi0CASNqoIUcEA8BG0qWYU/kkbBEQQF2qjBMpOHPVilUELiOAFs7NjxYzz2zNznOWfv1T/OnRkjRDjSvTqPrf1961trr4cAwG4L+zxsjUrjxc+L8jYR2YGGABgAjEDQ/Jd4tOPzL5rvgAhSdiACkcnX5d8CYoyqPq3Cgdap9hfh5+kyprB7t2XfPl9Ze8M7kOhTIuYWVQ8aWAEGqCdQdFCwmKlBzPQg2vYg3TVpwD91Iid3sY0UHcQGfJehGEQsquEJNP1q4/TsT9i92wpAdeymG9XI0yKIBp8CFjA4A/UEBcy1o7j3bsZs7IPYIr1xbiWSkwiKzrdyIvuPkf33MfRcA6nGOUEfAiJejI1UUQm6o/7qM89KrbalL61UHjNib1b1CRDTNVovtjHb1uLeuxl37ShWDL6TEUIAH3Lwyy6JDNYYKDqyc3X8/uNkPzgKrRSq8bIaiYiNg/qZqNF4j5THbvyMce4+9UkKEi3LiRPcbVPY26cwlZhksc1i1qZoHSUX48SAaq6OCB4l08BSlmAVegsl6I3x/3Oa7HtHCL86h/Qsk9BUbByFLPusVMa2P4sxN6ABBEMW0ADxp9+CvXkCudCiGTKujHt5//A0s53zzM4dY0kzxBhiY2j6lLJahm2RDwxMMR86PHrxZaJgoCdCvJLcdxA/ewrpK3TdYSGEWamM36QrASf5X/SJ67Hbx9H5NhJZ2lmH70zfzu7+SS795iivrhtm3+lfc6JxkVOdJa6qDrF9ZBM7BzYy2D9AWGrzrsPf5WA6RyUYgjOIE5I9s4Sfv5oHc1AQg0N9yO8EnWvj/voa7M0T6NkGEhkyAiOuwk3lNbzyhS8QFKa/9iXuHVsP7ZSz83P04PCRpVztpRM8hUqRHdVxZubPYpwj+IBaS3T3dXT+7gnoeHACGoIBMRhB6ylm2xju9in0QgucwYqw6BN2VdczUihBX43C9BRBc39rMWJ07RhuzQCh6Dg3d57F+YuoKH85NEmPOlJAjOSg5YjoY1u7NguAcashDO59m5FyhC4liBU80CMRO6vj2P4a6+79LISABsXZPD+pKrGxxD291Hp6aTabLCwsMDW8juuODfFsdp6yWNTmJOyN67BPjuB/eRYpRxisoPUEu2UUu2UUrSeQpweCKgUVdgxvAoWQZWAMsgzuPaiuEAFoNBpEpSLVapU3VIZphgwrpnuuNSd/21SeJRUMHig63Hs2/8GZNiK01LOlOER/Xz8qijhHNneBxZmnUFXEWsSYbiYWQgh474mdAwPb+tdRwZIt52sj0EwxW0axb16b3+MDEltkUy3P77lvEIQkZOzsm6CnXCYA2m7z+098mhff9W4uPPgw89/7PktPPbtCutVqUa1WiWzu2V0jVzJqSmQaVlOW5gbLxhrazjCaemTzABTcipwCpBqoEXH78FROnrwYtV/6DVH/EGfu/ybH/uZujt/994ROB4DFxUX27t1LmqUEYKC3n3f2TrDgk1U3iKCdDLOpD6kVMHQ8ZnoI6S3kWUpysJZmbC0OsWlgTS5gCJhyicrWN6Jphm+10CShvOVqcBEABw4c4J577uGnB36KAYwz7BrYSAWDX3aDAInHXDUMPXFuGJ2sW1iWSQpp8Nxcm6BSKRPQFXUGP7QbVcVfWmD4bz/Chq/vQaxBVZmbm+POO+9kenp6pUrvHL7ij91wGaZbluXyb6vy54EpCmItANUbtjH4wffRd9ut9N36FyvR3Wq3mZyc5I477mB0dDQnKcJgbz/v6Jlg78IRhlxO5HLMPyJgEBqacmNhhCsGRtFuQK4QjGM2PvCNLq4i3bhqNpvs2rULa23+XgRRxUSWtw9s5KGFl1bdcBlm7oJ09Tyvyr+eSqWC13A5v5VLQ0BEQIR2u00IgTiOMcbk77tqqipvHdzEiC2SLu91GaaRUox/6iR6oYU4Q6qBAWLev+aqPDtKHkCqupJsAMSYledWq0UURavkVPO4EUFEGBsa4ZaeDTRCigkgpZjsmRPo+RYGAyQeUo8asApNCXzp9GFe+P3vWLy0gA35RtKt+6FLZtnSZrNJpVrJJe6uMwjSzjh95lUeefkw/9k8SVUiguYnjVYGqjgii15s4/cfx334asJCh4K1PDr3Io/PvcTWwjA7quO8e3CSyf4Renv7oWts8IFGq0kURUQuggA0E05dOs/MhWMcWDjJ/uYrnPMtjLXEGDQSOFPHz5xAKjFSGd+uZAo9MYU9b4dK3usZIwSUVvAkPqOvUODNtTW8oTrMm4pjvG34dQxVa0Dg3Nwci6XAI2ef5/SlBZ5MTnKm06Le7NBrom73BOoD0huT/cfzpA/9GqkVkcra7YoVdKGDu+saoruuRufycpxHKdiio350nsbsGUgT3LY1jHvLDUdqrB3r48jrOzyx/zlYasNYDOehuqFKZed6sm7bhpIXuU5G554noZ6CFRwQCGqkGuO/fxQzPYS9Zhitpzl6ybH4X8cY//H/sfv6QKEo7HvwJEdOej5wa51fzgr7v13mw2/xTI4a/uXhwEduUX74Q8vJDTWKU7W8FwggZUfyjcMw34ZyBCEEk4dzzk5bKdkjL+Qp2RkwhuxCm9KPXuCxfxI6pZjfNh2P/bMwOSJ85ZNDPPz5QTYOCN/6XJl/+FiR4lDEvR+vcOUVEZ26xxiBLCB9BfzsKfzBU1BabsmsMYRwEDEBH4L0xITnztG57yAYsBVH43dLXLcuY2Kd499+FHjwmXxceOf1wswvMg6/mPGDPRGHngv86uWAEzhzPpAkigioV6S/hD90iuSrP0NKDvJpKRDCQaPI42KsATxekd6YMHuK9P5ZtJkRDZc4Mw+xU9YPwmAx0F8TXpmD/h54dCbgUPbNBGrVbrUtdAcqK0glwj99gmTPobw1MwKqXow1ijxuomb9geDTGREXAQmZIn0Fwv+eofXRH1M4v8SRoTG+uDflHz8EX/4rz78+1OHAoZRIlOdf8rzpo57fHs/oNDy+lbFQh9Qr0slI7z9E8uVDiBOwBnxIRFwUfDoTNesP/OnRzIghyWc/2VCjueCZGAFXthyvDlDsdKgcPUt7Qz9617WYf/8FhUabposozy3R6iheDDRSKNpc9oAX6yJVXR3NXnM4FclrROoxkSF53RAyUaN83QhMDpCda2ErEabsCIsJyZPHsJknOXACk/k875t8gnrN4fTPjuddIpJ6tJ1BOcobGMm7JA3dgJtvQVCkEl9e915zPP9/dPDNRjzSpbAAAAAASUVORK5CYII=" }, "/icons/icon-512.png": { "t": "image/png", "b": "iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAB090lEQVR4nO3dd5wkdZ0//ldVdZ7umrizYXZZ2MAuS1iWJEHJQWAR0+kZfmZRFA/DmbkTPY8z63HKoSjq13B6eiKCoEgSlSyw5GVz3p2dWN3Tuerz+2O2ent2Zrp7eqq60uv5ePhQd3q6P9NdXe/35/1JEsiV2hacLpxuAxGRFcZ2Pyg53QaajB+KQxjgiYjGMUFwBt/0FmCwJyKaGSYF9uMbbAMGfCIiazEhsB7fUAsw4BMRtRYTgtnjG9gkBn0iIndgMtAcvmkzwKBPRORuTAYaxzeqDgZ9IiJvYjJQG9+caTDwExH5AxOBqfFNqcKgT0Tkb0wGDuIbAQZ+IqKgYSIQ8ASAgZ+IKNiCnAgE8g9n4CciompBTAQC9Qcz8BMRUS1BSgQC8Ycy8BMR0UwEIRGQnW6A3Rj8iYhopoIQO3yb4QThwyMiIvv5tRrguz+KgZ+IiOzgt0TAV0MADP5ERGQXv8UYX2QzfvtQiIjI3fxQDfB8BYDBn4iIWs0PscfTGYwfPgCi2YrevNax1y6863bHXpvIDbxcCfBkwxn4ye+cDOp2YbJAfubFRMBzDWbwJz/wY4CfLSYI5HVeSwI81VgGf/IaBvrZY2JAXuKlJMATDWXgJy9gsG8dJgXkdl5IBFzfQAZ/ciMGe/dhUkBu4/YkwNWNY/Ant2DA9x4mBOQGbk4CXNswBn9yEgO+/zAhIKe4NQlwZaMY/KnVGPCDhwkBtZIbkwDXNYjBn1qBAZ8OxYSA7Oa2JMBVjWHwJzsx6FOjmAyQXdyUBLimIQz+ZAcGfZotJgNkNbckAa5oBIM/WYlBn+zCZICs4oYkwPEGMPiTFRj0qdWYDNBsOZ0EOPriDP40Gwz65BZMBqhZTiYBjr0wgz81i4Gf3IqJADXDqSTAkRdl8KeZYtAnr2EyQDPhRBLQ8hdk8KeZYOAnr2MiQI1qdRLQ0hdj8KdGMOiTXzEZoHpamQS07IUY/KkeBn4KCiYCVEurkoCWvAiDP9XCwE9BxUSAptOKJCBk9wsQTYVBn2ji94DJALWa7RkGe/9UjYGfqDYmAmSyuwpg65Mz+JOJgZ9oZpgIEGBvEmDbEzP4E8DATzRbTATIriSAcwDIFgz8RNYwv0tMBMhqtmQV7P0HFwM/kb2YCASTHVUAy5+QwT+YGPiJWouJQPBYnQRY+mQM/sHDwE/kLCYCwWJlEiBb9UQUPAz+RM7j95CaZVkmwd5/cPCGQ+ROrAYEg1VVAEuehME/GBj4ibyBiYD/WZEEcBkg1cXAT+QtXDpIjZj1HAD2/v2NwZ/Iu/j99S8rYi8rADQl3jiI/IHVAJrOrMYQ2Pv3HwZ+In9jIuAvs5kL0PQQAIO//zD4E/kfv+f+MptYzCEA4g2BKGA4LEBAkxUA9v79g8GfKLj4/feHZmMyKwABxS8+EQGsBgTZjCsA7P17H4M/ER2K9wVvayY2swIQIPyCE1EtrAYEy4wqAOz9exeDPxE1ivcLb5ppjGYFwOf4RSaiZrAa4H8NVwDY+/ceBn8imi3eR7xlJrF61mcBkDvxS0tEVuH9xJ8a2kKQvX/v4BeViOzEIQFvaGSLYFYAfITBn4jsxvuMfzAB8Al+KYmoVXi/8Ye6JQKW/92NX0QichKHBNyr3jAAKwAexuBPRE7jfci7aiYA7P27F790ROQWvB+5U70Yzo2APIZfNCJyI24c5D0cAvAQBn8icjvep7xj2gSA5X934ZeKiLyC9yv3qBXLWQHwAH6ZiMhreN9yPyYALscvERF5Fe9f7jblGkGW/53HLw4R+QknBzprqj0BWAFwIQZ/IvIb3tfchwmAy/BLQkR+xfubu0xKAFj+dw6/HETkd7zPOWOq2M4KgEvwS0FEQcH7nTswAXABfhmIKGh433MeEwCH8UtAREHF+5+zJiQAHP9vLV78jVGkyatVU3LYgZYQTTbVtTjVNUtT432wdQ6N8TwMyCG86GuTAJhXqi4EzozNw5OFQXym83jcm9uNT3WsxvPFEdyR3Y7Xth2BNV19yGQyOHs31xqTfe5fsBbJZBJPDu3Cb8a24JLEYVgV6cCXRtbh3PgCXDf8FNZEu/FAfm/ld6qvZZpa9Oa13CfAARPSVFYAWoPBvzYFEvQDt8xL4ovw3vaVOHP1SXj86aewcskyZDIZ7OvvR7uqIplMYtfuXZClyaNZTAbICvcvmPx9NYSBvgXjSeeopmFuby+SySRe3LwRJx13PB5Y9zhuGn0Rd+R2AJh4TdP0mATYr3pDICYALcbg35gL4334TOcaKIqCaDQKLa1BlmRksmPo6epGLp9HLptFZ2cndF1HLpeDLMsIhUKQpii/MhmgmZgq6AshUC6XYRgG4vE4FEXB8PAw4okE4rEYBoYGkUy0wRAG1JSKQqEAXddx3fCTuCu3y4G/wpuYBNhrygSAwd9+DP5Tqy6RXhDvwz+1H4PTV5+Ap55eBwgBYQikUiksWrQIo6Oj6O3tha7rGBoaQldXFxRFwejoKDRNg6ZpTAaoKY0EfVVVoaoq2tvbJ12D/f39aG9vx44dO5BOpyHJEiBJOP641Xhw3RO4fvRZ/OlAIsBhgdqYBNjLTAKYALQIg39tF8T78EF1FRZ19ECWZewbHIAigFQqhYULFyIej1ceK4SoBPbq/20yE4F0Oo2xsTFIkoRwOMxkgCaZLuiXSiUIIdDW1oZUKlUJ/Ic+brrrMJfLYefOnUin09AlYG53DwzDwI6RAXxHe76SCND0mATYhwlACzH4T8/sCe066yNY/9JLkCUJ2VwOnR0dWLRoUSXwCzF+eU4VxGtJp9NIp9PQNA1jY2MAgFAoBFnmnIGgmnJM3zBQLpcBAG1tbVBVFalUCqlUakbPfeh1msvlsGPHDgyPjCARj8MQAiuOPBJ9f/4mqwANYBJgDyYALcLgP7UQJJQh8M7UkXhrchk62zswOjqKaDSKhQsXoq2tDcDUPfxmjY2NVaoDmUxmvB1MBgKhXtBPJpOVXr557c1W9bU7NjaGnTt3olAooL29HcOjI/hpZiN+mH6p8l2gqTEJsB4TgBZg8K9tVbgDH2o/BqfPPQLbdmzHsUcfUymzNtvjb1Q2m52QDBiGgXA4zGTAR6YL+qVSCbIsTwj6iUTCljYceh1rmoZnnnsWixcdhgf3bcF/jT6L50sjtry2nzAJsNaEBIDB33oM/rUdGVLx0HkfxLqnn4Yiy2hvb8eCBQugKIqlvf5G5HK5CfMGDMNAKBSCoiiTHstkwN2mCvq6rqNcLkOW5Qnj+dXzSuxmXtO6rmP37t0YHR2FbhhYfdxxOO2e7+ClstaytngVkwBrje1+UOJGQDZg8K9vVaQTo6OjKJfL6O7txcKFC23v9U8nHo8jHo9j7ty5yOfzE5IBXdcnJAPVAYbJgDvUCvqKokwI+rFYzIEWHrymZVnGokWLIEkS9vX3Y3R0FKsinUwAGsDNgqzHCoDFGPzru6nnFehSopgfVzEyMoJly5ahu7u75T3/egqFwoRkoFwuszLgErWCfigUmhD0o9GoAy2cmnmNDw4OYuPGjejo6MCenIYhvYD3DvzF6eZ5ApMAa4ztflBiAmAhBv/GPHj4a5HN5xANR7Bs2bJpl+i5SbFYrCQDmqZVepeKokxqO5MBexwa9IUQ0HW9UqUxA76qqohEIg61sjHmUsONGzeiUCoiEYvj9K2/cbpZnsEkYPaYAFiIwb8x5k28VCphzpw5WLRoket6/vWUSqUJyUCpVJo2GQCYEDRrujX6ZtAPh8MTgn447J0DosxrfseOHdi/f3+l7bxWGsckYHY4B8AiDP4zZxhGZca/l4I/AITDYXR3d6O7uxvlcnlCMlAoFCbtQsh5A42rtxtfJBJBZ2dnJeiHQt68hZnXhqqq2Ldvn8Ot8SbOCZg9b357XITBf+aEEIjFYpN2VvOiUCiErq4udHV1Qdd1JgNNqBf0o9Eouru7K0F/qjkYXmVOTDQMw3OJsBswCZgdJgCzwODfnHK5jJ6eHt/d8BRFQWdnJzo7O2EYxoQJhFOdTxDkZKCRffc7OjoqQX+q/Rn8QJIkqKqKgYEBTw1huAmTgOZJHP9vDoP/zJk3/UKhgGXLlqGjo8PZBrWIEKKSCGiahmw2G8jzCertu59IJCpb8Kqq6rsEcTojIyPYuHFjZbWCXz9/uzEJmDlWAKilhBCIRqO+KP83SpIktLe3o729HQAmJQPAxC2J/VQZqLcFbyKRQHd3dyXoB5G5VNFrk2HJ+5gANIG9/+bpuo6uri5bS7puv5GaZe2+vj5kMpnKUMFUhxV5MRlo5LCdOXPmQFVVJJPJVjfPdWRZhqqqGBoa8uykRjfgUMDMcQhghhj8m1Nd/l+6dCk6Ozttey23JwDT8fJhRU4ctuMnw8PD2LRpE4cBLMAkoHFMN2eAwX92hBCIRCK2lnrN4C+EgewT69B24hrbXstqbW1taGtrw/z58+seVuSGyoAbDtvxC3PzIq8mr27CSkDjmAA0iMF/9nRdR2dnp23LuMybp5HLo/+mm7Hjo59BbMVyqBeei/YLzoV6wbmQPTLTOpFIIJFIYN68eXUPK2plMuDWw3a8TlEUqKqK4eFhDgNYgElAYzgE0AAG/9mpLv8vWbIEXV1dtr7eyG13YMv7rwYMA1I4gvLAAIxcDrEjl0E9/2AyoLR5r1da77CialYlA144bMcPhoaGsHnzZg4DWIhJQG1MNaklhBCVrVvten5JkpB56FH03/QjGGNjCB2YZxCe2wsAMPIFDPz4Z+i/4buIHn441PPORsfaV6L9ogsgRaOQZPeXXmOxGGKxGHp7e6c9rEiWZUiSNKvKwFT77ptj+m4+bMfLzO2MOQxArcIKQB3s/c/e/QvWolwuo6OjA0cccYS1Ty4EcOBmWdq7D5vedgXyL20AUHuLYSEESnv7IckSlv3qp+i49CJP33irDytKp9M1zyeYLhmoddhOOByeEPTdftiOV23ZsgUjIyMIhUKsAFiEVYDpsQJQA4P/7JlBRdd1W3r/AuNnWpdHR7H3P29A+r4/I7xgPqQ6ywwlSUJk/lwUtu+AHPd+2ToSiaCnpwc9PT2TDisqFosTkoGpSvqmQ4N+9W583KnOfqqqYnBwEKFQCPcvWMskwAKcDzA9JgDTYPC3lnlcq9XM3u3+7/0II7//I0LdXXWDv0kYBmLLl0IYhqd7/4ea7rCidDo95fkE1SRJ8sVhO17F99weTAKmxiuNbGf2/q3sQVbP+M88+jj2fu1bkOJxSNNMQpsuwOuZMZT29R9YOuifJMA03WFF6XQa+Xx+ymQgnU4jnU7bPlmTJjPnyWia5qtDj8id/HnCxiyx928Ns9RcLpdtm/yXefgR7P369dAzY5AkaVIAF0JAGEblf1eTZBml3XsrSwP9FvwPZR5WtHjxYqxatQrLli3DnDlzoCgKCoVCZU9+0zPPPFP5D7WOqqqVDZRqDdfQzPC+PhkrAIfgRWI9c42zlSRJgijr2Pft7yH71NMIdU/urQohgHIZSrs6niAoyvikwaqfRxcvglEoQJRKkAI0xi3LMjo6OtDR0QEhROVsgukOK6pOAo499linmh0Ifjvy2E04FDARKwBVGPytZ5b/rZ41XhoYxPZ//jTSD/wVkqKMB/dDiFwO4XlzMed970bsyOUwisVJjzGKRZT27oN0YPlVEJlH0i5cuBCrVq3CihUrMG/ePITDYRSLRRSLRRgHqigAKwN2M3fL1HXd6ab4Eu/zBzEBIFvYXf4f+tVvMPTL/4MkTxH4D5T9lY52zPv4R9D1D69BcdeuSZMDJUlCeXAI0oHkxO9DAI1KpVLo6+vDUUcdhRUrVmD+/PmIRqNMBlqIwwDUChwCOIBZoT2sKv+bvXNJkpD+20MY+OFPAUNAmmIJnzjQ0+984+vR/cbXIr9+A8r79kNOTT55LtTdDV3ToGezULhf/STJZBLJZBILFiyoe1gRhwmsw2EAe3EoYBwTADD420XXdaRSKUt2ijN759l1z2D7Rz6F4s5dkBNT7zWva2l0vnotet71VgCA0MuILl+C4tbtkA7dn14Cyv0DUBIJX64CsNJMDitiMjA70WgUqVQKmUyGiYBNmARwCIDB3wZWl//N3n9x5y7033ATcs8+XynbH/o4YRhIHHcM+j7/WcRWHAkAiC5eDFEsAVPcSPWh4UoiweDfOPOgoiOPPBJHHXUUFi1ahEQigVKphEKhMGH8msMEzeEwgP2Cfv9nBYBsI8uyJQmAGZj3fOVbSP/tIYS6OqcM1kZmDNHFizD36g8gtnRJ5d+Lu3ePr/WfYpa/oqoo7etHeXBoypUEVF88Hkc8HsfcuXPrHlbEykDjVFWtVFSI7BDoqyvo2Z+dDMNAKpWa1elwZs/fyOcx8PP/Rf+N34eezkwZyIUQKI+Moued/x/aLzp/wu+Lso7YsiUwstlJvyeFwyiPjCLU3TVeQQjoSgCrmAcVLVu2DKtWrcLixYuRSqWg6zoKhQLK5XLlPWZloLZYLIZUKjVh0iVZL8hxILAJQJA/dDuZpcpSqTTr3r/Zy9fufQD7b/wB5LZE5eCfaqJchhyNoOv1l2PuVe9DqKN9wu/HVi4HJBmSNPlyLw8PQznQzqk2EqLmRaNRzJkzB0uXLsWqVatw+OGHo729HUIIJgMNUlUVpVIJAIcB7BTUeMAhALKFLMtIpVKzeg4hBMr9/djz5W+guH0nFFWdMkCXBwbRcekrMe+jH6r8XvXWvqW9/Sjt3TvligEllURp924Ud+5CZGHfrNpL05vusCLzfILqw4oOTQKCPFSQSqU4DEC2CeSVFdRsr1UMw0AymUSiyWV1Zq+wsGEjdn7mC8g8+jggYcpDfkSphNCcHvR+4L1InnLShJ+ZyYKRzSG65HAYY2OTXkeKRFAe1SrBn0MA9jMPKzriiCOwatUqLFmyBF1dXZAkiVsSHyKRSCCZTHIYoAWCGBcClwAE8UNulerZ/832/quX4u2/+acYvesehDo6pn2s3NaGnv/vTVDPPavy74dWCWJLj4A8xVJESZKgpzOIzO2FODDbmkMArWUeVlR9PkFPTw9kWWYycEAqleJqgBYJWnzgEADZopnx/0rpvlzG0K9vwdCvbwFkCVJ06m2Ex08DzGHfDTchu+4ZpM4+E+0XnovEccdMeJyRy6G0tx9KcvJGQHI8huKefShs3Y7YsiXcC8BBiqJMOJ/AHCbQNA25XG7SyYVBWVGgqip2797tdDPIhwKVAAQtu3OCYRiVDWNmyryxZ/72EHZe82/Q0+m6u/NJioJQRzvGHnsCI3fehZ3XhJE6/VSoF5yL9gvOQdtJJ0COxxFbcSTymzZDqWqXwPgqAH1gAOG5vTNuL9lHkiS0t7ejvX18Qmd1MhC0w4rM71OhUOB8gBYI0gZBUtuC0wMx6Mngby+zNFksFjF//nwsWLBgRr9v9rxz61/C7muvw/Dtf0Cou6up3riRL6C8fz8gyUiedgrUc87E2N+fRPqvDyHU2THxsbkcYitXYPlvfo5QV+eMX4ta79CTC4GJWxJX80sysHv3buzZs6dyqNbZu4MRoJwUhCQgUBUAao1myv+SJKGsadj9hS8j8+jj0wd/RYHIFyCFp7905VgUkUULAQD5TZsx9uQ6hLo6oRxYHjjhdUNhlPf1o7B1O0JdnRwC8IBUKlU5sCiTyVSSgbEDkzz9eD6BqqrYs2eP080gnwlEAsDef2sIISqzlmfyO5Ikwcjn0X/D9zH061sQnts76Xhf83F6Oo34kcsw9venYOTzCPX0QGmbfphAjkQg93RP+3MpHEKxfz+UjoN7AZB3BOWwInNVTalU4jXaIkEYCvD9gBKDv/1ms/mPeTMb/NkvMfx/t4yv9Z/q8BNdh5EvoOPiC3HUX/6Eo598EId988tIvuwklAYGUdi6DfqBm/5MiFIJseVLAZ3LrLzOPKhoxYoVOOqoo9DX14d4PO6b8wm4KVDr+T1+BKICQK0hhJhxAmAUi8iv34DdX/wKAIzv9jcFPZ1B/OijMOddbwcAxFcsR3zFcsy7+gPIb9yE0T/dC+1P90G798/QR0fHS/6NtEWWUdq7D4XNW8cTAfKFRCJRObAol8tN2HjIMIzK+QShUAgbNmzA8uXLnW5yXRwGIKv5OgHwe/bmJmb5f6br//PPv4itH/gwxrY+j8SiFdOW/uV4DHM/cAXaTloz4d8BILZsKWLLlmLule9FYdt2aH+6bzwhuOd+lAcHoHR0QGlvn7J0KikKSoNDlRMBOQfAf2odVlQoFDB37lw8++yziMfj6Ovrm9X5FXZKpVJIJBIol8u8RlvIz0MBvh8CIHvN5uhfoeuIrz4WC7/4r+j78CcQ6upEYdt2FPfsrWzMgwP7xXe+5lXofssb6h7dG118GOa85+1Y9ssf45inH8GSH9+ErtdeDlEqQUyxm5rQdUQPPwxGPl/zeckfDj2s6IgjjsDw8DCEEJgzZw5GRkYqj3XjrpA8Ipis5NsEgL3/1jIMY+bj/wf2flfPPRuLv/llHPPUQ1h5z+8x76MfQnjeXBS270B21wYkTz4BPe94K4CZ3ZQjC+ah521vxhE/uAHdb30jJEWe/PuShPL+ARR37prx85O3RaNRdHV1IRQKoVQqYdOmTUgkEnjuuecAuDMZVFWV2wI7wK/xxJdDAH79sNxKCIF4PD7r0/8AQD3nTKjnnAlcdy3Sf30Io3fdjY6LLkBi9fjufk3tC5DLQQ6FIYqlSUcJS7KM0tAw5NjkrYLJ38zhnlWrVkHXdWzbtg2bN2+GoijYtWsXOjs7mz7Pwi6qqiIej0PXdVcmKH7mx6EA31YAyH6zKf83IvXy07DwC/+C5BmnTrmXf6PkeBxSLIri3n2TfiaEQPSwRSgPj0Dwphoo1Z+1oijo7u6ujP/PmzcP+/aNXy9uqwpxGICs4rsEgL3/1mum/D9Tzd6Ezd/Th4YR6uyc8nnKoxrKw6OQFMV1N3tqnfb2dqxcuRK6ruP555/HEUcc4cp19xwGcI7f4ovvEgBqLSEEYrGY7QlAszdhc5MhUS5DSU3eoEiSJOhDQ5APHDjktps9tY6Z/C1YsAD5fB4vvvgiduzY4XCrJlNVFbFYjMkqzZqvEgC/ZWdeYJb/3Rw4pUgEiqqitHffpHYKIRBe2IfSvv7KSgAKJkmSKqsBzF33SqUS8i67LiRJmjAMQK3lpzjjqwSAWscce2xF+X82hBDjE/3698PITX0jN7I5iHweMntVhPEAO2/evMrJluZRvG66NqqHATgPgJrlmwTAT1mZVwghEI1GXZ0AmDrWXozuN78B+lgWha1bxyf9mecLjI5CitXeX4CCpbu7G0IIDA8PY968eSgUCq66NlRVRTQadVVSEiR+iTe+SAD88mF4ja7rUFXV1WeUmzftzssvxdKf/QDHPvsolvz0ZnS+ei1EqYTC1q2QQiGU+/dB19IA3NXTo9YyhwEAYOHChchmsxgaGqrMBXDLtSHLMlRVnXC+AbWWH+KOe+/c5FpmydFMALwk3DsHPW95I5b86Ls49tnHsOyXP0HX618NI1+Aoo5vY+ymnh61npkE9PT0IJVKYXBwEKqqIp1Ou+raqE4AOAxAzfB8AuCHLMyLhBCIRCKeSwCqhTo70PWG12LJj7+HJT/5vtPNIReaN28eZFmGoiiuOyNAVVVEIhHXVCWCyOvxx/MJADnD7P0rUx3d60HygRspb6YEHKwCJRIJ5HI57Nq1a8I5AW6gKAqHAWhWPJ0AeD378iIvl//rkSTJVSVecl65XEY0GsXixYtRLBadbs4kHAZwnpfjkKcTAHKGEALhcNh3CQBRNSEEkslkZSlgqVRyukmTqKqKcDjMyhU1xbMJgJezLq8ze/+hkC/PkiICMF4RyuVy0DQNuq6jra3NdVvwhkIhDgO4gFfjkWcTAGo9P5f/iaZSKpVgGAbmzJmDfD7vyiWvHAagZrnvam6AV7MtvzB7HUR+JoSAqqro7OxEOp12ZfAHwGqcS3gxLrnziibXMnv/4XDY6aYQ2UqSJJRKJWQyGWSzWSQSCaebNCVzPg6HAWimPJcAeDHL8gOztGge/kMUBJqmVY4E3rlzp9PNmVb14UAcBnCO1+KT5xIAcpa59pgoCDRNq+x1ceyxxzrcmun5aU8Oah1PJQBey678xiz/RyIRp5tCZLtyuTwhAXAzc1dODgM4z0txylMJADmD5X8KouryvxdwGIBmyjMJgJeyKr9SFAWpVMrpZhC1hFfK/6ZUKuWJakUQeCVeeSYBIGfpuo5UKuW6A1GI7KDrOtLptKcCaiwWQyqV4jAANYwJANVUXf5n75+CQtM0FAoFz5T/TalUisMA1DBPJABeKaf4mSzLHP+nwNA0rbLxjxfK/yZVVV27YVHQeCFu8UqhugzDQDKZRDwed7opRLYzDAPpdNqTu+vF43Ekk0nXnVlA7uT6BMALWZRfcfY/BZGmacjn854r/5u4GsA93B6/XJ8AkPMkSWICQIHh5n3/G6GqqmeTF2otV1/lbs+egsAwDLS1tbl2H3QiKwkhoGlapfzvpfF/UyKRcOXRxUHl5jjm6gSAnMPyPwVROp1GLpfzfA+awwDUCCYAVBcTAAqK6tn/XsbvLDXCtVe6m8smQWGW/9va2pxuClFLeL38bzK/txwGcAe3xjPXJgDkHJb/KYjS6TSy2azny/8mDgNQPa5MANyaLQUREwAKCk3TfBP8AX533caNcc2VCQA5TwiBRCKBZDLpdFOIWkLTNITDYQDeLv+bkskkEokEhBBON4VcigkATWCWCkulEnsQFBiZTMZX5X+TqqoolUoAOAxAk7kuAXBjmSSIhBBMACgwNE1zugm2UFWVFQAXcVt8c10CQM4zy/88/Y+Cwi+z/w+VSqU4DEDTclUC4LbsKGg4+5+CaGxsDGNjY75Y/z8VrgZwFzfFOX9e8TQrhmEwAaDA8Gv536SqKvcDoCkxAaAJhBCIx+NMACgw/Fr+N6mqing8zmEAmsQ1CYCbyiJBxPI/BVE2m0Umk/Ft+d/EYQB3cUu88/dVTzPG8j8Fid/L/yYOA9BUmABQhRACsVgs8AmAEILl0oDwe/nfpKoqYrEYr2uawBUJgFvKIUFnlv/9thnKdCqB/pCb4nR/P2+e/pLL5QJR/gfGr+nqYQBynhvinv+vfKrLHBMMQvnfDPrCMCBJ0niwlyTo2SwAoLRnL3IvrIeRziC/YRNyL6yHOLCTmpkYiPEnmpQ4kLdomhaosnj1MADnARAAhJxuALmDEALRaNS3CYDZe6/07iUJ5ZFRFLdvR/ovDyHz0CMoDw0DQiD33AsI9XQjPLcXolCEHIshtmoFkqefivZzz4LS0Q4EpEriZ37b+78eVVURjUYhhAhMlY9qczwBcEMZhABd19HV1eXLcuihwb+4azcGf/6/GL7ldpSHBpF/aRMiC+ZBlHVACEjxGMoDgyju2AlJUSAnEkg/9Aj2fv16RBcfho7LL0X7Ky9A6hVnQEm2OfmnUZPy+TzS6XQlAQgCWZahqiqGhoYq8x7IWdGb16Lwrtsde31eBQFnlgJ1Xfdd77+6pyNJEoo7d6H/xh9Au/fPyK/fADkRh9B1RA9fBAhAqg4GigLlwEmIwjCgtKsIdbRDCIHBX/waw7+9HZ2XXYKe97wNbcevnvR65G5BK/+bVFXF/v37EQqFcP+CtTh7t3PBh5zHBIAghEAkEvFVAlAdjPVRDft/8P+w7z9vgCiXAEmCoqYghIAcCh0Y1J/eoUFdjkYhikWM3HkXCjt3oeftb0bH2oshH0ggmAi4X1Bm/x9KVVVEIhFeowTA4UmALP+7g9n7VxTF6aZYxry15dZvwM5//SJ2//tXIAoFSOEw5Ehk/DFN3AAlSRofFojFIHQd2j33Y+uVH8HgT39hYevJToVCAel02lfXe6MURYGqqtB13emm0AFOxkH/DfhSw3xd/geQeeQxbHn7FRi59XYoyTbIiTgkC+c4SJKEcE83JEnCzmv+DXu+fj2ErkOSJC4ZdDFN0wIdAKsTAK4GCDYmAAEnhEA4HPZdAqDdcz+2XvEh5F7aAEmWIdnY25NjUUghBYM/+yWGb7kNAJgEuFhQy/8mVVURDod5fZJzCQDL/+5g9v79MCvYvKFln30ee7/xX8hv2QYllWrNi0sSCpu3Yte/fwV6OtOa16QZKxaLgS3/m0KhEIcBXMapeMgKQED5sfwvSRLKg0PY9S9fQP6F9Qh1dVpa8q/32qHODuSffxG7v/yNyr+Ru2iaxt3wwGEAGscEIOBCoRBSreol20yUytj/w59g5I67Kjv9tVpkwXwM/uR/kP7rQ+NtYpnVVTRNq/T+g1j+N6VSKV9U/Wh2mAAEmNn7jxyYFe91mccex+hd90BJtrWs5z8lw8DQ//4GRr4wq7kA5u9V//dUZxdQY0qlUuDL/yZz2S+HAYLNkbskx/+dZZb8yuWyb3r/5ZFRDPy//0F+/UbIDv9NolTG6N33obh7T/PPIQQkAMKYuJmReXbBoUkFKw31aZqGUqnEoZkDUqlUZTiEwwDOcyIusgYUYOaaYD/IPvEUMn99EEYuB6Ut4Whb5HgM+RdexPBvbsX8f756/B+FqHt+QHUQPxj0ASOfR7l/AOVMBrlnn4MciQKyBFHWEe6dg7ZTTqzsbdDoawURy/8T+W3vD5o5JgABZZb/o9Go002xRPovf4ORzUGOOL+3uxACkUULMXLHXZj/0Q9BkuVKj77W71T3TIu79yL//IsYvu33KG7bgcwjjyO8YB5Ke/ZBHxlB9PDFQCgEfWgYSmcHUqe/DOoF56D9lRfyfIIplMtllv8PYR7+xfcluJgABIw/y/8jGLnzT+M9XxdMbJIkCUa5DFHIo7R/AOG5vdM/WAgIHOzxlwaHMHLLbdj/o58i9/wLkJQQRLmMUEc7yv37IYVDCM/thT42BlEuQ5Jl6Ok0Bn7+v+j/3s2IH30UOi+/FB1rL0bi+NWQ47EDLxPsrV81TUOxWPRNwmuVVCqF4eFhKIrCswECqOVzADj+7w5+Kv+PPfp3lHbsguGi8V05FkPuuReh3f+XaR8jDpTqzTYP/fY2bHrj27Dzmi+gsGEjFFWF3JZAqKMdACCFQpXJjZIsQ45EIIVCwIEdCSOLD4MxlsXgz/4XOz/7eQz8+GfjJxyCSxKre7ks/x/EYQB3aXV8dL67RC2n6zqSySRisZjTTbFE9qlnIEUjQKnkdFMOEgJSKIT8+g3jPfVDKhPVPfLi7j3Y+43/Qv93boLSrkJOxGc0098M7eaKA1EuY+ypZ1DYsg3Zdc+g9/3vRvzoVYByMN8PUkKg6/qE8X86KBaLIZlMYmxsjO9PAHEZYIBUl//90vs3sjmMPbVu/P+47AYmtyUw9venIIVCB5fwmQ7877EnnsLOT38OAz/6KZSuDkix6KyW+UmSBDkcRqhdhTAMDP3qFuz4xDXIb9hwcBVBwKTTaRQKhUD+7Y1QVZWrAQKKCUAAybLsmwSgsH0H9MEh6OmM627wRmYMRi6L8sjI5OArgLHHn8CW914F7b4HILe1jZf0LfwbJFmGHI8h/eAj2PSmdyLzyOPj/+6y98lumqZBPjB0wvL/ZKqqVt4fCpaWfuoc/3eeYRhIJpOIx+NON8USRj4P4dLNTOS2BHLPPIf8hk0AJi7z0/50D7ZeeTUKGzdDUhTbNi6SQiGEurugp9PY+63vIPvsc5W2BGHvACHEhMN/aLJ4PI5kMgnDMJxuCqG1cZJpX0D4sfwvDAMim0Vx1+7xcXMXqUzwC4WhdHRM+Fl23TPY85VvIb9pC5QDE/zsJEnS+OZEf7gL/d+9ufJvQaBpGvL5fGD+3mZxGCCYmAAEkB8SACEEJFlGaWAQhY2bXbfxjSSNb9SjdKgobd9R+bfCps3YdtXHkD8wy79lhxUpCuR4HAM3/wRDv7610h6/qy7/0/T8cE+gmeM3I0DM8n8i4exOeVYq7tgFpbPTlfvjS+EQ8hs2wSgUAQD5zVuw5xvfRubRvwOK0vIALEejCHV1Ys+Xv4HSvn0A/L+FcHX5n+P/00skEhwGCKCWJQAc/3eOH8v/ZvAUho5QT5fDrZme0q5CTiYBAP3f+R7Sf/4LQt2dzvW+FQXloSGM3HYngINLB/1I0zTkcrlAVDqswGEA92hVvGQFIGD8kgCYlGQKxR27nD39bxqiVBrfslfoyDz+BPq/+0PomTHIDu5GJ0kS9HQa+3/4U+ijmmPtaIWpyv9+TXas4Ld7A9Xnvrsm2cIwDLS1taGtzR/7xFeOyM3lXFn+P0igsHEzBn/6S8Bwx2oFOZHA2MOPYvj2Ow/+o6vfw+ZUl/9XrlwJoGqzJB/+vbNl3h84DBAcTAB8zo/lf+DgEICcSiK6eBGEC29aUjgMUSoj8+AjSD/wVyhdDpb+DxFeMB8jv70NwIGg6HB7rJZOp5HNZivv91ve8hY89dRTAA4eq8wkYDIOAwQLE4AA8VMCYAovmI9S/4ArhwAAoDw0jPSDj6A8OAQ57PxJhYC5LLCE0r5+lPr3O90cW2iaNiHZ+uMf/4hTTjkFn/nMZzAwMADgwKFNhsFEoIof7xE0vZbcNTkB0FlCiMosX984cNM2N9Fx403cDEDGWNZ1CYqcSCD71DNI//Uhp5tiC03TED6QcJ177rkIh8OIRqP4yle+gne/+934zW9+A2B8V0xWAw4yVwnx/XBeK+Kmu+5KZCmzhFcqlXyX2Zu3p9jKIxFdvhTiwFI7t5EkCZLiwq+ZEJCTbcg89AiMQnE8WfHJTT+TyUwo/wPjn0MsFoOqqnjggQdw1VVX4eqrr8bw8DAMw+DcgCqqqqJ04GAtDgP4mwvvTGQ1IYTvEgBTqKMD5cHB8dMAaUYkWUbumechRyOVnQv9QNOmX92gKApCoRAKhQKuv/56nHfeebj99tuh6zqTgANUVQ38exAUTAB8ziz/p1Ipp5tiDwloW3M89NFRp1viOUY+DyOXRf6lja6ZnGiF6tn/55577pSPkWUZ3d3deO655/Cxj30MV1xxBYaGhiYNCQQxEKZSKQ4DBAQTAJ/y6+x/kyRJEIYBORpFZGEfYLDnNlNyWxvym7bAKBQA+CPYjY2NYWxsrKHtfyVJQiqVwvDwMH7xi1/g5S9/Oe69916k0+nAzwvgaoBgsD0B4ARAZxmG4csEAAfOAhBCIHnmGeOH6gT4hj1TQgjAMBBqb0d0yRHjZyv4oApQq/w/FXNJYCKRwAsvvIA3v/nN+NrXvobh4eGDu00G8LpSVZX7AbiA3fGTFQAfE0IgHo/7MwE40EOTJAnRRX2+Gb9uFUmSYGRziCxeBH1U80XwBxor/0+np6cH2WwWP/jBD/Ca17wGmzdvriQIQLASAVVVEY/HA/U3BxETAB/ye/nfZN6YE6uPhXrOmTAyYw63yGNCCkQuByObdbollshms8hkMrM6/S8ajSKfz+Ovf/0rzjnnHNx5550o+GiIZCY4DOB/TAB8zLfl/ym0nXQCFDUVuJt0s4QQUNraIMXjiBy20OnmWGKm5f/pSJKErq4ubN++HR/5yEfw9a9/HcD4xMEgXV8cBvA/JgA+JYSorHsOgvaLzoc+NuabUnYrlAeHEDtyGeRIxBeBbTbl/0MJIdDd3Y39+/fjO9/5Dr785S9XlgoGhaqqiMVivrg2aGpMAHzKLP/7/YZl3pxiSw+HevYrUNo/4HCLvEGSJOjaKNpOPrHy/70sl8vNuvx/KEmSIMsyNE3DNddcg9tuu63ysyAERUmSJgwDkP/YmgBwBUDrmWN1QSn/m8sBIclIvvx0KMkkhO6OU/fcTAiByGGHIXXay5xuiiU0TbOtXB2NRlEul/Htb38bTz75pC2v4VbVwwCcB+AMO+MoKwA+JIRANBoNRAIAoLICoPOyi6F0dQAu23ffjfSRUaRecQaiSw53uimWsLL8fyhJktDd3Y2nn34aH/zgB9Hf3+/5ikmjVFVFNBoNRMUjiHin9CFd16GqqqXlUC+ILOxD6vRTYeRyTjfF3YRAeXQE7a883+mWWCKfzyOdTkNRFNtewzw58KGHHsI3v/lNDA0N2fZabiLLMlRVhc6qmi8FK0L4nFmiMxOAoDB3bZPCYXS/5Q2Q2WOZlrnnf/Sww9BxyUVON8cSdpb/q0mShGg0ijvvvBO///3vbX89t6hOADgM4C9MAHxGCIFIJOLfvf/rUM85C/FVKyEOrN2mQ5TLEIaB7je+DqGuTvghTbKz/H+oZDKJXbt24dvf/nZgqgCpVAoRn6wUoYmYAPiM2fs3b4hB1H7hedC1tNPNcCUjn0d47lx0XHYJAEDy+E29UCjYXv6vJkkSyuUyHn30Ufzud79ryWs6LRQKcRjAp5gA+ERQy/+mymoAAMkzTkVoTg+MPKsA1YQQkJNJtF9wDhLHHzf+jx6fzKZpWssDk6IokGUZt9xyS0tf10kcBvAnJgA+IoRAOBwObPlfkmUIw0DyZScj9YrTAcFdzKrpoxoSxx6Nnre9GUoq6XRzLNHK8r9JkiR0dnbiz3/+Mx577LFA9IxTqRTC4TCHAXzGtgSAewC0ntn7D4fDTjfFEebhQEIIdF52CWSeaV4hSmVA19H1htcitmK5082xRLFYbGn5v5okSRgdHcXdd9/tyOu3Wjgc5jCAg+yKp6wA+EB1+T+ovX/gwDDAgf9Onf0KhLo6Ae5lPp4YRcLoetPr0Xn5pZV/8zpN0xzdpU5RFDz00EOB2S8/lUpxGMBnmAD4iDlZJ8jMDVrCvXPQ9YbXojw45Plx7tkQQqA8OIT4sUdj/j9fDUVVK5USr6vu/beq/F+to6MDDz30ENavX++LhKqeoE8u9iMmAD5h9v4jkYjTTXGNzte/BqHeOTCKRaeb4hgjm0Ooqwu9H3gvYsuXAfD+vv8AUCqVoGmao+V3SZIwMDCAhx9+2BfvaT3m8mIOA/gHEwCPM0tx5uE/dLC8He7uRPzI5RCF4CUAQggIIRBqV7Hgs/+M9vPOdrpJlkqn0yiVSo4GXvM6e/zxxyf8fz+rPhyIwwDexwTAJxRFYQJwgCRJELoOpb0dHZdfCqHrgbg5VzMyGcjxOLrf+o/oveJdkEIhX70H1b1/J8r/pjlz5mDLli0ol8uBqAKoqhqISY9BwQTAB8zyfzQadbopriEduEl1veG1SBx3DESAjjQVhgE9M4a5V12B3ve/e/zffDLuD4xXu5wu/wPjiaamaQCA/fv3O9qWVolGoxwG8BEmAB7G8v/0KsMAPd1IrD7Gdz3gqQghIMplSKEQ+v71U5j7wfch1DsHAOCP0D8unU6jWCy6IqEpFAqIx+OYP3++001pGQ4D+AcTAB8wT+yig6qDQ9eb/gHl/QOuCBi2kSToQ8MIdXdh7gffhwWf+fikn/uFW8r/Qgh0dXUhm81W/r/fk0wAgTxp1K/4KXqcWf6PxWJON8V1zJtx6tRTkDrr5eNLAn2qPDyCcN989H3hGsz90PsAHCj7O9wuqxmG4YryPzCeZI6MjGD16tWVioSvk8wDYrEYhwF8ggmAR7H8PzMdF18IOdlWOS/AL4xiCUIIqOedjSNv/zU6X3UpUD3c4bOApGkaCoWCawKtJElYsWJF4E7L4zCAP9iSAHAb4NZh+X965rbAAJA87RTIsRjgl5u0LKO0fwCSLKH7Tf+AI276NmJLl1R+7NfeqKZplfKzk+V/YHwr4uOPPx4XX3wxAH/sr9AoDgO0nh1xlZ+ghxmGgWQyiXg87nRTXEuSJEAItJ10AtovvhBGNuvpGXHmOHN5aBjJl52MJT/6Lvr+5VMIdXZUfu7XQCSEmHD4j9NtAYB58+Zh3rx5E/4tCOLxOJLJZGC2QfYrJgAexPL/DB0IiJ2vuQzh3l6IsjfHLo1icXxnv84OzP/41Vjxh1ugnnc25ES8Enz8GvyB8d5/Pp+f9m80DAODg4MYGBgAAFvHqHVdh6ZpuPLKKwH4O/GaDocBvI8JgMcxAWhc6szTIUWjQNXQgBcIISBKJejpDNovOAeHfe06LPjMxyEdOPUxKMGnuvxv0nUduq5DlmWEw2FceumluOGGG3DJJZcgl8uhaMM20EIIpNNpXHTRRbj00kstf36v4L3H+5gAeJRZ/k8kEk43xfXMYC9Houh+4+tQ3LHTMwHTODC7PNTVhcP/+1tY+rOboR7Y1tccDvDK3zJb1eX/0047DQMDA+jq6kJfXx/6+/tx2GGH4ZprrsGVV16JT3/603j7299e2ajHasuXL8cnP/lJTyWSVkskEhwG8DgmAB7D8v/MVU8G7LjsYsSOXA4jn3e4VfWV9u6DFAqh8x9eg2W3/Bw9b3kjgAMJzYHAH6Tgn8vlKn9vZ2cnPvWpT+F3v/sdPvKRjwAA+vv7sWHDBgDAypUrceONN+J1r3sdQqGQpZWAfD6Piy++GGeffXbl2grK53AoDgN4GxMAD2MCMHPRpUuQWLO6Uj53GyFEZSvfxAnHY8nNN2DBZz9emeHv1+V99UxV/n/Pe96DVatWYe3atVizZg22bduGu+++G7t27ao85rvf/S4uv/xyZLNZpNPppgO1EALFYhEDAwM488wz8Y1vfCPwwR/gPcjrmAB4kGEYaGtrQ1tbm9NN8QzzZi3Houi49CLXVQCEEBC6DiMzhsiC+ZhzxTux4q5boZ53DkLt7RNKzUEMONXl/5e//OXo6empnH3R0dGBNWvWAAA2btw4IQHo7u7Gtddei8997nNIJBIoFotN79gXi8Xwpje9CTfeeCOAYM36n455H+IwgDcxAfAQlv9nxwybHZdchMTRq2Dkco62ZwJdR2n3HqTOfjkO++aXsejfPwelbXzjoupeZhCDfzqdRjabrfzt6XQaL3vZy7Bw4UIA44H4hBNOAADs2rULjz76aOV3hRCYN28errnmGvziF7/A8uXLkc1mUSgUGgpa2WwWAwMDyGQyeNWrXoWPfexj6Ovrq/w8iJ/HoTgM4F1MADyKCUATDlQBQl2dSJ5xGiDLjvfiRKkEUdahdHZi8Y3/ieW//hmSp548/rOAjfNPR9O0Ce/BnDlzJqy9j0ajOOWUU3DUUUdh+/bt+OMf/4hNmzYBGA/QZqC/8MILccstt+DDH/4wuru7MTQ0hGw2C13XUSqVKs+XzWYxNDSEYrGI5cuX421vextuvfVW3HTTTTjxxBMr2xAH/XMx8V7kXc7vqEEzIoSozL6lmanuSXe9/nLs/da3EerpdmQcVxgGdC0NpS2B7re8AT3veCviK4+csq1Bp2kawgfmbJx77rkYGBio9PjN96i3txdLlizBCy+8gE2bNuGZZ57B0qVLJzwGABYuXIhrr70WH/vYx/CTn/wEd955J7Zs2QJZlrF+/XqkUikcc8wx6O7uxpFHHokLL7wQq1evRm9vLwB+LlMxVyOVSiW+Nx7DBMAjzNJaqVRCd3e3w63xpupJW7EVR0I9+xVIP/A3hLq7WvL65msLXYfQdUQW9WHBZz+BzlevhXxgPDsIG/rMRCaTQTabRSQSATC+/W5PT8+E8r8kSYjH41i8eDEkSYKmabj33nvx6le/GsDE91IIgUgkgu7ubnz4wx/Ge97zHhiGgeeeew79/f2YP38+wuEwkskkenp60NnZOaE9/Fympqoq9u7di0gkgvsXrMXZu293uknUACYAHiOEYMltFiRJgjAE5HgMnZevRfbJda3r1QkBPTOGSN98dFy+FvM+/EGEujorQZ+9y8kOXcdfLBZx7LHH4oQTTpjwfvX29uLoo4/GokWLMDg4iN/97nd4xzveMelx1UtCAVQqaaeddlqL/iJ/UlUVe/bscboZNEOcA+AhZvk/lUo53RRvOxBj1YvOQ3hhH2D3NABZhp7NorS3H22nnoLDv3s9Fn7hmvHgr+uVyYkM/pNVz/4/55xzoOs6Lr/8cui6PimYL1q0CPF4HLquY+fOnbjjjjsATH5fD51QWZ2AUXNSqRQSiQTfQ49hAuABnP1vLfPGHz1sEZKnnQJjbMyW1zHX9BvZLCIL+3DYV/8NS3/yPSRPPeXgg2Q5cGv6GzU2NoaxsbHK+n/DMNDX14e1a9dCUZRJFZOFCxdCCIFwOIy2tjb8+te/rkzuO1T17wV5hYWVuBrAe5gAeIhhGEwALGL2VLpecxmkcMjyA4KEYUDk8xDlMjpffRmW/eJHmPtPH0Cos3PCOnQGnekdWv7PZrP4wAc+gKOOOgrA5PduzZo1mDdvHqLRKMLhMNatW4fvf//7yGazLWtzkKmqyv0APIYJgEcIIRCPx5kAWCx11isQXbYEoly2rnwpBPRRDaG5c9F37Wex+PqvIrZ82fiPDINL+xpUXf4/6aSTsGzZMrz//e+v+TurVq3CwMBA5f01Z/mT/VRVRTwe5zCAhzABcDmW/+3X+apLoc9im1iTKJdh5AsQsox5V1+Jox74I3rf+46Jp/bJ/Mo1IpvNIpPJVMr/0WgUX/ziFyvzX6YLMmZ1ABjfIfDZZ5/FrbfeWvk3Bid7cRjAW3g38giW/61VPYFMPe8chBfMhyiVm30y6OkM9LEs2k5YjSO+ez36Pn8NQu0qy/1NOrT8/2//9m+47LLLap6AWCqVsGjRIvT29o5v+BQKob+/HzfeeCOeeOIJAPwM7MZhAG9hAuABQgjEYjEmABYzg0HbCavRcdH5EKXSjCbkmcHIyOcR6u5C3zWfwOJvfx3tF5w75etQ46rL/48//jiuvvpqKIpSc/gkHA4jkUigp6encvpfJBLBjh078OMf/7hlbQ8yVVURi8VYafEIJgAeYJb/GUjs037xhZCT43vvN8rIZiHJMlKvOAPLfvM/mPfRDyF6xOGBP7hntnK53ITy/zvf+c6GfzccDqO/v7+yXa8sy2hvb8cdd9yBu+66q/I4Bih7SJI0YRiA3I0JgIuZY2gs/9vHDATJ006B0q5CFAoN/V5hxy5EFi7Egs9+HEfcfAMSR6+sPB+D/uxomjapjFwvYJs/P+qoo1AsFivVA0mSEA6HsXPnTlx77bV46qmnKv9O9qgeBuA8AHdjAuBy5mEn3PzHHhLGZ+aHOjvQcclF0DNj0wYbUR7fwlcYBuZd/QGsvO8O9Lz9LVCqjmVmWJm96vL/scceC6B+wDZ/nkwmccwxxyB3yEmPsVgMjzzyCH70ox9V/o1VAHukUilEo1G+vx7ABMDldF2HqqqVkiZZSwCVmfndb30jwr1zAH1y79PI5aCPjaHt5BNx2Neuw2Ffvw6hdhVSKDTxRsee5azk83lkMpmmr/ctW7bAMIxJFYRQKARVVXHrrbfi2muvBTB5J0CyhqIoUFUVum7t3hpkPSYALmWWznRdZ+/fRtWrAcJz5iBx7NEQB8YvKzP4dR1CNzD36g9g8fVfRdc/vGbCz1lOto6maU0FDvMzTKVS2LRpExKJxKTHhEIhDA4O4rrrrsPPf/7zyr/z87NeKpWqfI4cBnAvJgAuZp5cxvF/e5lJQKi7C11vfB2MYhGQZRjpDKRQCG0nn4AVf7wVCz/3aUT6FkwI/Awe1kqn05PK/40wP4eenh709fVVVgEcKhKJQNd1fOQjH8HXvva12TeYpqSqKiKRCKsrLscEwMXM3r95QyT7mAGk41WXoO3E45Hf/BLCCxeg7/OfxRE334i2E1YffCzYa7RDoVCApmlNlf/NQLNu3TqMjU2ex6HrOgYGBjA4OIh58+bhsssuw8qVKyvJHAOVtUKh0IQqALkTI4sLVZf/2ftvDbNHr7S1oW3NakT6FqDvmk8gunTJhMcADP52Mcv/s0l4y+UyNmzYgO7ubpTLZYyMjAAADj/8cLzxjW/ExRdfjIsvvhjhA7szkn1UVcXg4CBCoRDuX7AWZ+++3ekm0SGYALiUeaoZE4DWkCRpfJ9+WcaiL/8byiMjCHV0TAj6DPz2arb8DxxMynbt2gUAGBwcxPLly/G2t70NF198MV75ylda21iqS1VVhMNhzpNxMSYALqXrOtrb29lTaaHqffpDHR2VhIDsVywWmy7/VxsZGcFVV12Fyy+/HOeff75FraNmhMNhpFIpjI6OchjTpfipuAzL/+7B4N866XQa5XJ51gnABz/4QYtaRFZQVRVDQ0McBnApW+5whXfxQ54tc90yURBU9/5nWv43cSKf+6iqyt6/ReyIq+ziuJA5+z8SiTjdFCLblctlS8r/HGd2n0gkwtUALsYEwEXM8r95+A9REGiahlKpxADuU9WHA3FTIHdhAuBC5laaREFgRfmf3ItbmbsXEwCXMcv/0WjU6aYQ2U7XdUvK/+Re5mFmHAZwHyYALsHyPwWRpmkoFoss//schwHciQmAy8iyzASAAoPl/2BQVRUyl9W6Dj8RFzEMA6lUCrFYzOmmENnOMAyW/wMiFoshlUpNOqaZnMUEwAXMklipVGLvnwJD0zQUCgWW/wNCVVWUSiUAHAZwCyYALsLyPwWJpmmVsjDL//7HYQD34afhEoZhIJlMIh6PO90UItsJIaBpGneJC5B4PI5kMslhABexLQHgdsCN4ex/CiJN05DP51n+DxiuBmiOXfGUFQAXYQJAQVFd/qfg4D3OXfgNdAGz/J9IJJxuClFLVJf/Of4fHIlEgsMALsIEwEEs/1MQaZqGXC7H8n9AcRjAPZgAuAQTAAoKlv+Djfc69+C30GGGYaCtrQ1tbW1ON4WoJVj+DzbzfsdhAOcxAXAIy/8UROl0GtlsluX/gOMwgDswAXABJgAUFJqmMfgT73kuYWsCwL0AahNCVGbFEgWBpmkIh8MAWP4PMnPVkxDC6aa4np1xlBUAB3DvfwqiTCbD8j9V8GwA5zEBcJAQggkABYamaU43gVxEVVVWABzGBMAhZvk/lUo53RSiluDsf6qWSqU4DOAwJgAtxtn/FERjY2MYGxvj+n+agKsBnMVvo0MMw2ACQIHB8j9NRVVV7gfgINsTAK4EmEwIgXg8zvI/BQbL/zSVVCqFeDzOYYBp2B0/WQFooUPL/5wNTUGQzWZZ/qcpSZLEYQAH8RvpAMMw2PunwNA0jT08mlYqleIwgEOYALSYEAKxWIzj/xQYLP9TLaqqIhaLMUl0ABOAFiuXy0ilUiyHUiDkcjlkMhle7zQtWZaRSqUqwwDUOi35VnIi4MGxLc7+pyDRNI3lXaqrejUA5wGMa0XcZFreQkIIRKNRJgAUGOl0muV/qktVVUSjUQ4DtBgTgBbSdR2pVAqKojjdFCLb5fN5pNNpXu9Ul6IoSKVS0HXd6aYEChOAFjBLWrqus/dPgZFOp3lDp4apqlq5XjgM0BpMAFpECIFwOMwEgAKDs/9pJlRVRTgc5jBAC7UsAQj6RECz92/eEIn8rFgsQtM0lv+pYaFQaEIVIMhaFS9ZAbAZy/8URJqm8UZOM8ZhgNZiAmCzhQsXwhACIZb/KUBY/qdmqKqKUDgMQwgsXLjQ6eb4HhMAm33zxQfQlkgglUxyfIsCoVQqsfxPM2bOk0olk2hLJPDNFx9wukm+19IEIIjzANrlCFKpFIaHh6FpGg8AIt/TNI27utGMSZIETdMwPDyMVCqFdjnidJMc0co4yQqAjcKQ8LYlJ2H//v2QZRnhcNjpJhHZrrr3z/I/zUQ4HIYsy9i/fz/etuQkhMEOk52YANioBIFfbXkSiqJAVVWee02+Vy6XWf6npgghEI/HoaoqFEXBr7Y8iRJ4v7QTEwCbZVDGggULMDY2hkwmwyEA8jVN01AqlXid04xJkoRMJoOxsTEsWLAAGXAYyW4tTwCCNg9gZ2kMW7dtQ75Q4B4A5Hss/9NshEIh5AsFbN22DTtLY043p+VaHR9ZAbDZH7I7sLCvD4l4HNlsFgA4DEC+pOs6y//UFPOemM1mkYjHsbCvD3/I7nC4Vf7HBMBmyyPt0HUdhXIJe/fudbo5RLbRNA3FYpHlf2ra3r17USiXoOs6lkfanW6O7zEBsJEE4OF8P/6y8yXMm9MLLa1hYGAAkiSxCkC+w/I/NUMIAUmSMDAwAC2tYd6cXvxl50t4ON/PNQA2cyQBCMo8ADPEXzfyFLq6utCWaMOOnTsBgEkA+YphGCz/04yZwR8AduzcibZEG7q6unDdyFPjP3ewba3mRFxkBcBmMoCtpTR++8Jj6OzshCxJGBwcdLpZRJbSNA2FQoHlf2rK4OAgZElCZ2cnfvvCY9haSjM4tQDfY5sZB/776yNPY2xsDEIaH+di75/8RNM0yPL47YTlf5oJIcT4PVECxsbG8PWRpwEcvHeSfZgAtMjWcgYPp3cjFoliLJvF/v37OQxAviCEmHD4D1EjzPL//v37MZbNIhaJ4uH0bmwtZ5xuWmA4lgAEZR5AtS+NrMPKlSsRjkawe/duAGDJlDxP0zTk83leyzQj5vWye/duhKMRrFy5El8aWedwq5zhVDxkBaBFQpDQr+fw/cfuwXFHHwNFUfDiiy9idHTU6aYRzUp1+Z+oUaOjo3jxxRehKAqOO/oYfP+xe9Cv5xDi3P+WYc2uRcoH5rP+KP0Stj+awasTi1HMlTA4OIhkMlmZPV09K5bIC6rL/xz/p+lU39t0Xcfg4CDGcllIsozPP3o77s2NV0XLgZr77yxH0/YgDgO8UBrBd7TnYUjA8qXLMDo6iqfWrcPzzz/P4E+eo2kacrkcr1uqy5zz9Pzzz+OpdeswOjqK5UuXwZCA72jP44XSiNNNdISTcZB1uxYzb5MX7bkTX3ruXixduhSRcBjlchlDQ0MoFAqOto9oJlj+p0YVCgUMDQ2hXC4jEg5j6dKl+NJz9+KiPXcCAAv/DuAQQItVF7fuyu7EMS89iaMinejp7MSGzZsQDYWRSqWgqipUVUUsFnOsrUT1sPxPteTzeWiaBk3TkE6nUSiX0DdvPgaGh3H7S0/iruzOymNZ+G89qW3B6Y6/79Gb1zrdBMf9sPcsLI91olwuQ9d1lMtlyLI8IRmIx+NON5OoIp1OY/369YhGowCYANC4XC43IegbhoFQKARFURAKhbAhP4x39v/Z6Wa6gtPD4KwAuMQ7+/+M+xeMJ0KKolQmBY6NjWF0dBSyLCOZTFaSgUQi4WRziaBpGsf+CcD4KX5m0M9kMpWgHw6HJzyuXC4z+LsIEwAXOXv3wWxwqmQgl8shnU5j165dE5KBtrY2R9pLwaZpWuUGz95/8IyNjU0I+gCmDPrAxHsbuYcrhgAADgPUYiYD1QzDQLlcBgC0tbVVkoFkMtnq5lEAZTIZrF+/HpFIBAATgKDIZDKVoD82NgZgPOhPNRGUQb82p8v/ACsAnjBVZUCW5crNt1AoYM+ePdizZw8SiUQlGUilUo60l/xP0zSnm0Atkk6nK0E/m80CGA/65v2nGoO+tzAB8Jh6yUCpVMLevXsnJQOqqjrSXvInzv73NzPgm0FfkiSEw2EGfZ9xzRAAwGGA2ZhqmEAIgXK5DMMwEI/HJyQDnLxFzRobG8OLL77I8r+PmAc6mf/J5XKQZRmhUGjKewWD/uy4ofwPsALgG1NVBsysHRjfenP//v3Yt28fYrHYhGECc5IhUSNY/vcHXdcnlPfz+Xwl6JtLO6sx6PsPEwAfqpcMGIaBgYEB9Pf3IxqNVhIBVVV5pCvVlU6nWf73qHK5XFmfr2kaCoUCg36AuWoIAOAwgJ2mGybQdR26riMSiUzYeGiq5TwUbNlsFi+++CKX/3lIqVSasDFPsVisLC9meb/13FL+B1gBCJRDv9j3L1gLSZIQCoUQCoUghMDIyAgGBwcRDk/ckniqyT8UPObObuRuxWJxQtAvlUqVoH9oT58BP7hcVwEAWAVwwqHVgerKQCgUmpAMTFUqpGDYsGEDstksZFlm799lCoXChKBfLpen7ekz6DvDTb1/gBUAOuDQeQPVlQFgvOc3PDwMRVF4WFFA5fN5pNNpDg25yKGH7ZgJe/UOoiYGfToUEwCapN6WxJlMBiMjIzysKGA0TWP53wWmO2ynOmE3MehTLa4cAgA4DOBG021JXCqVeFhRAGzcuBGZTAaKorD832JTHbYTDoe5Ba+HuK38D7ACQDMw3S6E5pwAHlbkX4VCYcLyP7IfD9shu7m2AgCwCuAVPKzI//bv349t27ZVkj1WAOzBw3b8yY29f4AVALIADyvyP+79bx8etkNOYQJAlmr2sKJUKsXzCVzKXFPO8r81hBCTgj4P2yEnuHoIAOAwgF80eliRuapgqpInOWNgYABbt25l+X8WDMOYsAUvD9sJDreW/wFWAKhFZnpYUfXyQh5W5CyW/5uj6/qE5Xo8bIfcxvUVAIBVAD+rVxmIRqMTkgGWoVurVCrhueeeqyRhTABqMw/bMYN+9WE77OkHj5t7/wArAOSwepUBIQSGh4cxMDCAcDhcSQR4WFFraJpW2VKWplZ92I6maTX33QcY9Mk9PFEBAFgFCKJa5xPwsKLW2LJlC0ZGRhAKhdj7r1LrsB3uu0+A+3v/ACsA5GK1zicQQkDTNAwNDfGwIpuY5Wz2/sdNddiOuUafJ+yRFzEBIE+YKhmoPp+AhxVZzyxnBzmh4mE75GeeGQIAOAxAk001iVDXdZTLZR5WNEtbt27F8PBw4Mr/0x22M1UlhEGfpuKF8j/ACgB5XL2TC7PZLEZHR3lY0QyZS9iCUv6f7rAd7rtPfuapCgDAKgA1pt75BDysqLbh4WFs2rTJ15v/THfYDvfdp9nwSu8fYAWAfKrelsT5fB6ZTAa7d+/mYUVTqO79+yn4T3fYDrfgpSDyXAUAYBWAmlevMmCeT2DOHQgiwzDw3HPPQQgBSZI8nwBUb8FbfdgOe/pkNS/1/gFWAChgmjmsyEwGgnJYkaZpKBQKnp39by4RrQ76PGyHaDJPVgAAVgHIWo0cVlS9osDPhxVt3769svOiV3r/5mE7ZuDnYTvUal7r/QOsABABaOywooGBAfT39yMajU7YkthPM+XN3rMXzlyoPmzHrFrwsB2ixnm2AgCwCkD2q1cZiEQiE5IBLwTOWkZHR7FhwwbXzv6vPmxH0zQUi0X29MlxXuz9A6wAENUUlMOKzAl/mqa5bniDh+0Q2cPTFQCAVQByTq3DikKh0IRkwO2HFQkhUCqVsHHjRpTLZUSjUaxYscKx9lQftlN9IiEP2yG38WrvH2AFgKhptQ4rAuCJw4rMnv/Q0BA2btyIjo4OAHCkCjDdYTvcd5/IHp6vAACsApC71DqfwG2HFZkJwM6dO9Hf34+lS5eiVCqhp6enJa9f67CdQzHok9t4ufcPsAJAZLl65xNkMhmMjIw4eliRGfgNw8Du3bsxOjqKUCiE9vb2ymY5dpnusJ3q6omJQZ/IPr6oAACsApD7TbcLYalUatlhRUKMf93NcXRN0/D8889j4cKFyOfzWLBggS2vPd1hO9yNj7zK671/wEcJAMAkgLzDicOKzF4/MH4Qzs6dO1EoFNDe3g5N09Db24ve3l4AsGTXQx62Q37lh+APcAiAyBHNHFaUSqWQSqVm9DrVPX5JkpDL5bBjxw6MjIxUhhzmzp2LQqEwYbvjQysFjUqn05UteHnYDpG7+aoCALAKQN423cZDpVIJQgi0tbVNmDdw6OOqA3h18M7lcti5c+f4RDsJmNvdA8MwkE6nkUgkMKSNQhFAKpXCwoULJ8xHqPW8ACaM54+NjVX2SeDGPORHfun9A0wAiFyrkfMJzESgvb0duq5jaGgIXV1dUBQF/f39aG9vx44dO5BOpyHJEiBJOP641Xhw3RO4fvRZAMA/tR+D01efgKeeXgcIAWEIpFIpLFq0CKOjo+jt7Z303KOjo5XAz333KUiYALgckwDym0aSAUVRMDw8jHgigXgshoGhQSQTbTCEATWlolAoQNd1XDf8JO7K7ZrwXBfG+/CZzjWV3fW0tAZZkpHJjqGnqxu5fB65bBadnZ3QdZ1BnwLJT8Ef4BwA8rKCDmP7KMRADhjMQQzlIAazECMFoKgDRR3iwH9DF0BYhhRRAPM/sRCkrhik7gSk7jikrjikeW2Q5icB2V1H/9bbkrislzF37lzEYjGMahra29vR19eHFzdvxEmr1+CBdY/jptEXcUduBwBAgQQdovK/78rtwl25XbgkvgjvbV+JM48/CY8//RRWH3scMpkM8oUC5s+fj2QyiV27d3ELXiIf8GUFAGAVwI/E3gyMFwchtozA2DwCsTsDCBsu36gCeXE7pCM6IC/phLyqB2hz577+9y9Yi2QyiSeHduE3Y1twSeIwrIp04Esj63BufAGuG34Ka6LdeCC/t/I7EoBD37VD/+3M2Dw8WRjEZzqPx7253fhUx2o8XxzBHdnteG3bEVjT1YdMJsOgT4Hht94/4OMEAGAS4HkCMDYPw3hyL4wn90HsyTjTDlmCfGQX5DXzIK+ZC6nHnjX6dZUM6Pdvg/HEXog9GYh0YXIkt5IESB0xSPOSiB83D+WzFgKx1hQNjY3D0O/dCrErDbFvbLyKY6eIAqkrDvmobihnL4a0SK3/O4C9n4ksQUpFIC1SIZ80H8rLF7muMhUUfgz+ABMAciGRKcJ4YDv0e7dBDOWcbs4k8vIuKOcfDvnE+S27IYstIyh9/ynnkiAASIQR+sdV44HIJiJdRPm7T8B4fsC216hLkRBauxzKZctrfr6t/kzkpZ0IvXs1pHnJlrweHcQEwKOYBHiH2K5Bv3sL9Ed2ASXD6ebUJXXEoJyzGPI5iyEl7TvtT//bTpR/uA4w3PFVDb1mxXhwtJjYn0Xp6w9D9Nu7FXGj5KWdCH/yNCA0eeMixz6TiILwVSdBPmZOa183wPwa/AHAXQd/UyCJwRxK33sSxc8/AP2vOzwR/AFAjORRvmU9ip+8F/odG21ptxjIovzTZ10T/AGgfMt6GM/0W/ukQqB04xOuCf4AYGwaRvm3L036d0c/k6KO8s3rgLFS61+bfMf3CYCfszfPy5dR/s2LKH7mPhgP77J3PNtOuTLKvz7wdzxi4d8hMH6zL5QtekLrlH/6rKUJj37/dogtI5Y9n1X0P2ya2C4XfCZiJI/yz5917PWDxO/xw/cJAOD/D9GLjBcHUfzs/dBvt6fn7AQxmEPpu0+Ol7FHC7N/vq0jMF4ctKBl1hP7s9Af3GnNkxkC+u0brHkuqxkC5bs2V/6vWz4T/eFdllxjNL0gxA3uA0CtZQiUb1kP/Y5Nlizh61KBE5ZLWL5QwqJeCYt6gYVzJHSrQDwKxKMSYhEgHALyxfH/ZPMCuQKwdwjY0S+wYz+ws1/g2S0Cz2wWKMyyumo8P4DSv/wZoXethnz83Oaf5zkHJ8I1QL9nC5SzDpv18xh/3wMxnLegRfYQVZ+Daz4TMX6dKaf1Od0S8rDAJACFd93OCYEOE4M5lG74+6xKvfO6gEtOlXH28RLWLJdwxPzGZ+G3xcb/062O/86Ri4DxFfAHlcrAc1sFHl8v8KfHBO59wkCuOPN2ikwRpesfg3Lu4Qi9+eimVgu4cQVENbEzDWP9IOQV3bN6Hv3urdY0yCYiUwQKOhBV3PWZDLqoLT4ThN4/EKAEAGAS4CSxK43SNx5pqqfX2wm89QIZl50u46QVEiw4qXZa4RBw/DIJxy+T8J5LgWxBwb1PGPjNAwK//YuB4gyHfvV7t0LszyL8wRPHdx+cAZGv/WI/+ISCN55r3yjeaAY48q0ljNX4yPS7t84qARDbR2FsGKr5mE+8Sca/vn1m791MLX1TCfuGp/+5yJchRZWWfibf+F8D/3rz9PsfiDwnAtohKMEfCMgcAHKW8dIQiv/x4IyD/0krJHz/Ewpe/EkYX3iXgpNX2hv8p5KIAmtPk3HzJ8fbcc3bFMzvnlkjjGf6UfrKQ+M9SQ9pTwL/WCeYGU/unVWvWP/T1po/DynAe9byNkVkh8B9s4KU3bmBsW4fSl9/GMg23ls5+nAJt/57CPf/Zwj/eK6MiEvqVL2dwKfeLOO5H4fwH1coaJ/BfizG5hGUrpt5EuS0972qzi3CENDv29bUc4tMEfqju2o+5vKXy1gww4SLqFlBiw+BSwCA4H3ITjE2DKF0w98bnuXf0w7819UKHrwhhPNOdO9NPxICPvRaGc/cHMaVl8sND++LvRmUvvkIkHPfsr7prDpcwpmra/+Bxp+3N7WSw7i//u9dWS8BIbJIEOMCv11kC7Eng9L1jzUcGM4/UcIjN4bxzotlKB65KrtU4KtXKvjDV0NY1NtYFiB2plH69uNA2TtLH99/ee0PpJGe/CSGgH7f1poPWb1UwqlHuzcRJPI6j9xqrRfEbK9VxGgBpW880tBuZZEQ8OX3KbjliyHM7WxB42xw+jESHr4hhNe8orGvk/HCAEo3r/PMxkeXnirXTXBmOpPf+PveusMhH3h1YG9P1GJBjQeB/oYF9UO3lRAo//ffIRpYopRKALd8MYQPvkZu+eQ+q7UngZ98VsEn3tRgEvDwLuh3b7G5VdZQZOC9dSbiiW2jMDbWmEZ/iHp/e7cKvP7sQN+eqEWCHAf4DSNL6b/fBOOl2su6AGBuJ/DHr4Zw1vEej/yH+Ne3K/jGB5WG5gWUf/UCxM60/Y2ywDteKSNW57wj/Z7GEhqxXau79O/dl8qIhhttHRE1I/AJQJCzP6uJraMo37q+7uN6O4G7vxHCcUv9FfxNV1wm48aPKfWrGmUDpe894Yn5AF0q8IZz6iwJfHxPQ9vT1uv9h5TxBIDIbkG///NbBl4EljCDmV57YLstDvzfF0Iz2sHPi958voxr31F/8xqxM43yb+onTW7w/noz8vX6SwJFpjh+3HMNrzpDRl+Pv68Pch7v+0wAKngxzI7+py0Qe8dqPiakAD+7JoQ1y4Nxc//YG+W6Y+cAoP9pM8S+2u+dGxy3VMJpdWblG/dvq1nRaGTp3wfqrDogmi3e78fxm0azJjJFlH+/se7j/uVtCs538fp+O3z1yvEdDGvSBcq/fqE1DZqlK+stCdQKMB7fM/UPufSPyFVcsseaO/CsgObov9tQd6e/M46V8JE32J9vbtkjcM8TAg89J7Bxp8CO/QJjufFTANviQHubhCULgBWLJJy1WsJZx8vomMGOfjMVUsb3hz/tg2WM1VgYYfx9L4yNw5CXuXst5KvOkLGg28DuwemHevS7t0A+dfIpdY0s/buSS//IZuz9H8Rv2yF4ccyMGMjW7dWpbcD3P97YzPim2iCAX91v4PyPlXHsO8v48H/p+OW9Bv7+kkD/MDCWB3QD0MbGj//981MC37vNwFu+qGPpm0p415d1PPGSfYvylyyQ8JX3158PoP/K/VWARvbmNzaPTHniY71VAt0q8PqzeEsi+/D+PhG/bVPgRdI4/Z6tdSf+ffotSsM75c3U318SePlVZbzzSzoefm7mQbxQAv73PgNnXV3Gu76sY0izoZEA3n6RjFPqDAUYG4Ygto7a0wALveuS+kv09Hu2Tvj/YrtWd3nouy+tv9SQqFm8r0/GBICaV9Sh/3VHzYcsnivhisvsucy+c4uB8z9axrpNs++9CzGeCLzsyjIeaiKRaMR1722gCnBI4HSjnnbgdXV66vqjuyG0g0sCufSPyH34jZsGs8X69Ed21d3u9wvvsmdDl2u+r+OT39VRsvhcnT2DAq/6dBl/fMz6JODUoyW86vR6gXOXJ44NrrsksGyMHxIELv0j5/F+PjUmADXwoqlNv7f2mu9lfRJee6b1l9hXf2HgW7+2b/OcXBF48xfKeOQF65OAT76lzvtRMmDUqaq4wQlHSnWHNPT7twGGaOi0QC79I7vwPj49fuvq4MUzNdGfhdhWe7z6isus3+P/zkcEvvBj3donnUKhBPzj58vY1/j29g1ZvVTCy46qEzgf3W3ti9qk7imBw3kYj+6uuzkQl/6RXXj/ro0JADXFeHJvzZ+3xYC3XmDt5TWcBq76VhmiRafo7R8B/uk/rU823lenfC62jUKM1F4u5waveYVc9wTH0k+fhRiqfTAUl/4ROYPfvAYwi5ysXgLwurNkqG3Wvua1P9Qb65ErEuQT5iF8xRpEvngWItdfiOj3LkHk6+cj8rlXIPSGoyAv6WjoNX//sIHbH7J2uOHVr5DRmarxAAEYT+2z9DVraWb1BACEQw1M3KuzP8Rslv7ZNVmT/IH37fqYADSIF1OVsVLdo18vqzPZbaY27xb48R/rB2Lp8HZEPncmwledBPnUPkgLUpCSESAkQ+qMQVrcDuWVSxG+5uUIX3nC+M/q+PyPDBgWxppICLjo5Dpr6VuYADz6osDfm9wH4d2XKgjPYjux2Sz9++9b3X+IEjmD9+vGMAGYAV5U44z1g6gVERNR4Ow11o7p/uevDZTrVOPlJR2IfPI0SAtrda+rHn/yAoQ/cRrQVnuZwgvbBO58xNpgc8mpdfYEWD9o6evVc2OTwXRuJ/Dqlzd3G5nN0r/NuwXueowJAE3G+3TjmADMEC8uwJhil7dq550oI27hhi7pLPCL+2rf7KWOGMIfeRkQnVl3VFqYQvgDJwJ18pWbbrM22Fxwkly751zQ65bPrfR/fzbQ3+SEx3qTAaczm6V/N/7OAAcA6FC8P88ME4AmBP0im2qb12pnrba293/bg0bNffQBIPSWo+v25KcjH9UD5YxFNR9z7xOi6QA5lVRifCldTXX2WLBSsQzcfGdzSc7LjpLq/y1TaHbp31gO+Mld7P3TREG/LzdDHtv9INff0IwYdZb/nbDC2kvq9odq9/WkRSrkE+fP6jWUy49ErcMKDAHcYfEwwAl1jkVu9YZAP/i90fTGSnU3BjrEbJb+/exuA+lsU79KRAeM7X5QYgWgSUHNNsX+bM2eaUgBjltiXQKgG8C9T9QOvMo5i2f9OlJ3HPJxvTUfc5fFuwOeWC9RamEFABjfBfF3f2suyXndWTJ62ht/fLNL/4QYL/8TVQvq/Xi2mADMQhAvOtE/VvPnRy2WLD3Q5bktApla5X9ZgnzS7Hr/JuWUBTV//sjzLa4A5C3e57gBNzQ5GTAaHj8kqBGzWfp37xMCL+3g6D8dFMT7sFWYAMxS0C4+MVh7MH7FImvL/4++WKf8v7i9oaV8jZCOmVPz5/uGx48TtsrSPglKrW9gufU93UeeF3hyQ3N/43vWygjVP+8I77qk+aV/N/7O/l0gyTuCdv+1GhMACwTpIqyXACyqXUWfsXq9PXlZna3oZkBKRiDNq7170UsWbtOvyMC8LvdNwWm2xL6gW6q7/0NIGU8UmrFlj8AfH2Xvn8YF6b5rFyYAFgnMxVhnW9dFvdYGtA0761cArFTv+eq1Z6YWWpwwWeHX9xsYqD3Pc1pX1pnZP5ulf9+9zdoNmci7AnO/tRkTAAsF4aIUI4WaP++rXUWfsR39tX8uzbV2v2Gpt/bzbbdwCAAAFs5xXwWgUAJuvqO5KsDpx0g4tsYk0HoJwnTG8sD/a2AnSPK/INxnW4UJgMV8f3HWmZg2p8PagLZ/pE4FoDtu6etJPbWfr9me8XTmdFj7fFb5/u31d16cznQbAx23VMJpTS79+5+7DWi1559SAPj+/tpiMjC+HtDphviJny9SUawdFazcAdAQ4ycA1mLVBMDK86WiNX8+MGptBSBR++Ucs3sWSwLfcI6MLnXyv39gFqf+/TeX/gWen++rrWbGfFYAbOLbi7VUOwGwMqDlizWPHAAiChCy+BJO1N5NcMziU3pjEffm3s0ethOPAG+/aOLnMpulf/c9KbB+Owf/g8y391OHMQGwkS8v2mLtoBCzMAEo1tsHJ2zD5VsnoajbphlKxKx9Pis99JzAuk3NBd73XiZPWOI4m6V/PPUv2Hx5H3UJJgA2893FW2dtejRsXY+23ra0Us1F9M2RlNrtb3ar3OlEmzu+oGWaPSXwsF4Jl546/vnMdunfHyzegpm8w3f3T5dhAtACvrqI6wTIQsm6Um29c+aFbn1gEHrt9tdr00wVWrvb74z96n4Dg1pzv2tOBpzN0r/vcelfYPnqvulSlQSAEwHt5ZuLOVJ7q7d87VWCM1I32NqxU16d54xY3GPPWfh+2SFfBH7Y5CmBZ66WsOpwaXZL/3jqXyD55n7pQtWxnhWAFvLFRV0nAchZeIBdPApItdLSgg7U6bHPWLZ2l9zqWfu5gvu7tzfd1vySwG9dpTS/9O8eA6OZ5l6XvMsX90mPYALQYl6/uKV6CYCFPVpZAjpTtR9j9ZG5Il37D+hpt7ZQ5vYKAADsGhC4/cHmNwZq1ne59C9wvH5/9BomAA7w9EUerZ0AWL9RTp0T8+qcTTBTYqD281m9cY/V75ddmj0lsFn3PyXwwjb3V0fIOp6+L3rUhASA8wBax6sXu9RRe93azv3W3rQX1dlaWOy1tkYs9tXebs7qrXt3WPx+2eXBZwWe2dy6tja7+oC8yav3Q685NMazAuAgT170XbW3yrXyuFwAWLawTgVgR5NT1Kd7vu21u+TL67Rnpnbtt/TpbNWqoLxtn8AdDzMBCApP3gd9ggmAw7x28dfbe3+nxQFt5aI6CcDGYcteS2SKEHtrVwBWHGbZy0E3gD2D3qgAAMAv7zMwZG2+NSUu/QsOr93//IYJgAt46UtQLwGwesvWk4+qnQAYm0cgRqzZn1c8Wzt76e0c3+DGKlv2iNqz663e5niW8kXgR3+wt2eeLQA/tvk1yB28dN/zq0l3GM4DcIZXvgzSnETNnz+/TSBv4cT8Y46Q0FYr5xACxiO7LXkt/bE9NX9+6lHWBuS/r6+TLNWZcOmE791mwIb9lyp+cY+BES798z2v3O/8ZKrY7q4uRsB54Ush9bYB8el36CmVgWe3WFcFUGTg3DW1L1P9wZ3ALF9SDOVgrNtX8zEXnGxtbvzEhjpHHbdZe9KhFXbuF/j9Q/ZlADdy6Z/veeE+FxRMAFzG9V8OCZAXt9d8yBMvWTsMsPa0+hMB9b/tmNVr6L/bUPPoQUkCLjnV2q9LvfdJSrrzoIAbfmtPkH5gncDzWzn472euv78FzJR3NA4DOMvtXxLpiI6aP7//KWtv4pedLqOtzql5+q9fBMaa21jfeGkI+l+213zMOWskzO1s6umnlMk1MASQdF8FAAD++oywtMpj4tI/f3P7fc3PpovprAC4VOFdt7v2CyPXSQDu+bth6SE3ahvwhnNqX6pCK6B0/WNAcWZ71ordaZS//XjdIYT3Nnma3XTuftxAsdbJghEFSLizAgBYH6y39wv8nkv/fMnN97KgYwLgcm784kgrumtu0j+Wt74KcPXrJ54vPxVjwxBKX3kIYk9js8iMJ/ei9JWH624nvOIwyfLy/x2P1H5/5OVdlr6e1X55r4HhtHXPd5PNkwvJGW68f9FB097VOAzgHm77EkmpCOSlHTUfc9vfrL2bL+uT8LaL6gdhY/MIip97AKUbn4Dx6O7xZGCsBOgCYrQAsX0U+l2bUfqPB1H6r8chtPqb8X/uHfWTj5kolYE/PFr7/ZHXzLXuBW2Qs3BJoJXPRe7htvtWUNWK5Rafbk52KbzrdkRvXut0MyrkNfNg1NiE51d/NvAfVyhI1V41OCPXvlPB7Q8Z2D9S54FlA8aju2E8Ovvlga88RcKrTre293/r3+pvqCOvnlvz/XWDm24z8E+vm31yZHU1gZzH4O8NHALwEDd9qeTja/dQx3LAz/5kba+uWwX+62ql9hHBNrye1eotdZMOU+tuuOQGVo3bc/Kfv7jpPkW11UwAOAzgPm6ZUCPNT0JaWPus3u/dbkBYPFl87WkyPvNW+zfIiYSAX3wuhPnd1n4Fntks8PBztd8U5eQFlr6mnWYbvO1aUUCt55Z7Ex1UL4azAuBRbviiKeceXvPnL+0Q+O1fre/dffotMj70Wvsu3VgE+Ok1Ck472vr890s/r/N+hGTIr1hk+evaZbZr9+3aU4Bayw33I5q5undRVgHcy+kvnXLawpq7AgLAv95cZ7lbk/7jCgXXvVdByOJiwLwu4NZ/D1k+6x8AHnlB4NY6CZF80nxIatTy17ZTs7v37ei3d1dBag2n70M0tUZiNysAHudo2S2qQHl57d7qlj0CN91mz03+n14n409fD+G4pbPPUSUJeP1ZMh7+7zDOONaenPczN9Xfo0A573BbXttOze7ff9PtXPrnZSz5ex8TAJ9w6ouonHcEINcOmNf9TMeuAXvGeU9eKeGv3w7h5k8qeFmdkwOnEgmNB/77/zOEH31aQU/tXY6b9pO7DDzyfJ21/0s6IC+1cLtBi9Tb+bGZE/waOVlQXlL7dck5DPz+0NAywLHdD0ptC07nTB2Xc2KpoNSbgHLWYdDv2zbtY0YzwHu/quP2L4Xq5QpNkaXxnQLfcI6MTbsE7n1S4KHnBDbsFNjRLzCWAwolIBED2tskLFkwvrnPWaslnLNGRkfS+jZV27JH4OP/3UDv//VH2duQJslHdsEoGxA7pl+7+Nnv6/js92e2C2M9yvlHwPjek5Y+J80eg7/7NTp0z30AfMb8crYyEVBevQL6w7uA3PSD/Q+sE7j+/wx8+PX2Fp2W9klY2ifhvS7ZMkE3gPd8RUcmV/tx8vFzIa/sbk2jmqCcfzjKP3y6Za8ndcchr3b3ZkhBw8DvPw3fjTkZ0Fta+WWVUhGELl5W93Gf/5GO+54MViHpU9/V8cgLdf5mWULoH9zZ+zcpL+sD2lp3NoFy3uEcoHQRBn/vmEms5lfMx1r5pVUuPAJSb+1t/0pl4E1fKOPpTcFIAv7z1wb+u4F18sq5h0Oab/M4xGxFlIaSPCtIahTKWYtb8lpUH4O/f80oAWAVwHtaNlM3oiB0xQl1JwRmcsBr/6WMrXv9nQT8730GrvlB/TFxaX4SodevbEGLZk+5aElLEpXQP66qu7yU7MdZ/t4z0xjNCkBAtOKLLC/pQOhVy+s+bu8QcMHHdN/uAPeDOwy896t6/V0QQzLC71szfvSvFygSwh84EVJnzL6XuGgJ5FP7bHt+agwDfzDMOAFgFcC7WpHRK2uXN3SU7Z5BgQv/uYy/PuOvJOC6nxq4+nq9ofXtodeugHSYTesObSL1pRD+7BnWL1eMKgi96WiE3rjK2uelGWGv37uaic2sAASQrV9wWULo/SdA6qp/mI02Blz+mTK+2+ROcm6ijQHv/JKO637a2FI4+eT5UC5aanOr7CF1xRH+7BkI//OpkE9eAKkvBYRnfiuR2qOQj+xC6DUrEP3a+VAuOMKG1lKjGPiDp6mBNu4L4H12LheUOmMIf+QUFP/jQSBbqt2OEvCxG3T86XED//3REOZ0WN4c2z3yvMC7vqxj277GvhLykV0Iv3cN4PFamryqB/KqHqebQbPEwO99zVbmWQEIOLu+/FJfCuF/OhkINXaJ/eFRgVPeX8JP7jJgeCS1HMkAn/qejgv/udxw8JcWzOx9IbITg3+wNX0X4lwA/7Br3E8+sgvh95/QcLDbPwJc+Q0dZ3ywjPufcm8WUCqPn2J37DtL+PZvGt/PXuptQ/ijpwCJ1q2nJ5oKx/r9YzaxeFbdECYB/mJLEnDCPIQ/+rIZLet6ZrPA2k+Vcd5HyvjV/QZKNpwm2Iz9I8BX/sfA0W8v4xM36hhON/670uHtCH/2jIbmRhDZiYHfP2Ybg7nYliawY26AvLIbkU+ejtI3H4EYLTT8e4+8IPDICzo+1anj/7tQxmVnyDhhuQSphWlnrgjc94SB3zwgcMtfDBRqT2mYknz0HISvOhGI8utGzmHgp0PN+o7ECYH+ZHUiIB2mIvzZM1D6zt8hto3O6Hf3DQNf+6WBr/3SwPxuCZeeNn6QzwlHSlg819psoKwDz28VeGy9wN2PC9zzdwPZxnOWSZSzDkPorccCCotl5AwGfn+yogJvyV2JCYC/WbpSoGyg/Jv10P+4CbDgqulWgRNXSFi+UMKiORIW9QJ9cyR0q0A8KiEeAWJRIBwaP4I2XwByRYFcYXxDoh39Ajv6gZ37BZ7dLPD0ZoF8cfbtQlsY4XeuhnzCvKafovz/noF+//SnLLZK6NVHQnnVka1/YUOgcMUdcMOs0OiNFwMRxTWfCQCEXrsSytra2zMz+PuXFQmAJTVJVgH8zdJqQEhG6A1HQT5mDsrffwpiJD+rpxvUgLseE7jrMfdcfvLKboTeu2bWO+a5Zr6AU+2QJUgdMYihOkcp2q0tXNmt0TWfCQB0TX99MfD7m1Xz7yxbi8QJgf5n5cxheVUPIv9+NpRXLvXNkjipM4bQe45H+OOnWbJdrny0O9bYy0fPcfC1nX8P5GMO/v1uaA8AQJr6c+Hsfv+zMtZyVhLNmGUVgXgIoTccBeXcxSj/6kUYj+22oHUOiIYQumQplIuWWLqvv3R4B+QV3TDWD1r2nDMlv2yBrXv/16OcfwT0B3cCukMVHlmCcsGSyv91w2cCAMqpfZDao5X/z6BPzbC8186hgGCxcn6A2DoK/U+boT+2Byi7f3tgqT0K+azFUM5dDEmN1v+FJoiBLIr/8gBQaP1aSEmNIvzFsyAlIy1/7Wr6bRtQvmW9I6+tXLJs0mmNTn4mwPh1F/ni2eNDE2DwDxKrK+22lO2ZBASPpYmAVoDx5+3Q798GMTy7OQJ2kJd2QjnvcMgnzW/J8IX+tx0o//Dp1k6GC8kIX3US5ON6W/ea0zEESl99uOW9bnlJB8KfOn3Kz9iRzwQAwjLCV50M+dg5DPwBY8cwu23j9kwCgsnSFQNCwNg4DOPJfTCe3Auxb8y6554JWYK8rBPymnmQ18yD1JtoeRPElhGUvv8UxJ6M7a8lHd6O8HuOh7QgZftrNcwQ0O/YhPLvXrK/OiRLUNYuR+iy5TWXb7byMwEA6YgOhN9zPIqfvb8lr0fuYdccOyYAZAs7DhkSezIwXhiA2DIKY+sIxO4MIGy4zCIK5MXtkI7ogHxEB6SjexwvgwMASgb0e7eOJ0N7MhCZoiVLKSFJkFIRSAtTkE+aD+XMwwDZnXN6xa409Pu2wXh+AGI4BxQaO32xrogCqSsGeWUPlLMXQzpMbez37PpMgIOfyyIV8knzUf7x0xY9MXmN5xIAgEkA2ZMIVBTKMLZrEPuzwGAOYigHMZCD0Arj47NFA6KoA0V9fBJZWIYUUcYn6kVkIBaC1BWH1B0f/++eOKS5SUgLkq4NgBQ8LPUHm50r7Gy/yzEJIMDmRIDIhxj4ye7l9S3p5jAJIBMTAaLaGPgJaM3eOtwHgFrKjsOGiPyAgZ9arWUDnawC0HSYDFBQMejTVFq1s25LZzoxCaBamAhQUDDw03Raua1+y6c6MwmgepgIkF8x8FMtrT5Tx5G1TkwCqFFMBsjrGPSpEU4cqOfYYmcmATQTTATIaxj4qVFOnabr6G4nTAKoGUwGyK0Y9GmmnAr+gMMJAMAkgJrHRIDcgoGfmuFk8AdckAAATAJo9pgMUKsx6NNsOB38AZckAACTALIOkwGyC4M+WcENwR9wUQIAMAkg6zEZoNli0CcruSX4Ay5LAAAmAWQfJgPUKAZ9soObgj/gwgQAYBJA9mMyQIdi0Cc7uS34Ay5NAAAmAdRaTAiChwGfWsWNwR9wcQIAMAkg5zAh8B8GfHKCW4M/4PIEAGASQO7AhMB7GPDJaW4O/oAHEgCASQC5DxMC92HAJzdxe/AHPJIAmJgIkJsxKWgdBntyKy8EfpNnGmpiEkBewqRg9hjsySu8FPwBDyYAAJMA8j4mBpMx0JOXeS34Ax5NAExMBMiv/JggMMCTH3kx8Js823ATkwAKOieTBQZ1CjIvB3/ABwkAwCSAiIhay+vBH/BJAmBiIkBERHbyQ+A3yU43wEp++mCIiMhd/BZjfPXHVGM1gIiIrOC3wG/y5R9VjYkAERE1w6+B3+SrIYCp+P0DJCIi6wUhdvj+D6zGagAREdUShMBvCswfWo2JABERVQtS4DcF7g+uxkSAiCjYghj4TYH9w6sxESAiCpYgB35T4N+AakwEiIj8jYH/IL4R02AyQETkDwz6U+ObUgcTASIib2Lgr41vzgwwGSAicjcG/cbxjWoSkwEiIndg0G8O3zQLMBkgImotBv3Z4xtoAyYERETWYsC3Ht/QFmBCQEQ0Mwz49uMb7BAmBURE4xjsncE33aWYIBCRXzDAu9P/D6XVTi8XzlPGAAAAAElFTkSuQmCC" }, "/css/app.css": { "t": "text/css; charset=utf-8", "s": `
:root{
  box-sizing:border-box;
  padding-top:env(safe-area-inset-top,0px);
  padding-bottom:env(safe-area-inset-bottom,0px);
  --emerald:#12b886; --emerald-d:#087f5b; --navy:#0b1a3a; --navy2:#16295c;
  --yellow:#ffd23f; --orange:#ff8c42; --coral:#ff5a5f; --white:#ffffff;
  --bg1:#c8f5e1; --bg2:#fff1bf; --panel:#ffffff; --panel2:#eef3fb; --text:#0b1a3a; --muted:#51607f; --line:rgba(11,26,58,.14);
  --font:"Baloo 2","Noto Sans Sinhala","Iskoola Pota",system-ui,-apple-system,"Segoe UI",sans-serif;
  --cw:clamp(50px, min(15vw, 12.5vh), 100px);
  --ch:calc(var(--cw) * 1.4);
  --tw:calc(var(--cw) * .9);
  --th:calc(var(--tw) * 1.4);
  --av:clamp(42px, min(12vw, 9vh), 68px);
  color-scheme:light;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){ --bg1:#061430; --bg2:#0a3d2c; --panel:#13234a; --panel2:#1b2f60; --text:#f4f7ff; --muted:#a9b6d6; --line:rgba(255,255,255,.14); color-scheme:dark; }
}
:root[data-theme="dark"]{ --bg1:#061430; --bg2:#0a3d2c; --panel:#13234a; --panel2:#1b2f60; --text:#f4f7ff; --muted:#a9b6d6; --line:rgba(255,255,255,.14); color-scheme:dark; }
*,*::before,*::after{box-sizing:inherit}
html{scroll-padding-top:env(safe-area-inset-top,0px); height:100%}
body{height:100%; margin:0; font-family:var(--font); color:var(--text); overflow:hidden;
  background:radial-gradient(120% 80% at 50% 0%, var(--bg2), var(--bg1)); -webkit-tap-highlight-color:transparent; user-select:none; -webkit-user-select:none}
button{font:inherit; color:inherit}
button:focus-visible,input:focus-visible{outline:3px solid var(--yellow); outline-offset:2px}
#app{position:relative; height:100%}
.screen{position:absolute; inset:0; display:none}
.screen.active{display:flex}

/* ---------- buttons ---------- */
.btn{border:0; border-radius:18px; padding:12px 18px; font-weight:800; font-size:17px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:8px;
  box-shadow:0 5px 0 rgba(0,0,0,.28), 0 10px 20px rgba(0,0,0,.12); transition:transform .1s, box-shadow .1s, filter .15s; line-height:1.15}
.btn:hover{filter:brightness(1.06)}
.btn:active{transform:translateY(3px); box-shadow:0 2px 0 rgba(0,0,0,.28)}
.btn.yellow{background:linear-gradient(180deg,#ffe066,var(--yellow)); color:var(--navy)}
.btn.emerald{background:linear-gradient(180deg,#20c997,var(--emerald-d)); color:#fff}
.btn.coral{background:linear-gradient(180deg,#ff7b7f,#e8434a); color:#fff}
.btn.navy{background:linear-gradient(180deg,#22397a,var(--navy)); color:#fff}
.btn.orange{background:linear-gradient(180deg,#ffa463,#f07020); color:#fff}
.btn.ghost{background:var(--panel); color:var(--text); box-shadow:0 4px 0 var(--line), 0 8px 16px rgba(0,0,0,.08)}

/* ---------- home ---------- */
#home{flex-direction:column; align-items:center; overflow-y:auto; overflow-x:hidden; padding:12px 16px 20px}
.bgcards{position:absolute; inset:0; overflow:hidden; pointer-events:none; z-index:0}
.bgcards .card{position:absolute; opacity:.35; animation:drift linear infinite}
@keyframes drift{from{transform:translateY(110vh) rotate(0)} to{transform:translateY(-30vh) rotate(360deg)}}
.topbar{position:relative; z-index:2; width:100%; max-width:560px; display:flex; justify-content:space-between; align-items:center; gap:8px}
.chip-btn{display:flex; align-items:center; gap:8px; background:var(--panel); border:0; border-radius:999px; padding:4px 14px 4px 4px; font-weight:700; cursor:pointer; box-shadow:0 3px 0 var(--line); max-width:55%}
.chip-btn .avs{width:34px; height:34px; border-radius:50%; overflow:hidden; flex:none; background:var(--avbg,#ffd23f)}
.chip-btn .avs svg,.chip-btn .avs img{width:100%; height:100%; display:block; object-fit:cover}
.chip-btn span:last-child{white-space:nowrap; overflow:hidden; text-overflow:ellipsis}
.langsw{display:flex; background:var(--panel); border-radius:999px; padding:3px; box-shadow:0 3px 0 var(--line)}
.langsw button{border:0; background:none; padding:5px 10px; border-radius:999px; font-weight:700; font-size:14px; cursor:pointer; color:var(--muted)}
.langsw button.on{background:var(--navy); color:#fff}
.hero{position:relative; z-index:1; display:flex; flex-direction:column; align-items:center; margin-top:8px}
.fan{position:relative; width:220px; height:120px; margin-bottom:-26px; animation:wobble 4s ease-in-out infinite}
.fan .card{position:absolute; left:50%; bottom:0; --cw:72px; transform-origin:50% 120%}
@keyframes wobble{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
.logo{margin:0; text-align:center; line-height:.82; font-weight:800; position:relative}
.logo .omi{display:block; font-size:clamp(72px,22vw,132px); color:var(--yellow); -webkit-text-stroke:4px var(--navy); paint-order:stroke fill; text-shadow:0 7px 0 var(--navy), 0 16px 30px rgba(0,0,0,.25); letter-spacing:2px}
.logo .lanka{display:block; font-size:clamp(28px,8vw,46px); color:#fff; -webkit-text-stroke:3px var(--navy); paint-order:stroke fill; text-shadow:0 4px 0 var(--navy); letter-spacing:6px; margin-top:4px}
.sublogo{margin-top:10px; background:var(--coral); color:#fff; font-weight:800; padding:2px 16px; border-radius:999px; font-size:18px; box-shadow:0 4px 0 #b8323a}
.welcome{margin:16px 0 4px; background:var(--panel); color:var(--text); padding:10px 18px; border-radius:20px; font-weight:700; font-size:17px; text-align:center; max-width:340px; box-shadow:0 4px 0 var(--line); position:relative; transition:opacity .3s; min-height:48px; display:flex; align-items:center}
.welcome::before{content:""; position:absolute; top:-9px; left:50%; margin-left:-9px; border:9px solid transparent; border-top:0; border-bottom-color:var(--panel)}
.menu{position:relative; z-index:1; width:100%; max-width:380px; display:flex; flex-direction:column; gap:12px; margin-top:16px}
.btn.big{flex-direction:column; font-size:26px; padding:14px; gap:0}
.btn.big small{font-size:14px; font-weight:600; opacity:.75}
.row2{display:grid; grid-template-columns:1fr 1fr; gap:10px}
.row2 .btn{font-size:14px; padding:12px 8px}
.row3{display:grid; grid-template-columns:repeat(3,1fr); gap:10px}
.row3 .btn{flex-direction:column; font-size:13px; padding:10px 4px; gap:2px}
.row3 .btn b{font-size:22px}
.foot{position:relative; z-index:1; margin-top:auto; padding-top:18px; font-size:13px; color:var(--muted); font-weight:600}

/* ---------- game ---------- */
#game{flex-direction:column; background:radial-gradient(120% 90% at 50% 30%, #17306b, #081430)}
.hud{display:flex; align-items:center; gap:8px; padding:6px 8px; background:linear-gradient(180deg,#0b1a3a,#132a5e); color:#fff; border-bottom:3px solid rgba(255,210,63,.45); z-index:20; position:relative}
.ib{border:0; background:rgba(255,255,255,.12); width:38px; height:38px; border-radius:12px; font-size:18px; cursor:pointer; flex:none}
.scores{display:flex; align-items:center; gap:4px; flex:1; justify-content:center; min-width:0}
.sp{display:flex; align-items:center; gap:6px; padding:2px 10px; border-radius:999px; font-weight:800; font-size:13px; white-space:nowrap}
.sp span{font-size:21px; line-height:1.2}
.sp.teamA{background:var(--yellow); color:var(--navy)}
.sp.teamB{background:var(--coral); color:#fff}
.sp.bump{animation:bump .5s}
@keyframes bump{40%{transform:scale(1.25)}}
.target{font-weight:700; opacity:.7; font-size:13px; display:flex; flex-direction:column; align-items:center; line-height:1}
.target em{font-style:normal; color:var(--yellow); font-size:11px}
.trumpbox{width:50px; height:50px; border-radius:14px; background:rgba(255,255,255,.15); display:flex; flex-direction:column; align-items:center; justify-content:center; flex:none; line-height:1}
.trumpbox small{font-size:10px; font-weight:700; opacity:.85}
.trumpbox span{font-size:26px; font-weight:800}
.trumpbox.set{background:#fff; color:var(--navy); box-shadow:0 0 0 3px var(--yellow), 0 0 18px rgba(255,210,63,.7)}
.trumpbox.set.red{color:#e03b3f}
.trumpbox.set small{color:var(--navy)}
.trickbox{display:flex; flex-direction:column; align-items:center; font-size:11px; font-weight:700; line-height:1.1; flex:none}
.trickbox span{font-size:18px; font-weight:800}
.trickbox b:first-child{color:var(--yellow)} .trickbox b:last-child{color:#ff8a8d}

.tablewrap{position:relative; flex:1; overflow:hidden}
.felt{position:absolute; inset:8px; border-radius:clamp(40px,14vw,180px);
  background:
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .22 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"),
    radial-gradient(ellipse at 50% 42%, #2bd189 0%, #139a62 45%, #0a6a43 80%, #074d31 100%);
  border:9px solid #0e2250;
  box-shadow:inset 0 0 0 3px rgba(255,210,63,.4), inset 0 14px 60px rgba(0,0,0,.45), 0 12px 30px rgba(0,0,0,.45)}
.feltlogo{position:absolute; left:50%; top:47%; transform:translate(-50%,-50%); font-weight:800; font-size:clamp(28px,9vw,70px); color:rgba(255,255,255,.07); white-space:nowrap; pointer-events:none}

.seat{position:absolute; display:flex; flex-direction:column; align-items:center; gap:3px; z-index:6}
#seat2{top:14px; left:50%; transform:translateX(-50%)}
#seat1{right:14px; top:32%}
#seat3{left:14px; top:32%}
#seat0{left:14px; bottom:calc(var(--ch) + 24px)}
.avatar{width:var(--av); height:var(--av); border-radius:50%; border:4px solid #fff; background:var(--avbg,#ffd23f); position:relative; box-shadow:0 4px 10px rgba(0,0,0,.35); transition:box-shadow .3s}
.avatar .ph{position:absolute; inset:0; border-radius:50%; overflow:hidden}
.avatar svg,.avatar img{width:100%; height:100%; display:block; object-fit:cover}
.avatar.team0{border-color:var(--yellow)}
.avatar.team1{border-color:var(--coral)}
.seat.turn .avatar{animation:turnGlow .9s ease-in-out infinite alternate}
@keyframes turnGlow{from{box-shadow:0 0 0 3px rgba(255,255,255,.9), 0 0 10px rgba(255,210,63,.6)} to{box-shadow:0 0 0 6px rgba(255,210,63,.9), 0 0 28px rgba(255,210,63,.95)}}
.chip{position:absolute; width:22px; height:22px; border-radius:50%; font-size:12px; font-weight:800; display:none; place-items:center; border:2px solid #fff; bottom:-5px; line-height:1}
.chip.dealer{left:-7px; background:#fff; color:var(--navy); border-color:var(--navy)}
.chip.caller{right:-7px; background:var(--orange); color:#fff}
.seat.isDealer .chip.dealer, .seat.isCaller .chip.caller{display:grid}
.pname{font-weight:700; font-size:12px; background:rgba(8,20,48,.82); color:#fff; padding:0 10px; border-radius:999px; white-space:nowrap; max-width:120px; overflow:hidden; text-overflow:ellipsis}
.minihand{display:flex; height:22px}
.minihand i{width:16px; height:22px; border-radius:3px; margin-left:-10px; border:1.5px solid #fff; box-shadow:0 1px 3px rgba(0,0,0,.4);
  background:radial-gradient(circle,rgba(255,210,63,.5) 0 22%,transparent 24%), repeating-linear-gradient(45deg,#1b357a 0 3px,#0b1a3a 3px 6px)}
.minihand i:first-child{margin-left:0}
.bubble{position:absolute; z-index:30; background:#fff; color:var(--navy); font-weight:700; font-size:13px; line-height:1.3; padding:7px 11px; border-radius:14px; width:max-content; max-width:170px; box-shadow:0 6px 16px rgba(0,0,0,.35); opacity:0; transform:scale(.5); transition:opacity .2s, transform .25s cubic-bezier(.3,1.6,.5,1); pointer-events:none}
.bubble.show{opacity:1; transform:scale(1)}
#seat2 .bubble{left:calc(100% + 8px); top:4px; transform-origin:left center}
#seat1 .bubble{right:calc(100% + 8px); top:0; transform-origin:right center}
#seat3 .bubble{left:calc(100% + 8px); top:0; transform-origin:left center}
#seat0 .bubble{left:0; bottom:calc(100% + 8px); transform-origin:bottom left}

#trick{position:absolute; left:50%; top:47%; width:calc(var(--tw) * 3.1); height:calc(var(--th) * 2.3); transform:translate(-50%,-50%); z-index:5}
.slot{position:absolute; width:var(--tw); height:var(--th); --cw:var(--tw)}
#slot0{left:50%; bottom:0; margin-left:calc(var(--tw) / -2)}
#slot2{left:50%; top:0; margin-left:calc(var(--tw) / -2)}
#slot1{right:0; top:50%; margin-top:calc(var(--th) / -2)}
#slot3{left:0; top:50%; margin-top:calc(var(--th) / -2)}

/* ---------- cards ---------- */
.card{width:var(--cw); height:calc(var(--cw) * 1.4); border-radius:calc(var(--cw) * .11); background:#fff; border:1px solid #d9d9d9; position:relative; flex:none; color:var(--cc);
  box-shadow:0 1px 0 rgba(0,0,0,.1), 0 6px 14px rgba(0,0,0,.3); font-family:"Baloo 2",system-ui,sans-serif}
.card.red{--cc:#d0202a} .card.black{--cc:#141414}
.card .ix{position:absolute; top:4%; left:4%; width:16%; display:flex; flex-direction:column; align-items:center; line-height:.9; font-family:Georgia,"Times New Roman",serif; font-weight:700; font-size:calc(var(--cw) * .24); letter-spacing:-.07em}
.card .ix span:last-child{font-size:.78em; margin-top:1px}
.card .ix.b{top:auto; left:auto; bottom:4%; right:4%; transform:rotate(180deg)}
.card .pips{position:absolute; inset:17% 35%}
.card .pips i{position:absolute; font-style:normal; font-size:calc(var(--cw) * .16); line-height:1; transform:translate(-50%,-50%)}
.card .pips i.f{transform:translate(-50%,-50%) rotate(180deg)}
.card .ace{position:absolute; inset:0; display:grid; place-items:center; font-size:calc(var(--cw) * .42); line-height:1}
.card .court{position:absolute; inset:6% 19%}
.card .court svg{width:100%; height:100%; display:block}
.card.back{background:radial-gradient(circle at 50% 50%, rgba(255,210,63,.22) 0 26%, transparent 27%), repeating-linear-gradient(45deg,#1b357a 0 6px,#0b1a3a 6px 12px);
  box-shadow:inset 0 0 0 3px #fff, inset 0 0 0 6px var(--navy), inset 0 0 0 8px rgba(255,210,63,.65), 0 4px 10px rgba(0,0,0,.35)}
.card.back::after{content:"\u0D95"; position:absolute; inset:0; display:grid; place-items:center; color:var(--yellow); font-weight:800; font-family:"Noto Sans Sinhala",sans-serif; font-size:calc(var(--cw) * .38)}
.card.trumpc{box-shadow:0 0 0 3px var(--yellow), 0 6px 14px rgba(0,0,0,.3)}
.card.winc{box-shadow:0 0 0 4px var(--yellow), 0 0 32px 6px rgba(255,210,63,.9); z-index:3}

#hand{position:absolute; left:50%; bottom:8px; transform:translateX(-50%); display:flex; align-items:flex-end; z-index:12; padding:0 6px; touch-action:none}
#hand .card{margin-left:calc(var(--cw) * -.38); transform:translateY(calc(var(--y,0px) + var(--lift,0px))) rotate(var(--r,0deg)); transform-origin:50% 120%; transition:transform .18s, filter .2s; cursor:default}
#hand .card:first-child{margin-left:0}
#hand .card.playable{cursor:pointer}
#hand .card.playable:hover{--lift:-12px}
#hand .card.sel{--lift:-28px}
#hand .card.dim{filter:brightness(.62) saturate(.6)}
#fx{position:absolute; inset:0; pointer-events:none; z-index:40}
.fly{position:absolute; --cw:var(--tw)}

#status{position:absolute; left:50%; transform:translateX(-50%); bottom:calc(var(--ch) + 30px); z-index:11; background:rgba(8,20,48,.85); color:#fff; font-weight:700; font-size:14px; padding:6px 16px; border-radius:999px; max-width:min(58vw,420px); text-align:center; overflow:hidden; line-height:1.3}
#status.mine{background:var(--yellow); color:var(--navy); animation:bump .6s}
#status i{position:absolute; left:0; bottom:0; height:3px; background:var(--coral); width:0}

#reactBtn{position:absolute; right:14px; bottom:calc(var(--ch) + 24px); width:50px; height:50px; border-radius:50%; border:3px solid #fff; background:var(--orange); font-size:24px; cursor:pointer; z-index:15; box-shadow:0 4px 0 #b8541a}
#reactPanel{position:absolute; right:10px; bottom:calc(var(--ch) + 82px); z-index:16; background:var(--panel); color:var(--text); border-radius:20px; padding:8px; display:none; grid-template-columns:repeat(4,1fr); gap:4px; box-shadow:0 10px 30px rgba(0,0,0,.4); width:min(300px,calc(100vw - 20px))}
#reactPanel.show{display:grid; animation:pop .2s}
#reactPanel button{border:0; background:var(--panel2); border-radius:14px; padding:6px 2px; cursor:pointer; display:flex; flex-direction:column; align-items:center; font-size:22px; line-height:1.1}
#reactPanel button small{font-size:10px; font-weight:700; color:var(--muted)}
.react{position:absolute; display:flex; flex-direction:column; align-items:center; pointer-events:none; z-index:45}
.react .e{font-size:44px; filter:drop-shadow(0 4px 6px rgba(0,0,0,.4))}
.react .l{background:#fff; color:var(--navy); font-weight:800; font-size:12px; padding:1px 8px; border-radius:999px; white-space:nowrap}
.plus1{position:absolute; font-weight:800; font-size:22px; color:var(--yellow); -webkit-text-stroke:1px var(--navy); pointer-events:none; z-index:45}

.centerpanel{position:absolute; left:50%; top:46%; transform:translate(-50%,-50%) scale(.8); z-index:25; background:var(--panel); color:var(--text); border-radius:24px; padding:16px 18px; box-shadow:0 20px 50px rgba(0,0,0,.5); width:min(360px,calc(100% - 28px)); text-align:center; opacity:0; pointer-events:none; transition:opacity .2s, transform .3s cubic-bezier(.3,1.5,.5,1)}
.centerpanel.show{opacity:1; transform:translate(-50%,-50%) scale(1); pointer-events:auto}
.centerpanel h3{margin:0; font-size:22px}
.centerpanel p{margin:2px 0 12px; color:var(--muted); font-size:14px; font-weight:600}
.suits{display:grid; grid-template-columns:repeat(4,1fr); gap:8px}
.suitbtn{border:0; border-radius:16px; background:var(--panel2); padding:8px 2px; cursor:pointer; display:flex; flex-direction:column; align-items:center; color:var(--navy); box-shadow:0 4px 0 var(--line); transition:transform .1s}
:root[data-theme="dark"] .suitbtn{color:#fff}
@media (prefers-color-scheme: dark){ :root:not([data-theme="light"]) .suitbtn{color:#fff} }
.suitbtn.red{color:#e03b3f}
.suitbtn span{font-size:34px; line-height:1.1}
.suitbtn small{font-size:12px; font-weight:700; color:var(--text)}
.suitbtn em{font-style:normal; font-size:11px; color:var(--muted); font-weight:700}
.suitbtn:hover{transform:translateY(-3px)}
.rb-title{font-size:24px; font-weight:800; line-height:1.2}
.rb-tricks{margin:8px 0; font-weight:700; font-size:15px}
.rb-tricks b{font-size:22px}
.rb-why{font-size:14px; color:var(--muted); font-weight:600}
.rb-pts{display:inline-block; margin:10px 0 12px; font-size:30px; font-weight:800; padding:0 18px; border-radius:999px}
.rb-pts.teamA{background:var(--yellow); color:var(--navy)}
.rb-pts.teamB{background:var(--coral); color:#fff}
.rb-pts.tie{background:var(--panel2)}

#splash{position:absolute; left:50%; top:46%; transform:translate(-50%,-50%); z-index:26; pointer-events:none; text-align:center; opacity:0}
#splash.show{animation:splash 1.6s ease-out forwards}
#splash .big{font-size:clamp(70px,22vw,140px); line-height:1; color:#fff; text-shadow:0 6px 0 var(--navy), 0 0 40px rgba(255,210,63,.9)}
#splash .big.red{color:#ff6b6f}
#splash .txt{display:inline-block; margin-top:4px; background:var(--yellow); color:var(--navy); font-weight:800; font-size:20px; padding:4px 18px; border-radius:999px; box-shadow:0 4px 0 #c79a00; white-space:nowrap}
@keyframes splash{0%{opacity:0; transform:translate(-50%,-50%) scale(.3) rotate(-10deg)} 18%{opacity:1; transform:translate(-50%,-50%) scale(1.12) rotate(3deg)} 30%{transform:translate(-50%,-50%) scale(1) rotate(0)} 80%{opacity:1} 100%{opacity:0; transform:translate(-50%,-62%) scale(1)}}

/* ---------- modal & overlays ---------- */
.modalbg{position:fixed; inset:0; background:rgba(4,10,28,.6); display:none; align-items:center; justify-content:center; z-index:60; padding:16px}
.modalbg.show{display:flex}
.modal{background:var(--panel); color:var(--text); border-radius:26px; width:100%; max-width:460px; max-height:min(86vh,720px); overflow-y:auto; padding:20px; box-shadow:0 24px 60px rgba(0,0,0,.45); animation:pop .25s cubic-bezier(.3,1.5,.5,1); position:relative; user-select:text; -webkit-user-select:text}
@keyframes pop{from{transform:scale(.85); opacity:0}}
.modal h2{margin:0 40px 12px 0; font-size:24px; line-height:1.2}
.modal .x{position:absolute; top:12px; right:12px; width:36px; height:36px; border-radius:50%; border:0; background:var(--panel2); font-size:18px; cursor:pointer}
.modal p{line-height:1.55}
.modal ul{padding-left:20px; margin:0; line-height:1.6}
.modal li{margin-bottom:8px}
.srow{display:flex; justify-content:space-between; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid var(--line); flex-wrap:wrap}
.srow > span{font-weight:700}
.seg{display:flex; background:var(--panel2); border-radius:12px; padding:3px; flex-wrap:wrap}
.seg button{border:0; background:none; padding:5px 10px; border-radius:9px; cursor:pointer; font-weight:700; font-size:14px; color:var(--muted)}
.seg button.on{background:var(--navy); color:#fff}
.note{font-size:12px; color:var(--muted); font-weight:600; flex-basis:100%}
.avgrid{display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin:10px 0}
.avgrid button{border:3px solid transparent; border-radius:50%; padding:0; aspect-ratio:1; cursor:pointer; background:var(--avbg); overflow:hidden}
.avgrid button.on{border-color:var(--coral); box-shadow:0 0 0 3px var(--yellow)}
.avgrid svg{width:100%; height:100%; display:block}
.field{width:100%; font:inherit; font-weight:700; font-size:18px; padding:10px 14px; border-radius:14px; border:2px solid var(--line); background:var(--panel2); color:var(--text); user-select:text}
.statgrid{display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin:8px 0 14px}
.stat{background:var(--panel2); border-radius:16px; padding:10px 6px; text-align:center}
.stat b{display:block; font-size:26px; line-height:1.1}
.stat small{font-size:12px; color:var(--muted); font-weight:700}
.awards{display:grid; gap:8px}
.award{display:flex; align-items:center; gap:10px; padding:8px 12px; border-radius:14px; background:var(--panel2); font-weight:700}
.award.locked{opacity:.45; filter:grayscale(1)}
.award small{display:block; font-weight:600; color:var(--muted); font-size:12px}
.mbtns{display:flex; gap:10px; flex-wrap:wrap; margin-top:14px}
.mbtns .btn{flex:1; min-width:140px}

#results{position:fixed; inset:0; z-index:55; display:none; align-items:center; justify-content:center; padding:16px; background:radial-gradient(circle at 50% 30%, rgba(22,41,92,.92), rgba(4,10,28,.96)); overflow:hidden}
#results.show{display:flex}
.res-card{position:relative; z-index:2; background:var(--panel); color:var(--text); border-radius:28px; padding:22px 18px; width:100%; max-width:440px; max-height:calc(100% - 10px); overflow-y:auto; text-align:center; box-shadow:0 30px 70px rgba(0,0,0,.5); animation:pop .5s cubic-bezier(.3,1.6,.5,1)}
.res-emoji{font-size:70px; line-height:1; display:inline-block}
.res-emoji.win{animation:trophy 1.2s ease-in-out infinite alternate}
.res-emoji.lose{animation:sob 1s ease-in-out infinite}
@keyframes trophy{from{transform:rotate(-8deg) scale(1)} to{transform:rotate(8deg) scale(1.12)}}
@keyframes sob{0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px) rotate(-6deg)} 75%{transform:translateX(6px) rotate(6deg)}}
.res-card h2{margin:6px 0 2px; font-size:28px; line-height:1.15}
.res-quote{font-weight:700; color:var(--muted); margin-bottom:10px}
.res-score{display:flex; align-items:center; justify-content:center; gap:12px; margin:8px 0 14px}
.res-score div{padding:6px 18px; border-radius:18px; font-weight:800; font-size:15px; display:flex; flex-direction:column; line-height:1.1}
.res-score div b{font-size:38px}
.res-score .teamA{background:var(--yellow); color:var(--navy)}
.res-score .teamB{background:var(--coral); color:#fff}
.res-players{display:grid; grid-template-columns:1fr 1fr; gap:8px; text-align:left}
.rp{display:flex; align-items:center; gap:8px; background:var(--panel2); border-radius:14px; padding:6px 8px; border-left:5px solid var(--yellow)}
.rp.t1{border-left-color:var(--coral)}
.rp .avs{width:36px; height:36px; border-radius:50%; overflow:hidden; flex:none; background:var(--avbg)}
.rp .avs svg,.rp .avs img{width:100%; height:100%; display:block; object-fit:cover}
.rp b{display:block; font-size:13px; line-height:1.2; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:110px}
.rp small{font-size:11px; color:var(--muted); font-weight:700}
.fall{position:absolute; top:-60px; font-size:34px; z-index:1; animation:fall linear forwards; pointer-events:none}
@keyframes fall{to{transform:translateY(115vh) rotate(360deg)}}
#confetti{position:fixed; inset:0; width:100%; height:100%; pointer-events:none; z-index:58}
#toast{position:fixed; left:50%; top:calc(env(safe-area-inset-top,0px) + 64px); transform:translateX(-50%) translateY(-20px); background:var(--navy); color:#fff; font-weight:700; padding:8px 18px; border-radius:999px; z-index:80; opacity:0; transition:.25s; pointer-events:none; box-shadow:0 8px 20px rgba(0,0,0,.35); max-width:90vw; text-align:center}
#toast.show{opacity:1; transform:translateX(-50%) translateY(0)}

#lobby{flex-direction:column; align-items:center; justify-content:center; padding:16px; overflow-y:auto}
.lobby-card{background:var(--panel); color:var(--text); border-radius:28px; padding:18px; width:100%; max-width:440px; box-shadow:0 20px 50px rgba(0,0,0,.25); text-align:center}
.lb-top{display:flex; align-items:center; justify-content:space-between; gap:10px}
.lb-top .ib{background:var(--panel2); color:var(--text)}
.code{display:flex; flex-direction:column; line-height:1}
.code small{font-size:13px; color:var(--muted); font-weight:700}
.code b{font-size:40px; letter-spacing:6px; color:var(--coral); font-family:"Baloo 2",sans-serif}
.lb-kind{display:inline-block; margin-top:8px; font-weight:800; font-size:13px; background:var(--panel2); padding:2px 12px; border-radius:999px}
.lb-note{font-size:13px; color:var(--muted); font-weight:600; margin:8px 0 12px; line-height:1.5}
.lb-table{display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-areas:". s2 ." "s3 felt s1" ". s0 ."; gap:6px; align-items:center; justify-items:center}
.lb-seat[data-s="0"]{grid-area:s0} .lb-seat[data-s="1"]{grid-area:s1} .lb-seat[data-s="2"]{grid-area:s2} .lb-seat[data-s="3"]{grid-area:s3}
.lb-felt{grid-area:felt; width:86%; aspect-ratio:1; border-radius:50%; background:radial-gradient(#2bd189,#0a6a43); border:5px solid #0e2250; display:grid; place-items:center; color:rgba(255,255,255,.55); font-weight:800; font-size:22px}
.lb-seat{display:flex; flex-direction:column; align-items:center; gap:3px; border:0; background:none; padding:4px; border-radius:16px; min-width:0; width:100%; color:var(--text); cursor:default}
.lb-seat .avatar{--av:58px}
.lb-seat.empty .avatar{background:var(--panel2); border:3px dashed var(--muted); display:grid; place-items:center; font-size:22px; box-shadow:none}
.lb-seat.can{cursor:pointer}
.lb-seat.can:hover .avatar{border-color:var(--yellow)}
.lb-seat b{font-size:13px; max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap}
.lb-seat small{font-size:11px; color:var(--muted); font-weight:700}
#lbStatus{margin:12px 0; font-weight:700; color:var(--muted); min-height:1.4em}
#lbStart{width:100%}
.seat.off .avatar{filter:grayscale(1) brightness(.7)}
.seat.off .pname::after{content:" \u{1F4F5}"}
.lbtabs{margin-bottom:10px; width:max-content}
.champ{display:flex; align-items:center; gap:10px; background:linear-gradient(135deg,#ffe066,var(--orange)); color:var(--navy); border-radius:18px; padding:10px 14px; margin-bottom:10px; box-shadow:0 4px 0 #c96a1c}
.champ span{font-size:34px; line-height:1}
.champ small{display:block; font-weight:700; font-size:12px}
.champ b{font-size:20px}
.lbl{display:flex; flex-direction:column; gap:6px; max-height:46vh; overflow-y:auto}
.lbrow{display:grid; grid-template-columns:34px 38px 1fr auto; align-items:center; gap:8px; background:var(--panel2); border-radius:14px; padding:6px 10px}
.lbrow.me{box-shadow:inset 0 0 0 2px var(--yellow); background:color-mix(in srgb,var(--yellow) 18%,var(--panel2))}
.lbrow .rk{font-weight:800; font-size:18px; text-align:center}
.lbrow .avs{width:38px; height:38px; border-radius:50%; overflow:hidden; background:var(--avbg)}
.lbrow .avs svg{width:100%; height:100%; display:block}
.lbrow .nm{min-width:0}
.lbrow .nm b{display:block; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis}
.lbrow .nm small{font-size:13px}
.lbrow .wn{text-align:right; line-height:1.1}
.lbrow .wn b{font-size:22px}
.lbrow .wn small{display:block; font-size:11px; color:var(--muted); font-weight:700; white-space:nowrap}
@media (max-height:520px){
  #trick{top:40%}
  #seat1,#seat3{top:22%}
  .feltlogo{top:40%}
  #seat2 .minihand{display:none}
}
@media (min-width:900px){
  #seat1{right:5%} #seat3{left:5%}
  #seat0{left:calc(50% - var(--cw) * 3.6 - var(--av) - 30px); bottom:16px}
  #reactBtn{bottom:22px; right:calc(50% - var(--cw) * 3.6 - 80px)}
  #reactPanel{bottom:84px; right:calc(50% - var(--cw) * 3.6 - 90px)}
}
@media (prefers-reduced-motion: reduce){
  *{animation-duration:.01ms !important; animation-iteration-count:1 !important; transition-duration:.01ms !important}
}

.foot{text-align:center; line-height:1.7}
.foot nav{display:flex; gap:14px; justify-content:center; flex-wrap:wrap}
.foot a{color:var(--text); font-weight:700; text-decoration:none; border-bottom:2px solid var(--yellow)}
` }, "/css/page.css": { "t": "text/css; charset=utf-8", "s": ':root{--emerald:#12b886;--navy:#0b1a3a;--yellow:#ffd23f;--coral:#ff5a5f;--bg:#f4fbf7;--panel:#fff;--text:#0b1a3a;--muted:#51607f;color-scheme:light}\n@media (prefers-color-scheme:dark){:root{--bg:#061430;--panel:#13234a;--text:#f4f7ff;--muted:#a9b6d6;color-scheme:dark}}\n*{box-sizing:border-box}\nbody{margin:0;font-family:"Baloo 2","Noto Sans Sinhala","Iskoola Pota",system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.7;font-size:17px}\nheader.top{background:linear-gradient(160deg,#0b1a3a,#16295c);color:#fff;padding:18px 16px 26px;text-align:center}\nheader.top a.logo{color:var(--yellow);font-weight:800;font-size:22px;text-decoration:none}\nheader.top nav{margin-top:6px;font-size:14px}header.top nav a{color:#fff;margin:0 8px}\nh1{font-size:clamp(28px,6vw,42px);line-height:1.2;margin:14px 0 6px}\nmain{max-width:760px;margin:-14px auto 0;background:var(--panel);border-radius:24px;padding:20px 22px 30px;box-shadow:0 10px 30px rgba(0,0,0,.08)}\nh2{font-size:24px;margin:28px 0 6px;line-height:1.3}\nh3{font-size:18px;margin:18px 0 4px}\n.lead{font-size:18px;color:var(--muted)}\ntable{border-collapse:collapse;width:100%;margin:8px 0;font-size:16px}th,td{border:1px solid rgba(127,127,127,.3);padding:8px;text-align:left}\n.cta{display:block;text-align:center;margin:28px auto 6px;max-width:340px;background:var(--yellow);color:var(--navy);font-weight:800;font-size:22px;padding:14px;border-radius:18px;text-decoration:none;box-shadow:0 5px 0 #c79a00}\ndetails{background:rgba(127,127,127,.08);border-radius:14px;padding:10px 14px;margin:8px 0}summary{font-weight:700;cursor:pointer}\nfooter{text-align:center;color:var(--muted);font-size:14px;padding:24px}\na{color:inherit}\n' }, "/js/app.js": { "t": "text/javascript; charset=utf-8", "s": `(()=>{
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ================= STORAGE ================= */
const store={
  get(k,d){try{const v=localStorage.getItem('omilanka:'+k);return v?Object.assign(Array.isArray(d)?[]:{},d,JSON.parse(v)):d}catch(e){return d}},
  set(k,v){try{localStorage.setItem('omilanka:'+k,JSON.stringify(v))}catch(e){}}
};
const S=store.get('settings',{lang:'si',comments:true,sound:true,voice:false,speed:'normal',target:10,kapothi:'3',timer:true});
const P=store.get('profile',{name:'',avatar:'cool',photo:null});
const ST=store.get('stats',{played:0,wins:0,losses:0,streak:0,best:0,kapothis:0,comebacks:0,whitewash:0});
const saveS=()=>store.set('settings',S), saveP=()=>store.set('profile',P), saveST=()=>store.set('stats',ST);

/* ================= OMI ENGINE (pure, server-portable) ================= */
const SUITS=['S','H','C','D'], RANKS=['7','8','9','10','J','Q','K','A'];
const SYM={S:'\u2660\\uFE0E',H:'\u2665\\uFE0E',D:'\u2666\\uFE0E',C:'\u2663\\uFE0E'};
const RED={H:1,D:1};
function rand(n){const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%n}
const Omi={
  deck(){const d=[];for(const s of SUITS)for(const r of RANKS)d.push({s,r,id:r+s});return d},
  shuffle(a){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=rand(i+1);[b[i],b[j]]=[b[j],b[i]]}return b},
  v(c){return RANKS.indexOf(c.r)},
  legal(hand,trick){if(!trick.length)return hand.slice();const led=trick[0].card.s;const f=hand.filter(c=>c.s===led);return f.length?f:hand.slice()},
  isLegal(hand,trick,card){return Omi.legal(hand,trick).some(c=>c.id===card.id)},
  beats(a,b,trump){if(a.s===b.s)return Omi.v(a)>Omi.v(b);return a.s===trump},
  winnerIdx(trick,trump){let w=0;for(let i=1;i<trick.length;i++)if(Omi.beats(trick[i].card,trick[w].card,trump))w=i;return w},
  scoreRound(tricks,callerTeam,cfg){
    if(tricks[0]===tricks[1])return{tie:true};
    const wt=tricks[0]>tricks[1]?0:1, kap=tricks[wt]===8;
    let pts=wt===callerTeam?1:2;
    if(kap){ if(cfg.kapothi==='game')pts=Infinity; else if(cfg.kapothi==='3')pts=3; }
    return{winnerTeam:wt,points:pts,kapothi:kap,byCaller:wt===callerTeam};
  }
};

/* ================= TEXT ================= */
const LI={si:0,sl:1,en:2};
const T={
si:{
  welcome:['\u0D86\u0DBA\u0DD4\u0DB6\u0DDD\u0DC0\u0DB1\u0DCA! OMI \u0D9C\u0DC4\u0DB1\u0DCA\u0DB1 \u0DBD\u0DD1\u0DC3\u0DCA\u0DAD\u0DD2\u0DAF? \u{1F602}','\u0D9A\u0DCF\u0DA9\u0DCA \u0DA7\u0DD2\u0D9A \u0D85\u0DAD\u0DA7 \u0D9C\u0DB1\u0DCA\u0DB1, \u0D9C\u0DDA\u0DB8 \u0DB4\u0DA7\u0DB1\u0DCA \u0D9C\u0DB8\u0DD4! \u{1F0CF}','\u0D85\u0DAF \u0D9A\u0DC0\u0DD4\u0DAF \u0DC0\u0DD0\u0DA9\u0DCA\u0DA9\u0DCF? \u0DB6\u0DBD\u0DB8\u0DD4\u0D9A\u0DDD! \u{1F60E}','\u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA \u0D91\u0D9A \u0DC4\u0DBB\u0DD2\u0DBA\u0DA7 \u0DAD\u0DDD\u0DBB\u0D9C\u0DAD\u0DCA\u0DAD\u0DDC\u0DAD\u0DCA \u0D9C\u0DDA\u0DB8 \u0D85\u0DB4\u0DDA! \u{1F525}','\u0DAD\u0DDA \u0D91\u0D9A\u0D9A\u0DCA \u0DB6\u0DD3\u0DBD\u0DCF \u0D95\u0DB8\u0DD2 \u0D9C\u0DC4\u0DB8\u0DD4 \u2615'],
  play:'\u0D9C\u0DDA\u0DB8 \u0DB4\u0DA7\u0DB1\u0DCA \u0D9C\u0DB8\u0DD4', playSub:'Bots \u0DAD\u0DD4\u0DB1\u0DCA\u0DAF\u0DD9\u0DB1\u0DD9\u0D9A\u0DCA \u0D91\u0D9A\u0DCA\u0D9A \u0D89\u0D9A\u0DCA\u0DB8\u0DB1\u0DCA \u0D9C\u0DDA\u0DB8\u0D9A\u0DCA', random:'\u0D85\u0DC4\u0DB9\u0DD4 \u0D85\u0DBA \u0D91\u0D9A\u0DCA\u0D9A \u0D9C\u0DC4\u0DB8\u0DD4', private:'Private Room \u0D91\u0D9A\u0D9A\u0DCA', join:'Room \u0D91\u0D9A\u0D9A\u0DA7 \u0DBA\u0DB1\u0DCA\u0DB1',
  leaderboard:'\u0DBD\u0D9A\u0DD4\u0DAB\u0DD4', settings:'\u0DC3\u0DD0\u0D9A\u0DC3\u0DD4\u0DB8\u0DCA', rules:'\u0DB1\u0DD3\u0DAD\u0DD2', profile:'\u0DB8\u0D9C\u0DDA \u0DB4\u0DCA\u200D\u0DBB\u0DDC\u0DC6\u0DBA\u0DD2\u0DBD\u0DCA \u0D91\u0D9A', nickname:'\u0DB1\u0DB8', chooseAvatar:'Avatar \u0D91\u0D9A \u0DAD\u0DDD\u0DBB\u0DB1\u0DCA\u0DB1',
  upload:'\u{1F4F7} \u0DC6\u0DDC\u0DA7\u0DDD \u0D91\u0D9A\u0D9A\u0DCA \u0DAF\u0DCF\u0DB1\u0DCA\u0DB1', removePhoto:'\u0DC6\u0DDC\u0DA7\u0DDD \u0D91\u0D9A \u0D85\u0DBA\u0DD2\u0DB1\u0DCA \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1', save:'\u0DC3\u0DDA\u0DC0\u0DCA \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1', namePh:'\u0D94\u0DBA\u0DCF\u0D9C\u0DDA \u0DB1\u0DB8',
  language:'\u0DB7\u0DCF\u0DC2\u0DCF\u0DC0', comments:'\u0DC0\u0DD2\u0DC4\u0DD2\u0DC5\u0DD4 \u0D9A\u0DB8\u0DD9\u0DB1\u0DCA\u0DA7\u0DCA\u0DC3\u0DCA', sound:'\u0DC3\u0DAF\u0DCA\u0DAF\u0DBA', voice:'\u0DC3\u0DD2\u0D82\u0DC4\u0DBD \u0D9A\u0DA7\u0DC4\u0DAC', voiceNote:'\u0D94\u0DBA\u0DCF\u0D9C\u0DDA device \u0D91\u0D9A\u0DDA \u0DC3\u0DD2\u0D82\u0DC4\u0DBD voice \u0D91\u0D9A\u0D9A\u0DCA \u0DAD\u0DD2\u0DBA\u0DD9\u0DB1\u0DC0\u0DCF \u0DB1\u0DB8\u0DCA \u0DC0\u0DD2\u0DAD\u0DBB\u0DBA\u0DD2 \u0DC0\u0DD0\u0DA9 \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1\u0DDA.',
  speed:'Bots \u0D9C\u0DDA \u0DC0\u0DDA\u0D9C\u0DBA', slow:'\u0DC4\u0DD9\u0DB8\u0DD2\u0DB1\u0DCA', normal:'\u0DC3\u0DCF\u0DB8\u0DCF\u0DB1\u0DCA\u200D\u0DBA', fast:'\u0DC0\u0DDA\u0D9C\u0DD9\u0DB1\u0DCA', target:'\u0DAF\u0DD2\u0DB1\u0DB1\u0DCA\u0DB1 \u0D95\u0DB1 \u0DBD\u0D9A\u0DD4\u0DAB\u0DD4', kapothiRule:'\u0D9A\u0DB4\u0DDD\u0DAD\u0DD2 (\u0D85\u0DAD\u0DCA 8\u0DB8)', kap3:'\u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 3', kapGame:'\u0D9C\u0DDA\u0DB8\u0DB8 \u0DAF\u0DD2\u0DB1\u0DD4\u0DB8\u0DCA', kapNone:'\u0DC3\u0DCF\u0DB8\u0DCF\u0DB1\u0DCA\u200D\u0DBA \u0DBD\u0D9A\u0DD4\u0DAB\u0DD4',
  kapNote:'\u0D9C\u0DB8\u0DCA\u0DC0\u0DBD \u0DB1\u0DD3\u0DAD\u0DD2 \u0DC0\u0DD9\u0DB1\u0DC3\u0DCA \u0DC0\u0DD9\u0DB1\u0DCA\u0DB1 \u0DB4\u0DD4\u0DC5\u0DD4\u0DC0\u0DB1\u0DCA \u2014 \u0D94\u0DBA\u0DCF\u0DBD\u0D9C\u0DDA \u0DC0\u0DD2\u0DAF\u0DD2\u0DC4\u0DA7 \u0DAD\u0DDD\u0DBB\u0DB1\u0DCA\u0DB1.', timer:'\u0DC0\u0DCF\u0DBB timer (\u0DAD\u0DAD\u0DCA\u0DB4\u0DBB 30)', on:'\u0D94\u0DB1\u0DCA', off:'\u0D95\u0DC6\u0DCA', openRules:'\u{1F4DC} \u0DB1\u0DD3\u0DAD\u0DD2 \u0DB6\u0DBD\u0DB1\u0DCA\u0DB1',
  us:'\u0D85\u0DB4\u0DD2', them:'\u0D91\u0DBA\u0DCF\u0DBD\u0DCF', trump:'\u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA', tricks:'\u0D85\u0DAD\u0DCA', you:'\u0D94\u0DBA\u0DCF',
  yourTurn:'\u0D94\u0DBA\u0DCF\u0D9C\u0DDA \u0DC0\u0DCF\u0DBB\u0DBA! \u0D9A\u0DCF\u0DA9\u0DCA \u0D91\u0D9A\u0D9A\u0DCA \u0DAF\u0DCF\u0DB1\u0DCA\u0DB1', yourTurnTouch:'\u0D94\u0DBA\u0DCF\u0D9C\u0DDA \u0DC0\u0DCF\u0DBB\u0DBA! \u0D9A\u0DCF\u0DA9\u0DCA \u0D91\u0D9A \u0D86\u0DBA\u0DD9\u0DAD\u0DCA tap \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1 \u0DB1\u0DD0\u0DAD\u0DCA\u0DB1\u0DB8\u0DCA \u0D8B\u0DA9\u0DA7 \u0D85\u0DAF\u0DD2\u0DB1\u0DCA\u0DB1', turnOf:'{n}\u0D9C\u0DDA \u0DC0\u0DCF\u0DBB\u0DBA...',
  chooseTrump:'\u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA \u0D91\u0D9A \u0DAD\u0DDD\u0DBB\u0DB1\u0DCA\u0DB1', chooseTrumpSub:'\u0D94\u0DBA\u0DCF\u0D9C\u0DDA \u0DB8\u0DD4\u0DBD\u0DCA \u0D9A\u0DCF\u0DA9\u0DCA 4 \u0DB6\u0DBD\u0DBD\u0DCF \u0DAD\u0DDD\u0DBB\u0DB1\u0DCA\u0DB1', choosingTrump:'{n} \u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA \u0D91\u0D9A \u0DAD\u0DDD\u0DBB\u0DB1\u0DC0\u0DCF... \u{1F914}',
  trumpIs:'\u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA \u0D91\u0D9A {s}!', dealing:'\u0D9A\u0DCF\u0DA9\u0DCA \u0DB6\u0DD9\u0DAF\u0DB1\u0DC0\u0DCF... \u{1F0CF}', gameStart:'\u0D94\u0DB1\u0DCA\u0DB1 \u0D9C\u0DDA\u0DB8 \u0DB4\u0DA7\u0DB1\u0DCA \u0D9C\u0DB1\u0DCA\u0DB1\u0DC0\u0DCF!', followSuit:'\u0D85\u0DB1\u0DDA \u0DB6\u0D82, \u0DB8\u0DD4\u0DBD\u0DD2\u0DB1\u0DCA \u0DAF\u0DCF\u0DB4\u0DD4 \u0DB4\u0DCF\u0DA7\u0DB8 \u0DAF\u0DCF\u0DB1\u0DCA\u0DB1 \u0D95\u0DB1\u0DDA! \u{1F605}',
  roundUs:'\u0D85\u0DB4\u0DD2 \u0DC0\u0DA7\u0DBA \u0DAF\u0DD2\u0DB1\u0DD4\u0DC0\u0DCF! \u{1F389}', roundThem:'\u0D91\u0DBA\u0DCF\u0DBD\u0DCF \u0DC0\u0DA7\u0DBA \u0D9C\u0DAD\u0DCA\u0DAD\u0DCF \u{1F629}', roundTie:'\u0D85\u0DAD\u0DCA 4\u0DBA\u0DD2 4\u0DBA\u0DD2, \u0DC3\u0DB8\u0DBA\u0DD2! \u{1F91D}', kapothiUs:'\u0D9A\u0DB4\u0DDD\u0DAD\u0DD2! \u{1F54A}\uFE0F \u0D85\u0DAD\u0DCA 8\u0DB8 \u0D85\u0DB4\u0DDA!', kapothiThem:'\u0D85\u0DB8\u0DCA\u0DB8\u0DDD, \u0D9A\u0DB4\u0DDD\u0DAD\u0DD2 \u0D9A\u0DD1\u0DC0\u0DCF! \u{1F54A}\uFE0F\u{1F480}',
  whyCaller:'\u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA \u0D9A\u0DD2\u0DC0\u0DCA\u0DC0 \u0DA7\u0DD3\u0DB8\u0DCA \u0D91\u0D9A \u0DAF\u0DD2\u0DB1\u0DD4\u0DC0\u0DCF, \u0D92 \u0DB1\u0DD2\u0DC3\u0DCF \u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 1\u0DBA\u0DD2.', whyDefender:'\u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA \u0DB1\u0DDC\u0D9A\u0DD2\u0DC0\u0DCA\u0DC0 \u0DA7\u0DD3\u0DB8\u0DCA \u0D91\u0D9A \u0DAF\u0DD2\u0DB1\u0DD4\u0DC0\u0DCF, \u0D92 \u0DB1\u0DD2\u0DC3\u0DCF \u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 2\u0D9A\u0DCA!', whyKap:'\u0D85\u0DAD\u0DCA 8\u0DB8 \u0D9C\u0DAD\u0DCA\u0DAD\u0DCF, \u0D9A\u0DB4\u0DDD\u0DAD\u0DD2!',
  whyTie:'\u0D9A\u0DCF\u0DA7\u0DC0\u0DAD\u0DCA \u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 \u0DB1\u0DD1. \u0D8A\u0DC5\u0D9F \u0DC0\u0DA7\u0DBA \u0DAF\u0DD2\u0DB1\u0DB1 \u0DA7\u0DD3\u0DB8\u0DCA \u0D91\u0D9A\u0DA7 \u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 {c}\u0D9A\u0DCA \u0D85\u0DB8\u0DAD\u0DBB\u0DC0!', carryAdd:'(\u0DC3\u0DB8 \u0DC0\u0DD4\u0DAB \u0DC0\u0DA7\u0DBA\u0DD9\u0DB1\u0DCA +{c})', nextRound:'\u0D8A\u0DC5\u0D9F \u0DC0\u0DA7\u0DBA \u25B6',
  weWin:'\u0D85\u0DB4\u0DDA \u0DA7\u0DD3\u0DB8\u0DCA \u0D91\u0D9A \u0DAF\u0DD2\u0DB1\u0DD4\u0DB8\u0DCA!', theyWin:'\u0D91\u0DBA\u0DCF\u0DBD\u0DCF \u0DAF\u0DD2\u0DB1\u0DD4\u0DC0\u0DCF... \u{1F62D}', rematch:'\u0D86\u0DBA\u0DD9\u0DAD\u0DCA \u0D9C\u0DC4\u0DB8\u0DD4\u0DAF? \u{1F501}', home:'\u0DB8\u0DD4\u0DBD\u0DCA \u0DB4\u0DD2\u0DA7\u0DD4\u0DC0\u0DA7 \u{1F3E0}', invite:'\u0DBA\u0DCF\u0DC5\u0DD4\u0DC0\u0DB1\u0DCA\u0DA7 \u0D9A\u0DD2\u0DBA\u0DB1\u0DCA\u0DB1 \u{1F4E8}',
  inviteText:'\u0D91\u0DB1\u0DCA\u0DB1 OMI LANKA \u0D9C\u0DC4\u0DB8\u0DD4! \u{1F0CF}\u{1F1F1}\u{1F1F0}', copied:'\u0DBD\u0DD2\u0DB1\u0DCA\u0D9A\u0DCA \u0D91\u0D9A \u0D9A\u0DDC\u0DB4\u0DD2 \u0DC0\u0DD4\u0DAB\u0DCF!',
  onlineTitle:'\u0D94\u0DB1\u0DCA\u0DBD\u0DBA\u0DD2\u0DB1\u0DCA \u0D9C\u0DDA\u0DB8\u0DCA \u{1F310}', onlineBody:'Private rooms, room codes, invite links, random matchmaking \u0DC0\u0DBD\u0DA7 real-time game server \u0D91\u0D9A\u0D9A\u0DCA \u0D95\u0DB1\u0DDA. \u0D92\u0D9A \u0DAD\u0DB8\u0DBA\u0DD2 \u0D8A\u0DC5\u0D9F \u0DB4\u0DD2\u0DBA\u0DC0\u0DBB (Phase 2). \u0DAF\u0DD0\u0DB1\u0DA7 Bots \u0DAD\u0DD4\u0DB1\u0DCA\u0DAF\u0DD9\u0DB1\u0DD9\u0D9A\u0DCA \u0D91\u0D9A\u0DCA\u0D9A \u0DC3\u0DD4\u0DB4\u0DD2\u0DBB\u0DD2 \u0D9C\u0DDA\u0DB8\u0D9A\u0DCA \u0D9C\u0DC4\u0DB8\u0DD4!', playBots:'Bots \u0D91\u0D9A\u0DCA\u0D9A \u0D9C\u0DC4\u0DB8\u0DD4 \u{1F916}',
  statsTitle:'\u0DB8\u0D9C\u0DDA \u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 \u{1F3C6}', statsNote:'\u0DBD\u0DDD\u0D9A \u0DBD\u0DD3\u0DA9\u0DBB\u0DCA\u0DB6\u0DDD\u0DA9\u0DCA \u0D91\u0D9A online accounts \u0D91\u0D9A\u0DCA\u0D9A \u0D91\u0DB1\u0DC0\u0DCF. \u0DAF\u0DD0\u0DB1\u0DA7 \u0DB4\u0DDA\u0DB1\u0DCA\u0DB1\u0DDA \u0DB8\u0DDA device \u0D91\u0D9A\u0DDA \u0DBD\u0D9A\u0DD4\u0DAB\u0DD4.',
  played:'\u0D9C\u0DDA\u0DB8\u0DCA', wins:'\u0DAF\u0DD2\u0DB1\u0DD4\u0DB8\u0DCA', losses:'\u0DB4\u0DD0\u0DBB\u0DAF\u0DD4\u0DB8\u0DCA', winPct:'\u0DAF\u0DD2\u0DB1\u0DD4\u0DB8\u0DCA %', streak:'\u0DAF\u0DD0\u0DB1\u0DCA \u0DB4\u0DD9\u0DC5', best:'\u0DC4\u0DDC\u0DB3\u0DB8 \u0DB4\u0DD9\u0DC5', kapothis:'\u0D9A\u0DB4\u0DDD\u0DAD\u0DD2', awards:'\u0DC3\u0DB8\u0DCA\u0DB8\u0DCF\u0DB1', newAward:'\u0D85\u0DBD\u0DD4\u0DAD\u0DCA \u0DC3\u0DB8\u0DCA\u0DB8\u0DCF\u0DB1\u0DBA\u0D9A\u0DCA! {a}',
  quitTitle:'\u0D9C\u0DDA\u0DB8 \u0DB1\u0DC0\u0DAD\u0DCA\u0DAD\u0DB1\u0DCA\u0DB1\u0DAF?', quitBody:'\u0DB8\u0DDA \u0D9C\u0DDA\u0DB8 \u0D91\u0D9A\u0DDA \u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 \u0DB1\u0DD0\u0DAD\u0DD2 \u0DC0\u0DD9\u0DB1\u0DC0\u0DCF.', quitYes:'\u0D94\u0DC0\u0DCA, \u0DB1\u0DC0\u0DAD\u0DCA\u0DAD\u0DB1\u0DCA\u0DB1', quitNo:'\u0DB1\u0DD1, \u0DAF\u0DD2\u0D9C\u0DA7\u0DB8 \u0D9C\u0DC4\u0DB8\u0DD4',
  tricksTaken:'\u0D85\u0DAD\u0DCA {n}', calledN:'\u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA {n} \u0DC0\u0DAD\u0DCF\u0DC0\u0D9A\u0DCA', photoErr:'\u0D92 \u0DC6\u0DDC\u0DA7\u0DDD \u0D91\u0D9A \u0D9C\u0DB1\u0DCA\u0DB1 \u0DB6\u0DD0\u0DBB\u0DD2 \u0DC0\u0DD4\u0DAB\u0DCF. \u0DC0\u0DD9\u0DB1 \u0D91\u0D9A\u0D9A\u0DCA \u0DAF\u0DCF\u0DBD\u0DCF \u0DB6\u0DBD\u0DB1\u0DCA\u0DB1.',
  suit:{S:'\u0D89\u0DC3\u0DCA\u0DB4\u0DDA\u0DA9\u0DCA',H:'\u0DC4\u0DCF\u0DA7\u0DCA',D:'\u0DAF\u0DD2\u0DBA\u0DB8\u0DB1\u0DCA\u0DAD\u0DD2',C:'\u0D9A\u0DBD\u0DCF\u0DC0\u0DBB\u0DCA'},
  reacts:{'\u{1F602}':'\u0DC4\u0DD2\u0DB1\u0DCF \u0DBA\u0DB1\u0DC0\u0DCF','\u{1F62D}':'\u0D85\u0DB1\u0DDA \u0D85\u0DB4\u0DDC\u0DBA\u0DD2','\u{1F525}':'\u0DC3\u0DD4\u0DB4\u0DD2\u0DBB\u0DD2!','\u{1F926}':'\u0DB8\u0DDC\u0D9A\u0D9A\u0DCA\u0DAF \u0DB6\u0D82?','\u{1F60E}':'\u0DB8\u0DB8 \u0DAD\u0DB8\u0DBA\u0DD2 \u0DC0\u0DD0\u0DA9\u0DCA\u0DA9\u0DCF','\u{1F440}':'\u0DB6\u0DBD\u0DB8\u0DD4\u0D9A\u0DDD','\u{1F480}':'\u0D89\u0DC0\u0DBB\u0DBA\u0DD2 \u0D89\u0DAD\u0DD2\u0DB1\u0DCA','\u2764\uFE0F':'\u0D86\u0DAF\u0DBB\u0DD9\u0DBA\u0DD2'},
  awardsList:{champ:['\u{1F451} OMI Champion','\u0D9C\u0DDA\u0DB8\u0DCA 10\u0D9A\u0DCA \u0DAF\u0DD2\u0DB1\u0DB1\u0DCA\u0DB1'],unlucky:['\u{1F602} \u0D85\u0DC0\u0DCF\u0DC3\u0DB1\u0DCF\u0DC0\u0DDA \u0DBB\u0DA2\u0DCF','\u0D9C\u0DDA\u0DB8\u0DCA 5\u0D9A\u0DCA \u0DB4\u0DBB\u0DAF\u0DD2\u0DB1\u0DCA\u0DB1'],comeback:['\u{1F525} Comeback King','\u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 5\u0D9A\u0DCA \u0DB4\u0DC3\u0DCA\u0DC3\u0DD9\u0DB1\u0DCA \u0D89\u0DB3\u0DBD\u0DCF \u0DAF\u0DD2\u0DB1\u0DB1\u0DCA\u0DB1'],loser:['\u{1F480} Biggest Loser','\u0DBD\u0D9A\u0DD4\u0DAB\u0D9A\u0DCA\u0DC0\u0DAD\u0DCA \u0DB1\u0DD0\u0DAD\u0DD4\u0DC0 \u0DB4\u0DBB\u0DAF\u0DD2\u0DB1\u0DCA\u0DB1'],master:['\u{1F3AF} Card Master','\u0D9A\u0DB4\u0DDD\u0DAD\u0DD2\u0DBA\u0D9A\u0DCA \u0D9C\u0DC4\u0DB1\u0DCA\u0DB1'],legend:['\u{1F0CF} OMI Legend','\u0D9C\u0DDA\u0DB8\u0DCA 50\u0D9A\u0DCA \u0D9C\u0DC4\u0DB1\u0DCA\u0DB1']},
  rulesTitle:'\u0D95\u0DB8\u0DD2 \u0DB1\u0DD3\u0DAD\u0DD2 \u{1F4DC}',
  rulesBody:'<ul><li>\u0D9A\u0DCF\u0DA9\u0DCA <b>32</b>\u0DBA\u0DD2. \u0DC4\u0DD0\u0DB8 \u0DB4\u0DCF\u0DA7\u0D9A\u0DD2\u0DB1\u0DCA\u0DB8 7 \u0D89\u0DB3\u0DB1\u0DCA A \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF. \u0DBD\u0DDC\u0D9A\u0DD4\u0DB8 <b>A</b>, \u0D8A\u0DC5\u0D9F\u0DA7 K, Q, J, 10, 9, 8, \u0DB4\u0DDC\u0DA9\u0DD2\u0DB8 <b>7</b>.</li><li>\u0DC3\u0DD9\u0DBD\u0DCA\u0DBD\u0DB8\u0DCA \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1\u0DDA \u0DC4\u0DAD\u0DBB \u0DAF\u0DD9\u0DB1\u0DBA\u0DD2, \u0DA7\u0DD3\u0DB8\u0DCA \u0DAF\u0DD9\u0D9A\u0DBA\u0DD2. \u0D94\u0DBA\u0DCF\u0D9C\u0DDA \u0DB4\u0DCF\u0DA7\u0DCA\u0DB1\u0DBB\u0DCA \u0D89\u0DB1\u0DCA\u0DB1\u0DDA \u0D9A\u0DD9\u0DC5\u0DD2\u0DB1\u0DCA\u0DB8 \u0D89\u0DC3\u0DCA\u0DC3\u0DBB\u0DC4\u0DD2\u0DB1\u0DCA.</li><li>\u0DB6\u0DD9\u0DAF\u0DB1 \u0D9A\u0DD9\u0DB1\u0DCF\u0D9C\u0DDA \u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DB4\u0DD0\u0DAD\u0DCA\u0DAD\u0DDA \u0D89\u0DB1\u0DCA\u0DB1 \u0D9A\u0DD9\u0DB1\u0DCF\u0DA7 \u0DB8\u0DD4\u0DBD\u0DD2\u0DB1\u0DCA\u0DB8 \u0D9A\u0DCF\u0DA9\u0DCA 4\u0D9A\u0DCA \u0DBD\u0DD0\u0DB6\u0DD9\u0DB1\u0DC0\u0DCF. \u0D92 4 \u0DB6\u0DBD\u0DBD\u0DCF \u0D91\u0DBA\u0DCF <b>\u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA</b> \u0D91\u0D9A \u0DAD\u0DDD\u0DBB\u0DB1\u0DC0\u0DCF. \u0D8A\u0DA7 \u0DB4\u0DC3\u0DCA\u0DC3\u0DDA \u0DC4\u0DD0\u0DB8\u0DDD\u0DA7\u0DB8 \u0DAD\u0DC0 \u0D9A\u0DCF\u0DA9\u0DCA 4\u0D9A\u0DCA.</li><li>\u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA \u0DAD\u0DDD\u0DBB\u0DB4\u0DD4 \u0D9A\u0DD9\u0DB1\u0DCF \u0DB4\u0DC5\u0DB8\u0DD4 \u0D85\u0DAD \u0DB4\u0DA7\u0DB1\u0DCA \u0D9C\u0DB1\u0DCA\u0DB1\u0DC0\u0DCF. \u0D9C\u0DDA\u0DB8 \u0DBA\u0DB1\u0DCA\u0DB1\u0DDA \u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DB4\u0DD0\u0DAD\u0DCA\u0DAD\u0DA7 (anticlockwise).</li><li>\u0DB8\u0DD4\u0DBD\u0DD2\u0DB1\u0DCA \u0DAF\u0DCF\u0DB4\u0DD4 \u0DB4\u0DCF\u0DA7 \u0D94\u0DBA\u0DCF \u0DC5\u0D9F \u0DAD\u0DD2\u0DBA\u0DD9\u0DB1\u0DC0\u0DCF \u0DB1\u0DB8\u0DCA <b>\u0D92 \u0DB4\u0DCF\u0DA7\u0DB8 \u0DAF\u0DCF\u0DB1\u0DCA\u0DB1 \u0D95\u0DB1\u0DDA</b>. \u0DB1\u0DD0\u0DAD\u0DCA\u0DB1\u0DB8\u0DCA \u0D95\u0DB1 \u0D9A\u0DCF\u0DA9\u0DCA \u0D91\u0D9A\u0D9A\u0DCA \u0DAF\u0DCF\u0DB1\u0DCA\u0DB1 \u0DB4\u0DD4\u0DC5\u0DD4\u0DC0\u0DB1\u0DCA, \u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA \u0D91\u0D9A\u0D9A\u0DD2\u0DB1\u0DCA \u0D9A\u0DB4\u0DB1\u0DCA\u0DB1\u0DAD\u0DCA \u0DB4\u0DD4\u0DC5\u0DD4\u0DC0\u0DB1\u0DCA.</li><li>\u0DBD\u0DDC\u0D9A\u0DD4\u0DB8 \u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA \u0D91\u0D9A, \u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA \u0DB1\u0DD0\u0DAD\u0DCA\u0DB1\u0DB8\u0DCA \u0DB8\u0DD4\u0DBD\u0DD2\u0DB1\u0DCA \u0DAF\u0DCF\u0DB4\u0DD4 \u0DB4\u0DCF\u0DA7\u0DDA \u0DBD\u0DDC\u0D9A\u0DD4\u0DB8 \u0D9A\u0DCF\u0DA9\u0DCA \u0D91\u0D9A \u0D85\u0DAD \u0D9C\u0DB1\u0DCA\u0DB1\u0DC0\u0DCF. \u0D85\u0DAD \u0D9C\u0DAD\u0DCA\u0DAD \u0D9A\u0DD9\u0DB1\u0DCF \u0D8A\u0DC5\u0D9F \u0D85\u0DAD \u0DB4\u0DA7\u0DB1\u0DCA \u0D9C\u0DB1\u0DCA\u0DB1\u0DC0\u0DCF.</li><li>\u0D85\u0DAD\u0DCA 8\u0DB1\u0DCA <b>5\u0D9A\u0DCA \u0DC4\u0DDD \u0DC0\u0DD0\u0DA9\u0DD2\u0DBA</b> \u0D9C\u0DAD\u0DCA\u0DAD \u0DA7\u0DD3\u0DB8\u0DCA \u0D91\u0D9A \u0DC0\u0DA7\u0DBA \u0DAF\u0DD2\u0DB1\u0DB1\u0DC0\u0DCF. \u0DA7\u0DCA\u200D\u0DBB\u0DB8\u0DCA\u0DB4\u0DCA \u0D9A\u0DD2\u0DC0\u0DCA\u0DC0 \u0DA7\u0DD3\u0DB8\u0DCA \u0D91\u0D9A \u0DB1\u0DB8\u0DCA <b>\u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 1</b>\u0DBA\u0DD2, \u0D85\u0DB1\u0DD2\u0DAD\u0DCA \u0DA7\u0DD3\u0DB8\u0DCA \u0D91\u0D9A \u0DB1\u0DB8\u0DCA <b>\u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 2</b>\u0DBA\u0DD2.</li><li>\u0D85\u0DAD\u0DCA 8\u0DB8 \u0D9C\u0DAD\u0DCA\u0DAD\u0DDC\u0DAD\u0DCA <b>\u0D9A\u0DB4\u0DDD\u0DAD\u0DD2</b>! \u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 \u0D9A\u0DD3\u0DBA\u0DAF \u0D9A\u0DD2\u0DBA\u0DBD\u0DCF \u0DC3\u0DD0\u0D9A\u0DC3\u0DD4\u0DB8\u0DCA \u0DC0\u0DBD\u0DD2\u0DB1\u0DCA \u0DAD\u0DDD\u0DBB\u0DB1\u0DCA\u0DB1.</li><li>4\u20134 \u0DC3\u0DB8 \u0DC0\u0DD4\u0DAB\u0DDC\u0DAD\u0DCA \u0D9A\u0DCF\u0DA7\u0DC0\u0DAD\u0DCA \u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 \u0DB1\u0DD1. \u0D8A\u0DC5\u0D9F \u0DC0\u0DA7\u0DBA \u0DAF\u0DD2\u0DB1\u0DB1 \u0DA7\u0DD3\u0DB8\u0DCA \u0D91\u0D9A\u0DA7 \u0DBD\u0D9A\u0DD4\u0DAB\u0D9A\u0DCA \u0D85\u0DB8\u0DAD\u0DBB\u0DC0.</li><li>\u0DB8\u0DD4\u0DBD\u0DD2\u0DB1\u0DCA\u0DB8 \u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 <b>{t}</b>\u0DA7 \u0DBA\u0DB1 \u0DA7\u0DD3\u0DB8\u0DCA \u0D91\u0D9A \u0D9C\u0DDA\u0DB8 \u0DAF\u0DD2\u0DB1\u0DB1\u0DC0\u0DCF. \u{1F3C6}</li><li>\u0DB6\u0DD9\u0DAF\u0DB1 \u0D9A\u0DD9\u0DB1\u0DCF \u0DC4\u0DD0\u0DB8 \u0DC0\u0DA7\u0DBA\u0D9A\u0DA7\u0DB8 \u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DB4\u0DD0\u0DAD\u0DCA\u0DAD\u0DA7 \u0DB8\u0DCF\u0DBB\u0DD4 \u0DC0\u0DD9\u0DB1\u0DC0\u0DCF.</li></ul>'
},
sl:{
  welcome:['Ayubowan! OMI gahanna lassthida? \u{1F602}','Card tika athata ganna, game patan gamu! \u{1F0CF}','Ada kawda wadda? Balamuko! \u{1F60E}','Trump eka hariyata thoraganoth game ape! \u{1F525}','The ekak beela omi gahamu \u2615'],
  play:'Game patan gamu', playSub:'Bots thundenek ekka ikman game ekak', random:'Ahambu aya ekka gahamu', private:'Private Room ekak', join:'Room ekakata yanna',
  leaderboard:'Lakunu', settings:'Settings', rules:'Neethi', profile:'Mage profile eka', nickname:'Nama', chooseAvatar:'Avatar eka thoranna',
  upload:'\u{1F4F7} Photo ekak danna', removePhoto:'Photo eka ain karanna', save:'Save karanna', namePh:'Oyage nama',
  language:'Bhashawa', comments:'Vihilu comments', sound:'Saddaya', voice:'Sinhala katahanda', voiceNote:'Oyage device eke Sinhala voice ekak thiyenawa nam vitharai.',
  speed:'Bots la ge wegaya', slow:'Hemin', normal:'Samanya', fast:'Wegen', target:'Dinanna ona lakunu', kapothiRule:'Kapothi (ath 8ma)', kap3:'Lakunu 3', kapGame:'Game ekama dinum', kapNone:'Samanya lakunu',
  kapNote:'Gamwala neethi wenas wenna puluwan \u2014 oyalage widihata thoranna.', timer:'Turn timer (thathpara 30)', on:'On', off:'Off', openRules:'\u{1F4DC} Neethi balanna',
  us:'Api', them:'Eyala', trump:'Trump', tricks:'Ath', you:'Oya',
  yourTurn:'Oyage waaraya! Card ekak danna', yourTurnTouch:'Oyage waaraya! Card eka ayeth tap karanna nathnam udata adinna', turnOf:'{n}ge waaraya...',
  chooseTrump:'Trump eka thoranna', chooseTrumpSub:'Oyage mul card 4 balala thoranna', choosingTrump:'{n} trump eka thoranawa... \u{1F914}',
  trumpIs:'Trump eka {s}!', dealing:'Card bedanawa... \u{1F0CF}', gameStart:'Onna game patan gannawa!', followSuit:'Ane bang, mulin dapu paatama danna one! \u{1F605}',
  roundUs:'Api watee dinuwa! \u{1F389}', roundThem:'Eyala watee gaththa \u{1F629}', roundTie:'Ath 4yi 4yi, samai! \u{1F91D}', kapothiUs:'Kapothi! \u{1F54A}\uFE0F Ath 8ma ape!', kapothiThem:'Ammo, kapothi kaewa! \u{1F54A}\uFE0F\u{1F480}',
  whyCaller:'Trump kiwwa team eka dinuwa, e nisa lakunu 1yi.', whyDefender:'Trump nokiwwa team eka dinuwa, e nisa lakunu 2k!', whyKap:'Ath 8ma gaththa, kapothi!',
  whyTie:'Kaatawath lakunu nae. Eelanga watee dinana team ekata lakunu {c}k amatharawa!', carryAdd:'(sama wuna wateyen +{c})', nextRound:'Eelanga watee \u25B6',
  weWin:'Ape team eka dinum!', theyWin:'Eyala dinuwa... \u{1F62D}', rematch:'Ayeth gahamuda? \u{1F501}', home:'Mul pituwata \u{1F3E0}', invite:'Yaaluwanta kiyanna \u{1F4E8}',
  inviteText:'Enna OMI LANKA gahamu! \u{1F0CF}\u{1F1F1}\u{1F1F0}', copied:'Link eka copy wuna!',
  onlineTitle:'Online game \u{1F310}', onlineBody:'Private rooms, room codes, invite links, random matchmaking walata real-time game server ekak one. Eka thamai eelanga piyawara (Phase 2). Danata Bots thundenek ekka supiri game ekak gahamu!', playBots:'Bots ekka gahamu \u{1F916}',
  statsTitle:'Mage lakunu \u{1F3C6}', statsNote:'Global leaderboard eka online accounts ekka enawa. Danata penne me device eke lakunu.',
  played:'Games', wins:'Dinum', losses:'Paradum', winPct:'Dinum %', streak:'Dan pela', best:'Hondama pela', kapothis:'Kapothi', awards:'Sammana', newAward:'Aluth sammanayak! {a}',
  quitTitle:'Game eka nawaththannada?', quitBody:'Me game eke lakunu nathi wenawa.', quitYes:'Ow, nawaththanna', quitNo:'Nae, digatama gahamu',
  tricksTaken:'Ath {n}', calledN:'Trump {n} wathawak', photoErr:'E photo eka ganna bari wuna. Wena ekak dala balanna.',
  suit:{S:'Ispeed',H:'Haart',D:'Diyamanthi',C:'Kalawar'},
  reacts:{'\u{1F602}':'Hina yanawa','\u{1F62D}':'Ane apoi','\u{1F525}':'Supiri!','\u{1F926}':'Mokakda bang?','\u{1F60E}':'Mama thamai wadda','\u{1F440}':'Balamuko','\u{1F480}':'Iwarai ithin','\u2764\uFE0F':'Adarei'},
  awardsList:{champ:['\u{1F451} OMI Champion','Games 10k dinanna'],unlucky:['\u{1F602} Awasanawe Raja','Games 5k paradinna'],comeback:['\u{1F525} Comeback King','Lakunu 5k passen idala dinanna'],loser:['\u{1F480} Biggest Loser','Lakunakwath nathuwa paradinna'],master:['\u{1F3AF} Card Master','Kapothiyak gahanna'],legend:['\u{1F0CF} OMI Legend','Games 50k gahanna']},
  rulesTitle:'Omi neethi \u{1F4DC}',
  rulesBody:'<ul><li>Card <b>32</b>yi. Hama paatakinma 7 idan A dakwa. Lokuma <b>A</b>, eelangata K, Q, J, 10, 9, 8, podima <b>7</b>.</li><li>Sellam karanne hathara denai, team dekai. Oyage partner inne kelinma issarahin.</li><li>Bedana kenage dakunu paththe inna kenata mulinma card 4k labenawa. E 4 balala eya <b>trump</b> eka thoranawa. Eeta passe hamotama thawa card 4k.</li><li>Trump thorapu kena palamu atha patan gannawa. Game yanne dakunu paththata (anticlockwise).</li><li>Mulin dapu paata oya langa thiyenawa nam <b>e paatama danna one</b>. Nathnam ona card ekak danna puluwan, trump ekakin kapannath puluwan.</li><li>Lokuma trump eka, trump nathnam mulin dapu paate lokuma card eka atha gannawa. Atha gaththa kena eelanga atha patan gannawa.</li><li>Ath 8n <b>5k ho wadiya</b> gaththa team eka watee dinanawa. Trump kiwwa team eka nam <b>lakunu 1</b>yi, anith team eka nam <b>lakunu 2</b>yi.</li><li>Ath 8ma gaththoth <b>kapothi</b>! Lakunu keeyada kiyala settings walin thoranna.</li><li>4\u20134 sama wunoth kaatawath lakunu nae. Eelanga watee dinana team ekata lakunak amatharawa.</li><li>Mulinma lakunu <b>{t}</b>ta yana team eka game dinanawa. \u{1F3C6}</li><li>Bedana kena hama wateekatama dakunu paththata maaru wenawa.</li></ul>'
},
en:{
  welcome:['Ayubowan! Ready to play some OMI? \u{1F602}','Grab your cards, let\u2019s start! \u{1F0CF}','Who\u2019s the champ today? Let\u2019s see! \u{1F60E}','Pick the right trump and the game is ours! \u{1F525}','Cup of tea and a round of Omi \u2615'],
  play:'Play now', playSub:'Quick game with three bots', random:'Play with random players', private:'Private room', join:'Join room',
  leaderboard:'Stats', settings:'Settings', rules:'Rules', profile:'My profile', nickname:'Nickname', chooseAvatar:'Choose your avatar',
  upload:'\u{1F4F7} Upload a photo', removePhoto:'Remove photo', save:'Save', namePh:'Your nickname',
  language:'Language', comments:'Funny comments', sound:'Sound', voice:'Sinhala voice', voiceNote:'Works only if your device has a Sinhala voice installed.',
  speed:'Bot speed', slow:'Slow', normal:'Normal', fast:'Fast', target:'Points to win', kapothiRule:'Kapothi (all 8 tricks)', kap3:'3 points', kapGame:'Wins the game', kapNone:'Normal points',
  kapNote:'House rules vary from village to village, so pick yours.', timer:'Turn timer (30 seconds)', on:'On', off:'Off', openRules:'\u{1F4DC} Read the rules',
  us:'Us', them:'Them', trump:'Trump', tricks:'Tricks', you:'You',
  yourTurn:'Your turn! Play a card', yourTurnTouch:'Your turn! Tap the card again or swipe it up', turnOf:'{n}\u2019s turn...',
  chooseTrump:'Choose trump', chooseTrumpSub:'Look at your first four cards and pick', choosingTrump:'{n} is choosing trump... \u{1F914}',
  trumpIs:'Trump is {s}!', dealing:'Dealing cards... \u{1F0CF}', gameStart:'Here we go, game on!', followSuit:'You have to follow the suit that was led! \u{1F605}',
  roundUs:'We won the round! \u{1F389}', roundThem:'They took the round \u{1F629}', roundTie:'Four tricks each, it\u2019s a tie! \u{1F91D}', kapothiUs:'Kapothi! \u{1F54A}\uFE0F All eight are ours!', kapothiThem:'Ouch, they got a kapothi! \u{1F54A}\uFE0F\u{1F480}',
  whyCaller:'The team that called trump won, so 1 point.', whyDefender:'The team that didn\u2019t call trump won, so 2 points!', whyKap:'All eight tricks: kapothi!',
  whyTie:'No points this round. The next round\u2019s winner gets {c} extra!', carryAdd:'(+{c} from the tied round)', nextRound:'Next round \u25B6',
  weWin:'Our team wins!', theyWin:'They won... \u{1F62D}', rematch:'Play again? \u{1F501}', home:'Home \u{1F3E0}', invite:'Invite friends \u{1F4E8}',
  inviteText:'Come play OMI LANKA with me! \u{1F0CF}\u{1F1F1}\u{1F1F0}', copied:'Link copied!',
  onlineTitle:'Online play \u{1F310}', onlineBody:'Private rooms, room codes, invite links and random matchmaking need a real-time game server, which is the next phase of the build. For now, enjoy a full game with three bots!', playBots:'Play with bots \u{1F916}',
  statsTitle:'My stats \u{1F3C6}', statsNote:'The global leaderboard arrives with online accounts. For now these are your stats on this device.',
  played:'Played', wins:'Wins', losses:'Losses', winPct:'Win %', streak:'Streak', best:'Best streak', kapothis:'Kapothis', awards:'Awards', newAward:'New award! {a}',
  quitTitle:'Leave this game?', quitBody:'The score of this game will be lost.', quitYes:'Yes, leave', quitNo:'No, keep playing',
  tricksTaken:'{n} tricks', calledN:'Called trump {n}\xD7', photoErr:'Couldn\u2019t use that photo. Try another one.',
  suit:{S:'Spades',H:'Hearts',D:'Diamonds',C:'Clubs'},
  reacts:{'\u{1F602}':'LOL','\u{1F62D}':'Oh no','\u{1F525}':'Super!','\u{1F926}':'What was that?','\u{1F60E}':'I\u2019m the boss','\u{1F440}':'Let\u2019s see','\u{1F480}':'It\u2019s over','\u2764\uFE0F':'Love you'},
  awardsList:{champ:['\u{1F451} OMI Champion','Win 10 games'],unlucky:['\u{1F602} King of Bad Luck','Lose 5 games'],comeback:['\u{1F525} Comeback King','Win after trailing by 5'],loser:['\u{1F480} Biggest Loser','Lose without scoring a point'],master:['\u{1F3AF} Card Master','Win a kapothi'],legend:['\u{1F0CF} OMI Legend','Play 50 games']},
  rulesTitle:'How to play Omi \u{1F4DC}',
  rulesBody:'<ul><li>32 cards: 7 to Ace in each suit. <b>Ace</b> is highest, then K, Q, J, 10, 9, 8, and <b>7</b> is lowest.</li><li>Four players in two teams. Your partner sits directly opposite you.</li><li>The player to the dealer\u2019s right gets four cards first, looks at them and chooses <b>trump</b>. Then everyone gets four more.</li><li>The trump caller leads the first trick. Play moves to the right (anticlockwise).</li><li>If you have the suit that was led, <b>you must follow it</b>. If not, play anything, including a trump to cut.</li><li>The highest trump wins the trick, or the highest card of the led suit if no trump was played. The winner leads next.</li><li>The team that takes <b>5 or more</b> of the 8 tricks wins the round: <b>1 point</b> if they called trump, <b>2 points</b> if the other team called it.</li><li>Taking all 8 tricks is a <b>kapothi</b>! Choose its value in Settings.</li><li>A 4\u20134 tie scores nothing; the next round\u2019s winner gets an extra point.</li><li>First team to <b>{t}</b> points wins the game. \u{1F3C6}</li><li>The deal passes to the right each round.</li></ul>'
}};
function t(k,v){let s=T[S.lang]&&T[S.lang][k];if(s===undefined)s=T.en[k];if(typeof s==='string'&&v)s=s.replace(/\\{(\\w+)\\}/g,(m,a)=>v[a]!==undefined?v[a]:m);return s}

/* funny comments [si, singlish, en] */
const C={
  start:[['\u0D9C\u0DDA\u0DB8 \u0DB4\u0DA7\u0DB1\u0DCA \u0D9C\u0DB8\u0DD4! \u{1F4AA}','Game patan gamu! \u{1F4AA}','Let\u2019s go! \u{1F4AA}'],['\u0D85\u0DAF \u0DB1\u0DB8\u0DCA \u0D85\u0DB4\u0DD2 \u0DAF\u0DD2\u0DB1\u0DB1\u0DC0\u0DCF!','Ada nam api dinanawa!','We\u2019re winning today!'],['\u0D9A\u0DCF\u0DA9\u0DCA \u0DC4\u0DDC\u0DB3\u0DA7 \u0DB6\u0DD9\u0DAF\u0DB4\u0DB1\u0DCA \u0DC4\u0DDC\u0DB3\u0DDA \u{1F602}','Card hondata bedapan honde \u{1F602}','Deal me good cards, okay? \u{1F602}']],
  goodHand:[['\u0D85\u0DAF \u0DB1\u0DB8\u0DCA \u0D9C\u0DDC\u0DA9!','Ada nam goda!','Today\u2019s a jackpot!'],['\u0D85\u0DB8\u0DCA\u0DB8\u0DDD! \u0DC3\u0DD4\u0DB4\u0DD2\u0DBB\u0DD2 \u0D9A\u0DCF\u0DA9\u0DCA \u0DA7\u0DD2\u0D9A\u0D9A\u0DCA!','Ammo! Supiri card tikak!','Wow, what a hand!'],['\u0D85\u0DAF \u0DB8\u0D9C\u0DDA \u0DAF\u0DC0\u0DC3!','Ada mage dawasa!','Today is my day!'],['\u0D9C\u0DDA\u0DB8 \u0DB8\u0D9C\u0DDA \u0D85\u0DAD\u0DDA!','Game mage athe!','The game is in my hands!']],
  badMove:[['\u0DB8\u0DDC\u0D9A\u0D9A\u0DCA\u0DAF \u0DB6\u0D82 \u0D92 \u0DAF\u0DD0\u0DB8\u0DCA\u0DB8\u0DDA? \u{1F602}','Mokakda bang e damme? \u{1F602}','What did you just play, machan? \u{1F602}'],['\u0D9A\u0DCF\u0DA9\u0DCA \u0D9C\u0DC4\u0DB1\u0DCA\u0DB1 \u0DAF\u0DB1\u0DCA\u0DB1\u0DD9 \u0DB1\u0DD0\u0DAF\u0DCA\u0DAF?','Card gahanna danne naddha?','Do you even know how to play?'],['\u0D85\u0DB1\u0DDA \u0D85\u0DB8\u0DCA\u0DB8\u0DDD!','Ane ammo!','Oh my goodness!'],['\u0D92\u0D9A \u0DB1\u0DB8\u0DCA \u0DC4\u0DD2\u0DAD\u0DCF\u0D9C\u0DB1\u0DCA\u0DB1 \u0DB6\u0DD1!','Eka nam hithaganna bae!','Never saw that coming!'],['\u0DB4\u0DCF\u0DA7\u0DCA\u0DB1\u0DBB\u0DCA\u0D9C\u0DDA \u0D85\u0DAD\u0DAD\u0DCA \u0D9A\u0DB4\u0DB1\u0DC0\u0DAF? \u{1F926}','Partnerge athath kapanawada? \u{1F926}','Cutting your own partner? \u{1F926}']],
  trickWin:[['\u0D85\u0DB1\u0DCA\u0DB1 \u0DC0\u0DD0\u0DA9\u0DCA\u0DA9\u0DCF!','Anna wadda!','That\u2019s a master!'],['\u0D9A\u0DDC\u0DC4\u0DDC\u0DB8\u0DAF \u0D92\u0D9A?','Kohomada eka?','How about that?'],['\u0DC3\u0DD4\u0DB4\u0DD2\u0DBB\u0DD2 \u0D9C\u0DD0\u0DC4\u0DD2\u0DBD\u0DCA\u0DBD\u0D9A\u0DCA!','Supiri gahillak!','Super shot!'],['\u0DAF\u0DD0\u0DB1\u0DCA \u0DAD\u0DB8\u0DBA\u0DD2 \u0D9C\u0DDA\u0DB8!','Dan thamai game!','Now it\u2019s a game!']],
  aceLost:[['A \u0D91\u0D9A\u0DAD\u0DCA \u0D9C\u0DD2\u0DBA\u0DCF! \u0D85\u0DB1\u0DDA \u0D85\u0DB4\u0DDC\u0DBA\u0DD2 \u{1F62D}','A ekath giya! Ane apoi \u{1F62D}','Even the Ace is gone! \u{1F62D}'],['\u0D86\u0DC3\u0DCA \u0D91\u0D9A\u0D9A\u0DCA \u0D9A\u0DD1\u0DC0\u0DCF! \u{1F602}','Ace ekak kaewa! \u{1F602}','Somebody ate an Ace! \u{1F602}']],
  roundWin:[['\u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 \u0DA7\u0DD2\u0D9A \u0D91\u0DB1\u0DC0\u0DCF! \u{1F525}','Lakunu tika enawa! \u{1F525}','Points rolling in! \u{1F525}'],['\u0DAF\u0DD0\u0DB1\u0DCA \u0DAD\u0DB8\u0DBA\u0DD2 \u0D9C\u0DDA\u0DB8!','Dan thamai game!','Now it\u2019s a game!'],['\u0D85\u0DB4\u0DD2\u0DC0 \u0DB1\u0DC0\u0DAD\u0DCA\u0DAD\u0DB1\u0DCA\u0DB1 \u0DB6\u0DD1!','Apiwa nawaththanna bae!','Nobody can stop us!']],
  lose:[['\u0D85\u0DAF \u0DB1\u0DB8\u0DCA \u0D85\u0DB4\u0DD2 \u0D89\u0DC0\u0DBB\u0DBA\u0DD2!','Ada nam api iwarai!','We\u2019re done for today!'],['\u0DC0\u0DCF\u0DC3\u0DB1\u0DCF\u0DC0 \u0DB1\u0DD0\u0DAD\u0DD2 \u0DAF\u0DC0\u0DC3\u0D9A\u0DCA!','Waasanawa nathi dawasak!','Just not our lucky day!'],['\u0D8A\u0DC5\u0D9F \u0D9C\u0DDA\u0DB8\u0DDA \u0DB6\u0DBD\u0DB8\u0DD4!','Eelanga game eke balamu!','We\u2019ll see next game!'],['\u0D9A\u0DCF\u0DA9\u0DCA \u0DA7\u0DD2\u0D9A\u0DAD\u0DCA \u0D85\u0DB4\u0DD2\u0DA7 \u0DC0\u0DD2\u0DBB\u0DD4\u0DAF\u0DCA\u0DB0\u0DBA\u0DD2!','Card tikath apita viruddhai!','Even the cards are against us!']],
  gameWin:[['\u0D9A\u0DC0\u0DD4\u0DAF \u0DAF\u0DD0\u0DB1\u0DCA \u0DC0\u0DD0\u0DA9\u0DCA\u0DA9\u0DDD?','Kawda dan waddo?','Who\u2019s the boss now?'],['\u0D85\u0DB1\u0DCA\u0DB1 \u0D92\u0D9A\u0DBA\u0DD2 \u0D9C\u0DDA\u0DB8!','Anna ekai game!','Now THAT\u2019s a game!'],['\u0DA2\u0DBA\u0D9C\u0DCA\u200D\u0DBB\u0DC4\u0DAB\u0DBA \u0D85\u0DB4\u0DDA!','Jayagrahanaya ape!','Victory is ours!'],['\u0D85\u0DAF \u0DBB\u0DD1 \u0D85\u0DB4\u0DDA \u0DBB\u0DD1!','Ada rae ape rae!','Tonight is our night!']],
  kapothi:[['\u0D9A\u0DB4\u0DDD\u0DAD\u0DD2! \u{1F54A}\uFE0F \u0D9A\u0DC0\u0DD4\u0DAF \u0DAF\u0DD0\u0DB1\u0DCA \u0DC0\u0DD0\u0DA9\u0DCA\u0DA9\u0DDD?','Kapothi! \u{1F54A}\uFE0F Kawda dan waddo?','Kapothi! \u{1F54A}\uFE0F Who\u2019s the boss now?'],['\u0D85\u0DAD\u0DCA \u0D85\u0DA7\u0DB8 \u0D85\u0DB4\u0DDA! \u{1F60E}','Ath atama ape! \u{1F60E}','All eight tricks are ours! \u{1F60E}']]
};

/* ================= AVATARS ================= */
const AVBG={uncle:'#ffd23f',champ:'#12b886',sleepy:'#3b5bb5',angry:'#ff5a5f',cool:'#ff8c42',village:'#8ce0b9',cat:'#ffe08a',elephant:'#9ad0ff'};
const N='#0b1a3a';
const AV={
uncle:\`<ellipse cx="20" cy="58" rx="6" ry="8" fill="#a8652f"/><ellipse cx="80" cy="58" rx="6" ry="8" fill="#a8652f"/><circle cx="50" cy="56" r="30" fill="#c68642"/><ellipse cx="44" cy="34" rx="10" ry="4" fill="#fff" opacity=".35"/><path d="M22 52 Q22 38 32 34" stroke="#eee" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M78 52 Q78 38 68 34" stroke="#eee" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="40" cy="53" r="8" fill="#fff" stroke="\${N}" stroke-width="2.5"/><circle cx="60" cy="53" r="8" fill="#fff" stroke="\${N}" stroke-width="2.5"/><line x1="48" y1="53" x2="52" y2="53" stroke="\${N}" stroke-width="2.5"/><circle cx="41" cy="54" r="2.8" fill="\${N}"/><circle cx="61" cy="54" r="2.8" fill="\${N}"/><path d="M32 68 Q41 61 50 66 Q59 61 68 68 Q59 72 50 69 Q41 72 32 68Z" fill="#eee"/><path d="M42 76 Q50 81 58 76" stroke="#7a2e1f" stroke-width="3" fill="none" stroke-linecap="round"/>\`,
champ:\`<circle cx="50" cy="58" r="29" fill="#8d5524"/><path d="M28 36 L32 14 L41 27 L50 9 L59 27 L68 14 L72 36 Z" fill="#ffd23f" stroke="#c99700" stroke-width="2.5" stroke-linejoin="round"/><circle cx="50" cy="24" r="3" fill="#ff5a5f"/><path d="M36 54 Q41 48 46 54" stroke="\${N}" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M54 54 Q59 48 64 54" stroke="\${N}" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M36 64 Q50 82 64 64 Z" fill="#fff" stroke="\${N}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="31" cy="64" r="4" fill="#ff8c8c" opacity=".6"/><circle cx="69" cy="64" r="4" fill="#ff8c8c" opacity=".6"/>\`,
sleepy:\`<circle cx="50" cy="58" r="29" fill="#e0ac69"/><path d="M22 42 Q38 8 76 36 Z" fill="#ff5a5f"/><path d="M22 42 Q50 32 76 36" stroke="#fff" stroke-width="5" fill="none"/><circle cx="80" cy="38" r="6" fill="#fff"/><path d="M35 56 Q40 61 45 56" stroke="\${N}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M55 56 Q60 61 65 56" stroke="\${N}" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="72" rx="5" ry="6" fill="#7a2e1f"/><text x="70" y="26" font-size="14" font-weight="800" fill="#fff" font-family="sans-serif">z</text><text x="80" y="16" font-size="10" font-weight="800" fill="#fff" font-family="sans-serif">z</text>\`,
angry:\`<circle cx="18" cy="26" r="6" fill="#fff" opacity=".85"/><circle cx="12" cy="18" r="4" fill="#fff" opacity=".7"/><circle cx="82" cy="26" r="6" fill="#fff" opacity=".85"/><circle cx="88" cy="18" r="4" fill="#fff" opacity=".7"/><circle cx="50" cy="56" r="30" fill="#d9774b"/><path d="M30 28 Q50 18 70 28 Q60 26 50 30 Q40 26 30 28Z" fill="#2b1a10"/><path d="M33 45 L46 51" stroke="\${N}" stroke-width="5" stroke-linecap="round"/><path d="M67 45 L54 51" stroke="\${N}" stroke-width="5" stroke-linecap="round"/><circle cx="41" cy="57" r="3.5" fill="\${N}"/><circle cx="59" cy="57" r="3.5" fill="\${N}"/><path d="M38 75 Q50 66 62 75" stroke="\${N}" stroke-width="3.5" fill="none" stroke-linecap="round"/>\`,
cool:\`<circle cx="50" cy="58" r="29" fill="#a0522d"/><path d="M24 46 Q22 20 50 18 Q72 16 78 34 Q66 26 52 30 Q38 26 24 46Z" fill="#1a1a1a"/><rect x="28" y="47" width="20" height="12" rx="5" fill="\${N}"/><rect x="52" y="47" width="20" height="12" rx="5" fill="\${N}"/><line x1="47" y1="51" x2="53" y2="51" stroke="\${N}" stroke-width="3"/><path d="M32 50 L38 50" stroke="#fff" stroke-width="2" opacity=".7"/><path d="M56 50 L62 50" stroke="#fff" stroke-width="2" opacity=".7"/><path d="M40 72 Q52 77 61 68" stroke="#3b1a0f" stroke-width="3.5" fill="none" stroke-linecap="round"/>\`,
village:\`<circle cx="50" cy="60" r="28" fill="#b5794a"/><ellipse cx="50" cy="38" rx="40" ry="9" fill="#e9c46a" stroke="#b8902e" stroke-width="2"/><path d="M32 38 Q34 16 50 16 Q66 16 68 38Z" fill="#f4d58d" stroke="#b8902e" stroke-width="2"/><rect x="32" y="31" width="36" height="6" fill="#ff5a5f"/><circle cx="41" cy="56" r="3.2" fill="\${N}"/><circle cx="59" cy="56" r="3.2" fill="\${N}"/><path d="M36 66 Q50 82 64 66 Z" fill="#fff" stroke="\${N}" stroke-width="2.5" stroke-linejoin="round"/><rect x="48" y="66" width="4" height="5" fill="\${N}"/><g fill="#5a3a20" opacity=".55"><circle cx="34" cy="74" r="1.2"/><circle cx="38" cy="79" r="1.2"/><circle cx="62" cy="79" r="1.2"/><circle cx="66" cy="74" r="1.2"/><circle cx="50" cy="84" r="1.2"/></g>\`,
cat:\`<path d="M22 44 L26 14 L44 32Z" fill="#ff9f43"/><path d="M78 44 L74 14 L56 32Z" fill="#ff9f43"/><path d="M27 36 L28 21 L37 31Z" fill="#ffc7d1"/><path d="M73 36 L72 21 L63 31Z" fill="#ffc7d1"/><circle cx="50" cy="56" r="30" fill="#ff9f43"/><path d="M50 30 L46 40 M50 30 L54 40 M42 31 L42 40 M58 31 L58 40" stroke="#e07b1a" stroke-width="3" stroke-linecap="round"/><ellipse cx="39" cy="54" rx="6" ry="7" fill="#7ee081"/><ellipse cx="61" cy="54" rx="6" ry="7" fill="#7ee081"/><ellipse cx="39" cy="54" rx="2" ry="6" fill="\${N}"/><ellipse cx="61" cy="54" rx="2" ry="6" fill="\${N}"/><path d="M46 64 L54 64 L50 68Z" fill="#ff6b8a"/><path d="M42 72 Q46 76 50 70 Q54 76 58 72" stroke="\${N}" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M14 62 L32 66 M14 70 L32 70 M86 62 L68 66 M86 70 L68 70" stroke="#fff" stroke-width="2" stroke-linecap="round"/>\`,
elephant:\`<ellipse cx="20" cy="54" rx="17" ry="22" fill="#8a95a3"/><ellipse cx="80" cy="54" rx="17" ry="22" fill="#8a95a3"/><ellipse cx="22" cy="55" rx="10" ry="14" fill="#f2a7b5"/><ellipse cx="78" cy="55" rx="10" ry="14" fill="#f2a7b5"/><circle cx="50" cy="50" r="26" fill="#a3aebb"/><path d="M33 30 Q50 22 67 30 L62 44 Q50 48 38 44Z" fill="#ff5a5f" stroke="#ffd23f" stroke-width="2"/><g fill="#ffd23f"><circle cx="44" cy="36" r="2"/><circle cx="50" cy="38" r="2"/><circle cx="56" cy="36" r="2"/></g><circle cx="41" cy="52" r="3.2" fill="\${N}"/><circle cx="59" cy="52" r="3.2" fill="\${N}"/><path d="M46 60 Q44 76 50 86 Q56 92 60 84" stroke="#a3aebb" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M38 64 L34 72 M62 64 L66 72" stroke="#fff" stroke-width="4" stroke-linecap="round"/>\`
};
function avatarSVG(id){return \`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">\${AV[id]||AV.cool}</svg>\`}
function avatarHTML(id,photo){return photo?\`<img src="\${photo}" alt="">\`:avatarSVG(id)}
const BOTS=[
  {avatar:'uncle',names:['\u0DC3\u0DD4\u0DB1\u0DD2\u0DBD\u0DCA \u0DB8\u0DCF\u0DB8\u0DCF','Sunil Mama','Uncle Sunil']},
  {avatar:'sleepy',names:['\u0DB1\u0DD2\u0DAF\u0DD2\u0DB8\u0DAD \u0DB1\u0DD2\u0DB8\u0DBD\u0DCA','Nidimatha Nimal','Sleepy Nimal']},
  {avatar:'champ',names:['\u0DA0\u0DD0\u0DB8\u0DCA\u0DB4\u0DD2\u0DBA\u0DB1\u0DCA \u0DA0\u0DB8\u0DD2\u0DB1\u0DCA\u0DAF','Champion Chaminda','Champion Chaminda']},
  {avatar:'angry',names:['\u0D9A\u0DDA\u0DB1\u0DCA\u0DAD\u0DD2 \u0D9A\u0DB8\u0DBD\u0DCA','Kenthi Kamal','Grumpy Kamal']},
  {avatar:'village',names:['\u0D9C\u0DB8\u0DDA \u0D9C\u0DD4\u0DAB\u0DDA','Game Gune','Village Gune']},
  {avatar:'cat',names:['\u0DB4\u0DD6\u0DC3\u0DCF \u0DB4\u0DD4\u0D82\u0DA0\u0DD2','Poosa Punchi','Punchi the Cat']},
  {avatar:'elephant',names:['\u0D85\u0DBD\u0DD2\u0DBA\u0DCF \u0D85\u0DA2\u0DD2\u0DAD\u0DCA','Aliya Ajith','Ajith the Elephant']},
  {avatar:'cool',names:['\u0D9A\u0DD6\u0DBD\u0DCA \u0D9A\u0DC3\u0DD4\u0DB1\u0DCA','Cool Kasun','Cool Kasun']}
];

/* ================= SOUND & VOICE ================= */
let AC=null;
function actx(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}}if(AC.state==='suspended')AC.resume();return AC}
function tone(f,dur,o={}){const a=actx();if(!a)return;const {type='sine',vol=.12,at=0,slide=0}=o;const t0=a.currentTime+at;const osc=a.createOscillator(),g=a.createGain();osc.type=type;osc.frequency.setValueAtTime(f,t0);if(slide)osc.frequency.exponentialRampToValueAtTime(Math.max(40,f*slide),t0+dur);g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+.01);g.gain.exponentialRampToValueAtTime(.0001,t0+dur);osc.connect(g).connect(a.destination);osc.start(t0);osc.stop(t0+dur+.03)}
function noise(dur,o={}){const a=actx();if(!a)return;const {vol=.3,freq=2500}=o;const n=Math.floor(a.sampleRate*dur);const b=a.createBuffer(1,n,a.sampleRate);const d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2);const s=a.createBufferSource();s.buffer=b;const f=a.createBiquadFilter();f.type='bandpass';f.frequency.value=freq;f.Q.value=.8;const g=a.createGain();g.gain.value=vol;s.connect(f).connect(g).connect(a.destination);s.start()}
function sfx(n){if(!S.sound)return;try{switch(n){
  case'card':noise(.09,{vol:.6,freq:1800});tone(170,.08,{type:'triangle',vol:.07});break;
  case'deal':noise(.05,{vol:.25,freq:3200});break;
  case'click':tone(660,.07,{type:'triangle',vol:.08});break;
  case'pop':tone(520,.14,{vol:.1,slide:1.8});break;
  case'err':tone(210,.18,{type:'square',vol:.04,slide:.7});break;
  case'trick':tone(784,.12,{type:'triangle',vol:.1});tone(1047,.2,{type:'triangle',vol:.1,at:.09});break;
  case'trump':[523,659,784,1047].forEach((f,i)=>tone(f,.25,{type:'triangle',vol:.09,at:i*.07}));break;
  case'round':[659,784,988].forEach((f,i)=>tone(f,.3,{vol:.1,at:i*.1}));break;
  case'win':[523,659,784,1047,784,1047].forEach((f,i)=>tone(f,.35,{type:'triangle',vol:.12,at:i*.12}));break;
  case'lose':[392,370,349,330].forEach((f,i)=>tone(f,.42,{type:'sawtooth',vol:.04,at:i*.28,slide:.97}));break;
}}catch(e){}}
function speak(txt){
  if(!S.voice||!('speechSynthesis' in window))return;
  try{const vs=speechSynthesis.getVoices();const si=vs.find(v=>/^si/i.test(v.lang));
    if(S.lang==='si'&&!si)return;
    const u=new SpeechSynthesisUtterance(txt.replace(/[^\\p{L}\\p{M}\\p{N}\\s!?.,]/gu,'').trim());
    if(S.lang==='si'){u.voice=si;u.lang=si.lang}else u.lang='en-US';
    speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}
}

/* ================= EXTRA TEXT (online) ================= */
Object.assign(T.si,{roomCode:'Room code', codeCopied:'Code \u0D91\u0D9A \u0D9A\u0DDC\u0DB4\u0DD2 \u0DC0\u0DD4\u0DAB\u0DCF! \u0DBA\u0DCF\u0DC5\u0DD4\u0DC0\u0DB1\u0DCA\u0DA7 \u0DBA\u0DC0\u0DB1\u0DCA\u0DB1 \u{1F4E8}', lobbyNote:'\u0DBA\u0DCF\u0DC5\u0DD4\u0DC0\u0DB1\u0DCA\u0DA7 \u0DB8\u0DDA room code \u0D91\u0D9A \u0DAF\u0DD9\u0DB1\u0DCA\u0DB1. \u0D91\u0DBA\u0DCF\u0DBD\u0DA7 \u0DB8\u0DDA artifact \u0D91\u0D9A share \u0D9A\u0DBB\u0DBD\u0DCF \u0DAD\u0DD2\u0DBA\u0DD9\u0DB1\u0DCA\u0DB1 \u0D95\u0DB1\u0DDA (Share \u2192 invite).', emptySeat:'\u0DC4\u0DD2\u0DC3\u0DCA \u0DAD\u0DD0\u0DB1', tapSit:'tap \u0D9A\u0DBB\u0DBD\u0DCF \u0DC0\u0DCF\u0DA9\u0DD2 \u0DC0\u0DD9\u0DB1\u0DCA\u0DB1', botTag:'Bot', hostTag:'Host', youTag:'\u0D94\u0DBA\u0DCF', startGame:'\u0D9C\u0DDA\u0DB8 \u0DB4\u0DA7\u0DB1\u0DCA \u0D9C\u0DB8\u0DD4 \u25B6', startBots:'Bots \u0DAF\u0DCF\u0DBD\u0DCF \u0DB4\u0DA7\u0DB1\u0DCA \u0D9C\u0DB8\u0DD4 \u25B6', waitingHost:'Host \u0D9C\u0DDA\u0DB8 \u0DB4\u0DA7\u0DB1\u0DCA \u0D9C\u0DB1\u0DCA\u0DB1\u0D9A\u0DB8\u0DCA \u0D89\u0DB1\u0DCA\u0DB1... \u23F3', enterCode:'\u0DBA\u0DCF\u0DC5\u0DD4\u0DC0\u0DCF \u0DAF\u0DD4\u0DB1\u0DCA\u0DB1 \u0D85\u0D9A\u0DD4\u0DBB\u0DD4 5\u0D9A room code \u0D91\u0D9A \u0D9C\u0DC4\u0DB1\u0DCA\u0DB1', joinGo:'\u0DBA\u0DB8\u0DD4 \u25B6', noRoom:'\u0D92 room \u0D91\u0D9A \u0DC4\u0DDC\u0DBA\u0DCF\u0D9C\u0DB1\u0DCA\u0DB1 \u0DB6\u0DD1. Code \u0D91\u0D9A \u0DC4\u0DBB\u0DD2\u0DAF \u0DB6\u0DBD\u0DB1\u0DCA\u0DB1.', roomErr:'Room \u0D91\u0D9A\u0DA7 \u0DC3\u0DB8\u0DCA\u0DB6\u0DB1\u0DCA\u0DB0 \u0DC0\u0DD9\u0DB1\u0DCA\u0DB1 \u0DB6\u0DD0\u0DBB\u0DD2 \u0DC0\u0DD4\u0DAB\u0DCF. \u0D86\u0DBA\u0DD9\u0DAD\u0DCA \u0D8B\u0DAD\u0DCA\u0DC3\u0DCF\u0DC4 \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1.', hostLeft:'Host \u0D9C\u0DD2\u0DBA\u0DCF \u{1F622} \u0DB8\u0DDA \u0D9C\u0DDA\u0DB8 \u0DB1\u0DD0\u0DC0\u0DAD\u0DD4\u0DB1\u0DCF.', onlineNA:'Online \u0D9C\u0DDA\u0DB8\u0DCA \u0DC0\u0DD0\u0DA9 \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1\u0DDA claude.ai \u0D91\u0D9A\u0DA7 sign in \u0DC0\u0DD9\u0DBD\u0DCF \u0DB8\u0DDA artifact \u0D91\u0D9A open \u0D9A\u0DC5\u0DCF\u0DB8 \u0DC0\u0DD2\u0DAD\u0DBB\u0DBA\u0DD2. \u0DAF\u0DD0\u0DB1\u0DA7 Bots \u0D91\u0D9A\u0DCA\u0D9A \u0D9C\u0DC4\u0DB8\u0DD4!', searching:'Players \u0DC4\u0DDC\u0DBA\u0DB1\u0DC0\u0DCF... \u{1F50D}', autoStart:'\u0DAD\u0DAD\u0DCA\u0DB4\u0DBB {s}\u0D9A\u0DD2\u0DB1\u0DCA \u0DB4\u0DA7\u0DB1\u0DCA \u0D9C\u0DB1\u0DCA\u0DB1\u0DC0\u0DCF, \u0DC4\u0DD2\u0DC3\u0DCA \u0DAD\u0DD0\u0DB1\u0DCA \u0DC0\u0DBD\u0DA7 Bots', connecting:'Room \u0D91\u0D9A\u0DA7 \u0DC3\u0DB8\u0DCA\u0DB6\u0DB1\u0DCA\u0DB0 \u0DC0\u0DD9\u0DB1\u0DC0\u0DCF...', spect:'\u0D94\u0DBA\u0DCF \u0DB6\u0DBD\u0DCF\u0D9C\u0DD9\u0DB1 \u0D89\u0DB1\u0DCA\u0DB1\u0DC0\u0DCF \u{1F440}', rematchWait:'Host \u0D86\u0DBA\u0DD9\u0DAD\u0DCA \u0DB4\u0DA7\u0DB1\u0DCA \u0D9C\u0DB1\u0DCA\u0DB1\u0D9A\u0DB8\u0DCA \u0D89\u0DB1\u0DCA\u0DB1... \u23F3', publicTbl:'Public table \u{1F3B2}', privateTbl:'Private room \u{1F512}', leaveTitle:'Room \u0D91\u0D9A\u0DD9\u0DB1\u0DCA \u0DBA\u0DB1\u0DCA\u0DB1\u0DAF?', leaveBody:'\u0D94\u0DBA\u0DCF host \u0DB1\u0DB8\u0DCA \u0DC4\u0DD0\u0DB8\u0DDD\u0DA7\u0DB8 \u0D9C\u0DDA\u0DB8 \u0DB1\u0DC0\u0DAD\u0DD2\u0DB1\u0DC0\u0DCF.', inviteCode:'OMI LANKA \u0D9C\u0DC4\u0DB8\u0DD4! \u{1F0CF} Room code: {c}'});
Object.assign(T.sl,{roomCode:'Room code', codeCopied:'Code eka copy wuna! Yaaluwanta yawanna \u{1F4E8}', lobbyNote:'Yaaluwanta me room code eka denna. Eyalata me artifact eka share karala thiyenna one (Share \u2192 invite).', emptySeat:'His thana', tapSit:'tap karala wadi wenna', botTag:'Bot', hostTag:'Host', youTag:'Oya', startGame:'Game patan gamu \u25B6', startBots:'Bots dala patan gamu \u25B6', waitingHost:'Host game patan gannakam inna... \u23F3', enterCode:'Yaaluwa dunna akuru 5ka room code eka gahanna', joinGo:'Yamu \u25B6', noRoom:'E room eka hoyaganna bae. Code eka harida balanna.', roomErr:'Room ekata sambandha wenna bari wuna. Ayeth try karanna.', hostLeft:'Host giya \u{1F622} Me game eka nawathuna.', onlineNA:'Online game wada karanne claude.ai ekata sign in wela me artifact eka open kalama vitharai. Danata Bots ekka gahamu!', searching:'Players hoyanawa... \u{1F50D}', autoStart:'Thathpara {s}kin patan gannawa, his than walata Bots', connecting:'Room ekata sambandha wenawa...', spect:'Oya balagena innawa \u{1F440}', rematchWait:'Host ayeth patan gannakam inna... \u23F3', publicTbl:'Public table \u{1F3B2}', privateTbl:'Private room \u{1F512}', leaveTitle:'Room eken yannada?', leaveBody:'Oya host nam hamotama game eka nawathinawa.', inviteCode:'OMI LANKA gahamu! \u{1F0CF} Room code: {c}'});
Object.assign(T.en,{roomCode:'Room code', codeCopied:'Code copied! Send it to your friends \u{1F4E8}', lobbyNote:'Give your friends this room code. They need access to this artifact (Share \u2192 invite).', emptySeat:'Empty seat', tapSit:'Tap to sit here', botTag:'Bot', hostTag:'Host', youTag:'You', startGame:'Start the game \u25B6', startBots:'Fill with bots and start \u25B6', waitingHost:'Waiting for the host to start... \u23F3', enterCode:'Type the 5-letter room code your friend gave you', joinGo:'Join \u25B6', noRoom:'Couldn\u2019t find that room. Check the code and try again.', roomErr:'Couldn\u2019t connect to the room. Try again.', hostLeft:'The host left \u{1F622} This game has ended.', onlineNA:'Online play works when you\u2019re signed in to claude.ai and open this artifact there. For now, let\u2019s play with bots!', searching:'Looking for players... \u{1F50D}', autoStart:'Starting in {s}s, bots fill empty seats', connecting:'Connecting to the room...', spect:'You\u2019re watching \u{1F440}', rematchWait:'Waiting for the host to start again... \u23F3', publicTbl:'Public table \u{1F3B2}', privateTbl:'Private room \u{1F512}', leaveTitle:'Leave the room?', leaveBody:'If you\u2019re the host, the game ends for everyone.', inviteCode:'Let\u2019s play OMI LANKA! \u{1F0CF} Room code: {c}'});

/* ================= UI HELPERS ================= */

const PIPS={'7':[[0,0],[2,0],[1,.25],[0,.5],[2,.5],[0,1],[2,1]],'8':[[0,0],[2,0],[1,.25],[0,.5],[2,.5],[1,.75],[0,1],[2,1]],'9':[[0,0],[2,0],[0,1/3],[2,1/3],[1,.5],[0,2/3],[2,2/3],[0,1],[2,1]],'10':[[0,0],[2,0],[1,1/6],[0,1/3],[2,1/3],[0,2/3],[2,2/3],[1,5/6],[0,1],[2,1]]};
const COURT={K:1,Q:1,J:1};const courtCache={};
function courtSVG(r,s){
  const k=r+s;if(courtCache[k])return courtCache[k];
  const ink='#1a1a1a',R='#d22630',B='#2350a6',Y='#f3c02f',SK='#fde3bf',sc=RED[s]?R:ink,sym=SYM[s];
  const L=\`stroke="\${ink}" stroke-width=".55" stroke-linejoin="round"\`;
  let hair='',head='',prop='',robe2='';
  if(r==='K'){
    hair=\`<path d="M23.5 15 Q22 22 25 25 L35 25 Q38 22 36.5 15" fill="\${Y}" \${L}/><path d="M25.5 22 Q30 31 34.5 22 Q32 25.5 30 25.5 Q28 25.5 25.5 22Z" fill="\${Y}" \${L}/><path d="M27 21.6 Q30 20.4 33 21.6" fill="none" stroke="\${ink}" stroke-width=".6"/>\`;
    head=\`<path d="M22.5 11 L23.5 4 L26.5 8 L30 2.5 L33.5 8 L36.5 4 L37.5 11 Z" fill="\${Y}" \${L}/><rect x="22.5" y="10" width="15" height="2.6" fill="\${R}" \${L}/><circle cx="30" cy="6.5" r="1.1" fill="\${B}"/>\`;
    prop=\`<path d="M44 4 L46 4 L46 30 L44 30 Z" fill="#cfd6df" \${L}/><path d="M41 28 L49 28 L49 30 L41 30 Z" fill="\${Y}" \${L}/>\`;
  }else if(r==='Q'){
    hair=\`<path d="M23 13 Q20 26 24 31 L27 25 Q24 19 25 14Z M37 13 Q40 26 36 31 L33 25 Q36 19 35 14Z" fill="\${Y}" \${L}/>\`;
    head=\`<path d="M24 12 L25 6 L27.5 9 L30 5 L32.5 9 L35 6 L36 12 Z" fill="\${Y}" \${L}/><rect x="24" y="11" width="12" height="2.2" fill="\${B}" \${L}/><circle cx="30" cy="7.5" r=".9" fill="\${R}"/>\`;
    prop=\`<path d="M13 22 L16 33" stroke="#2f7d32" stroke-width="1"/><circle cx="12.5" cy="20.5" r="2.3" fill="\${R}" \${L}/><circle cx="12.5" cy="20.5" r=".8" fill="\${Y}"/>\`;
  }else{
    hair=\`<path d="M23.5 14 Q22.5 22 25 24 L25.5 16 Z M36.5 14 Q37.5 22 35 24 L34.5 16Z" fill="#8a5a2b" \${L}/><path d="M28 23 Q30 24.2 32 23" fill="none" stroke="\${ink}" stroke-width=".6"/>\`;
    head=\`<path d="M22 13 Q30 5 38 13 Z" fill="\${R}" \${L}/><rect x="22" y="12" width="16" height="2" fill="\${Y}" \${L}/><path d="M36 9 Q44 2 47 6 Q42 6 37.5 11Z" fill="\${B}" \${L}/>\`;
    prop=\`<path d="M46 8 Q50 18 46 30 Q43 18 46 8Z" fill="\${Y}" \${L}/><line x1="46" y1="10" x2="46" y2="30" stroke="\${ink}" stroke-width=".5"/>\`;
  }
  const face=\`<ellipse cx="30" cy="18.5" rx="5.6" ry="6.6" fill="\${SK}" \${L}/><path d="M26.6 17.2 h1.8 M31.6 17.2 h1.8" stroke="\${ink}" stroke-width=".7"/><path d="M30 17.6 L29.2 20.6 L30.4 20.6" fill="none" stroke="\${ink}" stroke-width=".45"/>\`;
  const robe=\`<path d="M5 45 L5 34 Q8 27 18 26 L42 26 Q52 27 55 34 L55 45 Z" fill="\${R}" \${L}/>
   <path d="M22 26 L30 45 L38 26 Z" fill="\${Y}" \${L}/><path d="M25 26 L30 37 L35 26" fill="none" stroke="\${ink}" stroke-width=".5"/>
   <path d="M5 37 Q9 31 17 30 L19 45 L5 45 Z" fill="\${B}" \${L}/><path d="M55 37 Q51 31 43 30 L41 45 L55 45 Z" fill="\${B}" \${L}/>
   <path d="M6 41 l2 -2 l2 2 l2 -2 l2 2 l2 -2 l2 2 M42 41 l2 -2 l2 2 l2 -2 l2 2 l2 -2 l2 2" fill="none" stroke="\${Y}" stroke-width=".9"/>
   <path d="M18 26 Q30 30 42 26" fill="none" stroke="\${ink}" stroke-width=".55"/>\`;
  const half=\`<g>\${prop}\${robe}\${hair}\${face}\${head}<text x="9" y="13" font-size="9" fill="\${sc}" font-family="Georgia,serif">\${sym}</text></g>\`;
  const id='cc'+k.replace(/\\W/g,'');
  return courtCache[k]=\`<svg viewBox="0 0 60 110" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><clipPath id="\${id}"><rect x="1" y="1" width="58" height="54"/></clipPath></defs><rect x="1" y="1" width="58" height="108" fill="#fff"/><g clip-path="url(#\${id})"><g transform="scale(1 1.222)">\${half}</g></g><g transform="rotate(180 30 55)"><g clip-path="url(#\${id})"><g transform="scale(1 1.222)">\${half}</g></g></g><line x1="1" y1="55" x2="59" y2="55" stroke="\${ink}" stroke-width=".7"/><rect x="1" y="1" width="58" height="108" fill="none" stroke="\${sc}" stroke-width="1.1"/></svg>\`;
}
function cardEl(c){
  const d=document.createElement('div');d.className='card '+(RED[c.s]?'red':'black');
  const sym=SYM[c.s];
  const mid=COURT[c.r]?\`<div class="court">\${courtSVG(c.r,c.s)}</div>\`:c.r==='A'?\`<div class="ace">\${sym}</div>\`:\`<div class="pips">\${(PIPS[c.r]||[]).map(([x,y])=>\`<i class="\${y>.5?'f':''}" style="left:\${x*50}%;top:\${y*100}%">\${sym}</i>\`).join('')}</div>\`;
  d.innerHTML=\`<div class="ix"><span>\${c.r}</span><span>\${sym}</span></div>\${mid}<div class="ix b"><span>\${c.r}</span><span>\${sym}</span></div>\`;
  d.setAttribute('aria-label',c.r+' '+t('suit')[c.s]);return d;
}
const CARDIDS=new Set(Omi.deck().map(c=>c.id));
function cardFromId(id){if(typeof id!=='string'||!CARDIDS.has(id))return null;return{r:id.slice(0,-1),s:id.slice(-1),id}}
function toast(msg){const e=$('#toast');e.textContent=msg;e.classList.add('show');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('show'),2600)}
function showScreen(id){$$('.screen').forEach(s=>s.classList.toggle('active',s.id===id))}
const SPD=()=>({slow:1.5,normal:1,fast:.55}[S.speed]||1);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function relRect(el){const tr=$('#table').getBoundingClientRect(),r=el.getBoundingClientRect();return{x:r.left-tr.left,y:r.top-tr.top,w:r.width,h:r.height}}
function pick(a){return a[rand(a.length)]}
const touchUI=()=>matchMedia('(pointer: coarse)').matches;
const REPLY={'\u{1F602}':'\u{1F602}','\u{1F60E}':'\u{1F440}','\u{1F525}':'\u{1F60E}','\u{1F926}':'\u{1F602}','\u{1F480}':'\u{1F62D}','\u2764\uFE0F':'\u2764\uFE0F','\u{1F62D}':'\u{1F602}','\u{1F440}':'\u{1F60E}'};

/* ================= IDENTITY ================= */
let CID=null;try{CID=localStorage.getItem('omilanka:cid')}catch(e){}
if(!CID||!/^[a-z0-9]{8,40}$/i.test(CID)){CID=Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>'abcdefghijkmnpqrstuvwxyz23456789'[b%32]).join('');try{localStorage.setItem('omilanka:cid',CID)}catch(e){}}
const cleanName=n=>String(n||'').replace(/[\\u0000-\\u001f\\u007f\\u200b\\u200e\\u200f\\u202a-\\u202e\\u2060-\\u2064\\ufeff]/g,'').trim().slice(0,16);
/* ================= BOT AI ================= */
const Bot={
  chooseTrump(h){let best=h[0].s,bs=-1;for(const s of SUITS){const cs=h.filter(c=>c.s===s);if(!cs.length)continue;const sc=cs.length*10+cs.reduce((a,c)=>a+Omi.v(c),0)+rand(3);if(sc>bs){bs=sc;best=s}}return best},
  play(h,tr,T,seat){
    const legal=Omi.legal(h,tr),cost=c=>(c.s===T?20:0)+Omi.v(c);
    const low=a=>a.slice().sort((x,y)=>cost(x)-cost(y))[0],high=a=>a.slice().sort((x,y)=>cost(y)-cost(x))[0];
    if(!tr.length){
      const nonT=legal.filter(c=>c.s!==T),trumps=legal.filter(c=>c.s===T);
      const aces=nonT.filter(c=>c.r==='A');if(aces.length)return aces[0];
      if(trumps.length>=3&&trumps.some(c=>c.r==='A'||c.r==='K'))return high(trumps);
      if(nonT.length){const by={};nonT.forEach(c=>(by[c.s]=by[c.s]||[]).push(c));return low(Object.values(by).sort((a,b)=>b.length-a.length)[0])}
      return low(legal);
    }
    const wi=Omi.winnerIdx(tr,T),wc=tr[wi].card,led=tr[0].card.s;
    if(tr[wi].seat%2===seat%2)return low(legal);
    const winners=legal.filter(c=>Omi.beats(c,wc,T));
    if(winners.length){if(tr.length===3)return low(winners);const top=winners.filter(c=>c.s===led&&c.r==='A');return top.length?top[0]:low(winners)}
    return low(legal);
  }
};

/* ================= HOST ENGINE (authoritative game server) ================= */
function makeHost(o){
  const H={gen:0,ids:['me',null,null,null],pk:[null,null,null,null],lastSeq:[0,0,0,0],lastRx:[],offAt:[0,0,0,0],pending:null,contRes:null,contRej:null,lastSay:0,lastIdx:{},enc:[],hands:[[],[],[],[]],trick:[],pubTbl:!!o.pubTbl,lobbyEnd:o.pubTbl?Date.now()+25000:0,rbN:0,endN:0};
  const s=H.s={v:0,ph:o.lobby?'lobby':'start',seats:o.seats,sc:[0,0],cr:0,tg:S.target,kp:S.kapothi,dl:0,cl:null,tp:null,tu:null,tk:[],tr:[0,0],nc:[0,0,0,0],pt:[0,0,0,0],calls:[0,0,0,0],rn:0,cx:[0,-1],ev:[0],rb:null,end:null,tl:0,as:0};
  H.view=()=>JSON.parse(JSON.stringify(s));
  H.pub=()=>{s.v++;o.onPub(H)};
  H.isBot=i=>!!(s.seats[i]&&s.seats[i].b!==undefined);
  H.wait=async ms=>{const g=H.gen;await sleep(ms*SPD());if(g!==H.gen)throw'cancel'};
  H.later=(fn,ms)=>{const g=H.gen;setTimeout(()=>{if(g===H.gen){fn();H.pub()}},ms)};
  const bots=f=>[0,1,2,3].filter(i=>H.isBot(i)&&(!f||f(i)));
  H.speaker=f=>{const b=bots(f);return b.length?pick(b):-1};
  H.say=(seat,key,force)=>{const now=Date.now();if(!force&&now-H.lastSay<1800)return;H.lastSay=now;const arr=C[key];let i=rand(arr.length);if(arr.length>1&&i===H.lastIdx[key])i=(i+1)%arr.length;H.lastIdx[key]=i;s.ev=[s.ev[0]+1,seat,key,i]};
  H.rx=(seat,e)=>{if(seat>=0)s.ev=[s.ev[0]+1,seat,'@',e]};
  H.humanRx=(seat,e)=>{if(!REPLY[e]||Math.random()>=.45)return;const b=H.speaker(i=>i!==seat);if(b>=0)H.later(()=>H.rx(b,REPLY[e]),900+rand(600))};
  H.input=(seat,kind,val)=>{
    const p=H.pending;if(!p||p.seat!==seat||p.kind!==kind)return false;
    if(kind==='trump'){if(!SUITS.includes(val))return false;H.pending=null;p.res(val);return true}
    const card=H.hands[seat].find(c=>c.id===val);if(!card||!Omi.isLegal(H.hands[seat],H.trick,card))return false;
    H.pending=null;p.res(card);return true;
  };
  H.auto=()=>{const p=H.pending;if(!p)return;H.input(p.seat,p.kind,p.kind==='trump'?Bot.chooseTrump(H.hands[p.seat]):Bot.play(H.hands[p.seat],H.trick,s.tp,p.seat).id)};
  H.waitFor=(seat,kind)=>new Promise((res,rej)=>{H.pending={seat,kind,res,rej,t0:Date.now()}});
  H.abort=()=>{H.gen++;if(H.pending){const p=H.pending;H.pending=null;p.rej('cancel')}if(H.contRej){const r=H.contRej;H.contRej=H.contRes=null;r('cancel')}};
  H.destroy=()=>{H.abort();clearInterval(H.tickI)};
  H.cont=()=>{if(H.contRes)H.contRes()};
  H.tickI=setInterval(()=>{
    const p=H.pending;
    if(p){const st=s.seats[p.seat];const off=st&&st.h&&!st.on&&Date.now()-H.offAt[p.seat]>8000;if((S.timer&&Date.now()-p.t0>30500)||off)H.auto()}
    if(s.ph==='lobby'&&H.pubTbl){const rem=Math.max(0,Math.ceil((H.lobbyEnd-Date.now())/1000));if(rem===0||[1,2,3].every(i=>s.seats[i]))H.start();else if(rem!==s.as){s.as=rem;H.pub()}}
  },400);
  H.start=()=>{
    const used=new Set(s.seats.filter(Boolean).map(x=>x.a));
    const pool=Omi.shuffle(BOTS.map((b,i)=>i).filter(i=>!used.has(BOTS[i].avatar)));
    for(let i=1;i<4;i++)if(!s.seats[i])s.seats[i]={b:pool.pop()};
    H.run();
  };
  H.deal=async(deck,start,n)=>{let idx=start;for(let i=0;i<4;i++){const seat=(s.cl+i)%4;H.hands[seat].push(...deck.slice(idx,idx+n));idx+=n;s.nc[seat]+=n;H.pub();await H.wait(n*55+170)}await H.wait(250)};
  H.trickTalk=(w,done)=>{
    const ace=done.find(x=>x.card.r==='A'&&x.seat!==w);
    if(ace&&Math.random()<.55){H.say(H.speaker(i=>i!==ace.seat),'aceLost');return}
    if(!H.isBot(w)){const pt=(w+2)%4;if(H.isBot(pt)&&Math.random()<.5)H.say(pt,'trickWin');else if(Math.random()<.35)H.rx(H.speaker(i=>i%2!==w%2),pick(['\u{1F62D}','\u{1F926}','\u{1F440}']))}
    else if(Math.random()<.28)H.say(w,'trickWin');else if(Math.random()<.2)H.rx(w,'\u{1F60E}');
  };
  H.round=async()=>{
    s.rn++;H.hands=[[],[],[],[]];H.trick=[];s.nc=[0,0,0,0];s.tk=[];s.tr=[0,0];s.tp=null;s.cl=(s.dl+1)%4;s.tu=null;s.ph='deal';s.rb=null;H.pub();
    const deck=Omi.shuffle(Omi.deck());
    await H.deal(deck,0,4);
    s.ph='trump';s.tu=s.cl;s.tl=H.isBot(s.cl)?0:(S.timer?30000:0);H.pub();
    let tp;if(H.isBot(s.cl)){await H.wait(1300);tp=Bot.chooseTrump(H.hands[s.cl])}else tp=await H.waitFor(s.cl,'trump');
    s.tp=tp;s.calls[s.cl]++;s.tu=null;s.ph='deal';H.pub();await H.wait(1300);
    await H.deal(deck,16,4);
    const strong=bots(i=>{const h=H.hands[i];return h.filter(c=>c.s===tp).length*2+h.filter(c=>c.r==='A').length>=7});
    if(strong.length&&Math.random()<.7)H.say(pick(strong),'goodHand');
    s.ph='play';let leader=s.cl;
    for(let n8=0;n8<8;n8++){
      H.trick=[];s.tk=[];
      for(let k=0;k<4;k++){
        const seat=(leader+k)%4,bot=H.isBot(seat);s.tu=seat;s.tl=bot?0:(S.timer?30000:0);H.pub();
        let card;if(bot){await H.wait(650+rand(550));card=Bot.play(H.hands[seat],H.trick,tp,seat)}else card=await H.waitFor(seat,'play');
        if(!Omi.isLegal(H.hands[seat],H.trick,card))card=Omi.legal(H.hands[seat],H.trick)[0];
        const prev=H.trick.length?H.trick[Omi.winnerIdx(H.trick,tp)]:null;
        H.hands[seat]=H.hands[seat].filter(c=>c.id!==card.id);s.nc[seat]--;H.trick.push({seat,card});s.tk.push([seat,card.id]);
        if(prev&&prev.seat!==seat&&prev.seat%2===seat%2&&card.s===tp&&H.trick[0].card.s!==tp&&Omi.beats(card,prev.card,tp)){
          const sp=H.isBot((seat+2)%4)?(seat+2)%4:H.speaker(i=>i!==seat);H.later(()=>H.say(sp,'badMove',true),450);
        }
        s.tu=null;
        H.pub();await H.wait(380);
      }
      await H.wait(900);
      const w=H.trick[Omi.winnerIdx(H.trick,tp)].seat;s.tr[w%2]++;s.pt[w]++;
      H.trickTalk(w,H.trick);s.cx=[s.cx[0]+1,w];s.tk=[];H.pub();await H.wait(900);leader=w;
    }
    const res=Omi.scoreRound(s.tr,s.cl%2,{kapothi:s.kp});H.rbN++;const rb={n:H.rbN,t:s.tr.slice()};
    if(res.tie){s.cr+=1;Object.assign(rb,{tie:1,cr:s.cr})}
    else{
      let p=res.points===Infinity?Math.max(s.tg-s.sc[res.winnerTeam],1):res.points;const carry=s.cr;s.cr=0;p+=carry;s.sc[res.winnerTeam]+=p;
      Object.assign(rb,{wt:res.winnerTeam,p,kap:res.kapothi?1:0,byC:res.byCaller?1:0,carry});
      H.say(H.speaker(i=>i%2===res.winnerTeam),res.kapothi?'kapothi':'roundWin',true);
      const lb=H.speaker(i=>i%2!==res.winnerTeam);if(lb>=0)H.later(()=>H.say(lb,'lose',true),1600);
    }
    s.rb=rb;s.ph='round';s.tu=null;H.pub();
    await new Promise((res2,rej)=>{const to=setTimeout(()=>{H.contRes=H.contRej=null;res2()},6500*SPD());H.contRes=()=>{clearTimeout(to);H.contRes=H.contRej=null;res2()};H.contRej=e=>{clearTimeout(to);rej(e)}});
  };
  H.run=async()=>{
    H.abort();
    Object.assign(s,{sc:[0,0],cr:0,dl:rand(4),rn:0,pt:[0,0,0,0],calls:[0,0,0,0],end:null,rb:null,tk:[],tr:[0,0],nc:[0,0,0,0],tp:null,tu:null,cl:null,ph:'start',tg:S.target,kp:S.kapothi,as:0,tl:0});
    H.hands=[[],[],[],[]];H.trick=[];H.pub();
    H.later(()=>H.say(H.speaker(),'start',true),900);
    try{
      await H.wait(1900);
      while(true){
        await H.round();
        if(s.sc[0]>=s.tg||s.sc[1]>=s.tg){H.endN++;s.ph='end';s.end={n:H.endN,w:s.sc[0]>s.sc[1]?0:1};s.tu=null;H.pub();return}
        s.dl=(s.dl+1)%4;
      }
    }catch(e){if(e!=='cancel')console.error(e)}
  };
  return H;
}

/* ================= CLIENT VIEW ================= */
let HOST=null;
const V={mode:'off',pub:null,mySeat:0,spect:false,hand:[],shown:[],myTurn:false,selected:null,evN:0,cxN:0,bannerN:0,endN:0,lastPh:null,seatSig:null,glowed:false,maxDef:0,kapUs:0,timerI:null};
const pos=s=>(s-V.mySeat+4)%4, myT=()=>V.mySeat%2;
function seatName(s){const st=V.pub&&V.pub.seats[s];if(!st)return'';if(st.b!==undefined)return(BOTS[st.b]||BOTS[0]).names[LI[S.lang]];if(s===V.mySeat&&!V.spect)return P.name||t('you');return cleanName(st.n)||'Player'}
function seatAv(s){const st=V.pub.seats[s];if(!st)return{a:'cool',photo:null};if(st.b!==undefined)return{a:(BOTS[st.b]||BOTS[0]).avatar,photo:null};return{a:AV[st.a]?st.a:'cool',photo:(s===V.mySeat&&!V.spect&&V.mode!=='client')||(s===V.mySeat&&!V.spect)?P.photo:null}}
const seatSig=p=>JSON.stringify(p.seats.map(x=>x&&[x.b,x.n,x.a,x.h]))+V.mySeat+S.lang+V.spect;
function buildSeats(){
  const p=V.pub;
  for(let q=0;q<4;q++)$('#seat'+q).innerHTML='';
  for(let s=0;s<4;s++){const st=p.seats[s];if(!st)continue;const el=$('#seat'+pos(s));const {a,photo}=seatAv(s);
    el.innerHTML=\`<div class="avatar team\${s%2===myT()?0:1}" style="--avbg:\${AVBG[a]}"><div class="ph">\${avatarHTML(a,photo)}</div><span class="chip dealer">D</span><span class="chip caller">T</span></div><div class="pname"></div>\${pos(s)?'<div class="minihand"></div>':''}<div class="bubble"></div>\`;
    el.querySelector('.pname').textContent=seatName(s);}
  V.seatSig=seatSig(p);
}
function renderSeats(){const p=V.pub;for(let s=0;s<4;s++){const el=$('#seat'+pos(s)),st=p.seats[s];el.classList.toggle('turn',p.tu===s);el.classList.toggle('isDealer',p.ph!=='start'&&p.dl===s);el.classList.toggle('isCaller',p.cl===s);el.classList.toggle('off',!!(st&&st.h&&!st.on));const cc=el.querySelector('.chip.caller');if(cc)cc.textContent=p.tp&&p.cl===s?SYM[p.tp]:'T'}}
function renderMini(){const p=V.pub;for(let s=0;s<4;s++){if(!pos(s))continue;const m=$(\`#seat\${pos(s)} .minihand\`);if(m)m.innerHTML='<i></i>'.repeat(Math.max(0,Math.min(8,p.nc[s]|0)))}}
function setNum(sel,v){const e=$(sel);if(e.textContent!==String(v)){e.textContent=v;const p=e.parentElement;p.classList.remove('bump');void p.offsetWidth;p.classList.add('bump')}}
function renderHud(){
  const p=V.pub;if(!p)return;const m=myT();
  setNum('#scA',p.sc[m]);setNum('#scB',p.sc[1-m]);$('#tgt').textContent=p.tg;$('#trA').textContent=p.tr[m];$('#trB').textContent=p.tr[1-m];
  const tb=$('#trumpBox');$('#trumpSym').textContent=p.tp?SYM[p.tp]:'?';tb.className='trumpbox'+(p.tp?' set'+(RED[p.tp]?' red':''):'');
  const c=$('#carry');c.hidden=!p.cr;c.textContent=p.cr?'+'+p.cr:'';
}
const curTrick=()=>V.pub.tk.map(([seat,id])=>({seat,card:cardFromId(id)})).filter(x=>x.card);
function sortHand(){const tp=V.pub&&V.pub.tp,o=s=>s===tp?-1:SUITS.indexOf(s);V.hand.sort((a,b)=>o(a.s)-o(b.s)||Omi.v(b)-Omi.v(a))}
function renderHand(){
  const el=$('#hand');el.innerHTML='';if(V.spect)return;const h=V.hand,n=h.length,tp=V.pub&&V.pub.tp;
  const legal=V.myTurn?Omi.legal(h,curTrick()).map(c=>c.id):null;
  h.forEach((c,i)=>{const d=cardEl(c);d.dataset.id=c.id;const off=i-(n-1)/2;
    d.style.setProperty('--r',(off*3.2)+'deg');d.style.setProperty('--y',(off*off*1.5)+'px');
    if(tp&&c.s===tp)d.classList.add('trumpc');
    if(legal){d.classList.add(legal.includes(c.id)?'playable':'dim');d.tabIndex=0}
    if(V.selected===c.id)d.classList.add('sel');
    d.addEventListener('pointerdown',onCardDown);
    d.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&V.myTurn){e.preventDefault();tryPlay(c)}});
    el.append(d)});
}
function status(key,vars){V.st=[key,vars];$('#statusText').textContent=t(key,vars);$('#status').classList.toggle('mine',key==='yourTurn'||key==='yourTurnTouch'||key==='chooseTrump')}
function updStatus(){
  const p=V.pub;let k=null,v;
  if(p.ph==='start')k='gameStart';
  else if(p.ph==='deal')k='dealing';
  else if(p.ph==='trump'){if(p.tu===V.mySeat&&!V.spect)k='chooseTrump';else{k='choosingTrump';v={n:seatName(p.tu)}}}
  else if(p.ph==='play'&&p.tu!=null){if(p.tu===V.mySeat&&!V.spect)k=touchUI()?'yourTurnTouch':'yourTurn';else{k='turnOf';v={n:seatName(p.tu)}}}
  else if(p.ph==='round'&&p.rb)k=p.rb.tie?'roundTie':(p.rb.wt===myT()?'roundUs':'roundThem');
  if(V.spect&&p.ph==='play')k='spect',v=null;
  if(k)status(k,v);
}

/* ---- comments, reactions ---- */
function bubble(q,text){const b=$(\`#seat\${q} .bubble\`);if(!b)return;b.textContent=text;b.classList.add('show');clearTimeout(b._t);b._t=setTimeout(()=>b.classList.remove('show'),2800)}
function floatReact(q,emo){
  if(!t('reacts')[emo])return;const av=$(\`#seat\${q} .avatar\`);if(!av)return;const r=relRect(av);const el=document.createElement('div');el.className='react';
  el.innerHTML=\`<span class="e">\${emo}</span><span class="l"></span>\`;el.querySelector('.l').textContent=t('reacts')[emo];$('#fx').append(el);
  el.style.left=(r.x+r.w/2-el.offsetWidth/2)+'px';el.style.top=(r.y-10)+'px';
  el.animate([{transform:'translateY(20px) scale(.3)',opacity:0},{transform:'translateY(-10px) scale(1.15)',opacity:1,offset:.2},{transform:'translateY(-20px) scale(1)',opacity:1,offset:.7},{transform:'translateY(-70px) scale(.9)',opacity:0}],{duration:2000,easing:'ease-out'}).onfinish=()=>el.remove();
}
function showEvent(ev){
  const [,seat,key,val]=ev;if(typeof seat!=='number')return;
  if(key==='@'){if(seat>=0&&seat<4)floatReact(pos(seat),val);return}
  if(!S.comments||!C[key]||!C[key][val])return;const text=C[key][val][LI[S.lang]];
  if(seat<0||seat>3)toast('\u{1F4E3} '+text);else bubble(pos(seat),text);
}
let lastReact=0;
function buildReactPanel(){const p=$('#reactPanel');const R=t('reacts');p.innerHTML=Object.keys(R).map(e=>\`<button data-e="\${e}">\${e}<small></small></button>\`).join('');
  p.querySelectorAll('button').forEach(b=>{b.querySelector('small').textContent=R[b.dataset.e];b.onclick=()=>{
    if(Date.now()-lastReact<900||V.spect)return;lastReact=Date.now();p.classList.remove('show');const e=b.dataset.e;floatReact(0,e);sfx('pop');
    if(V.mode==='off'&&HOST)HOST.humanRx(V.mySeat,e);else netEmit('rx',{e});
  }})}
$('#reactBtn').onclick=()=>{$('#reactPanel').classList.toggle('show');sfx('click')};
function splash(html){const s=$('#splash');s.innerHTML=html;s.className='';void s.offsetWidth;s.className='show'}

/* ---- animations ---- */
function flyBack(from,to){const el=document.createElement('div');el.className='card back fly';$('#fx').append(el);
  const w=el.offsetWidth,h=el.offsetHeight,fx=from.x+from.w/2-w/2,fy=from.y+from.h/2-h/2,tx=to.x+to.w/2-w/2,ty=to.y+to.h/2-h/2;
  el.style.left=tx+'px';el.style.top=ty+'px';
  el.animate([{transform:\`translate(\${fx-tx}px,\${fy-ty}px) scale(.9)\`,opacity:1},{transform:\`translate(0,0) rotate(\${rand(40)-20}deg) scale(.55)\`,opacity:.15}],{duration:340*SPD(),easing:'cubic-bezier(.2,.7,.3,1)'}).onfinish=()=>el.remove()}
function seatTarget(q){return q===0?$('#hand'):($(\`#seat\${q} .minihand\`)||$(\`#seat\${q} .avatar\`)||$('#trick'))}
function dealAnim(s,d){const from=relRect($('#trick')),to=relRect(seatTarget(pos(s)));for(let k=0;k<d;k++)setTimeout(()=>{flyBack(from,to);sfx('deal')},k*55*SPD())}
function clearSlots(){[0,1,2,3].forEach(q=>$('#slot'+q).innerHTML='');V.shown=[];V.glowed=false}
function placeCard(seat,card,anim){
  const q=pos(seat);const src=(seat===V.mySeat&&!V.spect)?($(\`#hand [data-id="\${card.id}"]\`)||$('#hand')):seatTarget(q);const sr=relRect(src);
  const slot=$('#slot'+q);slot.innerHTML='';const el=cardEl(card);if(card.s===V.pub.tp)el.classList.add('trumpc');slot.append(el);
  const rot=rand(17)-8;el.style.transform=\`rotate(\${rot}deg)\`;if(!anim)return;const dr=relRect(slot);
  el.animate([{transform:\`translate(\${sr.x+sr.w/2-(dr.x+dr.w/2)}px,\${sr.y+sr.h/2-(dr.y+dr.h/2)}px) rotate(\${rot+(q%2?90:0)}deg) scale(\${q===0?1.1:.45})\`},{transform:\`rotate(\${rot}deg)\`}],{duration:380*SPD(),easing:'cubic-bezier(.2,.8,.25,1.06)'});
  sfx('card');
}
function syncTrick(tk,anim){
  const same=V.shown.length<=tk.length&&V.shown.every((x,i)=>x[0]===tk[i][0]&&x[1]===tk[i][1]);
  if(!same){clearSlots();anim=false}
  for(let i=V.shown.length;i<tk.length;i++){const c=cardFromId(tk[i][1]);if(!c)continue;placeCard(tk[i][0],c,anim);V.shown.push(tk[i])}
  if(tk.length===4&&!V.glowed){V.glowed=true;const w=tk[Omi.winnerIdx(curTrick(),V.pub.tp)][0];setTimeout(()=>{if(V.shown.length!==4)return;const e=$(\`#slot\${pos(w)} .card\`);if(e){e.classList.add('winc');sfx('trick')}},400*SPD())}
}
function collectAnim(w){
  if(w<0||w>3){clearSlots();return}
  const av=$(\`#seat\${pos(w)} .avatar\`);if(!av){clearSlots();return}const to=relRect(av);
  [0,1,2,3].forEach(q=>{const el=$(\`#slot\${q} .card\`);if(!el)return;const r=relRect(el);el.remove();el.classList.add('fly');el.style.left=r.x+'px';el.style.top=r.y+'px';$('#fx').append(el);
    const dx=to.x+to.w/2-(r.x+r.w/2),dy=to.y+to.h/2-(r.y+r.h/2);
    el.animate([{transform:el.style.transform,opacity:1},{transform:\`translate(\${dx}px,\${dy}px) scale(.2) rotate(25deg)\`,opacity:0}],{duration:420*SPD(),easing:'ease-in',fill:'forwards'}).onfinish=()=>el.remove()});
  clearSlots();
  setTimeout(()=>{const p=document.createElement('div');p.className='plus1';p.textContent='+1';$('#fx').append(p);p.style.left=(to.x+to.w-6)+'px';p.style.top=(to.y-6)+'px';
    p.animate([{transform:'scale(.4)',opacity:0},{transform:'scale(1.3)',opacity:1,offset:.3},{transform:'translateY(-30px)',opacity:0}],{duration:1000}).onfinish=()=>p.remove()},380*SPD());
}

/* ---- main render from authoritative state ---- */
function onPub(p,hand){
  const prev=V.pub;V.pub=p;
  if(hand){V.hand=hand.slice();sortHand()}
  if(p.ph==='lobby'){renderLobby(p);V.lastPh='lobby';return}
  if(!$('#game').classList.contains('active')){showScreen('game');$('#results').classList.remove('show');V.seatSig=null}
  draw(prev&&prev.ph!=='lobby'?prev:null,p);
}
function draw(prev,p){
  if(V.seatSig!==seatSig(p))buildSeats();
  if(!prev){V.evN=p.ev[0];V.cxN=p.cx[0];V.bannerN=p.rb?p.rb.n:0;V.endN=p.end?p.end.n:0;clearSlots()}
  if(p.ph==='start'&&V.lastPh!=='start'){V.maxDef=0;V.kapUs=0;$('#results').classList.remove('show');$('#roundBanner').classList.remove('show');clearSlots();
    splash(\`<div class="txt">\${esc(t('gameStart'))}</div>\`);speak(t('gameStart'));sfx('trump')}
  V.lastPh=p.ph;
  renderHud();renderSeats();
  if(prev){for(let s=0;s<4;s++){const d=(p.nc[s]|0)-(prev.nc[s]|0);if(d>0&&!p.tk.length)dealAnim(s,d)}}
  if(prev&&!prev.tp&&p.tp){splash(\`<div class="big \${RED[p.tp]?'red':''}">\${SYM[p.tp]}</div><div class="txt">\${esc(t('trumpIs',{s:t('suit')[p.tp]}))}</div>\`);sfx('trump');speak(t('trumpIs',{s:t('suit')[p.tp]}));sortHand()}
  if(p.cx[0]!==V.cxN){V.cxN=p.cx[0];if(prev)collectAnim(p.cx[1]);else clearSlots()}
  syncTrick(p.tk,!!prev);
  if(p.ev[0]!==V.evN){V.evN=p.ev[0];if(prev)showEvent(p.ev)}
  const pickMine=p.ph==='trump'&&p.tu===V.mySeat&&!V.spect&&!p.tp;
  if(pickMine&&!$('#trumpPick').classList.contains('show'))showTrumpPick();if(!pickMine)$('#trumpPick').classList.remove('show');
  const mine=p.ph==='play'&&p.tu===V.mySeat&&!V.spect&&p.tk.length<4;
  if(mine&&!V.myTurn){V.myTurn=true;V.selected=null;startTimer(p.tl);speak(t('yourTurn'))}else if(!mine&&V.myTurn){V.myTurn=false;stopTimer()}
  if(p.rb&&p.rb.n!==V.bannerN){V.bannerN=p.rb.n;if(!p.rb.tie&&p.rb.kap&&p.rb.wt===myT())V.kapUs++;if(prev)showBanner(p.rb)}
  if(p.ph!=='round')$('#roundBanner').classList.remove('show');
  V.maxDef=Math.max(V.maxDef,p.sc[1-myT()]-p.sc[myT()]);
  if(p.end&&p.end.n!==V.endN){V.endN=p.end.n;if(prev)showResults(p)}
  updStatus();renderMini();renderHand();
}

/* ---- user input ---- */
let drag=null;
function onCardDown(e){
  if(!V.myTurn)return;const el=e.currentTarget;drag={el,id:el.dataset.id,x:e.clientX,y:e.clientY,type:e.pointerType,moved:false};
  try{el.setPointerCapture(e.pointerId)}catch(_){}
  el.addEventListener('pointermove',onCardMove);
  el.addEventListener('pointerup',onCardUp,{once:true});
  el.addEventListener('pointercancel',()=>{el.removeEventListener('pointermove',onCardMove);el.style.translate='';drag=null},{once:true});
}
function onCardMove(e){if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)>6||Math.abs(dy)>6)drag.moved=true;if(drag.moved)drag.el.style.translate=\`\${dx*.5}px \${Math.min(0,dy)}px\`}
function onCardUp(e){
  const d=drag;drag=null;if(!d)return;d.el.removeEventListener('pointermove',onCardMove);d.el.style.translate='';
  if(!V.myTurn)return;const card=V.hand.find(c=>c.id===d.id);if(!card)return;const dy=e.clientY-d.y;
  if(!Omi.isLegal(V.hand,curTrick(),card)){if(!d.moved||dy<-30){d.el.animate([{translate:'0'},{translate:'-8px 0'},{translate:'8px 0'},{translate:'-5px 0'},{translate:'0'}],{duration:300});toast(t('followSuit'));sfx('err')}return}
  if(dy<-45||(d.type==='mouse'&&!d.moved)||(V.selected===d.id&&!d.moved))submitCard(card);
  else if(!d.moved){V.selected=d.id;renderHand();sfx('click')}
}
function tryPlay(card){if(!Omi.isLegal(V.hand,curTrick(),card)){toast(t('followSuit'));sfx('err');return}submitCard(card)}
function submitCard(card){if(!V.myTurn)return;V.myTurn=false;V.selected=null;stopTimer();renderHand();act('play',card.id);
  const g=V.pub.v;setTimeout(()=>{if(V.pub&&V.pub.v===g&&V.pub.tu===V.mySeat&&V.pub.ph==='play'){V.myTurn=true;renderHand()}},4000)}
function stopTimer(){clearInterval(V.timerI);V.timerI=null;$('#timerBar').style.width='0'}
function startTimer(tl){stopTimer();if(!tl)return;const t0=Date.now();V.timerI=setInterval(()=>{const f=(Date.now()-t0)/tl;$('#timerBar').style.width=Math.min(100,f*100)+'%';if(f>=1)stopTimer()},150)}
function showTrumpPick(){
  const p=$('#trumpPick'),h=V.hand,SN=t('suit');
  p.innerHTML=\`<h3>\${t('chooseTrump')}</h3><p>\${t('chooseTrumpSub')}</p><div class="suits">\${SUITS.map(s=>\`<button class="suitbtn \${RED[s]?'red':''}" data-s="\${s}"><span>\${SYM[s]}</span><small>\${SN[s]}</small><em>\xD7\${h.filter(c=>c.s===s).length}</em></button>\`).join('')}</div>\`;
  p.classList.add('show');speak(t('chooseTrump'));
  p.querySelectorAll('.suitbtn').forEach(b=>b.onclick=()=>{p.classList.remove('show');sfx('click');act('trump',b.dataset.s)});
}
function showBanner(rb){
  const b=$('#roundBanner'),m=myT();let title,why,pts,cls;
  if(rb.tie){title=t('roundTie');why=t('whyTie',{c:rb.cr});pts='0';cls='tie';sfx('round')}
  else{const us=rb.wt===m;title=rb.kap?t(us?'kapothiUs':'kapothiThem'):t(us?'roundUs':'roundThem');
    why=(rb.kap?t('whyKap')+' ':'')+(rb.kap&&V.pub.kp!=='none'?'':t(rb.byC?'whyCaller':'whyDefender'))+(rb.carry?' '+t('carryAdd',{c:rb.carry}):'');
    pts='+'+rb.p;cls=us?'teamA':'teamB';sfx(us?'round':'lose')}
  b.innerHTML=\`<div class="rb-title">\${title}</div><div class="rb-tricks">\${t('us')} <b>\${rb.t[m]}</b> \u2013 <b>\${rb.t[1-m]}</b> \${t('them')}</div><div class="rb-why">\${why}</div><div class="rb-pts \${cls}">\${pts}</div><br><button class="btn yellow" id="nextR">\${V.mode==='net'&&!NET.isHost?'OK \u{1F44D}':t('nextRound')}</button>\`;
  b.classList.add('show');
  b.querySelector('#nextR').onclick=()=>{sfx('click');contRound();b.classList.remove('show')};
}

/* ---- results ---- */
function awardIds(){const a=[];if(ST.wins>=10)a.push('champ');if(ST.losses>=5)a.push('unlucky');if(ST.comebacks>=1)a.push('comeback');if(ST.whitewash>=1)a.push('loser');if(ST.kapothis>=1)a.push('master');if(ST.played>=50)a.push('legend');return a}
function showResults(p){
  stopTimer();$('#roundBanner').classList.remove('show');
  const m=myT(),win=!V.spect&&p.end.w===m;
  if(!V.spect){const before=awardIds();ST.played++;if(win){ST.wins++;ST.streak++;ST.best=Math.max(ST.best,ST.streak);if(V.maxDef>=5)ST.comebacks++}else{ST.losses++;ST.streak=0;if(p.sc[m]===0)ST.whitewash++}
    ST.kapothis+=V.kapUs;rollPeriods();ST.wkP=(ST.wkP|0)+1;ST.moP=(ST.moP|0)+1;if(win){ST.wkW=(ST.wkW|0)+1;ST.moW=(ST.moW|0)+1}saveST();awardIds().filter(a=>!before.includes(a)).forEach((a,i)=>setTimeout(()=>toast(t('newAward',{a:t('awardsList')[a][0]})),1500+i*2600))}
  const q=pick(win?C.gameWin:C.lose)[LI[S.lang]];
  const order=[V.mySeat,(V.mySeat+2)%4,(V.mySeat+1)%4,(V.mySeat+3)%4];
  const rp=s=>{const {a,photo}=seatAv(s);return \`<div class="rp \${s%2===m?'':'t1'}"><div class="avs" style="--avbg:\${AVBG[a]}">\${avatarHTML(a,photo)}</div><div><b>\${esc(seatName(s))}</b><small>\${t('tricksTaken',{n:p.pt[s]})} \xB7 \${t('calledN',{n:p.calls[s]})}</small></div></div>\`};
  const canRe=V.mode==='off'||NET.isHost;
  const R=$('#results');
  R.innerHTML=\`<div class="res-card"><div class="res-emoji \${win?'win':'lose'}">\${win?'\u{1F3C6}':'\u{1F62D}'}</div><h2>\${win?t('weWin'):t('theyWin')}</h2><div class="res-quote">\u201C\${esc(q)}\u201D</div>
   <div class="res-score"><div class="teamA">\${t('us')}<b>\${p.sc[m]}</b></div><span>\u2013</span><div class="teamB">\${t('them')}<b>\${p.sc[1-m]}</b></div></div>
   <div class="res-players">\${order.map(rp).join('')}</div>
   \${canRe?'':\`<p class="res-quote">\${t('rematchWait')}</p>\`}
   <div class="mbtns">\${canRe?\`<button class="btn yellow" id="rRe">\${t('rematch')}</button>\`:''}<button class="btn emerald" id="rInv">\${t('invite')}</button><button class="btn ghost" id="rHome">\${t('home')}</button></div></div>\`;
  R.classList.add('show');
  if(canRe)R.querySelector('#rRe').onclick=()=>{sfx('click');R.classList.remove('show');rematch()};
  R.querySelector('#rHome').onclick=()=>{sfx('click');goHome()};R.querySelector('#rInv').onclick=invite;
  if(win){sfx('win');confetti();speak(t('weWin'))}else{sfx('lose');for(let i=0;i<22;i++){const f=document.createElement('div');f.className='fall';f.textContent=pick(['\u{1F62D}','\u{1F480}','\u{1F926}','\u{1F629}']);f.style.left=rand(96)+'%';f.style.animationDuration=(2.5+Math.random()*2.5)+'s';f.style.animationDelay=(Math.random()*2)+'s';R.append(f)}}
}
async function invite(){
  if(NET.code){shareInvite();return}
  const url=location.href.split('#')[0],text=t('inviteText');
  try{if(navigator.share){await navigator.share({title:'OMI LANKA',text,url});return}}catch(e){return}
  try{await navigator.clipboard.writeText(text+' '+url);toast(t('copied'))}catch(e){toast(url)}
}

/* ================= ONLINE (Socket.IO game server) ================= */
Object.assign(T.si,{reconnecting:'Connection \u0D91\u0D9A \u0DB1\u0DD0\u0DAD\u0DD2 \u0DC0\u0DD4\u0DAB\u0DCF. \u0D86\u0DBA\u0DD9\u0DAD\u0DCA \u0DC3\u0DB8\u0DCA\u0DB6\u0DB1\u0DCA\u0DB0 \u0DC0\u0DD9\u0DB1\u0DC0\u0DCF...',roomClosed:'Room \u0D91\u0D9A \u0DC0\u0DD0\u0DC4\u0DD4\u0DAB\u0DCF.',serverDown:'Online server \u0D91\u0D9A\u0DA7 \u0DC3\u0DB8\u0DCA\u0DB6\u0DB1\u0DCA\u0DB0 \u0DC0\u0DD9\u0DB1\u0DCA\u0DB1 \u0DB6\u0DD1. \u0DAF\u0DD0\u0DB1\u0DA7 Bots \u0D91\u0D9A\u0DCA\u0D9A \u0D9C\u0DC4\u0DB8\u0DD4!',lobbyNote:'\u0DBA\u0DCF\u0DC5\u0DD4\u0DC0\u0DB1\u0DCA\u0DA7 invite link \u0D91\u0D9A \u0DBA\u0DC0\u0DB1\u0DCA\u0DB1, \u0DB1\u0DD0\u0DAD\u0DCA\u0DB1\u0DB8\u0DCA room code \u0D91\u0D9A \u0DAF\u0DD9\u0DB1\u0DCA\u0DB1.',codeCopied:'Invite link \u0D91\u0D9A \u0D9A\u0DDC\u0DB4\u0DD2 \u0DC0\u0DD4\u0DAB\u0DCF! \u{1F4E8}',
  account:'\u0D9C\u0DD2\u0DAB\u0DD4\u0DB8',guestNote:'\u0D94\u0DBA\u0DCF \u0DAF\u0DD0\u0DB1\u0DCA Guest. Sign in \u0DC0\u0DD4\u0DAB\u0DDC\u0DAD\u0DCA \u0DC0\u0DD9\u0DB1 phone/computer \u0D91\u0D9A\u0D9A\u0DD2\u0DB1\u0DCA \u0D9C\u0DD0\u0DC4\u0DD4\u0DC0\u0DAD\u0DCA \u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 \u0DB1\u0DD0\u0DAD\u0DD2 \u0DC0\u0DD9\u0DB1\u0DCA\u0DB1\u0DDA \u0DB1\u0DD1.',signInGoogle:'Google \u0D91\u0D9A\u0DD9\u0DB1\u0DCA sign in \u0DC0\u0DD9\u0DB1\u0DCA\u0DB1',emailPh:'\u0D94\u0DBA\u0DCF\u0D9C\u0DDA email \u0D91\u0D9A',sendLink:'Email link \u0D91\u0D9A\u0D9A\u0DCA \u0D91\u0DC0\u0DB1\u0DCA\u0DB1',linkSent:'Email \u0D91\u0D9A check \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1 \u2014 sign in link \u0D91\u0D9A\u0D9A\u0DCA \u0D86\u0DC0\u0DCF! \u{1F4E7}',signedInAs:'Sign in \u0DC0\u0DD9\u0DBD\u0DCF \u0D89\u0DB1\u0DCA\u0DB1\u0DDA: {e}',signOut:'Sign out',
  reportBtn:'\u{1F6A9} Report \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1',reported:'Report \u0D91\u0D9A \u0DBA\u0DD0\u0DC0\u0DCA\u0DC0\u0DCF. \u0DC3\u0DCA\u0DAD\u0DD6\u0DAD\u0DD2\u0DBA\u0DD2!',reportTitle:'\u0DB8\u0DDA player \u0DC0 report \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1\u0DAF?'});
Object.assign(T.sl,{reconnecting:'Connection eka nathi wuna. Ayeth sambandha wenawa...',roomClosed:'Room eka wahuna.',serverDown:'Online server ekata sambandha wenna bae. Danata Bots ekka gahamu!',lobbyNote:'Yaaluwanta invite link eka yawanna, nathnam room code eka denna.',codeCopied:'Invite link eka copy wuna! \u{1F4E8}',
  account:'Ginuma',guestNote:'Oya dan Guest. Sign in wunoth wena phone/computer ekakin gahuwath lakunu nathi wenne nae.',signInGoogle:'Google eken sign in wenna',emailPh:'Oyage email eka',sendLink:'Email link ekak ewanna',linkSent:'Email eka check karanna \u2014 sign in link ekak awa! \u{1F4E7}',signedInAs:'Sign in wela inne: {e}',signOut:'Sign out',
  reportBtn:'\u{1F6A9} Report karanna',reported:'Report eka yawwa. Sthuthi!',reportTitle:'Me player wa report karannada?'});
Object.assign(T.en,{reconnecting:'Connection lost. Reconnecting...',roomClosed:'The room was closed.',serverDown:'Can\u2019t reach the online server right now. Let\u2019s play with bots!',lobbyNote:'Send your friends the invite link, or give them the room code.',codeCopied:'Invite link copied! \u{1F4E8}',
  account:'Account',guestNote:'You\u2019re playing as a guest. Sign in to keep your stats on any phone or computer.',signInGoogle:'Sign in with Google',emailPh:'Your email',sendLink:'Email me a sign-in link',linkSent:'Check your email for a sign-in link! \u{1F4E7}',signedInAs:'Signed in as {e}',signOut:'Sign out',
  reportBtn:'\u{1F6A9} Report player',reported:'Report sent. Thank you!',reportTitle:'Report this player?'});
const NET={sock:null,connected:false,code:null,isHost:false,pubTbl:false,signedIn:false,email:null,token:null,pendingJoin:null};
const prof=()=>({name:cleanName(P.name),avatar:P.avatar,settings:{target:S.target,kapothi:S.kapothi,timer:S.timer,speed:S.speed}});
function netEmit(ev,data,cb){if(NET.sock&&NET.connected)NET.sock.emit(ev,data,cb)}
function connect(){
  if(typeof io!=='function')return;
  if(NET.sock){NET.sock.removeAllListeners();NET.sock.disconnect()}
  const s=io({auth:{cid:CID,token:NET.token||undefined},transports:['websocket','polling'],reconnectionDelayMax:4000});NET.sock=s;
  s.on('connect',()=>{NET.connected=true;
    const code=NET.pendingJoin||(V.mode==='net'?NET.code:null);NET.pendingJoin=null;
    if(code)s.emit('join',Object.assign({code},prof()),r=>{if(r&&r.error){toast(t('noRoom'));goHome()}else enterNet(r.code)})});
  s.on('disconnect',()=>{NET.connected=false;if(V.mode==='net')toast(t('reconnecting'))});
  s.on('connect_error',e=>{NET.connected=false;if(e&&e.message==='banned')toast('\u{1F6AB}')});
  s.on('hello',h=>{NET.signedIn=!!h.signedIn;NET.email=h.email||null;netEmit('profile',prof())});
  s.on('state',m=>{if(V.mode!=='net'||!m||!m.g||!Array.isArray(m.g.seats))return;
    NET.code=m.code;NET.isHost=!!m.host;NET.pubTbl=!!m.pub;V.isHost=NET.isHost;
    const ms=typeof m.you==='number'?m.you:-1;const prevSeat=V.mySeat;V.spect=ms<0&&m.g.ph!=='lobby';V.mySeat=ms<0?0:ms;if(prevSeat!==V.mySeat)V.seatSig=null;
    onPub(m.g,(m.hand||[]).map(cardFromId).filter(Boolean))});
  s.on('rx',m=>{if(V.mode==='net'&&V.pub&&m&&typeof m.seat==='number'&&m.seat>=0&&m.seat<4)floatReact(pos(m.seat),m.e)});
  s.on('closed',()=>{if(V.mode==='net'){toast(t('roomClosed'));goHome()}});
}
function enterNet(code){NET.code=code;try{history.replaceState(null,'','/?room='+code)}catch(e){}}
function requireNet(){if(!NET.connected){openModal(\`<h2>\${t('onlineTitle')}</h2><p>\${t('serverDown')}</p><div class="mbtns"><button class="btn yellow" id="obots">\${t('playBots')}</button></div>\`,m=>m.querySelector('#obots').onclick=()=>{closeModal();startLocal()});return false}return true}
function act(kind,val){if(V.mode==='off'){if(HOST)HOST.input(V.mySeat,kind,val)}else netEmit('act',{kind,val})}
function contRound(){if(V.mode==='off'){if(HOST)HOST.cont()}else if(NET.isHost)netEmit('cont')}
function rematch(){if(V.mode==='off'){if(HOST)HOST.run()}else netEmit('rematch')}
const inviteLink=()=>location.origin+'/?room='+NET.code;

/* ================= LOBBY ================= */
function renderLobby(p){
  showScreen('lobby');$('#lbCode').textContent=NET.code||'';$('#lbKind').textContent=t(NET.pubTbl?'publicTbl':'privateTbl');
  const me=V.mySeat,mt=me%2;
  $$('.lb-seat').forEach(el=>{const s=+el.dataset.s,st=p.seats[s];el.className='lb-seat';el.onclick=null;
    if(!st){el.classList.add('empty');const can=me>=1&&s>=1;if(can){el.classList.add('can');el.onclick=()=>{sfx('click');netEmit('sit',{s})}}
      el.innerHTML=\`<div class="avatar team\${s%2===mt?0:1}">\u2795</div><b>\${t('emptySeat')}</b><small>\${can?t('tapSit'):''}</small>\`;return}
    const a=AV[st.a]?st.a:'cool',mine=s===me;
    el.innerHTML=\`<div class="avatar team\${s%2===mt?0:1}" style="--avbg:\${AVBG[a]}"><div class="ph">\${avatarHTML(a,mine?P.photo:null)}</div></div><b></b><small>\${s===0?t('hostTag'):''}\${mine?(s===0?' \xB7 ':'')+t('youTag'):''}</small>\`;
    el.querySelector('b').textContent=mine?(P.name||t('you')):(cleanName(st.n)||'Player')});
  const full=[1,2,3].every(i=>p.seats[i]);
  $('#lbStatus').textContent=p.as>0?t('autoStart',{s:p.as}):(NET.isHost?'':t('waitingHost'));
  const b=$('#lbStart');b.hidden=!NET.isHost;b.textContent=full?t('startGame'):t('startBots');
}
$('#lbStart').onclick=()=>{if(NET.isHost){sfx('click');netEmit('start')}};
async function shareInvite(){const url=inviteLink(),text=t('inviteCode',{c:NET.code});
  try{if(navigator.share){await navigator.share({title:'OMI LANKA',text,url});return}}catch(e){return}
  try{await navigator.clipboard.writeText(text+' '+url);toast(t('codeCopied'))}catch(e){toast(url)}}
$('#lbCopy').onclick=shareInvite;
$('#lbLeave').onclick=()=>{sfx('click');goHome()};

/* ================= MODES ================= */
function resetView(mode){
  stopTimer();closeModal();$('#results').classList.remove('show');$('#roundBanner').classList.remove('show');$('#trumpPick').classList.remove('show');$('#reactPanel').classList.remove('show');$('#fx').innerHTML='';
  Object.assign(V,{mode,pub:null,mySeat:0,spect:false,hand:[],shown:[],myTurn:false,selected:null,lastPh:null,seatSig:null,glowed:false,maxDef:0,kapUs:0,isHost:false});
  [0,1,2,3].forEach(q=>{$('#slot'+q).innerHTML='';$('#seat'+q).innerHTML=''});buildReactPanel();
}
function leaveNet(){if(V.mode==='net')netEmit('leave');NET.code=null;NET.isHost=false;try{if(location.search)history.replaceState(null,'','/')}catch(e){}}
function startLocal(){
  if(HOST){HOST.destroy();HOST=null}leaveNet();resetView('off');
  HOST=makeHost({seats:[{n:cleanName(P.name),a:P.avatar,h:1,on:1},null,null,null],onPub:H=>onPub(H.view(),H.hands[0])});
  showScreen('game');HOST.start();
}
function netStart(ev,extra){
  if(!requireNet())return;if(HOST){HOST.destroy();HOST=null}leaveNet();resetView('net');
  if(ev!=='create'||!extra||!extra.solo){showScreen('lobby');$('#lbCode').textContent='\xB7\xB7\xB7\xB7\xB7';$('#lbStatus').textContent=t(ev==='quick'?'searching':'connecting');$('#lbStart').hidden=true;$$('.lb-seat').forEach(e=>e.innerHTML='')}
  NET.sock.emit(ev,Object.assign(prof(),extra||{}),r=>{if(!r||r.error){toast(t(r&&r.error==='noRoom'?'noRoom':'roomErr'));goHome();return}enterNet(r.code)});
}
function playNow(){if(NET.connected)netStart('create',{solo:true});else startLocal()}
function createRoom(){netStart('create',{solo:false})}
function joinRoom(code){netStart('join',{code})}
function quickMatch(){netStart('quick')}
function goHome(){if(HOST){HOST.destroy();HOST=null}leaveNet();resetView('off');showScreen('home');rotateWelcome(true);renderChip()}

/* tap another player's avatar to report them (online games) */
$('#table').addEventListener('click',e=>{
  if(V.mode!=='net'||!V.pub)return;const seatEl=e.target.closest('.seat');if(!seatEl||!e.target.closest('.avatar'))return;
  const q=+seatEl.id.slice(4);const s=(q+V.mySeat)%4;const st=V.pub.seats[s];if(!st||!st.h||s===V.mySeat)return;
  openModal(\`<h2>\${t('reportTitle')}</h2><p><b></b></p><div class="mbtns"><button class="btn coral" id="rp">\${t('reportBtn')}</button></div>\`,m=>{m.querySelector('p b').textContent=seatName(s);
    m.querySelector('#rp').onclick=()=>{netEmit('report',{seat:s},()=>{});closeModal();toast(t('reported'))}});
});
/* ================= MODALS & HOME ================= */
function openModal(html,onMount){LB.open=false;const m=$('#modal');m.innerHTML=\`<button class="x" aria-label="Close">\u2715</button>\`+html;$('#modalbg').classList.add('show');m.querySelector('.x').onclick=closeModal;if(onMount)onMount(m)}
function closeModal(){LB.open=false;$('#modalbg').classList.remove('show')}
$('#modalbg').addEventListener('click',e=>{if(e.target.id==='modalbg')closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
function seg(key,opts){return \`<div class="seg" data-key="\${key}">\${opts.map(([v,l])=>\`<button data-v="\${v}" class="\${String(S[key])===String(v)?'on':''}">\${l}</button>\`).join('')}</div>\`}
function openSettings(){
  const onoff=k=>seg(k,[[true,t('on')],[false,t('off')]]);
  openModal(\`<h2>\u2699\uFE0F \${t('settings')}</h2>
    <div class="srow"><span>\${t('language')}</span>\${seg('lang',[['si','\u0DC3\u0DD2\u0D82\u0DC4\u0DBD'],['sl','Singlish'],['en','English']])}</div>
    <div class="srow"><span>\${t('comments')}</span>\${onoff('comments')}</div>
    <div class="srow"><span>\${t('sound')}</span>\${onoff('sound')}</div>
    <div class="srow"><span>\${t('voice')}</span>\${onoff('voice')}<div class="note">\${t('voiceNote')}</div></div>
    <div class="srow"><span>\${t('speed')}</span>\${seg('speed',[['slow',t('slow')],['normal',t('normal')],['fast',t('fast')]])}</div>
    <div class="srow"><span>\${t('timer')}</span>\${onoff('timer')}</div>
    <div class="srow"><span>\${t('target')}</span>\${seg('target',[[5,'5'],[10,'10'],[15,'15']])}</div>
    <div class="srow"><span>\${t('kapothiRule')}</span>\${seg('kapothi',[['3',t('kap3')],['game',t('kapGame')],['none',t('kapNone')]])}<div class="note">\${t('kapNote')}</div></div>
    <div class="mbtns"><button class="btn ghost" id="toRules">\${t('openRules')}</button></div>\`,m=>{
      m.querySelectorAll('.seg').forEach(sg=>sg.querySelectorAll('button').forEach(b=>b.onclick=()=>{
        const k=sg.dataset.key;let v=b.dataset.v;if(v==='true')v=true;else if(v==='false')v=false;else if(k==='target')v=+v;
        S[k]=v;saveS();sfx('click');if(k==='lang')applyLang();
        if(HOST&&HOST.s.ph==='lobby'){HOST.s.tg=S.target;HOST.s.kp=S.kapothi;HOST.pub()}
        openSettings();
      }));
      m.querySelector('#toRules').onclick=openRules;
  });
}
function openRules(){openModal(\`<h2>\${t('rulesTitle')}</h2>\${t('rulesBody',{t:V.pub?V.pub.tg:S.target})}\`)}
function openProfile(){
  let sel=P.avatar,photo=P.photo;
  const draw=m=>{m.querySelectorAll('.avgrid button').forEach(b=>b.classList.toggle('on',!photo&&b.dataset.a===sel));m.querySelector('#pprev').innerHTML=avatarHTML(sel,photo);m.querySelector('#pprev').style.setProperty('--avbg',AVBG[sel]);m.querySelector('#rmPhoto').hidden=!photo};
  openModal(\`<h2>\${t('profile')}</h2>
    <div style="display:flex;gap:14px;align-items:center;margin-bottom:12px"><div class="avatar team0" id="pprev" style="--av:76px;flex:none"></div>
    <div style="flex:1"><label style="font-weight:700;font-size:14px" for="pname">\${t('nickname')}</label><input class="field" id="pname" maxlength="16" placeholder="\${esc(t('namePh'))}" value="\${esc(P.name)}"></div></div>
    <b>\${t('chooseAvatar')}</b>
    <div class="avgrid">\${Object.keys(AV).map(a=>\`<button data-a="\${a}" style="--avbg:\${AVBG[a]}" aria-label="\${a}">\${avatarSVG(a)}</button>\`).join('')}</div>
    <div class="mbtns"><label class="btn ghost" style="flex:1">\${t('upload')}<input type="file" accept="image/*" id="pfile" hidden></label><button class="btn ghost" id="rmPhoto">\${t('removePhoto')}</button></div>
    <div class="mbtns"><button class="btn yellow" id="psave">\${t('save')}</button></div>\${accountHTML()}\`,m=>{
      draw(m);bindAccount(m);
      m.querySelectorAll('.avgrid button').forEach(b=>b.onclick=()=>{sel=b.dataset.a;photo=null;sfx('pop');draw(m)});
      m.querySelector('#pfile').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{photo=await readPhoto(f);draw(m)}catch(err){toast(t('photoErr'))}};
      m.querySelector('#rmPhoto').onclick=()=>{photo=null;draw(m)};
      m.querySelector('#psave').onclick=()=>{P.name=cleanName(m.querySelector('#pname').value);P.avatar=sel;P.photo=photo;saveP();renderChip();closeModal();sfx('click');netEmit('profile',prof())};
  });
}
function readPhoto(file){return new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>{const img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');const s=Math.min(img.width,img.height);x.drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,128,128);res(c.toDataURL('image/jpeg',.82))};img.onerror=rej;img.src=fr.result};fr.onerror=rej;fr.readAsDataURL(file)})}
function openJoin(){
  openModal(\`<h2>\u{1F511} \${t('join')}</h2><p>\${t('enterCode')}</p><input class="field" id="jcode" maxlength="5" autocomplete="off" autocapitalize="characters" style="text-transform:uppercase;letter-spacing:8px;text-align:center;font-size:30px"><div class="mbtns"><button class="btn yellow" id="jgo">\${t('joinGo')}</button></div>\`,m=>{
    const i=m.querySelector('#jcode');setTimeout(()=>i.focus(),50);
    const go=()=>{const c=i.value.toUpperCase().replace(/[^A-Z0-9]/g,'');if(c.length===5){closeModal();joinRoom(c)}else{i.animate([{translate:'-6px 0'},{translate:'6px 0'},{translate:'0'}],{duration:250})}};
    m.querySelector('#jgo').onclick=go;i.onkeydown=e=>{if(e.key==='Enter')go()};
  });
}
function renderChip(){$('#chipAv').innerHTML=avatarHTML(P.avatar,P.photo);$('#chipAv').style.setProperty('--avbg',AVBG[P.avatar]);$('#chipName').textContent=P.name||t('you')}
let wIdx=0;
function rotateWelcome(first){const w=t('welcome');const el=$('#welcome');if(first){wIdx=0;el.textContent=w[0];return}el.style.opacity=0;setTimeout(()=>{wIdx=(wIdx+1+rand(w.length-1))%w.length;el.textContent=w[wIdx];el.style.opacity=1},300)}
setInterval(()=>{if($('#home').classList.contains('active'))rotateWelcome()},4800);
function buildHomeArt(){
  const fan=$('#fan');['S','H','C','D'].forEach((s,i)=>{const c=cardEl({s,r:'A'});c.style.transform=\`translateX(-50%) rotate(\${-27+i*18}deg)\`;fan.append(c)});
  const bg=$('#bgcards');for(let i=0;i<10;i++){const s=pick(SUITS),r=pick(RANKS);const c=i%3?cardEl({s,r}):Object.assign(document.createElement('div'),{className:'card back'});c.style.cssText=\`--cw:\${34+rand(26)}px;left:\${rand(95)}%;animation-duration:\${16+rand(14)}s;animation-delay:-\${rand(20)}s\`;bg.append(c)}
}
function applyLang(){
  document.documentElement.lang=S.lang==='si'?'si':'en';
  $$('[data-t]').forEach(e=>e.textContent=t(e.dataset.t));
  $$('#langsw button').forEach(b=>b.classList.toggle('on',b.dataset.lang===S.lang));
  rotateWelcome(true);renderChip();buildReactPanel();
  if(V.pub){if(V.pub.ph==='lobby')renderLobby(V.pub);else{V.seatSig=null;draw(V.pub,V.pub)}}
}
$$('#langsw button').forEach(b=>b.onclick=()=>{S.lang=b.dataset.lang;saveS();applyLang();sfx('click')});
$('#btnPlay').onclick=()=>{sfx('click');playNow()};
$('#btnRandom').onclick=()=>{sfx('click');quickMatch()};
$('#btnPrivate').onclick=()=>{sfx('click');createRoom()};
$('#btnJoin').onclick=()=>{sfx('click');openJoin()};
$('#btnBoard').onclick=()=>openStats();$('#btnSettings').onclick=openSettings;$('#btnRules').onclick=openRules;$('#profileChip').onclick=openProfile;
$('#hudSettings').onclick=openSettings;
$('#hudHome').onclick=()=>{const online=V.mode!=='off';openModal(\`<h2>\${online?t('leaveTitle'):t('quitTitle')}</h2><p>\${online?t('leaveBody'):t('quitBody')}</p><div class="mbtns"><button class="btn coral" id="qy">\${t('quitYes')}</button><button class="btn emerald" id="qn">\${t('quitNo')}</button></div>\`,m=>{m.querySelector('#qy').onclick=()=>{closeModal();goHome()};m.querySelector('#qn').onclick=closeModal})};

/* ================= LEADERBOARD (server) ================= */
Object.assign(T.si,{leaderboard:'\u0DBD\u0DD3\u0DA9\u0DBB\u0DCA\u0DB6\u0DDD\u0DA9\u0DCA',lbAll:'\u0DC3\u0DDA\u0DBB\u0DB8',lbWeek:'\u0DB8\u0DDA \u0DC3\u0DAD\u0DD2\u0DBA',lbMonth:'\u0DB8\u0DDA \u0DB8\u0DCF\u0DC3\u0DD9',lbEmpty:'\u0DAD\u0DCF\u0DB8 \u0D9A\u0DC0\u0DD4\u0DBB\u0DD4\u0DAD\u0DCA \u0DB1\u0DD1. \u0D9C\u0DDA\u0DB8\u0D9A\u0DCA \u0D9C\u0DC4\u0DBD\u0DCF \u0DBD\u0DD2\u0DC3\u0DCA\u0DA7\u0DCA \u0D91\u0D9A\u0DDA \u0D8B\u0DA9\u0DA7\u0DB8 \u0DBA\u0DB1\u0DCA\u0DB1! \u{1F680}',lbLoading:'\u0DBD\u0DD3\u0DA9\u0DBB\u0DCA\u0DB6\u0DDD\u0DA9\u0DCA \u0D91\u0D9A load \u0DC0\u0DD9\u0DB1\u0DC0\u0DCF...',lbErr:'\u0DBD\u0DD3\u0DA9\u0DBB\u0DCA\u0DB6\u0DDD\u0DA9\u0DCA \u0D91\u0D9A\u0DA7 \u0DC3\u0DB8\u0DCA\u0DB6\u0DB1\u0DCA\u0DB0 \u0DC0\u0DD9\u0DB1\u0DCA\u0DB1 \u0DB6\u0DD0\u0DBB\u0DD2 \u0DC0\u0DD4\u0DAB\u0DCF. \u0DA7\u0DD2\u0D9A\u0D9A\u0DD2\u0DB1\u0DCA \u0D86\u0DBA\u0DD9\u0DAD\u0DCA \u0DB6\u0DBD\u0DB1\u0DCA\u0DB1.',lbOff:'Shared \u0DBD\u0DD3\u0DA9\u0DBB\u0DCA\u0DB6\u0DDD\u0DA9\u0DCA \u0D91\u0D9A \u0DB4\u0DDA\u0DB1\u0DCA\u0DB1\u0DDA claude.ai \u0D91\u0D9A\u0DA7 sign in \u0DC0\u0DD9\u0DBD\u0DCF \u0DB8\u0DDA artifact \u0D91\u0D9A open \u0D9A\u0DC5\u0DCF\u0DB8 \u0DC0\u0DD2\u0DAD\u0DBB\u0DBA\u0DD2.',weekChamp:'\u0DB8\u0DDA \u0DC3\u0DAD\u0DD2\u0DBA\u0DDA \u0DA0\u0DD0\u0DB8\u0DCA\u0DB4\u0DD2\u0DBA\u0DB1\u0DCA',monthChamp:'\u0DB8\u0DDA \u0DB8\u0DCF\u0DC3\u0DDA \u0DA0\u0DD0\u0DB8\u0DCA\u0DB4\u0DD2\u0DBA\u0DB1\u0DCA',myStats:'\u0DB8\u0D9C\u0DDA \u0DBD\u0D9A\u0DD4\u0DAB\u0DD4',lbNoWrite:'\u0D94\u0DBA\u0DCF\u0DA7 \u0DAD\u0DD2\u0DBA\u0DD9\u0DB1\u0DCA\u0DB1\u0DDA view-only access. \u0D94\u0DBA\u0DCF\u0D9C\u0DDA \u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 \u0DBD\u0DD3\u0DA9\u0DBB\u0DCA\u0DB6\u0DDD\u0DA9\u0DCA \u0D91\u0D9A\u0DA7 \u0D91\u0D9A\u0DAD\u0DD4 \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1 owner \u0D9C\u0DD9\u0DB1\u0DCA Contributor access \u0D89\u0DBD\u0DCA\u0DBD\u0DB1\u0DCA\u0DB1.',lbPublic:'\u0D94\u0DBA\u0DCF\u0D9C\u0DDA \u0DB1\u0DB8, avatar \u0D91\u0D9A, \u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 \u0DB8\u0DDA artifact \u0D91\u0D9A open \u0D9A\u0DBB\u0DB1 \u0DC4\u0DD0\u0DB8\u0DDD\u0DA7\u0DB8 \u0DB4\u0DDA\u0DB1\u0DC0\u0DCF.',winsShort:'\u0DAF\u0DD2\u0DB1\u0DD4\u0DB8\u0DCA',gamesShort:'\u0D9C\u0DDA\u0DB8\u0DCA'});
Object.assign(T.sl,{leaderboard:'Leaderboard',lbAll:'Serama',lbWeek:'Me sathiya',lbMonth:'Me maase',lbEmpty:'Thama kawruth nae. Game ekak gahala list eke udatama yanna! \u{1F680}',lbLoading:'Leaderboard eka load wenawa...',lbErr:'Leaderboard ekata sambandha wenna bari wuna. Tikakin ayeth balanna.',lbOff:'Shared leaderboard eka penne claude.ai ekata sign in wela me artifact eka open kalama vitharai.',weekChamp:'Me sathiye champion',monthChamp:'Me maase champion',myStats:'Mage lakunu',lbNoWrite:'Oyata thiyenne view-only access. Oyage lakunu leaderboard ekata ekathu karanna owner gen Contributor access illanna.',lbPublic:'Oyage nama, avatar eka, lakunu me artifact eka open karana hamotama penawa.',winsShort:'Dinum',gamesShort:'Games'});
Object.assign(T.en,{leaderboard:'Leaderboard',lbAll:'All time',lbWeek:'This week',lbMonth:'This month',lbEmpty:'Nobody here yet. Play a game and grab the top spot! \u{1F680}',lbLoading:'Loading the leaderboard...',lbErr:'Couldn\u2019t reach the leaderboard. Check again in a moment.',lbOff:'The shared leaderboard appears when you open this artifact signed in to claude.ai.',weekChamp:'Champion of the week',monthChamp:'Champion of the month',myStats:'My stats',lbNoWrite:'You have view-only access, so your results aren\u2019t added to the leaderboard. Ask the owner for Contributor access.',lbPublic:'Your nickname, avatar and stats are visible to everyone who opens this artifact.',winsShort:'Wins',gamesShort:'Games'});
const LB={tab:'all',open:false,rows:null,err:false,seq:0};
function periodKeys(){const d=new Date(Date.now()+5.5*3600e3);const y=d.getUTCFullYear(),mo=y+'-'+String(d.getUTCMonth()+1).padStart(2,'0');
  const t0=new Date(Date.UTC(y,d.getUTCMonth(),d.getUTCDate()));const day=(t0.getUTCDay()+6)%7;t0.setUTCDate(t0.getUTCDate()-day+3);
  const fy=t0.getUTCFullYear(),w=1+Math.round(((t0-Date.UTC(fy,0,4))/864e5-3+((new Date(Date.UTC(fy,0,4)).getUTCDay()+6)%7))/7);
  return{wk:fy+'-W'+String(w).padStart(2,'0'),mo}}
function rollPeriods(){const k=periodKeys();if(ST.wk!==k.wk){ST.wk=k.wk;ST.wkW=0;ST.wkP=0}if(ST.mo!==k.mo){ST.mo=k.mo;ST.moW=0;ST.moP=0}}
function loadLB(){LB.rows=null;LB.err=false;const n=++LB.seq;
  if(!NET.connected){LB.err=true;return}
  NET.sock.timeout(8000).emit('lb',{period:LB.tab},(err,r)=>{if(n!==LB.seq)return;if(err||!r||r.error)LB.err=true;else LB.rows=r.rows;if(LB.open)openStats(true)})}
function openStats(keep){
  if(!keep)loadLB();
  const pct=ST.played?Math.round(ST.wins/ST.played*100):0,got=awardIds(),AL=t('awardsList');
  let board=\`<div class="seg lbtabs">\${[['all',t('lbAll')],['week',t('lbWeek')],['month',t('lbMonth')]].map(([v,l])=>\`<button data-tab="\${v}" class="\${LB.tab===v?'on':''}">\${l}</button>\`).join('')}</div>\`;
  const rows=LB.rows||[];
  if(LB.err)board+=\`<p class="note">\${t('lbErr')}</p>\`;
  else if(!LB.rows)board+=\`<p class="note">\${t('lbLoading')}</p>\`;
  else if(!rows.length)board+=\`<p class="note">\${t('lbEmpty')}</p>\`;
  else{
    if(LB.tab!=='all')board+=\`<div class="champ"><span>\u{1F451}</span><div><small>\${t(LB.tab==='week'?'weekChamp':'monthChamp')}</small><b data-nm="0"></b></div></div>\`;
    board+=\`<div class="lbl">\${rows.map((r,i)=>{const a=AV[r.avatar]?r.avatar:'cool';
      return \`<div class="lbrow\${r.me?' me':''}"><span class="rk">\${['\u{1F947}','\u{1F948}','\u{1F949}'][i]||i+1}</span><div class="avs" style="--avbg:\${AVBG[a]}">\${avatarSVG(a)}</div><div class="nm"><b data-nm="\${i}"></b><small>\${esc(r.badges||'')}</small></div><div class="wn"><b>\${r.w|0}</b><small>\${t('winsShort')} \xB7 \${r.p|0} \${t('gamesShort')} \xB7 \${r.pct|0}%</small></div></div>\`}).join('')}</div>\`;
  }
  board+=\`<p class="note">\${t('lbPublic')}</p>\`;
  const html=\`<h2>\u{1F3C6} \${t('leaderboard')}</h2>\${board}
   <h3 style="margin:16px 0 8px">\${t('myStats')}</h3>
   <div class="statgrid">\${[['played',ST.played],['wins',ST.wins],['losses',ST.losses],['winPct',pct+'%'],['streak',ST.streak],['best',ST.best]].map(([k,v])=>\`<div class="stat"><b>\${v}</b><small>\${t(k)}</small></div>\`).join('')}</div>
   <h3 style="margin:4px 0 8px">\${t('awards')}</h3>
   <div class="awards">\${Object.keys(AL).map(k=>\`<div class="award \${got.includes(k)?'':'locked'}"><div>\${AL[k][0]}<small>\${AL[k][1]}</small></div></div>\`).join('')}</div>\`;
  const sc=$('#modal').scrollTop;
  openModal(html,mm=>{
    mm.querySelectorAll('[data-nm]').forEach(el=>{const r=rows[+el.dataset.nm];if(r)el.textContent=cleanName(r.name)||'Player'});
    mm.querySelectorAll('.lbtabs button').forEach(b=>b.onclick=()=>{LB.tab=b.dataset.tab;sfx('click');loadLB();openStats(true)});
    mm.querySelector('.x').onclick=()=>{LB.open=false;closeModal()};
    if(keep)mm.scrollTop=sc;LB.open=true;
  });
}

/* ================= ACCOUNTS (Supabase Auth, optional) ================= */
const AUTH={sb:null};
async function initAuth(){
  try{const c=await (await fetch('/api/config')).json();if(!c.supabaseUrl||!c.supabaseAnonKey)return;
    await new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js';s.onload=res;s.onerror=rej;document.head.append(s)});
    AUTH.sb=window.supabase.createClient(c.supabaseUrl,c.supabaseAnonKey);
    const {data}=await AUTH.sb.auth.getSession();const tok=data&&data.session?data.session.access_token:null;
    if(tok!==NET.token){NET.token=tok;connect()}
    AUTH.sb.auth.onAuthStateChange((ev,session)=>{const tk=session?session.access_token:null;if((ev==='SIGNED_IN'||ev==='SIGNED_OUT')&&tk!==NET.token){NET.token=tk;connect()}});
  }catch(e){console.warn('auth unavailable',e)}
}
function accountHTML(){
  if(!AUTH.sb)return'';
  if(NET.signedIn)return \`<h3 style="margin:16px 0 6px">\${t('account')}</h3><p class="note" id="acctEmail"></p><div class="mbtns"><button class="btn ghost" id="signOut">\${t('signOut')}</button></div>\`;
  return \`<h3 style="margin:16px 0 6px">\${t('account')}</h3><p class="note">\${t('guestNote')}</p><div class="mbtns"><button class="btn navy" id="gIn">\${t('signInGoogle')}</button></div>
    <div class="mbtns"><input class="field" id="emailIn" type="email" autocomplete="email" placeholder="\${esc(t('emailPh'))}" style="flex:2;min-width:180px"><button class="btn ghost" id="mailIn">\${t('sendLink')}</button></div>\`;
}
function bindAccount(m){
  if(!AUTH.sb)return;const e=m.querySelector('#acctEmail');if(e)e.textContent=t('signedInAs',{e:NET.email||''});
  const so=m.querySelector('#signOut');if(so)so.onclick=async()=>{await AUTH.sb.auth.signOut();closeModal()};
  const g=m.querySelector('#gIn');if(g)g.onclick=()=>AUTH.sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+'/'}});
  const mi=m.querySelector('#mailIn');if(mi)mi.onclick=async()=>{const v=m.querySelector('#emailIn').value.trim();if(!/^\\S+@\\S+\\.\\S+$/.test(v))return;
    const {error}=await AUTH.sb.auth.signInWithOtp({email:v,options:{emailRedirectTo:location.origin+'/'}});toast(error?t('roomErr'):t('linkSent'))};
}
/* ================= CONFETTI ================= */
function confetti(){
  const c=$('#confetti'),x=c.getContext('2d'),dpr=Math.min(2,window.devicePixelRatio||1);c.width=innerWidth*dpr;c.height=innerHeight*dpr;x.setTransform(dpr,0,0,dpr,0,0);
  const cols=['#ffd23f','#ff8c42','#ff5a5f','#12b886','#ffffff','#5b8cff'],ps=[];
  for(let i=0;i<180;i++)ps.push({x:innerWidth/2+(Math.random()-.5)*innerWidth*.4,y:innerHeight*.35,vx:(Math.random()-.5)*15,vy:-Math.random()*15-4,r:Math.random()*6.3,vr:(Math.random()-.5)*.4,w:6+Math.random()*7,h:4+Math.random()*6,c:pick(cols)});
  const t0=performance.now();
  (function f(now){const el=now-t0;x.clearRect(0,0,innerWidth,innerHeight);
    ps.forEach(p=>{p.vy+=.32;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.globalAlpha=Math.max(0,1-el/4200);x.fillRect(-p.w/2,-p.h/2,p.w,p.h);x.restore()});
    if(el<4200)requestAnimationFrame(f);else x.clearRect(0,0,innerWidth,innerHeight)})(t0);
}

/* ================= BOOT ================= */
buildHomeArt();applyLang();
document.addEventListener('pointerdown',()=>actx(),{once:true});
{const q=(new URLSearchParams(location.search).get('room')||location.hash.slice(1)||'').toUpperCase();if(/^[A-Z0-9]{5}$/.test(q)){NET.pendingJoin=q;resetView('net');showScreen('lobby');$('#lbCode').textContent=q;$('#lbStatus').textContent=t('connecting');$('#lbStart').hidden=true}}
connect();initAuth();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
setTimeout(()=>{if(NET.pendingJoin&&!NET.connected){NET.pendingJoin=null;toast(t('serverDown'));goHome()}},10000);
})();
` }, "/js/ws.js": { "t": "text/javascript; charset=utf-8", "s": "// Tiny WebSocket client exposing the small part of the Socket.IO API that OMI LANKA uses.\n(()=>{\nfunction io(opts){\n  const auth=(opts&&opts.auth)||{},maxDelay=(opts&&opts.reconnectionDelayMax)||4000;\n  const L={},acks=new Map();let ws=null,ackN=0,closedByUser=false,tries=0,timer=null;\n  const s={connected:false,\n    on(ev,fn){(L[ev]=L[ev]||[]).push(fn);return s},\n    removeAllListeners(){for(const k in L)delete L[k];return s},\n    emit(ev,data,cb){if(!s.connected||!ws)return s;const m={e:ev,d:data};if(typeof cb==='function'){const a=++ackN;m.a=a;acks.set(a,{cb})}ws.send(JSON.stringify(m));return s},\n    timeout(ms){return{emit(ev,data,cb){if(!s.connected){setTimeout(()=>cb(new Error('offline')),0);return}let done=false;\n      const t=setTimeout(()=>{if(!done){done=true;cb(new Error('timeout'))}},ms);\n      s.emit(ev,data,res=>{if(!done){done=true;clearTimeout(t);cb(null,res)}})}}},\n    disconnect(){closedByUser=true;clearTimeout(timer);if(ws)try{ws.close(1000)}catch(e){}return s}};\n  const fire=(ev,...a)=>(L[ev]||[]).slice().forEach(f=>{try{f(...a)}catch(e){console.error(e)}});\n  function open(){\n    const url=(location.protocol==='https:'?'wss://':'ws://')+location.host+'/ws';\n    try{ws=new WebSocket(url)}catch(e){return retry()}\n    ws.onopen=()=>ws.send(JSON.stringify({e:'auth',d:{cid:auth.cid,token:auth.token||null}}));\n    ws.onmessage=ev=>{let m;try{m=JSON.parse(ev.data)}catch(e){return}\n      if(m.ack){const a=acks.get(m.ack);if(a){acks.delete(m.ack);a.cb(m.d)}return}\n      if(m.e==='hello'){tries=0;s.connected=true;fire('connect');fire('hello',m.d);return}\n      if(m.e==='connect_error'){fire('connect_error',new Error(m.d||'error'));if(m.d==='banned')closedByUser=true;return}\n      fire(m.e,m.d)};\n    ws.onclose=()=>{const was=s.connected;s.connected=false;acks.clear();if(was)fire('disconnect');if(!closedByUser)retry()};\n    ws.onerror=()=>{if(!s.connected)fire('connect_error',new Error('unreachable'))};\n  }\n  function retry(){clearTimeout(timer);tries++;timer=setTimeout(open,Math.min(maxDelay,300*2**tries)+Math.random()*300)}\n  open();return s;\n}\nwindow.io=io;\n})();\n" }, "/js/admin.js": { "t": "text/javascript; charset=utf-8", "s": "(()=>{\nconst $=s=>document.querySelector(s);let TOK=sessionStorage.getItem('omiAdmin')||'';\nconst esc=s=>String(s==null?'':s).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',\"'\":'&#39;'}[c]));\nasync function api(path,body){const r=await fetch('/api/admin/'+path,{method:body?'POST':'GET',headers:{'x-admin-token':TOK,'content-type':'application/json'},body:body?JSON.stringify(body):undefined});if(r.status===403)throw new Error('forbidden');return r.json()}\nfunction table(cols,rows){return `<div style=\"overflow-x:auto\"><table><tr>${cols.map(c=>`<th>${c[0]}</th>`).join('')}</tr>${rows.map(r=>`<tr>${cols.map(c=>`<td>${c[1](r)}</td>`).join('')}</tr>`).join('')||`<tr><td colspan=\"${cols.length}\">None</td></tr>`}</table></div>`}\nasync function load(){\n  let d;try{d=await api('overview?q='+encodeURIComponent($('#q').value||''))}catch(e){$('#login').hidden=false;$('#dash').hidden=true;alert('Wrong admin token');return}\n  $('#login').hidden=true;$('#dash').hidden=false;\n  $('#kpi').innerHTML=`<span class=\"k\">\u{1F7E2} Online now: ${d.online}</span><span class=\"k\">\u{1F3B4} Active rooms: ${d.rooms.length}</span><span class=\"k\">\u{1F465} Players: ${d.total}</span><span class=\"k\">\u{1F4BE} Store: ${esc(d.store)}</span>`;\n  $('#rooms').innerHTML=table([['Code',r=>`<b>${esc(r.code)}</b>`],['Phase',r=>esc(r.ph)],['Players',r=>r.players.map(p=>!p?'\u2014':p.bot?'\u{1F916}':`${p.online?'\u{1F7E2}':'\u26AA'} ${esc(p.name)}`).join(', ')],['Score',r=>r.score.join(' \u2013 ')],['Round',r=>r.round],['Type',r=>r.pub?'public':'private'],['',r=>`<button class=\"red\" data-close=\"${esc(r.code)}\">Close</button>`]],d.rooms);\n  $('#reports').innerHTML=table([['When',r=>esc((r.created_at||r.at||'').slice(0,16))],['Reported',r=>`${esc(r.target_name)} <code>${esc(r.target)}</code>`],['Room',r=>esc(r.room)],['',r=>`<button class=\"red\" data-ban=\"${esc(r.target)}\">Ban</button>`]],d.reports);\n  $('#players').innerHTML=table([['Name',r=>esc(r.name||'Player')],['ID',r=>`<code>${esc(r.id)}</code>`],['Played',r=>r.played],['Wins',r=>r.wins],['',r=>`<button data-rename=\"${esc(r.id)}\">Rename</button> <button class=\"red\" data-ban=\"${esc(r.id)}\">Ban</button>`]],d.players);\n  $('#banned').innerHTML=table([['ID',r=>`<code>${esc(r.id)}</code>`],['Reason',r=>esc(r.reason)],['',r=>`<button data-unban=\"${esc(r.id)}\">Unban</button>`]],d.banned);\n}\ndocument.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;\n  if(b.id==='go'){TOK=$('#tok').value;sessionStorage.setItem('omiAdmin',TOK);load()}\n  else if(b.id==='search')load();\n  else if(b.dataset.close&&confirm('Close room '+b.dataset.close+'?')){await api('close-room',{code:b.dataset.close});load()}\n  else if(b.dataset.ban){const reason=prompt('Reason for ban?');if(reason!==null){await api('ban',{id:b.dataset.ban,reason});load()}}\n  else if(b.dataset.unban){await api('unban',{id:b.dataset.unban});load()}\n  else if(b.dataset.rename){const n=prompt('New nickname (max 16 characters)');if(n){await api('rename',{id:b.dataset.rename,name:n});load()}}\n});\nif(TOK)load();setInterval(()=>{if(!$('#dash').hidden)load()},15000);\n})();\n" } };

// src/worker.js
var cleanName = /* @__PURE__ */ __name((n) => String(n || "").replace(/[\u0000-\u001f\u007f\u200b\u200e\u200f\u202a-\u202e\u2060-\u2064\ufeff<>]/g, "").trim().slice(0, 16), "cleanName");
var cleanSettings = /* @__PURE__ */ __name((x) => {
  x = x || {};
  return { target: [5, 10, 15].includes(+x.target) ? +x.target : 10, kapothi: ["3", "game", "none"].includes(x.kapothi) ? x.kapothi : "3", timer: x.timer !== false, speed: ["slow", "normal", "fast"].includes(x.speed) ? x.speed : "normal" };
}, "cleanSettings");
var json = /* @__PURE__ */ __name((d, status = 200) => new Response(JSON.stringify(d), { status, headers: { "content-type": "application/json" } }), "json");
var siteUrl = /* @__PURE__ */ __name((env, url) => (env.SITE_URL || url.origin).replace(/\/$/, ""), "siteUrl");
function secure(res, url) {
  const r = new Response(res.body, res);
  const host = url.host;
  r.headers.set("X-Content-Type-Options", "nosniff");
  r.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  r.headers.set("X-Frame-Options", "SAMEORIGIN");
  r.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  r.headers.set("Content-Security-Policy", [
    `default-src 'self'`,
    `script-src 'self' https://cdn.jsdelivr.net`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src 'self' https://fonts.gstatic.com`,
    `img-src 'self' data: blob: https:`,
    `connect-src 'self' wss://${host} ws://${host} https://*.supabase.co wss://*.supabase.co`,
    `frame-ancestors 'self'`,
    `base-uri 'self'`,
    `form-action 'self'`
  ].join("; "));
  return r;
}
__name(secure, "secure");
function sitemap(u) {
  const d = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const alt = `<xhtml:link rel="alternate" hreflang="si" href="${u}/how-to-play/"/><xhtml:link rel="alternate" hreflang="en" href="${u}/en/how-to-play/"/>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url><loc>${u}/</loc><lastmod>${d}</lastmod><priority>1.0</priority></url>
  <url><loc>${u}/how-to-play/</loc><lastmod>${d}</lastmod><priority>0.8</priority>${alt}</url>
  <url><loc>${u}/en/how-to-play/</loc><lastmod>${d}</lastmod><priority>0.8</priority>${alt}</url>
</urlset>
`;
}
__name(sitemap, "sitemap");
var BIN = /* @__PURE__ */ new Map();
function serveFile(p) {
  if (p === "/how-to-play" || p === "/en/how-to-play") return new Response(null, { status: 301, headers: { location: p + "/" } });
  let k = p === "/" ? "/index.html" : p.endsWith("/") ? p + "index.html" : p === "/admin" ? "/admin.html" : p;
  const f = FILES[k];
  if (!f) return new Response("", { status: 404 });
  let body = f.s;
  if (f.b) {
    body = BIN.get(k);
    if (!body) {
      const s = atob(f.b);
      body = new Uint8Array(s.length);
      for (let i = 0; i < s.length; i++) body[i] = s.charCodeAt(i);
      BIN.set(k, body);
    }
  }
  const cc = /\/(sw\.js|manifest\.webmanifest)$/.test(k) ? "no-cache" : "public, max-age=86400";
  return new Response(body, { headers: { "content-type": f.t, "cache-control": cc } });
}
__name(serveFile, "serveFile");
var worker_default = {
  async fetch(req, env) {
    const url = new URL(req.url), p = url.pathname;
    if (p === "/ws" || p === "/healthz" || p.startsWith("/api/admin")) return env.GAME.get(env.GAME.idFromName("main")).fetch(req);
    if (p === "/robots.txt") return secure(new Response(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${siteUrl(env, url)}/sitemap.xml
`, { headers: { "content-type": "text/plain; charset=utf-8" } }), url);
    if (p === "/sitemap.xml") return secure(new Response(sitemap(siteUrl(env, url)), { headers: { "content-type": "application/xml" } }), url);
    if (p === "/api/config") return secure(json({ supabaseUrl: env.SUPABASE_URL || null, supabaseAnonKey: env.SUPABASE_ANON_KEY || null }), url);
    let res = serveFile(p);
    if (res.status === 404) return secure(new Response('<!doctype html><meta charset="utf-8"><title>404 \u2013 OMI LANKA</title><p style="font-family:sans-serif;padding:24px">404 \u2013 <a href="/">OMI LANKA \u{1F0CF}</a></p>', { status: 404, headers: { "content-type": "text/html; charset=utf-8" } }), url);
    if ((res.headers.get("content-type") || "").includes("text/html")) {
      const html = (await res.text()).replace(/%%SITE_URL%%/g, siteUrl(env, url));
      res = new Response(html, { status: res.status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300" } });
    }
    return secure(res, url);
  }
};
var Sock = class {
  static {
    __name(this, "Sock");
  }
  constructor(hub, ws) {
    this.hub = hub;
    this.ws = ws;
    this.data = null;
    this.h = {};
    this.codes = /* @__PURE__ */ new Set();
    this.open = true;
  }
  emit(ev, d) {
    if (!this.open) return;
    try {
      this.ws.send(JSON.stringify({ e: ev, d }));
    } catch (e) {
    }
  }
  on(ev, fn) {
    this.h[ev] = fn;
  }
  join(code) {
    this.codes.add(code);
    let s = this.hub.groups.get(code);
    if (!s) this.hub.groups.set(code, s = /* @__PURE__ */ new Set());
    s.add(this);
  }
  leave(code) {
    this.codes.delete(code);
    const s = this.hub.groups.get(code);
    if (s) {
      s.delete(this);
      if (!s.size) this.hub.groups.delete(code);
    }
  }
  to(code) {
    return { emit: /* @__PURE__ */ __name((ev, d) => {
      for (const s of this.hub.groups.get(code) || []) if (s !== this) s.emit(ev, d);
    }, "emit") };
  }
  disconnect() {
    try {
      this.ws.close(4003, "closed");
    } catch (e) {
    }
    this.hub.closed(this);
  }
};
var GameHub = class extends DurableObject {
  static {
    __name(this, "GameHub");
  }
  constructor(ctx, env) {
    super(ctx, env);
    this.env = env;
    globalThis.__OMI_TIME_SCALE = +env.GAME_TIME_SCALE || 1;
    this.store = new SqlStore(ctx.storage.sql);
    this.rooms = new Rooms(this.store, { countBotGames: env.COUNT_BOT_GAMES !== "false", maxRooms: +env.MAX_ROOMS || 3e3 });
    this.socks = /* @__PURE__ */ new Set();
    this.groups = /* @__PURE__ */ new Map();
  }
  adminOk(req) {
    const t = this.env.ADMIN_TOKEN || "", g = req.headers.get("x-admin-token") || "";
    if (t.length < 12 || g.length !== t.length) return false;
    let d = 0;
    for (let i = 0; i < t.length; i++) d |= t.charCodeAt(i) ^ g.charCodeAt(i);
    return d === 0;
  }
  async fetch(req) {
    const url = new URL(req.url), p = url.pathname;
    if (p === "/healthz") return json({ ok: true, rooms: this.rooms.map.size, online: this.socks.size, store: this.store.kind });
    if (p.startsWith("/api/admin")) return secure(await this.admin(req, url), url);
    if (p === "/ws") {
      if (req.headers.get("Upgrade") !== "websocket") return new Response("Expected WebSocket", { status: 426 });
      const origin = req.headers.get("Origin");
      if (origin && new URL(origin).host !== url.host) return new Response("Bad origin", { status: 403 });
      const pair = new WebSocketPair(), [client, server] = Object.values(pair);
      server.accept();
      this.attach(server);
      return new Response(null, { status: 101, webSocket: client });
    }
    return new Response("Not found", { status: 404 });
  }
  async admin(req, url) {
    if (!this.adminOk(req)) return json({ error: "forbidden" }, 403);
    const p = url.pathname.replace("/api/admin/", ""), body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    if (p === "overview") {
      const d = await this.store.adminData(String(url.searchParams.get("q") || "").slice(0, 40));
      return json(Object.assign(d, { online: this.socks.size, store: this.store.kind, rooms: [...this.rooms.map.values()].map((r) => r.summary()) }));
    }
    if (p === "close-room") {
      this.rooms.close(String(body.code || ""));
      return json({ ok: true });
    }
    if (p === "ban") {
      const id = String(body.id || "");
      if (!id) return json({ error: "id" }, 400);
      await this.store.ban(id, String(body.reason || "").slice(0, 200));
      for (const s of [...this.socks]) if (s.data && s.data.id === id) s.disconnect();
      return json({ ok: true });
    }
    if (p === "unban") {
      await this.store.unban(String(body.id || ""));
      return json({ ok: true });
    }
    if (p === "rename") {
      await this.store.rename(String(body.id || ""), cleanName(body.name) || "Player");
      return json({ ok: true });
    }
    return json({ error: "not found" }, 404);
  }
  closed(sk) {
    if (!sk.open) return;
    sk.open = false;
    this.socks.delete(sk);
    if (sk.h.disconnect) sk.h.disconnect();
    for (const c of [...sk.codes]) sk.leave(c);
  }
  attach(ws) {
    const sk = new Sock(this, ws);
    this.socks.add(sk);
    const authT = setTimeout(() => {
      if (!sk.data) sk.disconnect();
    }, 1e4);
    ws.addEventListener("message", async (ev) => {
      let m;
      try {
        m = JSON.parse(typeof ev.data === "string" ? ev.data : "");
      } catch (e) {
        return;
      }
      if (!m || typeof m.e !== "string" || String(ev.data).length > 1e4) return;
      if (!sk.data) {
        if (m.e === "auth") {
          clearTimeout(authT);
          await this.auth(sk, m.d || {});
        }
        return;
      }
      const fn = sk.h[m.e];
      if (!fn) return;
      const ack = typeof m.a === "number" ? (res) => {
        try {
          sk.ws.send(JSON.stringify({ ack: m.a, d: res }));
        } catch (e) {
        }
      } : void 0;
      try {
        await fn(m.d, ack);
      } catch (e) {
        console.error("handler", m.e, e);
      }
    });
    ws.addEventListener("close", () => {
      clearTimeout(authT);
      this.closed(sk);
    });
    ws.addEventListener("error", () => this.closed(sk));
  }
  async auth(sk, a) {
    const cid = typeof a.cid === "string" && /^[a-z0-9]{8,40}$/i.test(a.cid) ? a.cid : null;
    if (!cid) {
      sk.emit("connect_error", "bad_client");
      return sk.disconnect();
    }
    let uid = null, email = null;
    const env = this.env;
    if (a.token && env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
      try {
        const r = await fetch(env.SUPABASE_URL.replace(/\/$/, "") + "/auth/v1/user", { headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: "Bearer " + String(a.token) } });
        if (r.ok) {
          const u = await r.json();
          if (u && u.id) {
            uid = u.id;
            email = u.email || null;
          }
        }
      } catch (e) {
      }
    }
    const id = uid ? "u:" + uid : "g:" + cid;
    if (await this.store.isBanned(id)) {
      sk.emit("connect_error", "banned");
      return sk.disconnect();
    }
    sk.data = { id, uid, email, name: "", avatar: "cool", room: null, bucket: 30, ts: Date.now() };
    if (uid) await this.store.mergeGuest("g:" + cid, id);
    this.wire(sk);
    sk.emit("hello", { signedIn: !!uid, email });
  }
  wire(sk) {
    const rooms = this.rooms, store = this.store;
    const ok = /* @__PURE__ */ __name(() => {
      const d = sk.data, now = Date.now();
      d.bucket = Math.min(30, d.bucket + (now - d.ts) / 100);
      d.ts = now;
      if (d.bucket < 1) return false;
      d.bucket--;
      return true;
    }, "ok");
    const prof = /* @__PURE__ */ __name((p) => {
      p = p || {};
      sk.data.name = cleanName(p.name);
      sk.data.avatar = AVATARS.includes(p.avatar) ? p.avatar : "cool";
    }, "prof");
    const leaveCur = /* @__PURE__ */ __name((explicit) => {
      const r = sk.data.room;
      if (r) {
        r.leave(sk, explicit);
        sk.leave(r.code);
        sk.data.room = null;
      }
    }, "leaveCur");
    const cb = /* @__PURE__ */ __name((f) => typeof f === "function" ? f : () => {
    }, "cb");
    sk.on("create", (p, f) => {
      if (!ok()) return;
      prof(p);
      leaveCur(true);
      try {
        const r = rooms.create({ pub: false, settings: cleanSettings(p && p.settings) });
        r.join(sk);
        if (p && p.solo) r.H.start();
        cb(f)({ code: r.code });
      } catch (e) {
        cb(f)({ error: "full" });
      }
    });
    sk.on("quick", (p, f) => {
      if (!ok()) return;
      prof(p);
      leaveCur(true);
      try {
        const r = rooms.quick(cleanSettings(p && p.settings));
        r.join(sk);
        cb(f)({ code: r.code });
      } catch (e) {
        cb(f)({ error: "full" });
      }
    });
    sk.on("join", (p, f) => {
      if (!ok()) return;
      prof(p);
      const r = rooms.get(String(p && p.code || "").toUpperCase());
      if (!r) return cb(f)({ error: "noRoom" });
      if (sk.data.room !== r) leaveCur(true);
      r.join(sk);
      cb(f)({ code: r.code });
    });
    sk.on("leave", () => leaveCur(true));
    sk.on("sit", (p) => {
      const r = sk.data.room;
      if (r && ok()) r.sit(sk, p && +p.s);
    });
    sk.on("start", () => {
      const r = sk.data.room;
      if (r && r.isHost(sk) && r.H.s.ph === "lobby") r.H.start();
    });
    sk.on("rematch", () => {
      const r = sk.data.room;
      if (r && r.isHost(sk) && r.H.s.ph === "end") r.H.run();
    });
    sk.on("cont", () => {
      const r = sk.data.room;
      if (r && r.isHost(sk)) r.H.cont();
    });
    sk.on("act", (p) => {
      const r = sk.data.room;
      if (!r || !ok() || !p) return;
      const seat = r.seatOf(sk);
      if (seat >= 0 && typeof p.val === "string") r.H.input(seat, String(p.kind), p.val);
    });
    sk.on("rx", (p) => {
      const r = sk.data.room;
      if (!r || !p || !REACTS.includes(p.e)) return;
      const seat = r.seatOf(sk);
      if (seat < 0 || Date.now() - r.lastRx[seat] < 800) return;
      r.lastRx[seat] = Date.now();
      sk.to(r.code).emit("rx", { seat, e: p.e });
      r.H.humanRx(seat, p.e);
    });
    sk.on("profile", (p) => {
      if (!ok()) return;
      prof(p);
      store.setProfile(sk.data.id, sk.data.name, sk.data.avatar).catch(() => {
      });
      const r = sk.data.room;
      if (r) r.setProfile(sk);
    });
    sk.on("report", (p, f) => {
      const r = sk.data.room;
      if (!r || !ok()) return;
      const seat = +(p && p.seat);
      const target = r.ids[seat];
      if (!target || target === sk.data.id) return;
      const st = r.H.s.seats[seat] || {};
      store.report({ reporter: sk.data.id, target, target_name: st.n || "", room: r.code, reason: String(p.reason || "").slice(0, 200) }).catch(() => {
      });
      cb(f)({ ok: true });
    });
    sk.on("lb", async (p, f) => {
      if (!ok()) return;
      try {
        cb(f)({ rows: await store.leaderboard(["week", "month"].includes(p && p.period) ? p.period : "all", sk.data.id) });
      } catch (e) {
        cb(f)({ error: true });
      }
    });
    sk.on("disconnect", () => leaveCur(false));
  }
};
export {
  GameHub,
  worker_default as default
};
//# sourceMappingURL=worker.js.map
