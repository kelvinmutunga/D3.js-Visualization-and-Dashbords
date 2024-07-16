document.addEventListener('DOMContentLoaded', function () {
    // Dummy data
    const data = [
        { category: "A", value: 30 },
        { category: "B", value: 50 },
        { category: "C", value: 100 },
        { category: "D", value: 70 },
        { category: "E", value: 40 }
    ];

    // Set dimensions
    const width = 600;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    // Append the svg object to the div
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    // Generate the pie
    const pie = d3.pie()
        .value(d => d.value);

    // Generate the arcs
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    // Generate the pie chart
    const arcs = svg.selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");

    // Add the actual arcs
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => d3.schemeCategory10[i])
        .on("mouseover", function () {
            d3.select(this)
                .attr("fill", "orange");
        })
        .on("mouseout", function (event, d) {
            d3.select(this)
                .attr("fill", (d, i) => d3.schemeCategory10[i]);
        });

    // Add labels
    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .text(d => d.data.category);
});
