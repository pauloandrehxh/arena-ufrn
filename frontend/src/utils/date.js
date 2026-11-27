const relogioFortaleza = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Fortaleza',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
});

export function obterAgoraFortaleza() {
    const partes = Object.fromEntries(
        relogioFortaleza.formatToParts(new Date()).map(({ type, value }) => [type, value])
    );

    return {
        date: `${partes.year}-${partes.month}-${partes.day}`,
        time: `${partes.hour}:${partes.minute}`,
    };
}

function obterRotuloDia(indice, diaUtc, nomesDia) {
    if (indice === 0) return 'Hoje';
    if (indice === 1) return 'Amanhã';
    return nomesDia[diaUtc];
}

export function gerarProximosDias(quantidade = 14) {
    const { date: hojeStr } = obterAgoraFortaleza();
    const [ano, mes, dia] = hojeStr.split('-').map(Number);
    const dias = [];
    const nomesDia = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const nomesMes = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

    for (let i = 0; i < quantidade; i += 1) {
        const d = new Date(Date.UTC(ano, mes - 1, dia + i));
        const iso = d.toISOString().slice(0, 10);
        dias.push({
            iso,
            diaSemana: obterRotuloDia(i, d.getUTCDay(), nomesDia),
            diaMes: String(d.getUTCDate()).padStart(2, '0'),
            mesCurto: nomesMes[d.getUTCMonth()],
        });
    }

    return dias;
}

export function formatarDataBR(valor) {
    if (!valor) return '—';
    const iso = typeof valor === 'string' ? valor.slice(0, 10) : new Date(valor).toISOString().slice(0, 10);
    const partes = iso.split('-');
    if (partes.length !== 3) return iso;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export function formatarDataExtenso(isoDate) {
    if (!isoDate) return '';
    const iso = isoDate.slice(0, 10);
    const data = new Date(`${iso}T12:00:00.000Z`);
    return new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'UTC',
        weekday: 'long',
        day: '2-digit',
        month: 'long',
    }).format(data);
}

export function reservaEhFutura(dateValue, startTime) {
    if (!dateValue || !startTime) return false;
    const dia = typeof dateValue === 'string'
        ? dateValue.slice(0, 10)
        : new Date(dateValue).toISOString().slice(0, 10);
    const agora = obterAgoraFortaleza();
    return `${dia}T${startTime}` > `${agora.date}T${agora.time}`;
}
