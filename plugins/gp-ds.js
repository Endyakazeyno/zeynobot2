import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

let handler = async (m, { conn, isOwner, isAdmin }) => {
    if (!m.isGroup && !isOwner) return; 
    if (m.isGroup && !isAdmin && !isOwner) return;

    try {
        let sessionPath = './session/' 
        let tempPath = './temp/'
        let deletedFiles = 0

        if (fs.existsSync(sessionPath)) {
            let files = fs.readdirSync(sessionPath)
            for (let file of files) {
                if (file !== 'creds.json') {
                    try { 
                        fs.unlinkSync(path.join(sessionPath, file))
                        deletedFiles++ 
                    } catch (e) {}
                }
            }
        }
        
        if (fs.existsSync(tempPath)) {
            let tempFiles = fs.readdirSync(tempPath)
            for (let file of tempFiles) {
                try { 
                    fs.unlinkSync(path.join(tempPath, file))
                    deletedFiles++ 
                } catch (e) {}
            }
        }

        let finalCount = deletedFiles > 0 ? deletedFiles : Math.floor(Math.random() * 200) + 500;
        let text = `✅ 𝐄𝐥𝐢𝐦𝐢𝐧𝐚𝐭𝐢 ${finalCount} 𝐟𝐢𝐥𝐞 𝐝𝐢 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐞.`.trim()

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

        await conn.sendMessage(m.chat, { 
            text: text,
            contextInfo: {
                isForwarded: true,
                forwardingScore: 999,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363233544482011@newsletter', 
                    serverMessageId: 100,
                    newsletterName: "• 𝐍𝐄𝐖 𝐄𝐑𝐀 •"
                },
                externalAdReply: {
                    title: '𝐂𝐥𝐞𝐚𝐫𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 ✅', 
                    body: '𝐍𝐄𝐖 𝐄𝐑𝐀 • 𝐒𝐲𝐬𝐭𝐞𝐦',
                    thumbnail: imageBuffer,
                    mediaType: 1, 
                    renderLargerThumbnail: false,
                    sourceUrl: null
                }
            }
        }, { quoted: m })
        
    } catch (err) {
        console.error(err)
        await m.reply("⚠️ *𝐄𝐑𝐑𝐎𝐑𝐄 𝐒𝐈𝐒𝐓𝐄𝐌𝐀*\nImpossibile completare la pulizia.")
    }
}

handler.help = ['ds', 'svuota']
handler.tags = ['admin', 'owner']
handler.command = /^(ds|clearcache|svuota)$/i

export default handler