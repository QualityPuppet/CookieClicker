var mods = [
    "https://cookiemonsterteam.github.io/CookieMonster/dist/CookieMonsterDev.js",
    "https://worldwidewaves.github.io/Cookie-Stonks/main.user.js"
]

mods.forEach((mod) => {
    Game.LoadMod(mod)
})


var wiz = Object.values(Game.Objects).filter(o => o.name === "Wizard tower")[0].minigame


// wiz.spellsById[0].fail


Math.seedrandom(Game.seed+'/'+M.spellsCastTotal);
console.log(Math.random()<(1-0.15))
Math.seedrandom();