
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Controllo testo New Era
    if (!text) {
        return m.reply(`*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System_\n───────────────\n⚠️ Inserisci il testo per lo sticker animato.\nEsempio: ${usedPrefix}${command} ciao`)
    }

    // Reazione immediata per confermare che il comando è partito
    await m.react('⚡')

    try {
        // API Ultra-Stabile per Brat Animato (Video MP4 corto ottimizzato)
        let res = await fetch(`https://api.alyachan.dev/api/brat-video?text=${encodeURIComponent(text)}&apikey=Gatogpt`)
        
        if (!res.ok) throw new Error('Server Down')
        
        let json = await res.json()
        if (!json.status || !json.data.url) throw new Error('Invalid Response')

        let videoUrl = json.data.url

        // USIAMO IL METODO PIÙ POTENTE: sendFile con trasformazione sticker forzata
        // Questo metodo è quello che usano i bot professionali per non avere mai lo schermo bianco
        await conn.sendFile(m.chat, videoUrl, 'brat.webp', '', m, {
            asSticker: true,
            packname: '𝐍𝐄𝐖 𝐄𝐑𝐀',
            author: '𝐒𝐲𝐬𝐭𝐞𝐦',
            categories: ['🤩']
        }, { 
            quoted: m,
            ephemeralExpiration: 86400 
        })

        await m.react('✅')

    } catch (e) {
        console.error(e)
        // FALLBACK 2: Se la prima API fallisce, usiamo la seconda con metodo alternativo
        try {
            let res2 = await fetch(`https://api.siputzx.my.id/api/maker/brat/animate?text=${encodeURIComponent(text)}`)
            let buffer = await res2.buffer()
            
            // Invio come sticker animato diretto
            await conn.sendMessage(m.chat, { 
                sticker: buffer 
            }, { quoted: m })
            
            await m.react('✅')
        } catch (err) {
            await m.react('❌')
            m.reply(`*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Critical Error_\n───────────────\n❌ I server grafici sono congestionati.\nRiprova tra pochi istanti.`)
        }
    }
}

handler.help = ['csticker']
handler.tags = ['sticker']
handler.command = /^(csticker|brat)$/i

export default handler