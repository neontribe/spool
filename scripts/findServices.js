const {models} = require('../src/server/database');
const Table = require('cli-table');

models.Region.findAll({
    include: [
        {
            model: models.Service,
            as: 'RegionServiceServices'
        }
    ]
}).then((regions) => {
    const table = new Table({
        head: ['Region', 'Services'],
        colWidths: [20, 80]
    });

    regions.forEach((region) => {
        table.push([region.type, region.RegionServiceServices.map(({type}) => type).join(' ')]);
    });
    console.log(table.toString());
    return process.exit(0);
});
