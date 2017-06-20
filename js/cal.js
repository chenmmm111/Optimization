$.getScript("js/xlsx.full.min.js",function(){
	/* set up XMLHttpRequest */
	var url = "upload.xlsx";
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
		//var contribution_ori_per = calContriPer(contribution_ori, sale_ori, baseline);
								console.log(data_json_ori);
		document.getElementById("generate").onclick = function(){
			// check whether the values are set and equals to 100
			var input = checkValue(variable_arr);
			if(input){
				//reload original data
				data_json_ori = XLSX.utils.sheet_to_json(worksheet1,{raw:true, header:1});
				var new_data_arr = getNewOriData(data_json_ori, input, media_mix_ori);
				console.log(data_json_ori);
				var new_contri_arr = calContribution(new_data_arr, coefficient_json_ori, power_json_ori, lag_json_ori, variable_arr);
				var new_sale = calSale(new_contri_arr, baseline);
				addrow(input, new_contri_arr, new_sale, sale_ori);
				//reset fields
				document.getElementById("myForm").reset();
				
				
				
			}else{
				alert("The contributions should sum up to 100! Please try again.");
			}
		}
	
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
	content += "<tr><td>Impact</td>";
	for(var i = 0; i<variable_arr.length;i++){
		content += "<td>" + variable_arr[i] + "</td>";
	}
	content += "<td>Sales</td>";
	content += "</tr><tr><td>Media Mix</td>";
	for(var i=0; i<media_mix_arr.length; i++){
		content += "<td>" + Number(Math.round(media_mix_arr[i]*100 + 'e1') + 'e-1') + "&#37;</td>";
	}
	content += "</tr><tr><td>Contribution</td>";
	for(var i = 0; i<contribution_arr.length;i++){
		content += "<td>" + Math.round(contribution_arr[i]) + "</td>";
	}
	content += "<td>" + Math.round(sale_ori) + "</td>";
	content += "</tr>";
	
		
	table.innerHTML = content;
			
}

function addInputArea(variable_arr){
	var table = document.getElementById("myTable");
	var tr = document.getElementsByTagName("tr").length;
	var row = table.insertRow(tr);
	var cell1 = row.insertCell(0);
	cell1.innerHTML = "Adjust Media Mix(&#37;):";
	
	for(var i = 0; i<variable_arr.length; i++){
		var cell = row.insertCell(i+1);
		cell.innerHTML = '<input type = "number" name="' +variable_arr[i]+'" id = "'+variable_arr[i]+'" value=""/>';
	}
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

function addrow(media_mix_arr, contribution_arr, sale, sale_ori){
	var table = document.getElementById("myTable");
	var tr = document.getElementsByTagName("tr").length;
	var row1 = table.insertRow(tr-1);
	row1.insertCell(0).innerHTML = "Media Mix";
	for(var i=0 ; i<contribution_arr.length; i++){
		var cell = row1.insertCell(i+1);
		cell.innerHTML = Number(Math.round(media_mix_arr[i]*100 + 'e1') + 'e-1') + "&#37;";
	}
	
	var row2 = table.insertRow(tr);
	row2.insertCell(0).innerHTML = "Contribution";
	for(var i=0 ; i<contribution_arr.length; i++){
		var cell = row2.insertCell(i+1);
		cell.innerHTML = Math.round(contribution_arr[i]);
	}
	// add sale
	var sign = "";
	var change = Number(Math.round((sale-sale_ori)*100/sale_ori + 'e2') + 'e-2');
	if(change>0){
		sign = "+";
	}
	row2.insertCell(contribution_arr.length+1).innerHTML = Math.round(sale) + "(" + sign + change + "&#37;)";
}


//function calContriPer(contribution_arr, sale, baseline){
//	var contri_per_arr = [];
//	var sum = sale-baseline;
//	for(var i=0; i<contribution_arr.length; i++){
//		contri_per_arr.push(contribution_arr[i]*100/sum);
//	}
//	return contri_per_arr;
//}