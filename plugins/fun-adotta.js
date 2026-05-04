let handler = async (m, { conn, command, text, usedPrefix }) => {
    if (!m.isGroup) return;

    let db = global.db.data.users;
    let sender = m.sender;
    
    // Inizializza array se non esistono
    if (!db[sender].figli) db[sender].figli = [];
    if (!db[sender].genitori) db[sender].genitori = [];

    const getNum = (jid) => (jid || '').split('@')[0].split(':')[0];
    let cmd = command.toLowerCase();

    // 🔥 1. SCAPPA DI CASA (.scappa)
    if (cmd === 'scappa' || cmd === 'scappadicasa') {
        if (db[sender].genitori.length === 0) {
            return m.reply(`*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System Error_\n───────────────\n⚠️ Non hai genitori da cui scappare. Sei già un randagio.`);
        }

        let exGenitori = db[sender].genitori;
        
        // Rimuovi il figlio dai genitori
        for (let g of exGenitori) {
            if (db[g] && db[g].figli) {
                db[g].figli = db[g].figli.filter(f => f !== sender);
            }
        }
        
        // Svuota i genitori del mittente
        db[sender].genitori = [];

        let msg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Status Update_
───────────────
🏃🏻‍♂️ *FUGA RIUSCITA*

@${getNum(sender)} è scappato di casa!
_Ha rinnegato la sua famiglia e ora vaga da solo._
───────────────`.trim();

        return conn.sendMessage(m.chat, { text: msg, mentions: [sender] }, { quoted: m });
    }

    // 🎯 IDENTIFICAZIONE TARGET PER ADOTTA/RIPUDIA
    let targetUser;
    if (m.mentionedJid && m.mentionedJid[0]) targetUser = m.mentionedJid[0];
    else if (m.quoted && m.quoted.sender) targetUser = m.quoted.sender;

    if (!targetUser) {
        return m.reply(`*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Usage_\n───────────────\n👉 ${usedPrefix}adotta @tag\n👉 ${usedPrefix}ripudia @tag\n👉 ${usedPrefix}scappa`);
    }

    if (targetUser === sender) return m.reply("⚠️ Errore di logica: Non puoi adottare/ripudiare te stesso.");
    if (targetUser === conn.user.jid) return m.reply("⚠️ Sicurezza: Il sistema non può essere adottato.");

    if (!db[targetUser]) db[targetUser] = { figli: [], genitori: [] };
    if (!db[targetUser].figli) db[targetUser].figli = [];
    if (!db[targetUser].genitori) db[targetUser].genitori = [];

    let myPartner = db[sender].partner || null; // Se l'utente è sposato (tramite .sposa)

    // 🔥 2. ADOTTA (.adotta)
    if (cmd === 'adotta') {
        if (db[targetUser].genitori.length > 0) {
            return m.reply(`❌ @${getNum(targetUser)} ha già una famiglia. Non puoi rapirlo!`, null, { mentions: [targetUser] });
        }
        if (db[sender].figli.includes(targetUser)) {
            return m.reply("❌ È già tuo figlio!");
        }
        if (myPartner === targetUser) {
            return m.reply("❌ Non puoi adottare il tuo partner.");
        }

        // Aggiungi figlio a chi adotta
        db[sender].figli.push(targetUser);
        db[targetUser].genitori.push(sender);

        // Se l'adottante è sposato, il partner diventa automaticamente l'altro genitore!
        let extraMsg = "";
        if (myPartner && db[myPartner]) {
            if (!db[myPartner].figli) db[myPartner].figli = [];
            db[myPartner].figli.push(targetUser);
            db[targetUser].genitori.push(myPartner);
            extraMsg = `\n_Adozione estesa legalmente anche al partner @${getNum(myPartner)}._`;
        }

        let msg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Adoption Registry_
───────────────
🍼 *NUOVA ADOZIONE*

@${getNum(sender)} ha appena adottato @${getNum(targetUser)}!${extraMsg}
───────────────`.trim();
        
        let mentionsArr = [sender, targetUser];
        if (myPartner) mentionsArr.push(myPartner);

        // Rimosso contextInfo / inoltro canale
        return conn.sendMessage(m.chat, { 
            text: msg, 
            mentions: mentionsArr
        });
    }

    // 🔥 3. RIPUDIA (.ripudia)
    if (cmd === 'ripudia') {
        if (!db[sender].figli.includes(targetUser)) {
            return m.reply(`❌ @${getNum(targetUser)} non è tuo figlio!`, null, { mentions: [targetUser] });
        }

        // Rimuove dai figli del mittente
        db[sender].figli = db[sender].figli.filter(f => f !== targetUser);
        
        // Se c'è un partner, rimuove il figlio anche a lui
        let extraMsg = "";
        if (myPartner && db[myPartner] && db[myPartner].figli) {
            db[myPartner].figli = db[myPartner].figli.filter(f => f !== targetUser);
            extraMsg = `\n_Esilio confermato anche dal partner @${getNum(myPartner)}._`;
        }

        // Rimuove i genitori dal figlio
        db[targetUser].genitori = [];

        let msg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Family Exile_
───────────────
💔 *FIGLIO RIPUDIATO*

@${getNum(sender)} ha cacciato di casa @${getNum(targetUser)}!
_È stato spogliato del nome ed esiliato._${extraMsg}
───────────────`.trim();
        
        let mentionsArr = [sender, targetUser];
        if (myPartner) mentionsArr.push(myPartner);

        return conn.sendMessage(m.chat, { text: msg, mentions: mentionsArr }, { quoted: m });
    }
};

handler.help = ['adotta', 'ripudia', 'scappa'];
handler.tags = ['giochi'];
handler.command = /^(adotta|ripudia|scappa|scappadicasa)$/i;
handler.group = true;

export default handler;