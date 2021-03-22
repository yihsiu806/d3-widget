// new Gauge('#gauge-1', {
//     color: '#4783B5'
// })

// new Gauge('#gauge-2', {
//     color: '#ff8a59'
// })

// new Gauge('#gauge-2', {
//     color: '#ffd659'
// })

var mygauge = new Gauge('#gauge-1');
// mygauge.update({
//     minValue: 0,
//     curValue: 300,
//     maxValue: 560,
//     transitionMs: 750,
//     color: '#ffa500'
// });

console.log(mygauge)

// setTimeout(()=> {
//     change()
// }, 2200)


// setTimeout(()=> {
//     change()
// }, 5000)


// setTimeout(()=> {
//     change()
// }, 8200)

// function change() {
//     mygauge.update({
//         minValue: 0,
//         curValue: Math.random() * 560,
//         maxValue: 560,
//         transitionMs: 750,
//         color: '#ffa500'
//     });
//     setTimeout(change, 2200)
// }

// new Gauge('#gauge-2', {
//     color: '#3415b0'
// })

// new Gauge('#gauge-2', {
//     color: '#009e8e'
// })

function Gauge(el) {
    var bgColor = '#ddd';
    var margin = {top: 48, right: 24, bottom: 24, left: 48};

    var arcRadius = 180;

    var width = arcRadius + margin.left + margin.right,
        height = arcRadius + margin.top + margin.bottom;

    var svg = d3.select(el).append('svg')
        .attr('width', width)
        .attr('height', height);

    var gArc = svg.append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

    var startRad = deg2rad(225),
        endRad = deg2rad(495);

    var arc = d3.arc()
        .innerRadius(arcRadius / 2 - 6)
        .outerRadius(arcRadius / 2)
        .startAngle(startRad)
        .cornerRadius(10);

    // background arc
    var background = gArc.append('path')
        .datum({ endAngle: endRad })
        .style('fill', '#D0F09D')
        .attr('d', arc);

    // foreground
    var foreground = gArc.append('path')
        .datum({ endAngle: startRad })
        .style('fill', bgColor)
        .attr('d', arc)

    // unit label
    var gUnitLabel = svg.append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2 + 38})`);
    var unitLabelText = gUnitLabel.append('text')
        .text('Watt')
        .attr('font-family', 'monospace')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .attr('fill', '#325D80')
        .style('text-anchor', 'middle')

    // Current Value
    var currentWidth = 72;
    var currentHeight = 22;
    var gCurrent = svg.append('g')
        .attr('transform', `translate(${width / 2 - currentWidth / 2}, ${arcRadius + 8})`);
    var currentRect = gCurrent.append('rect')
        .attr('width', currentWidth)
        .attr('height', currentHeight)
        .attr('rx', 12)
        .style('fill', '#5AA604');
    var currentText = gCurrent.append('text')
        .attr('transform', `translate(${currentWidth / 2}, ${currentHeight / 2 + 5})`)
        .text('N/A')
        .attr('font-family', 'monospace')
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .attr('fill', '#fff')
        .style('text-anchor', 'middle')

    var textHeight = Math.sqrt(Math.pow((arcRadius / 2), 2) / 2) // a^2 + b^2 = c^2
    var leftshift = (arcRadius / 2) - textHeight;

    // Minimum Value
    var gMinLabel = svg.append('g')
        .attr('transform', `translate(${margin.left - leftshift}, ${margin.top + arcRadius / 2 + textHeight})`);
    var minLabelText = gMinLabel.append('text')
        .text('N/A')
        .attr('font-family', 'monospace')
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .attr('fill', '#b9b9b9')
        .style('text-anchor', 'middle')

    // Maximum Value
    var gMaxLabel = svg.append('g')
        .attr('transform', `translate(${margin.left + arcRadius}, ${margin.top + arcRadius / 2 + textHeight})`);
    var maxLabelText = gMaxLabel.append('text')
        .text('N/A')
        .attr('font-family', 'monospace')
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .attr('fill', '#b9b9b9')
        .style('text-anchor', 'middle')

    // needle
    var needleStart = 135,
        needleEnd = 405,
        needleSize = 3;
    var needle = svg.append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`)
        .append('g')
        .attr('transform', `rotate(${needleStart})`)
    
    // needle.append('line')
    //     .attr('x1', 0)
    //     .attr('y1', 0)
    //     .attr('x2', arcRadius / 2 + 15)
    //     .attr('y2', -3)
    //     .style('stroke', '#000')
    //     .style('stroke-width', needleSize)

    // var coloredNeedle = needle.append('line')
    //     .attr('x1', 0)
    //     .attr('y1', 0)
    //     .attr('x2', arcRadius / 2 + 15)
    //     .attr('y2', 0)
    //     .style('stroke', '#AFBABE')
    //     .style('stroke-width', needleSize)

    var coloredNeedle = needle.append('rect')
        .attr('x', -needleSize / 2)
        .attr('y', -needleSize / 2)
        .attr('width', arcRadius / 2 + 20)
        .attr('height', needleSize)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .style('fill', '#325D80')

    // center
    var centerSize = 3;
    var center = svg.append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`)
        .append('circle')
        .attr('r', centerSize)
        .style('fill', '#fff')
        .style('stroke', '#325D80')
        .style('stroke-width', 2)


    this.update = function(config) {
        var arcScale = d3.scaleLinear()
            .domain([config.minValue, config.maxValue])
            .range([startRad, endRad])
        
        foreground.transition()
            .duration(config.transitionMs)
            .styleTween('fill', function() {
                return d3.interpolate(bgColor, config.color);
            })
            .call(arcTween, arcScale(config.curValue))

        var needleScale = d3.scaleLinear()
            .domain([config.minValue, config.maxValue])
            .range([needleStart, needleEnd])

        needle.transition()
            .duration(config.transitionMs)
            .ease(d3.easeCubic)
            .attr('transform', `rotate(${needleScale(config.curValue)})`)
        coloredNeedle.transition()
            .duration(config.transitionMs)
            .style('stroke', config.color)
        minLabelText.transition()
            .duration(config.transitionMs)
            .text(config.minValue)
        currentText.transition()
            .duration(config.transitionMs)
            .text(config.curValue)
        maxLabelText.transition()
            .duration(config.transitionMs)
            .text(config.maxValue)

    }

    function arcTween(transition, newAngle) {
        transition.attrTween('d', function(d) {
            var interpolate = d3.interpolate(d.endAngle, newAngle);
            return function(t) {
                d.endAngle = interpolate(t);
                return arc(d);
            }
        })
    }
}


function deg2rad(deg) {
    return deg * Math.PI / 180;
}