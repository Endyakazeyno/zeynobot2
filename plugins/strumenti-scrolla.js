```javascript
import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Reazione per feedback immediato
    await m.react('📱');

    try {
        // Query di ricerca casuale per simulare i "Per te" (FYP)
        const queries = ['funny', 'meme', 'trend', 'italy', 'gaming', 'viral', 'satisfying'];
        const randomQuery = queries[Math.floor(Math.random() * queries.length)];
        
        // Usiamo l'API tikwm per cercare video di tendenza invece di scaricarne uno specifico
        const searchApi = `https://www.tikwm.com/api/feed/search?keywords=${randomQuery}&count=10&cursor=0`;
        
        const { data: searchData } = await axios.get(searchApi, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        if (!searchData?.data?.videos || searchData.data.videos.length === 0) {
            throw new Error('Nessun video trovato');
        }

        // Seleziona un video casuale dai risultati della ricerca
        const video = searchData.data.videos[Math.floor(Math.random() * searchData.data.videos.length)];
        const videoUrl = `https://www.tiktok.com/@${video.author.unique_id}/video/${video.video_id}`;
        
        // Otteniamo il video senza watermark tramite la tua logica
        const downloadApi = `https://www.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}&hd=1`;
        const { data: dlData } = await axios.get(downloadApi);

        if (!dlData?.data?.play) throw new Error('Download fallito');

        const caption = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _TikTok Scroll_
───────────────
👤 *Autore:* ${dlData.data.author.nickname}
📝 *Descrizione:* ${dlData.data.title || 'Nessuna descrizione'}

📊 *Statistiche:*
❤️ ${dlData.data.digg_count} | 💬 ${dlData.data.comment_count} | 🔄 ${dlData.data.share_count}
───────────────
_Usa il bottone sotto per scrollare ancora!_`.trim();

        // Invio del video con Bottone (Nota: i bottoni funzionano solo su certe versioni di WA)
        // Se il tuo bot non supporta i bottoni, manderà solo il video con la caption.
        await conn.sendMessage(m.chat, {
            video: { url: dlData.data.play },
            caption: caption,
            footer: '𝐍𝐄𝐖 𝐄𝐑𝐀 𝐁𝐎𝐓',
            buttons: [
                { buttonId: `${usedPrefix}${command}`, buttonText: { displayText: '⏩ 𝐒𝐜𝐫𝐨𝐥𝐥𝐚' }, type: 1 }
            ],
            headerType: 4
        }, { quoted: m });

    } catch (err) {
        console.error("ERRORE PERDITEMPO:", err);
        m.reply('❌ Errore durante il recupero dei video. Riprova!');
    }
};

handler.help = ['perditempo'];
handler.tags = ['divertimento'];
handler.command = /^(perditempo|scroll|ttscroll)$/i;

export default handler;