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
        bids.set(k, randInt(0, 3))
    })
    return {
        name,
        bids,
    }
}

function initBidding(factions) {
    let vvv = new Map([...factions])
    vvv.forEach((_, k) => {
        vvv.set(k, {
            value: -1,
            player: undefined,
        }
        )
    })
    let players = Array.from({ length: vvv.size }, (_, i) => generatePlayer(`Player${i + 1}`, factions))
    return {
        turn: 0,
        players,
        bidding: vvv,
    }
}

function determineBid(biddingState, player) {
    let currentBets = new Map([...biddingState.bidding])
    let dif = new Map([...player.bids])
    dif.forEach((v, k) => { dif.set(k, v - currentBets.get(k).value) })
    currentBets.forEach((v, k) => { if (v.player === player.name) dif.delete(k) }) // remove factions where I'm already winning
    dif.forEach((v, k) => { if (v === 0) dif.delete(k) }) // remove factions where I'm at my maximum

    const max = getMaxValue(dif)
    dif.forEach((v, k) => { if (v != max.value) dif.delete(k) }) // remove factions that are not my highest priority

    // if there are no valid candidates return undefined
    if (dif.size === 0) return undefined
    let pick = randomMapKey(dif) // pick a random factions from the most desirable ones
    return pick.key
}


console.log(Factions.Lantids)
console.log(Factions.Terrans)
