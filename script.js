const Colors = {
    Blue: Symbol('blue'),
    Yellow: Symbol('yellow'),
    Brown: Symbol('brown'),
    Red: Symbol('red'),
    Orange: Symbol('orange'),
    Gray: Symbol('gray'),
    White: Symbol('white'),
}

const Factions = {
    Terrans: 'Terrans',
    Lantids: 'Lantids',
    Xenos: 'Xenos',
    Gleens: 'Gleens',
    Taklons: 'Taklons',
    Ambas: 'Ambas',
    HadschHallas: 'Hadsch Hallas',
    Ivits: 'Ivits',
    Geodens: 'Geodens',
    BalTaks: "Bal T'aks",
    Firaks: 'Firaks',
    Bescods: 'Bescods',
    Nevlas: 'Nevlas',
    Itars: 'Itars',
}

const FactionData = {}
FactionData[Factions.Terrans] = { name: Factions.Terrans, color: Colors.Blue }
FactionData[Factions.Lantids] = { name: Factions.Lantids, color: Colors.Blue }
FactionData[Factions.Xenos] = { name: Factions.Xenos, color: Colors.Yellow }
FactionData[Factions.Gleens] = { name: Factions.Gleens, color: Colors.Yellow }
FactionData[Factions.Taklons] = { name: Factions.Taklons, color: Colors.Brown }
FactionData[Factions.Ambas] = { name: Factions.Ambas, color: Colors.Brown }
FactionData[Factions.HadschHallas] = { name: Factions.HadschHallas, color: Colors.Red }
FactionData[Factions.Ivits] = { name: Factions.Ivits, color: Colors.Red }
FactionData[Factions.Geodens] = { name: Factions.Geodens, color: Colors.Orange }
FactionData[Factions.BalTaks] = { name: Factions.BalTaks, color: Colors.Orange }
FactionData[Factions.Firaks] = { name: Factions.Firaks, color: Colors.Gray }
FactionData[Factions.Bescods] = { name: Factions.Bescods, color: Colors.Gray }
FactionData[Factions.Nevlas] = { name: Factions.Nevlas, color: Colors.White }
FactionData[Factions.Itars] = { name: Factions.Itars, color: Colors.White }


function randomColors(n) {
    let col = Object.values(Colors)

    if (!Number.isInteger(n)) throw new Error(`${n} is not a number`)
    if (n === col.length) return col
    if (n === 0) return []
    if (n > col.length) throw new Error(`${n} is more than the maximum amount of colors`)
    if (n < 0) throw new Error(`${n} is negative`)

    for (let i = col.length - 1; i > 0; i--) {
        const j = randInt(0, i);
        //console.log(`${i}: ${j}`);
        [col[i], col[j]] = [col[j], col[i]];
    }
    return col.slice(0, n)
}
function isAColor(v) {
    let col = Object.values(Colors)
    return col.includes(v)
}

function factionsOfAColor(color) {
    if (!isAColor(color)) throw new Error(`${color} is not a color.`)

    let fac = Object.values(FactionData)
    return fac.filter(v => v.color === color)
}

function randomFactions(n) {
    let col = randomColors(n)
    let b = col.map(factionsOfAColor)
    let c = b.map(v => v[randInt(0, 1)])
    let r = new Map
    c.forEach(v => r.set(v.name, v))
    return r
}

function generatePlayer(name, factions) {
    let bids = new Map([...factions])
    bids.forEach((_, k) => {
        bids.set(k, randInt(0, 10))
    })
    return {
        name,
        bids,
    }
}

function initBidding(factions) {
    let bidState = new Map([...factions])
    bidState.forEach((_, k) => {
        bidState.set(k, {
            value: -1,
            player: undefined,
        }
        )
    })
    let players = Array.from({ length: bidState.size }, (_, i) => generatePlayer(`Player${i + 1}`, factions))
    return {
        turn: 0,
        players,
        bidding: bidState,
    }
}

function determineBid(biddingState, player) {
    // if you are already leading in some faction, don't bid
    let a = Array.from(biddingState.bidding.values())
    if (a.some((v) => v.player === player.name)) return undefined

    let currentBets = new Map([...biddingState.bidding])
    let dif = new Map([...player.bids])
    dif.forEach((v, k) => { dif.set(k, v - currentBets.get(k).value) })
    // currentBets.forEach((v, k) => { if (v.player === player.name) dif.delete(k) }) // remove factions where I'm already winning
    dif.forEach((v, k) => { if (v === 0) dif.delete(k) }) // remove factions where I'm at my maximum

    const max = getMaxValue(dif)
    dif.forEach((v, k) => { if (v != max.value) dif.delete(k) }) // remove factions that are not my highest priority

    // if there are no valid candidates return undefined
    if (dif.size === 0) return undefined
    let pick = randomMapKey(dif) // pick a random factions from the most desirable ones
    return pick.key
}

function execBid(biddingState, faction, playerName) {
    let currentbid = biddingState.bidding.get(faction)
    let bids = new Map([...biddingState.bidding])
    bids.set(faction, {
        value: currentbid.value + 1,
        player: playerName,
    })
    console.log(`${playerName} bet on ${faction}`)
    return {
        ...biddingState,
        turn: biddingState.turn + 1,
        bidding: bids,
    }
}

function testRun() {
    let n = 3
    let f = randomFactions(n)
    let b = initBidding(f)

    b.players.forEach((v) => console.log(v.bids))
    let i = 0
    while (Array.from(b.bidding.values()).some((v) => v.player === undefined)) {
        if (i > 1000) throw new Error('Overflow')
        let faction = determineBid(b, b.players[i % n])
        if (faction) {
            b = execBid(b, faction, b.players[i % n].name)
        }
        i += 1
    }
    return b
}


console.log(Factions.Lantids)
console.log(Factions.Terrans)
