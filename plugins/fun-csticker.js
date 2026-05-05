
import { sticker } from '../lib/sticker.js'
import { createCanvas } from 'canvas'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Canvas Engine_\n───────────────\n⚠️ Inserisci il testo per lo sticker.\nEsempio: ${usedPrefix}${command} Legam`)
    }

    await m.react('🎨')

    try {
        // Dimensioni standard sticker (512x512)
        const canvas = createCanvas(512, 512)
        const ctx = canvas.getContext('2d')
        
        // Impostazioni Font e Stile
        const fontSize = 80
        ctx.font = `bold ${fontSize}px Arial` // Puoi usare un font specifico se presente sul server
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // Funzione per disegnare il frame
        const drawFrame = (currentText) => {
            // Sfondo verde "Brat" (o trasparente se preferisci)
            ctx.fillStyle = '#8ACE00' 
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            
            // Testo Nero
            ctx.fillStyle = '#000000'
            // Gestione testo multi-riga semplice
            const words = currentText.split(' ')
            let line = ''
            let y = canvas.height / 2
            
            ctx.fillText(currentText, canvas.width / 2, y)
        }

        // Se vuoi che sia animato "passo dopo passo", dovremmo generare un video.
        // Ma per una gara veloce, generiamo la versione statica perfetta con Canvas 
        // e la passiamo al tuo convertitore che non fallirà perché il buffer è creato localmente.
        
        drawFrame(text)
        
        let buffer = canvas.toBuffer('image/png')

        const packName = global.authsticker || '✧˚⭐️ 𝐍𝐄𝐖 𝐄𝐑𝐀 ⭐️˚✧'
        const authorName = global.nomepack || '✧˚⭐️ 𝐒𝐲𝐬𝐭𝐞 m ⭐️˚✧'

        // Passiamo il buffer PNG generato da noi alla tua funzione sticker
        let stiker = await sticker(buffer, false, packName, authorName)

        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, true, { quoted: m })
            await m.react('✅')
        } else {
            throw new Error('Canvas to Sticker failed')
        }

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Canvas Error_\n───────────────\n❌ Assicurati che il modulo 'canvas' sia installato sul server.\n\`npm install canvas\``)
    }
}

handler.help = ['csticker']
handler.tags = ['sticker']
handler.command = /^(csticker|brat)$/i

export default handler