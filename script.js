'use strict';

/* ═══════════════════════════════════════════════════════════
   CONFIG
   ═══════════════════════════════════════════════════════════ */

const WIKT_DEF  = w => `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(w)}`;
const WIKT_SUG  = q => `https://en.wiktionary.org/w/api.php?action=opensearch&search=${encodeURIComponent(q)}&limit=10&format=json&origin=*`;
const WIKT_HTML = w => `https://en.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(w)}&prop=text&format=json&origin=*`;

const LANGS = [
    { code: 'auto', label: 'Auto-detect', flag: '🔍', section: null,       tts: null     },
    { code: 'en',   label: 'English',      flag: '🇬🇧', section: 'English',  tts: 'en-US'  },
    { code: 'ar',   label: 'العربية',      flag: '🇸🇦', section: 'Arabic',   tts: 'ar-SA'  },
    { code: 'ru',   label: 'Русский',      flag: '🇷🇺', section: 'Russian',  tts: 'ru-RU'  },
    { code: 'es',   label: 'Español',      flag: '🇪🇸', section: 'Spanish',  tts: 'es-ES'  },
    { code: 'fr',   label: 'Français',     flag: '🇫🇷', section: 'French',   tts: 'fr-FR'  },
    { code: 'de',   label: 'Deutsch',      flag: '🇩🇪', section: 'German',   tts: 'de-DE'  },
    { code: 'it',   label: 'Italiano',     flag: '🇮🇹', section: 'Italian',  tts: 'it-IT'  },
    { code: 'pt',   label: 'Português',    flag: '🇵🇹', section: 'Portuguese', tts: 'pt-BR' },
    { code: 'nl',   label: 'Nederlands',   flag: '🇳🇱', section: 'Dutch',    tts: 'nl-NL'  },
    { code: 'pl',   label: 'Polski',       flag: '🇵🇱', section: 'Polish',   tts: 'pl-PL'  },
    { code: 'sv',   label: 'Svenska',      flag: '🇸🇪', section: 'Swedish',  tts: 'sv-SE'  },
    { code: 'ja',   label: '日本語',        flag: '🇯🇵', section: 'Japanese', tts: 'ja-JP'  },
    { code: 'zh',   label: '中文',          flag: '🇨🇳', section: 'Chinese',  tts: 'zh-CN'  },
    { code: 'ko',   label: '한국어',        flag: '🇰🇷', section: 'Korean',   tts: 'ko-KR'  },
    { code: 'hi',   label: 'हिन्दी',        flag: '🇮🇳', section: 'Hindi',    tts: 'hi-IN'  },
    { code: 'tr',   label: 'Türkçe',       flag: '🇹🇷', section: 'Turkish',  tts: 'tr-TR'  },
    { code: 'vi',   label: 'Tiếng Việt',   flag: '🇻🇳', section: 'Vietnamese', tts: 'vi-VN' },
    { code: 'uk',   label: 'Українська',   flag: '🇺🇦', section: 'Ukrainian', tts: 'uk-UA'  },
    { code: 'la',   label: 'Latina',       flag: '🏛️',  section: 'Latin',    tts: 'la'     },
    { code: 'el',   label: 'Ελληνικά',     flag: '🇬🇷', section: 'Greek',    tts: 'el-GR'  },
    { code: 'fi',   label: 'Suomi',        flag: '🇫🇮', section: 'Finnish',  tts: 'fi-FI'  },
    { code: 'cs',   label: 'Čeština',      flag: '🇨🇿', section: 'Czech',    tts: 'cs-CZ'  },
    { code: 'da',   label: 'Dansk',        flag: '🇩🇰', section: 'Danish',   tts: 'da-DK'  },
    { code: 'no',   label: 'Norsk',        flag: '🇳🇴', section: 'Norwegian', tts: 'nb-NO' },
];

const SECTION_TO_FLAG = {};
const SECTION_TO_CODE = {};
LANGS.forEach(l => {
    if (l.section) {
        SECTION_TO_FLAG[l.section.toLowerCase()] = l.flag;
        SECTION_TO_CODE[l.section.toLowerCase()] = l.code;
    }
});

const LANG_CODE_TO_FLAG = {};
const LANG_CODE_TO_NAME = {};
LANGS.forEach(l => {
    if (l.code !== 'auto') {
        LANG_CODE_TO_FLAG[l.code] = l.flag;
        LANG_CODE_TO_NAME[l.code] = l.label;
    }
});

// Extended mappings for translations
const EXTRA_FLAGS = {
    af:'🇿🇦', sq:'🇦🇱', hy:'🇦🇲', az:'🇦🇿', eu:'🇪🇸', be:'🇧🇾', bn:'🇧🇩',
    bs:'🇧🇦', bg:'🇧🇬', ca:'🇪🇸', hr:'🇭🇷', et:'🇪🇪', ka:'🇬🇪', gl:'🇪🇸',
    gu:'🇮🇳', he:'🇮🇱', hu:'🇭🇺', is:'🇮🇸', id:'🇮🇩', ga:'🇮🇪', kn:'🇮🇳',
    kk:'🇰🇿', km:'🇰🇭', ky:'🇰🇬', lo:'🇱🇦', lv:'🇱🇻', lt:'🇱🇹', mk:'🇲🇰',
    ms:'🇲🇾', ml:'🇮🇳', mt:'🇲🇹', mn:'🇲🇳', my:'🇲🇲', ne:'🇳🇵', fa:'🇮🇷',
    pa:'🇮🇳', ro:'🇷🇴', sr:'🇷🇸', si:'🇱🇰', sk:'🇸🇰', sl:'🇸🇮', sw:'🇰🇪',
    tl:'🇵🇭', ta:'🇮🇳', te:'🇮🇳', th:'🇹🇭', ur:'🇵🇰', uz:'🇺🇿', cy:'🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    mr:'🇮🇳', or:'🇮🇳', am:'🇪🇹', eo:'🟢', ku:'🇮🇶', ps:'🇦🇫', sd:'🇵🇰',
    tk:'🇹🇲', tt:'🇷🇺', ug:'🇨🇳', yi:'🇮🇱', nb:'🇳🇴', nn:'🇳🇴', gd:'🏴󠁧󠁢󠁳󠁣󠁴󠁿'
};

const EXTRA_NAMES = {
    af:'Afrikaans', sq:'Albanian', hy:'Armenian', az:'Azerbaijani', eu:'Basque',
    be:'Belarusian', bn:'Bengali', bs:'Bosnian', bg:'Bulgarian', ca:'Catalan',
    hr:'Croatian', et:'Estonian', ka:'Georgian', gl:'Galician', gu:'Gujarati',
    he:'Hebrew', hu:'Hungarian', is:'Icelandic', id:'Indonesian', ga:'Irish',
    kn:'Kannada', kk:'Kazakh', km:'Khmer', ky:'Kyrgyz', lo:'Lao', lv:'Latvian',
    lt:'Lithuanian', mk:'Macedonian', ms:'Malay', ml:'Malayalam', mt:'Maltese',
    mn:'Mongolian', my:'Burmese', ne:'Nepali', fa:'Persian', pa:'Punjabi',
    ro:'Romanian', sr:'Serbian', si:'Sinhala', sk:'Slovak', sl:'Slovenian',
    sw:'Swahili', tl:'Filipino', ta:'Tamil', te:'Telugu', th:'Thai', ur:'Urdu',
    uz:'Uzbek', cy:'Welsh', mr:'Marathi', or:'Odia', am:'Amharic', eo:'Esperanto',
    ku:'Kurdish', ps:'Pashto', sd:'Sindhi', tk:'Turkmen', tt:'Tatar', ug:'Uyghur',
    yi:'Yiddish', nb:'Norwegian Bokmål', nn:'Norwegian Nynorsk', gd:'Scottish Gaelic'
};

function getFlag(code) {
    const base = code.split('-')[0].toLowerCase();
    return LANG_CODE_TO_FLAG[base] || EXTRA_FLAGS[base] || '🌐';
}

function getLangName(code) {
    const base = code.split('-')[0].toLowerCase();
    return LANG_CODE_TO_NAME[base] || EXTRA_NAMES[base] || code;
}

/* Arabic harakat regex — strips diacritical marks */
const ARABIC_HARAKAT = /[\u0610-\u065F\u0670\u06D6-\u06ED\u064B-\u065F\u0617-\u061A\u0600-\u0605\u0610-\u061A\uFE70-\uFE7F]/g;

function stripHarakat(text) {
    return text.replace(ARABIC_HARAKAT, '');
}

function isArabic(text) {
    return /[\u0600-\u06FF]/.test(text);
}

const MAXH = 12, MAXB = 30;
const LH = 'lk_h6', LB = 'lk_b6';

/* ═══ DOM ═══ */
const $ = id => document.getElementById(id);
const inp    = $('inp'),     pill    = $('pill'),      xBtn   = $('xBtn'),    goBtn = $('goBtn');
const langBtn = $('langBtn'), langDd = $('langDd'),   langFlag = $('langFlag'), langLbl = $('langLbl');
const sugBox  = $('sugBox'),  histS  = $('histS'),    bkS    = $('bkS');
const welc    = $('welc'),    ldr    = $('ldr'),      errC   = $('errC'),    errT = $('errT'), errP = $('errP');
const wc      = $('wc'),      whEl   = $('whEl'),     langTabs = $('langTabs');
const mcWrap  = $('mcWrap'),  transPanel = $('transPanel');

/* ═══ STATE ═══ */
let selLang = LANGS[0];
let curWord = '';
let curLangSections = {};
let curActiveLang = null;
let sugTimer = null;
let sugIdx = -1;

/* ═══ STORAGE ═══ */
const lsG = k => { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch { return []; } };
const lsS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

function addH(w) {
    let a = lsG(LH).filter(x => x !== w);
    a.unshift(w);
    lsS(LH, a.slice(0, MAXH));
}

function togB(w) {
    let a = lsG(LB);
    a.includes(w) ? a = a.filter(x => x !== w) : a.unshift(w);
    lsS(LB, a.slice(0, MAXB));
}

const isB = w => lsG(LB).includes(w);

/* ═══ HISTORY API ═══ */
function pushState(word) {
    if (word) history.pushState({ word }, '', `#${encodeURIComponent(word)}`);
}

window.addEventListener('popstate', e => {
    if (e.state && e.state.word) {
        inp.value = e.state.word;
        syncX();
        fetchDef(e.state.word, true);
    } else {
        hideAll();
        welc.style.display = '';
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

/* ═══ LOGO HOME ═══ */
$('logoLink').addEventListener('click', e => {
    e.preventDefault();
    inp.value = '';
    syncX();
    closeSug();
    hideAll();
    welc.style.display = '';
    history.pushState(null, '', location.pathname);
    inp.focus();
});

/* ═══ LANGUAGE DROPDOWN ═══ */
function buildLang() {
    langDd.innerHTML = LANGS.map(l =>
        `<button class="lang-opt${l.code === selLang.code ? ' on' : ''}" data-c="${l.code}">
            <span>${l.flag}</span>
            <span>${l.label}</span>
            ${l.code === 'auto' ? '<span class="opt-desc">recommended</span>' : ''}
        </button>`
    ).join('');
}

buildLang();

langBtn.onclick = e => { e.stopPropagation(); langDd.classList.toggle('open'); };

langDd.onclick = e => {
    const o = e.target.closest('.lang-opt');
    if (!o) return;
    selLang = LANGS.find(l => l.code === o.dataset.c) || LANGS[0];
    langFlag.textContent = selLang.flag;
    langLbl.textContent = selLang.label;
    langDd.classList.remove('open');
    buildLang();
    inp.placeholder = selLang.code === 'auto' ? 'Search any word…' : `Search in ${selLang.label}…`;
};

document.addEventListener('click', () => langDd.classList.remove('open'));

/* ═══ SUGGESTIONS ═══ */
async function fetchSug(q) {
    try {
        const r = await fetch(WIKT_SUG(q));
        const d = await r.json();
        let words = (d[1] || []).filter(w => {
            if (!w || w.length > 50) return false;
            if (w.includes(':') || w.includes('/')) return false;
            if (/^[`'\-*#\s\u0300-\u036f]+$/.test(w)) return false;
            if (/^[`\-*#]/.test(w)) return false;
            // Filter reconstruction pages
            if (w.toLowerCase().startsWith('reconstruction')) return false;
            // Filter appendix pages
            if (w.toLowerCase().startsWith('appendix')) return false;
            return true;
        });

        if (!words.length) { closeSug(); return; }

        sugIdx = -1;
        sugBox.innerHTML = words.slice(0, 8).map(w => {
            const lang = detectScriptLang(w);
            const flag = lang ? (SECTION_TO_FLAG[lang.toLowerCase()] || '🌐') : '';
            return `<button class="sug-item" data-w="${esc(w)}">
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <span class="sug-word">${esc(w)}</span>
                ${lang ? `<span class="sug-lang">${flag} ${esc(lang)}</span>` : ''}
            </button>`;
        }).join('');

        sugBox.classList.add('open');
        sugBox.querySelectorAll('.sug-item').forEach(b =>
            b.addEventListener('click', () => { doSearch(b.dataset.w); closeSug(); })
        );
    } catch { closeSug(); }
}

function detectScriptLang(word) {
    if (!word) return '';
    for (const ch of word) {
        const c = ch.codePointAt(0);
        if (c >= 0x0600 && c <= 0x06FF) return 'Arabic';
        if (c >= 0x0400 && c <= 0x04FF) return 'Russian';
        if (c >= 0x4E00 && c <= 0x9FFF) return 'Chinese';
        if (c >= 0x3040 && c <= 0x309F) return 'Japanese';
        if (c >= 0x30A0 && c <= 0x30FF) return 'Japanese';
        if (c >= 0xAC00 && c <= 0xD7AF) return 'Korean';
        if (c >= 0x0900 && c <= 0x097F) return 'Hindi';
        if (c >= 0x0E00 && c <= 0x0E7F) return 'Thai';
        if (c >= 0x0370 && c <= 0x03FF) return 'Greek';
        if (c >= 0x0530 && c <= 0x058F) return 'Armenian';
        if (c >= 0x10A0 && c <= 0x10FF) return 'Georgian';
        if (c >= 0x0980 && c <= 0x09FF) return 'Bengali';
    }
    return '';
}

function closeSug() {
    sugBox.classList.remove('open');
    sugBox.innerHTML = '';
    sugIdx = -1;
}

/* ═══ SEARCH ═══ */
function doSearch(w) {
    let q = (w || inp.value).trim();
    if (!q) return;
    // Strip Arabic harakat before searching
    q = stripHarakat(q);
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
        addH(word);
        renderHist();

        let activeLang = null;
        if (selLang.code !== 'auto' && selLang.section && byLang[selLang.section]) {
            activeLang = selLang.section;
        } else {
            activeLang = Object.keys(byLang)[0];
        }

        renderAll(word, byLang, activeLang);
        if (!skipPush) pushState(word);

    } catch (err) {
        showErr(err);
    } finally {
        ldr.classList.remove('on');
    }
}

/* ═══ RENDER ═══ */
function renderAll(word, byLang, activeLang) {
    curActiveLang = activeLang;
    renderHeader(word, activeLang, byLang);
    renderLangTabs(byLang, activeLang);
    renderMeanings(byLang[activeLang] || []);
    fetchTranslations(word);
    wc.classList.add('on');
}

function renderHeader(word, activeLang, byLang) {
    const bk = isB(word);
    const langDef = LANGS.find(l => l.section === activeLang);
    const ttsCode = langDef?.tts || 'en-US';
    const flag = langDef?.flag || SECTION_TO_FLAG[activeLang.toLowerCase()] || '🌐';
    const wordIsArabic = isArabic(word);

    whEl.innerHTML = `
        <div class="wh-top">
            <div class="wh-left">
                <div class="wh-word${wordIsArabic ? ' arabic-text' : ''}">${esc(word)}</div>
                <div class="wh-det-lang">
                    ${flag} ${esc(activeLang)}
                    ${Object.keys(byLang).length > 1
                        ? `<span style="color:var(--t3);font-weight:400">(+${Object.keys(byLang).length - 1} more)</span>`
                        : ''}
                </div>
                <div class="wh-meta">
                    ${Object.keys(byLang).map(lang => {
                        const f = SECTION_TO_FLAG[lang.toLowerCase()] || '🌐';
                        return `<span class="badge badge-lang" data-lang="${esc(lang)}">${f} ${esc(lang)}</span>`;
                    }).join('')}
                </div>
            </div>
            <div class="wh-actions">
                <button class="ib" id="spkBtn" title="Listen (${ttsCode})">
                    <svg viewBox="0 0 24 24" class="fi">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 12 7.5v9a4.5
                        4.5 0 0 0 4.5-4.5zM14 3.23v2.06a6.5 6.5 0 0 1 0 13.42v2.06A8.5
                        8.5 0 0 0 14 3.23z"/>
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
        togB(word);
        $('bkBtn').classList.toggle('bk-on', isB(word));
        renderBk();
    };

    whEl.querySelectorAll('.badge-lang').forEach(b =>
        b.addEventListener('click', () => {
            const lang = b.dataset.lang;
            if (lang && curLangSections[lang]) renderAll(curWord, curLangSections, lang);
        })
    );
}

function renderLangTabs(byLang, activeLang) {
    const langs = Object.keys(byLang);
    if (langs.length <= 1) { langTabs.innerHTML = ''; return; }
    langTabs.innerHTML = langs.map(lang => {
        const ct = byLang[lang].length;
        const f = SECTION_TO_FLAG[lang.toLowerCase()] || '🌐';
        return `<button class="lang-tab${lang === activeLang ? ' on' : ''}"
                data-lang="${esc(lang)}">${f} ${esc(lang)}
                <span class="tab-ct">(${ct})</span></button>`;
    }).join('');

    langTabs.querySelectorAll('.lang-tab').forEach(t =>
        t.addEventListener('click', () => {
            const lang = t.dataset.lang;
            if (lang && curLangSections[lang]) renderAll(curWord, curLangSections, lang);
        })
    );
}

function renderMeanings(sections) {
    mcWrap.innerHTML = '';
    sections.forEach(section => {
        if (!section.definitions?.length) return;
        const card = document.createElement('div');
        card.className = 'mc';
        let html = `<span class="pos">${esc(section.partOfSpeech || 'Word')}</span>`;
        const syns = new Set(), ants = new Set();
        html += '<ol class="def-tree">';
        section.definitions.forEach((d, i) => {
            html += renderDefNode(d, i + 1, syns, ants);
        });
        html += '</ol>';

        if (syns.size) {
            html += `<div class="ts"><div class="ts-l syn">Synonyms</div><div class="tg">
                ${[...syns].map(w => `<button class="t syn" data-w="${esc(w)}">${esc(w)}</button>`).join('')}
            </div></div>`;
        }
        if (ants.size) {
            html += `<div class="ts"><div class="ts-l ant">Antonyms</div><div class="tg">
                ${[...ants].map(w => `<button class="t ant" data-w="${esc(w)}">${esc(w)}</button>`).join('')}
            </div></div>`;
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

    const synM = plainText.match(/^[Ss]ynonym(?:s)?\s+of\s+(.+?)[\.\;]?$/);
    const antM = plainText.match(/^[Aa]ntonym(?:s)?\s+of\s+(.+?)[\.\;]?$/);
    if (synM) synM[1].split(/[,\/]/).map(s => s.trim()).filter(Boolean).forEach(s => syns.add(s));
    if (antM) antM[1].split(/[,\/]/).map(s => s.trim()).filter(Boolean).forEach(s => ants.add(s));

    let html = `<li class="def-node">
        <div class="def-head">
            <span class="def-bullet">${num}</span>
            <div class="def-body">
                <div class="def-text">${defHtml}</div>`;

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

/* ═══ TRANSLATIONS — deep Wiktionary HTML parse ═══ */
async function fetchTranslations(word) {
    transPanel.style.display = 'block';
    transPanel.innerHTML = `
        <div class="trans-title">
            <svg viewBox="0 0 24 24"><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52
            0 0014.07 6H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07
            10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5
            3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62
            7l1.62-4.33L19.12 17h-3.24z"/></svg>
            Translations
        </div>
        <div class="trans-loader">Loading translations from Wiktionary…</div>`;

    try {
        const r = await fetch(WIKT_HTML(word));
        if (!r.ok) throw new Error('fetch failed');
        const d = await r.json();
        const html = d?.parse?.text?.['*'] || '';
        if (!html) throw new Error('no html');

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const translations = parseTranslations(doc);

        if (!translations.length) {
            transPanel.innerHTML = makeTransTitle() +
                '<p class="trans-none">No translations found for this entry.</p>';
            return;
        }

        // Group by language
        const byLang = new Map();
        translations.forEach(t => {
            const key = t.langCode || t.langName || 'unknown';
            if (!byLang.has(key)) byLang.set(key, { name: t.langName, code: t.langCode, items: [] });
            byLang.get(key).items.push(t);
        });

        const totalLangs = byLang.size;
        const INITIAL_SHOW = 10;
        const groups = [...byLang.values()];
        const showAll = groups.length <= INITIAL_SHOW;

        let groupsHtml = '';
        groups.forEach((group, idx) => {
            const flag = group.code ? getFlag(group.code) : '🌐';
            const hidden = !showAll && idx >= INITIAL_SHOW ? ' style="display:none"' : '';

            groupsHtml += `<div class="trans-group" data-tg="${idx}"${hidden}>
                <div class="trans-group-header">
                    <span class="trans-group-flag">${flag}</span>
                    ${esc(group.name || getLangName(group.code))}
                    <span class="trans-group-count">${group.items.length} translation${group.items.length > 1 ? 's' : ''}</span>
                </div>
                <div class="trans-items">
                    ${group.items.map(t => {
                        // Clean translation text — strip harakat for search but show original
                        const searchText = stripHarakat(t.word).trim();
                        return `<button class="trans-chip" data-w="${esc(searchText)}">
                            <span class="tc-text${isArabic(t.word) ? ' arabic-text' : ''}">${esc(t.word)}</span>
                            ${t.note ? `<span class="tc-note">${esc(t.note)}</span>` : ''}
                        </button>`;
                    }).join('')}
                </div>
            </div>`;
        });

        const toggleHtml = !showAll
            ? `<button class="trans-toggle" id="transToggle">Show all ${totalLangs} languages ▼</button>`
            : '';

        transPanel.innerHTML = makeTransTitle(totalLangs) + groupsHtml + toggleHtml;

        // Wire chip clicks
        transPanel.querySelectorAll('.trans-chip').forEach(c =>
            c.addEventListener('click', () => doSearch(c.dataset.w))
        );

        // Wire toggle
        if (!showAll) {
            $('transToggle').addEventListener('click', function () {
                const hidden = transPanel.querySelectorAll('.trans-group[style*="display:none"]');
                if (hidden.length) {
                    hidden.forEach(g => g.style.display = '');
                    this.textContent = 'Show fewer ▲';
                } else {
                    groups.forEach((_, idx) => {
                        if (idx >= INITIAL_SHOW) {
                            const g = transPanel.querySelector(`[data-tg="${idx}"]`);
                            if (g) g.style.display = 'none';
                        }
                    });
                    this.textContent = `Show all ${totalLangs} languages ▼`;
                }
            });
        }

    } catch {
        transPanel.innerHTML = makeTransTitle() +
            '<p class="trans-none">Could not load translations.</p>';
    }
}

function makeTransTitle(count) {
    return `<div class="trans-title">
        <svg viewBox="0 0 24 24"><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52
        0 0014.07 6H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07
        10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5
        3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62
        7l1.62-4.33L19.12 17h-3.24z"/></svg>
        Translations
        ${count ? `<span class="trans-count">(${count} languages)</span>` : ''}
    </div>`;
}

function parseTranslations(doc) {
    const results = [];
    const seen = new Set();

    // Strategy 1: Find translation tables (NavFrame/NavContent)
    // Wiktionary uses: <table class="translations"> with <td> containing <ul><li>
    // Each <li> looks like: "Language: <span lang="xx">word</span> (note)"

    const transContainers = doc.querySelectorAll(
        '.translations, [id*="Translations"], .NavFrame'
    );

    transContainers.forEach(container => {
        container.querySelectorAll('li').forEach(li => {
            // Skip nested lists that are just notes
            if (li.closest('li') !== li && li.closest('.translations li')) return;

            const langSpans = li.querySelectorAll('span[lang], a[lang]');
            if (!langSpans.length) return;

            // Extract language name from the beginning of the li text
            const fullText = li.textContent || '';
            const colonIdx = fullText.indexOf(':');
            const langName = colonIdx > 0 ? fullText.substring(0, colonIdx).trim() : '';

            langSpans.forEach(span => {
                const langCode = span.getAttribute('lang') || '';
                if (!langCode || langCode === 'und') return;

                let word = span.textContent.trim();
                if (!word || word.length > 80) return;

                // Clean up
                word = word.replace(/^\(|\)$/g, '').trim();
                if (!word) return;

                // Get qualifier/note if any
                let note = '';
                const qualifier = span.closest('li')?.querySelector('.ib-content .qualifier-content, .gender, i.Latn');
                if (qualifier) note = qualifier.textContent.trim();

                const key = `${langCode}:${word}`;
                if (seen.has(key)) return;
                seen.add(key);

                results.push({
                    langCode: langCode.split('-')[0],
                    langName: langName || getLangName(langCode),
                    word,
                    note
                });
            });
        });
    });

    // Strategy 2: If Strategy 1 found nothing, try broader search
    if (results.length === 0) {
        doc.querySelectorAll('span[lang], a[lang]').forEach(el => {
            const langCode = el.getAttribute('lang');
            if (!langCode || langCode === 'en' || langCode === 'und') return;

            // Check if this is inside a translations section
            const section = el.closest('div, table, ul');
            if (!section) return;

            const sectionText = section.id || section.className || '';
            const parentHeading = findPrecedingHeading(el);
            const isTransSection =
                sectionText.toLowerCase().includes('translat') ||
                (parentHeading && parentHeading.toLowerCase().includes('translat'));

            if (!isTransSection) return;

            let word = el.textContent.trim();
            if (!word || word.length > 80 || /^\d+$/.test(word)) return;
            word = word.replace(/^\(|\)$/g, '').trim();
            if (!word) return;

            const key = `${langCode}:${word}`;
            if (seen.has(key)) return;
            seen.add(key);

            results.push({
                langCode: langCode.split('-')[0],
                langName: getLangName(langCode),
                word,
                note: ''
            });
        });
    }

    return results;
}

function findPrecedingHeading(el) {
    let node = el;
    for (let i = 0; i < 20; i++) {
        node = node.previousElementSibling || node.parentElement;
        if (!node) break;
        if (/^H[2-5]$/i.test(node.tagName)) return node.textContent;
        const h = node.querySelector?.('h2, h3, h4, h5');
        if (h) return h.textContent;
    }
    return '';
}

/* ═══ TTS ═══ */
function speak(word, ttsCode) {
    if (!window.speechSynthesis) return;
    const btn = $('spkBtn');
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = ttsCode || 'en-US';
    u.rate = 0.88;

    const voices = speechSynthesis.getVoices();
    const voice =
        voices.find(v => v.lang === ttsCode) ||
        voices.find(v => v.lang.startsWith(ttsCode?.split('-')[0])) ||
        null;
    if (voice) u.voice = voice;

    btn.classList.add('playing');
    u.onend = () => btn.classList.remove('playing');
    u.onerror = () => btn.classList.remove('playing');
    speechSynthesis.speak(u);
}

if (window.speechSynthesis) {
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
}

/* ═══ HELPERS ═══ */
function hideAll() {
    welc.style.display = 'none';
    errC.classList.remove('on');
    wc.classList.remove('on');
    ldr.classList.remove('on');
    transPanel.style.display = 'none';
}

function showErr(err) {
    errT.textContent = err?.status === 404 || err?.empty ? 'Word not found' : 'Something went wrong';
    errP.textContent = err?.status === 404 || err?.empty
        ? 'We couldn\'t find that word on Wiktionary. Try checking the spelling.'
        : 'Network error — please check your connection.';
    errC.classList.add('on');
}

function syncX() { pill.classList.toggle('has-val', inp.value.length > 0); }

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

/* ═══ STRIPS ═══ */
function renderHist() {
    const h = lsG(LH);
    if (!h.length) { histS.innerHTML = ''; return; }
    histS.innerHTML =
        `<span class="strip-l">Recent</span>` +
        h.map(w => `<button class="chip chip-h" data-w="${esc(w)}">${esc(w)}</button>`).join('') +
        `<button class="chip chip-x" id="clrH">Clear</button>`;
    histS.querySelectorAll('.chip-h').forEach(b =>
        b.addEventListener('click', () => doSearch(b.dataset.w))
    );
    $('clrH').addEventListener('click', () => { lsS(LH, []); renderHist(); });
}

function renderBk() {
    const bk = lsG(LB);
    if (!bk.length) { bkS.innerHTML = ''; return; }
    bkS.innerHTML =
        `<span class="strip-l">⭐ Saved</span>` +
        bk.map(w => `<button class="chip chip-b" data-w="${esc(w)}">${esc(w)}</button>`).join('');
    bkS.querySelectorAll('.chip-b').forEach(b =>
        b.addEventListener('click', () => doSearch(b.dataset.w))
    );
}

/* ═══ EVENTS ═══ */
goBtn.onclick = () => doSearch();

inp.addEventListener('keydown', e => {
    const items = sugBox.querySelectorAll('.sug-item');
    if (e.key === 'Enter') {
        if (sugIdx >= 0 && items[sugIdx]) doSearch(items[sugIdx].dataset.w);
        else doSearch();
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
    sugTimer = setTimeout(() => fetchSug(q), 250);
});

inp.addEventListener('blur', () => setTimeout(closeSug, 200));
inp.addEventListener('focus', () => {
    if (inp.value.trim().length >= 2) fetchSug(inp.value.trim());
});

xBtn.onclick = () => { inp.value = ''; syncX(); closeSug(); inp.focus(); };
document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrap')) closeSug();
});

// Wiktionary links inside definitions
document.addEventListener('click', e => {
    const link = e.target.closest('.wikt-link');
    if (link) { e.preventDefault(); const w = link.dataset.word; if (w) doSearch(w); }
});

/* ═══ INIT ═══ */
renderHist();
renderBk();
