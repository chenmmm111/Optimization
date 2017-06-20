$.getScript("js/xlsx.full.min.js",function(){
	
	// calculation counts
	
	var count = 1;
	if(vcount >0){
		count = 2;
	}

//	
//	if(type == "origin"){
//		count = 1;
//	}else if(type = "adjustment"){
//		count = 2;
//	}else if(type = "optimize"){
//		count = 101;
//	}
	
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

		// get four sheets
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
		var data_json_cal = [];
		var media_mix_ori = [];
		var contribution_ori = [];
		var contribution_cal = [];
		var sale_ori = 0;
		var sale_cal = 0;
		var baseline = 0;
		
		
		
		for(var c = 0; c<count; c++){
			//column
			var mediamixtotal = 0;
			contribution_cal =[];
			data_json_cal = [];
			baseline = 0;
			sale_cal = 0;
			if(c==0){
				data_json_cal = data_json_ori.slice(0);
			}else if(sum != 100){
						alert("The sum of percentages is not 100. Please check check and retype them.");
				}else{
				for(var i=0; i<data_json_ori.length;i++){
					
					var temp = [];
					
					for(var k = 0; k<3;k++){
						temp.push(data_json_ori[i][k]);
					}
					for(var j=0; j<variable_arr.length;j++){
						if(i==0){
							temp.push(data_json_ori[i][j+3]);
						}else{
							temp.push(paras[j]*data_json_ori[i][j+3]/media_mix_ori[j]);
						}
						
						//data_json_cal[i][j+3] = paras[j]*data_json_ori[i][j+3]/contribution_ori[j];
					}
					
					data_json_cal.push(temp);
				}
			}
			
			
			console.log(data_json_cal);
			console.log(paras);
			console.log(media_mix_ori);
			// i is column
			for(var i = 0; i<=variable_arr.length; i++){
				var sub_contribution = 0;
				var sub_total = 0;
				// j is row

				for(var j = 1; j<data_json_cal.length;j++){
					if(i == variable_arr.length){
						//calculate baseline
						baseline += data_json_cal[j][1];
					}else{
						if(c == 0){
							var conversion = conversion_json_ori[0][variable_arr[i]];
							var temp = conversion * data_json_cal[j][i+3];
							sub_total += temp;
						}
						if(j >= (data_json_cal.length - lag_json_ori[0][variable_arr[i]])){
							continue;
						}
						var data = data_json_cal[j][i+3];
						var coefficient = coefficient_json_ori[0][variable_arr[i]];
						var power = power_json_ori[0][variable_arr[i]];
						var temp_con = coefficient*Math.pow(data,power);
						sub_contribution += temp_con;
						
					}
				}
				if(c == 0 && i != variable_arr.length){
					contribution_ori.push(sub_contribution);
					sale_ori += sub_contribution;
					media_mix_ori.push(sub_total);
					mediamixtotal += sub_total;
				}else{
					if(i!=variable_arr.length){
						contribution_cal.push(sub_contribution);
						sale_cal += sub_contribution;
					}
					
				}

				
			}
			
			
			// get sales
			if(c == 0){
					sale_ori += baseline;
					for(var k = 0; k < media_mix_ori.length; k++){
						media_mix_ori[k] = media_mix_ori[k]*100/mediamixtotal;
					}
				}else{
					sale_cal += baseline;
				}


		}

		
		// draw table
		
		var table = document.getElementById("myTable");
		var content = "";
		if(c == 1){
			// initialize table content
			content += "<tr><td>Impact</td>";
			for(var i = 0; i<variable_arr.length;i++){
				content += "<td>" + variable_arr[i] + "</td>";
			}
			content += "<td>Sales</td>";
			content += "</tr><tr><td>Media Mix</td>";
			for(var i=0; i<media_mix_ori.length; i++){
				content += "<td>" + Number(Math.round(media_mix_ori[i] + 'e1') + 'e-1') + "&#37;</td>";
			}
			content += "</tr><tr><td>Contribution</td>";
			for(var i = 0; i<contribution_ori.length;i++){
				content += "<td>" + Math.round(contribution_ori[i]) + "</td>";
			}
			content += "<td>" + Math.round(sale_ori) + "</td>";
			content += "</tr>";
			
			rowinfo = content.slice();
		}else{
			content += rowinfo;
			if(sum == 100){
				content += "<tr><td>Media Mix</td>";
				for(var i=0; i<paras.length;i++){
					content += "<td>" + Number(Math.round(paras[i] + 'e1') + 'e-1') + "&#37;</td>";
				}
				content += "</tr><tr><td>Contribution</td>";
				for(var i = 0; i<contribution_cal.length;i++){
					content += "<td>" + Math.round(contribution_cal[i]) + "</td>";
				}
				var change = Number(Math.round((sale_cal-sale_ori)*100/sale_ori + 'e2') + 'e-2');
				var sign = "+";
				if(change<0){
					sign ="-";
				}
				content += "<td>" + Math.round(sale_cal) +"("+sign+change+"&#37;)"+ "</td>";
				content += "</tr>";

				rowinfo = content.slice();
			}
			
		}
		

		// add input fields
		content += "<tr>";
		content += "<td>Adjust Media Mix(&#37;):</td>";
		for(var i=0; i<variable_arr.length; i++){
			content += '<td><input type = "number" name=' +variable_arr[i]+' id = '+variable_arr[j]+' value=""/></td>'; 
		}
		content += "</tr>";
		
		
		
		
		table.innerHTML = content;
		document.getElementById("rowinfo").value =rowinfo;
		
	}

	oReq.send();
});