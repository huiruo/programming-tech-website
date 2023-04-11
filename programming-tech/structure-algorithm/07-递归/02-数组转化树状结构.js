function getTree(data) {
    var newData = [],
        hash = {};
    for (var i = 0; i < data.length; i++) {
        if (!hash[data[i].province]) {
            hash[data[i].province] = {
                'province': data[i].province
            };
            hash[data[i].province]['city'] = [{
                'name': data[i].city,
                'code': data[i].code
            }]
            newData.push(hash[data[i].province]);
        } else if (hash[data[i].province].province == data[i].province) {
            hash[data[i].province]['city'].push({
                'name': data[i].city,
                'code': data[i].code
            })
        }
    }
    return newData;
}

var data = [{
    'province': '浙江',
    'city': '温州',
    'code': '10010'
}, {
    'province': '浙江',
    'city': '杭州',
    'code': '10011'
}, {
    'province': '安徽',
    'city': '合肥',
    'code': '10012'
}, {
    'province': '安徽',
    'city': '马鞍山',
    'code': '10013'
}, {
    'province': '浙江',
    'city': '宁波',
    'code': '10014'
}];

console.log(getTree(data));
