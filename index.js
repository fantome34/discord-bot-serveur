const Discord = require('discord.js');
const bot = new Discord.Client();
const token = require("./token.json")
const bdd = require("./bdd.json");
const fs = require("fs");

bot.on("ready", async () => {
    console.log("le bot est allumé !");
    bot.user.setStatus("dnd");
    setTimeout(() => {
        bot.user.setActivity("Administré le discord")
    }, 100)
    
 });

 bot.on ("guildMemberAdd", member => {
    bot.channels.cache.get('819291590354010132').send(`Bienvenue sur le serveur ${member}!`);
    member.roles.add('820383688134492180');

 })

 bot.on ("message", message => {

    if(message.content.startsWith("!clear")){
    message.delete();
        if(message.member.hasPermission('MANAGE_MESSAGES')){

            let args = message.content.trim().split(/ +/g);

            if(args[1]){
                if(!isNaN(args[1]) && args[1] >= 1 && args[1] <= 99){

                    message.channel.bulkDelete(args[1])
                    message.channel.send[`Vous avez supprimé ${args[1]} message(s) !`]

                }
                else{
                    message.channel.send (`Vous devez indiquer une valeur entre 1 et 99 !`)
                }
            }
            else{
                message.channel.send(`Vous devez indiquer le nombre de message a supprimer !`)
            }
        }
        else{
            message.channel.send(`Vous devez avoir la permission de gérer les messages pour éxécuter cette commande !`)
        }
    }
    if(message.content.startsWith("!warn")){
        if(message.member.hasPermission('BAN_MEMBERS')){

            if(!message.mentions.users.first())return;
            utilisateur = message.mentions.users.first().id

            if(bdd["warn"][utilisateur] == 2){

                delete bdd["warn"][utilisateur]
                message.guild.members.ban(utilisateur)
            }
            else{
                if(!bdd["warn"][utilisateur]){
                bdd["warn"][utilisateur] = 1
                Savebdd();
                message.channel.send("Tu as a présent " + bdd["warn"][utilisateur] + " avertissement(s)");
              }
                else{
                    bdd["warn"][utilisateur]++ 
                    Savebdd();
                    message.channel.send("Tu as a présent " + bdd["warn"][utilisateur] + " avertissements");
                }
            }
        }
    }
    if (message.content.startsWith('!ban')) {
        if (message.member.hasPermission('BAN_MEMBERS')) {

            let arg = message.content.trim().split(/ +/g)

            utilisateur= message.mentions.members.first();
            temps = arg[2];
            raison = arg [3];

            if (!utilisateur){
                return message.channel.send('Vous devez mentionner un utilisateur !');
            }
            else{
                if(!temps || isNaN(temps)){
                    return message.channel.send('Vous devez indiquer un temps en secondes !');
                }else{
                    if(!raison){
                        return message.channel.send('Vous devez indiquer une raison du ban !');
                    }else{

                        message.guild.members.ban(utilisateur.id);
                        setTimeout(function() {
                            message.guild.members.unban(utilisateur.id)
                        }, temps*1000);
                    }
                }
            }

        }else{
            return message.channel.send('Tu n\as pas les permissions nécéssaires !');
        }
    }
})

function Savebdd() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("Une erreur est survenue.");
    });
}

bot.login(process.env.TOKEN);