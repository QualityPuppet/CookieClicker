var gameValues = Object.values(Game.Objects);



var minigame = Game.Objects.Bank.minigame;
var goods = Object.values(minigame.goods).filter(good => {
    return gameValues[good.building.id].bought
});

var modes = ["Stable", "Slow Rise", "Slow Fall", "Fast Rise", "Fast Fall", "Chaotic"] // modes are in order that they are in code

var goodIsBuyable = function(good, log) {
    var restVal = minigame.getRestingVal(good.id);
    var holding = good.stock === minigame.getGoodMaxStock(good);

    var modeText = modes[good.mode];
    var vsRest = good.val / restVal * 100;

    var isFastRise = good.mode === 3;
    var isSlowRise = good.mode === 1;
    var isSlowFall = good.mode === 2;
    var isFastFall = good.mode === 4;

    var isPositive = isSlowRise || isFastRise;
    var isNegative = isSlowFall || isFastFall;
    var isStable = good.mode === 0 || good.mode === 5; //stable or chaotic
    
    if (log) {
        console.log({
            "Ticker": good.symbol,
            "Mode": good.mode,
            "Holding": holding
        });
    }


    var isAboveMarketCap = good.val > gameValues[5].bought;

    if (good.val === 1) {
        return "BUY BUY BUY"
    }

    if (vsRest < 20 || good.val < 5) {
        return "Dirt Cheap, " + (holding ? "Hold" : "Buy and Hold")
    }

    if ((vsRest < 50 || (good.val < 10 && good.id > 1))  && !holding) {
        return "Cheap" + (good.mode == 1 || good.mode == 3 ? " and rising, buy" :  ", buy with judgement")
    }

    if (!isPositive && isAboveMarketCap && holding) {
        return "Sell - Over market cap"
    }

    if (isPositive && holding) {
        return "Hold" + (isAboveMarketCap ? "Above Market Cap" : "")
    }
    if (isPositive && !holding) {
        return isAboveMarketCap ? "Above Market Cap" : "Buy"
    }
    if (isNegative && holding) {
        return "sell"
    }
    if (isNegative && !holding) {
        return "Ignore"
    }

    if (holding) {
        return `Holding - Value: ${vsRest}, Mode: ${modeText}`
    }

    if (isStable) {
        var stableText = "Stable (" + modeText + ") - "
        var sellText = holding ? "Sell" : "Ignore"
        var buyText = holding ? "Buy" : "Hold"


        if (vsRest >= 120 ) {
            return stableText + sellText 
        }
        if (vsRest <= 80) {
            return stableText + buyText
        }
    }

    return `Best Judgement - Value: ${vsRest}, Mode: ${modeText}`
}

var sensibleModeMapping = (mode) => {
    switch (mode) {
        case 3: // Fast Rise
            return 0;
        case 1: // Slow Rise
            return 1;
        case 0: // Stable
        case 5: // Chaotic
            return 2;
        case 2: // Slow Fall
            return 3;
        case 4: // Fast Fall
            return 4;
    }
}

var streamlinedGoods = function(log) {
    return goods
        .map((good) => {
            return {
                "Ticker": good.symbol,
                "Mode": modes[good.mode], 
                "Stock": good.stock,
                "Value": good.val,
                "Vs. Rest": good.val / minigame.getRestingVal(good.id) * 100  + "%", 
                "Buyable":  goodIsBuyable(good, log),
                "Name": good.building.name,
                "Id": good.id
            }
        })
        .sort((a, b) => {
            var aMode = sensibleModeMapping(modes.indexOf(a.Mode));
            var bMode = sensibleModeMapping(modes.indexOf(b.Mode))

            if (aMode === bMode) {
                return a.Id > b.Id ? 1 : -1
            }

            return aMode > bMode ? 1 : -1
        })
};

setInterval(function() {console.table(streamlinedGoods(false))}, 60000, )