
function generateRandomData(max) {
    var data = [];

    var  ts = Math.ceil(new Date().getTime()/1000);

    for (var i = 0; i < 10; i++) {
        ts = ts + Math.ceil(Math.random() * 5);
        data.push([ts, Math.floor(Math.random() * max) + 10]);
    }

    return data;
}

var dataset = [generateRandomData(30), generateRandomData(20), generateRandomData(10)];


new LineChart('#chart', { 
    dataset: dataset,
    color: ['#4783B5', '#ff8a59', '#ffd659']
});

function LineChart(ele, param) {
    var margin = {top: 24, right: 24, bottom: 24, left: 24};

    var width = 768 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var svg = d3.select(ele).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    var start = new Date(findLimit('min', param.dataset, 0) * 1000);    
    var end = new Date(findLimit('max', param.dataset, 0) * 1000)
    var xScale = d3.scaleTime()
        .domain([start, end]).nice()
        .range([0, width]);

    console.log(findLimit('min', param.dataset, 1))
    console.log(findLimit('max', param.dataset, 1))

    var yScale = d3.scaleLinear()
        .domain([findLimit('min', param.dataset, 1), findLimit('max', param.dataset, 1)]).nice()
        .range([height, 0]);

    var dataLength = param.dataset.reduce((pv,cv) => {
        return pv == -1 ? cv.length : Math.max(pv, cv.length)
    }, -1);

    // Add x axis    
    var xAxis = d3.axisBottom(xScale)
        .ticks(dataLength)
        .tickFormat((d,i) => i%2==1?d.getHours()+':'+('00' + d.getMinutes()).slice(-2):null)

    svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top + height})`)
        .call(xAxis)

    // Add y axis
    var yAxis = d3.axisLeft(yScale)
        .ticks(dataLength/2)

    svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .call(yAxis)
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick:not(:first-of-type) line')
            .attr('x2', `${width}`)
            .attr('stroke', '#aaa')
            .attr('stroke-dasharray', '2,2'))

    var line = d3.line()
        .x((d) => {return xScale(new Date(d[0] * 1000))})
        .y((d) => {return yScale(d[1])})
        .curve(d3.curveMonotoneX)

    param.dataset.forEach((data, index) => {
        var gLine = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        gLine.append('path')
            .datum(data)
            .attr('d', line)
            .style('fill', 'none')
            .style('stroke', param.color[index])
            .style('stroke-width', '3')
            .style('opacity', .5)
    
        gLine.selectAll('.dot')
            .data(data)
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('cx', (d) => {return xScale(new Date(d[0] * 1000))})
            .attr('cy', (d) => {return yScale(d[1])})
            .attr('r', 3)
            .style('fill', '#fff')
            .style('stroke', param.color[index])
            .style('stroke-width', '3')
    });
}

function findLimit(type, dataset, index) {
    var func;
    type == 'min' ? func = Math.min : func = Math.max;
    return dataset.reduce((pv,cv) => {
        var currentLimit = cv.reduce((pv, cv) => {
            return pv == -1 ? cv[index] : func(pv,cv[index]);
        }, -1);
        return pv == -1 ? currentLimit : func(pv, currentLimit);
    }, -1);
}

// var xScale = d3.scaleTime()
//     // .domain(d3.extent(data, d => {new Date(d.timestamp * 1000)})).nice()
//     .domain([new Date(1565939803*1000), new Date(1565939888*1000)])
//     .range([0, width]);
  
// var yScale = d3.scaleLinear()
//     .domain([d3.max(data, d => d.watts), 0]).nice()
//     .range([0, height]);

// Add axis
// var xAxis = d3.axisBottom(xScale).ticks(15)//.ticks(d3.timeSecond.every(2)).tickFormat(d => new Date(d).getMinutes() + ':' + d.getSeconds());
// svg.append('g')
//     .attr('class', 'axis x-axis')
//     .attr('transform', `translate(${margin.left + gap}, ${margin.top + height + gap})`)
//     .call(xAxis)

// Add yaxis
// var yAxis = d3.axisLeft(yScale);
// svg.append('g')
//     .attr('class', 'axis y-axis')
//     .attr('transform', `translate(${margin.left}, ${margin.top})`)
//     .call(yAxis)