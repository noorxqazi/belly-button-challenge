function init() {

    // select dropdown menu 
    var selector = d3.select('#selDataset');

    // use D3 library to read in data to drop down
    d3.json("samples.json").then((data) => {
        console.log(data);
        var sampleNames = data.names;

        sampleNames.forEach((sample)=> {
            selector
            .append("option")
            .text(sample)
            .property("value",sample);
        });

        // use the first sample to create plots 
        var firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetaData(firstSample);

    });

    
}

//  initialize dashboard 
init();

function optionChanged(newSample) {

    // get new data for each sample selection 
    buildCharts(newSample);
    buildMetaData(newSample);
}

//  build panel for demographics
function buildMetaData(sample) {
    d3.json("samples.json").then((data) => {

        // filter data
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id==sample);
        var result = resultArray[0];

        // select panel with sample id 
        var PANEL = d3.select("#sample-metadata");

        // clear existing data and populate demopgraphics 
        PANEL.html("");
        Object.entries(result).forEach((key)=> {
            PANEL.append("h6").text(key[0].toLocaleLowerCase()+":"+key[1]+"\n");    
            });
        });
};



////////////////////////////////////////////////
// build charts 

function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
    
        // create variables for arrays 
        var samples = data.samples;
        var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = sampleArray[0];

        var otuids = result.otu_ids;
        var otulabels = result.otu_labels;
        var samplevalues = result.sample_values;
        
        var metadata = data.metadata;
        var metadataArray = metadata.filter(metaObj=>metaObj.id==sample);
        var result2 = metadataArray[0];
        var wfreq = result2.wfreq;   

    
    
        // bar chart 
        var barTrace = {
            x: samplevalues.slice(0,10).reverse(),
            y: otuids.slice(0,10).reverse().map( d => "OTU" + d),
            text: otulabels.slice(0,10).reverse(),
            marker: {color: "pink"},
            type: "bar",
            orientation: "h",
        };

        var barData = [barTrace];

        // create layout 
        var layout = {
            title: "Top 10 OTUs",
        };

        // plot chart with Plotly
        Plotly.newPlot("bar", barData, layout);

        // bubble chart 
        var bubbleTrace = {
            x: result.otu_ids,
            y: result.sample_values,
            mode: "markers",
            text: result.otu_labels,
            marker: {
                color: result.otu_ids,
                size: result.sample_values,
            }
        };

        var bubbleData = [bubbleTrace];
        // create layout 
        var layout2 = {
            showlegend: false,
            title: "OTU IDs",
            height: 600,
            width: 1200
        };
        // plot bubble chart 
        Plotly.newPlot("bubble", bubbleData, layout2);
    
    
        // bonus: guage 
        var guagetrace = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: wfreq,
                title: { text: "Belly Button Washing Frequency (Scrubs per Week)" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: {range: [null,9]},
                    bar: {'color': "darkblue"},
                    steps: [
                        {range: [0,1],color:"#9977B4" },
                        {range: [1,2],color:"#DC87B9" },
                        {range: [2,3],color:"#F497AA" },
                        {range: [3,4],color:"#FBCD79" },
                        {range: [4,5],color:"#FDF68F" },
                        {range: [5,6],color:"#B6D884" },
                        {range: [6,7],color:"#82CCB5" },
                        {range: [7,8],color:"#6CCADE" },
                        {range: [8,9],color:"#70AADD" }
                    ],
                }        
            }]
            // create layout 
        var layout3 = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        
        // plot chart 
        Plotly.newPlot('gauge', guagetrace, layout3);
    
    })

};