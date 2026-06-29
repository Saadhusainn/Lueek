'use strict';

/* ═══════════════════════════════════════════════════════════
   API ENDPOINTS
   ═══════════════════════════════════════════════════════════ */

const WIKT_DEF = w =>
    `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(w)}`;
const WIKT_SUG = q =>
    `https://en.wiktionary.org/w/api.php?action=opensearch&search=${encodeURIComponent(q)}&limit=10&format=json&origin=*`;

/* Lingva Translate mirrors — try in order until one works */
const LINGVA_HOSTS = [
    'lingva.ml',
    'lingva.lunar.icu',
    'lingva.garuber.eu',
    'translate.plausibility.cloud',
];

async function lingvaTranslate(from, to, text) {
    for (const host of LINGVA_HOSTS) {
        try {
            const url = `https://${host}/api/v1/${from}/${to}/${encodeURIComponent(text)}`;
            const r = await fetch(url);
            if (!r.ok) continue;
            const d = await r.json();
            if (d?.translation) return d.translation;
        } catch { /* try next */ }
    }
    throw new Error('All Lingva hosts failed');
}

/* ═══════════════════════════════════════════════════════════
   LANGUAGE CONFIG
   ═══════════════════════════════════════════════════════════ */

const LANGS = [
    { code:'auto', label:'Auto-detect', emoji:'🔍', section:null,         tts:null    },
    { code:'en',   label:'English',     emoji:'🇬🇧', section:'English',    tts:'en-US' },
    { code:'ar',   label:'العربية',     emoji:'🇸🇦', section:'Arabic',     tts:'ar-SA' },
    { code:'ru',   label:'Русский',     emoji:'🇷🇺', section:'Russian',    tts:'ru-RU' },
    { code:'es',   label:'Español',     emoji:'🇪🇸', section:'Spanish',    tts:'es-ES' },
    { code:'fr',   label:'Français',    emoji:'🇫🇷', section:'French',     tts:'fr-FR' },
    { code:'de',   label:'Deutsch',     emoji:'🇩🇪', section:'German',     tts:'de-DE' },
    { code:'it',   label:'Italiano',    emoji:'🇮🇹', section:'Italian',    tts:'it-IT' },
    { code:'pt',   label:'Português',   emoji:'🇵🇹', section:'Portuguese', tts:'pt-BR' },
    { code:'nl',   label:'Nederlands',  emoji:'🇳🇱', section:'Dutch',      tts:'nl-NL' },
    { code:'pl',   label:'Polski',      emoji:'🇵🇱', section:'Polish',     tts:'pl-PL' },
    { code:'sv',   label:'Svenska',     emoji:'🇸🇪', section:'Swedish',    tts:'sv-SE' },
    { code:'ja',   label:'日本語',       emoji:'🇯🇵', section:'Japanese',   tts:'ja-JP' },
    { code:'zh',   label:'中文',         emoji:'🇨🇳', section:'Chinese',    tts:'zh-CN' },
    { code:'ko',   label:'한국어',       emoji:'🇰🇷', section:'Korean',     tts:'ko-KR' },
    { code:'hi',   label:'हिन्दी',       emoji:'🇮🇳', section:'Hindi',      tts:'hi-IN' },
    { code:'tr',   label:'Türkçe',      emoji:'🇹🇷', section:'Turkish',    tts:'tr-TR' },
    { code:'vi',   label:'Tiếng Việt',  emoji:'🇻🇳', section:'Vietnamese', tts:'vi-VN' },
    { code:'uk',   label:'Українська',  emoji:'🇺🇦', section:'Ukrainian',  tts:'uk-UA' },
    { code:'la',   label:'Latina',      emoji:'🏛️',  section:'Latin',      tts:'la'    },
    { code:'el',   label:'Ελληνικά',    emoji:'🇬🇷', section:'Greek',      tts:'el-GR' },
    { code:'fi',   label:'Suomi',       emoji:'🇫🇮', section:'Finnish',    tts:'fi-FI' },
    { code:'cs',   label:'Čeština',     emoji:'🇨🇿', section:'Czech',      tts:'cs-CZ' },
    { code:'da',   label:'Dansk',       emoji:'🇩🇰', section:'Danish',     tts:'da-DK' },
    { code:'no',   label:'Norsk',       emoji:'🇳🇴', section:'Norwegian',  tts:'nb-NO' },
];

/* Translate box language list (no 'auto' for target, but 'auto' for source) */
const TRANS_LANGS = [
    { code:'auto', label:'🔍 Auto-detect' },
    { code:'en',   label:'🇬🇧 English' },
    { code:'ar',   label:'🇸🇦 Arabic' },
    { code:'ru',   label:'🇷🇺 Russian' },
    { code:'es',   label:'🇪🇸 Spanish' },
    { code:'fr',   label:'🇫🇷 French' },
    { code:'de',   label:'🇩🇪 German' },
    { code:'it',   label:'🇮🇹 Italian' },
    { code:'pt',   label:'🇵🇹 Portuguese' },
    { code:'nl',   label:'🇳🇱 Dutch' },
    { code:'pl',   label:'🇵🇱 Polish' },
    { code:'sv',   label:'🇸🇪 Swedish' },
    { code:'ja',   label:'🇯🇵 Japanese' },
    { code:'zh',   label:'🇨🇳 Chinese' },
    { code:'ko',   label:'🇰🇷 Korean' },
    { code:'hi',   label:'🇮🇳 Hindi' },
    { code:'tr',   label:'🇹🇷 Turkish' },
    { code:'vi',   label:'🇻🇳 Vietnamese' },
    { code:'uk',   label:'🇺🇦 Ukrainian' },
    { code:'el',   label:'🇬🇷 Greek' },
    { code:'fi',   label:'🇫🇮 Finnish' },
    { code:'cs',   label:'🇨🇿 Czech' },
    { code:'da',   label:'🇩🇰 Danish' },
    { code:'no',   label:'🇳🇴 Norwegian' },
    { code:'id',   label:'🇮🇩 Indonesian' },
    { code:'th',   label:'🇹🇭 Thai' },
    { code:'ro',   label:'🇷🇴 Romanian' },
    { code:'hu',   label:'🇭🇺 Hungarian' },
    { code:'bg',   label:'🇧🇬 Bulgarian' },
    { code:'hr',   label:'🇭🇷 Croatian' },
    { code:'sk',   label:'🇸🇰 Slovak' },
    { code:'sl',   label:'🇸🇮 Slovenian' },
    { code:'lt',   label:'🇱🇹 Lithuanian' },
    { code:'lv',   label:'🇱🇻 Latvian' },
    { code:'et',   label:'🇪🇪 Estonian' },
    { code:'fa',   label:'🇮🇷 Persian' },
    { code:'he',   label:'🇮🇱 Hebrew' },
    { code:'sw',   label:'🇰🇪 Swahili' },
    { code:'bn',   label:'🇧🇩 Bengali' },
    { code:'ta',   label:'🇮🇳 Tamil' },
    { code:'ur',   label:'🇵🇰 Urdu' },
    { code:'ms',   label:'🇲🇾 Malay' },
    { code:'tl',   label:'🇵🇭 Filipino' },
    { code:'af',   label:'🇿🇦 Afrikaans' },
    { code:'ga',   label:'🇮🇪 Irish' },
    { code:'cy',   label:'🏴 Welsh' },
];

const SECTION_MAP = {};
LANGS.forEach(l => { if (l.section) SECTION_MAP[l.section.toLowerCase()] = l; });

const MAXH = 12, MAXB = 30;
const LS_H = 'lk_h7', LS_B = 'lk_b7';

/* ═══════════════════════════════════════════════════════════
   DOM
   ═══════════════════════════════════════════════════════════ */

const $ = id => document.getElementById(id);

const inp       = $('inp'),      pill    = $('pill');
const xBtn      = $('xBtn'),     goBtn   = $('goBtn');
const langBtn   = $('langBtn'),  langDd  = $('langDd');
const langEmoji = $('langEmoji'),langLbl = $('langLbl');
const sugBox    = $('sugBox');
const histStrip = $('histStrip'),bkStrip = $('bkStrip');
const welc      = $('welc'),     ldr     = $('ldr');
const errC      = $('errC'),     errT    = $('errT'), errP = $('errP');
const wc        = $('wc'),       whEl    = $('whEl');
const langTabs  = $('langTabs'), mcWrap  = $('mcWrap');

/* Translate box */
const tFromLang = $('tFromLang'), tToLang = $('tToLang');
const tInput    = $('tInput'),    tOutput = $('tOutput');
const tBtn      = $('tBtn'),      tSwap   = $('tSwap');

/* ═══════════════════════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════════════════════ */

let selLang = LANGS[0], curWord = '', curLangSections = {}, curActiveLang = null;
let sugTimer = null, sugIdx = -1;

/* ═══════════════════════════════════════════════════════════
   STORAGE
   ═══════════════════════════════════════════════════════════ */

function lsGet(k) { try { return JSON.parse(localStorage.getItem(k)||'[]'); } catch { return []; } }
function lsSet(k,v) { try { localStorage.setItem(k,JSON.stringify(v)); } catch {} }
function addH(w) { let a=lsGet(LS_H).filter(x=>x!==w); a.unshift(w); lsSet(LS_H,a.slice(0,MAXH)); }
function togB(w) { let a=lsGet(LS_B); a.includes(w)?a=a.filter(x=>x!==w):a.unshift(w); lsSet(LS_B,a.slice(0,MAXB)); }
function isB(w) { return lsGet(LS_B).includes(w); }

/* ═══════════════════════════════════════════════════════════
   ARABIC UTILS
   ═══════════════════════════════════════════════════════════ */

function stripHarakaat(text) {
    return text.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7-\u06E8\u06EA-\u06ED\u08D3-\u08E1\u08E3-\u08FF\uFE70-\uFE7F]/g, '');
}

function isArabic(text) {
    return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
}

/* ═══════════════════════════════════════════════════════════
   HISTORY API
   ═══════════════════════════════════════════════════════════ */

function pushSt(word) { if(word) history.pushState({word},'',`#${encodeURIComponent(word)}`); }
window.addEventListener('popstate', e => {
    if(e.state?.word) { inp.value=e.state.word; syncX(); fetchDef(e.state.word,true); }
    else goHome();
});
window.addEventListener('DOMContentLoaded', () => {
    const h=decodeURIComponent(location.hash.slice(1));
    if(h) { inp.value=h; syncX(); fetchDef(h,true); }
});

/* ═══════════════════════════════════════════════════════════
   LOGO HOME
   ═══════════════════════════════════════════════════════════ */

$('logoLink').addEventListener('click', e => {
    e.preventDefault(); goHome(); history.pushState(null,'',location.pathname);
});

function goHome() {
    inp.value=''; syncX(); closeSug(); hideAll(); welc.style.display=''; inp.focus();
}

/* ═══════════════════════════════════════════════════════════
   LANG DROPDOWN
   ═══════════════════════════════════════════════════════════ */

function buildLangDd() {
    langDd.innerHTML = LANGS.map(l =>
        `<button class="lang-opt${l.code===selLang.code?' on':''}" data-c="${l.code}">
            <span>${l.emoji}</span><span>${l.label}</span>
            ${l.code==='auto'?'<span class="opt-desc">recommended</span>':''}
        </button>`
    ).join('');
}
buildLangDd();

langBtn.onclick = e => { e.stopPropagation(); langDd.classList.toggle('open'); };
langDd.onclick = e => {
    const o=e.target.closest('.lang-opt'); if(!o) return;
    selLang = LANGS.find(l=>l.code===o.dataset.c)||LANGS[0];
    langEmoji.textContent = selLang.emoji;
    langLbl.textContent = selLang.label;
    langDd.classList.remove('open'); buildLangDd();
    inp.placeholder = selLang.code==='auto' ? 'Search any word…' : `Search in ${selLang.label}…`;
};
document.addEventListener('click', () => langDd.classList.remove('open'));

/* ═══════════════════════════════════════════════════════════
   SUGGESTIONS
   ═══════════════════════════════════════════════════════════ */

async function fetchSug(q) {
    try {
        const r = await fetch(WIKT_SUG(q));
        const d = await r.json();
        let words = (d[1]||[]).filter(w => {
            if(!w || w.length>50) return false;
            if(w.includes(':') || w.includes('/') || w.includes('Reconstruction')) return false;
            if(/^[`'\-\s*#\u0300-\u036f]+$/.test(w)) return false;
            if(/^[`\-*#\u0060\u00B4]/.test(w)) return false;
            return true;
        });
        if(!words.length) { closeSug(); return; }
        sugIdx = -1;
        sugBox.innerHTML = words.slice(0,8).map(w => {
            const lang = detectScript(w);
            return `<button class="sug-item" data-w="${esc(w)}">
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <span class="sug-word">${esc(w)}</span>
                ${lang ? `<span class="sug-lang">${lang}</span>` : ''}
            </button>`;
        }).join('');
        sugBox.classList.add('open');
        sugBox.querySelectorAll('.sug-item').forEach(b =>
            b.addEventListener('click', () => { doSearch(b.dataset.w); closeSug(); })
        );
    } catch { closeSug(); }
}

function detectScript(w) {
    if(!w) return '';
    for(const ch of w) {
        const c = ch.codePointAt(0);
        if(c>=0x0600&&c<=0x06FF) return '🇸🇦 Arabic';
        if(c>=0x0400&&c<=0x04FF) return '🇷🇺 Cyrillic';
        if(c>=0x4E00&&c<=0x9FFF) return '🇨🇳 Chinese';
        if(c>=0x3040&&c<=0x30FF) return '🇯🇵 Japanese';
        if(c>=0xAC00&&c<=0xD7AF) return '🇰🇷 Korean';
        if(c>=0x0900&&c<=0x097F) return '🇮🇳 Hindi';
        if(c>=0x0E00&&c<=0x0E7F) return '🇹🇭 Thai';
        if(c>=0x0370&&c<=0x03FF) return '🇬🇷 Greek';
    }
    return '';
}

function closeSug() { sugBox.classList.remove('open'); sugBox.innerHTML=''; sugIdx=-1; }

/* ═══════════════════════════════════════════════════════════
   SEARCH
   ═══════════════════════════════════════════════════════════ */

function doSearch(w) {
    let q = (w||inp.value).trim();
    if(!q) return;
    q = stripHarakaat(q);
    inp.value = q; syncX(); closeSug();
    // Also fill the translate box
    tInput.value = q;
    fetchDef(q);
}

async function fetchDef(word, skipPush) {
    hideAll(); ldr.classList.add('on'); curWord = word;
    try {
        const res = await fetch(WIKT_DEF(word));
        if(!res.ok) throw { status: res.status };
        const data = await res.json();
        if(!data || typeof data !== 'object') throw { empty: true };

        const byLang = {};
        for(const [,sections] of Object.entries(data)) {
            if(!Array.isArray(sections)) continue;
            sections.forEach(s => {
                const lang = s.language || 'Unknown';
                if(!byLang[lang]) byLang[lang] = [];
                byLang[lang].push(s);
            });
        }
        if(!Object.keys(byLang).length) throw { empty: true };

        curLangSections = byLang;
        addH(word); renderHist();

        let activeLang = null;
        if(selLang.code!=='auto' && selLang.section && byLang[selLang.section]) {
            activeLang = selLang.section;
        } else {
            activeLang = Object.keys(byLang)[0];
        }

        renderAll(word, byLang, activeLang);
        if(!skipPush) pushSt(word);
    } catch(err) { showErr(err); }
    finally { ldr.classList.remove('on'); }
}

/* ═══════════════════════════════════════════════════════════
   RENDER
   ═══════════════════════════════════════════════════════════ */

function renderAll(word, byLang, activeLang) {
    curActiveLang = activeLang;
    renderHeader(word, activeLang, byLang);
    renderTabs(byLang, activeLang);
    renderMeanings(byLang[activeLang] || []);
    wc.classList.add('on');

    // Auto-set translate source language
    const ld = SECTION_MAP[activeLang.toLowerCase()];
    if(ld) tFromLang.value = ld.code;
}

function renderHeader(word, activeLang, byLang) {
    const bk = isB(word);
    const ld = SECTION_MAP[activeLang.toLowerCase()];
    const ttsCode = ld?.tts || 'en-US';
    const isAr = activeLang.toLowerCase() === 'arabic';

    whEl.innerHTML = `
        <div class="wh-top">
            <div class="wh-left">
                <div class="wh-word${isAr?' arabic-text':''}">${esc(word)}</div>
                <div class="wh-det-lang">
                    ${ld?.emoji||'🌐'} ${esc(activeLang)}
                    ${Object.keys(byLang).length>1
                        ?`<span style="color:var(--t3);font-weight:400">(+${Object.keys(byLang).length-1} more)</span>`:''}
                </div>
                <div class="wh-meta">
                    ${Object.keys(byLang).map(lang => {
                        const lx = SECTION_MAP[lang.toLowerCase()];
                        return `<span class="badge badge-lang" data-lang="${esc(lang)}">${lx?.emoji||'🌐'} ${esc(lang)}</span>`;
                    }).join('')}
                </div>
            </div>
            <div class="wh-actions">
                <button class="ib" id="spkBtn" title="Listen"><svg viewBox="0 0 24 24" class="fi"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 12 7.5v9a4.5 4.5 0 0 0 4.5-4.5zM14 3.23v2.06a6.5 6.5 0 0 1 0 13.42v2.06A8.5 8.5 0 0 0 14 3.23z"/></svg></button>
                <button class="ib${bk?' bk-on':''}" id="bkBtn" title="Save"><svg viewBox="0 0 24 24" class="si"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></button>
            </div>
        </div>
        <div class="wh-src"><a href="https://en.wiktionary.org/wiki/${encodeURIComponent(word)}" target="_blank">View on Wiktionary ↗</a></div>`;

    $('spkBtn').onclick = () => speak(word, ttsCode);
    $('bkBtn').onclick = () => {
        togB(word); $('bkBtn').classList.toggle('bk-on', isB(word)); renderBk();
    };
    whEl.querySelectorAll('.badge-lang').forEach(b =>
        b.addEventListener('click', () => {
            const lang = b.dataset.lang;
            if(lang && curLangSections[lang]) renderAll(curWord, curLangSections, lang);
        })
    );
}

function renderTabs(byLang, activeLang) {
    const langs = Object.keys(byLang);
    if(langs.length <= 1) { langTabs.innerHTML=''; return; }
    langTabs.innerHTML = langs.map(lang => {
        const ct = byLang[lang].length;
        const ld = SECTION_MAP[lang.toLowerCase()];
        return `<button class="lang-tab${lang===activeLang?' on':''}" data-lang="${esc(lang)}">
            ${ld?.emoji||'🌐'} ${esc(lang)} <span class="tab-ct">(${ct})</span>
        </button>`;
    }).join('');
    langTabs.querySelectorAll('.lang-tab').forEach(t =>
        t.addEventListener('click', () => {
            const lang = t.dataset.lang;
            if(lang && curLangSections[lang]) renderAll(curWord, curLangSections, lang);
        })
    );
}

function renderMeanings(sections) {
    mcWrap.innerHTML = '';
    sections.forEach(section => {
        if(!section.definitions?.length) return;
        const card = document.createElement('div'); card.className = 'mc';
        const syns = new Set(), ants = new Set();
        let html = `<span class="pos">${esc(section.partOfSpeech||'Word')}</span><ol class="def-tree">`;
        section.definitions.forEach((d,i) => { html += renderDef(d, i+1, syns, ants); });
        html += '</ol>';
        if(syns.size) html += `<div class="ts"><div class="ts-l syn">Synonyms</div><div class="tg">${[...syns].map(w=>`<button class="t syn" data-w="${esc(w)}">${esc(w)}</button>`).join('')}</div></div>`;
        if(ants.size) html += `<div class="ts"><div class="ts-l ant">Antonyms</div><div class="tg">${[...ants].map(w=>`<button class="t ant" data-w="${esc(w)}">${esc(w)}</button>`).join('')}</div></div>`;
        card.innerHTML = html;
        card.querySelectorAll('.t').forEach(t => t.addEventListener('click', () => doSearch(t.dataset.w)));
        mcWrap.appendChild(card);
    });
}

function renderDef(d, num, syns, ants) {
    const defHtml = sanitize(d.definition||'');
    const plain = strip(d.definition||'');
    if(!plain.trim()) return '';

    const synM = plain.match(/^[Ss]ynonym(?:s)?\s+of\s+(.+?)[\.\;]?$/);
    const antM = plain.match(/^[Aa]ntonym(?:s)?\s+of\s+(.+?)[\.\;]?$/);
    if(synM) synM[1].split(/[,\/]/).map(s=>s.trim()).filter(Boolean).forEach(s=>syns.add(s));
    if(antM) antM[1].split(/[,\/]/).map(s=>s.trim()).filter(Boolean).forEach(s=>ants.add(s));

    let html = `<li class="def-node"><div class="def-head"><span class="def-bullet">${num}</span><div class="def-body"><div class="def-text">${defHtml}</div>`;
    const examples = d.parsedExamples || d.examples || [];
    if(examples.length) {
        html += '<div class="def-examples">';
        examples.forEach(ex => {
            const txt = strip(typeof ex==='string' ? ex : ex.example||ex.text||'').trim();
            if(txt) html += `<div class="def-ex">${esc(txt)}</div>`;
        });
        html += '</div>';
    }
    html += '</div></div>';
    if(d.definitions?.length) {
        html += '<ol class="def-tree">';
        d.definitions.forEach((sub,j) => { html += renderDef(sub, j+1, syns, ants); });
        html += '</ol>';
    }
    html += '</li>';
    return html;
}

/* ═══════════════════════════════════════════════════════════
   TRANSLATE BOX
   ═══════════════════════════════════════════════════════════ */

function buildTransSelects() {
    /* Source: includes "auto" */
    tFromLang.innerHTML = TRANS_LANGS.map(l =>
        `<option value="${l.code}">${l.label}</option>`
    ).join('');
    tFromLang.value = 'auto';

    /* Target: no "auto" */
    tToLang.innerHTML = TRANS_LANGS.filter(l => l.code !== 'auto').map(l =>
        `<option value="${l.code}">${l.label}</option>`
    ).join('');
    tToLang.value = 'en';
}
buildTransSelects();

tSwap.onclick = () => {
    const from = tFromLang.value;
    const to = tToLang.value;
    if(from === 'auto') return; // can't swap auto
    tFromLang.value = to;
    tToLang.value = from;
    const inputText = tInput.value;
    const outputText = tOutput.textContent;
    if(outputText && !tOutput.querySelector('.tbox-placeholder')) {
        tInput.value = outputText;
        tOutput.textContent = inputText;
        tOutput.className = 'tbox-output' + (isArabic(inputText) ? ' arabic-text' : '');
    }
};

tBtn.onclick = async () => {
    const text = tInput.value.trim();
    if(!text) return;

    const from = tFromLang.value;
    const to = tToLang.value;

    tBtn.classList.add('loading');
    tBtn.disabled = true;
    tOutput.innerHTML = '<span class="tbox-placeholder">Translating…</span>';

    try {
        const result = await lingvaTranslate(from, to, text);
        tOutput.textContent = result;
        tOutput.className = 'tbox-output' + (isArabic(result) ? ' arabic-text' : '');
    } catch {
        tOutput.innerHTML = '<span class="tbox-placeholder" style="color:var(--red)">Translation failed. Try again.</span>';
    } finally {
        tBtn.classList.remove('loading');
        tBtn.disabled = false;
    }
};

/* Auto-translate on Enter in textarea */
tInput.addEventListener('keydown', e => {
    if(e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        tBtn.click();
    }
});

/* ═══════════════════════════════════════════════════════════
   TTS
   ═══════════════════════════════════════════════════════════ */

function speak(word, ttsCode) {
    if(!window.speechSynthesis) return;
    const btn = $('spkBtn'); speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = ttsCode||'en-US'; u.rate = 0.88;
    const voices = speechSynthesis.getVoices();
    const voice = voices.find(v=>v.lang===ttsCode) || voices.find(v=>v.lang.startsWith(ttsCode?.split('-')[0])) || null;
    if(voice) u.voice = voice;
    btn.classList.add('playing');
    u.onend = () => btn.classList.remove('playing');
    u.onerror = () => btn.classList.remove('playing');
    speechSynthesis.speak(u);
}
if(window.speechSynthesis) { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged=()=>speechSynthesis.getVoices(); }

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */

function hideAll() { welc.style.display='none'; errC.classList.remove('on'); wc.classList.remove('on'); ldr.classList.remove('on'); }
function showErr(err) {
    errT.textContent = err?.status===404||err?.empty ? 'Word not found' : 'Something went wrong';
    errP.textContent = err?.status===404||err?.empty
        ? "We couldn't find that word on Wiktionary. Check the spelling."
        : 'Network error — please check your connection.';
    errC.classList.add('on');
}
function syncX() { pill.classList.toggle('has-val', inp.value.length>0); }
function esc(s) { const d=document.createElement('div'); d.textContent=String(s??''); return d.innerHTML; }
function strip(h) { const d=document.createElement('div'); d.innerHTML=h||''; return d.textContent||''; }
function sanitize(html) {
    const d = document.createElement('div'); d.innerHTML = html||'';
    d.querySelectorAll('script,style,iframe,object,embed').forEach(el=>el.remove());
    d.querySelectorAll('a').forEach(a => {
        const href = a.getAttribute('href');
        if(href && href.startsWith('/wiki/')) {
            a.setAttribute('href','#');
            a.setAttribute('data-word', a.textContent.trim());
            a.classList.add('wikt-link');
        } else if(href && !href.startsWith('http')) { a.removeAttribute('href'); }
    });
    return d.innerHTML;
}

/* ═══════════════════════════════════════════════════════════
   STRIPS
   ═══════════════════════════════════════════════════════════ */

function renderHist() {
    const h = lsGet(LS_H); if(!h.length){histStrip.innerHTML='';return}
    histStrip.innerHTML = `<span class="strip-l">Recent</span>` +
        h.map(w=>`<button class="chip chip-h" data-w="${esc(w)}">${esc(w)}</button>`).join('') +
        `<button class="chip chip-x" id="clrH">Clear</button>`;
    histStrip.querySelectorAll('.chip-h').forEach(b=>b.addEventListener('click',()=>doSearch(b.dataset.w)));
    $('clrH').addEventListener('click',()=>{lsSet(LS_H,[]);renderHist()});
}

function renderBk() {
    const bk=lsGet(LS_B); if(!bk.length){bkStrip.innerHTML='';return}
    bkStrip.innerHTML = `<span class="strip-l">⭐ Saved</span>` +
        bk.map(w=>`<button class="chip chip-b" data-w="${esc(w)}">${esc(w)}</button>`).join('');
    bkStrip.querySelectorAll('.chip-b').forEach(b=>b.addEventListener('click',()=>doSearch(b.dataset.w)));
}

/* ═══════════════════════════════════════════════════════════
   EVENTS
   ═══════════════════════════════════════════════════════════ */

goBtn.onclick = () => doSearch();

inp.addEventListener('keydown', e => {
    const items = sugBox.querySelectorAll('.sug-item');
    if(e.key==='Enter') { if(sugIdx>=0&&items[sugIdx]) doSearch(items[sugIdx].dataset.w); else doSearch(); closeSug(); return; }
    if(e.key==='Escape') { closeSug(); return; }
    if(e.key==='ArrowDown') { e.preventDefault(); sugIdx=Math.min(sugIdx+1,items.length-1); items.forEach((it,i)=>it.classList.toggle('hi',i===sugIdx)); }
    else if(e.key==='ArrowUp') { e.preventDefault(); sugIdx=Math.max(sugIdx-1,-1); items.forEach((it,i)=>it.classList.toggle('hi',i===sugIdx)); }
});

inp.addEventListener('input', () => {
    syncX(); const q=inp.value.trim();
    clearTimeout(sugTimer);
    if(q.length<2) { closeSug(); return; }
    sugTimer = setTimeout(()=>fetchSug(q), 250);
});

inp.addEventListener('blur', () => setTimeout(closeSug, 200));
inp.addEventListener('focus', () => { if(inp.value.trim().length>=2) fetchSug(inp.value.trim()); });
xBtn.onclick = () => { inp.value=''; syncX(); closeSug(); inp.focus(); };
document.addEventListener('click', e => { if(!e.target.closest('.search-wrap')) closeSug(); });

/* Wiktionary cross-reference links */
document.addEventListener('click', e => {
    const link = e.target.closest('.wikt-link');
    if(link) { e.preventDefault(); const w=link.dataset.word; if(w) doSearch(w); }
});

/* ═══ INIT ═══ */
renderHist();
renderBk();
