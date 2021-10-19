const { Listener } = require('discord-akairo');

module.exports = class antiAdvertisement extends Listener {
    constructor() {
        super('antiAdvertisement', {
            event: 'messageCreate',
            emitter: 'client'
        });
    }

    async exec(message) {
        if (message.channel.type === "DM") return;
        let cachedGuild = antiAdvertise.find(c => c.guild == message.guild.id)
        let regex;

        if (!cachedGuild) return; // If theres no data for the guild, return
        if (!cachedGuild.preset) cachedGuild.preset = 'moderate'; // If theres no preset set return default preset
        // Presets
        if (cachedGuild.preset === 'light') regex = ('http(s)[:]\/\/|www[.]|sftp[:]|ftp[:]|[.]com|[.]net|[.]org');
        if (cachedGuild.preset === 'moderate') regex = ('http(s)[:]\/\/|www[.]|sftp[:]|ftp[:]|[.]com|[.]net|[.]gg|[.]edu|[.]gov|[.]org|[.]moe|[.]academy|[.]tech|[.]biz|[.].aero');
        if (cachedGuild.preset === 'heavy') regex = ('http(s)[:]\/\/|www[.]|sftp[:]|ftp[:]|[.]aero|[.]academy|[.]tech|[.]moe|[.]biz|[.]cat|[.]com|[.]coop|[.]edu|[.]gov|[.]info|[.]int|[.]jobs|[.]mil|[.]mobi|[.]museum[.]name|[.]net|[.]org|[.]travel|[.]ac|[.]ad|[.]ae|[.]af|[.]ag|[.]ai|[.]al|[.]am|[.]an|[.]ao|[.]aq|[.]ar|[.]as|[.]at|[.]au|[.]aw[.]az|[.]ba|[.]bb|[.]bd|[.]be|[.]bf|[.]bg|[.]bh|[.]bi|[.]bj|[.]bm|[.]bn|[.]bo|[.]br|[.]bs|[.]bt|[.]bv|[.]bw|[.]by|[.]bz|[.]ca[.]cc|[.]cd|[.]cf|[.]cg|[.]ch|[.]ci|[.]ck|[.]cl|[.]cm|[.]cn|[.]co|[.]cr|[.]cs|[.]cu|[.]cv|[.]cx|[.]cy|[.]cz|[.]de|[.]dj|[.]dk|[.]dm[.]do|[.]dz|[.]ec|[.]ee|[.]eg|[.]eh|[.]er|[.]es|[.]et|[.]eu|[.]fi|[.]fj|[.]fk|[.]fm|[.]fo|[.]fr|[.]ga|[.]gb|[.]gd|[.]ge|[.]gf|[.]gg|[.]gh[.]gi|[.]gl|[.]gm|[.]gn|[.]gp|[.]gq|[.]gr|[.]gs|[.]gt|[.]gu|[.]gw|[.]gy|[.]hk|[.]hm|[.]hn|[.]hr|[.]ht|[.]hu|[.]id|[.]ie|[.]il|[.]im[.]in|[.]io|[.]iq|[.]ir|[.]is|[.]it|[.]je|[.]jm|[.]jo|[.]jp|[.]ke|[.]kg|[.]kh|[.]ki|[.]km|[.]kn|[.]kp|[.]kr|[.]kw|[.]ky|[.]kz|[.]la|[.]lb[.]lc|[.]li|[.]lk|[.]lr|[.]ls|[.]lt|[.]lu|[.]lv|[.]ly|[.]ma|[.]mc|[.]md|[.]mg|[.]mh|[.]mk|[.]ml|[.]mm|[.]mn|[.]mo|[.]mp|[.]mq[.]mr|[.]ms|[.]mt|[.]mu|[.]mv|[.]mw|[.]mx|[.]my|[.]mz|[.]na|[.]nc|[.]ne|[.]nf|[.]ng|[.]ni|[.]nl|[.]no|[.]np|[.]nr|[.]nu[.]nz|[.]om|[.]pa|[.]pe|[.]pf|[.]pg|[.]ph|[.]pk|[.]pl|[.]pm|[.]pn|[.]pr|[.]ps|[.]pt|[.]pw|[.]py|[.]qa|[.]re|[.]ro|[.]ru|[.]rw[.]sa|[.]sb|[.]sc|[.]sd|[.]se|[.]sg|[.]sh|[.]si|[.]sj|[.]sk|[.]sl|[.]sm|[.]sn|[.]so|[.]sr|[.]st|[.]sv|[.]sy|[.]sz|[.]tc|[.]td|[.]tf[.]tg|[.]th|[.]tj|[.]tk|[.]tm|[.]tn|[.]to|[.]tp|[.]tr|[.]tt|[.]tv|[.]tw|[.]tz|[.]ua|[.]ug|[.]uk|[.]um|[.]us|[.]uy|[.]uz|[.]va|[.]vc[.]ve|[.]vg|[.]vi|[.]vn|[.]vu|[.]wf|[.]ws|[.]ye|[.]yt|[.]yu|[.]za|[.]zm|[.]zr|[.]zw')

        // Delete function, check if msg matches regex
        async function del() {
            if (await message.content.match(regex)) {
                if (message.guild.me.user.id === message.author.id) return;
                await message.delete().catch(e => { })
                if (cachedGuild.warn === 'true') await message.channel.send({ content: `${message.author}, links are not allowed.` }).then(
                    async e => setTimeout(async () => { await e.delete().catch(e => { }) }, 5000)
                );
            }
        }

        if (cachedGuild && cachedGuild.enabled === 'true') { // Check if antiad is enabled
            if (cachedGuild.excludeBots === 'true' && message.author.bot.toString() == 'true') return; // Check if msg author is a bot

            if (cachedGuild.excludeStaff === 'true') {
                let findRole = staffRole.find(c => c.guild == message.guild.id)
                if (!findRole) return del() //No role in cache found, delete msgs from everyone 

                let role = message.guild.roles.cache.get(findRole.role)
                if (!role) return del() //No role in guild found, delete msgs from everyone

                let memberRoles = message.member._roles
                if (!memberRoles.some(r => role.id === r)) return del() // User isnt staff, delete message
            } else return del()
        }
    };
}