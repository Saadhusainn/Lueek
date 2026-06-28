'use strict';

/* ═══════════════════════════════════════════════════════════
   CONFIG & CONSTANTS
   ═══════════════════════════════════════════════════════════ */

const WIKT_DEF  = w => `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(w)}`;
const WIKT_SUG  = q => `https://en.wiktionary.org/w/api.php?action=opensearch&search=${encodeURIComponent(q)}&limit=10&format=json&origin=*`;
const WIKT_HTML = w => `https://en.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(w)}&prop=text&format=json&origin=*`;

const LANGS = [
    { code: 'auto', label: 'Auto-detect', emoji: '🔍', section: null,         tts: null    },
    { code: 'en',   label: 'English',     emoji: '🇬🇧', section: 'English',    tts: 'en-US' },
    { code: 'ar',   label: 'العربية',     emoji: '🇸🇦', section: 'Arabic',     tts: 'ar-SA' },
    { code: 'ru',   label: 'Русский',     emoji: '🇷🇺', section: 'Russian',    tts: 'ru-RU' },
    { code: 'es',   label: 'Español',     emoji: '🇪🇸', section: 'Spanish',    tts: 'es-ES' },
    { code: 'fr',   label: 'Français',    emoji: '🇫🇷', section: 'French',     tts: 'fr-FR' },
    { code: 'de',   label: 'Deutsch',     emoji: '🇩🇪', section: 'German',     tts: 'de-DE' },
    { code: 'it',   label: 'Italiano',    emoji: '🇮🇹', section: 'Italian',    tts: 'it-IT' },
    { code: 'pt',   label: 'Português',   emoji: '🇵🇹', section: 'Portuguese', tts: 'pt-BR' },
    { code: 'nl',   label: 'Nederlands',  emoji: '🇳🇱', section: 'Dutch',      tts: 'nl-NL' },
    { code: 'pl',   label: 'Polski',      emoji: '🇵🇱', section: 'Polish',     tts: 'pl-PL' },
    { code: 'sv',   label: 'Svenska',     emoji: '🇸🇪', section: 'Swedish',    tts: 'sv-SE' },
    { code: 'ja',   label: '日本語',       emoji: '🇯🇵', section: 'Japanese',   tts: 'ja-JP' },
    { code: 'zh',   label: '中文',         emoji: '🇨🇳', section: 'Chinese',    tts: 'zh-CN' },
    { code: 'ko',   label: '한국어',       emoji: '🇰🇷', section: 'Korean',     tts: 'ko-KR' },
    { code: 'hi',   label: 'हिन्दी',       emoji: '🇮🇳', section: 'Hindi',      tts: 'hi-IN' },
    { code: 'tr',   label: 'Türkçe',      emoji: '🇹🇷', section: 'Turkish',    tts: 'tr-TR' },
    { code: 'vi',   label: 'Tiếng Việt',  emoji: '🇻🇳', section: 'Vietnamese', tts: 'vi-VN' },
    { code: 'uk',   label: 'Українська',  emoji: '🇺🇦', section: 'Ukrainian',  tts: 'uk-UA' },
    { code: 'la',   label: 'Latina',      emoji: '🏛️',  section: 'Latin',      tts: 'la'    },
    { code: 'el',   label: 'Ελληνικά',    emoji: '🇬🇷', section: 'Greek',      tts: 'el-GR' },
    { code: 'fi',   label: 'Suomi',       emoji: '🇫🇮', section: 'Finnish',    tts: 'fi-FI' },
    { code: 'cs',   label: 'Čeština',     emoji: '🇨🇿', section: 'Czech',      tts: 'cs-CZ' },
    { code: 'da',   label: 'Dansk',       emoji: '🇩🇰', section: 'Danish',     tts: 'da-DK' },
    { code: 'no',   label: 'Norsk',       emoji: '🇳🇴', section: 'Norwegian',  tts: 'nb-NO' },
];

/* Emoji map for language names that appear in translations */
const LANG_EMOJI_MAP = {
    english:'🇬🇧',arabic:'🇸🇦',russian:'🇷🇺',spanish:'🇪🇸',french:'🇫🇷',
    german:'🇩🇪',italian:'🇮🇹',portuguese:'🇵🇹',dutch:'🇳🇱',polish:'🇵🇱',
    swedish:'🇸🇪',japanese:'🇯🇵',chinese:'🇨🇳',korean:'🇰🇷',hindi:'🇮🇳',
    turkish:'🇹🇷',vietnamese:'🇻🇳',ukrainian:'🇺🇦',latin:'🏛️',greek:'🇬🇷',
    finnish:'🇫🇮',czech:'🇨🇿',danish:'🇩🇰',norwegian:'🇳🇴',thai:'🇹🇭',
    hebrew:'🇮🇱',persian:'🇮🇷',indonesian:'🇮🇩',malay:'🇲🇾',bengali:'🇧🇩',
    tamil:'🇮🇳',telugu:'🇮🇳',urdu:'🇵🇰',swahili:'🇰🇪',catalan:'🇪🇸',
    romanian:'🇷🇴',hungarian:'🇭🇺',bulgarian:'🇧🇬',croatian:'🇭🇷',
    serbian:'🇷🇸',slovak:'🇸🇰',slovenian:'🇸🇮',lithuanian:'🇱🇹',
    latvian:'🇱🇻',estonian:'🇪🇪',irish:'🇮🇪',welsh:'🇬🇧',
    afrikaans:'🇿🇦',albanian:'🇦🇱',macedonian:'🇲🇰',bosnian:'🇧🇦',
    georgian:'🇬🇪',armenian:'🇦🇲',mongolian:'🇲🇳',icelandic:'🇮🇸',
    tagalog:'🇵🇭',filipino:'🇵🇭','mandarin chinese':'🇨🇳',
    cantonese:'🇭🇰',esperanto:'🟢',basque:'🇪🇸',galician:'🇪🇸',
    azerbaijani:'🇦🇿',kazakh:'🇰🇿',uzbek:'🇺🇿',nepali:'🇳🇵',
    sinhala:'🇱🇰',khmer:'🇰🇭',lao:'🇱🇦',burmese:'🇲🇲',
    amharic:'🇪🇹',somali:'🇸🇴',yoruba:'🇳🇬',zulu:'🇿🇦',
    hausa:'🇳🇬',igbo:'🇳🇬',pashto:'🇦🇫',kurdish:'🇮🇶',
    maltese:'🇲🇹',luxembourgish:'🇱🇺',faroese:'🇫🇴',
};

/* Section name to LANGS entry for quick lookup */
const SECTION_MAP = {};
LANGS.forEach(l => { if (l.section) SECTION_MAP[l.section.toLowerCase()] = l; });

const MAXH = 12;
const MAXB = 30;
const LS_H = 'lk_h6';
const LS_B = 'lk_b6';

/* ═══════════════════════════════════════════════════════════
   DOM REFS
   ═══════════════════════════════════════════════════════════ */

const $ = id => document.getElementById(id);

const inp       = $('inp');
const pill      = $('pill');
const xBtn      = $('xBtn');
const goBtn     = $('goBtn');
const langBtn   = $('langBtn');
const langDd    = $('langDd');
const langEmoji = $('langEmoji');
const langLbl   = $('langLbl');
const sugBox    = $('sugBox');
const histStrip = $('histStrip');
const bkStrip   = $('bkStrip');
const welc      = $('welc');
const ldr       = $('ldr');
const errC      = $('errC');
const errT      = $('errT');
const errP      = $('errP');
const wc        = $('wc');
const whEl      = $('whEl');
const langTabs  = $('langTabs');
const mcWrap    = $('mcWrap');
const transPanel = $('transPanel');

/* ═══════════════════════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════════════════════ */

let selLang         = LANGS[0];
let curWord         = '';
let curLangSections = {};
let curActiveLang   = null;
let sugTimer        = null;
let sugIdx          = -1;

/* ═══════════════════════════════════════════════════════════
   STORAGE
   ═══════════════════════════════════════════════════════════ */

function lsGet(k) {
    try { return JSON.parse(localStorage.getItem(k) || '[]'); }
    catch { return []; }
}

function lsSet(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); }
    catch { /* quota */ }
}

function addHistory(w) {
    let a = lsGet(LS_H).filter(x => x !== w);
    a.unshift(w);
    lsSet(LS_H, a.slice(0, MAXH));
}

function toggleBookmark(w) {
    let a = lsGet(LS_B);
    a.includes(w) ? (a = a.filter(x => x !== w)) : a.unshift(w);
    lsSet(LS_B, a.slice(0, MAXB));
}

function isBookmarked(w) {
    return lsGet(LS_B).includes(w);
}

/* ═══════════════════════════════════════════════════════════
   ARABIC HARAKAAT STRIPPING
   ═══════════════════════════════════════════════════════════ */

function stripHarakaat(text) {
    // Remove Arabic diacritical marks (U+0610-U+061A, U+064B-U+065F, U+0670, U+06D6-U+06DC, U+06DF-U+06E4, U+06E7-U+06E8, U+06EA-U+06ED)
    return text.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7-\u06E8\u06EA-\u06ED\u08D3-\u08E1\u08E3-\u08FF\uFE70-\uFE7F]/g, '');
}

function isArabicText(text) {
    return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
}

/* ═══════════════════════════════════════════════════════════
   HISTORY API — BACK BUTTON NAVIGATION
   ═══════════════════════════════════════════════════════════ */

function pushState(word) {
    if (word) {
        history.pushState({ word }, '', `#${encodeURIComponent(word)}`);
    }
}

window.addEventListener('popstate', e => {
    if (e.state && e.state.word) {
        inp.value = e.state.word;
        syncX();
        fetchDef(e.state.word, true);
    } else {
        goHome();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const hash = decodeURIComponent(location.hash.slice(1));
    if (hash) {
        inp.value = hash;
        syncX();
        fetchDef(hash, true);
    }
});

/* ═══════════════════════════════════════════════════════════
   LOGO → HOME
   ═══════════════════════════════════════════════════════════ */

$('logoLink').addEventListener('click', e => {
    e.preventDefault();
    goHome();
    history.pushState(null, '', location.pathname);
});

function goHome() {
    inp.value = '';
    syncX();
    closeSug();
    hideAll();
    welc.style.display = '';
    inp.focus();
}

/* ═══════════════════════════════════════════════════════════
   LANGUAGE DROPDOWN
   ═══════════════════════════════════════════════════════════ */

function buildLangDropdown() {
    langDd.innerHTML = LANGS.map(l =>
        `<button class="lang-opt${l.code === selLang.code ? ' on' : ''}" data-c="${l.code}">
            <span>${l.emoji}</span>
            <span>${l.label}</span>
            ${l.code === 'auto' ? '<span class="opt-desc">recommended</span>' : ''}
        </button>`
    ).join('');
}

buildLangDropdown();

langBtn.onclick = e => {
    e.stopPropagation();
    langDd.classList.toggle('open');
};

langDd.onclick = e => {
    const o = e.target.closest('.lang-opt');
    if (!o) return;
    selLang = LANGS.find(l => l.code === o.dataset.c) || LANGS[0];
    langEmoji.textContent = selLang.emoji;
    langLbl.textContent = selLang.label;
    langDd.classList.remove('open');
    buildLangDropdown();
    inp.placeholder = selLang.code === 'auto'
        ? 'Search any word…'
        : `Search in ${selLang.label}…`;
};

document.addEventListener('click', () => langDd.classList.remove('open'));

/* ═══════════════════════════════════════════════════════════
   SUGGESTIONS
   ═══════════════════════════════════════════════════════════ */

async function fetchSuggestions(q) {
    try {
        const r = await fetch(WIKT_SUG(q));
        const d = await r.json();
        let words = (d[1] || []).filter(w => {
            if (!w || w.length > 50) return false;
            if (w.includes(':') || w.includes('/')) return false;
            if (/^[`'\-\s*#\u0300-\u036f]+$/.test(w)) return false;
            if (/^[`\-*#]/.test(w)) return false;
            if (w.includes('Reconstruction')) return false;
            return true;
        });

        if (!words.length) { closeSug(); return; }

        sugIdx = -1;
        sugBox.innerHTML = words.slice(0, 8).map(w => {
            const lang = detectScript(w);
            return `<button class="sug-item" data-w="${esc(w)}">
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
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

function detectScript(word) {
    if (!word) return '';
    for (const ch of word) {
        const c = ch.codePointAt(0);
        if (c >= 0x0600 && c <= 0x06FF) return '🇸🇦 Arabic';
        if (c >= 0x0400 && c <= 0x04FF) return '🇷🇺 Russian';
        if (c >= 0x4E00 && c <= 0x9FFF) return '🇨🇳 Chinese';
        if (c >= 0x3040 && c <= 0x30FF) return '🇯🇵 Japanese';
        if (c >= 0xAC00 && c <= 0xD7AF) return '🇰🇷 Korean';
        if (c >= 0x0900 && c <= 0x097F) return '🇮🇳 Hindi';
        if (c >= 0x0E00 && c <= 0x0E7F) return '🇹🇭 Thai';
        if (c >= 0x0370 && c <= 0x03FF) return '🇬🇷 Greek';
        if (c >= 0x0530 && c <= 0x058F) return '🇦🇲 Armenian';
        if (c >= 0x10A0 && c <= 0x10FF) return '🇬🇪 Georgian';
    }
    return '';
}

function closeSug() {
    sugBox.classList.remove('open');
    sugBox.innerHTML = '';
    sugIdx = -1;
}

/* ═══════════════════════════════════════════════════════════
   SEARCH
   ═══════════════════════════════════════════════════════════ */

function doSearch(w) {
    let q = (w || inp.value).trim();
    if (!q) return;

    // Strip Arabic harakaat before searching
    q = stripHarakaat(q);

    inp.value = q;
    syncX();
    closeSug();
    fetchDef(q);
}

async function fetchDef(word, skipPush) {
    hideAll();
    ldr.classList.add('on');
    curWord = word;

    try {
        const res = await fetch(WIKT_DEF(word));
        if (!res.ok) throw { status: res.status };
        const data = await res.json();
        if (!data || typeof data !== 'object') throw { empty: true };

        /* Organize sections by language */
        const byLang = {};
        for (const [, sections] of Object.entries(data)) {
            if (!Array.isArray(sections)) continue;
            sections.forEach(s => {
                const lang = s.language || 'Unknown';
                if (!byLang[lang]) byLang[lang] = [];
                byLang[lang].push(s);
            });
        }

        if (!Object.keys(byLang).length) throw { empty: true };

        curLangSections = byLang;
        addHistory(word);
        renderHistoryStrip();

        /* Pick active language */
        let activeLang = null;
        if (selLang.code !== 'auto' && selLang.section && byLang[selLang.section]) {
            activeLang = selLang.section;
        } else {
            activeLang = Object.keys(byLang)[0];
        }

        renderAll(word, byLang, activeLang);
        if (!skipPush) pushState(word);

    } catch (err) {
        showError(err);
    } finally {
        ldr.classList.remove('on');
    }
}

/* ═══════════════════════════════════════════════════════════
   RENDER — MAIN
   ═══════════════════════════════════════════════════════════ */

function renderAll(word, byLang, activeLang) {
    curActiveLang = activeLang;
    renderWordHeader(word, activeLang, byLang);
    renderLanguageTabs(byLang, activeLang);
    renderMeanings(byLang[activeLang] || []);
    fetchTranslations(word);
    wc.classList.add('on');
}

/* ── Word Header ── */
function renderWordHeader(word, activeLang, byLang) {
    const bk = isBookmarked(word);
    const langDef = SECTION_MAP[activeLang.toLowerCase()];
    const ttsCode = langDef?.tts || 'en-US';
    const isAr = activeLang.toLowerCase() === 'arabic';

    whEl.innerHTML = `
        <div class="wh-top">
            <div class="wh-left">
                <div class="wh-word${isAr ? ' arabic-text' : ''}">${esc(word)}</div>
                <div class="wh-det-lang">
                    ${langDef?.emoji || '🌐'} ${esc(activeLang)}
                    ${Object.keys(byLang).length > 1
                        ? `<span style="color:var(--t3);font-weight:400">(+${Object.keys(byLang).length - 1} more)</span>`
                        : ''}
                </div>
                <div class="wh-meta">
                    ${Object.keys(byLang).map(lang => {
                        const ld = SECTION_MAP[lang.toLowerCase()];
                        return `<span class="badge badge-lang" data-lang="${esc(lang)}">
                            ${ld?.emoji || '🌐'} ${esc(lang)}
                        </span>`;
                    }).join('')}
                </div>
            </div>
            <div class="wh-actions">
                <button class="ib" id="spkBtn" title="Listen (${ttsCode})">
                    <svg viewBox="0 0 24 24" class="fi">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 12 7.5v9a4.5 4.5 0 0 0 4.5-4.5zM14 3.23v2.06a6.5 6.5 0 0 1 0 13.42v2.06A8.5 8.5 0 0 0 14 3.23z"/>
                    </svg>
                </button>
                <button class="ib${bk ? ' bk-on' : ''}" id="bkBtn" title="Save word">
                    <svg viewBox="0 0 24 24" class="si">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="wh-src">
            <a href="https://en.wiktionary.org/wiki/${encodeURIComponent(word)}"
               target="_blank" rel="noopener">View on Wiktionary ↗</a>
        </div>`;

    $('spkBtn').onclick = () => speak(word, ttsCode);
    $('bkBtn').onclick = () => {
        toggleBookmark(word);
        $('bkBtn').classList.toggle('bk-on', isBookmarked(word));
        renderBookmarkStrip();
    };

    whEl.querySelectorAll('.badge-lang').forEach(b =>
        b.addEventListener('click', () => {
            const lang = b.dataset.lang;
            if (lang && curLangSections[lang]) {
                renderAll(curWord, curLangSections, lang);
            }
        })
    );
}

/* ── Language Tabs ── */
function renderLanguageTabs(byLang, activeLang) {
    const langs = Object.keys(byLang);
    if (langs.length <= 1) { langTabs.innerHTML = ''; return; }

    langTabs.innerHTML = langs.map(lang => {
        const ct = byLang[lang].length;
        const ld = SECTION_MAP[lang.toLowerCase()];
        return `<button class="lang-tab${lang === activeLang ? ' on' : ''}"
                        data-lang="${esc(lang)}">
            ${ld?.emoji || '🌐'} ${esc(lang)}
            <span class="tab-ct">(${ct})</span>
        </button>`;
    }).join('');

    langTabs.querySelectorAll('.lang-tab').forEach(t =>
        t.addEventListener('click', () => {
            const lang = t.dataset.lang;
            if (lang && curLangSections[lang]) {
                renderAll(curWord, curLangSections, lang);
            }
        })
    );
}

/* ── Meanings ── */
function renderMeanings(sections) {
    mcWrap.innerHTML = '';

    sections.forEach(section => {
        if (!section.definitions?.length) return;

        const card = document.createElement('div');
        card.className = 'mc';

        const syns = new Set();
        const ants = new Set();

        let html = `<span class="pos">${esc(section.partOfSpeech || 'Word')}</span>`;
        html += '<ol class="def-tree">';

        section.definitions.forEach((d, i) => {
            html += renderDefNode(d, i + 1, syns, ants);
        });

        html += '</ol>';

        if (syns.size) {
            html += `<div class="ts"><div class="ts-l syn">Synonyms</div>
                <div class="tg">${[...syns].map(w =>
                    `<button class="t syn" data-w="${esc(w)}">${esc(w)}</button>`
                ).join('')}</div></div>`;
        }

        if (ants.size) {
            html += `<div class="ts"><div class="ts-l ant">Antonyms</div>
                <div class="tg">${[...ants].map(w =>
                    `<button class="t ant" data-w="${esc(w)}">${esc(w)}</button>`
                ).join('')}</div></div>`;
        }

        card.innerHTML = html;
        card.querySelectorAll('.t').forEach(t =>
            t.addEventListener('click', () => doSearch(t.dataset.w))
        );
        mcWrap.appendChild(card);
    });
}

function renderDefNode(d, num, syns, ants) {
    const defHtml = sanitize(d.definition || '');
    const plainText = strip(d.definition || '');
    if (!plainText.trim()) return '';

    /* Sniff synonyms/antonyms */
    const synM = plainText.match(/^[Ss]ynonym(?:s)?\s+of\s+(.+?)[\.\;]?$/);
    const antM = plainText.match(/^[Aa]ntonym(?:s)?\s+of\s+(.+?)[\.\;]?$/);
    if (synM) synM[1].split(/[,\/]/).map(s => s.trim()).filter(Boolean).forEach(s => syns.add(s));
    if (antM) antM[1].split(/[,\/]/).map(s => s.trim()).filter(Boolean).forEach(s => ants.add(s));

    let html = `<li class="def-node">
        <div class="def-head">
            <span class="def-bullet">${num}</span>
            <div class="def-body">
                <div class="def-text">${defHtml}</div>`;

    /* Examples */
    const examples = d.parsedExamples || d.examples || [];
    if (examples.length) {
        html += '<div class="def-examples">';
        examples.forEach(ex => {
            const txt = strip(typeof ex === 'string' ? ex : ex.example || ex.text || '').trim();
            if (txt) html += `<div class="def-ex">${esc(txt)}</div>`;
        });
        html += '</div>';
    }

    html += '</div></div>';

    /* Sub-definitions */
    if (d.definitions && d.definitions.length) {
        html += '<ol class="def-tree">';
        d.definitions.forEach((sub, j) => {
            html += renderDefNode(sub, j + 1, syns, ants);
        });
        html += '</ol>';
    }

    html += '</li>';
    return html;
}

/* ═══════════════════════════════════════════════════════════
   TRANSLATIONS — from Wiktionary page HTML
   ═══════════════════════════════════════════════════════════ */

async function fetchTranslations(word) {
    transPanel.style.display = 'block';
    transPanel.innerHTML = `
        <div class="trans-header">
            <svg viewBox="0 0 24 24"><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52
            17.52 0 0014.07 6H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9
            11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98
            4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21
            22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
            Translations
        </div>
        <div class="trans-loader">Loading translations from Wiktionary…</div>`;

    try {
        const r = await fetch(WIKT_HTML(word));
        if (!r.ok) throw new Error();
        const d = await r.json();
        const html = d?.parse?.text?.['*'] || '';
        if (!html) throw new Error();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        /* Parse translations — they appear as <li> inside translation tables
           Format: "LanguageName: word1, word2 (qualifier), word3" */
        const translations = new Map(); // langName -> [words]

        /* Method 1: Look in NavFrame / translations tables */
        const transContainers = doc.querySelectorAll('.translations, .NavFrame');

        transContainers.forEach(container => {
            container.querySelectorAll('li').forEach(li => {
                const text = li.textContent.trim();
                const match = text.match(/^([A-Za-zÀ-ÿ\u0100-\u024F\s]+):\s*(.+)/);
                if (!match) return;

                const langName = match[1].trim();
                const wordsRaw = match[2];

                /* Extract individual translations,
                   removing qualifiers like (masculine), (f), see also, etc. */
                const words = [];
                wordsRaw.split(/[,;]/).forEach(chunk => {
                    let w = chunk
                        .replace(/\s*\([^)]*\)/g, '')  // remove parenthetical
                        .replace(/\s*\[[^\]]*\]/g, '')  // remove brackets
                        .replace(/please add this translation if you can/i, '')
                        .replace(/^(see|please|add|this).*$/i, '')
                        .trim();

                    // Remove trailing gender markers
                    w = w.replace(/\s+[mfnc]$/, '').trim();

                    if (w && w.length > 0 && w.length < 60 && !/^[\s\-]+$/.test(w)) {
                        words.push(w);
                    }
                });

                if (words.length > 0) {
                    if (!translations.has(langName)) {
                        translations.set(langName, []);
                    }
                    words.forEach(w => {
                        if (!translations.get(langName).includes(w)) {
                            translations.get(langName).push(w);
                        }
                    });
                }
            });
        });

        /* Method 2: Fallback — scan ALL li with lang attributes */
        if (translations.size === 0) {
            doc.querySelectorAll('li').forEach(li => {
                const text = li.textContent.trim();
                const match = text.match(/^([A-Za-zÀ-ÿ\u0100-\u024F\s]+):\s*(.+)/);
                if (!match) return;

                const langName = match[1].trim();
                if (langName.length > 30) return;

                const words = [];
                match[2].split(/[,;]/).forEach(chunk => {
                    let w = chunk.replace(/\s*\([^)]*\)/g, '').replace(/\s*\[[^\]]*\]/g, '').trim();
                    w = w.replace(/\s+[mfnc]$/, '').trim();
                    if (w && w.length > 0 && w.length < 60 && !/^[\s\-]+$/.test(w)) {
                        words.push(w);
                    }
                });

                if (words.length > 0) {
                    if (!translations.has(langName)) translations.set(langName, []);
                    words.forEach(w => {
                        if (!translations.get(langName).includes(w)) {
                            translations.get(langName).push(w);
                        }
                    });
                }
            });
        }

        if (translations.size === 0) {
            transPanel.innerHTML = `
                <div class="trans-header">
                    <svg viewBox="0 0 24 24"><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52
                    17.52 0 0014.07 6H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9
                    11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98
                    4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21
                    22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
                    Translations
                </div>
                <p class="trans-none">No translations found for this entry.</p>`;
            return;
        }

        /* Render nested by language group */
        const totalWords = [...translations.values()].reduce((s, a) => s + a.length, 0);

        let groupsHtml = '';
        for (const [langName, words] of translations) {
            const emoji = LANG_EMOJI_MAP[langName.toLowerCase()] || '🌐';
            const isAr = langName.toLowerCase() === 'arabic';

            groupsHtml += `
                <div class="trans-group">
                    <div class="trans-group-label">
                        <span class="tg-emoji">${emoji}</span> ${esc(langName)}
                    </div>
                    <div class="trans-words">
                        ${words.map(w => {
                            const arClass = (isAr || isArabicText(w)) ? ' arabic-text' : '';
                            // Strip harakaat for search but display original
                            const searchW = stripHarakaat(w);
                            return `<button class="trans-word-chip${arClass}"
                                            onclick="doSearch('${esc(searchW).replace(/'/g, "\\'")}')"
                                    >${esc(w)}</button>`;
                        }).join('')}
                    </div>
                </div>`;
        }

        transPanel.innerHTML = `
            <div class="trans-header">
                <svg viewBox="0 0 24 24"><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52
                17.52 0 0014.07 6H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9
                11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98
                4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21
                22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
                Translations
                <span class="trans-count">(${translations.size} languages, ${totalWords} translations)</span>
            </div>
            ${groupsHtml}`;

    } catch {
        transPanel.innerHTML = `
            <div class="trans-header">
                <svg viewBox="0 0 24 24"><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52
                17.52 0 0014.07 6H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9
                11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98
                4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21
                22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
                Translations
            </div>
            <p class="trans-none">Could not load translations.</p>`;
    }
}

/* ═══════════════════════════════════════════════════════════
   TTS — Web Speech API
   ═══════════════════════════════════════════════════════════ */

function speak(word, ttsCode) {
    if (!window.speechSynthesis) return;
    const btn = $('spkBtn');
    speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(word);
    u.lang = ttsCode || 'en-US';
    u.rate = 0.88;

    const voices = speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === ttsCode)
               || voices.find(v => v.lang.startsWith(ttsCode?.split('-')[0]))
               || null;
    if (voice) u.voice = voice;

    btn.classList.add('playing');
    u.onend  = () => btn.classList.remove('playing');
    u.onerror = () => btn.classList.remove('playing');
    speechSynthesis.speak(u);
}

/* Preload voices */
if (window.speechSynthesis) {
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
}

/* ═══════════════════════════════════════════════════════════
   UI HELPERS
   ═══════════════════════════════════════════════════════════ */

function hideAll() {
    welc.style.display = 'none';
    errC.classList.remove('on');
    wc.classList.remove('on');
    ldr.classList.remove('on');
    transPanel.style.display = 'none';
}

function showError(err) {
    errT.textContent = (err?.status === 404 || err?.empty)
        ? 'Word not found' : 'Something went wrong';
    errP.textContent = (err?.status === 404 || err?.empty)
        ? "We couldn't find that word on Wiktionary. Check the spelling and try again."
        : 'Network error — please check your connection.';
    errC.classList.add('on');
}

function syncX() {
    pill.classList.toggle('has-val', inp.value.length > 0);
}

function esc(s) {
    const d = document.createElement('div');
    d.textContent = String(s ?? '');
    return d.innerHTML;
}

function strip(html) {
    const d = document.createElement('div');
    d.innerHTML = html || '';
    return d.textContent || '';
}

function sanitize(html) {
    const d = document.createElement('div');
    d.innerHTML = html || '';
    d.querySelectorAll('script,style,iframe,object,embed').forEach(el => el.remove());
    d.querySelectorAll('a').forEach(a => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('/wiki/')) {
            a.setAttribute('href', '#');
            a.setAttribute('data-word', a.textContent.trim());
            a.classList.add('wikt-link');
        } else if (href && !href.startsWith('http')) {
            a.removeAttribute('href');
        }
    });
    return d.innerHTML;
}

/* ═══════════════════════════════════════════════════════════
   STRIPS — History & Bookmarks
   ═══════════════════════════════════════════════════════════ */

function renderHistoryStrip() {
    const h = lsGet(LS_H);
    if (!h.length) { histStrip.innerHTML = ''; return; }
    histStrip.innerHTML =
        `<span class="strip-l">Recent</span>` +
        h.map(w => `<button class="chip chip-h" data-w="${esc(w)}">${esc(w)}</button>`).join('') +
        `<button class="chip chip-x" id="clrH">Clear</button>`;

    histStrip.querySelectorAll('.chip-h').forEach(b =>
        b.addEventListener('click', () => doSearch(b.dataset.w))
    );
    $('clrH').addEventListener('click', () => {
        lsSet(LS_H, []);
        renderHistoryStrip();
    });
}

function renderBookmarkStrip() {
    const bk = lsGet(LS_B);
    if (!bk.length) { bkStrip.innerHTML = ''; return; }
    bkStrip.innerHTML =
        `<span class="strip-l">⭐ Saved</span>` +
        bk.map(w => `<button class="chip chip-b" data-w="${esc(w)}">${esc(w)}</button>`).join('');

    bkStrip.querySelectorAll('.chip-b').forEach(b =>
        b.addEventListener('click', () => doSearch(b.dataset.w))
    );
}

/* ═══════════════════════════════════════════════════════════
   EVENT WIRING
   ═══════════════════════════════════════════════════════════ */

goBtn.onclick = () => doSearch();

inp.addEventListener('keydown', e => {
    const items = sugBox.querySelectorAll('.sug-item');

    if (e.key === 'Enter') {
        if (sugIdx >= 0 && items[sugIdx]) {
            doSearch(items[sugIdx].dataset.w);
        } else {
            doSearch();
        }
        closeSug();
        return;
    }

    if (e.key === 'Escape') { closeSug(); return; }

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        sugIdx = Math.min(sugIdx + 1, items.length - 1);
        items.forEach((it, i) => it.classList.toggle('hi', i === sugIdx));
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        sugIdx = Math.max(sugIdx - 1, -1);
        items.forEach((it, i) => it.classList.toggle('hi', i === sugIdx));
    }
});

inp.addEventListener('input', () => {
    syncX();
    const q = inp.value.trim();
    clearTimeout(sugTimer);
    if (q.length < 2) { closeSug(); return; }
    sugTimer = setTimeout(() => fetchSuggestions(q), 250);
});

inp.addEventListener('blur',  () => setTimeout(closeSug, 200));
inp.addEventListener('focus', () => {
    if (inp.value.trim().length >= 2) fetchSuggestions(inp.value.trim());
});

xBtn.onclick = () => {
    inp.value = '';
    syncX();
    closeSug();
    inp.focus();
};

document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrap')) closeSug();
});

/* Wiktionary cross-reference links */
document.addEventListener('click', e => {
    const link = e.target.closest('.wikt-link');
    if (link) {
        e.preventDefault();
        const w = link.dataset.word;
        if (w) doSearch(w);
    }
});

/* ═══════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════ */

renderHistoryStrip();
renderBookmarkStrip();
