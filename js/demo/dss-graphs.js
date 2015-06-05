host = 'js/api/dfsc/';
var chart_details = [];


function service_coupon_status_graph() {
    $.ajax({ 
        type: 'GET', 
        url: 'js/api/dss/process.json', 
        data: { get_param: 'value' }, 
        dataType: 'json',
        success: function (couponTrend, status) { 
                console.log(couponTrend);
                var couponData = couponTrend.legend; 

                $("#graph1-title").text(couponTrend.service_name);

                // var inputDate = new Date(couponTrend.date);
                // var todaysDate = new Date();

                // var inputHours = inputDate.setHours(0,0,0,0); 
                // var todaysHours = todaysDate.setHours(0,0,0,0); //1420569000000

                // var timeDiff = todaysHours - inputHours;

                // if (timeDiff == 0) {
                    
                //     var dispDate = '<span class="bajaj-textColor-black"><strong>Today: </strong></span>';
                //     $("#couponGraphHead").append(dispDate);
                // }
                // else if (timeDiff == 86400000) {
                //     var dispDate = '<span class="bajaj-textColor-black"><strong>Yesterday: </strong></span>';
                //     $("#couponGraphHead").append(dispDate);
                // }

                // else {
               
                //     var dispDate = '<span class="bajaj-textColor-black"><strong>'+couponTrend.date+': </strong></span>';
                //     $("#couponGraphHead").append(dispDate);
                // }

                
                // for(var x=0;x<couponData.details.length;x++) {
                //     var title = couponData.details[x].type;
                //     var count = couponData.details[x].count;
                //     var color = couponData.details[x].color;

                //     var couponGraphHead = '<span class="small text-faded bajaj-textColor-orange" style="color: '+color+' ">'+title+'-</span><span class="small text-faded " style="color: '+color+' "><strong>'+count+'; </strong></span>';

                //     $("#couponGraphHead").append(couponGraphHead);
                // }

                var couponTrend_data = couponTrend.legend.chart_details;
                 
                 Morris.Line({
                      element: 'bajaj-coupon-status-trend',
                      data: couponTrend_data,
                      xkey: 'month',
                      ykeys: ['process', 'manpower', 'tools', 'infra', 'overall'],
                      labels: ['Process', 'Manpower', 'Tools', 'Infrastructure','Overall'],
                      lineColors: ['#1C92C5', '#F39C12', 'red', 'green', 'blue'],
                      parseTime: false,
                      hideHover: 'auto',
                    resize: true,
                    gridTextFamily: ['Open Sans'],
                    gridTextColor: ['#000'],
                    fillOpacity: 0.1,
                    pointSize: 0,
                    smooth: true,
                    lineWidth: 2,
                    grid: true,
                    dateFormat: function(date) {
                        d = new Date(date);
                        return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
                    }
                });
                

            },
        error: function(e){
            console.log(e);
        }
    });

}

//Flot Chart Dynamic Chart

var container = $("#flot-chart-moving-line");

var maximum = container.outerWidth() / 10 || 300;

var data = [];

function getRandomData() {

    if (data.length) {
        data = data.slice(1);
    }

    while (data.length < maximum) {
        var previous = data.length ? data[data.length - 1] : 50;
        var y = previous + Math.random() * 10 - 5;
        data.push(y < 0 ? 0 : y > 100 ? 100 : y);
    }

    // zip the generated y values with the x values

    var res = [];
    for (var i = 0; i < data.length; ++i) {
        res.push([i, data[i]])
    }

    return res;
}

//

series = [{
    data: getRandomData(),
    lines: {
        fill: true,
        fillColor: "rgba(255,255,255,0.4)",
    },
}];

//

var plot = $.plot(container, series, {
    grid: {
        borderWidth: 0,
        minBorderMargin: 10,
        labelMargin: 10,
        backgroundColor: {
            colors: ["rgba(255, 255, 255,0)", "rgba(255, 255, 255,0)"]
        },
        margin: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        },
        markings: function(axes) {
            var markings = [];
            var xaxis = axes.xaxis;
            for (var x = Math.floor(xaxis.min); x < xaxis.max; x += xaxis.tickSize * 2) {
                markings.push({
                    xaxis: {
                        from: x,
                        to: x + xaxis.tickSize
                    },
                    color: "rgba(255, 255, 255, 0)"
                });
            }
            return markings;
        }
    },
    xaxis: {
        tickFormatter: function() {
            return "";
        }
    },
    yaxis: {
        min: 10,
        max: 110,
        show: false
    },
    legend: {
        show: false
    },
    colors: ["#fff"]

});

// Update the random dataset at 25FPS for a smoothly-animating chart

setInterval(function updateRandom() {
    series[0].data = getRandomData();
    plot.setData(series);
    plot.draw();
}, 500);


//Chat Widget SlimScroll Box
$(function() {
    $('.chat-widget').slimScroll({
        start: 'bottom',
        height: '300px',
        alwaysVisible: true,
        disableFadeOut: true,
        touchScrollStep: 50
    });
});

//Moment.js Time Display
var datetime = null,
    date = null;

var update = function() {
    date = moment(new Date())
    datetime.html(date.format('dddd<br>MMMM Do, YYYY<br>h:mm:ss A'));
};

$(document).ready(function() {
    datetime = $('#datetime')
    update();
    setInterval(update, 1000);
});

//Custom jQuery - Changes background on time tile based on the time of day.
$(document).ready(function() {
    datetoday = new Date(); // create new Date()
    timenow = datetoday.getTime(); // grabbing the time it is now
    datetoday.setTime(timenow); // setting the time now to datetoday variable
    hournow = datetoday.getHours(); //the hour it is

    if (hournow >= 18) // if it is after 6pm
        $('div.tile-img').addClass('evening');
    else if (hournow >= 12) // if it is after 12pm
        $('div.tile-img').addClass('afternoon');
    else if (hournow >= 6) // if it is after 6am
        $('div.tile-img').addClass('morning');
    else if (hournow >= 0) // if it is after midnight
        $('div.tile-img').addClass('midnight');
});

//Vector Maps
$(function() {
    $('#map').vectorMap({
        map: 'world_mill_en',
        backgroundColor: 'transparent',
        regionStyle: {
            initial: {
                fill: '#bdc3c7'
            }
        },
        series: {
            regions: [{
                values: visitorData,
                scale: ['#bdc3c7', '#16a085'],
                normalizeFunction: 'polynomial'
            }]
        },
        onRegionLabelShow: function(e, el, code) {
            el.html(el.html() + ' (Total Visits - ' + visitorData[code] + ')');
        }
    });
});

//To-Do List jQuery - Adds a strikethrough on checked items
$('.checklist input:checkbox').change(function() {
    if ($(this).is(':checked'))
        $(this).parent().addClass('selected');
    else
        $(this).parent().removeClass('selected')
});

//Easy Pie Charts
$(function() {
    $('#easy-pie-1, #easy-pie-2, #easy-pie-3, #easy-pie-4').easyPieChart({
        barColor: "rgba(255,255,255,.5)",
        trackColor: "rgba(255,255,255,.5)",
        scaleColor: "rgba(255,255,255,.5)",
        lineWidth: 20,
        animate: 1500,
        size: 175,
        onStep: function(from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
        }
    });

});


