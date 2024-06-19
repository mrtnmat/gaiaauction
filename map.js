function randInt(min, max) {
    if (!(Number.isInteger(min) && Number.isInteger(max))) throw new Error('Argument exception')
    if (min > max) throw new Error('Argument exception')

    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getMaxValue(map) {
    let maxValue = -Infinity;
    let maxKey = null;

    map.forEach((value, key) => {
        if (value > maxValue) {
            maxValue = value;
            maxKey = key;
        }
    });

    return {
        key: maxKey,
        value: maxValue,
    };
}

function randomMapKey(map) {
    // Convert Map keys to an array
    let keysArray = Array.from(map.keys());

    // Generate a random index
    let randomIndex = randInt(0, keysArray.length - 1);

    // Return the random key
    return {
        key: keysArray[randomIndex],
        value: map.get(keysArray[randomIndex]),
    }
}
