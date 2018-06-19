const getFilteredMappedItems = (mappedEntries, daysToShowLength) => {

    const sorted = obj => Object.keys(obj)
        .sort((a, b) => {
            const keyA = Object.keys(obj[a])[0];
            const keyB = Object.keys(obj[b])[0];

            return obj[b][keyB][0].start - obj[a][keyA][0].start;
        }).reduce((acc, key) => {
            acc[key] = obj[key];
            return acc;
        }, {});

    if (!daysToShowLength) return sorted(mappedEntries);

    const filtered = {};
    const entriesToKeys = Object.keys(mappedEntries);

    if (entriesToKeys.length === daysToShowLength) return sorted(mappedEntries);

    entriesToKeys.some((key, idx) => {
        filtered[key] = mappedEntries[key];

        return idx === daysToShowLength - 1 ? true : false;
    });

    return sorted(filtered);
}

export default getFilteredMappedItems;