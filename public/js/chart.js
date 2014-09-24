var height = 350
var goldDifference = ['Gold']
var xpDifference = ['XP']
for(var i = 0; i < match.parsed_data.times.length; i++) {
    var goldtotal = 0
    var xptotal = 0
    match.parsed_data.players.forEach(function(elem, j) {
        if(j < 5) {
            goldtotal += elem.gold[i]
            xptotal += elem.xp[i]
        } else {
            xptotal -= elem.xp[i]
            goldtotal -= elem.gold[i]
        }
    })
    goldDifference.push(goldtotal)
    xpDifference.push(xptotal)
}
var time = ["time"].concat(match.parsed_data.times)
var lh = [time]
var gold = [time]
var xp = [time]
var groups = [
    []
]
match.parsed_data.players.forEach(function(elem, i) {
    var hero = constants.heroes[match.players[i].hero_id].localized_name
    groups[0].push(hero)
    elem.lh = [hero].concat(elem.lh)
    lh.push(elem.lh)
    elem.gold = [hero].concat(elem.gold)
    gold.push(elem.gold)
    elem.xp = [hero].concat(elem.xp)
    xp.push(elem.xp)  
})
c3.generate({
    bindto: "#chart-diff",
    size: {
        height: height
    },
    data: {
        x: 'time',
        columns: [time, goldDifference, xpDifference],
        type: "area-spline"
    },
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                format: function(x) {
                    return moment().startOf('day').seconds(x).format("H:mm")
                }
            },
            label: 'Game Time (minutes)'
        },
        y: {
            label: 'Radiant Advantage'
        }
    }
})
c3.generate({
    bindto: "#chart-lh",
    size: {
        height: height
    },
    data: {
        x: 'time',
        columns: lh,
        type: "area-spline",
        groups: groups,
        order: null
    },
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                format: function(x) {
                    return moment().startOf('day').seconds(x).format("H:mm")
                }
            },
        },
        y: {
            label: 'Last Hits'
        }
    }
})
c3.generate({
    bindto: "#chart-gold",
    size: {
        height: height
    },
    data: {
        x: 'time',
        columns: gold,
        type: "area-spline",
        groups: groups,
        order: null
    },
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                format: function(x) {
                    return moment().startOf('day').seconds(x).format("H:mm")
                }
            },
        },
        y: {
            label: 'Gold'
        }
    }
})
c3.generate({
    bindto: "#chart-xp",
    size: {
        height: height
    },
    data: {
        x: 'time',
        columns: xp,
        type: "area-spline",
        groups: groups,
        order: null

    },
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                format: function(x) {
                    return moment().startOf('day').seconds(x).format("H:mm")
                }
            },
        },
        y: {
            label: 'XP'
        }
    }
})