document.addEventListener('DOMContentLoaded', function () {
    // Dummy data generation
    const data = d3.range(1000).map(d3.randomNormal(0, 1));

    // Set the dimensions and margins of the graph
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis
    const x = d3.scaleLinear()
        .domain(d3.extent(data))
        .nice()
        .range([0, width]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Histogram bins
    const histogram = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(40));

    // Compute bins
    const bins = histogram(data);

    // Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    // Append bars
    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.x0))
        .attr("width", d => x(d.x1) - x(d.x0) - 1)
        .attr("y", d => y(d.length))
        .attr("height", d => height - y(d.length))
        .on("mouseover", function () {
            d3.select(this)
                .attr("fill", "orange");
            tooltip.style("opacity", 1);
        })
        .on("mousemove", function (event, d) {
            const tooltip = d3.select("#tooltip");
            tooltip.html(`<strong>Range:</strong> ${d.x0.toFixed(2)} - ${d.x1.toFixed(2)}<br><strong>Frequency:</strong> ${d.length}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 15) + "px");
        })
        .on("mouseout", function () {
            d3.select(this)
                .attr("fill", "steelblue");
            tooltip.style("opacity", 0);
        });

    // Normal distribution curve
    const normal = d3.line()
        .x(d => x(d))
        .y(d => y(d3.normalDensity(d, d3.mean(data), d3.deviation(data))))
        .curve(d3.curveBasis);

    const curveData = d3.range(d3.min(data), d3.max(data), 0.1);
    svg.append("path")
        .datum(curveData)
        .attr("class", "line")
        .attr("d", normal);
});
