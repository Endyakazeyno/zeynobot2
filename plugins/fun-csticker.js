
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Controllo input con estetica New Era
    if (!text) {
        let usageMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Sticker Engine_
───────────────
⚠️ *𝐄𝐑𝐑𝐎𝐑𝐄 𝐒𝐈𝐍𝐓𝐀𝐒𝐒𝐈*

• *Uso:* ${usedPrefix}${command} [testo]
• *Esempio:* ${usedPrefix}${command} ciao come stai
───────────────`.trim()
        return m.reply(usageMsg)
    }

    // Feedback visivo di caricamento
    await m.react('⏳')

    try {
        // API dedicata alla generazione Video (BratVideo) che evita lo sfondo bianco piatto
        let apiUrl = `https://api.siputzx.my.id/api/maker/brat/animate?text=${encodeURIComponent(text)}`
        let res = await fetch(apiUrl)
        
        if (!res.ok) throw new Error('API Error')
        
        let buffer = await res.buffer()

        // Verifichiamo se il bot ha la funzione per inviare sticker da video
        // Questa è la funzione più stabile per evitare l'errore "Impossibile scaricare"
        if (conn.sendFile) {
            // Inviamo il file come sticker direttamente. 
            // Il mimetype 'image/webp' con l'estensione corretta forza il rendering dello sticker animato.
            await conn.sendFile(m.chat, buffer, 'brat.webp', '', m, { 
                asSticker: true,
                packname: '𝐍𝐄𝐖 𝐄𝐑𝐀',
                author: '𝐒𝐲𝐬𝐭𝐞𝐦'
            })
        } else {
            // Fallback manuale se sendFile non è disponibile
            await conn.sendMessage(m.chat, { 
                sticker: buffer 
            }, { quoted: m })
        }

        await m.react('✅')

    } catch (e) {
        console.error(e)
        // Tentativo di emergenza con API alternativa se la prima fallisce
        try {
            let fallbackUrl = `https://aqul-api.vercel.app/api/bratvideo?text=${encodeURIComponent(text)}`
            let res2 = await fetch(fallbackUrl)
            let buffer2 = await res2.buffer()
            
            await conn.sendMessage(m.chat, { 
                video: buffer2, 
                gifPlayback: true,
                caption: `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Brat Recovery_`
            }, { quoted: m })
            
            await m.react('✅')
        } catch (err) {
            let errorMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System Error_
───────────────
❌ *𝐆𝐄𝐍𝐄𝐑𝐀𝐙𝐈𝐎𝐍𝐄 𝐅𝐀𝐋𝐋𝐈𝐓𝐀*

• *Dettaglio:* Errore nel rendering del buffer video.
• *Azione:* Prova con un testo più breve.
───────────────`.trim()
            await m.reply(errorMsg)
            await m.react('❌')
        }
    }
}

handler.help = ['csticker <testo>']
handler.tags = ['sticker']
handler.command = /^(csticker|brat|stickerbrat)$/i

export default handler