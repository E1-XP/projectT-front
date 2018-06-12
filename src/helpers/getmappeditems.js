import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

const getMappedItems = entries => {
    const getReadable = item => moment(item.start).format('ddd, Do MMM');
    const getDuration = item => moment.duration(moment(item.stop).diff(item.start)).format('h:mm:ss', { stopTrim: "hh mm ss" });

    const reduceItems = (acc, itm) => {
        if (itm.stop !== undefined) {
            const mapped = {
                start: itm.start,
                stop: itm.stop,
                description: itm.description || '',
                project: itm.project || '',
                billable: itm.billable,
                userId: itm.userId,
                id: itm._id,
                readable: getReadable(itm),
                duration: getDuration(itm)
            };

            const keyStr = `${mapped.project} \n${itm.description || '$empty#'} `;

            if (!acc[mapped.readable]) acc[mapped.readable] = {};
            if (!acc[mapped.readable][keyStr]) acc[mapped.readable][keyStr] = [];

            acc[mapped.readable][keyStr].push(mapped);
        }
        return acc;
    }

    return entries
        .sort((a, b) => b.start - a.start)
        .reduce(reduceItems, {});
}


export default getMappedItems;
