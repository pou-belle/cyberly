//get top 10 data 
window.onload = function() {
  $.ajax({
        url: "https://cyberly.herokuapp.com/api/results/system32topten",
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


    $.createChart = function(obj){

  	var users_count  = '';
  	var filename = '';
	var dataPoints = [{ y: 0, label: "0" }];

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
            filename = this['filename'];

     

            dataPoints.push({
                y : users_count,
                label: filename
            });

            if(dataPoints.length == 10){
            	return false;
            }    
       
        });


   		/* for creating the dataPoint for the Chart {y:1, labe:"blabla"},{....},{....}*/
	  	

	//Create chart pie for Top 10 apps
	var chart = new CanvasJS.Chart("chartContainer", {
		theme: "light2", // "light1", "light2", "dark1", "dark2"
		exportEnabled: true,
		animationEnabled: true,
		title: {
			text: "Top 10 apps "
		},
		data: [{
			type: "pie",
			startAngle: 25,
			toolTipContent: "<b>{label}</b>: {y}",
			showInLegend: "true",
			legendText: "{label}",
			indexLabelFontSize: 16,
			indexLabel: "{label} - {y}",
			dataPoints: dataPoints
		}]
	});
	chart.render();
});
	}

}


 