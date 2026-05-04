let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    // Definizione del testo con font Bold Sans e Italic per un look premium
    let text = `
*𝐍𝐄𝐖 𝐄𝐑𝐀*
The Next Generation Core

𝐂𝐢𝐚𝐨 @${m.sender.split('@')[0]},
𝐒𝐞𝐥𝐞𝐳𝐢𝐨𝐧𝐚 𝐮𝐧𝐚 𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐢𝐚 𝐪𝐮𝐢 𝐬𝐨𝐭𝐭𝐨 𝐩𝐞𝐫 𝐯𝐢𝐬𝐮𝐚𝐥𝐢𝐳𝐳𝐚𝐫𝐞 𝐢 𝐜𝐨𝐦𝐚𝐧𝐝𝐢 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐢𝐥𝐢!

*STATS*
• *Stato:* Operativo
• *Sessione:* Attiva
`.trim();

    // Array di bottoni (senza Download e Ricerca)
    const buttons = [
      { buttonId: `${_p}menustrumenti`, buttonText: { displayText: '🛠️ 𝐒𝐭𝐫𝐮𝐦𝐞𝐧𝐭𝐢' }, type: 1 },
      { buttonId: `${_p}menueuro`, buttonText: { displayText: '💰 𝐄𝐜𝐨𝐧𝐨𝐦𝐢𝐚' }, type: 1 },
      { buttonId: `${_p}menugiochi`, buttonText: { displayText: '🎮 𝐆𝐢𝐨𝐜𝐡𝐢' }, type: 1 },
      { buttonId: `${_p}menugruppo`, buttonText: { displayText: '👥 𝐆𝐫𝐮𝐩𝐩𝐨' }, type: 1 },
      { buttonId: `${_p}menucreatore`, buttonText: { displayText: '👨‍💻 𝐂𝐫𝐞𝐚𝐭𝐨𝐫𝐞' }, type: 1 },
      { buttonId: `${_p}menuvip`, buttonText: { displayText: '🛡️ 𝐕𝐈𝐏 ' }, type: 1 },
      { buttonId: `${_p}menuspeciale`, buttonText: { displayText: '🪩 𝐒𝐩𝐞𝐜𝐢𝐚𝐥𝐞' }, type: 1 },
      { buttonId: `${_p}menusicurezza`, buttonText: { displayText: '🚨 𝐒𝐢𝐜𝐮𝐫𝐞𝐳𝐳𝐚 ' }, type: 1 },
      { buttonId: `${_p}contronuke on`, buttonText: { displayText: '☢️ 𝐀𝐧𝐭𝐢-𝐍𝐮𝐤𝐞' }, type: 1 },
      { buttonId: `${_p}feedback`, buttonText: { displayText: '✍️ 𝐅𝐞𝐞𝐝𝐛𝐚𝐜𝐤 ' }, type: 1 }
    ];

    // Invio del messaggio
    await conn.sendMessage(m.chat, {
      text: text,
      footer: 'ɴᴇᴡ ᴇʀᴀ ᴄᴏɴᴛʀᴏʟ',
      buttons: buttons,
      headerType: 1,
      mentions: [m.sender]
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, {
      text: "*⚠️ ERRORE SISTEMA*\nImpossibile generare il menu."
    }, { quoted: m });
  }
}

handler.help = ['menu']
handler.command = ['menu', 'menuall', 'menucompleto', 'funzioni', 'comandi', 'help']

export default handler
