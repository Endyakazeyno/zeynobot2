import { performance } from 'perf_hooks'

let handler = async (m, { conn }) => {
    let old = performance.now()
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    
    // Manteniamo il formato richiesto 000.x (es: 012.4)
    let speed = (performance.now() - old).toFixed(1).padStart(5, '0')

        let txt = `
╭━━━━━━━━━━━━━━━━━━━╮
┃   🚀  *𝐏𝐈𝐍𝐆 𝐍𝐄𝐖 𝐄𝐑𝐀* ┃
╰━━━━━━━━━━━━━━━━━━━╯
⏳ *𝗨𝗽𝘁𝗶𝗺𝗲:* ${uptime}
⚡ *𝗥𝗶𝘀𝗽𝗼𝘀𝘁𝗮:* ${speed} ms
📊 *𝗦𝘁𝗮𝘁𝘂𝘀:* 🟢 Online

`.trim()

    await m.reply(txt)
}

handler.help = ['ping']
handler.tags = ['main']
handler.command = ['ping']

export default handler

function clockString(ms) {
    let h = Math.floor(ms / 3600000).toString().padStart(2, '0')
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    
    // Formato uptime pulito senza caratteri strani
    return `${h}h ${m}m ${s}s`
}
