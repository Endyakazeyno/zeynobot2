import { performance } from 'perf_hooks'
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
    let old = performance.now()
    
    // Uptime
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    
    // Latenza ad alta precisione 0.000x
    let speed = (performance.now() - old).toFixed(4)

    // Testuale super minimal richiesto
    let txt = `⏳ *𝐔𝐩𝐭𝐢𝐦𝐞:* ${uptime}\n⚡ *𝐏𝐢𝐧𝐠:* ${speed} 𝐦𝐬`.trim()

    // Cattura immagine profilo del bot
    let profilePicture;
    try { 
        profilePicture = await conn.profilePictureUrl(conn.user.jid, 'image'); 
    } catch (e) { 
        profilePicture = 'https://files.catbox.moe/pyp87f.jpg'; 
    }

    const getBuffer = async (url) => {
        try { 
            const res = await fetch(url); 
            return Buffer.from(await res.arrayBuffer()); 
        } catch (e) { return null; }
    };
    let imageBuffer = await getBuffer(profilePicture);

    // Invio con meccanica AdReply + Inoltro Canale
    await conn.sendMessage(m.chat, {
        text: txt,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            externalAdReply: {
                title: `🚀 𝐏𝐈𝐍𝐆: ${speed} 𝐦𝐬`, 
                body: '𝐍𝐄𝐖 𝐄𝐑𝐀 • 𝐒𝐲𝐬𝐭𝐞𝐦',
                thumbnail: imageBuffer,
                mediaType: 1, 
                renderLargerThumbnail: false,
                sourceUrl: null
            }
        }
    }, { quoted: m })
}

handler.help = ['ping']
handler.tags = ['info']
handler.command = ['ping']

export default handler

function clockString(ms) {
    let h = Math.floor(ms / 3600000).toString().padStart(2, '0')
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    
    return `${h}h ${m}m ${s}s`
}