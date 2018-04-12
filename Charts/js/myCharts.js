$(document).ready(function() { //start jquery
    //get the user id from the url
    var userId = $.urlParam('id');
    var jsonRes = '';

    //send the id to the server and ask for the data/json
    $.ajax({
        url: "https://cyberly.herokuapp.com/api/results/system32/"+userId,
        method: "GET",
        dataType: "json",
        success: function(res) {
            jsonRes = res;
            console.log("jsonRes: "+jsonRes);
        },
        error: function(err) {
          console.log(err); 
        }
    })
    .done(function() {
        var obj = $.parseJSON(JSON.stringify(jsonRes)); //json that has been parsed 
        $.createChart(obj);
    });
 
    $.ajax({
        url: "https://cyberly.herokuapp.com/api/results/programfiles/"+userId,
        method: "GET",
        dataType: "json",
        success: function(res) {
            jsonRes = res;
            console.log(jsonRes);
        },
        error: function(err) {
          console.log(err); 
        }
    })
    .done(function() {
        var obj = $.parseJSON(JSON.stringify(jsonRes)); //json that has been parsed 
        $.createChart(obj);
    });


    $.ajax({
        url: "https://cyberly.herokuapp.com/api/results/programfiles86/"+userId,
        method: "GET",
        dataType: "json",
        success: function(res) {
            jsonRes = res;
            console.log(jsonRes);
        },
        error: function(err) {
          console.log(err); 
        }
    })
    .done(function() {
        var obj = $.parseJSON(JSON.stringify(jsonRes)); //json that has been parsed 
        $.createChart(obj);
    });
});

$.urlParam = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
}

//Create pie chart for comparing one user with the others
$.createChart = function(obj) {

    var users_count = 0;
    var files_count = 0;

    var data = [];
    var labels = [];
    var results = '';
    var name = '';
    var id = '';
    console.log(obj);

    $.each(obj['scan_results'], function() {
        name = this['name'];
        results = this['results'];
        id = this['id'];

        console.log(name);
        console.log (results);
        console.log("id: "+id);

        var dataPoints = [{
            y : 0,
            label: "0"
        }];

        $.each(results, function() {
            users_count = this['users_count'];
            files_count = this['files_count'];

            console.log(users_count);
            console.log (files_count);

            dataPoints.push({
                y : files_count,
                label: users_count
            });    
            console.log ("dataPoints: "+users_count);        
        });

        
        var chart = new CanvasJS.Chart(id, {
            animationEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title:{  text: "Results compared with other users in  " + name},
            axisY: { title: "Files"  },
            data: [{        
                type: "column",  
                showInLegend: true, 
                legendMarkerColor: "grey",
                legendText: "Users",
                dataPoints: dataPoints
             }]
        });
        chart.render();
    });
};
                    
                  