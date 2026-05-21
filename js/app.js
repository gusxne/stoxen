// HOME E ROTINA
const _fmt2 = n => String(n).padStart(2, '0');
const _fmt4 = n => String(n).padStart(4, '0');

function _formatarDataHoje() { const d = new Date(); return [_fmt2(d.getDate()), _fmt2(d.getMonth() + 1), _fmt4(d.getFullYear())].join('/'); }
function _formatarHorario() { const a = new Date(); return [_fmt2(a.getHours()), _fmt2(a.getMinutes()), _fmt2(a.getSeconds())].join(':'); }

function _setEl(id, fn) { const el = document.getElementById(id); if (el) el.textContent = fn(); }
function atualizarData() { _setEl('data', _formatarDataHoje); }
function atualizarRelogio() { _setEl('relogio', _formatarHorario); }
function atualizarData2() { _setEl('data2', _formatarDataHoje); }
function atualizarRelogio2() { _setEl('relogio2', _formatarHorario); }

atualizarData(); atualizarRelogio(); setInterval(atualizarRelogio, 1000);
atualizarData2(); atualizarRelogio2(); setInterval(atualizarRelogio2, 1000);

// ROTINA
let savedRange;

function formatDoc(cmd, val = null, btn = null) {

    if (cmd === 'formatBlock') {

        const currentBlock = document.queryCommandValue('formatBlock').replace(/[<>]/g, '').toLowerCase();
        const newValue = (currentBlock === val.toLowerCase()) ? 'p' : val;

        document.execCommand(cmd, false, newValue);
        document.querySelectorAll('[data-block]').forEach(b => {b.classList.remove('active');});

        const updatedBlock =document.queryCommandValue('formatBlock').replace(/[<>]/g, '').toLowerCase();

        document.querySelectorAll('[data-block]').forEach(b => {

            if (b.dataset.block === updatedBlock) {
                b.classList.add('active');
            }

        });

    }

    else {

        document.execCommand(cmd, false, val);

        if (btn) {

            let isActive = false;

            try {
                isActive = document.queryCommandState(cmd);
            } catch (e) {}

            btn.classList.toggle('active', isActive);
        }
    }

    updateCounts();
    document.getElementById('editor').focus();
}

function createLink() {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) savedRange = sel.getRangeAt(0);
    document.getElementById('linkTextNotes').style.display = 'flex';
}

function confirmLink() {
    let url = document.getElementById('inputLinkNotes').value.trim();
    if (!url) return;
    if (!/^https?:\/\//.test(url)) url = 'https://' + url;
    const editor = document.getElementById('editor');
    editor.focus();
    if (savedRange) { const s = window.getSelection(); s.removeAllRanges(); s.addRange(savedRange); }
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    const arrowSVG = `<span class="link-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 512 512"><path d="M384 224v184a40 40 0 01-40 40H104a40 40 0 01-40-40V168a40 40 0 0140-40h167.48M336 64h112v112M224 288L440 72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg></span>`;
    let linkNode = range.startContainer.parentNode.tagName === 'A' ? range.startContainer.parentNode : null;
    if (linkNode) {
        linkNode.href = url; linkNode.target = '_blank';
        if (!linkNode.querySelector('.link-arrow')) linkNode.insertAdjacentHTML('beforeend', arrowSVG);
    } else {
        const linkHTML = `<a href="${url}" target="_blank">${range.toString()}${arrowSVG}</a>`;
        range.deleteContents();
        const tmp = document.createElement('div'); tmp.innerHTML = linkHTML;
        const frag = document.createDocumentFragment();
        while (tmp.firstChild) frag.appendChild(tmp.firstChild);
        range.insertNode(frag);
    }
    sel.removeAllRanges();
    document.getElementById('linkTextNotes').style.display = 'none';
}

function closeLinkNote() { document.getElementById('linkTextNotes').style.display = 'none'; }
function undo() { formatDoc('undo'); }
function redo() { formatDoc('redo'); }

function updateCounts() {
    const editor = document.getElementById('editor');
    if (!editor) return;
    const text = editor.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    document.getElementById('wordCount').textContent = `Palavras: ${words}`;
}

function saveContent() {
    localStorage.setItem('annotations', document.getElementById('editor').innerHTML);
    msgGlobal('msgRotinaGeral', 'Anotação salva com sucesso!', 'sucesso');
}

function loadContent() {
    const saved = localStorage.getItem('annotations');
    if (saved) { document.getElementById('editor').innerHTML = saved; updateCounts(); }
    document.getElementById('editor').addEventListener('click', e => { if (e.target.tagName === 'A') window.open(e.target.href, '_blank'); });
}

document.addEventListener('DOMContentLoaded', function () {
    atualizarData2(); atualizarRelogio2();
    const editor = document.getElementById('editor');
    if (editor) { loadContent(); editor.addEventListener('input', updateCounts); editor.addEventListener('keyup', updateCounts); }
});

// LOGIN
const c = 'ergodsjidsgidsgnsvnksngdsgwerqughduwjhotriuoitrouifhdsubvjsbdwqirurqbfdsajfnkdsfdjhotriuoitrouifhdsubvjsbdwqiruregtwuyds';
const e = 'jhotriuoitrjhrewrewrwerewotriuoitrouifdfewrewrhdsubvjsbdwqirurouifhdsubvjrewrwesbdwqiruritrouifhdsubvjsbdwqfewfewduqwgdu';
const LS_KEY = 'U2FsdGVkX19H6ppgYzc13kxUDkc6OM7ZJIALeOnICG+CxzdIcBapqdX5As1xgvKN94j';

function aplicarMascaraCPF(input) {
    let v = input.value.replace(/\D/g, '');
    if (v.length <= 3) v = v.replace(/(\d{1,3})/, '$1');
    else if (v.length <= 6) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    else if (v.length <= 9) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    else v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    input.value = v;
}

function adicionarCabecalhoLogout() {
    if (document.querySelector('.cabecalho-logout')) return;
    const logoutBtn = `<button onclick="logout()" class="btn-logout-sistema"><p>${svgLogout(26)}Desconectar</p></button>`;
    const co = document.createElement('div');
    co.className = 'cabecalho-logout';
    co.innerHTML = `<div class="info-usuario-logado"><p>Seja Bem vindo(a)</p><span><strong>${y.nome}</strong></span>${logoutBtn}</div>`;
    const nav = document.getElementById('navId');
    if (nav) {
        const btnOut = document.createElement('button');
        btnOut.style.cssText = 'text-align:center;color:var(--font-color);border-radius:0px';
        btnOut.innerHTML = `<p>${svgLogout(26)}Desconectar</p>`;
        btnOut.onclick = logout;
        nav.appendChild(btnOut);
    }
    const l = document.getElementById('LoginContainer');
    if (l && l.parentNode) l.parentNode.insertBefore(co, l);
}

function svgLogout(s) { return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${s}" height="${s}"><path d="M304 336v40a40 40 0 01-40 40H104a40 40 0 01-40-40V136a40 40 0 0140-40h152c22.09 0 48 17.91 48 40v40M368 336l80-80-80-80M176 256h256" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>`; }

function logout() {
    q = arquivos.filter(item => item.arquivo !== 'sahnes.json');
    localStorage.removeItem(LS_KEY);
    const i = arquivos.findIndex(item => item.arquivo === 'sahnes.json');
    if (i !== -1) { arquivos.splice(i, 1); if (menuManualAberto) fecharMenuManual(); }
    document.querySelector('.cabecalho-logout')?.remove();
    const l = document.getElementById('LoginContainer');
    if (l) l.style.display = 'block';
    ['userLogin', 'passLogin'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const r = document.getElementById('manualContent'); if (r) r.innerHTML = '';
    const t = document.querySelector('#manualGeralContent h1'); if (t) t.textContent = 'Manual';
    y = null;
    if (window.servicosUsuario) window.servicosUsuario = null;
    if (menuManualAberto) fecharMenuManual();
    if (window.gc) window.gc();
    window.location.reload();
}

window.onload = function () { verificarLoginSalvo(); };

async function validarLogin() {
    const i = document.getElementById('userLogin');
    const o = document.getElementById('passLogin');
    const p = i.value.replace(/\D/g, '');
    const a = o.value;
    if (!p || !a) { msgGlobal('msgLogin', 'Por favor, preencha todos os campos!', 'erro'); return; }
    try {
        const s = await fetch('./json/sahnes.json');
        const d = await s.json();
        const f = d.usuarios.find(u => u.f === p);
        if (f && f.senha_geral === a) {
            y = f;
            adicionarOpcaoSenhasAoMenu();
            document.getElementById('LoginContainer').style.display = 'none';
            const meiaNoite = new Date(); meiaNoite.setHours(24, 0, 0, 0);
            const g = CryptoJS.AES.encrypt(a, c).toString();
            const j = CryptoJS.AES.encrypt(g, e).toString();
            const k = CryptoJS.AES.encrypt(JSON.stringify({ f, j, em: meiaNoite.getTime() }), c).toString();
            localStorage.setItem(LS_KEY, k);
            const z = document.getElementById('manualGeral'); if (z) z.style.display = 'block';
            criarCirculoNoBotao(); adicionarCabecalhoLogout();
            msgGlobal('msgLogin', 'Login realizado com sucesso!', 'sucesso');
        } else { msgGlobal('msgLogin', 'Usuário ou senha inválidos!', 'erro'); }
    } catch (err) { console.error('Erro ao carregar dados de login:', err); msgGlobal('msgLogin', 'Erro ao realizar login. Tente novamente mais tarde.', 'erro'); }
}

function criarCirculoNoBotao() {
    const bl = document.getElementById('btnLogin');
    bl.textContent = ''; bl.title = y.nome;
    const inc = y.nome.split(' ').slice(0, 2).map(n => n[0].toUpperCase()).join('');
    const ctc = document.createElement('div'); ctc.className = 'ctcPosLogin'; ctc.textContent = inc;
    bl.appendChild(ctc);
}

window.addEventListener('load', () => {
    if (localStorage.getItem(LS_KEY)) {
        criarCirculoNoBotao();
        const lc = document.getElementById('LoginContainer'); if (lc) lc.style.display = 'none';
        const mg = document.getElementById('manualGeral'); if (mg) mg.style.display = 'block';
        adicionarOpcaoSenhasAoMenu(); adicionarCabecalhoLogout();
    }
});

function verificarLoginSalvo() {
    const d = localStorage.getItem(LS_KEY); if (!d) return;
    let v;
    try {
        const a1 = CryptoJS.AES.decrypt(d, c);
        const b1 = a1.toString(CryptoJS.enc.Utf8);
        if (!b1) throw new Error('Erro ao descriptografar');
        v = JSON.parse(b1);
        if (v.j) v.g2 = CryptoJS.AES.decrypt(v.j, e).toString(CryptoJS.enc.Utf8);
    } catch (err) { console.error('Erro ao descriptografar:', err); localStorage.removeItem(LS_KEY); return; }
    if (Date.now() > v.em) { localStorage.removeItem(LS_KEY); return; }
    y = v.f;
    document.getElementById('LoginContainer').style.display = 'none';
    const z = document.getElementById('manualGeral'); if (z) z.style.display = 'block';
    adicionarCabecalhoLogout(); adicionarOpcaoSenhasAoMenu();
}

// GLOBAL
document.querySelectorAll('.versaoSite').forEach(el => { el.innerHTML = '<p>Versão 0.0.1</p>'; });

const titleHeader = document.getElementById('titleHeader');
const tH = 'Stoxen';
const tM = { home: `${tH} - Home`, infoProduto: `${tH} - Buscar Informação do Produto`, calculadoraLiquido: `${tH} - Calcular Peso Líquido`, calculadoraDDE: `${tH} - Calcular DDE`, historicoPDFDDE: `${tH} - Histórico PDF de DDE`, controleValidade: `${tH} - Controle de Validade`, simuladoDiario: `${tH} - Simulado Diário`, vistoriaFilial: `${tH} - Vistoria Filial`, rotinaGeral: `${tH} - Rotina`, manualGeralContent: `${tH} - Manual`, btnLoginContent: `${tH} - Entrar` };

function toggleMenu() {
    const menu = document.getElementById('navId');
    const hamburger = document.getElementById('hamburger');
    const closeMenuIcon = document.getElementById('closeMenuIcon');
    const menuIcon = document.getElementById('menuIcon');
    if (!menu || !hamburger) return;
    menu.classList.toggle('show');
    const shown = menu.classList.contains('show');
    hamburger.style.display = shown ? 'none' : 'flex'; hamburger.title = 'Menu';
    if (closeMenuIcon) { closeMenuIcon.style.display = shown ? 'flex' : 'none'; closeMenuIcon.title = 'Fechar'; }
    document.addEventListener('click', function (ev) {
        if (!menu.classList.contains('show')) return;
        if (!menu.contains(ev.target) && !menuIcon.contains(ev.target)) {
            menu.classList.remove('show'); hamburger.style.display = 'flex'; hamburger.title = 'Menu';
            if (closeMenuIcon) closeMenuIcon.style.display = 'none';
        }
    });
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const activePage = document.getElementById(pageId); if (activePage) activePage.classList.add('active');
    toggleMenu();
    document.title = tM[pageId] || '';
    titleHeader.innerHTML = `<a onclick="showPage('home')">${tH}</a>`;
    document.querySelectorAll('.navMenuFooter button').forEach(btn => {
        const bp = btn.getAttribute('onclick')?.match(/showPage\('(.+)'\)/)?.[1];
        btn.classList.toggle('active', bp === pageId);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    const firstPage = document.querySelector('.page.active');
    if (firstPage) {
        document.title = tM[firstPage.id] || '';
        document.getElementById('titleHeader').innerHTML = `<a>${tH}</a>`;
        document.querySelectorAll('.navMenuFooter button').forEach(btn => {
            const bp = btn.getAttribute('onclick')?.match(/showPage\('(.+)'\)/)?.[1];
            if (bp === firstPage.id) btn.classList.add('active');
        });
    }
    const toggle = document.getElementById('darkToggle');
    document.body.classList.add('no-animate');
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
    toggle.title = document.body.classList.contains('dark') ? 'Está de noite' : 'Está ensolarado';
    window.addEventListener('load', () => { setTimeout(() => document.body.classList.remove('no-animate'), 50); });
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        toggle.title = isDark ? 'Está de noite' : 'Está ensolarado';
    });
});

document.addEventListener('click', function (event) {
    const manual = document.getElementById('manual');
    const manualIcon = document.getElementById('manualIcon');
    if (manual && manualIcon && !manual.contains(event.target) && !manualIcon.contains(event.target)) {
        manual.classList.remove('show'); manual.style.opacity = '0';
    }
});

function btnFilterManual() {
    const manual = document.getElementById('manual'); if (!manual) return;
    const isShown = manual.classList.toggle('show');
    manual.style.opacity = isShown ? '1' : '0';
}

function showPageM(pageId) {
    const box = document.getElementById('box'); if (box) box.style.display = 'none';
    document.querySelectorAll('.manualPage').forEach(p => p.style.display = 'none');
    btnFilterManual();
    const page = document.getElementById(pageId); if (page) page.style.display = 'block';
    document.title = tM[pageId] || mapHeadTitle;
}

function limpar(valor) {
    if (typeof valor !== 'string') return valor;
    return valor.replace('MATEUS SUPERMERCADOS S.A.', '').replace(/\s+/g, ' ').trim();
}

function removerCodigo(valor) {
    if (typeof valor !== 'string') return valor;
    return valor.replace(/^\d+\s*-\s*/g, '').trim();
}

async function carregarExcelParaLocalStorage() {
    const filial = document.getElementById('filial');
    if (filial) filial.innerHTML = '<p>Carregando, aguarde...</p>';
    try {
        const response = await fetch('assets/documents/arquivogerado.xlsx');
        if (!response.ok) { console.warn('Excel não encontrado'); if (filial) filial.innerHTML = '<p>Arquivo não encontrado</p>'; return; }
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const linhas = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (linhas.length < 2) { console.warn('Arquivo Excel vazio'); return; }
        const cabecalho = linhas[0];
        const dados = linhas.slice(1).map(linha => {
            const obj = {};
            cabecalho.forEach((col, i) => { obj[col] = typeof linha[i] === 'string' ? linha[i].trim() : linha[i] ?? ''; });
            let codigo = '', nome = '';
            if (obj.PRODUTO?.includes('-')) { const partes = obj.PRODUTO.split('-'); codigo = partes[0].trim(); nome = partes.slice(1).join('-').trim(); }
            return { BARRAS: obj.BARRAS, DEPARTAMENTO: removerCodigo(obj.DEPARTAMENTO), FILIAL: limpar(obj.FILIAL), FORNECEDOR: obj.FORNECEDOR, 'CUSTOMEDIO R$': obj['CUSTOMEDIO R$'], SECAO: removerCodigo(obj.SECAO), SETOR: removerCodigo(obj.SETOR), codigo, nome };
        });
        localStorage.setItem('dadosExcel', JSON.stringify(dados));
        console.log('Dados Salvos no LocalStorage com Sucesso:', dados.length, 'registros');
        if (filial && dados[0]?.FILIAL) filial.innerHTML = `<p>${dados[0].FILIAL}</p>`;
    } catch (erro) { console.error('Erro ao carregar Excel:', erro); if (filial) filial.innerHTML = '<p>Erro ao carregar dados...</p>'; }
}

function msgGlobal(idContainer, mensagem, tipo = 'erro') {
    const container = document.getElementById(idContainer); if (!container) return;
    const classe = tipo === 'sucesso' ? 'sucesso' : tipo === 'info' ? 'info' : 'erro';
    container.innerHTML = `<p style="text-align:center;" class="alerta ${classe} fade">${mensagem}</p>`;
    container.style.display = 'flex';
    const msg = container.querySelector('.fade');
    msg.offsetHeight; msg.classList.add('show');
    clearTimeout(container._hideTimeout);
    container._hideTimeout = setTimeout(() => { msg.classList.remove('show'); setTimeout(() => { container.style.display = 'none'; }, 600); }, 2000);
}

function setupMultipleInputClear(configs) {
    configs.forEach(({ inputId, buttonId, containerId, contadorId }) => {
        const input = document.getElementById(inputId);
        const button = document.getElementById(buttonId);
        const container = containerId ? document.getElementById(containerId) : null;
        const contador = contadorId ? document.getElementById(contadorId) : null;
        if (!input || !button) return;
        const toggleButton = () => button.style.display = input.value.trim() ? 'block' : 'none';
        input.addEventListener('input', toggleButton);
        button.addEventListener('click', () => {
            input.value = ''; toggleButton(); input.focus();
            input.dispatchEvent(new Event('input', { bubbles: true }));
            if (container) { container.innerHTML = ''; container.style.display = 'none'; }
            if (contador) {
                contador.textContent = ''; contador.style.display = 'none';
                ['produtoDetalheCalculadoraLiquido', 'produtoDetalheCalculadoraDDE', 'produtoDetalheControleValidade'].forEach(id => {
                    const el = document.getElementById(id); if (el) el.style.display = 'none';
                });
                const cb = document.getElementById('checkboxRetraco'); if (cb) cb.checked = false;
            }
            if (typeof produtoLiquidoAtual !== 'undefined' && produtoLiquidoAtual) {
                const cl = document.getElementById('produtoDetalheCalculadoraLiquido');
                if (cl && typeof atualizarCalculoLiquido === 'function') atualizarCalculoLiquido(produtoLiquidoAtual, cl, false);
            }
        });
        toggleButton();
    });
}

setupMultipleInputClear([
    { inputId: 'codigoBuscarInfo', buttonId: 'resetInputSearchBuscarInfo', containerId: 'produtoInfoBuscar', contadorId: 'contadorProdutos' },
    { inputId: 'codigoBuscarCalcLiquido', buttonId: 'resetInputSearchCalcLiquido', containerId: 'produtoInfoCalcLiquido', contadorId: 'contadorProdutosCalcLiquido' },
    { inputId: 'codigoBuscarDDE', buttonId: 'resetInputSearchDDE', containerId: 'produtoInfoDDE', contadorId: 'contadorProdutosDDE' },
    { inputId: 'codigoBuscarControleValidade', buttonId: 'resetInputSearchControleValidade', containerId: 'produtoInfoControleValidade', contadorId: 'contadorProdutosControleValidade' },
    { inputId: 'codigoBuscarDDE', buttonId: 'resetInputSearchDDE' },
    { inputId: 'unidades', buttonId: 'resetInputSearchUnidades' },
    { inputId: 'pesoTara', buttonId: 'resetInputSearchBuscarPesoTara' },
    { inputId: 'pesoPalete', buttonId: 'resetInputSearchBuscarPesoPalete' },
    { inputId: 'pesoBruto', buttonId: 'resetInputSearchPesoBruto' },
    { inputId: 'entradaDDE', buttonId: 'resetInputSearchEntradaDDE' },
    { inputId: 'dataProducaoDDE', buttonId: 'resetInputdataProducaoDDE' },
    { inputId: 'dataValidadeDDE', buttonId: 'resetInputdataValidadeDDE' },
    { inputId: 'closeDuvidaDDE', buttonId: 'duvidaDDE' },
    { inputId: 'closeDuvidaInfoProduto', buttonId: 'duvidaInfoProduto' },
    { inputId: 'closeDuvidaSimuladoDiario', buttonId: 'duvidaInfoSimulado' },
    { inputId: 'closeDuvidaHome', buttonId: 'duvidaHome' },
    { inputId: 'quantidadeValidade', buttonId: 'resetInputSearchUnidadesValidade' },
    { inputId: 'dataControleValidade', buttonId: 'resetInputdataControleValidade' },
    { inputId: 'codigoHistoricoBuscarControleValidade', buttonId: 'resetInputSearchHistoricoControleValidade' },
    { inputId: 'codigoBuscarSimulado', buttonId: 'resetInputSearchSimulado' },
    { inputId: 'quantidadeSimuladoDiario', buttonId: 'resetInputSimuladoDiario' },
    { inputId: 'codigoBuscaManual', buttonId: 'resetInputSearchCodigoBuscaManual' },
    { inputId: 'closeDuvidaVistoria', buttonId: 'duvidaVistoria' }
]);

function formatarNumeroBR(input, decimais = 3, max = 400000000) {
    let valor = input.value.replace(/\D/g, '');
    if (valor === '') { input.value = ''; return; }
    let numero = Number(valor) / Math.pow(10, decimais);
    if (numero > max) numero = max;
    input.value = numero.toFixed(decimais).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

const campos = [
    { id: 'unidades', decimais: 0 }, { id: 'pesoTara', decimais: 3 }, { id: 'pesoPalete', decimais: 3 }, { id: 'pesoBruto', decimais: 3 },
    { id: 'entradaDDE', decimais: 0 }, { id: 'quantidadeValidade', decimais: 2 }, { id: 'quantidadeSimuladoDiario', decimais: 2 }, { id: 'inputEditValueSimulado', decimais: 2 }
];
campos.forEach(campo => {
    const el = document.getElementById(campo.id);
    if (el) el.addEventListener('input', function () { formatarNumeroBR(this, campo.decimais, 400000000); });
});

function parseBRNumber(value) {
    if (!value) return 0;
    value = value.toString().trim();
    value = value.includes(',') ? value.replace(/\./g, '').replace(',', '.') : value.replace(/[^\d.-]/g, '');
    const n = parseFloat(value); return isNaN(n) ? 0 : n;
}

function formatBRNumber(value, casas = 2) {
    if (isNaN(value)) value = 0;
    return Number(value).toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });
}

let listenersLiquidoAtivos = new Set();
const regexInvalidos = /[!@#$%¨&*()_+"\/\*.,|\\]/;

function criarBuscaProduto({ inputId, containerId, contadorId, msgPrefix, tipo }) {
    let timerBusca = null;
    const TEMPO_ESPERA = 700;
    const input = document.getElementById(inputId);
    const container = document.getElementById(containerId);
    const contador = document.getElementById(contadorId);
    if (!input || !container || !contador) return;
    container.parentNode.insertBefore(contador, container);
    const ITENS_POR_PAGINA = 10;
    let resultados = [], paginaAtual = 0;
    const dados = () => JSON.parse(localStorage.getItem('dadosExcel')) || [];

    function verificarCodigoCompleto(valor) {
        const t = valor.trim(); return dados().find(p => String(p.codigo) === t || String(p.BARRAS) === t);
    }
    function buscarLista(termo) {
        const t = termo.toLowerCase();
        return dados().filter(item => String(item.codigo).toLowerCase().includes(t) || String(item.BARRAS).toLowerCase().includes(t) || String(item.nome).toLowerCase().includes(t));
    }

    function carregarInfoProduto(codigo, container, contador, msgPrefix, tipo) {
        const produto = dados().find(p => String(p.codigo) === String(codigo) || String(p.BARRAS) === String(codigo));
        if (!produto) return;
        contador.style.display = 'none'; contador.textContent = ''; container.style.display = 'block';
        const produtoHTMLBase = `<div class="produtoDetalhe"><ul><strong>${produto.nome}</strong></ul><div class="containerInfoLabels"><div><p>Cód. Reduzido</p><p><strong>${produto.codigo}</strong></p></div><div><p>Cód. Barras</p><p><strong>${produto.BARRAS}</strong></p></div></div><hr><div class="containerInfoLabels"><div><p>Setor</p><p><strong>${produto.SETOR}</strong></p></div><div><p>Departamento</p><p><strong>${produto.DEPARTAMENTO}</strong></p></div></div><div class="containerInfoLabels"><div><p>Seção</p><p><strong>${produto.SECAO}</strong></p></div><div><p>Custo Médio</p><p><strong>R$ ${produto['CUSTOMEDIO R$']}</strong></p></div></div><div><p>Fornecedor</p><p><strong>${produto.FORNECEDOR}</strong></p></div></div>`;
        if (tipo === 'infoBuscar') { container.innerHTML = produtoHTMLBase; msgGlobal(msgPrefix, 'Produto encontrado com sucesso!', 'sucesso'); }
        if (tipo === 'infoValidade') {
            window.produtoControleValidade = produto;
            const pdv = document.getElementById('produtoDetalheControleValidade');
            const piv = document.getElementById('produtoInfoControleValidade');
            if (piv) piv.style.display = 'none';
            if (pdv) { pdv.style.display = 'flex'; pdv.innerHTML = produtoHTMLBase; }
            msgGlobal(msgPrefix, 'Produto encontrado com sucesso!', 'sucesso');
        }
        if (tipo === 'liquido') {
            const cc = document.getElementById('produtoDetalheCalculadoraLiquido');
            const pl = document.getElementById('produtoInfoCalcLiquido');
            window.produtoLiquidoAtual = produto;
            if (typeof atualizarCalculoLiquido === 'function') atualizarCalculoLiquido(window.produtoLiquidoAtual, cc);
            if (!listenersLiquidoAtivos.has(cc)) {
                ['unidades', 'pesoTara', 'pesoPalete', 'pesoBruto'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.addEventListener('input', () => { if (typeof atualizarCalculoLiquido === 'function') atualizarCalculoLiquido(window.produtoLiquidoAtual, cc); });
                });
                const cb = document.getElementById('checkboxRetraco');
                if (cb) cb.addEventListener('change', () => { window.retracoInteragido = true; if (typeof atualizarCalculoLiquido === 'function') atualizarCalculoLiquido(window.produtoLiquidoAtual, cc); });
                listenersLiquidoAtivos.add(cc);
            }
            if (cc) cc.style.display = 'block'; if (pl) pl.style.display = 'none';
            msgGlobal(msgPrefix, 'Produto encontrado com sucesso!', 'sucesso');
        }
    }

    function renderizar() {
        container.innerHTML = ''; contador.style.display = 'block';
        contador.textContent = `Produtos encontrados: ${resultados.length}`; container.style.display = 'block';
        if (!resultados.length) { contador.style.display = 'none'; container.style.display = 'none'; msgGlobal(msgPrefix, 'Produto não encontrado', 'erro'); return; }
        const inicio = paginaAtual * ITENS_POR_PAGINA;
        const pagina = resultados.slice(inicio, inicio + ITENS_POR_PAGINA);
        const lista = document.createElement('ul'); lista.className = 'listaProdutos';
        pagina.forEach(produto => {
            const p = document.createElement('p');
            p.innerHTML = `<span class="nomeProduto"><strong>${produto.codigo} - </strong>${produto.nome}</span>`;
            p.querySelector('.nomeProduto').addEventListener('click', () => {
                document.getElementById(inputId).value = `${produto.codigo} - ${produto.nome}`;
                container.style.display = 'none';
                const tc = tipo === 'infoBuscar' ? document.getElementById('produtoInfoBuscar') : container;
                carregarInfoProduto(produto.codigo, tc, contador, msgPrefix, tipo);
                msgGlobal(msgPrefix, 'Produto encontrado com sucesso!', 'sucesso');
            });
            lista.appendChild(p);
        });
        const nav = document.createElement('div'); nav.className = 'buttonsContainerInfoLista';
        const totalPaginas = Math.ceil(resultados.length / ITENS_POR_PAGINA);
        const mkBtn = (txt, dis, fn) => { const b = document.createElement('button'); b.className = 'btnContainer'; b.textContent = txt; b.title = txt; b.disabled = dis; b.onclick = fn; return b; };
        nav.appendChild(mkBtn('Voltar', paginaAtual === 0, () => { paginaAtual--; renderizar(); }));
        nav.appendChild(mkBtn('Próximo', paginaAtual >= totalPaginas - 1, () => { paginaAtual++; renderizar(); }));
        container.appendChild(lista); container.appendChild(nav);
    }

    document.querySelectorAll('.buscaContainer').forEach(cw => {
        const inp = cw.querySelector('input'); if (!inp) return;
        const up = () => cw.classList.toggle('filled', inp.value.trim() !== '');
        inp.addEventListener('input', up); inp.addEventListener('blur', up);
    });

    input.addEventListener('input', function () {
        const self = this; clearTimeout(timerBusca);
        timerBusca = setTimeout(() => {
            const valor = self.value.trim();
            if (!valor) { resultados = []; container.innerHTML = ''; container.style.display = 'none'; contador.textContent = ''; contador.style.display = 'none'; return; }
            if (regexInvalidos.test(valor)) { msgGlobal(msgPrefix, 'Produto não encontrado', 'erro'); container.style.display = 'none'; contador.style.display = 'none'; resultados = []; setTimeout(() => { self.value = ''; }, TEMPO_ESPERA); return; }
            const pc = verificarCodigoCompleto(valor);
            if (pc) { carregarInfoProduto(pc.codigo, container, contador, msgPrefix, tipo); resultados = []; paginaAtual = 0; contador.style.display = 'none'; document.getElementById(inputId).value = `${pc.codigo} - ${pc.nome}`; return; }
            if (valor.length >= 2) { resultados = buscarLista(valor); paginaAtual = 0; renderizar(); }
            else { container.innerHTML = ''; contador.style.display = 'none'; resultados = []; }
        }, TEMPO_ESPERA);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    carregarExcelParaLocalStorage();

    // Reset Controle Validade
    const confirmResetCV = document.getElementById('confirmResetControleValidade');
    const pdCV = document.getElementById('produtoDetalheControleValidade');
    document.getElementById('btnResetHistoricoControleValidade')?.addEventListener('click', () => { if (confirmResetCV) confirmResetCV.style.display = 'flex'; if (pdCV) pdCV.style.display = 'none'; });
    document.getElementById('confirmYesControleValidade')?.addEventListener('click', () => { if (confirmResetCV) confirmResetCV.style.display = 'none'; localStorage.removeItem('historicoControleValidade'); if (typeof renderizarControleValidade === 'function') renderizarControleValidade(); msgGlobal('msginfoValidade', 'Histórico excluído com sucesso!', 'sucesso'); });
    document.getElementById('confirmNoControleValidade')?.addEventListener('click', () => { if (confirmResetCV) confirmResetCV.style.display = 'none'; });

    // Reset DDE
    const confirmResetDDE = document.getElementById('confirmResetDDE');
    document.getElementById('btnResetHistoricoDDE')?.addEventListener('click', () => { if (confirmResetDDE) confirmResetDDE.style.display = 'flex'; });
    document.getElementById('confirmYesDDE')?.addEventListener('click', () => { localStorage.removeItem('HistoricoDDE'); if (typeof mostrarHistoricoDDE === 'function') mostrarHistoricoDDE(); if (confirmResetDDE) confirmResetDDE.style.display = 'none'; document.querySelectorAll('#calculadoraDDE .buscaContainer input').forEach(inp => { inp.value = ''; inp.dispatchEvent(new Event('input')); }); msgGlobal('msginfoDDE', 'Histórico removido com sucesso!', 'sucesso'); });
    document.getElementById('confirmNoDDE')?.addEventListener('click', () => { if (confirmResetDDE) confirmResetDDE.style.display = 'none'; document.querySelectorAll('.buscaContainer input').forEach(inp => { inp.value = ''; inp.dispatchEvent(new Event('input')); }); });

    // Reset Peso Líquido
    const HistoricoLiq = document.getElementById('historicoCalculadoraLiquido');
    const historicoLiq = JSON.parse(localStorage.getItem('historicoCalculadoraLiquido')) || [];
    const btnResetLiq = document.getElementById('btnResetHistoricoLiquido');
    const pdfLiq = document.getElementById('pdfCalcularLiquido');
    const modal = document.getElementById('confirmReset');
    const show = historicoLiq.length > 0;
    if (HistoricoLiq) HistoricoLiq.style.display = show ? 'block' : 'none';
    if (btnResetLiq) btnResetLiq.style.display = show ? 'flex' : 'none';
    if (pdfLiq) pdfLiq.style.display = show ? 'flex' : 'none';

    document.getElementById('btnCalcularLiquido')?.addEventListener('click', function () {
        if (!window.produtoLiquidoAtual) { msgGlobal('msginfoProdutoCalcLiquido', 'Nenhum produto selecionado', 'erro'); return; }
        if (HistoricoLiq) HistoricoLiq.style.display = 'block';
        const pd = document.getElementById('produtoDetalheCalculadoraLiquido');
        if (pd) pd.style.display = 'none';
        if (typeof atualizarCalculoLiquido === 'function') atualizarCalculoLiquido(window.produtoLiquidoAtual, pd, true);
        msgGlobal('msginfoProdutoCalcLiquido', 'Produto adicionado com sucesso!', 'sucesso');
        document.querySelectorAll('#checkboxRetraco, #unidades, #pesoTara, #pesoPalete, #pesoBruto, #codigoBuscarCalcLiquido').forEach(input => {
            if (input) { input.value = ''; input.dispatchEvent(new Event('input')); input.dispatchEvent(new Event('change')); if (input.type === 'checkbox') input.checked = false; }
        });
    });

    btnResetLiq?.addEventListener('click', () => { if (modal) modal.style.display = 'flex'; });
    document.getElementById('confirmYes')?.addEventListener('click', function () {
        localStorage.removeItem('historicoCalculadoraLiquido');
        if (HistoricoLiq) HistoricoLiq.style.display = 'none';
        const pd = document.getElementById('produtoDetalheCalculadoraLiquido'); if (pd) pd.style.display = 'none';
        const inp = document.getElementById('codigoBuscarCalcLiquido'); if (inp) { inp.value = ''; inp.focus(); }
        document.querySelectorAll('#calculadoraLiquido .buscaContainer input').forEach(inp => { inp.value = ''; inp.dispatchEvent(new Event('input')); });
        msgGlobal('msginfoProdutoCalcLiquido', 'Histórico removido com sucesso!', 'sucesso');
        if (typeof renderizarHistoricoLiquido === 'function') renderizarHistoricoLiquido();
        if (modal) modal.style.display = 'none';
    });
    document.getElementById('confirmNo')?.addEventListener('click', () => { if (modal) modal.style.display = 'none'; });

    criarBuscaProduto({ inputId: 'codigoBuscarInfo', containerId: 'produtoInfoBuscar', contadorId: 'contadorProdutos', msgPrefix: 'msginfoProduto', tipo: 'infoBuscar' });
    criarBuscaProduto({ inputId: 'codigoBuscarControleValidade', containerId: 'produtoInfoControleValidade', contadorId: 'contadorProdutosControleValidade', msgPrefix: 'msginfoValidade', tipo: 'infoValidade' });
    criarBuscaProduto({ inputId: 'codigoBuscarCalcLiquido', containerId: 'produtoInfoCalcLiquido', contadorId: 'contadorProdutosCalcLiquido', msgPrefix: 'msginfoProdutoCalcLiquido', tipo: 'liquido' });

    [
        { buttonId: 'btnDuvidasContainerDDE', containerId: 'duvidaDDE' },
        { buttonId: 'btnDuvidaInfoProduto', containerId: 'duvidaInfoProduto' },
        { buttonId: 'btnDuvidaHome', containerId: 'duvidaHome' },
        { buttonId: 'btnDuvidaInfoSimulado', containerId: 'duvidaInfoSimulado' },
        { buttonId: 'btnDuvidaVistoria', containerId: 'duvidaVistoria' }
    ].forEach(({ buttonId, containerId }) => {
        const btn = document.getElementById(buttonId); const cont = document.getElementById(containerId); if (!btn || !cont) return;
        btn.removeEventListener('click', window[`handler_${buttonId}`]);
        const h = () => { cont.style.display = 'flex'; }; window[`handler_${buttonId}`] = h; btn.addEventListener('click', h);
    });

    if (typeof renderizarHistoricoLiquido === 'function') renderizarHistoricoLiquido();
});

// MANUAL
let arquivos = [{ arquivo: 'assets/documents/manual.pdf', label: 'Manual de Aprendizado - PDF' }];
let menuManualAberto = null;

function criarMenuManual(botao) {
    if (menuManualAberto) { menuManualAberto.remove(); menuManualAberto = null; }
    const overlay = document.createElement('div'); overlay.className = 'filterAllSimulado'; document.body.appendChild(overlay);
    const menu = document.createElement('div'); menu.className = 'menu-flutuante-menu';
    arquivos.forEach(itemObj => {
        const item = document.createElement('div'); item.className = 'itemSecoesSolo'; item.textContent = itemObj.label;
        item.onclick = () => { selecionarArquivo(itemObj); setTimeout(() => fecharMenuManual(), 50); };
        menu.appendChild(item);
    });
    botao.parentElement.appendChild(menu); menuManualAberto = menu;
    setTimeout(() => document.addEventListener('click', fecharMenuManualClickFora), 100);
}

function fecharMenuManual() {
    if (menuManualAberto) { menuManualAberto.remove(); menuManualAberto = null; }
    document.querySelector('.filterAllSimulado')?.remove();
    document.removeEventListener('click', fecharMenuManualClickFora);
}

function fecharMenuManualClickFora(event) {
    if (menuManualAberto && !menuManualAberto.contains(event.target) && !event.target.closest('#btnFilterManual')) fecharMenuManual();
}

const btnManual = document.getElementById('btnFilterManual');
if (btnManual) btnManual.addEventListener('click', ev => { ev.stopPropagation(); menuManualAberto ? fecharMenuManual() : criarMenuManual(btnManual); });

function selecionarArquivo(itemObj) {
    const titulo = document.querySelector('#manualGeralContent h1'); if (titulo) titulo.textContent = itemObj.label;
    const container = document.getElementById('manualContent'); if (container) container.innerHTML = '';
    itemObj.arquivo.endsWith('.pdf') ? abrirPDF(itemObj.arquivo) : carregarJSON(itemObj.arquivo);
}

function abrirPDF(caminhoPDF) {
    document.getElementById('iframePDFFull')?.remove();
    const overlay = document.createElement('div'); overlay.id = 'iframePDFFull';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background-color:rgba(0,0,0,0.95);z-index:9999;display:flex;flex-direction:column';
    const btnFechar = document.createElement('button'); btnFechar.className = 'btnClosePDFManual';
    btnFechar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368"></path></svg>`;
    btnFechar.onclick = () => overlay.remove();
    const iframe = document.createElement('iframe'); iframe.src = caminhoPDF; iframe.style.cssText = 'flex:1;border:none;width:100%;height:100%';
    overlay.appendChild(iframe); overlay.appendChild(btnFechar); document.body.appendChild(overlay);
}

async function carregarJSON(nomeArquivo) {
    try {
        if (nomeArquivo === 'sahnes.json' && y) { renderizarSenhasUsuario(y); }
        else { const r = await fetch(`./json/${nomeArquivo}`); const d = await r.json(); renderizarManualEstruturado(d, nomeArquivo); }
    } catch (erro) { console.error('Erro ao carregar JSON:', erro); }
}

function criarBlocoBase(titulo) {
    const bloco = document.createElement('div'); bloco.className = 'historicoControleValidade';
    const ct = document.createElement('div'); ct.className = 'containerInfoLabels';
    const dt = document.createElement('div'); dt.textContent = titulo;
    ct.appendChild(dt); ct.appendChild(document.createElement('div')); bloco.appendChild(ct); return bloco;
}

function criarInfo(titulo, valor) { const div = document.createElement('div'); div.innerHTML = `<p>${titulo}</p><p><strong>${valor}</strong></p>`; return div; }

function renderizarManualEstruturado(dados, nomeArquivo) {
    const container = document.getElementById('manualContent'); container.innerHTML = '';
    switch (nomeArquivo) {
        case 'codigoComunicacao.json': {
            function criarBlocoCategoriaPadrao(titulo, items, campos) {
                const bloco = criarBlocoBase(titulo);
                items.forEach(item => {
                    const ci = document.createElement('div'); ci.className = 'containerInfoLabels';
                    campos.forEach(campo => ci.appendChild(criarInfo(campo.label, item[campo.key])));
                    bloco.appendChild(ci);
                });
                return bloco;
            }
            if (dados.cargos?.length > 0) container.appendChild(criarBlocoCategoriaPadrao('CARGOS', dados.cargos, [{ label: 'Codigo', key: 'codigo' }, { label: 'Setor', key: 'setor' }]));
            if (dados.codigos_por_cor?.length > 0) container.appendChild(criarBlocoCategoriaPadrao('CÓDIGOS POR COR', dados.codigos_por_cor, [{ label: 'Cor', key: 'cor' }, { label: 'Representação', key: 'representacao' }]));
            if (dados.codigos_alfanumericos?.length > 0) container.appendChild(criarBlocoCategoriaPadrao('CÓDIGOS ALFANUMÉRICOS', dados.codigos_alfanumericos, [{ label: 'Codigo', key: 'codigo' }, { label: 'Descrição', key: 'descricao' }]));
            if (dados.normas_e_conduta?.length > 0) container.appendChild(criarBlocoCategoriaPadrao('NORMAS E CONDUTA', dados.normas_e_conduta, [{ label: 'Área', key: 'area' }, { label: 'Instrução', key: 'instrucao' }]));
            break;
        }
        case 'contatos.json':
            dados.contatos.sort((a, b) => (a.nome || '').toLowerCase().localeCompare((b.nome || '').toLowerCase()));
            dados.contatos.forEach(item => container.appendChild(renderContatos(item))); break;
        case 'infoAdicionais.json':
            dados.informacoes_tara.forEach(secao => container.appendChild(renderInfoAdicionais(secao))); break;
        case 'trocaFornecedor.json':
            dados.forEach(item => container.appendChild(renderTrocaFornecedor(item))); break;
        case 'escalaSemanal.json':
            if (Array.isArray(dados)) {
                dados.sort((a, b) => (a.nome || '').toLowerCase().localeCompare((b.nome || '').toLowerCase()));
                const tc = document.createElement('div'); tc.id = 'tabelaEscalaSemanal'; tc.className = 'historicoEscalaSemanal';
                const tbody = document.createElement('tbody'); tbody.id = 'tabelaCorpo';
                const hr0 = document.createElement('tr'); const vc = document.createElement('th');
                vc.className = 'infoColaboradores'; vc.textContent = dados.length > 1 ? `Colaboradores: ${dados.length}` : `Colaborador: ${dados.length}`;
                hr0.appendChild(vc); tbody.appendChild(hr0);
                const hr = document.createElement('tr');
                ['MATRÍCULA', 'NOME', 'POSTO', ...getDatasSemana()].forEach(h => { const th = document.createElement('th'); th.textContent = h; th.className = 'headerText'; hr.appendChild(th); });
                tbody.appendChild(hr);
                dados.forEach(item => {
                    const row = document.createElement('tr');
                    const dias = ['0', '1', '2', '3', '4', '5', '6', '7'].map(d => item[d] || '-');
                    [item.matricula || '', item.nome || '', item.posto || '', ...dias].forEach((dado, index) => {
                        const td = document.createElement('td'); td.textContent = dado; td.className = 'tdClass';
                        if (index >= 2) {
                            const j = dado === 'GERENTE SETOR' || dado === 'SUCESSOR';
                            td.style.backgroundColor = dado === 'FÉRIAS' ? '#2b80ff' : dado === 'DSR' ? '#21a500' : dado === 'FA' ? '#ff9800' : dado === 'AFASTADO' ? '#f44336' : j ? '#000' : '';
                            td.style.color = (dado === 'FÉRIAS' || dado === 'DSR' || dado === 'FA' || dado === 'AFASTADO' || j) ? '#fff' : '';
                        }
                        row.appendChild(td);
                    });
                    tbody.appendChild(row);
                });
                tbody.querySelectorAll('tr').forEach((linha, index) => { if (index > 1) linha.style.backgroundColor = index % 2 === 0 ? 'var(--background-color-linha-tabela-escala-1)' : 'var(--background-color-linha-tabela-escala-2)'; });
                tc.appendChild(tbody); container.appendChild(tc);
            } break;
        default: console.warn('JSON não tratado:', nomeArquivo);
    }
}

function renderContatos(item) {
    const bloco = criarBlocoBase(item.nome || 'Sem nome');
    const ci = document.createElement('div'); ci.className = 'containerInfoLabelsContantos';
    if (item.cargo) ci.appendChild(criarInfo('Cargo', item.cargo));
    if (item.email) ci.appendChild(criarInfo('Email', item.email));
    if (item.telefone) ci.appendChild(criarInfo('Telefone', formatarTelefoneBR(item.telefone)));
    bloco.appendChild(ci); return bloco;
}

function formatarTelefoneBR(numero) {
    const d = numero.replace(/\D/g, '');
    if (d.length === 11) return d.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    if (d.length === 10) return d.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    return numero;
}

function renderInfoAdicionais(secao) {
    const bloco = criarBlocoBase(secao.setor || 'Setor');
    secao.itens.forEach(item => {
        const ci = document.createElement('div'); ci.className = 'containerInfoLabels';
        if (item.item) ci.appendChild(criarInfo('Item', item.item));
        if (item.tara) ci.appendChild(criarInfo('Tara', item.tara));
        bloco.appendChild(ci);
    });
    return bloco;
}

function renderTrocaFornecedor(item) {
    const bloco = document.createElement('div'); bloco.className = 'historicoControleValidade';
    const ct = document.createElement('div'); ct.className = 'containerInfoLabels';
    const dc = document.createElement('div'); dc.innerHTML = `<p>Comprador</p><p><strong>${item.Comprador || ''}</strong></p>`;
    ct.appendChild(dc); bloco.appendChild(ct);
    const cc = document.createElement('div'); cc.className = 'containerInfoLabels';
    if (item.Fornecedor) cc.appendChild(criarInfo('Fornecedor', item.Fornecedor));
    if (item.Troca) cc.appendChild(criarInfo('Troca', item.Troca));
    if (item.Obs) cc.appendChild(criarInfo('Obs', item.Obs));
    bloco.appendChild(cc); return bloco;
}

const inputBusca = document.getElementById('codigoBuscaManual');
const btnResetBusca = document.getElementById('resetInputSearchCodigoBuscaManual');
if (inputBusca) inputBusca.addEventListener('input', () => filtrarManualAtual(inputBusca.value.trim().toLowerCase()));
if (btnResetBusca) btnResetBusca.addEventListener('click', () => { inputBusca.value = ''; filtrarManualAtual(''); atualizarNumeroColaboradores(); });

function filtrarManualAtual(termo) {
    const container = document.getElementById('manualContent');
    const tbody = document.getElementById('tabelaCorpo');
    if (!termo) {
        if (container) Array.from(container.children).forEach(b => { b.style.display = ''; });
        if (tbody) tbody.querySelectorAll('tr').forEach(l => { l.style.display = ''; }); return;
    }
    const t = termo.toLowerCase();
    if (container) Array.from(container.children).forEach(b => { if (b.id !== 'tabelaEscalaSemanal') b.style.display = b.innerText.toLowerCase().includes(t) ? '' : 'none'; });
    if (tbody) {
        tbody.querySelectorAll('tr').forEach((linha, index) => {
            if (index === 0 || index === 1) { linha.style.display = ''; return; }
            const c = linha.querySelectorAll('td');
            linha.style.display = (c.length >= 2 && (c[0]?.textContent.toLowerCase().includes(t) || c[1]?.textContent.toLowerCase().includes(t))) ? '' : 'none';
        });
    }
    atualizarNumeroColaboradores();
}

function atualizarNumeroColaboradores() {
    const tbody = document.getElementById('tabelaCorpo'); if (!tbody) return;
    const linhas = Array.from(tbody.querySelectorAll('tr'));
    const vis = linhas.slice(2).filter(l => l.style.display !== 'none');
    const cab = linhas[0]?.querySelector('th');
    if (cab) cab.textContent = vis.length > 1 ? `Colaboradores: ${vis.length}` : `Colaborador: ${vis.length}`;
}

function adicionarOpcaoSenhasAoMenu() {
    if (arquivos.some(item => item.arquivo === 'sahnes.json')) return;
    arquivos.push(
        { arquivo: 'codigoComunicacao.json', label: 'Código de Comunicação' },
        { arquivo: 'contatos.json', label: 'Contatos' },
        { arquivo: 'infoAdicionais.json', label: 'Informações Adicionais' },
        { arquivo: 'trocaFornecedor.json', label: 'Troca de Fornecedor' },
        { arquivo: 'escalaSemanal.json', label: 'Escala Semanal' },
        { arquivo: 'sahnes.json', label: 'Senhas' }
    );
    if (menuManualAberto) fecharMenuManual();
}

function renderizarSenhasUsuario(f) {
    const container = document.getElementById('manualContent'); container.innerHTML = '';
    if (!f?.servicos?.length) { container.innerHTML = '<div class="sem-senhas">Nenhuma senha cadastrada para este usuário.</div>'; return; }
    const sv = f.servicos.filter(s => s.nome?.trim() !== '');
    if (!sv.length) { container.innerHTML = '<div class="sem-senhas">Nada por aqui.</div>'; return; }
    sv.forEach((servico, index) => {
        const bloco = document.createElement('div'); bloco.className = 'historicoControleValidade';
        const ct = document.createElement('div'); ct.className = 'containerInfoLabels';
        const dt = document.createElement('div'); dt.innerHTML = `<h3 style="margin:0;">${servico.nome}</h3>`;
        ct.appendChild(dt); ct.appendChild(document.createElement('div')); bloco.appendChild(ct);
        const ci = document.createElement('div'); ci.className = 'containerInfoLabelsSahnes';
        if (servico.email_usuario) { const d = document.createElement('div'); d.className = 'info-item'; d.innerHTML = `<p>Usuário / Email</p><p><strong>${servico.email_usuario}</strong></p>`; ci.appendChild(d); }
        if (servico.senha) {
            const ds = document.createElement('div'); ds.className = 'info-item senha-item';
            const sid = `senha-${Date.now()}-${index}`;
            if (!window.senhasMemoria) window.senhasMemoria = {}; window.senhasMemoria[sid] = servico.senha;
            ds.innerHTML = `<p>Senha</p><p><strong id="${sid}" class="senha-valor">********</strong></p><p><a onclick="toggleSenhaSeguro('${sid}', this)">${_svgOlhoAberto}</a><p>`;
            ci.appendChild(ds);
        }
        if (servico.link) { const dl = document.createElement('div'); dl.className = 'info-item'; dl.innerHTML = `<p>Acesso</p><p><a href="${servico.link}" target="_blank">Acessar Sistema</a></p>`; ci.appendChild(dl); }
        bloco.appendChild(ci); container.appendChild(bloco);
    });
}

const _svgOlhoAberto = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 512 512"><path d="M255.66 112c-77.94 0-157.89 45.11-220.83 135.33a16 16 0 00-.27 17.77C82.92 340.8 161.8 400 255.66 400c92.84 0 173.34-59.38 221.79-135.25a16.14 16.14 0 000-17.47C428.89 172.28 347.8 112 255.66 112z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><circle cx="256" cy="256" r="80" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/></svg>`;
const _svgOlhoFechado = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 512 512"><path d="M432 448a15.92 15.92 0 01-11.31-4.69l-352-352a16 16 0 0122.62-22.62l352 352A16 16 0 01432 448zM255.66 384c-41.49 0-81.5-12.28-118.92-36.5-34.07-22-64.74-53.51-88.7-91v-.08c19.94-28.57 41.78-52.73 65.24-72.21a2 2 0 00.14-2.94L93.5 161.38a2 2 0 00-2.71-.12c-24.92 21-48.05 46.76-69.08 76.92a31.92 31.92 0 00-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416a239.13 239.13 0 0075.8-12.58 2 2 0 00.77-3.31l-21.58-21.58a4 4 0 00-3.83-1 204.8 204.8 0 01-51.16 6.47zM490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96a227.34 227.34 0 00-74.89 12.83 2 2 0 00-.75 3.31l21.55 21.55a4 4 0 003.88 1 192.82 192.82 0 0150.21-6.69c40.69 0 80.58 12.43 118.55 37 34.71 22.4 65.74 53.88 89.76 91a.13.13 0 010 .16 310.72 310.72 0 01-64.12 72.73 2 2 0 00-.15 2.95l19.9 19.89a2 2 0 002.7.13 343.49 343.49 0 0068.64-78.48 32.2 32.2 0 00-.1-34.78z"/><path d="M256 160a95.88 95.88 0 00-21.37 2.4 2 2 0 00-1 3.38l112.59 112.56a2 2 0 003.38-1A96 96 0 00256 160zM165.78 233.66a2 2 0 00-3.38 1 96 96 0 00115 115 2 2 0 001-3.38z"/></svg>`;

function toggleSenhaSeguro(senhaId, botao) {
    const el = document.getElementById(senhaId);
    const r = window.senhasMemoria?.[senhaId]; if (!el || !r) return;
    if (el.textContent === '********') { el.textContent = r; botao.innerHTML = _svgOlhoFechado; }
    else { el.textContent = '********'; botao.innerHTML = _svgOlhoAberto; }
}

function limparSenhasMemoria() {
    if (window.senhasMemoria) { Object.keys(window.senhasMemoria).forEach(k => delete window.senhasMemoria[k]); window.senhasMemoria = null; }
}

function reaplicarFiltro() { if (inputBusca?.value.trim()) filtrarManualAtual(inputBusca.value.trim().toLowerCase()); }
const observer = new MutationObserver(() => reaplicarFiltro());
function iniciarObserver() { const t = document.getElementById('tabelaEscalaSemanal'); if (t) observer.observe(t, { childList: true, subtree: true }); }
setTimeout(iniciarObserver, 100);

function getDatasSemana() {
    const hoje = new Date();
    const prim = new Date(hoje); prim.setDate(hoje.getDate() - hoje.getDay());
    const dias = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];
    return Array.from({ length: 8 }, (_, i) => { const d = new Date(prim); d.setDate(prim.getDate() + i); return `${_fmt2(d.getDate())}/${_fmt2(d.getMonth() + 1)} ${dias[i]}`; });
}

function atualizarDatasAutomaticamente() {
    const tabela = document.getElementById('tabelaEscalaSemanal'); if (!tabela) return;
    const headerRow = tabela.querySelector('tr'); if (!headerRow) return;
    const headers = ['MATRÍCULA', 'NOME', 'POSTO', ...getDatasSemana()];
    headerRow.querySelectorAll('th').forEach((th, i) => { if (i >= 3) th.textContent = headers[i]; });
}
setInterval(atualizarDatasAutomaticamente, 60000);
window.addEventListener('focus', atualizarDatasAutomaticamente);

// PESO LÍQUIDO
let produtoLiquidoAtual = null, retracoInteragido = false, ajustesJSON = {};

document.addEventListener('DOMContentLoaded', () => {
    fetch('json/ajustes.json').then(r => r.json()).then(j => { ajustesJSON = j; }).catch(err => console.error('Erro ao carregar ajustes.json:', err));
    const cb = document.querySelector('input[name="Retraco"]');
    if (cb) cb.addEventListener('change', () => { retracoInteragido = true; if (produtoLiquidoAtual) atualizarCalculoLiquido(produtoLiquidoAtual.produto, produtoLiquidoAtual.container); });
});

function atualizarCalculoLiquido(produto, container, salvar = false) {
    produtoLiquidoAtual = { produto, container };
    let sinal = '';
    let unidades = parseBRNumber(document.getElementById('unidades').value);
    const pesoTara = parseBRNumber(document.getElementById('pesoTara').value);
    const pesoPalete = parseBRNumber(document.getElementById('pesoPalete').value);
    const pesoBrutoOriginal = parseBRNumber(document.getElementById('pesoBruto').value);
    if (!unidades || unidades === 0) unidades = 1;
    const pesoTotalTara = unidades * pesoTara + pesoPalete;
    const cb = document.querySelector('input[name="Retraco"]');
    let ajustePercent = 0; let pesoAjustado = pesoBrutoOriginal - pesoTotalTara;
    if (cb?.checked && retracoInteragido) {
        const codigo = String(produto.codigo);
        if (ajustesJSON['+'] && codigo in ajustesJSON['+']) {
            ajustePercent = ajustesJSON['+'][codigo];
            pesoAjustado *= (1 + ajustePercent);
            sinal = '+';
        }

        else if (ajustesJSON['-'] && codigo in ajustesJSON['-']) {
            ajustePercent = ajustesJSON['-'][codigo];
            pesoAjustado *= (1 - ajustePercent);
            sinal = '-';
        }
    }
    const pesoLiquido = pesoAjustado;
    const ajusteExibido = ajustePercent === 0 ? '0%' : `${sinal} ${(ajustePercent * 100).toFixed(2)}%`;
    if (salvar) { salvarHistoricoLiquido({ descricao: produto.nome, codigoReduzido: produto.codigo, quantidade: unidades, tara: pesoTotalTara, pesoTaraUnidade: pesoTara, pesoBruto: pesoBrutoOriginal, pesoLiquido, ajustePercent, sinal }); renderizarHistoricoLiquido(); }
    container.innerHTML = `<div class="produtoDetalheCalculadoraLiquido"><ul><strong>${produto.nome}</strong></ul><div class="containerInfoLabels"><div><p>Cód. Reduzido</p><p><strong>${produto.codigo}</strong></p></div><div><p>Cód. Barras</p><p><strong>${produto.BARRAS}</strong></p></div></div><hr><div class="containerInfoLabels"><div><p>Peso Líquido</p><p><strong>${formatBRNumber(pesoLiquido)} kg</strong></p></div><div><p>Peso Bruto</p><p><strong>${formatBRNumber(pesoBrutoOriginal)} kg</strong></p></div></div><div class="containerInfoLabels"><div><p>Peso Tara</p><p><strong>${formatBRNumber(pesoTotalTara)} kg</strong></p></div><div><p class="ajuste">Ajuste</p><p><strong>${ajusteExibido}</strong></p></div></div><div class="containerInfoLabels"><div><p>Seção</p><p><strong>${produto.SECAO}</strong></p></div></div></div>`;
}

function salvarHistoricoLiquido(item) {
    const chave = 'historicoCalculadoraLiquido';
    let h = JSON.parse(localStorage.getItem(chave)) || [];
    h.push({ ...item, id: Date.now() + Math.random() });
    localStorage.setItem(chave, JSON.stringify(h));
}

function renderizarHistoricoLiquido() {
    const container = document.getElementById('produtoHistoricoCalculadoraLiquido');
    const historico = JSON.parse(localStorage.getItem('historicoCalculadoraLiquido')) || [];
    const HL = document.getElementById('historicoCalculadoraLiquido');
    const btnR = document.getElementById('btnResetHistoricoLiquido');
    const pdfL = document.getElementById('pdfCalcularLiquido');
    if (!container) return;
    container.innerHTML = '';
    const toggle = show => { if (HL) HL.style.display = show ? 'block' : 'none'; if (btnR) btnR.style.display = show ? 'flex' : 'none'; if (pdfL) pdfL.style.display = show ? 'flex' : 'none'; };
    if (!historico.length) { toggle(false); return; }
    toggle(true);
    const agrupado = historico.reduce((acc, item) => {
        if (!acc[item.codigoReduzido]) acc[item.codigoReduzido] = { descricao: item.descricao, itens: [] };
        acc[item.codigoReduzido].itens.push(item); return acc;
    }, {});
    Object.keys(agrupado).sort().forEach(codigo => {
        const grupo = agrupado[codigo];
        const totalLiq = grupo.itens.reduce((s, i) => s + i.pesoLiquido, 0);
        container.innerHTML += `<div class="itemHistoricoLiquido"><strong>${codigo} - ${grupo.descricao}</strong><div class="pesoliquidoTotalHistorico"><p>Líquido Total</p><ul>${formatBRNumber(totalLiq)} kg</ul></div></div>`;
        grupo.itens.forEach((item, index) => {
            container.innerHTML += `<div class="historicoCalculadoraLiquido"><div class="containerInfoLabels"><strong>${index + 1}º</strong><p>${grupo.descricao}</p><button class="btnResetProdutoLiquido" data-id="${item.id}">X</button></div><div class="containerInfoLabels"><div><p>Peso Líquido kg</p>${formatBRNumber(item.pesoLiquido)}</div><hr><div><p>Peso Bruto kg</p>${formatBRNumber(item.pesoBruto)}</div><hr><div><p>Tara kg</p>${formatBRNumber(item.tara)}</div><hr><div><p>Ajuste</p>${item.sinal}${(item.ajustePercent * 100 || 0).toFixed(2)}%</div><div></div></div></div>`;
        });
    });
    container.querySelectorAll('.btnResetProdutoLiquido').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            let h = JSON.parse(localStorage.getItem('historicoCalculadoraLiquido')) || [];
            h = h.filter(item => item.id != id);
            localStorage.setItem('historicoCalculadoraLiquido', JSON.stringify(h));
            renderizarHistoricoLiquido();
            if (typeof msgGlobal === 'function') msgGlobal('msginfoProdutoCalcLiquido', 'Produto removido com sucesso!', 'sucesso');
        });
    });
}

function _pdfCabecalho(doc, titulo) {
    const lp = doc.internal.pageSize.width; let y = 15;
    doc.setFont('sans-serif', 'bold'); doc.setFontSize(14);
    doc.text(titulo, lp / 2, y, { align: 'center' }); doc.text('Por Stoxen', lp / 2, y + 7, { align: 'center' });
    doc.setFont('sans-serif', 'normal'); doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, lp / 2, y + 14, { align: 'center' });
    return y + 25;
}

function _pdfRodape(doc) {
    const total = doc.getNumberOfPages(); const lp = doc.internal.pageSize.width;
    for (let i = 1; i <= total; i++) { doc.setPage(i); doc.setFontSize(8); doc.setTextColor(150); doc.text(`Gerado em ${new Date().toLocaleString('pt-BR')}`, lp / 2, 290, { align: 'center' }); }
}

function btnPDFCalcularLiquido() {
    const { jsPDF } = window.jspdf; const doc = new jsPDF();
    const historico = JSON.parse(localStorage.getItem('historicoCalculadoraLiquido')) || [];
    if (!historico.length) { if (typeof msgGlobal === 'function') msgGlobal('msginfoProdutoCalcLiquido', 'Nenhum histórico para gerar PDF!', 'erro'); return; }
    const mX = 10; let y = _pdfCabecalho(doc, 'Histórico de Peso Líquido');
    const agrupado = historico.reduce((acc, item) => { if (!acc[item.codigoReduzido]) acc[item.codigoReduzido] = { descricao: item.descricao, itens: [] }; acc[item.codigoReduzido].itens.push(item); return acc; }, {});
    Object.keys(agrupado).sort().forEach(codigo => {
        const grupo = agrupado[codigo]; const totalLiq = grupo.itens.reduce((s, i) => s + i.pesoLiquido, 0);
        if (y > 260) { doc.addPage(); y = 20; }
        doc.setFontSize(12); doc.setFont('sans-serif', 'bold'); doc.text(`${codigo} - ${grupo.descricao}`, mX, y); y += 6;
        doc.setFontSize(10); doc.setFont('sans-serif', 'normal'); doc.text(`Líquido Total: ${formatBRNumber(totalLiq)} kg`, mX, y); y += 8;
        doc.autoTable({ startY: y, head: [['N°', 'Unidades', 'Peso Unidade Kg', 'Peso Líquido Kg', 'Peso Bruto Kg', 'Tara Total Kg', 'Ajuste %']], body: grupo.itens.map((item, i) => [`${i + 1}°`, item.quantidade || 1, `${formatBRNumber(item.pesoTaraUnidade || 0)} kg`, `${formatBRNumber(item.pesoLiquido)} kg`, `${formatBRNumber(item.pesoBruto)} kg`, `${formatBRNumber(item.tara)} kg`, `${item.sinal || ''}${(item.ajustePercent * 100).toFixed(2).replace('.', ',')} %`]), styles: { fontSize: 9, cellPadding: 3, halign: 'center', valign: 'middle' }, headStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: 'bold' }, margin: { left: mX, right: mX } });
        y = doc.lastAutoTable.finalY + 8;
    });
    _pdfRodape(doc);
    if (typeof msgGlobal === 'function') msgGlobal('msginfoProdutoCalcLiquido', 'PDF gerado com sucesso!', 'sucesso');
    doc.save('historico_calculadora_liquido.pdf');
}

// CONTROLE DE VALIDADE
function atualizarControleValidade(produto, salvar = false) {
    const quantidade = parseBRNumber(document.getElementById('quantidadeValidade').value) || 0;
    const dataValidade = document.getElementById('dataControleValidade').value || '-';
    if (!produto) { msgGlobal('msginfoValidade', 'Nenhum produto selecionado!', 'erro'); return; }
    if (quantidade <= 0 || dataValidade === '-') { msgGlobal('msginfoValidade', 'Preencha todos os dados!', 'erro'); return; }
    if (salvar) {
        salvarHistoricoControleValidade({ descricao: produto.nome, codigoReduzido: produto.codigo, 'CUSTOMEDIO R$': produto['CUSTOMEDIO R$'], BARRAS: produto.BARRAS, quantidade, dataValidade });
        renderizarControleValidade();
        document.getElementById('quantidadeValidade').value = ''; document.getElementById('dataControleValidade').value = '';
        msgGlobal('msginfoValidade', 'Produto adicionado com sucesso!', 'sucesso');
    }
}

function salvarHistoricoControleValidade(item) {
    const chave = 'historicoControleValidade';
    let h = JSON.parse(localStorage.getItem(chave)) || [];
    h.push({ ...item, id: Date.now() + Math.random() });
    localStorage.setItem(chave, JSON.stringify(h));
}

let paginaAtualControleValidade = 1;
const itensPorPaginaControleValidade = 10;
let termoBuscaControleValidade = '';

function renderizarControleValidade() {
    const container = document.getElementById('produtoHistoricoControleValidade');
    const historico = JSON.parse(localStorage.getItem('historicoControleValidade')) || [];
    const els = {
        hcv: document.getElementById('historicoControleValidade'),
        btnR: document.getElementById('btnResetHistoricoControleValidade'),
        search: document.getElementById('searchContainerHistoricoControleValidade'),
        btnH: document.getElementById('btnHistoricoControleValidade'),
        cnt: document.getElementById('contagemHistoricoControleValidade'),
        pdf: document.getElementById('pdfControleValidade')
    };
    container.innerHTML = '';
    if (!historico.length) {
        Object.values(els).forEach(el => { if (el) el.style.display = 'none'; }); return;
    }
    els.hcv && (els.hcv.style.display = 'block');
    els.btnR && (els.btnR.style.display = 'flex');
    els.pdf && (els.pdf.style.display = 'flex');
    els.btnH && (els.btnH.style.display = historico.length < 11 ? 'none' : 'block');
    els.search && (els.search.style.display = 'flex');
    els.cnt && (els.cnt.style.display = 'flex');

    historico.sort((a, b) => {
        const dA = a.dataValidade ? new Date(a.dataValidade + 'T00:00:00') : new Date(8640000000000000);
        const dB = b.dataValidade ? new Date(b.dataValidade + 'T00:00:00') : new Date(8640000000000000);
        return dA - dB;
    });

    let hf = historico;
    if (termoBuscaControleValidade) hf = historico.filter(item => `${item.descricao || ''} ${item.codigoReduzido || ''} ${item.BARRAS || ''}`.toLowerCase().includes(termoBuscaControleValidade));

    const totalPaginas = Math.ceil(hf.length / itensPorPaginaControleValidade);
    paginaAtualControleValidade = Math.max(1, Math.min(paginaAtualControleValidade, totalPaginas));
    const inicio = (paginaAtualControleValidade - 1) * itensPorPaginaControleValidade;
    const hp = hf.slice(inicio, inicio + itensPorPaginaControleValidade);

    if (els.cnt) els.cnt.innerHTML = `<div class="contagemHistoricoControleValidade"><p>${hf.length === 1 ? '1 produto adicionado.' : `${hf.length} produtos adicionados.`}</p></div>`;

    hp.forEach(item => {
        const qtd = parseFloat(item.quantidade) || 0;
        const cm = parseBRNumber(item['CUSTOMEDIO R$']) || 0;
        const vt = qtd * cm;
        let sc = 'green';
        if (item.dataValidade) {
            const hoje = new Date(); const val = new Date(item.dataValidade + 'T00:00:00');
            hoje.setHours(0, 0, 0, 0); val.setHours(0, 0, 0, 0);
            const diff = Math.ceil((val - hoje) / (1000 * 60 * 60 * 24));
            if (diff < 0) sc = 'black'; else if (diff <= 60) sc = 'red'; else if (diff <= 90) sc = 'yellow';
        }
        container.innerHTML += `<div class="historicoControleValidade" data-id="${item.id}"><div class="statusControleValidade" style="background-color:${sc}"></div><div class="containerInfoLabels"><div>${item.descricao}</div><div class="btnContainerControleValidade"><button class="btnEditarProdutoLiquido" data-id="${item.id}"><span>✎</span></button><button class="btnResetControleValidade" data-id="${item.id}">X</button></div></div><div class="containerInfoLabels"><div><p>Cód. Reduzido</p><p><strong>${item.codigoReduzido || '--'}</strong></p></div><div><p>Cód. Barras</p><p><strong>${item.BARRAS || '--'}</strong></p></div><div><p>Custo Médio</p><p><strong>R$ ${cm.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></p></div></div><div class="containerInfoLabels"><div><p>Data Validade</p><p><strong>${item.dataValidade ? new Date(item.dataValidade + 'T00:00:00').toLocaleDateString('pt-BR') : '--'}</strong></p></div><div><p>Quantidade</p><p><strong class="quantidadeValor">${qtd.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</strong></p></div><div><p>Valor Total</p><p><strong class="valorTotal">R$ ${vt.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></p></div></div></div>`;
    });

    if (els.btnH) els.btnH.innerHTML = `<div class="btnContainerHistoricoControleValidade"><div class="contadorHistoricoControleValidade">${totalPaginas > 1 ? `<span>Página ${paginaAtualControleValidade} de ${totalPaginas}</span>` : ''}</div><div class="btnHistoricoControleValidade"><button class="btnContainer" id="btnPaginaAnterior" ${paginaAtualControleValidade === 1 ? 'disabled' : ''}>Voltar</button><button class="btnContainer" id="btnPaginaProxima" ${paginaAtualControleValidade === totalPaginas ? 'disabled' : ''}>Próximo</button></div></div>`;

    document.getElementById('btnPaginaAnterior')?.addEventListener('click', () => { if (paginaAtualControleValidade > 1) { paginaAtualControleValidade--; renderizarControleValidade(); } });
    document.getElementById('btnPaginaProxima')?.addEventListener('click', () => { if (paginaAtualControleValidade < totalPaginas) { paginaAtualControleValidade++; renderizarControleValidade(); } });

    container.addEventListener('click', ev => {
        if (ev.target.closest('.btnEditarProdutoLiquido')) {
            const botao = ev.target.closest('.btnEditarProdutoLiquido'); const id = botao.dataset.id;
            const ic = container.querySelector(`.historicoControleValidade[data-id="${id}"]`);
            const strong = ic.querySelector('.quantidadeValor');
            const input = document.createElement('input'); input.type = 'text'; input.value = strong.textContent; input.style.cssText = 'width:150px;border:none';
            strong.replaceWith(input); input.focus();
            input.addEventListener('input', () => {
                const v = parseBRNumber(input.value);
                const cm = parseBRNumber(ic.querySelector('div:nth-child(5) strong')?.textContent || '0');
                const vts = ic.querySelector('.valorTotal'); if (vts) vts.textContent = 'R$ ' + (v * cm).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            });
            input.addEventListener('blur', () => {
                const v = parseBRNumber(input.value);
                const ha = JSON.parse(localStorage.getItem('historicoControleValidade')) || [];
                localStorage.setItem('historicoControleValidade', JSON.stringify(ha.map(it => { if (it.id == id) it.quantidade = v; return it; })));
                renderizarControleValidade();
            });
        }
        if (ev.target.closest('.btnResetControleValidade')) {
            const id = ev.target.closest('.btnResetControleValidade').dataset.id;
            let ha = JSON.parse(localStorage.getItem('historicoControleValidade')) || [];
            localStorage.setItem('historicoControleValidade', JSON.stringify(ha.filter(it => it.id != id)));
            renderizarControleValidade(); msgGlobal('msginfoValidade', 'Produto removido com sucesso!', 'sucesso');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarControleValidade();
    document.getElementById('btnCalcularControleValidade')?.addEventListener('click', () => {
        atualizarControleValidade(window.produtoControleValidade, true);
        document.getElementById('produtoDetalheControleValidade').style.display = 'none';
        ['codigoBuscarControleValidade', 'quantidadeValidade', 'dataControleValidade'].forEach(id => { const inp = document.getElementById(id); if (inp) { inp.value = ''; inp.dispatchEvent(new Event('input')); inp.dispatchEvent(new Event('change')); } });
    });
    const ibv = document.getElementById('codigoHistoricoBuscarControleValidade');
    if (ibv) ibv.addEventListener('input', function () { termoBuscaControleValidade = this.value.toLowerCase().trim(); paginaAtualControleValidade = 1; renderizarControleValidade(); });
});

function abrirFormularioGerarPDF() {
    const cv = document.getElementById('confirmacaoValidadePDF');
    const bf = document.getElementById('closeConfirmacaoValidadePDF');
    cv.style.display = 'flex';
    bf.addEventListener('click', () => { cv.style.display = 'none'; });
}

function btnPDFControleValidade() {
    const nome = document.getElementById('colaborador').value.trim().toUpperCase();
    const sel = document.querySelector('select[name="filialVistoria"]');
    // Usa setor do Controle de Validade
    const setorEl = document.getElementById('setor');
    const setor = setorEl ? setorEl.value.toUpperCase() : '';
    const corredor = document.getElementById('corredor').value;
    if (!nome || !setor || !corredor) { msgGlobal('msginfoValidade', 'Preencha os campos para gerar o PDF!', 'erro'); return; }
    document.getElementById('confirmacaoValidadePDF').style.display = 'none';
    const { jsPDF } = window.jspdf; const doc = new jsPDF();
    const historico = JSON.parse(localStorage.getItem('historicoControleValidade')) || [];
    if (!historico.length) { msgGlobal('msginfoValidade', 'Não há produtos no histórico para gerar PDF.', 'erro'); return; }
    const dg = new Date(); const dia = _fmt2(dg.getDate()); const mes = _fmt2(dg.getMonth() + 1); const ano = dg.getFullYear();
    const mX = 10; const lp = doc.internal.pageSize.width; let y = _pdfCabecalho(doc, 'Controle de Validade');
    doc.text(`Colaborador: ${nome} | Setor: ${setor} | Corredor: ${corredor}`, mX + 1, y - 3); y += 4;
    const ho = historico.slice().sort((a, b) => { const dA = a.dataValidade ? new Date(a.dataValidade) : new Date(8640000000000000); const dB = b.dataValidade ? new Date(b.dataValidade) : new Date(8640000000000000); return dA - dB; });
    const tb = ho.map(item => {
        const q = parseBRNumber(item.quantidade) || 0; const cm = parseBRNumber(item['CUSTOMEDIO R$'] || item['CUSTOMEDIO R $']) || 0;
        const vt = (q * cm).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        let st = '--';
        if (item.dataValidade) { const hoje = new Date(); const val = new Date(item.dataValidade); hoje.setHours(0, 0, 0, 0); val.setHours(0, 0, 0, 0); const d = Math.ceil((val - hoje) / (1000 * 60 * 60 * 24)); if (d < 0) st = 'Vencido'; else if (d <= 60) st = 'Crítico'; else if (d <= 90) st = 'Atenção'; else st = 'Ok'; }
        return [item.codigoReduzido, item.descricao, q || '--', item.dataValidade ? new Date(item.dataValidade).toLocaleDateString('pt-BR') : '--', cm.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), vt, st];
    });
    doc.autoTable({ startY: y, head: [['Cód. Reduzido', 'Descrição do Produto', 'Quantidade', 'Data Validade', 'Custo Médio R$', 'Valor Total R$', 'Status']], body: tb, styles: { fontSize: 9, cellPadding: 3, halign: 'center', valign: 'middle' }, headStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: 'bold' }, margin: { left: mX, right: mX }, columnStyles: { 1: { halign: 'left' } } });
    _pdfRodape(doc);
    doc.save(`historico_controle_validade_${dia}_${mes}_${ano}.pdf`);
    msgGlobal('msginfoValidade', 'PDF gerado com sucesso!', 'sucesso');
}

// CALCULAR DDE
const DB_NAME = 'ExcelDB', DB_VERSION = 1, STORE_NAME = 'planilha DDE';

function abrirDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = ev => { const db = ev.target.result; if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME); };
        req.onsuccess = ev => resolve(ev.target.result); req.onerror = ev => reject(ev.target.error);
    });
}

async function salvarNoIndexedDB(dados) {
    const db = await abrirDB(); const tx = db.transaction(STORE_NAME, 'readwrite'); const store = tx.objectStore(STORE_NAME);
    store.clear(); Object.keys(dados).forEach(n => store.put(dados[n], n)); store.put({ dataUpload: new Date().toISOString() }, '__meta__');
    return new Promise((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onerror = ev => reject(ev.target.error); });
}

async function obterDataUpload() {
    const db = await abrirDB(); const tx = db.transaction(STORE_NAME, 'readonly'); const store = tx.objectStore(STORE_NAME);
    return new Promise(resolve => { const req = store.get('__meta__'); req.onsuccess = () => resolve(req.result?.dataUpload || null); });
}

async function lerTodasPlanilhas() {
    const db = await abrirDB(); const tx = db.transaction(STORE_NAME, 'readonly'); const store = tx.objectStore(STORE_NAME);
    return new Promise(resolve => {
        const resultado = {}; const cursor = store.openCursor();
        cursor.onsuccess = ev => { const cur = ev.target.result; if (cur) { resultado[cur.key] = cur.value; cur.continue(); } else resolve(resultado); };
    });
}

function converterDDE() {
    const input = document.getElementById('fileInputDDE'); const file = input.files[0];
    if (file) msgGlobal('msginfoDDE', 'Carregando arquivo Excel, aguarde...', 'sucesso');
    const reader = new FileReader();
    reader.onload = async ev => {
        const data = new Uint8Array(ev.target.result); const workbook = XLSX.read(data, { type: 'array' }); let resultadoFinal = {};
        workbook.SheetNames.forEach(sn => {
            const ws = workbook.Sheets[sn]; if (!ws || !ws['!ref']) { resultadoFinal[sn] = []; return; }
            const json = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, blankrows: true });
            let filial = (json[3]?.[3]) || ''; filial = filial.replace(/MATEUS SUPERMERCADOS S\.A\./i, '').trim();
            document.getElementById('filialDDE').textContent = `Filial: ${filial}`; localStorage.setItem('filialDDE', filial);
            for (let i = 1; i < json.length; i++) { const v = json[i][2]; if (typeof v === 'string' && v.includes('-')) { const idx = v.indexOf('-'); json[i][1] = v.slice(0, idx).trim(); json[i][2] = v.slice(idx + 1).trim(); } }
            resultadoFinal[sn] = json;
        });
        await salvarNoIndexedDB(resultadoFinal); await atualizarDataUploadUI();
        setTimeout(() => msgGlobal('msginfoDDE', 'Arquivo excel enviado com sucesso!', 'sucesso'), 600); input.value = '';
    };
    reader.readAsArrayBuffer(file);
}

async function atualizarDataUploadUI() {
    const d = await obterDataUpload(); if (!d) return;
    document.getElementById('dataUploadDDE').innerHTML = `<small>Último envio: ${new Date(d).toLocaleString('pt-BR')}</small>`;
}

window.addEventListener('DOMContentLoaded', async () => {
    const f = localStorage.getItem('filialDDE'); if (f) document.getElementById('filialDDE').textContent = `Filial: ${f}`;
    await atualizarDataUploadUI();
});

const inputBuscarDDE = document.getElementById('codigoBuscarDDE');
const containerDDE = document.getElementById('produtoInfoDDE');
const contadorDDE = document.getElementById('contadorProdutosDDE');
const detalheDDE = document.getElementById('produtoDetalheCalculadoraDDE');
const ITENS_POR_PAGINA = 10;
let resultadosDDE = [], paginaAtualDDE = 0, timerBuscaDDE = null;
const TEMPO_ESPERA = 700;

async function buscarProdutosDDE(filtro) {
    const db = await abrirDB(); const termo = filtro.trim().toLowerCase(); if (termo.length < 2) return [];
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly'); const store = tx.objectStore(STORE_NAME); const resultados = [];
        store.openCursor().onsuccess = ev => {
            const cursor = ev.target.result;
            if (!cursor) { if (!resultados.length && termo !== '') msgGlobal('msginfoDDE', 'Nenhum produto encontrado', 'erro'); resolve(resultados); return; }
            if (cursor.key === '__meta__') { cursor.continue(); return; }
            const sheet = cursor.value; if (!Array.isArray(sheet)) { cursor.continue(); return; }
            sheet.slice(1).forEach(linha => { if (linha[1]) { const codigo = String(linha[1]).trim(); const nome = linha[2] ? String(linha[2]).trim() : ''; if (codigo === termo || nome.toLowerCase().includes(termo)) resultados.push({ codigo, nome }); } });
            cursor.continue();
        };
        tx.onerror = () => reject('Erro ao ler dados do IndexedDB');
    });
}

function renderizarResultadosDDE() {
    containerDDE.innerHTML = '';
    if (!resultadosDDE.length) { containerDDE.style.display = 'none'; contadorDDE.style.display = 'none'; return; }
    contadorDDE.style.display = 'block'; contadorDDE.textContent = `Produtos encontrados: ${resultadosDDE.length}`; containerDDE.style.display = 'block';
    const inicio = paginaAtualDDE * ITENS_POR_PAGINA; const pagina = resultadosDDE.slice(inicio, inicio + ITENS_POR_PAGINA);
    const lista = document.createElement('ul'); lista.className = 'listaProdutos';
    pagina.forEach(produto => {
        const p = document.createElement('p');
        p.innerHTML = `<span class="nomeProduto"><strong>${produto.codigo} - </strong>${produto.nome}</span>`;
        p.querySelector('.nomeProduto').addEventListener('click', () => { inputBuscarDDE.value = `${produto.codigo} - ${produto.nome}`; containerDDE.style.display = 'none'; contadorDDE.style.display = 'none'; mostrarDetalhesProduto(produto.codigo); msgGlobal('msginfoDDE', 'Produto encontrado com sucesso!', 'sucesso'); });
        lista.appendChild(p);
    });
    containerDDE.appendChild(lista);
    const totalPaginas = Math.ceil(resultadosDDE.length / ITENS_POR_PAGINA);
    if (resultadosDDE.length >= 20) {
        const nav = document.createElement('div'); nav.className = 'buttonsContainerInfoLista';
        const mkBtn = (txt, dis, fn) => { const b = document.createElement('button'); b.textContent = txt; b.disabled = dis; b.onclick = fn; b.className = 'btnContainer'; return b; };
        nav.appendChild(mkBtn('Voltar', paginaAtualDDE === 0, () => { paginaAtualDDE--; renderizarResultadosDDE(); }));
        nav.appendChild(mkBtn('Próximo', paginaAtualDDE >= totalPaginas - 1, () => { paginaAtualDDE++; renderizarResultadosDDE(); }));
        containerDDE.appendChild(nav);
    }
}

let ultimaDecisao = null;

function calcularStatusShelfLife() {
    const dp = document.getElementById('dataProducaoDDE')?.value; const dv = document.getElementById('dataValidadeDDE')?.value;
    if (!dp || !dv) return { percentual: null, status: '--' };
    const inicio = new Date(`${dp}T00:00:00`); const fim = new Date(`${dv}T00:00:00`); const hoje = new Date();
    const slt = Math.ceil((fim - inicio) / (1000 * 60 * 60 * 24)); const dr = Math.ceil((fim - hoje) / (1000 * 60 * 60 * 24));
    if (slt <= 0 || dr < 0) return { percentual: 0, status: '⚠ Vencido' };
    const pct = Math.floor((dr / slt) * 100);
    return { percentual: pct, status: pct > 69 ? '✅ Aceitar entrega' : pct >= 60 ? '⚠ Receber com cuidado' : '🚫 Recusar entrega' };
}

function atualizarMensagemRecebimento(decisao) {
    const el = document.getElementById('msgAlertaDDE'); if (!el) return;
    ultimaDecisao = decisao;
    if (decisao.status === 'recusar') el.innerHTML = '<ul>🚫 Recusar entrega</ul>';
    else if (decisao.status === 'atencao') el.innerHTML = '<li>Ausência de venda média válida.</li><li>Estoque sistêmico inconsistente.</li><li>Receber com atenção.</li>';
    else el.innerHTML = '<ul>✅ Aceitar entrega</ul>';
}

function atualizarRecebimento(produto) { atualizarMensagemRecebimento(decidirRecebimento(produto)); }

function atualizarShelfLifeUI() {
    const info = calcularStatusShelfLife();
    const se = document.querySelector('[data-shelflife]'); const st = document.querySelector('[data-status-shelflife]');
    if (se) se.textContent = info.percentual !== null ? `${info.percentual}%` : '--';
    if (st) st.textContent = info.status;
    if (window.produto) atualizarRecebimento(window.produto);
}

async function mostrarDetalhesProduto(codigo) {
    const todasPlanilhas = await lerTodasPlanilhas();
    msgGlobal('msginfoDDE', 'Produto encontrado com sucesso!', 'sucesso');
    detalheDDE.innerHTML = '';
    for (const np in todasPlanilhas) {
        const planilha = todasPlanilhas[np];
        planilha.slice(1).forEach(linha => {
            if (String(linha[1]).trim() === String(codigo)) {
                const produto = { codigo: linha[1], nome: linha[2], valorEstoque: Number(linha[6]) || 0, DDE: Number(linha[8]) || 0, idade: Number(linha[9]) || 1, metaIdade: Number(linha[11]) || 0 };
                const de = JSON.parse(localStorage.getItem('dadosExcel')) || [];
                const custo = parseBRNumber(de.find(p => p.codigo === produto.codigo)?.['CUSTOMEDIO R$']) ?? 0;
                const fornecedor = de.find(p => p.codigo === produto.codigo)?.['FORNECEDOR'] ?? '--';
                window.produto = produto; detalheDDE.style.display = 'block';
                const cm = Number(custo) || 0;
                let estCalc = cm > 0 ? (Number(produto.valorEstoque) || 0) / cm : 0;
                produto.estoqueBase = estCalc; produto.DDEBase = produto.DDE; produto.custoMedio = cm;
                detalheDDE.innerHTML = `<div class="produtoDetalheCalculadoraDDE"><ul><strong>${produto.nome}</strong></ul><div class="containerInfoLabels"><div><p>Cód. Reduzido</p><p><strong>${produto.codigo}</strong></p></div><div><p>Custo Médio</p><p><strong>R$ ${Number(custo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></p></div></div><hr><div class="containerInfoLabels"><div><p>Novo DDE</p><p><strong id="novoDDE">0</strong></p></div><div id="divDDE"><p>DDE</p><p><strong>${produto.DDE.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong></p></div></div><div class="containerInfoLabels"><div><p>Novo Estoque</p><p><strong id="novoEstoque">0</strong></p></div><div id="divDDE"><p>Estoque</p><p><strong>${estCalc.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong></p></div></div><div class="containerInfoLabels"><div><p>Status DDE</p><p id="msgAlertaDDE"></p></div><div id="divDDE"><p>Idade</p><p><strong>${produto.idade}</strong></p></div></div><div class="containerInfoLabels"><div><p>Status Shelf Life</p><p><strong data-status-shelflife>--</strong></p></div><div><p>Shelf Life</p><p><strong data-shelflife>--</strong></p></div></div><hr><div class="containerInfoLabels"><div><p>Fornecedor</p><p><strong>${fornecedor}</strong></p></div></div></div>`;
                atualizarShelfLifeUI();
                const inputDDE = document.getElementById('entradaDDE');
                const neEl = document.getElementById('novoEstoque'); const ndEl = document.getElementById('novoDDE');
                function atualizarEstoque(v = 0) {
                    if (v <= 0) { neEl.textContent = '0'; ndEl.textContent = '0'; return; }
                    if (produto.DDEBase < 1) { neEl.textContent = '0'; ndEl.textContent = '0'; produto.novoDDE = 0; document.getElementById('msgAlertaDDE').innerHTML = '<li>Ausência de venda média válida.</li><li>Estoque sistêmico inconsistente.</li><li>Receber com atenção.</li>'; return; }
                    const ne = produto.estoqueBase + v; const nd = produto.estoqueBase === 0 ? 0 : produto.DDEBase * (ne / produto.estoqueBase);
                    neEl.textContent = ne.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
                    ndEl.textContent = Math.floor(nd).toLocaleString('pt-BR'); produto.novoDDE = Math.floor(nd); atualizarRecebimento(produto);
                }
                inputDDE.addEventListener('input', () => atualizarEstoque(Number(inputDDE.value.replace(/\./g, '').replace(',', '.')) || 0));
                contadorDDE.style.display = 'none';
            }
        });
    }
}

['dataProducaoDDE', 'dataValidadeDDE'].forEach(id => { const el = document.getElementById(id); if (el) { el.removeEventListener('change', atualizarShelfLifeUI); el.addEventListener('change', atualizarShelfLifeUI); } });

function decidirRecebimento(produto) {
    const shelf = calcularStatusShelfLife(); const dde = produto.novoDDE ?? produto.DDE;
    if (shelf.status.includes('Recusar') || dde > produto.metaIdade) return { status: 'recusar' };
    if (produto.estoque < 1 || produto.DDE < 1) return { status: 'atencao' };
    return { status: 'aceitar' };
}

document.getElementById('btnCalcularDDE')?.addEventListener('click', () => {
    if (!window.produto) return;
    const ne = Number(document.getElementById('novoEstoque').textContent.replace(/\./g, '').replace(',', '.')) || 0;
    const nd = Number(document.getElementById('novoDDE').textContent.replace(/\./g, '').replace(',', '.')) || 0;
    const obs = document.getElementById('obsDDE');
    window.produto.novoEstoque = ne; window.produto.novoDDE = nd;
    window.produto.statusDDE = document.getElementById('msgAlertaDDE')?.textContent || null;
    window.produto.shelfLife = document.querySelector('[data-shelflife]')?.textContent || null;
    window.produto.statusShelfLife = document.querySelector('[data-status-shelflife]')?.textContent || null;
    document.querySelectorAll('#calculadoraDDE .buscaContainer input').forEach(inp => { inp.value = ''; inp.dispatchEvent(new Event('input')); });
    salvarHistoricoDDE(window.produto); msgGlobal('msginfoDDE', 'Produto adicionado com sucesso!', 'sucesso');
    if (obs) obs.value = ''; mostrarHistoricoDDE();
});

window.addEventListener('load', () => mostrarHistoricoDDE());

function salvarHistoricoDDE(produto) {
    const ha = JSON.parse(localStorage.getItem('HistoricoDDE')) || [];
    const obs = document.getElementById('obsDDE')?.value || '';
    ha.push({ timestamp: new Date().toISOString(), codigo: produto.codigo, nome: produto.nome, categoria: produto.categoria, estoque: produto.estoqueBase, DDE: produto.DDEBase, idade: produto.idade, custoMedio: produto.custoMedio, novoEstoque: produto.novoEstoque ?? 0, novoDDE: produto.novoDDE ?? 0, shelfLife: produto.shelfLife ?? null, statusShelfLife: produto.statusShelfLife ?? null, statusDDE: normalizarStatusDDE(produto.statusDDE) ?? null, observacaoDDE: obs });
    localStorage.setItem('HistoricoDDE', JSON.stringify(ha));
}

function mostrarHistoricoDDE() {
    const historico = JSON.parse(localStorage.getItem('HistoricoDDE')) || [];
    const container = document.getElementById('HistoricoDDE');
    const btnR = document.getElementById('btnResetHistoricoDDE'); const pdfD = document.getElementById('pdfCalcularDDE');
    if (!historico.length) { container.innerHTML = ''; detalheDDE.style.display = 'none'; if (btnR) btnR.style.display = 'none'; if (pdfD) pdfD.style.display = 'none'; return; }
    if (btnR) btnR.style.display = 'flex'; if (pdfD) pdfD.style.display = 'flex'; container.innerHTML = '';
    historico.forEach((item, index) => {
        container.innerHTML += `<div class="historicoDDE"><div class="containerInfoLabels"><strong>${index + 1}º ${item.nome}</strong><button class="btnResetProdutoDDE" data-id="${item.timestamp}">X</button></div><div class="dataHistoricoDDE"><p>${new Date(item.timestamp).toLocaleString('pt-BR')}</p></div><hr><div class="containerInfoLabels"><div><p>Cód. Reduzido</p>${item.codigo}</div><hr><div><p>Estoque</p>${formatBRNumber(item.estoque)}</div><hr><div><p>DDE</p>${Number(item.DDE).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div><hr><div><p>Novo Estoque</p>${formatBRNumber(item.novoEstoque)}</div><hr><div><p>Novo DDE</p>${Number(item.novoDDE).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div></div><div class="containerInfoLabels"><div><p>Status DDE</p>${normalizarStatusDDE(item.statusDDE) || '--'}</div><hr><div><p>Status Shelf Life</p>${item.statusShelfLife || '--'}</div><hr><div><p>Shelf Life %</p>${item.shelfLife || '--'}</div></div><div class="containerInfoLabels"><div><p>Observação</p>${item.observacaoDDE || '--'}</div></div></div>`;
    });
    document.querySelectorAll('.btnResetProdutoDDE').forEach(btn => { btn.addEventListener('click', () => { msgGlobal('msginfoDDE', 'Produto removido com sucesso!', 'sucesso'); removerDoHistoricoDDE(btn.dataset.id); }); });
}

function removerDoHistoricoDDE(id) {
    localStorage.setItem('HistoricoDDE', JSON.stringify((JSON.parse(localStorage.getItem('HistoricoDDE')) || []).filter(item => item.timestamp != id)));
    mostrarHistoricoDDE();
}

function removerEmojis(texto = '') { return texto.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim(); }

function btnPDFDDE() {
    const { jsPDF } = window.jspdf; const doc = new jsPDF();
    const historico = JSON.parse(localStorage.getItem('HistoricoDDE')) || [];
    const dg = new Date(); const dia = _fmt2(dg.getDate()); const mes = _fmt2(dg.getMonth() + 1); const df = `${dia}_${mes}_${dg.getFullYear()}`;
    const mX = 10; let y = _pdfCabecalho(doc, 'Histórico DDE');
    const ag = historico.reduce((acc, item) => { if (!acc[item.codigo]) acc[item.codigo] = { nome: item.nome, itens: [] }; acc[item.codigo].itens.push(item); return acc; }, {});
    Object.keys(ag).sort().forEach(codigo => {
        const g = ag[codigo];
        doc.setFontSize(12); doc.setFont('sans-serif', 'bold'); doc.text(`${codigo} - ${g.nome}`, mX, y); y += 6;
        doc.setFontSize(10); doc.setFont('sans-serif', 'normal'); doc.text(`Total de registros: ${g.itens.length}`, mX, y); y += 4;
        doc.autoTable({ startY: y + 2, head: [['N°', 'Código', 'Estoque', 'DDE Atual', 'Novo Estoque', 'Novo DDE', 'Status DDE', 'Status Shelf Life', 'Shelf Life', 'Observação']], body: g.itens.map((item, i) => [`${i + 1}°`, item.codigo, Number(item.estoque).toLocaleString('pt-BR', { maximumFractionDigits: 0 }), Number(item.DDE).toLocaleString('pt-BR', { maximumFractionDigits: 0 }), Number(item.novoEstoque).toLocaleString('pt-BR', { maximumFractionDigits: 0 }), Number(item.novoDDE).toLocaleString('pt-BR', { maximumFractionDigits: 0 }), removerEmojis(normalizarStatusDDE(item.statusDDE)) || '--', removerEmojis(item.statusShelfLife) || '--', item.shelfLife || '--', item.observacaoDDE || '--']), styles: { fontSize: 9, cellPadding: 3, halign: 'center', valign: 'middle' }, headStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: 'bold' }, margin: { left: mX, right: mX } });
        y = doc.lastAutoTable.finalY + 8;
    });
    _pdfRodape(doc);
    const pdfBlob = doc.output('blob');
    const tx = dbPDF.transaction('pdfs', 'readonly'); const store = tx.objectStore('pdfs'); const req = store.getAll();
    req.onsuccess = () => {
        const todos = req.result || []; const seq = todos.filter(p => p.nome.includes(`_historico_DDE_${df}`)).length + 1;
        const nome = `${seq}_historico_DDE_${df}.pdf`;
        const tw = dbPDF.transaction('pdfs', 'readwrite');
        tw.objectStore('pdfs').add({ nome, data: df, blob: pdfBlob });
        tw.oncomplete = () => { const url = URL.createObjectURL(pdfBlob); const a = document.createElement('a'); a.href = url; a.download = nome; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); msgGlobal('msginfoDDE', 'PDF gerado com sucesso!', 'sucesso'); listarPDFsDDE(); };
        tw.onerror = () => msgGlobal('msginfoDDE', 'Erro ao salvar PDF', 'erro');
    };
    req.onerror = () => msgGlobal('msginfoDDE', 'Erro ao consultar PDFs existentes', 'erro');
}

function normalizarStatusDDE(status) {
    const t = 'Ausência de venda média válida. Estoque sistêmico inconsistente. Receber com atenção.';
    return (status || '').replace(/\s+/g, ' ').trim() === t ? 'Ruptura' : status;
}

let dbPDF;
function abrirDBPDF() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open('PDF_DDE_DB', 1);
        req.onupgradeneeded = ev => { const db = ev.target.result; if (!db.objectStoreNames.contains('pdfs')) db.createObjectStore('pdfs', { keyPath: 'id', autoIncrement: true }); };
        req.onsuccess = ev => { dbPDF = ev.target.result; resolve(dbPDF); }; req.onerror = () => reject('Erro ao abrir IndexedDB');
    });
}

function listarPDFsDDE() {
    const container = document.getElementById('itensPDFDDE'); container.innerHTML = `<button id="btnFechar" class="btnContainer" title="Fechar">X</button>`;
    document.getElementById('btnFechar').addEventListener('click', () => showPage('calculadoraDDE'));
    const tx = dbPDF.transaction('pdfs', 'readonly'); let tem = false;
    tx.objectStore('pdfs').openCursor().onsuccess = ev => {
        const cursor = ev.target.result;
        if (cursor) {
            tem = true; const pdf = cursor.value; const div = document.createElement('div'); div.className = 'pdfItem';
            div.innerHTML = `<small>Gerado em: ${pdf.data.replaceAll('_', '/')}</small><div><strong>${pdf.nome}</strong><div class="btnButtonPageDownDDE"><button title="Baixar"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 512 512"><path d="M336 176h40a40 40 0 0140 40v208a40 40 0 01-40 40H136a40 40 0 01-40-40V216a40 40 0 0140-40h40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M176 272l80 80 80-80M256 48v288"/></svg><p>Baixar</p></button></div></div>`;
            div.querySelector('.btnButtonPageDownDDE button').addEventListener('click', () => { const url = URL.createObjectURL(pdf.blob); const a = document.createElement('a'); a.href = url; a.download = pdf.nome; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); });
            container.appendChild(div); cursor.continue();
        } else if (!tem) { const p = document.createElement('p'); p.textContent = 'Nehum histórico encontrado.'; container.appendChild(p); }
    };
}

document.addEventListener('DOMContentLoaded', async () => { await abrirDBPDF(); listarPDFsDDE(); });

function handleInputDDE() {
    clearTimeout(timerBuscaDDE);
    timerBuscaDDE = setTimeout(async () => {
        const valor = inputBuscarDDE.value.trim();
        if (!valor) { resultadosDDE = []; paginaAtualDDE = 0; renderizarResultadosDDE(); detalheDDE.innerHTML = ''; return; }
        try {
            resultadosDDE = await buscarProdutosDDE(valor); paginaAtualDDE = 0;
            const pe = resultadosDDE.find(p => p.codigo === valor);
            if (pe) { inputBuscarDDE.value = `${pe.codigo} - ${pe.nome}`; resultadosDDE = []; paginaAtualDDE = 0; containerDDE.style.display = 'none'; mostrarDetalhesProduto(pe.codigo); return; }
            renderizarResultadosDDE();
        } catch (err) { console.error(err); }
    }, TEMPO_ESPERA);
}
inputBuscarDDE.addEventListener('input', handleInputDDE);

// SIMULADO DIÁRIO
let timeoutSimulado, menuSecaoAberto = null, filtroSecaoAtual = '';
const COLUNAS = { SECAO: 0, PRODUTO: 1, BARRAS: 2, QTDEESTOQUETOTAL: 3, CUSTOMEDIO: 4 };

function converterNumeroBR(valor) {
    if (valor === null || valor === undefined || valor === '') return 0;
    if (typeof valor === 'number') return valor;
    const n = parseFloat(String(valor).trim().replace(/\./g, '').replace(',', '.'));
    return isNaN(n) ? 0 : n;
}

function verificarOcultarPdfSimulado() {
    const el = document.getElementById('pdfSimuladoDiário'); if (!el) return;
    const dados = JSON.parse(localStorage.getItem('dadosExcelSimulado')) || [];
    el.style.display = dados.length === 0 ? 'none' : 'flex';
}

document.getElementById('fileInputSimulado').addEventListener('change', async ev => {
    try {
        localStorage.removeItem('quantidadeSimulada'); const file = ev.target.files[0]; if (!file) return;
        const ab = await file.arrayBuffer(); const wb = XLSX.read(ab, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]]; const linhas = XLSX.utils.sheet_to_json(ws, { header: 1 });
        if (linhas.length < 2) return;
        const dados = linhas.slice(1).map(linha => {
            const prod = linha[COLUNAS.PRODUTO] || ''; let codigo = '', nome = '';
            if (prod && prod.includes('-')) { const p = prod.split('-'); codigo = p[0].trim(); nome = p.slice(1).join('-').trim(); }
            return { BARRAS: typeof linha[COLUNAS.BARRAS] === 'string' ? linha[COLUNAS.BARRAS].trim() : String(linha[COLUNAS.BARRAS] || ''), 'CUSTOMEDIO R$': converterNumeroBR(linha[COLUNAS.CUSTOMEDIO] || '0'), QTDEESTOQUETOTAL: converterNumeroBR(linha[COLUNAS.QTDEESTOQUETOTAL] || '0'), SECAO: removerCodigo(linha[COLUNAS.SECAO]) || '', codigo, nome };
        });
        localStorage.setItem('dadosExcelSimulado', JSON.stringify(dados));
        verificarOcultarPdfSimulado(); filtroSecaoAtual = ''; localStorage.removeItem('filtroSecaoAtivo');
        msgGlobal('msgSimuladoDiario', 'Excel enviado com sucesso!', 'sucesso');
        renderizarProdutosPersistidos(dados, JSON.parse(localStorage.getItem('quantidadeSimulada')) || {});
        const agora = new Date(); const te = document.getElementById('timeUploadSimulado');
        if (te) te.textContent = `Último envio: ${agora.toLocaleString().replace(',', ' às')}`;
        localStorage.setItem('ultimoUploadSimulado', agora.toLocaleString().replace(',', ' às'));
    } catch (err) { console.error(err); msgGlobal('msgSimuladoDiario', 'Erro ao carregar excel!', 'erro'); }
});

document.getElementById('codigoBuscarSimulado').addEventListener('input', () => {
    clearTimeout(timeoutSimulado);
    timeoutSimulado = setTimeout(() => {
        const valor = document.getElementById('codigoBuscarSimulado').value.trim();
        const produtos = document.getElementById('produtoHistorico').querySelectorAll('.historicoControleValidade:not(.total-geral)');
        if (!valor) { produtos.forEach(p => p.style.display = ''); return; }
        produtos.forEach(p => {
            const cod = p.querySelector('div p strong')?.textContent?.toLowerCase() || '';
            const nom = p.querySelector('.titleN')?.textContent?.toLowerCase() || '';
            const bar = p.querySelectorAll('div p strong')[1]?.textContent?.toLowerCase() || '';
            p.style.display = (cod.endsWith(valor) || nom.endsWith(valor) || bar.endsWith(valor)) ? '' : 'none';
        });
    }, 300);
});

document.getElementById('btnResetHistoricoSimulado').addEventListener('click', () => {
    localStorage.removeItem('quantidadeSimulada');
    const dados = JSON.parse(localStorage.getItem('dadosExcelSimulado')) || [];
    renderizarProdutosPersistidos(filtroSecaoAtual ? dados.filter(p => p.SECAO === filtroSecaoAtual) : dados, {});
    ['quantidadeSimuladoDiario', 'codigoBuscarSimulado'].forEach(id => { const inp = document.getElementById(id); if (inp) { inp.value = ''; inp.dispatchEvent(new Event('input')); } });
    document.getElementById('btnResetHistoricoSimulado').style.display = dados.length === 0 ? 'none' : 'flex';
    msgGlobal('msgSimuladoDiario', 'Histórico excluído com sucesso!', 'erro');
});

window.addEventListener('DOMContentLoaded', () => {
    const dados = JSON.parse(localStorage.getItem('dadosExcelSimulado')) || [];
    const qs = JSON.parse(localStorage.getItem('quantidadeSimulada')) || {};
    document.getElementById('btnResetHistoricoSimulado').style.display = dados.length === 0 ? 'none' : 'flex';
    const fs = localStorage.getItem('filtroSecaoAtivo'); if (fs) filtroSecaoAtual = fs;
    filtroSecaoAtual ? renderizarProdutosPersistidos(dados.filter(p => p.SECAO === filtroSecaoAtual), qs) : renderizarProdutosPersistidos(dados, qs);
    if (filtroSecaoAtual) atualizarBotaoFiltro(filtroSecaoAtual);
    adicionarEventosEdicao();
    const te = document.getElementById('timeUploadSimulado'); const uu = localStorage.getItem('ultimoUploadSimulado');
    if (te && uu) te.textContent = `Último upload: ${uu}`;
    inicializarFiltroSecao(); verificarOcultarPdfSimulado();
});

function atualizarSimulado() {
    const cb = document.getElementById('codigoBuscarSimulado').value.toLowerCase().trim();
    if (!cb) { msgGlobal('msgSimuladoDiario', 'Digite um código para buscar', 'erro'); return; }
    let qs = parseBRNumber(document.getElementById('quantidadeSimuladoDiario').value) || 0;
    if (isNaN(qs) || qs < 0) qs = 0;
    ['quantidadeSimuladoDiario', 'codigoBuscarSimulado'].forEach(id => { const inp = document.getElementById(id); if (inp) { inp.value = ''; inp.dispatchEvent(new Event('input')); } });
    const dados = JSON.parse(localStorage.getItem('dadosExcelSimulado')) || [];
    const pf = p => { const cod = (p.codigo || '').toLowerCase(); const bar = (p.BARRAS || '').toLowerCase(); return cod === cb || (bar && bar.endsWith(cb)); };
    const pe = dados.filter(pf);
    let qss = JSON.parse(localStorage.getItem('quantidadeSimulada')) || {};
    let chave = pe.find(p => p.codigo)?.codigo?.toLowerCase() || pe[0]?.BARRAS?.toLowerCase() || cb;
    const qe = qss[chave] || 0; const nq = qe + qs; qss[chave] = nq;
    pe.forEach(p => { if (p.BARRAS) { const bl = p.BARRAS.toLowerCase(); if (bl !== chave) qss[bl] = nq; } });
    localStorage.setItem('quantidadeSimulada', JSON.stringify(qss));
    renderizarProdutosPersistidos(filtroSecaoAtual ? dados.filter(p => p.SECAO === filtroSecaoAtual) : dados, qss);
    msgGlobal('msgSimuladoDiario', 'Quantidade atualizada com sucesso!', 'sucesso');
}

function renderizarProdutosPersistidos(dados, quantidadesPorCodigo = {}) {
    const container = document.getElementById('produtoHistorico'); if (!container) return;
    const btnR = document.getElementById('btnResetHistoricoSimulado');
    if (btnR) btnR.style.display = dados.length === 0 ? 'none' : 'flex';
    container.innerHTML = '';
    const ct = document.getElementById('historicoControleValidade2'); if (ct) ct.innerHTML = '';
    const pa = {};
    dados.forEach(produto => {
        const cr = (produto.codigo || '').toLowerCase(); const id = cr || (produto.BARRAS || '').toLowerCase(); if (!id) return;
        if (!pa[id]) {
            pa[id] = { ...produto, QTDEESTOQUETOTAL: Number(produto.QTDEESTOQUETOTAL) || 0, CUSTOMEDIO: Number(produto['CUSTOMEDIO R$']) || 0, codigosBarras: produto.BARRAS ? [produto.BARRAS.toLowerCase()] : [] };
        } else { pa[id].QTDEESTOQUETOTAL += Number(produto.QTDEESTOQUETOTAL) || 0; if (produto.BARRAS) { const bl = produto.BARRAS.toLowerCase(); if (!pa[id].codigosBarras.includes(bl)) pa[id].codigosBarras.push(bl); } if (produto.nome && produto.nome.length > pa[id].nome.length) pa[id].nome = produto.nome; }
    });
    const pr = Object.values(pa).sort((a, b) => b.QTDEESTOQUETOTAL - a.QTDEESTOQUETOTAL);
    let tA = 0, tE = 0, tD = 0;
    const getQ = produto => { const cr = (produto.codigo || '').toLowerCase(); let q = quantidadesPorCodigo[cr] !== undefined ? quantidadesPorCodigo[cr] : (produto.codigosBarras || []).reduce((acc, b) => quantidadesPorCodigo[b] !== undefined ? quantidadesPorCodigo[b] : acc, 0); return q; };
    pr.forEach(p => { tA += p.QTDEESTOQUETOTAL; tE += getQ(p); tD += (getQ(p) - p.QTDEESTOQUETOTAL) * p.CUSTOMEDIO; });
    const tDU = tE - tA; const pct = tA > 0 ? ((tE / tA) * 100).toFixed(2) : 0;
    if (ct) {
        const d1 = document.createElement('div'); d1.className = 'historicoControleValidade total-geral'; d1.setAttribute('data-total-geral', 'true');
        d1.innerHTML = `<div class="btnContainerFilterSimulado"><button type="button" class="btn-filtro-secao"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M32 144h448M112 256h288M208 368h96"/></svg></button><h4>Total Geral</h4><div class="progressCircleContainer"><span class="progressCircle" style="background: conic-gradient(#4caf50 ${pct}%, var(--background-color-porcentagem) ${pct}% 100%);"><span class="progressText" tabindex="0">${pct}%</span></span></div></div><div class="containerInfoLabels"><div><p>Qtde. Sistema</p><p><strong id="totalAtual">${formatBRNumber(tA)}</strong></p></div><div><p>Qtde. Encontrada</p><p><strong id="totalEncontrada">${formatBRNumber(tE)}</strong></p></div><div><p>Divergência Un</p><p><strong>${formatBRNumber(tDU)}</strong></p></div><div><p>Divergência R$</p><p><strong id="totalDivergenciaRS">R$ ${formatBRNumber(tD)}</strong></p></div></div><div class="cotainerInfoLabelsP"><p>${pr.length} produtos adicionados.</p>${filtroSecaoAtual ? `<p>${filtroSecaoAtual}</p>` : '<p>TODOS OS PRODUTOS</p>'}</div>`;
        ct.appendChild(d1);
    }
    pr.forEach(produto => {
        const qa = produto.QTDEESTOQUETOTAL; const q = getQ(produto); const cr = (produto.codigo || '').toLowerCase();
        const div = Math.floor(q - qa); const prc = qa > 0 ? ((q / qa) * 100).toFixed(2) : 0;
        const lb = produto.codigosBarras?.length > 1 ? `<small>(${produto.codigosBarras.length} códigos)</small>` : '';
        const d2 = document.createElement('div'); d2.className = 'historicoControleValidade'; d2.setAttribute('data-codigo', cr); d2.setAttribute('data-secao', produto.SECAO || '');
        d2.innerHTML = `<div class="containerInfoLabels"><div class="titleN">${produto.nome || 'Sem nome'}</div><div class="btnContainerSimulados"><button class="btnEditarProdutoLiquido"><span>✎</span></button><button class="btnResetControleValidade delItemSimuladoDiario">X</button></div><div class="progressCircleContainer"><span class="progressCircle" style="background: conic-gradient(#4caf50 ${prc}%, var(--background-color-porcentagem) ${prc}% 100%);"><span class="progressText" tabindex="0">${prc}%</span></span></div></div><div class="containerInfoLabels"><div><p>Cód. Reduzido</p><p><strong>${produto.codigo || ''}</strong></p></div><div><p>Cód. Barras ${lb}</p><p><strong>${produto.BARRAS || ''}</strong></p></div><div><p>Custo Médio</p><p><strong>R$ ${formatBRNumber(produto.CUSTOMEDIO)}</strong></p></div></div><div class="containerInfoLabels"><div><p>Qtde. Sistema</p><p><strong>${formatBRNumber(qa)}</strong></p></div><div><p>Qtde. Encontrada</p><p><strong>${formatBRNumber(q)}</strong></p></div><div><p>Divergência Un</p><p><strong>${formatBRNumber(div)}</strong></p></div><div><p>Divergência R$</p><p><strong>R$ ${formatBRNumber(div * produto.CUSTOMEDIO)}</strong></p></div></div>`;
        container.appendChild(d2);
    });
    adicionarEventosExclusao(); adicionarEventosEdicao(); inicializarFiltroSecao();
}

function getSecoesUnicas() { const dados = JSON.parse(localStorage.getItem('dadosExcelSimulado')) || []; return [...new Set(dados.filter(p => p.SECAO?.trim()).map(p => p.SECAO))].sort(); }

function criarMenuSecoes(botao) {
    if (menuSecaoAberto) { menuSecaoAberto.remove(); menuSecaoAberto = null; }
    const fx = document.createElement('div'); fx.className = 'filterAllSimulado'; document.body.appendChild(fx);
    const geral = document.querySelector('.btn-filtro-secao'); const secoes = getSecoesUnicas();
    const menu = document.createElement('div'); menu.className = 'menu-flutuante-secoes'; menu.id = 'menuSecoes';
    const itTodos = document.createElement('div'); itTodos.className = 'secoesOpcoes';
    itTodos.onclick = () => { filtrarPorSecao(''); setTimeout(() => fecharMenu(), 50); };
    menu.appendChild(itTodos);
    const svgFiltro = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 400V32l176 80-176 80"/><path d="M256 336c-87 0-175.3 43.2-191.64 124.74C62.39 470.57 68.57 480 80 480h352c11.44 0 17.62-9.43 15.65-19.26C431.3 379.2 343 336 256 336z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/></svg>';
    if (!secoes.length) { const iv = document.createElement('div'); iv.className = 'itemVazioSecoes'; iv.innerHTML = `${svgFiltro}<p></p>`; iv.style.cssText = 'color:var(--font-color-placeholder);font-size:18px'; itTodos.innerHTML = `${svgFiltro}<p></p>`; menu.appendChild(iv); }
    else {
        secoes.forEach(secao => {
            const item = document.createElement('div'); item.className = 'itemSecoesSolo';
            item.style.cssText = `background-color: ${filtroSecaoAtual === secao ? 'var(--background-color-item-selecionado-simulado)' : 'none'};`;
            item.onmouseout = () => { item.style.backgroundColor = filtroSecaoAtual === secao ? 'var(--background-color-item-selecionado-simulado)' : 'none'; };
            item.textContent = secao; item.onclick = () => { filtrarPorSecao(secao); setTimeout(() => fecharMenu(), 50); };
            itTodos.innerHTML = `${svgFiltro}<p>Mostrar Todos</p>`; menu.appendChild(item);
        });
    }
    geral.appendChild(menu); menuSecaoAberto = menu; setTimeout(() => document.addEventListener('click', fecharMenuClickFora), 100);
}

function fecharMenu() { if (menuSecaoAberto) { menuSecaoAberto.remove(); menuSecaoAberto = null; } document.querySelector('.filterAllSimulado')?.remove(); document.removeEventListener('click', fecharMenuClickFora); }
function fecharMenuClickFora(ev) { if (menuSecaoAberto && !menuSecaoAberto.contains(ev.target) && !ev.target.closest('.btnContainerFilterSimulado button')) fecharMenu(); }

function filtrarPorSecao(secao) {
    filtroSecaoAtual = secao; secao ? localStorage.setItem('filtroSecaoAtivo', secao) : localStorage.removeItem('filtroSecaoAtivo');
    const dados = JSON.parse(localStorage.getItem('dadosExcelSimulado')) || [];
    const qs = JSON.parse(localStorage.getItem('quantidadeSimulada')) || {};
    renderizarProdutosPersistidos(secao ? dados.filter(p => p.SECAO === secao) : dados, qs);
    atualizarBotaoFiltro(secao);
}

function atualizarBotaoFiltro(secaoAtiva) {
    document.querySelectorAll('.btnContainerFilterSimulado button').forEach(b => {
        if (secaoAtiva) b.title = `Filtrando: ${secaoAtiva}`; else { b.style.backgroundColor = ''; b.style.color = ''; b.title = 'Filtrar'; }
    });
}

function inicializarFiltroSecao() {
    document.querySelectorAll('.btnContainerFilterSimulado button').forEach(b => {
        const svg = b.querySelector('svg');
        if (svg?.innerHTML.includes('M32 144h448')) { b.removeEventListener('click', handleFiltroClick); b.addEventListener('click', handleFiltroClick); }
    });
}
function handleFiltroClick(ev) { ev.stopPropagation(); menuSecaoAberto ? fecharMenu() : criarMenuSecoes(ev.currentTarget); }

function adicionarEventosExclusao() {
    document.querySelectorAll('.delItemSimuladoDiario').forEach(btn => { btn.removeEventListener('click', handleExcluirItem); btn.addEventListener('click', handleExcluirItem); });
}

function handleExcluirItem(ev) {
    const pc = ev.currentTarget.closest('.historicoControleValidade'); if (!pc) return; const cod = pc.dataset.codigo; if (!cod) return;
    const qs = JSON.parse(localStorage.getItem('quantidadeSimulada')) || {};
    if (qs[cod] !== undefined) delete qs[cod]; localStorage.setItem('quantidadeSimulada', JSON.stringify(qs));
    let dados = JSON.parse(localStorage.getItem('dadosExcelSimulado')) || [];
    dados = dados.filter(p => (p.codigo || '').toLowerCase() !== cod && (p.BARRAS || '').toLowerCase() !== cod);
    localStorage.setItem('dadosExcelSimulado', JSON.stringify(dados));
    renderizarProdutosPersistidos(filtroSecaoAtual ? dados.filter(p => p.SECAO === filtroSecaoAtual) : dados, qs);
    msgGlobal('msgSimuladoDiario', 'Produto removido com sucesso!', 'sucesso');
}

let inputEditandoAtivo = null;
function adicionarEventosEdicao() { document.querySelectorAll('.btnEditarProdutoLiquido').forEach(b => { b.removeEventListener('click', handleEditarItem); b.addEventListener('click', handleEditarItem); }); }

function handleEditarItem(ev) {
    const pc = ev.currentTarget.closest('.historicoControleValidade'); if (!pc) return; const cod = pc.dataset.codigo; if (!cod) return;
    const cils = pc.querySelectorAll('.containerInfoLabels'); let dq = null, sq = null, ps = null;
    for (let i = cils.length - 1; i >= 0; i--) { const d = cils[i]; const ss = d.querySelectorAll('strong'); if (ss.length >= 4) { dq = d; sq = ss[1]; ps = sq.parentNode; break; } }
    if (!dq) { for (let i = cils.length - 1; i >= 0; i--) { const d = cils[i]; if (d.innerText.includes('Qtde. Sistema') && d.innerText.includes('Qtde. Encontrada')) { dq = d; for (const p of d.querySelectorAll('p')) { if (p.innerText.includes('Qtde. Encontrada')) { ps = p; sq = p.querySelector('strong'); break; } } break; } } }
    if (!dq || !sq || !ps) return;
    const vo = parseBRNumber(sq.textContent); const inp = document.createElement('input');
    inp.id = 'inputEditValueSimulado'; inp.type = 'text'; inp.inputMode = 'numeric'; inp.autocomplete = 'off'; inp.value = vo; inp.className = 'inputQuantidadeEditavel';
    inp.style.cssText = 'width:80px;padding:4px;border-radius:4px;text-align:center;font-size:14px;font-weight:bold;background-color:var(--background-color-body)'; inp.min = '0'; inp.step = '1';
    inp.addEventListener('input', function () { const cfg = campos.find(c => c.id === inp.id); formatarNumeroBR(inp, cfg ? cfg.decimais : 3); });
    pc.classList.add('editando'); ps.replaceChild(inp, sq); inputEditandoAtivo = inp; inp.focus(); inp.select();
    const salvar = () => {
        let v = parseBRNumber(inp.value.trim()); if (isNaN(v) || v < 0) v = 0;
        const qs = JSON.parse(localStorage.getItem('quantidadeSimulada')) || {};
        const ch = qs[cod] !== undefined ? cod : Object.keys(qs).find(k => k.toLowerCase() === cod.toLowerCase());
        qs[ch || cod] = v; localStorage.setItem('quantidadeSimulada', JSON.stringify(qs));
        const ns = document.createElement('strong'); ns.textContent = formatBRNumber(v); ps.replaceChild(ns, inp); pc.classList.remove('editando'); inputEditandoAtivo = null;
        const dados = JSON.parse(localStorage.getItem('dadosExcelSimulado')) || [];
        renderizarProdutosPersistidos(filtroSecaoAtual ? dados.filter(p => p.SECAO === filtroSecaoAtual) : dados, qs);
    };
    const cancelar = () => { const ns = document.createElement('strong'); ns.textContent = formatBRNumber(vo); ps.replaceChild(ns, inp); pc.classList.remove('editando'); inputEditandoAtivo = null; };
    inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); salvar(); } else if (ev.key === 'Escape') { ev.preventDefault(); cancelar(); } });
    inp.addEventListener('blur', () => { setTimeout(() => { if (inputEditandoAtivo === inp) salvar(); }, 200); });
}

function gerarPDFSimuladoDiario() {
    const { jsPDF } = window.jspdf; const doc = new jsPDF();
    const dados = JSON.parse(localStorage.getItem('dadosExcelSimulado')) || [];
    const qs = JSON.parse(localStorage.getItem('quantidadeSimulada')) || {};
    if (!dados.length) { if (typeof msgGlobal === 'function') msgGlobal('msgSimuladoDiario', 'Nenhum dado para gerar PDF!', 'erro'); return; }
    const limpTxt = t => { if (!t) return 'Sem Informação'; return t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s]/g, '').trim() || 'Sem Informação'; };
    const pa = {};
    dados.forEach(produto => {
        const cr = (produto.codigo || '').toLowerCase(); const br = (produto.BARRAS || '').toLowerCase(); const id = cr || br; if (!id) return;
        if (!pa[id]) { pa[id] = { ...produto, QTDEESTOQUETOTAL: Number(produto.QTDEESTOQUETOTAL) || 0, CUSTOMEDIO: Number(produto['CUSTOMEDIO R$']) || 0, nome: limpTxt(produto.nome), codigo: limpTxt(produto.codigo), BARRAS: limpTxt(produto.BARRAS), SECAO: limpTxt(produto.SECAO), codigosBarras: br ? [br] : [] }; }
        else { pa[id].QTDEESTOQUETOTAL += Number(produto.QTDEESTOQUETOTAL) || 0; if (br && !pa[id].codigosBarras.includes(br)) pa[id].codigosBarras.push(br); if (produto.nome && produto.nome.length > pa[id].nome.length) pa[id].nome = limpTxt(produto.nome); }
    });
    let pr = Object.values(pa); if (filtroSecaoAtual) pr = pr.filter(p => p.SECAO === filtroSecaoAtual);
    pr.sort((a, b) => b.QTDEESTOQUETOTAL - a.QTDEESTOQUETOTAL);
    const mE = 15, mD = 15; let y = 20;
    const lp = doc.internal.pageSize.width;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.text(`Relatório de Simulado Diário${filtroSecaoAtual ? ` - ${filtroSecaoAtual}` : ''}`, lp / 2, y, { align: 'center' }); doc.setFontSize(10); doc.text('Por Stoxen', lp / 2, y + 6, { align: 'center' }); y += 18; doc.text(new Date().toLocaleString('pt-BR'), lp / 2, y, { align: 'center' }); y += 20;
    const getQ = produto => { const cr = produto.codigo.toLowerCase(); let q = qs[cr] ?? 0; if (!q) { for (const b of produto.codigosBarras) { if (qs[b] !== undefined) { q = qs[b]; break; } } } return q; };
    let tAG = 0, tEG = 0, tDG = 0; pr.forEach(p => { const qa = p.QTDEESTOQUETOTAL; const q = getQ(p); tAG += qa; tEG += q; tDG += (q - qa) * p.CUSTOMEDIO; });
    const tDUG = tEG - tAG; const pctT = tAG > 0 ? ((tEG / tAG) * 100).toFixed(2) : 0;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.text('RESUMO GERAL', mE, y); y += 6;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    doc.text(`Total de Produtos: ${pr.length}`, mE, y); doc.text(`Quantidade no Sistema: ${formatBRNumber(tAG)} un`, mE + 90, y); y += 5;
    doc.text(`Quantidade Encontrada: ${formatBRNumber(tEG)} un`, mE, y); doc.text(`Divergência: ${formatBRNumber(tDUG)} un`, mE + 90, y); y += 5;
    doc.text(`Divergência: R$ ${formatBRNumber(tDG)}`, mE, y); doc.text(`Aproveitamento: ${pctT} %`, mE + 90, y); y += 12;
    const sp = {}; if (filtroSecaoAtual) { sp[filtroSecaoAtual] = pr; } else { pr.forEach(p => { if (!sp[p.SECAO]) sp[p.SECAO] = []; sp[p.SECAO].push(p); }); }
    Object.keys(sp).sort().forEach(secao => {
        if (y > 250) { doc.addPage(); y = 20; }
        const ps = sp[secao]; let tAS = 0, tES = 0, tDS = 0;
        ps.forEach(p => { const qa = p.QTDEESTOQUETOTAL; const q = getQ(p); tAS += qa; tES += q; tDS += (q - qa) * p.CUSTOMEDIO; });
        const tDUS = tES - tAS; const pctS = tAS > 0 ? ((tES / tAS) * 100).toFixed(2) : 0;
        doc.setFont('helvetica', 'bold'); doc.setTextColor(0); doc.setFontSize(12); doc.text(`${secao}`, mE, y); y += 6;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(0, 0, 0);
        doc.text(`Produtos: ${formatBRNumber(ps.length)} un | Sistema: ${formatBRNumber(tAS)} un | Encontrado: ${formatBRNumber(tES)} un | Divergência: ${formatBRNumber(tDUS)} un | Divergência: R$ ${formatBRNumber(tDS)} | ${formatBRNumber(pctS)}%`, lp / 2, y, { align: 'center' }); y += 6;
        doc.autoTable({ startY: y, head: [['Código', 'Produto', 'Cód. Barras', 'Qtde Sistema', 'Qtde Encontrada', 'Custo Médio R$', 'Divergência Un', 'Divergência R$', '%']], body: ps.map(p => { const qa = p.QTDEESTOQUETOTAL; const q = getQ(p); const dv = q - qa; const prc = qa > 0 ? ((q / qa) * 100).toFixed(2) : 0; return [p.codigo, p.nome, p.BARRAS, `${formatBRNumber(qa)}`, `${formatBRNumber(q)}`, `R$ ${formatBRNumber(p.CUSTOMEDIO)}`, `${formatBRNumber(dv)}`, `R$ ${formatBRNumber(dv * p.CUSTOMEDIO)}`, `${prc}%`]; }), styles: { fontSize: 8, cellPadding: 2, halign: 'center' }, margin: { left: mE, right: mD }, theme: 'grid', headStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: 'bold' }, columnStyles: { 1: { halign: 'left' }, 7: { cellWidth: 25 } } });
        y = doc.lastAutoTable.finalY + 10;
    });
    _pdfRodape(doc); if (typeof msgGlobal === 'function') msgGlobal('msgSimuladoDiario', 'PDF gerado com sucesso!', 'sucesso');
    doc.save('relatorio_simulado_diario.pdf');
}

// VISTORIA FILIAL
const setores = { frenteLoja: { nome: 'Frente de Loja', limite: 1 }, saidaEmergencia: { nome: 'Saída de Emergência', limite: 2 }, padaria: { nome: 'Padaria*', limite: 2 }, acougue: { nome: 'Açougue*', limite: 2 }, peixaria: { nome: 'Peixaria*', limite: 2 }, frios: { nome: 'Frios*', limite: 2 }, hortifruti: { nome: 'Hortifrúti*', limite: 2 }, salaHortifruti: { nome: 'Sala de Hortifrúti', limite: 1 }, camarasFrias: { nome: 'Câmara Fria*', limite: 1 }, camarasCongelada: { nome: 'Câmara Congelada*', limite: 1 }, tratamentoPerdas: { nome: 'Tratamento de Perdas*', limite: 1 }, friasFrias: { nome: 'Doca Fria*', limite: 1 }, friasSecas: { nome: 'Doca Seca*', limite: 1 }, deposito: { nome: 'Depósito*', limite: 3 }, areaExterna: { nome: 'Área Externa', limite: 3 }, compactadora: { nome: 'Compactadora', limite: 1 }, semValidadeEtiquete: { nome: 'Sem Crachá Palete*', limite: 4 }, mercadoriaAvariada: { nome: 'Mercadorias Avariadas*', limite: 3 }, falhaPvps: { nome: "Falhas no PVP'S*", limite: 4 } };

const vistoriaContainer = document.querySelector('.vistoriaContainer');
const dbName = 'VistoriaDB', storeName = 'fotosSetores';
let db;

function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName, 1);
        req.onerror = ev => reject(ev.target.error);
        req.onsuccess = ev => { db = ev.target.result; resolve(db); };
        req.onupgradeneeded = ev => { db = ev.target.result; if (!db.objectStoreNames.contains(storeName)) { const s = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true }); s.createIndex('setor', 'setor', { unique: false }); } };
    });
}

async function salvarFoto(setor, dataURL) { return new Promise((resolve, reject) => { const tx = db.transaction(storeName, 'readwrite'); tx.objectStore(storeName).add({ setor, foto: dataURL }); tx.oncomplete = () => resolve(); tx.onerror = ev => reject(ev.target.error); }); }
async function buscarFotos(setor) { return new Promise((resolve, reject) => { const tx = db.transaction(storeName, 'readonly'); const req = tx.objectStore(storeName).index('setor').getAll(IDBKeyRange.only(setor)); req.onsuccess = () => resolve(req.result.map(i => i.foto)); req.onerror = ev => reject(ev.target.error); }); }
async function atualizarFoto(setor, idx, nova) {
    return new Promise(async (resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite'); const store = tx.objectStore(storeName);
        const req = store.index('setor').getAllKeys(IDBKeyRange.only(setor));
        req.onsuccess = () => { const k = req.result[idx]; if (k !== undefined) store.put({ id: k, setor, foto: nova }).onerror = ev => reject(ev.target.error); };
        tx.oncomplete = () => resolve(); tx.onerror = ev => reject(ev.target.error);
    });
}
async function removerFoto(setor, idx) {
    return new Promise(async (resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite'); const store = tx.objectStore(storeName);
        const req = store.index('setor').getAllKeys(IDBKeyRange.only(setor));
        req.onsuccess = () => { const k = req.result[idx]; if (k !== undefined) store.delete(k); };
        tx.oncomplete = () => resolve(); tx.onerror = ev => reject(ev.target.error);
        msgGlobal('msgVistoriaFilial', 'Foto excluída com sucesso!', 'sucesso');
    });
}
async function limparIndexDB() {
    const tx = db.transaction(storeName, 'readwrite'); const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = async () => { req.result.forEach(f => store.delete(f.id)); tx.oncomplete = async () => { await atualizarContadorGeral(); for (const s of Object.keys(setores)) await atualizarContador(s); } };
}

async function atualizarContador(setor, contadorEl) {
    const fotos = await buscarFotos(setor); if (contadorEl) contadorEl.innerHTML = `${fotos.length}/${setores[setor].limite}`;
}

async function atualizarContadorGeral() {
    let tf = 0, tl = 0;
    for (const s of Object.keys(setores)) { const f = await buscarFotos(s); tf += f.length; tl += setores[s].limite; }
    let cg = document.getElementById('contadorGeralFotos');
    if (!cg) { cg = document.createElement('p'); cg.id = 'contadorGeralFotos'; document.body.prepend(cg); }
    cg.textContent = `${tf}/${tl}`;
    const cont = document.getElementById('container');
    let pcc = cont.querySelector('.progressCircleContainerVistoria');
    if (!pcc) { pcc = document.createElement('div'); pcc.className = 'progressCircleContainerVistoria'; cont.prepend(pcc); }
    const pv = tl > 0 ? (tf / tl * 100).toFixed(2) : 0;
    pcc.innerHTML = `<div id="progressCircleContainerVistoria"></div><span class="progressVistoria" style="background: linear-gradient(90deg, #00661a, #4caf50 ${pv}%, var(--background-color-porcentagem) ${pv}% 100%);"><span class="progressTextVistoria" tabindex="0">${String(pv).replace('.', ',')}%</span></span>`;
    const pdfV = document.getElementById('pdfVistoriaFilial'); if (pdfV) pdfV.style.display = tf > 20 ? 'flex' : 'none';
}

async function rotacionarImagem(dataURL, angulo) {
    return new Promise((resolve, reject) => {
        const img = new Image(); img.onerror = reject;
        img.onload = () => {
            const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
            const [w, h] = (angulo === 90 || angulo === 270) ? [img.height, img.width] : [img.width, img.height];
            canvas.width = w; canvas.height = h; ctx.save(); ctx.translate(w / 2, h / 2); ctx.rotate((angulo * Math.PI) / 180);
            ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height); ctx.restore();
            resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        img.src = dataURL;
    });
}

const svgCam = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 512 512"><path d="M350.54 148.68l-26.62-42.06C318.31 100.08 310.62 96 302 96h-92c-8.62 0-16.31 4.08-21.92 10.62l-26.62 42.06C155.85 155.23 148.62 160 140 160H80a32 32 0 00-32 32v192a32 32 0 0032 32h352a32 32 0 0032-32V192a32 32 0 00-32-32h-59c-8.65 0-16.85-4.77-22.46-11.32z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><circle cx="256" cy="272" r="80" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M124 158v-22h-24v22"/></svg>`;
const svgGal = `<svg xmlns="http://www.w3.org/2000/svg" class="viewPhotos" width="24" height="24" viewBox="0 0 512 512"><rect x="48" y="80" width="416" height="352" rx="48" ry="48" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32"/><circle cx="336" cy="176" r="32" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path d="M304 335.79l-90.66-90.49a32 32 0 00-43.87-1.3L48 352M224 432l123.34-123.34a32 32 0 0143.11-2L464 368" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>`;

Object.keys(setores).forEach(setor => {
    const si = setores[setor]; const sd = document.createElement('div'); sd.className = 'sectorContainer';
    const btn = document.createElement('div'); btn.id = setor; btn.className = 'viewPhotos'; btn.innerHTML = svgCam;
    const ts = document.createElement('div'); ts.className = 'titleSec'; ts.innerHTML = `<strong>${si.nome}</strong>`;
    const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.capture = 'environment'; input.style.display = 'none';
    const p = document.createElement('div'); p.className = 'vistoriaObsContainer';
    const ce = document.createElement('p'); ce.textContent = `0/${si.limite}`;
    const obs = document.createElement('input'); obs.type = 'text'; obs.placeholder = 'Observações (Opcional)';
    const vi = document.createElement('div'); vi.className = 'viewPhotos'; vi.innerHTML = svgGal;
    p.appendChild(obs); p.appendChild(btn); p.appendChild(vi);
    sd.appendChild(ts); sd.appendChild(input); sd.appendChild(p);
    vistoriaContainer.appendChild(sd); ts.appendChild(ce);
    openDB().then(() => atualizarContador(setor, ce));

    let cameraStream = null, cameraActive = false, currentOrientation = 0, gyroscopeActive = false;

    function checkGyroscopeSupport() { return typeof DeviceOrientationEvent !== 'undefined' ? typeof DeviceOrientationEvent.requestPermission === 'function' ? 'ios' : 'android' : 'unsupported'; }
    async function requestGyroscopePermission() {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            try { const ps = await DeviceOrientationEvent.requestPermission(); if (ps === 'granted') { window.addEventListener('deviceorientation', handleOrientation); gyroscopeActive = true; return true; } gyroscopeActive = false; return false; }
            catch (e) { gyroscopeActive = false; return false; }
        } else { window.addEventListener('deviceorientation', handleOrientation); gyroscopeActive = true; return true; }
    }
    function handleOrientation(ev) { const g = ev.gamma, b = ev.beta; if (Math.abs(g) > 45) currentOrientation = g > 0 ? 90 : 270; else if (Math.abs(b) > 120) currentOrientation = 180; else currentOrientation = 0; }
    async function startGyroscope() { try { const ok = await requestGyroscopePermission(); if (!ok && window.screen.orientation) currentOrientation = window.screen.orientation.angle; return ok; } catch (e) { gyroscopeActive = false; return false; } }

    btn.addEventListener('click', async () => {
        const fotos = await buscarFotos(setor); if (fotos.length >= si.limite) { msgGlobal('msgVistoriaFilial', `Limite atingido para ${si.nome}`, 'erro'); return; }
        if (cameraActive) return; try { await abrirCamera(); } catch (e) { msgGlobal('msgVistoriaFilial', 'Câmera permissão negada', 'erro'); }
    });

    async function abrirCamera() {
        await startGyroscope();
        const devs = await navigator.mediaDevices.enumerateDevices(); const vds = devs.filter(d => d.kind === 'videoinput'); const rc = vds.find(d => /back|traseira|rear/i.test(d.label));
        const constraints = { video: rc ? { deviceId: { exact: rc.deviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } } : { width: { ideal: 1920 }, height: { ideal: 1080 } } };
        const stream = await navigator.mediaDevices.getUserMedia(constraints); cameraStream = stream; cameraActive = true;
        let vcc = document.getElementById('viewCameraContainer');
        if (!vcc) { vcc = document.createElement('div'); vcc.id = 'viewCameraContainer'; vcc.className = 'viewCameraContainer'; document.body.appendChild(vcc); }
        vcc.style.display = 'flex'; vcc.innerHTML = '';
        const video = document.createElement('video'); video.srcObject = stream; video.autoplay = true; video.playsInline = true; video.style.cssText = 'border-radius:5px;position:fixed;height:100vh';
        const oi = document.createElement('div'); oi.id = 'orientationIndicator'; oi.style.cssText = 'position:fixed;top:20px;left:20px;background-color:rgba(0,0,0,0.7);color:white;padding:5px 10px;border-radius:5px;font-size:12px;z-index:10000;font-family:monospace';
        const bcc = document.createElement('div'); bcc.id = 'buttonContainerCamera';
        vcc.appendChild(oi); vcc.appendChild(video); vcc.appendChild(bcc);
        const svgs = { cam: `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 512 512"><path d="M350.54 148.68l-26.62-42.06C318.31 100.08 310.62 96 302 96h-92c-8.62 0-16.31 4.08-21.92 10.62l-26.62 42.06C155.85 155.23 148.62 160 140 160H80a32 32 0 00-32 32v192a32 32 0 0032 32h352a32 32 0 0032-32V192a32 32 0 00-32-32h-59c-8.65 0-16.85-4.77-22.46-11.32z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><circle cx="256" cy="272" r="80" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M124 158v-22h-24v22"/></svg>`, close: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368"/></svg>` };
        const mkB = (cls, html) => { const b = document.createElement('button'); b.className = cls; b.innerHTML = html; return b; };
        const bc = mkB('btnContainer', svgs.cam); const bx = mkB('btnContainer', svgs.close);
        bcc.appendChild(bc); bcc.appendChild(bx);

        function fecharCamera() { cameraStream?.getTracks().forEach(t => t.stop()); cameraStream = null; cameraActive = false; vcc.style.display = 'none'; window.removeEventListener('deviceorientation', handleOrientation); gyroscopeActive = false; }

        const ii = setInterval(() => { if (oi) { const dir = currentOrientation === 0 ? 'RETRATO' : currentOrientation === 90 ? 'PAISAGEM DIR' : currentOrientation === 180 ? 'INVERTIDO' : 'PAISAGEM ESQ'; oi.innerHTML = `${dir} ${currentOrientation}°`; } }, 500);

        bc.onclick = async () => {
            const fotos = await buscarFotos(setor); if (fotos.length >= si.limite) { msgGlobal('msgVistoriaFilial', `Limite atingido para ${si.nome}`, 'erro'); fecharCamera(); clearInterval(ii); return; }
            const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
            const vw = video.videoWidth, vh = video.videoHeight; const angle = ((currentOrientation % 360) + 360) % 360;
            const nz = angle === 0 || angle === 180;
            if (nz) { canvas.width = 1920; canvas.height = 1080; const sc = Math.max(1920 / vw, 1080 / vh); const dw = vw * sc, dh = vh * sc; ctx.save(); ctx.fillStyle = 'black'; ctx.fillRect(0, 0, 1920, 1080); ctx.translate(960, 540); if (angle === 180) ctx.rotate(Math.PI); ctx.drawImage(video, -dw / 2, -dh / 2, dw, dh); ctx.restore(); }
            else { const cfg = { 90: { width: vh, height: vw, angle: Math.PI / 2 }, 270: { width: vh, height: vw, angle: -Math.PI / 2 } }[angle] || { width: vh, height: vw, angle: Math.PI / 2 }; canvas.width = cfg.width; canvas.height = cfg.height; ctx.save(); ctx.translate(cfg.width / 2, cfg.height / 2); ctx.rotate(cfg.angle); ctx.drawImage(video, -vw / 2, -vh / 2, vw, vh); ctx.restore(); }
            await salvarFoto(setor, canvas.toDataURL('image/jpeg', 0.9)); await atualizarContador(setor, ce); await atualizarContadorGeral();
            fecharCamera(); clearInterval(ii); msgGlobal('msgVistoriaFilial', 'Foto tirada com sucesso!', 'sucesso');
        };
        bx.onclick = () => { fecharCamera(); clearInterval(ii); };
    }

    input.addEventListener('change', async () => {
        if (!input.files.length) return; const reader = new FileReader();
        reader.onload = async () => { await salvarFoto(setor, reader.result); await atualizarContador(setor, ce); await atualizarContadorGeral(); };
        reader.readAsDataURL(input.files[0]); input.value = '';
    });

    vi.addEventListener('click', async ev => {
        ev.stopPropagation(); const fotos = await buscarFotos(setor);
        if (!fotos.length) return msgGlobal('msgVistoriaFilial', `Nenhuma foto para ${si.nome}`, 'erro');
        let idx = 0, isSaving = false;
        let vcc = document.getElementById('viewCameraContainer');
        if (!vcc) { vcc = document.createElement('div'); vcc.id = 'viewCameraContainer'; vcc.className = 'viewCameraContainer'; document.body.appendChild(vcc); }
        vcc.innerHTML = ''; vcc.style.display = 'flex'; vcc.onclick = ev => { if (ev.target === vcc) vcc.style.display = 'none'; };
        const ic = document.createElement('div'); ic.className = 'imgContainer'; const img = document.createElement('img'); img.src = fotos[idx]; ic.appendChild(img); vcc.appendChild(ic);
        const ctrl = document.createElement('div'); ctrl.className = 'controlsImageVistoria';
        const svgs2 = { prev: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M328 112L184 256l144 144"/></svg>', next: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M184 112l144 144-144 144"/></svg>', remove: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 512 512"><path d="M432 144l-28.67 275.74A32 32 0 01371.55 448H140.46a32 32 0 01-31.78-28.26L80 144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><rect x="32" y="64" width="448" height="80" rx="16" ry="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M312 240L200 352M312 352L200 240"/></svg>', close: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368"/></svg>', rotate: '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="30" height="30" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M320 120l48 48-48 48"/><path d="M352 168H144a80.24 80.24 0 00-80 80v16M192 392l-48-48 48-48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path d="M160 344h208a80.24 80.24 0 0080-80v-16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>' };
        const mkB2 = (html, fn) => { const b = document.createElement('button'); b.innerHTML = html; b.className = 'btnContainer'; b.onclick = fn; return b; };
        ctrl.appendChild(mkB2(svgs2.prev, () => { if (isSaving) return; idx = (idx - 1 + fotos.length) % fotos.length; img.src = fotos[idx]; img.style.transform = 'rotate(0deg)'; }));
        ctrl.appendChild(mkB2(svgs2.next, () => { if (isSaving) return; idx = (idx + 1) % fotos.length; img.src = fotos[idx]; img.style.transform = 'rotate(0deg)'; }));
        ctrl.appendChild(mkB2(svgs2.remove, async () => { if (isSaving) return; await removerFoto(setor, idx); const nf = await buscarFotos(setor); if (!nf.length) { vcc.style.display = 'none'; vcc.innerHTML = ''; } else { idx = Math.min(idx, nf.length - 1); img.src = nf[idx]; img.style.transform = 'rotate(0deg)'; } await atualizarContador(setor, ce); await atualizarContadorGeral(); }));
        const btnRot = mkB2(svgs2.rotate, async () => {
            if (isSaving) return; try {
                isSaving = true; btnRot.disabled = true; btnRot.style.opacity = '0.5';
                const fr = await rotacionarImagem(fotos[idx], 180); await atualizarFoto(setor, idx, fr); fotos[idx] = fr;
                img.style.transition = 'opacity 0.2s ease'; img.style.opacity = '0';
                setTimeout(() => { img.src = fr; img.onload = () => { img.style.opacity = '1'; setTimeout(() => { img.style.transition = ''; }, 200); }; }, 200);
                await atualizarContador(setor); await atualizarContadorGeral();
            }
            catch (e) { img.style.opacity = '1'; img.style.transition = ''; }
            finally { isSaving = false; btnRot.disabled = false; btnRot.style.opacity = '1'; }
        });
        ctrl.appendChild(btnRot); ctrl.appendChild(mkB2(svgs2.close, () => { vcc.style.display = 'none'; vcc.innerHTML = ''; }));
        vcc.appendChild(ctrl);
    });
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await openDB(); await atualizarContadorGeral();
        async function limparSeMeiaNoite() { const a = new Date(); if (a.getHours() === 0 && a.getMinutes() === 0) try { await limparIndexDB(); } catch (e) { console.error('Erro ao limpar IndexDB:', e); } }
        await limparSeMeiaNoite(); const iv = setInterval(limparSeMeiaNoite, 60000);
        window.addEventListener('beforeunload', () => clearInterval(iv));
    } catch (e) { console.error('Erro na inicialização:', e); }
});

async function gerarPDFVistoria() {
    const resp = document.getElementById('prevencaoResponsavel').value.trim().toUpperCase();
    const sel = document.querySelector('select[name="filialVistoria"]');
    const filial = sel.options[sel.selectedIndex].text;
    if (!resp || sel.value === '0') { msgGlobal('msgVistoriaFilial', 'Preencha todos os campos para gerar o PDF!', 'erro'); return; }
    const { jsPDF } = window.jspdf; const doc = new jsPDF();
    const lp = doc.internal.pageSize.getWidth(); const ap = doc.internal.pageSize.getHeight();
    const mX = 5, mY = 15; let y = mY; const esp = 5, fpl = 4, af = 35;
    doc.setFontSize(14); doc.setFont('helvetica', 'bold');
    doc.text('Vistoria de Filial', lp / 2, y, { align: 'center' }); y += 5; doc.text('Por Stoxen', lp / 2, y, { align: 'center' }); y += 10;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal'); const dg = new Date();
    doc.text(`Gerado em: ${dg.toLocaleString('pt-BR')}`, lp / 2, y, { align: 'center' }); y += 12;
    doc.text(`Filial: ${filial}`, mX, y, { align: 'left' }); y += 8; doc.text(`Responsável: ${resp}`, mX, y, { align: 'left' }); y += 12;
    const se = document.querySelectorAll('.sectorContainer'); const scf = [];
    for (const el of se) {
        const ts = el.querySelector('.titleSec strong'); const sn = ts ? ts.textContent : 'Setor não identificado';
        const oi = el.querySelector('.vistoriaObsContainer input'); const ob = oi ? oi.value.trim() || '' : '';
        const be = el.querySelector('.viewPhotos[id]'); const sid = be ? be.id : null;
        if (sid) { const fotos = await buscarFotos(sid); scf.push({ nome: sn, obs: ob, fotos, id: sid }); }
    }
    const di = scf.findIndex(s => s.nome.toLowerCase() === 'depósito'); if (di !== -1) { const dep = scf.splice(di, 1)[0]; scf.push(dep); }
    const fcs = []; for (const s of scf) s.fotos.forEach(f => fcs.push({ foto: f, setorNome: s.nome, obs: s.obs }));
    let i = 0, pg = 1;
    while (i < fcs.length) {
        const lf = fcs.slice(i, i + fpl); const lmf = (lp - 2 * mX - (lf.length - 1) * esp) / lf.length; let x = mX, alm = 0;
        for (const item of lf) {
            try {
                const ip = doc.getImageProperties(item.foto); const sc = (af / ip.height) * 0.8; const la = ip.width * sc, ha = ip.height * sc;
                const mi = pg === 1 ? 10 : 60; if (y + ha + 10 > ap - mi) { doc.addPage(); y = mY; pg++; }
                doc.addImage(item.foto, 'JPEG', x + (lmf - la) / 2, y, la, ha); doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
                doc.text(item.setorNome, x + lmf / 2, y + ha + 4, { align: 'center' }); x += lmf + esp; if (ha + 4 > alm) alm = ha + 4;
            }
            catch (e) { console.error('Erro ao adicionar imagem:', e); }
        }
        y += alm + 5; i += fpl;
    }
    if (y + 20 > ap - 20) { doc.addPage(); y = mY; } y += 10;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.text('Observações Gerais', lp / 2, y, { align: 'center' }); y += 10;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
    const cx = [mX, lp / 2 + 5]; let yc = [y, y], ca = 0;
    for (const s of scf) {
        const of2 = doc.splitTextToSize(`${s.nome}: ${s.obs}`, lp / 2 - 15);
        if (yc[ca] + of2.length * 5 > ap - 20) { ca = (ca + 1) % 2; if (yc[ca] + of2.length * 5 > ap - 20) { doc.addPage(); yc = [mY, mY]; ca = 0; } }
        of2.forEach(l => { doc.text(l, cx[ca], yc[ca]); yc[ca] += 5; }); yc[ca] += 5;
    }
    const tp = doc.getNumberOfPages(); for (let pg = 1; pg <= tp; pg++) { doc.setPage(pg); doc.setFontSize(8); doc.setTextColor(150); doc.text(`Gerado em: ${dg.toLocaleString('pt-BR')}`, lp - mX, ap - 10, { align: 'right' }); doc.text(`Página ${pg} de ${tp}`, lp / 2, ap - 10, { align: 'center' }); }
    doc.save(`vistoria_${filial.replace(/\s+/g, '_')}_${_fmt2(dg.getDate())}_${_fmt2(dg.getMonth() + 1)}_${dg.getFullYear()}.pdf`);
    msgGlobal('msgVistoriaFilial', 'PDF gerado com sucesso!', 'sucesso');
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").then(() => console.log("Service Worker Registrado com Sucesso!")).catch(err => console.log("Erro ao Carregar Service Worker:"));
    });
}