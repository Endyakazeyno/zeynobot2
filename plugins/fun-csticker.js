
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Controllo input con estetica New Era
    if (!text) {
        let usageMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Sticker Engine_
───────────────
⚠️ *𝐄𝐑𝐑𝐎𝐑𝐄 𝐒𝐈𝐍𝐓𝐀𝐒𝐒𝐈*

• *Uso:* ${usedPrefix}${command} [testo]
• *Esempio:* ${usedPrefix}${command} haii maniezz
───────────────`.trim()
        return m.reply(usageMsg)
    }

    // Feedback visivo di caricamento
    await m.react('⏳')

    try {
        // API Primaria: Genera direttamente il WebP animato in stile "Brat"
        let apiUrl = `https://api.siputzx.my.id/api/maker/brat?text=${encodeURIComponent(text)}`
        let res = await fetch(apiUrl)
        
        if (!res.ok) throw new Error('Primary API Offline')
        
        let buffer = await res.arrayBuffer()

        // Invio diretto del buffer come sticker
        await conn.sendMessage(m.chat, { 
            sticker: Buffer.from(buffer) 
        }, { quoted: m })

        // Feedback di successo
        await m.react('✅')

    } catch (e) {
        try {
            // API Secondaria in caso di fallimento della prima
            let fallbackUrl = `https://api.ryzendesu.vip/api/maker/brat?text=${encodeURIComponent(text)}`
            let res2 = await fetch(fallbackUrl)
            
            if (!res2.ok) throw new Error('Fallback API Offline')
            
            let buffer2 = await res2.arrayBuffer()
            
            await conn.sendMessage(m.chat, { 
                sticker: Buffer.from(buffer2) 
            }, { quoted: m })
            
            await m.react('✅')
            
        } catch (err) {
            // Messaggio di errore New Era se entrambi i server sono giù
            let errorMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System Error_
───────────────
❌ *𝐆𝐄𝐍𝐄𝐑𝐀𝐙𝐈𝐎𝐍𝐄 𝐅𝐀𝐋𝐋𝐈𝐓𝐀*

• *Dettaglio:* I server di rendering grafico sono offline.
• *Azione:* Riprova più tardi.
───────────────`.trim()
            await m.reply(errorMsg)
            await m.react('❌')
        }
    }
}

handler.help = ['csticker <testo>', 'brat <testo>']
handler.tags = ['sticker']
// Si attiva sia con .csticker che con .brat
handler.command = /^(csticker|brat)$/i

export default handler