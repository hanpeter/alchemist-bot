(function () {
    'use strict';

    var Discord = require('discord.js');
    var Promise = require('bluebird');
    var request = Promise.promisify(require('request'));
    var _ = require('lodash');
    var client = new Discord.Client();
    var discordToken = process.env.DISCORD_BOT_TOKEN;

    client.login(discordToken)
        .then(function () {
            console.log('Logged in as', client.user.tag);
        });

    client.on('message', function (message) {
        if (message.author.tag == client.user.tag) {
            return;
        }

        request({
            url: 'https://alchemist-api-branch.herokuapp.com/job/JB_DGN/',
            method: 'GET',
            json: true,
        }).then(function (resp) {
            _.forEach(resp.body, function (job) {
                var units = _.uniq(_.map(job.Unit, function (unit) { return unit.name; }));

                var abilities = _.mapValues(job.Ability, function (ability) { return ability.name; });

                var modifiers = job.ranks[0];

                var embed = {
                    title: job.name,
                    thumbnail: {
                        url: 'https://alchemist-api-branch.herokuapp.com' + job.Icon,
                    },
                    fields: [
                        {
                            name: 'Ability 1',
                            value: abilities['0'],
                            inline: true,
                        },
                        {
                            name: 'Ability 2',
                            value: abilities['1'],
                            inline: true,
                        },
                        {
                            name: 'Ability 3 (Lv. 4)',
                            value: abilities['4'],
                            inline: true,
                        },
                        {
                            name: 'Ability 4 (Lv. 6)',
                            value: abilities['6'],
                            inline: true,
                        },
                        {
                            name: 'Units',
                            value: units.join(', '),
                        },
                        {
                            name: 'HP / lv',
                            value: modifiers.hp,
                            inline: true,
                        },
                        {
                            name: 'PATK / lv',
                            value: modifiers.atk,
                            inline: true,
                        },
                        {
                            name: 'PDEF / lv',
                            value: modifiers.def,
                            inline: true,
                        },
                        {
                            name: 'MATK / lv',
                            value: modifiers.mag,
                            inline: true,
                        },
                        {
                            name: 'MDEF / lv',
                            value: modifiers.mnd,
                            inline: true,
                        },
                        {
                            name: 'DEX / lv',
                            value: modifiers.dex,
                            inline: true,
                        },
                        {
                            name: 'AGI / lv',
                            value: modifiers.avoid,
                            inline: true,
                        },
                        {
                            name: 'CRIT / lv',
                            value: modifiers.cri,
                            inline: true,
                        },
                        {
                            name: 'LUCK / lv',
                            value: modifiers.luk,
                            inline: true,
                        },
                        {
                            name: 'Jewels / lv',
                            value: modifiers.mp,
                            inline: true,
                        },
                    ],
                    footer: {
                        text: job.iname,
                    },
                };
                console.log(embed);

                message.reply({ embed: embed });
            });
        });
    });
})();
