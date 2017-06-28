$.getScript("js/xlsx.full.min.js",function(){
	/* set up XMLHttpRequest */
	var url = "upload.xlsx";
	var charts = [];
	var maxY = 0;
	var oReq = new XMLHttpRequest();
	oReq.open("GET", url, true);
	oReq.responseType = "arraybuffer";
	
	oReq.onload = function(e) {
		
  		var arraybuffer = oReq.response;

  		/* convert data to binary string */
  		var data = new Uint8Array(arraybuffer);
  		var arr = new Array();
		for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
  		var bstr = arr.join("");

    	/* Call XLSX */
  		var workbook = XLSX.read(bstr, {type:"binary"});

		/* DO SOMETHING WITH workbook HERE */
		
		// get six sheets
		var worksheet1 = workbook.Sheets['data'];
		var worksheet2 = workbook.Sheets['conversion'];
		var worksheet3 = workbook.Sheets['coefficient'];
		var worksheet4 = workbook.Sheets['power'];
		var worksheet5 = workbook.Sheets['lag'];
		var worksheet6 = workbook.Sheets['plus'];
		
		// get json results
		var data_json_ori = XLSX.utils.sheet_to_json(worksheet1,{raw:true, header:1});
		var conversion_json_ori = XLSX.utils.sheet_to_json(worksheet2,{raw:true});
		var coefficient_json_ori = XLSX.utils.sheet_to_json(worksheet3,{raw:true});
		var power_json_ori = XLSX.utils.sheet_to_json(worksheet4,{raw:true});
		var lag_json_ori = XLSX.utils.sheet_to_json(worksheet5,{raw:true});
		var plus_json_ori = XLSX.utils.sheet_to_json(worksheet6,{raw:true});
		
		
		// get field variable name array
		var variable_arr = [];
		var head_row = data_json_ori[0];
		for(var i = 3; i<Object.keys(head_row).length; i++){
			variable_arr.push(head_row[i]);
		}
		
		// calculation
		var result_ori = 0;
		var result_ouput = 0;
		var media_mix_ori = [];
		var contribution_ori = [];
		var sale_ori = 0;
		var baseline = 0;
		
		var media_mix_ori = calMediaMix(conversion_json_ori, data_json_ori, variable_arr);
		var contribution_ori = calContribution(data_json_ori, coefficient_json_ori, power_json_ori, lag_json_ori, variable_arr);
		var baseline = calBaseline(data_json_ori);
		var sale_ori = calSale(contribution_ori,baseline);
		createTable(media_mix_ori, contribution_ori, variable_arr, sale_ori);
		addInputArea(variable_arr);
		// add a column
		
		var tempchart = drawAColumn("ori", "Original", "", contribution_ori, variable_arr);
		var tempmaxY = tempchart.axisY[0].get("maximum");
		charts.push(tempchart);
		if(tempmaxY > maxY){
			maxY = tempmaxY;
		}
		changeY(charts, maxY);
		
		
		var countGenerate = 0;
		document.getElementById("generate").onclick = function(){
			// check whether the values are set and equals to 100
			
			var input = checkValue(variable_arr);
			if(input){
				countGenerate++;
				//reload original data
				data_json_ori = XLSX.utils.sheet_to_json(worksheet1,{raw:true, header:1});
				var new_data_arr = getNewOriData(data_json_ori, input, media_mix_ori);
				var text="Scenario "+countGenerate;
				var type="s"+ countGenerate;
				var new_contri_arr = calContribution(new_data_arr, coefficient_json_ori, power_json_ori, lag_json_ori, variable_arr);
				var new_sale = calSale(new_contri_arr, baseline);
				addrow(input, new_contri_arr, new_sale, sale_ori, text);
				//reset fields
				document.getElementById("myForm").reset();
				
				var change = new_sale - sale_ori;
				//draw the column
				var tempchart = drawAColumn(type, text, Math.round(change), new_contri_arr, variable_arr);
				var tempmaxY = tempchart.axisY[0].get("maximum");
				charts.push(tempchart);
				if(tempmaxY > maxY){
					maxY = tempmaxY;
				}
				changeY(charts, maxY);
				if(countGenerate > 2){
					document.getElementById("generate").disabled = true;
				}
				
			}else{
				alert("The contributions should sum up to 100! Please try again.");
			}
		};
		
		document.getElementById("optimize").onclick = function(){
			data_json_ori = XLSX.utils.sheet_to_json(worksheet1,{raw:true, header:1});
			var varplus = plus_json_ori[0]["varplus"];
			var budgetplus = plus_json_ori[0]["budgetplus"];
			
			if(varplus && budgetplus && varplus<1 && varplus>0 && budgetplus <1 && budgetplus>0){
				var round = 0;
				var optimize_contri = [];
				var optimize_media_mix = [];
				var optimize_sale = 0;
				var plus_media_mix = [];
				var plus_contri = [];
				var plus_sale = 0;
				do{
					//reload original data
					data_json_ori = XLSX.utils.sheet_to_json(worksheet1,{raw:true, header:1});
					var random_media_mix =  getRandomMediaMix(media_mix_ori, varplus);
					var random_data_arr = getNewOriData(data_json_ori, random_media_mix, media_mix_ori);
					var random_contri_arr = calContribution(random_data_arr, coefficient_json_ori, power_json_ori, lag_json_ori, variable_arr);
					var random_sale = calSale(random_contri_arr, baseline);
					if(random_sale>optimize_sale){
						optimize_contri = random_contri_arr.slice(0);
						optimize_media_mix = random_media_mix.slice(0);
						optimize_sale = random_sale;
					}
					round++;
				}
				while(round<5000);
			
				
				for(var i=0; i<optimize_media_mix.length;i++){
					plus_media_mix.push(optimize_media_mix[i]);
				}
				var plus_data_arr = getNewOriData(data_json_ori, plus_media_mix, media_mix_ori);
				plus_contri = calContribution(plus_data_arr, coefficient_json_ori, power_json_ori, lag_json_ori, variable_arr);
				plus_sale = calSale(plus_contri, baseline);
				
				addrow(optimize_media_mix, optimize_contri, optimize_sale, sale_ori, "Optimize");
				addrow(plus_media_mix, plus_contri, plus_sale, sale_ori, "BudgetPlus");
				var tempchart1 = drawAColumn("op", "Optimize", Math.round(optimize_sale - sale_ori), optimize_contri, variable_arr);				
				charts.push(tempchart1);
				var tempmaxY1 = tempchart1.axisY[0].get("maximum");
				var tempchart2 = drawAColumn("bud", "BudgetPlus", Math.round(plus_sale - sale_ori), plus_contri, variable_arr);
				charts.push(tempchart2);
				var tempmaxY2 = tempchart2.axisY[0].get("maximum");
				if(tempmaxY2>tempmaxY1){
					if(tempmaxY2 > maxY){
						maxY = tempmaxY2;	
					}
				}else{
					if(tempmaxY1 > maxY){
						maxY = tempmaxY1;
					}
				}
				
				changeY(charts, maxY);
				
				
			}else{
				alert("Wrong varplus or budgetplus in source excel file. (0,1)");
			}
		};
	
	};
	
	oReq.send();

});

function calMediaMix(conversion_arr, ori_data_arr, variable_arr){
	var sum = 0; 
	var media_mix_ori = [];

	// i is column
	for(var i = 0; i< variable_arr.length; i++){
		// j is row
		var sub = 0;
		for(var j = 1; j < ori_data_arr.length; j++){
			var conversion = conversion_arr[0][variable_arr[i]];
			var temp = conversion * ori_data_arr[j][i+3];
			sub += temp;
		}
		media_mix_ori.push(sub);
		sum += sub;
	}

	for(var i = 0; i<media_mix_ori.length; i++){
		media_mix_ori[i] = media_mix_ori[i]/sum;
	}
	return media_mix_ori;
	
}

function calContribution(ori_data_arr, coefficient_arr, power_arr, lag_arr, variable_arr){
			// i is column
	var contribution_arr = [];
	for(var i = 0; i<variable_arr.length; i++){
		var sub_contribution = 0;
		for(var j = 1; j<ori_data_arr.length; j++){
			if(j >= (ori_data_arr.length - lag_arr[0][variable_arr[i]])){
					continue;
				}
			var data = ori_data_arr[j][i+3];
			var coefficient = coefficient_arr[0][variable_arr[i]];
			var power = power_arr[0][variable_arr[i]];
			var temp_con = coefficient*Math.pow(data,power);
			sub_contribution += temp_con;
		}
		contribution_arr.push(sub_contribution);
	}
	return contribution_arr;
}

function calBaseline(ori_data_arr){
	var baseline = 0;
	for(var i=1; i<ori_data_arr.length;i++){
		baseline += ori_data_arr[i][1];
	}
	return baseline;
}

function calSale(contribution_arr, baseline){
	var sale = 0;
	for(var i=0; i<contribution_arr.length; i++){
		sale += contribution_arr[i];
	}
	sale += baseline;
	return sale;
}


function createTable(media_mix_arr, contribution_arr, variable_arr, sale_ori){
	var table = document.getElementById("myTable");
	var content = "";
	content += "<thead><tr><th> </th>";
	for(var i = 0; i<variable_arr.length;i++){
		content += "<th>" + variable_arr[i] + "</th>";
	}
	content += "<th>Sales</th></thead>";
	content += "</tr><tr><td>Media Mix</td>";
	for(var i=0; i<media_mix_arr.length; i++){
		content += "<td>" + Number(Math.round(media_mix_arr[i]*100 + 'e1') + 'e-1') + "&#37;</td>";
	}
	content += "<td>Original</td></tr><tr><td>Contribution</td>";
	for(var i = 0; i<contribution_arr.length;i++){
		content += "<td>" + Math.round(contribution_arr[i]) + "</td>";
	}
	content += "<td>" + Math.round(sale_ori) + "</td>";
	content += "</tr>";
	
		
	table.innerHTML = content;
			
}

function addInputArea(variable_arr){
	var table = document.getElementById("myTable");
	var tr = document.getElementsByTagName("tr").length - 4;
	var row = table.insertRow(tr);
	var cell1 = row.insertCell(0);
	cell1.innerHTML = "Adjust Media Mix(&#37;):";
	
	for(var i = 0; i<variable_arr.length; i++){
		var cell = row.insertCell(i+1);
		cell.innerHTML = '<input type = "number" name="' +variable_arr[i]+'" id = "'+variable_arr[i]+'" value=""/>';
	}
	var emptycell = row.insertCell(variable_arr.length + 1);
	emptycell.innerHTML = "";
}

function checkValue(variable_arr){
	var input = [];
	var sum = 0;
	for(var i =0; i< variable_arr.length; i++){
		var temp = document.getElementById(variable_arr[i]);
		if( temp && temp.value){
			input.push(parseFloat(temp.value)/100);
			sum += parseFloat(temp.value);
		}else{
			input.push(0);
		}
		
	}
	if(sum == 100){
		return input;
	}
}

function getNewOriData(ori_data_arr, new_media_mix_arr, old_media_mix_arr){
	var new_data_arr = ori_data_arr;
	for(var i=1; i<new_data_arr.length; i++){
		for(var j=0; j<old_media_mix_arr.length; j++){
			new_data_arr[i][j+3] = new_data_arr[i][j+3]*new_media_mix_arr[j]/old_media_mix_arr[j];
		}
	}
	return new_data_arr;
}

function addrow(media_mix_arr, contribution_arr, sale, sale_ori, text){
	var table = document.getElementById("myTable");
	var tr = document.getElementsByTagName("tr").length - 4;
	var row1 = table.insertRow(tr-1);
	row1.insertCell(0).innerHTML = "Media Mix";
	for(var i=0 ; i<contribution_arr.length; i++){
		var cell = row1.insertCell(i+1);
		cell.innerHTML = Number(Math.round(media_mix_arr[i]*100 + 'e1') + 'e-1') + "&#37;";
	}
	var emptycell = row1.insertCell(contribution_arr.length + 1);
	emptycell.innerHTML = text;
	var row2 = table.insertRow(tr);
	row2.insertCell(0).innerHTML = "Contribution";
	for(var i=0 ; i<contribution_arr.length; i++){
		var cell = row2.insertCell(i+1);
		cell.innerHTML = Math.round(contribution_arr[i]);
	}
	// add sale
	var sign = "";
	var change = Number(Math.round((sale-sale_ori)*100/sale_ori + 'e2') + 'e-2');
	var salecell = row2.insertCell(contribution_arr.length+1);
	if(change>0){
		sign = "+";
		salecell.className = "pos";
	}else if(change<0){
		salecell.className = "neg";
	}
	salecell.innerHTML = Math.round(sale) + "(" + sign + change + "&#37;)";
}

function getRandomMediaMix(media_mix_ori_arr, varplus){
	var random_media_mix = media_mix_ori_arr.slice(0);
	// get a new reasonable media mix
	var last_media = random_media_mix[random_media_mix.length-1];
	var last_media_max = last_media * (1+varplus);
	var last_media_min = last_media * (1-varplus);
	do{
			var sub_sum = 0;
			for(var i=0; i<media_mix_ori_arr.length-1;i++){

				do{
					random_media_mix[i] = random_media_mix[i] * (1 - varplus + 2 * varplus * Math.random());
				}
				while(random_media_mix[i]>1);
				sub_sum += random_media_mix[i];
			}

		//get the last media variable
			random_media_mix[media_mix_ori_arr.length-1] = 1 - sub_sum;
	}
	while(last_media > 1||last_media<0 ||last_media>last_media_max||last_media<last_media_min);
	
	return random_media_mix;
}

function drawAColumn(type, text, change, contribution_arr, variable_arr){
	var up = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 292.362 292.362" style="enable-background:new 0 0 292.362 292.362;" xml:space="preserve"><g><path d="M286.935,197.286L159.028,69.379c-3.613-3.617-7.895-5.424-12.847-5.424s-9.233,1.807-12.85,5.424L5.424,197.286   C1.807,200.9,0,205.184,0,210.132s1.807,9.233,5.424,12.847c3.621,3.617,7.902,5.428,12.85,5.428h255.813   c4.949,0,9.233-1.811,12.848-5.428c3.613-3.613,5.427-7.898,5.427-12.847S290.548,200.9,286.935,197.286z" fill="#D80027"/></g></svg>';
	var down = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 292.362 292.362" style="enable-background:new 0 0 292.362 292.362;" xml:space="preserve"><g><path d="M286.935,69.377c-3.614-3.617-7.898-5.424-12.848-5.424H18.274c-4.952,0-9.233,1.807-12.85,5.424  C1.807,72.998,0,77.279,0,82.228c0,4.948,1.807,9.229,5.424,12.847l127.907,127.907c3.621,3.617,7.902,5.428,12.85,5.428   s9.233-1.811,12.847-5.428L286.935,95.074c3.613-3.617,5.427-7.898,5.427-12.847C292.362,77.279,290.548,72.998,286.935,69.377z" fill="#91DC5A"/></g></svg>';
	var elements=["-text","-sign","-sale","-graph"];
	for(var i=0; i<4;i++){
		elements[i] = type + elements[i];
	}
	document.getElementById(elements[0]).innerHTML = text;
	if(change < 0){
		document.getElementById(elements[1]).innerHTML = down;
	}else if(change > 0){
		document.getElementById(elements[1]).innerHTML = up;
	}else{
		document.getElementById(elements[1]).innerHTML = "";
	}
	document.getElementById(elements[2]).innerHTML = change;
	
	//get data format
	var data = [];
	for(var i=0;i<variable_arr.length; i++){
		var dps = [];
		contribution_arr[i] = Number(Math.round(contribution_arr[i] + 'e0') + 'e-0');
		dps.push({y:contribution_arr[i],label:text});
		data.push({bevelEnabled: false, type:"stackedColumn",name:variable_arr[i], dataPoints:dps});
	}
	var para = {
			axisY:{
				labelFontSize: 0,
		        labelMaxWidth: 0,
		        tickLength: 0,
		        lineThickness: 0,
		        gridThickness: 0
		      },
		    axisX:{
			    labelFontSize: 0,
			    labelMaxWidth: 0,
			    tickLength: 0,
			    lineThickness: 0,
			    gridThickness: 0
			  },
			toolTip: {
			        shared: true,
			        //animationEnabled: true
			  },
			theme: "theme1", 
			dataPointWidth: 80,
			height:300,
			data:data
	};
	var chart = new CanvasJS.Chart(elements[3],para);
	chart.render();
	return chart;
}

function changeY(charts, maxY){
	for(var i=0; i<charts.length; i++){
		charts[i].axisY[0].set("maximum",maxY);
	}
}