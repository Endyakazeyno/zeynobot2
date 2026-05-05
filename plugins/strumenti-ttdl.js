// plugin by github.com/axion-bot

import axios from 'axios';

let handler = async (m, { conn, args }) => {

    if (!args[0])
        return m.reply('⚠️ Inserisci un link TikTok!');

    let url = args[0];

    if (!url.includes('tiktok.com'))
        return m.reply('❌ Link TikTok non valido!');

    try {

        await m.reply('⏳ 𝐒𝐜𝐚𝐫𝐢𝐜𝐨 𝐯𝐢𝐝𝐞𝐨...');

        // Risolve redirect vm.tiktok
        const resolved = await axios.get(url, {
            maxRedirects: 5,
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        const finalUrl = resolved.request.res.responseUrl;

        // API stabile
        const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(finalUrl)}&hd=1`;

        const { data } = await axios.get(api, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        if (!data?.data?.play)
            return m.reply('❌ API non ha restituito il video.');

        await conn.sendMessage(m.chat, {
            video: { url: data.data.play },
            caption: `🎥 𝐓𝐢𝐤𝐭𝐨𝐤 𝐬𝐜𝐚𝐫𝐢𝐜𝐚𝐭𝐨 𝐜𝐨𝐧 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐨!

👤 ${data.data.author.nickname}
❤️ ${data.data.digg_count} 𝐥𝐢𝐤𝐞
👁️ ${data.data.play_count} 𝐯𝐢𝐞𝐰𝐬

> 𝐍𝐄𝐖 𝐄𝐑𝐀 𝐁𝐎𝐓`
        }, { quoted: m });

    } catch (err) {
        console.error("ERRORE TTDL:", err.response?.data || err.message);
        m.reply('❌ Errore VPS durante il download.');
    }
};

handler.help = ['ttdl <link>'];
handler.tags = ['strumenti'];
handler.command = /^(ttdl)$/i;

export default handler;