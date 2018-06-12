const getFilteredMappedItems = (mappedEntries, daysToShowLength) => {
    const filtered = {};

    if (!daysToShowLength) return mappedEntries;

    Object.keys(mappedEntries).some((key, idx) => {
        filtered[key] = mappedEntries[key];

        return idx === daysToShowLength ? true : false;
    });

    return filtered;
}

export default getFilteredMappedItems;